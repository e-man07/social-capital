"use client";
import { useMemo, useState } from "react";
import type { TreeNode } from "@/lib/tree";

// Radial propagation tree. Centre = founder's anchor; ring 1 = quote tweets clockwise in time order; ring 2 = quotes of quotes.
// The top-N amplifiers by views are drawn as avatars (size = views); the long tail is drawn as faint dots so the shape stays honest
// without the clutter. Colour = phase after the anchor; a black ring = account that recurs in ≥3 of the 9 launches.
const PHASE = (m: number) => (m < 60 ? "#2a78d6" : m < 360 ? "#eb6834" : "#1baf7a");
const phaseName = (m: number) => (m < 60 ? "first hour" : m < 360 ? "hours 1–6" : "hours 6 – day 7+");
const fmt = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : String(n));
const mins = (m: number) => (m < 60 ? `+${Math.round(m)}m` : m < 1440 ? `+${(m / 60).toFixed(1)}h` : `+${(m / 1440).toFixed(1)}d`);

type P = { data: TreeNode; depth: number; angle: number; radius: number; parent?: P; featured: boolean; collapsed?: number };

export function CascadeTree({ data, client, size = 620, featured = 40 }: { data: TreeNode; client: string; size?: number; featured?: number }) {
  const [hover, setHover] = useState<TreeNode | null>(null);
  const R = size / 2 - 40;
  const nodes = useMemo(() => {
    const out: P[] = [{ data, depth: 0, angle: 0, radius: 0, featured: true }];
    const g1 = [...(data.children ?? [])].sort((a, b) => a.minutes - b.minutes);
    const top = new Set([...g1].sort((a, b) => b.views - a.views).slice(0, featured).map((n) => n.id));
    g1.forEach((c, i) => {
      const p: P = { data: c, depth: 1, angle: (i / Math.max(1, g1.length)) * 2 * Math.PI, radius: R * 0.58, parent: out[0], featured: top.has(c.id) };
      out.push(p);
      const g2 = [...(c.children ?? [])].sort((a, b) => b.views - a.views);
      const shown = g2.slice(0, 3), rest = g2.length - shown.length;
      const step = 0.05;
      shown.forEach((k, j) => out.push({ data: k, depth: 2, angle: p.angle + (j - (shown.length - 1) / 2) * step, radius: R, parent: p, featured: true }));
      if (rest > 0) out.push({ data: { ...c, id: c.id + ":more", handle: `+${rest} more quotes of @${c.handle}`, views: 0, text: "" }, depth: 2, angle: p.angle + (shown.length / 2) * step + 0.06, radius: R, parent: p, featured: false, collapsed: rest });
    });
    return out;
  }, [data, R, featured]);
  const toXY = (angle: number, radius: number) => [Math.sin(angle) * radius, -Math.cos(angle) * radius] as const;
  const rOf = (n: P) => (n.depth === 0 ? 26 : n.collapsed ? 10 : n.featured ? Math.max(9, Math.min(20, Math.log10(Math.max(n.data.views, 1)) * 3.2 - 6)) : 2);
  const g1n = nodes.filter((n) => n.depth === 1).length, g2n = (data.children ?? []).reduce((a, c) => a + (c.children?.length ?? 0), 0);

  return (
    <div className="relative">
      <svg viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} width="100%" role="img" aria-label={`Propagation tree for ${client}`}>
        <defs>
          {nodes.filter((n) => n.featured && n.data.avatar).map((n) => <clipPath key={n.data.id} id={`c-${n.data.id.replace(/[^a-z0-9]/gi, "")}`}><circle r={rOf(n)} /></clipPath>)}
        </defs>
        {[R * 0.58, R].map((r, i) => <circle key={i} r={r} fill="none" stroke="#ececec" strokeDasharray="2 5" />)}
        <text x={0} y={-R * 0.58 - 30} textAnchor="middle" fontSize="10" fill="#999">quote tweets</text>
        <text x={0} y={-R - 26} textAnchor="middle" fontSize="10" fill="#999">quotes of quotes</text>
        {nodes.filter((n) => n.parent).map((n) => {
          const [x1, y1] = toXY(n.parent!.angle, n.parent!.radius), [x2, y2] = toXY(n.angle, n.radius);
          return <line key={n.data.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e6e6e6" strokeWidth={n.featured || n.collapsed ? 0.9 : 0.5} strokeOpacity={n.featured || n.collapsed ? 1 : 0.7} />;
        })}
        {nodes.map((n) => {
          const [x, y] = toXY(n.angle, n.radius);
          const d = n.data, r = rOf(n), color = n.depth === 0 ? "#000" : PHASE(d.minutes);
          const clip = `c-${d.id.replace(/[^a-z0-9]/gi, "")}`;
          return (
            <g key={d.id} transform={`translate(${x},${y})`} onMouseEnter={() => setHover(d)} onMouseLeave={() => setHover(null)}>
              {n.collapsed ? (
                <g><circle r={r} fill="#f5f5f5" stroke="#ddd" /><text y={3} textAnchor="middle" fontSize="8" fill="#666">+{n.collapsed}</text></g>
              ) : n.featured ? (
                <g>
                  <circle r={r + (d.core >= 3 ? 3 : 1.5)} fill={d.core >= 3 ? "#000" : color} />
                  <circle r={r + (d.core >= 3 ? 1.5 : 0)} fill="#fff" />
                  {d.avatar ? <image href={d.avatar} x={-r} y={-r} width={2 * r} height={2 * r} clipPath={`url(#${clip})`} preserveAspectRatio="xMidYMid slice" /> : <circle r={r} fill={color} />}
                </g>
              ) : (
                <circle r={r} fill={color} fillOpacity={0.55} />
              )}
            </g>
          );
        })}
      </svg>
      <div className="sm:absolute sm:left-2 sm:bottom-2 mt-2 text-[11px] text-neutral-500 space-y-0.5">
        <div>{g1n} quote tweets · {g2n} quotes of quotes · top {Math.min(featured, g1n)} shown as faces (size = views), rest as dots</div>
        <div className="flex gap-3 flex-wrap">
          {[["#2a78d6", "first hour"], ["#eb6834", "hours 1–6"], ["#1baf7a", "hours 6 – day 7+"]].map(([c, l]) => <span key={l}><i className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1" style={{ background: c }} />{l}</span>)}
          <span><i className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1 border-2 border-black bg-white" />appears in ≥3 of the 9 launches</span>
        </div>
      </div>
      {hover && !hover.id.endsWith(":more") && (
        <div className="sm:absolute sm:right-2 sm:top-2 mt-2 sm:mt-0 sm:max-w-xs rounded-md border border-neutral-200 bg-white p-3 text-xs shadow-sm flex gap-2">
          {hover.avatar && <img src={hover.avatar} alt="" className="w-8 h-8 rounded-full" />}
          <div>
            <div className="font-medium">@{hover.handle} <span className="text-neutral-500 font-normal">· {fmt(hover.followers)} followers</span></div>
            <div className="text-neutral-500">{hover.gen === 0 ? "anchor post" : `${mins(hover.minutes)} · ${phaseName(hover.minutes)} · ${fmt(hover.views)} views${hover.core >= 3 ? ` · in ${hover.core} of 9 launches` : ""}`}</div>
            <div className="mt-1 text-neutral-700">{hover.text}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CascadeExplorer({ trees }: { trees: { slug: string; client: string; tree: TreeNode }[] }) {
  const [slug, setSlug] = useState(trees.find((t) => t.slug === "wispr-flow")?.slug ?? trees[0]?.slug);
  const cur = trees.find((t) => t.slug === slug) ?? trees[0];
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {trees.map((t) => (
          <button key={t.slug} onClick={() => setSlug(t.slug)} className={`text-xs px-2.5 py-1 rounded-full border transition ${t.slug === slug ? "bg-black text-white border-black" : "border-neutral-200 text-neutral-600 hover:border-neutral-400"}`}>{t.client.replace(" (Clark)", "")}</button>
        ))}
      </div>
      <CascadeTree data={cur.tree} client={cur.client} />
    </div>
  );
}
