# SEO Refactor Notes

## What changed

- Restricted the full "All rental calculators and guides" directory to the home page so individual tool pages no longer end with a sitewide directory block.
- Changed the desktop "All tools" navigation control into a crawlable `/sitemap` link while preserving home-page scroll behavior when the home directory is present.
- Neutralized remaining gradient utility output globally so the app stays closer to the clean home-page visual direction.
- Expanded generated tool pages with reusable, intent-specific sections for how the calculator works, when to use it, and what the result does not include.
- Improved generated exact-answer pages with clearer title/H1/meta copy, exact amount comparison rows, amount-specific use cases, and nearby amount links where routes exist.
- Improved generated salary-answer pages with clearer title/H1/meta copy, gross-income comparison rows, and salary-specific explanation sections.
- Added stronger caveat language and a visible assumptions review date for generated regional Australia and regional rent-increase pages.
- Cleaned the contact page styling to remove legacy gradient/border/shadow classes and align with the home-page design language.
- Extended the release audit to fail if the full all-tools directory renders outside the home page.

## Shared components and configs updated

- `app/client/components/generated/GeneratedPages.tsx`
  - Generated conversion, income, salary, exact-answer, increase, split, move-in, proration, and date pages now receive stronger shared content scaffolding without changing calculation formulas.
- `app/client/data/generatedRouteConfigs.ts`
  - Exact-answer and salary-answer metadata now better match search intent and visible page titles.
  - Shared generated fallback FAQ/examples/sections were made more specific and less generic.
- `app/client/components/navigation/AllRentalToolsLinks.tsx`
  - Full directory now renders only on `/`.
- `app/client/components/navigation/NavBar.tsx`
  - "All tools" is now a real link to `/sitemap`, with home-page scroll enhancement.
- `scripts/release-audit.mjs`
  - Added a built-page check for misplaced full directory blocks.

## Route clusters improved

- Exact weekly-to-monthly answer pages, including USD amount pages, `EUR 500`, `GBP 190`, and `GBP 60 per night`.
- Salary-specific affordability pages from `$50,000` through `$100,000`.
- Generated affordability, income-rule, rent-split, rent-increase, UK/PW/PCM, Australia, proration, lease/date, and move-in-cost pages.
- Support/contact page polish.

## Calculation logic touched

- No calculation formulas or parsing helpers were changed.
- No localStorage behavior, currency support, print behavior, redirect behavior, or canonical paths were intentionally changed.

## Routes still needing manual review

- Large custom calculator files still contain route-local copy and schema. They were audited by the built-site crawler, but a future deeper content pass could migrate more of those route-local implementations into shared components.
- Regional rent increase pages still avoid official rule claims. Before publishing legal-rule-specific copy, verify current government or tenancy authority sources manually.

## Validation commands

- `npm run lint` - not available; package.json has no `lint` script.
- `npm run typecheck` - passed.
- `npm run test` - not available; package.json has no `test` script.
- `npm run build` - passed.
- `AUDIT_ORIGIN=http://127.0.0.1:3011 npm run release:audit` - passed; audited 126 sitemap pages and 122 unique internal links.
- `git diff --check` - passed.

## Third-pass human-quality polish

### Clusters manually reviewed

- Exact weekly-to-monthly amount pages, including low, mid, high, euro, UK PW, and nightly GBP variants.
- Salary-specific affordability pages from `$50,000` through `$100,000`.
- Generated income, affordability, screening-rule, rent split, UK PW/PCM, Australia, move-in-cost, and regional rent-increase clusters.
- Rendered audit output for custom/manual pages remained clean, so this pass did not rewrite large route-local calculator files.

### Pages, configs, and components changed

- `app/client/components/generated/GeneratedPages.tsx`
  - Added tier/currency-specific exact-answer copy, examples, limitations, and next-step guidance.
  - Added salary-specific interpretation sections and 2.5x/40% labeling without changing formulas.
  - Made generated income pages more distinct by mode: screening multiple, ratio, hourly, rent-rule, salary, and budget views.
  - Added clearer regional rent-increase caveats separating arithmetic from legal eligibility.
  - Expanded generated rent split and Australia move-in content with practical user checks.
- `app/client/data/generatedRouteConfigs.ts`
  - Added more varied exact-answer meta descriptions.
  - Added salary-specific meta descriptions.
  - Added route-specific default examples for income, increase, UK, and Australia generated pages.
  - Added a second worked example to the 30% rent-rule page after the rendered audit flagged it as still borderline.

### Content-quality issues found and fixed

- Exact amount pages were technically passing before this pass but still shared too much section structure. They now vary by amount tier, currency, likely use case, examples, and "what to check next" guidance.
- Some exact-answer pages temporarily lost the explicit rendered limitations signal during the rewrite. The signal is now restored with visible "What this result does not include" sections.
- Salary pages now include salary-specific interpretation and tighter gross-vs-take-home cautions instead of salary-swapped boilerplate.
- Affordability and screening pages now explain different intents: qualification screening, budget comfort, hourly-pay conversion, ratio interpretation, and salary benchmarking.
- Regional rent-increase pages now more clearly separate calculation math from official rule eligibility without adding unverified legal claims.

### Calculation logic

- Calculation logic was untouched.
- No formula, parser, localStorage, currency, rounding, print/export, redirect, canonical, or route behavior was changed.

### Legal-sensitive follow-up

- Ontario, BC, Quebec, and California rent-increase pages still need official source review before any stronger legal wording is added.
- Australia bond/rent-in-advance and city pages still avoid local legal or market-average claims; verify official state/territory sources before making them more specific.

### Third-pass validation

- `npm run lint` - not available; package.json has no `lint` script.
- `npm run test` - not available; package.json has no `test` script.
- `npm run typecheck` - passed.
- `npm run build` - passed.
- `AUDIT_ORIGIN=http://127.0.0.1:3011 npm run release:audit` - passed; audited 126 sitemap pages and 122 unique internal links.
- `AUDIT_ORIGIN=http://127.0.0.1:3011 node scripts/page-quality-audit.mjs` - passed with 0 high-risk and 0 medium-risk pages across 126 rendered sitemap pages.
- `git diff --check` - passed; only CRLF normalization warnings were reported.
