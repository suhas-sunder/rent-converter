# RC-028 JavaScript-disabled and hydration acceptance

Reviewed 2026-11-13 on isolated `codex/rc028-fallback`, based on urgent `f344ad29766bb63e185515ed08277a8ac9085247`. **Local repaired fallback PASS; original immutable candidates FAIL this gate; repaired hosted candidates still require verification.** Final commit/deploy identities belong in the release ledger after propagation. No main merge or production deployment is authorized by this report.

## Actual browser evidence

Pinned Playwright 1.58.2, Chromium 145.0.7632.6 and Node v25.9.0 were used. Each context explicitly set `javaScriptEnabled: false`. These are rendered browser observations and real typing/clicking, not source inspection. The browser dependency is reused from the separate acceptance harness; no production dependency or lockfile changed.

| Candidate and immutable preview | Observed defect |
| --- | --- |
| Urgent `f344ad2`, `https://6af6977a997b1f8cde73e05e--rent-converter.netlify.app/` | Four enabled home inputs/selects; changing 500 to 98765 leaves displayed results unchanged |
| W01 `62e5e6c`, `https://6af69ad52629bf99da003eb7--rent-converter.netlify.app/` | Same primary converter defect; new listing comparison controls already disabled |
| W02 `f0320ba`, `https://6af69ad656cfa2344539eb98--rent-converter.netlify.app/rent-budget-calculator` | Eighteen enabled inputs/selects after opening native budget details; neither primary nor additional budget recalculates |
| W03 `3c36fa8`, `https://6af69b0c73337f2e792caf49--rent-converter.netlify.app/rent-per-paycheck-calculator` | Four enabled primary-tool controls with frozen output; new deadline controls already disabled |
| W04 `155b2a8`, `https://6af69d4ceab11ecb5c38ff5b--rent-converter.netlify.app/rent-schedule-calculator` | Five enabled controls; entering 2028-01-31 in the date field does not generate a schedule |

All five showed the global no-JavaScript notice, but a warning did not prevent misleading edits. On all five, the enabled mobile Open menu button remained `aria-expanded=false` after clicking. The header logo and ordinary page/footer links worked. The desktop primary anchors remained available. Native details opened without JavaScript. Screenshots cover 360, 390, 768, 1280 and 1440 widths, plus edited examples; [baseline results](evidence/rc028-nojs-before/results.json) record the individual controls and states. No page runtime errors occurred. Requests observed only each preview hostname, `fonts.googleapis.com` and `fonts.gstatic.com`; this no-JavaScript sample is not a substitute for the parent's consent-on/off JavaScript network audit.

## Scoped repair

- New `HydrationSafeControls` renders a native disabled fieldset during SSR and the initial browser render, then enables it in an effect. It has a meaningful group label and resets fieldset margin, minimum width, border and padding. Existing input labels, help, validation, result content and anchors remain intact.
- Applied around home converter content, shared generated ToolCard content, and the primary rent-per-paycheck tool. Home advertising nodes remain outside the new wrapper, and no ad code was edited. Other generated tools using ToolCard inherit the control safeguard, but this report does not claim exhaustive interactive acceptance of those routes.
- Mobile and desktop JS-only menu buttons use the navigation component's existing hydration flag. A compact no-JavaScript navigation exposes the existing primary links plus `/sitemap`. Native anchors and details remain usable. The footer analytics preference button uses its existing hydration flag rather than remaining a nonfunctional action.
- The existing global notice now describes static examples and controls requiring JavaScript; no duplicate global warning was added.
- Parent's actual axe findings identified insufficient contrast in header/footer `.com` branding. Both spans now use `text-sky-700`. Parent separately added `#all-tools` and `.rc-no-print` to the existing home print hide rule in this worktree. Its PDF rendering also found the sticky navigation overlapped invalid results, so the header now uses `print:hidden`. Those changes are included in the complete checks below; parent's print/axe rerun owns their visual acceptance.

The W02-only `HousingBudget` does not exist on the urgent base. [Prepared W02 patch](evidence/rc028-nojs-before/w02-hydration.patch) imports the helper and wraps the budget body after its existing noscript guidance, keeping its native details/summary outside. `git apply --ignore-space-change --check` passes against W02 (the flag handles checkout CRLF). The patch has **not** been applied to W02 by this agent and requires integration plus real browser verification there. The helper must accompany it.

## Reproduced local verification

All six full commands passed after the final source edits: typecheck; 148 unit/regression tests (zero failed/skipped); production build with 60 canonical pages and 112 redirects; redirect validation; breadcrumb validation; release audit. Logs are in `evidence/rc028-nojs-after/qa-nojs-*.log` and the recorded exit codes are in `qa-nojs-checks.json` there. Generated redirect status is line-ending-only; no mapping change was made.

The corrected static build served at `http://127.0.0.1:3028` passed real JavaScript-off assertions on home, rent budget, rent per paycheck and rent schedule at all five widths: no editable calculator inputs, disabled mobile menu, visible limitation notice, no document horizontal overflow, and working native All calculators navigation to the sitemap. [After results](evidence/rc028-nojs-after/results.json) and viewport/full-page captures are retained. The home 360 viewport was visually inspected after recapture with the page at the top. These are local results, not a new immutable hosted SHA.

[Hydration regression results](evidence/rc028-hydration/results.json) cover four pages in JavaScript-enabled contexts with module requests deliberately delayed: actual SSR controls were disabled before scripts were released, then became editable and recalculated after hydration. The mobile menu opened and closed with Escape; no hydration/runtime errors occurred. The home malformed-input case sets `aria-invalid` and replaces the prior result; restoring 500 returns 2,172.62 monthly. The schedule generated the expected leap-February payment for a three-month 2028-01-31 lease at 1,800.25. Three protected converters also passed: weekly 700.50 → monthly 3,043.84; biweekly 900.50 → weekly 450.25; PCM 1,500.50 → weekly 345.32.

These browser tests inspect actual HTML, controls and results. They do not add brittle source-pattern assertions. An initial harness assertion expected a generic validation phrase rather than the actual specific error; it was corrected to assert invalid state, visible feedback and suppression of the previous amount. That was a harness expectation error, not an additional product defect.

## Reproduction and remaining scope

Reuse the parent's pinned dependencies under `../rent-converter-acceptance/scripts/browser-qa`, or set `RC_BROWSER_QA_DIR` to that directory. With the candidate built and served:

```powershell
$env:RC_NOJS_BASE = 'http://127.0.0.1:3028'
$env:RC_NOJS_OUT = 'ai-issues/evidence/rc028-nojs-after'
$env:RC_NOJS_ASSERT = '1'
node scripts/no-js-browser-audit.mjs
node scripts/hydration-browser-regression.mjs
```

Without `RC_NOJS_BASE`, the audit visits the five original immutable previews and records their known defects. Do not enable `RC_NOJS_ASSERT` when intentionally recording those unrepaired candidates. Node's Playwright evaluation is used to inspect DOM and scroll screenshots; it does not enable application JavaScript in the disabled context.

The review commit contains these scripts, concise JSON results, the W02 patch and this report. Bulk screenshots and command logs remain local review artifacts under the listed evidence directories; they are intentionally excluded from the shared repair commit. The parent acceptance package owns the final published visual/PDF evidence.

This is a scoped repair of the five release representatives and their shared components. Legacy standalone converters outside those wrappers were calculation-smoked with JavaScript, not certified for JavaScript-off behavior across all 60 routes. Full screen-reader behavior, production ad lifecycles, native OS printing and external calendar import are not claimed. Parent owns PDF, axe, network and final immutable preview verification. After candidate propagation, rerun both browser scripts and full release checks on each actual SHA; preserve W02/W03/W04 additions when merging shared files. No new routes, indexing, sitemap, metadata or formula changes were introduced.

Rollback before release is to leave this candidate unmerged. Any later rollback should revert these specific scoped changes on a reviewed branch and revalidate dependent weekly packages, rather than reset unrelated work.
