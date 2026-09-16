import type { LaunchMetrics, Recurrence } from "@/harness/metrics";
import { fmt } from "@/lib/data";

// Validated categorical palette for the dark surface (dataviz validator: all checks pass).
export const PHASE_COLORS: Record<string, string> = { "0-1h": "#2a78d6", "1-6h": "#eb6834", "6h-7d": "#1baf7a" };
const INK = "var(--ink)", MUTED = "var(--muted)", LINE = "var(--line)";

// Chart A — When the reach arrives. One row per launch; segments = share of amplification views by phase.
export function PhaseStack({ launches }: { launches: LaunchMetrics[] }) {
  const W = 900, labelW = 120, rowH = 36, gap = 6, barH = 24, H = launches.length * (rowH) + 36;
  const plotW = W - labelW - 130;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Share of amplification views by phase, per launch">
      {launches.map((l, i) => {
        const total = l.phases.reduce((a, p) => a + p.views, 0) || 1;
        let x = labelW;
        const y = i * rowH + 6;
        const late = (l.phases[1].views + l.phases[2].views) / total;
        return (
          <g key={l.launch}>
            <text x={labelW - 8} y={y + barH / 2 + 4} textAnchor="end" fontSize="14" fill={INK}>{l.client.replace(" (Clark)", "")}</text>
            {l.phases.map((p) => {
              const w = Math.max(0, (p.views / total) * plotW - gap / 2);
              const el = (
                <g key={p.phase}>
                  <rect x={x} y={y} width={w} height={barH} rx={3} fill={PHASE_COLORS[p.phase]}>
                    <title>{`${l.client} · ${p.phase}: ${Math.round((p.views / total) * 100)}% of amplification views (${fmt(p.views)}), ${p.posts} posts, ${Math.round(p.coreViewShare * 100)}% from the recurring core`}</title>
                  </rect>
                  {w > 40 && <text x={x + w / 2} y={y + barH / 2 + 5} textAnchor="middle" fontSize="13" fontWeight={500} fill="#fff">{Math.round((p.views / total) * 100)}%</text>}
                </g>
              );
              x += w + gap / 2;
              return el;
            })}
            <text x={W - 118} y={y + barH / 2 + 5} fontSize="13" fill={MUTED}>{Math.round(late * 100)}% after 1h</text>
          </g>
        );
      })}
      <g transform={`translate(${labelW}, ${H - 8})`} fontSize="13" fill={MUTED}>
        {Object.entries(PHASE_COLORS).map(([k, c], i) => (
          <g key={k} transform={`translate(${i * 130}, 0)`}><rect x={0} y={-11} width={12} height={12} rx={2} fill={c} /><text x={17} y={0}>{k === "0-1h" ? "first hour" : k === "1-6h" ? "hours 1–6" : "hours 6 – day 7"}</text></g>
        ))}
      </g>
    </svg>
  );
}

// Chart B: Who carries which hour. Heatmap: share of each phase's views from accounts recurring in >=3 launches.
// Sequential single-hue ramp (light to dark blue); text flips to white on dark cells.
const ramp = (t: number) => { const c = [[232, 241, 251], [29, 79, 145]]; const mix = (i: number) => Math.round(c[0][i] + (c[1][i] - c[0][i]) * Math.min(1, Math.max(0, t))); return `rgb(${mix(0)},${mix(1)},${mix(2)})`; };
export function CoreHeatmap({ launches }: { launches: LaunchMetrics[] }) {
  const W = 760, labelW = 150, cellW = 190, cellH = 40, H = launches.length * cellH + 46;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Share of each phase's views from recurring core accounts">
      {[["0-1h", "first hour"], ["1-6h", "hours 1 to 6"], ["6h-7d", "hours 6 to day 7"]].map(([, l], j) => <text key={l} x={labelW + j * cellW + cellW / 2} y={16} textAnchor="middle" fontSize="13" fill={MUTED}>{l}</text>)}
      {launches.map((l, i) => (
        <g key={l.launch} transform={`translate(0, ${28 + i * cellH})`}>
          <text x={labelW - 12} y={cellH / 2 + 5} textAnchor="end" fontSize="14" fill={INK}>{l.client.replace(" (Clark)", "")}</text>
          {l.phases.map((p, j) => (
            <g key={p.phase}>
              <rect x={labelW + j * cellW + 2} y={2} width={cellW - 4} height={cellH - 4} rx={5} fill={ramp(p.coreViewShare)}>
                <title>{`${l.client}, ${p.phase}: ${Math.round(p.coreViewShare * 100)}% of views from ${p.corePosts} core posts (of ${p.posts})`}</title>
              </rect>
              <text x={labelW + j * cellW + cellW / 2} y={cellH / 2 + 5} textAnchor="middle" fontSize="14" fontWeight={500} fill={p.coreViewShare > 0.45 ? "#fff" : INK}>{Math.round(p.coreViewShare * 100)}%</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

// Chart C — Reach vs founder followers, log–log. Nine dots; the story is that they don't line up.
export function ReachScatter({ launches }: { launches: LaunchMetrics[] }) {
  const W = 420, H = 260, m = { l: 48, r: 16, t: 12, b: 34 };
  const xs = launches.map((l) => Math.log10(Math.max(1000, l.anchorFollowers))), ys = launches.map((l) => Math.log10(l.anchorViews));
  const x0 = 3.5, x1 = 6, y0 = 6, y1 = 8;
  const sx = (v: number) => m.l + ((v - x0) / (x1 - x0)) * (W - m.l - m.r), sy = (v: number) => H - m.b - ((v - y0) / (y1 - y0)) * (H - m.t - m.b);
  const ticks = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Anchor views versus founder followers, log scales">
      {ticks(4, 6).map((t) => <g key={t}><line x1={sx(t)} x2={sx(t)} y1={m.t} y2={H - m.b} stroke={LINE} /><text x={sx(t)} y={H - m.b + 14} textAnchor="middle" fontSize="10" fill={MUTED}>{fmt(10 ** t)}</text></g>)}
      {ticks(6, 8).map((t) => <g key={t}><line x1={m.l} x2={W - m.r} y1={sy(t)} y2={sy(t)} stroke={LINE} /><text x={m.l - 6} y={sy(t) + 3} textAnchor="end" fontSize="10" fill={MUTED}>{fmt(10 ** t)}</text></g>)}
      <text x={(m.l + W - m.r) / 2} y={H - 4} textAnchor="middle" fontSize="10" fill={MUTED}>founder followers</text>
      <text transform={`translate(10, ${(m.t + H - m.b) / 2}) rotate(-90)`} textAnchor="middle" fontSize="10" fill={MUTED}>anchor views</text>
      {launches.map((l, i) => (
        <g key={l.launch}>
          <circle cx={sx(xs[i])} cy={sy(ys[i])} r={5} fill="#2a78d6" stroke="var(--panel)" strokeWidth={2}><title>{`${l.client}: ${fmt(l.anchorFollowers)} followers → ${fmt(l.anchorViews)} views (${Math.round(l.viewsPerFollower)}×)`}</title></circle>
          <text x={sx(xs[i]) + 8} y={sy(ys[i]) + 4} fontSize="10" fill={INK}>{l.client.replace(" (Clark)", "")}</text>
        </g>
      ))}
    </svg>
  );
}

// Chart D — The same accounts, launch after launch. Presence grid for the most-recurring accounts.
export function RecurrenceGrid({ recurrence, launches, n = 12 }: { recurrence: Recurrence[]; launches: LaunchMetrics[]; n?: number }) {
  const rows = recurrence.slice(0, n), cols = launches.map((l) => l.launch);
  const W = 540, labelW = 176, cell = 26, H = rows.length * cell + 40;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Which recurring accounts appeared in which launches">
      {cols.map((c, j) => <text key={c} transform={`translate(${labelW + j * cell + cell / 2}, 30) rotate(-45)`} fontSize="10" fill={MUTED}>{launches[j].client.replace(" (Clark)", "").slice(0, 10)}</text>)}
      {rows.map((r, i) => (
        <g key={r.handle} transform={`translate(0, ${38 + i * cell})`}>
          {r.avatar && <image href={r.avatar.replace("_normal", "_bigger")} x={labelW - 30} y={cell / 2 - 9} width={18} height={18} clipPath="inset(0 round 9px)" style={{ clipPath: "circle(9px at 9px 9px)" }} />}
          <text x={labelW - 36} y={cell / 2 + 4} textAnchor="end" fontSize="11" fill={INK} fontFamily="ui-monospace, Menlo, monospace">@{r.handle}</text>
          {cols.map((c, j) => {
            const on = r.launches.includes(c);
            return <circle key={c} cx={labelW + j * cell + cell / 2} cy={cell / 2} r={on ? 6 : 2.5} fill={on ? "#3987e5" : LINE}><title>{on ? `@${r.handle} · ${launches[j].client} · first seen ${Math.round(r.earliestMinutes[c])} min after anchor` : `@${r.handle} not seen in ${launches[j].client}`}</title></circle>;
          })}
          <text x={labelW + cols.length * cell + 8} y={cell / 2 + 4} fontSize="11" fill={MUTED}>{r.launches.length}/9 · {fmt(r.followers)} f</text>
        </g>
      ))}
    </svg>
  );
}
