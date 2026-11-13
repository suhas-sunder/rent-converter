# RC-001 — Independent competitor, policy and ads.txt evidence

**Observed:** November 12, 2026, America/New_York (HTTP observations 2026-11-13 04:35–04:37 UTC).
**Scope:** independent research supporting implementation; not release acceptance or an AdSense approval prediction.
**Production reference:** `50c4647e5a61f05e1aeb4db04f4918bbfb6c1c5a`; immutable deployment `https://6ad02cf4ac34d1b203b9b866--rent-converter.netlify.app` (production SHA verified by lead agent through Netlify).

## Evidence boundaries

- Read the release program, RC-000, RC-001, RC-002 and protected advertisement directive. Inspected prior audit findings, home implementation, paycheck calculator, generated calculator infrastructure, robots, ads.txt, ad placeholder and audit scoring source. `ai-issues/README.md` is empty on the inspected branch.
- Used real browser interactions in the in-app browser for Splitwise, Zillow, Moneysmart and OpenRent. All entered figures are synthetic test examples. No accounts, real household finances, applications or property inquiries were submitted.
- Browser screenshots of Splitwise, Zillow and OpenRent results were viewed in the research tool transcript. These were not exported as durable repository screenshot artifacts. This report must not be represented as the required five-viewport candidate screenshot suite.
- MoneyHelper was reviewed through its live published page, not a completed interactive scenario. Consumer Affairs Victoria returned its official outage page, so its calculator was not accepted as a tested competitor.
- This pass did not perform RentConverter's full canonical-route interaction matrix, screen-reader testing, or hosted candidate acceptance. Those remain separate gates.

## ads.txt: no repository fix justified

Actual `curl.exe` GET requests followed redirects and captured headers/body. HEAD requests independently confirmed HTTPS apex and www behavior.

| Request | Observed response chain | Final body |
| --- | --- | --- |
| `https://rentconverter.com/ads.txt` | 301 to HTTPS www; 200 | Existing seller record |
| `https://www.rentconverter.com/ads.txt` | 200 | Existing seller record |
| `http://rentconverter.com/ads.txt` | 301 to HTTPS apex; 301 to HTTPS www; 200 | Existing seller record |
| `http://www.rentconverter.com/ads.txt` | 301 to HTTPS www; 200 | Existing seller record |
| Immutable deploy `/ads.txt` | 200 | Existing seller record |

The same record is present in `public/ads.txt`, `origin/main:public/ads.txt` and all five fetched bodies:

```text
google.com, pub-4810616735714570, DIRECT, f08c47fec0942fa0
```

Final responses report `Content-Type: text/plain; charset=UTF-8`, `Content-Length: 58`, ETag `0fffa990fb3a990be51214fecc61f80d-ssl`, and `Cache-Control: public,max-age=0,must-revalidate`. Production requests traversed Cloudflare with `cf-cache-status: DYNAMIC`; Netlify supplied the successful response. No production `X-Robots-Tag: noindex` was observed on ads.txt. The immutable Netlify URL has the expected `X-Robots-Tag: noindex` preview/permalink header.

Both robots endpoints were fetched: apex 301 to www, final 200. The file allows the root, specifically permits Googlebot, AdsBot-Google and Mediapartners-Google, and has no `/ads.txt` disallow. Repository and live robots content agree on these relevant rules.

**Decision: KEEP ads.txt unchanged.** This observation disproves a currently missing public file from this client/location; it cannot prove Google's own latest fetch outcome or publisher-account ownership. No authenticated AdSense account was inspected. The November 1 screenshot remains a dated account observation. The existing seller ID was not substituted or independently certified against the account.

Google defines **Not found** as the result of the crawler's last visit, distinct from site approval and **Unauthorized**. Google also states that ads.txt updates may take days or up to a month where ad requests are low, and advises keeping a correctly configured file in place. A delay is plausible, not established as this account's cause. Sources: [AdSense status meanings](https://support.google.com/adsense/answer/12170222), [ads.txt crawler troubleshooting](https://support.google.com/adsense/answer/7679060).

Commands to repeat without changing account or hosting settings:

```powershell
curl.exe -sS -L -D - https://rentconverter.com/ads.txt
curl.exe -sS -I -L https://rentconverter.com/ads.txt
curl.exe -sS -L -D - https://www.rentconverter.com/ads.txt
curl.exe -sS -I -L https://www.rentconverter.com/ads.txt
curl.exe -sS -L -D - http://rentconverter.com/ads.txt
curl.exe -sS -L -D - http://www.rentconverter.com/ads.txt
curl.exe -sS -L -D - https://6ad02cf4ac34d1b203b9b866--rent-converter.netlify.app/ads.txt
curl.exe -sS -L -D - https://rentconverter.com/robots.txt
curl.exe -sS -L -D - https://www.rentconverter.com/robots.txt
```

## Protected advertisement implementation

`app/client/components/advertising/AdPlaceholder.tsx` describes and implements static reserved space. It has no provider loading or fill-detection lifecycle. Source searches found no `adsbygoogle` integration. Therefore the owner's global first-filled-ad suppression directive is an invariant to preserve before a future integration, not a behavior this source currently demonstrates. Do not assert otherwise. No ad component, placeholder, fill rule, account setting or production layout was changed in this research pass. Genuine rendered-ad overlap acceptance remains untested and would require the owner's explicit authorization for any lifecycle replacement.

## Current primary guidance and what it changes in acceptance

Google's [AdSense page readiness guidance](https://support.google.com/adsense/answer/7299563) asks for visitor-relevant original value, usable navigation and a layout that helps people find what they need. A long page or a technically valid calculator is not itself evidence of a distinctive experience.

[Search Central's people-first guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) explicitly rejects a preferred word count, asks whether a visitor finishes their goal, and suggests outside assessment. Apply that to independently reproducible tasks and output accuracy. Do not infer a manual Search action from the separate AdSense rejection.

The May 7 audit's 126 low-risk pages describe a historical structural crawl. Its old scoring function penalized non-support pages below 550 words and assigned risk from counts of detected signals. It did not prove original utility, successful task completion, or approval. Historical exports and old audit outputs must remain historical; the RC-002 settled period through November 10 is the supplied search baseline. No current page rankings were inferred here from six-month aggregates.

## Competitor workflows

### Splitwise — United States, room-value splitting

[Live tool](https://www.splitwise.com/calculators/rent). Completed three-step browser flow: entered total monthly rent **2,400**, kept two bedrooms, set Room 1 to **Large**, kept Room 2 **Normal**, and kept common spaces **Average**. The result displayed **1,331.67** and **1,068.33**, summing to 2,400. Room size, windows, closets, shared occupancy and private bathrooms are visible adjustment inputs. These are the competitor's modeled values, not independently validated fairness claims.

**Gap/opportunity:** an agreed room-weight or household-expense breakdown is more decision-useful than another equal-split synonym route. RentConverter can retain its simpler equal/income/percentage options and transparent math rather than copy Splitwise's subjective weighting. An income split must not be represented as objectively fair or compulsory.

### Zillow — United States, income plus expense context

[Live tool](https://www.zillow.com/rent-affordability-calculator). Browser scenario: monthly net income **4,000**, debts **300**, savings **500**, other expenses **1,000**. Displayed result was **1,760/month**, leaving **440/month**. Visible introduction discloses its assumed 25% tax rate when estimating gross income. The result screenshot's slider tooltip displayed 1,752 while its headline displayed 1,760; this is a consistency concern, not a pattern to copy. Rental-search follow-through is available.

**Gap/opportunity:** show take-home income, actual entered costs, savings and remaining money together. RentConverter should avoid inventing tax conversions or promising comfort/qualification. A transparent residual-budget result would be more useful than a gross-income ratio alone.

### Moneysmart — Australia, mixed-period household budgeting

[Live tool](https://moneysmart.gov.au/budgeting/budget-planner). Opened Home & utilities, entered **500 weekly** mortgage/rent and **300 quarterly** electricity. Annual home/utilities total became **27,200**: 26,000 rent plus 1,200 electricity. The visible summary showed expenses above zero entered income. Each cost has its own frequency; categories, local autosave, settings and result breakdown were observable. Published instructions also describe custom items, multiple budgets, currency symbols, print/PDF and an Excel alternative; those secondary operations were not executed here.

**Gap/opportunity:** prevent adding unlike periods directly. Separate rent from utilities/parking/insurance and normalize each explicitly. Its tested weekly annualization is 52 weeks; that does not authorize changing RentConverter's established 365-day rent-conversion basis.

### OpenRent — United Kingdom, screening estimate and search

[Actual calculator location](https://www.openrent.co.uk/find-flats-and-houses-for-rent-online). Entered synthetic annual household salary **36,000**, pressed Calculate, observed monthly rent estimate **1,200**. The tool sits within rental search, near commute, pet and other search options. The initially attempted `/rent-affordability-calculator` URL showed a genuine 404; the current location was found through OpenRent's own [referencing help page](https://help.openrent.co.uk/hc/en-gb/articles/18707806101009-How-much-does-an-applicant-need-to-earn-to-pass-referencing). That help page describes its own 2.5-times annual rent tenant screening rule and cautions that other factors affect the overall result.

**Gap/opportunity:** link a result to a logical next action, but distinguish a screening benchmark from a household's affordable spending. RentConverter already supports richer period and currency comparison than this single-input estimate.

### MoneyHelper — United Kingdom, budget planning reference

[Published product page](https://www.moneyhelper.org.uk/en/everyday-money/budgeting/budget-planner). Its documented workflow totals income and outgoings, shows what remains, permits a separate time period per entry, and directs users to subsequent budgeting steps. This was page/documentation inspection only; no completed calculation is claimed.

**Opportunity:** use a compact renter-focused budget rather than require the user to mentally combine separate calculators. Keep scope bounded to housing decisions; a complete personal-finance suite is not necessary for useful rent planning.

## RentConverter advantages to preserve and evidence-driven priorities

Source review shows the homepage already converts seven periods, displays multiple equivalent results and a four-week/monthly difference, uses rational BigInt arithmetic and supports 18 currencies. Print/PDF, persistent validated inputs and explanatory assumptions already exist. Simply moving those same values to another card does not create a missing capability.

1. **Investigate a concrete units error:** homepage FAQ currently advises adding fixed monthly costs to entered rent before converting without requiring matching periods. With weekly rent this mixes units. Correct the directly broken explanation or build separate-period cost inputs; do not change core conversion math. This finding is based on source, not an observed changed candidate.
2. **Actual paycheck timing:** current paycheck tool explicitly does not calculate pay dates. Equal annual allocations can look sufficient while cash is unavailable before a near-term due date. A dated reserve calculation could reveal the gap without making income, tax or legal claims. Require tests around monthly anchors, leap days, same-day availability and initial balance.
3. **Mixed-period housing totals:** allow different billing periods and distinguish recurring spend from refundable deposits/upfront cash. This lets two differently advertised rentals be compared consistently.
4. **Named comparisons:** retain multiple listings locally and show differences on a shared basis, including costs. This is a reusable decision workflow, not a reason to add indexed URLs.
5. **Take-home budget:** current generated budget route discloses that it subtracts aggregate non-rent costs from gross monthly income. A separately labeled take-home view can remove mental tax adjustment, without fabricated withholding assumptions.

## Acceptance still required

Before calling a candidate ready: full source/built canonical and alias audit, exact-SHA hosted preview, actual RentConverter tasks at all five widths, keyboard/errors/print/no-JS and saved-state evidence, protected-winner regressions, preview network isolation, and independent review of the implemented result. No feature, weekly release or production change is accepted by this research report alone.
