import { createHash } from "node:crypto";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CACHE_DIR = join("data", "raw");
mkdirSync(CACHE_DIR, { recursive: true });

// Every outbound request is cached by URL so reruns never re-hit a paid API.
export async function cachedFetch(url: string, init: RequestInit = {}, opts: { ttlMs?: number } = {}): Promise<{ status: number; body: string; cached: boolean }> {
  const key = createHash("sha1").update(url + JSON.stringify(init.headers ?? {})).digest("hex");
  const file = join(CACHE_DIR, key + ".json");
  if (existsSync(file)) {
    const rec = JSON.parse(readFileSync(file, "utf8"));
    if (!opts.ttlMs || Date.now() - rec.at < opts.ttlMs) return { ...rec, cached: true };
  }
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, init);
      const body = await res.text();
      if (res.status >= 500 || res.status === 429) throw new Error(`HTTP ${res.status}`);
      const rec = { status: res.status, body, at: Date.now(), url };
      writeFileSync(file, JSON.stringify(rec));
      return { ...rec, cached: false };
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw lastErr;
}

export function writeJson(path: string, data: unknown) {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
}
export function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}
