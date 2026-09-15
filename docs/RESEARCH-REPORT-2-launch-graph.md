# Launch Distribution Graph — Research Validation Report (+ comparison vs Creator Network Intelligence)

Date: 2026-09-16. Research only. No code, repo, scaffold, or API selection for implementation.

Labels: **[VF]** verified fact (fetched/observed directly) · **[SI]** strong inference · **[HY]** hypothesis · **[UN]** unknown.
Shared evidence with Report 1 (`RESEARCH-REPORT.md`) is referenced, not repeated in full.

---

## Executive verdict: **BUILD WITH CHANGES** — and, if only one idea is built, **build this one, merged with the recurrence question from Report 1**

Reasoning in brief:

1. **The propagation question has a rigorous, literature-backed framing that the creator-network question lacks.** Goel, Anderson, Hofman & Watts (*Management Science*, 2016) define **structural virality**: does popularity come from one big broadcast (one hop from the source) or from multi-generation spreading? Their billion-event Twitter study found most "viral" content is actually broadcast-shaped. [VF] Social Capital's business is, in effect, *manufactured broadcast* — "we control 300M views/month" [VF, their claim]. Measuring the actual cascade shape of their launches (depth, breadth, who is in generation 1 vs 2) is a question they have not answered publicly and would care about.
2. **Temporal reconstruction is better than the handoff feared.** X timestamps are second-precision UTC via API and are also encoded in the tweet ID itself. LinkedIn activity IDs encode **millisecond** timestamps (`id >> 22`), which I verified against the X anchors: Gamma LI post 49 s after X; Icon same second; Wispr +7 min; Deel LI **9 min before** X. [VF] Cross-platform sequencing of anchors — and of LinkedIn comments, which also carry IDs — is therefore observable without login.
3. **The cascade's first hop (quotes/replies/retweeters of the anchor) is enumerable; the second hop (quotes-of-quotes) is enumerable recursively; the third hop and beyond are sparse and mostly irrelevant.** This is enough to compute structural virality and wave timing for a launch. [SI, pending the API recall check from Report 1.]
4. **The changes:** (a) drop the generic "graph of everything" — model exactly three edge types (quote, reply, retweet) plus one cross-platform edge (same author on X and LinkedIn, manual for top accounts); (b) pick **Wispr Flow** as the primary launch and **Cartesia** as a second for pattern-repetition; (c) never draw an arrow that means "caused" — arrows mean "quoted/replied to/retweeted", which are the only directly observable edges; (d) fold in cross-launch recurrence (Report 1's question) because it is the cheapest way to distinguish "SC's network" from "AI Twitter".

---

## 1. Business validation

### How SC describes sequencing, creators and distribution [VF unless marked]

| Theme | Evidence | Source |
|---|---|---|
| Sequencing / timing is part of the operating model | Tracxn's description of SC's service: "plans rollouts to build momentum, tracks performance"; Head of Growth role: "orchestrating company-defining launches", "simultaneous multi-launch operations" | Tracxn; Vedika Bhaia LinkedIn post; /careers/head-of-growth |
| Creators are a managed, paid network, not organic fans | ">500 creators controlling >300M views per month"; role "builds launch GTM teams (film crews, editors, influencers)"; budgets ">$1M" | /careers/head-of-growth; Vedika post |
| Distribution is framed as engineered reach | "Reach = f(retention %, retweet rate, clickthrough rate)"; "guarantee 10M views on any launch" | /careers/head-of-growth |
| SC edits creators' posts | "checks creators' posts, gives edits, and ghostwrites content" | Tracxn (secondary) |
| Industry mechanic (competitor Gridd) | "Large accounts post first, others follow within minutes… concentrate into a single hour window… X treats the cluster as one event" | gridd.agency |
| Second-wave posts exist and are planned | Wispr Flow anchor (Feb 23) followed by a quote-post from the same founder on Feb 27 ("3.5M people watched… now opening the challenge to everyone") — 993K views, 94 quotes | fxtwitter, tweet 2027404378307809701 |

**Verdict on "does propagation matter to SC":** Yes — sequencing (anchor → creator cluster → follow-up) is explicitly what they sell. [SI] What they do *not* publish is whether their launches spread beyond the first hop, i.e. whether "viral" in their marketing means viral in the Goel-Watts sense or just a large, well-timed broadcast. That gap is the insight opportunity.

**Would a propagation reconstruction go beyond a normal dashboard?** Yes if it reports cascade shape, generation timing and node roles; no if it reports likes over time. Brandwatch/Sprout report volume; none reconstruct per-launch quote cascades with generation depth.

**Would it demonstrate understanding of the business?** Yes — it tests the one claim the business rests on ("we manufacture reach") with the one measurement that distinguishes engineered reach from organic spread.

---

## 2. Best launch candidates

Nine SC-claimed anchors (all metrics fetched 2026-09-16; full table in Report 1). Scored on the seven handoff criteria (1–5 each).

| Launch | Evidence vol. | Timestamp quality | Identify participants | Establish relationships | Cross-platform | Insight likelihood | 4–5h feasibility | **Total /35** |
|---|---|---|---|---|---|---|---|---|
| **Wispr Flow** (Feb 23 2026) | 5 (593 quotes, 4,469 replies, 2,875 RTs; TechCrunch; PiunikaWeb naming quoting accounts; YouTube short; documented 2nd wave post Feb 27) | 5 | 5 | 5 | 5 (X + LI + press + YouTube) | 5 (backlash "give her the Porsche" = organic wave measurable against engineered wave) | 4 | **34** |
| **Cartesia** (Oct 28 2025) | 4 (395 quotes, 1,404 replies) | 5 | 4 | 4 | 4 (X + LI + newsletters) | 4 | 4 | **29** |
| **Gamma** (Nov 10 2025) | 3 (212 quotes) | 5 | 4 | 4 | 5 (X + LI verified 5,328 reactions/811 comments + NYT/TechCrunch) | 3 | 4 | **28** |
| **Airwallex** (Dec 8 2025) | 4 (670 quotes; 47M views) | 5 | 4 | 3 (anomalous view/engagement ratio suggests non-cascade reach) | 4 | 4 (as anomaly) | 3 | **27** |
| **Poly AI** (Feb 17 2026) | 3 (367 quotes; company account) | 5 | 4 | 4 | 2 (X only) | 3 | 4 | **25** |
| **PlayerZero** (Mar 23 2026) | 3 | 5 | 4 | 4 | 2 | 3 | 4 | **25** |
| **Icon** (Feb 4 2025) | 3 (419 quotes) | 5 | 3 (older; recall risk) | 3 | 4 (LI launch was the main event) | 3 | 3 | **24** |
| **Deel** (Oct 16 2025) | 3 (250 quotes) | 5 | 4 | 3 | 4 | 3 (control case: 427K-follower founder) | 3 | **25** |
| **Superblocks** (May 27 2025) | 2 | 5 | 3 | 3 | 2 | 2 | 3 | **20** |
| Lovable | 0 — no SC work page, no identifiable anchor | — | — | — | — | — | — | **Exclude** |

**Best launch: Wispr Flow.** Unique advantages: (a) a founder-authored *second wave* four days later that itself quotes the anchor — a documented, observable propagation step; (b) an organic counter-narrative ("give her the Porsche", @daddynohara's 200K-view error-spotting post) that lets you compare engineered vs organic branches inside the same cascade; (c) TechCrunch same-day, PiunikaWeb two days later, YouTube coverage — real cross-platform trail; (d) most recent large launch, so X search recall is highest.
**Second launch for repetition check: Cartesia** (same medium, video + funding hook, 4 months earlier, different category).

---

## 3. Data-source matrix

| Source | Public data | Historical access | Timestamp | Engagement | Relationships | Practicality |
|---|---|---|---|---|---|---|
| **X anchor post** (fxtwitter, no key) | text, media, author followers | Yes, indefinitely while post exists | Second-precision UTC; also encoded in ID [VF] | views, likes, RTs, replies, quotes [VF] | none directly | Very high [VF] |
| **X quote tweets** (twitterapi.io `/twitter/tweet/quotes`) | full tweet + author (followers, created) | Search-backed; depth for ≥12-month-old posts **[UN]** | Second-precision [VF docs] | per-quote views/likes/RTs/replies/quotes [VF docs] | **quote edge** (directly observable) | High; 20/page, $0.15/1K [VF] |
| **X replies** (`/get_tweet_replies_v2`, thread context) | full tweet + author | Same caveat | Second | per-reply | **reply edge** | High; but 4.5K replies for Wispr — sample, don't exhaust |
| **X retweeters** (`/get_tweet_retweeter`) | user list, ~100/page, "order by retweet time desc" | Completeness for old posts **[UN]**; retweet timestamps **not returned** per docs read | ✗ (no per-RT time) | ✗ | **retweet edge** (unordered) | Medium — gives who, not when |
| **X quotes-of-quotes** (recursive) | as above | as above | Second | yes | **generation-2 edge** | High for top ~50 gen-1 quotes |
| **X user mentions/search** (`advanced_search since:/until:/min_faves:`) | tweets matching keyword + date | "Depth varies by provider" [VF docs] | Second | yes | **mention edge**; standalone (non-quoting) creator posts | Medium; recall unknown |
| **X follower/following lists** | 20/page | current state only (not historical) | ✗ | ✗ | follow edge — **do not use** (expensive, and follow ≠ propagation) | Low |
| **LinkedIn anchor post** (logged-out HTML) | text, reactions, comments count, partial comment list with author names | Yes while public | **Millisecond via activity ID** [VF]; comment IDs likewise | reactions + comments; **no views** [VF] | comment edge (partial); **no repost enumeration** [VF] | Medium; fragile after ~10s of requests; ToS grey |
| **LinkedIn reposts** | — | — | — | — | ✗ | **Not obtainable** logged-out |
| **YouTube Data API v3** | search.list (100 units), videos.list (1 unit), publishedAt ISO-8601 ms, views/likes/comments, captions.list (50) | Yes | Millisecond | yes | "video mentions product" edge only (title/desc/caption text) | High technically; **low relevance** — 8 hits for "wispr flow porsche", mostly reaction shorts, no SC-network creators [VF] |
| **Press / blogs** (TechCrunch, PiunikaWeb, newsletters) | article, publish time, embedded posts/handles | Yes | Minute/hour | ✗ | "article embeds account X" edge; names organic reactors | High; manual |
| **SC /work pages** | anchor IDs, LI URLs, month | Yes | Month (page) — anchors give exact | ✗ | attribution (SC claims launch) | Very high [VF] |
| **Official X API** | same as third-party | 7 days recent / full-archive only on Enterprise | second | yes | same | Low — pay-per-use $0.005/read, 30× cost, no advantage [VF] |

---

## 4. Relationship feasibility

| Relationship | Classification | How / caveat |
|---|---|---|
| A **quoted** B | **Directly observable** | Quote endpoint; `quoted_tweet` field; timestamp on both ends. |
| A **replied** to B | **Directly observable** | Reply/thread endpoints; `inReplyToId`, `conversationId`. |
| A **retweeted** B | **Observable (who), not (when)** | Retweeter list has no per-RT timestamp; ordering only "desc" as returned. Treat as unordered edge. |
| A **mentioned** B / product | **Directly observable** for tweets you can retrieve; **weakly inferable as complete** (search recall unknown). |
| A YouTube video **referenced** B | **Observable** via title/description/captions text; matching to a specific post is **weakly inferable**. |
| A posted **shortly after** B | **Directly observable** (X↔X, X↔LI, X↔YouTube, X↔press) via normalised UTC timestamps. |
| Anchor **followed by a wave** of creator content | **Strongly inferable** if quote/reply timestamps cluster; requires the recall check. |
| A **appears across multiple launches** | **Directly observable** on X (numeric author ID); **manual** for X↔LI identity. |
| A is a **bridge** between communities | **Weakly inferable** — needs community labels for quoters (LLM niche classification from bio/recent posts) and is sensitive to missing edges. |
| A **influenced/caused** B's post | **Not realistically determinable.** Even "B quoted A" shows B saw A, not that A's post is why B posted; with a briefed creator network, both A and B were likely prompted by SC. Represent as sequence/association only. |
| A was **paid** by SC | **Not determinable**; never assert. |
| A is **in SC's network** | **Weakly inferable** via cross-category recurrence across ≥3 SC launches + early-window timing. State as "recurring early amplifier", not "SC creator". |

---

## 5. Temporal feasibility

**Accuracy** [VF]: X `createdAt` second-precision UTC (fxtwitter and twitterapi.io both return it; snowflake ID decoding cross-checks it — verified Gamma/Wispr IDs decode to the exact API timestamps). LinkedIn activity IDs decode to millisecond UTC (verified against four anchors, all within 0–9 min of the X twin — consistent with near-simultaneous cross-posting). YouTube `publishedAt` ISO-8601. Press: article timestamp (hour-level; treat as coarse).

**Normalisation**: all to UTC; no timezone ambiguity for API data. Only human-read LinkedIn pages show relative times ("2mo") — irrelevant once IDs are decoded.

**Ordering confidence**: high for X↔X and X↔LI anchors. Retweets cannot be ordered. Replies/quotes can.

**Survivorship bias** [SI]: deleted quotes, suspended accounts and protected accounts vanish from search-backed enumeration. Detect by comparing enumerated count vs the anchor's live `quotes`/`replies` counters (fxtwitter). For Wispr: 593 quotes and 4,469 replies is the ceiling; if the API returns e.g. 520 quotes, coverage is 88% and the wave shape is trustworthy; if it returns 200, only report the *shape* of the surviving sample with that caveat. Older launches (Icon, Superblocks) are at higher risk — restrict timing analysis to 2025-Q4 onward.

**Can "launch → first wave → amplification → secondary wave" be tested?** Yes, as a histogram of quote/reply timestamps relative to the anchor, per launch. Expected signatures (hypotheses, not assumptions):
- engineered cluster: spike inside 0–60 min from accounts with high follower counts;
- organic tail: long, low-follower, decaying over 24–72 h;
- documented second wave: Wispr's Feb 27 founder quote-post (+4 days), with its own 94 quotes.
Whether the first spike exists is exactly what the data will show. If quotes are uniform over 48 h, the "coordinated cluster" model is *not* supported for that launch — an equally publishable result.

---

## 6. Network-analysis feasibility

Metrics that would say something about SC's model (keep), vs decorative (drop):

| Metric | Keep? | What it tells you about SC |
|---|---|---|
| **Structural virality** (Goel et al.: mean pairwise distance in the cascade tree; 2 = pure broadcast) | **Keep — headline** | Whether SC launches are one-hop broadcasts or multi-generation spreads. Computable from quote → quote-of-quote tree. Replies/retweets are 1-hop by construction. |
| **Generation-1 share of total quote-side views** | Keep | If gen-1 accounts produce >80% of quote views, reach is engineered broadcast. |
| **Time-to-first-N quotes / wave histogram** | Keep | Coordination signature. |
| **Follower-weighted early-window concentration** (Gini of followers among quotes in first 60 min vs later) | Keep | Whether big accounts move first (Gridd's stated mechanic). |
| **Cross-launch recurrence** (accounts in ≥2 cascades; Jaccard between launches) | Keep | Distinguishes "SC's network" from "AI Twitter". |
| **Reply-type mix** (mechanic/contest vs substantive; LLM-classified) | Keep, secondary | Whether engagement is reply-bait. |
| Degree centrality | Marginal | Equals "who got quoted most" — already the anchor. |
| Betweenness / bridges | **Drop** for one launch | Cascade is a tree rooted at the anchor; betweenness is trivially the root and gen-1 nodes. Only meaningful across launches with community labels — beyond 4–5 h. |
| Community detection (Louvain etc.) | **Drop** | Needs follow graph; expensive; edges missing. |
| PageRank | Drop | Meaningless on a star-shaped tree. |

**Expected topology** [HY, literature-informed]: a star with a few short chains — i.e. low structural virality. If that is what the data shows, the honest and interesting conclusion is: "SC's launches are high-reach broadcasts executed through a recurring set of gen-1 amplifiers; second-generation spread is small; the 'viral' label describes coordination, not contagion." If instead a few launches show long chains (e.g. Wispr's backlash branch), that is the more surprising finding.

---

## 7. Insight potential

### Plausible (data obtainable; empirically meaningful at n = 1–2 launches, hundreds of nodes)
1. **Cascade shape**: structural virality per launch; gen-1 share of views. [Needs: quotes + quotes-of-quotes for top ~50 gen-1 nodes.]
2. **Wave timing**: whether a 0–60-minute cluster of high-follower quoters exists; time to 50% of eventual quotes. [Needs: quote timestamps; recall ≥70%.]
3. **Engineered vs organic branches (Wispr only)**: the "give her the Porsche" critique branch vs endorsement branch — different timing, follower profile, and depth. [Needs: LLM stance classification of quotes + replies.]
4. **Cross-platform lag**: X anchor → LinkedIn twin (already measured: −9 to +7 min) → press (TechCrunch same day) → YouTube (days). [Needs: nothing new.]
5. **Recurrence** across Wispr + Cartesia (+ others if time): overlap of gen-1 accounts across categories. [Needs: quotes for ≥2 launches.]

### Weak (obtainable but likely under-powered or confounded)
- "Smaller creators are important bridges" — bridges need community labels; with one tree there are no bridges to find.
- "Different product categories produce different structures" — 9 launches, 6 categories; n too small.
- "Reply/retweet ratios indicate reply-bait" — suggestive, but contest mechanics confound (Wispr).

### Unsupported (do not claim)
- Any causal arrow between accounts.
- Any account is paid / "an SC creator".
- LinkedIn propagation structure (reposts invisible).
- Airwallex's 47M views explained by the cascade (like-rate 0.06% vs ~0.2% elsewhere suggests non-cascade reach; flag, don't explain).
- Anything about Lovable.

---

## 8. Competitive landscape

| Category | Examples | Reconstructs propagation? | Sequence/causal insight? | Gap |
|---|---|---|---|---|
| Academic/OSINT cascade tools | **Hoaxy** (OSoMe; X + Bluesky), **Treeverse** (reply-tree browser extension), TwitterTrails, DisTrack | Yes (retweet/reply trees) | Sequence yes; causal no | Built for misinformation; not launch-oriented; Hoaxy's X coverage degraded post-API-changes; no cross-platform, no creator recurrence. |
| Social listening | Brandwatch, Talkwalker, Meltwater, Sprout | No (volume/sentiment over time) | No | No graph, no per-post lineage. |
| Influencer/creator intelligence | Modash, HypeAuditor, Upfluence; Tracxn lists Collective Artists Network, POPS as SC competitors | No | No | Profile-level stats; no event cascades. |
| Coordinated-amplification vendors | **Gridd**, SC itself | They *create* it | They describe it qualitatively | None publish measured cascade structure. |
| Raw data APIs | twitterapi.io, SocialData, Apify actors | No | No | Inputs only. |
| Diffusion research | Goel/Watts structural virality; Cheng et al. "Can cascades be predicted?" | Method | Sequence, not causal | Provides the rigorous framing; not a product. |

**Is this "merely a visualisation layer"?** It would be if the output is a node-link picture. It is not if the output is a measured cascade-shape number, a wave histogram, and a stated conclusion about broadcast vs contagion for an agency that sells "viral". Hoaxy proves the mechanics are known; applying them to a specific distribution agency's own claimed launches, with cross-platform timing and recurrence, is not something any listed tool does. **Originality as a hiring exercise: adequate-to-good**, conditional on leading with the finding rather than the graph.

---

## 9. Application-fit scores (1–10)

| Trait | Score | Why |
|---|---|---|
| Builder mentality | **8** | Requires fetching, joining, tree-building, timestamp decoding (incl. LinkedIn ID trick), recall checking — a real, ambiguous data problem. |
| First principles | **9** | Directly questions what "viral" means using Goel-Watts, and tests whether SC's launches are contagion or coordinated broadcast. Reasoning from the mechanism, not the marketing. |
| AI-native | **6.5** | Same honest caveat as Report 1: collection and graph math are deterministic. LLM adds genuine value in (a) stance/role classification of hundreds of quotes and replies, (b) niche-labelling gen-1 accounts, (c) an interrogable graph ("which gen-1 accounts in Wispr also appeared in Cartesia, and were they early both times?"). Agentic *search* is not where the value is — don't pretend it is. |
| Self-direction | **9** | Choosing Wispr, excluding Lovable, adopting structural virality, refusing causal arrows, using LinkedIn ID timestamps — all unprompted judgement. |
| Originality | **7.5** | Method is known (Hoaxy); application and framing are fresh. Higher than the creator-network idea because the conclusion is a *shape*, not a list. |
| Technical generalism | **8** | APIs, ID-bit decoding, graph metrics, LLM classification, a small web front end, and a written argument. |
| Likelihood of impressing the hiring decision-maker | **7.5** | Kennan/Ruchir/Vedika sell "viral launches" and hire for "top 1% viral sense" and "first principles." A candidate who measures whether their launches are actually viral in the technical sense — and says so with evidence either way — signals exactly that. Risk: if the result is "it's a broadcast", it must be framed as a compliment to their engineering, not a debunk. |

**vs Orky:** Orky = "I can orchestrate 17 enterprise APIs with an LLM." This = "I can pick a question about *you*, find messy public evidence, model it honestly and reach a conclusion." No overlap in signal; do not add multi-agent orchestration here.

---

## 10. 4–5 hour feasibility

**Scope that fits:** one launch (Wispr Flow) fully + one launch (Cartesia) for recurrence; X quotes/replies/quotes-of-quotes; LinkedIn anchor + comment counts via ID timestamps; press/YouTube as manual timeline entries (≤10 items).

### Essential (≈3 h)
- Recall check (API quote count vs live counter) for both launches.
- Full gen-1 quote set + gen-2 quotes for top 50 gen-1 nodes (Wispr ≈ 600 + ~300; Cartesia ≈ 400 + ~200). Cost ≈ $0.30.
- Wave histogram (minutes since anchor), structural virality, gen-1 view share, follower profile of first-60-min quoters, overlap between the two launches.
- Cross-platform timeline: X anchor, LI anchor (ID-decoded), TechCrunch, second-wave post, PiunikaWeb, YouTube.
- One-page conclusion with observed / inferred / not-determinable sections.

### Optional (≈1–1.5 h)
- LLM stance classification of Wispr quotes (endorse / critique / contest entry / meme).
- Niche labels for top 30 gen-1 accounts.
- Standalone (non-quoting) launch-day posts via keyword search.
- A minimal interactive timeline/tree view.

### Scope traps
- Full reply enumeration (4.5K rows, low signal).
- Retweeter lists (no timestamps — can't place in a wave).
- Follower-graph pulls or community detection.
- LinkedIn reposts / comment scraping at scale.
- More than two launches in the cascade analysis.
- A "beautiful" force-directed graph — a star with 600 leaves is visually meaningless; use a timeline and a depth histogram instead.
- Explaining Airwallex.

---

## 11. Risks (ranked)

| # | Failure mode | Severity | Detection / mitigation |
|---|---|---|---|
| 1 | Quote/reply recall for the chosen launch is low → wave shape misleading | High | Compare enumerated vs live counters before analysis; require ≥70%; report coverage % on every chart. |
| 2 | SC's amplifiers use standalone posts / retweets rather than quotes → cascade tree under-represents the engineered layer | High | Keyword+date search for launch-day standalone posts; compare author sets. Retweet count (2,875 for Wispr) vs quotes (593) already shows retweets carry more volume than quotes — state this limitation explicitly. |
| 3 | Graph looks impressive but says nothing | High | Ban node-link as the primary output; lead with structural virality number, wave histogram, and a written conclusion. |
| 4 | False propagation edges / implied causality | High | Only draw quote/reply/retweet edges; label all timing relations as "after", never "because". |
| 5 | Insight turns out obvious ("it's a broadcast") | Medium | Frame around *measured* shape, timing window, gen-1 concentration and recurrence — the numbers are new even if the direction is expected. |
| 6 | Cross-platform identity errors | Medium | Manual resolution for top 20 only; otherwise keep platforms separate. |
| 7 | Deleted/suspended content (survivorship) | Medium | Coverage % reporting; avoid pre-Q4-2025 launches for timing claims. |
| 8 | Excessive engineering before any insight | Medium | Do the recall check + histogram in a notebook first; build the web layer last. |
| 9 | Naming individuals as paid | High (reputational) | Never; aggregate below top tier. |
| 10 | Timezone errors | Low | All sources are UTC via IDs/APIs. |
| 11 | ToS exposure (LinkedIn logged-out fetch, third-party X API) | Low–Medium | Small volume, public data, store IDs + aggregates, no raw text redistribution. |

---

## 12. Final recommendation

**Research question:**
> For Social Capital's Wispr Flow launch (and Cartesia as a repetition check), what is the observable shape of propagation on X — how much reach came from first-generation amplifiers vs deeper spread, how tightly were early amplifiers clustered in time and by follower size, which of them recur across SC launches, and how did the launch move to LinkedIn, press and video — measured as observed sequences, not causes?

**Best launch:** Wispr Flow (Feb 23 2026), with Cartesia (Oct 28 2025) for recurrence.

**Minimum useful dataset:**
- 2 anchor posts (X + LinkedIn twins with ID-decoded timestamps);
- all gen-1 quotes for both (≈1,000 rows) with author followers, timestamps, views;
- gen-2 quotes for the top 50 gen-1 nodes per launch;
- a 20% sample of replies per launch for stance classification (optional);
- ≤10 manually timestamped cross-platform items (press, second-wave post, YouTube).

**Successful result looks like:** a page that states, with coverage percentages: "Wispr's cascade has structural virality ≈ X (broadcast-like/contagion-like); N accounts quoted within 60 minutes, contributing Y% of quote-side views, with median follower count Z vs W for later quoters; K of those accounts also quoted Cartesia within its first hour; LinkedIn went live +7 min, TechCrunch same day, founder's second wave +4 days; the critique branch ('give her the Porsche') was later, smaller/larger and deeper/shallower than the endorsement branch. Not determinable from public data: payment, causation, LinkedIn spread." Either direction of the findings is a success; a picture without those sentences is a failure.

---

## Comparison: Launch Distribution Graph vs Creator Network Intelligence

| Dimension | Launch Distribution Graph | Creator Network Intelligence | Note |
|---|---|---|---|
| Business relevance | **8** | 8 | Both hit SC's core; the graph tests the "viral" claim, the network characterises the asset. |
| Data availability | 7 | **8** | Network needs only gen-1 quotes across launches; graph additionally needs gen-2 and older-launch recall. |
| Technical difficulty (higher = easier) | 6 | **7** | Tree building + structural virality is more work than a recurrence matrix. |
| 4–5 h feasibility | 7 | **8** | Network is a join and a count; graph has more moving parts. |
| Insight potential | **8** | 7 | Cascade shape + timing + recurrence > recurrence alone; graph subsumes the network's key metric. |
| Originality | **8** | 6.5 | Network risks reading as a creator leaderboard (Modash-adjacent). |
| AI-native signal | 6.5 | 6 | Both modest; graph has more classification surface (stance, role). |
| First-principles signal | **9** | 8 | "Is it actually viral?" is a sharper first-principles question than "is follower count predictive?" |
| Self-direction signal | 9 | 9 | Equal. |
| Risk of shallow result (higher = safer) | 6 | 6 | Graph can become a pretty picture; network can become a list. Both need discipline. |
| **Overall application strength** | **7.8** | 7.2 | |

**Recommendation if only one is built: the Launch Distribution Graph, with the creator-recurrence question folded in as its cross-launch dimension.** The two ideas share ~80% of the data (gen-1 quotes with timestamps and author metadata). The graph framing yields a stronger, literature-grounded headline (cascade shape and timing) and *also* produces the recurrence answer as a by-product; the reverse is not true. The network idea's main advantage — simplicity — is worth keeping as the fallback: if the gen-2/recall checks fail on the chosen launch, collapse to the Report 1 plan (recurrence across ≥6 launches at gen-1 only), which needs nothing that has not already been verified.

---

## Additional sources used in this report (beyond Report 1's list)

| Title | URL | Establishes | Confidence |
|---|---|---|---|
| Goel, Anderson, Hofman, Watts — *The Structural Virality of Online Diffusion* (Mgmt Sci 2016) | https://5harad.com/papers/twiral.pdf | Structural-virality measure; most popular content is broadcast-shaped | High |
| Cheng et al. — *Can Cascades be Predicted?* | https://arxiv.org/pdf/1403.4608 | Early-cascade features predict size; framing for timing analysis | Medium |
| Hoaxy (OSoMe) | https://hoaxy.osome.iu.edu/ | Existing X/Bluesky spread visualiser (misinformation focus) | High |
| Treeverse | https://github.com/domoritz/Treeverse | Reply-tree visualiser; shows the mechanics are known | High |
| twitterapi.io endpoint index | https://docs.twitterapi.io/llms.txt | Retweeters (100/page, no per-RT timestamp), quotes, replies v2, thread context, mentions | High |
| YouTube Data API quota docs | https://developers.google.com/youtube/v3/determine_quota_cost | 10K units/day; search 100; videos 1; captions 50/200 | High |
| TechCrunch — Wispr Flow Android launch | https://techcrunch.com/2026/02/23/wispr-flow-launches-an-android-app-for-ai-powered-dictation/ | Same-day press node | High |
| PiunikaWeb — "Give her the Porsche" | https://piunikaweb.com/2026/02/25/give-her-the-porsche-wispr-flow/ | Organic critique branch; names quoting accounts (@daddynohara 200K views, @cgtwts); second coordinated Apple-Store video | Medium |
| Wispr second-wave post | https://x.com/tankots/status/2027404378307809701 | +4-day founder quote-post; 993K views, 94 quotes (fetched via fxtwitter) | High |
| YouTube search "wispr flow porsche" | — | 8 videos, reaction shorts only | High (observed) |
| LinkedIn activity-ID timestamp decoding | own verification (`id >> 22` ms) against 4 anchors | LI anchors within −9…+7 min of X anchors | High |
