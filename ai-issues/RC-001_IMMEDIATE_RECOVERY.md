# RC-001 — Immediate Recovery / W47-W48 Discovery and Implementation Gate

**Status:** READY FOR CODEX EXECUTION; not released.  
**Base:** `planning/2026-11-2027-rebuild` built from production main `50c4647`.  
**Target implementation branch:** `build/2026-W47-rentconverter-value-recovery`; stage small independent PRs; never auto-merge.  
**Acceptance:** prove meaningful user benefit and technical correctness; “audit passed” by itself is insufficient.

## Business problem

Owner-provided AdSense screenshot (2026-11-01) shows **Low value content** rejection; ads.txt **Not found**. Verified historical GSC 28-day baseline: 5 clicks / 1,689 impressions / avg pos 63.6. The site has working specific pages but weak authority for broad intents. The last documented technical recovery corrected redirects and prerendering but did NOT demonstrate human-visible differentiated product value or unlock AdSense.

## Task A — Establish a six-month search and page-value ledger

**Verified input now received:** see `ai-issues/RC-002_SEARCH_EVIDENCE_2026-11-12.md` for six months of owner-supplied GSC/Bing daily exports and 28-vs-28 comparison. GSC latest 28 days **1 click/802 impressions** (prior 3/490), Bing **222 clicks/8,840 impressions** (prior 260/8,074); historical pre-collapse May and the May 31/June 1 changepoint are critical. These exports have aggregated six-month pages and top-1,000 queries, NOT latest-28 page-query pairs; don't invent them. Only request narrower current GSC page-query or indexing exports when a sensitive URL decision needs them. Do not use GSC Wizard. Label evidence snapshot vs observation.

Inventory all 60 canonical indexable routes and all 112 aliases from source, built HTML and sitemap, cross-check. For every route record:
- URL / title / H1 / description / canonical / schema / sitemap yes-no / HTTP response / robots / redirect ancestry.
- User task, tool inputs/outputs/quality, purpose independent of keyword, nearest two siblings.
- Evidence: verified GSC/Bing query/impressions if present; otherwise `NOT MEASURED`.
- Content originality: real distinct examples, useful methodology, references, misleading or stale claims.
- Flags: generic prose, search-page factory, missing interactive value, accessibility, visual distractions, ads-first layout.
- Recommended keep / improve / merge / noindex / redirect / delete + **why**, expected downside and owner gate.
- Protect `/biweekly-to-weekly-rent-converter`, `/weekly-to-monthly-rent-converter`, `/pcm-to-pw-calculator`; do not silently modify their formulas/paths/meta or remove from index.

**Do not** bulk deindex/merge based solely on low impressions or similarity. Sample SERPs; ask whether the visitor could reasonably use a higher-value sibling instead; preserve inbound links and redirects.

## Task B — Verify ads.txt and live ad implications

- Audit `public/ads.txt` already existing, *without inventing new publisher IDs*. Check production GET+HEAD on `https://rentconverter.com/ads.txt` and `https://www.rentconverter.com/ads.txt`; 200 or correct redirect, content-type, exact body, robots permissions, redirects, CDN, Netlify publish contents; compare immutable current deploy.
- AdSense state “Not found” is as of Nov 1 and may be delayed or not checked while site unapproved. Do not claim causality. If file accessible and correct, note no change.
- Independently examine whether empty “Advertisement” boxes crowd above-the-fold content (home plus representative tool pages). Record five viewport screenshots and evidence. Read `ai-issues/AD-PLACEHOLDER-SAFETY.md` before touching ANY ad component. Respect global first-filled-ad placeholder suppression directive; do not invent an ad lifecycle or accidentally restore overlap. Changes to protected ad behavior require explicit owner signoff; propose safe non-ad content/layout alternatives.

## Task C — Run a skeptical user-value audit before coding

Use actual mobile and desktop browser tests (360, 390, 768, 1280, 1440) and keyboard navigation on at least these pages:
- `/` (entry, result, directory)
- `/weekly-to-monthly-rent-converter` and `/biweekly-to-weekly-rent-converter` (PROTECTED, compare only)
- `/pw-to-pcm-calculator`, `/pcm-to-pw-calculator`, `/what-does-pcm-mean-rent`
- `/how-much-rent-can-i-afford-calculator`, `/income-required-for-rent-calculator`, `/rent-budget-calculator`
- `/rent-split-calculator`, `/rent-per-paycheck-calculator`, `/lease-date-calculator`.

For each, test tasks: first run in <60 seconds, change the input, understand units, compare methods, see errors, share/print, mobile text/taps, browser history, direct load with JS disabled, screen reader semantics, no confusing spinner/loading/ads.

Inspect 4–6 credible current competitors across US/UK/AU and note precisely what they let users *do* that RentConverter cannot, and what RentConverter can uniquely do. Do not copy content or design.

## Task D — Implement ONE high-confidence urgent improvement (only after A-C)

Scope the smallest stand-alone behavior change that genuinely helps renters, ideally homepage comparison experience or a critical calculator correctness/transparency issue. Multiple files are OK if one coherent feature needs them. Do not “fix” SEO by adding more paragraphs. Prefer:
- Direct comparison of monthly vs 4-week and weekly/fortnightly from one input with clear payment occurrences and common mistakes; visually obvious, actionable outputs.
- Clear and honest 365-day vs 52-week *budget vs daily-rate* distinction where source-backed and applicable, WITHOUT changing protected math silently.
- Better navigation to the *best* tools for a user decision, not a catalog of keywords, but preserve links and crawlable route access through sitemap/menu.

Pick based on **verified evidence** and show before/after functional screenshots. If evidence does not support safe urgent implementation, deliver the completed audit and candidate branch, clearly say no hotfix justified—do not ship cosmetic or shallow changes.

## Task E — Replace superficial quality gates

Enhance structural page audit so word count/FAQ count are not surrogate human-worth scores. Keep structural checks for safety but introduce:
- duplicate-intent map + feature-differentiation manual evidence;
- actual task-completion and browser accessibility checks;
- formula-example consistency tests;
- staleness/official-source checklist on regional claims;
- independent skeptic acceptance and notes.
Automation cannot confidently certify originality or AdSense approval. `0 medium-risk` must not be reported as “ready for AdSense”.

## Required test/preview and rollback

Run all commands from root README and package.json:
`npm ci`; `npm run typecheck`; `npm test`; `npm run build`; `npm run validate:redirects`; `npm run validate:breadcrumbs`; `npm run release:audit`. Add tests that would fail before the fix and pass after. UI automation: 360/390/768/1280/1440 widths, default and altered values, input errors, JS/no JS, keyboard, no console errors, mobile overflow, ad layers if touched, print, routes, all 301/404/canonicals. Netlify immutable draft preview tied to exact SHA. No production tracking/advertising in preview. Regression: winners, shared math, saved-state and consent.

**Abort/revert candidate (not unrelated local work) if:** calculator rounding/formulas regress; stale/misleading regional claim; sitemap/canonical or 301 break; ad placeholder overlaps any loaded ad; mobile primary interaction deteriorates; preview leakage; any protected winner's behavior unexpectedly changes. A future ranking dip alone may be confounded; flag and investigate before rollback.

## Required deliverables

1. `ai-issues/RC-001_EVIDENCE_LEDGER.md` with source timestamps, 60-route classification and screenshots evidence references.
2. `ai-issues/RC-001_COMPETITOR_AND_UX_REVIEW.md` with real tasks and measurable gaps.
3. `ai-issues/RC-001_CANDIDATE_ACCEPTANCE.md` with exact branch SHA, files, issue fixed, risk, commands and output, links to preview/screenshot, owner manual review.
4. A bounded implementation branch with local linear commits and **draft PR** (if useful change justified), *not* a pushed main commit.
5. A recommendation either **HOTFIX OWNER MERGE**, **STAGE W01** or **DO NOT SHIP**, with one plain-language rationale and rollback instructions.

No main merge, no production deployment, no AdSense resubmission, no paid tools. Do not stop after completing only the first audit; continue independent tasks even when search exports are unavailable.
