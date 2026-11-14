# RentConverter browser acceptance

This is a separate development-only test package. It does not change the application's dependencies and never attaches to a personal browser. Tests use fresh headless Chromium contexts and synthetic rent/date/name data. A passing run applies only to the exact configured candidate SHA/URL; verify their association with Netlify before running.

## Install the pinned harness

From this directory:

```powershell
npm ci
npx playwright install chromium
```

The committed package/lock pins Playwright **1.58.2** and `@axe-core/playwright` **4.11.1**. Do not replace `npm ci` with an unbounded package upgrade. On a Linux CI worker, use `npx playwright install --with-deps chromium` for that pinned version's browser and OS libraries. Record Node/npm/Chromium versions from the actual environment; the JSON reports include Node and Chromium versions.

## Candidate configuration

`QA_CANDIDATES` points to a JSON array with this structure (replace the placeholders with verified values):

```json
[
  {
    "id": "w04",
    "sha": "<40-character exact commit SHA>",
    "origin": "https://<24-character deploy ID>--rent-converter.netlify.app",
    "path": "/rent-schedule-calculator"
  }
]
```

Known IDs/routes are `urgent` and `w01` at `/`, `w02` at `/rent-budget-calculator`, `w03` at `/rent-per-paycheck-calculator`, and `w04` at `/rent-schedule-calculator`. `QA_ONLY` optionally selects comma-separated IDs. Do not use production, a mutable deploy alias, an authenticated site, or personal input. The checked-in `candidates.json` records the reconciled RC-028 final heads; verify it against the release ledger before each run because future commits require new immutable URLs.

## Run the baseline suite

```powershell
$env:QA_CANDIDATES = 'C:/absolute/path/verified-candidates.json'
$env:QA_OUTPUT = 'artifacts/final'
node run.mjs
```

`run.mjs` owns JavaScript-disabled contexts, accepted/rejected-consent request observation, responsive screenshots, axe checks, basic keyboard traversal, actual Chromium PDFs and file downloads. It captures sanitized request URLs without query strings/fragments and excludes headers, cookies and request bodies. Both runners now restrict targets to immutable RentConverter previews or explicit loopback servers. Do not use `QA_ORIGIN` for a maintenance baseline lacking the urgent preview analytics guard. In that case use an assembled, guarded preview or an explicitly blocking test context.

PDF creation alone is not acceptance. Run `inspect_pdfs.py` with the project's available PDF Python environment (requires `pdfplumber` and its rendering dependencies), passing the output directory, then visually inspect the rendered page PNGs. The script extracts text, checks required amounts/dates, flags blank/out-of-bounds content and advertisement text. Its fixtures must match the run's synthetic inputs. Native OS print-dialog behavior and physical printing are not certified by Chromium PDF output.

## Real browser 200% zoom

```powershell
$env:QA_ZOOM_OUTPUT = 'artifacts/zoom-final'
node zoom.mjs
```

This runner loads a minimal local QA extension into a fresh disposable Chromium profile and calls `chrome.tabs.setZoom(2)`. It does not install anything into a personal browser. At physical widths 1440 and 720, it verifies CSS viewport widths 720 and 360, devicePixelRatio 2, unchanged CSS zoom 1, correct responsive breakpoints and no ellipsized money. CDP captures use device-coordinate content bounds to avoid Playwright's full-page native-zoom clipping; viewport images provide independent confirmation. Very tall full-page captures can have compositor artifacts below the tool; inspect the normal-width and viewport images too.

CSS `zoom:2` is not equivalent: it leaves media-query breakpoints unchanged. Historical CSS stress PNGs are retained locally as diagnostic artifacts but do not establish browser-zoom acceptance. The actual native-zoom evidence supersedes them.

Implementation follows [Playwright's extension guide](https://playwright.dev/docs/chrome-extensions) and [Chrome's tabs zoom API](https://developer.chrome.com/docs/extensions/reference/api/tabs/).

## Run focused edge cases

```powershell
$env:QA_CANDIDATES = 'C:/absolute/path/verified-candidates.json'
$env:QA_FOCUSED_OUTPUT = 'artifacts/focused-final'
$env:QA_ONLY = 'urgent,w01,w02,w03,w04'
node focused.mjs
```

Equivalent POSIX invocation:

```sh
QA_CANDIDATES=/absolute/path/verified-candidates.json \
QA_FOCUSED_OUTPUT=artifacts/focused-final \
QA_ONLY=urgent,w01,w02,w03,w04 node focused.mjs
```

The focused runner validates every selected configured origin against the exact immutable RentConverter Netlify hostname pattern and refuses production, mutable aliases and unknown routes. An explicit `QA_ORIGIN=http://localhost:3029` (or a numeric port on `127.0.0.1`) is allowed for a local assembled static server; no other override is accepted. Local runs set the served SHA to null and retain candidate SHAs only as references, so they cannot masquerade as exact hosted acceptance. `QA_OUTPUT` is accepted as a fallback output directory when `QA_FOCUSED_OUTPUT` is unset.

The focused runner blocks off-origin requests except HTTPS GET stylesheet/font requests to `fonts.googleapis.com` and `fonts.gstatic.com`, preserving representative typography. It rejects consent; sanitized request evidence records only hostname, resource type and allow/block action. Blocking prevents accidental telemetry during storage-failure work, but is **not proof that application code never attempts an external request**. Use the baseline's observed, unblocked request checks on guarded previews for that separate gate. No HAR, cookies, headers, request bodies, user storage or raw console trace is persisted.

Focused gates:

- Urgent/W01/W02/W03: seeded corrupt synthetic storage and a simulated throwing `window.localStorage` getter. Calculators must remain usable with sensible defaults, without page errors. This simulates browser storage unavailability; it does not change the operating system's privacy settings or test every browser's permission implementation.
- W01: loading corrupted saved data preserves current entries; save failure remains explicit and CSV still works. A 60-character unbroken name, a formula-leading name, and a name with quotes/comma are tested across 360/390/768/1280/1440 widths. An independently parsed actual downloaded CSV must preserve all three rows, exact totals/differences and escaped text, and neutralize the formula-leading name.
- W03: real date-input interactions produce monthly Jan-31 → leap-Feb-29 → Mar-31 dates, semimonthly 15/31 dates, and deduplicated 29/31 short-month dates. Reserve rows and final balance are asserted. A mismatched semimonthly date removes stale rows and shows an error.
- W04: a very large exact amount forces inner table overflow at 360px. Tab from the preceding frequency select must reach the named scroll region with visible focus; ArrowRight must change scroll position; the page must not overflow; Tab must leave the region for the download button. This supplements rather than replaces screen-reader/manual visual review.

Artifacts include `focused-report.json`, synthetic CSV downloads, screenshots and failure captures. Each gate records exact candidate identity, evidence or error, page errors and the bounded request observations. Exit code 1 means at least one gate failed. Artifacts are ignored by Git; curate useful sanitized evidence separately rather than committing all repeated full-page captures. Never reinterpret an old report as acceptance of a new SHA.

## Manual CI usage and limits

The repository's `.github/workflows/browser-acceptance.yml` provides a manual `workflow_dispatch` job with a fixed choice of the five candidate IDs, read-only contents permission, Node 24, pinned package installation, Chromium installation, all three runners, and 14-day artifact retention. Its `if: always()` artifact collection preserves failures. It accepts no arbitrary URL and has no production/deployment credentials or merge action. The workflow itself has not been executed merely because local commands pass; record its run URL and actual result if used. PDF Python rendering is a separate step and is not currently performed by this workflow.

Automated axe checks cannot certify accessibility. DOM focus indicators, keyboard behavior and screenshot dimensions do not replace visual judgment or assistive-technology testing. Network observations cover the exercised navigation/interactions and bounded wait window only. JavaScript-disabled sessions, screenshots, PDF extraction and browser downloads must each be assessed on their own evidence, not inferred from source code or a successful HTTP response.

## Guarded maintenance candidate

`security-candidate.json` records final PR #7 after the urgent prerequisite. It uses the `urgent` fixture ID because maintenance introduces no weekly feature. Run each runner with `QA_CANDIDATES=security-candidate.json` and separate output directories. The recorded exact SHA must still match Netlify before accepting consent. Its nine browser gates, two storage cases, native zoom and valid/invalid PDFs are additional maintenance evidence, not duplicate weekly features.
