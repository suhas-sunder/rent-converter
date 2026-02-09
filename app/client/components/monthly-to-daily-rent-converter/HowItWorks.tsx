import { Link } from "react-router";

const HowItWorks = () => {
  return (
    <>
      <section
        id="how-it-works"
        className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm rc-no-print"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    How the monthly to daily rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page converts a monthly rent amount into a daily
                    equivalent using one consistent time-length model. Monthly
                    is treated as an average month derived from a 365-day year.
                    Daily is the 1-day equivalent on that same 365-day basis.
                    The goal is a daily number you can compare against weekly,
                    biweekly, and 28-day listings without using a fixed 30-day
                    shortcut.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Month = 365 ÷ 12 days
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Day = 1 day
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
                    NORMALIZE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    To annual
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    CONVERT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual ÷ 365
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Daily + breakdown
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
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Step 1: Enter the monthly rent amount
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Enter the amount as written and select “monthly” as the
                      period. The parser accepts thousands separators and
                      currency symbols, and it supports decimal formats. It
                      avoids producing a clean-looking daily value when the
                      input is invalid or ambiguous.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Parsing rules
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <strong>1,234</strong> is treated as 1234 (grouping)
                        </li>
                        <li>
                          <strong>1.234</strong> is treated as 1.234 (decimal)
                        </li>
                        <li>
                          Formats like <strong>.5</strong> and{" "}
                          <strong>12.</strong> are valid
                        </li>
                      </ul>
                    </div>

                    <p>
                      This page does not infer what the rent includes. Fees,
                      utilities, taxes, and deposits are not added or removed.
                      The calculation stays scoped to the number you enter.
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
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Step 2: Convert monthly to daily using a 365-day basis
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The converter treats “monthly” as an average month, not a
                      fixed 30-day block. It first expresses the monthly amount
                      as an annual total, then converts that annual total into a
                      daily figure on a 365-day year. This keeps the daily
                      number aligned with the weekly, biweekly, and 28-day lines
                      shown elsewhere on the page.
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
                          Combined: <strong>Daily = monthly × 12 ÷ 365</strong>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        This corresponds to an average month length of 365 ÷ 12
                        days.
                      </p>
                    </div>

                    <p>
                      If you are comparing two listings, the daily figure is
                      useful because it removes the label problem. “Monthly” and
                      “every 4 weeks” look similar on a listing page, but they
                      are different time lengths. Converting both to daily makes
                      that difference show up immediately.
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
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Step 3: Keep the breakdown consistent and keep rounding
                    honest
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      After the annual basis exists, every other period value is
                      derived from the same assumptions. Weekly uses a 7-day
                      week. Biweekly uses a 14-day period. Every 4 weeks uses 28
                      days. Hourly is derived from daily using 24 hours per day.
                      This keeps the breakdown coherent instead of mixing labels
                      or chaining rounded numbers.
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
                        <strong>Hourly</strong> = daily ÷ 24
                      </li>
                    </ul>

                    <p>
                      Calculations preserve decimals internally (up to 12
                      places). If you enable rounding, it affects display only.
                      That means the math stays the same and only the formatting
                      changes.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        What you can do here
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          Compare monthly listings to daily budgets without
                          using 30-day shortcuts
                        </li>
                        <li>
                          Sanity-check a listing by reading the implied weekly,
                          biweekly, and 28-day equivalents
                        </li>
                        <li>
                          Keep precision visible when you need to compare close
                          values
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
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                    Daily makes mixed billing cycles comparable
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    When listings use different period labels, comparing
                    “monthly” to “every 4 weeks” by gut feel is a losing game. A
                    daily equivalent gives you one baseline, and the breakdown
                    shows the rest of the periods without switching assumptions
                    mid-table.
                  </p>
                </div>
              </div>

              {/* Related links */}
              <p className="text-slate-700">
                Related pages:{" "}
                <Link
                  to="/rent-converter"
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent converter
                </Link>{" "}
                <span className="text-slate-400">·</span>{" "}
                <Link
                  to="/how-much-rent-can-i-afford-calculator"
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent affordability calculator
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LEARN */}
      <section className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm mt-6 rc-no-print">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center leading-tight">
              Method used on this page
            </h2>

            <div className="mt-8 space-y-6 text-lg text-slate-700 leading-7">
              <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    The page anchors everything to a single annual reference
                  </h3>
                  <p className="mt-4">
                    This converter uses the annual total as the reference point
                    so daily, weekly, biweekly, and 28-day values can be derived
                    without switching definitions. Your monthly input is first
                    mapped to an annual amount. That annual amount is then
                    converted into a daily rate using a 365-day year. Once daily
                    exists, all other periods can be computed mechanically from
                    fixed day counts.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Assumptions
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>Year = 365 days</li>
                      <li>Average month = 365 ÷ 12 days</li>
                      <li>Week = 7 days</li>
                      <li>Biweekly = 14 days</li>
                      <li>Every 4 weeks = 28 days</li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    If you are checking two options side by side, this matters
                    because it prevents apples-to-oranges comparisons. The daily
                    number is not trying to predict any specific calendar month.
                    It is a time-length equivalent that stays compatible with
                    the rest of the breakdown.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Why a daily equivalent is practical
                  </h3>
                  <p className="mt-4">
                    Daily is the smallest unit in the breakdown and it makes the
                    other conversions easier to interpret. If you have a monthly
                    listing and a 4-week listing, daily lets you compare them
                    without taking a guess at how long “a month” is. It also
                    makes small differences visible. A change that looks minor
                    on a monthly figure may look different when expressed per
                    day and then scaled back into weekly or 28-day equivalents.
                  </p>

                  <p className="mt-4">
                    This is also a quick way to sanity-check the label on a
                    listing. If a “monthly” amount produces a daily number that
                    implies an unusually high weekly or 4-week value, you can
                    spot it immediately in the breakdown without doing separate
                    math.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    4-week billing versus monthly billing
                  </h3>
                  <p className="mt-4">
                    A 4-week period is always 28 days. An average month is
                    longer than that (365 ÷ 12 days). That gap is why “every 4
                    weeks” can imply a higher annual total even if the number
                    looks close to the monthly price. This page keeps those time
                    lengths explicit by converting everything through the same
                    daily and annual basis.
                  </p>

                  <p className="mt-4">
                    If you are comparing two listings with different period
                    labels, the most reliable approach is to pick one baseline
                    and stick to it. This route uses daily as the baseline and
                    shows the rest of the periods as derived equivalents.
                  </p>

                  <p className="mt-5 text-slate-700">
                    Related tools:{" "}
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      rent converter
                    </Link>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <Link
                      to="/how-much-rent-can-i-afford-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      rent affordability calculator
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
