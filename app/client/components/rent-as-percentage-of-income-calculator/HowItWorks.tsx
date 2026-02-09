import { Link } from "react-router";

const HowItWorks = ({
  computed,
  rentPeriod,
  incomePeriod,
  PERIOD_LABEL,
  safeToFixed,
}: any) => {
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight text-center">
            How it works and what to expect
          </h2>

          <p className="mt-4 text-slate-600 leading-7">
            This page calculates rent as a percentage of income using a
            consistent annual basis. You enter a rent amount, an income amount,
            and the periods each one applies to. The calculator converts both
            values into annual totals using explicit day-count assumptions,
            computes the percentage from those annual totals, and then derives
            monthly, weekly, and 28-day (4-week) views from the same annual
            basis. The goal is simple: keep the math consistent when rent and
            income are expressed on different schedules.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Rent + period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Income + period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                NORMALIZE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Annual totals
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                OUTPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Rent % + breakdown
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* Card: steps */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  Calculation steps used on this page
                </h3>

                <ol className="mt-4 list-decimal pl-5 space-y-3">
                  <li>
                    <strong>
                      Inputs are validated before results are shown.
                    </strong>{" "}
                    If rent or income is invalid, ambiguous, or income
                    annualizes to 0, the page hides results instead of showing
                    misleading values.
                  </li>
                  <li>
                    <strong>
                      Both numbers are converted to annual totals first.
                    </strong>{" "}
                    The tool uses a 365-day year (month is 365 ÷ 12 days) to
                    annualize rent and income so the comparison uses one basis.
                  </li>
                  <li>
                    <strong>
                      The percentage is computed on the annual basis.
                    </strong>{" "}
                    Rent % = (annual rent ÷ annual income) × 100.
                  </li>
                  <li>
                    <strong>
                      Monthly, weekly, and 4-week views are derived from the
                      same annual totals.
                    </strong>{" "}
                    This keeps outputs consistent even when pay cycles do not
                    match billing cycles.
                  </li>
                  <li>
                    <strong>Rounding is display-only.</strong> Calculations
                    preserve decimals internally (up to 12). If rounding is
                    enabled, only displayed values are rounded.
                  </li>
                </ol>
              </div>
            </div>

            {/* Card: validation and parsing */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  What counts as valid input
                </h3>

                <p className="mt-4">
                  The calculator accepts currency symbols, commas, and decimals.
                  If an input cannot be interpreted as a single numeric value,
                  results are suppressed. This avoids a common failure mode
                  where a malformed entry quietly turns into a zero and then
                  produces a “0% rent share” that looks legitimate.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Formatting behavior
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>1,234</strong> is treated as 1234 (comma as
                      thousands grouping)
                    </li>
                    <li>
                      <strong>1.234</strong> is treated as 1.234 (decimal point)
                    </li>
                    <li>
                      Edge formats like <strong>.5</strong> and{" "}
                      <strong>12.</strong> are supported
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    If a value could be interpreted in more than one way, the
                    page surfaces an error or warning rather than choosing for
                    you.
                  </p>
                </div>

                <p className="mt-4">
                  If income annualizes to 0, rent percentage is undefined. In
                  that case, results remain hidden. This is a deliberate
                  guardrail: “0%” is not a neutral fallback and would be
                  misleading.
                </p>
              </div>
            </div>

            {/* Card: annual basis + periods */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  Why this page converts through annual totals
                </h3>

                <p className="mt-4">
                  Rent and income are often described on different schedules. A
                  weekly rent against a monthly income (or a biweekly income
                  against a monthly rent) can’t be compared directly unless both
                  values are expressed using a shared basis. This page uses
                  annual totals as that shared basis, derived from time length
                  assumptions.
                </p>

                <p className="mt-4">
                  The key point is that the period labels are treated as time
                  lengths: weekly means 7 days, biweekly means 14 days, and
                  every 4 weeks means 28 days. Monthly is treated as an average
                  month length (365 ÷ 12 days). Once everything is annualized on
                  a 365-day year, the tool can consistently derive any other
                  period without switching definitions.
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
                    <li>Hourly conversions assume 24 hours per day</li>
                  </ul>
                </div>

                <p className="mt-4">
                  The payment-count box shown below (when available) is a
                  visibility aid. It shows how many “occurrences per year” your
                  selected periods imply. That is separate from the equivalence
                  math, which stays anchored to day counts and the annual basis.
                </p>
              </div>
            </div>

            {/* Conditional block, styled */}
            {computed.ok ? (
              <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div className="p-5 sm:px-6">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-700">
                    <div className="font-semibold text-sky-900">
                      Payment counts per year implied by your selections
                    </div>
                    <div className="mt-2 text-slate-600">
                      Rent period: <strong>{PERIOD_LABEL[rentPeriod]}</strong>{" "}
                      (about{" "}
                      <strong>
                        {safeToFixed(computed.paymentsPerYearRent, 2)}
                      </strong>{" "}
                      occurrences per year)
                    </div>
                    <div className="mt-1 text-slate-600">
                      Income period:{" "}
                      <strong>{PERIOD_LABEL[incomePeriod]}</strong> (about{" "}
                      <strong>
                        {safeToFixed(computed.paymentsPerYearIncome, 2)}
                      </strong>{" "}
                      occurrences per year)
                    </div>
                  </div>

                  <p className="mt-4 text-slate-600 leading-7">
                    These counts are shown for clarity when rent and income
                    cycles differ. They are not used as shortcuts to compute the
                    percentage. The percentage is computed from annual totals
                    derived from time length assumptions (365-day year, average
                    month length).
                  </p>
                </div>
              </div>
            ) : null}

            {/* Card: rounding */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  Rounding and precision
                </h3>

                <p className="mt-4">
                  Internally, values are computed with decimal-safe arithmetic
                  up to 12 decimal places. If rounding is enabled, it is applied
                  only to the displayed outputs. This prevents rounding
                  preferences from altering the computed annual totals or the
                  percentage result.
                </p>

                <p className="mt-4">
                  If you are comparing close values, leaving rounding disabled
                  keeps the underlying precision visible. If you are copying
                  results for documentation or sharing, rounding can be enabled
                  to make the display consistent without changing the
                  computation.
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
                  Utility note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  This page keeps rent-share math consistent across mismatched
                  cycles
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The rent percentage is computed from annual totals derived
                  from explicit day-count assumptions. The monthly, weekly, and
                  28-day views are derived from the same annual basis so the
                  share does not change depending on which period you happen to
                  be looking at.
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/how-much-rent-can-i-afford-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                affordability calculator
              </Link>
              ,{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent paid every 4 weeks
              </Link>
              ,{" "}
              <Link
                to="/weekly-to-monthly-rent-converter"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                weekly to monthly converter
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
