import "../lib/env";
import { ToolLoopAgent, tool, Output, isStepCount, generateText } from "ai";
import { luna, providerOptions, makeCompactor, reportUsage } from "../lib/llm";
import { z } from "zod";
import { LAUNCHES, DATA_DIR } from "../config";
import type { Graph, Node } from "../extract";
import type { LaunchMetrics, Recurrence } from "../metrics";
import { readJson, writeJson } from "../lib/http";

// Analysis Agent: proposes hypotheses about the propagation pattern and tests each one against the
// evidence graph through deterministic query tools (never by eyeballing). Its output is a findings list
// where every claim is labelled observed / inferred / not_determinable and cites node ids.

type XPost = Extract<Node, { kind: "post"; platform: "x" }>;

const findingSchema = z.object({
  headline: z.string(),
  findings: z.array(z.object({
    claim: z.string(),
    label: z.enum(["observed", "inferred", "not_determinable"]),
    confidence: z.enum(["high", "medium", "low"]),
    evidence: z.array(z.string()).describe("node ids or metric names supporting the claim"),
    launches: z.array(z.string()),
    caveat: z.string().nullable(),
  })),
  notDeterminable: z.array(z.string()),
  suggestedChartsOrTables: z.array(z.string()),
});
export type Findings = z.infer<typeof findingSchema> & { generatedAt: string; classifications?: Record<string, string> };

export async function classifyTexts(items: { id: string; text: string }[], labels: string[], instruction: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (let i = 0; i < items.length; i += 40) {
    const batch = items.slice(i, i + 40);
    const { output } = await generateText({
      model: luna(),
      providerOptions: providerOptions("classify"),
      output: Output.object({ schema: z.object({ labels: z.array(z.object({ id: z.string(), label: z.enum(labels as [string, ...string[]]) })) }) }),
      prompt: `${instruction}\nLabels: ${labels.join(", ")}\n\n${batch.map((b) => `[${b.id}] ${b.text.replace(/\s+/g, " ").slice(0, 280)}`).join("\n")}`,
    });
    for (const r of output?.labels ?? []) out[r.id] = r.label;
  }
  return out;
}

export async function runAnalysisAgent() {
  const metrics = readJson<{ launches: LaunchMetrics[]; recurrence: Recurrence[] }>(`${DATA_DIR}/metrics.json`);
  const graphs = Object.fromEntries(metrics.launches.map((m) => [m.launch, readJson<Graph>(`${DATA_DIR}/graph/${m.launch}.json`)]));
  const classifications: Record<string, string> = {};
  const posts = (slug: string) => graphs[slug].nodes.filter((n): n is XPost => n.kind === "post" && n.platform === "x");

  const agent = new ToolLoopAgent({
    model: luna(),
    providerOptions: providerOptions("analysis", "medium"),
    prepareStep: makeCompactor(60_000, 8),
    instructions: `You analyse how Social Capital Inc.'s client launches propagate on X, using an evidence graph built from public data.
Discipline: every finding must be labelled observed (directly in the data), inferred (supported by several signals) or not_determinable. Timing supports "after", never "because". Never claim an account was paid. Do not use em dashes in your writing. Report coverage limits (quote recall vs live counters) wherever they affect a claim. Prefer few, well-evidenced findings over many weak ones. Older tool results are dropped from your context as you go — keep running notes of the numbers you will cite. Interesting != obvious: "creators amplify launches" is obvious; the shape, timing, content mix and recurrence of amplification are not.`,
    tools: {
      launch_metrics: tool({ description: "Per-launch metrics: waves, generations, structural virality, coverage, standalone posts, follow-ups, cross-platform timeline, and phases (share of each phase's views from the recurring core, with top core / non-core posts).", inputSchema: z.object({ slug: z.string() }), execute: async ({ slug }) => metrics.launches.find((m) => m.launch === slug) ?? { error: "unknown slug" } }),
      all_launch_summary: tool({ description: "Compact table across all launches.", inputSchema: z.object({}), execute: async () => metrics.launches.map((m) => ({ launch: m.launch, category: m.category, anchorFollowers: m.anchorFollowers, anchorViews: m.anchorViews, viewsPerFollower: Math.round(m.viewsPerFollower), gen1: m.generations[0].n, recall: m.coverage.gen1Recall, structuralVirality: m.structuralVirality, first60mN: m.first60m.n, first60mViewShare: m.first60m.viewShare, top10ViewShare: m.top10ViewShare, nonQuotingViews: m.standalone.nonQuotingViews, quoteSideViews: m.quoteSideViews, liLagMinutes: m.crossPlatform[0]?.minutesAfterAnchor ?? null, media: m.anchorMedia })) }),
      recurrence: tool({ description: "Accounts appearing in >= 2 launches' amplification, with categories spanned and earliest minutes per launch.", inputSchema: z.object({ minLaunches: z.number().int().min(2).default(2) }), execute: async ({ minLaunches }) => { const all = metrics.recurrence.filter((r) => r.launches.length >= minLaunches); return { totalAccounts: all.length, in2plus: metrics.recurrence.length, in3plus: metrics.recurrence.filter((r) => r.launches.length >= 3).length, in5plus: metrics.recurrence.filter((r) => r.launches.length >= 5).length, spanning3plusCategories: all.filter((r) => r.categories.length >= 3).length, top: all.slice(0, 40).map((r) => ({ handle: r.handle, followers: r.followers, launches: r.launches, categories: r.categories, earliestMinutes: r.earliestMinutes })) }; } }),
      list_posts: tool({
        description: "List posts for a launch filtered by generation and time window (minutes after anchor); sorted by views.",
        inputSchema: z.object({ slug: z.string(), gen: z.enum(["1", "2", "search", "followup", "reply", "any"]).default("any"), fromMinutes: z.number().default(-1e9), toMinutes: z.number().default(1e9), limit: z.number().int().max(40).default(15) }),
        execute: async ({ slug, gen, fromMinutes, toMinutes, limit }) => posts(slug).filter((p) => (gen === "any" || String(p.gen) === gen) && p.minutesAfterAnchor >= fromMinutes && p.minutesAfterAnchor < toMinutes).sort((a, b) => b.views - a.views).slice(0, limit).map((p) => ({ id: p.id, handle: p.author, followers: p.followers, minutes: p.minutesAfterAnchor, views: p.views, quotesAnchor: p.quotesAnchor, label: classifications[p.id], text: p.text.slice(0, 110) })),
      }),
      classify_posts: tool({
        description: "LLM-classify the content of a launch's posts into given labels (e.g. product_endorsement, founder_story, critique, contest_entry, meme, news_repost, other). Returns label counts and view share per label, per time window.",
        inputSchema: z.object({ slug: z.string(), gen: z.enum(["1", "search", "any"]).default("any"), labels: z.array(z.string()).min(2).max(8) }),
        execute: async ({ slug, gen, labels }) => {
          const ps = posts(slug).filter((p) => p.gen !== "reply" && p.gen !== 0 && (gen === "any" || String(p.gen) === gen));
          const res = await classifyTexts(ps.map((p) => ({ id: p.id, text: p.text })), labels, `Classify each post about the ${slug} launch by its dominant content type.`);
          Object.assign(classifications, res);
          const windows: [string, number, number][] = [["0-1h", 0, 60], ["1-6h", 60, 360], ["6-24h", 360, 1440], ["1-7d", 1440, 10080], ["7d+", 10080, 1e9]];
          const table = windows.map(([w, lo, hi]) => { const s = ps.filter((p) => p.minutesAfterAnchor >= lo && p.minutesAfterAnchor < hi); const byLabel: Record<string, { n: number; views: number }> = {}; for (const p of s) { const l = res[p.id] ?? "unlabelled"; byLabel[l] = byLabel[l] ?? { n: 0, views: 0 }; byLabel[l].n++; byLabel[l].views += p.views; } return { window: w, posts: s.length, byLabel }; });
          const totals: Record<string, { n: number; views: number }> = {}; for (const p of ps) { const l = res[p.id] ?? "unlabelled"; totals[l] = totals[l] ?? { n: 0, views: 0 }; totals[l].n++; totals[l].views += p.views; }
          return { labelled: Object.keys(res).length, of: ps.length, totals, byWindow: table, note: "views = sum of views of posts with that label in that window; compare label mix in 0-1h vs 6-24h and 1-7d" };
        },
      }),
    },
    stopWhen: isStepCount(28),
    output: Output.object({ schema: findingSchema }),
  });

  const summaryTable = metrics.launches.map((m) => `${m.launch} | ${m.category} | anchor @${m.anchorAuthor} ${m.anchorFollowers} f, ${m.anchorViews} views (${Math.round(m.viewsPerFollower)}x/follower), media=${m.anchorMedia} | gen1 ${m.generations[0].n}/${m.anchorQuotes} (recall ${(m.coverage.gen1Recall * 100).toFixed(0)}%) | SV ${m.structuralVirality.toFixed(2)} depth ${m.maxDepth} | first60m ${m.first60m.n} posts, ${(m.first60m.viewShare * 100).toFixed(0)}% of quote views, median ${m.first60m.medianFollowers} f | top10 ${(m.top10ViewShare * 100).toFixed(0)}% | quoteSideViews ${m.quoteSideViews} | nonQuoting ${m.standalone.nonQuoting} posts ${m.standalone.nonQuotingViews} views | LI twin ${m.crossPlatform[0]?.platform === "linkedin" ? `${m.crossPlatform[0].minutesAfterAnchor}m` : "none"} | founder followups ${m.founderFollowups.length}`).join("\n");
  const { output, steps } = await agent.generate({
    prompt: `ALL-LAUNCH SUMMARY (authoritative; structural virality SV is measured for every launch — 2.00 = pure broadcast):
launch | category | anchor | gen1 (recall) | SV | first 60m | top10 share | quote-side views | non-quoting posts | LinkedIn | followups
${summaryTable}

Analyse all launches. Steps: (1) recurrence (minLaunches 3); (2) for wispr-flow, cartesia and gamma: launch_metrics, then classify_posts with labels [product_endorsement, founder_story, critique, contest_entry, meme, news_repost, other] on gen "any", and list_posts for the 6-24h and 1-7d windows; (3) test each hypothesis against ALL nine launches using the summary table, and cite per-launch numbers: H1 cascade is broadcast-shaped (structural virality ~2); H2 early quoters (<60m) are larger accounts than later ones; H3 most quote-side reach arrives after 6h from a different content type than the first hour; H4 a recurring core of accounts spans product categories; H5 standalone (non-quoting) posts carry reach comparable to the quote cascade; H6 the founder's LinkedIn twin goes live within minutes of X; H7 (use launch_metrics.phases) the recurring core (accounts in >=3 launches) contributes little of the first hour's reach but most of the 1-6h and 6h-7d reach, and its late posts are founder-story content rather than product endorsements — i.e. one network operating in phases. (4) State what cannot be determined. Write 8-12 findings; each must cite concrete numbers and name launches. The headline should state the single most non-obvious pattern. Return the findings object.`,
  });
  reportUsage("analysis", steps);
  const findings: Findings = { ...output!, generatedAt: new Date().toISOString(), classifications };
  writeJson(`${DATA_DIR}/findings.json`, findings);
  console.log(findings.headline); for (const f of findings.findings) console.log(` - [${f.label}/${f.confidence}] ${f.claim}`);
  return findings;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.env.OPENAI_API_KEY) { console.error("OPENAI_API_KEY not set — analysis agent is dormant. Metrics are still computed by harness/metrics.ts."); process.exit(2); }
  runAnalysisAgent();
}
