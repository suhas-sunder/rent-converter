# RC-028 visual review — urgent, W01, W02

Reviewed 2026-11-13 by the value-inventory agent, separately from the final capture operator. This reviewer previously implemented W01 and shared fallback repairs; this is a second visual inspection, not a claim of independent authorship review.

## Candidates and evidence

| Candidate | Exact commit | Route |
| --- | --- | --- |
| Urgent | `b69768dc8c8c66342786ba9f39eb958676637b80` | `/` |
| W01 | `e2a62955a58d30be90a646fd99a253ca2b30bde9` | `/` |
| W02 | `68bfad21aa48fb1425ac1a3ef695a37efc910d7c` | `/rent-budget-calculator` |

Immutable preview origins are recorded in `scripts/browser-qa/candidates.json`. Actual images inspected: `scripts/browser-qa/artifacts/final/{urgent,w01,w02}-screen-{360,390,768,1280,1440}.png` and corresponding `-nojs-` files: 30 images. Inspection focused on navigation, calculator inputs, complete result amounts, feature controls, assumptions, and local fallback notices. Long images were viewed through readable crops, including lower W02 mobile breakdowns; this does not certify every below-tool paragraph or footer. PDF review and W03/W04 review belong to the other acceptance reviewers.

## Visual findings

| Candidate | Ordinary five widths | JavaScript off, five widths | Actual browser 200% |
| --- | --- | --- | --- |
| Urgent | PASS | PASS | PASS, physical 1440/720 |
| W01 | PASS | PASS | PASS, physical 1440/720 |
| W02 | PASS | PASS | PASS, physical 1440/720 |

- Urgent: monthly `$2,172.62`, all secondary rent equivalents and cents, and the four-week comparison remain readable at each ordinary width. Mobile navigation branding and controls do not overlap. The JavaScript-off warning clearly identifies static examples, and primary fallback links remain visible and wrap cleanly.
- W01: three listings, labels, currency, monthly/annual costs and differences remain readable. Results, assumptions, CSV/save controls, the page print control and explicit local-save explanation fit their containers. The JavaScript-off view shows two fixed examples and a specific warning explaining the example comparison and why editing, saving and exporting require JavaScript.
- W02: both the existing gross-income tool and expanded take-home budget are readable. The entered example shows `$2,282.62`, `57.07%`, and `$217.38`; monthly breakdown rows retain full cents even at 360px. Billing-period labels, rounding assumptions, exclusion/caveat text, print control and storage explanation remain visible. JavaScript-off views clearly explain manual calculation; empty required inputs do not produce a fabricated budget result.
- Nonblocking cosmetic observation: the home Print / Save PDF button wraps onto multiple lines at some intermediate widths. Its complete label remains legible and the control does not cover adjacent content.

## Zoom evidence correction

The original `final/*-zoom200.png` files used a 720px viewport plus CSS `zoom: 2`. Actual inspection found ellipsized home secondary amounts and a squeezed W01 currency selector in that synthetic layout. These were CSS stress artifacts, not reproduced browser-zoom defects: CSS zoom retains media-query width, unlike browser zoom. No app changes were made in response.

The replacement `zoom-final/zoom-report.json` records actual `chrome.tabs.setZoom(2)` with physical viewports 1440/720, inner widths 720/360, device pixel ratio 2 and CSS zoom 1. DOM checks report no page overflow or ellipsized money. The first replacement PNGs incorrectly captured only the left portion of the physical rendering; that evidence was rejected and the capture corrected using CDP physical content dimensions.

Actual corrected images inspected: `scripts/browser-qa/artifacts/zoom-final/{urgent,w01,w02}-native-zoom200-{1440,720}.png` (six images; generated after 14:30 UTC). Readable sequential crops covered each complete calculator/feature area, not just the first viewport. Urgent retains every amount and cent, currency, comparison, and assumptions. W01 retains the complete USD selector, all three listing forms, monthly/annual totals and differences, export/save controls and privacy explanation. W02 retains the gross-income comparison, every expanded-budget field, full monthly breakdown, assumptions and print/storage notes. There is no observed zoom clipping or overlapping content in these reviewed tool areas. Native 200% visual review passes on the exact candidates above; the synthetic CSS captures must not be cited as native browser-zoom evidence.

Screenshots alone cannot establish disabled-control behavior, keyboard interaction, screen-reader announcements, or full accessibility conformance. Those claims require the separate browser interaction and accessibility evidence. No application source, dependencies, route metadata, or indexation were changed during this review.
