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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight text-center">
                  How the rent after tax income calculator works
                </h2>
                <p className="mt-3 text-slate-600 leading-7">
                  This page estimates take-home (net) income using a single
                  effective tax rate, then compares rent to that net income on
                  one consistent time basis. It produces three primary outputs:
                  estimated net income, rent as a percentage of net income, and
                  estimated income left after rent. All values are derived from
                  annual totals so the breakdown stays consistent across
                  monthly, weekly, and 28-day views.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent + period
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ASSUMPTION
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Effective tax rate
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Net, share, after rent
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
                  Inputs are validated before results are shown
                </h3>

                <p className="mt-4">
                  The calculator validates income, rent, and tax rate before it
                  shows computed outputs. If an entry is invalid or ambiguous,
                  it avoids returning a misleading 0 or a guessed result. This
                  includes basic numeric errors and formatting that could
                  reasonably be interpreted multiple ways.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Parsing behavior
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Currency symbols and thousands separators are supported
                      (for example, <strong>$1,234.56</strong>).
                    </li>
                    <li>
                      Decimal formats like <strong>.5</strong> and{" "}
                      <strong>12.</strong> are accepted.
                    </li>
                    <li>
                      If a value is ambiguous, the page shows an error or
                      warning instead of guessing.
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    The tool does not infer missing context. It uses only the
                    values and periods you enter.
                  </p>
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
                  Income and rent are converted through annual totals
                </h3>

                <p className="mt-4">
                  Both income and rent are annualized first so all comparisons
                  share one basis. The model uses a 365-day year and treats a
                  month as an average month length of <strong>365 ÷ 12</strong>{" "}
                  days. Weekly is always a 7-day equivalent. Biweekly is always
                  14 days. Every 4 weeks is always 28 days.
                </p>

                <p className="mt-4">
                  This matters because “monthly” and “every 4 weeks” are
                  different time lengths. If a breakdown mixes time definitions,
                  the rent share and “after rent” values can drift depending on
                  which line you look at. Here, the annual basis keeps the
                  breakdown coherent.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Time assumptions used
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
                  Net income is estimated using one effective tax rate
                </h3>

                <p className="mt-4">
                  The calculator uses a single effective tax rate to estimate
                  take-home income. The net income estimate is computed from the
                  annual gross income as:
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Net income formula
                  </div>
                  <p className="mt-2 text-slate-700">
                    <strong>Annual net income</strong> = annual gross income ×
                    (1 − effective tax rate)
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    The tax rate is treated as an all-in effective rate. The
                    calculator does not apply brackets, credits, deductions, or
                    multiple payroll components.
                  </p>
                </div>

                <p className="mt-4">
                  This is a simplification by design. The page is built to keep
                  the model explicit and consistent, not to approximate any
                  specific tax system. If you need a different definition of net
                  income, enter the value you want represented by choosing a
                  rate that matches your intended effective adjustment.
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
                  Rent share and income left are computed on the same annual
                  basis
                </h3>

                <p className="mt-4">
                  Once annual rent and annual net income exist, the tool
                  computes two core comparisons: rent share (as a percentage of
                  take-home pay) and income left after rent. Both are derived
                  from annual totals so they stay consistent no matter which
                  period you entered.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Comparison formulas
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Rent share</strong> = annual rent ÷ annual net
                      income
                    </li>
                    <li>
                      <strong>After rent</strong> = annual net income − annual
                      rent
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-slate-600">
                    The page may also show period equivalents of these outputs,
                    derived from the same annual basis.
                  </p>
                </div>

                <p className="mt-4">
                  The “monthly vs every 4 weeks” view exists because those
                  labels are commonly treated as interchangeable, but they are
                  not the same time length. This tool keeps them distinct by
                  converting everything through the same annual reference.
                </p>
              </div>
            </div>

            {/* Precision and rounding */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  Rounding and numeric precision
                </h3>

                <p className="mt-4">
                  Calculations preserve decimals internally (up to 12 places).
                  If rounding is enabled, only the displayed values are rounded.
                  This separation prevents rounding preferences from changing
                  the computed share or “after rent” results.
                </p>

                <p className="mt-4">
                  If you are comparing close values, leaving rounding disabled
                  keeps the raw precision visible. If you are copying results
                  for documentation, rounding can be enabled to format values
                  consistently without changing the underlying computation.
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
                  This page estimates net income with one rate and compares it
                  to rent
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The tool does not model tax brackets, credits, deductions,
                  payroll categories, or jurisdiction rules. It applies one
                  effective rate to annualized gross income, then computes rent
                  share and “after rent” using annual totals derived from
                  explicit day-count assumptions.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
              <div className="text-sm font-bold text-sky-900">
                What you can do
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  Estimate rent as a percentage of take-home pay using one
                  effective rate
                </li>
                <li>
                  See estimated net income left after rent on an annual basis
                </li>
                <li>
                  Compare monthly and every-4-weeks views without treating them
                  as interchangeable
                </li>
                <li>
                  Copy results with consistent formatting by enabling
                  display-only rounding
                </li>
              </ul>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/how-much-rent-can-i-afford-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent affordability calculator
              </Link>
              ,{" "}
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
      </div>
    </section>
  );
};

export default HowItWorks;
