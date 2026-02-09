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
                  Rent vs buy calculator model and outputs
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page compares renting and buying by running both
                  scenarios under the same time horizon and assumptions. Renting
                  is treated as a cash outflow that can grow once per year.
                  Buying is modeled as cash outflows plus a tracked mortgage
                  balance and an estimated sale result at the end. The goal is a
                  consistent comparison that lets you see what is driving the
                  difference.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Horizon based
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Assumption driven
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUTS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent, home price, rates
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  RENT SIDE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Cash paid over time
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BUY SIDE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Costs + balance tracking
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUTS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Totals + year table
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: what it returns */}
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
                      What this calculator returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    You get two modeled totals over your chosen horizon: total
                    rent paid and a buying-side ownership net cost. The buying
                    number is computed as total ownership cash outflow
                    (including upfront costs and ongoing costs) minus estimated
                    net sale proceeds at the end of the horizon.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core idea
                    </div>
                    <p className="mt-2">
                      The comparison is consistent because both sides are
                      evaluated on the same horizon and the same assumptions you
                      enter.
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      The outputs are scenario estimates. They are not a
                      prediction of sale price, rent, or rates.
                    </p>
                  </div>

                  <p>
                    The year-by-year table is the useful part for most people.
                    It shows how rent paid accumulates, how ownership costs
                    stack up, how the mortgage balance changes, and how modeled
                    equity evolves year to year. That makes it easy to see which
                    inputs are doing the work instead of relying on a single
                    headline.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: rent side */}
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
                        d="M5 12h14M5 7h14M5 17h10"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Rent side model
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The rent side starts with a monthly rent and treats it as a
                    cash expense. If you enter a rent increase percentage, rent
                    steps up once per year and the tool sums the total rent paid
                    across the horizon. There is no residual value on the rent
                    side.
                  </p>

                  <p>
                    This is intentionally simple. The rent total is meant to be
                    a clean baseline that stays comparable to the buy-side cash
                    outflows. If your situation includes separate recurring
                    items that you consider rent-adjacent, keep them out of this
                    model unless the calculator has explicit fields for them.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        What counts on rent
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Monthly rent amount</li>
                        <li>Annual rent increase, if provided</li>
                        <li>Total paid over the horizon</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        What does not count
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Investment returns on savings</li>
                        <li>Tax deductions or credits</li>
                        <li>Move costs unless separately entered</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: buy side */}
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
                        d="M7 10V7a5 5 0 0110 0v3M6 10h12l-1 11H7L6 10z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Buy side model
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The buy side estimates a standard mortgage payment from the
                    home price, down payment, interest rate, and loan term you
                    enter. The payment is treated as principal plus interest so
                    the remaining mortgage balance can be tracked over time.
                  </p>

                  <p>
                    On top of the mortgage payment, the tool adds ownership
                    costs you provide such as property tax, insurance,
                    maintenance, and HOA. Those items are treated as cash
                    expenses and included in the ownership outflow each year.
                  </p>

                  <p>
                    Home value is updated once per year using your appreciation
                    rate. That modeled home value affects both the estimated
                    equity line in the year table and the estimated sale result
                    at the end of the horizon.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      End-of-horizon sale estimate
                    </div>
                    <p className="mt-2">
                      Net sale proceeds are computed as modeled home value minus
                      selling costs minus remaining mortgage balance. The tool
                      then compares total rent paid against ownership outflow
                      minus net sale proceeds.
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      This is a mechanical estimate based on your inputs. It is
                      not a market quote.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: table interpretation */}
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
                        d="M4 19V5m0 14h16M8 15V9m4 6V7m4 8v-5"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      How to read the year-by-year table
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The year table is where the model becomes transparent. The
                    rent columns show rent paid each year and cumulative rent
                    paid. The buy columns show annual ownership outflow,
                    remaining mortgage balance, and estimated equity based on
                    modeled home value.
                  </p>

                  <p>
                    If the buy side changes sharply from one year to the next,
                    it is usually coming from one of three places: a higher
                    ownership cost assumption, a different appreciation rate, or
                    a different loan structure. The table is built to make those
                    drivers obvious.
                  </p>

                  <p>
                    Summary totals at the top are derived directly from the same
                    year-by-year numbers. If you want to sanity-check the
                    headline, the table is the place to do it.
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
                  Scope note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                  This is a scenario comparison, not a forecast
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The calculator applies the assumptions you enter and keeps
                  them consistent across both sides. It does not attempt to
                  model tax law, investment returns, refinancing, or market
                  timing unless the page has explicit fields for those items.
                  Treat the outputs as a structured way to compare scenarios on
                  the same horizon.
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related tools:{" "}
              <Link
                to="/rent-affordability-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent affordability calculator
              </Link>{" "}
              and{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
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
