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
          <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                  Rent vs take-home pay comparison
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page answers one decision question:{" "}
                  <span className="font-semibold text-slate-900">
                    is this rent workable with my take-home pay?
                  </span>{" "}
                  Enter your take-home pay and rent even if they use different
                  cycles (weekly pay with monthly rent, biweekly pay with 28-day
                  rent, and so on). The tool converts both to the same annual
                  basis, then shows:
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-600 leading-7 max-w-2xl">
                  <li>
                    the share of your take-home pay that rent consumes (a stress
                    check),
                  </li>
                  <li>
                    what is left after rent (a budget reality check you can
                    apply to everything else).
                  </li>
                </ul>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Annual basis
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Periods can differ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Take-home pay + period
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  Use the amount that actually hits your account for that pay
                  cycle.
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent + period
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  Enter the rent you must pay each cycle, before any optional
                  extras.
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  METHOD
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annualize both values
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  Removes “4 weeks = a month” assumptions so cycles compare
                  cleanly.
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent % + after-rent
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  A ratio for stress-testing, plus the dollars you live on.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2  font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="text-slate-700 leading-relaxed">
              Related tools:{" "}
              <Link
                to="/how-much-rent-can-i-afford-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                how much rent can I afford
              </Link>
              <span className="text-slate-700">
                {" "}
                when you want a top-end rent target from your income rather than
                checking a specific listing.
              </span>
              ,{" "}
              <Link
                to="/rent-after-tax-income-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent after-tax income calculator
              </Link>
              <span className="text-slate-700">
                {" "}
                when you only know gross pay and need a take-home estimate
                before judging rent.
              </span>
              , and{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
              </Link>
              <span className="text-slate-700">
                {" "}
                when you want pure period conversions for listings (weekly vs
                monthly vs 28-day) without comparing to income.
              </span>
              .
            </p>
          </div>

          {/* SectionCard: step-by-step */}
          <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M9 6v12m6-12v12"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                    How it works
                  </h3>
                </div>
              </div>

              <div className="mt-4">
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong className="text-slate-900">
                      Enter your take-home pay and choose its period.
                    </strong>{" "}
                    Use your net pay for that cycle (the deposit amount), since
                    the decision is “can I cover rent and still live,” not “what
                    is my salary.”
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      Enter your rent and choose its period.
                    </strong>{" "}
                    Use the required rent payment for that cycle. If you want
                    utilities or parking treated as “rent” for affordability,
                    bundle them into the number you enter.
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      Convert both inputs to annual totals using their real
                      cycle lengths.
                    </strong>{" "}
                    Fixed-day cycles use their day lengths (weekly = 7, biweekly
                    = 14, 28-day = 28). Monthly is derived from the same annual
                    basis so it stays consistent with everything else.
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      Compute the two decision outputs from those annual totals.
                    </strong>{" "}
                    Rent share shows how “tight” the rent is. After-rent shows
                    what you must cover everything else with.
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      Show equivalent views for readability, not new math.
                    </strong>{" "}
                    Monthly, weekly, and 28-day result blocks are the same
                    relationship expressed in different cycles so you can sanity
                    check against how you think and budget.
                  </li>
                </ol>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
                    Why this matters for mixed cycles
                  </div>
                  <p className="mt-2">
                    If you get paid weekly and rent is monthly, “monthly = four
                    weeks” will misstate the yearly totals and can swing the
                    rent share enough to change a yes/no decision. Annualizing
                    is the neutral meeting point that keeps the comparison
                    honest.
                  </p>
                  <ul className="mt-3 list-disc pl-5 space-y-2">
                    <li>
                      A 28-day rent schedule is more payments per year than a
                      calendar month schedule.
                    </li>
                    <li>
                      A weekly pay cycle does not line up cleanly with any
                      calendar month.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: what it does */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 7h16M4 12h12M4 17h14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      What you get on this page
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Use the results to make one call: keep pursuing a listing,
                    or walk away because rent squeezes your take-home too hard.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Rent share of take-home
                      </div>
                      <p className="mt-2">
                        A single percentage that tells you how much of your
                        take-home is locked into housing before any other bills.
                      </p>
                      <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          Use it to compare two listings even when rent cycles
                          differ.
                        </li>
                        <li>
                          Use it to spot “looks cheaper” traps (weekly or 28-day
                          listings that understate the annual cost).
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Income left after rent
                      </div>
                      <p className="mt-2">
                        The dollars you have left to run your life: food,
                        transit, debt, savings, and everything else.
                      </p>
                      <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          Compare it to your real non-rent spending and savings
                          minimums.
                        </li>
                        <li>
                          Treat a negative result as an immediate dealbreaker.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      How to read the extra period blocks
                    </div>
                    <p className="mt-2">
                      The monthly, weekly, and 28-day blocks are the same annual
                      totals expressed in familiar cycles. They help you check
                      the numbers against your own budgeting rhythm, without
                      changing the underlying comparison.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: why annual basis */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M12 5v14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Why everything converts through annual totals
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    This section exists for one purpose: to prevent cycle
                    shortcuts from changing the decision. When pay and rent use
                    different periods, “close enough” conversions can understate
                    or overstate the true rent burden across a full year.
                  </p>

                  <p>
                    Converting through annual totals protects you from the two
                    mistakes people actually make:
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-slate-900">
                        Treating a month like a fixed number of weeks.
                      </strong>{" "}
                      That shifts the annual totals and can make a tight listing
                      look safe.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Treating 28-day cycles like calendar months.
                      </strong>{" "}
                      A 28-day schedule typically means more rent payments per
                      year than “monthly,” so the yearly cost is higher than it
                      looks at a glance.
                    </li>
                  </ul>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Consistency rule
                    </div>
                    <p className="mt-2">
                      Annualize pay and rent first. Compute rent share and
                      after-rent from those annual totals. Only then convert to
                      monthly, weekly, or 28-day views for interpretation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: scope */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 7h10v10H7z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Scope and expectations
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    This is a rent burden check against take-home pay. It is
                    built for fast decisions on specific rents, not for
                    forecasting your full lifestyle budget.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Included
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Rent amount in your selected period</li>
                        <li>Take-home pay in your selected period</li>
                        <li>Annualized rent share and after-rent totals</li>
                        <li>Equivalent views (monthly, weekly, 28-day)</li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600 leading-6">
                        Best for: “Can I take this place without blowing up my
                        monthly cash flow?”
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Not included
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Utilities, internet, parking, or fees</li>
                        <li>Debt payments, groceries, or other costs</li>
                        <li>Tax calculations</li>
                        <li>Calendar due-date planning</li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600 leading-6">
                        If those costs decide the deal for you, add them into
                        the rent input or use a separate budgeting workflow.
                      </p>
                    </div>
                  </div>

                  <p>
                    If you need an estimate from gross income, use the after-tax
                    tool. If you need clean period conversions for listings (not
                    an income comparison), use the rent converter hub.
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  This compares amounts, not timing
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Use these results to judge affordability across a year, not to
                  predict cash timing. Rent and pay can hit on different days,
                  different weeks, and different months. If you are trying to
                  plan due dates (especially with 28-day schedules), you need a
                  calendar schedule tool. Period equivalence is not a payment
                  calendar.
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-200 leading-7">
                  <li>
                    A “safe” annual rent share can still cause short-term
                    shortfalls if paydays and rent due dates clash.
                  </li>
                  <li>
                    Use the period views here to interpret affordability, not to
                    decide which exact week a payment lands.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
