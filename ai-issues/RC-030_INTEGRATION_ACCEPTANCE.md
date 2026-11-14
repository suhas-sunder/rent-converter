# RC-030 — W09–W16 integration acceptance and owner handoff

Reviewed November 13, 2026 (final captures cross into November 14 UTC).

**IMPLEMENTED AND LOCALLY ACCEPTED; ALL EIGHT HOLD FOR PUBLICATION.** This is a review assembly, never an aggregate production release. W05–W08 implementation/acceptance is absent. Netlify CLI draft upload failed `Unauthorized: could not retrieve project`; staging-based PRs have no new immutable deploys. No hosted acceptance is claimed. These are release dependencies, not missing W09–W16 calculator implementations.

## Source identity and independent packages

Application checkpoint: `d10791aa6379bd455f7e74bab6d072f1f2973f1a` on `codex/rc030-integration`. All eight feature heads below are ancestors. Each isolated branch starts from accepted development baseline `ea76372657068902c21e013eb8be9515212140e8`, with urgent/security/W01–W04 retained. Draft PRs target `codex/rc028-browser-acceptance`, not main. Subsequent QA/evidence commits do not change application source. Local review origin: `http://127.0.0.1:3049`; it is mutable, available only while the local server runs, and is not a hosted preview.

| Package | Branch | Exact final feature head | Isolated tests | Evidence |
| --- | --- | --- | ---: | --- |
| W09 / [PR #10](https://github.com/suhas-sunder/rent-converter/pull/10) | `codex/w09-uk-conventions` | `32d974fd3e37d1b3345c8f67891b75293798e32d` | 189 | [report](RC-2027-W09_ACCEPTANCE.md) |
| W10 / [PR #11](https://github.com/suhas-sunder/rent-converter/pull/11) | `codex/w10-au-payment-plan` | `c3425d2f076b3c5b278142fc92c48f7a33a28e46` | 192 | [report](RC-2027-W10_ACCEPTANCE.md) |
| W11 / [PR #12](https://github.com/suhas-sunder/rent-converter/pull/12) | `codex/w11-payday-comparison` | `7065e31a8026bb8fb2e282064ec11897c840eb52` | 194 | [report](RC-2027-W11_ACCEPTANCE.md) |
| W12 / [PR #13](https://github.com/suhas-sunder/rent-converter/pull/13) | `codex/w12-methodology` | `6e01d8b07a499df98794ab0196cb630fc2663a8f` | 190 | [report](RC-2027-W12_ACCEPTANCE.md) |
| W13 / [PR #14](https://github.com/suhas-sunder/rent-converter/pull/14) | `codex/w13-lease-boundaries` | `5b959460764ddddf37c8fb01e537e9e8ed22eb81` | 192 | [report](RC-2027-W13_ACCEPTANCE.md) |
| W14 / [PR #15](https://github.com/suhas-sunder/rent-converter/pull/15) | `codex/w14-contractual-dates` | `875c1b4645637fadfaba2e5b1e33f95b6c87fad8` | 194 | [report](RC-2027-W14_ACCEPTANCE.md) |
| W15 / [PR #16](https://github.com/suhas-sunder/rent-converter/pull/16) | `codex/w15-move-in-worksheet` | `1c5ee1f0fecc23700d8860eeef6ae1b389026313` | 195 | [report](RC-2027-W15_ACCEPTANCE.md) |
| W16 / [PR #17](https://github.com/suhas-sunder/rent-converter/pull/17) | `codex/w16-increase-scenarios` | `c1da4e3540c905c46744f23154c47d011d73cecb` | 192 | [report](RC-2027-W16_ACCEPTANCE.md) |

- **W09** — Compare 52-week and 365-day PW/PCM conventions without changing protected defaults. Existing route `/what-does-pcm-mean-rent`; decision **improve / retain indexation**.
- **W10** — Reconcile an entered payment with inclusive covered dates using the parent weekly-rent parser. Existing route `/rent-in-advance-australia`; decision **improve / retain indexation**.
- **W11** — Check annual-average reserves against actual W03 paydays before a rent deadline. Existing route `/rent-per-paycheck-calculator`; decision **improve / retain indexation**.
- **W12** — Correct verified four-week annual examples and add tested formula-linked methodology examples. Existing route `/rent-paid-every-4-weeks-calculator`; decision **improve / retain indexation**.
- **W13** — Check an entered last occupied date and final calendar-month proration. Existing route `/lease-date-calculator`; decision **improve / retain indexation**.
- **W14** — Optionally project entered due dates while preserving default period-start calendar export. Existing route `/rent-schedule-calculator`; decision **improve / retain indexation**.
- **W15** — Itemize one-time move-in costs independently of recurring monthly rent. Existing route `/rent-budget-calculator`; decision **improve / retain indexation**.
- **W16** — Compare cumulative payments under two hypothetical annual increase rates. Existing route `/compound-rent-increase-calculator`; decision **improve / retain indexation**.

No new routes or amount/salary variants. Protected converter defaults, canonicals, sitemap, redirects, ad reserves and production telemetry isolation remain intact. W09 uses the glossary rather than altering protected winning conversion routes. Regional claims are bounded and linked to checked primary sources in the package reports; no legal calculation, universal tenancy rule, rent eligibility or professional review is claimed.

## Validation and independent skepticism

Final source passes typecheck, **236 tests across 33 unique registered test files**, production build, redirect and breadcrumb validators, release HTTP audit and zero-vulnerability npm audit. Build retains 60 prerendered canonical pages, 112 redirects, real 404 and no runtime SSR bundle; HTTP audit checks all 60 routes, 112 aliases and 60 link targets. Clean dependency installation and isolated package checks are recorded in each report. QA uses pinned Playwright 1.58.2, axe 4.11.1 and Chromium 145.0.7632.6.

Final source `d10791aa6379bd455f7e74bab6d072f1f2973f1a` passes:

- **72/72 main browser gates** (nine per feature), at 360/390/768/1280/1440px; JavaScript disabled, both consent choices, inputs/results/errors, keyboard focus, live-region DOM semantics, axe, PDF capture and relevant real downloads.
- **13/13 focused checks:** eight delayed-hydration cases, W10 grouped/fractional parser consistency, W12 keyboard scroll/Tab exit, W16 negative/extreme values and keyboard scroll, plus W11/W15 storage denial.
- **8/8 actual native 200% zoom cases**, each at physical widths 1440 and 720 (CSS widths 720 and 360). No page overflow or ellipsized visible money.
- **Eight mobile axe scans:** zero automated violations after the W12 focus repair. The 31 incomplete contrast nodes are separately measured/reviewed; incomplete is not counted as an automatic pass.
- **Eight actual PDFs /21 pages**, extracted and rendered. No missing required values, empty pages, out-of-bounds words or printed advertisement placeholders. Real W14 due/period-start ICS files and W15/W16 CSV bytes are included.
- **925 captured requests** across accepted/rejected consent contexts: only loopback assets and Google Fonts, no analytics/ad providers. Main reports include sanitized path-level traces, request failures and page errors.

Preserved behavior was separately rechecked on predecessor `597166e492138335e5a0b84fd60f2bd078023002`: **45/45 urgent/W01–W04 main gates**, **11/11 focused checks**, six extracted/rendered PDFs /22 pages, and **seven delayed-hydration/protected-converter checks**. The sole subsequent application delta is W12's supporting-table region/tabIndex/focus-ring attributes; all eight feature gates and the new table check were rerun at the final checkpoint. This distinction prevents attributing earlier captures to a later SHA.

[Selected evidence and byte hashes](evidence/rc030-browser/README.md), [main report](evidence/rc030-browser/final/report.json), [focused report](evidence/rc030-browser/focused/report.json), [native zoom](evidence/rc030-browser/zoom/zoom-report.json), [mobile axe](evidence/rc030-browser/final/axe-review.json), [PDF inspection](evidence/rc030-browser/final/pdf-report.json), [contrast measurements](evidence/rc030-browser/contrast/review.json). Raw/intermediate artifacts remain locally available; committed evidence is selected, not every full-page bitmap.

Independent PDF/mobile review covered all eight initial final captures and the corrected W11/W10 recapture, with no lost amounts or dates. Root inspected representative W12/W16 rendered pages. Minor pagination limitations remain listed below. Independent manual review closes all 31 incomplete contrast nodes: all exceed 4.5:1; assumptions glyphs measure 9.01:1, FAQ glyphs 7.24:1, and the lowest other flagged color 5.84:1. Target-centered captures expose the W12 text; actual ArrowRight scrolling exposes W16’s final column without clipping values. Final W12 PDF/mobile review found no focus-change visual regression. [Manual findings](evidence/rc030-browser/contrast/manual-review.json). No Safari runtime or whole-site WCAG certification is claimed.

An independent assembly review before the final label/style followups verified the union of all tests, single-owner file equivalence, 43 GeneratedPages functions and 27 route configuration definitions against feature branches. Only test registration and independent imports needed merge resolution; W13's small insertion coexists with W14's DateTool. Final ancestry and full regressions retain every feature. No whole-side conflict resolution discarded another package.

Independent reviewers exercised source arithmetic, actual mobile/browser interactions and exports. Findings repaired before this checkpoint:

- W10 originally interpreted `1.234` differently from its parent input. Both now reuse the same income-money parser: grouped `1.234` means 1,234.00; `1.2345` rounds to 1.23. Regression and actual browser checks cover both.
- W11 fractional 13.04/52.14 rent equivalents were labeled payment counts. The visible/PDF table now says **Annual comparison factors**, explicitly distinguishes actual dated counts, and keeps correct fallback factors for invalid input. Two rendered-table tests protect this.
- W12 had editable static controls without JavaScript. The existing hydration guard now disables them until the calculator can run. Four-week examples distinguish 13 cycles/364 days from a 365-day annual equivalent. A supplemental mobile axe scan also found that the existing supporting table relied on Chromium automatic scroll focus; it now has an explicit named tab stop and ring, with ArrowRight/Tab-exit regression coverage for keyboard access across browsers.
- W13 singular-day wording and W13/W14 print grouping were repaired. W14 rejects whitespace/noncanonical export dates and preserves default W04 bytes/UID semantics.
- W16 mobile money columns previously broke awkwardly. Complete cells now scroll in a named keyboard region with a hint; print allows full long values. Independent 100-year/extreme-value PDF inspection found no clipped money. Signed difference is explicitly primary minus comparison.

Earlier failed browser runs are retained locally as history. W10's initial six gate failures were a harness selector targeting a section as though it were details; the final harness opens its nested details. W12 navigation needed a URL wait. W15 error semantics retain the live error region while removing the stale total. W04 regression locators now use its unchanged ID and traverse the newly optional due-date checkbox before the preserved keyboard-scroll region. Assertions were adapted to actual semantics, not removed to hide defects.

## Concrete owner walkthrough (about ten minutes)

Open the local origin plus each path from the candidate JSON, or start the built assembly with `$env:PORT='3049'; npm run preview`. Use synthetic values only.

1. **W09:** Enter GBP 500 weekly. Compare 2,166.67 (52 weeks) and 2,172.62 (365 days), delta 5.95; four weeks is 2,000. Reverse the chosen convention. Neither convention is asserted as a legal obligation.
2. **W10:** Weekly 500; covered dates February 28–March 2, 2028 inclusive; paid 285.71. Four days match. Bond remains separate and the state-specific sources do not create a universal Australian rule.
3. **W11:** Monthly rent 2,000, saved 0, biweekly first payday January 8, 2027, due February 1. Two average 923.08 reserves produce 1,846.16, short 153.84; W03's exact deadline plan requires 1,000 each. Zero eligible paydays must remain explicit.
4. **W12:** Four-week rent 2,000 gives monthly 2,172.62 and annual 26,071.43 on 365 days. Thirteen payments total 26,000 over 364 days. Follow the lease-period counting link and keyboard-scroll the supporting comparison table.
5. **W13:** Lease January 31, 2028 for one month; entered last occupied February 20; monthly 1,800. Inclusive 21 days; final February 1–20 prorates 1,241.38 using 29 days. The entered agreement date is distinct from the displayed calculated date.
6. **W14:** Same lease start, three months, monthly 1,800.25. Default export lists period starts January 31 / February 29 / March 31. Enable entered due-date anchor January 30; export January 30 / February 29 / March 30 under explicit entered-schedule titles and distinct stable IDs. No weekend/holiday adjustment is implied.
7. **W15:** Monthly 1,500; partial first month 22/31 days; last month 1,500; deposit 500; fees 40.25; utility setup 60.75; moving 100. Total 3,265.52 includes first proration 1,064.52; recurring rent 1,500 remains separate. Download CSV; negative inputs remove stale totals.
8. **W16:** Starting monthly 2,000, primary 10%, two years, comparison 0%. Total 50,400 vs 48,000, difference 2,400. First increase occurs after 12 payments; final rent 2,420 begins after the two-year horizon. Inspect CSV and keyboard-scroll the comparison table.

## Status, boundaries and next release gate

- **Completed and locally accepted:** application implementation and recorded automated/browser acceptance for the final source, subject to the final results above. Prior urgent/security/W01–W04 hosted acceptance remains in RC-028; no package has been published by this task.
- **Implemented but HOLD:** all W09–W16 drafts. Independent feature scope is real, but they are not ready for production approval.
- **Partially implemented:** none of these eight is merely a skeleton; the overall release program remains incomplete because prerequisites and hosted validation are missing.
- **Externally blocked:** immutable Netlify upload/hosting acceptance. The connected tools can inspect project/deploy state but cannot upload this build; CLI authentication failed. Existing PR preview policy did not generate previews for these staging-target PRs. No paid setting, branch policy or target was changed to bypass it.
- **Not started:** W05–W08 implementation/acceptance and W17–W52. Planning is not implementation. Resolve W05–W08 before proposing W09 publication.

Manual boundaries: actual screen-reader speech, native OS print dialogs/physical printing and a disposable third-party calendar import are not certified. Live-region checks certify DOM behavior. ICS is structurally/date/value validated, not imported into an external account. Static ad reserves are preserved; no filled-ad lifecycle is present to certify. Ordinary print page breaks can split a heading from values (W10/W11) or continue methodology onto another page (W15); existing utility print labels remain on some generated pages. These are recorded polish limitations, not omitted results.

Before each future weekly release, assemble only its scoped changes and established dependencies onto then-current main, preserve the union of tests, obtain an immutable nonproduction deploy, rerun full/local/hosted acceptance and independent review, then request the owner's explicit merge decision. Do not merge this review assembly into main. Publication scheduling is unchanged. No AdSense resubmission or search recovery guarantee.

Rollback now is leaving drafts unmerged. After any separately authorized publication, use a scoped reviewed revert on a new branch; preserve shared helpers required by later packages and rerun validation. Never reset main, force-push or automatically republish an old deploy.

## Production and workspace preservation

Remote main remains `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a`. Netlify published production remains `6ad02cf4ac34d1b203b9b866` READY. Original checkout is clean at `131ae371aabf8c8b1871116edc3d5d09048ba965`. Work stayed in isolated worktrees. Task logs/raw captures and pre-existing line-ending-only `public/_redirects` changes are retained uncommitted; no unrelated state was reset or cleaned. Only scoped branches and draft PRs were pushed.
