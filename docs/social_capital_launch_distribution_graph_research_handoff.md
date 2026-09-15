# Social Capital Technical Generalist — Launch Distribution Graph Research Handoff

## Purpose

This is a **research-only handoff** for a second possible project to build as part of my application to Social Capital Inc.

**Do not implement anything yet. Do not scaffold the project. Do not write production code.**

The goal is to independently validate this idea and compare its feasibility and potential against the separate **Creator Network / Distribution Intelligence** idea.

After the research, return the complete research findings to me.

**I will validate the research and compare both ideas before we decide what to build.**

---

# Application context

I am applying for a Technical Generalist role at Social Capital Inc.

The role emphasizes:

- Builder mentality
- First-principles thinking
- AI-native behavior
- Self-direction

The application asks for AI projects and classifies them as:

### S-tier
Harnesses or specialised multimodal tools connecting to more than one external API/app.

### A-tier
LLM-based text tools connecting to complex sources of context and/or APIs.

### B-tier
LLM-based multimodal creation tools using fewer than two API calls to produce the result.

They also propose a fallback exercise:

> Build a vibe-coded web tool that aggregates all public information about one operational aspect of what Social Capital does (videos/influencers/assets) and try to uncover one non-obvious insight about how they do things.

They estimate roughly 4–5 hours of work.

---

# Existing project context

I already have an existing project called **Orky**.

Orky is an agentic AI platform that orchestrates workflows across 17 live app clients including ServiceNow, AWS, Jira, Salesforce, SAP, Snowflake and SharePoint.

It uses an LLM/function-calling loop to select and chain real API actions and includes workflow/RAG/RBAC functionality.

Orky is relevant because it already provides evidence of AI orchestration and multi-API work.

Therefore, this new project does **not** need to prove that I know how to connect an LLM to APIs.

The reason to explore this project is to demonstrate:

- independent problem selection,
- research ability,
- first-principles reasoning,
- understanding of distribution systems,
- ability to work with messy public data,
- and the ability to turn ambiguous information into a useful model or insight.

---

# The idea

## Working concept: Launch Distribution Graph

The core idea is to reconstruct **how a product launch propagates through people and platforms over time**, using only publicly available information.

Instead of looking at a launch as a collection of isolated posts, the system would conceptually model it as a network/timeline:

```text
Company / Founder
        ↓
Initial announcement
        ↓
Creator / influencer A
        ↓
Creator / influencer B
        ↓
Secondary amplification
        ↓
YouTube / LinkedIn / X / other channels
        ↓
Additional creators / accounts
        ↓
Broader distribution
```

The research question is:

> **Can we reconstruct enough of the public trail around a launch to understand how the launch actually propagated through people, platforms and time?**

The eventual tool would investigate a selected Social Capital-supported launch and attempt to reconstruct its observable distribution graph.

Potential entities could include:

- the client/company,
- founders,
- Social Capital,
- creators,
- influencers,
- X accounts,
- LinkedIn accounts,
- YouTube channels/videos,
- launch posts,
- follow-up posts,
- reposts/quotes,
- videos,
- timestamps,
- engagement signals,
- and relationships between these entities.

Again, these are possible entities, **not an implementation specification**.

---

# What makes this different from the Creator Network idea

The Creator Network idea asks:

> **Who is valuable to the distribution network?**

This idea asks:

> **How did a specific launch move through the network over time?**

The emphasis is therefore on:

- propagation,
- sequence,
- timing,
- relationships,
- cross-platform movement,
- amplification,
- and network structure.

The objective is not to produce a creator leaderboard.

The objective is to understand the **mechanism of propagation**.

---

# The potential non-obvious insight

The final goal is to uncover something that isn't immediately obvious from looking at a launch's individual posts.

Examples of possible research questions include:

- Does distribution appear to happen in distinct waves?
- Are certain accounts consistently early nodes?
- Are some smaller creators important bridges between communities?
- Does content move from one platform to another in a repeatable sequence?
- Do certain creator clusters activate around particular launch categories?
- Does early distribution appear to precede broader amplification?
- Are the highest-reach accounts actually central to propagation, or are other accounts structurally more important?
- Does the observable network look centralized or distributed?
- Are there repeated propagation patterns across multiple launches?

These are **hypotheses only**.

Do not assume any of them is true.

The research must determine whether public evidence can actually support such conclusions.

---

# Core principle

The project should not manufacture a graph simply because graphs look impressive.

A graph is useful only if the underlying relationships can be established with reasonable confidence.

For example:

> Creator A posted about Product X two hours after Creator B.

is observable.

But:

> Creator B caused Creator A to post.

is generally **not** observable from public data alone.

The research must carefully distinguish:

### Observable
What happened publicly.

### Inferred
What is strongly suggested by multiple pieces of evidence.

### Causal
What we can actually establish.

Do not confuse the first category with the third.

---

# What you need to research

## 1. Business validation

Deeply research how Social Capital describes its distribution operation.

Determine:

- How important launch sequencing appears to be.
- How Social Capital describes creators/influencers.
- How Social Capital describes distribution.
- Whether timing and propagation appear to be part of its operating model.
- Whether public launches expose enough information to reconstruct meaningful propagation.
- Whether understanding propagation would actually be useful to Social Capital.
- Whether this would reveal something beyond what a normal social analytics dashboard provides.

The key question:

> **Would a technically strong reconstruction of launch propagation actually demonstrate understanding of Social Capital's business?**

---

# 2. Find the best launch to study

Research candidate Social Capital launches, including but not limited to:

- Gamma
- Lovable
- Deel
- Wispr Flow
- Cartesia
- Airwallex

For each launch, investigate:

- Social Capital's own case study/work page.
- Public launch posts.
- Founder posts.
- Creator/influencer posts.
- X activity.
- LinkedIn activity.
- YouTube/video activity.
- Timing information.
- Engagement information.
- Cross-platform references.
- Evidence of reposts/quotes/replies.
- Evidence of relationships between accounts.
- Public launch announcements.
- Public third-party coverage.

Rank launches according to:

1. **Amount of public evidence**
2. **Quality of timestamps**
3. **Ability to identify participants**
4. **Ability to establish relationships**
5. **Cross-platform coverage**
6. **Likelihood of producing an interesting insight**
7. **Feasibility within 4–5 hours**

Do not choose a launch merely because it is famous.

---

# 3. Technical data feasibility

Research what can realistically be collected from public sources.

Investigate:

### X

- Public post visibility
- Search/retrieval options
- Historical access
- Timestamps
- Engagement
- Reposts/quotes/replies
- API availability
- Authentication
- Cost
- Rate limits
- Third-party alternatives
- Reliability

### LinkedIn

- Public post availability
- Historical discovery
- Creator/company pages
- Timestamps
- Engagement
- Practical retrieval constraints
- API limitations
- Third-party options

### YouTube

- Search
- Video metadata
- Publication timestamps
- Channel information
- Views
- Engagement
- Transcripts/captions
- API availability and limits

### Web

- Search engines
- Public websites
- Articles
- Launch pages
- Newsletters
- Blog posts
- Case studies
- Public archives

Determine which sources are actually practical within the time constraint.

Do not assume a source is technically usable simply because a human can open the page in a browser.

---

# 4. Relationship reconstruction feasibility

This is the hardest technical question.

Research whether we can reliably establish relationships such as:

- A reposted B.
- A quoted B.
- A mentioned B.
- A video referenced B.
- A creator posted shortly after another creator.
- A launch post was followed by a wave of creator content.
- A creator appears across multiple related launch artifacts.

For every relationship type, classify it:

- **Directly observable**
- **Strongly inferable**
- **Weakly inferable**
- **Not realistically determinable**

This distinction is critical.

---

# 5. Temporal reconstruction

Research whether public timestamps are sufficient to reconstruct a meaningful sequence.

Determine:

- How accurate timestamps are across platforms.
- Whether timestamps can be normalized.
- Whether timezone issues matter.
- Whether posts can be ordered confidently.
- Whether deleted/private content creates survivorship bias.
- Whether missing posts would make the graph misleading.
- Whether a meaningful propagation window can be reconstructed.

Explore whether the concept of:

> **launch → first wave → amplification → secondary wave**

can be supported by real evidence.

Again, do not assume these waves exist.

---

# 6. Network analysis feasibility

Research what useful network analysis could theoretically be supported by the available data.

Possible dimensions to investigate:

- centrality,
- degree,
- bridges,
- clusters,
- communities,
- first-mover behavior,
- propagation depth,
- propagation breadth,
- cross-platform transitions,
- repeated participation,
- creator overlap,
- time-to-amplification,
- and other useful graph/network measures.

The important question is:

> **Which metrics would actually tell us something about Social Capital's operating model?**

Avoid meaningless graph metrics just because they are mathematically available.

---

# 7. Insight feasibility

Determine whether this project can produce a **non-obvious insight** within the public-data constraints.

Research possible classes of insights:

### Timing

Who appears early vs late?

### Network structure

Who acts as a bridge between different creator communities?

### Repeated patterns

Do similar propagation structures appear across launches?

### Platform movement

Does information appear to move between X, LinkedIn, YouTube and other sources in identifiable ways?

### Creator roles

Are different creators playing different structural roles?

### Amplification

Does reach appear to come from a few central nodes or many distributed nodes?

### Launch categories

Do different types of products generate different distribution structures?

These are research directions, not assumptions.

For each, determine:

- required data,
- whether the data is realistically obtainable,
- whether the conclusion would be statistically/empirically meaningful,
- and whether it could produce an interesting finding in a tiny research window.

---

# 8. Competitive landscape

Research existing products and projects in:

- social network analysis,
- influencer intelligence,
- creator intelligence,
- social listening,
- launch analytics,
- viral content analysis,
- network visualization,
- marketing intelligence,
- social graph analysis.

Determine:

- What existing tools already do.
- What data they have.
- Whether they already reconstruct propagation graphs.
- Whether they provide causal/sequence insights.
- Whether our proposed research is merely a visualization layer.
- Whether there is a meaningful differentiated angle.

We are not trying to compete commercially.

The goal is to determine whether this would look **original enough as a hiring exercise**.

---

# 9. Application-fit validation

Evaluate the concept against the four traits Social Capital explicitly cares about.

## Builder mentality

Does building this require solving a real ambiguous problem?

## First principles

Does the project require questioning assumptions about how launches spread?

## AI-native behavior

Would AI/agents meaningfully help with source discovery, extraction, entity resolution and analysis?

Or would AI just be decorative?

## Self-direction

Does the project demonstrate that the candidate independently chose:

- what to investigate,
- which evidence matters,
- what relationships are valid,
- and what constitutes an insight?

Also compare this project concept with **Orky**.

The new project should add a different signal rather than simply showing another version of API orchestration.

---

# 10. 4–5 hour feasibility

The hiring post explicitly says the alternative exercise should take roughly 4–5 hours.

Research what is actually possible within that constraint.

Do not assume the entire historical distribution graph can be reconstructed.

Determine whether a credible version could instead focus on:

- one launch,
- one defined time window,
- one subset of platforms,
- one specific propagation question,
- or another appropriately narrow scope.

Identify:

### Essential

What must exist for the result to be credible?

### Optional

What would make it better but isn't necessary?

### Scope traps

What would consume most of the 4–5 hours while adding little insight?

---

# 11. Failure modes

Investigate the major ways this idea could fail.

Examples:

- insufficient public data,
- missing historical posts,
- platform API restrictions,
- incomplete engagement data,
- deleted content,
- private accounts,
- inability to identify creators reliably,
- cross-platform identity resolution problems,
- inability to determine causality,
- false propagation relationships,
- survivorship bias,
- time-zone inconsistencies,
- graph looking impressive but saying nothing useful,
- insight being obvious,
- insight being statistically unsupported,
- excessive engineering required before any insight appears.

Rank these by severity.

---

# Research quality requirements

Use deep research.

Prioritize:

1. Social Capital's own website
2. Social Capital case studies/work pages
3. Social Capital careers material
4. Public posts from Social Capital leadership
5. Public launch posts
6. Public creator/influencer posts
7. Platform/API documentation
8. High-quality reporting
9. Existing academic/technical work on information diffusion and social networks
10. Existing commercial tools

Clearly label:

- **Verified fact**
- **Strong inference**
- **Hypothesis**
- **Unknown**

Do not turn weak public signals into confident claims.

---

# Known starting resources

These are starting points only. Find additional relevant sources.

## Social Capital

Main website:

https://www.sociallcapital.com/

Careers:

https://www.sociallcapital.com/careers

Head of Growth / distribution methodology:

https://www.sociallcapital.com/careers/head-of-growth

Gamma case study:

https://www.sociallcapital.com/work/gamma

Wispr Flow:

https://www.sociallcapital.com/work/wispr-flow

LinkedIn company page:

https://www.linkedin.com/company/socialcapital-inc

Vijay Bharadwaj:

https://in.linkedin.com/in/vjbharadwaj

---

## External references

Lightspeed / Social Capital material:

https://luma.com/lsipxsocialcapital

Lightspeed post discussing Social Capital's distribution engine:

https://www.linkedin.com/posts/lightspeed-india_this-is-how-social-capital-inc-pulls-viral-activity-7447902230118060032-COvi

Lightspeed post featuring Ruchir Jajoo:

https://www.linkedin.com/posts/lightspeed-india_meet-ruchir-jajoo-co-founder-of-social-capital-activity-7447256819879608321-yNdH

Vedika Bhaia / Social Capital hiring material:

https://www.linkedin.com/posts/vedikabhaia_were-hiring-for-a-head-of-growth-50-lpa-activity-7445434890646581248-E5Bv

---

# Important analytical constraint

Do not claim that one person caused another person's post merely because it happened later.

For example:

```text
A posted at 10:00
B posted at 11:00
```

supports:

> B followed A in time.

It does not automatically support:

> A caused B.

If causal relationships cannot be established, the eventual product should describe them as **observed sequences or associations**, not causal propagation.

This distinction should be reflected throughout the research.

---

# What I want back

Return a structured research report.

## Executive verdict

Choose one:

- **BUILD**
- **BUILD WITH CHANGES**
- **DO NOT BUILD**

Explain why.

## 1. Business validation

Does the problem actually matter?

## 2. Best launch candidates

Rank candidate Social Capital launches with evidence and feasibility.

## 3. Data-source matrix

For every important source:

| Source | Public data | Historical access | Timestamp | Engagement | Relationships | Practicality |
|---|---|---|---|---|---|---|

Use verified information.

## 4. Relationship feasibility

For each relationship type, classify what can actually be established.

## 5. Temporal feasibility

Can a meaningful launch sequence be reconstructed?

## 6. Network-analysis feasibility

Which graph/network concepts would produce useful information?

## 7. Insight potential

What genuinely non-obvious findings could this support?

Separate:

- plausible,
- weak,
- unsupported.

## 8. Competitive landscape

What already exists and how differentiated is this?

## 9. Application-fit score

Score 1–10:

- Builder mentality
- First principles
- AI-native
- Self-direction
- Originality
- Technical generalism
- Likelihood of impressing the hiring decision-maker

Explain each score.

## 10. 4–5 hour feasibility

Give a realistic assessment.

## 11. Risks

Rank the biggest failure modes.

## 12. Final recommendation

If the idea survives:

- define the **specific research question** we should pursue,
- identify the **best launch**,
- identify the **minimum useful dataset**,
- and explain what would constitute a successful result.

Do not turn this into an implementation plan.

---

# Comparison requirement

Because I am separately researching a **Creator Network / Distribution Intelligence** concept, include a final comparison section:

## Launch Distribution Graph vs Creator Network Intelligence

Compare:

- business relevance,
- data availability,
- technical difficulty,
- 4–5 hour feasibility,
- insight potential,
- originality,
- AI-native signal,
- first-principles signal,
- self-direction signal,
- risk of producing a shallow result,
- and overall application strength.

Give each a score from 1–10 and then make a recommendation about **which idea deserves implementation if only one is chosen**.

The recommendation must be based on the research, not on which concept sounds more exciting.

---

# STOP CONDITION

**Do not implement anything.**

Do not create a repo.

Do not scaffold.

Do not write application code.

Do not choose APIs for implementation.

Do not start building the UI.

**Only perform the deep business + technical research and return the research results.**

I will review and validate the findings before giving approval for implementation.
