# RC-RELEASE-LEDGER — Canonical 2026/2027 weekly release state

**Last initialized:** 2026-11-12. This ledger records ACTUAL evidence only. Never mark ACCEPTED or SHIPPED merely because a feature exists in a plan.

| Package | Current status | Branch / exact tested SHA | Preview and tests | Owner / production |
| --- | --- | --- | --- | --- |
| PLAN-2026-11 | DOCUMENTED / DRAFT PR | `planning/2026-11-2027-rebuild` @ `e02561a9f8fcd985adec31506801bccce25e68de` | Docs only; no application change, production validation not claimed | Pending review, no main push |
| RC-001 immediate recovery | NOT STARTED | Proposed `build/2026-W47-rentconverter-value-recovery`; branch not created until implementation | No tests/previews yet | No main change |
| 2027 W01 | NOT STARTED | None | None | Not shipped |
| 2027 W02 | NOT STARTED | None | None | Not shipped |
| 2027 W03 | NOT STARTED | None | None | Not shipped |
| 2027 W04 | NOT STARTED | None | None | Not shipped |
| 2027 W05–W52 | ROADMAP ONLY | No empty branch factory | Acceptance & scope only when work exists | Not shipped |

**Current production evidence:** Netlify project rent-converter deployed `main` commit `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a` on 2026-10-15 (deployed, ready). 60 canonical routes/112 aliases per source README. Current baseline should be independently re-verified in upcoming package.

**AdSense evidence:** Screenshot dated 2026-11-01: Needs attention / Low value content; ads.txt Not found. This is NOT a search penalty proof. `public/ads.txt` exists in repo; production status and Google recrawl still need independent verification.

**Search evidence UPDATED 2026-11-12:** owner supplied six-month GSC and Bing exports. Verified new baseline in `ai-issues/RC-002_SEARCH_EVIDENCE_2026-11-12.md`: GSC latest settled Oct 14–Nov 10 **1 click / 802 impressions / 0.125% CTR**, prior Sep 16–Oct 13 **3 / 490 / 0.612%**; Bing **222 / 8,840** vs **260 / 8,074**. Current data ends Nov 10. Pre-May 31/June 1 Google visibility collapse roughly 97.3% impressions/day; Bing still productive. No current per-page 28d data supplied, so don't infer present page ranks from six-month aggregates.

## Rule for every update

For each real weekly release add exact branch and SHA, date built, source main SHA, number of changed pages, exact implementation, human review notes, unit/build/redirect/canonical/JS-noJS/mobile/AdSense preview isolation acceptance, immutable preview URL, independent reviewer, owner approved date, merge SHA (if any), Netlify deploy ID (if any), post-deploy smoke + rollback. A branch name alone is NOT proof of readiness.

## Blocked scheduling note

A recurring Saturday review task was requested through the ChatGPT automations service but creation failed because the account already has five active tasks (plan limit five). No task was created. Owner can free a slot or move the release gate to an existing appropriate automation only with explicit authorization. Until then, use manual scheduled review; do not claim automation exists.
