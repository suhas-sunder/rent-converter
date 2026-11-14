# W12 — consistent period examples and usable no-JavaScript behavior

Status: IMPLEMENTED, HOLD for final combined browser evidence and hosted preview. No production action authorized. Base: `ea76372657068902c21e013eb8be9515212140e8`; branch `codex/w12-methodology`. The final integration ledger records the exact candidate SHA.

## Task and scope

Help a renter distinguish a 365-day equivalent from actual 28-day payments, verify a worked example and move to a dated schedule or paycheck/budget task. Classify `/rent-paid-every-4-weeks-calculator` and `/methodology` as **improve**, with all existing indexation/canonical/redirect decisions retained. The homepage, sitemap and protected converter defaults are unchanged.

Before editing, the live guarded baseline showed the 365-day calculator result alongside supporting copy calling $26,000 a year and $2,166.67 its monthly equivalent for $2,000 every four weeks. Those numbers describe thirteen payments over 364 days, not the tool's stated rate model. The competing August payment-term page uses a 52-week convention; that is evidence to label conventions, not to replace this site's math or claim one formula is law. Source: https://www.augustapp.com/calculators/rent-payment-term-calculator (browser inspected November 13, 2026). No interactive controls were exposed by that page in the observed browser rendering.

The changes preserve the imported HowItWorks/ToolFit components and calculation functions. A small example registry drives visible values and is checked against independently specified expected cents and the separate home rational conversion implementation. The four-week explanation now distinguishes 364 days, 365-day rate equivalents and integer payment dates. Five checkable examples and task links on methodology connect conversions to actual planning; no directory expansion or new route.

Actual browser testing additionally exposed editable four-week inputs with JavaScript disabled. The existing HydrationSafeControls wrapper now prevents misleading edits until hydration, preserving readable examples and navigation.

## Validation and review

- Initial source checks: 190 tests, typecheck, build, 60 canonical HTTP pages,112 redirects,215 schema scripts,59 breadcrumbs and release audit passed. After the browser-discovered guard repair, repeat checks and final exact-source browser evidence are required; see integration ledger for final results.
- First full browser pass caught the no-JS defect; it is not counted as a passing acceptance. A link test initially checked the URL before client navigation completed; the repaired harness waits for navigation.
- Independent regional worker reviewed the registry, 364/365 distinction, actual four-week page and methodology navigation. No numerical blocker found. Final repaired source must still pass root browser acceptance.
- Unit cases check 13 versus14 actual dates within a year, all five visible example outputs and cross-engine agreement. Existing calculator tests remain registered exactly once.

Changed source: four-week HowItWorks/ToolFit, four-week route hydration wrapper, methodology route, verifiedPeriodExamples registry; new consistency test and package test registration. No FAQ changes, advertising changes, metadata changes, redirects, route additions or sitemap edits.

## Limits and rollback

W05–W08 do not yet have implementation/acceptance branches. W12 is independently reviewable against the accepted development checkpoint but cannot be called a publication-ready next week. An immutable nonproduction preview is not yet available. Native OS printing and screen-reader speech remain manual boundaries. Do not use older browser evidence as acceptance for a new SHA.

Before publication, leave this draft unmerged to roll back. After a future owner-approved release, revert its scoped implementation on a new branch, retaining shared hydration primitives and other accepted features. Rebuild and repeat all checks against then-current main. Never reset or force-push main.

## Final mobile accessibility followup

A supplemental 390px axe scan found the existing supporting schedule table lacked an explicit keyboard focus target. Added a named region, tab stop and visible focus ring without changing table data, formulas or layout. Final integration acceptance includes a focused ArrowRight/Tab exit test and mobile axe scan. The earlier desktop-only axe result did not cover this narrow-width condition.

## Integration followthrough (review assembly only)

See [RC-030 final acceptance](RC-030_INTEGRATION_ACCEPTANCE.md) for the exact final feature head, assembled-source identity, repaired findings and final local browser/PDF/download evidence. That report supersedes pending-local-integration notes above, but does not close immutable-hosted-preview or W05–W08 publication dependencies. This package remains HOLD for publication.
