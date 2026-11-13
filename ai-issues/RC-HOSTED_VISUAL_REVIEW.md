# Hosted screenshot visual review

**Latest disposition:** the initial W04 360px P2 is fixed in the repaired deployment reviewed in the addendum below. The original findings and screenshots remain as before-fix evidence. W03's inner-scrollbar P3 remains open.

Reviewed 2026-11-13 by the `paycheck_feature` agent. All **25** supplied JPEGs were individually opened with `tools.view_image`: urgent, W01, W02, W03 and W04 at filename-labelled widths 360, 390, 768, 1280 and 1440. Byte-identical copies are stored in `ai-issues/evidence/hosted/`. Root captured the hosted browser states; this reviewer did not operate a browser in this pass.

The reviewer did not implement W01/W02 or the urgent parser fix. The reviewer **did implement W03/W04**, so observations for those features are a separate visual inspection but **not independent-of-author acceptance**. No code or commit was changed in this pass.

## Findings

| Priority | Evidence | Finding and disposition |
| --- | --- | --- |
| P2 | [W04 360](evidence/hosted/hosted-w04-360.jpg) | The payment table's right-hand column is horizontally clipped inside the result card: the Amount heading is truncated and each 1,800.25 amount is visible only as `$1,800`, with its cents cut off. This is distinct from content below the screenshot. The 390/768/1280/1440 captures show complete `$1,800.25` amounts. **HOLD W04 360 visual acceptance** until the table is made readable at this width and recaptured. Keep dates and full exact amounts readable; do not solve this by removing cents. |
| P3 / inspect interaction | [W03 360](evidence/hosted/hosted-w03-360.jpg) | An inner horizontal scrollbar appears under the ordinary two-row reserve table. Dates and displayed amounts appear readable in this still, but the component is not free of horizontal scrolling at 360. The 390 capture shows the table without that visible scrollbar. Root should verify scroll usability and consider tighter table spacing. No page-wide horizontal overflow is evident in the image. |
| P3 cosmetic | [Urgent 768](evidence/hosted/hosted-urgent-768.jpg) | Print / Save PDF wraps to four short lines in a narrow, tall control. It remains legible and separated from the title/description, but is visually awkward at the tablet breakpoint. This screenshot does not test whether printing works. |

No other definite clipping or card-to-card/control overlap was found within the captured areas. This statement does not cover off-screen content. Fixed navigation masks the top of scrolled content in several captures; without a focus or anchor-navigation trace, this is not sufficient evidence of a separate accessibility defect.

## Inventory and observations for every image

| Image filename in `evidence/hosted/` | Observed state and limits |
| --- | --- |
| `hosted-urgent-360.jpg` | Title wraps cleanly to two lines; `1e3` validation error and dash result visible. Inputs/currency selector fit. Lower result cards outside frame. |
| `hosted-urgent-390.jpg` | Title fits one line; clear red error, dash result, readable stacked controls. Lower content outside frame. |
| `hosted-urgent-768.jpg` | Title, explanation and three input columns fit; error wraps without overlap. Print button has awkward four-line label noted above. Lower result content outside frame. |
| `hosted-urgent-1280.jpg` | Input/error row, blank result grid, navigation and side ad reserves are separated. No placeholder overlap visible; actual rendered ads are not shown. |
| `hosted-urgent-1440.jpg` | Same invalid state remains readable with wider title/inputs and balanced result grid. Full page and real ad behavior untested. |
| `hosted-w01-360.jpg` | Tie explanation wraps long third-listing name normally; first result's 2,272.62 monthly value is readable. Lower two cards and save/export controls are outside frame. |
| `hosted-w01-390.jpg` | Tie explanation and first card are readable, including 72.62 monthly/871.43 annual difference. Lower two cards and save/export controls are outside frame. |
| `hosted-w01-768.jpg` | Three columns fit; long third name wraps to three lines without collision. Lowest-cost tie is explicit. Bottom of third difference box is below crop. |
| `hosted-w01-1280.jpg` | All three results visible; long name wraps to two lines. Equal 2,200 monthly results and zero differences for tied cards are readable. |
| `hosted-w01-1440.jpg` | All three results visible and separated; tie text, amounts and annual differences readable. Upper workspace heading and lower actions outside frame. |
| `hosted-w02-360.jpg` | Commitments/savings labels and explanation fit; 2,282.62 housing cost, 57.07% share and 217.38 remaining are prominent. Only beginning of breakdown table visible. |
| `hosted-w02-390.jpg` | Same result is readable with stacked secondary metrics; income/rent breakdown rows fit. Remaining rows/actions outside frame. |
| `hosted-w02-768.jpg` | Paired controls and secondary metrics fit; visible income/rent/utilities/parking rows align. Full breakdown outside frame. |
| `hosted-w02-1280.jpg` | Two-column form and result hierarchy are clear; ample table spacing. Bottom rows/actions outside frame. |
| `hosted-w02-1440.jpg` | Same mixed-period result and visible breakdown readable. No visible clipping; full form/remaining rows not captured. |
| `hosted-w03-360.jpg` | Date fields, same-day opt-in, calculate button and reserve explanation readable. Two reserve rows visible; inner horizontal scrollbar noted above. Header and later assumptions outside frame. |
| `hosted-w03-390.jpg` | Date controls, 1,500 remaining across two paydays and both 750 reserves/1,250 then 2,000 balances readable. Table caption wraps normally. |
| `hosted-w03-768.jpg` | Bill/savings/date controls fit in two columns; checkbox sentence, result, complete two-row table and assumptions fit. Planner title is above crop. |
| `hosted-w03-1280.jpg` | Planner title, explanation, controls, ordinary result and assumptions visible and separated. Next annual-payment-count heading begins below. |
| `hosted-w03-1440.jpg` | Same full planner section readable; ample table space and clear grouping. No edge-case or huge-amount state shown. |
| `hosted-w04-360.jpg` | Export button, guidance and three-payment prepared feedback wrap readably. Payment amounts are clipped horizontally: P2 above. |
| `hosted-w04-390.jpg` | Complete 1,800.25 amounts and three dates visible; dates wrap within their cells. Export text/feedback readable. |
| `hosted-w04-768.jpg` | Complete payment rows, export control/text/status and methodology heading visible without clipping. |
| `hosted-w04-1280.jpg` | Table, export card and paired methodology/example headings readable and separated. Inputs/start/end summary above crop. |
| `hosted-w04-1440.jpg` | Same table/export state fits; supporting headings form a clear visual hierarchy. Full page and changed-state behavior untested. |

## What these screenshots establish

Visible visual hierarchy generally distinguishes section titles, primary totals, secondary figures, supporting explanations and action buttons. W01's long natural-language name wraps in the tie sentence at mobile widths and in the third card at tablet/desktop widths. W02's mixed-period totals are readable. W03's ordinary two-payday result is readable apart from the narrow-table concern. W04's export guidance and status remain readable at all supplied widths, but the 360 payment table fails full-amount visibility.

The screenshot-only conclusion is **no additional visible blocker for captured urgent/W01/W02 areas; W03 narrow-table follow-up; W04 360 HOLD**. This does not override incomplete broader release gates.

## Evidence limits / remaining checks

- These are viewport crops at selected scroll positions, not complete-page captures. W01 mobile screenshots do not show the second/third result cards or save/export controls; W02 does not show the whole breakdown; several packages omit their route heading and main inputs.
- W01 uses a long name with spaces. These images do not test a 60-character unbroken token, huge amounts, every currency, invalid/saved-state cases or every menu.
- Visual prominence is inspectable; semantic H1/H2 ordering, labels, live regions, keyboard focus, screen-reader announcements and tab order cannot be established from pixels.
- Screenshots cannot prove document scroll width, a working download, file contents, calendar import, storage behavior, date changes or edge-case calculation behavior. Root's separately recorded interaction/file evidence must supply those claims.
- No JavaScript-disabled, print/PDF, network, analytics-consent, real-ad rendering or external-calendar acceptance was performed or inferred here.
- The JPEGs do not show a browser URL or immutable deployment identifier. Root must bind this evidence set to the actual hosted deployment URL/SHA in the release ledger. No deployment identity is guessed from image filenames.
- After fixing W04, capture the same 360 ordinary bill state and verify all three full amounts and the Amount heading. After any further code change, use final-deployment evidence rather than treating these older captures as final acceptance.

## Repaired W04 hosted addendum — 2026-11-13

Root supplied this deployment identity for the repaired evidence: commit **`155b2a8247449e9523e0e950155338acf573e6c1`**, immutable preview **https://6af69d4ceab11ecb5c38ff5b--rent-converter.netlify.app**. This identity is attributed to root; it is not inferred from screenshot pixels.

This reviewer individually opened **all six** new JPEGs with `tools.view_image` and copied/hash-verified them in `ai-issues/evidence/hosted/`. The earlier author-independence and screenshot-only limitations still apply.

| Repaired screenshot | Direct visual observation |
| --- | --- |
| [360](evidence/hosted/hosted-w04-repaired-360.jpg) | Full Amount heading and all three `$1,800.25` values are now visible. Payment dates wrap within their cells without losing digits. Export control and guidance fit. **Initial P2 clipping is fixed in this ordinary-input state.** |
| [390](evidence/hosted/hosted-w04-repaired-390.jpg) | Heading, all three dates and exact amounts fit without clipping; dates fit on one line. |
| [768](evidence/hosted/hosted-w04-repaired-768.jpg) | Lease summary, full table and export guidance fit. The top of the primary result heading is behind the fixed header at this scroll position; no separate focus/anchor defect is established by that crop. |
| [1280](evidence/hosted/hosted-w04-repaired-1280.jpg) | Full three-payment result, lease summary, table and export card remain readable and separated. |
| [1440](evidence/hosted/hosted-w04-repaired-1440.jpg) | Same complete ordinary table and exact amounts are readable; no new clipping or overlap observed. |
| [Large amount at 360](evidence/hosted/hosted-w04-repaired-large-360.jpg) | Horizontally scrolled table shows the complete `$9,007,199,254,740,991.99` amount on every row. A visible inner scrollbar explains why earlier columns are outside the currently scrolled view. Export button/text remain readable. This is an overflow state with full values accessible, not a claim that every column fits simultaneously. |

Root separately reports actual browser measurements and keyboard interaction: ordinary 360px table `clientWidth=233`, `scrollWidth=233`; ordinary tables had equal client/scroll widths at all five tested sizes. For the large amount, the 360px table had client width 233 and scroll width 332, was focusable, and real ArrowRight input moved its scroll position from 0 to 40 and then approximately 100 at the far end. These are **root-observed interactive checks**, not measurements or keyboard actions performed by this screenshot reviewer. The large-amount screenshot is visually consistent with its reported far-right state.

**Disposition:** close the initial W04 P2 for the identified repaired deployment and ordinary 1,800.25 schedule at the five supplied widths. The enormous-value state visibly preserves full cents with horizontal scrolling, and root reports keyboard access. No additional visual blocker was found in these six captured areas. **W03's 360px inner-table-scrollbar P3 is unchanged**; this addendum does not retest or close it.

Root is inspecting the newly downloaded `(2).ics` separately. This addendum makes no claim about that file's contents or calendar import. It does not complete JavaScript-off, print/PDF, network, full-page or assistive-technology acceptance, and it does not modify source code.
