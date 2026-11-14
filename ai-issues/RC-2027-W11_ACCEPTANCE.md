# W11 — Check the annual reserve against the next actual bill

Status: implemented and locally validated; HOLD publication. Branch `codex/w11-payday-comparison`, independent base `ea76372657068902c21e013eb8be9515212140e8`. Review date: November 13, 2026. Final exact branch SHA and any immutable hosted preview are recorded by the integration ledger. W05–W08 are not implemented and this candidate is not a substitute for their acceptance. No production publication is authorized.

## Scope and user value

Improve the existing indexable `/rent-per-paycheck-calculator`, preserving its canonical, metadata, defaults, formula, saved-state keys and W03 date planner. The planner now answers: if I save the annual-average amount on my actual eligible paydays, will this rent bill be covered? It shows available money, shortfall or surplus beside the exact reserve schedule. No extra planner or duplicate date inputs.

For monthly rent 2,000 and biweekly pay, the displayed annual reserve is 923.08. With zero saved and paydays January 8 and 22 before February 1, 2027, two reserves add 1,846.16: a 153.84 gap. W03 still allocates 1,000 to each payday. With no payday before the deadline, no phantom annual-average deposit is credited. The comparison repeats the displayed cent amount because that is what a renter could actually transfer; it does not change the underlying conversion math.

The annual model and actual calendar remain separate. Semimonthly uses two chosen month days, biweekly repeats 14 days, and 28-day rent is distinct from a month. No country-specific rent law or payroll eligibility is inferred. No new local storage is used; an invalid main converter removes the average comparison while the actual-bill planner remains independently usable.

## Baseline and sources

Before implementation, actual hosted W03 journeys were exercised at immutable preview `https://6af71ce2cd9d315c99efdcdc--rent-converter.netlify.app/rent-per-paycheck-calculator`: two-payday bill allocation and zero eligible payday. Both worked, but required the user to manually compare the annual average to the due-date allocation. Local baseline screenshots and DOM text are in `artifacts/w11-before` (not source assets).

Contemporary competitor browser inspection: [Calculator.net salary calculator](https://www.calculator.net/salary-calculator.html) offers frequency equivalents, but its salary conversion does not check an actual rent deadline against already-saved money. RentConverter keeps that useful task in the existing date planner.

Primary sources checked November 13, 2026: [CRA common and uncommon pay periods](https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/income-tax/increasing-income-tax-deductions.html) lists common 26/24 and uncommon 27 biweekly periods; [CFPB bill-calendar guidance](https://www.consumerfinance.gov/archive/blog/budget-help-manage-your-monthly-expenses-bill-calendar/) supports comparing bill due dates with income timing. Neither is presented as verifying a user's employer or lease.

## Validation and review

- Clean `npm ci`, typecheck, production build, all 194 tests, redirect/breadcrumb checks, release HTTP audit passed. Build retained 60 canonical routes and 112 redirects; 215 JSON-LD scripts and 59 valid breadcrumb lists. npm audit: zero vulnerabilities.
- New eight-test suite `scripts/paycheck-average-check.test.mjs`: actual two-deposit gap; semimonthly leap-month cover; zero paydays; a 27-biweekly-payday year; large exact cents/surplus; invalid inputs; rendered annual-factor wording and consistent factors during invalid input. Existing W03 tests retain month-end, date-only, same-day, horizon and reconciliation coverage.
- Local Chromium browser: 360, 390, 768, 1280, 1440 widths with no page overflow; actual gap/no-payday interactions; keyboard focus transfer; JS-disabled inputs disabled; accepted/rejected-consent request traces with no analytics/ad providers or page errors; axe zero violations. Existing color-contrast incomplete results are not automatically counted as passes; their prior manual review remains applicable and integration review repeats them.
- Actual native 200% zoom via disposable Chrome extension: 1440 physical pixels → 720 CSS pixels and 720 → 360, devicePixelRatio 2, no horizontal page overflow. CDP full-page captures visually reviewed; ordinary money and wording remain visible. Very tall capture can repeat sticky navigation below the footer, an existing capture artifact.
- Actual Chromium PDF extracted/rendered: four nonblank pages; no out-of-bounds text or ad placeholders. Reviewed result page shows 923.08, 1,846.16, 153.84, dates and both 1,000 reserves. PDF includes existing surrounding content; native OS printing and actual screen-reader speech are not certified.
- Independent parent source review found no arithmetic blocker; requested explicit link cursor/focus and a discriminated helper return type, both repaired. Final integration browser review is still required for the exact candidate SHA.

Curated local evidence: `ai-issues/evidence/w11-cashflow`. Local development URLs are not immutable hosted acceptance. The parent integration harness provides reproducible final validation and exact identities.

## Independent PDF finding: factors are not payment counts

A later independent PDF review caught a misleading inherited annual table: it labeled fractional 13.04 and 52.14 rent equivalents as annual payment counts. This was a clarity blocker for W11. The route now calls the section **Annual comparison factors** and the value column **Factor used**. Its visible explanation separates the 365-day rent-period equivalents (and 12 calendar months) from fixed annual paycheck-budget assumptions; neither represents actual dated payment occurrences. The actual date planner remains the way to count eligible paydays.

The invalid-money fallback also formerly switched the rent factors to 13 and 52, contradicting the valid 365-day model. It now retains 13.04 and 52.14. No conversion formula, paycheck divisor, default, FAQ, canonical or saved-state behavior changed. Two regression tests render the actual route table in valid and invalid states and check the labels and all factors against 365/28 and 365/7 rounded for display.

The full suite now passes 194 tests (19 targeted paycheck tests). Typecheck and the production build were rerun for this source correction. Earlier local browser/PDF artifacts in this package predate this table correction; the parent integration acceptance must recapture the final exact source SHA before release approval.

## Files, risk and rollback

Changed: `PaycheckDeadlinePlan.tsx`, its route adapter, new `paycheckAverageCheck.js`, test registration and acceptance evidence. No FAQ, ad lifecycle, canonical, sitemap, robots, redirect, protected converter default or external account changes. The main risk is confusing a saving model with actual income availability; the visible check states that other bills and ability to fund each reserve are excluded.

Rollback the W11-only commit from its staging dependency, preserving W03. Do not revert all accepted W01–W04 work or merge this aggregate baseline to main. No main push or production deployment performed by this worker.

## Integration followthrough (review assembly only)

See [RC-030 final acceptance](RC-030_INTEGRATION_ACCEPTANCE.md) for the exact final feature head, assembled-source identity, repaired findings and final local browser/PDF/download evidence. That report supersedes pending-local-integration notes above, but does not close immutable-hosted-preview or W05–W08 publication dependencies. This package remains HOLD for publication.
