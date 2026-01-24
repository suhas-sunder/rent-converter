Hard constraints (absolute)

Do NOT refactor architecture.

Do NOT add libraries.

Do NOT rewrite unrelated sections.

Make minimal, safe, localized edits only.

Do NOT change existing behavior unless explicitly required below.

Keep all existing exports, route types, and Remix conventions intact.

If route type imports use ./+types/<route-name>, keep the slug consistent everywhere (canonical, og:url, schema, links).

Output rules (NON-NEGOTIABLE)

In Step 2, output ONLY the full updated file contents inside exactly one fenced code block.

Start the fence with ts or tsx (matching the file).

End with ```

No text before or after the code block.

No diffs, no snippets, no explanations, no comments, no headings.

No extra whitespace outside the single code block.

Process

This message is instruction-only. Do NOT write code yet.

You must respond with exactly:

One sentence confirming you understand every requirement.

The exact phrase: “Ready for the code.”

After I paste the page code, return ONLY the full updated code per the output rules.

Fix requirements (must be implemented exactly)
1) Comma-grouped preview formatting for ALL amount inputs (PRIMARY, NON-NEGOTIABLE)

Goal: Improve readability (e.g. 2000 → 2,000) without breaking parsing, without caret jumping, and without altering user typing.

Definitions:

rawValue: Exact string stored in React state, updated every keystroke.

parsedValue: Validated numeric interpretation used for calculations (full precision).

previewValue: Display-only, comma-grouped representation derived from parsedValue.

Required behavior:

While focused

input.value MUST equal rawValue.

Never inject commas or reformat while typing.

Never rewrite .5 to 0.5.

Never remove a trailing ..

Never auto-correct, normalize, or “fix” user input.

On blur

If rawValue parses successfully into a finite number:

Display previewValue using en-US thousands separators.

Preserve decimals exactly as allowed by the parser.

Do NOT drop decimals.

If rawValue is invalid or ambiguous:

Leave the displayed value exactly as rawValue.

Show a visible error message.

Do NOT silently fix or coerce the value.

On focus

Immediately revert display back to rawValue.

No commas shown while focused.

Formatting rules for previewValue:

Use en-US grouping for the integer part.

Preserve decimals.

Preserve precision up to the parser’s max (e.g. 6 or 12).

DISPLAY ONLY. rawValue must NEVER contain commas.

Implementation constraint:

Preview formatting MUST be done via a separate display layer (e.g. focus state + conditional value or parallel display state).

rawValue must remain untouched by formatting logic.

No mid-edit reformatting under any circumstance.

2) Display decimals and strict localStorage validation

Default displayDecimals = 2.

Read from localStorage with strict validation:

Allowed values ONLY: 0, 2, 4, 6.

Any other value (null, NaN, undefined, other numbers) MUST fall back to 2.

Selecting 0 decimals must reliably persist and display 0 (no reversion).

Rounding is display-only. Internal math remains full precision.

Formatting behavior:

If roundDisplay === true:

minimumFractionDigits = displayDecimals

maximumFractionDigits = displayDecimals

If roundDisplay === false:

minimumFractionDigits = 0

maximumFractionDigits = 12

Do NOT force decimals on integers.

3) Currency conversion correctness (site-wide contract)

If this page performs currency conversion:

Must support every currency in SUPPORTED_CURRENCIES.

Validate base and target currencies with isCurrency().

If rate data is missing or unavailable:

Show a clear error state.

Hide converted outputs.

No NaN, no 0, no misleading fallback values.

Display rounding is allowed.

Conversion math must preserve full internal precision.

4) CSV / export removal (HARD REQUIREMENT)

Remove ALL CSV/export-related code, UI, handlers, helpers, and text.

Do NOT leave commented code.

Do NOT reintroduce CSV/export logic in any form.

Ensure removal does NOT break unrelated features.

5) Internal linking

There is a whitelist of valid internal routes.

If genuinely useful, add 1–3 contextual internal links.

Do NOT link to non-existent routes.

Slugs must exactly match route definitions.

Pre-output self-check (MANDATORY)

Before emitting Step 2 code, verify:

All amount inputs show commas ONLY on blur when valid.

Inputs revert to raw (no commas) immediately on focus.

rawValue never contains commas.

.5 stays .5 while typing.

Trailing . is preserved while typing.

Invalid input remains unchanged on blur and shows an error.

No CSV/export code or text exists anywhere.

Output is exactly one full-file code block and nothing else.