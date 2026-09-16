import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { LaunchMetrics, Recurrence } from "@/harness/metrics";
import type { Graph } from "@/harness/extract";
import type { Findings } from "@/harness/agents/analysis-agent";
import { LAUNCHES } from "@/harness/config";

const DATA = join(process.cwd(), "data");
const read = <T,>(p: string): T | null => (existsSync(p) ? (JSON.parse(readFileSync(p, "utf8")) as T) : null);

export type Metrics = { generatedAt: string; launches: LaunchMetrics[]; recurrence: Recurrence[] };
export const getMetrics = () => read<Metrics>(join(DATA, "metrics.json"));
export const getGraph = (slug: string) => read<Graph>(join(DATA, "graph", `${slug}.json`));
export const getFindings = () => read<Findings>(join(DATA, "findings.json"));
export const getLaunchConfig = (slug: string) => LAUNCHES.find((l) => l.slug === slug) ?? null;
export const fmt = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}K` : String(Math.round(n)));
export const pct = (x: number) => `${Math.round(x * 100)}%`;
export const mins = (m: number | null) => m === null ? "n/a" : Math.abs(m) < 60 ? `${m >= 0 ? "+" : "−"}${Math.abs(Math.round(m))}m` : Math.abs(m) < 1440 ? `${m >= 0 ? "+" : "−"}${(Math.abs(m) / 60).toFixed(1)}h` : `${m >= 0 ? "+" : "−"}${(Math.abs(m) / 1440).toFixed(1)}d`;
