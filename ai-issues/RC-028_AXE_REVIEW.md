# RC-028 unresolved axe contrast review

Reviewed November 13, 2026 by the independent `research_audit` agent. **No contrast blocker found in the reported incomplete nodes.** This closes their manual-review requirement for the exercised fixtures; it is not a claim of complete accessibility conformance.

The reviewer imported the existing `scripts/browser-qa/fixtures.mjs` setup and visited all five exact immutable candidates from `candidates.json` in fresh Chromium contexts, rejected optional analytics, waited for fonts and restored the 1280 × 900 baseline viewport/top-of-page state. No production URL was visited and no application/configuration files were changed. Exact origins, full SHAs, browser version, selectors, axe check messages, computed styles and calculations are preserved in [the evidence](evidence/rc028-axe/contrast-review.json); [review.mjs](evidence/rc028-axe/review.mjs) reproduces this examination.

| Candidate | Violations | Incomplete color-contrast nodes | Actual cause |
| --- | ---: | ---: | --- |
| Urgent `b69768d` | 0 | 7 | One assumptions arrow and six FAQ disclosure arrows |
| W01 `e2a6295` | 0 | 7 | Same seven disclosure arrows |
| W02 `68bfad2` | 0 | 0 | No incomplete nodes in this fixture |
| W03 `5af2d23` | 0 | 7 | One assumptions arrow and six FAQ disclosure arrows |
| W04 `2483d5f` | 0 | 0 | No incomplete nodes in this fixture |

Every one of the 21 reported nodes contains the triangle glyph `▾`. Axe's actual check message is **“Element content contains only non-text characters”**, with `messageKey: nonBmp`. It did not measure and report a failing contrast ratio. This message still requires review, so the glyphs were checked instead of being waived because the automated violations array was empty.

## Rendered contrast measurements

CSS uses a mixture of legacy RGB and Tailwind OKLCH values. A one-pixel Chromium canvas converts each computed color to sRGB; the calculation resolves the nearest opaque ancestor backgrounds, composites any alpha layers, and applies WCAG relative luminance and `(lighter + 0.05) / (darker + 0.05)`. The relevant arrow chains have opacity 1, flat backgrounds, no image, no text shadow, no filter and no blending. This uses underlying colors rather than anti-aliased edge pixels.

| Actual arrow grouping | Foreground sRGB | Background sRGB | Contrast |
| --- | --- | --- | ---: |
| Urgent/W01 assumptions | 49,65,88 | 224,242,254 | 9.026:1 |
| Urgent/W01 six FAQ arrows each | 49,65,88 | 248,250,252 | 9.899:1 |
| W03 assumptions | 49,65,88 | 223,242,254 | 9.010:1 |
| W03 six FAQ arrows | 71,85,105 | 248,250,252 | 7.243:1 |

All pass even the conservative **4.5:1 ordinary-text threshold**, without relying on a decorative or non-text exemption. The table displays rounded values; the evidence retains full precision and comparisons use unrounded values. One-byte RGB conversion differences are immaterial to these substantial margins. W3C describes the 4.5:1 threshold, 3:1 large-text exception, unrounded comparisons, and use of underlying foreground/background colors in its [Contrast (Minimum) guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

The reviewer visually inspected representative screenshots of the complete assumptions controls on urgent/W03 and the first FAQ summary on urgent/W01/W03. The arrows are visible, dark, and sit on the expected pale backgrounds; labels remain legible. All 21 nodes have per-control screenshots and computed-color evidence. The other repeated summary screenshots were captured but are not claimed as individually visually inspected. FAQ content and schema were untouched.

## Scroll-state diagnostic and limits

An additional first pass immediately after input interaction produced three extra sticky-header incomplete warnings on urgent/W01 (`elmPartiallyObscured`). That pass had automatically scrolled the document to focused inputs, unlike the baseline runner which resets scroll while capturing responsive screenshots before axe. Repeating at the actual baseline top-of-page state consistently reproduced exactly the expected seven arrows. The extra first-pass messages and separate scrolled-header captures are preserved as diagnostic evidence; they are not silently counted as passes or substituted for the baseline results.

Both scrolled-header screenshots were visually inspected: the logo text, tagline and navigation were unobscured and legible. The actual header is 95% white. Conservatively placing that background over pure black yields a background no darker than sRGB 242,242,242. Against this lower bound, the actual flagged foreground colors produce at least **5.231:1** for the blue `.com`, **6.774:1** for the tagline, **9.251:1** for navigation, and **18.005:1** for the near-black logo text. These also exceed 4.5:1. The source evidence retains each original warning and its separately measured foreground; no background or CSS was changed to make axe pass.

This review covers the listed synthetic fixture states and incomplete nodes. It does not certify every hover/focus state, every viewport, forced colors, screen-reader speech, all future content or whole-site WCAG compliance. The release steward's keyboard, zoom, PDF and other acceptance gates remain separate evidence. No code repair is justified solely to suppress the non-text-character warning: the arrows already exceed the relevant contrast thresholds.
