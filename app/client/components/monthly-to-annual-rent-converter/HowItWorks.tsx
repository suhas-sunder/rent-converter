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
                  How the monthly to annual rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Enter a monthly rent amount and this page converts it into a
                  clean annual equivalent, plus a breakdown into other common
                  cycles (weekly, biweekly, every 4 weeks, daily, hourly). It
                  uses one consistent time model so you can compare listings
                  priced in different ways without mixing assumptions.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Monthly = average month
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Annual via 365 days
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
                  INTERPRET
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Avg month
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SCALE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  × 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: core model */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The conversion model used on this page
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The converter treats your monthly input as one average month
                    of rent. It is not assumed to be 28 days or 30 days, and it
                    is not tied to a specific calendar month. Instead, “monthly”
                    is defined as one-twelfth of a 365-day year, so everything
                    stays comparable across cycles.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Annual</strong> = monthly × 12
                      </li>
                      <li>Equivalent view: monthly = annual ÷ 12</li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Monthly corresponds to an average month length of 365 ÷ 12
                      days.
                    </p>
                  </div>

                  <p>
                    In practice, this means you can compare “$2,200/month” to
                    “$520/week” without accidentally comparing different time
                    definitions.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why schedule is separate */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why “monthly” can be confusing (and how this page avoids it)
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    “Monthly” can describe a time-based equivalent, or it can
                    describe a payment schedule. Those are not always the same
                    thing. This page focuses on time-based equivalence first,
                    and only shows schedules as context so you can spot when a
                    label hides real cost differences.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Equivalence basis
                      </div>
                      <p className="mt-2">
                        Monthly × 12, based on an average month definition.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Schedule context
                      </div>
                      <p className="mt-2">
                        Some billing patterns (like every 4 weeks) can change
                        how many payments happen in a year.
                      </p>
                    </div>
                  </div>

                  <p>
                    If you want to compare rent across cycles directly, you can
                    also use the{" "}
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      universal rent converter →
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  How the full breakdown is derived
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Once the annual equivalent is set, every other period shown
                    is derived from that same annual basis. This keeps the
                    numbers consistent and avoids rounding chains.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Daily</strong> = annual ÷ 365
                    </li>
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
                    The key idea: the monthly input implies one annual number,
                    and everything else is just a different view of that same
                    annual cost.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: examples (own section) */}
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
                    Use these to get a feel for how to read the outputs when
                    listings are priced in different cycles.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <ul className="list-disc pl-5 space-y-3">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Comparing two listings:
                        </span>{" "}
                        Listing A is{" "}
                        <span className="font-semibold text-slate-900">
                          $2,100/month
                        </span>{" "}
                        and Listing B is{" "}
                        <span className="font-semibold text-slate-900">
                          $500/week
                        </span>
                        . Convert both to annual to compare apples to apples.
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Checking “every 4 weeks”:
                        </span>{" "}
                        If a place is priced every 4 weeks, the annual total can
                        look different than monthly even when the labels feel
                        similar. Use annual as the baseline, then compare the
                        4-week view.
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Sanity check daily cost:
                        </span>{" "}
                        Converting to daily helps you quickly see how expensive
                        a rent option feels per day, especially when comparing
                        different billing labels.
                      </li>
                    </ul>
                  </div>

                  <p>
                    If you already have a weekly price and want the reverse
                    direction, use{" "}
                    <Link
                      to="/weekly-to-annual-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      weekly to annual rent converter →
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: parsing */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Parsing, precision, and safeguards
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Monthly inputs are parsed as decimal values. Currency
                    symbols are ignored for numeric parsing, and thousands
                    separators are treated as grouping characters.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>1,234</strong> → 1234
                    </li>
                    <li>
                      <strong>1.234</strong> → 1.234
                    </li>
                    <li>
                      Edge formats like <strong>.5</strong> and{" "}
                      <strong>12.</strong> are supported
                    </li>
                  </ul>

                  <p>
                    Computation preserves precision internally (up to twelve
                    decimal places). If an input could reasonably be interpreted
                    more than one way, the page blocks or warns instead of
                    producing a misleading result.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: related tools (required) */}
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
                    Use these tools if you want a different conversion direction
                    or a different kind of rent planning calculation.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <Link
                          to="/rent-converter"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Universal rent converter →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Convert between monthly, weekly, biweekly, annual,
                          daily, and hourly in one place.
                        </span>
                      </li>
                      <li>
                        <Link
                          to="/annual-to-monthly-rent-converter"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Annual to monthly rent converter →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Reverse the direction and go from annual back to
                          monthly.
                        </span>
                      </li>
                      <li>
                        <Link
                          to="/monthly-to-weekly-rent-converter"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Monthly to weekly rent converter →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Helpful when listings show weekly pricing.
                        </span>
                      </li>
                      <li>
                        <Link
                          to="/monthly-to-biweekly-rent-converter"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Monthly to biweekly rent converter →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Compare monthly rent to a biweekly billing view.
                        </span>
                      </li>
                      <li>
                        <Link
                          to="/rent-split-calculator"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Rent split calculator →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Split rent between roommates.
                        </span>
                      </li>
                      <li>
                        <Link
                          to="/rent-vs-buy-calculator"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Rent vs buy calculator →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Compare renting to buying using broader costs.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-slate-700">
                    If you need other directions:{" "}
                    <Link
                      to="/weekly-to-monthly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      weekly to monthly rent converter →
                    </Link>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <Link
                      to="/biweekly-to-annual-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      biweekly to annual rent converter →
                    </Link>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <Link
                      to="/hourly-to-annual-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      hourly to annual rent converter →
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: printing */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Printing and usage notes
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Use your browser’s print dialog to print the results or save
                    them as a PDF. This explanation section is marked no-print
                    so it does not appear in exported copies.
                  </p>

                  <p>
                    This converter is built for comparison, not scheduling. If
                    your rent is billed on fixed calendar dates, use the annual
                    baseline here first, then think about due dates and timing
                    with{" "}
                    <Link
                      to="/rent-due-date-calculator"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      rent due date calculator →
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
                  Use annual as the “truth” for comparisons
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Billing labels can hide real differences. Converting monthly
                  rent into an annual equivalent gives you a stable baseline,
                  and the rest of the breakdown simply shows that same annual
                  cost in different cycles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
