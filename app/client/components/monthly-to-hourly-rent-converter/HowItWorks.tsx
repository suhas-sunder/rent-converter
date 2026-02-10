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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                  How the monthly to hourly rent converter works
                </h2>
                <div className="mt-2 space-y-3">
                  <p className="text-slate-600 leading-7 max-w-2xl">
                    Use this view when you need a strict baseline that makes
                    small rent differences feel concrete, or when you are
                    comparing housing cost to hourly numbers like wages, shift
                    length, or time-at-home tradeoffs.
                  </p>
                  <p className="text-slate-600 leading-7 max-w-2xl">
                    “Monthly” is treated as an average month based on a 365-day
                    year. The page converts your monthly rent to an annual
                    total, then derives daily and hourly values from the same
                    annual basis. The result is a comparison rate, not a billing
                    schedule or a claim that rent can be paid per hour.
                  </p>
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4">
                    <div className="text-sm font-bold text-slate-900">
                      What to do with the hourly number
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Translate “$X/month” into a steady cost-per-hour so
                        differences are easier to judge at a glance
                      </li>
                      <li>
                        Compare two listings when one looks cheaper but the gap
                        is small and you want a clearer sense of scale
                      </li>
                      <li>
                        Sanity-check a non-monthly quote by converting
                        everything to the same baseline (annual → daily →
                        hourly)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Month = 365 ÷ 12 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Hour = day ÷ 24
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ANNUALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly × 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual → day
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DERIVE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Day ÷ 24
                </div>
              </div>
            </div>
          </div>

          {/* Related tools (required) */}
          <div className="group my-8 relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                Related tools
              </h3>

              <div className="mt-4 space-y-3">
                <p className="text-slate-700 leading-relaxed">
                  Use these when your listing is expressed in a different time
                  period, or when you want the same rent framed in the budgeting
                  cycle you actually plan around.
                </p>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <Link
                        to="/rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Universal rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Best when the listing period is unclear or mixed and you
                        need everything expressed on the same baseline.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/hourly-to-monthly-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Hourly to monthly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Useful when you start from an hourly baseline and need a
                        monthly figure to match how leases are usually quoted.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/monthly-to-daily-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Monthly to daily rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Better when your decision is about “per day”
                        affordability or when comparing short stays that are
                        priced daily.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/monthly-to-annual-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Monthly to annual rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use when you need the total yearly commitment to compare
                        options, negotiate, or plan a full-year budget.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-per-paycheck-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent per paycheck calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use after you pick a place to map rent into your pay
                        cycle so you can set the right transfer or sinking fund.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-split-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent split calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Relevant when the decision is about what each person
                        owes, not what the total rent “means” per time unit.
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="mt-4 text-slate-700 leading-relaxed">
                  More conversions:{" "}
                  <Link
                    to="/annual-to-hourly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    annual to hourly →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/hourly-to-annual-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    hourly to annual →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/monthly-to-weekly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    monthly to weekly →
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
          {/* Examples (required, own section) */}
          <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                Examples
              </h3>

              <div className="mt-4 space-y-3">
                <p className="text-slate-700 leading-relaxed">
                  These are decision examples. Each one ends with a concrete
                  action that changes after the conversion.
                </p>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-4">
                    <li className="space-y-2">
                      <div className="font-semibold text-slate-900">
                        Example 1: A small monthly gap becomes a clear hourly
                        cost
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          <strong>Situation:</strong> You are choosing between
                          two similar units and want a “per hour” lens to judge
                          whether the upgrade is worth it.
                        </li>
                        <li>
                          <strong>Numbers:</strong>{" "}
                          <strong>$2,600/month</strong> vs{" "}
                          <strong>$2,450/month</strong>
                        </li>
                        <li>
                          <strong>Calculation:</strong> Hourly = monthly × 12 ÷
                          365 ÷ 24
                          <br />
                          $2,600 → $2,600 × 12 ÷ 365 ÷ 24 ≈{" "}
                          <strong>$3.56/hr</strong>
                          <br />
                          $2,450 → $2,450 × 12 ÷ 365 ÷ 24 ≈{" "}
                          <strong>$3.36/hr</strong>
                        </li>
                        <li>
                          <strong>Result:</strong> Difference ≈{" "}
                          <strong>$0.21/hr</strong> (about{" "}
                          <strong>$150/month</strong> expressed as an hourly
                          baseline).
                        </li>
                        <li>
                          <strong>Meaning:</strong> If the upgrade is not worth
                          about <strong>$0.21/hr</strong> to you, you stop
                          treating the “only $150” framing as small and you pick
                          the cheaper unit.
                        </li>
                      </ul>
                    </li>

                    <li className="space-y-2">
                      <div className="font-semibold text-slate-900">
                        Example 2: A budget cap turns into a hard accept/reject
                        threshold
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          <strong>Situation:</strong> You have a personal limit
                          for housing cost expressed as an hourly baseline
                          (useful when comparing to wages or time tradeoffs).
                        </li>
                        <li>
                          <strong>Numbers:</strong> Budget cap{" "}
                          <strong>$3.25/hr</strong>; listing{" "}
                          <strong>$2,400/month</strong>
                        </li>
                        <li>
                          <strong>Calculation:</strong> $2,400 × 12 ÷ 365 ÷ 24 ≈{" "}
                          <strong>$3.29/hr</strong>
                        </li>
                        <li>
                          <strong>Result:</strong> The listing is{" "}
                          <strong>above</strong> the cap by about{" "}
                          <strong>$0.04/hr</strong>.
                        </li>
                        <li>
                          <strong>Meaning:</strong> You reject this option (or
                          only proceed if you can negotiate or offset costs),
                          because it fails your chosen threshold even though the
                          monthly number may look close.
                        </li>
                      </ul>
                    </li>

                    <li className="space-y-2">
                      <div className="font-semibold text-slate-900">
                        Example 3: Catch a rounding trap when comparing close
                        listings
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          <strong>Situation:</strong> Two options are very
                          close, and rounding to 2 decimals could make them look
                          tied.
                        </li>
                        <li>
                          <strong>Numbers:</strong>{" "}
                          <strong>$2,505/month</strong> vs{" "}
                          <strong>$2,510/month</strong>
                        </li>
                        <li>
                          <strong>Calculation:</strong>
                          <br />
                          $2,505 → $2,505 × 12 ÷ 365 ÷ 24 ≈{" "}
                          <strong>$3.43/hr</strong>
                          <br />
                          $2,510 → $2,510 × 12 ÷ 365 ÷ 24 ≈{" "}
                          <strong>$3.44/hr</strong>
                        </li>
                        <li>
                          <strong>Result:</strong> They may display as nearly
                          the same if you round aggressively, but the higher
                          rent is still higher on the underlying values.
                        </li>
                        <li>
                          <strong>Meaning:</strong> If you are ranking “closest
                          to my target,” you avoid a false tie by keeping
                          precision visible (or disabling rounding) before you
                          decide which listing wins.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  If you have an hourly rent-equivalent and want monthly, use{" "}
                  <Link
                    to="/hourly-to-monthly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    hourly to monthly rent converter →
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* Step card: input parsing */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 1: Enter the monthly rent amount
                </h3>

                <div className="mt-4 space-y-3">
                  <p className="text-slate-700 leading-relaxed">
                    Enter the rent amount exactly as written in the listing and
                    select “monthly.” The goal is to convert your input without
                    guessing, so ambiguous entries do not produce a misleading
                    “0” or an invented value.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Parsing rules
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>1,234</strong> is interpreted as 1234
                      </li>
                      <li>
                        <strong>1.234</strong> is interpreted as 1.234
                      </li>
                      <li>
                        Formats like <strong>.5</strong> and{" "}
                        <strong>12.</strong> are supported
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      If your listing includes extras (utilities, parking,
                      amenity fees), enter only the rent portion when you want a
                      clean rent-to-rent comparison.
                    </p>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    This tool converts the rent amount only. It does not add
                    utilities, fees, deposits, or taxes, and it does not try to
                    interpret lease terms beyond the number and period you
                    provide.
                  </p>
                </div>
              </div>
            </div>

            {/* Step card: conversion path */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 2: Convert monthly into an hourly equivalent (time-based)
                </h3>

                <div className="mt-4 space-y-3">
                  <p className="text-slate-700 leading-relaxed">
                    The calculation is anchored to a single time model so every
                    period shown later stays consistent. Monthly is treated as
                    one-twelfth of a 365-day year, then converted to daily and
                    finally into clock hours.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Annual</strong> = monthly × 12
                      </li>
                      <li>
                        <strong>Daily</strong> = annual ÷ 365
                      </li>
                      <li>
                        <strong>Hourly</strong> = daily ÷ 24
                      </li>
                      <li>
                        Combined:{" "}
                        <strong>Hourly = monthly × 12 ÷ 365 ÷ 24</strong>
                      </li>
                    </ul>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-600">
                      <li>
                        This uses an average month length (365 ÷ 12 days), so it
                        does not drift based on 30/31-day months.
                      </li>
                      <li>
                        “Hourly” here means a clock hour (day ÷ 24), not a work
                        hour or a provider’s pricing unit.
                      </li>
                    </ul>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    Use the hourly rate for comparison and thresholds. Do not
                    use it to predict short-stay pricing, minimum-night rules,
                    or add-ons that are not part of base rent.
                  </p>
                </div>
              </div>
            </div>

            {/* Step card: breakdown + rounding */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 3: Keep the breakdown aligned and keep rounding separate
                </h3>

                <div className="mt-4 space-y-3">
                  <p className="text-slate-700 leading-relaxed">
                    The breakdown shows hourly alongside daily, weekly,
                    biweekly, every 4 weeks, monthly, and annual values. Each
                    line is derived from the same annual basis, so the table
                    does not silently change definitions midstream.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Period alignment (same daily anchor)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        <strong>Weekly</strong> = daily × 7
                      </li>
                      <li>
                        <strong>Biweekly</strong> = daily × 14
                      </li>
                      <li>
                        <strong>4-week</strong> = daily × 28
                      </li>
                      <li>
                        <strong>Monthly</strong> = annual ÷ 12
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      The “every 4 weeks” line is intentionally separate from
                      monthly because 28-day cycles produce 13 payments per
                      year.
                    </p>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    Calculations preserve decimals internally (up to 12 places).
                    If rounding is enabled, only displayed values are rounded,
                    so comparisons remain accurate even when the UI shows fewer
                    decimals.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      What you can do here
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Set a hard “too expensive” threshold in hourly terms and
                        apply it consistently across listings
                      </li>
                      <li>
                        Confirm that two quotes are truly comparable before you
                        rank them (especially with 4-week cycles)
                      </li>
                      <li>
                        Keep precision visible when the decision hinges on small
                        differences
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark callout */}
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
                  Utility note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-300">
                  The hourly result is a baseline, not a lease term
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Treat the hourly figure as a way to interpret and compare
                  monthly rent on a consistent time scale. It is derived from a
                  365-day year and a 24-hour day, so it stays aligned with the
                  rest of the breakdown. It does not represent how any landlord
                  bills rent, and it does not model short-stay pricing.
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-200 leading-7">
                  <li>
                    Good for: comparing close listings, translating rent into a
                    threshold, and making “small” differences legible
                  </li>
                  <li>
                    Not for: forecasting utilities, cleaning fees, nightly
                    rates, or minimum-stay rules
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/rent-converter"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent converter
              </Link>
              ,{" "}
              <Link
                to="/how-much-rent-can-i-afford-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                how much rent can I afford
              </Link>
              , and{" "}
              <Link
                to="/rent-split-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent split calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
