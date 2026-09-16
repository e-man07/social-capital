import Link from "next/link";
import { notFound } from "next/navigation";
import { getMetrics, getGraph, getLaunchConfig, getFindings, fmt, pct, mins } from "@/lib/data";
import { LAUNCHES } from "@/harness/config";
import { WaveBars, Stat } from "@/components/Bars";
import { PhasePanel } from "@/components/Phases";
import { CascadeTree } from "@/components/CascadeTree";
import { cascadeTree } from "@/lib/tree";
import type { Node } from "@/harness/extract";

export const dynamic = "force-static";
export function generateStaticParams() { return LAUNCHES.map((l) => ({ slug: l.slug })); }

type XPost = Extract<Node, { kind: "post"; platform: "x" }>;

export default async function LaunchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMetrics()?.launches.find((l) => l.launch === slug);
  const g = getGraph(slug);
  const cfg = getLaunchConfig(slug);
  if (!m || !g || !cfg) notFound();
  const f = getFindings();
  const core = new Map((getMetrics()?.recurrence ?? []).filter((r) => r.launches.length >= 3).map((r) => [r.handle.toLowerCase(), r.launches.length]));
  const tree = cascadeTree(g, core);
  const posts = g.nodes.filter((n): n is XPost => n.kind === "post" && n.platform === "x");
  const gen1 = posts.filter((p) => p.gen === 1).sort((a, b) => a.minutesAfterAnchor - b.minutesAfterAnchor);
  const topQuotes = [...posts.filter((p) => p.gen === 1 || p.gen === 2)].sort((a, b) => b.views - a.views).slice(0, 12);
  const label = (id: string) => f?.classifications?.[id];
  const timeline = [
    { t: 0, label: `X anchor by @${m.anchorAuthor}`, detail: `${fmt(m.anchorViews)} views · ${fmt(m.anchorLikes)} likes · ${fmt(m.anchorRetweets)} RTs · ${fmt(m.anchorReplies)} replies · ${m.anchorQuotes} quotes` },
    ...m.crossPlatform.map((c) => ({ t: c.minutesAfterAnchor ?? Infinity, label: c.label, detail: c.detail })),
    ...m.founderFollowups.map((x) => ({ t: x.minutes, label: `Founder follow-up${x.quotesAnchor ? " (quotes anchor)" : ""}`, detail: `${fmt(x.views)} views · ${x.text}` })),
  ].sort((a, b) => a.t - b.t);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-xs muted">← all launches</Link>
        <h1 className="text-2xl tracking-tight mt-1 break-words">{m.client} <span className="muted text-base">· {m.category} · {new Date(m.anchorAt).toUTCString().replace(":00 GMT", " UTC")}</span></h1>
        <p className="text-sm muted mt-1 max-w-3xl">{posts.find((p) => p.gen === 0)?.text.slice(0, 220)}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
        <Stat label="Anchor reach" value={fmt(m.anchorViews)} sub={`${fmt(m.anchorFollowers)} followers → ${Math.round(m.viewsPerFollower)}× views/follower`} />
        <Stat label="Structural virality" value={m.structuralVirality.toFixed(2)} sub={`max depth ${m.maxDepth} · gen-2 ${m.generations[1].n} posts`} />
        <Stat label="Gen-1 quotes indexed" value={`${m.generations[0].n}`} sub={`of ${m.anchorQuotes} live (${pct(m.coverage.gen1Recall)} recall)`} />
        <Stat label="First 60 minutes" value={`${m.first60m.n} quotes`} sub={`${pct(m.first60m.viewShare)} of quote-side views · median ${fmt(m.first60m.medianFollowers)} followers`} />
        <Stat label="Non-quoting launch-week posts" value={String(m.standalone.nonQuoting)} sub={`${fmt(m.standalone.nonQuotingViews)} views vs ${fmt(m.quoteSideViews)} in the quote cascade`} />
      </div>

      <section className="panel p-3 sm:p-5">
        <CascadeTree data={tree} client={m.client} size={560} />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="panel p-4 space-y-3">
          <div className="font-medium">When did quote-side reach arrive?</div>
          <WaveBars waves={m.waves} />
          <div className="text-xs muted">Share of all indexed quote views by time since the anchor. Half of the indexed quotes had appeared by {mins(m.minutesTo50pctQuotes)}. Top 10 posts hold {pct(m.top10ViewShare)} of quote-side views.</div>
        </div>
        <div className="panel p-4 space-y-2">
          <div className="font-medium">Cross-platform timeline</div>
          <ol className="space-y-1.5 text-sm">
            {timeline.map((e, i) => (
              <li key={i} className="grid gap-2" style={{ gridTemplateColumns: "64px 1fr" }}>
                <span className="mono text-xs muted pt-0.5">{Number.isFinite(e.t) ? mins(e.t) : "?"}</span>
                <span><span>{e.label}</span><div className="text-xs muted">{e.detail}</div></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="space-y-2">
        <div className="font-medium">Who carried each phase</div>
        <p className="text-xs muted">&ldquo;Core&rdquo; = accounts that appear in the amplification of ≥3 of the nine claimed launches. Amplification here = quotes, quotes-of-quotes and launch-week standalone posts.</p>
        <PhasePanel m={m} />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="panel overflow-x-auto">
          <div className="p-4 pb-2 font-medium">First 25 quoters, in order</div>
          <table className="w-full min-w-[520px]">
            <thead><tr><th>t</th><th>Account</th><th>Followers</th><th>Views</th><th>Text</th></tr></thead>
            <tbody>
              {gen1.slice(0, 25).map((p) => (
                <tr key={p.id}>
                  <td className="mono muted">{mins(p.minutesAfterAnchor)}</td>
                  <td className="mono"><a href={`https://x.com/${p.author}/status/${p.id.slice(2)}`} target="_blank" rel="noreferrer">@{p.author}</a>{label(p.id) && <div className="text-[10px] muted">{label(p.id)}</div>}</td>
                  <td className="mono">{fmt(p.followers)}</td>
                  <td className="mono">{fmt(p.views)}</td>
                  <td className="muted text-xs">{p.text.slice(0, 90)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel overflow-x-auto">
          <div className="p-4 pb-2 font-medium">Highest-reach quote-side posts</div>
          <table className="w-full min-w-[520px]">
            <thead><tr><th>t</th><th>Account</th><th>Gen</th><th>Views</th><th>Text</th></tr></thead>
            <tbody>
              {topQuotes.map((p) => (
                <tr key={p.id}>
                  <td className="mono muted">{mins(p.minutesAfterAnchor)}</td>
                  <td className="mono"><a href={`https://x.com/${p.author}/status/${p.id.slice(2)}`} target="_blank" rel="noreferrer">@{p.author}</a><div className="text-[10px] muted">{fmt(p.followers)} f{label(p.id) ? ` · ${label(p.id)}` : ""}</div></td>
                  <td className="mono">{String(p.gen)}</td>
                  <td className="mono">{fmt(p.views)}</td>
                  <td className="muted text-xs">{p.text.slice(0, 90)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel overflow-x-auto">
        <div className="p-4 pb-2"><span className="font-medium">Launch-week posts that never quoted the anchor</span> <span className="muted text-sm">({m.standalone.nonQuoting} of {m.standalone.n} search hits; {m.standalone.quoting} were already in the cascade</span></div>
        <table className="w-full min-w-[520px]">
          <thead><tr><th>t</th><th>Account</th><th>Followers</th><th>Views</th><th>Text</th></tr></thead>
          <tbody>
            {m.standalone.topNonQuoting.map((p, i) => (
              <tr key={i}>
                <td className="mono muted">{mins(p.minutes)}</td>
                <td className="mono">@{p.handle}</td>
                <td className="mono">{fmt(p.followers)}</td>
                <td className="mono">{fmt(p.views)}</td>
                <td className="muted text-xs">{p.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="text-xs muted space-y-1">
        <div>Coverage: gen-1 {m.coverage.gen1Returned}/{m.coverage.gen1LiveCounter} quotes indexed; gen-2 expanded {m.coverage.gen2Parents} parents → {m.coverage.gen2Returned} quotes; {m.coverage.searchHits} search hits ({m.coverage.searchAlreadyInCascade} overlapping the cascade). Retweets ({fmt(m.anchorRetweets)}) cannot be time-placed and are excluded from the wave chart.</div>
        <div>Timing shows what followed what. It does not show that one post caused another, or that any account was briefed or paid.</div>
      </section>
    </div>
  );
}
