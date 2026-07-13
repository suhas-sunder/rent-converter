# AGENTS.md

## Project context

This is RentConverter.com, a React Router / Remix-style calculator site for rent conversion, rent affordability, rent increases, rent splitting, rent due dates, paycheck-based rent planning, and related rental math.

The site is SEO-driven and ad-supported, but the calculators must stay useful, fast, trustworthy, and easy to use. The calculator experience comes first.

RentConverter is currently in SEO recovery mode after a major collapse in Google Search Console clicks and impressions. Treat this as a quality, trust, and indexation recovery project, not a normal content expansion project.

Future edits should improve:

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
- indexation discipline
- sitemap quality
- consolidation of overlapping pages
- reduction of thin or low-delta pages

Do not optimize for search in a way that harms the user experience.

Do not create more pages just because a keyword exists.

## Recovery-mode priority

The current priority is to make the site smaller, stronger, more trustworthy, and more clearly useful.

High-priority recovery goals:

1. Preserve and improve the core calculators.
2. Remove, noindex, or redirect thin programmatic pages.
3. Consolidate overlapping search intents into stronger canonical pages.
4. Reduce homepage, sitemap, and internal-link sprawl.
5. Add clearer methodology, assumptions, authorship, source, and review signals.
6. Improve page uniqueness and snippet quality.
7. Keep calculator UX fast, clean, and useful.

Do not make the indexed site larger unless the current task explicitly asks for a new route and the new route passes the indexability rules below.

## Human-first content and site-quality rules

Write for the person trying to complete a rental calculation or understand the result, not for a search engine.

Before adding or expanding content, ask:

- Does this answer the user’s actual question completely?
- Does it help the user complete a task, avoid a mistake, compare options, or understand an assumption?
- Does it add original value through calculator behavior, route-specific examples, methodology, comparisons, or practical interpretation?
- Would the page still deserve to exist if it received no search traffic?
- Is the content genuinely useful, or is it merely adequate keyword coverage?
- Does the page duplicate a stronger route with different wording?

Do not add paragraphs merely to increase word count, include more keywords, or mention every related phrase.

A strong page should provide the amount of explanation the task requires. Some calculator pages need only a short intro, clear inputs, a useful result, methodology, assumptions, and next-step links. Guide and reference pages may need deeper coverage, sources, examples, and visible authorship.

Audit supporting content as carefully as core pages. A collection of weak supporting pages can reduce the perceived quality of the site even when the main calculators are useful.

For each indexable page, verify that it covers the necessary concepts and entities for that user task. Add missing concepts only when they materially improve understanding. Do not turn every calculator into a broad rental guide.

Original value can include:

- a useful interactive calculation
- an explanation of the exact formula
- a comparison users commonly misunderstand
- route-specific assumptions and exclusions
- worked examples generated from verified calculator logic
- clear interpretation of the result
- source-linked regional information
- practical next steps
- transparent limitations
- first-hand implementation or testing details where relevant

Do not present generic summaries as original expertise.

When a page is useful only because it targets a query variation, prefer merging, noindexing, redirecting, or deleting it.

## Hard SEO guardrails

Do not create new indexable pages for:

- exact rent amounts
- exact salary amounts
- exact currency + amount combinations
- keyword spelling variants
- synonym-only variants
- near-duplicate regional variants
- thin “answer” pages that only hard-code one calculation
- pages that differ only by number, currency, region label, or phrasing
- programmatic pages whose main value is capturing long-tail searches

Examples of page families that should not be expanded:

- `$170 per week to monthly rent`
- `500 euros per week to monthly rent`
- `190 pounds per week to PCM`
- `how much rent can I afford on 50k`
- `how much rent can I afford on 60k`
- `weekly rent to monthly rent in [minor location]`
- currency-only clones of the same converter page

A page should be indexable only if it solves a meaningfully distinct user problem.

A page is usually worth indexing only when it has most of the following:

- a distinct user task, not just a distinct keyword
- materially different calculator logic, assumptions, examples, or local context
- enough original explanation to deserve to exist without search traffic
- clear methodology and assumptions
- visible trust or authorship context
- official or authoritative sources where laws, regional rules, or financial guidance are discussed
- a deliberate role in the site architecture
- internal links that help users take a next logical action

If a page cannot meet those conditions, prefer consolidation, noindex, or redirect.

## Page-family decisions

Before modifying a route family, classify it as one of:

- `keep`
- `improve`
- `merge`
- `noindex`
- `redirect`
- `delete`

Use these definitions:

### Keep

Use for strong calculator pages with a distinct user task and useful calculator-first UX.

Examples:

- main rent converter
- weekly to monthly rent converter
- monthly to weekly rent converter
- rent paid every 4 weeks calculator
- rent per paycheck calculator
- rent affordability calculator
- rent budget calculator
- prorated rent calculator
- rent schedule calculator
- rent split calculator
- rent increase calculator

### Improve

Use for pages that deserve to exist but need better trust, methodology, route-specific copy, metadata, examples, UX, or internal links.

### Merge

Use when several pages answer the same intent with minor wording, currency, or number changes.

Merged pages should normally point to the strongest parent route.

Example:

- exact weekly amount pages should merge into the weekly-to-monthly converter
- exact salary pages should merge into a stronger affordability or salary-to-rent calculator
- synonym pages should merge into the clearest canonical route

### Noindex

Use when a page or result state is useful to visitors but should not compete in search.

Good candidates:

- generated answer/result pages
- utility pages
- highly specific pages that duplicate a parent calculator
- pages kept for UX continuity but not for organic search

Noindexed pages should normally be removed from XML sitemap and prominent homepage navigation.

### Redirect

Use when a page has little standalone value but has a clear stronger replacement.

Prefer 301 redirects for retired routes when:

- the replacement page satisfies the same or broader intent
- the retired page has impressions, links, or history
- keeping the page indexed would weaken site quality

### Delete

Use only when the page has no user value, no traffic value, no internal role, and no useful replacement beyond a broad parent route.

Do not delete pages casually. Prefer a redirect when there is a clear replacement.

## Indexation rules

Every public route must have an explicit indexation decision.

Indexable pages must have:

- unique title
- unique meta description
- unique H1
- route-specific intro copy
- correct canonical URL
- correct og:url
- correct schema URL
- useful route-specific supporting copy
- contextual internal links to existing routes only
- visible assumptions or methodology where calculation logic may be misunderstood
- calculator-first UX

Noindexed pages must:

- include the correct robots directive
- be removed from XML sitemap
- not be promoted as primary homepage destinations
- not receive large internal-link blocks
- canonicalize carefully according to the current route strategy

Do not leave low-value pages indexable just because they already exist.

## Sitemap rules

The XML sitemap should include only URLs intended for indexing.

Do not include:

- noindexed pages
- utility-only result pages
- exact-answer amount pages unless explicitly approved
- salary-answer pages unless explicitly approved
- thin programmatic variants
- duplicate or near-duplicate route variants
- routes redirected elsewhere
- legal pages unless they are intentionally indexable

The HTML sitemap should be useful for humans. It should not expose every low-value programmatic route family.

When pruning or noindexing a route family, update the sitemap generation logic in the same task.

## Homepage source of truth

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

The homepage itself should not become a giant SEO directory. It should act as a task-based navigation page that helps users choose the right calculator.

Good homepage task groups:

- compare rent periods
- plan rent by paycheck
- estimate affordability
- split rent
- calculate prorated rent or rent schedules
- estimate rent increases

Avoid giant link blocks that surface every exact-answer, salary-answer, synonym, or low-value programmatic route.

When a new prompt conflicts with the home page, follow the new prompt only for that specific requested change and keep everything else aligned with the home page.

## Core rule

Before editing, inspect the relevant files.

Do not guess from the prompt alone. Identify the current route behavior, state flow, calculation flow, imports, component usage, localStorage keys, conversion math, validation logic, result rendering, print/export behavior, metadata, schema, canonical URLs, internal links, route whitelist usage, sitemap exposure, and supporting content before changing code.

Prefer small, reviewable changes over sweeping rewrites.

Only implement the task requested in the current prompt. Do not implement unrelated improvements from other prompts, older plans, or general ideas unless the user explicitly asks for them.

## Codex workflow rules

For SEO recovery work, use this workflow unless the user asks for a narrower direct edit:

1. Inspect the relevant files.
2. Identify route family and indexability status.
3. Identify sitemap, homepage, and internal-link exposure.
4. Identify canonical, robots, schema, and metadata behavior.
5. Make the smallest safe change.
6. Add or update tests where reasonable.
7. Run available checks.
8. Summarize changed files, user-facing effect, SEO effect, and validation.

For large route-family cleanup, do not code immediately. First produce:

- route family inventory
- recommended keep / improve / merge / noindex / redirect / delete decision
- affected files
- redirect/noindex map
- risks
- validation plan

Do not use Codex to mass-produce new pages.

Do not preserve bad patterns just because they already exist in the repository.

## Worktree, validation, commit, and push rules

Related fixes may accumulate across multiple safe Codex passes when they belong to the same major workstream.

Keep the worktree uncommitted while the changes remain part of the same coherent workstream.

After each meaningful batch:

- inspect the diff
- run the relevant available checks
- report changed files
- report validation results
- report known risks
- report the current worktree state

Do not automatically commit after each pass.

Do not commit or push unless the user explicitly asks.

Create a milestone commit only when the full major set is:

- coherent
- reviewed
- stable
- validated
- ready to act as a useful rollback point

Use a smaller isolated commit only when isolation is genuinely useful, such as:

- a risky architecture change
- a deliberate rollback point
- a migration that should stand alone
- an unrelated workstream
- a change that must be reviewed independently

Push only after the milestone commit passes final validation and the user explicitly asks to push.

Do not discard, reset, overwrite, or clean unrelated uncommitted work.

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
- pruning, noindexing, merging, or redirecting a verified low-value route as part of an explicit cleanup task
- the current task explicitly requires it

Do not remove useful existing features to simplify implementation.

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

Avoid:

- giant walls of links above the calculator
- footer-like route dumps in the main content
- exact-answer page blocks
- salary-answer page blocks
- links whose only purpose is distributing PageRank
- links to noindexed or redirected routes unless required for UX

## Internal linking architecture and topical coverage

Internal linking should reflect real user journeys, not keyword clusters alone.

Build and maintain clear task hubs such as:

- compare rent periods
- understand weekly, monthly, 4-week, and annual equivalents
- plan rent around paychecks
- estimate rent affordability and income share
- calculate rent increases
- split rent
- calculate prorated rent
- plan rent dates and schedules
- understand rental terminology such as PW, PCM, and PCW

Each important page should be reachable through a logical path from the homepage or a relevant hub.

During audits, identify:

- orphaned indexable pages
- important pages buried too deeply
- weak pages receiving excessive internal links
- navigation blocks that promote noindexed or redirected pages
- links that point to weaker duplicates instead of the canonical page
- repeated link modules that add little user value
- pages that need a useful next step but have none

Use anchor text that explains what the user will find next.

Good examples:

- “Compare this with rent paid every 4 weeks”
- “Convert the monthly result back to a weekly amount”
- “Estimate how much of your income would go to rent”
- “See the yearly cost after the increase”
- “Split this rent by roommate income”

Avoid:

- repetitive exact-match anchors
- anchors written only to target a query
- vague anchors such as “click here”
- adding the same large related-links block to every route
- linking every page to every loosely related page

Topical coverage should be complete for the route’s task, but bounded.

Do not add unrelated entities or topics merely to make a page appear comprehensive.

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

Do not imply legal, financial, tax, or tenancy advice.

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

Keep schema accurate, visible-content-aligned, and route-specific.

Allowed safe updates:

- WebPage name
- WebPage description
- WebPage URL
- WebApplication schema where appropriate
- WebSite schema if needed for consistency
- Organization schema on the homepage if implemented accurately
- BreadcrumbList schema on internal pages if visible breadcrumbs or clear hierarchy exists
- Article schema only for guide-style pages where article-like visible content exists
- canonical URL
- Open Graph URL

Do not add unsupported or misleading schema.

Do not add FAQ schema unless visible FAQ content exists.

Do not edit FAQ schema, FAQPage structured data, FAQ arrays, or FAQ copy unless the current task explicitly asks for FAQ cleanup or the FAQ is directly broken.

Canonical URL, og:url, and WebPage schema URL must match the actual route slug.

Schema must not claim reviews, ratings, legal authority, professional credentials, or organizational details that are not visibly supported on the page.

## Trust and source rules

Add concise trust-building language only where useful.

Good examples:

- “No signup required.”
- “Your calculation runs in the browser.”
- “Calculations preserve precision internally, while displayed money values are rounded to cents.”
- “The calculator uses stated assumptions so the result is easy to check.”
- “This does not include utilities, deposits, parking, or fees unless you add them yourself.”
- “Print or save the result as a PDF from your browser.”

For pages involving affordability, rent increases, legal rules, regional rules, or tenancy policy:

- include clear assumptions
- include “not legal or financial advice” where appropriate
- include last reviewed or last updated information where supported
- include official or authoritative sources where claims depend on region-specific rules
- avoid overclaiming
- avoid pretending the calculator can determine eligibility, legality, or exact obligations

Do not add fake authority.

Do not add fake testimonials.

Do not claim professional review unless a real reviewer exists.

## EEAT, authorship, credibility, and methodology architecture

E-E-A-T is not a single technical score. Trust, transparency, accurate ownership, useful methodology, and source discipline should be visible where users reasonably expect them.

Primary creator positioning:

- Suhas Sunder is the creator and maintainer of RentConverter.
- Suhas is a software engineer.
- Suhas is an engineering graduate and master’s-degree holder.
- Suhas builds production web applications and focused browser-based tools.
- Relevant authority is calculator design, implementation, testing, browser-based tooling, clear assumptions, and maintainable software.
- Relevant domain-adjacent experience may include building software that supported real estate workflows when this is visibly and accurately stated.

Do not present Suhas as:

- a lawyer
- a licensed financial advisor
- a housing authority
- a tenant-board expert
- a property manager
- a government source
- a rent-control legal expert
- an independent reviewer of his own work

Do not publish institution names, exact degree details, or credential specifics unless the user explicitly approves them for public display.

Preferred trust architecture:

- a strengthened About page
- a canonical author page at `/author/suhas-sunder`
- a methodology or editorial page such as `/how-rentconverter-is-made`
- concise source and correction information
- compact route-specific methodology notes
- visible bylines only on guide or reference pages where authorship is expected
- careful schema that matches visible content

The About page should explain:

- who created and maintains RentConverter
- why the site exists
- what kinds of calculations it provides
- how calculation quality and assumptions are approached
- what the site does not claim to be
- how users can report errors or corrections

The author page should include only accurate, visible information:

- name
- profile image when provided
- role
- concise bio
- conservative credential wording
- what Suhas does on RentConverter
- selected relevant work
- strongest relevant profile links
- links to About, Contact, and methodology
- a meaningful visible last updated date

Before final author/profile implementation, remind the user to provide a suitable bio image. Do not invent or substitute a profile image.

The methodology/editorial page should explain:

- who maintains the site
- how formulas are selected and implemented
- how calculators are tested
- how precision and display rounding are handled
- how assumptions and exclusions are presented
- how browser-based calculations and local storage are used where relevant
- how regional or legal claims are sourced
- what RentConverter does not claim to provide
- how corrections, bugs, accessibility issues, and source concerns can be reported

Visible bylines are appropriate for substantial guide and reference pages.

A compact byline may use a pattern such as:

“By Suhas Sunder · Software engineer and creator of RentConverter · Last updated: [date]”

Do not add bulky author cards to:

- the main converter
- simple calculator interfaces
- pure utility pages
- generated result pages
- exact-answer pages
- noindexed pages
- redirected pages

On pure calculator pages, prefer a compact methodology or “How this calculation works” note below the calculator or result.

Do not add:

- fake reviewer language
- self-review presented as independent review
- fake professional review
- fake badges
- unsupported trust claims
- “trusted by thousands” claims without real support
- hidden credential claims
- schema claims not visible on the page
- author boxes added only to manipulate rankings

Structured data rules for trust pages:

- use `ProfilePage` and `Person` on the visible author page when accurate
- use `Organization` where visible site identity supports it
- use `Article` only on guide or reference pages with visible byline and dates
- use `WebApplication` or `SoftwareApplication` only where appropriate for the actual tool
- use `sameAs` only for confirmed public profiles
- use credential fields only when the same information is visible on the author page
- do not use `reviewedBy` unless a real independent reviewer exists and is visibly identified

Author, creator, publisher, and reviewer properties must reflect the real role shown to users.

## Date, review, source, and correction discipline

Visible dates must be accurate and meaningful.

Do not update dates merely to create a freshness signal.

Change a visible “Last updated” or “Last reviewed” date only when the page received a meaningful review or content change.

When structured data uses `dateModified`, it must match the visible page date.

For regional, legal, affordability, or financial-planning content:

- identify the source of any rule, threshold, or legal claim
- prefer official government, regulator, tenancy, or primary sources
- link to sources where useful
- state the applicable jurisdiction and assumptions
- state the review date when the information can change
- explain limitations
- include a concise legal or financial advice caveat where appropriate

Do not cite sources that do not support the nearby claim.

Do not add citations merely for appearance.

The site should provide a clear correction path for:

- calculation errors
- outdated source information
- broken links
- accessibility problems
- misleading copy
- regional or legal concerns

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

If those sections are imported components, preserve the imports and component usage unless an import is genuinely unused after related cleanup.

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
- author or reviewer blocks
- source lists
- breadcrumb components

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
- robots/indexability helpers
- sitemap filtering helpers
- redirect map helpers

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

Remove, rewrite, noindex, merge, or redirect content that is:

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
- built primarily around keyword permutations
- low-delta compared with a stronger parent page

Add content only when it:

- clarifies the tool
- improves snippet quality
- explains a calculation assumption
- helps users avoid a common mistake
- improves route uniqueness
- supports the page’s search intent
- improves internal navigation to a related existing calculator
- improves trust, methodology, or source clarity

Do not add content just to make a page longer.

## Region-specific rules

Region-specific pages require extra care.

Only keep or create a region-specific calculator page when at least one of these is true:

- the calculation logic is materially different by region
- the rules are materially different by region
- the terminology is materially different by region
- official sources can be cited or surfaced
- the route solves a distinct regional user task

Do not create thin regional variants that reuse the same generic calculator with a region name swapped in.

For region-specific rent increase, rent rules, lease rules, or affordability claims:

- include official source references where possible
- include last reviewed date where supported
- include clear caveats
- do not guarantee legal correctness
- do not imply professional legal advice
- keep the calculator assumptions visible

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

## Post-deployment monitoring rules

SEO recovery and quality improvements must be evaluated by page group, not only by sitewide totals.

After relevant deployments, monitor:

- Google Search Console clicks
- impressions
- CTR
- average position
- indexed URL count
- excluded URL count
- canonical selection
- crawl errors
- sitemap processing
- performance by core calculator family
- performance by guide/reference family
- performance of routes that were merged, redirected, or noindexed
- Core Web Vitals
- unexpected snippet changes

Do not request indexing for large groups of weak pages.

Request indexing only for strong canonical pages that have materially changed.

Do not reverse pruning decisions solely because sitewide impressions temporarily decline while weak URLs leave the index.

Do not claim that an SEO change guarantees recovery or rankings.

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
- robots directives match the route’s indexation decision
- sitemap inclusion matches the route’s indexation decision
- no noindexed routes remain in XML sitemap
- no redirected routes remain in XML sitemap
- no non-whitelisted links were added
- no non-existent routes were linked
- homepage links do not expose low-value route families
- styling remains consistent with the home page
- headings use `text-sky` classes where applicable
- buttons and interactive controls use `cursor-pointer`
- hover and focus states are preserved
- print/export behavior still works
- route-specific content did not become generic
- repeated code was extracted only where it clearly helped maintainability
- no unrelated routes were modified unless a shared helper/component extraction required a small safe update
- important indexable pages are not orphaned
- internal links follow real user paths rather than keyword distribution
- visible author and credential claims match structured data
- no self-review is presented as independent review
- visible update dates match structured data dates
- sources support the claims they accompany
- author/profile implementation does not use a placeholder image as the final asset
- the current worktree remains uncommitted unless the user explicitly requested a commit

Run available checks when possible:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm test`

If a command is unavailable or fails for unrelated existing reasons, state that clearly.

## PR summary requirements

When finishing a task, summarize:

- files changed
- user-facing changes
- SEO/indexation changes
- calculator behavior changes
- routes added, removed, noindexed, or redirected
- sitemap changes
- internal-link changes
- tests/checks run
- checks that could not be run
- risks or follow-up work
- current worktree status
- whether any commit or push was performed

Do not claim recovery is guaranteed.

Do not commit or push unless the user explicitly requested it.
