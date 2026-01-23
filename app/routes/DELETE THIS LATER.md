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

Deliverables
A) Out the updated code in full.
D) Keep changes minimal. No large refactors.


Fix the code and give it back in full. No comments. No questions. Just the full fixed code.

Page provided for inspection (apply fixes here): 