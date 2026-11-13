# Immediate candidate: stop silent rent-input reinterpretation

Evidence reviewed November 12, 2026 (America/New_York). **Implemented; HOLD pending hosted and complete browser acceptance.** No production release authorized or performed.

## User problem and implemented change

On production, entering `1e3` into the home converter silently becomes 13, rather than rejecting unsupported scientific notation. Shared generated calculators also discard letters, arithmetic characters and parentheses. The candidate validates before normalization, rejects malformed grouping, retains supported currency symbols, decimal formats, leading plus and grouped amounts, and leaves conversion formulas unchanged. The home amount field now has a programmatic label and valid error association.

The home four-week example now agrees with the existing 365-day calculation: 2,000 per 28 days corresponds to 26,071.43/year and 2,172.62/month. Thirteen actual payments cover 364 days. The directly incorrect FAQ instruction to add monthly bills to rent of any period is corrected; costs must first share a period.

Preview/local origins cannot enable production PostHog even after consent. Production consent behavior remains in place. A sitewide no-JavaScript notice explains that initial calculator values are examples and do not recalculate. The structural audit no longer presents word count as proof of visitor value or AdSense readiness.

## Files and scope

- `app/routes/home.tsx`, `app/client/components/home/HowItWorks.tsx`: input validation, accessible label, verified example and units correction.
- `app/client/utils/rentMath.ts`: strict validation for existing shared money inputs, unchanged conversion/rounding formulas.
- `app/client/utils/analyticsConsent.js`, `app/provider.tsx`: exact production-origin telemetry eligibility.
- `app/root.tsx`: JavaScript-off fallback notice.
- `scripts/home-money.test.mjs`, `scripts/money-input.test.mjs`, `scripts/preview-isolation.test.mjs`, `scripts/page-quality-audit.test.mjs`, `scripts/page-quality-audit.mjs`, `package.json`: regression and honest structural review gates.
- RC-001 evidence files: 60-route inventory, 112 live redirects and competitor/ads.txt review.

No route, sitemap, redirect, canonical, ad placeholder, ad lifecycle or account setting was changed. Shared parsing affects generated PCM input handling; valid PCM outputs are protected by regression checks. Other custom route-local parsers still need separately scoped remediation; this is not a sitewide parser certification.

## Validation performed

- `npm ci`: completed. Existing dependency audit reports 11 findings; no automatic dependency upgrade was mixed into this fix.
- `npm run typecheck`: passed after retrying a stalled first typegen process; no errors suppressed.
- `npm test`: 148 tests passed. New malformed-input tests failed against original code before the repair.
- `npm run build`: passed, 60 flat pages, 112 redirects and real static 404.
- `npm run validate:redirects`, `npm run validate:breadcrumbs`, `npm run release:audit`: passed. 60 pages, 112 redirects, 215 parsed JSON-LD scripts, no invalid breadcrumbs.
- Local production-build browser: `1e3` shows a useful error and hides all monetary outputs. `$1,250.50` weekly gives 5,433.72 monthly. Invalid state checked at 360, 390, 768, 1280 and 1440 pixels with no horizontal overflow.
- Independent source review checked supported formats and exposed grouped-trailing-decimal regressions; those were repaired before staging.
- Baseline production screenshots exist for the 12 scoped entry/planning pages across the requested five widths; these are observations, not completed every-route task certification.

Hosted exact-SHA checks, final protected-page interaction review, actual print/PDF, full no-JS browser run and complete network request evidence are pending. Do not label this READY FOR OWNER MERGE until acceptance is updated.

## Owner review and rollback

On the immutable preview recorded in the release ledger, enter `1e3`, `12abc`, `1,2.50`, `$1,250.50`, `.5`, `12.` and zero. Invalid text must never become a different number; valid values must show the expected result. Check the four-week example and costs FAQ, then compare the protected weekly/monthly, biweekly/weekly and PCM/PW tools against production. Try keyboard navigation and Print / Save PDF.

If accepted, merge only the exact reviewed draft PR/SHA after the owner explicitly chooses it. If a subsequent authorized release needs reversal, revert that candidate's commit(s) in a new reviewed PR and deploy through the normal owner-controlled main workflow. Never reset unrelated work or restore an old Netlify deployment automatically.
