import { openai } from "@ai-sdk/openai";
import { pruneMessages, type ModelMessage, type StepResult, type ToolSet } from "ai";

// One cheap model everywhere. Luna is ~10x cheaper than gpt-4o and newer; the deterministic tools do the
// heavy lifting, so the LLM only needs to route, characterise and summarise.
export const MODEL_ID = "gpt-5.6-luna";
export const luna = () => openai(MODEL_ID);

// Provider options: low reasoning effort (reasoning tokens bill as output) and a stable cache key so
// OpenAI routes every step of the same run to the same prompt-cache shard.
export const providerOptions = (cacheKey: string, effort: "low" | "medium" = "low") => ({
  openai: { reasoningEffort: effort, reasoningSummary: null, promptCacheKey: cacheKey },
});

// Context compaction. Each step resends the whole transcript, so cost grows ~quadratically with steps.
// Once the transcript passes the threshold we drop reasoning parts and tool results older than the last
// few messages. Tool side effects (evidence recording) already happened, so nothing is lost for the graph;
// agents are told to restate anything they still need in their own text.
const estimateTokens = (messages: ModelMessage[]) => JSON.stringify(messages).length / 4;
export const COMPACT_AFTER_TOKENS = 25_000;
export const makeCompactor = (afterTokens = COMPACT_AFTER_TOKENS, keepLast: 4 | 8 = 4) =>
  async ({ messages }: { messages: ModelMessage[] }) =>
    estimateTokens(messages) > afterTokens
      ? { messages: pruneMessages({ messages, reasoning: "all", toolCalls: keepLast === 4 ? "before-last-4-messages" : "before-last-8-messages", emptyMessages: "remove" }) }
      : undefined;
export const compact = makeCompactor();

// Sum usage across steps and print a one-line cost view. Luna list price: $0.20 in / $1.20 out per 1M;
// cached input is discounted (rate varies by tier) — we report the token counts, not a guessed dollar figure for cached.
export function reportUsage(label: string, steps: StepResult<ToolSet>[]) {
  let input = 0, output = 0, cached = 0;
  for (const s of steps) {
    input += s.usage.inputTokens ?? 0;
    output += s.usage.outputTokens ?? 0;
    cached += s.usage.inputTokenDetails?.cacheReadTokens ?? 0;
  }
  const usd = ((input - cached) * 0.2 + cached * 0.05 + output * 1.2) / 1e6; // cached assumed at ~75% off; adjust if your invoice differs
  console.log(`[usage] ${label}: steps=${steps.length} input=${input.toLocaleString()} (cached ${cached.toLocaleString()}) output=${output.toLocaleString()} ≈ $${usd.toFixed(3)}`);
  return { input, output, cached, usd };
}
