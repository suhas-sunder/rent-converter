# RC-RELEASE-LEDGER — Canonical release state

## RC-030 continuation — W09–W16 implemented, HOLD for publication

The eight scoped features are implemented in draft PRs [#10](https://github.com/suhas-sunder/rent-converter/pull/10) through [#17](https://github.com/suhas-sunder/rent-converter/pull/17), all targeting staging. **None is authorized for production.** W05–W08 are not implemented/accepted, and immutable W09–W16 Netlify previews remain blocked by CLI authentication and the existing staging-preview configuration. Local acceptance does not close either release dependency.

[RC-030 integration acceptance](RC-030_INTEGRATION_ACCEPTANCE.md) is the current source of truth for W09–W16 exact heads, independent reviews, local browser/PDF/download evidence, limitations and rollback. The separate `codex/rc030-integration` branch is review-only; never merge the combined weeks into main. Earlier urgent/security/W01–W04 recommendations below remain scoped to their RC-028 evidence and are not expanded by this continuation.

**Last reviewed: November 13, 2026, RC-028 acceptance closure.** All candidates remain draft and unmerged. The following recommendations supersede earlier HOLD notes for the old SHAs. Owner approval has not been given and no production publication is authorized by this document.

## Current exact candidates

| Package | Branch | Exact tested commit | Immutable deployment | Tests | Decision |
| --- | --- | --- | --- | ---: | --- |
| [URGENT PR #2](https://github.com/suhas-sunder/rent-converter/pull/2) | `build/2026-W47-rentconverter-value-recovery` | `b69768dc8c8c66342786ba9f39eb958676637b80` | [preview](https://6af71c5e4823f67fc16818e6--rent-converter.netlify.app/) | 148 | **RELEASE FOR OWNER APPROVAL** — first |
| [W01 PR #3](https://github.com/suhas-sunder/rent-converter/pull/3) | `release/2027-W01-listing-comparison` | `e2a62955a58d30be90a646fd99a253ca2b30bde9` | [preview](https://6af71cdb73b3fcc994c158f0--rent-converter.netlify.app/) | 157 | **RELEASE FOR OWNER APPROVAL** — separate week after urgent |
| [W02 PR #4](https://github.com/suhas-sunder/rent-converter/pull/4) | `release/2027-W02-housing-budget` | `68bfad21aa48fb1425ac1a3ef695a37efc910d7c` | [preview](https://6af71d435cdb0c47031df3bd--rent-converter.netlify.app/rent-budget-calculator) | 156 | **RELEASE FOR OWNER APPROVAL** — separate week after urgent |
| [W03 PR #5](https://github.com/suhas-sunder/rent-converter/pull/5) | `release/2027-W03-paycheck-deadline` | `5af2d234cd9a06b938c01271c2a6b740afd150e5` | [preview](https://6af71ce2cd9d315c99efdcdc--rent-converter.netlify.app/rent-per-paycheck-calculator) | 160 | **RELEASE FOR OWNER APPROVAL** — separate week after urgent |
| [W04 PR #6](https://github.com/suhas-sunder/rent-converter/pull/6) | `release/2027-W04-calendar-export` | `2483d5fbde07f5ec0ab74596e252dfa5075e9123` | [preview](https://6af71cc278ec6b9561a53817--rent-converter.netlify.app/rent-schedule-calculator) | 158 | **RELEASE FOR OWNER APPROVAL** — separate week after urgent |
| [Security PR #7](https://github.com/suhas-sunder/rent-converter/pull/7) | `codex/rc028-security-maintenance` | `d6906eff00cc3efdbf1f833580a2fd96e8b9c53a` | [preview](https://6af7a3c1af5d128563435779--rent-converter.netlify.app) | 148 | **RELEASE FOR OWNER APPROVAL** — after urgent |

All five product previews match Netlify `commit_ref`, are READY deploy previews and pass all six local checks plus hosted HTTP audits (60 routes /112 redirects /60 link targets). Main suite **45/45 browser gates**, focused **11/11**, native zoom **5/5** with two physical widths each. Six actual PDFs, **18 pages**, were extracted/rendered and visually checked. Runtime request traces under both consent choices contain no analytics/ad providers. [Full acceptance evidence and artifact links](RC-028_BROWSER_ACCEPTANCE_EVIDENCE.md).

Security PR #7 now explicitly includes urgent as its prerequisite, without any weekly feature. Its final guarded preview passes 9 browser gates, 2 storage cases, native 200% zoom, actual valid/invalid PDFs, 4 delayed-hydration interactions and 3 protected converter regressions. Both consent states remain isolated. After urgent merges, the remaining application diff is the reviewed package/lock patch. Audit **11 → 0**, no major upgrades. [Security applicability](RC-028_SECURITY_MAINTENANCE.md). The earlier CLI-authentication failure was bypassed through the existing PR preview build; it is no longer a maintenance release blocker.

The [QA review PR #8](https://github.com/suhas-sunder/rent-converter/pull/8) targets `build/rc27-recovery`, not main. **HOLD FOR PRODUCTION / REVIEW ONLY**: never use it to publish all weeks together. Production source checkpoint `5aeeced6006d2536d31039d490591ec5bf06c47d`, tooling/review checkpoint `5bc6441f4eb568d6ca5c0bd32ea56410b4d5f5aa`. Later evidence-only commits do not alter that application source. Independent assembly matches all 223 production files, retains 25 unique test files and passes 186 tests. [Assembly report](RC-028_INTEGRATION_ACCEPTANCE.md).

## Implemented behavior

- **Urgent:** malformed money such as `1e3` shows errors instead of silently changing value; four-week explanations match calculation; preview analytics stay isolated. Browser-discovered repairs add honest disabled no-JS examples, native fallback links, visible keyboard outlines, adequate brand contrast and useful print output without an overlapping sticky header.
- **W01:** compare two/three listings with unlike periods and recurring extras, save/load/delete explicitly in browser storage, export CSV. No change to the primary converter's independent state.
- **W02:** optional take-home housing budget with independently timed bills, commitments and savings, now disabled until hydration. Existing gross-income comparison remains distinct.
- **W03:** reserve exact cents across actual paydays before a rent deadline. The table is a named, focusable scroll region; four-week summaries and shared large-money formatting are retained.
- **W04:** download date-only calendar events matching displayed schedule dates/amounts. Titles now explicitly say **Rent payment period starts**, preserving stable IDs, exact cents, folding and exclusions. Ordinary mobile amounts fit; extreme rows scroll by keyboard.
- **Security:** compatible React Router/Vite and transitive patches eliminate the reviewed registry findings without changing feature scope.

No new routes, indexation/sitemap expansion, canonical/schema changes, route retirements, paid-service changes, AdSense submissions or ad-placeholder lifecycle edits. Existing 60 canonical routes /112 redirects remain.

## Approval order and validation after future merges

1. Recommend **PR #2 first** because it corrects silent input reinterpretation and shared browser defects independently of future features.
2. Recommend **PR #7 separately next**, preserving urgent tests/guard. Its current guarded immutable preview passes hosted acceptance; do not revert to the older production-based snapshot.
3. Keep W01–W04 as independent scheduled weekly releases. Their current candidates pass; future main merges produce new SHAs and require a new build/full suite/hosted browser audit before publication.
4. Resolve package.json conflicts by retaining the union of registered tests exactly once, not by choosing either entire side. Retain the identical exact-money formatter shared by W03/W04. The independent assembly experiment found only test-command conflicts at W02/W03/W04.

Before approval, rollback is leaving a draft unmerged. After an owner-approved release, create a separate reviewed revert, retain shared fixes still needed by later packages, validate and request the owner's merge decision. Never reset main, force-push or automatically republish an old deploy. Reverting security restores known advisories and needs explicit reassessment.

## Remaining manual scope and honest limits

Native operating-system print dialogs, physical printing, actual screen-reader speech and calendar-app imports were not certified. The browser/PDF/network/keyboard/reflow tests are complete for the recorded synthetic cases, not every possible input or every canonical page's editorial quality. Nonblocking print polish (FAQ/footer-heavy pages, some page-break splits and printed utility labels) is recorded. No search recovery or AdSense approval is promised.

[Visual review](RC-028_VISUAL_REVIEW.md), [W03/W04/PDF/date focus review](RC-028_DATE_FOCUS_REVIEW.md), [manual axe warning review](RC-028_AXE_REVIEW.md). Earlier RC-027, hosted browser and package acceptance reports remain historical evidence for their explicitly listed commits; use this ledger and RC-028 for current status.

## Production and workspace preservation

Final remote main remains `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a`; Netlify current production deploy is still `6ad02cf4ac34d1b203b9b866` (READY). Original checkout remains clean at `131ae371aabf8c8b1871116edc3d5d09048ba965`. Work stayed in isolated worktrees. Task-generated logs, ignored browser artifacts and pre-existing line-ending-only `public/_redirects` state were preserved; no unrelated work was reset or discarded.

## Planning and prior business evidence

PLAN-2026-11 remains documented at `d1825c9cfdc523c72bd6eb4177fe2e6451bcb7b5`. W05–W08 and W17–W52 remain unimplemented roadmap work. W09–W16 now have actual scoped implementations on HOLD, as recorded above; no empty branch factory or fabricated shipped status.

AdSense screenshot dated 2026-11-01 reported Needs attention / Low value content and ads.txt Not found. This is not proof of a search manual penalty. The live HTTPS endpoint already returns the correct seller record; no ads.txt change was justified. Account refresh timing was not changed. Current ad code contains static reserves, not a filled-ad lifecycle whose suppression can be certified.

**Search evidence UPDATED 2026-11-12:** owner supplied six-month GSC and Bing exports. Verified new baseline in `ai-issues/RC-002_SEARCH_EVIDENCE_2026-11-12.md`: GSC latest settled Oct 14–Nov 10 **1 click / 802 impressions / 0.125% CTR**, prior Sep 16–Oct 13 **3 / 490 / 0.612%**; Bing **222 / 8,840** vs **260 / 8,074**. Current data ends Nov 10. Pre-May 31/June 1 Google visibility collapse roughly 97.3% impressions/day; Bing still productive. No current per-page 28d data supplied, so don't infer present page ranks from six-month aggregates.

## Existing scheduling limitation

A recurring Saturday review task was requested through the ChatGPT automations service but creation failed because the account already has five active tasks (plan limit five). No task was created. Owner can free a slot or move the release gate to an existing appropriate automation only with explicit authorization. Until then, use manual scheduled review; do not claim automation exists.
