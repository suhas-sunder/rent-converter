# W15 — One-time move-in worksheet beside the recurring budget

Status: implemented and locally validated; HOLD publication. Branch `codex/w15-move-in-worksheet`, independent base `ea76372657068902c21e013eb8be9515212140e8`. Review date: November 13, 2026. Final exact branch SHA and any immutable hosted preview are recorded by the integration ledger. W05–W08 are not implemented; this candidate does not complete their acceptance. No production publication is authorized.

## User task and scope

Improve existing indexable `/rent-budget-calculator` with a collapsed **Plan your one-time move-in costs** worksheet, below the established gross-income and take-home tools. A renter can enter monthly rent, include a full first month, replace it with a partial month, or exclude it; then add independently quoted last rent prepaid, refundable deposit/bond, optional one-time fees, utilities setup, and moving/setup costs. Optional amounts start at zero. No duplicate Australian advance/bond calculator or new URL.

The output itemizes one-time cash, shows recurring monthly rent separately, and explicitly avoids claiming all items are due together. A partial first month replaces the full first month rather than adding it twice. Rent retains precision until its partial-month calculation; each payable item rounds once to cents, then the total sums those displayed cents exactly. The existing strict money parser and exact BigInt formatter are reused. No currency exchange or deposit law is inferred. No timeline is invented, and this session-only worksheet creates no saved-state key.

Example: monthly rent 1,500, 22 charged days of a 31-day month, last rent prepaid 1,500, deposit 500, fees 40.25, utility setup 60.75, moving 100. First rent is 1,064.52; total one-time cash is 3,265.52; recurring rent remains 1,500.00. Zero deposit works. Invalid amounts or day counts suppress the total and provide announced errors. CSV contains exact amounts, currency, method and the separate recurring value; print removes worksheet controls and keeps item rows together.

## Baseline, differentiation and references

Before implementation, the actual hosted W02 budget at `https://6af71d435cdb0c47031df3bd--rent-converter.netlify.app/rent-budget-calculator` was entered with take-home income 4,000 and monthly rent 1,500. Its deliberate recurring-only wording excludes deposits and one-off moving costs, confirming the gap without redefining the existing total. Baseline screenshot/DOM text remain local in `artifacts/w15-before`.

Contemporary actual browser inspection of [My Local Apartments move-in calculator](https://www.mylocalapartments.com/free-tools/moving-cost-calculator) found first month plus deposit-multiple/fees/moving/setup inputs, defaulting to 1,500 rent and one month's deposit. This worksheet uses zero optional deposits and explicit quoted amounts, offers partial-first-month replacement, and exports a reconciled breakdown beside the user's recurring budget. No competitor text or estimates were copied.

Reference review: [Fannie Mae, Costs of Renting](https://yourhome.fanniemae.com/rent/costs-of-renting) describes upfront versus ongoing costs; [HUD Housing Counselors Module 6.1](https://hudhousingcounselors.hud.gov/sites/default/files/study_pdfs/Module%206.1_20251.pdf) describes rent, deposits and moving expenses. Checked November 13, 2026. These sources informed category selection only; the UI makes no jurisdiction-specific amount, cap, entitlement or fee-permission claim.

## Validation and independent review

- Clean `npm ci`, typecheck, production build, all 195 tests, redirect/breadcrumb validators and local release HTTP audit passed. Retained 60 canonical routes, 112 redirects, 215 JSON-LD scripts and 59 valid breadcrumb lists. npm audit reports zero vulnerabilities.
- New nine-test `scripts/move-in-worksheet.test.mjs`: zero/default totals, partial-month replacement and exact reconciliation, no first rent, leap February, preserved decimal precision/category rounding, large exact amounts, malformed/negative/empty/over-limit money, invalid day counts, and real CSV values/method/CRLF.
- Actual Chromium: 360, 390, 768, 1280, 1440 widths without page overflow; valid complex scenario, negative-deposit error then zero-deposit correction; keyboard tab flow; JS-off controls disabled and manual explanation; accepted/rejected-consent sanitized request traces with no analytics/ad providers or page errors. Axe zero violations and zero incomplete results for the exercised route state.
- Native 200% browser zoom verified through a disposable Chrome extension, not CSS zoom: 1440 physical pixels → 720 CSS pixels; 720 → 360, devicePixelRatio 2, no page overflow. CDP captures reviewed. Small inline recurring amounts now stay together; very large amounts can wrap without omission.
- Actual CSV download was independently checked for 3,265.52 total, 1,064.52 partial rent and 1,500.00 separate recurring amount. Actual Chromium PDF was extracted and rendered. An initial print showed duplicated input fields; the repaired form is hidden in print and item rows resist splitting. Final three-page PDF has no out-of-bounds words or ad placeholders; result rows remain intact on page 2 and recurring/methodology on page 3. Final rendered evidence is in the package evidence directory. Native OS print dialogs and screen-reader speech remain manual boundaries.
- Parent's independent source review found no arithmetic blocker; requested final link cursor/focus styling, repaired. Final integration browser verification of the exact candidate SHA remains required.

Curated local evidence: `ai-issues/evidence/w15-move-in`. Browser scripts and raw baseline captures remain local; the integration harness supplies reproducible final gates. Local port 3115 is not an immutable hosted preview.

## Files, limits and rollback

New `MoveInWorksheet.tsx`, `moveInWorksheet.js`, regression tests and route attachment. Test script registers the additional suite. No shared generated page template change. No route, canonical, robots, sitemap, redirect, FAQ, ad lifecycle or existing storage change. The only added internal link uses existing `/prorated-rent-calculator` for other bases.

This monthly-rent worksheet does not infer the number of charged days, refund eligibility, legal charges or dates. Its actual-days method requires 28–31 days in the entered rent month and charged days within that month. Other proration bases require the separate calculator and agreement check. No automatic persistence is promised; download or print preserves the result.

Rollback the W15-only commit from its staging dependency, preserving W02. Never revert the complete W01–W04 aggregate or merge this development baseline into main. No push or production deployment performed by this worker.

## Integration followthrough (review assembly only)

See [RC-030 final acceptance](RC-030_INTEGRATION_ACCEPTANCE.md) for the exact final feature head, assembled-source identity, repaired findings and final local browser/PDF/download evidence. That report supersedes pending-local-integration notes above, but does not close immutable-hosted-preview or W05–W08 publication dependencies. This package remains HOLD for publication.
