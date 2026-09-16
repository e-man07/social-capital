import "../lib/env";
import { ToolLoopAgent, tool, Output, isStepCount } from "ai";
import { luna, providerOptions, compact as compactContext, reportUsage } from "../lib/llm";
import { z } from "zod";
import { LAUNCHES, DATA_DIR } from "../config";
import { search, quotesOf, userInfo, type XTweet } from "../sources/x";
import { webPage } from "../sources/web";
import { linkedinPost } from "../sources/linkedin";
import { readJson, writeJson } from "../lib/http";
import type { Collected } from "../collect";
import { existsSync } from "node:fs";

// Research Agent: extends the deterministic collection with exploratory work a fixed script can't do —
// alternative phrasings for launch-day posts, identifying who the earliest quoters are, following
// second-wave narratives, and checking press for embedded handles. Every X search result it sees is
// recorded as evidence (side effect), so its exploration enriches the graph without trusting its prose.


export type ResearchOutput = {
  launch: string;
  extraSearchHits: XTweet[];
  extraQuoteExpansions: Record<string, XTweet[]>;
  accountNotes: { handle: string; note: string; likelyRole: "founder" | "sc_staff" | "client_staff" | "large_creator" | "mid_creator" | "press" | "unknown" }[];
  narratives: { label: string; exampleTweetIds: string[]; firstSeenMinutes: number }[];
  notes: string[];
};

const output = Output.object({
  schema: z.object({
    accountNotes: z.array(z.object({ handle: z.string(), note: z.string(), likelyRole: z.enum(["founder", "sc_staff", "client_staff", "large_creator", "mid_creator", "press", "unknown"]) })),
    narratives: z.array(z.object({ label: z.string(), exampleTweetIds: z.array(z.string()), firstSeenMinutes: z.number() })),
    notes: z.array(z.string()),
  }),
});

export async function runResearchAgent(slug: string) {
  const l = LAUNCHES.find((x) => x.slug === slug)!;
  const c = readJson<Collected>(`${DATA_DIR}/launches/${slug}.json`);
  const anchorMs = new Date(c.anchor.createdAt).getTime();
  const minutesAfter = (t: XTweet) => Math.round((new Date(t.createdAt).getTime() - anchorMs) / 60000);
  const extraSearchHits = new Map<string, XTweet>();
  const extraQuoteExpansions: Record<string, XTweet[]> = {};
  const compact = (t: XTweet) => ({ id: t.id, handle: t.author.userName, followers: t.author.followers, minutesAfterAnchor: minutesAfter(t), views: t.viewCount, quotesAnchor: t.quoted_tweet?.id === c.anchor.id, text: t.text.slice(0, 120) });

  const agent = new ToolLoopAgent({
    model: luna(),
    providerOptions: providerOptions(`research:${slug}`),
    prepareStep: compactContext,
    instructions: `You are reconstructing how a product launch propagated on X and LinkedIn using only public data.
Launch: ${l.client} (${l.category}). Anchor post by @${c.anchor.author} (${c.anchor.authorFollowers} followers) at ${c.anchor.createdAt}, ${c.anchor.views} views, ${c.anchor.quotes} quotes.
Anchor text: ${c.anchor.text.slice(0, 300)}
A deterministic collector already gathered ${c.gen1.length} quote tweets and ${c.searchHits.length} launch-window search hits. Your job is to find what it missed and characterise who the early amplifiers are.
Rules: describe sequences and associations, never causation. Never assert that an account was paid. Do not use em dashes in your writing. Use tools; do not invent tweet IDs. Stop when marginal searches return nothing new. Use at most 16 tool calls. Older tool results are dropped from your context as you go — restate anything you still need in your own words.`,
    tools: {
      x_search: tool({
        description: "X advanced search (operators: since:, until:, from:, min_faves:, -filter:replies, quoted_tweet_id:). Results are automatically recorded as evidence.",
        inputSchema: z.object({ query: z.string(), maxPages: z.number().int().min(1).max(3).default(1) }),
        execute: async ({ query, maxPages }) => { const r = await search(query, maxPages); for (const t of r) extraSearchHits.set(t.id, t); return r.map(compact); },
      }),
      x_quotes: tool({
        description: "Quote tweets of a tweet id (for expanding a second-generation node). Recorded as evidence.",
        inputSchema: z.object({ tweetId: z.string() }),
        execute: async ({ tweetId }) => { const r = await quotesOf(tweetId, 3); extraQuoteExpansions[tweetId] = r; return r.map(compact); },
      }),
      x_user: tool({
        description: "Public profile of an X account (bio, followers, creation date) — use to characterise early quoters.",
        inputSchema: z.object({ userName: z.string() }),
        execute: async ({ userName }) => { const u = await userInfo(userName); return u ? { userName: u.userName, name: u.name, followers: u.followers, bio: u.description ?? "", createdAt: u.createdAt } : { error: "not found" }; },
      }),
      web_fetch: tool({ description: "Fetch a public web page (press, blog) and get title, publish time, excerpt, embedded X handles.", inputSchema: z.object({ url: z.string().url() }), execute: async ({ url }) => webPage(url) }),
      linkedin_post: tool({ description: "Public LinkedIn post: reactions, comments, ID-decoded timestamp.", inputSchema: z.object({ url: z.string().url() }), execute: async ({ url }) => linkedinPost(url) }),
      earliest_quoters: tool({ description: "The first N quote tweets of the anchor already collected, in time order.", inputSchema: z.object({ n: z.number().int().min(5).max(60).default(25) }), execute: async ({ n }) => [...c.gen1].sort((a, b) => minutesAfter(a) - minutesAfter(b)).slice(0, n).map(compact) }),
      top_quotes_by_views: tool({ description: "Top N collected quote tweets by views.", inputSchema: z.object({ n: z.number().int().min(5).max(60).default(20) }), execute: async ({ n }) => [...c.gen1].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)).slice(0, n).map(compact) }),
    },
    stopWhen: isStepCount(20),
    output,
  });

  const { output: out, steps } = await agent.generate({
    prompt: `1) Look at the earliest 25 quoters and the top 20 by views; use x_user to characterise up to 6 accounts whose role is unclear (staff of Social Capital or the client, large creator, press).
2) Find launch-window posts the collector's query missed: try 2 alternative phrasings (product nickname, founder name, the hook of the anchor text) with since/until around ${c.anchor.createdAt.slice(0, 10)} and min_faves:100.
3) Identify distinct narratives in the amplification (e.g. product endorsement vs founder backstory vs critique) with example tweet ids and when each first appeared.
4) Expand quotes for up to 2 high-view second-wave posts that were not quoting the anchor.
Return account notes, narratives and concise notes on what you found and could not find.`,
  });

  reportUsage(`research:${slug}`, steps);
  const result: ResearchOutput = { launch: slug, extraSearchHits: [...extraSearchHits.values()], extraQuoteExpansions, ...out };
  writeJson(`${DATA_DIR}/agent/${slug}.research.json`, result);
  console.log(`[${slug}] research agent: +${result.extraSearchHits.length} search hits, ${Object.keys(extraQuoteExpansions).length} expansions, ${out.accountNotes.length} account notes, ${out.narratives.length} narratives`);
  return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.env.OPENAI_API_KEY) { console.error("OPENAI_API_KEY not set — research agent is dormant. Deterministic collection still runs via harness/collect.ts."); process.exit(2); }
  const only = process.argv.slice(2);
  (async () => { for (const l of LAUNCHES) if ((!only.length || only.includes(l.slug)) && existsSync(`${DATA_DIR}/launches/${l.slug}.json`)) await runResearchAgent(l.slug); })();
}
