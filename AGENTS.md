# AGENTS.md

## Project context

This is RentConverter.com, a React Router / Remix-style calculator site for rent conversion, rent affordability, rent increases, rent splitting, rent due dates, paycheck-based rent planning, and related rental math.

The site is SEO-driven and ad-first, but the calculators must stay useful, fast, trustworthy, and easy to use. Do not make pages feel like generic SEO articles. The calculator experience comes first.

The site launched in January and has had low CTR in Google Search Console. Future edits should improve:

- search intent alignment
- CTR
- snippet quality
- page uniqueness
- internal linking quality
- visible trust
- calculator usability
- route-specific content
- component reuse
- maintainability

Do not optimize for search in a way that harms the user experience.

## Home page source of truth

The home page is the source of truth for most project-wide styling, UX, layout, component behavior, and implementation patterns unless the current task explicitly asks for a different change.

Use the home page as the primary reference for:

- visual style
- spacing
- layout structure
- calculator-first page rhythm
- card styling
- result card styling
- button styling
- hover and focus states
- print/export behavior
- currency selector behavior
- localStorage validation patterns
- route whitelist behavior
- SEO metadata structure
- schema style
- internal linking style
- Tailwind class patterns
- trust copy style
- responsive behavior
- general polish

Do not copy home page content blindly. Copy the structure, polish, spacing, interaction model, and implementation pattern, then adapt wording, examples, metadata, links, assumptions, and supporting copy to the specific route.

When a new prompt conflicts with the home page, follow the new prompt only for that specific requested change and keep everything else aligned with the home page.

## Core rule

Before editing, inspect the relevant files.

Do not guess from the prompt alone. Identify the current route behavior, state flow, calculation flow, imports, component usage, localStorage keys, conversion math, validation logic, result rendering, print/export behavior, metadata, schema, canonical URLs, internal links, and supporting content before changing code.

Prefer small, reviewable changes over sweeping rewrites.

Only implement the task requested in the current prompt. Do not implement unrelated improvements from other prompts, older plans, or general ideas unless the user explicitly asks for them.

## Preservation rules

Do not break or casually change existing:

- route behavior
- route slugs
- imports
- exported route functions
- component names
- function names
- variable names
- TypeScript types
- localStorage keys
- IDs
- canonical URLs
- og:url values
- schema URLs
- internal links
- SEO structure
- calculator behavior
- calculation logic
- validation behavior
- result behavior
- copy behavior
- download behavior
- print behavior
- save PDF behavior
- CSV/export behavior
- accessibility attributes
- responsive layout

Only rename, remove, or restructure existing code when:

- fixing a direct bug
- removing verified dead code
- extracting repeated code into a safe shared helper/component
- the current task explicitly requires it

Do not remove useful existing features to simplify the implementation.

Do not add links to routes that do not exist.

Do not invent new routes unless the current task explicitly asks for a new route.

## Route whitelist and internal links

Respect the existing internal link whitelist pattern.

Only add internal links to routes that are known to exist in the route whitelist, route registry, sitemap, or current file.

If a route is not confirmed to exist, do not link to it.

Internal links should help the user take the next logical action. Do not add links only for SEO.

Good internal linking patterns:

- weekly to monthly pages can link to monthly to weekly, weekly to annual, and rent paid every 4 weeks
- monthly to weekly pages can link to weekly to monthly and monthly to annual
- rent per paycheck pages can link to rent vs take-home pay, rent as percentage of income, and affordability calculators
- rent increase pages can link to rent increase percentage and rent after increase
- rent split pages can link to income-based rent split and affordability pages when those routes exist
- rent due date pages can link to rent calendar or lease date pages only if those routes exist

Avoid giant walls of links above the calculator.

## Calculator-first UX rules

The calculator must remain the main focus.

Do not:

- bury the calculator under long SEO text
- add bulky content above the calculator
- make the page feel like a blog post
- add distracting badges
- add fake testimonials
- add intrusive popups
- add unnecessary controls
- remove useful result explanations
- hide important assumptions
- make the layout more generic

Above-the-fold copy should be short, useful, and specific to the route.

Supporting content belongs below the tool unless the current task explicitly asks otherwise.

UI-only controls that could pollute search snippets should use `data-nosnippet` where appropriate.

Good `data-nosnippet` candidates:

- print controls
- save PDF controls
- export controls
- swap buttons
- repetitive utility controls
- large bottom navigation blocks
- non-explanatory default result controls

Do not add `data-nosnippet` to:

- H1
- main intro
- useful calculation explanation
- methodology copy
- concise trust copy
- route-specific examples

## Styling rules

Use the home page and existing design system as the styling source of truth.

All buttons and interactive controls must include:

- `cursor-pointer`
- clear hover states
- clear focus states where appropriate

All headings should use `text-sky` classes where applicable.

Preserve the existing Tailwind design language.

Do not change colors, spacing, or layout broadly unless the current task explicitly asks for a design change or the current layout is clearly broken.

Keep mobile layouts clean and usable.

## Copywriting rules

Copy should be professional, grounded, and useful.

Avoid AI-sounding filler, vague claims, and inflated marketing language.

Do not use phrases like:

- unlock insights
- seamless experience
- empower your rental journey
- transform your finances
- ultimate rent solution
- game changing
- discover powerful insights
- simplify your life effortlessly

Prefer:

- direct explanations
- route-specific examples
- practical user benefits
- clear assumptions
- concise trust signals
- plain-English rental math

Do not add fake certainty, fake testimonials, legal guarantees, financial guarantees, or exaggerated claims.

Keep copy human and specific.

## SEO rules

Every important route should have:

- unique title
- unique meta description
- unique H1
- route-specific intro copy
- correct canonical URL
- correct og:url
- correct schema URL
- useful route-specific supporting copy
- contextual internal links to existing routes only

Do not make multiple pages feel like the same page with a different title.

Do not use generic copy across all pages.

Do not keyword stuff.

Use query data naturally when it matches route intent.

Important search-intent clusters include:

- rent converter
- weekly to monthly rent converter
- convert weekly rent to monthly
- PW to PCM
- PCW to PCM
- price per week to month
- rent per week to month
- monthly to weekly rent
- PCM to PW
- PCM rent calculator
- what does PCM mean in rent
- rent paid every 4 weeks
- 4 weekly to monthly calculator
- 28 day rent cycle
- rent increase calculator
- rent increase percentage calculator
- rent affordability calculator
- rent to income ratio calculator
- rent as percentage of income
- how much rent can I afford
- rent per paycheck calculator
- rent split calculator
- split rent by income calculator
- rent due date calculator
- rent calendar
- lease date calculator

Only use these terms where they match the page.

## Metadata rules

Titles should match route intent and place the main query early.

Good title patterns:

- `Weekly to Monthly Rent Converter | PW to PCM Calculator`
- `Monthly to Weekly Rent Converter | True Weekly Rent`
- `Rent Paid Every 4 Weeks Calculator | True Monthly Cost`
- `Rent Per Paycheck Calculator | Biweekly and Semi-Monthly Rent`
- `Rent Converter Calculator | Weekly, Monthly, 4-Week & Annual Rent`
- `Rent Increase Calculator | New Rent and Percent Change`
- `Rent Increase Percentage Calculator | Before and After Rent`
- `Rent Affordability Calculator | Income to Rent Ratio`
- `Rent Split Calculator | Split Rent by Roommates or Income`
- `Rent Due Date Calculator | Next Rent Payment Date`

Meta descriptions should explain:

- what the calculator converts or calculates
- what result the user gets
- why the result is useful
- one trust/detail point, such as true monthly cost, 365-day basis, 4-week comparison, paycheck budgeting, printable results, local calculation, or decimal-safe math

Open Graph and Twitter metadata should target the same intent as the page title and meta description.

Do not use the same generic metadata across multiple routes.

## Schema rules

Keep schema accurate and route-specific.

Allowed safe updates:

- WebPage name
- WebPage description
- WebPage URL
- WebApplication schema where appropriate
- WebSite schema if needed for consistency
- canonical URL
- Open Graph URL

Do not edit FAQ schema, FAQPage structured data, FAQ arrays, or FAQ copy unless the current task explicitly asks for FAQ cleanup or the FAQ is directly broken.

Do not add FAQ schema unless visible FAQ content exists.

Canonical URL, og:url, and WebPage schema URL must match the actual route slug.

## Component preservation rules

Do not edit, remove, replace, rewrite, or duplicate component-managed sections unless the current task explicitly requires it or the component is directly broken.

Component-managed sections may include:

- `HowItWorks`
- `ToolFit`
- `Assumptions`
- FAQ components
- FAQ data
- FAQ schema
- imported explanation sections
- imported related-tool sections
- imported methodology sections
- imported supporting content sections

If those sections are imported components, preserve the imports and component usage unless an import is genuinely unused after unrelated cleanup.

Do not add a second route-level “How it works,” “Tool fit,” or FAQ section if the page already imports one.

Do not move component-managed sections around unless the existing file is clearly broken or the current task explicitly asks for layout cleanup.

## Shared component and duplication rules

The site has repeated sections and UI patterns across pages. If a section, card, control group, CTA block, result block, internal-link block, SEO/supporting section, trust note, export control, or calculator helper is being recreated across multiple routes, consider extracting it into a shared component or shared helper.

Only create shared components when it clearly improves maintainability without weakening route-specific intent.

Good shared component candidates:

- calculator shells
- page hero/header blocks
- export/print controls
- result cards
- trust notes
- related calculator cards
- internal link sections
- SEO/supporting section layouts
- methodology cards
- assumptions cards
- validation message UI
- currency selectors
- period selectors
- CTA sections
- page section wrappers
- FAQ rendering components, without changing FAQ copy unless asked
- data-nosnippet wrappers for UI-only controls

Good shared utility candidates:

- route whitelist handling
- SafeLink rendering
- currency formatting
- decimal-safe display formatting
- money parsing
- period labels
- period conversion constants
- localStorage-safe parsing
- schema builders
- metadata builders
- print/export helpers
- filename sanitization
- percentage formatting
- snippet/no-snippet helpers

Do not extract something if:

- only one route uses it
- the content is highly route-specific
- abstraction would make the page harder to understand
- it would require rewriting many unrelated pages at once
- it risks breaking calculator behavior
- it risks changing SEO, canonical URLs, schema URLs, or internal-link behavior
- it creates generic copy across pages
- it hides route intent behind vague reusable content

When creating shared components:

- preserve visual styling
- follow the home page pattern
- keep route-specific text passed in as props or data
- avoid hardcoded generic copy
- avoid hardcoded links unless they are validated against the route whitelist
- keep headings using `text-sky` classes where applicable
- keep all buttons and controls `cursor-pointer`
- preserve hover and focus states
- preserve accessibility labels and aria attributes
- preserve `data-nosnippet` where needed
- keep component APIs simple and typed

Shared structure is good. Shared generic SEO copy is bad.

## Decimal and rounding rules

Preserve decimal-safe math internally.

Do not round intermediate calculations.

Rounding should be display-only.

Displayed money values should normally use 2 decimal places.

Users generally do not need controls for decimal precision. Do not add controls for:

- round results
- display decimals
- 0 decimals
- 2 decimals
- 4 decimals
- 6 decimals
- precision selector

Remove old user-facing decimal display controls when the current task includes cleanup of that area.

When removing decimal display controls, also remove:

- display decimal state
- rounding state
- localStorage keys for removed rounding/display settings
- helper IDs tied only to removed decimal controls
- copy that says users can choose decimal output precision
- aria-describedby references to removed controls

Do not remove:

- robust money parsing
- exact/rational/scaled math
- validation logic
- currency formatting
- print/export behavior
- accessibility for remaining controls
- core calculation logic

Good trust copy:
“Calculations preserve precision internally, while displayed money values are rounded to cents.”

## Money parsing and calculation rules

Preserve robust input parsing.

The calculator should continue to handle reasonable input formats such as:

- `1250`
- `1250.50`
- `$1,250.50`
- `.5`
- `12.`
- clearly valid comma-decimal formats where supported

Do not allow invalid, ambiguous, or negative rent amounts unless the route specifically supports them.

Preserve exact/rational/scaled calculation logic where it exists.

Do not replace decimal-safe math with floating-point shortcuts.

Do not create misleading `0` results for invalid input.

Validation errors should be clear and user-facing.

## Currency rules

Preserve expanded currency support where present.

Common supported currencies include:

- USD
- CAD
- EUR
- GBP
- AUD
- NZD
- JPY
- CNY
- HKD
- SGD
- INR
- KRW
- CHF
- SEK
- NOK
- DKK
- MXN
- BRL

Validate localStorage currency values before using them.

Do not let unsupported currency values break formatting.

## LocalStorage rules

Validate anything loaded from localStorage before using it.

Do not trust localStorage blindly.

Preserve useful localStorage behavior for:

- amount
- period/frequency
- currency
- route-specific calculator inputs

Remove localStorage handling for deleted controls.

Handle unavailable localStorage safely when needed.

## Export, print, and download rules

Preserve print/export behavior where it exists.

For pages with outputs or breakdowns, preserve or add print/save-PDF and CSV/export behavior when the current task asks for it.

Print output should be clean:

- hide UI-only controls
- preserve the result
- preserve useful assumptions
- avoid awkward clipping
- avoid unnecessary navigation blocks
- maintain readable spacing

Exported values should reflect displayed calculation results and current inputs.

Do not break browser print/save PDF behavior.

## Accessibility rules

Preserve accessibility attributes unless improving them or removing attributes tied to deleted controls.

Maintain or add:

- semantic headings
- labels for inputs and selects
- aria-describedby for useful help/error text
- aria-live for validation or result updates where appropriate
- visible focus states
- keyboard-accessible controls
- non-color-only feedback
- clear button text or aria-labels

Do not remove accessibility because it is inconvenient.

## Error and validation message rules

Errors should explain what went wrong and what to do next.

Avoid vague messages when the issue is known.

Good examples:

- “Enter a rent amount.”
- “Rent amount cannot be negative.”
- “That number format is ambiguous. Try 1250.50 or 1,250.50.”
- “Choose a supported currency.”
- “Enter income before calculating rent as a percentage.”

Do not expose stack traces, internal paths, or raw technical errors to users.

## Page uniqueness rules

Each route must have a clear reason to exist.

Examples:

- weekly to monthly focuses on weekly listings, PW to PCM, true monthly equivalent, and why multiplying by 4 is wrong
- monthly to weekly focuses on turning monthly rent into a weekly equivalent
- every 4 weeks focuses on 28-day cycles and 13 payments per year
- biweekly to monthly focuses on two-week payments and average monthly equivalent
- rent per paycheck focuses on paycheck budgeting
- rent as percentage of income focuses on affordability and income share
- rent increase focuses on old rent, new rent, monthly change, and yearly impact
- rent increase percentage focuses on percent change between old and new rent
- rent split focuses on equal shares, roommates, or income-based shares
- rent due date focuses on upcoming payment dates and planning
- hub pages focus on choosing the right calculator

Do not use the same intro, same supporting copy, or same metadata across many routes.

## Content cleanup rules

Remove or rewrite content that is:

- stale
- misleading
- repetitive
- generic
- unrelated to the calculator
- written like filler
- duplicated across pages
- likely to produce weak snippets
- harmful to trust
- not useful to someone trying to complete the calculation

Add content only when it:

- clarifies the tool
- improves snippet quality
- explains a calculation assumption
- helps users avoid a common mistake
- improves route uniqueness
- supports the page’s search intent
- improves internal navigation to a related existing calculator

## Trust signal rules

Add concise trust-building language only where useful.

Good examples:

- “No signup required.”
- “Your calculation runs in the browser.”
- “Calculations preserve precision internally, while displayed money values are rounded to cents.”
- “The calculator uses stated assumptions so the result is easy to check.”
- “This does not include utilities, deposits, parking, or fees unless you add them yourself.”
- “Print or save the result as a PDF from your browser.”

Do not overdo trust copy.

Do not add fake authority.

Do not claim legal, tax, or financial advice.

## TypeScript rules

Keep TypeScript strict and correct.

Do not use `any` casually when a proper type is reasonable.

Do not ignore TypeScript errors.

Do not suppress errors unless there is a clear reason and the code already uses that pattern.

Do not change existing type exports unless fixing a direct bug or the current task explicitly asks for it.

Prefer small, clear helpers over tangled route-level logic.

## Full code output rules

When asked for full code:

- return complete changed files
- do not omit imports
- do not omit helper functions
- do not use placeholders
- do not use ellipses
- do not say “same as before”
- do not provide only a patch unless the user explicitly asks for a patch

When not asked for full code:

- provide concise implementation guidance
- identify exact files or areas to change where possible
- explain risks and assumptions clearly

## Verification before finishing

Before finalizing changes, verify logically:

- the app still compiles
- the calculator still works
- existing calculation logic is preserved
- internal decimal-safe math is preserved
- displayed money values are rounded to cents
- removed decimal controls no longer have state, localStorage, helper IDs, or aria references
- existing amount, period, and currency behavior is preserved where applicable
- imported component-managed sections remain intact unless intentionally refactored
- title and H1 match route intent
- meta description is specific and clickable
- Open Graph and Twitter metadata match route intent
- snippet-worthy intro appears near the top
- UI-only controls use `data-nosnippet` where appropriate
- canonical, og:url, and schema URL match the route
- no non-whitelisted links were added
- no non-existent routes were linked
- styling remains consistent with the home page
- headings use `text-sky` classes where applicable
- buttons and interactive controls use `cursor-pointer`
- hover and focus states are preserved
- print/export behavior still works
- route-specific content did not become generic
- repeated code was extracted only where it clearly helped maintainability
- no unrelated routes were modified unless a shared helper/component extraction required a small safe update

Run available checks when possible:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm test`

If a command is unavailable or fails for unrelated existing reasons, state that clearly.
