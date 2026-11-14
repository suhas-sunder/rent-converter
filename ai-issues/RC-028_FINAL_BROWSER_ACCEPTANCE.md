# RC-028 — Final acceptance closure: real browser, network, print, accessibility and W04 semantics

> **RC-028 closure update:** The historical findings/status below are superseded for current candidates by [completed browser acceptance](RC-028_BROWSER_ACCEPTANCE_EVIDENCE.md) and the [release ledger](RC-RELEASE-LEDGER.md). Preserve this report as evidence for its listed original commits.
**Created:** 2026-11-13. **Status: BLOCKING RELEASE; no production merge authorized.**
**Base for review:** verified staged draft PRs #2–#6 and exact Netlify immutable previews in `RC-RELEASE-LEDGER.md`; integration checkpoint `build/rc27-recovery` @ `2aa240d30c8eab0bea062a1d781eae630da7cff0` prior to this note.
**Reviewer:** independent GitHub/Netlify code, branch and deploy audit.

## What independent remote verification confirmed

- PRs #2–#6 are open DRAFTS; each GitHub commit/Netlify deploy SHA matches ledger; Netlify reports READY, context `deploy-preview`, **not published production**. Current production Netlify deployment remains `6ad02cf4ac34d1b203b9b866` from `main` `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a`.
- Compared each weekly head directly with urgent `f344ad29766bb63e185515ed08277a8ac9085247`: W01 one commit, W02 one, W03 one, W04 two (including the mobile fix). Each contains one independently scoped new user workflow. W03 and W04 share identical BigInt formatter changes. All weekly branches depend on urgent PR #2.
- The feature algorithms for listing comparison, housing budgets, paycheck dates and .ics export were read; code uses BigInt/rational or date-only calculations and includes the reported validation/limitations. Prior tests/hosted screenshots are evidence, not proof of the missing gates. No new routes or redirects introduced.
- The urgent parser patch rejects `1e3` and unsupported expressions before normalization; previous parser silently deleted letters. This merits first-priority targeted release *after* critical acceptance.
- PR #2 has ~11,800 added lines/26 files, primarily evidence/planning. Separate actual production logic from documentation during owner review and minimize future release payloads.

## Additional concrete product issue found — W04 only

`app/client/utils/rentCalendarExport.js` (W04 `155b2a8247449e9523e0e950155338acf573e6c1`) uses `SUMMARY:Rent due: <amount>` for each .ics event but the same event DESCRIPTION explicitly states: **"Payment dates are period starts, not legal due-date determinations."**

A renter seeing only the calendar entry title is likely to interpret it as a confirmed contractual deadline. This conflicts with the product's own assumptions and risks misleading financial scheduling.

**Required correction:** Use a precise non-contractual title such as `Estimated rent payment: USD 1,800.25` or `Rent payment period starts: ...` consistently in UI/download instructions and calendar entries. Preserve all date/amount/UID/date-only semantics, warnings, formatting, fold/escaping and compatibility. Extend `scripts/rent-calendar-export.test.mjs` with a regression assertion on SUMMARY and visible description. Rerun full suites, create a new exact W04 SHA and immutable Netlify preview and update ledger. Do not imply actual lease payment due dates unless entered/specified.

## Acceptance closure mechanism — use proper automated browser, not only the in-app browser

The previous Codex run could not disable JavaScript, inspect network, or capture native print/PDF. These are *test-harness limits*, not proven application blockers. Next run must try external headless Chromium using locally available Playwright (or install a pinned development-only version if permitted), or a temporary CI runner. Preserve repo package/lock dependencies unless there is a specific reason to change them. Do not demand manual owner checks for things an automated test can do.

**A. JS-disabled browsing**

Create a browser context with `javaScriptEnabled:false` and load each immutable preview for PR #2–#6. Verify navigation, SSR-visible explanatory content and core results, global noscript warning, new feature fieldsets disabled/clarified, no misleading interactive controls and no console errors attributable to hydration. Capture screenshots at 360/390/768/1280/1440. For new workflows that are unusable without JavaScript, make that limitation explicit without breaking indexable SSR content. Distinguish a *meaningful fallback* from a mere page load.

**B. Network request capture / previews**

With normal JS enabled and after explicit synthetic consent *accept and reject separately*, attach `page.on('request')`, `page.on('response')`, `page.on('requestfailed')` and/or HAR capture before navigation. Classify hostname/provider and record no PostHog/analytics, AdSense, DoubleClick, or CMP third-party calls on preview, including delayed requests and navigation; verify exact production-host gating. Do not leak personal data, cookies, or credentials into evidence; use synthetic sessions. Also test no provider requests on no-JS. Validate any actual external fonts separately; network log must show what was observed, not claim universal no third-party requests if font/CDN loads are present.

**C. Print / Save PDF**

Use headless Chromium `page.emulateMedia({media:'print'}); page.pdf({printBackground:true, preferCSSPageSize:true})` for each affected page after setting representative inputs and opening relevant panels. Independently inspect generated PDF page count, text extraction (`pdftotext`/equivalent), clipped content, page breaks, readable results/columns and no ad placeholders. Include: urgent home default+invalid state, W01 with three listings, W02 expanded budget, W03 paydays/reserve table, W04 multi-month schedule. Automating PDF rendering does NOT replace a real OS print-dialog click; owner can do one small manual print smoke after reviewed PDF output. Preserve before/after screenshots/PDF thumbnails on branch-only review artifacts.

**D. Keyboard / accessibility**

Independent keyboard-only traversal, focus visibility, labels/help/errors, aria-live announcements, tab order, scrollable wide W04 schedule table, 200% zoom/reflow, 360px viewport, screen-reader naming where available. Run axe-core on changed pages where installable; manually inspect legitimate warnings. Test long strings, empty/malformed values, big amounts, calendar month-ends, leap years, localStorage disabled, saved/unsaved states, file exports.

**E. Security/maintenance**

Review the existing 11 advisories (1 critical, 7 high, 3 moderate), applicability to static production and compatible non-breaking patches as documented in `RC-027_INDEPENDENT_REVIEW.md`. Patch Vite and React Router/PostHog transitive dependencies **on a separate maintenance branch/PR**, preserving lockfile and rerunning all suites. No speculative `npm audit fix --force`; distinguish dev-only versus reachable runtime. Security cleanup must not become an unreviewed dependency of the urgent fix.

**F. Reassembly and final release gate**

For each candidate, report actual HEAD SHA and exact Netlify deploy SHA, 60 routes /112 redirects, real 404, canonicals, sitemap, protected winners, correct analytics and ad behavior, no new network leak. W01–W04 contain the urgent patch. After any approved urgent merge, rebase/cherry-pick/isolate W01..W04 onto the then-current main in *release order*, preserving union of test registration in `package.json`. Rerun combined integration and hosted tests against **each new assembled SHA**; do not rely on the prior simulated integration tree, particularly because W04 later changed. Do not merge main without explicit separate owner approval.

## Required deliverables

1. `ai-issues/RC-028_BROWSER_ACCEPTANCE_EVIDENCE.md` with tests actually executed, exact URLs, node/browser versions, successful/failed assertions, PDF excerpts/page counts, network hostnames, screenshots, keyboard/a11y results and remaining manual gates.
2. New runnable browser QA script(s) under `scripts/` or `tests/` with locally reproducible instructions. Include controlled, synthetic data. Avoid ad-network or personal-account testing.
3. W04 corrected event SUMMARY + tests + fresh immutable preview.
4. Any independently justified security patch as a separate draft maintenance PR.
5. Updated `RC-RELEASE-LEDGER.md` and `RC-OWNER_HANDOFF.md` listing RELEASE-CANDIDATE or HOLD per PR with honest proof, rollback, sequential merge considerations.

**Stop conditions:** actual print/PDF clipped, JS-off controls mislead users, preview analytics/ad requests fire, schedule claims confirmed legal due dates, protected converters regress, dependency changes break static output. Repair independent blockers; don't end with another analysis-only report. Do not commit/push/merge main, deploy production, resubmit AdSense or make paid changes.
