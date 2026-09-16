import "./lib/env";
import { LAUNCHES, GEN2_TOP_N, SEARCH_MAX_PAGES, DATA_DIR, type Launch } from "./config";
import { anchorMetrics, quotesOf, repliesTo, search, type XTweet } from "./sources/x";
import { linkedinPost } from "./sources/linkedin";
import { webPage } from "./sources/web";
import { writeJson } from "./lib/http";
import { existsSync } from "node:fs";

// Deterministic collection plan. The Research Agent (agents/research-agent.ts) can later extend this
// with exploratory expansions; everything here is reproducible and cached.
export type Collected = {
  launch: Launch;
  collectedAt: string;
  anchor: Awaited<ReturnType<typeof anchorMetrics>>;
  gen1: XTweet[];
  gen2: Record<string, XTweet[]>;         // parent gen-1 quote id -> its quotes
  searchHits: XTweet[];                   // launch-window posts matching the product query (quoting or not)
  founderFollowups: XTweet[];             // founder's own posts in the 14 days after the anchor
  replies: XTweet[];                      // first pages of replies to the anchor (sample, not exhaustive)
  linkedin: Awaited<ReturnType<typeof linkedinPost>> | null;
  press: Awaited<ReturnType<typeof webPage>>[];
  coverage: { gen1Returned: number; gen1LiveCounter: number; gen1Recall: number };
};

async function collectLaunch(l: Launch): Promise<Collected> {
  const t0 = Date.now();
  const anchor = await anchorMetrics(l.xAnchorId);
  const gen1 = await quotesOf(l.xAnchorId);
  const gen1Recall = anchor.quotes ? gen1.length / anchor.quotes : 0;

  // Only expand gen-1 quotes that X says were themselves quoted (quoteCount > 0) — saves calls.
  const gen2: Record<string, XTweet[]> = {};
  const expandable = [...gen1].filter((q) => (q.quoteCount ?? 0) > 0).sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)).slice(0, GEN2_TOP_N);
  for (const q of expandable) gen2[q.id] = await quotesOf(q.id, 5);

  const searchHits = await search(l.searchQuery, SEARCH_MAX_PAGES);
  const since = anchor.createdAt.slice(0, 10);
  const until = new Date(new Date(anchor.createdAt).getTime() + 14 * 864e5).toISOString().slice(0, 10);
  const founderFollowups = await search(`from:${l.founderHandle} since:${since} until:${until} -filter:replies`, 3);
  const replies = await repliesTo(l.xAnchorId, 5);

  const linkedin = l.linkedinAnchorUrl ? await linkedinPost(l.linkedinAnchorUrl) : null;
  const press = [];
  for (const u of l.pressUrls) press.push(await webPage(u));

  const gen2Count = Object.values(gen2).reduce((n, a) => n + a.length, 0);
  console.log(`[${l.slug}] anchor ${anchor.views.toLocaleString()} views | gen1 ${gen1.length}/${anchor.quotes} (${(gen1Recall * 100).toFixed(0)}%) | gen2 ${gen2Count} from ${expandable.length} parents | search ${searchHits.length} | founder followups ${founderFollowups.length} | replies ${replies.length} | LI ${linkedin?.fetchedOk ? `${linkedin.reactions}r/${linkedin.comments}c` : "n/a"} | press ${press.filter((p) => p.fetchedOk).length}/${press.length} | ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  return { launch: l, collectedAt: new Date().toISOString(), anchor, gen1, gen2, searchHits, founderFollowups, replies, linkedin, press, coverage: { gen1Returned: gen1.length, gen1LiveCounter: anchor.quotes, gen1Recall } };
}

async function main() {
  const only = process.argv.slice(2);
  for (const l of LAUNCHES) {
    if (only.length && !only.includes(l.slug)) continue;
    const out = `${DATA_DIR}/launches/${l.slug}.json`;
    if (existsSync(out) && !process.env.FORCE) { console.log(`[${l.slug}] exists, skip (FORCE=1 to redo)`); continue; }
    try {
      writeJson(out, await collectLaunch(l));
    } catch (e) {
      console.error(`[${l.slug}] FAILED`, e);
    }
  }
}
main();
