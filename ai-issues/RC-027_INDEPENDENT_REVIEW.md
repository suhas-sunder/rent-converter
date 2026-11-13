# Independent implementation review — first release candidates

Reviewed November 12, 2026, against working tree based on planning commit `d1825c9cfdc523c72bd6eb4177fe2e6451bcb7b5`.

Reviewer: separate `paycheck_feature` agent. This is an independent code/calculation review of the urgent changes, W01 listing comparison, and W02 housing budget. The reviewer authored W03/W04 and does **not** claim independent acceptance of those packages. Root owns actual browser, print, no-JavaScript, network, hosted-preview and final release acceptance. No candidate is certified ready for merge by this document alone.

## Findings requiring disposition

| Finding | Evidence and consequence | Disposition at review |
| --- | --- | --- |
| W01 no-JavaScript state | `ListingComparison.tsx` initially rendered editable example inputs and a computed lowest-cost result without a no-JavaScript notice or hydration gating. Editing in a no-JavaScript browser would leave the example result unchanged. | Repaired and independently rechecked in code and SSR test: disabled fieldset until hydration; noscript text explicitly identifies the fixed example. Actual browser check remains root-owned. |
| W01 output announcements | Initial comparison result container lacked `role`, `aria-live` or equivalent status announcement for changes to totals. | Repaired and rechecked: concise polite atomic status announces each monthly amount and lowest-cost result. Actual assistive-technology behavior remains untested here. |
| W01 mobile long names | Names accept 60 characters. The lowest-cost paragraph and error/status text initially lacked overflow wrapping. | Repaired in source with inherited `overflow-wrap:anywhere` on the section. Root still verifies narrow-width visual layout. No screenshot claim made. |
| W01 saved identifier bound | `listing-9007199254740992` meets the saved ID regex, but the original `Number` counter rounded increment back to the same value, risking duplicate IDs. | Repaired and rechecked: `nextListingId` selects the smallest unused string identifier without parsing saved suffixes. Adversarial saved-ID test passes. |
| Urgent parser in-progress grouped decimal regression | Grouped trailing decimal entries were previously accepted but initially rejected by strict grouping validation. | Repaired and independently executed against actual route parser: `1,250.`, `1 250.` and `1.250,` each yield exactly 1,250. Strict malformed grouping checks still pass. |
| Existing paycheck 4-week display disagreement | The original summary card used annual rent / 13, while its detailed conversion used annual rent × 28 / 365. At monthly rent 2,000 these are 1,846.15 and 1,841.10 respectively. | Root repaired summary to reuse `computed.rentBreakdown.every_4_weeks`; independently rechecked identical value source. This check does not independently accept the reviewer-authored W03 planner. |

## Calculation and data review

Executed independently: `node --test scripts/home-money.test.mjs scripts/money-input.test.mjs scripts/preview-isolation.test.mjs scripts/housing-budget.test.mjs scripts/listing-comparison.test.mjs`. **24 tests passed** after the repairs (21 passed in the initial review). No type generation or build was run during this independent pass to avoid races with root validation.

An additional read-only Node oracle sweep passed **750 listing scenarios and 150 mixed-period housing scenarios**. Listing inputs used six-decimal units `i*i*7919 + 123456` and extras `i*3571 + 1` for `i=1..150`, across all five frequencies, checking monthly/annual rounded cents and lowest-cost selection against an independently written monthly denominator of 336. Housing inputs combined `i` weekly rent and `i+1` quarterly costs against income 4,000, commitments 500 and savings 500, checking totals and remaining income with denominator 84. These were executed checks, not browser tests.

- W01 annualizes weekly, fortnightly and 28-day rent over the same 365-day basis; adds monthly extras as 12 yearly amounts. Rational comparisons choose the lowest value before rounding. Monthly/annual differences intentionally subtract displayed rounded totals and the UI/CSV explain that convention. Examples 500/week + 100/month extras versus 2,200/month give 2,272.62 versus 2,200 monthly, a 72.62 difference; annual total is 27,271.43 for the weekly listing. Ties, sub-cent inputs and all five periods are covered.
- W01 caps each raw amount at 1 billion, keeping generated cents below the integer precision threshold used by its existing money formatter. Invalid input hides the comparison. Single currency applies to all listings; there is no exchange-rate claim. Storage is bounded, versioned, re-parsed and excludes unknown fields. Save/load is explicit. The identifier-counter edge above is repaired.
- W01 CSV quotes every cell and doubles quotes. Formula-leading names such as `=HYPERLINK(...)` are prefixed with an apostrophe; leading whitespace is checked too. CSV monetary values use exact integer cents and match displayed totals. Names appear as React text, not injected HTML. No external sharing/network operation is introduced.
- W02 preserves fractional bill values to 12 decimal places, retains a common monthly denominator through addition/subtraction, and rounds output only. Independent monthly factors are 365/84 for weekly, 365/168 for fortnightly, 1/3 for quarterly and 1/12 for annual. Mixed bills of 500/week rent, 300/quarter utilities and 120/year insurance yield 2,282.62/month. Income 4,000, other spending 1,000 and savings 500 leave 217.38. Zero income avoids an invented percentage; shortfalls stay negative internally and are described explicitly.
- W02 large amounts use `Intl.formatToParts` with BigInt whole amounts and exact cent strings, avoiding conversion to Number for money. Saved item keys/labels/count and periods are revalidated. Currency is checked by the component before restoration. It is a separate take-home comparison with explicit copy explaining that values are not copied from the gross-income tool above. No tax estimation or approval verdict is invented.
- W02 has associated labels/help/errors and a polite status region. Its no-JavaScript message supplies the manual calculation; initial totals are absent, so no stale example output is shown. Actual focus, screen-reader behavior, no-JavaScript disabled-state expectations and print pagination remain browser checks.
- Urgent input changes now reject arbitrary letters/arithmetic and parenthesized negatives before normalization. They preserve the home rational conversion routines and shared conversion formulas. Tests execute the actual route parser and exercise all 49 home conversion pairs, not an independent duplicate implementation. The grouped partial-entry regression is called out above.
- Homepage four-week explanation now agrees with its 365-day math: 2,000 every 28 days gives 26,071.43/year and 2,172.62/month. Thirteen actual payments cover 364 days. No protected conversion formula or canonical was changed in the reviewed diff.
- Analytics gating permits only exact origin `https://www.rentconverter.com` after consent. Previews, localhost, HTTP, lookalike origins and alternate ports are denied by the helper tests. Existing controller only imports PostHog when `enable()` is called. Hosted request monitoring after accepting preview consent is still required; code inspection is not proof of a network trace.

## Dependency audit triage

Input: `npm-audit-baseline.json`; corroborated with `npm ls ... --all` and installed package source. The report counts **11 package findings: 1 critical, 7 high, 3 moderate**. Several packages represent the same inherited React Router advisory, so this is not a count of 11 independently reachable vulnerabilities.

| Dependency path | Deployment relevance | Action |
| --- | --- | --- |
| Vite 6.4.3 | Development/build dependency, not served as a Netlify runtime. Windows `launch-editor` path handling is relevant to this actual Windows development environment. | Prioritize a separately validated patch to at least 6.4.4. The [maintainer advisory](https://github.com/vitejs/launch-editor/security/advisories/GHSA-587h-7wmj-h5pm) identifies the Windows command-execution path and patched Vite version. No exploit attempt was performed. |
| React Router 7.18.1, inherited `@react-router/node` and `@react-router/dev` findings | Advisory is specifically unstable RSC action CSRF. This repository has `ssr: false`, `prerender: true`, static output, and no identified RSC action endpoint. | Update to a tested patched 7.x version in maintenance; do not report a demonstrated production CSRF vulnerability. [Maintainer advisory](https://github.com/remix-run/react-router/security/advisories/GHSA-qwww-vcr4-c8h2) explicitly scopes affected applications to unstable RSC APIs and identifies 7.18.2. |
| PostHog → DOMPurify 3.4.12 | Runtime dependency, **not build-only**. Installed PostHog imports it from product-tour utilities. Product tours, surveys and external dependency loading are disabled by site configuration. | Patch the transitive dependency through a compatible tested dependency update. The critical [maintainer advisory](https://github.com/cure53/DOMPurify/security/advisories/GHSA-cg2g-xh64-v4q7) requires non-default template/DOM modes, shadow-root input and downstream template evaluation; those prerequisites were not identified in this site's configured path. Do not equate the critical package label with proven exploitation. |
| PostHog → fflate 0.4.8 | Runtime dependency. Installed request source uses `gzipSync` for outgoing compression; replay also uses gzip and is disabled here. The reported flaw concerns `unzipSync` parsing malformed ZIP64 input, and no site ZIP import path was found. | Patch in dependency maintenance; no demonstrated malicious ZIP processing route. [Advisory](https://github.com/advisories/GHSA-px8p-9vwx-vf98). |
| Browserslist / baseline-browser-mapping | Babel/build target processing. The listed untrusted query/custom-stats denial-of-service paths are not public calculator features. | Update build dependencies and keep build inputs trusted; not a static-production route defect. |
| PostCSS / nanoid / source-map-js | Vite/Tailwind build tooling. Attacker-controlled source maps or zero-size custom generators were not found in public route behavior. | Update compatible tooling and rerun build/audits. Avoid a blind `npm audit fix --force` or unrelated major upgrade. |

No dependency versions, lockfile, security settings, production deployment or live AdSense behavior were changed by this reviewer.

## Scope fingerprints and remaining acceptance

These git blob hashes identify the reviewed working files; they are **not release commit SHAs**. Root must replace/supplement with exact tested candidate commits after fixes and staging.

| File | Reviewed blob |
| --- | --- |
| `app/client/components/HousingBudget.tsx` | `caabb505b258b4efc04bc8ac3be29219c7a410d9` |
| `app/client/utils/housingBudget.js` | `e296f42d8b2c018ee7f0624d83cc730e835e9522` |
| `app/client/components/home/ListingComparison.tsx` | `080d5b1b6de2069bcd09af04374aa5eb6616a2cf` |
| `app/client/utils/listingComparison.js` | `aac6d067566b6c928f23c47dd96a6ac14a6aaafd` |
| `app/routes/home.tsx` | `d0ad1f1ca87c29d08d66ce0a9bc953341e90906b` |
| `app/client/utils/rentMath.ts` | `3bc31788ae264fdc457278403e08850dc72c2f70` |
| `app/provider.tsx` | `76b63167b6f9b9733905a6fa3ea24fc62c03bafd` |
| `app/client/utils/analyticsConsent.js` | `778fdb7d607dff88969cd897cea423d5157755b7` |

**Recommendation:** accept the reviewed W01/W02 and urgent implementation at the code/arithmetic level after the repairs above. **HOLD final release acceptance** pending root's five-width browser checks, actual CSV download, save/load and unavailable-storage tasks, print pagination, no-JavaScript fallback verification, preview request isolation, full release suites and immutable hosted preview. Dependency patching is tracked maintenance, with the Windows Vite patch prioritized. No guarantee about Google rankings or AdSense acceptance is implied.
