# RentConverter implementation handoff — November 13, 2026

Five implemented candidates are available as draft PRs and immutable previews. Production is unchanged. **Do not merge yet:** the requested print/PDF, JavaScript-disabled and runtime network checks remain incomplete. This is a substantial implementation milestone with explicit acceptance gaps, not a completed SEO recovery or AdSense approval.

The [release ledger](RC-RELEASE-LEDGER.md) is the source of truth for exact branches, SHAs, PRs and previews. The [browser report](RC-HOSTED_BROWSER_ACCEPTANCE.md), [HTTP report](RC-HOSTED_HTTP_ACCEPTANCE.md), [visual review](RC-HOSTED_VISUAL_REVIEW.md) and [integration report](RC-INTEGRATION_ACCEPTANCE.md) distinguish direct observations from test/source evidence. Earlier package reports retain their local-review timestamps and may say a preview was pending; use the ledger for the later staged identity.

## What a renter can do now

| Candidate | Actual improvement | Publication recommendation |
| --- | --- | --- |
| Urgent, PR 2 | Invalid money no longer silently changes value; four-week examples agree with calculator math; preview analytics are gated to the production origin | First merge candidate only after remaining gates pass |
| W01, PR 3 | Compare up to three listings with different rent periods and recurring extras; save locally and export CSV | Future weekly release, currently HOLD |
| W02, PR 4 | Itemize housing bills against take-home income, commitments and savings | Future weekly release, currently HOLD |
| W03, PR 5 | Allocate the rent still needed across actual paydays before a deadline, preserving every cent | Future weekly release, currently HOLD |
| W04, PR 6 | Download displayed rent dates and amounts as an all-day calendar file | Future weekly release, currently HOLD; inspect the repaired mobile table |

The original calculators remain. No new indexable pages were created. No ad settings, ad lifecycle, ads.txt contents, canonicals, sitemap population or redirects were changed. The public ads.txt endpoint already works; changing it would not resolve an account-side refresh delay. Search history is retained as history, not represented as fresh rankings.

## Fifteen-minute owner review

1. **Minutes 0–3: urgent preview.** Enter 1e3 in the homepage rent field. Expect an error and dashes. Enter 500 weekly: expect 2,172.62 monthly and 2,000 every four weeks. Print/save PDF, inspect actual pagination and verify useful results are present. Repeat one protected converter if time permits.
2. **Minutes 3–6: W01.** Compare 500 weekly plus 100 monthly extras against 2,200 monthly. Expect 2,272.62 versus 2,200. Add a third listing, save, reload and explicitly load it. Download CSV and compare displayed totals. Check the lower cards at 360px.
3. **Minutes 6–9: W02.** Expand the optional budget. Enter take-home income 4,000; rent 500 weekly; utilities 300 quarterly; insurance 120 yearly; other commitments 1,000; savings 500. Expect housing 2,282.62 and remaining 217.38. Enter negative rent: the result must disappear. Restore it, reload and print the expanded panel.
4. **Minutes 9–12: W03.** Use biweekly pay, bill 2,000, saved 500, next payday January 8, 2027 and due February 1. Expect two 750 reserves. Move the due date to January 22 and compare excluding/including that payday. Print with the section open.
5. **Minutes 12–15: W04.** Enter January 31, 2028, three months, 1,800.25 monthly. Expect January 31, February 29 and March 31. At 360px check complete amounts and dates. Download the calendar file, preview it in a disposable/test calendar without importing into a personal calendar unless desired, and check all three dates and amounts.

Additional release checks require a browser with suitable controls: disable JavaScript and reload each candidate to check the visible fallback and inactive controls; restore JavaScript afterward. In developer tools, inspect requests after rejecting and accepting optional analytics on previews: no live analytics or ad requests should be sent. Check keyboard navigation and a screen reader, and confirm usable PDF output on each affected page. These are outstanding checks, not conditions the agent observed passing.

## Release and rollback discipline

Review urgent separately before the weekly features. All weekly branches share its f344ad2 base and are independent of one another. The common one-line test command conflicts when combining weeks: preserve every test file exactly once. W03/W04 share the same precision formatter; retain it once. The integration report proves the original combination and records the mobile repair separately. Any assembled production candidate needs a new exact SHA, full suites and hosted smoke check.

Leave drafts unmerged to defer publication. If an owner-approved release later needs rollback, prepare a separate reviewed revert branch, preserve dependent shared fixes and tests, validate it, then ask the owner to merge. No reset or automatic rollback deploy is authorized.

## Known remaining work

- Finish the browser gates above. The available in-app browser has no JavaScript-disable or request-capture capability. Its print action blocked input and exposed no targetable print dialog; closing the test tab recovered it. No PDF acceptance is claimed.
- Complete exhaustive interactive/human-value review of all canonical routes. The full static/HTTP route and redirect inventory is complete, but the working editorial matrix is not a substitute for every user journey.
- Address existing dependency advisories in a separate reviewed patch. The clean install still reports 11 findings, including one critical; counts match the pre-change baseline. No dependency was added by these features. See the independent review for applicability and suggested Vite patch investigation.
- Recheck current ranking/page data before future consolidation decisions; supplied search exports end November 10. No bulk noindex, route expansion or keyword-page factory was performed.
- Keep the protected ad-placeholder policy intact. Current source has static reserves; do not invent a filled-ad lifecycle to satisfy a policy assertion.
- Continue later roadmap work only as genuinely useful, independently validated packages. No empty W05–W52 branches were created.

## Workspace state

The original rent-converter checkout remains clean at 131ae371aabf8c8b1871116edc3d5d09048ba965. Remote main and the current Netlify production deploy remain 50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a (deploy 6ad02cf4ac34d1b203b9b866). Work was isolated in rent-converter-urgent, rent-converter-w01 through w04 and rent-converter-rc27. Task-generated QA logs and artifacts are intentionally retained locally; no unrelated work was discarded. The aggregate build branch is an integration/review checkpoint, not an instruction to merge all weeks together.
