import { NextResponse } from "next/server";
import { ToolLoopAgent, tool, isStepCount } from "ai";
import { z } from "zod";
import { luna, providerOptions, compact } from "@/harness/lib/llm";
import { getMetrics, getGraph } from "@/lib/data";
import type { Node } from "@/harness/extract";

type XPost = Extract<Node, { kind: "post"; platform: "x" }>;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Ask-the-graph needs OPENAI_API_KEY on the server. The rest of the site is static." }, { status: 503 });
  const { question } = (await req.json()) as { question?: string };
  if (!question?.trim()) return NextResponse.json({ error: "Empty question" }, { status: 400 });
  const m = getMetrics();
  if (!m) return NextResponse.json({ error: "No data" }, { status: 500 });
  const graphs = new Map<string, ReturnType<typeof getGraph>>();
  const posts = (slug: string) => { if (!graphs.has(slug)) graphs.set(slug, getGraph(slug)); return (graphs.get(slug)?.nodes ?? []).filter((n): n is XPost => n.kind === "post" && n.platform === "x"); };

  // Compact summary in the prompt so most questions need 0–1 tool calls.
  const summary = m.launches.map((l) => `${l.launch} (${l.client}, ${l.category}): anchor @${l.anchorAuthor} ${l.anchorFollowers} followers → ${l.anchorViews} views; gen-1 quotes ${l.generations[0].n} (recall ${Math.round(l.coverage.gen1Recall * 100)}%); structural virality ${l.structuralVirality.toFixed(2)}; first hour ${l.first60m.n} quotes = ${Math.round(l.first60m.viewShare * 100)}% of quote views; phases core-share ${l.phases.map((p) => `${p.phase} ${Math.round(p.coreViewShare * 100)}%`).join(", ")}; standalone non-quoting ${l.standalone.nonQuoting} posts ${l.standalone.nonQuotingViews} views; LinkedIn twin ${l.crossPlatform[0]?.platform === "linkedin" ? `${l.crossPlatform[0].minutesAfterAnchor} min` : "none"}`).join("\n");
  const rec = m.recurrence.filter((r) => r.launches.length >= 3).slice(0, 40).map((r) => `@${r.handle} (${r.followers} f): ${r.launches.join(", ")}`).join("\n");

  const agent = new ToolLoopAgent({
    model: luna(),
    providerOptions: providerOptions("ask"),
    prepareStep: compact,
    instructions: `You answer questions about how Social Capital Inc.'s nine claimed launches propagated on X and LinkedIn.
Answer in plain prose for a business reader: 2–6 sentences, no JSON, no code, no markdown tables, no bullet lists unless listing accounts. Cite handles, minutes-after-anchor and views when relevant.
Label claims as observed / inferred / not determinable. Timing implies sequence, never cause. Never say an account was paid. Do not use em dashes in your writing. If the data can't answer, say so in one sentence.
Use the summary below first; call a tool only when you need post-level detail.

LAUNCH SUMMARY
${summary}

RECURRING CORE (accounts in ≥3 launches; launches listed)
${rec}`,
    tools: {
      posts: tool({ description: "Posts for a launch filtered by generation ('1','2','search','followup','any') and minutes-after-anchor window, optionally by handle; sorted by views.", inputSchema: z.object({ slug: z.string(), gen: z.string().default("any"), fromMinutes: z.number().default(-1e9), toMinutes: z.number().default(1e9), handle: z.string().optional(), limit: z.number().int().max(40).default(15) }), execute: async ({ slug, gen, fromMinutes, toMinutes, handle, limit }) => posts(slug).filter((p) => p.gen !== "reply" && (gen === "any" || String(p.gen) === gen) && p.minutesAfterAnchor >= fromMinutes && p.minutesAfterAnchor < toMinutes && (!handle || p.author.toLowerCase() === handle.replace(/^@/, "").toLowerCase())).sort((a, b) => b.views - a.views).slice(0, limit).map((p) => ({ handle: p.author, followers: p.followers, minutes: Math.round(p.minutesAfterAnchor), views: p.views, gen: p.gen, quotesAnchor: p.quotesAnchor, text: p.text.slice(0, 100) })) }),
    },
    stopWhen: isStepCount(5),
  });
  const result = await agent.stream({ prompt: question });
  return result.toTextStreamResponse();
}
