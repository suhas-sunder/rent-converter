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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center sm:text-left  text-sky-900 tracking-tight leading-tight">
            How this rent per paycheck calculator works and what to expect
          </h2>

          <p className="text-center sm:text-left text-slate-600 leading-7">
            This calculator is a budgeting allocator. It estimates how much rent
            to set aside from each paycheck by treating your rent as a yearly
            cost and spreading that cost across the paychecks implied by the pay
            frequency you select. The goal is not to predict your due dates or
            simulate your landlord’s billing rules. The goal is to give you a
            stable “per pay” set-aside number that stays consistent across pay
            cycles that don’t line up cleanly with calendar months.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Rent + rent period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                SELECT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Pay frequency
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                NORMALIZE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Annual total
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                OUTPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Rent per paycheck
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
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  1) Rent is converted to an annual total first
                </h3>

                <p className="mt-4">
                  The calculator starts by converting your rent into an annual
                  total using a consistent time-length model. This is the same
                  “one source of truth” approach used across the site. Once rent
                  is annualized, it can be split across paychecks without mixing
                  calendar-month assumptions with fixed-day cycles.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Assumptions used
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>Year = 365 days</li>
                    <li>Average month = 365 ÷ 12 days</li>
                    <li>Week = 7 days</li>
                    <li>Biweekly = 14 days</li>
                    <li>Every 4 weeks = 28 days</li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    These assumptions are for equivalence math. Your lease can
                    still be due on specific dates.
                  </p>
                </div>

                <p className="mt-4">
                  This step is where small differences versus “month math” come
                  from. If you divide a monthly amount by 2 and call it
                  “biweekly rent,” you have implicitly assumed a calendar
                  structure that may not match a 14-day pay cycle. Using an
                  annual basis keeps the allocator stable across pay
                  frequencies.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  2) Annual rent is divided by paychecks per year
                </h3>

                <p className="mt-4">
                  After rent is annualized, the calculator divides that annual
                  total by the number of paychecks implied by your selected pay
                  frequency. The result is the amount to set aside from each
                  paycheck so that, over time, you have allocated the same
                  annual rent.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Why this avoids drift
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      If pay cycles and rent cycles don’t match, “set aside per
                      pay” should still sum to the same annual rent.
                    </li>
                    <li>
                      Using a single annual basis prevents hidden switching
                      between 52-week framing and calendar months.
                    </li>
                    <li>
                      You can change the pay frequency and see a consistent
                      re-allocation, not a different implied rent.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  The output is meant to be used as a budgeting habit: allocate
                  the rent-per-paycheck amount each pay period, regardless of
                  when rent is actually due. When the rent due date arrives, the
                  accumulated set-aside is the intended funding source.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  3) The result does not change your lease schedule
                </h3>

                <p className="mt-4">
                  This is not a due-date tool. If rent is due monthly and you
                  are paid biweekly or semimonthly, the rent-per-paycheck number
                  is still useful, but it does not claim that rent is “really
                  due” every paycheck. It only spreads the annual rent across
                  pay periods for budgeting consistency.
                </p>

                <p className="mt-4">
                  If you need a forward schedule of actual due dates and
                  calendar-month totals, use a due-date schedule tool. If you
                  need conversions between cycles for listing comparisons, use a
                  converter. This page is specifically “how much to set aside
                  per pay” given a rent amount and a pay frequency.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  4) Where “monthly vs 4-week vs pay cycle” mismatches show up
                </h3>

                <p className="mt-4">
                  The biggest budgeting surprises happen when a rent listing
                  uses a fixed-day cycle (every 4 weeks) while your mental model
                  is monthly, or when pay is biweekly while expenses are
                  monthly. A 28-day schedule drifts through the calendar, and a
                  biweekly schedule yields a different cadence than “twice per
                  month.”
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Practical interpretation
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Biweekly</strong> means every 14 days. It is not
                      “twice a month.”
                    </li>
                    <li>
                      <strong>Every 4 weeks</strong> means every 28 days. It is
                      not “monthly.”
                    </li>
                    <li>
                      A stable allocation strategy starts from annual rent, then
                      spreads across paychecks.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  This calculator’s annual basis is the anchor that keeps the
                  per-pay set-aside stable even when rent due dates and paycheck
                  dates don’t align neatly month-to-month.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  5) Decimals and rounding
                </h3>

                <p className="mt-4">
                  Decimals are preserved end-to-end. Internally, calculations
                  keep precision (up to 12 decimals). If rounding is enabled in
                  the UI, rounding should be display-only so it formats what you
                  see without changing the underlying annual basis used for the
                  allocation.
                </p>

                <p className="mt-4">
                  If an input is invalid or ambiguous, the page should avoid
                  producing a misleading per-pay value. A budgeting allocator
                  becomes counterproductive if it quietly converts bad input
                  into a confident-looking result.
                </p>
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
                  Scope note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  What this tool includes and excludes
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This is a per-pay allocation calculator based on annualized
                  rent and paycheck count. It does not model due dates,
                  proration, partial periods, late fees, utilities, taxes, or
                  deposits. It is designed for stable budgeting across pay
                  frequencies that don’t match rent billing cycles.
                </p>
              </div>
            </div>

            <section className="mt-10">
              <h3 className="text-2xl font-extrabold mb-4 text-sky-900 tracking-tight">
                Links to related tools
              </h3>

              <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm p-5 sm:px-6">
                <ul className="list-disc ml-6 text-slate-700 space-y-2">
                  <li>
                    <Link
                      to="/rent-converter"
                      className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent converter
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/how-much-rent-can-i-afford-calculator"
                      className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      How much rent can I afford?
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/rent-after-tax-income-calculator"
                      className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent after tax income calculator
                    </Link>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
