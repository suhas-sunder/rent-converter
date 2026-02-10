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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                  How the rent after increase calculator works
                </h2>
                <div className="mt-2 text-slate-600 leading-7 max-w-2xl space-y-3">
                  <p>
                    This page answers one decision: after a rent increase, what
                    are you actually committing to over the year, and does it
                    still fit your budget.
                  </p>
                  <p>
                    Enter your current rent, choose how the increase is defined
                    (percent or fixed), and the calculator returns the updated
                    rent plus a period-by-period breakdown that stays consistent
                    across monthly, weekly, biweekly, and every 4 weeks.
                  </p>
                  <p>
                    If your situation is purely “convert this rent from one
                    period to another” (no increase involved), use the{" "}
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
                <div className="mt-2 text-xs text-slate-600 leading-6">
                  The amount you pay today and the period it belongs to.
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  MODE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Percent or fixed
                </div>
                <div className="mt-2 text-xs text-slate-600 leading-6">
                  Choose how the increase is defined in the notice or offer.
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CALCULATE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  New rent
                </div>
                <div className="mt-2 text-xs text-slate-600 leading-6">
                  One updated rent number, anchored to your selected period.
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Full breakdown
                </div>
                <div className="mt-2 text-xs text-slate-600 leading-6">
                  Weekly, monthly, 4-week, and annual views on the same time
                  basis.
                </div>
              </div>
            </div>
          </div>

          {/* Related tools (required) */}
          <div className="group my-8 relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                Related tools
              </h3>

              <div className="mt-4 space-y-3 text-slate-700">
                <p>
                  These tools are useful when the “new rent” number is not the
                  end of the decision.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Use conversion tools when the listing and your budget use
                    different periods (weekly vs monthly vs every 4 weeks).
                  </li>
                  <li>
                    Use percentage tools when you need to justify or verify the
                    change itself (for a notice, cap, or comparison).
                  </li>
                  <li>
                    Use affordability tools when the question is “can I still
                    carry this” after the increase.
                  </li>
                </ul>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                  <li>
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Universal rent converter →
                    </Link>{" "}
                    Use this when you already have a rent number and need a
                    clean period conversion (no increase math).
                  </li>
                  <li>
                    <Link
                      to="/rent-increase-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent increase calculator →
                    </Link>{" "}
                    Use this when you only need the increase amount itself and
                    not the multi-period breakdown.
                  </li>
                  <li>
                    <Link
                      to="/rent-increase-percentage-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent increase percentage calculator →
                    </Link>{" "}
                    Use this when you have old and new rent and need the percent
                    change for caps, negotiations, or documentation.
                  </li>
                  <li>
                    <Link
                      to="/rent-paid-every-4-weeks-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent paid every 4 weeks calculator →
                    </Link>{" "}
                    Use this when a 28-day billing cycle needs a direct
                    comparison against monthly or annual budgeting.
                  </li>
                  <li>
                    <Link
                      to="/rent-as-percentage-of-income-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent as percentage of income →
                    </Link>{" "}
                    Use this when the decision hinges on income share after the
                    increase, not the rent number alone.
                  </li>
                  <li>
                    <Link
                      to="/how-much-rent-can-i-afford-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      How much rent can I afford →
                    </Link>{" "}
                    Use this when you need a target rent range from your income
                    and want to judge the post-increase rent against it.
                  </li>
                </ul>
              </div>
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
                  <li className="space-y-2">
                    <span className="font-semibold text-slate-900">
                      Percent increase changes the annual commitment:
                    </span>
                    <div className="space-y-1">
                      <p>
                        <strong>Situation:</strong> You are deciding whether to
                        renew when the landlord increases rent by a percentage.
                      </p>
                      <p>
                        <strong>Numbers:</strong> Current rent{" "}
                        <strong>$2,000/month</strong>. Increase{" "}
                        <strong>3%</strong>.
                      </p>
                      <p>
                        <strong>Calculation:</strong> New monthly = 2,000 ×
                        (1.03) = <strong>$2,060/month</strong>. Annual view
                        (same basis) ≈ 2,060 × 12 ={" "}
                        <strong>$24,720/year</strong>.
                      </p>
                      <p>
                        <strong>Result:</strong> Increase is{" "}
                        <strong>$60/month</strong>, about{" "}
                        <strong>$720/year</strong>.
                      </p>
                      <p>
                        <strong>Meaning:</strong> If your yearly housing budget
                        had a $24,000 cap, the renewal now exceeds it, so you
                        either negotiate, change units, or plan a move.
                      </p>
                    </div>
                  </li>

                  <li className="space-y-2">
                    <span className="font-semibold text-slate-900">
                      Fixed increase must match the selected period:
                    </span>
                    <div className="space-y-1">
                      <p>
                        <strong>Situation:</strong> The notice says “+$25 per
                        week,” and you want to confirm the real monthly impact.
                      </p>
                      <p>
                        <strong>Numbers:</strong> Current rent{" "}
                        <strong>$525/week</strong>. Increase{" "}
                        <strong>$25/week</strong>.
                      </p>
                      <p>
                        <strong>Calculation:</strong> New weekly = 525 + 25 ={" "}
                        <strong>$550/week</strong>. Monthly view uses the same
                        basis: 550 × (365 ÷ 12 ÷ 7) ≈{" "}
                        <strong>$2,388.10/month</strong>.
                      </p>
                      <p>
                        <strong>Result:</strong> The weekly add-on is not “$25
                        per month.” It is roughly <strong>$108.10/month</strong>{" "}
                        on average.
                      </p>
                      <p>
                        <strong>Meaning:</strong> If you were planning for a
                        small monthly bump, this reframes the decision, because
                        the real monthly cash flow is materially higher.
                      </p>
                    </div>
                  </li>

                  <li className="space-y-2">
                    <span className="font-semibold text-slate-900">
                      A 28-day listing can look equal but cost more:
                    </span>
                    <div className="space-y-1">
                      <p>
                        <strong>Situation:</strong> You are comparing two
                        options that both look like “$2,150,” but one is billed
                        every 4 weeks.
                      </p>
                      <p>
                        <strong>Numbers:</strong> Option A is{" "}
                        <strong>$2,150/month</strong>. Option B is{" "}
                        <strong>$2,150 every 4 weeks</strong>.
                      </p>
                      <p>
                        <strong>Calculation:</strong> Annual A = 2,150 × 12 ={" "}
                        <strong>$25,800/year</strong>. Annual B = 2,150 × (365 ÷
                        28) ≈ 2,150 × 13.0357 = <strong>$28,026.79/year</strong>
                        .
                      </p>
                      <p>
                        <strong>Result:</strong> The “every 4 weeks” rent is
                        about <strong>$2,226.55/month</strong> on average and
                        roughly <strong>$2,226.79 more per year</strong>.
                      </p>
                      <p>
                        <strong>Meaning:</strong> If the two units are otherwise
                        similar, Option B is not price-equivalent, and the
                        higher annual cost can flip the decision.
                      </p>
                    </div>
                  </li>

                  <li className="space-y-2">
                    <span className="font-semibold text-slate-900">
                      Post-increase affordability is an income decision:
                    </span>
                    <div className="space-y-1">
                      <p>
                        <strong>Situation:</strong> You can handle the increase
                        on paper, but only if rent stays under your income share
                        target.
                      </p>
                      <p>
                        <strong>Numbers:</strong> Updated rent is{" "}
                        <strong>$2,060/month</strong>. Gross income is{" "}
                        <strong>$6,500/month</strong>.
                      </p>
                      <p>
                        <strong>Calculation:</strong> Rent share = 2,060 ÷ 6,500
                        ≈ <strong>31.7%</strong>.
                      </p>
                      <p>
                        <strong>Result:</strong> The increase pushes rent above
                        a 30% target.
                      </p>
                      <p>
                        <strong>Meaning:</strong> If your rule is “stay at or
                        under 30%,” this changes the action: adjust budget,
                        negotiate, or choose a different place. For the full
                        share breakdown, use{" "}
                        <Link
                          to="/rent-as-percentage-of-income-calculator"
                          className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                        >
                          rent as percentage of income
                        </Link>
                        .
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <p className="mt-4">
                If you only want the increase math (without the breakdown), use{" "}
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
                <div className="mt-4 space-y-3">
                  <p>
                    Enter the rent you pay now and the period on your lease or
                    listing (monthly, weekly, biweekly, every 4 weeks, and so
                    on). The period matters because it anchors the increase and
                    the breakdown.
                  </p>
                  <p>
                    This calculator treats your entry as “base rent only.” It
                    does not add or remove utilities, parking, fees, taxes,
                    deposits, or one-time charges.
                  </p>
                </div>

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
                    <li>
                      If your rent includes add-ons that change with the
                      increase (for example, a separate parking fee), enter the
                      rent portion you are actually renegotiating so the change
                      reflects reality
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If the decision you need is “can I afford this at my income,”
                  use{" "}
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

                <div className="mt-4 space-y-3">
                  <p>
                    Choose the mode that matches how the increase is written.
                    The wrong mode is the most common reason people misread an
                    increase.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Choose <strong>percent</strong> when the notice gives a
                      rate (for example 2.5%) or when increases are capped by a
                      percentage.
                    </li>
                    <li>
                      Choose <strong>fixed</strong> when the increase is a flat
                      amount tied to the same period as your current rent (for
                      example “+$25 per week”).
                    </li>
                  </ul>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Percent mode
                    </div>
                    <p className="mt-2 text-slate-700">
                      New rent = current rent × (1 + percent ÷ 100)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Use this when the increase scales with the baseline rent.
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
                      The increase is treated as attached to the period you
                      selected, which is why “+$25/week” is not “+$25/month.”
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

                <div className="mt-4 space-y-3">
                  <p>
                    The breakdown is for comparison and budgeting. It answers
                    questions like “what is this per year” and “is a 28-day
                    listing actually more expensive” without mixing inconsistent
                    labels.
                  </p>
                  <p>
                    All conversions use one time basis: year is 365 days,
                    average month is 365 ÷ 12 days, week is 7 days, biweekly is
                    14 days, and every 4 weeks is 28 days.
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
                    What this avoids
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Treating “monthly” as 30 days in one place and 28 days in
                      another
                    </li>
                    <li>
                      Assuming “every 4 weeks” is interchangeable with “monthly”
                      because the numbers look similar
                    </li>
                    <li>
                      Chaining rounded intermediate values that drift over time
                      (rounding should be display-only)
                    </li>
                    <li>
                      Comparing listings on mismatched periods and choosing the
                      wrong “cheaper” option
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you are comparing a 28-day billed listing to a monthly one,
                  the fastest check is the annual total, or use{" "}
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
                <div className="mt-3 text-slate-200 leading-7 space-y-3">
                  <p>
                    A percent increase scales with the base rent, which is why a
                    small percent can still be a large yearly dollar change on a
                    higher rent.
                  </p>
                  <p>
                    A fixed increase is only meaningful when the period is
                    correct. “+$25/week” is a different commitment than
                    “+$25/mo” once you view it over a year.
                  </p>
                  <p>
                    This page keeps both modes on one time basis so the updated
                    weekly, monthly, 28-day, and annual equivalents can be used
                    directly for decisions instead of guesswork.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
