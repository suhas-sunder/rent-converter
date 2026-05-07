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
