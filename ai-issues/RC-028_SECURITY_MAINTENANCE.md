# RC-028 dependency security maintenance

Reviewed November 13, 2026. Separate branch `codex/rc028-security-maintenance`. The original maintenance checkpoint `8c116e5d40519115ba830b7cb22d152f6f2de5d2` started from production `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a`; the current branch merges frozen urgent `b69768dc8c8c66342786ba9f39eb958676637b80` as an explicit prerequisite. **HOLD for exact-preview browser acceptance and owner approval.** No production deployment or main change is authorized by this report.

## Result and scope

The fresh registry audit reproduced **11 affected-package findings: 1 critical, 7 high, 3 moderate**. Compatible dependency updates reduce the audit to **zero reported findings**. This is the registry's known-advisory result at the review time, not proof of universal security. Three React Router entries represent one inherited advisory chain rather than three independent attack paths.

Relative to the frozen urgent prerequisite, only `package.json` and `package-lock.json` change application inputs. The maintenance patch adds no application source, calculator logic, route, sitemap, ad lifecycle, consent policy, paid service or product feature changes. Urgent's 21-file test registration is preserved exactly; no weekly feature is included. React, React DOM, Tailwind and PostHog versions remain unchanged. There are no major-version upgrades or dependency overrides, and neither `--force` nor `--legacy-peer-deps` was used.

| Package | Previous lock | Updated lock | Purpose / compatibility |
| --- | --- | --- | --- |
| React Router, `@react-router/dev`, `@react-router/node` | 7.18.1 | 7.18.5 | Matching patched 7.18 packages; direct minimum becomes ^7.18.2 |
| Vite | 6.4.3 | 6.4.6 | Patched 6.4 line; direct minimum becomes ^6.4.6 |
| DOMPurify | 3.4.12 | 3.4.17 | Within unchanged PostHog 1.400.1's ^3.3.2 dependency |
| fflate | 0.4.8 | 0.4.9 | Within unchanged PostHog's ^0.4.8 dependency |
| Browserslist | 4.28.6 | 4.29.5 | Compatible Babel build dependency |
| baseline-browser-mapping | 2.10.43 | 2.11.37 | Compatible Browserslist dependency |
| PostCSS | 8.5.19 | 8.5.32 | Compatible Vite dependency |
| nanoid | 3.3.16 | 3.3.20 | Compatible PostCSS dependency |
| source-map-js | 1.2.1 | 1.2.2 | Compatible PostCSS/Tailwind dependency |

The lock also refreshes four Browserslist support/data packages (`caniuse-lite`, `electron-to-chromium`, `node-releases`, `update-browserslist-db`) and fills six optional wasm-platform dependency records under the already locked Tailwind oxide package. These are resolution side effects, not additional runtime features. The original lockfile package name is preserved.

## Applicability and source review

Application applicability below is an inference from actual configuration, installed dependency call sites and the maintainers' stated prerequisites. No exploit was attempted.

- **Vite / development:** The maintainer identifies a Windows editor-path bypass and associated shell/argument issues, with Vite 6.4.4 as a patched baseline. This matters to this Windows development workspace. Additional current Vite findings concern dev middleware and filesystem-serving boundaries. Netlify serves only `build/client`; the build removes its server bundle, so Vite's development endpoints are not a production service here. The selected 6.4.6 stays in the existing major and clears all current Vite findings. [Maintainer advisory](https://github.com/vitejs/launch-editor/security/advisories/GHSA-587h-7wmj-h5pm), [6.4.6 release](https://github.com/vitejs/vite/releases/tag/v6.4.6).
- **React Router / affected mode not configured:** The maintainer limits this CSRF issue to unstable RSC APIs. This app uses `ssr: false`, `prerender: true`, no RSC server action path identified, and static Netlify output. No production CSRF exposure was demonstrated. Updating all three matching packages avoids retaining the vulnerable dependency versions without adding an RSC runtime. [Maintainer advisory](https://github.com/remix-run/react-router/security/advisories/GHSA-qwww-vcr4-c8h2), [7.18.5 release](https://github.com/remix-run/react-router/releases/tag/react-router@7.18.5).
- **DOMPurify / runtime dependency, affected path not identified:** It is imported by PostHog product-tour utilities, not merely a build dependency. The site's provider disables product tours, surveys, web experiments and external dependency loading. The inspected tour sanitization call accepts HTML text with ADD_TAGS/ADD_ATTR; it does not set SAFE_FOR_TEMPLATES, IN_PLACE or a DOM-return mode. The critical advisory requires non-default template/DOM modes, attached shadow-root input and downstream template evaluation. Those prerequisites were not identified here; this does not erase the critical package finding. Updating within PostHog's supported range removes it and the related IN_PLACE/XML advisories. [Maintainer critical advisory](https://github.com/cure53/DOMPurify/security/advisories/GHSA-cg2g-xh64-v4q7).
- **fflate / runtime dependency, affected operation not identified:** PostHog's inspected request implementation calls `gzipSync` for outbound compression. The flaw is malformed ZIP64 input during ZIP extraction; no user ZIP import or `unzipSync` application path was found. The compatible 0.4.9 patch removes the finding without changing the PostHog package. [Maintainer fix](https://github.com/101arrowz/fflate/commit/e6d5e6e1076892f72770ac732d83c81da9f3316e).
- **Browserslist, baseline-browser-mapping, PostCSS, nanoid and source-map-js / build-time exposure:** Installed chains run through Babel, Vite, PostCSS and Tailwind. Public calculator inputs are not supplied as browser-target queries, custom stats, source maps or generator sizes. Malicious build inputs remain a development/CI concern; no equivalent public calculator request path was identified. Compatible updates clear the findings. [Browserslist maintainer advisory](https://github.com/browserslist/browserslist/security/advisories/GHSA-c83g-rgw3-j3cx), [PostCSS maintainer advisory](https://github.com/postcss/postcss/security/advisories/GHSA-fxqj-rqcc-2cmp), [nanoid maintainer patch](https://github.com/ai/nanoid/commit/e10f8d40ce9d1ab47f66d65a16b48086432730d0). Exact registry advisory IDs/ranges for every package are retained in the evidence summary.

## Original checkpoint validation (historical 8c116e5)

Executed with Node **25.9.0**, npm **10.9.0**, Windows PowerShell. `npm ci` completed successfully from the final resolved graph. At that original checkpoint the branch retained the production test set and urgent/weekly additions were absent. These 137-test results remain historical; current merged validation is recorded below.

| Check | Actual result |
| --- | --- |
| `npm ci` | Pass; clean installed graph; zero audit findings |
| `npm run typecheck` | Pass, full React Router typegen and TypeScript |
| `npm test` | **137/137**, no skipped or failed tests |
| `npm run build` | Pass; 60 prerendered pages, 112 redirects, real 404, no runtime server bundle |
| `npm run validate:redirects` | Pass, 112 static redirects |
| `npm run validate:breadcrumbs` | Pass, 60 routes / 215 JSON-LD scripts / 59 BreadcrumbList objects / zero failures |
| `npm run release:audit` | Pass, 60 HTTP-200 routes / 112 redirects / 60 direct internal-link targets |
| `npm audit --json` | Pass, zero findings across the resolved lock |
| `npm ls` on affected packages | Valid matching graph; no invalid peer resolution reported |
| `git diff --check` | Pass |

[Recorded command results](evidence/security/checks.json) preserve exit codes/timestamps. [Audit summary](evidence/security/audit-summary.json) preserves before/after counts and advisory identifiers. Full local logs remain in the worktree as `qa-*.log`; these are not production files.

The initial lock-only resolver attempts failed with React Router peer conflicts because the existing lock held the three tightly coupled packages at 7.18.1. Removed only those three stale resolution entries, retained the rest of the lock, and let npm regenerate their compatible matched graph. A subsequent ordinary `npm audit fix --package-lock-only` patched remaining compatible transitives. No forced resolution, peer-check bypass or whole-lock replacement was used. A pinned npm 11 diagnostic attempt also failed and made no successful resolution; the final install/validation used npm 10.9.0.

## Current guarded maintenance validation

The merged candidate passed all six required checks on November 13, 2026: typecheck; **148/148 tests**, zero skips/failures; build with 60 static pages, 112 redirects and no server bundle; 112 redirect checks; 60-route/215-JSON-LD/59-BreadcrumbList validation; and local HTTP release audit of 60 routes, 112 redirects and 60 internal-link targets. A fresh full `npm audit --json` returned **zero findings**. [Guarded validation evidence](evidence/security/guarded-checks.json) records exact parent commits, command timestamps and exit codes. This supersedes the original 137-test validation for the new merged candidate, while retaining that historical record.

## Preview and release conditions

The current branch now includes frozen urgent PR #2 as an explicit prerequisite, including its exact-production-origin analytics guard. This corrects the original maintenance preview limitation without adding weekly features. The original `8c116e5` preview remains historical and must not be substituted for the new merged SHA. Urgent must be reviewed and merged first; after that prerequisite is present on main, PR #7's application diff is dependency-only. This does not make maintenance a prerequisite of urgent.

The normal merge completed without conflicts. The security lock is byte-for-byte unchanged from `8c116e5`; all application/public/script/config files match frozen urgent, and package test registration retains exactly its 21 unique paths. The pre-existing generated `public/_redirects` worktree status was verified to have the same Git blob as HEAD, and earlier audit logs were preserved. No manual application edits were made during this merge.

Exact immutable preview and hosted HTTP results are recorded in the PR/release ledger once the new draft build finishes. Browser, PDF, no-JavaScript and final owner approval remain pending until the browser steward records actual results at that exact SHA. The PR stays a draft and main/production remain untouched.

Rollback before publication: keep the draft unmerged. After a separately authorized merge, use a reviewed revert of the maintenance package/lock changes and rerun the full suite; reverting restores vulnerable versions, so reassess exposure rather than silently treating rollback as a security solution. No automatic main reset, production deploy or paid-service change.
