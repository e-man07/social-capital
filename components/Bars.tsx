// Minimal inline bar chart: one row per bucket, bar = view share, label = n posts / median followers.
export function WaveBars({ waves }: { waves: { window: string; n: number; views: number; viewShare: number; medianFollowers: number }[] }) {
  const max = Math.max(...waves.map((w) => w.viewShare), 0.01);
  return (
    <div className="space-y-1.5">
      {waves.map((w) => (
        <div key={w.window} className="grid items-center gap-2" style={{ gridTemplateColumns: "48px 1fr minmax(110px, 150px)" }}>
          <span className="mono text-xs muted">{w.window}</span>
          <div className="h-4 rounded-sm" style={{ background: "#f2f2f2" }}>
            <div className="h-4 rounded-sm" style={{ width: `${(w.viewShare / max) * 100}%`, background: w.window.startsWith("0-") || w.window.startsWith("30-") ? "#2a78d6" : "#1baf7a" }} />
          </div>
          <span className="mono text-xs muted">{Math.round(w.viewShare * 100)}% · {w.n} posts · med {w.medianFollowers >= 1000 ? `${Math.round(w.medianFollowers / 1000)}K` : w.medianFollowers} f</span>
        </div>
      ))}
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="panel p-3">
      <div className="text-[11px] uppercase tracking-wide muted">{label}</div>
      <div className="text-xl mt-1">{value}</div>
      {sub && <div className="text-xs muted mt-0.5">{sub}</div>}
    </div>
  );
}
