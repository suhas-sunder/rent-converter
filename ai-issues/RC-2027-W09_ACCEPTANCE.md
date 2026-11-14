# W09 — UK convention comparison

Status: IMPLEMENTED / HOLD. Do not publish before W05–W08 acceptance and owner release approval. No immutable hosted preview yet. Baseline ea76372657068902c21e013eb8be9515212140e8, branch codex/w09-uk-conventions. Source SHA is this report's containing implementation commit; integration ledger records the full resolved SHA.

## Task and bounded change

A renter seeing GBP 500 PW/PCW needs to understand why one source quotes GBP 2166.67 PCM and another GBP 2172.62. Add an interactive bidirectional comparison to the existing PCM glossary, with a GBP 5.95 displayed difference and separate GBP 2000 four-week amount. Preserve all protected calculator defaults and all 60 canonicals / 112 aliases. Classification: improve existing glossary; keep protected conversion tools. No URL/canonical/schema/robots/sitemap/ad changes. A route-local component slot keeps widget code off other generated routes. No new storage or account functionality.

The companion glossary wording now correctly says thirteen 28-day periods cover 364 days, rather than asserting 13 payments in every year. Existing FAQ copy/schema remains unchanged.

## Evidence and sources

RC-002 records 616 historical impressions / 0 clicks for pcw-to-pcm, not a current rank. This supports investigating terminology, not changing a protected formula. Before browser journey on immutable urgent preview6af71c5e… showed a static PCM definition and a single 365-day formula. No user-selected convention comparison existed. Another journey through the existing weekly/monthly links confirms their narrow calculator tasks remain useful.

Source checked 13 November 2026: [DWP rented-housing guide](https://www.gov.uk/government/publications/universal-credit-and-landlords/universal-credit-and-rented-housing-guide-for-landlords) explicitly uses weekly×52÷12 in Universal Credit. UI scopes this to benefits and does not claim it governs private agreements.365 days is the site's stated comparison model. Neither model determines contractual liability or counts pay dates.

Actual competitor journey: [Report My Rent](https://reportmyrent.co.uk/tools/rent-calculator), enter 500, select Each week, Convert my rent => 2166.67 PCM. It supports period conversion and splitting; the observed flow did not compare 52/365 results. ClearScore browser access encountered Press&Hold; no claim about its interaction quality is made. Research did not copy competitor content.

## Validation

Clean npm ci: 130 packages / audit 0. Typecheck passes. npm test 189/189; 3 new rational/roundtrip/precision/invalid tests registered exactly once. Production build 60 canonical HTML / 112 redirects / real 404/no runtime server. Redirect validator, breadcrumb validator and HTTP release audit pass.

Actual local Chromium: 360, 390, 768, 1280, 1440; default 500 PW values, reverse 2172.62 PCM => 500 weekly, 365-day basis, invalid 1e3 suppression,0 page errors/no page overflow; no-JS controls disabled with example clarity; axe WCAG 2A/AA and 2.1AA: 0 violations. PDF: 2 pages extracted/rendered: expected amounts present, no blank pages/out-of-bounds words/ad placeholders. Broad network/keyboard/native 200%/integration acceptance is owned by wave 3 ledger, not claimed from these scoped checks. Actual OS print and screen-reader speech remain manual.

Local raw QA is in rent-converter-w09/artifacts/regional-before and regional-after. Curated results accompany this report. Review by an independent date worker is recorded by the integration steward. No hosted acceptance or owner approval is implied.

## Review and rollback

Open /what-does-pcm-mean-rent. Compare default 500; select PCM and enter 2172.62; then enter 1e3. Use the contextual link to protected 365-day calculator. Review GBP labels,52/365interpretation,28-day distinction,print and mobile. Revert this package's scoped commit from an assembled nonproduction branch to remove the comparison and glossary corrections; no saved data migration or redirects need rollback. Original checkout and prior release branches remain untouched.
Independent reviewer confirmation: 7,996 rational forward/reverse oracle outputs passed across 1,999 cent amounts. Actual reverse and invalid-input browser cases passed; DWP citation independently checked. No remaining blocking finding.
