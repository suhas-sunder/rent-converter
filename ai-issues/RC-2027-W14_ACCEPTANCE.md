# W14 — Keep period starts separate from entered due dates

Status: **IMPLEMENTED / HOLD** for independent review, final integration and immutable hosted acceptance. W05–W08 have no implementation candidates in the fetched branch inventory; later publication remains gated. Base: `ea76372657068902c21e013eb8be9515212140e8`. Branch: `codex/w14-contractual-dates`.

## User task and behavior

Decision: **improve** `/rent-schedule-calculator` while preserving its indexability, metadata, canonical, redirect map and W04 default calendar export. The user may explicitly opt into a separate first due date taken from their agreement. Projected dates repeat from that anchor at the selected payment frequency and appear beside unchanged lease-bounded period starts.

The option starts unchecked and supplies no default due date. Checking it without a valid date removes the result and disables export. Monthly projections retain the original due-day number, clamping only missing days. Weekly, fortnightly and four-week projections step by 7/14/28 actual days. Due dates may fall before lease start or after its end; they are not filtered or silently moved to a period start. No weekend, bank-holiday, grace-period or final partial-payment adjustment is invented.

Default .ics events preserve their W04 dates, UIDs and period-start titles. With an entered due anchor, the same exporter creates all-day due events titled **Rent due (entered schedule)** with explicit descriptions identifying the associated period start and the projection assumption. Due events use distinct stable UIDs and a distinct filename. There are no alarms, subscriptions, attendees, synced writes or automatic calendar imports. Reimporting changed schedules can duplicate events; the existing warning remains.

## Investigation and comparison

Read the existing calendar/date helpers, generated schedule and primary due-date route, W04 tests/export, source-visible assumptions, RC-002 and protected ad policy before editing. The primary due-date tool has its own entered schedule inputs; this package does not duplicate that interface or replace it.

Actual accepted-preview Chromium journeys used January 31, 2028 / three months / USD 1800.25 with monthly and four-week frequencies. The old page's single “Payment date” column showed period starts only; its export already correctly said period starts. The separate due-anchor option now makes that distinction checkable without changing period generation.

Comparator visited in Chromium: [Timeanddate date addition](https://www.timeanddate.com/date/dateadd.html), checked 2026-11-13. It supports date offsets but does not associate an entered rent deadline with lease-period rows or preserve both in a rental calendar file. [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545), particularly DATE, exclusive DTEND and line folding, remains the export contract. [GOV.UK payment guidance](https://www.gov.uk/assured-periodic-tenancies-tenants/rent-and-other-payments), checked 2026-11-13, was reviewed to avoid interpreting an arbitrary calculated date as a universal legal deadline. No legal rule is implemented.

## Numerical and browser validation

- Periods January 31, February 29, March 31, 2028 with due anchor January 30 produce January 30, February 29, March 30 due projections. No cumulative February clamp drift.
- Range/date/frequency validation, dates outside lease bounds, large exact cents, deterministic distinct UIDs, malformed/missing/duplicate due dates, injection escaping, 75-byte CRLF folding, timezone independence and all existing W04 cases pass.
- Clean npm ci: audit zero. Typecheck, production build and all route/redirect/breadcrumb/HTTP audits pass with 60 canonicals and 112 aliases.
- `npm test`: **194 passed**, including eight new registered contractual-schedule cases. Existing W04 upper-year source-validation test receives `dueProjection: null`; no assertion is removed.
- Real Chromium task at 360, 390, 768, 1280, 1440: no page overflow; both date columns and ordinary cents visible. Invalid amount disables export. JavaScript-disabled controls remain inert. No page errors.
- Axe WCAG 2 A/AA and 2.1 AA: zero violations.
- Actual downloads `due.ics` and `periods.ics` inspected for dates/titles/cents. Actual PDF extracted/rendered includes both columns, anchor and amounts. A scoped print break-avoid repair keeps the short result group together instead of splitting a card label/value across pages.
- Final local extended checks: accepted/rejected consent requests contain only the localhost origin and Google Fonts, no tracking/ad hosts. Keyboard Tab reaches new controls, and a USD 9007199254740991.99 table scrolls with ArrowRight then exits with Tab at 360px. Actual native 200% zoom at physical 1440/720 yields CSS 720/360 and DPR 2 without page overflow. Evidence: `evidence/w14/extended-browser.json` and native-zoom viewports.

## Remaining boundaries and rollback

No disposable external calendar-import environment is configured. File correctness and title inspection do not certify import behavior in Outlook/Google/Apple Calendar; this manual compatibility boundary remains. Native OS print and actual screen-reader speech remain manual. Root owns final independent, network, native-zoom and immutable-host acceptance. W05–W08 dependency remains a release hold.

Rollback this feature's helper, generated-page option, optional exporter extension and tests. Preserve the original W04 exporter and urgent/security prerequisites. No current route, alias, canonical, schema, FAQ or advertising behavior changes. Revalidate against then-current main and obtain the owner's release decision; do not merge this staging branch directly to production.
