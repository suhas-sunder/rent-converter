# 2027 W01 — Compare rental listings including recurring bills

**Reviewed:** November 13, 2026 (America/New_York).
**Recommendation: HOLD — implemented and locally validated; hosted, print/PDF and real JavaScript-disabled acceptance remain incomplete.**
**Release purpose:** future weekly release, not an urgent production fix. No production deployment, merge, or AdSense review is authorized by this record.

## Candidate identity and dependency

- Branch: `release/2027-W01-listing-comparison`.
- Common urgent base: `f344ad29766bb63e185515ed08277a8ac9085247`.
- W01 commit SHA: **PENDING**. This review covers the uncommitted W01 diff over that base, not a deployed commit. [SHA-256 manifest](evidence/w01/review-manifest.json) identifies the five reviewed implementation/test files and preserved evidence.
- Draft PR: **PENDING**.
- Immutable Netlify preview and deployed SHA: **PENDING**. Local browser origin reported by the parent reviewer: `http://127.0.0.1:3013`.
- Production baseline remains `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a`, as independently verified for RC-001. The common urgent changes are a dependency: merge/review them separately first, or explicitly include and review them in the candidate. W01 adds no W02–W04 features.

## User problem and implemented result

The existing converter can express one rent amount in several periods. It cannot retain two different advertised listings, add each listing's recurring bills, and show which place actually costs less. A renter previously needed to remember or copy results and calculate the additional costs elsewhere.

W01 adds an independent comparison section below the homepage's existing converter and below-utility ad reserve. It accepts two or three named listings, each with an advertised amount, weekly/14-day/28-day/monthly/annual period, and monthly extras. Results show monthly rent, extras, total recurring monthly and annual cost, the lowest estimated cost, and each listing's differences. The original converter's inputs and output are not coupled to this workspace.

All listings use one selected currency from the existing 18-currency list. Changing that selection changes the label, not exchange rates. BigInt rational calculations preserve up to six decimal places through annualization; only display values are rounded. Differences subtract displayed totals, which is stated in the assumptions. Weekly, 14-day and 28-day rents use a 365-day rate equivalent, not a count of actual bills. Deposits and one-off charges are excluded.

Users can add/remove/rename listings, download a CSV of the current inputs/results/assumptions, and explicitly save, load or delete a comparison in this browser. Nothing is autosaved. Loading restores the saved currency as well as the listings. Invalid storage, duplicate IDs, unsupported currency/frequency, malformed amounts, excessive sizes and malformed JSON are rejected. CSV names are quoted and spreadsheet formula prefixes are neutralized.

The comparison starts with disabled controls until hydration. Its no-JavaScript notice identifies the figures as a fixed example. Input labels, field-level errors, a results region, compact polite result announcements and long-name wrapping are implemented. Their presence in source/SSR output is verified; this does not substitute for every real assistive-technology/browser check.

## Exact W01 files and route effects

| File | Change |
| --- | --- |
| `app/routes/home.tsx` | One import and one `ListingComparison` mount below the existing calculator/ad reserve. |
| `app/client/components/home/ListingComparison.tsx` | Comparison UI, validation, opt-in local snapshot controls, CSV download, hydration/fallback and accessible states. |
| `app/client/utils/listingComparison.js` | Strict input integration, rational calculations, bounded snapshot validation, safe identifiers and CSV serialization. |
| `scripts/listing-comparison.test.mjs` | Nine behavior and SSR tests. |
| `package.json` | Registers the new suite; all existing registered tests remain. Test order is alphabetized. |

This record and `ai-issues/evidence/w01/` are review artifacts. The displayed worktree modification to `public/_redirects` has no substantive Git diff; do not stage it as a W01 feature change. Root-level `qa-*.log` files are local outputs; the reviewed copies are archived in the evidence folder.

Only `/` gains user-facing functionality. No route, slug, title, description, canonical, schema, robots directive, sitemap entry, internal link, existing localStorage key, protected converter calculation or advertisement lifecycle changes are introduced by the W01 diff. The route decision is **improve, retain indexation**. Counts stay at 60 canonical pages and 112 aliases. This is a useful workflow within an existing URL, not an expansion of indexed pages.

## Actual validation evidence

The following full-suite results were read from the isolated W01 worktree's logs; copies are retained with this review. The targeted nine-test suite was also independently rerun in this worktree during this pass.

| Check | Observed result | Evidence |
| --- | --- | --- |
| Typecheck | Completed with no reported errors | [log](evidence/w01/qa-typecheck.log) |
| Full tests | 157 passed, 0 failed, 0 skipped | [log](evidence/w01/qa-test.log) |
| Build/static audit | 60 flat prerendered pages, 112 redirects, real 404, no server bundle | [log](evidence/w01/qa-build.log) |
| Redirect validation | 112 verified | [log](evidence/w01/qa-validate-redirects.log) |
| Breadcrumb validation | 60 routes, 215 JSON-LD scripts, 59 breadcrumb objects, 0 failures | [log](evidence/w01/qa-validate-breadcrumbs.log) |
| Release audit | 60 HTTP-200 routes, 112 aliases, 60 unique internal links; passed | [log](evidence/w01/qa-release-audit.log) |
| W01 targeted tests rerun | 9 passed, 0 failed | `node --test scripts/listing-comparison.test.mjs`, reviewer rerun November 13 |
| Diff whitespace | Passed; only Git line-ending notices | `git diff --check`, reviewer rerun November 13 |
| Existing test registration | None removed; only listing-comparison suite added | Compared package test lists against `f344ad2` |

The nine new tests cover different periods/extras, all five frequencies, exact six-decimal arithmetic, malformed inputs, zero/large values, ties and rounded differences, all 18 currencies, saved snapshots and hostile IDs, formula-safe CSV, and actual server-rendered fallback/disabled controls. Calendar/leap-year tests continue to run in the unchanged baseline suite; W01 itself has no date arithmetic.

No isolated `npm ci` log is part of the supplied W01 evidence. Dependency installation provenance should be recorded with final CI/hosted acceptance. No `lint` script exists; none is claimed.

## Browser evidence and screenshot review

The parent reviewer reports these real browser interactions on the local candidate:

1. Default 500/week plus 100/month extras produced **2,272.62/month and 27,271.43/year**. A separate 2,200/month listing with no extras was cheaper.
2. Changing the second listing to 2,400/month made the first cheaper by **127.38/month and 1,528.57/year**. The one-cent difference between monthly savings multiplied by 12 and annual savings follows the documented display rounding.
3. A 60-character unbroken name was exercised at requested viewport widths 360, 390, 768, 1280 and 1440 without reported page overflow.
4. Explicit save/load across reload was exercised. An actual CSV download was inspected. Entering `1e3` produced an error and removed the comparison results.

This reviewer inspected all five supplied screenshots and confirmed readable inputs, single-column mobile stacking, two-column tablet/desktop inputs, and no visible input-area page overflow. The long name scrolls inside its text input as expected. These images are viewport crops, not full-page captures: most do not show the result panels, validation errors, save controls or print output. At 360 the heading is above the capture because of scroll position. They must not be presented as complete screenshot evidence for those unseen states.

| Requested viewport width | Supplied capture pixels | Screenshot |
| ---: | --- | --- |
| 360 | 345 × 863 | [mobile](evidence/w01/w01-listing-360.jpg) |
| 390 | 375 × 865 | [mobile](evidence/w01/w01-listing-390.jpg) |
| 768 | 753 × 882 | [tablet](evidence/w01/w01-listing-768.jpg) |
| 1280 | 1265 × 889 | [desktop](evidence/w01/w01-listing-1280.jpg) |
| 1440 | 1425 × 891 | [desktop](evidence/w01/w01-listing-1440.jpg) |

Captures are 15 pixels narrower than the requested viewport, consistent with the reserved scrollbar area. The component/helper/test bytes match the integration worktree from which the images were copied; hashes are in the manifest. The screenshots were copied unchanged.

Review provenance: this isolated-diff/source/log/screenshot pass was performed by `value_inventory`. That agent authored the comparison earlier, so this is not an independent second-author signoff. A separate earlier skeptical review reported no-JS control, live-announcement, long-name and saved-ID concerns; the corresponding repairs are present and tested. The parent performed the browser interactions above. A final reviewer should still challenge the immutable hosted candidate.

## Remaining gates and limitations — do not mark ready yet

- Commit W01, create its draft PR, obtain an immutable Netlify preview, verify its exact deployed SHA, then repeat hosted acceptance. A local origin and file hashes do not meet that gate.
- Exercise a real JavaScript-disabled browser reload. SSR tests show a truthful example notice and disabled inputs, but do not prove actual browser fallback behavior.
- Inspect Print / Save PDF in a real browser, including pagination, all listings, large values and assumptions. Print CSS and text promising the page print control exist; readable printed output is not yet verified.
- Complete keyboard-only focus/error/add/remove/save/export and assistive announcement checks on the isolated hosted candidate. Confirm no production advertising, analytics or CMP requests from the preview, including after consent acceptance. The inherited origin guard and unit tests are useful evidence, not an actual network trace.
- Add screenshots of results, error and print states; the five retained captures mostly document input layout. Test three listings at mobile/tablet widths as well as two.
- Values deliberately exclude one-time charges and currency exchange. Cheapest means entered recurring cash cost, not a recommendation about location, service quality or legal affordability. A browser-local snapshot is not an encrypted account or cloud backup.
- Final readiness requires owner review. This package makes no AdSense approval or search-recovery promise.

## Owner review — approximately 10–15 minutes

1. Open the final immutable preview once supplied. Confirm the original homepage converter still works, then scroll to **Compare rental listings**.
2. Keep the first listing at 500 weekly plus 100 monthly extras. Compare the second at 2,200 monthly and verify the totals above. Change it to 2,400 and verify the comparison reverses with the stated differences.
3. Add a third listing at 2,000 every four weeks with 100 monthly extras. It should tie the first. Rename/remove/add listings; ensure names, costs and errors remain attached to the right row.
4. Try `.5`, `12.`, `$1,250.50` and a six-decimal value, then `1e3`, a negative and an empty amount. Invalid entries should explain the problem and hide totals rather than silently yielding zero.
5. Select GBP or another currency. Verify every listing changes label without changing numeric costs. Save, edit without saving, reload, and explicitly load: the prior saved amounts and currency should return. Delete the snapshot and confirm the current screen entries stay available.
6. Download CSV and compare its amounts/assumptions with the screen. Test at mobile width, including a long name and three listings. Use Tab/Shift+Tab and keyboard activation for all controls.
7. Complete the pending no-JS and print/PDF checks above. Ask for the exact candidate SHA/preview and remaining-gate results before approving any merge.

## Rollback and publication decision

W01 is currently uncommitted and not published, so no production rollback is needed. Before publication, withholding its PR leaves production unchanged. If W01 is later owner-approved and deployed but fails, prepare a targeted revert of the W01 implementation commit on a new branch, keeping the common urgent safety fixes. Run the full suites and hosted verification on that revert; request explicit owner approval before merging to main. Do not reset shared worktrees, force-push, restore an old Netlify deploy, or undo unrelated releases.

The `rc_listing_comparison_v1` saved snapshot may remain in browsers after a code revert; this is inert data, not a reason to remove other browser storage. Reintroducing the feature must continue validating that versioned data.

**Final recommendation: HOLD for hosted/print/no-JS and remaining accessibility/network acceptance; intended as a future weekly release. Not READY FOR OWNER MERGE.**
