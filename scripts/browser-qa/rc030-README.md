# W09–W16 review harness

These scripts exercise real Chromium against the nonproduction assembly. Install the pinned browser package using the parent README. Never run against production or a personal browser.

`rc030-candidates.json` records the application source checkpoint, each independent feature head, and the local origin. Local URLs are mutable and are **not immutable hosted acceptance**. Rebuild the recorded checkpoint before running. An evidence-only commit after that checkpoint does not alter application code.

From the repository root in PowerShell:

```powershell
$env:QA_CANDIDATES='scripts/browser-qa/rc030-candidates.json'
$env:QA_OUTPUT='artifacts/rc030-final'
node scripts/browser-qa/rc030-run.mjs
$env:QA_ZOOM_OUTPUT='artifacts/rc030-final-zoom'
node scripts/browser-qa/rc030-zoom.mjs
$env:QA_FOCUSED_OUTPUT='artifacts/rc030-final-focused'
node scripts/browser-qa/rc030-focused.mjs
node scripts/browser-qa/rc030-axe-review.mjs
python scripts/browser-qa/rc030-inspect-pdfs.py artifacts/rc030-final
```

The PDF command requires pdfplumber and its rendering dependencies; the recorded run uses the bundled Codex PDF runtime. The scripts exit nonzero on failures. Native zoom uses the disposable QA extension and `chrome.tabs.setZoom(2)`, not CSS emulation. Main gates include five widths, JavaScript disabled, both consent choices with request traces, real PDF and downloads, live-region DOM semantics, keyboard traversal, axe and invalid states. Focused checks exercise delayed hydration, parser consistency, keyboard scrolling, storage denial and extreme values.

Existing `run.mjs` and `focused.mjs` remain the W01–W04 regression suite. Use `QA_ORIGIN=http://127.0.0.1:3049` and `QA_SOURCE_SHA` with their existing candidate configuration. The updated W04 locator uses the preserved input ID because its visible label now distinguishes period starts from due dates; keyboard checks include the new optional checkbox without dropping the scroll-region assertions.

Capture repairs: W10's section contains a nested details element, so the harness opens that element; the earlier direct-child summary selector timed out. W12 navigation now awaits the destination URL. W15 invalid state retains an accessible error region while removing its stale total; the assertion reflects that contract. Earlier failed artifacts are historical and are not final acceptance.

Actual screen-reader speech, OS print dialogs and third-party calendar import are manual boundaries. Automated checks do not certify every input or every editorial page. See `ai-issues/RC-030_INTEGRATION_ACCEPTANCE.md` for exact results, source identities and external HOLDs.

The supplemental mobile axe scan exercises all eight fixtures at 390px after dismissing the consent banner. It records incomplete-node computed styles for independent manual review. W12 has explicit keyboard-scroll coverage in the focused suite; Chromium automatic scroll focus alone is insufficient evidence for other browsers.
