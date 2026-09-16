import { cachedFetch } from "../lib/http";

// LinkedIn activity/comment IDs are time-sortable: the top 41 bits are a Unix-ms timestamp.
// Verified against four X/LinkedIn anchor pairs (all within -9..+7 min of each other).
export const liIdToDate = (id: string) => new Date(Number(BigInt(id) >> 22n));

export type LinkedInPost = {
  url: string; activityId: string; createdAt: string; reactions: number | null; comments: number | null;
  fetchedOk: boolean; commentAuthors: string[]; commentIds: string[];
};

export async function linkedinPost(url: string): Promise<LinkedInPost> {
  const activityId = url.match(/activity-(\d{15,})/)?.[1] ?? "";
  const base: LinkedInPost = { url, activityId, createdAt: activityId ? liIdToDate(activityId).toISOString() : "", reactions: null, comments: null, fetchedOk: false, commentAuthors: [], commentIds: [] };
  try {
    const { status, body } = await cachedFetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36", "Accept-Language": "en-US,en;q=0.9" } });
    if (status !== 200 || !body.includes("data-num-reactions")) return base;
    const reactions = Number(body.match(/data-num-reactions="(\d+)"/)?.[1] ?? NaN);
    const comments = Number(body.match(/(\d[\d,]*)\s+comments?/i)?.[1]?.replace(/,/g, "") ?? NaN);
    const commentIds = [...body.matchAll(/urn:li:comment:\([^,)]+,(\d{15,})\)/g)].map((m) => m[1]);
    const commentAuthors = [...body.matchAll(/comment__author-name[^>]*>\s*([^<]{2,80}?)\s*</g)].map((m) => m[1].trim());
    return { ...base, fetchedOk: true, reactions: Number.isNaN(reactions) ? null : reactions, comments: Number.isNaN(comments) ? null : comments, commentIds: [...new Set(commentIds)], commentAuthors: [...new Set(commentAuthors)] };
  } catch {
    return base;
  }
}
