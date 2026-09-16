"use client";
import { useState } from "react";

// "Ask the graph": free-form questions answered by an LLM that can only query the evidence graph
// through deterministic tools (no browsing, no memory of the launches). Needs OPENAI_API_KEY server-side.
export function AskGraph() {
  const [q, setQ] = useState("Which accounts quoted both Wispr Flow and Cartesia within the first hour?");
  const [a, setA] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const ask = async () => {
    setBusy(true); setA(null);
    try {
      const r = await fetch("/api/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question: q }) });
      if (!r.ok || !r.body) { const j = await r.json().catch(() => ({})); setA(j.error ?? `Error ${r.status}`); return; }
      const reader = r.body.getReader(); const dec = new TextDecoder(); let acc = "";
      for (;;) { const { value, done } = await reader.read(); if (done) break; acc += dec.decode(value, { stream: true }); setA(acc); }
    } catch (e) { setA(String(e)); } finally { setBusy(false); }
  };
  return (
    <section id="ask" className="space-y-2">
      <h2 className="text-2xl font-medium tracking-tight">Ask the graph</h2>
      <p className="text-xs muted">Answered only from the evidence graph via query tools. The model cannot browse or invent posts.</p>
      <div className="panel p-3 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !busy && ask()} className="flex-1 min-w-0 bg-transparent outline-none text-sm px-2" placeholder="Ask about timing, accounts, recurrence…" />
        <button onClick={ask} disabled={busy} className="text-sm px-3 py-1.5 rounded" style={{ background: "#000", color: "#fff" }}>{busy ? "Thinking…" : "Ask"}</button>
      </div>
      {a && <div className="panel p-4 text-sm whitespace-pre-wrap leading-relaxed">{a}</div>}
    </section>
  );
}
