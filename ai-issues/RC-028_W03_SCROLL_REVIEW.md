# W03 scroll access and PDF review

Reviewed 2026-11-13 from W03 base `3c36fa89472caf610b81767fd051b74dbfc13cf8`, in isolated branch `codex/rc028-paycheck-accessibility`. The reviewer originally authored the planner; this is direct browser/PDF evidence, not independent-of-author sign-off.

## Actual keyboard check

Pinned Playwright 1.58.2 from the separate acceptance harness launched Chromium **145.0.7632.6** in a synthetic 360×900 context. Baseline was the immutable preview `https://6af69b0c73337f2e792caf49--rent-converter.netlify.app/rent-per-paycheck-calculator`; the repair was tested on the isolated worktree's local Vite server. Optional analytics were rejected.

With bill `9007199254740991.99`, saved `500`, next payday 2027-01-08 and due date 2027-02-01, real Tab from Calculate already reached the baseline scroll container through Chromium's automatic scroll focus behavior. Real ArrowRight moved 0 → 40, and repeated presses reached 211 (the maximum). The container was 256px wide with 467px scroll content; the page remained 360px wide with 360px scroll content. The final saved balance stayed exactly `$9,007,199,254,740,991.99`. No huge-summary overflow or current-Chromium keyboard blocker was reproduced.

The baseline container had no explicit tab index, role or accessible name. The scoped repair adds `tabIndex={0}`, `role="region"`, `aria-label="Paycheck reserve schedule"` and an inset visible focus ring. It preserves the table caption, headers, values and layout. This makes intended focus/navigation explicit and provides context when the container receives focus. See [Chrome's automatic-scroll-focus documentation](https://developer.chrome.com/blog/keyboard-focusable-scrollers) and [MDN's overflow accessibility guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow#accessibility). This is compatibility and accessible-name hardening, not a claim that Chromium failed to scroll before.

The explicit-semantics regression failed before the repair (`tabIndex -1` versus expected 0), then passed afterward. Actual repaired keyboard movement and dimensions remain the same; computed inset focus ring and explicit name/role are present. The focused far-right screenshots were visually inspected: the full final balance is readable, while earlier columns are outside the scrolled view as expected. Evidence: `evidence/rc028-paycheck/{before,after}.json` and corresponding `*-table.png`.

Reproduce from this worktree with the acceptance harness installed in sibling `rent-converter-acceptance/scripts/browser-qa`:

```powershell
$env:QA_ORIGIN='http://127.0.0.1:3193'
$env:QA_OUTPUT='qa-paycheck-explicit-after'
$env:QA_EXPECT_EXPLICIT='1'
node scripts/paycheck-browser-review.mjs
```

Set `QA_PACKAGE` to an absolute pinned harness package.json path if it is elsewhere. Omit the three optional environment variables for the historical hosted baseline. The script rejects production origins, uses an isolated context and does not attach to a personal browser.

## Read-only PDF inspection

Used the PDF skill's visual review workflow on all four existing rendered pages under the acceptance harness's `artifacts/baseline/w03-page-{1,2,3,4}.png`, and read `w03.txt`. This pass did not generate or edit the PDF.

- Page 1 shows the annual-average result and start of the expanded deadline planner. Native select labels are truncated within their controls; the selected biweekly frequency and monthly amount are restated clearly in printed content.
- Page 2 contains the due date, same-day assumption, 1,500 remaining, both 750 reserves, balances 1,250 and 2,000, complete planner assumptions and annual-payment-count table. No reserve row or money clipping is visible.
- Page 3 contains the period breakdown and FAQ headings. No clipped numeric result was found.
- Page 4 contains footer/navigation with substantial empty space. This is global print layout, not a W03 table-specific clipping defect.

The bill-help paragraph splits across pages 1–2, leaving its final words at page 2's top, but no words are lost. No W03-specific print code change was justified. Root owns global print cleanup, final PDF generation and reinspection after shared fixes. Actual screen-reader speech, other browser engines and native OS print dialogs were not tested here.

## Validation and integration

The scoped implementation passed all six checks: typecheck, **160 tests**, build (60 static pages/no runtime server), redirect validation (112), breadcrumb validation (59 objects/zero failures) and release audit (60 HTTP-200 routes, 112 redirects, 60 internal links). Final assembled W03/W04 heads must repeat all six checks after the common urgent fixes are integrated. Root's comprehensive final browser suite is the release gate. No production merge/deploy is authorized by this report.
