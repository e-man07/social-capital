import { cachedFetch } from "../lib/http";

export type WebPage = { url: string; title: string; publishedAt: string | null; excerpt: string; xHandlesMentioned: string[]; fetchedOk: boolean };

// Press / blog coverage: we only need title, publish time and which X handles the article embeds.
export async function webPage(url: string): Promise<WebPage> {
  try {
    const { status, body } = await cachedFetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; launch-graph-research/0.1)" } });
    if (status !== 200) return { url, title: "", publishedAt: null, excerpt: "", xHandlesMentioned: [], fetchedOk: false };
    const meta = (p: string) => body.match(new RegExp(`<meta[^>]+(?:property|name)=["']${p}["'][^>]+content=["']([^"']+)["']`, "i"))?.[1] ?? body.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${p}["']`, "i"))?.[1] ?? null;
    const title = meta("og:title") ?? body.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
    const publishedAt = meta("article:published_time") ?? meta("datePublished") ?? body.match(/"datePublished":"([^"]+)"/)?.[1] ?? null;
    const text = body.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const handles = [...new Set([...body.matchAll(/(?:x|twitter)\.com\/([A-Za-z0-9_]{2,15})\/status\//g)].map((m) => m[1]).filter((h) => !["i", "intent", "share"].includes(h)))];
    return { url, title, publishedAt, excerpt: text.slice(0, 1200), xHandlesMentioned: handles, fetchedOk: true };
  } catch {
    return { url, title: "", publishedAt: null, excerpt: "", xHandlesMentioned: [], fetchedOk: false };
  }
}
