# W04 — calendar export acceptance

Reviewed 2026-11-13 in isolated branch `release/2027-W04-calendar-export`, based on `f344ad29766bb63e185515ed08277a8ac9085247`. Feature commit `a7b1d1e` now has an additional uncommitted mobile-table repair described below. Status: **local implementation candidate; HOLD release acceptance**.

## Implemented scope

- Downloads the currently calculated rent schedule as an RFC 5545 `.ics` file on the existing schedule route. Each existing payment date becomes an all-day event with next-day, exclusive DTEND; no recurrence rule recalculates the schedule.
- Stable event identifiers, explicit currency and exact cents, lease bounds and assumptions, UTF-8-aware 75-octet folding, and escaped TEXT values prevent date shifts and property injection.
- Creates a local browser file with no external calendar write, account connection, subscription, attendees or reminders. The control explains manual import, changed-schedule duplicates and lease verification.
- Invalid schedule or pre-hydration state disables export. Date results ending after year 9999 are rejected before result/export presentation. The shared BigInt formatter preserves exact displayed amounts.
- No new routes or changes to existing schedule calculation rules, canonicals, ads or FAQ content.

## Automated evidence

Feature suite: **8 tests passed**, covering leap/month-end dates, exact existing schedule dates, exclusive end bounds, deterministic UIDs, injection escaping, UTF-8 folding, invalid/unsorted/duplicate dates and exact large amounts.

The added maximum-year regression executes the actual DateToolPage validation expression with real calendar calculations. It verifies valid leases ending in 9999 (including the 120-month boundary), rejection of results entering year 10000, matching export eligibility, the final valid all-day event ending 9999-12-31, and rejection of an event requiring year-10000 DTEND. Removing the date-result guard causes the test to fail. This is code-level evidence, not browser automation.

Shared money tests verify exact cents beyond Number precision, negative sub-unit values and supported-currency compatibility. Root also relayed an independent research-agent review: 34 targeted money/calendar/paycheck/export tests and 630 signed-amount × 18-currency × 5-locale formatter checks passed, with no new blocker found. The exact signed amounts were not supplied, so those checks are attributed evidence, not a locally reproduced matrix in this report. That reviewer confirmed the direct W03 cents adapter and W04 year-limit guard. Full locally executed release check results follow below.

## Parent-observed local browser and download evidence

Root reports actual local use at port 3013 with start 2028-01-31, term three months and monthly rent 1,800.25. The visible schedule contained January 31, February 29 and March 31, ending April 30. It downloaded `C:/Users/Suhas/Downloads/rent-payments-2028-01-31.ics` and read the file: three events, exact 1,800.25 amount, matching DTSTART and next-day DTEND including leap February, CRLF folding, no RRULE or alarms. Entering `1e3` displayed validation feedback and disabled download.

Root originally reported no document horizontal overflow at 360, 390, 768, 1280 and 1440 pixels. Its screenshots are copied under `ai-issues/evidence/w04/w04-calendar-{width}.jpg`. This report's author visually inspected the 390 and 1440 captures. A subsequent independent hosted review found that the 360-pixel schedule table clipped amount cents inside its overflow-hidden wrapper. Absence of document overflow did not establish complete table visibility; the earlier general mobile acceptance is superseded by this finding.

These browser observations precede the latest exact formatter and maximum-year changes. They establish ordinary-input behavior only; they do not establish final-build large-money or maximum-year browser acceptance. Hosted checks must use the exact final candidate.

## Outstanding gates

- **Print/PDF HOLD:** no completed native print-pagination inspection is claimed.
- **JavaScript-off HOLD:** disabled hydration state and noscript guidance exist in source; completed JavaScript-disabled browser acceptance is not claimed.
- **Hosted HOLD:** no immutable hosted URL/deployed candidate SHA, hosted network trace or final preview acceptance is recorded.
- The actual file was downloaded and inspected as reported above; import into an external calendar application remains unverified. Serializer tests and file inspection do not prove a particular calendar app imported it correctly.
- Final keyboard/screen-reader behavior and final exact candidate review remain release-owner checks. The author implemented this feature; this document is not independent reviewer sign-off.

No commit, push or production deployment was performed during this acceptance pass.

## Mobile table correction — hosted recapture pending

The isolated W04 and aggregate worktrees now contain the same small repair in `app/client/components/generated/GeneratedPages.tsx`. Only the schedule passes the new optional `tableLabel`: its table wrapper allows horizontal scrolling, has a descriptive region label, keyboard focus and a visible inset focus ring, and cells use smaller horizontal padding below the small-screen breakpoint. Other result panels retain their original classes and behavior. No formula, dates, currency formatting, export data, route, indexation, sitemap or advertising behavior changed.

The release owner must recapture the repaired hosted candidate at 360 pixels with monthly rent 1,800.25 and three payments: all date and amount text, including cents, should fit without scrolling. Repeat with a very large accepted rent and verify the focused table scrolls horizontally with the keyboard, preserving all digits without document overflow. Also recheck 390, 768, 1280 and 1440 widths. These are pending visual/interaction checks, not claims inferred from CSS or passing unit tests. No new source-pattern test was added for this visual repair.

After the repair, all six full checks passed again: typecheck; 157 tests, zero failures/skips; build; 112-redirect validation; breadcrumb validation; and the release audit of 60 canonical routes, 112 redirects and 60 unique internal links. Current evidence is in `ai-issues/evidence/w04/mobile-repair/`; original logs below describe the prior candidate. Print/PDF, JavaScript-off and exact hosted candidate acceptance remain HOLD. No commit or push was performed for this repair.

## Completed full checks

All six commands completed with exit code 0 after the latest code and regression changes:

| Check | Observed result |
| --- | --- |
| `npm run typecheck` | React Router type generation and TypeScript build passed |
| `npm test` | 157 passed, zero failures/skips |
| `npm run build` | 60 prerendered canonical pages, 112 redirects, real 404, no runtime server bundle |
| `npm run validate:redirects` | 112 redirects verified |
| `npm run validate:breadcrumbs` | 215 JSON-LD scripts, 59 breadcrumb objects, zero failures |
| `npm run release:audit` | 60 HTTP-200 indexable routes, 112 redirects, 60 unique internal links; passed |

Command output is retained in the six worktree-root `qa-*.log` files. These are local static-server checks, not an immutable Netlify preview audit. Build generation may mark `public/_redirects` modified because of line endings; the reviewed content diff is empty and redirect mappings remain unchanged.
