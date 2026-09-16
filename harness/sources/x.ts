import { cachedFetch } from "../lib/http";

const BASE = "https://api.twitterapi.io";
const KEY = () => {
  const k = process.env.TWITTER_API_KEY;
  if (!k) throw new Error("TWITTER_API_KEY missing");
  return k;
};

export type XAuthor = { id: string; userName: string; name: string; followers: number; isBlueVerified?: boolean; createdAt?: string; description?: string; profilePicture?: string };
export type XTweet = {
  id: string; url?: string; text: string; createdAt: string; author: XAuthor;
  viewCount?: number; likeCount?: number; retweetCount?: number; replyCount?: number; quoteCount?: number; bookmarkCount?: number;
  isReply?: boolean; inReplyToId?: string; conversationId?: string;
  quoted_tweet?: { id?: string; author?: XAuthor } | null;
  entities?: { user_mentions?: { screen_name: string }[] };
  extendedEntities?: { media?: { type: string }[] };
};

async function get(path: string, params: Record<string, string | number | undefined>) {
  const qs = Object.entries(params).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
  const { status, body } = await cachedFetch(`${BASE}${path}?${qs}`, { headers: { "X-API-Key": KEY() } });
  if (status !== 200) throw new Error(`twitterapi.io ${path} -> HTTP ${status}: ${body.slice(0, 200)}`);
  return JSON.parse(body);
}

async function paged(path: string, params: Record<string, string | number | undefined>, maxPages: number): Promise<XTweet[]> {
  const out: XTweet[] = [];
  let cursor = "";
  for (let i = 0; i < maxPages; i++) {
    const d = await get(path, { ...params, cursor });
    out.push(...(d.tweets ?? []));
    if (!d.has_next_page || !d.next_cursor) break;
    cursor = d.next_cursor;
  }
  return out;
}

// Quote tweets of a post. Search-backed on X's side: returns only what X's index still holds,
// so callers must compare length against the anchor's live quote counter (see fxtwitter).
export const quotesOf = (tweetId: string, maxPages = 60) => paged("/twitter/tweet/quotes", { tweetId, includeReplies: "true" }, maxPages);
export const repliesTo = (tweetId: string, maxPages = 5) => paged("/twitter/tweet/replies", { tweetId }, maxPages);
export const search = (query: string, maxPages = 5) => paged("/twitter/tweet/advanced_search", { query, queryType: "Latest" }, maxPages);

export async function userInfo(userName: string): Promise<XAuthor | null> {
  const d = await get("/twitter/user/info", { userName });
  return d.data ?? null;
}

// fxtwitter: free, keyless, returns live counters (views, quotes, replies) for a single post.
export type AnchorMetrics = { id: string; author: string; authorFollowers: number; authorAvatar?: string; createdAt: string; text: string; views: number; likes: number; retweets: number; replies: number; quotes: number; media: string[] };
export async function anchorMetrics(id: string): Promise<AnchorMetrics> {
  const { status, body } = await cachedFetch(`https://api.fxtwitter.com/status/${id}`, {}, { ttlMs: 6 * 3600e3 });
  if (status !== 200) throw new Error(`fxtwitter ${id} -> ${status}`);
  const t = JSON.parse(body).tweet;
  return {
    id, author: t.author.screen_name, authorFollowers: t.author.followers, authorAvatar: t.author.avatar_url, createdAt: new Date(t.created_at).toISOString(), text: t.text,
    views: t.views ?? 0, likes: t.likes ?? 0, retweets: t.retweets ?? 0, replies: t.replies ?? 0, quotes: t.quotes ?? 0,
    media: (t.media?.all ?? []).map((m: { type: string }) => m.type),
  };
}

// Snowflake IDs encode creation time: (id >> 22) + Twitter epoch. Second source of truth for ordering.
export const xIdToDate = (id: string) => new Date(Number((BigInt(id) >> 22n) + 1288834974657n));
