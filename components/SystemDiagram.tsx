// System diagram of the harness: a vertical flow, top to bottom, matching the original sketch.
const Box = ({ title, sub, dark, wide }: { title: string; sub?: string; dark?: boolean; wide?: boolean }) => (
  <div className={`rounded-lg border px-6 py-4 text-center ${wide ? "w-full max-w-md" : "w-full sm:w-auto sm:min-w-[180px]"} ${dark ? "bg-black text-white border-black" : "bg-white border-neutral-200"}`}>
    <div className="text-[15px] font-medium">{title}</div>
    {sub && <div className={`text-xs mt-1 ${dark ? "text-neutral-300" : "text-neutral-500"}`}>{sub}</div>}
  </div>
);
const Down = () => <div className="text-neutral-300 text-2xl leading-none py-1">↓</div>;

export function SystemDiagram() {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="text-xs muted mb-2">Social Capital&apos;s 9 claimed launches (anchor posts on sociallcapital.com/work)</div>
      <Down />
      <Box title="Research agent" sub="tool loop · decides what to search, expand and verify" dark wide />
      <Down />
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-md sm:max-w-none">
        <Box title="X" sub="quotes · quotes-of-quotes · search · profiles" />
        <Box title="LinkedIn" sub="public post · ID timestamps" />
        <Box title="Web" sub="press · publish times" />
      </div>
      <Down />
      <Box title="Extractor" sub="UTC via IDs · entity resolution · relevance filter · dedupe" wide />
      <Down />
      <Box title="Evidence graph" sub="posts · accounts · articles: quoted / replied / mentions / twin / covered_by" wide />
      <Down />
      <Box title="Metrics" sub="timing waves · cascade depth · recurrence · who carries which hour" wide />
      <Down />
      <Box title="Analysis agent" sub="tests hypotheses H1–H7 · labels every claim observed / inferred / not determinable" dark wide />
      <Down />
      <Box title="This page" sub="charts · findings · ask the graph" wide />
      <p className="text-sm muted max-w-xl mt-6">Scripts do the fetching; the two agents decide what else to look for and what the numbers support. One full run costs under $3 of X data and about $0.06 of OpenAI (gpt-5.6-luna).</p>
    </div>
  );
}
