# RC-002 — Search Evidence Snapshot: Six Months Through 2026-11-10

**Status:** VERIFIED DATA INPUT; supersedes stale "exports missing" statements in earlier plans.  
**Created:** 2026-11-12; owner supplied two local exports; DO NOT commit the raw files to this public repo.  
**Source files (private, owner upload):** `rentconverter.com-Performance-on-Search-2026-11-12(1).zip` (GSC Web/text, last six months); `rentconverter.com_SearchPerformanceOverview_All_11_13_2026(1).csv` (Bing).  
**Actual coverage:** GSC **2026-05-11…2026-11-10**, 184 dated rows; Bing **2026-05-13…2026-11-10**, 182 dated rows. Latest complete shared day Nov 10. All figures below computed from daily exported clicks/impressions, CTR = clicks/impressions. **GSC average position uses impression-weighted daily positions**; not a sitewide rank on a fixed query set. Bing export has no position, page or query breakdown.

## 1. Bottom line

**GOOGLE: sustained collapse / no recovery. BING: sustained actual search traffic.** Rebuild should improve renter utility and page quality, but this evidence justifies a more specific recovery investigation: inspect the end-May Google visibility step-change and why Bing continues to discover and refer renters. Neither this data nor the Nov 1 AdSense Low value content denial proves an organic Search manual action.

## 2. Comparable latest settled 28-day performance

| Metric | Prior 2026-09-16..2026-10-13 | Latest 2026-10-14..2026-11-10 | Difference |
| --- | ---: | ---: | ---: |
| Google Search clicks | 3 | 1 | −66.7% |
| Google Search impressions | 490 | 802 | +63.7% |
| Google Search CTR | 0.612% | 0.125% | −0.487 percentage points |
| Google average position | 40.53 | 37.11 | +3.42 positions numerically (query-mix sensitive) |
| Bing clicks | 260 | 222 | −14.6% |
| Bing impressions | 8,074 | 8,840 | +9.49% |
| Bing CTR | 3.220% | 2.511% | −0.709 percentage points |

**Last 14 days 2026-10-28..11-10:** Google 0 clicks/290 impressions, Bing 100/4420.  
**Last 7 days 2026-11-04..11-10:** Google 0 clicks/158 impressions, Bing 50/2151.

## 3. Monthly clicks (May/Nov partial months)

| Month | GSC clicks | GSC impressions | Bing clicks | Bing impressions |
| --- | ---: | ---: | ---: | ---: |
| 2026-05 (Google May 11–31, Bing May 13–31) | 95 | 26,390 | 67 | 2,067 |
| 2026-06 | 1 | 906 | 115 | 5,175 |
| 2026-07 | 4 | 1,340 | 163 | 7,052 |
| 2026-08 | 4 | 1,891 | 247 | 8,072 |
| 2026-09 | 4 | 535 | 278 | 8,681 |
| 2026-10 | 3 | 875 | 273 | 9,511 |
| 2026-11 (through Nov 10) | 0 | 216 | 71 | 3,144 |

Six-month totals: GSC **111 clicks/32,153 impressions**, CTR 0.345%; Bing **1,214 clicks/43,702 impressions**, CTR 2.778%. Different search providers, traffic and data models; **do not merge them or treat Bing CTR as an equivalent Google CTR**.

## 4. Structural break: May 31–June 1

- May 11–30 Google: **95 clicks, 26,123 impressions over 20 days** (~1,306 impressions/day; impression-weighted position ~14.53).
- May 31 Google: **0 clicks, 267 impressions**.
- June 1–Nov 10 Google: **16 clicks, 5,763 impressions over 163 days** (~35 impressions/day; impression-weighted position ~48.72).
- Approximate daily impressions decline **97.3%** from May 11–30 to June 1 onward. May 31–Jun 26: 27-day consecutive zero-click run; Oct 22–Nov 10: 20-day zero-click run.
- Official Google Search Status dashboard records a **May 2026 core update** starting **May 21** and completing **June 2**: https://status.search.google.com/incidents/wdAXJk6LRRihEjpzEeWE . The collapse falls within that rollout. **Correlation ≠ confirmed cause.** Do not assert specific ranking penalty or technical failure without further evidence.
- July 2026 changes to canonicals, redirects and static rendering occurred *after* this initial collapse. They cannot explain the May 31 onset, though their effects on subsequent discovery must still be assessed.

## 5. Query clusters from six-month GSC query CSV (historical, incomplete)

The query tab is top-1,000/truncated: only **6 query-attributed clicks and 8,380 impressions** vs site total 111/32,153. Google anonymizes or limits detailed query reporting; this is NOT complete query coverage. Query ranges are aggregated over the entire period and MUST NOT be called current rankings. Groups below are **overlapping** regex-oriented exploration, not mutually exclusive totals:

- PW/PCM/PCW terminology: 144 visible query rows, **2,358 impressions, 1 query-attributed click**, weighted rank ~15.9; `pcw to pcm` **616 imp, pos 2.02, 0 clicks**, `pcw meaning rent` 120 imp pos 11.67, `pw to pcm` 113 imp pos 6.45, `what is pw in uk rent` 99 imp pos 13.29, `pcm to pw` 47 imp pos 6.3. These are strongest *measured query* opportunities (subject to all-period distortion).
- Weekly/monthly and 4-week conversions: ~136 visible query rows, **1,390 impressions, 3 clicks**, avg ~35.4. Specific `rent per week to month` 93 imp pos39.47; `weekly to monthly rent calculator` 65 imp pos39.6; avoid chasing broad terms on current weak authority.
- Lease dates/due: ~29 rows, 146 visible impressions, 1 query-attributed click; `lease start and end dates calculator` pos 12.34/29 imp; `12 month lease date calculator` pos 8.88/16 imp.
- Income/affordability: ~161 rows, 588 impressions, 0 query-attributed clicks, weighted pos ~77.3 — *not a short-term Google SEO winner* despite being a high-value product functionality opportunity.
- Rent increase: ~41 rows, 238 impressions, 0 clicks, weighted pos ~61; rent split: ~34 rows, 146 impressions, 0 clicks, weighted pos ~68.
- Biweekly/fortnightly: ~8 explicit query rows/19 impressions, 0 clicks in visible 1,000; does NOT negate page-level historic traction. Data coverage limits are substantial.

**Caution:** Query `pcw to pcm` appearing at position ~2 with 616 historical impressions/0 clicks is a *research target*, not enough to declare a contemporary CTR defect or justify rewriting a winning page.

## 6. Historical top pages by GSC all-period clicks

These rows are from **May–November combined** and include pre-July canonical URLs that have since been redirected. They are not the latest-28-day page ranking data.

| URL/intent | All-period clicks | Impressions | Average position | Today’s likely URL status (verify redirect) |
| --- | ---: | ---: | ---: | --- |
| `/rent-per-paycheck-calculator` | 21 | 1507 | 10.35 | current canonical |
| `/lease-start-and-end-date-calculator` | 12 | 1381 | 10.01 | historical alias → `/lease-date-calculator` (verified in main `_redirects`) |
| `/biweekly-to-weekly-rent-converter` | 11 | 267 | 10.67 | protected canonical |
| `/12-month-lease-date-calculator` | 10 | 487 | 7.08 | historical alias → `/lease-date-calculator` (verify) |
| `/weekly-to-monthly-rent-uk` | 7 | 4591 | 11.50 | historical alias → `/pw-to-pcm-calculator` (verified in main `_redirects`) |
| `/rent-due-date-calculator` | 6 | 1007 | 13.96 | current canonical |
| `/lease-date-calculator` | 6 | 822 | 12.34 | current canonical |
| `/` | 5 | 7506 | 39.01 | homepage |
| `/weekly-to-monthly-rent-australia` | 5 | 3593 | 9.56 | current canonical |
| `/monthly-to-annual-rent-converter` | 3 | 311 | 13.97 | current canonical |

Other important historical rows: `/rent-increase-calculator` 2,227 impressions at pos ~11.15 but only 1 click; `/weekly-to-monthly-rent-converter` 1,585 impressions, 2 clicks pos ~11.92; `/pcm-rent-calculator` 796 imp, 2 clicks pos ~13.48 (retired alias). **Redirect destinations verified against the 112-rule `public/_redirects` on main:** `/lease-start-and-end-date-calculator` and `/12-month-lease-date-calculator` → `/lease-date-calculator`; `/weekly-to-monthly-rent-uk` and `/pcm-rent-calculator` → `/pw-to-pcm-calculator`; `/rent-per-paycheck-canada` → `/rent-per-paycheck-calculator`. **Do not reverse redirects solely from aggregate historical impressions.**

GSC pages aggregate **38,262 page-level impressions** vs **32,153 site-level impressions** because multiple page URLs may be credited for a search result; not an arithmetic error. Query tab totals are much lower due to detail limits.

## 7. Country / device, all-period only

- US **72 clicks /14,205 impressions**, UK **12/7,545**, Australia **10/5,836**, Canada **9/779**. These four regions contribute **103 of 111 Google clicks**, but much of activity may be pre-collapse.
- Mobile **65 clicks/13,870 imp**, desktop **45/18,130**, tablet **1/153**. Mobile CTR 0.47% vs desktop 0.25%, but these SIX-MONTH data should not be treated as a current device test.
- Bing CSV contains daily metrics ONLY; no Bing query, page, country, device or index status. Do not invent them.

## 8. Revised action priorities

**PRIORITY 0 — diagnose Google’s May discontinuity, not just weak CTR:** use May-May/June date-scoped GSC pages+queries/index coverage/canonical selection if readily accessible, plus historical deploy and route changes. Official status update alignment is suspicious but not proof. Ask owner for additional granular exports ONLY if the answer would materially change a high-risk route decision. Initial six-month daily data is already fresh and usable.

**PRIORITY 1 — implement genuine value on *proven product tasks*, not inventory:** monthly/weekly/4-week/UK/AU conversion, rent-per-paycheck planning, lease dates & rent due schedules. Near-term release candidate should improve one of these comprehensively while protecting calculator correctness and ranking winners.

**PRIORITY 2 — PW/PCM/PCW intent split:** distinguish glossary vs converter, address 52-week/365-day assumptions with sources and tests where appropriate, improve useful links. This is not a mandate to add a UK doorway page or change universal formulas.

**PRIORITY 3 — affordability/income and rent-increase/split:** desirable mature-product capabilities, but weak Google demand/position in measured query slice. Build as valuable workflows after stronger foundations; do not claim these are high-probability immediate SEO wins.

**PRIORITY 4 — Bing as baseline:** investigate why 222 Bing clicks persist in current 28d, protect route discoverability and useful interactions, test usability for existing audience. The 14.6% Bing click decline on latest 28d despite +9.5% impressions warrants monitoring, not panic.

**AdSense:** November 1 owner screenshot shows Low value content + ads.txt Not found; `public/ads.txt` exists in repository. Check apex and www HTTP 200/redirect and crawler access on production; current external fetch environment could not verify live response. Google: https://support.google.com/adsense/answer/7679060 ; status may take up to a month depending on ad requests. No main change or resubmission justified until proven fix and real product quality.

## 9. Implementation/code and quality acceptance updates

- Update `RC-001_IMMEDIATE_RECOVERY.md` and `RC-000_CODEX_MASTER_PROMPT.md` to refer to THIS file as new authoritative search baseline. Remove any old claim that owner exports are absent.
- Do not collapse data to an unweighted mean of daily positions; use impression weighting and label query-mix caveat.
- Protect the historical winners and validate all aliases at time of candidate implementation; keep record of old pre-July ranking URLs when reviewing effects of redirects.
- Never claim current top-10 rankings from six-month aggregated Pages or Queries tabs; export separate recent 28-day page/query tables only if needed for sensitive changes.
- Don't upload raw GSC/Bing exports to the public repo. Aggregate evidence is acceptable.
- The earlier planning branch PR is docs-only. Execution must produce separately testable implementation PRs, audited hosted previews, owner merge authorization, and actual user value. No forced weekly release.

## 10. Sources

- Original private GSC CSV ZIP and Bing daily CSV supplied by owner November 12, 2026 (saved only in conversation environment).
- Google Search Status official May 2026 core update: https://status.search.google.com/incidents/wdAXJk6LRRihEjpzEeWE
- Google site-value guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- AdSense ads.txt crawler guidance: https://support.google.com/adsense/answer/7679060
