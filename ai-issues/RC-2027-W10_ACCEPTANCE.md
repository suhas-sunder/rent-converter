# W10 — Australian dated rent coverage check

Status: IMPLEMENTED / HOLD. Do not publish before W05–W08 acceptance and owner release approval. No immutable hosted preview yet. Baseline ea76372657068902c21e013eb8be9515212140e8; branch codex/w10-au-payment-plan. The full resolved implementation SHA is recorded in the wave integration ledger.

## User task and scope

A renter can check how much rent an entered payment covers for specific dates, including leap day or an incomplete week, without confusing a bond with rent. The optional checker sits below the existing Australian advance/bond estimator and reuses its weekly input. It counts both covered dates, multiplies the shared cent-rounded weekly rate by actual days / 7, and compares that period total with the entered rent payment. It shows the parsed weekly rate, fortnightly amount, and separately labelled 365-day average monthly equivalent. It does not declare arrears, determine legal obligations, schedule due dates or apply bond as rent credit.

Classification: improve /rent-in-advance-australia; keep the weekly, fortnightly and Australian proration tools. The protected weekly-to-monthly Australia default and all 60 canonical routes / 112 aliases remain unchanged. No canonical, metadata, schema, sitemap, ad lifecycle, storage or account changes. A render-prop slot in MoveInCostPage keeps the widget import local to this route. The generic W15 move-in worksheet is a separate task.

## Browser investigation and source boundaries

Before: the immutable urgent preview's Australian estimator can calculate weekly 500 × 2 advance weeks + 2000 bond = 3000, but cannot check dates or distinguish a partly covered payment from a complete fortnight. Existing Australian converter/proration routes retain useful equivalent/day-count tasks; this slice adds date entry and reconciliation without replacing them.

Actual Consumer Affairs Victoria browser journey: select Weekly, enter 500, trigger the input key event. It returns daily 71.43, fortnightly 1000.00 and calendar monthly 2172.62, with its explicit 365-day / non-leap comparison assumption. It does not provide the observed dated-payment reconciliation task. The new checker counts actual leap days while keeping its monthly comparison on the named 365-day basis.

Sources checked 13 November 2026: [Consumer Affairs Victoria rent calculator](https://www.consumer.vic.gov.au/housing/renting/rent-bond-bills-and-condition-reports/rent/rent-calculator); [NSW Fair Trading start-of-tenancy costs](https://www.nsw.gov.au/housing-and-construction/rules/costs-at-start-of-a-residential-tenancy). The latter distinguishes bond and rent in advance. No numeric legal cap/default is applied, and no NSW or Victorian rule is presented as universal Australian law. Users must check their agreement and jurisdiction. Legal/financial advice is not offered.

## Validation and independent repair

Clean npm ci: 130 packages, audit 0. Typecheck and production build pass (60 flat canonical HTML documents, 112 redirects, real 404, no runtime server). Redirect, breadcrumb and HTTP release audits pass. All 192 tests pass. The existing 186 tests remain registered; six new tests cover date boundaries, leap/non-leap, 366-day limits, exact large amounts, partial weeks, deliberate zero payment, invalid state, time zones and shared parser consistency.

Independent date-worker review found an actual inconsistency: the parent's parser treats 1.234 as grouped 1234, while the first checker implementation treated it as decimal 1.234. Repaired by using the same parseIncomeMoney contract for weekly rent and the payment, preserving the parent's cent rounding. The displayed weekly rate makes the interpretation checkable. New regressions cover grouped 1.234 and fractional 1.2345; the former must match a 1234 payment over seven days, the latter a 1.23 payment.

Scoped real Chromium checks: 360, 390, 768, 1280, 1440; 500/week, 28 February–2 March 2028 inclusive, payment 285.71 => four days, matching payment. Zero payment shows 285.71 below; a backwards range suppresses results. No page errors or page-width overflow. JavaScript disabled: native details remain available, controls disabled, clear no-result explanation. Axe WCAG 2A/AA and 2.1AA: zero violations. Actual PDF three pages extracted/rendered with complete dates/amounts, no blank pages/out-of-bounds words or ad placeholders. Native OS printing/speech remains manual.

The wave integration ledger owns final network, keyboard, native zoom, hosted identity and merged-source acceptance. These are not inferred from scoped local tests. Raw before/after screenshots, PDF and result JSON remain in sibling rent-converter-w09/artifacts/regional-after; curated results accompany this report. No hosted acceptance or publication approval is claimed.

## Review and rollback

Open /rent-in-advance-australia. Enter 500 weekly, 2 advance weeks and 2000 bond. Expand Check the rent covered by a payment. Enter 2028-02-28 through 2028-03-02, payment 285.71. Change payment to 0, then the end date to before the start. Finally check weekly 1.234 over seven days against payment 1234. Verify the visible weekly rate agrees with the upper estimator.

Revert this package's scoped commit from an assembled nonproduction branch to remove the optional coverage checker. No data migration, URL or redirect rollback is needed. Original checkout and prior candidates were preserved.
Independent browser retest closed the parser blocker: 1.234 / seven days / payment 1234 matches; 1.2345 / seven days / payment 1.23 matches; the four-leap-day 285.71 case still matches. Source boundaries and mobile usefulness passed independent review.
