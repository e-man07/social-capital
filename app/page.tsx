import Link from "next/link";
import { getMetrics, getFindings, getGraph, fmt, pct, mins } from "@/lib/data";
import { AskGraph } from "@/components/AskGraph";
import { PhaseStack, CoreHeatmap, RecurrenceGrid } from "@/components/Charts";
import { CascadeExplorer } from "@/components/CascadeTree";
import { SystemDiagram } from "@/components/SystemDiagram";
import { cascadeTree } from "@/lib/tree";

export const dynamic = "force-static";
const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

export default function Home() {
  const m = getMetrics();
  const f = getFindings();
  if (!m) return <p className="muted">No data yet. Run <code className="mono">pnpm harness</code>.</p>;
  const L = m.launches;
  const core = new Map(m.recurrence.filter((r) => r.launches.length >= 3).map((r) => [r.handle.toLowerCase(), r.launches.length]));
  const trees = L.map((l) => ({ slug: l.launch, client: l.client, tree: cascadeTree(getGraph(l.launch)!, core) }));
  const lateShare = median(L.map((l) => { const t = l.phases.reduce((a, p) => a + p.views, 0) || 1; return (l.phases[1].views + l.phases[2].views) / t; }));

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Headline + the one insight */}
      <section className="space-y-8">
        <h1 className="text-[28px] sm:text-3xl md:text-[40px] tracking-tight leading-[1.15] max-w-3xl font-medium">
          How do Social Capital&apos;s &ldquo;viral launches&rdquo; actually spread?
        </h1>
        <p className="muted max-w-2xl text-[15px] leading-relaxed">
          Nine launches they publicly claim, reconstructed from public X and LinkedIn data: who posted, when, and how far it travelled.
        </p>

        <div className="rounded-lg border-l-4 border-black bg-neutral-50 border border-neutral-200 p-4 sm:p-6 md:p-8 max-w-4xl space-y-4">
          <div className="text-xs uppercase tracking-wider muted">The unusual insight</div>
          <p className="text-xl sm:text-2xl md:text-[28px] leading-snug tracking-tight font-medium">
            The launch post is not the launch. Most of the reach comes from the same ~60 accounts posting in the days <em>after</em> launch day, and their biggest posts are about the founder, not the product.
          </p>
          <div className="grid md:grid-cols-3 gap-5 text-sm leading-relaxed pt-2">
            <div><div className="font-medium">Why it is unusual</div><div className="muted">Everyone, including Social Capital&apos;s own pitch, treats the launch post and the first-hour burst as the event. In the data the first hour is 13% of the reach. The following six days are 87%.</div></div>
            <div><div className="font-medium">Who carries it</div><div className="muted">61 accounts appear in three or more of the nine launches, across HR software, fintech, voice AI, slides and ads. The largest day-2 to day-7 posts come from this group.</div></div>
            <div><div className="font-medium">What they post</div><div className="muted">Not the launch video. Founder backstory: &ldquo;be Tanay Kothari, spawn in Delhi, attend DPS RK Puram...&rdquo; (766K views from a 20K-follower account). On Wispr Flow, Cartesia and Icon these out-reach the launch-day content.</div></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-lg overflow-hidden max-w-2xl">
          {[
            [pct(lateShare), "of reach arrives after the first hour (median of 9 launches)"],
            [String(core.size), "accounts recur in 3 or more launches"],
            ["2 hops", `how far any post travels · structural virality ${median(L.map((l) => l.structuralVirality)).toFixed(1)}, where 2.0 is pure broadcast`],
          ].map(([v, s]) => (
            <div key={s} className="bg-white p-4 min-w-0"><div className="text-2xl font-medium tracking-tight">{v}</div><div className="text-xs muted mt-1">{s}</div></div>
          ))}
        </div>
        <p className="text-xs muted max-w-2xl">Timing shows sequence, not cause. Recurrence shows association, not payment. Sources and limits are at the bottom of the page.</p>
      </section>

      {/* The tree */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between flex-wrap gap-x-4 gap-y-1">
          <h2 className="text-2xl font-medium tracking-tight">The distribution graph</h2>
          <span className="text-xs muted">centre = founder&apos;s post · rings = who quoted it, and who quoted them · clockwise from top = time</span>
        </div>
        <div className="panel p-3 sm:p-5">
          <CascadeExplorer trees={trees} />
        </div>
        <p className="text-sm muted max-w-3xl">Nothing spreads past the second ring. Hover a face for the post; black-ringed faces are accounts that appear in three or more of the nine launches.</p>
      </section>

      {/* Timing */}
      <section className="space-y-3">
        <h2 className="text-2xl font-medium tracking-tight">When the reach arrives</h2>
        <p className="text-sm muted max-w-2xl">Share of amplification views by time after the founder&apos;s post. On eight of nine launches most of the reach lands after the first hour.</p>
        <div className="panel p-3 sm:p-6 overflow-x-auto scroll-hint"><div className="min-w-[640px]"><PhaseStack launches={L} /></div></div>
      </section>

      {/* Core */}
      <section className="space-y-3">
        <h2 className="text-2xl font-medium tracking-tight">Who carries which hour</h2>
        <p className="text-sm muted max-w-2xl">Of the views in each window, how much came from the recurring core (accounts in 3 or more launches). Dark blue means the core did it. The core is usually a minority of the first hour and shows up in hours 1 to 6 and again on days 1 to 7.</p>
        <div className="panel p-3 sm:p-6 max-w-4xl overflow-x-auto scroll-hint"><div className="min-w-[560px]"><CoreHeatmap launches={L} /></div></div>
      </section>

      {/* Recurrence */}
      <section className="space-y-2">
        <h2 className="text-2xl font-medium tracking-tight">The same accounts, launch after launch</h2>
        <p className="text-xs muted">Icon is AI ads, Deel is HR, Airwallex is fintech, Cartesia is voice AI, Gamma is slides. The same accounts amplify all of them. Recurrence is an association, not proof of a paid relationship.</p>
        <div className="panel p-3 sm:p-4 max-w-3xl overflow-x-auto scroll-hint"><div className="min-w-[540px]"><RecurrenceGrid recurrence={m.recurrence} launches={L} /></div></div>
      </section>

      {/* How it works */}
      <section className="space-y-2">
        <h2 className="text-2xl font-medium tracking-tight">How this was built</h2>
        <div className="panel p-4 sm:p-8"><SystemDiagram /></div>
      </section>

      <AskGraph />

      {/* Folded detail */}
      <section id="details" className="space-y-2">
        <h2 className="text-2xl font-medium tracking-tight">Data</h2>
        <details className="panel px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium">Per-launch numbers</summary>
          <div className="overflow-x-auto mt-3">
            <table className="w-full min-w-[900px]">
              <thead><tr><th>Launch</th><th>Anchor</th><th>Followers</th><th>Views</th><th>×/follower</th><th>Gen-1 quotes (recall)</th><th>SV</th><th>First 60m</th><th>Top-10 share</th><th>Non-quoting posts</th><th>LinkedIn twin</th></tr></thead>
              <tbody>
                {L.map((l) => (
                  <tr key={l.launch}>
                    <td><Link href={`/launch/${l.launch}`}>{l.client}</Link><div className="text-xs muted">{l.category} · {l.anchorAt.slice(0, 10)}</div></td>
                    <td className="mono">@{l.anchorAuthor}</td><td className="mono">{fmt(l.anchorFollowers)}</td><td className="mono">{fmt(l.anchorViews)}</td><td className="mono">{Math.round(l.viewsPerFollower)}×</td>
                    <td className="mono">{l.generations[0].n} <span className="muted">({pct(l.coverage.gen1Recall)})</span></td><td className="mono">{l.structuralVirality.toFixed(2)}</td>
                    <td className="mono">{l.first60m.n} <span className="muted">· {pct(l.first60m.viewShare)} · med {fmt(l.first60m.medianFollowers)} f</span></td>
                    <td className="mono">{pct(l.top10ViewShare)}</td><td className="mono">{l.standalone.nonQuoting} <span className="muted">· {fmt(l.standalone.nonQuotingViews)} v</span></td>
                    <td className="mono">{l.crossPlatform[0]?.platform === "linkedin" ? `${mins(l.crossPlatform[0].minutesAfterAnchor)} · ${l.crossPlatform[0].detail}` : "n/a"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs muted mt-2">SV = structural virality (mean pairwise distance in the quote tree; 2 = every quote points at the anchor). Recall = quotes X&apos;s index still returns ÷ the live counter; missing quotes are overwhelmingly low-view.</p>
        </details>
        <details className="panel px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium">Analysis agent: {f ? `${f.findings.length} hypothesis tests` : "not run"}</summary>
          {f && (
            <div className="mt-3 space-y-2">
              <p className="text-sm">{f.headline}</p>
              <ul className="space-y-1.5">
                {f.findings.map((x, i) => (
                  <li key={i} className="text-sm leading-relaxed">
                    <span className={`mono text-[11px] px-1.5 py-0.5 rounded mr-2 ${x.label === "observed" ? "bg-emerald-50 text-emerald-700" : x.label === "inferred" ? "bg-amber-50 text-amber-700" : "bg-neutral-100 text-neutral-500"}`}>{x.label} · {x.confidence}</span>
                    {x.claim}{x.caveat && <span className="muted"> ({x.caveat})</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </details>
        <details className="panel px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium">All recurring accounts: {m.recurrence.length} in ≥2 launches</summary>
          <div className="overflow-x-auto mt-3">
            <table className="w-full min-w-[700px]">
              <thead><tr><th>Account</th><th>Followers</th><th>Launches</th><th>Categories</th><th>Earliest appearance</th><th>Views</th></tr></thead>
              <tbody>{m.recurrence.slice(0, 60).map((r) => (
                <tr key={r.handle}><td className="mono">@{r.handle}</td><td className="mono">{fmt(r.followers)}</td><td className="mono">{r.launches.length}: <span className="muted">{r.launches.join(", ")}</span></td><td className="mono">{r.categories.length}</td><td className="mono text-xs">{Object.entries(r.earliestMinutes).map(([k, v]) => `${k} ${mins(v)}`).join(" · ")}</td><td className="mono">{fmt(r.totalViews)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </details>
        <details className="panel px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium">How it was built &amp; what it can&apos;t know</summary>
          <div className="grid md:grid-cols-2 gap-4 text-sm leading-relaxed mt-3">
            <ul className="list-disc pl-5 muted space-y-1">
              <li>Harness: Research Agent → X / LinkedIn / Web collectors → evidence graph → metrics → Analysis Agent. ~$0.15 of OpenAI (gpt-5.6-luna), &lt;$3 of X data.</li>
              <li>Quote tweets from X&apos;s search index; live counters via fxtwitter; quotes-of-quotes for the top 30 quoted posts; launch-week posts that never quoted the anchor.</li>
              <li>LinkedIn reactions/comments logged-out; timestamps decoded from activity IDs.</li>
            </ul>
            <ul className="list-disc pl-5 muted space-y-1">
              <li>Whether any account was briefed or paid; only recurrence and timing are observable.</li>
              <li>Causation: a post at +11 min followed the anchor; nothing shows it was caused by it.</li>
              <li>Retweet timing, LinkedIn reposts and views; deleted quotes (recall 17–61% per launch, missing ones are low-view); launches without a published anchor (Lovable).</li>
            </ul>
          </div>
        </details>
      </section>
    </div>
  );
}
