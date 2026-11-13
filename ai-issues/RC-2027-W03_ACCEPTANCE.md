# W03 — paycheck deadline planner acceptance

Reviewed 2026-11-13 in isolated branch `release/2027-W03-paycheck-deadline`, based on `f344ad29766bb63e185515ed08277a8ac9085247`. Candidate changes are uncommitted; this is not a deployed SHA. Status: **local implementation candidate; HOLD release acceptance**.

## Implemented scope

- Optional next-rent planner on the existing paycheck route, preserving the annual-average calculator. It accepts the actual bill, amount already saved, next payday, due date and existing pay frequency.
- Counts actual paydays strictly before the due date unless the user explicitly includes same-day pay. Weekly, biweekly, monthly and selected two-day semimonthly schedules are supported. Month-end clamping is explained; weekends, holidays and payroll changes are not inferred.
- Allocates the exact remaining cents across available checks, gives remainder cents to earlier checks, shows running saved balances, and identifies an unfunded deadline without a guarantee of affordability.
- Uses the shared BigInt money formatter so displayed large values retain cents. The existing four-week summary now uses the same annual × 28 / 365 conversion as the detailed breakdown, rather than annual / 13.
- No new routes, storage keys, external writes, ads, FAQ changes or canonical changes. Narrow description and ToolFit corrections reflect the added date planner.

## Automated evidence

Feature suite: **11 tests passed**, including exact cent reconciliation, same-day opt-in, zero eligible paydays, excess savings, weekly date transitions, semimonthly month-end overlap, leap February, monthly anchor restoration, invalid input, horizon limits and large BigInt values. The new route-level regression executes the actual conversion functions and verifies that a monthly 2,000 rent produces 1,841.10 per 28 days and that the summary uses that breakdown.

Shared money tests verify exact cents beyond Number precision, negative sub-unit values and supported-currency compatibility. Root also relayed an independent research-agent review: 34 targeted money/calendar/paycheck/export tests and 630 signed-amount × 18-currency × 5-locale formatter checks passed, with no new blocker found. The exact signed amounts were not supplied, so those checks are attributed evidence, not a locally reproduced matrix in this report. That reviewer confirmed the direct W03 cents adapter and W04 year-limit guard. Full locally executed release check results follow below.

## Parent-observed local browser evidence

Root reports actual use at local port 3013: bill 2,000, saved 500, next payday 2027-01-08 and rent due 2027-02-01 produce January 8 and 22 reserves of 750 each, with saved balances 1,250 then 2,000. Moving the due date to January 22 produces one reserve of 1,500 by default; including same-day pay produces two reserves of 750.

Root reports no horizontal overflow at 360, 390, 768, 1280 and 1440 pixels. Copies of its screenshots are under `ai-issues/evidence/w03/w03-deadline-{width}.jpg`. These are attributed parent observations, not additional browser sessions performed by this report's author. They precede final candidate staging; rerun against the immutable preview before release.

## Outstanding gates

- **Print/PDF HOLD:** root's print click timed out and no native print window was exposed. No successful print-pagination inspection is claimed.
- **JavaScript-off HOLD:** source includes hydration disabling and noscript explanation, but no completed JavaScript-disabled browser acceptance is claimed here.
- **Hosted HOLD:** no immutable hosted URL/deployed candidate SHA, hosted network trace or final preview acceptance is recorded.
- Final keyboard/screen-reader behavior and final exact candidate review remain release-owner checks. The author implemented this feature; this document is not independent reviewer sign-off.

No commit, push or production deployment was performed during this acceptance pass.

## Completed full checks

All six commands completed with exit code 0 after the latest code and regression changes:

| Check | Observed result |
| --- | --- |
| `npm run typecheck` | React Router type generation and TypeScript build passed |
| `npm test` | 160 passed, zero failures/skips |
| `npm run build` | 60 prerendered canonical pages, 112 redirects, real 404, no runtime server bundle |
| `npm run validate:redirects` | 112 redirects verified |
| `npm run validate:breadcrumbs` | 215 JSON-LD scripts, 59 breadcrumb objects, zero failures |
| `npm run release:audit` | 60 HTTP-200 indexable routes, 112 redirects, 60 unique internal links; passed |

Command output is retained in the six worktree-root `qa-*.log` files. These are local static-server checks, not an immutable Netlify preview audit. Build generation may mark `public/_redirects` modified because of line endings; the reviewed content diff is empty and redirect mappings remain unchanged.
