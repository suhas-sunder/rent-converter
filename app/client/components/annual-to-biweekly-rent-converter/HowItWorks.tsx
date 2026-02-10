import { Link } from "react-router";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm rc-no-print"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
      </div>

      <div className="relative p-6 sm:p-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-700 tracking-tight leading-tight">
                  How the annual to biweekly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Convert a yearly rent total into a true 14-day equivalent so
                  you can compare it to pay cycles, budgeting rules, or a
                  landlord quote that is listed as “biweekly.” This page uses a
                  fixed time-length basis (365-day year, 14-day period) and keeps
                  all breakdown rows anchored to the same annual total. If you
                  want to switch between any rent periods on one page, use the{" "}
                  <Link
                    to="/rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    rent converter
                  </Link>{" "}
                  or the universal rent converter.
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-600 leading-7 max-w-2xl">
                  <li>
                    Use the biweekly number to test affordability against a
                    biweekly budget cap or payroll cadence.
                  </li>
                  <li>
                    Use the breakdown table to make different listing styles
                    comparable without shortcuts.
                  </li>
                  <li>
                    Treat results as equivalents, not billing rules or invoice
                    timing.
                  </li>
                </ul>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 14 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  365-day model
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual total
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DEFINITION
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  14-day equivalent
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  FORMULA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  annual × 14 ÷ 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Biweekly + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
              Related tools
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                When you need to jump between multiple period types on one page,
                the{" "}
                <Link
                  to="/rent-converter"
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent converter
                </Link>{" "}
                keeps all comparisons on a consistent basis.
              </li>
              <li>
                When a listing is priced biweekly and you want the annual
                equivalent for budgeting or reporting, the{" "}
                <Link
                  to="/biweekly-to-annual-rent-converter"
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  biweekly to annual converter
                </Link>{" "}
                applies the same model in reverse.
              </li>
              <li>
                When you are comparing a weekly price to a 14-day price without
                mixing “twice per month” assumptions, the{" "}
                <Link
                  to="/weekly-to-biweekly-rent-converter"
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  weekly to biweekly converter
                </Link>{" "}
                makes that comparison directly.
              </li>
              <li>
                When you want a clean monthly benchmark from a yearly total
                (instead of “weekly × 4”),{" "}
                <Link
                  to="/annual-to-monthly-rent-converter"
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  annual to monthly
                </Link>{" "}
                keeps month math explicit.
              </li>
            </ul>
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 7h16M4 12h12M4 17h14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      What this converter returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <p>
                    You enter one annual rent total (currency per year). You get
                    a biweekly equivalent (currency per 14 days) plus a breakdown
                    table of other period equivalents derived from the same
                    annual anchor.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-semibold text-slate-900">
                        Budgeting:
                      </span>{" "}
                      compare the biweekly result to a biweekly housing budget or
                      payroll cycle.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Offer checks:
                      </span>{" "}
                      sanity-check a “biweekly” quote against an annual number so
                      you can spot small overcharges.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Comparisons:
                      </span>{" "}
                      use the breakdown rows to compare listings priced weekly,
                      4-week, monthly, or annual without mixing shortcuts.
                    </li>
                  </ul>

                  <p>
                    Results are time-length equivalents. This page does not
                    interpret lease terms, fees, or billing schedules.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      One-line summary
                    </div>
                    <p className="mt-2">
                      Biweekly equivalent = annual rent × 14 ÷ 365 (365-day year,
                      14-day period). Rounded values are for display; the model
                      stays anchored to the annual total.
                    </p>
                  </div>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Examples you can cross-check
                  </h3>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 1
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">
                        Situation
                      </div>
                      <p className="mt-1">
                        You are setting a hard cap of $950 per 14 days for rent.
                        A listing gives only an annual total.
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Numbers
                      </div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>Annual rent: $24,000</li>
                        <li>Biweekly cap: $950</li>
                      </ul>

                      <div className="mt-3 font-semibold text-slate-900">
                        Calculation
                      </div>
                      <p className="mt-1">
                        Biweekly = 24,000 × 14 ÷ 365 = 920.5479… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          $920.55
                        </span>
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Result
                      </div>
                      <p className="mt-1">$920.55 per 14 days</p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Meaning
                      </div>
                      <p className="mt-1">
                        It clears the $950 cap, so it stays in your shortlist
                        instead of being rejected on guesswork.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 2
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">
                        Situation
                      </div>
                      <p className="mt-1">
                        You receive $1,000 biweekly as a housing allowance. A
                        listing advertises a yearly total that “sounds fine.”
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Numbers
                      </div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>Annual rent: $27,600</li>
                        <li>Allowance: $1,000 per 14 days</li>
                      </ul>

                      <div className="mt-3 font-semibold text-slate-900">
                        Calculation
                      </div>
                      <p className="mt-1">
                        Biweekly = 27,600 × 14 ÷ 365 = 1,058.6301… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          $1,058.63
                        </span>
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Result
                      </div>
                      <p className="mt-1">$1,058.63 per 14 days</p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Meaning
                      </div>
                      <p className="mt-1">
                        The allowance is short by $58.63 every pay period, so the
                        decision flips from “maybe” to “not without a lower rent
                        or extra income.”
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 3
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">
                        Situation
                      </div>
                      <p className="mt-1">
                        Two options are priced differently: one is annual-only,
                        the other is quoted as a biweekly amount. You need a
                        fair comparison before choosing.
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Numbers
                      </div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>Option A annual total: $31,200</li>
                        <li>Option B biweekly quote: $1,200</li>
                      </ul>

                      <div className="mt-3 font-semibold text-slate-900">
                        Calculation
                      </div>
                      <p className="mt-1">
                        Option A biweekly = 31,200 × 14 ÷ 365 = 1,196.7123… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          $1,196.71
                        </span>
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Result
                      </div>
                      <p className="mt-1">
                        Option A: $1,196.71 per 14 days (equivalent) vs Option B:
                        $1,200 per 14 days (quoted)
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Meaning
                      </div>
                      <p className="mt-1">
                        Option A is slightly cheaper on the same 14-day footing,
                        so you do not overpay just because the pricing formats
                        differed.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Example 4
                    </div>
                    <div className="mt-2 text-sm text-slate-700">
                      <div className="font-semibold text-slate-900">
                        Situation
                      </div>
                      <p className="mt-1">
                        A landlord says the annual total is $52,000, but the lease
                        draft shows “$2,000 biweekly.” You want to spot a quiet
                        mismatch before signing.
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Numbers
                      </div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>Annual rent: $52,000</li>
                        <li>Quoted biweekly in draft: $2,000</li>
                      </ul>

                      <div className="mt-3 font-semibold text-slate-900">
                        Calculation
                      </div>
                      <p className="mt-1">
                        Biweekly equivalent = 52,000 × 14 ÷ 365 = 1,994.5205… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          $1,994.52
                        </span>
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Result
                      </div>
                      <p className="mt-1">
                        Equivalent biweekly is $1,994.52, not $2,000.
                      </p>

                      <div className="mt-3 font-semibold text-slate-900">
                        Meaning
                      </div>
                      <p className="mt-1">
                        The draft overstates the 14-day amount, so the decision
                        becomes “request correction before signing” instead of
                        accepting the paperwork as-is.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Definitions used on this page
                  </h3>
                  <p>
                    These definitions are fixed for the conversion and for every
                    breakdown row, so each value remains comparable under one
                    consistent basis.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-semibold text-slate-900">Day</span>:
                      1 day.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Week</span>
                      : 7 days.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Biweekly
                      </span>
                      : 14 days (not twice per month).
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        4-week
                      </span>
                      : 28 days.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Year</span>
                      : 365 days (fixed year basis on this page).
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Month
                      </span>
                      : average calendar month length implied by the year model,
                      which is 365 ÷ 12 days per month. This is not 4 weeks.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Hour</span>{" "}
                      (when shown): 1 hour, with a time-length yearly basis of
                      8,760 hours (365 × 24). This exists so hourly rows can
                      reconcile to the same annual basis as daily and weekly
                      rows.
                    </li>
                  </ul>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Core formula and conversion basis
                  </h3>
                  <p>
                    The annual total is the single source value. Every other
                    period is derived from that same annual anchor so comparisons
                    do not drift.
                  </p>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Exact formulas (annual as input)
                    </div>
                    <ul className="mt-3 list-disc pl-5 space-y-2">
                      <li>Daily = annual ÷ 365</li>
                      <li>Weekly = annual × 7 ÷ 365</li>
                      <li>Biweekly = annual × 14 ÷ 365</li>
                      <li>4-week = annual × 28 ÷ 365</li>
                      <li>
                        Monthly = annual ÷ 12 (equivalently: annual × (365 ÷ 12)
                        ÷ 365)
                      </li>
                      <li>Hourly (when shown) = annual ÷ 8,760</li>
                    </ul>

                    <div className="mt-4 text-sm text-slate-700">
                      <div className="font-bold text-slate-900">
                        Stepwise version (annual → daily → biweekly)
                      </div>
                      <div className="mt-2">Daily = annual ÷ 365</div>
                      <div>Biweekly = daily × 14 = (annual ÷ 365) × 14</div>
                    </div>

                    <p className="mt-4 text-sm text-slate-600">
                      If you are comparing two options, compare using the same
                      row type (biweekly-to-biweekly, monthly-to-monthly). Mixing
                      “biweekly” with “twice per month” assumptions is a common
                      source of mistaken rankings.
                    </p>
                  </div>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    What the breakdown table represents
                  </h3>
                  <p>
                    The breakdown table is a comparison aid: multiple period
                    equivalents for the same annual total, all calculated from
                    the annual anchor (not from the headline row).
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Use it to translate a weekly or monthly listing into the
                      same footing as an annual-only listing.
                    </li>
                    <li>
                      Use it to sanity-check “close enough” shortcuts that can
                      flip which option is actually cheaper.
                    </li>
                    <li>
                      Treat each row as an equivalent for decision-making, not
                      as a claim about how invoices land in a calendar month.
                    </li>
                  </ul>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Common mismatches and how this page treats them
                  </h3>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Weekly × 4 vs monthly
                      </div>
                      <p className="mt-2">
                        “Weekly × 4” is a 28-day amount. This page defines monthly
                        as annual ÷ 12 under a 365-day year. If you use weekly ×
                        4 as a proxy for monthly, you can mis-rank two listings
                        that are priced near your budget limit.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        4-week vs calendar month
                      </div>
                      <p className="mt-2">
                        A 4-week period is fixed at 28 days. A month here is the
                        average month implied by the year model (365 ÷ 12 days).
                        The tool keeps these separate so you can compare “every 4
                        weeks” listings without forcing them into a monthly label.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        "26 payments" vs time-length conversion
                      </div>
                      <p className="mt-2">
                        “26 payments” describes cadence, not equivalence. This
                        page uses a 14-day block over a 365-day year so the
                        biweekly figure is comparable to daily, weekly, and
                        monthly equivalents without assuming how a landlord
                        schedules invoices.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Hourly: paid-hours vs time-based hourly (when shown)
                      </div>
                      <p className="mt-2">
                        If an hourly row is shown, it is time-based (annual ÷
                        8,760). It is not tied to working hours, shifts, or a
                        workweek. Use it only to compare time-length equivalents,
                        not employment pay.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                    Scope and limits of this tool
                  </h3>
                  <p>
                    This converter only transforms the rent amount you enter. It
                    does not include utilities, parking, fees, deposits, taxes,
                    insurance, discounts, rent-free weeks, or proration. If those
                    change the true cost, compare totals that include them (or
                    add them consistently before converting).
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500 blur-3xl opacity-20" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-500 blur-3xl opacity-30" />
              </div>

              <div className="relative">
                <div className="text-sm font-semibold text-sky-300">
                  Scope note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-200">
                  Equivalents are not due dates
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The biweekly result is a 14-day equivalent derived from a
                  365-day year model. It does not determine which dates rent is
                  due, how many payments land inside a specific calendar month,
                  or how invoices are scheduled.
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-200 leading-7">
                  <li>
                    Use this page to compare prices across listings and periods.
                  </li>
                  <li>
                    Use a due-date calculator when you need calendar dates,
                    reminders, or invoice timing.
                  </li>
                </ul>
                <div className="mt-4">
                  <Link
                    to="/rent-due-date-calculator"
                    className="cursor-pointer inline-flex items-center font-semibold text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                  >
                    Rent due date calculator →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
