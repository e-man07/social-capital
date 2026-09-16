import { LAUNCHES, DATA_DIR } from "./config";
import type { Collected } from "./collect";
import type { XTweet } from "./sources/x";
import { readJson, writeJson } from "./lib/http";
import { existsSync } from "node:fs";
import type { ResearchOutput } from "./agents/research-agent";

// Evidence graph. Edges are only relationships that are directly observable in public data:
//   quoted / replied_to / mentions / cross_platform_twin / covered_by.
// "after" is derived from timestamps at analysis time; no edge ever means "caused".
export type Node =
  | { id: string; kind: "post"; platform: "x"; launch: string; gen: 0 | 1 | 2 | "search" | "followup" | "reply"; author: string; authorId: string; followers: number; avatar?: string; createdAt: string; minutesAfterAnchor: number; views: number; likes: number; retweets: number; replies: number; quotes: number; text: string; hasMedia: boolean; quotesAnchor: boolean }
  | { id: string; kind: "post"; platform: "linkedin"; launch: string; gen: 0; author: string; createdAt: string; minutesAfterAnchor: number; reactions: number | null; comments: number | null; url: string }
  | { id: string; kind: "article"; launch: string; url: string; title: string; createdAt: string | null; minutesAfterAnchor: number | null; embedsHandles: string[] }
  | { id: string; kind: "account"; platform: "x"; handle: string; authorId: string; followers: number; launches: string[] };
export type Edge = { from: string; to: string; rel: "quoted" | "replied_to" | "mentions" | "cross_platform_twin" | "covered_by" | "authored" };
export type Graph = { launch: string; anchorId: string; anchorAt: string; nodes: Node[]; edges: Edge[]; coverage: Collected["coverage"] & { gen2Parents: number; gen2Returned: number; searchHits: number; searchAlreadyInCascade: number; searchDroppedIrrelevant: number; agentAdded: number };
  research?: Pick<ResearchOutput, "accountNotes" | "narratives" | "notes"> | null };

const minutes = (iso: string, anchorIso: string) => Math.round(((new Date(iso).getTime() - new Date(anchorIso).getTime()) / 60000) * 10) / 10;
const toIso = (s: string) => new Date(s).toISOString();
const unescapeHtml = (s: string) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function postNode(t: XTweet, launch: string, gen: Exclude<Extract<Node, { kind: "post"; platform: "x" }>["gen"], never>, anchorAt: string, anchorId: string): Extract<Node, { kind: "post"; platform: "x" }> {
  return {
    id: `x:${t.id}`, kind: "post", platform: "x", launch, gen, author: t.author.userName, authorId: t.author.id, followers: t.author.followers ?? 0, avatar: t.author.profilePicture,
    createdAt: toIso(t.createdAt), minutesAfterAnchor: minutes(toIso(t.createdAt), anchorAt),
    views: t.viewCount ?? 0, likes: t.likeCount ?? 0, retweets: t.retweetCount ?? 0, replies: t.replyCount ?? 0, quotes: t.quoteCount ?? 0,
    text: unescapeHtml(t.text), hasMedia: !!t.extendedEntities?.media?.length, quotesAnchor: t.quoted_tweet?.id === anchorId,
  };
}

export function buildGraph(c: Collected, research?: ResearchOutput | null): Graph {
  const L = c.launch.slug, A = c.anchor, anchorAt = A.createdAt, anchorNodeId = `x:${A.id}`;
  const cfg = LAUNCHES.find((l) => l.slug === L) ?? c.launch; // live config wins over the snapshot stored at collection time
  const nodes = new Map<string, Node>();
  const edges: Edge[] = [];
  const accounts = new Map<string, Extract<Node, { kind: "account" }>>();
  const addAccount = (handle: string, authorId: string, followers: number) => {
    const id = `acct:${authorId || handle}`;
    if (!accounts.has(id)) accounts.set(id, { id, kind: "account", platform: "x", handle, authorId, followers, launches: [L] });
    return id;
  };
  const addPost = (t: XTweet, gen: Extract<Node, { kind: "post"; platform: "x" }>["gen"]) => {
    const n = postNode(t, L, gen, anchorAt, A.id);
    if (nodes.has(n.id)) return n.id;
    nodes.set(n.id, n);
    edges.push({ from: addAccount(t.author.userName, t.author.id, t.author.followers ?? 0), to: n.id, rel: "authored" });
    for (const m of t.entities?.user_mentions ?? []) edges.push({ from: n.id, to: `handle:${m.screen_name}`, rel: "mentions" });
    return n.id;
  };

  nodes.set(anchorNodeId, { id: anchorNodeId, kind: "post", platform: "x", launch: L, gen: 0, author: A.author, authorId: "", followers: A.authorFollowers, avatar: A.authorAvatar, createdAt: anchorAt, minutesAfterAnchor: 0, views: A.views, likes: A.likes, retweets: A.retweets, replies: A.replies, quotes: A.quotes, text: A.text, hasMedia: A.media.length > 0, quotesAnchor: false });

  for (const q of c.gen1) edges.push({ from: addPost(q, 1), to: anchorNodeId, rel: "quoted" });
  for (const [parentId, qs] of Object.entries(c.gen2)) for (const q of qs) edges.push({ from: addPost(q, 2), to: `x:${parentId}`, rel: "quoted" });
  for (const r of c.replies) edges.push({ from: addPost(r, "reply"), to: anchorNodeId, rel: "replied_to" });
  for (const f of c.founderFollowups) { if (f.id === A.id) continue; const id = addPost(f, "followup"); if (f.quoted_tweet?.id) edges.push({ from: id, to: `x:${f.quoted_tweet.id}`, rel: "quoted" }); }
  const relevant = (t: XTweet) => { const txt = t.text.toLowerCase(); return cfg.relevanceTerms.some((k) => txt.includes(k)) || t.author.userName.toLowerCase() === cfg.founderHandle.toLowerCase(); };
  let searchAlreadyInCascade = 0, searchDroppedIrrelevant = 0;
  for (const s of c.searchHits) {
    if (nodes.has(`x:${s.id}`) || s.id === A.id) { searchAlreadyInCascade++; continue; }
    if (!relevant(s)) { searchDroppedIrrelevant++; continue; }
    const id = addPost(s, "search");
    if (s.quoted_tweet?.id) edges.push({ from: id, to: `x:${s.quoted_tweet.id}`, rel: "quoted" });
  }

  // Research-agent evidence: extra launch-window posts and quote expansions it recorded while exploring.
  let agentAdded = 0;
  for (const s of research?.extraSearchHits ?? []) {
    if (nodes.has(`x:${s.id}`) || s.id === A.id) continue;
    if (!relevant(s)) { searchDroppedIrrelevant++; continue; }
    const id = addPost(s, "search"); agentAdded++;
    if (s.quoted_tweet?.id) edges.push({ from: id, to: `x:${s.quoted_tweet.id}`, rel: "quoted" });
  }
  for (const [parentId, qs] of Object.entries(research?.extraQuoteExpansions ?? {})) for (const q of qs) { if (nodes.has(`x:${q.id}`)) continue; edges.push({ from: addPost(q, 2), to: `x:${parentId}`, rel: "quoted" }); agentAdded++; }

  if (c.linkedin?.activityId) {
    const id = `li:${c.linkedin.activityId}`;
    nodes.set(id, { id, kind: "post", platform: "linkedin", launch: L, gen: 0, author: A.author, createdAt: c.linkedin.createdAt, minutesAfterAnchor: minutes(c.linkedin.createdAt, anchorAt), reactions: c.linkedin.reactions, comments: c.linkedin.comments, url: c.linkedin.url });
    edges.push({ from: id, to: anchorNodeId, rel: "cross_platform_twin" });
  }
  for (const p of c.press) {
    if (!p.fetchedOk) continue;
    const id = `web:${p.url}`;
    nodes.set(id, { id, kind: "article", launch: L, url: p.url, title: p.title, createdAt: p.publishedAt ? toIso(p.publishedAt) : null, minutesAfterAnchor: p.publishedAt ? minutes(toIso(p.publishedAt), anchorAt) : null, embedsHandles: p.xHandlesMentioned });
    edges.push({ from: anchorNodeId, to: id, rel: "covered_by" });
  }
  for (const a of accounts.values()) nodes.set(a.id, a);
  // A post can only quote one tweet; keep the first quoted edge per source so the cascade stays a tree.
  const seenQuoted = new Set<string>();
  const dedupedEdges = edges.filter((e) => { if (e.rel !== "quoted") return true; if (seenQuoted.has(e.from)) return false; seenQuoted.add(e.from); return true; });

  return {
    launch: L, anchorId: anchorNodeId, anchorAt, nodes: [...nodes.values()], edges: dedupedEdges,
    coverage: { ...c.coverage, gen2Parents: Object.keys(c.gen2).length, gen2Returned: Object.values(c.gen2).reduce((n, a) => n + a.length, 0), searchHits: c.searchHits.length + (research?.extraSearchHits.length ?? 0), searchAlreadyInCascade, searchDroppedIrrelevant, agentAdded },
    research: research ? { accountNotes: research.accountNotes, narratives: research.narratives, notes: research.notes } : null,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const l of LAUNCHES) {
    const src = `${DATA_DIR}/launches/${l.slug}.json`;
    if (!existsSync(src)) { console.log(`[${l.slug}] no collection yet`); continue; }
    const rp = `${DATA_DIR}/agent/${l.slug}.research.json`;
    const g = buildGraph(readJson<Collected>(src), existsSync(rp) ? readJson<ResearchOutput>(rp) : null);
    writeJson(`${DATA_DIR}/graph/${l.slug}.json`, g);
    console.log(`[${l.slug}] nodes ${g.nodes.length} edges ${g.edges.length}${g.research ? ` (+${g.coverage.agentAdded} from research agent)` : ""}`);
  }
}
