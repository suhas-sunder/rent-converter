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

## Final production-readiness QA pass

### Scope reviewed

- Deployment-critical files: `package.json`, generated page templates/configs, sitemap and route registry files, robots/ads files, schema/metadata helpers, navigation/footer/SEO support components, `scripts/release-audit.mjs`, and `scripts/page-quality-audit.mjs`.
- Representative rendered pages: `/`, `/weekly-to-monthly-rent-converter`, `/150-per-week-to-monthly-rent`, `/500-per-week-to-monthly-rent`, `/750-per-week-to-monthly-rent`, `/how-much-rent-can-i-afford-on-50k`, `/how-much-rent-can-i-afford-on-70k`, `/how-much-rent-can-i-afford-on-100k`, `/how-much-rent-can-i-afford-calculator`, `/3x-rent-calculator`, `/rent-budget-calculator`, `/ontario-rent-increase-calculator`, `/california-rent-increase-calculator`, `/what-does-pcm-mean-rent`, `/weekly-to-monthly-rent-uk`, `/australia-rent-calculator`, `/weekly-to-monthly-rent-sydney`, `/prorated-rent-calculator`, `/lease-date-calculator`, `/rent-per-paycheck-calculator`, `/rent-split-calculator`, `/about`, `/contact`, `/privacy-policy`, `/cookies`, `/terms-of-service`, and `/sitemap`.
- Mobile screenshots were captured at 390px width for home, weekly-to-monthly, exact-answer, salary-answer, regional increase, Australia city, proration, paycheck, rent split, and cookie-policy pages.

### Production-readiness issues found and fixed

- Added the missing shared Open Graph image asset at `public/og-image.jpg` from the existing compressed RentConverter logo so existing `og:image` and `twitter:image` URLs resolve instead of returning 404.
- Updated the terms page to use the shared `/og-image.jpg` URL instead of a missing `/og/rentconverter-terms.jpg` asset.
- Fixed a rendered metadata/schema typo on `/rent-split-calculator` where `person?s` appeared instead of `person's`.
- Added WebPage schema descriptions for `/cookies` and `/terms-of-service`.
- Extended `scripts/release-audit.mjs` to fail when same-origin `og:image` or `twitter:image` assets do not resolve on the built server.

### Preserved behavior

- No routes were removed, merged, renamed, or noindexed.
- No formulas, parsing, rounding, localStorage behavior, print/export behavior, canonical paths, redirect aliases, or sitemap paths were changed.
- The home-page visual system remains unchanged; fixes were metadata/schema, audit, and missing-asset related.

### Final QA validation

- `npm run lint` - not available; package.json has no `lint` script.
- `npm run test` - not available; package.json has no `test` script.
- `npm run typecheck` - passed.
- `npm run build` - passed.
- Fresh production server restarted on `http://127.0.0.1:3011`.
- `AUDIT_ORIGIN=http://127.0.0.1:3011 npm run release:audit` - passed; audited 126 sitemap pages and 122 unique internal links, including same-origin social image assets.
- `AUDIT_ORIGIN=http://127.0.0.1:3011 node scripts/page-quality-audit.mjs` - passed; crawled 126 pages with 0 high-risk and 0 medium-risk pages.
- Targeted asset checks passed for `/og-image.jpg`, `/ads.txt`, `/robots.txt`, and `/sitemap.xml`.
- `git diff --check` - passed; CRLF normalization warnings only.

### Remaining manual checks before AdSense resubmission

- Run live AdSense rendering checks after deployment because local validation does not load production ad auctions.
- Run Search Console URL Inspection on representative routes after deployment.
- Run Rich Results Test on representative tool, exact-answer, salary, regional, and legal/support routes.
- Run PageSpeed/Lighthouse on home, one generated tool page, one custom calculator page, and one legal/support page.
- Review legal-sensitive regional pages against current official sources before making any stronger rent-rule claims.

## Live production verification - 2026-05-07

### Commands run

- `git status --short --branch` - clean; `final-polish` is aligned with `origin/final-polish`.
- `git log --oneline --decorate -n 8` - latest commit is `3165b1f fix: harden RentConverter production SEO QA`, followed by `fe6e299 Polish high-risk SEO page clusters` and `bcd4d0c Hardening SEO page quality audits`.
- `git show --name-status --oneline --decorate --stat 3165b1f` - confirmed the production QA commit includes `public/og-image.jpg`, the rent-split typo fix, cookies/terms schema updates, terms OG image update, and release-audit social image checks.
- `package.json` inspection - no `lint` or `test` scripts are defined.
- `AUDIT_ORIGIN=https://www.rentconverter.com npm run release:audit` - passed; audited 126 sitemap pages and 122 unique internal links.
- `AUDIT_ORIGIN=https://www.rentconverter.com node scripts/page-quality-audit.mjs` - passed; crawled 126 pages with 0 high-risk and 0 medium-risk pages and regenerated `SEO_PAGE_QUALITY_AUDIT.md`.
- `curl.exe -I https://www.rentconverter.com/og-image.jpg` - returned 200.
- Live targeted HTML checks confirmed `/rent-split-calculator` no longer contains `person?s`, `/terms-of-service` no longer references `/og/rentconverter-terms.jpg`, terms social image URLs now point to `/og-image.jpg`, and `/contact`, `/privacy-policy`, `/cookies`, and `/terms-of-service` no longer contain `/cdn-cgi/l/email-protection`.

### Production freshness

- Production is now serving the latest SEO/content and production QA build for the previously stale app content.
- The previous full all-tools directory leakage is gone from the live release audit.
- Same-origin social image 404s are gone; `/og-image.jpg` returns 200 and the stale terms image reference is gone.
- The rent-split metadata typo `person?s` is gone from the live page.

### Final live status after Cloudflare Email Obfuscation change

- Cloudflare Email Address Obfuscation was disabled manually outside the repo.
- Fresh live release audit passed: `AUDIT_ORIGIN=https://www.rentconverter.com npm run release:audit` audited 126 sitemap pages and 122 unique internal links.
- Fresh live page-quality audit passed: `AUDIT_ORIGIN=https://www.rentconverter.com node scripts/page-quality-audit.mjs` crawled 126 pages with 0 high-risk and 0 medium-risk pages.
- `/og-image.jpg` returns 200.
- `/terms-of-service` no longer references `/og/rentconverter-terms.jpg`; its social images point to `https://www.rentconverter.com/og-image.jpg`.
- `/rent-split-calculator` no longer contains `person?s`.
- Fresh contact/legal page checks found no `/cdn-cgi/l/email-protection` links on `/contact`, `/privacy-policy`, `/cookies`, or `/terms-of-service`.
- No known technical crawl blockers remain from the repo or current live audit output.
- AdSense resubmission is no longer blocked by known repo/live-audit issues.
- Remaining non-Codex checks are Google Search Console URL Inspection, official Rich Results Test, Lighthouse/PageSpeed mobile checks, live ad placement checks once ads render, and AdSense resubmission.
- No code or calculation behavior was changed during the live verification passes.
