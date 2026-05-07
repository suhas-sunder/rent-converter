# AdSense Readiness Review

Generated: 2026-05-07

## Current crawl status

- Rendered sitemap pages crawled: 126
- Page-quality audit result: 0 high-risk pages, 0 medium-risk pages, 126 low-risk pages
- Full all-tools directory outside the home page: not detected
- Custom/manual route high-risk pages: none detected
- Calculation logic changed: no
- Routes removed or noindexed: no

## Pages that now look strong

- Core converter pages now have focused intros, visible assumptions, worked examples, limitations, and related calculators without a full directory block.
- Exact weekly-to-monthly answer pages now show the exact result, 4-week comparison, annual cost, amount-specific interpretation, and nearby adjustment links.
- Salary-specific affordability pages now include gross-income assumptions, 30 percent, 40 percent, and 3x screening context, plus take-home-pay cautions.
- Generated affordability, rent-increase, date, UK, and Australia calculators now include route-specific methodology, limitations, and next-step guidance.
- Manual custom pages that were thin in the first crawl now render as low risk in the built-site page-quality audit.
- Support/legal pages are readable and consistent with the home-page design language.

## Pages that still need manual review

- Regional rent increase pages should be manually reviewed before legal-sensitive promotion because rules, exemptions, and official guidance can change.
- Australia bond, rent-in-advance, and city pages should be checked against current state or territory tenancy sources before making any stronger regional claims.
- Exact amount and salary answer clusters are improved, but they remain intentionally templated. Search Console performance should decide whether future route-specific examples need to be expanded further.
- Support/legal pages should be reviewed by the site owner for policy accuracy before an AdSense resubmission.

## Pages that may still feel thin to a human reviewer

The rendered audit no longer flags these as medium risk, but these clusters are the most likely to receive manual scrutiny because their intent is narrow:

- Exact amount pages such as `/150-per-week-to-monthly-rent` through `/750-per-week-to-monthly-rent`
- Salary pages such as `/how-much-rent-can-i-afford-on-50k` through `/how-much-rent-can-i-afford-on-100k`
- Lease/date variants: `/lease-date-calculator`, `/lease-start-and-end-date-calculator`, and `/12-month-lease-date-calculator`
- One-off answer pages such as `/60-pounds-per-night-to-monthly-rent`

## Support/legal-only pages

- `/about`
- `/contact`
- `/privacy-policy`
- `/cookies`
- `/terms-of-service`
- `/sitemap`

## Routes to consider for noindex only if policy changes later

No routes were noindexed in this pass. If future data shows low engagement, duplicate impressions, or weak AdSense value, the first candidates for discussion would be narrow exact-answer and salary-answer pages. That should be based on Search Console and analytics data, not a blanket rule.

## Remaining AdSense risks

- AdSense manual review may still scrutinize amount-specific and salary-specific pages because their intents are narrow, but this pass reduced same-template risk with amount-tier, currency, and salary-specific interpretation.
- Legal and regional pages require ongoing source freshness; this pass did not make new legal claims or add unverified official-source references.
- This pass did not run live AdSense, Search Console URL Inspection, Rich Results Test, or Lighthouse in Google tooling.
- Ad density and live ad rendering still need to be checked in the deployed environment because local crawl validation does not load production ad auctions.

## Third-pass risk reduction

- Exact weekly-to-monthly amount pages now have varied use-case framing for room/shared housing, budget listings, mid-range listings, higher-cost listings, GBP/PW, EUR, and nightly GBP scenarios.
- Salary-specific pages now explain how to read each salary level instead of only swapping a number into the same table.
- Income and affordability pages now better distinguish screening multiples, rent-to-income ratio, hourly pay, salary conversion, percent-rule, and budget-first workflows.
- Regional rent-increase pages now visibly separate calculation math from official legal eligibility and keep caveats prominent.
- UK and Australia generated pages now have more route-specific examples and next-step context.

## Route clusters still needing live manual review

- Exact amount answer pages after deployment, using Search Console CTR and engagement data.
- Salary answer pages after deployment, especially pages that receive impressions but few tool interactions.
- Regional rent-increase pages before any legal-source expansion.
- Australia move-in-cost pages before stronger state/territory-specific wording.
- Live ad rendering on mobile and desktop to confirm no layout shift or accidental tap risk.

## Technically compliant but sensitive

- Regional rent-increase pages are sensitive because local rules, exemptions, notice timing, and official guidance can change.
- Affordability and salary pages are financial-context pages; they remain calculators and planning aids, not financial advice.
- Support/legal pages are indexed and useful for trust, but should remain owner-reviewed for policy accuracy.

## Validation status

- `npm run typecheck`: passed during this pass
- `npm run build`: passed during this pass
- `AUDIT_ORIGIN=http://127.0.0.1:3011 npm run release:audit`: passed during this pass
- `AUDIT_ORIGIN=http://127.0.0.1:3011 node scripts/page-quality-audit.mjs`: passed with 0 high-risk and 0 medium-risk pages
- `git diff --check`: passed; CRLF normalization warnings only
- `npm run lint`: no script exists in `package.json`
- `npm run test`: no script exists in `package.json`

## Final QA readiness update

### Current readiness status

- Local production build, rendered crawl, and page-quality audit pass on a fresh `http://127.0.0.1:3011` server.
- All 126 XML sitemap routes remain reachable in the rendered audit.
- No broken internal links were found by the release audit.
- No full all-tools directory leakage was found outside the home page.
- No high-risk or medium-risk page-quality pages were found after regenerating `SEO_PAGE_QUALITY_AUDIT.md`.
- Legal/support pages are accessible from the footer, and `/about`, `/contact`, `/privacy-policy`, `/cookies`, `/terms-of-service`, and `/sitemap` all render.

### Final QA fixes that reduce AdSense risk

- Fixed missing Open Graph/Twitter image output by adding `public/og-image.jpg` and pointing the terms page at the shared image URL.
- Added release-audit coverage for same-origin social image asset 404s.
- Fixed malformed rent-split metadata/schema text so the page no longer renders `person?s` in snippets or schema.
- Added missing WebPage schema descriptions for the cookie policy and terms pages.

### Remaining live-only risks

- Live AdSense rendering still needs to be checked after deployment for CLS, ad density, ad placement, accidental tap risk, and mobile layout behavior.
- Google Search Console URL Inspection still needs to be run on representative pages after deployment.
- Rich Results Test still needs to be run against representative routes because local schema checks do not replace Google's parser.
- PageSpeed/Lighthouse still needs to be run on live or production-preview URLs for Core Web Vitals, especially home, a generated calculator page, a custom calculator page, and support/legal pages.
- Regional rent-increase and Australia pages still need official-source review before any stronger legal or regional claims are added.

### Clusters to watch after deployment

- Exact amount pages, especially low-amount and high-amount weekly-to-monthly answers.
- Salary answer pages, especially `/how-much-rent-can-i-afford-on-50k`, `/how-much-rent-can-i-afford-on-70k`, and `/how-much-rent-can-i-afford-on-100k`.
- Affordability and screening-rule pages where query intent overlaps.
- UK PCM/PW terminology pages and Australia weekly/monthly pages.
- Regional rent-increase pages because they are legal-sensitive and may draw scrutiny if snippets imply certainty.
