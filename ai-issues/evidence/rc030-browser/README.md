# RC-030 selected browser evidence

Synthetic local review only; no personal data, authenticated browser or production telemetry. See the integration acceptance report for exact source identities, results, release HOLDs and manual boundaries. Full raw captures and intermediate failed runs remain in the isolated worktree's untracked artifacts directory.

- `final/`: W09–W16 main report with sanitized request traces, selected 390px screenshots, actual PDFs/text, downloads and PDF inspection report.
- `zoom/`: actual native 200% report and selected viewport captures.
- `focused/`: delayed hydration, parser, storage and keyboard/large-value checks.
- `preserved/`: urgent/W01–W04 regression reports and actual PDFs/downloads from source597166e; the final application delta only adds W12 table focus semantics.
- `protected/`: four delayed-hydration and three protected converter regressions on source597166e.
- `before/`: pre-implementation regional/root journeys. W11/W15 and W13/W14 before/after evidence is already tracked in their package evidence folders.
- `contrast/`: independent computed-color and exposed-state review of all 31 incomplete mobile axe nodes.
- `checks/`: final assembly unit/build/static/HTTP/audit logs.

`SHA256SUMS.json` authenticates the selected exact bytes. Folder attributes preserve real RFC5545 CRLF and all downloaded evidence bytes. A PDF is Chromium print output, not proof of an OS print-dialog or physical print test. A parsed ICS is not a certified third-party calendar import.
