You are auditing and applying SMALL, LOCAL fixes to RentConverter.com Remix/React pages (TypeScript). Do NOT refactor architecture, do NOT add libraries, and do NOT rewrite unrelated sections. Make simple, safe edits only.
1. Comma grouping for large numeric inputs without breaking calculations
   Goal: when the user types 2000, the UI should help them see 2,000, but parsing must still work.
   Implement the simplest approach:

- Keep raw typing while the input is focused.
- On blur (or when not focused), display a formatted version with thousands separators.
- Parsing must always strip grouping separators and must not change the actual numeric value used.
- Do NOT introduce caret jumping. Prefer format-on-blur instead of live formatting.
- If you choose to add an inline “preview” instead of formatting the input value itself, that is acceptable, as long as it shows grouped digits (e.g., “Preview: 2,000.00”) and never breaks calculations.

2. Display decimals: consistent behavior with default 2

- The default displayDecimals must be 2.
- LocalStorage must be validated:
  - Only allow: 0, 2, 4, 6 (exact).
  - Any invalid value (null/NaN/other numbers) must fall back to 2.
- Selecting 0 must reliably display 0 decimals (never randomly reverting to 2 or 4).
- Rounding is display-only; internal math stays at full precision.
- IMPORTANT: Fix current formatting logic so “roundDisplay = false” does NOT force minimumFractionDigits=2 and maximumFractionDigits=12 in a way that makes the UI confusing.
  - Expected behavior:
    - If roundDisplay=true: min=max=displayDecimals.
    - If roundDisplay=false: show up to 12 decimals, but do NOT force 2 decimals if the number is an integer; minimumFractionDigits should be 0 (or at most 2 only if you explicitly justify it as a product decision). Keep it consistent across pages.

3. Currency conversion correctness for all supported currencies (site-wide contract)
   Even if this specific page doesn’t convert between currencies, enforce a consistent rule:

- Any conversion feature must support every currency in SUPPORTED_CURRENCIES.
- Validate base/target currency selections with isCurrency().
- If rate data is missing/unavailable, results must show a clear error state and hide converted outputs (no NaN, no zeros).
- Display rounding is allowed; conversion math must preserve decimals internally.

4. There may be code related to downloading/exporting CSV format. I removed that feature. You can remove it, but do it carefully without breaking any other features. You can also remove and text that mentions csv download or export.

5. There's a list of valid links available for internal linking. If it's worth linking more pages, feel free to do so with the appropriate contextual information. Don't overdo it if there are already enough links being displayed.


INPUT GROUPING PREVIEW RULE (NON-NEGOTIABLE)

Goal:
When the amount input is NOT focused, show a human-friendly preview with grouping separators (commas) so large numbers are readable. When the input IS focused, show the raw editable string exactly as the user typed it (no auto-formatting while typing).

Definitions:
- rawValue: the exact string in state that updates on every keystroke.
- parsedValue: the validated numeric interpretation (scaled integer / fixed-point).
- previewValue: the display-only, grouped representation derived from parsedValue.

Behavior:
1) While focused:
   - input.value MUST equal rawValue.
   - Do NOT inject commas or reformat the string while typing.
   - Do NOT change decimals, remove trailing ".", or rewrite ".5" into "0.5".
2) On blur (not focused):
   - if rawValue parses successfully:
       input.value MUST switch to previewValue = grouped formatting of parsedValue
       (example: "240000" -> "240,000")
   - if rawValue is invalid/ambiguous:
       input.value MUST remain rawValue (do NOT “fix” it)
       show an error message instead of silently changing it
3) On focus again:
   - immediately revert the input display back to rawValue (the editable string), not the grouped preview.

Formatting requirements for previewValue:
- Add grouping separators to the integer part (locale OK, but must include commas in en-US).
- Preserve decimals (do not drop them).
- Preserve up to the parser’s supported decimal precision (example: up to 6 or 12).
- If currency formatting is used elsewhere, previewValue may be either:
   A) grouped number only: "240,000.50"
   B) currency-formatted: "HK$240,000.50"
   But MUST be consistent across the app. (Pick one and stick to it.)

Examples (expected):
- rawValue "240000"   -> blur preview "240,000"
- rawValue "240000.5" -> blur preview "240,000.5" (or "240,000.50" only if you explicitly standardize decimals)
- rawValue ".5"       -> blur preview "0.5" (display-only; on focus should show ".5" again)
- rawValue "12."      -> blur preview "12" or "12.0" ONLY if the parser treats trailing dot as valid; on focus must show "12."
- rawValue "1,250.50" -> blur preview "1,250.50"
- rawValue "$1,234.56"-> blur preview "1,234.56" (or "$1,234.56" if currency preview is chosen)
- rawValue "1250,50"  -> blur preview "1,250.50" if comma-decimal is accepted and unambiguous
- rawValue "1,2"      -> invalid, keep "1,2" on blur and show error (no preview)

Implementation constraint:
- This is DISPLAY-ONLY formatting. rawValue in state must never be rewritten just to add commas.
- This rule must be applied to ALL amount inputs across RentConverter.com routes going forward.


Deliverables
A) Out the updated code in full.
D) Keep changes minimal. No large refactors.

Fix the code and give it back in full. No comments. No questions. Just the full fixed code.

Page provided for inspection (apply fixes here): 