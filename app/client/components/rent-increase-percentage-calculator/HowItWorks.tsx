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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
            How the rent increase percentage calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            This calculator turns an “old rent” and “new rent” into a
            decision-ready rent change: the percent increase, the raw change in
            your selected period, and the implied annual impact under one
            consistent time basis. Use it when you need to decide whether a
            proposed renewal fits your budget, whether the increase is
            meaningful enough to negotiate, or how large the change is when you
            look beyond a single billing cycle.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Old rent
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                New rent
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                PERIOD
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                One period applies
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                OUTPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Percent + impact
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="text-slate-700 leading-relaxed">
              These tools are useful when your next step is not “what changed,”
              but “what should I do with that change.”
            </p>

            <ul className="mt-3">
              <li className="mb-2 list-disc ml-5">
                <Link
                  to="/rent-increase-calculator"
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent increase calculator
                </Link>{" "}
                <span className="text-slate-700">
                  matters when you are checking a proposed increase against a
                  rule, guideline, or a specific cap.
                </span>
              </li>

              <li className="mb-2 list-disc ml-5">
                {" "}
                <Link
                  to="/rent-converter"
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent converter
                </Link>{" "}
                <span className="text-slate-700">
                  matters when two listings are quoted on different cycles and
                  you need them on the same period before comparing.
                </span>
              </li>

              <li className="mb-2 list-disc ml-5">
                {" "}
                <Link
                  to="/how-much-rent-can-i-afford-calculator"
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent affordability calculator
                </Link>{" "}
                <span className="text-slate-700">
                  matters when you want to translate the new rent into a budget
                  constraint, not just a percentage.
                </span>
              </li>
            </ul>
          </div>

          {/* EXAMPLES (own section) */}
          <div className="mt-10 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="p-5 sm:px-6">
              <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                Examples
              </h3>
              <p className="mt-3 text-slate-600 leading-7">
                Each example ends with a concrete choice. The numbers are
                realistic, the calculation mirrors what the page outputs, and
                the meaning is the action that changes because of the result.
              </p>

              <div className="mt-6 grid gap-4 sm:gap-5">
                {/* Example 1 */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 1: Monthly increase crosses a budget cap
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Situation
                      </div>
                      <p className="mt-2 text-slate-700 leading-7">
                        Your renewal offer is higher. You can afford up to{" "}
                        <strong>$2,000</strong> per month, so the decision is
                        accept vs negotiate or decline.
                      </p>
                      <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Numbers
                      </div>
                      <ul className="mt-2 space-y-1 text-slate-700">
                        <li>
                          Old: <strong>$1,920</strong> / month
                        </li>
                        <li>
                          New: <strong>$2,040</strong> / month
                        </li>
                        <li>
                          Personal cap: <strong>$2,000</strong> / month
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Calculation
                      </div>
                      <ul className="mt-2 space-y-2 text-slate-700">
                        <li>
                          <strong>Percent</strong> = (($2,040 − $1,920) ÷
                          $1,920) × 100
                        </li>
                        <li>
                          <strong>Per month change</strong> = $2,040 − $1,920
                        </li>
                        <li>
                          <strong>Annual impact</strong> = (per month change) ×
                          12
                        </li>
                      </ul>

                      <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Result
                      </div>
                      <ul className="mt-2 space-y-1 text-slate-700">
                        <li>
                          Percent increase: <strong>6.25%</strong>
                        </li>
                        <li>
                          Change (monthly): <strong>$120</strong>
                        </li>
                        <li>
                          Annual difference: <strong>$1,440</strong>
                        </li>
                      </ul>

                      <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Meaning
                      </div>
                      <p className="mt-2 text-slate-700 leading-7">
                        The new rent is <strong>$40</strong> above your cap.
                        That changes the action: you either negotiate toward{" "}
                        <strong>$2,000</strong> or below, or you plan for a
                        move, even though the percent increase looks moderate.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Derived equivalents (from annual totals)
                    </div>
                    <ul className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-slate-700">
                      <li>
                        Weekly old: <strong>$441.5342</strong> · weekly new:{" "}
                        <strong>$469.2603</strong>
                      </li>
                      <li>
                        28-day old: <strong>$1,766.1370</strong> · 28-day new:{" "}
                        <strong>$1,877.0411</strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      The breakdown is useful when you mentally budget by week,
                      but the acceptance decision here is still driven by the
                      monthly cap.
                    </p>
                  </div>
                </div>

                {/* Example 2 */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 2: Weekly change looks small, annual impact forces a
                    choice
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Situation
                      </div>
                      <p className="mt-2 text-slate-700 leading-7">
                        A landlord increases a weekly rent. You are deciding
                        whether to accept, counteroffer, or start comparing
                        alternatives.
                      </p>

                      <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Numbers
                      </div>
                      <ul className="mt-2 space-y-1 text-slate-700">
                        <li>
                          Old: <strong>$525</strong> / week
                        </li>
                        <li>
                          New: <strong>$555</strong> / week
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Calculation
                      </div>
                      <ul className="mt-2 space-y-2 text-slate-700">
                        <li>
                          <strong>Percent</strong> = (($555 − $525) ÷ $525) ×
                          100
                        </li>
                        <li>
                          <strong>Per week change</strong> = $555 − $525
                        </li>
                        <li>
                          <strong>Annual impact</strong> = (annual new − annual
                          old) using the page’s 365-day basis
                        </li>
                      </ul>

                      <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Result
                      </div>
                      <ul className="mt-2 space-y-1 text-slate-700">
                        <li>
                          Percent increase: <strong>5.7143%</strong>
                        </li>
                        <li>
                          Change (weekly): <strong>$30</strong>
                        </li>
                        <li>
                          Annual difference: <strong>$1,564.2857</strong>
                        </li>
                      </ul>

                      <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Meaning
                      </div>
                      <p className="mt-2 text-slate-700 leading-7">
                        <strong>$30/week</strong> feels minor, but the implied
                        annual delta is about <strong>$1.56k</strong>. That
                        changes the decision: it is large enough to justify
                        negotiating terms (longer lease, included utilities) or
                        comparing comparable listings rather than accepting on
                        autopilot.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Derived equivalents (from annual totals)
                    </div>
                    <ul className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-slate-700">
                      <li>
                        Monthly (avg) old: <strong>$2,281.2500</strong> · new:{" "}
                        <strong>$2,411.6071</strong>
                      </li>
                      <li>
                        28-day old: <strong>$2,100</strong> · 28-day new:{" "}
                        <strong>$2,220</strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      This is where people get misled: a “weekly” quote is not
                      the same as “monthly ÷ 4,” so the derived monthly is an
                      average-month equivalent, not a payment schedule.
                    </p>
                  </div>
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
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  1) Old and new rents use the same billing period
                </h3>

                <p className="mt-4">
                  The period dropdown applies to both numbers. Enter two values
                  that represent the same type of amount: both monthly, both
                  weekly, both every 4 weeks, and so on. If the periods are
                  mixed, the percent is meaningless because you are comparing
                  different time lengths.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Input scope
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Enter the steady-state rent amounts you want to compare
                      for the selected period.
                    </li>
                    <li>
                      The calculator does not guess what is included. Utilities,
                      parking, fees, and discounts only count if you include
                      them in the numbers.
                    </li>
                    <li>
                      One-time items (deposit, move-in bonus, lease break fee)
                      do not belong in these fields because they are not
                      recurring rent.
                    </li>
                  </ul>
                </div>
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
                  2) Both rents are normalized to annual totals
                </h3>

                <p className="mt-4">
                  The calculator annualizes both rents using one set of time
                  assumptions. That annual total is the reference point used to
                  keep the percent and the breakdown internally consistent, even
                  when you view other period equivalents.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Time assumptions
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>Year = 365 days</li>
                    <li>Average month = 365 ÷ 12 days</li>
                    <li>Week = 7 days</li>
                    <li>Biweekly = 14 days</li>
                    <li>Every 4 weeks = 28 days</li>
                    <li>Hourly conversions assume 24 hours per day</li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    These assumptions are for equivalence math. They are not a
                    statement about how many times you are billed in a calendar
                    year.
                  </p>
                </div>

                <p className="mt-4">
                  This matters most for weekly vs monthly thinking. A month is
                  treated as an average-length month, and every 4 weeks is
                  always 28 days. The tool keeps those definitions explicit so
                  you do not accidentally treat 28 days as “a month.”
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
                  3) Percent change is computed from annual totals
                </h3>

                <p className="mt-4">
                  The percentage is computed from the annualized old and new
                  totals. That makes the percent comparable to the annual
                  difference and prevents the percent from shifting when you
                  look at other period equivalents.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Percent change formula
                  </div>
                  <p className="mt-2 text-slate-700">
                    <strong>Percent increase</strong> = ((annual new − annual
                    old) ÷ annual old) × 100
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    If the old rent annualizes to 0, the percent change is
                    undefined and results should be suppressed.
                  </p>
                </div>

                <p className="mt-4">
                  Use the percent to judge relative change (how big the increase
                  is compared to what you were paying). Use the annual
                  difference to judge absolute impact (how much more you pay
                  over a year under the same basis).
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
                  4) Outputs: percentage, period difference, annual impact, and
                  breakdown
                </h3>

                <p className="mt-4">
                  Each output supports a different part of the decision. The
                  percentage is the headline change. The per-period difference
                  tells you what changes on the bill you actually receive. The
                  annual difference tells you what the change means over time.
                  The breakdown helps you compare the same two rents across
                  common cycles without changing the underlying basis.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What you can expect to see
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Rent increase percentage</strong> for judging
                      relative size
                    </li>
                    <li>
                      <strong>Change in the selected period</strong> for
                      immediate cash flow
                    </li>
                    <li>
                      <strong>Annual difference</strong> for longer-term
                      affordability checks
                    </li>
                    <li>
                      <strong>Breakdown</strong> to translate the same result
                      into other common cycles without redefining “month” or “4
                      weeks”
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  The outputs are steady-state comparisons. They do not model
                  proration, partial-month transitions, or mid-cycle effective
                  dates. If your increase starts partway through a cycle, use
                  the calculator to understand the full change, then handle
                  proration separately when reviewing the first bill.
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
