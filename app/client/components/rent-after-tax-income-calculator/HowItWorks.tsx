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
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight text-center">
                  How the rent after tax income calculator works
                </h2>
                <p className="mt-3 text-slate-600 leading-7">
                  Use this page to answer one decision:{" "}
                  <strong className="font-semibold">
                    is this rent still workable after taxes, and what does it
                    leave you with?
                  </strong>{" "}
                  It converts both your income and rent onto the same time
                  basis, applies one effective tax rate to estimate take-home
                  pay, then shows the result in the period you prefer.
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-600 leading-7">
                  <li>
                    <strong className="font-semibold">
                      Estimated net income
                    </strong>{" "}
                    (take-home) based on your effective tax rate.
                  </li>
                  <li>
                    <strong className="font-semibold">
                      Rent share of net income
                    </strong>{" "}
                    so you can judge the strain on your budget.
                  </li>
                  <li>
                    <strong className="font-semibold">
                      Income left after rent
                    </strong>{" "}
                    to sanity-check real-life breathing room.
                  </li>
                </ul>
                <p className="mt-4 text-slate-600 leading-7">
                  The key is consistency: income and rent are annualized first,
                  then converted back to monthly, weekly, or every-4-weeks
                  display so the headline numbers do not drift when you switch
                  views.
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
                <p className="mt-2 text-xs text-slate-600 leading-6">
                  Use your pay the way you actually receive it (hourly, weekly,
                  monthly, annual).
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent + period
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-6">
                  Enter the listing’s billing cadence (weekly vs monthly vs
                  every 4 weeks matters).
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ASSUMPTION
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Effective tax rate
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-6">
                  One all-in percentage that approximates your take-home
                  reality.
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Net, share, after rent
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-6">
                  The numbers you use to accept, reject, or renegotiate.
                </p>
              </div>
            </div>
          </div>

          {/* Related tools (required) */}
          <div className="group my-8 relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
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
                    When a listing uses a different rent cadence than your
                    budget (weekly vs monthly vs every 4 weeks) and you need a
                    like-for-like number.
                  </li>
                  <li>
                    <Link
                      to="/how-much-rent-can-i-afford-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      How much rent can I afford →
                    </Link>{" "}
                    When you want a target rent range first, before evaluating a
                    specific property.
                  </li>
                  <li>
                    <Link
                      to="/rent-as-percentage-of-income-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent as percentage of income →
                    </Link>{" "}
                    When your decision is driven by a rent-share rule and you
                    want to compare against a fixed threshold across periods.
                  </li>
                  <li>
                    <Link
                      to="/rent-vs-take-home-pay-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent vs take-home pay →
                    </Link>{" "}
                    When you want an affordability read that is framed more
                    directly around take-home pay and pay-cycle timing.
                  </li>
                  <li>
                    <Link
                      to="/rent-split-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent split calculator →
                    </Link>{" "}
                    When rent is shared and the decision depends on per-person
                    payments, not the headline lease amount.
                  </li>
                </ul>
              </div>
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

              <p className="mt-4 text-slate-700 leading-7">
                Each example is decision-based: it ends in a different action
                you would take. (Rounded here for readability.)
              </p>

              <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-800">
                  Example 1: Annual income, monthly rent
                </div>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <strong>Situation:</strong> You are deciding whether a
                    $2,000/month lease fits after taxes, not just on gross pay.
                  </li>
                  <li>
                    <strong>Numbers:</strong> Gross income{" "}
                    <strong>$80,000/year</strong>, effective tax rate{" "}
                    <strong>25%</strong>, rent <strong>$2,000/month</strong>.
                  </li>
                  <li>
                    <strong>Calculation:</strong> Net income{" "}
                    <strong>$80,000 × 0.75 = $60,000/year</strong>. Annual rent{" "}
                    <strong>$2,000 × 12 = $24,000/year</strong>. Rent share{" "}
                    <strong>$24,000 ÷ $60,000 = 40%</strong>. After rent{" "}
                    <strong>$60,000 − $24,000 = $36,000/year</strong> (about{" "}
                    <strong>$3,000/month</strong>).
                  </li>
                  <li>
                    <strong>Result:</strong> Rent uses <strong>40%</strong> of
                    take-home, leaving about <strong>$3,000/month</strong>{" "}
                    before everything else.
                  </li>
                  <li>
                    <strong>Meaning:</strong> If your non-rent essentials are
                    regularly above <strong>$3,000/month</strong>, this lease is
                    a reject or renegotiate. If they are comfortably below it,
                    it passes the first affordability screen.
                  </li>
                </ul>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-800">
                  Example 2: Weekly income, rent every 4 weeks
                </div>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <strong>Situation:</strong> The listing is “every 4 weeks,”
                    and you need to know whether it quietly breaks your monthly
                    budget after tax.
                  </li>
                  <li>
                    <strong>Numbers:</strong> Gross income{" "}
                    <strong>$1,200/week</strong>, effective tax rate{" "}
                    <strong>30%</strong>, rent{" "}
                    <strong>$2,100 every 4 weeks</strong>.
                  </li>
                  <li>
                    <strong>Calculation:</strong> Annual gross{" "}
                    <strong>$1,200 × (365 ÷ 7) ≈ $62,571.43</strong>. Annual net{" "}
                    <strong>≈ $62,571.43 × 0.70 = $43,800.00</strong>. Annual
                    rent via days: daily rent{" "}
                    <strong>$2,100 ÷ 28 = $75/day</strong>, annual rent{" "}
                    <strong>$75 × 365 = $27,375/year</strong>. Rent share{" "}
                    <strong>$27,375 ÷ $43,800 ≈ 62.5%</strong>. After rent{" "}
                    <strong>$43,800 − $27,375 = $16,425/year</strong> (about{" "}
                    <strong>$1,368.75/month</strong>).
                  </li>
                  <li>
                    <strong>Result:</strong> Rent consumes about{" "}
                    <strong>62.5%</strong> of take-home, leaving roughly{" "}
                    <strong>$1,368.75/month</strong>.
                  </li>
                  <li>
                    <strong>Meaning:</strong> If your baseline monthly expenses
                    (food, transport, insurance, debt minimums) are above{" "}
                    <strong>$1,368.75</strong>, this is an immediate reject
                    regardless of how “normal” the 4-week figure looks. If your
                    expenses are below it, the next step is to stress-test for
                    irregular costs.
                  </li>
                </ul>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-800">
                  Example 3: Monthly income, weekly rent
                </div>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <strong>Situation:</strong> You are comparing two options
                    that look similar, but one is priced weekly and can be
                    misleading against a monthly paycheck.
                  </li>
                  <li>
                    <strong>Numbers:</strong> Gross income{" "}
                    <strong>$5,000/month</strong>, effective tax rate{" "}
                    <strong>20%</strong>, rent <strong>$525/week</strong>.
                  </li>
                  <li>
                    <strong>Calculation:</strong> Annual gross{" "}
                    <strong>$5,000 × 12 = $60,000/year</strong>. Annual net{" "}
                    <strong>$60,000 × 0.80 = $48,000/year</strong>. Annual rent
                    via days: daily rent <strong>$525 ÷ 7 = $75/day</strong>,
                    annual rent <strong>$75 × 365 = $27,375/year</strong>. Rent
                    share <strong>$27,375 ÷ $48,000 ≈ 57.0%</strong>. After rent{" "}
                    <strong>$48,000 − $27,375 = $20,625/year</strong> (about{" "}
                    <strong>$1,718.75/month</strong>).
                  </li>
                  <li>
                    <strong>Result:</strong> Weekly pricing pushes rent to about{" "}
                    <strong>57.0%</strong> of take-home, leaving about{" "}
                    <strong>$1,718.75/month</strong>.
                  </li>
                  <li>
                    <strong>Meaning:</strong> If you were choosing between this
                    and a <strong>$2,200/month</strong> unit, the weekly-priced
                    unit is likely the reject because it leaves materially less
                    monthly breathing room after taxes, even if the weekly
                    number “feels” close.
                  </li>
                </ul>
              </div>

              <p className="mt-4 text-slate-700 leading-7">
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
                  Enter the income and rent exactly as you want them evaluated,
                  then set the period for each. The effective tax rate is the
                  only tax input, so pick a single percentage that matches your
                  typical take-home outcome.
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2">
                  <li>
                    If you usually keep around <strong>70%</strong> of your pay
                    after taxes and payroll deductions, use <strong>30%</strong>
                    .
                  </li>
                  <li>
                    If your income varies, enter a representative average for a
                    normal month or week, not a best month.
                  </li>
                  <li>
                    For rent, include what you must pay every cycle to keep the
                    lease (base rent plus mandatory fees). Optional utilities
                    are better handled outside this calculation.
                  </li>
                </ul>

                <p className="mt-4">
                  This page only uses what you type. It does not infer
                  deductions, credits, overtime, household size, or special
                  cases. That is intentional: the goal is a fast, consistent
                  affordability screen for a rent decision.
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
                  Both income and rent are converted to annual totals first.
                  This prevents a common mistake: treating “monthly” and “every
                  4 weeks” as if they were the same thing.
                </p>

                <p className="mt-4">
                  The model uses time lengths (not “payments per year”) so each
                  period stays mathematically consistent across views.
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
                  Practical takeaway: when rent is billed weekly or every 4
                  weeks, the annual total often lands higher than a casual “×
                  12” mental shortcut would suggest.
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
                  After annualizing your gross income, the calculator estimates
                  annual take-home pay using your effective tax rate. From that
                  same annual basis, it calculates rent share and how much money
                  remains after rent.
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

                <p className="mt-4">How to use the outputs:</p>
                <ul className="mt-2 list-disc pl-5 space-y-2">
                  <li>
                    <strong>Rent share</strong> is the pressure gauge. If it is
                    high for your situation, you are relying on perfect months
                    and no surprises.
                  </li>
                  <li>
                    <strong>After rent</strong> is the operating budget for
                    everything else. If it cannot cover your baseline costs with
                    margin, the decision changes.
                  </li>
                  <li>
                    <strong>Net income</strong> is the anchor that makes mixed
                    periods comparable without guessing.
                  </li>
                </ul>

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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
