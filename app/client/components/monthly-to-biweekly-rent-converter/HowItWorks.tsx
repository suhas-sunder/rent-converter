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
                  How the monthly to biweekly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a monthly rent amount into a biweekly
                  equivalent using a time-based model. Monthly is treated as an
                  average month derived from a 365-day year, and biweekly is a
                  fixed 14-day period. The result is a biweekly figure you can
                  compare cleanly to weekly, every-4-weeks, and annual pricing.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Monthly = avg month
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Biweekly = 14 days
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly rent
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
                  14-day basis
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Full breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: step 1 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 1: Enter the monthly amount from the listing
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Type the rent amount exactly as it appears (for example,
                    “$2,350” or “2350.50”). The calculator accepts currency
                    symbols, thousands separators, and decimals. If an entry
                    could reasonably be read more than one way, it blocks the
                    result instead of guessing.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Parsing behavior
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>1,234</strong> is treated as 1234
                      </li>
                      <li>
                        <strong>1.234</strong> is treated as 1.234
                      </li>
                      <li>
                        Formats like <strong>.5</strong> and{" "}
                        <strong>12.</strong> are valid
                      </li>
                    </ul>
                  </div>

                  <p>
                    The page does not try to guess what rent includes. Utilities,
                    parking, fees, and deposits can change what you actually pay,
                    but they are outside this conversion.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: step 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 2: Convert monthly to biweekly using one time model
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The converter starts by turning your monthly amount into an
                    annual equivalent, then into a daily value, and finally into
                    a biweekly (14-day) amount. This is why the biweekly result
                    stays aligned with the rest of the breakdown.
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
                        <strong>Biweekly</strong> = daily × 14
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Biweekly here always means a fixed 14-day period, not
                      “twice per month.”
                    </p>
                  </div>

                  <p>
                    This is useful when a landlord lists rent monthly, but you
                    budget biweekly around paychecks, or when you are comparing
                    a monthly listing to a biweekly or every-4-weeks listing.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown consistency */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  How the breakdown stays consistent
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    After the annual number is established, every other period is
                    derived from that same annual basis using fixed time lengths.
                    That prevents the breakdown from mixing assumptions or
                    chaining rounded values.
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
                    If you are comparing listings, the annual value is the
                    easiest “truth” to anchor to, and the other lines are just
                    alternate views of that same total.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: equivalence vs schedules */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Equivalence vs payment schedules
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The biweekly result on this page is a time-based equivalent.
                    It is not claiming a landlord will collect rent every 14 days.
                    That difference matters because “twice monthly” and “biweekly”
                    can lead to different annual totals.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Equivalence
                      </div>
                      <p className="mt-2">
                        Derived from days and the annual total implied by your
                        monthly input.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Schedules (context)
                      </div>
                      <p className="mt-2">
                        Some schedules use monthly × 12, while biweekly billing
                        would imply × 26 payments (illustrative only).
                      </p>
                    </div>
                  </div>

                  <p>
                    If you are converting a rent amount that is already labeled
                    biweekly, use{" "}
                    <Link
                      to="/biweekly-to-monthly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      biweekly to monthly rent converter →
                    </Link>{" "}
                    to go the other direction.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: examples (required, own section) */}
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
                    These examples show how to use the biweekly result for
                    budgeting and how to use annual as the comparison baseline.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <ul className="list-disc pl-5 space-y-3">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Budgeting per paycheck:
                        </span>{" "}
                        Your rent is <strong>$2,400/month</strong> and you get
                        paid biweekly. Convert to biweekly so you can set aside a
                        consistent amount each paycheck.
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Comparing two listings:
                        </span>{" "}
                        Listing A is <strong>$2,150/month</strong>. Listing B is{" "}
                        <strong>$1,050/biweekly</strong>. Convert both to annual
                        so you can see which one is actually cheaper over a year.
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Catching “twice monthly” differences:
                        </span>{" "}
                        If a landlord says “twice monthly,” that is not the same
                        as a 14-day cycle. Use the annual figure and the biweekly
                        view to see the size of the gap before you decide.
                      </li>
                    </ul>
                  </div>

                  <p>
                    If your listing is priced every 4 weeks, you may want{" "}
                    <Link
                      to="/monthly-to-weekly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      monthly to weekly rent converter →
                    </Link>{" "}
                    alongside{" "}
                    <Link
                      to="/weekly-to-biweekly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      weekly to biweekly rent converter →
                    </Link>{" "}
                    to line up the pricing in the same cycle.
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
                    Use these if you need a different conversion direction or a
                    quick way to compare multiple listing formats.
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
                          daily, and hourly.
                        </span>
                      </li>
                      <li>
                        <Link
                          to="/biweekly-to-monthly-rent-converter"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Biweekly to monthly rent converter →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Convert biweekly rent back into a monthly equivalent.
                        </span>
                      </li>
                      <li>
                        <Link
                          to="/monthly-to-annual-rent-converter"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Monthly to annual rent converter →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Convert monthly to annual for quick side-by-side
                          comparisons.
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
                          to="/weekly-to-monthly-rent-converter"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Weekly to monthly rent converter →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Convert weekly pricing into a monthly view.
                        </span>
                      </li>
                      <li>
                        <Link
                          to="/rent-per-paycheck-calculator"
                          className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          Rent per paycheck calculator →
                        </Link>{" "}
                        <span className="text-slate-600">
                          Budget rent per paycheck once you know the cycle.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-slate-700">
                    Need more directions?{" "}
                    <Link
                      to="/monthly-to-weekly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      monthly to weekly →
                    </Link>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <Link
                      to="/monthly-to-annual-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      monthly to annual →
                    </Link>{" "}
                    <span className="text-slate-400">·</span>{" "}
                    <Link
                      to="/biweekly-to-annual-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      biweekly to annual →
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
                  Printing and saved copies
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Use your browser’s print dialog to print the results or save
                    them as a PDF. This explanation section is excluded from
                    print layouts.
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
                  Biweekly is not twice monthly
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  A biweekly amount represents 14 days of rent. A “twice monthly”
                  amount represents half of a calendar month. This page keeps
                  those definitions separate so the comparison stays honest.
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
