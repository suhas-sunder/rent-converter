# W16 — compare the cost of annual increase scenarios

Status: IMPLEMENTED, HOLD for final combined browser evidence and hosted preview. Base: `ea76372657068902c21e013eb8be9515212140e8`; branch `codex/w16-increase-scenarios`. Final integration ledger records exact candidate SHA.

## User task and product contract

Compare how much monthly rent is paid over a whole-number horizon under two constant annual rates. The existing compound calculator already showed the rent after N changes. It did not show the cash paid before those changes or compare with a second rate. Keep the original monthly input, percentage range0–100,1–100 year horizon, default values, per-step cent rounding and final-rent output.

The optional comparison uses twelve payments at starting rent in year1; its first increase happens after that year. It compares another annual rate (default0, unchanged rent), sums each year's payments exactly and provides an itemized CSV. At $2,000,10%,2years: payments total$50,400 versus$48,000 unchanged. The $2,420 monthly rate starts after the two-year payment horizon. Final weekly equivalents use monthly×84÷365 and are explicitly not weekly bills. Signed differences are primary minus comparison. No permitted-rate, eligibility, CPI or legal determination is made.

Route family decision: **improve** `/compound-rent-increase-calculator`; retain forward/reverse increase routes, aliases and indexation. Existing related sections remain. One FAQ limitation became directly false when cumulative-payment comparison was added, so only that clause and its matching visible/schema data were repaired. No other FAQ cleanup.

## Baseline and usefulness

Actual browser baseline journeys changed starting rent,rate andyears, inspected final rent and attempted to compare total payments. The baseline exposed only year-by-year monthly/annualized rates. Calculator Academy's compound-rent calculator already offers total rent paid and multiple solver modes (https://calculator.academy/compound-rent-calculator/, browser inspected November13,2026). This candidate's useful addition is a restrained, optional two-rate comparison with exact reconciliation and an explicit payment horizon, not a claim that compound arithmetic is novel.

## Validation and review

- Clean npmci,audit0,typecheck,192tests,productionbuild60/112,redirects,breadcrumbs215scripts/59lists and releaseaudit passed before final visual polish. Final repaired snapshot results live in integration ledger.
- Six new tests independently check timing,$50,400/$48,000,negative differences,zero rates/rent,half-cent annual steps,100years at100%,exact amounts beyond Number precision,rejected inputs and CSV reconciliation. Existing consolidation test now checks the new truthful scope rather than requiring obsolete copy that denied cumulative totals.
- Full initial local browser run passed9gates: fivewidths,noJS,accepted/rejected network,keyboard,axe,live results,PDFcapture,invalidinput andactualCSV. PDF extraction/render confirmed expected amounts and no out-of-page words. Visual inspection then found awkward mobile wrapping inside the new table; numeric cells now retain complete amounts with a named keyboard-scroll region and visible instruction. Revalidate that repair.
- Independent regional worker checked actual360px interaction,comparison20%negative difference,invalid1e3,extreme9trillion/100%/100years and13-pagePDF containing complete huge amounts. No arithmetic blocker. Adopted its suggestion to explicitly label signed differences.

Source files: increaseComparison helper, IncreaseCostComparison component, compound renderer integration, narrow supporting-copy/FAQ correction, tests and package registration. No new dependency, localStorage key, route, canonical, redirect, sitemap or ad-system change.

## Limits, dependency and rollback

W05–W08 have no accepted implementation; hosted preview and publication remain HOLD. The current branch is scoped against the accepted W01–W04 development assembly, not directly ready to merge into production. Long horizons can create long PDFs; CSV retains complete exact values. Native print dialogs and actual screen-reader speech are not certified. Assumes complete years of monthly payments, no partial-year or irregular-rate cashflows.

Rollback before publication: leave draft unmerged. A later approved release must be independently assembled against current main and revalidated; rollback by a reviewed scoped revert, preserving earlier features and dependency fixes. No main push,merge,productiondeploy,paidservice orAdSense change.

## Integration followthrough (review assembly only)

See [RC-030 final acceptance](RC-030_INTEGRATION_ACCEPTANCE.md) for the exact final feature head, assembled-source identity, repaired findings and final local browser/PDF/download evidence. That report supersedes pending-local-integration notes above, but does not close immutable-hosted-preview or W05–W08 publication dependencies. This package remains HOLD for publication.
