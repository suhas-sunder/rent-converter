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
                  How this rent affordability target calculator works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Enter your income, pick the pay period, and this page turns it
                  into one consistent yearly total. Then it shows what your rent
                  budget looks like at common targets (25%, 30%, 35%), converted
                  back into the billing cycles you actually see in listings.
                  Everything stays consistent so you can compare numbers without
                  hidden assumptions.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Consistent time model
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Targets: 25% / 30% / 35%
                </span>
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
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Convert to daily
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  ANNUALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Daily × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Targets + cycles
                </div>
              </div>
            </div>
          </div>

          {/* SectionCard: related tools */}
          <div className="group relative my-8 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
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
                  Use these tools when you need something slightly different
                  than a target rent budget.
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
                        Convert rent between monthly, weekly, biweekly, annual,
                        daily, and hourly.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-as-percentage-of-income-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent as percentage of income calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Check what share of your income a specific rent would
                        take.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/how-much-rent-can-i-afford-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        How much rent can I afford calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Explore affordability starting from a rent amount.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-split-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent split calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Split rent between roommates.
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
                        Turn monthly rent into a per-paycheck budget.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-due-date-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent due date calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Plan around due dates and timing.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-after-tax-income-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent after tax income calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Budget using take-home pay instead of gross income.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-vs-take-home-pay-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent vs take-home pay calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Compare rent to what you actually keep.
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="text-slate-700">
                  If you’re also comparing rent cycles directly, these help:{" "}
                  <Link
                    to="/weekly-to-annual-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    weekly to annual rent converter →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/monthly-to-annual-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    monthly to annual rent converter →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/annual-to-monthly-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    annual to monthly rent converter →
                  </Link>
                </p>
              </div>
            </div>
          </div>
          {/* SectionCard: examples (own section) */}
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
                  These examples show how to read the outputs. Your exact
                  numbers will vary, but the idea is the same: pick a target,
                  then compare the rent equivalents in the cycle you care about.
                </p>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-3">
                    <li>
                      <span className="font-semibold text-slate-900">
                        Weekly income:
                      </span>{" "}
                      You earn{" "}
                      <span className="font-semibold text-slate-900">
                        $1,200/week
                      </span>
                      . At{" "}
                      <span className="font-semibold text-slate-900">30%</span>,
                      your rent target is{" "}
                      <span className="font-semibold text-slate-900">
                        about $360/week
                      </span>
                      , and the page also shows the monthly equivalent to
                      compare to listings.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Monthly income:
                      </span>{" "}
                      You earn{" "}
                      <span className="font-semibold text-slate-900">
                        $3,000/month
                      </span>
                      . At{" "}
                      <span className="font-semibold text-slate-900">25%</span>,
                      your rent target is{" "}
                      <span className="font-semibold text-slate-900">
                        about $750/month
                      </span>
                      , plus weekly and annual equivalents for quick
                      cross-checks.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Comparing listing cycles:
                      </span>{" "}
                      One place is{" "}
                      <span className="font-semibold text-slate-900">
                        $2,250/month
                      </span>{" "}
                      and another is{" "}
                      <span className="font-semibold text-slate-900">
                        $520/week
                      </span>
                      . Use the{" "}
                      <Link
                        to="/rent-converter"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        universal rent converter →
                      </Link>{" "}
                      to put both in the same cycle before you decide which is
                      actually cheaper.
                    </li>
                  </ul>
                </div>

                <p>
                  If you want the rent target expressed per paycheck, use{" "}
                  <Link
                    to="/rent-per-paycheck-calculator"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    rent per paycheck calculator →
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: inputs */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 1: Add your income and choose the pay period
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Put in the income number you want to plan with, then choose
                    the period that number belongs to (hourly, daily, weekly,
                    biweekly, every 4 weeks, monthly, or annual). The calculator
                    treats your input as the truth for that period and keeps the
                    rest of the math consistent from there.
                  </p>

                  <p>
                    It does not try to “correct” your income. If you want to
                    plan using take-home pay, enter take-home pay. If you want
                    to plan using gross pay, enter gross pay. Either way, the
                    results stay comparable across cycles because they come from
                    the same annual basis.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Input rules (so the number stays honest)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Commas are treated as thousands separators:{" "}
                        <span className="font-semibold text-slate-900">
                          1,234
                        </span>{" "}
                        → 1234
                      </li>
                      <li>
                        Decimals are supported and preserved (up to 12 places):{" "}
                        <span className="font-semibold text-slate-900">
                          3000.50
                        </span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">.5</span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">
                          12.
                        </span>
                      </li>
                      <li>
                        If an input format could plausibly mean two different
                        numbers, the page warns instead of guessing.
                      </li>
                    </ul>
                  </div>

                  <p>
                    If you mainly want to convert a known rent amount between
                    billing cycles, use the{" "}
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      universal rent converter →
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: annualization */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 2: Convert everything to one yearly income number
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    To keep comparisons fair, the calculator converts your pay
                    period to a daily amount first, then annualizes it using a
                    fixed 365-day year. That means switching from “weekly” to
                    “monthly” does not quietly change the underlying model.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Annualization model
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Annual income
                      </span>{" "}
                      = daily income × 365
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      “Daily income” is derived from the period you chose
                      (weekly ÷ 7, biweekly ÷ 14, hourly × 24, and so on).
                    </p>
                  </div>

                  <p>
                    Once that annual number exists, the rest becomes simple:
                    apply a target percentage, then convert the target rent back
                    into the cycle you care about.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: targets */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 3: See your rent budget at common targets
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The page shows multiple rent-share targets so you can
                    compare tradeoffs. A smaller percentage leaves more room for
                    savings and bills. A higher percentage may still work, but
                    it is a useful stress test when you are comparing
                    neighborhoods or unit types.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        25%
                      </div>
                      <p className="mt-2 text-slate-700">
                        Conservative budgeting, more breathing room.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        30%
                      </div>
                      <p className="mt-2 text-slate-700">
                        A common benchmark for quick comparisons.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        35%
                      </div>
                      <p className="mt-2 text-slate-700">
                        Higher target to test “tight but possible.”
                      </p>
                    </div>
                  </div>

                  <p>
                    These are targets, not rules. If your budget has big fixed
                    costs (debt, childcare, commuting), treat the lower target
                    as a safer starting point.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: cycles */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 4: Convert targets into the cycles you use
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    After it calculates your annual rent target, the calculator
                    converts it into familiar cycles like monthly, weekly,
                    biweekly, and every 4 weeks. This is especially helpful when
                    your pay period does not match how rent is listed, or when
                    you are comparing two rentals priced in different cycles.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Assumptions used (kept consistent everywhere)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-700">
                      <li>Year = 365 days</li>
                      <li>Month = 365 ÷ 12 days (average month)</li>
                      <li>Week = 7 days</li>
                      <li>Every 4 weeks = 28 days</li>
                      <li>Hourly conversions assume 24 hours/day</li>
                    </ul>
                  </div>

                  <p>
                    For pure cycle conversions, use a dedicated converter like{" "}
                    <Link
                      to="/monthly-to-weekly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      monthly to weekly rent converter →
                    </Link>{" "}
                    or{" "}
                    <Link
                      to="/weekly-to-monthly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      weekly to monthly rent converter →
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Dark utility callout */}
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
                  Targets are math, not a guarantee
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This page gives you consistent equivalents so you can compare
                  rent options without mixing models. It does not decide what is
                  “affordable,” and it does not guess what your income includes.
                  If the number you want to plan with is different, change the
                  input and the rest of the math stays straightforward.
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
