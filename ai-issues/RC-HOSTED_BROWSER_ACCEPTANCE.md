# Hosted browser acceptance — November 13, 2026

> **RC-028 closure update:** The historical findings/status below are superseded for current candidates by [completed browser acceptance](RC-028_BROWSER_ACCEPTANCE_EVIDENCE.md) and the [release ledger](RC-RELEASE-LEDGER.md). Preserve this report as evidence for its listed original commits.
These are actual JavaScript-enabled browser observations on immutable Netlify previews, not assertions inferred from unit tests. Exact candidate identities are in RC-RELEASE-LEDGER.md. Screenshots and downloaded synthetic examples are in evidence/hosted. No personal rental or financial data was used.

## Urgent candidate

Preview 6af6977a997b1f8cde73e05e, f344ad29766bb63e185515ed08277a8ac9085247: entering 1e3 produces the explicit invalid-input message and replaces all calculated amounts with dashes. It no longer silently calculates from 13. Entering 1,250.50 weekly gives 5,433.72 monthly and 65,204.64 annually. Five viewport captures (360, 390, 768, 1280, 1440) show the error state with no page-wide horizontal overflow.

Protected converters were exercised on this same preview: 900.50 biweekly in CAD gives CA$450.25 weekly; 700.50 weekly in EUR gives EUR3,043.84 monthly; 1,500.50 PCM gives GBP345.32 weekly. Invalid 1e3 on PCM gives an error and a dash instead of a calculated weekly amount. Tab from PCM rent reaches the currency select. These are focused regression checks, not exhaustive keyboard or assistive-technology certification. The separate HTTP report compares all three protected pages on all five previews with the production artifact.

## W01 listing comparison

Preview 6af69ad52629bf99da003eb7, 62e5e6c0eabeac0c939dabcab21a580e71c8f89d: 500 weekly plus 100 monthly extras gives 2,272.62 monthly and 27,271.43 annually. A 2,200 monthly listing is cheaper by 72.62 monthly and 871.43 annually. Added a third monthly listing at 2,200 with a long name; both cheapest listings are identified as a tie. Captured the result at all five widths with no page-wide overflow. Follow-up mobile captures show lower controls, limitations and visible keyboard focus.

Downloaded actual comparison CSV and inspected all three rows, exact displayed totals, differences and assumptions. Explicitly saved, reloaded and loaded the saved comparison: the third listing name and values restored. Invalid-input suppression and earlier saved-state behavior were also exercised locally. No assertion is made that every possible storage failure was reproduced in the browser.

## W02 housing budget

Preview 6af69ad656cfa2344539eb98, f0320bae61112269b85465aa5f23ff91abeba8ad: take-home income 4,000, rent 500 weekly, utilities 300 quarterly, insurance 120 yearly, commitments 1,000 and savings 500 gives 2,282.62 housing cost, 57.07% income share and 217.38 remaining. Original gross-income tool stays independent. Entering -1 rent removes the budget result. Restoring 500 and reloading restores income and rent. Five-width captures show no page-wide overflow; a follow-up lower-panel mobile screenshot shows exclusions, rounding explanation and print control. Earlier local review also exercised GBP and the shortfall state.

## W03 paycheck deadline

Preview 6af69b0c73337f2e792caf49, 3c36fa89472caf610b81767fd051b74dbfc13cf8: bill 2,000, saved 500, biweekly pay beginning January 8, 2027, due February 1 yields two 750 reserves on January 8 and 22, with saved totals 1,250 and 2,000. The existing four-week card and detailed breakdown both show 1,841.10 for 2,000 monthly rent. Five-width captures have no page-wide overflow; the 360 table has an inner scrollbar (see visual review).

Large-value hosted test: 9,007,199,254,740,991.99 due with zero saved produces 4,503,599,627,370,496.00 and 4,503,599,627,370,495.99 reserves, ending at the exact amount. This checks the final shared formatter fix in the deployed bundle. Due-date inclusion/exclusion was exercised locally before staging.

## W04 calendar export

Initial preview 6af69b0d56cfa234453a14ef, a7b1d1e734ccb64245f6f42d4180b06b281e87a1: January 31, 2028 start, three months, 1,800.25 monthly yields January 31, February 29 and March 31 payments, with April 30 calculated end. Downloaded actual .ics file and checked all three DTSTARTs, exclusive next-day DTENDs, exact amounts, CRLF/folding and absence of alarms/recurrence. This file is preserved as synthetic evidence; importing into a real calendar service was not performed.

Entering November 1, 9999 and a twelve-month term produces the year-9999 limit message, hides the result and disables export. Invalid money disabled export in the local browser run. Five-width screenshots revealed a genuine 360px table clipping defect, despite no page-wide overflow. The initial W04 visual gate failed. A scoped table repair and a new immutable-preview verification are required; the final ledger and visual addendum supersede this initial result.

### W04 repaired immutable candidate

Final preview 6af69d4ceab11ecb5c38ff5b, commit 155b2a8247449e9523e0e950155338acf573e6c1: repeated the ordinary leap-year schedule at all five widths. At 360 the table's clientWidth and scrollWidth both equal 233px; at the other widths each pair also matches. Complete 1,800.25 amounts now fit. Six new screenshots preserve the ordinary five-width results and an extreme-value keyboard check.

At 360, entering 9,007,199,254,740,991.99 produces a deliberately wider table (233px client, 332px content). Its labeled region accepts keyboard focus; ArrowRight moved the horizontal position from zero through 40px to the right edge, revealing all digits without page-wide scrolling. A fresh actual calendar download contains three exact USD 9007199254740991.99 summaries and the same January 31, February 29 and March 31 dates. This final candidate also passed the complete remote HTTP audit. The original clipping failure is repaired; print/no-JS/runtime-network gates remain open.

The browser viewport override was reset and test tabs closed after this run. No browser settings or calendar-service data were changed.

## Execution limits and remaining gates

- Actual Print / Save PDF click blocked the in-app browser input path and timed out. No targetable print dialog appeared in the available native window inventory. Closing that test tab restored browser interaction. No PDF was produced or accepted. Do not infer pagination from CSS or screenshots.
- The available browser exposes visibility and viewport controls, but no JavaScript-disabled context or setting control. Raw deployed noscript markup and hydration-disabled controls were checked separately; an actual JavaScript-disabled browser session is still unverified.
- No runtime request-capture interface is exposed by the browser tools. Source tests and fetched deployed bundles verify the exact-production-origin plus accepted-consent analytics guard; sampled HTML has no ad-provider scripts. This is not a captured-network guarantee.
- Focused keyboard checks and labels were reviewed; a full screen-reader and keyboard-only traversal remain open. Not every canonical route received exhaustive interactive human testing. Static/HTTP inventory of all 60 routes and 112 aliases is complete, while the human-value inventory remains an editorial working assessment.

Because the requested acceptance explicitly includes these checks, all candidates remain HOLD, not READY FOR OWNER MERGE. These limitations did not stop feature implementation, independent arithmetic review, full suites, hosted HTTP checks, downloads or visual defect repair.
