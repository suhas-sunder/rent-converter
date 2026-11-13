# RC-028 independent final-source assembly verification

**Checked:** November 13, 2026. **Reviewer:** `research_audit`, independently of the release steward's integration assembly. **Result:** source equivalence PASS; this document does not authorize a combined production release.

## Exact input commits and tested assembly

| Sequence | Branch/package | Frozen input commit |
| --- | --- | --- |
| Base | Urgent | `b69768dc8c8c66342786ba9f39eb958676637b80` |
| 1 | W01 listing comparison | `e2a62955a58d30be90a646fd99a253ca2b30bde9` |
| 2 | W02 housing budget | `68bfad21aa48fb1425ac1a3ef695a37efc910d7c` |
| 3 | W03 paycheck deadline | `5af2d234cd9a06b938c01271c2a6b740afd150e5` |
| 4 | W04 calendar export | `2483d5fbde07f5ec0ab74596e252dfa5075e9123` |
| 5 | Independent security maintenance | `8c116e5d40519115ba830b7cb22d152f6f2de5d2` |

Package owners confirmed these frozen heads. The acceptance worktree's application-source checkpoint is `5aeeced6006d2536d31039d490591ec5bf06c47d`. Its local static build is served at `http://localhost:3029`; that URL is local assembled evidence, not an immutable preview or a production deployment.

## Actual sequential merge experiment

The [reproducer](evidence/rc028-integration/assemble.mjs) ran Git's actual three-way `merge-tree --write-tree --messages --name-only` operations in the order above. It created unreferenced commit objects solely to preserve each prior merge's ancestry for the next merge. It did not advance any release branch, main, or HEAD, and did not modify application files. A disposable `GIT_INDEX_FILE` was used only to replace the conflicted package blob and removed afterward; the working tree's real index was untouched.

| Incoming package | Actual conflict | Resolution |
| --- | --- | --- |
| W01 | None | Automatic Git merge |
| W02 | `package.json` only | Preserve unique union of test paths |
| W03 | `package.json` only | Preserve unique union of test paths |
| W04 | `package.json` only | Preserve unique union of test paths |
| Security maintenance | None | Automatic Git merge, retaining patched dependency graph |

For each package conflict, the reproducer parsed both sides, removed only `scripts.test` for comparison, and asserted **all other package fields were identical** before constructing the sorted test union. It did not choose an entire side, discard another feature's tests or assume a merge succeeded merely because files looked similar. The final command registers **25 test files exactly once**. Their complete list, raw merge output, intermediate trees and parent commits are in [assembly-report.json](evidence/rc028-integration/assembly-report.json).

Final independently assembled full tree: `6ed19ae34ecad1993b20bedd375bba7ff2c09e93`. This is a Git **tree**, not a release commit or published deployment; documentation differences from the acceptance branch are expected because this experiment assembled release branch histories independently.

## Source equivalence

Compared **223 production files** from the resulting tree with the actual acceptance working source:

- All files under `app/` and `public/`.
- All application scripts under `scripts/`, explicitly excluding the new `scripts/browser-qa/` test harness.
- `package.json`, `package-lock.json`, Netlify, React Router, Vite and TypeScript configuration.

Every expected file exists and its Git blob hash matches after applying repository attributes, so Windows line endings do not create false differences. A filesystem walk also found **zero extra production files**. `package.json` was additionally parsed and compared as a complete object; dependency ranges and the exact registered test union match. The unchanged shared exact-money formatter, final W04 event wording, W03 accessibility repair, W02 hydration wrapper, common fallback/focus/print changes and security lock therefore all survive together in the tested source.

**Result: zero missing, changed or extra production files.** Browser harness and documentation are deliberately outside this equivalence claim; they do not become production changes by being present in the acceptance branch.

## Validation attribution

The release steward ran the assembled full suite; this independent reviewer inspected `qa-assembled-*.log` in the acceptance worktree:

| Check | Recorded assembled result |
| --- | --- |
| Typecheck | Full typegen/TypeScript pass |
| Tests | **186/186**, zero failures/skips |
| Production build | 60 prerendered pages, 112 redirects, real 404, no runtime server bundle |
| Redirect validation | 112 pass |
| Breadcrumb validation | 60 routes, 215 JSON-LD scripts, 59 BreadcrumbList objects, zero failures |
| Release HTTP audit | 60 HTTP-200 routes, 112 redirects, 60 direct internal-link targets |

These are inspected execution logs, not a claim that the reviewer reran those six commands. The independent source proof establishes that the assembled production inputs match the release-head union. Future source changes or a new build environment require renewed validation.

The reviewer separately implemented and executed `scripts/browser-qa/focused.mjs` against the local assembled static server. **11/11 focused browser gates passed:** corrupt/unavailable synthetic storage on urgent/W01/W02/W03; W01 long labels at five widths and a real downloaded CSV with independent parsing/escaping/formula checks; W03 monthly/leap/semimonthly/coincident-month-end reserves and stale-result removal; W04 real Tab navigation, visible focus, ArrowRight scrolling and Tab exit for an extreme amount at 360px. The local report explicitly records no served commit SHA and retains configured candidate SHAs only as references.

The same focused suite then passed **11/11 gates on the five final immutable previews**, matching the urgent/W01/W02/W03/W04 commits listed above. The final run began at `2026-11-13T14:26:51.724Z` using Chromium `145.0.7632.6` and Node `v25.9.0`. [focused-summary.json](evidence/rc028-integration/focused-summary.json) preserves both runs' exact origins, candidate identities, individual assertions and aggregated sanitized network observations. Full synthetic downloads and screenshots remain in the ignored `scripts/browser-qa/artifacts/focused-final/` directory; the compact evidence does not claim that every screenshot received manual visual review. A separate invalid-production configuration was rejected before browser launch, confirming the focused runner's origin guard without navigating production.

Focused contexts reject analytics and block off-origin requests except read-only Google Fonts CSS/font GETs, preserving typography while preventing unintended provider traffic. Consequently these tests are **not** the unblocked runtime-network acceptance gate. Baseline browser/PDF/axe/network results and exact final hosted candidate results belong to the release steward's browser acceptance report; do not infer them from the assembly experiment.

## Release order and remaining owner gate

This experiment validates compatibility, not an instruction to merge all features together. Review urgent separately first, then each weekly package independently in its intended release order. Security maintenance remains a separate PR and is not a prerequisite of urgent. After owner-approved merges, rebuild the next assembled candidate from the then-current main, preserve every test registration and repeat the relevant full/browser gates at that new SHA.

No main push, merge, production deployment, paid-service change or AdSense submission occurred in this review. Reversible rollback before approval is to leave the drafts unmerged. A later rollback requires a reviewed revert and renewed dependency/acceptance checks; do not reset main or silently restore vulnerable dependency versions.
