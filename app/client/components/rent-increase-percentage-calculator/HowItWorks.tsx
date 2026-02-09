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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
            How the rent increase percentage calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            This page computes the percentage change between an old rent amount
            and a new rent amount. You enter both values in the same billing
            period, then the calculator converts each rent into a consistent
            annual total (using explicit time assumptions) and computes the
            percent change from those annual totals. The output includes the
            percentage, the difference in the selected period, an annual
            difference figure, and a cross-period breakdown so the result stays
            coherent when you view weekly, 28-day, and monthly equivalents.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  The period dropdown applies to both numbers. That means “old”
                  and “new” must represent the same type of amount: both
                  monthly, both weekly, both every 4 weeks, and so on. This
                  prevents a hidden mismatch where the two inputs are different
                  time lengths before the percent change is even computed.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Input scope
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Old rent and new rent are treated as amounts per the
                      selected period.
                    </li>
                    <li>
                      The calculator does not infer add-ons such as utilities,
                      fees, taxes, or deposits.
                    </li>
                    <li>
                      If you want those included, they need to be included in
                      the numbers you enter.
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
                  To keep the percent change stable across the breakdown, the
                  calculator converts both old and new rents into annual totals
                  using a single set of time assumptions. The annualization step
                  is the shared reference that keeps weekly, monthly, and 28-day
                  views aligned rather than mixing definitions.
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
                    These assumptions are used for equivalence math and
                    breakdown consistency. Payment-count illustrations, if
                    shown, are separate from the equivalence basis.
                  </p>
                </div>

                <p className="mt-4">
                  This annual basis is also what makes “weekly and 4-week
                  equivalents” comparable on the same page. Weekly is always a
                  7-day equivalent. Every 4 weeks is always a 28-day equivalent.
                  Monthly is an average month length. The calculator keeps those
                  definitions explicit rather than using shortcuts like treating
                  28 days as “a month.”
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
                  The percentage result is computed from the annual totals
                  derived from your two inputs. This keeps the percentage
                  consistent with the annual impact and with any derived period
                  views shown in the breakdown.
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
                  The “change per selected period” output is then derived from
                  the same basis so the percent result, the per-period change,
                  and the annual difference reconcile cleanly.
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
                  The page provides multiple outputs so the percentage is not
                  isolated from practical comparisons. The percentage describes
                  the relative change. The per-period difference shows the raw
                  change in the period you selected. The annual difference shows
                  the implied year-over-year delta under the page’s time
                  assumptions. The breakdown then expresses old and new across
                  common periods derived from the same annual basis.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What you can expect to see
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>Rent increase percentage based on annualized values</li>
                    <li>
                      Change in the selected period (old vs new for that period)
                    </li>
                    <li>Annual difference derived from the annual totals</li>
                    <li>
                      A breakdown across common cycles derived from the same
                      assumptions
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  None of these outputs apply proration rules, partial-month
                  handling, or mid-cycle effective dates. The tool treats the
                  two rents as steady-state values for comparison and
                  documentation.
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
                  keep precision (up to 12 decimals). If rounding is enabled, it
                  is applied only to what’s displayed. This prevents rounding
                  preferences from changing the computed percent or the annual
                  difference.
                </p>

                <p className="mt-4">
                  Inputs support commas and currency symbols. Formats like{" "}
                  <strong>.5</strong> and <strong>12.</strong> are treated as
                  valid decimals. If a value is ambiguous, the page should avoid
                  producing a “close enough” output.
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
                  What this calculator does and does not do
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This tool computes a percentage change and related equivalence
                  outputs from two rent amounts under explicit time assumptions.
                  It does not include fees, utilities, deposits, taxes,
                  proration, or effective-date logic. It is a numeric comparison
                  tool for old vs new rent values expressed on the same period.
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/rent-increase-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent increase calculator
              </Link>
              ,{" "}
              <Link
                to="/rent-converter"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent converter
              </Link>
              , and{" "}
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
    </section>
  );
};

export default HowItWorks;
