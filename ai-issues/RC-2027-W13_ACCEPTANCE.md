# W13 — Check a lease end and final calendar month

Status: **IMPLEMENTED / HOLD** for independent review, final integration and immutable hosted acceptance. W05–W08 have no implementation candidates in the fetched branch inventory; no W09+ publication is proposed before their acceptance. Base: `ea76372657068902c21e013eb8be9515212140e8`. Branch: `codex/w13-lease-boundaries`.

## User task and scope

Decision: **improve** the existing `/lease-date-calculator`, retaining its indexability, metadata, canonical, aliases, sitemap and original calendar-month formula. The optional check compares an explicitly entered last occupied day with the displayed calculated end, counts actual occupied calendar days, and calculates the final calendar month's rent using its actual day denominator. It does not change the agreement, decide notice requirements or infer a lawful termination date.

The generic prorated route requires manual day counts. The new check removes that error-prone step in the lease context, handles leap years and partial terms, and shows the exact charged range. It is not a second standalone route or a whole-lease billing total. Currency changes label entered amounts only. No saved state or remote service is introduced.

Inspection included DateToolPage, calendarDate helpers, existing proration behavior, route configs/registry, W04 export semantics and RC-002 search evidence. Historical lease aliases received 12 and 10 clicks in the six-month aggregate; these are not current rankings. Both aliases continue to redirect to the same canonical.

## Before/after tasks and numerical contract

Actual Chromium baseline journeys on the accepted W04 immutable preview used January 31, 2028 + 1 month; February 29, 2028 + 12 months; and December 31, 2027 + 2 months. The existing result has calendar-month/clamp explanations, but no comparison with an entered last day or derived partial-month charge. Before screenshots are in `evidence/w13/`.

Comparator inspected in Chromium: [Calculator.net Day Counter](https://www.calculator.net/day-counter.html), checked 2026-11-13. It makes end-day inclusion an explicit choice but does not connect the count to lease-boundary comparison and final-month rent. No competitor output is treated as legal authority or copied.

- January 31 through February 20, 2028 inclusive: 21 occupied days. Displayed original lease end February 29 is nine date positions later; the check does not reinterpret the separate schedule tool's exclusive boundary.
- Final month is February 1–20: `180000 cents × 20 / 29`, rounded once, gives **124138 cents**. No rounded daily rate is multiplied back.
- January 31 through February 29: full February is 180000 cents. A one-day February 29 occupation is 6207 cents.
- Long terms exceed 366 days safely. Date math uses existing date-only helpers and is identical in UTC, New York, Kiritimati and Honolulu.
- Invalid/reversed dates and negative/invalid money show errors, removing the stale estimate. Large cent integers never convert to Number.

Official-source review: current [GOV.UK tenancy guidance](https://www.gov.uk/assured-periodic-tenancies-tenants/rent-and-other-payments), checked 2026-11-13, reinforces that tenancy/payment rules are jurisdiction-specific. No UK or other jurisdictional legal rule is implemented or inferred. The check states its own arithmetic assumptions and exclusions.

## Validation performed

- Clean `npm ci`: 130 packages; audit zero vulnerabilities.
- Typecheck, production build, all existing checks pass: 60 prerendered routes, 112 aliases, real 404, breadcrumb validator and HTTP release audit.
- `npm test`: **192 passed**, including six new tests in `scripts/lease-boundary.test.mjs`, registered in the test command.
- Real Chromium task at 360, 390, 768, 1280 and 1440 pixels: no document horizontal overflow; complete final amount/date range. Invalid date and scientific-notation amount remove results. No page errors.
- JavaScript-disabled browser: original date controls disabled; no invented calculated result/new interactive checker is shown before hydration.
- Axe WCAG 2 A/AA and 2.1 AA: zero violations. Incomplete nodes remain manual review, not automatic acceptance.
- Real browser PDF created, extracted and rendered. Exact dates and 1241.38 amount are present. Visual review found the new check split across pages; a scoped print break-avoid repair keeps it together. Final capture is retained beside text and page renders.
- Final local extended checks: accepted/rejected consent requests contain only the localhost origin and Google Fonts, no tracking/ad hosts. Keyboard Tab reaches native date parts, rent and currency with visible focus; native date-button focus uses its browser-provided indication. Actual `chrome.tabs.setZoom(2)` at physical 1440/720 yields CSS 720/360 and DPR 2, without page overflow. Evidence: `evidence/w13/extended-browser.json` and native-zoom viewports.

## Limits and release instructions

Independent review by the cashflow implementation agent reproduced the 360px leap-month scenario, reversed-date error and single-day leap-day estimate. No arithmetic blocker was found. The reviewer identified singular “1 occupied days” wording, repaired to “1 occupied day” in both the count and formula. This review is engineering acceptance, not independent legal review.

No immutable deploy or production readiness claimed. Native OS print, screen-reader speech and interpretation of a real contract are not certified. Root's final integration report owns hosted/network/native-zoom/independent acceptance and exact release identities. No routes, schema, FAQ copy, ad lifecycle, analytics consent or protected converter formulas changed. Existing schedule boundaries are deliberately preserved.

Rollback: omit/revert this package's component/helper, two-line generated-page wiring, registered test and acceptance evidence; do not revert shared accepted W01–W04 or security prerequisites. Revalidate against then-current main before any owner-approved release.

## Integration followthrough (review assembly only)

See [RC-030 final acceptance](RC-030_INTEGRATION_ACCEPTANCE.md) for the exact final feature head, assembled-source identity, repaired findings and final local browser/PDF/download evidence. That report supersedes pending-local-integration notes above, but does not close immutable-hosted-preview or W05–W08 publication dependencies. This package remains HOLD for publication.
