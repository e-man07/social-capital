import { fmt, pct, mins } from "@/lib/data";
import type { LaunchMetrics } from "@/harness/metrics";

const shade = (x: number) => `rgba(245,197,66,${0.08 + x * 0.55})`;

// Cross-launch matrix: for each launch and phase, the share of that phase's views coming from the recurring core.
export function PhaseMatrix({ launches }: { launches: LaunchMetrics[] }) {
  const phases = launches[0]?.phases.map((p) => p.phase) ?? [];
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead><tr><th>Launch</th>{phases.map((p) => <th key={p}>{p}: core share of views</th>)}<th>Views by phase</th></tr></thead>
        <tbody>
          {launches.map((l) => (
            <tr key={l.launch}>
              <td>{l.client}</td>
              {l.phases.map((p) => (
                <td key={p.phase} className="mono" style={{ background: shade(p.coreViewShare) }}>
                  {pct(p.coreViewShare)} <span className="muted">· {p.corePosts}/{p.posts} posts</span>
                </td>
              ))}
              <td className="mono text-xs muted">{l.phases.map((p) => `${p.phase} ${fmt(p.views)}`).join(" · ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Per-launch: who carried each phase — top recurring-core posts vs top non-core posts.
export function PhasePanel({ m }: { m: LaunchMetrics }) {
  return (
    <div className="grid md:grid-cols-3 gap-3">
      {m.phases.map((p) => (
        <div key={p.phase} className="panel p-3 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="font-medium">{p.phase}</span>
            <span className="mono text-xs muted">{p.posts} posts · {fmt(p.views)} views</span>
          </div>
          <div className="text-sm"><span className="mono accent">{pct(p.coreViewShare)}</span> <span className="muted">of views from accounts recurring in ≥3 launches ({p.corePosts} posts)</span></div>
          <div className="text-[11px] uppercase tracking-wide muted pt-1">Core</div>
          {p.topCore.length === 0 && <div className="text-xs muted">none in this window</div>}
          {p.topCore.map((x, i) => (
            <div key={i} className="text-xs leading-snug"><span className="mono">@{x.handle}</span> <span className="muted">({x.launches} launches, {mins(x.minutes)}, {fmt(x.views)} v)</span><div className="muted">{x.text}</div></div>
          ))}
          <div className="text-[11px] uppercase tracking-wide muted pt-1">Non-core</div>
          {p.topNonCore.map((x, i) => (
            <div key={i} className="text-xs leading-snug"><span className="mono">@{x.handle}</span> <span className="muted">({fmt(x.followers)} f, {mins(x.minutes)}, {fmt(x.views)} v)</span><div className="muted">{x.text}</div></div>
          ))}
        </div>
      ))}
    </div>
  );
}
