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
                  How the daily to monthly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page starts from a daily rent amount and produces a
                  monthly equivalent by scaling through an annual total. Daily
                  is treated as the base unit. Monthly is treated as an average
                  month derived from a 365-day year. All other period values
                  shown on the page reconcile to the same daily input.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Daily = base unit
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Monthly = annual ÷ 12
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Daily amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SCALE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual = × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DERIVE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly = ÷ 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BREAKDOWN
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  All periods from daily
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The conversion path used on this page
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The converter treats your daily input as covering exactly
                    one day. From there, it expands that amount to a full year
                    using a fixed 365-day assumption. The monthly value is then
                    computed by dividing the annual total into twelve equal
                    parts.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Annual</strong> = daily × 365
                      </li>
                      <li>
                        <strong>Monthly</strong> = annual ÷ 12
                      </li>
                      <li>
                        Combined: <strong>Monthly = daily × 365 ÷ 12</strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Monthly corresponds to an average month length of 365 ÷ 12
                      days.
                    </p>
                  </div>

                  <p>
                    This approach keeps the math reversible. If you multiply the
                    monthly result by twelve, you return to the same annual
                    total. If you divide the annual by 365, you return to the
                    original daily rate.
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why 30-day months are shown separately
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    A 30-day month is a common shortcut, but it is a different
                    definition than an average month derived from a 365-day
                    year. This page shows both so you can compare them, but it
                    uses the average-month framework for the headline result so
                    the whole breakdown stays internally consistent.
                  </p>

                  <div className="mt-3 text-sm flex flex-wrap gap-x-5 gap-y-2">
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent converter →
                    </Link>
                    <Link
                      to="/rent-affordability-calculator"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent affordability →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-200">
                  Monthly here is an average, not a due date
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This converter produces a monthly equivalent derived from a
                  daily rate via an annual total. It does not attempt to predict
                  calendar billing dates or month-specific charges.
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
