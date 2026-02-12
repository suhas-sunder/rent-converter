import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="mt-8 mb-12 rc-no-print"
      aria-label="Tool fit"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
          </div>

          <div className="relative p-6 sm:p-10">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight">
                Who this rent per paycheck tool is for
              </h2>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">
                    This tool is for:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    Allocating your rent across paychecks by pay frequency
                    (weekly, biweekly, semimonthly, or monthly) so you know what
                    to set aside each time you get paid.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold text-slate-600">
                    Why this tool is different:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    It converts rent to an annual total first, then divides by
                    paycheck counts (52/26/24/12) so “biweekly” and
                    “semimonthly” are treated correctly instead of being lumped
                    together.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">
                    This tool is not for:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    Calculating an exact payment schedule for a specific
                    calendar, including which paycheck covers which rent due
                    date, prorations, fees, or month-by-month cashflow timing.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-sky-50/60 p-5 sm:col-span-2">
                  <div className="text-xs font-semibold text-slate-600">
                    When to use another tool:
                  </div>
                  <p className="mt-2 text-slate-800 leading-relaxed">
                    If you are trying to compare listings that are priced on
                    different rent periods (weekly vs monthly vs 4-week), start
                    with{" "}
                    <Link
                      to="/rent-calculator"
                      className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      Rent Calculator
                    </Link>{" "}
                    for a period-to-period breakdown, then come back here to
                    translate that annual cost into a per-paycheck set-aside
                    amount.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                <div className="text-sm font-bold text-sky-900">
                  Quick sanity check
                </div>
                <p className="mt-2 text-slate-700 leading-relaxed ">
                  “Biweekly” and “twice per month” are not the same. Biweekly is
                  typically 26 paychecks per year, while semimonthly is
                  typically 24. This tool keeps that distinction explicit so the
                  set-aside amount does not drift over the year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
