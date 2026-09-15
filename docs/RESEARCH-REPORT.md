# Social Capital Distribution Intelligence — Research Validation Report

Date: 2026-09-16. Research phase only. No code, no scaffold.

Evidence labels used throughout: **[VF]** verified fact (fetched/observed directly), **[SI]** strong inference, **[HY]** hypothesis, **[UN]** unknown.

---

## Executive verdict: **BUILD WITH CHANGES**

The idea survives validation, but only in a narrower, sharper form than the handoff describes.

What changed after research:

1. **Social Capital's "case studies" contain zero creator data.** Each `/work/<client>` page is a single embedded founder announcement post (X + LinkedIn). [VF] There is no published list of creators, no timeline, no methodology per launch. The creator network must be *reconstructed* from the amplification around those anchor posts — which is exactly what makes the exercise non-trivial and interesting.
2. **The anchor posts are a gift.** SC has itself curated nine launches with exact post IDs and dates (Feb 2025 – Mar 2026). That solves the hardest problem in the handoff — "was this launch actually an SC launch?" — because SC is the one claiming them. [VF]
3. **X is the only platform where the amplification graph is cheaply and reliably enumerable.** twitterapi.io exposes a quote-tweet endpoint (`/twitter/tweet/quotes`) at ~$0.15 per 1,000 tweets with per-author follower counts and per-quote view counts. Total quote volume across all nine anchors is ~3,360 quotes — under $1 to collect. [VF] LinkedIn gives reaction/comment counts and partial comments logged-out but no view counts and no repost enumeration. [VF] YouTube is irrelevant to SC's model (they are X + LinkedIn only). [VF]
4. **A first non-obvious signal is already visible in nine data points:** seven of nine anchor authors have fewer than 45K followers, yet their posts reached 1.9M–47M views. The one large account (Deel's CEO, 427K followers) got the *lowest* views-per-follower multiplier. [VF for the numbers; HY for the pattern.] This is precisely the "follower count ≠ distribution value" question the handoff hoped to test, and it is the question SC's own business model depends on.

The recommended research question (Section 9) is: **"Is there a recurring core of amplifier accounts across Social Capital's nine claimed launches, and does that core — not the founder's reach or the content format — explain the launches' view counts?"**

---

## 1. Business validation

### What Social Capital publicly claims [VF]

| Claim | Source | Note |
|---|---|---|
| "We help companies launch their products and guarantee a viral launch. We're the only company in the world with the ability and track record to offer this guarantee." | sociallcapital.com | |
| Distribution network: >300M views/month across X and LinkedIn | sociallcapital.com | LinkedIn company page says **200M views, 300+ creators**; Head-of-Growth page says **>500 creators, >300M views/month**. Numbers are inconsistent across their own surfaces — likely staleness, worth noting rather than treating any one figure as fact. |
| "Reach = f(retention %, retweet rate, clickthrough rate)" | /careers/head-of-growth | Their stated algorithm model. |
| Three components: algorithm research on X/LinkedIn; creator network; in-house film/writing/design team | sociallcapital.com | |
| Guarantee "10M views on any launch"; ~500M cumulative views across clients | /careers/head-of-growth | |
| <20 people, >1000% YoY growth, "profits comparable to a 500-person company" | sociallcapital.com, /careers | |
| Founded 2025 by Ruchir Jajoo, Kennan Davison (CEO), Vedika Bhaia; unfunded; Mumbai/Bangalore | Tracxn | Kennan Davison is also founder/CEO of **Icon** — the first `/work` entry is his own company's launch. [VF] |
| Process (Tracxn description): scripts/edits launch videos, "checks creators' posts, gives edits, ghostwrites content, plans rollouts to build momentum, tracks performance" | Tracxn | Secondary source, but the most explicit public description of the creator workflow. |
| Head of Growth role: "create viral launch videos within two-week timeframes", "build launch GTM teams (film crews, editors, influencers)", manage "budgets exceeding one million dollars" | /careers/head-of-growth; Vedika Bhaia LinkedIn post | Confirms creators are paid/managed, not organic. |
| Clients named: Gamma, Lovable, Deel, Wispr Flow, Cartesia, Airwallex (+ PlayerZero, Poly AI, Superblocks, Icon on /work) | Luma, Lightspeed posts, /work | Lovable is claimed in events/posts but has **no /work page**. |

### How the distribution model appears to work [SI]

Combining SC's own material with the documented industry playbook (Gridd, Okara handbook, Higgsfield case, Cluely coverage):

- A founder-authored anchor post (usually a video, funding-news hook, US-morning timing) goes live.
- A pre-briefed set of creators amplifies inside a tight window (quote tweets, replies, sometimes standalone posts), so the algorithm reads a "cluster" as one event. Gridd — a direct competitor — describes exactly this: "large accounts post first, others follow within minutes… X treats the cluster as one event." [VF for Gridd's description; SI that SC's mechanics are the same.]
- SC's team ghostwrites/edits creator copy and tracks performance (Tracxn description).
- The same is mirrored on LinkedIn with reply/comment-bait mechanics ("comment to claim" — verified on Icon's launch post).

### Why this is interesting to SC — and the bar it must clear

SC's own hiring copy says they want people with "top 1% viral sense", "first principles", and a "defensible point of view on what is good and what is slop." A report that says "SC uses creators to amplify launches" is slop — they know that; it's their product. The result must say something *about the structure of their own network that they haven't published*, e.g. how concentrated the amplifier core is, whether the same ~30 accounts carry every launch regardless of category, or whether the marginal view is driven by a few mid-size accounts rather than the headline "500 creators."

What would make it look like a shallow AI report: charts of likes per launch; restating their numbers; "insights" like "video performs well"; naming creators as "paid" without evidence.

What would demonstrate taste/conviction/agency: choosing one measurable question, building the graph yourself from raw posts, stating what you *could not* determine and why, and being willing to conclude "the network is smaller/more concentrated than the marketing suggests" if the data says so.

---

## 2. Data availability

### Anchor posts (collected directly, 2026-09-16) [VF]

| Launch | Anchor author | Author followers | Date (UTC) | Views | Likes | RTs | Replies | Quotes | Media | LinkedIn twin |
|---|---|---|---|---|---|---|---|---|---|---|
| Icon | @icon (Kennan Davison) | 24.8K | Tue 2025-02-04 17:55 | 2.37M | 8,017 | 1,375 | 1,416 | 419 | video | yes |
| Superblocks | @bradmenezes | 6.7K | Tue 2025-05-27 17:20 | 1.86M | 5,265 | 745 | 755 | 178 | video | no |
| Deel | @Bouazizalex | 427K | Thu 2025-10-16 13:06 | 2.90M | 5,371 | 661 | 462 | 250 | photo | yes |
| Cartesia | @krandiash | 20.7K | Tue 2025-10-28 16:00 | 4.88M | 8,429 | 1,227 | 1,404 | 395 | video | yes |
| Gamma | @thisisgrantlee | 42.9K | Mon 2025-11-10 13:50 | 4.44M | 2,781 | 306 | 403 | 212 | video | yes (5,328 reactions / 811 comments) |
| Airwallex | @awxjack | 33.3K | Mon 2025-12-08 13:03 | **46.95M** | 29,165 | 1,913 | 1,507 | 670 | photo | yes |
| Poly AI | @polyaivoice (company acct) | 9.4K | Tue 2026-02-17 15:59 | 3.54M | 4,760 | 535 | 1,470 | 367 | video | no |
| Wispr Flow | @tankots | 35.5K | Mon 2026-02-23 17:09 | 4.47M | 10,780 | 2,875 | 4,469 | 593 | video | yes |
| PlayerZero | @akoratana | 9.4K | Mon 2026-03-23 16:02 | 2.76M | 5,193 | 738 | 867 | 273 | video | no |

Total quote tweets across anchors: **~3,360**. Total replies: **~12,750**.

### Ranked by research usefulness

| Rank | Launch | Why |
|---|---|---|
| 1 | **Wispr Flow** | Highest quotes (593) and replies (4,469); video; both platforms; recent (Feb 2026) so X search index is fresh; contest mechanic makes reply-bait testable. |
| 2 | **Airwallex** | Massive outlier (47M views, photo not video). Either the most-amplified launch or a paid-boost/algorithmic anomaly — the outlier is itself a research target. Both platforms. |
| 3 | **Cartesia** | 395 quotes, video, both platforms, mid-period. |
| 4 | **Gamma** | Both platforms; NYT/TechCrunch coverage gives independent cross-reference; LinkedIn side verified fetchable. Lower X engagement than others. |
| 5 | **Poly AI** | Company account (not founder) — a useful control for "founder voice" hypothesis. X only. |
| 6 | **PlayerZero** | Recent, video, X only. |
| 7 | **Icon** | Earliest (Feb 2025); CEO's own company — confounded (Kennan's personal network). Still useful as the "origin" launch. Search index may be thinner for 19-month-old quotes. |
| 8 | **Deel** | Large-follower founder — the key *control* for follower-count hypothesis, but photo-only and lowest quotes-per-view. |
| 9 | **Superblocks** | Oldest after Icon, smallest, X only. |
| — | **Lovable** | Claimed by SC in events but **no /work page and no identifiable anchor post**. Attribution impossible without private info. **Exclude** unless SC later publishes it. |

### Source-by-source availability

| Source | What's available | Method tested | Verdict |
|---|---|---|---|
| SC `/work/*` pages | Anchor X post ID, LinkedIn URL, date | curl | Fully available [VF] |
| X anchor metrics (views, likes, RTs, replies, quotes, author followers, media type) | All fields | fxtwitter API (free, no key) | Fully available [VF] |
| X quote-tweet enumeration (author, followers, timestamp, views, text) | Documented endpoint, 20/page, cursor, since/until | twitterapi.io docs read; **not yet executed** (needs API key) | Available [SI]; historical depth for Feb-2025 launches is **[UN]** — must be tested |
| X replies enumeration | Documented (`includeReplies`, thread endpoints) | docs | Available [SI] |
| X retweeter list | Endpoint exists on third-party APIs but historical completeness [UN] | — | Partial |
| X standalone creator posts (creator posts the launch video without quoting) | `advanced_search` with `since:/until:/min_faves:` + keyword | docs | Available [SI]; recall unknown |
| X per-quote view counts | Returned per tweet | docs | Available [VF per docs] |
| LinkedIn anchor post reactions/comments count + partial comment list | Logged-out HTML | curl tested | Available [VF]; fragile, rate-limited |
| LinkedIn view counts | Not exposed publicly | — | **Unavailable** [VF] |
| LinkedIn repost/reposter enumeration | Requires login; scrapers violate ToS | — | **Unavailable** for this project |
| YouTube | SC does not operate on YouTube; no launch videos surfaced in search | search | **Not relevant** [VF] |
| Official X API | Pay-per-use only for new devs ($0.005/read, no quote-tweet write endpoints since Apr 2026); read of quotes via search | docs | Possible but 30× more expensive than third-party; unnecessary |

---

## 3. Technical feasibility

### Realistically possible in scope
- Fetch 9 anchors + ~3,400 quotes + optional ~12K replies from twitterapi.io. Cost: **<$3 total**. Free tier ($0.10) covers ~600 tweets — enough to validate one launch before paying. [VF pricing]
- For each quote: author handle, followers, quote timestamp, quote views/likes, text. This is sufficient to build (a) an amplifier × launch matrix, (b) a time-from-anchor histogram per launch, (c) per-amplifier reach contribution.
- Entity resolution across launches is trivial on X (numeric author ID). Cross-platform (X↔LinkedIn) resolution is **manual** and should be limited to the top ~20 recurring accounts.
- LLM use that genuinely adds value: classifying quote text into {endorsement / meme / critique / contest-entry / spam}, and classifying amplifier accounts by niche from bio + recent posts. Both are things a search API cannot do.

### Difficult
- **Coverage of the network via quotes only.** If SC's creators post *original* posts with the video rather than quoting, quotes miss them. Mitigation: keyword+date+`min_faves` search per launch to find non-quoting posts; compare author sets.
- **Historical depth.** twitterapi.io says depth "varies"; quote enumeration is search-backed. Icon/Superblocks (2025 H1) may have degraded recall. Detect: compare returned quote count to fxtwitter's `quotes` field per anchor. If recall <70% for a launch, drop it from timing analysis.
- **Timing precision.** Quote `createdAt` is second-precision — fine. Anchor timestamps verified. "Minutes since anchor" is fully reconstructible. [VF]
- **LinkedIn.** Reaction/comment counts only; comment authors partially visible; no reposts; blocks after modest request volume. Treat LinkedIn as a manual-verification layer for the top accounts, not a primary dataset.
- **Paid vs organic.** Unresolvable from public data for any single account. Only *pattern* evidence is defensible (see Section 4).

### Unavailable
- LinkedIn views/reposters; X impressions per creator's followers' feeds; any SC internal roster; retweet lists with historical completeness; deleted quotes.

### Assumptions to validate before build (each is a 10-minute check)
1. twitterapi.io `/twitter/tweet/quotes` returns ≥70% of fxtwitter's quote count for a Feb-2025 anchor (Icon) and ≥90% for a 2026 anchor (Wispr).
2. Quote objects include `viewCount` and author `followers` for historical quotes (not just recent).
3. `advanced_search` with `since:/until:` returns non-quoting launch-day posts for at least one launch.
4. LinkedIn logged-out fetch survives ~10 sequential post fetches without a 999/redirect.

---

## 4. Insight potential

### Plausible, evidence-supportable insights

**A. Amplification is decoupled from founder reach (already partially visible).** [SI]
Views ÷ author followers: Superblocks ~278×, PlayerZero ~292×, Poly AI ~379×, Airwallex ~1,411×, Cartesia ~236×, Gamma ~103×, Wispr ~126×, Icon ~96×, Deel **~7×**. The only large-follower founder produced the smallest multiplier. With n=9 this is a hypothesis, but the quote-tweet data can test *what* replaces founder reach: if 60%+ of quote-side views come from accounts that quote ≥3 launches, the network — not the founder — is the engine.
Evidence needed: quote-level views + author IDs across all launches. Insufficient: anchor-level metrics alone.

**B. A recurring amplifier core exists and is much smaller than "500 creators."** [HY]
Testable precisely: count accounts appearing in quotes of ≥3 of 9 launches. Because the clients span HR (Deel), fintech (Airwallex), voice AI (Cartesia, Poly, Wispr), dev tools (PlayerZero, Superblocks), presentations (Gamma) and ads (Icon), an account that organically quotes launches across all of those categories is implausible — cross-category recurrence is the strongest public signal of a managed network. This is the insight SC would find interesting, because it characterises their own asset from the outside.
Evidence needed: full quote sets for ≥6 launches. Insufficient: 2–3 launches (recurrence could be coincidence among AI-Twitter regulars).

**C. Amplification arrives in a coordinated window.** [HY, industry-corroborated]
Gridd and the Okara handbook both describe a 30–60-minute cluster. If SC launches show a bimodal time-since-anchor distribution (a spike in minutes 0–60 from recurring accounts, then organic tail), that's coordination evidence. If quotes are uniformly spread, SC's edge is elsewhere (creative, not timing).
Evidence needed: quote timestamps. Insufficient: like counts.

**D. Reply-bait, not retweets, drives the LinkedIn/X signal.** [HY]
Replies exceed retweets on 6 of 9 anchors (Wispr 4,469 vs 2,875; Poly 1,470 vs 535). Icon's LinkedIn post used "comment to claim." Reply text classification can show what share of replies are mechanic-driven ("DEEPDIVE"-style) vs substantive.

**E. Format is not the predictor.** [HY]
The two photo-only anchors (Deel, Airwallex) include the single best and one of the weaker launches. The narrative "story" hook ("Stripe offered to acquire us…") outperformed every video. Worth stating as a counter-intuitive observation but not a conclusion at n=9.

**F. The Airwallex outlier.** [UN]
47M views vs 2–5M for everything else, with only 670 quotes and a modest 29K likes (0.06% like rate vs ~0.24% for Wispr). Low engagement-per-view with very high views is consistent with paid promotion or a "For You" algorithmic run. The tool should surface this as an anomaly and explicitly *not* explain it.

### Unsupported speculation to avoid
- That any named account was paid. (Only Higgsfield-style public callouts establish that, and none exist for SC.)
- That SC "controls half of all viral launches on X" (their claim; unverifiable).
- Causal claims: "creators caused the views." Public data supports association and timing, not causation.
- Any conclusion from Lovable — no anchor.
- Anything about the *LinkedIn* network's size — reposters aren't observable.
- Extrapolating from 9 launches to SC's full client base.

---

## 5. Competitive landscape

| Category | Examples | What they do | Gap relative to this project |
|---|---|---|---|
| Coordinated quote-tweet agencies | **Gridd** ("500+ creators quote tweet your launch"), SC itself | Sell the network | They *are* the network; none publish its structure. |
| Creator discovery / influencer platforms | Modash, Upfluence, HypeAuditor, Collective Artists Network, POPS (Tracxn's listed SC competitors) | Search creators by follower/engagement | Follower-count-centric; no launch-event graph; weak on X/LinkedIn B2B. |
| Social listening | Brandwatch, Talkwalker, Sprout, Meltwater | Mention volume/sentiment | Don't reconstruct amplification order or recurrence across events. |
| X analytics | Tweet Hunter, Typefully, Xpoz, SocialData/twitterapi.io | Raw data or personal analytics | Raw material only; no cross-launch analysis. |
| Launch/virality content | Cluely playbook (paywalled), Okara handbook, Higgsfield case study | Narrative playbooks | Qualitative; no dataset. |
| AI research agents | Perplexity, deep-research modes | Summarise the web | Cannot enumerate quote graphs; would produce the "shallow report." |

**Differentiation verdict:** No public tool reconstructs a *specific agency's* amplifier network across its claimed launches from raw quote-tweet timing and recurrence. The angle is novel enough. It is derivative only if the output is a creator leaderboard — that's Modash. The differentiation lives in recurrence-across-categories + timing-window analysis + explicit uncertainty handling.

---

## 6. Application fit (1–10)

| Trait | Score | Why |
|---|---|---|
| Builder mentality | **8** | The insight cannot be reached by reading — you must fetch ~3,400 quotes, join across launches, and compute. Loses 2 points because the "web tool" wrapper is not what produces the insight; a notebook would. |
| First principles | **9** | The core question ("does the founder's follower count matter?") attacks SC's own thesis from the outside with their own data. Decoupling reach from followers *is* SC's first principle. |
| AI-native | **6** | Honest score. The pipeline is mostly deterministic (fetch → join → count → plot). LLM adds real value only for reply/quote text classification and account-niche labelling. Don't oversell agentic search; that would read as "wrapping a search API in an LLM." Score rises to 8 if the tool lets a user ask "which amplifiers appeared in both Cartesia and Wispr and what do they usually post about?" and the LLM answers from the graph. |
| Self-directed | **9** | SC gave a one-line prompt. Choosing to reconstruct their network from their own anchors, excluding Lovable for lack of attribution, and treating Airwallex as an anomaly are all unprompted judgement calls. |
| Taste / originality | **7** | Strong if the conclusion is stated with conviction and caveats; weak if it becomes a dashboard. The Airwallex anomaly and the Deel control are the tasteful moves. |
| Technical generalism | **7** | Touches three data sources, an LLM, light graph analysis, a web front end, and a written argument. Not deep in any one — which is the point of the role. |

**Complementarity with Orky:** Strong, provided the framing differs. Orky proves "I can wire an LLM to 17 enterprise APIs." This proves "I can define an ambiguous question, find the data, and reach a defensible conclusion about *you*." Present Orky under S-tier and this as the "alternative challenge" done on top — not as a second API demo. Avoid: a multi-agent orchestration architecture here; it would look like Orky again and burn the 4–5 hours.

---

## 7. 4–5 hour feasibility

### Must-have (≈3 hours)
- Anchor table for 9 launches (done in this research).
- Quote-tweet pull for ≥6 launches (Wispr, Airwallex, Cartesia, Gamma, Poly, PlayerZero) — ~2,500 quotes.
- Amplifier × launch recurrence matrix; time-since-anchor histogram; views-share by recurring vs one-off accounts.
- One page that states: the recurrence finding, the timing finding, the founder-reach finding, the Airwallex anomaly, and what could not be determined.

### Nice-to-have (≈1–1.5 hours)
- LLM classification of quote/reply text (mechanic vs substantive).
- Niche labelling of top 20 recurring amplifiers.
- Non-quoting launch-day posts via `advanced_search` for 2 launches.
- LinkedIn reaction/comment counts for the 6 launches with LI twins (manual or curl).

### Scope traps
- LinkedIn repost enumeration (impossible logged-out).
- Cross-platform identity resolution for more than the top 20 accounts.
- Replies for all 9 launches (12.7K rows, mostly noise).
- Building a "creator database" UI with search/filter.
- Multi-agent research orchestration.
- Trying to include Lovable.
- Explaining the Airwallex outlier (you can't; flag it).

---

## 8. Biggest risks (ranked)

| # | Risk | Severity | How to detect during validation |
|---|---|---|---|
| 1 | **Quote recall is incomplete for older launches** → recurrence undercounted | High | Compare API-returned quote count vs fxtwitter `quotes` per anchor before any analysis. Drop launches under 70%. |
| 2 | **SC's network doesn't use quotes** (uses replies/standalone posts/RTs) → the graph misses the actual mechanism | High | Run keyword+date search for one launch; if standalone launch-day posts from high-follower accounts outnumber quotes, switch primary unit to "launch-day mention." |
| 3 | **Recurrence is just AI-Twitter regulars**, not SC's network → insight is obvious | Medium-High | Check whether recurring accounts also quote *non-SC* launches in the same period (e.g. a comparable non-SC funding announcement). If yes, they're generalists, not SC assets. |
| 4 | **Naming individuals as paid** — reputational/legal | High | Never assert payment. Report recurrence and timing only; anonymise or aggregate below the top tier if in doubt. |
| 5 | **Tiny n (9 launches)** → overfitting | Medium | Present founder-reach and format findings as hypotheses with the n stated; make only the recurrence/timing findings the headline. |
| 6 | **Airwallex outlier distorts aggregates** | Medium | Report medians; show Airwallex separately. |
| 7 | **twitterapi.io ToS / X data-use concerns** | Low-Medium | Read-only public data, small volume, no redistribution of raw text; store IDs and aggregates. |
| 8 | **The insight is obvious to SC** | Medium | Pre-check: does SC anywhere publish network concentration or timing? (Research found no such publication.) Obviousness risk is lower for concentration than for "creators help." |
| 9 | Metric drift (views/likes change after collection) | Low | Timestamp every fetch; report "as of" dates. |
| 10 | Confusing correlation with causation | Medium | Language discipline; frame as "associated with," never "caused." |

---

## 9. Recommended research direction

**Research question:**
> Across the nine launches Social Capital publicly claims, is there a recurring core of amplifier accounts on X, how concentrated is it relative to the "300–500 creators" claim, how quickly after the anchor post does it act, and does it explain launch reach better than the founder's own follower count?

**Why this one:** it is measurable with <$3 of public data; it uses SC's own anchor claims for attribution (no guessing which launches are theirs); it tests SC's core thesis rather than restating it; it produces a definite answer either way (concentrated core vs. diffuse organic) and both answers are interesting; and the Deel/Airwallex cases provide natural controls.

**Secondary questions (only if time allows):** reply-bait share; format vs. reach; LinkedIn engagement parity.

**Explicit non-goals:** identifying paid relationships; Lovable; LinkedIn reposter graphs; building a general creator database.

**Gate before build:** run the four assumption checks in Section 3 (≈30 min, ~$0.10). If checks 1 and 2 fail for most launches, downgrade to DO NOT BUILD in this form.

---

## 10. Source list

| Title | URL | Establishes | Confidence / relevance |
|---|---|---|---|
| Social Capital Inc. home | https://www.sociallcapital.com/ | Guarantee claim, 300M views/mo, <20 people, three-component method | Primary / high |
| Careers | https://www.sociallcapital.com/careers | Hiring philosophy (taste, conviction, first principles); open roles | Primary / high |
| Head of Growth | https://www.sociallcapital.com/careers/head-of-growth | "Reach = f(retention, retweet rate, CTR)", >500 creators, 10M-view guarantee, role builds influencer teams | Primary / high |
| Work index | https://www.sociallcapital.com/work | Nine claimed launches with dates | Primary / high |
| Work pages (Icon, Superblocks, Deel, Cartesia, Gamma, Airwallex, Poly AI, Wispr Flow, PlayerZero) | https://www.sociallcapital.com/work/<slug> | Each is one embedded founder post; anchor X IDs and LinkedIn URLs | Primary / high |
| fxtwitter API for 9 anchor IDs | https://api.fxtwitter.com/status/<id> | Views, likes, RTs, replies, quotes, author followers, media, timestamps (fetched 2026-09-16) | Primary data / high |
| Gamma LinkedIn anchor (logged-out) | https://www.linkedin.com/posts/grantslee_...-7393646492839763968-Bws- | 5,328 reactions, 811 comments visible without login | Primary data / high |
| LinkedIn company page | https://www.linkedin.com/company/socialcapital-inc | "200M views… 300+ creators"; 22 employees; inconsistency with site | Primary / medium (stale) |
| Vijay Bharadwaj LinkedIn | https://www.linkedin.com/in/vjbharadwaj/ | Technical Generalist post exists (free Claude/Codex, <25yo); full tier text not retrievable logged-out | Primary / medium |
| Tracxn profile | https://tracxn.com/d/companies/social-capital/... | Founders, 2025, unfunded, process description (edits creator posts, ghostwrites), competitor list | Secondary / medium |
| Luma: The Virality Playbook (Lightspeed × SC) | https://luma.com/lsipxsocialcapital | Client list incl. Lovable; "100M+ views/month" | Secondary / high |
| Lightspeed India LinkedIn posts (×2) | https://www.linkedin.com/posts/lightspeed-india_... | "100M-impression distribution engine"; comment-to-get-DM mechanic | Secondary / medium |
| Vedika Bhaia hiring post | https://www.linkedin.com/posts/vedikabhaia_... | Budgets >$1M, multi-launch ops, client list | Primary / high |
| Ruchir Jajoo hiring tweet | https://x.com/ruchirjajoo/status/2030994338193592501 | Role criteria ("top 1% viral sense") | Primary / medium (paywalled fetch; via search snippet) |
| Gridd | https://gridd.agency/ | Direct competitor describing the coordinated-quote-tweet cluster mechanic and hour window | Secondary / high (mechanism corroboration) |
| Okara viral launch handbook | https://okara.ai/viral-launch-x-handbook | 50 supporters, Tue 9am ET, first-hour velocity, quote-tweet emphasis | Secondary / medium |
| Higgsfield X ban case study | https://www.caimera.ai/blogs/higgsfield-ai-twitter-ban-case-study... | $200/quote-tweet undisclosed campaign → suspension; risk of naming paid creators | Secondary / medium |
| Icon launch breakdown | https://community.startuptalky.com/discussions/post/this-guy-recently-blew-past-5-... | "Comment to claim" reply-bait mechanic on LinkedIn; 9.5K likes; $5M ARR/30 days | Secondary / medium |
| twitterapi.io quotes endpoint docs | https://docs.twitterapi.io/api-reference/endpoint/get_tweet_quote | Params, per-quote fields (followers, viewCount, createdAt), 20/page | Platform docs / high |
| twitterapi.io advanced search guide | https://twitterapi.io/blog/twitter-advanced-search-api-guide | Operators, $0.00015/result, depth caveat | Platform docs / high |
| X API pricing 2026 (docs + Postproxy/Blotato summaries) | https://docs.x.com/x-api/getting-started/pricing | Pay-per-use $0.005/read; Basic/Pro closed to new devs; quote-write endpoints removed Apr 2026 | Platform docs / high |
| Apify LinkedIn scraping guides | https://use-apify.com/blog/linkedin-scraper-tutorial-2026 | No official API for others' posts; logged-out scraping legally safest; comments high-risk | Secondary / medium |
| TechCrunch Gamma | https://techcrunch.com/2025/11/10/... | Independent cross-reference for Gamma launch date/claims | Secondary / high |
