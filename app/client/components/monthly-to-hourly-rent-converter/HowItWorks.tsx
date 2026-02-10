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
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                  How the monthly to hourly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page turns a monthly rent amount into an hourly
                  equivalent using one consistent time-length model. “Monthly”
                  is treated as an average month derived from a 365-day year,
                  and the hourly figure is derived from that same annual basis
                  using 24 hours per day. The result is a comparison baseline,
                  not a billing schedule.
                </p>
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
                  <p>
                    Enter the rent amount as written and select “monthly.” The
                    parser accepts currency symbols, grouping commas, and
                    decimal formats. If the entry is invalid or could be
                    interpreted in more than one way, the page avoids producing
                    a “0” or a guessed value.
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
                  </div>

                  <p>
                    This tool converts the rent amount only. It does not add
                    utilities, fees, deposits, or taxes, and it does not try to
                    interpret the listing terms beyond the number you provide.
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
                  <p>
                    The page anchors the calculation to an annual total so the
                    hourly figure stays compatible with the rest of the
                    breakdown. Monthly is treated as one-twelfth of a 365-day
                    year. From that annual basis, a daily rate is derived, then
                    split into clock hours.
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
                    <p className="mt-3 text-sm text-slate-600">
                      Monthly corresponds to an average month length of 365 ÷ 12
                      days. Hourly is a clock-hour rate derived from that daily
                      basis.
                    </p>
                  </div>

                  <p>
                    This hourly number is best read as a comparison rate. It
                    does not imply you can pay rent “by the hour,” and it does
                    not model minimum stays, cleaning fees, or short-stay
                    pricing.
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
                  <p>
                    The page shows hourly alongside daily, weekly, biweekly,
                    every 4 weeks, monthly, and annual values. Every line is
                    derived from the same annual basis, so comparisons do not
                    quietly switch period definitions partway through the table.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
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

                  <p>
                    Calculations preserve decimals internally (up to 12 places).
                    If rounding is enabled, only the displayed values are
                    rounded. The underlying numbers are unchanged.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      What you can do here
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Compare monthly rent to time-based rates without
                        assuming a 30-day month
                      </li>
                      <li>
                        Sanity-check what a listing implies across periods
                      </li>
                      <li>
                        Keep precision visible when comparing close values
                      </li>
                    </ul>
                  </div>
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
                  <p>
                    Hourly is mostly useful as a baseline when you want to
                    compare rent to other “per-hour” numbers or make small
                    differences feel more concrete.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <ul className="list-disc pl-5 space-y-3">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Comparing two places:
                        </span>{" "}
                        One listing is <strong>$2,600/month</strong>. Another is{" "}
                        <strong>$2,450/month</strong>. The hourly view helps you
                        see the difference as a steady baseline, and the weekly
                        and biweekly lines show what it looks like in common
                        budgeting cycles.
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          “Every 4 weeks” check:
                        </span>{" "}
                        If a place is priced every 4 weeks, convert both to
                        hourly and daily so the time-length difference is
                        visible immediately, then confirm it in the annual line.
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Rough “cost per hour at home” view:
                        </span>{" "}
                        If you are estimating what housing costs per hour of
                        your time, hourly gives a quick baseline. It is not a
                        lease term, just a comparable unit.
                      </li>
                    </ul>
                  </div>

                  <p>
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

            {/* Related tools (required) */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Related tools
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Use these tools to convert other directions or to compare
                    rent in the cycle you actually budget with.
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
                          Convert between monthly, weekly, biweekly, annual,
                          daily, and hourly.
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
                          Reverse this conversion.
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
                          A more intuitive baseline for comparing listings.
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
                          Quick annual totals for clean comparisons.
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
                          Budget rent per paycheck once you know the cycle.
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
                          Split rent between roommates.
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
                  Hourly on this page is a clock-hour equivalent derived from a
                  monthly amount through a 365-day year. It is meant for
                  comparison and consistency across the breakdown, not for
                  forecasting what any short-stay provider charges per hour.
                </p>
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
