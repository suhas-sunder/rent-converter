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

- AdSense manual review may still view some amount-specific and salary-specific pages as templated despite improved visible utility.
- Legal and regional pages require ongoing source freshness; this pass did not make new legal claims.
- This pass did not run live AdSense, Search Console URL Inspection, Rich Results Test, or Lighthouse in Google tooling.
- Ad density and live ad rendering still need to be checked in the deployed environment because local crawl validation does not load production ad auctions.

## Validation status

- `npm run typecheck`: passed during this pass
- `npm run build`: passed during this pass
- `AUDIT_ORIGIN=http://127.0.0.1:3011 npm run release:audit`: passed during this pass
- `AUDIT_ORIGIN=http://127.0.0.1:3011 node scripts/page-quality-audit.mjs`: passed with 0 high-risk and 0 medium-risk pages
- `npm run lint`: no script exists in `package.json`
- `npm run test`: no script exists in `package.json`
