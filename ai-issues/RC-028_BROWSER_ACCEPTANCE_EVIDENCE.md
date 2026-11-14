# RC-028 — completed browser acceptance evidence

Reviewed November 13, 2026. **PR #2 is recommended first for owner approval. PRs #3–#6 pass the scoped acceptance gates and remain separate future weekly releases. Nothing has been merged into main or deployed to production.** This report supersedes the old browser-interface limitations and earlier HOLD decisions for the exact commits below.

## Frozen candidate identity

| Candidate / PR | Exact tested commit | Exact tested deployment | Unit tests | Recommendation |
| --- | --- | --- | ---: | --- |
| URGENT / [#2](https://github.com/suhas-sunder/rent-converter/pull/2) | `b69768dc8c8c66342786ba9f39eb958676637b80` | [immutable preview](https://6af71c5e4823f67fc16818e6--rent-converter.netlify.app/) | 148 | RELEASE FOR OWNER APPROVAL — urgent first |
| W01 / [#3](https://github.com/suhas-sunder/rent-converter/pull/3) | `e2a62955a58d30be90a646fd99a253ca2b30bde9` | [immutable preview](https://6af71cdb73b3fcc994c158f0--rent-converter.netlify.app/) | 157 | RELEASE FOR OWNER APPROVAL — after urgent, separate weekly release |
| W02 / [#4](https://github.com/suhas-sunder/rent-converter/pull/4) | `68bfad21aa48fb1425ac1a3ef695a37efc910d7c` | [immutable preview](https://6af71d435cdb0c47031df3bd--rent-converter.netlify.app/rent-budget-calculator) | 156 | RELEASE FOR OWNER APPROVAL — after urgent, separate weekly release |
| W03 / [#5](https://github.com/suhas-sunder/rent-converter/pull/5) | `5af2d234cd9a06b938c01271c2a6b740afd150e5` | [immutable preview](https://6af71ce2cd9d315c99efdcdc--rent-converter.netlify.app/rent-per-paycheck-calculator) | 160 | RELEASE FOR OWNER APPROVAL — after urgent, separate weekly release |
| W04 / [#6](https://github.com/suhas-sunder/rent-converter/pull/6) | `2483d5fbde07f5ec0ab74596e252dfa5075e9123` | [immutable preview](https://6af71cc278ec6b9561a53817--rent-converter.netlify.app/rent-schedule-calculator) | 158 | RELEASE FOR OWNER APPROVAL — after urgent, separate weekly release |

All five Netlify deployments were verified READY, context `deploy-preview`, with matching `commit_ref` and no production publication. Final hosted HTTP audits pass **60 canonical HTTP-200 routes, 112 redirects and 60 internal-link targets** per candidate. All five include urgent `b69768d`; the weekly branches contain their own feature, not the other weeks. [Candidate check evidence](evidence/rc028-browser/candidate-checks.json).

Security [PR #7](https://github.com/suhas-sunder/rent-converter/pull/7) is now staged at **`d6906eff00cc3efdbf1f833580a2fd96e8b9c53a`**, [exact guarded immutable preview](https://6af7a3c1af5d128563435779--rent-converter.netlify.app). **RELEASE FOR OWNER APPROVAL after urgent.** It explicitly includes urgent as a prerequisite and contains no weekly features. After urgent is merged, its remaining application change is the separate package/lock update. Its **148 tests, six full checks and hosted HTTP audit pass; npm audit falls from 11 findings to zero**. The prior production-based `8c116e5` preview is historical, not the current candidate.

On the final guarded maintenance preview, **9/9 browser gates, 2/2 storage gates, native 200% zoom at both widths, four delayed-hydration interactions and three protected-converter regressions pass**. Both consent choices produce no analytics/ad requests. Two actual PDFs (four pages) pass extraction/rendering; their rendered PNGs and all ten ordinary/no-JS screenshots are byte-identical to the visually reviewed urgent images. Both new native-zoom tool captures were visually checked. [Maintenance browser evidence](evidence/rc028-browser/security/browser-report.json), [hosted checks](evidence/rc028-browser/security/hosted-summary.json), [valid PDF](evidence/rc028-browser/security/urgent.pdf), [invalid PDF](evidence/rc028-browser/security/urgent-invalid.pdf).

## Actual browser infrastructure and scope

Windows, Node **25.9.0**, npm **10.9.0**; pinned Playwright **1.58.2**, Chromium **145.0.7632.6** (revision 1208), axe Playwright **4.11.1**. The separate QA package does not alter application dependencies. Reproduction: [browser QA README](../scripts/browser-qa/README.md), [main runner](../scripts/browser-qa/run.mjs), [focused edge cases](../scripts/browser-qa/focused.mjs), [native zoom](../scripts/browser-qa/zoom.mjs), [PDF extraction/rendering](../scripts/browser-qa/inspect_pdfs.py). A read-only manual GitHub workflow is supplied but was not executed; local execution is the evidence.

The final five immutable previews pass **45/45 main browser gates**, **11/11 focused gates**, and **5/5 native zoom cases**, each zoom case at two physical widths. [Browser summary](evidence/rc028-browser/browser-summary.json), [focused results](evidence/rc028-integration/focused-summary.json), [native zoom results](evidence/rc028-browser/zoom-report.json). No browser page errors or failed observed requests occurred. Fresh synthetic contexts were used throughout; no personal account/profile, authentication token, cookie value, request header/body or personal storage was captured.

## Defects reproduced and repaired

- Without JavaScript, home, the original gross budget, the primary paycheck converter and the schedule allowed edits while results stayed frozen. A reusable disabled fieldset now keeps these examples readable but inactive until hydration; W02's additional budget has its own wrapper. Native disclosure sections and ordinary links remain usable. Mobile navigation now has real no-JS links; JS-only menus and analytics preferences remain disabled before hydration. The existing global warning explains the static examples without adding a second global warning.
- The small brand suffix failed contrast (about 4.02:1 against 4.5:1 required). Its sky shade was darkened. A global CSS rule also removed input/select focus rings; explicit keyboard outlines now remain visible. W03's reserve table is explicitly named and keyboard-focusable with a visible inset ring.
- Actual homepage PDF output included the large tool directory (10 pages urgent, 11 W01). Print CSS removes that directory/support-only blocks; urgent is now 2 pages and W01 4. A rendered invalid-state PDF revealed sticky navigation overlapping results; navigation is now hidden in print. Ad-placeholder component/lifecycle code was not changed.
- W04 downloaded events said `Rent due` even though dates were period starts. The actual download now says **`Rent payment period starts: USD 1800.25`**. Dates, amounts, stable UIDs, date-only start/end, CRLF and 75-byte folding were preserved and checked against the pre-repair download. A regression test covers the new wording. [Actual ICS](evidence/rc028-browser/w04.ics), [byte/identity checks](evidence/rc028-browser/calendar-download-check.json).

[Failing baseline](evidence/rc028-browser/baseline-summary.json) is retained. Two test defects were also corrected transparently: the initial urgent invalid-result assertion accidentally rejected digits in period labels; host-only focus styles missed Chromium's separately focused native calendar button. Native date screenshots prove visible segment/picker focus. CSS zoom was replaced by actual `chrome.tabs.setZoom(2)` because CSS scaling leaves media-query breakpoints unchanged. Native full-page capture coordinates were corrected to prevent screenshot-only clipping. None of those harness defects was presented as an application repair.

## JavaScript-disabled and keyboard/accessibility observations

Real `javaScriptEnabled:false` contexts loaded all representative pages at **360, 390, 768, 1280 and 1440 pixels**. Server-rendered examples, explanations and the warning are visible; no calculator inputs invite stale edits. The expanded optional W02/W03 panels remain readable, native navigation reaches existing pages, and no-JS traffic contains only the preview and Google Fonts. Delayed-module tests also verify controls become usable and recalculate after hydration, including protected weekly/monthly, biweekly/weekly and PCM converters.

Keyboard traversal reaches labels, inputs and controls; visible outlines are checked. W03/W04 wide tables accept Tab, ArrowRight scroll and Tab exit. Invalid entries expose associated errors and remove stale results. Updated amounts appear in live-region DOM semantics, including the listing comparison's screen-reader text. This verifies announcement markup, not actual spoken output from a screen reader.

Axe reports **zero WCAG 2 A/AA and 2.1 A/AA violations** in the tested states. The 21 incomplete disclosure-arrow contrast checks were manually reviewed: measured ratios are 7.243–9.899:1, with no blocker. The original incomplete results are retained instead of being suppressed. See [axe review](RC-028_AXE_REVIEW.md), [ordinary/no-JS/native-zoom visual review](RC-028_VISUAL_REVIEW.md), and [date focus, W03/W04 visuals and PDF review](RC-028_DATE_FOCUS_REVIEW.md).

Real native 200% browser zoom was tested at physical widths 1440 and 720: CSS widths become 720 and 360, devicePixelRatio is 2, CSS zoom stays 1 and responsive breakpoints change correctly. Full tool areas retain complete values and currency labels. Very tall native screenshots can show compositor artifacts below the tool; ordinary images and viewport captures are the cross-check. No universal accessibility certification is claimed.

## Actual PDFs and downloads

Chromium print-media output was independently extracted and rendered with pdfplumber and visually inspected. **18 total pages across six PDFs**, no blank pages, out-of-bounds text, overlapping navigation or advertisement placeholders. Important values and assumptions are present:

| Artifact | Pages | Observed content |
| --- | ---: | --- |
| [Urgent valid](evidence/rc028-browser/urgent.pdf) | 2 | 500 weekly, 2,172.62 monthly, 2,000 every four weeks, 365-day assumption |
| [Urgent invalid](evidence/rc028-browser/urgent-invalid.pdf) | 2 | `1e3` error and dashes, no stale calculated money |
| [W01 three listings](evidence/rc028-browser/w01.pdf) | 4 | All three full result names, 2,272.62 / 2,200.00 / 2,250.00 monthly, annual amounts/differences and 365-day assumptions |
| [W02 expanded budget](evidence/rc028-browser/w02.pdf) | 4 | Housing 2,282.62, remaining 217.38, 57.07% share, full itemized breakdown and exclusions |
| [W03 payday plan](evidence/rc028-browser/w03.pdf) | 4 | January 8/22 2027, two 750 reserves, 1,250/2,000 balances and deadline limitations |
| [W04 schedule](evidence/rc028-browser/w04.pdf) | 2 | January 31, leap-day February 29 and March 31 2028; all amounts 1,800.25; lease-end exclusion |

[PDF extraction results](evidence/rc028-browser/pdf-report.json) and adjacent text files are portable evidence. Raw rendered pages and all five-width captures remain in the local ignored QA artifacts directories. Minor nonblocking print polish remains: FAQ/footer-heavy final pages, occasional labels/paragraphs splitting across pages, and a printed Print/Save PDF label on generated pages. Long listing input text can truncate in the printed input, but its complete name is repeated in the result. No important amount/date/result is lost. Native OS print dialogs, physical printers and calendar-app imports were not tested or certified.

The [actual CSV](evidence/rc028-browser/w01.csv) and separate focused downloads were parsed independently; three rows, exact totals, quotes/comma escaping and formula-leading label neutralization pass. Corrupt and unavailable synthetic storage do not crash the calculators. Monthly/leap and semimonthly coincident-month-end dates and a 9-quadrillion-dollar exact amount were exercised in a real browser.

## Runtime network capture

Request/response/requestfailed/pageerror listeners were installed before navigation. Accepted and rejected consent each used a separate fresh context, input interactions, reload and a bounded 3.5-second deferred observation window. The full captured sessions contain **540 requests**, all to the candidate's own immutable hostname or **fonts.googleapis.com / fonts.gstatic.com**. Zero PostHog, Google Analytics, Tag Manager, AdSense, DoubleClick or Google ad-service requests; zero failed requests/page errors. This is observed traffic for these scenarios, not a claim that no third-party requests exist or that every future session is covered. [Sanitized traces](evidence/rc028-browser/network-traces.json).

The focused storage tests block off-origin traffic other than read-only font GETs and therefore are not used to prove network isolation. The main suite's observed, unblocked traces provide that evidence.

## Security and assembled-source acceptance

The separate [security report](RC-028_SECURITY_MAINTENANCE.md) distinguishes development exposure, affected modes not configured and runtime dependency paths not identified. React Router is locked at 7.18.5, Vite 6.4.6, DOMPurify 3.4.17 and fflate 0.4.9 without a major upgrade; React/PostHog versions are unchanged. The original five product branches still carry the old dependency graph until PR #7 is merged separately. Zero registry advisories is a dated audit result, not universal security assurance.

The actual assembled application (urgent + all four independently scoped weeks + security) passes **186 tests**, typecheck, build, redirect/breadcrumb checks and release audit. Independent sequential Git assembly found only the expected package.json test-command conflicts at W02/W03/W04, retained all **25 test files exactly once**, and matched **223 production files** with zero differences. Shared exact-money formatting survives. [Independent assembly evidence](RC-028_INTEGRATION_ACCEPTANCE.md).

The aggregate local production build, including the patched dependency graph, passes **45/45 main browser gates, 11/11 focused gates, 5/5 native zoom cases and actual PDF extraction/rendering**. [Assembled browser summary](evidence/rc028-browser/assembled-browser-summary.json). Its source checkpoint is `5aeeced6006d2536d31039d490591ec5bf06c47d`; review/harness checkpoint `5bc6441f4eb568d6ca5c0bd32ea56410b4d5f5aa` has identical production source. [Draft PR #8](https://github.com/suhas-sunder/rent-converter/pull/8) targets **build/rc27-recovery**, not main, and is a QA checkpoint only. No automatic preview was generated for that review-only base. A manual draft deployment of the validated static output was attempted with pinned Netlify CLI 27.17.0, `--no-build`, the explicit site ID and no production flag. Existing CLI authentication returned `Unauthorized: could not retrieve project`; no upload/deployment occurred. No assembled hosted deployment is claimed and project deployment policy was not changed. That temporary maintenance HOLD was subsequently closed by merging only the urgent prerequisite into PR #7 and testing its automatically generated guarded preview. No combined weekly production release or project-policy change was needed. Individual candidate immutable hosted checks and actual local assembled checks are explicitly separate evidence.

## Release, remaining manual checks and rollback

1. Ask the owner to approve **urgent PR #2 first**: it prevents silent input reinterpretation and closes preview/fallback/focus/print defects without shipping future features.
2. Recommend security PR #7 separately after urgent: its guarded hosted preview now passes. Preserve all tests and revalidate the next actual main release SHA before publication.
3. Keep W01–W04 as separate scheduled packages. Their present commits pass acceptance; each future merge creates a new candidate and needs renewed validation against then-current main. Never merge the aggregate review branch as a production release.
4. Optional owner smoke checks: native Print/Save PDF on the owner's platform, preferred screen reader and disposable calendar import. These are honest environment/compatibility limits, not substitutes for the automated checks completed here.

Before publication, rollback is leaving a draft unmerged. After an explicitly owner-approved release, prepare a separate reviewed revert, preserve shared fixes needed by already shipped weeks, rebuild and obtain the owner's merge decision. Reverting PR #7 restores known vulnerable versions and requires reassessment. No reset, force push or automatic production rollback is authorized.

Production remains Netlify deploy `6ad02cf4ac34d1b203b9b866`, main `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a`. No paid-service, AdSense, ads.txt, ad-placeholder lifecycle, route, canonical, schema or sitemap population changes were made. Main and the original checkout were preserved; isolated worktrees retain task logs and generated line-ending-only _redirects status. Curated evidence includes SHA-256 hashes in [artifact manifest](evidence/rc028-browser/artifact-manifest.json).
