# Release integration review — 2026-11-13

**Automated integration checks PASS; hosted and release-owner acceptance HOLD.** This review assembled the four separately based release changes in an isolated Git index without merging, rebasing, committing or pushing any real branch. The aggregate application was tested locally. This is an integration review, not independent authorship review of every feature: the reviewer previously contributed W01 and the route inventory.

## Candidate identity and assembly result

Common urgent base: `f344ad29766bb63e185515ed08277a8ac9085247`. Release order:

| Stage | Reviewed release commit | Sequential conflict | Registered test files |
| --- | --- | --- | --- |
| W01 listing comparison | `62e5e6c` | None | 22 |
| W02 housing budget | `f0320ba` | `package.json` only | 23 |
| W03 paycheck deadline | `3c36fa8` | `package.json` only | 24 |
| W04 calendar export | `a7b1d1e` | `package.json` only | 25 |

All six pairwise `git merge-tree` checks also reported only `package.json` conflicts. The sequential simulation applied each base-to-release binary patch with `git apply --3way --cached` using a task-specific `GIT_INDEX_FILE`. It resolved the test command by retaining the union of all registered test paths, each exactly once. No branch refs, real worktree index or application files were changed by this simulation. [Assembly evidence](evidence/integration/assembly.json) records the stages and [resolved package.json](evidence/integration/resolved-package.json) contains the exact combined test command.

The resulting Git tree was `edafde2d0389b6cef5d82252aa6b98eaf802ae8e`. A CRLF-normalized comparison of 209 application, script, public and configuration text files against the aggregate found **zero differences**. [Source manifest](evidence/integration/source-manifest.json) records hashes and coverage. This comparison predates the later mobile table repair described below: the original four committed candidates do not contain that repair.

W03 and W04 contain identical changes to `app/client/utils/rentMath.ts` and `scripts/money-input.test.mjs`; preserve those changes once. The formatter keeps exact BigInt cents, including amounts beyond Number precision and negative sub-unit amounts. W02 and W04 changes to `app/client/components/generated/GeneratedPages.tsx` merge cleanly; both the housing-budget integration and schedule export/date validation must survive assembly.

## Reproduced checks

The initial complete aggregate run executed sequentially after a clean dependency install. Every command exited zero; [timestamps and statuses](evidence/integration/checks.json) and individual logs are retained beside this document.

| Command | Observed result |
| --- | --- |
| `npm ci` | Completed; dependency lockfile unchanged |
| `npm run typecheck` | Passed |
| `npm test` | 185 passed, zero failures or skips |
| `npm run build` | 60 flat prerendered canonical HTML pages, 112 redirects, real 404, no runtime server bundle |
| `npm run validate:redirects` | 112 redirects verified |
| `npm run validate:breadcrumbs` | Zero failures |
| `npm run release:audit` | 60 HTTP-200 canonical routes, 112 redirects and 60 unique internal links; passed |

Two setup failures are retained rather than concealed: an initial PowerShell argument invocation produced npm usage output; the corrected clean install then encountered an EPERM lock on the native Lightning CSS DLL. The exact task-owned aggregate Vite process on port 5174 was identified and stopped, after which `npm ci` and the complete checks passed. The Vite process remains stopped; the static server on port 3013 was not stopped. See `invocation-error.log` and `ci-locked.log`.

## Subsequent mobile defect and repair

An independent hosted review found W04's 360-pixel schedule table clipped amount cents inside an `overflow-hidden` wrapper. Document-level overflow checks had missed this. The finding is valid and supersedes the earlier broad mobile acceptance.

A minimal matching repair is now uncommitted in the isolated W04 and aggregate `GeneratedPages.tsx`. Only the schedule supplies a new optional `tableLabel`, enabling compact mobile cell padding, horizontal scrolling, a labeled keyboard-focusable region and an inset focus ring. All other result panel styling and all calculation/export data remain unchanged. W02 aggregate edits were preserved.

After that repair, W04's six full checks passed again with 157 tests. The aggregate's typecheck, 185-test suite and build were rerun; evidence is recorded in [post-repair check results](evidence/integration/post-mobile-checks.json). Earlier redirect/breadcrumb/release-audit results apply to the unchanged routing and metadata; the new build also runs the static output audit. No new source-pattern test was added for a visual CSS repair. Hosted recapture and actual keyboard scrolling remain owner gates.

### Subsequent staged repair identity

The release steward committed the scoped repair as 155b2a8247449e9523e0e950155338acf573e6c1 on W04 after the checks above. Netlify preview 6af69d4ceab11ecb5c38ff5b is ready at that exact SHA. The final hosted HTTP audit passed; real browser recapture at all five widths confirmed ordinary amounts fit, and keyboard horizontal scrolling revealed all digits of an extreme amount. See RC-HOSTED_BROWSER_ACCEPTANCE.md and the visual addendum. Earlier references to an uncommitted repair describe this review's original timestamp, not the final staged state. The original simulated assembly tree is intentionally preserved as evidence for its listed commits; the aggregate's post-repair 185-test/build run includes the repair.

## Manual assembly and validation instructions

1. Use an isolated integration branch based on the common urgent candidate, then integrate W01, W02, W03 and W04 in that order. This report does not authorize merging main or deployment.
2. Resolve only the observed test-command conflicts by union, preserving every base test and `listing-comparison.test.mjs`, `housing-budget.test.mjs`, `paycheck-deadline.test.mjs` and `rent-calendar-export.test.mjs`. Do not choose an entire side of `package.json`: doing so loses test registrations. No dependency or lockfile changes are required by these features.
3. Keep the identical exact-money formatter and regression changes once. Verify both W02 and W04 behaviors remain in `GeneratedPages.tsx`. If branch tips advance, repeat the conflict and source comparison; the recorded tree is evidence for the listed commits only.
4. Include the reviewed mobile schedule repair from W04's subsequent candidate before considering W04 accepted. It is currently uncommitted and absent from `a7b1d1e`; do not silently substitute a newer SHA in this report.
5. Run `npm ci`, typecheck, test, build, redirect validation, breadcrumb validation and release audit on the actual assembled candidate. Expect 25 registered test files and 185 passing tests for the present source. Capture immutable hosted candidate identity and rerun the feature flows on that exact candidate.
6. At 360 pixels, confirm a three-payment monthly schedule for 1,800.25 shows complete dates and cents without scrolling. For a very large accepted rent, focus the table and verify horizontal keyboard scrolling reveals all digits. Recheck 390, 768, 1280 and 1440 widths, downloads, invalid inputs, primary converters and protected PCM behavior.

Rollback should use the pre-integration branch/deploy checkpoint or a reviewed revert of the affected feature, not a reset of unrelated work. Restore test registrations consistently when reverting; do not drop the shared formatter while another integrated feature still depends on its precision behavior. No destructive rollback was performed here.

## Remaining concerns and gates

- **Dependency risk remains:** `npm audit` reports 11 vulnerabilities (3 moderate, 7 high, 1 critical), the same counts and affected package names as the saved baseline; no new dependency packages were introduced. [Audit output](evidence/integration/npm-audit.json) preserves the findings. These require a separate reviewed dependency remediation, not an unreviewed `npm audit fix`. Passing application tests does not resolve advisories.
- **Hosted/mobile HOLD:** the repaired candidate needs recapture and interaction verification; earlier screenshots cannot prove the new layout. This review did not perform hosted browser testing.
- **Print/PDF and JavaScript-off HOLD:** source-level guards and tests are not completed native browser acceptance. Carry forward each weekly acceptance document's remaining gates, including actual calendar import and keyboard/screen-reader checks where unverified.
- The original committed combination had no additional merge-related application defect identified. The mobile clipping defect was repaired locally but remains awaiting hosted confirmation. No route, indexation, sitemap, metadata or ad-policy change was introduced by the repair.

## Working tree and staging scope

This pass created this document and `ai-issues/evidence/integration/`, and later changed only the scoped schedule table code in the aggregate application. W04 also has its matching code change, acceptance update and `ai-issues/evidence/w04/mobile-repair/` evidence. All pre-existing aggregate changes remain uncommitted and untouched by assembly. Do not stage the temporary index under `qa-evidence/`, generated build output, unrelated aggregate files or incidental root logs. Review any generated `public/_redirects` line-ending-only status separately. No commit, push, real branch merge or deployment was performed during this integration review or mobile repair.
