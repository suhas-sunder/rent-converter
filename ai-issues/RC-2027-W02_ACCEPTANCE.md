# 2027 W02 — Itemized take-home housing budget

**Status:** IMPLEMENTED / LOCAL BROWSER REVIEWED / ISOLATED FULL SUITE PASSED / HOSTED ACCEPTANCE PENDING.
**Review date:** November 13, 2026 (America/New_York); browser evidence captured November 12.
**Isolated worktree:** `rent-converter-w02`, branch `release/2027-W02-housing-budget`, based on urgent candidate `f344ad2` (which includes implementation commit `5352978`). This record covers the isolated candidate before hosted acceptance; exact SHAs, draft PRs and immutable previews are maintained in the release ledger.
**Recommendation:** HOLD until exact-SHA hosted, print/no-JS and final release gates pass. No main change or production deployment performed for this package.

## User problem and implemented behavior

The existing rent-budget calculator compares planned rent and aggregate expenses with gross income. It does not let a renter normalize separately billed housing costs against actual take-home income. A weekly rent listing plus a quarterly utility bill cannot safely be added directly.

The existing `/rent-budget-calculator` route now has an optional, collapsed **Check your take-home housing budget** panel immediately after the original calculator. It accepts monthly take-home income, five housing line items (rent, utilities, parking, insurance, other), each with its own billing period, monthly non-housing commitments and a savings target. It shows average monthly housing cost, share of take-home income, remaining money or a clearly labeled shortfall, and a monthly breakdown. It does not estimate tax or determine eligibility. The original gross comparison remains usable and its fields are independent.

Weekly/two-week expenses use the site's stated 365-day annualization. Monthly/quarterly/annual bills use 1, 3 or 12 calendar months. Values retain up to 12 decimal places and a shared rational denominator until display; no floating-point intermediate money calculation is used. Individual display rows can differ from the rounded total by a cent, explained beside the result. Eighteen currency labels are supported without exchange-rate conversion. Valid inputs save locally using the existing hydration-safe saved-state lifecycle. Invalid values suppress results; zero income produces a shortfall without an invented percentage.

## Exact files in this package

- `app/client/components/HousingBudget.tsx` — route-specific panel, labels/errors, exact BigInt currency display, saved state, print control and methodology.
- `app/client/utils/housingBudget.js` — independent-period normalization, strict parsing wrapper, precise totals and saved-shape validation.
- `scripts/housing-budget.test.mjs` — eight behavioral regression tests.
- `app/routes/rent-budget-calculator.tsx` — supplies the new panel to the existing page component.
- `app/client/components/generated/GeneratedPages.tsx` — optional `afterTool` slot in `IncomeToolPage`; two existing budget-methodology sentences qualified as the **gross-income comparison** so they no longer incorrectly imply that the new panel cannot itemize savings/utilities. No FAQ changes.
- `package.json` — registers the housing-budget regression suite in the permanent test command; the reordered list retains the inherited suites.
- This report and five screenshots in `ai-issues/evidence/w02/`.

No new routes, redirects, sitemap entries, canonical URLs, metadata, existing storage keys or advertising behavior were changed. The new localStorage key is `rc_housing_budget_v1`.

## Local validation performed

1. Added the behavioral test file first and ran it: failed because `housingBudget.js` did not yet exist. Implemented the helper and obtained **8/8 passing** tests; repeated after UI integration and narrow explanatory correction.
2. `npx tsc -b` passed after integration and again after the supporting-text correction.
3. Initial `npm run typecheck` was interrupted by an `EPERM` while React Router typegen tried to unlink a generated route type, during concurrent work in the shared worktree. That invocation is not counted as a pass. The subsequent TypeScript-only pass succeeded. The isolated worktree's later full `npm run typecheck` (React Router typegen plus TypeScript) passed, as recorded in `qa-typecheck.log`.
4. `git diff --check` passed for the integration edits; new files were also reviewed for trailing whitespace and source structure.
5. Actual JavaScript-enabled in-app browser run on `http://127.0.0.1:5174/rent-budget-calculator` passed the flows below. This was the uncommitted development candidate, not an immutable deployment.

The tests cover unlike billing periods, weekly/fortnightly equivalence, quarterly/annual normalization, summing sub-cent values before rounding, negative remaining budget, zero income, common monetary formats, malformed/negative/range errors, large exact values, and corrupt/obsolete saved data.

### Isolated full-suite evidence and scope check

The release steward ran the full suite in `rent-converter-w02`; this reviewer inspected its completed logs on November 13. `npm test` passed **156/156**, with zero skipped or failed tests. `npm run build` completed and its static audit passed **60 prerendered pages, 112 redirects, a real 404 and no runtime server bundle**. `npm run validate:redirects` verified **112** static redirects. Breadcrumb validation checked **60 routes**, parsed **215 JSON-LD scripts**, found **59 BreadcrumbList objects**, and reported **zero failures**. `npm run release:audit` passed **60 indexable HTTP-200 routes, 112 redirects and 60 unique internal links**. Log files are local QA outputs, not additional application changes or proof of hosted behavior.

The isolated tracked diff is limited to `GeneratedPages.tsx` (4 added / 3 removed lines), the budget route (2 / 1), and test registration (1 / 1), plus the new W02 files listed above. `public/_redirects` appears dirty from line-ending normalization but has no content diff and is excluded from W02 staging. No `RentScheduleExport`, `rentCalendarExport`, or derived-year boundary change crossed into W02's `GeneratedPages.tsx`; the W03/W04 components and helpers are absent from this package. No FAQ or date-tool logic was changed.

### Independent review and repair disposition

The separate `paycheck_feature` agent independently reviewed W02 code and calculations in the integration worktree; its evidence is recorded in `rent-converter-rc27/ai-issues/RC-027_INDEPENDENT_REVIEW.md`. It ran an independent **150-scenario mixed-period housing oracle sweep**, confirmed the monthly factors and exact large-money formatting, inspected saved-shape/currency validation, and accepted W02 at the code/arithmetic level. The reviewer did not author W02. This acceptance document is maintained by W02's implementation author and does not label that authorship as independent review.

The independent report's repair table concerns W01 and inherited urgent changes; it reports no outstanding W02 arithmetic defect. The W02 supporting-copy correction is present: the older gross-income explanation now identifies its own scope and points to the separate itemized tool, instead of implying the entire page cannot model utilities or savings. No FAQ was modified. Related W01 repairs are not copied into W02, and inherited urgent fixes remain in the base commits.

The isolated W02 component/helper blobs match both the integration files and the independent report's reviewed fingerprints: `HousingBudget.tsx` = `caabb505b258b4efc04bc8ac3be29219c7a410d9`; `housingBudget.js` = `e296f42d8b2c018ee7f0624d83cc730e835e9522`. These are file hashes, not release SHAs. Actual screen-reader behavior, print pagination, JavaScript-disabled behavior and unavailable-storage interaction are not certified by source review.

## Reproduced browser flow

- Opened the panel and entered income **4,000**, rent **500 weekly**, utilities **300 every 3 months**, insurance **120 yearly**, commitments **1,000**, savings **500**; parking and other housing costs stayed zero.
- Observed **$2,282.62** average monthly housing costs, **57.07%** share, and **$217.38** remaining. The weekly rent row showed **$2,172.62**, utilities **$100.00**, insurance **$10.00**. Original gross comparison stayed at its prior inputs/results.
- Changed take-home income to **1,000**, currency to GBP: observed **£2,782.62 monthly shortfall** and **228.26%** share, without an eligibility/comfort verdict.
- Entered rent **-1**: field error **Rent cannot be negative.** appeared and the result heading/count disappeared (zero matches), preventing stale totals.
- Restored rent **500**, reloaded, reopened the panel: income, currency GBP, all costs and billing periods restored with the same shortfall result.
- Keyboard Tab from the savings input reached **Print budget / Save PDF** with a visible focus ring. Full keyboard-only navigation and a screen-reader session are not claimed.
- Captured browser error log contained no error entries at the end of the run. Network isolation is not proven by this check.

## Responsive screenshot review

Reviewed actual screenshots at each required width; the panel used one column at 360/390 and two input/result columns on larger views. Amounts, labels and result hierarchy were readable in the inspected areas. At 390px the DOM reported `innerWidth=390`, `scrollWidth=375` (no horizontal overflow). Other widths were visually inspected rather than exhaustively measured for every element.

| Viewport | Screenshot |
| --- | --- |
| 360 × 800 | [Mobile 360](evidence/w02/budget-360.jpg) |
| 390 × 844 | [Mobile 390](evidence/w02/budget-390.jpg) |
| 768 × 1024 | [Tablet](evidence/w02/budget-768.jpg) |
| 1280 × 900 | [Desktop](evidence/w02/budget-1280.jpg) |
| 1440 × 900 | [Wide desktop](evidence/w02/budget-1440.jpg) |

Temporary browser viewport override was reset after the checks. Screenshots show the example USD result; GBP and error transitions were confirmed via live accessibility state. Screenshots are local development evidence, not hosted preview screenshots.

## Remaining acceptance and owner review

**Pending:** exact W02 commit, draft PR, immutable Netlify preview, hosted five-width checks, actual print/save-PDF output, JavaScript-disabled fallback, denied/corrupt storage in browser, all-currency browser matrix, preview ad/analytics request isolation, and final independent release acceptance of the exact hosted candidate. The isolated full suites and independent code/arithmetic review above are complete. The `<noscript>` explanation and print button exist but are not accepted merely from source inspection. The five screenshots were copied unchanged from integration; they remain development evidence rather than a new browser run against the isolated package.

For owner review, open the preserved gross-income tool first, expand the new panel, repeat the mixed-period example, change income to trigger a shortfall, test invalid rent, reload, then print/save PDF. Check the cost periods and the exclusions: deposits and moving costs are not recurring housing bills, housing costs should not be counted twice, and the savings target excludes paycheck deductions already omitted from take-home income.

Rollback before publication: leave this candidate unmerged. After an owner-approved publication, revert this package's application commit on a reviewed branch, run full validation and let the owner decide the production merge. Do not manually publish an older Netlify deploy or reset unrelated work.
