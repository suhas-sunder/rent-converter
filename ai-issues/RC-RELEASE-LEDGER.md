# RC-RELEASE-LEDGER — Canonical 2026/2027 weekly release state

**Last reviewed:** 2026-11-13. This ledger records actual evidence only. All five candidates below are implemented, tested and staged as drafts. None is accepted for production. Package-local reports preserve the earlier local review; the hosted reports and this ledger supersede their pending-SHA/preview fields.

| Package | Current status | Branch / exact tested SHA | Preview and tests | Owner / production |
| --- | --- | --- | --- | --- |
| PLAN-2026-11 | DOCUMENTED / DRAFT PR | planning/2026-11-2027-rebuild at d1825c9cfdc523c72bd6eb4177fe2e6451bcb7b5 | Authoritative fetched planning baseline; docs only | No main push |
| RC-001 immediate recovery | IMPLEMENTED / HOLD | build/2026-W47-rentconverter-value-recovery at f344ad29766bb63e185515ed08277a8ac9085247 | [Draft PR 2](https://github.com/suhas-sunder/rent-converter/pull/2), [immutable preview](https://6af6977a997b1f8cde73e05e--rent-converter.netlify.app); 148 tests, all full suites and hosted HTTP audit pass | Proposed urgent fix; not merged |
| 2027 W01 | IMPLEMENTED / HOLD | release/2027-W01-listing-comparison at 62e5e6c0eabeac0c939dabcab21a580e71c8f89d | [Draft PR 3](https://github.com/suhas-sunder/rent-converter/pull/3), [immutable preview](https://6af69ad52629bf99da003eb7--rent-converter.netlify.app); 157 tests, all full suites and hosted HTTP audit pass | Future weekly package; not shipped |
| 2027 W02 | IMPLEMENTED / HOLD | release/2027-W02-housing-budget at f0320bae61112269b85465aa5f23ff91abeba8ad | [Draft PR 4](https://github.com/suhas-sunder/rent-converter/pull/4), [immutable preview](https://6af69ad656cfa2344539eb98--rent-converter.netlify.app/rent-budget-calculator); 156 tests, all full suites and hosted HTTP audit pass | Future weekly package; not shipped |
| 2027 W03 | IMPLEMENTED / HOLD | release/2027-W03-paycheck-deadline at 3c36fa89472caf610b81767fd051b74dbfc13cf8 | [Draft PR 5](https://github.com/suhas-sunder/rent-converter/pull/5), [immutable preview](https://6af69b0c73337f2e792caf49--rent-converter.netlify.app/rent-per-paycheck-calculator); 160 tests, all full suites and hosted HTTP audit pass | Future weekly package; not shipped |
| 2027 W04 | IMPLEMENTED / MOBILE REPAIR VERIFIED / HOLD | release/2027-W04-calendar-export at 155b2a8247449e9523e0e950155338acf573e6c1 | [Draft PR 6](https://github.com/suhas-sunder/rent-converter/pull/6), [immutable preview](https://6af69d4ceab11ecb5c38ff5b--rent-converter.netlify.app/rent-schedule-calculator); 157 tests, full suites and final HTTP audit pass; five-width recapture and keyboard scrolling verified | Future weekly package; not shipped |
| 2027 W05–W52 | ROADMAP ONLY | No empty branch factory | Acceptance & scope only when work exists | Not shipped |

**Current production evidence:** Netlify project rent-converter deployed `main` commit `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a` on 2026-10-15 (deployed, ready). 60 canonical routes/112 aliases per source README. Current baseline should be independently re-verified in upcoming package.

**AdSense evidence:** Screenshot dated 2026-11-01: Needs attention / Low value content; ads.txt Not found. This is not proof of a Search manual penalty. Live apex HTTPS redirects to www and returns the correct 58-byte seller record with HTTP 200; robots permits access and deployed contents match the repository. No ads.txt change was justified. Account refresh/verification timing is external and was not changed. Ad placeholders remain untouched; the repository contains static reserves, not a real ad lifecycle that could prove first-filled-ad suppression.

## What was actually built

- Urgent: prevents malformed money such as 1e3 being silently reinterpreted, corrects directly broken four-week explanations, adds a truthful no-JS notice, isolates preview analytics, and removes word-count-based quality certification.
- W01: two/three rental listing comparison with unlike periods, recurring extras, explicit browser save/load/delete and CSV export on the homepage.
- W02: optional itemized housing budget using actual take-home income, independent bill periods, commitments and savings; no tax or approval prediction.
- W03: actual-payday reserves before a rent deadline, exact cent allocation, due-date opt-in and a corrected four-week summary.
- W04: downloadable all-day rent calendar events with exact displayed dates/amounts, import limitations and date-range validation.

No new routes, sitemap expansion, canonical changes, route retirements, raw analytics exports, ad-account changes or production deployments were made. Existing 60 canonical routes and 112 redirects are retained. Shared exact BigInt money formatting is identically included in W03 and W04.

## Acceptance evidence and honest limits

Every isolated candidate ran typecheck, tests, build, redirect validation, breadcrumb validation and release audit. Every initial immutable preview passed the remote HTTP audit of 60 pages, 112 redirects and 60 internal-link targets. Three protected routes on all five previews matched the production artifact's metadata, defaults and rendered money anchors. Browser task checks and screenshots used all five requested widths. Actual CSV and calendar downloads were inspected.

Read [hosted HTTP evidence](RC-HOSTED_HTTP_ACCEPTANCE.md), [hosted browser evidence](RC-HOSTED_BROWSER_ACCEPTANCE.md), [visual review](RC-HOSTED_VISUAL_REVIEW.md), [independent code review](RC-027_INDEPENDENT_REVIEW.md), [integration evidence](RC-INTEGRATION_ACCEPTANCE.md) and the per-package acceptance reports.

**All candidates remain HOLD:** real print/PDF output, a JavaScript-disabled browser session and runtime request capture could not be verified through the available browser interfaces. Print blocked browser input until the test tab closed; no native print dialog was exposed. The browser exposes no JS-disable or network-capture capability. Source/SSR/deployed-bundle checks are recorded without treating them as those missing browser checks. Full keyboard/screen-reader coverage and exhaustive interactive human review of every canonical page remain incomplete. No search recovery or AdSense approval is promised.

## Release assembly and rollback

All weekly branches independently start from the urgent f344ad2 candidate. Review and merge urgent separately first only after its missing gates pass. Weekly packages do not contain the other weeks' features. Each adds a test entry on the same package.json line, so later merges require preserving the union of every test path exactly once; do not choose one side wholesale. W02/W04 component edits merge cleanly, and W03/W04 share an identical formatter fix. See the integration report for the simulated merge and aggregate suite evidence. Re-run all gates against each newly assembled release SHA before its planned weekly publication.

Before publication, rollback means leaving the draft unmerged. After an explicitly owner-approved production merge, prepare a reviewed revert of that package on a separate branch, run all checks, and obtain the owner's production merge decision. Do not reset main or republish an older Netlify deployment automatically. Reverting urgent after dependent weeks have shipped requires dependency review.

**Search evidence UPDATED 2026-11-12:** owner supplied six-month GSC and Bing exports. Verified new baseline in `ai-issues/RC-002_SEARCH_EVIDENCE_2026-11-12.md`: GSC latest settled Oct 14–Nov 10 **1 click / 802 impressions / 0.125% CTR**, prior Sep 16–Oct 13 **3 / 490 / 0.612%**; Bing **222 / 8,840** vs **260 / 8,074**. Current data ends Nov 10. Pre-May 31/June 1 Google visibility collapse roughly 97.3% impressions/day; Bing still productive. No current per-page 28d data supplied, so don't infer present page ranks from six-month aggregates.

## Rule for every update

For each real weekly release add exact branch and SHA, date built, source main SHA, number of changed pages, exact implementation, human review notes, unit/build/redirect/canonical/JS-noJS/mobile/AdSense preview isolation acceptance, immutable preview URL, independent reviewer, owner approved date, merge SHA (if any), Netlify deploy ID (if any), post-deploy smoke + rollback. A branch name alone is NOT proof of readiness.

## Blocked scheduling note

A recurring Saturday review task was requested through the ChatGPT automations service but creation failed because the account already has five active tasks (plan limit five). No task was created. Owner can free a slot or move the release gate to an existing appropriate automation only with explicit authorization. Until then, use manual scheduled review; do not claim automation exists.
