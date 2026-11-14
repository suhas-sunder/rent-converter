# RentConverter owner handoff — RC-030 continuation

**W09–W16 are implemented in eight draft PRs, all HOLD for publication.** Read the [current RC-030 handoff and ten-minute review](RC-030_INTEGRATION_ACCEPTANCE.md) for exact branches, tests, evidence, user workflows and limits. W05–W08 are not implemented/accepted, and no immutable hosted W09–W16 preview is available. These dependencies must be closed before proposing weekly publication. Main, production, AdSense and the weekly schedule remain unchanged. The combined integration branch is for review only.

The following RC-028 handoff remains the historical acceptance record for urgent/security/W01–W04; it does not claim that W09–W16 have hosted acceptance.

**Recommend approving urgent PR #2 first.** The five existing implementations now pass the requested scoped browser acceptance after genuine fallback, keyboard-focus, contrast, print and calendar-wording repairs. Every release is still a draft; main and production are unchanged.

The [release ledger](RC-RELEASE-LEDGER.md) contains all exact final commits and immutable preview links. The [browser evidence report](RC-028_BROWSER_ACCEPTANCE_EVIDENCE.md) links actual PDFs, CSV/ICS downloads, network traces, screenshots, test results and remaining limits. It supersedes the previous tooling-limit HOLD notes.

| Review order | What the owner is approving | Recommendation |
| --- | --- | --- |
| [Urgent PR #2](https://github.com/suhas-sunder/rent-converter/pull/2) | Reject silently misinterpreted money, correct four-week copy, isolate preview analytics; disable nonfunctional no-JS controls, preserve native navigation, repair focus/contrast/print | **RELEASE FOR OWNER APPROVAL — first** |
| [Security PR #7](https://github.com/suhas-sunder/rent-converter/pull/7) | Compatible package/lock patches, audit 11 → 0; no weekly product changes | **RELEASE FOR OWNER APPROVAL — separately after urgent** |
| [W01 PR #3](https://github.com/suhas-sunder/rent-converter/pull/3) | Compare and export up to three listings, with explicit local saving | **RELEASE FOR OWNER APPROVAL — its scheduled week** |
| [W02 PR #4](https://github.com/suhas-sunder/rent-converter/pull/4) | Itemized take-home housing budget, independent of gross-income comparison | **RELEASE FOR OWNER APPROVAL — its scheduled week** |
| [W03 PR #5](https://github.com/suhas-sunder/rent-converter/pull/5) | Exact reserves across actual paydays, with named keyboard-scrollable table | **RELEASE FOR OWNER APPROVAL — its scheduled week** |
| [W04 PR #6](https://github.com/suhas-sunder/rent-converter/pull/6) | Date-only calendar export now titled “Rent payment period starts” | **RELEASE FOR OWNER APPROVAL — its scheduled week** |
| [QA PR #8](https://github.com/suhas-sunder/rent-converter/pull/8) | Harness, evidence and assembled integration checkpoint, targeting build/rc27-recovery | **HOLD FOR PRODUCTION / REVIEW ONLY** |

Approval recommendations are not merge authorization. Each weekly package depends on urgent; none includes the other weeks' features. Security now explicitly includes urgent as a prerequisite and contains no weekly features. Its final guarded immutable preview passes all browser, network, storage, native zoom and PDF checks, plus four delayed-hydration and three protected-converter checks. The earlier CLI authentication obstacle was bypassed through the existing PR preview build. Review urgent first so the subsequent maintenance diff remains easy to inspect.

## What was actually verified

- All six local checks on each final product branch: **148 /157 /156 /160 /158 tests**, successful typecheck/build, redirect/breadcrumb validation and release audit. Each exact immutable preview passes 60-route /112-redirect /60-link HTTP checks.
- **45/45 main browser gates**, **11/11 focused gates**, five widths and actual native 200% Chromium zoom at two physical widths per candidate. Keyboard operation, labels/errors, live-region DOM semantics, storage failures, large values and real downloads exercised.
- **Six actual PDFs /18 pages**, extracted, rendered and visually reviewed. Required amounts/dates/assumptions remain; no blank pages, clipped results, navigation overlap or ad placeholders.
- Both accepted and rejected synthetic consent sessions captured actual requests: **540 requests**, only preview assets plus Google Fonts; no production analytics/ad providers or request/page errors.
- Axe zero automated violations. All incomplete disclosure-glyph contrast checks were manually measured and visually reviewed; they pass. Actual screen-reader speech is outside the claim.
- Security final preview: **148 tests**, zero audit findings, 9 browser gates, 2 storage cases, native 200% zoom and two PDFs; both consent states isolated.
- Assembled source plus security: **186 tests /25 registered test files**, all full checks, real browser checks and independent Git source-equivalence proof across **223 production files**.

## Short owner review

1. Open urgent's exact preview from the ledger. `1e3` must produce an error and dashes; 500 weekly produces 2,172.62 monthly and 2,000 every four weeks. Review the attached valid/invalid PDFs.
2. W01: compare 500 weekly +100 monthly extras with 2,200 monthly; add a third listing at 2,250. Inspect all three totals and downloaded CSV.
3. W02: take-home 4,000; rent 500 weekly; utilities 300 quarterly; insurance 120 yearly; commitments 1,000; savings 500. Housing is 2,282.62 and remainder 217.38. Negative rent removes stale results.
4. W03: bill 2,000, saved 500, biweekly payday January 8 2027, due February 1: two 750 reserves. Test the explicitly optional due-day payday inclusion.
5. W04: January 31 2028, three months, 1,800.25 monthly: January 31, February 29 and March 31; downloaded titles describe period starts, not confirmed legal deadlines.

Optional environment smoke checks are the owner's native Print/Save PDF dialog, preferred screen reader and a disposable calendar import. These do not replace or negate the completed browser/PDF checks. Minor print pagination/utility-label polish and tall screenshot-compositor limits are documented.

## Merge and rollback discipline

Do not merge the combined review branch into main. Release urgent, security and each week independently. Preserve the unique union of test registrations when package.json conflicts; retain shared exact-money formatting. Rebuild and rerun appropriate gates on each new candidate assembled with then-current main.

Before publication, simply leave the draft unmerged. After a separately approved release, use a reviewed revert branch, preserve fixes needed by later packages, run checks and obtain the owner's merge decision. Do not reset main or automatically restore an old Netlify deployment. Reverting security reintroduces known vulnerable versions.

Production remains main `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a`, Netlify `6ad02cf4ac34d1b203b9b866`. The original checkout remains clean. No paid-service, AdSense, ad lifecycle, route, sitemap, canonical or schema changes were made. Later roadmap work and broader editorial/SEO recovery remain separate tasks; no recovery or approval outcome is promised.
