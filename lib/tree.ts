import type { Graph, Node } from "@/harness/extract";

// Compact cascade tree for the client-side radial layout: anchor → gen-1 quotes → gen-2 quotes.
export type TreeNode = { id: string; handle: string; avatar?: string; followers: number; views: number; minutes: number; gen: 0 | 1 | 2; core: number; text: string; children?: TreeNode[] };

export function cascadeTree(g: Graph, core: Map<string, number>): TreeNode {
  type XPost = Extract<Node, { kind: "post"; platform: "x" }>;
  const posts = new Map(g.nodes.filter((n): n is XPost => n.kind === "post" && n.platform === "x").map((p) => [p.id, p]));
  const children = new Map<string, string[]>();
  for (const e of g.edges) if (e.rel === "quoted" && posts.has(e.from) && posts.has(e.to)) { const c = children.get(e.to) ?? []; c.push(e.from); children.set(e.to, c); }
  const anchor = posts.get(g.anchorId)!;
  const founderAvatar = anchor.avatar ?? [...posts.values()].find((p) => p.author === anchor.author && p.avatar)?.avatar;
  const placed = new Set<string>();
  const build = (id: string, gen: 0 | 1 | 2): TreeNode => {
    const p = posts.get(id)!;
    placed.add(id);
    const kids: TreeNode[] = [];
    if (gen < 2) for (const c of children.get(id) ?? []) { if (placed.has(c)) continue; kids.push(build(c, (gen + 1) as 1 | 2)); }
    return { id, handle: p.author, avatar: (gen === 0 ? founderAvatar : p.avatar)?.replace("_normal", "_bigger"), followers: p.followers, views: p.views, minutes: p.minutesAfterAnchor, gen, core: core.get(p.author.toLowerCase()) ?? 0, text: p.text.slice(0, 120), ...(kids.length ? { children: kids.sort((a, b) => a.minutes - b.minutes) } : {}) };
  };
  return build(g.anchorId, 0);
}
