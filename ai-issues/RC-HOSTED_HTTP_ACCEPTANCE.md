# Immutable preview HTTP acceptance — urgent and W01–W04

**Checked:** November 13, 2026; initial urgent/W01/W02 pass approximately 05:06–05:09 UTC, followed by W03/W04 and protected-route checks in the same session.
**Scope:** remote HTTP responses and deployed HTML/JavaScript source inspection only. No browser interaction, print, JavaScript-disabled rendering, or runtime network trace was performed in this pass.
**Result:** all five HTTP release audits PASS. Final release acceptance remains HOLD for outstanding browser and owner gates.

## Exact candidates

The release steward supplied the immutable deployment URLs and independently verified each Netlify deployment was ready and associated with the indicated SHA. This reviewer checked each isolated worktree's HEAD against that supplied SHA and used that worktree's audit script and route registry. Commit provenance was not inferred from an HTML response.

| Candidate | Exact commit | Immutable deployment | HTTP result |
| --- | --- | --- | --- |
| Urgent | `f344ad29766bb63e185515ed08277a8ac9085247` | [Urgent preview](https://6af6977a997b1f8cde73e05e--rent-converter.netlify.app) | PASS, process exit 0 |
| W01 listing comparison | `62e5e6c0eabeac0c939dabcab21a580e71c8f89d` | [W01 preview](https://6af69ad52629bf99da003eb7--rent-converter.netlify.app) | PASS, process exit 0 |
| W02 housing budget | `f0320bae61112269b85465aa5f23ff91abeba8ad` | [W02 preview](https://6af69ad656cfa2344539eb98--rent-converter.netlify.app) | PASS, process exit 0 |
| W03 paycheck deadline | `3c36fa89472caf610b81767fd051b74dbfc13cf8` | [W03 preview](https://6af69b0c73337f2e792caf49--rent-converter.netlify.app) | PASS, process exit 0 |
| W04 calendar export | `a7b1d1e734ccb64245f6f42d4180b06b281e87a1` | [W04 preview](https://6af69b0d56cfa234453a14ef--rent-converter.netlify.app) | PASS, process exit 0 |

## Executed remote audit

In each respective `rent-converter-urgent`, `rent-converter-w01`, `rent-converter-w02`, `rent-converter-w03`, and `rent-converter-w04` worktree, set `AUDIT_ORIGIN` to its exact immutable URL and ran `node scripts/release-audit.mjs` directly. The npm wrapper was deliberately not used because it overrides the origin. Each stdout/stderr stream is saved in that worktree's `qa-hosted-release.log`.

All five logs contain the same successful summary, without warnings or failures:

```text
Audited 60 indexable HTTP-200 routes, 112 redirects, and 60 unique internal links.
Release audit passed.
```

The audit checks the candidate's local sitemap/registry against remote pages: HTTP 200 and error-content checks; one title, description, canonical and H1 per page; production-www canonical targets; JSON-LD parsing and duplicate FAQ/breadcrumb checks; direct internal links; referenced social image responses; all 112 permanent redirects and query preservation; a trailing-slash canonical redirect; and a genuine missing-route HTTP 404 with its expected message. The local registry/sitemap supplies the expected set; this run does not independently prove that the remote sitemap file is byte-identical.

The audit's word **indexable** describes the intended production route set and its HTML robots metadata. It does not mean these previews are indexable: independent sampled response-header checks found `X-Robots-Tag: noindex`, as expected for immutable previews. This header is not a failure of production-intent metadata.

## Independently inspected deployed markup

Fetched urgent `/`, W01 `/`, and W02 `/rent-budget-calculator` directly over HTTPS. Each returned **200**, `Content-Type: text/html; charset=UTF-8`, and `X-Robots-Tag: noindex`.

| Sample | Actual HTML evidence | Limitation |
| --- | --- | --- |
| Urgent home | Global `<noscript>` explains that displayed calculator values are examples, editing will not update them, and JavaScript is needed for personal calculations. | Presence of markup only; no JavaScript-disabled visual or interaction acceptance. |
| W01 home | Same global notice plus listing-specific `<noscript>` naming the fixed example: 500/week plus 100/month extras becomes 2,272.62/month versus 2,200/month. The listing fieldset is emitted with `disabled=""`. | Confirms SSR fallback text and initial disabled attribute; not hydration, editing, export or assistive-technology behavior. |
| W02 budget | Same global notice plus housing-specific `<noscript>` explaining manual monthly normalization and subtraction of housing costs, commitments and savings from take-home income. | No disabled fieldset was found in this sample. W02 starts with blank required inputs; this inspection does not claim an editable no-JavaScript calculator works. |

All three sampled HTML documents contained **zero external script `src` tags** and **zero `adsbygoogle` or `pagead2.googlesyndication` occurrences**. They still load first-party JavaScript through module imports/preloads; absence of external script tags does not mean absence of executable scripts. This is a bounded check of three rendered documents, not proof that no code can dynamically load advertising or telemetry.

## Deployed preview analytics guard

Inspected the first-party JavaScript assets referenced by each sampled document (14, 15 and 16 distinct discovered assets respectively). All three deployments serve `/assets/provider-BqKiVXoy.js` with HTTP 200. The deployed module contains an exact equality check against `https://www.rentconverter.com`, and its consent effect enables the analytics controller only when consent is accepted **and** that check passes for `window.location.origin`; otherwise it disables the controller.

This independently confirms the origin guard is present in the deployed bundle, not merely in the local source. It is not a runtime request trace and does not prove analytics/ad request isolation after clicking consent. No consent interaction or JavaScript execution was performed here.

## W03/W04 deployed markup extension

Fetched W03 `/rent-per-paycheck-calculator` and W04 `/rent-schedule-calculator` directly from their exact immutable origins above. Both returned **200**, `Content-Type: text/html; charset=UTF-8`, and `X-Robots-Tag: noindex`.

- W03 contains the global no-JavaScript notice and a deadline-plan notice explaining that JavaScript is needed for the date-based plan and that the annual-average example is static without it. Its deadline form fieldset is emitted disabled.
- W04 contains the global notice and a calendar-specific instruction to enable JavaScript to generate/download the schedule. The actual **Download calendar (.ics)** button is emitted disabled, with its help description association intact.
- Neither sampled HTML document contains an external script `src` tag, `adsbygoogle`, or `pagead2.googlesyndication` marker. First-party module imports still execute when JavaScript is enabled; these are source checks, not request monitoring.
- Each document referenced 16 discovered JavaScript assets. Both serve `/assets/provider-BqKiVXoy.js` with HTTP 200 and the same exact production-origin/accepted-consent guard independently observed in the first three previews.

No native date-entry test, actual calendar download, disabled-JavaScript browser rendering or consent/network interaction is claimed by this extension.

## Protected-route HTTP regression anchors

`RC-001_IMMEDIATE_RECOVERY.md`, line 23, explicitly protects `/biweekly-to-weekly-rent-converter`, `/weekly-to-monthly-rent-converter`, and `/pcm-to-pw-calculator`. All three are already covered by every 60-page release audit. A second explicit read-only check fetched each protected URI from **all five candidates** with redirect following disabled and compared its parsed content against the established [production baseline immutable deployment](https://6ad02cf4ac34d1b203b9b866--rent-converter.netlify.app), associated with production SHA `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a` in the release evidence.

All **15 candidate protected-URI requests returned HTTP 200 directly with no Location header**. For every candidate and route, the title, meta description, H1, canonical, og:url, default input values, and the ordered set of rendered dollar/pound amounts exactly matched the baseline extraction. Script content was excluded before extracting the rendered money strings.

| Protected path | Title preserved across all candidates | Default input and primary result preserved |
| --- | --- | --- |
| `/biweekly-to-weekly-rent-converter` | Biweekly to Weekly Rent Converter \| Two-Week Rent | 900 biweekly → **$450.00 weekly** |
| `/weekly-to-monthly-rent-converter` | Weekly to Monthly Rent Calculator \| Per Week to Month | 500 weekly → **$2,172.62 monthly** |
| `/pcm-to-pw-calculator` | PCM to PW Calculator \| Monthly Rent to Weekly Equivalent | 1,200 PCM → **£276.16 weekly** |

For each path, canonical and og:url remain `https://www.rentconverter.com` plus the exact path. The weekly-to-monthly description still states weekly × 365 / 7 / 12; PCM-to-PW still states PCM × 12 × 7 / 365. These HTTP anchors establish preservation of the prerendered default examples and metadata, not arbitrary edited-input correctness, hydrated interaction, storage, responsive layout, or print behavior. Those require their separate tests/browser acceptance.

## Remaining gates

These HTTP results do not close exact-preview interactive checks, five-width visual acceptance, actual download contents, print/PDF pagination, JavaScript-disabled browser behavior, denied/corrupt storage interaction, or browser request monitoring after consent. They also make no claim about AdSense approval, Google indexing or ranking recovery. No production/main update, deployment mutation, ad configuration change, commit or push was performed in this pass.

## Final W04 mobile repair addendum

**Current W04 candidate:** `155b2a8247449e9523e0e950155338acf573e6c1`, [immutable final W04 preview](https://6af69d4ceab11ecb5c38ff5b--rent-converter.netlify.app). The earlier `a7b1d1e734ccb64245f6f42d4180b06b281e87a1` results above remain historical evidence and are not silently reassigned to this new commit. The release steward verified Netlify ready state and exact commit association; this reviewer independently confirmed the W04 worktree HEAD.

Reran `node scripts/release-audit.mjs` directly with `AUDIT_ORIGIN=https://6af69d4ceab11ecb5c38ff5b--rent-converter.netlify.app`. **PASS, exit 0:** 60 expected HTTP-200 pages, 112 redirects and 60 unique internal links, without warnings/failures. Output is saved separately as `rent-converter-w04/qa-hosted-final.log`, preserving the initial `qa-hosted-release.log`. The same audit scope and preview-indexation limitations above apply. No new browser or runtime-network claim is made.

### Independent mobile-fix code review

Reviewed the complete application diff from the initial W04 SHA to this final SHA. Only `app/client/components/generated/GeneratedPages.tsx` changes application behavior; the other commit files are acceptance/validation evidence. `ResultPanel` adds an optional `tableLabel`. Only the `config.mode === "schedule"` result supplies it, enabling a named, keyboard-focusable horizontal scrolling region with a visible focus ring and reduced cell padding below the `sm` breakpoint. Other result panels retain their previous `overflow-hidden` container and cell classes because they do not supply the new prop.

No calculation, date generation, amount formatting, export contents, route metadata, FAQ, advertising behavior or other result-panel layout changes appear in this repair. The optional-prop scope is appropriate and no code blocker was found. This is code review, not independent mobile visual acceptance; the release steward is testing the exact final preview. In particular, print behavior and actual keyboard scrolling are not certified by these class/attribute checks.

Inspected the committed repair validation evidence: all six recorded commands exited 0 (typecheck, test, build, redirect validation, breadcrumb validation, release audit), and the test log reports **157/157 passing, zero failures/skips**. Those are the repair run's recorded results; this reviewer reran the remote HTTP audit only.
