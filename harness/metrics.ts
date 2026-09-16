import { LAUNCHES, DATA_DIR } from "./config";
import type { Graph, Node } from "./extract";
import { readJson, writeJson } from "./lib/http";
import { existsSync } from "node:fs";

type XPost = Extract<Node, { kind: "post"; platform: "x" }>;
const median = (xs: number[]) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export const WINDOWS: [string, number, number][] = [["0-30m", 0, 30], ["30-60m", 30, 60], ["1-3h", 60, 180], ["3-6h", 180, 360], ["6-24h", 360, 1440], ["1-3d", 1440, 4320], ["3-7d", 4320, 10080], ["7d+", 10080, Infinity]];

export type LaunchMetrics = {
  launch: string; client: string; category: string; anchorAt: string; anchorAuthor: string; anchorFollowers: number; anchorViews: number; anchorQuotes: number; anchorRetweets: number; anchorReplies: number; anchorLikes: number; anchorMedia: boolean;
  coverage: Graph["coverage"];
  viewsPerFollower: number;
  quoteSideViews: number;
  waves: { window: string; n: number; views: number; viewShare: number; medianFollowers: number; topAuthors: string[] }[];
  minutesTo50pctQuotes: number | null;
  first60m: { n: number; medianFollowers: number; viewShare: number; authors: { handle: string; followers: number; minutes: number; views: number }[] };
  generations: { gen: string; n: number; views: number; viewShare: number }[];
  structuralVirality: number;   // mean pairwise distance in the quote tree (2 = pure broadcast)
  maxDepth: number;
  top10ViewShare: number;
  standalone: { n: number; views: number; quoting: number; nonQuoting: number; nonQuotingViews: number; topNonQuoting: { handle: string; followers: number; minutes: number; views: number; text: string }[] };
  founderFollowups: { minutes: number; views: number; quotesAnchor: boolean; text: string }[];
  crossPlatform: { platform: string; label: string; minutesAfterAnchor: number | null; detail: string }[];
  // Who carries which hour: share of each phase's views that comes from accounts recurring across >=3 launches.
  phases: { phase: string; posts: number; views: number; corePosts: number; coreViewShare: number; topCore: { handle: string; launches: number; minutes: number; views: number; text: string }[]; topNonCore: { handle: string; followers: number; minutes: number; views: number; text: string }[] }[];
};
export const PHASES: [string, number, number][] = [["0-1h", 0, 60], ["1-6h", 60, 360], ["6h-7d", 360, 10080]];

export function launchMetrics(g: Graph, core: Map<string, number> = new Map()): LaunchMetrics {
  const l = LAUNCHES.find((x) => x.slug === g.launch)!;
  const posts = g.nodes.filter((n): n is XPost => n.kind === "post" && n.platform === "x");
  const anchor = posts.find((p) => p.id === g.anchorId)!;
  const gen1 = posts.filter((p) => p.gen === 1);
  const gen2 = posts.filter((p) => p.gen === 2);
  const quoteSide = [...gen1, ...gen2];
  const quoteSideViews = sum(quoteSide.map((p) => p.views)) || 1;

  const waves = WINDOWS.map(([window, lo, hi]) => {
    const s = gen1.filter((p) => p.minutesAfterAnchor >= lo && p.minutesAfterAnchor < hi);
    return { window, n: s.length, views: sum(s.map((p) => p.views)), viewShare: sum(s.map((p) => p.views)) / quoteSideViews, medianFollowers: median(s.map((p) => p.followers)), topAuthors: [...s].sort((a, b) => b.views - a.views).slice(0, 3).map((p) => p.author) };
  });
  const sortedByTime = [...gen1].sort((a, b) => a.minutesAfterAnchor - b.minutesAfterAnchor);
  const minutesTo50pctQuotes = sortedByTime.length ? sortedByTime[Math.floor(sortedByTime.length / 2)].minutesAfterAnchor : null;
  const early = sortedByTime.filter((p) => p.minutesAfterAnchor >= 0 && p.minutesAfterAnchor < 60);

  // Structural virality (Goel, Anderson, Hofman & Watts 2016): mean shortest-path distance over all node pairs in the cascade tree.
  const parent = new Map<string, string>();
  for (const e of g.edges) if (e.rel === "quoted" && g.nodes.some((n) => n.id === e.to)) parent.set(e.from, e.to);
  // Only nodes whose quote chain ends at the anchor belong to the cascade tree (the research agent also
  // expands quotes of standalone posts; those hang off a different root and are excluded here).
  const pathTo = (id: string): string[] => { const out = [id]; let cur = id; const seen = new Set<string>(); while (parent.has(cur) && cur !== g.anchorId && !seen.has(cur)) { seen.add(cur); cur = parent.get(cur)!; out.push(cur); } return out; };
  const paths = new Map<string, string[]>();
  for (const p of [anchor, ...quoteSide]) { const path = pathTo(p.id); if (path[path.length - 1] === g.anchorId) paths.set(p.id, path); }
  const tree = [...paths.keys()];
  const depth = new Map<string, number>(tree.map((id) => [id, paths.get(id)!.length - 1]));
  let total = 0, pairs = 0;
  for (let i = 0; i < tree.length; i++) for (let j = i + 1; j < tree.length; j++) {
    const pa = paths.get(tree[i])!, pb = new Set(paths.get(tree[j])!);
    let lcaDepth = 0; for (const a of pa) if (pb.has(a)) { lcaDepth = depth.get(a)!; break; }
    total += depth.get(tree[i])! + depth.get(tree[j])! - 2 * lcaDepth; pairs++;
  }
  const structuralVirality = pairs ? total / pairs : 0;

  const amplification = posts.filter((p) => p.gen === 1 || p.gen === 2 || p.gen === "search");
  const phases = PHASES.map(([phase, lo, hi]) => {
    const s = amplification.filter((p) => p.minutesAfterAnchor >= lo && p.minutesAfterAnchor < hi);
    const v = sum(s.map((p) => p.views)) || 1;
    const isCore = (p: XPost) => core.has(p.author.toLowerCase());
    return {
      phase, posts: s.length, views: sum(s.map((p) => p.views)), corePosts: s.filter(isCore).length, coreViewShare: sum(s.filter(isCore).map((p) => p.views)) / v,
      topCore: s.filter(isCore).sort((a, b) => b.views - a.views).slice(0, 4).map((p) => ({ handle: p.author, launches: core.get(p.author.toLowerCase())!, minutes: p.minutesAfterAnchor, views: p.views, text: p.text.slice(0, 90) })),
      topNonCore: s.filter((p) => !isCore(p)).sort((a, b) => b.views - a.views).slice(0, 3).map((p) => ({ handle: p.author, followers: p.followers, minutes: p.minutesAfterAnchor, views: p.views, text: p.text.slice(0, 90) })),
    };
  });
  const searchPosts = posts.filter((p) => p.gen === "search");
  const nonQuoting = searchPosts.filter((p) => !p.quotesAnchor);
  const followups = posts.filter((p) => p.gen === "followup").sort((a, b) => a.minutesAfterAnchor - b.minutesAfterAnchor);
  const li = g.nodes.find((n): n is Extract<Node, { platform: "linkedin" }> => n.kind === "post" && n.platform === "linkedin");
  const articles = g.nodes.filter((n): n is Extract<Node, { kind: "article" }> => n.kind === "article");

  return {
    launch: g.launch, client: l.client, category: l.category, anchorAt: g.anchorAt, anchorAuthor: anchor.author, anchorFollowers: anchor.followers, anchorViews: anchor.views, anchorQuotes: anchor.quotes, anchorRetweets: anchor.retweets, anchorReplies: anchor.replies, anchorLikes: anchor.likes, anchorMedia: anchor.hasMedia,
    coverage: g.coverage, viewsPerFollower: anchor.followers ? anchor.views / anchor.followers : 0, quoteSideViews,
    waves, minutesTo50pctQuotes,
    first60m: { n: early.length, medianFollowers: median(early.map((p) => p.followers)), viewShare: sum(early.map((p) => p.views)) / quoteSideViews, authors: early.map((p) => ({ handle: p.author, followers: p.followers, minutes: p.minutesAfterAnchor, views: p.views })) },
    generations: [["gen1", gen1], ["gen2", gen2]].map(([gen, s]) => ({ gen: gen as string, n: (s as XPost[]).length, views: sum((s as XPost[]).map((p) => p.views)), viewShare: sum((s as XPost[]).map((p) => p.views)) / quoteSideViews })),
    structuralVirality, maxDepth: Math.max(0, ...[...depth.values()]),
    top10ViewShare: sum([...quoteSide].sort((a, b) => b.views - a.views).slice(0, 10).map((p) => p.views)) / quoteSideViews,
    standalone: { n: g.coverage.searchHits, views: sum(searchPosts.map((p) => p.views)), quoting: g.coverage.searchAlreadyInCascade + (searchPosts.length - nonQuoting.length), nonQuoting: nonQuoting.length, nonQuotingViews: sum(nonQuoting.map((p) => p.views)), topNonQuoting: [...nonQuoting].sort((a, b) => b.views - a.views).slice(0, 8).map((p) => ({ handle: p.author, followers: p.followers, minutes: p.minutesAfterAnchor, views: p.views, text: p.text.slice(0, 140) })) },
    founderFollowups: followups.map((p) => ({ minutes: p.minutesAfterAnchor, views: p.views, quotesAnchor: g.edges.some((e) => e.from === p.id && e.to === g.anchorId && e.rel === "quoted"), text: p.text.slice(0, 120) })),
    crossPlatform: [
      ...(li ? [{ platform: "linkedin", label: "Founder LinkedIn twin", minutesAfterAnchor: li.minutesAfterAnchor, detail: `${li.reactions ?? "?"} reactions / ${li.comments ?? "?"} comments` }] : []),
      ...articles.map((a) => ({ platform: "web", label: a.title.slice(0, 80), minutesAfterAnchor: a.minutesAfterAnchor, detail: a.url })),
    ],
    phases,
  };
}

export type Recurrence = { handle: string; authorId: string; followers: number; avatar?: string; launches: string[]; categories: string[]; earliestMinutes: Record<string, number>; totalViews: number };

export function recurrence(graphs: Graph[]): Recurrence[] {
  const byAuthor = new Map<string, Recurrence>();
  for (const g of graphs) {
    const cat = LAUNCHES.find((l) => l.slug === g.launch)!.category;
    for (const n of g.nodes) {
      if (n.kind !== "post" || n.platform !== "x" || n.id === g.anchorId || n.gen === "reply" || n.gen === "followup") continue;
      const key = n.authorId || n.author;
      const r = byAuthor.get(key) ?? { handle: n.author, authorId: n.authorId, followers: n.followers, avatar: n.avatar, launches: [], categories: [], earliestMinutes: {}, totalViews: 0 };
      if (!r.launches.includes(g.launch)) r.launches.push(g.launch);
      if (!r.categories.includes(cat)) r.categories.push(cat);
      r.earliestMinutes[g.launch] = Math.min(r.earliestMinutes[g.launch] ?? Infinity, n.minutesAfterAnchor);
      r.totalViews += n.views;
      byAuthor.set(key, r);
    }
  }
  return [...byAuthor.values()].filter((r) => r.launches.length >= 2).sort((a, b) => b.launches.length - a.launches.length || b.totalViews - a.totalViews);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const graphs = LAUNCHES.map((l) => `${DATA_DIR}/graph/${l.slug}.json`).filter(existsSync).map((p) => readJson<Graph>(p));
  const rec = recurrence(graphs);
  const core = new Map(rec.filter((r) => r.launches.length >= 3).map((r) => [r.handle.toLowerCase(), r.launches.length]));
  const perLaunch = graphs.map((g) => launchMetrics(g, core));
  writeJson(`${DATA_DIR}/metrics.json`, { generatedAt: new Date().toISOString(), launches: perLaunch, recurrence: rec });
  for (const m of perLaunch) console.log(`[${m.launch}] SV=${m.structuralVirality.toFixed(2)} depth=${m.maxDepth} gen1=${m.generations[0].n} first60m=${m.first60m.n} (${(m.first60m.viewShare * 100).toFixed(0)}% views, med followers ${m.first60m.medianFollowers}) top10=${(m.top10ViewShare * 100).toFixed(0)}% nonQuoting=${m.standalone.nonQuoting}/${m.standalone.n} (${m.standalone.nonQuotingViews.toLocaleString()} v) followups=${m.founderFollowups.length} LI=${m.crossPlatform[0]?.minutesAfterAnchor ?? "n/a"}m`);
  console.log(`recurring accounts (>=2 launches): ${rec.length}; >=3: ${rec.filter((r) => r.launches.length >= 3).length}`);
  for (const r of rec.slice(0, 15)) console.log(`  @${r.handle} f=${r.followers} launches=${r.launches.join(",")} cats=${r.categories.length}`);
}
