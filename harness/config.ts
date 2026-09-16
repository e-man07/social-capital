// The nine launches Social Capital publicly claims on sociallcapital.com/work.
// Anchor IDs were read from the embedded posts on each /work/<slug> page.
export type Launch = {
  slug: string;
  client: string;
  category: string;
  xAnchorId: string;
  founderHandle: string;
  linkedinAnchorUrl?: string;
  // X advanced-search query used to find launch-day posts that did NOT quote the anchor
  searchQuery: string;
  // Known press / third-party coverage to timestamp as cross-platform nodes
  pressUrls: string[];
  // A search hit (from the collector or the research agent) must contain one of these, case-insensitively,
  // to enter the graph. Guards against generic words ("icon", "sonic", "gamma") matching unrelated posts.
  relevanceTerms: string[];
};

export const LAUNCHES: Launch[] = [
  {
    slug: "icon", client: "Icon", category: "ai-ads",
    xAnchorId: "1886836061378372064", founderHandle: "kennandavison",
    linkedinAnchorUrl: "https://www.linkedin.com/posts/kennandavison_introducing-icon-the-worlds-first-ai-admaker-activity-7292601719627079680-39q7",
    searchQuery: '("icon.me" OR "AI Admaker" OR "AI Ad maker" OR kennandavison OR ("Icon" (ads OR admaker OR "Founders Fund"))) since:2025-02-04 until:2025-02-08 min_faves:50 -filter:replies',
    pressUrls: [], relevanceTerms: ["icon.me","admaker","ad maker","kennan","@icon","called icon","icon just","ad industry","ads industry"],
  },
  {
    slug: "superblocks", client: "Superblocks (Clark)", category: "dev-tools",
    xAnchorId: "1927414638632735069", founderHandle: "bradmenezes",
    searchQuery: '(Superblocks OR "Clark" "internal apps") since:2025-05-27 until:2025-05-31 min_faves:50 -filter:replies',
    pressUrls: [], relevanceTerms: ["superblocks","clark","menezes"],
  },
  {
    slug: "deel", client: "Deel", category: "hr-fintech",
    xAnchorId: "1978809723727012176", founderHandle: "Bouazizalex",
    linkedinAnchorUrl: "https://www.linkedin.com/posts/alexbouaziz_deel-has-raised-300m-at-a-173b-valuation-activity-7384573205698568193-FtqD",
    searchQuery: '(Deel "17.3B" OR Deel Bouaziz OR "Alex Bouaziz") since:2025-10-16 until:2025-10-20 min_faves:50 -filter:replies',
    pressUrls: [], relevanceTerms: ["deel","bouaziz"],
  },
  {
    slug: "cartesia", client: "Cartesia", category: "voice-ai",
    xAnchorId: "1983202316397453676", founderHandle: "krandiash",
    linkedinAnchorUrl: "https://www.linkedin.com/posts/krandiash_weve-raised-100m-from-kleiner-perkins-activity-7388968595499728896-0UJn",
    searchQuery: '(Cartesia OR "Sonic-3" OR ("Sonic 3" (voice OR TTS OR speech OR Cartesia)) OR "Karan Goel") since:2025-10-28 until:2025-11-01 min_faves:50 -filter:replies',
    pressUrls: ["https://aivoicenewsletter.com/p/cartesia-s-100m-sonic-3-leap"], relevanceTerms: ["cartesia","sonic-3","karan goel","krandiash"],
  },
  {
    slug: "gamma", client: "Gamma", category: "presentations",
    xAnchorId: "1987880600661889356", founderHandle: "thisisgrantlee",
    linkedinAnchorUrl: "https://www.linkedin.com/posts/grantslee_today-as-shared-by-the-new-york-times-we-activity-7393646492839763968-Bws-",
    searchQuery: '(Gamma ("2.1B" OR "100M ARR" OR "Grant Lee" OR PowerPoint OR MeetGamma)) since:2025-11-10 until:2025-11-14 min_faves:50 -filter:replies',
    pressUrls: ["https://techcrunch.com/2025/11/10/ai-powerpoint-killer-gamma-hits-2-1b-valuation-100m-arr-founder-says/"], relevanceTerms: ["gamma","grant lee","thisisgrantlee","meetgamma"],
  },
  {
    slug: "airwallex", client: "Airwallex", category: "fintech",
    xAnchorId: "1998015620072587516", founderHandle: "awxjack",
    linkedinAnchorUrl: "https://www.linkedin.com/posts/jack-zhang-05200222_stripe-offered-to-acquire-us-for-12-billion-activity-7403782045119967232-9-Ne",
    searchQuery: '(Airwallex OR "Jack Zhang" OR ("Stripe" "acquire" "1.2")) since:2025-12-08 until:2025-12-12 min_faves:50 -filter:replies',
    pressUrls: [], relevanceTerms: ["airwallex","jack zhang","awxjack"],
  },
  {
    slug: "poly-ai", client: "PolyAI", category: "voice-ai",
    xAnchorId: "2023789465509015972", founderHandle: "polyaivoice",
    searchQuery: '(PolyAI OR "Poly AI" OR polyaivoice) since:2026-02-17 until:2026-02-21 min_faves:50 -filter:replies',
    pressUrls: [], relevanceTerms: ["polyai","poly ai","polyaivoice"],
  },
  {
    slug: "wispr-flow", client: "Wispr Flow", category: "voice-ai",
    xAnchorId: "2025981424470479008", founderHandle: "tankots",
    linkedinAnchorUrl: "https://www.linkedin.com/posts/tankots_we-offered-5-people-a-porsche-911-gt3-rs-activity-7431748842519318528-RY-e",
    searchQuery: '(Wispr OR WisprFlow OR "Tanay Kothari" OR (Porsche dictation)) since:2026-02-23 until:2026-02-27 min_faves:50 -filter:replies',
    pressUrls: [
      "https://techcrunch.com/2026/02/23/wispr-flow-launches-an-android-app-for-ai-powered-dictation/",
      "https://piunikaweb.com/2026/02/25/give-her-the-porsche-wispr-flow/",
    ],
    relevanceTerms: ["wispr","tanay","tankots"],
  },
  {
    slug: "playerzero", client: "PlayerZero", category: "dev-tools",
    xAnchorId: "2036111467016319074", founderHandle: "akoratana",
    searchQuery: '(PlayerZero OR "Engineering World Model" OR Koratana) since:2026-03-23 until:2026-03-27 min_faves:50 -filter:replies',
    pressUrls: [], relevanceTerms: ["playerzero","player zero","koratana","engineering world model"],
  },
];

export const GEN2_TOP_N = 30;        // expand quotes-of-quotes for the top-N gen-1 quotes by views
export const SEARCH_MAX_PAGES = 5;   // 20 results per page
export const DATA_DIR = "data";
