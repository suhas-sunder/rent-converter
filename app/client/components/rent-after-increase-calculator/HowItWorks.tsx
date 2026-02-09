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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                  How the rent after increase calculator works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page applies a defined increase to a rent amount and then
                  expresses the updated rent across common time periods using
                  one consistent time basis. It converts through an annual
                  reference so the before-and-after numbers stay comparable
                  across monthly, weekly, and 28-day views.
                </p>
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
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  MODE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Percent or fixed
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual basis
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Updated breakdown
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
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  Inputs and validation
                </h3>
                <p className="mt-4">
                  Inputs are validated before results are shown. If the current
                  rent, increase percent, or increase amount is invalid or
                  ambiguous, the calculator avoids outputting a misleading “0”
                  or a guessed value. The tool only uses what you explicitly
                  provide.
                </p>
                <p className="mt-4">
                  The parser supports currency symbols, thousands separators,
                  and decimal formats such as <strong>.5</strong> and{" "}
                  <strong>12.</strong>. If an entry could reasonably be read
                  more than one way, the page surfaces an error or warning
                  rather than silently picking an interpretation.
                </p>
                <p className="mt-4">
                  This calculator does not infer inclusions. Utilities, fees,
                  taxes, deposits, and one-time charges are not added or
                  removed. Whatever “rent” means for your use case is the number
                  you enter.
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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  One consistent annual basis
                </h3>
                <p className="mt-4">
                  Everything is converted through an annual reference based on a
                  365-day year. Months are treated as an average month length of{" "}
                  <strong>365 ÷ 12</strong> days. Weekly is always 7 days.
                  Biweekly is always 14 days. Every 4 weeks is always 28 days.
                  Those time lengths are what drive equivalence values across
                  the breakdown.
                </p>
                <p className="mt-4">
                  This is not a payment-schedule model. The equivalence math
                  does not assume “monthly × 12” or “4-week × 13” as the basis
                  for the breakdown. Those schedule totals can be shown
                  elsewhere for context, but the conversion here is based on
                  time length so the outputs remain compatible across periods.
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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  Percent mode vs fixed-amount mode
                </h3>

                <p className="mt-4">
                  Percent mode treats the current annual rent as the baseline
                  and computes the increase as a proportion of that annual
                  total. The annual increase is:
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Percent mode
                  </div>
                  <p className="mt-2 text-slate-700">
                    <strong>Annual increase</strong> = annual current rent ×
                    (percent ÷ 100)
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    The new annual total is then converted back into hourly,
                    daily, weekly, biweekly, 4-week, monthly, and annual
                    equivalents using the same time basis.
                  </p>
                </div>

                <p className="mt-5">
                  Fixed-amount mode treats the increase as an add-on in the same
                  billing period as the rent you entered. If rent is monthly and
                  the increase amount is entered, the increase is interpreted as
                  a monthly add-on. If rent is weekly, it’s treated as a weekly
                  add-on. That combined amount is then annualized on the same
                  365-day and average-month basis.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Fixed-amount mode
                  </div>
                  <p className="mt-2 text-slate-700">
                    <strong>New period rent</strong> = current rent + fixed
                    increase (same period)
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    The period result is then annualized and reconverted into
                    the full breakdown so all displayed periods reconcile to the
                    same annual total.
                  </p>
                </div>

                <p className="mt-5">
                  The calculator does not infer whether a fixed increase is
                  temporary, capped, prorated, or offset by other changes. It
                  applies the numbers mechanically and shows the resulting
                  equivalents.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  Outputs, precision, and printing
                </h3>

                <p className="mt-4">
                  Results are converted back into common periods so the change
                  can be viewed consistently: hourly, daily, weekly, biweekly,
                  every 4 weeks, monthly, and annual. All outputs come from the
                  same annual basis.
                </p>

                <p className="mt-4">
                  Rounding is display-only. Internally the calculator preserves
                  decimals (up to 12 places). Enabling rounding changes only
                  what is shown on screen, not the underlying computed values.
                </p>

                <p className="mt-4">
                  Printing uses your browser’s print dialog, including
                  save-as-PDF. The breakdown is formatted to remain readable
                  when printed.
                </p>

                <div className="mt-5 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What you can do
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Compute the updated rent in the same period you entered
                    </li>
                    <li>See the annual impact without switching assumptions</li>
                    <li>
                      Compare monthly and 28-day views without treating them as
                      the same period
                    </li>
                    <li>Print or save a PDF copy of the results</li>
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
                  Utility note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  Percent and fixed increases behave differently across periods
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  A percent increase scales with the baseline annual rent. A
                  fixed increase depends on the period it’s attached to. This
                  page keeps both modes on the same annual basis so the updated
                  weekly, monthly, and 28-day equivalents can be compared
                  without hidden shortcuts.
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/rent-increase-percentage-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent increase percentage calculator
              </Link>
              ,{" "}
              <Link
                to="/rent-increase-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent increase calculator
              </Link>
              , and{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent paid every 4 weeks calculator
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
