# RentConverter 2027 — Product Rebuild & Controlled Weekly Release Train

**Status:** owner-directed rebuild; working plan, not authorization to deploy.  
**Created:** 2026-11-12  
**Production baseline:** main `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a` (Netlify published 2026-10-15).  
**Working branch:** `planning/2026-11-2027-rebuild`.  
**Owner's goals:** meaningful direct-user value, sustainable AdSense eligibility, stronger search performance, staged 2027 rollout, no forced weekly publication of low-value work.

## 0. Non-negotiable facts and uncertainties

1. The owner's AdSense screenshot updated 2026-11-01 lists **Needs attention → Low value content** and **ads.txt → Not found**. Do not claim a Google Search manual penalty or that a particular page caused the rejection. These are separate systems.
2. The latest verified detailed GSC snapshot from prior reviews: 5 clicks / 1,689 impressions / CTR 0.30% / avg position ~63.6 in a settled 28-day window; previous-window impressions ~1,157 (increase ~46%); homepage ~1,472 impressions at ~70; narrow winners biweekly-to-weekly ~3.4, weekly-to-monthly ~2.6, PCM-to-PW ~3.3. These are HISTORICAL, not current.
3. Owner subsequently supplied 6 months of GSC and Bing exports, verified and summarized in `ai-issues/RC-002_SEARCH_EVIDENCE_2026-11-12.md`. Latest data ends Nov 10, 2026. Use the **1 Google click / 802 impressions versus 3 / 490 prior 28 days** baseline, and Bing **222 versus 260 clicks**; see detailed limitations in RC-002. GSC Wizard is unavailable: DO NOT use it.
4. Verified repo architecture: static-prerendered React Router; 60 canonical routes and 112 301 aliases, no production server runtime. Verify every count again before changing and after each package.
5. Repo currently has `public/ads.txt` with an AdSense seller line. AdSense says **Not found**, which does not prove the file is missing from code or production. Verify both apex and www HTTP status/body/redirect/crawlability/robots/cache/Netlify deploy; Google's status can lag. Avoid duplicate or incorrect publisher ID changes.
6. Preserved owner directive: read `ai-issues/AD-PLACEHOLDER-SAFETY.md` before ANY ad UI/logic modification. Never reintroduce placeholder overlap with a rendered ad. No actual ad network interaction should be simulated as sufficient proof.
7. Existing `ADSENSE_READINESS_REVIEW.md` from 2026-05-07 reports 0 high/medium risk from structural audits, despite later denial. Therefore audit score is NOT an AdSense approval proxy. Replace the *quality standard*, not merely a pass/fail number.
8. On the homepage, `app/client/components/navigation/AllRentalToolsLinks.tsx` renders a full tool directory ONLY on `/`, and `app/client/components/navigation/Footer.tsx` mounts it. It is not incorrectly rendered on every page; do not misdiagnose that.
9. UK PW/PCM copy and calculators currently explain a 365-day daily-rate basis, while some UK rental/budget contexts use 52/12. Neither convention should be overwritten sitewide; first define scenarios and acceptance examples with official-source verification.

## 1. Product thesis and quality bar

**Thesis:** RentConverter must help renters complete real decisions: (a) normalize advertised rent periods, (b) compare actual total housing cost, (c) understand income/cash-flow feasibility, (d) split expenses transparently, (e) plan payments and move-in amounts, and (f) interpret regional conventions carefully. Repeat utility is more important than keyword inventory.

**Human-first acceptance (every indexable page):**
- A visitor should be able to perform the distinct task quickly on mobile without reading an SEO essay.
- The tool presents relevant inputs, consistent validation, accessible output, correct units, transparent period/rounding assumptions, useful error states, and at least one next action (copy/share/print/save where justified).
- Distinct from its nearest sibling in actual purpose, logic/assumptions, result interpretation, or genuinely different jurisdiction. Mere H1 rewrite or 550+ words does not count.
- Demonstrably helpful examples calculated from tested logic; no fabricated study, market rent statistic, expert review, customer quote, official endorsement, or date stamp.
- Helpful, concise, original explanations, with authoritative primary links for jurisdiction-sensitive claims and date checked when applicable.
- Accurate About/Contact/Privacy/Methodology transparency; real authorship only; genuine testing claims only.
- Visible core tool value in initial mobile viewport; ad content never crowds or impersonates tool UX.
- Search indexability is a per-page decision supported by direct usefulness and available performance signals, not programmatic text volume.

**Quality gate must include genuine hands-on browser use, not only static checks.** Have an independent reviewer simulate tasks on 360/390/768/1280/1440 widths, keyboard, screen-reader semantics, JS on/off where relevant, errors, and print.

## 2. Protected pages and invariants

**Protect until positive evidence supports changes:**
- `/biweekly-to-weekly-rent-converter`
- `/weekly-to-monthly-rent-converter`
- `/pcm-to-pw-calculator`
- Home canonical `/`, but homepage content may be redesigned incrementally with SEO baseline/rollback.
**Monitor carefully (historical declines, require fresh data):**
- `/pw-to-pcm-calculator`
- `/lease-date-calculator`

Always preserve: all live valid old URLs with appropriate 301 mapping; www/no-slash canonicals; 404 semantics; sitemap only eligible canonicals; `public/robots.txt`; `public/ads.txt`; calculator inputs/outputs/precision and saved-state behavior; print/export; a11y; consent-gated PostHog; protected ad-placeholder policy. Noindex/redirect/delete decisions require individually written rationale and owner gate for previously ranking pages.

## 3. Technical findings as of Nov 12

- Source: `app/routes.ts`, `app/client/data/routeRegistry.ts`, `app/client/data/generatedRouteConfigs.ts`, `app/client/components/generated/GeneratedPages.tsx`, `app/routes/home.tsx`, `app/client/components/navigation/{NavBar,AllRentalToolsLinks,Footer}.tsx`.
- Production: Netlify site `rent-converter` ID `496cf76e-f5ec-4810-824e-723ef0f8b6e9`; deployed SHA `50c4647`. Pushing `main` triggers production immediately. Never use main as workspace.
- Prior work consolidated exact-amount and salary routes to aliases; no reason to resurrect them. Existing custom and generated calculators use different precision/method paths; normalization and edge-case testing can be improved without rewriting proven routines.
- The static quality audit (`scripts/page-quality-audit.mjs`) uses min-word-count and superficial structure to classify risk. The problem is not simply insufficient words.
- Several generated pages share templates. Inspect page-pair output and real user tasks, not just token/text similarity.
- Homepage has a top `Advertisement` placeholder and several ad reserves while the account shows a rejection; inventory/visual emphasis needs owner-approved UX review with the protected ad overlap rule intact.
- Need independent production checks for ads.txt (both hosts), sitemap.xml, robots.txt, absolute canonicals, Google-selected canonicals where export exists, responsive performance and actual app interactions.

## 4. No production change until acceptance

**GitHub work:** Build candidate packages on isolated `build/rc27-...` branches. Stage reviewed release slices on `release/2027-W01-...` etc once enough complete. A branch/PR commit is allowed; **never** commit to, push to, merge to, or deploy `main` from an unattended run. User may separately authorize a specific urgent hotfix merge after preview acceptance. No destructive force push. Inspect and preserve pre-existing worktree changes (including untracked) before work.

**Netlify:** Preview for each draft PR; immutable deploy URL, deployed SHA, JS-enabled and JS-disabled audits, 360/390/768/1280/1440 responsive checks. Preview must not emit AdSense/live analytics/CMP requests if prohibited by established preview isolation. If preview generation isn't available, record blocker and withhold main release.

**Per-package release gate** (no exceptions without explicit owner approval):
1. Functional behavior and assertions enumerated before implementation.
2. Before/after screenshots with actual task walkthroughs (primary controls/result/error/print).
3. `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm run validate:redirects`, `npm run validate:breadcrumbs`, `npm run release:audit`. Read actual package scripts; update tests only alongside changed implementation, don't delete assertions just to turn green.
4. Static HTML and browser checks: every required route, metadata/H1, canonical, JSON-LD (valid types), robots, noindex, sitemap, 301, real HTTP 404, navigation/breadcrumbs, internal links, saved state, hydration, print, mobile tap targets, keyboard focus, input locale/format, consent.
5. Explicit regression suite protecting three existing winners plus arbitrary input matrices (zero, decimals, huge values, leap years, dates on month-ends, weekly vs 4-week, fortnight vs semi-monthly, UK vs AU conventions).
6. Independent skeptical review: compare candidate with prior production and two live competing workflows; look for regressions and generic/templated text that a real person wouldn't want.
7. Evidence report under `ai-issues/`: exact diff, pages changed, screenshots, coverage, browser/CI results, current and prior origin URLs, unresolved issues, suggested rollback.
8. Stop if content is inaccurate, preview ads/analytics leak, tools regress, canonical/redirects break, performance collapses, protected winner worsens, or human quality isn't meaningfully better. Revert only the candidate (never wipe unrelated work).
9. Owner review must explicitly say which exact prepared PR and SHA to merge. No automatic merge of release branch; production verification after any authorized main merge.

## 5. Measurement plan: 6-month exports + rolling comparisons

Required when available: GSC Web Search daily/date, Pages, Queries, Page-Query, Countries, Devices, Search appearance, Indexing/Pages, Sitemaps; Bing six-month search performance by URL and query, index coverage/crawl warnings/screenshots. Preserve original exports read-only under private owner storage or non-sensitive evidence paths (never publish private customer data or account exports to public repo).

**Analysis:** 6-month daily trend and changepoints; last settled 28d vs prior 28d; changes since July architecture and Oct notes; top 10 actual traffic/intents; query clusters (weekly↔monthly, biweekly/fortnight, PW/PCM, 4-week, affordability, required income, split, lease, US/CA/UK/AU); top overlapping page-query pairs; distinguish one-off noise vs repeatable demand; winners positions 4–20 with material impressions; country/device breakdown; clicks/CTR conditional on rank, not CTR-only speculation. Compare Bing separately, don't sum mismatched definitions. Annotate source dates, query/data truncation, excluded recent partial days, and uncertainty. Maintain a searchable 6-month evidence ledger.

**KPIs:** useful task completions, input→result success (aggregated and privacy-safe), reportable calculator errors, repeat use/print/share where consent permits, AdSense review status, GSC non-brand clicks + impressions and position bins by chosen intents, top pages retention, valid index coverage, mobile Web Vitals. Do NOT invent event data. 2–4 weeks may be too little for rankings to settle; no arbitrary SEO outcome promises.

## 6. Time-phased build: 13 four-week tranches across 2027

A tranche is development/acceptance scope, not 4 mandatory publishes. Each weekly release must be ready, small, and non-disruptive. Build future packages ahead and publish gradual, independently accepted slices; no forced changes. Reserve W01–W52 names when staging, don't create 52 empty branches.

| Tranche | Weeks | Product scope | Shippable increments / prerequisites |
| --- | --- | --- | --- |
| T01 | W01–04 | Research & quality foundation | Page-purpose ledger; human review framework; real UX baseline; ad-status audit and policy-safe, urgent repairs |
| T02 | W05–08 | Core rent converter experience | Clearer frequency selection, assumptions, 4-week/PCM distinction, accessible responsive result; preserve winners |
| T03 | W09–12 | Weekly/monthly and biweekly excellence | First-class listing comparisons; consistency across siblings; verified formula examples; controlled internal links |
| T04 | W13–16 | PW / PCM and regional convention | Source-verified UK/365/52 contexts; choice explained, no global silent formula swap |
| T05 | W17–20 | Affordability decision tool | Gross vs take-home, realistic expense categories, thresholds as heuristics not eligibility rules; no invented tax calculations |
| T06 | W21–24 | Paycheck & cash-flow planning | Weekly/biweekly/semi-monthly pay scheduling, rent reserve targets; offline/simple controls |
| T07 | W25–28 | Split household expenses | Roommate equality, custom percentage, income weighting, cent-reconciling and fairness caveats |
| T08 | W29–32 | Move-in/proration and lease | Accurate partial rent, calendar dates, payments due, PDF/print/calendar export if valuable |
| T09 | W33–36 | Rent increases and scenario analysis | One-off vs compound; legal info only with verified sources and dates |
| T10 | W37–40 | Region quality & precise terminology | US/Canada/UK/Australia terminology and legitimate distinctions only, no location-page factory |
| T11 | W41–44 | Renter comparison workspace | Compare/save multiple listings locally; privacy-first; verified totals and recurring costs |
| T12 | W45–48 | Trust, accessibility, mobile performance | Real QA/fixes from traffic and user feedback; metadata/schema only where accurate |
| T13 | W49–52 | Product maturity/AdSense eligibility | Human editorial pass; outdated/overlap decisions; approval readiness review and next-year roadmap |

**Cadence:** Each Saturday (or owner's later choice) prepare upcoming PR/release decision; weekly owner-approved merge, never a forced publish. Work on 2027 candidates in 2026 when possible. Build-first, ship gradually; if an urgent safe bug fix is verified, stage a separate `hotfix/2026-Wxx-...` branch and seek owner authorization to merge immediately rather than waiting for January.

**Progress gates:** At the end of each tranche, demand finished code, browser-verified preview, unit/integration/regression evidence, editorial checks, and human-review summary. An analysis-only package is not "complete" if implementation was scoped and blockers are solvable.

## 7. Quality improvements with highest near-term leverage

**P0 (do now but stage safely):**
- Verify `ads.txt` apex + www status, body, content-type, 301 chain, robots and actual Netlify artifact. If broken: tiny isolated fix with HTTP evidence. If good: do NOT change just to satisfy stale AdSense status; document verification/check lag.
- Test opening/using primary calculator mobile 360/390 including huge tool directory and ad placeholders. Inspect for crowding, low actual content above fold, redundant page sections, broken controls/formatting.
- Build a 60-page *human-review matrix*: purpose, unique task, current interaction, nearest sibling, example uniqueness, index/canonical, actual evidence, keep/improve/merge/noindex/redirect proposed, confidence, owner gate. Do not bulk noindex/delete based on word similarity.
- Identify one legitimate immediate value upgrade on main calculator/hub or distinct page based on evidence, with no ad lifecycle changes; stage as draft hotfix/PR for explicit merge decision.
- Build a crawler for factual math/formula contradictions on generated prose vs actual output.
- Replace fake `quality=pass` thresholds with falsifiable value checks and independent skeptical review.
- Capture visual baseline and screenshots with JS on/off and 5 viewports before implementing design system.

**P1 (early 2027):** better comparison workflows, print/share, clearer formula mode and country distinctions, targeted navigation hierarchy, distinct guides with source citations.  
**P2 (later):** local listing-compare workspace and value-added export; new indexed routes only if independent user value and demand demonstrated.

## 8. AdSense resubmission gate and safeguards

Do NOT repeatedly resubmit after cosmetic adjustments or promise approval. Owner may choose when to request review after (i) meaningful core product uplift is live, (ii) indexable pages manually audited, (iii) truthfulness/ownership/contact/privacy correct, (iv) ad placement/no accidental clicks tested, (v) ads.txt status investigated, (vi) navigation and mobile value independently reviewed. AdSense screenshot/status remains evidence, not an engineering test. Check current official AdSense policy at review time.

Official guidance:
- https://support.google.com/adsense/answer/7299563
- https://support.google.com/adsense/answer/12170222
- https://support.google.com/adsense/answer/7679060
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## 9. Source hierarchy, reporting, and owner gates

1. Owner's direct requirements and protected `ai-issues` directives.
2. Actual live production/deploy SHA and current repository implementation.
3. Dated verified GSC/Bing six-month exports (latest 28v28 for freshness); label snapshots.
4. Official policies and official jurisdiction references.
5. Reproduced browser tests and competitor workflows. Search snippets and speculative SEO diagnoses are not proof.

Every long-running Codex session must persist progress in `ai-issues/RC-...` files *on its working branch*; explicitly list DONE / PARTIAL / BLOCKED / NOT STARTED with evidence, not wishful completion. If one item blocked, proceed on independent items. Avoid premature shutdown or "done" after only writing an analysis report. No main push/merge/deployment without specific approval; no paid changes, new tracking, or misleading approval claims.

