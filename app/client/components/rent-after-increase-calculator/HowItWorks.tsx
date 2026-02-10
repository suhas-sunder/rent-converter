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
                  How the rent after increase calculator works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page takes your current rent and an increase, then shows
                  your updated rent across common time periods. It uses one
                  consistent time basis, so the “before” and “after” numbers
                  stay comparable whether you are looking at monthly, weekly,
                  biweekly, or every 4 weeks. If you need to convert any rent
                  amount between periods, use the{" "}
                  <Link
                    to="/rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    universal rent converter
                  </Link>
                  .
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Year = 365 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Month = 365 ÷ 12 days
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Current rent
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  MODE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Percent or fixed
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CALCULATE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  New rent
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
            {/* Card 1 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Step 1: Enter your current rent (and the period)
                </h3>
                <p className="mt-4">
                  Start with the rent amount you pay today and choose the period
                  it belongs to (monthly, weekly, biweekly, every 4 weeks, and
                  so on). The calculator only uses what you provide. It does not
                  guess what your rent includes, so utilities, parking, fees,
                  taxes, deposits, and one-time charges are not added or
                  removed.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
                    Input parsing and safeguards
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    <li>
                      Currency symbols and commas are fine:{" "}
                      <strong>$1,850</strong> → 1850
                    </li>
                    <li>
                      Decimals are supported, including <strong>.5</strong> and{" "}
                      <strong>12.</strong>
                    </li>
                    <li>
                      If an entry is invalid or ambiguous, the page warns or
                      blocks instead of outputting a misleading “0”
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you want to see the rent share impact instead of just the
                  new rent number, use{" "}
                  <Link
                    to="/rent-as-percentage-of-income-calculator"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    rent as percentage of income
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Step 2: Choose percent increase or fixed increase
                </h3>

                <p className="mt-4">
                  You can increase rent in two different ways. Percent mode is
                  best when you are given a rate like 2.5%. Fixed mode is best
                  when you are told “rent goes up by $50” in the same period as
                  your current rent.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Percent mode
                    </div>
                    <p className="mt-2 text-slate-700">
                      New rent = current rent × (1 + percent ÷ 100)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Useful for capped increases and notice letters that quote
                      a percentage.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Fixed-amount mode
                    </div>
                    <p className="mt-2 text-slate-700">
                      New rent = current rent + fixed increase (same period)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      The increase amount is treated as attached to the period
                      you selected.
                    </p>
                  </div>
                </div>

                <p className="mt-4">
                  If you specifically need to calculate the percentage change
                  between two rent numbers, use{" "}
                  <Link
                    to="/rent-increase-percentage-calculator"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    rent increase percentage calculator
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Step 3: See the updated rent across periods (one time basis)
                </h3>

                <p className="mt-4">
                  After the new rent is calculated, the page expresses it across
                  common periods so you can compare listings and budgets without
                  mixing labels. The breakdown uses a single time basis: year is
                  365 days, average month is 365 ÷ 12 days, week is 7 days,
                  biweekly is 14 days, and every 4 weeks is 28 days.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
                    What this avoids
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Treating “monthly” as 30 days in one place and 28 days in
                      another
                    </li>
                    <li>Turning “every 4 weeks” into “monthly” by gut feel</li>
                    <li>
                      Chaining rounded intermediate values that drift over time
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you are comparing a 28-day billed listing to a monthly one,
                  the quickest sanity check is to look at the annual totals or
                  use{" "}
                  <Link
                    to="/rent-paid-every-4-weeks-calculator"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    rent paid every 4 weeks
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Examples (required, its own section) */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Examples
                </h3>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-3 text-slate-700">
                    <li>
                      <span className="font-semibold text-slate-900">
                        Percent increase on monthly rent:
                      </span>{" "}
                      Your rent is <strong>$2,000/month</strong> and the
                      increase is <strong>3%</strong>. Percent mode shows the
                      new monthly rent and also the weekly and annual
                      equivalents so you can understand the yearly impact at a
                      glance.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Fixed increase attached to the same period:
                      </span>{" "}
                      Your rent is <strong>$525/week</strong> and it increases
                      by <strong>$25/week</strong>. Fixed mode treats that $25
                      as a weekly add-on, then shows the updated monthly,
                      4-week, and annual views using the same time basis.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Spotting 28-day vs monthly differences:
                      </span>{" "}
                      You see <strong>$2,150 every 4 weeks</strong> and want to
                      compare it to a <strong>$2,150/month</strong> option.
                      Converting the updated rent into annual and weekly makes
                      the 28-day difference obvious.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Budget check after an increase:
                      </span>{" "}
                      After you compute the new rent, jump to{" "}
                      <Link
                        to="/how-much-rent-can-i-afford-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        how much rent can I afford
                      </Link>{" "}
                      to see how the new number fits against your income target.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you only want the increase math (without the breakdown),
                  use{" "}
                  <Link
                    to="/rent-increase-calculator"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    rent increase calculator
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Related tools (required) */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Related tools
                </h3>

                <p className="mt-4">
                  Use these when you want to answer the next question after an
                  increase: “what does this mean per year,” “what share of my
                  income is this,” or “how do I compare two billing cycles.”
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <Link
                        to="/rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Universal rent converter →
                      </Link>{" "}
                      Convert between monthly, weekly, biweekly, daily, hourly,
                      and annual.
                    </li>
                    <li>
                      <Link
                        to="/rent-increase-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent increase calculator →
                      </Link>{" "}
                      Compute the increase amount from a percent or a target.
                    </li>
                    <li>
                      <Link
                        to="/rent-increase-percentage-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent increase percentage calculator →
                      </Link>{" "}
                      Find the percent change between old and new rent.
                    </li>
                    <li>
                      <Link
                        to="/rent-paid-every-4-weeks-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent paid every 4 weeks calculator →
                      </Link>{" "}
                      Compare 28-day billing to monthly and annual.
                    </li>
                    <li>
                      <Link
                        to="/rent-as-percentage-of-income-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent as percentage of income →
                      </Link>{" "}
                      See what share of income your updated rent represents.
                    </li>
                    <li>
                      <Link
                        to="/how-much-rent-can-i-afford-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        How much rent can I afford →
                      </Link>{" "}
                      Translate income into a rent target range.
                    </li>
                  </ul>
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
                  Percent and fixed increases can tell different stories
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  A percent increase scales with the baseline rent. A fixed
                  increase depends on the period you attach it to. This page
                  keeps both modes on one time basis so the updated weekly,
                  monthly, and 28-day equivalents stay comparable.
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/rent-increase-percentage-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent increase percentage calculator
              </Link>
              ,{" "}
              <Link
                to="/rent-increase-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent increase calculator
              </Link>
              , and{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent paid every 4 weeks calculator
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
