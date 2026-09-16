import "./lib/env";
import { execSync } from "node:child_process";

// Pipeline: collect (deterministic) -> [research agent, if OPENAI_API_KEY] -> extract -> metrics -> [analysis agent, if key]
const step = (label: string, cmd: string) => { console.log(`\n== ${label}`); execSync(cmd, { stdio: "inherit" }); };
const hasKey = !!process.env.OPENAI_API_KEY;
step("collect", "pnpm exec tsx harness/collect.ts");
if (hasKey) step("research agent", "pnpm exec tsx harness/agents/research-agent.ts"); else console.log("\n== research agent: skipped (no OPENAI_API_KEY)");
step("extract", "pnpm exec tsx harness/extract.ts");
step("metrics", "pnpm exec tsx harness/metrics.ts");
if (hasKey) step("analysis agent", "pnpm exec tsx harness/agents/analysis-agent.ts"); else console.log("\n== analysis agent: skipped (no OPENAI_API_KEY)");
