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
          <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                  Rent vs take-home pay comparison
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page answers a simple budgeting question:{" "}
                  <span className="font-semibold text-slate-900">
                    how much of my take-home pay goes to rent?
                  </span>{" "}
                  You can enter rent and take-home pay in different periods (for
                  example, weekly pay with monthly rent, or biweekly pay with
                  28-day rent). The tool converts both to the same annual basis
                  first, then computes rent share and the amount left over.
                </p>
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
                  METHOD
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annualize both values
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent % + after-rent
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
                    The calculator produces two headline outputs derived from
                    the same annual basis:
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Rent share of take-home
                      </div>
                      <p className="mt-2">
                        Rent share = annual rent ÷ annual take-home pay, shown
                        as a percentage.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Income left after rent
                      </div>
                      <p className="mt-2">
                        After-rent = annual take-home pay − annual rent, with
                        equivalents shown in other periods for readability.
                      </p>
                    </div>
                  </div>

                  <p>
                    The monthly, weekly, and 28-day figures shown under the
                    results are not separate calculations with new assumptions.
                    They are derived from the same annual totals so you can view
                    the same relationship in familiar cycles without mixing
                    definitions.
                  </p>
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
                    People get misleading results when pay and rent are entered
                    in different cycles and the math silently treats one cycle
                    as close enough to another. This tool avoids that by
                    converting both inputs to annual totals first, then
                    computing the ratio and remainder on that same basis.
                  </p>

                  <p>
                    Converting through annual totals does two practical things:
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      It prevents monthly from being treated as a fixed number
                      of weeks, which can shift the implied annual totals.
                    </li>
                    <li>
                      It keeps fixed-day cycles visible. A 28-day rent schedule
                      is not the same thing as a calendar month, and that
                      mismatch is exactly what causes confusion in budgeting.
                    </li>
                  </ul>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Consistency rule
                    </div>
                    <p className="mt-2">
                      Annualize pay and rent first. Compute rent share and
                      leftover from those annual totals. Convert back to display
                      periods only for readability.
                    </p>
                  </div>
                </div>
              </div>
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
                      How it works (exactly)
                    </h3>
                  </div>
                </div>

                <div className="mt-4">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong className="text-slate-900">
                        Enter your take-home pay and choose its period.
                      </strong>{" "}
                      Take-home pay is treated as what lands in your account for
                      budgeting. It is not gross pay and it is not automatically
                      adjusted for taxes, deductions, or benefits.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Enter your rent and choose its period.
                      </strong>{" "}
                      Rent is treated as the rent amount only. The tool does not
                      add utilities, fees, parking, debt payments, or other
                      household costs unless you include them in the rent number
                      you enter.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Both inputs are annualized on the same model.
                      </strong>{" "}
                      Fixed-day cycles use their day lengths (weekly = 7 days,
                      biweekly = 14 days, every 4 weeks = 28 days). Monthly uses
                      an average month length derived from the same annual
                      basis.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Rent share and after-rent are computed from annual
                        totals.
                      </strong>{" "}
                      Rent share = annual rent ÷ annual take-home pay.
                      After-rent = annual take-home pay − annual rent.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Display periods are derived from the same annual totals.
                      </strong>{" "}
                      The monthly, weekly, and 28-day blocks shown under results
                      are conversions of the same annual rent and annual
                      take-home pay. They exist to help you read the numbers in
                      a cycle you recognize without changing the math.
                    </li>
                  </ol>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Why this matters for mixed cycles
                    </div>
                    <p className="mt-2">
                      If you are paid weekly and rent is monthly, the tool does
                      not pretend that a month equals four weeks. If rent is
                      every 28 days, it does not quietly convert it into monthly
                      by assuming 30 days. The entire point is that cycles do
                      not line up, so annualizing is the neutral meeting point.
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
                    This page is a rent-versus-income share calculator based on
                    take-home pay. It is designed for quick comparison and
                    budgeting checks, not for building a full household budget.
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
                    </div>
                  </div>

                  <p>
                    If you need an estimate from gross income, use the after-tax
                    tool. If you need an apples-to-apples conversion of a
                    listing between weekly, monthly, and 28-day cycles, use the
                    rent converter hub.
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
                  The outputs are annualized equivalents and period views. They
                  do not attempt to model when money leaves your account. If you
                  need a calendar schedule of due dates (especially for 28-day
                  cycles), use the due-date calculator instead of relying on
                  period equivalence.
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related tools:{" "}
              <Link
                to="/how-much-rent-can-i-afford-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                how much rent can I afford
              </Link>
              ,{" "}
              <Link
                to="/rent-after-tax-income-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent after-tax income calculator
              </Link>
              , and{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
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
