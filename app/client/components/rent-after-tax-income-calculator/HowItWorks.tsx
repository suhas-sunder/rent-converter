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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight text-center">
                  How the rent after tax income calculator works
                </h2>
                <p className="mt-3 text-slate-600 leading-7">
                  This page estimates take-home (net) income using one effective
                  tax rate, then compares rent to that net income on a single,
                  consistent time basis. You get three core outputs: estimated
                  net income, rent as a percentage of net income, and estimated
                  income left after rent. Income and rent are annualized first
                  so monthly, weekly, and every-4-weeks views stay consistent.
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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Step 1: Enter income, rent, and an effective tax rate
                </h3>

                <p className="mt-4">
                  Enter your income and rent exactly as you want them treated,
                  then pick the period for each one. Choose an effective tax
                  rate that matches your rough take-home reality (one all-in
                  percentage). The calculator only uses what you type. It does
                  not infer deductions, credits, overtime, household size, or
                  rent inclusions like utilities and fees.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
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
                      If a value is invalid or ambiguous, the page shows an
                      error or warning instead of guessing.
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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Step 2: Convert both numbers through annual totals
                </h3>

                <p className="mt-4">
                  Income and rent are annualized first so the comparison does
                  not change when you switch views. The model uses explicit time
                  lengths (not payment counts): year is 365 days, an average
                  month is 365 ÷ 12 days, week is 7 days, biweekly is 14 days,
                  and every 4 weeks is 28 days.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
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

                <p className="mt-4">
                  This is why the page can keep “monthly” and “every 4 weeks”
                  separate instead of treating them as interchangeable.
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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Step 3: Estimate net income, then compute rent share and money
                  left
                </h3>

                <p className="mt-4">
                  Net income is estimated from annualized gross income using one
                  effective rate. From there, rent share and income left are
                  computed from annual totals and then shown in period
                  equivalents.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Core formulas (annual basis)
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Annual net income</strong> = annual gross income ×
                      (1 − effective tax rate)
                    </li>
                    <li>
                      <strong>Rent share</strong> = annual rent ÷ annual net
                      income
                    </li>
                    <li>
                      <strong>After rent</strong> = annual net income − annual
                      rent
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you want a separate view that focuses only on rent share
                  targets, use{" "}
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

            {/* Examples (required) */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Examples
                </h3>

                <p className="mt-4">
                  These are real, end-to-end examples of what the calculator is
                  doing. (Rounded here for readability.)
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Example 1: Annual income, monthly rent
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Gross income: <strong>$80,000/year</strong>
                    </li>
                    <li>
                      Effective tax rate: <strong>25%</strong> → net is{" "}
                      <strong>$80,000 × 0.75 = $60,000/year</strong>
                    </li>
                    <li>
                      Rent: <strong>$2,000/month</strong> → annual rent{" "}
                      <strong>$2,000 × 12 = $24,000/year</strong>
                    </li>
                    <li>
                      Rent share: <strong>$24,000 ÷ $60,000 = 40%</strong>
                    </li>
                    <li>
                      After rent:{" "}
                      <strong>$60,000 − $24,000 = $36,000/year</strong> (about{" "}
                      <strong>$3,000/month</strong>)
                    </li>
                  </ul>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Example 2: Weekly income, rent every 4 weeks
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Gross income: <strong>$1,200/week</strong> → annual gross{" "}
                      <strong>$1,200 × (365 ÷ 7) ≈ $62,571.43</strong>
                    </li>
                    <li>
                      Effective tax rate: <strong>30%</strong> → annual net{" "}
                      <strong>≈ $62,571.43 × 0.70 = $43,800.00</strong>
                    </li>
                    <li>
                      Rent: <strong>$2,100 every 4 weeks</strong> → daily rent{" "}
                      <strong>$2,100 ÷ 28 = $75/day</strong> → annual rent{" "}
                      <strong>$75 × 365 = $27,375/year</strong>
                    </li>
                    <li>
                      Rent share: <strong>$27,375 ÷ $43,800 ≈ 62.5%</strong>
                    </li>
                    <li>
                      After rent:{" "}
                      <strong>$43,800 − $27,375 = $16,425/year</strong> (about{" "}
                      <strong>$1,368.75/month</strong>)
                    </li>
                  </ul>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Example 3: Monthly income, weekly rent
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Gross income: <strong>$5,000/month</strong> → annual gross{" "}
                      <strong>$5,000 × 12 = $60,000/year</strong>
                    </li>
                    <li>
                      Effective tax rate: <strong>20%</strong> → annual net{" "}
                      <strong>$60,000 × 0.80 = $48,000/year</strong>
                    </li>
                    <li>
                      Rent: <strong>$525/week</strong> → daily rent{" "}
                      <strong>$525 ÷ 7 = $75/day</strong> → annual rent{" "}
                      <strong>$75 × 365 = $27,375/year</strong>
                    </li>
                    <li>
                      Rent share: <strong>$27,375 ÷ $48,000 ≈ 57.0%</strong>
                    </li>
                    <li>
                      After rent:{" "}
                      <strong>$48,000 − $27,375 = $20,625/year</strong> (about{" "}
                      <strong>$1,718.75/month</strong>)
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you want to convert a rent amount between periods before
                  comparing, use the{" "}
                  <Link
                    to="/rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    universal rent converter
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
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  Related tools
                </h3>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <Link
                        to="/rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Universal rent converter →
                      </Link>{" "}
                      Convert between weekly, monthly, biweekly, every 4 weeks,
                      daily, hourly, and annual.
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
                    <li>
                      <Link
                        to="/rent-as-percentage-of-income-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent as percentage of income →
                      </Link>{" "}
                      Compare rent share targets across periods.
                    </li>
                    <li>
                      <Link
                        to="/rent-vs-take-home-pay-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent vs take-home pay →
                      </Link>{" "}
                      Another angle on affordability using take-home pay
                      framing.
                    </li>
                    <li>
                      <Link
                        to="/rent-split-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent split calculator →
                      </Link>{" "}
                      Split rent across roommates and see per-person amounts.
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
                  Scope note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-300">
                  This is a simple net estimate, not a tax system
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The calculator does not model brackets, credits, deductions,
                  payroll categories, or jurisdiction rules. It applies one
                  effective rate to annualized income and keeps rent share and
                  after-rent math on the same annual basis so the breakdown does
                  not drift.
                </p>
              </div>
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
              , and{" "}
              <Link
                to="/rent-converter"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                universal rent converter
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
