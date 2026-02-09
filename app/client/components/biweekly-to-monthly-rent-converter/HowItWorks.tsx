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
                  How the biweekly to monthly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a biweekly rent amount into a monthly
                  equivalent by normalizing the input through days, then scaling
                  it to an annual total and dividing by twelve. Biweekly is
                  treated as a fixed 14-day period. Monthly is treated as an
                  average month based on a 365-day year.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 14 days
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
                  Biweekly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Daily = ÷ 14
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
                  FINAL
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly = ÷ 12
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: core model */}
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
                    The converter follows a single, explicit path so assumptions
                    do not change mid-calculation. Your biweekly input is first
                    converted into a per-day amount, then expanded to an annual
                    total, and finally divided into twelve equal monthly parts.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Daily</strong> = biweekly ÷ 14
                      </li>
                      <li>
                        <strong>Annual</strong> = daily × 365
                      </li>
                      <li>
                        <strong>Monthly</strong> = annual ÷ 12
                      </li>
                      <li>
                        Combined:{" "}
                        <strong>Monthly = biweekly × 365 ÷ (14 × 12)</strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Monthly corresponds to an average month length of 365 ÷ 12
                      days.
                    </p>
                  </div>

                  <p>
                    This approach avoids treating “biweekly” as “twice per
                    month” and avoids treating “monthly” as a fixed 30-day or
                    28-day interval. Each step is derived from time length, not
                    payment counts.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why not divide by 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why monthly is not biweekly × 2
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    A common shortcut is to double a biweekly amount to estimate
                    a monthly cost. That shortcut assumes a month is exactly two
                    biweekly periods (28 days). In reality, calendar months
                    average about 30.42 days.
                  </p>

                  <p>
                    If you doubled a biweekly amount, you would be comparing a
                    28-day value to a monthly label. Over a full year, that
                    shortcut produces drift. This page avoids that by anchoring
                    both sides to the same annual total before computing
                    monthly.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Biweekly definition
                      </div>
                      <p className="mt-2">
                        Biweekly always means 14 days on this page.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Monthly definition
                      </div>
                      <p className="mt-2">
                        Monthly is an average month derived from a 365-day year.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown behavior */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  How the breakdown stays consistent
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Once the daily rate is established, every other period is
                    derived from that same basis. Weekly uses seven days. 4-week
                    uses twenty-eight days. Monthly uses an average month
                    length. Because all lines reconcile to the same annual
                    total, comparisons stay coherent.
                  </p>

                  <p>
                    The breakdown is intentionally derived from daily, not from
                    the monthly value. This prevents rounding drift and avoids a
                    situation where one line looks correct but does not
                    reconcile with the others.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: precision and exports */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Precision, ambiguity handling, and exports
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Inputs are parsed as decimal numbers. Commas are treated as
                    thousands separators. Currency symbols may be present and
                    ignored for numeric parsing. Computation uses fixed-point
                    arithmetic with preserved precision.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>1,234</strong> is interpreted as 1234
                    </li>
                    <li>
                      <strong>1.234</strong> is interpreted as 1.234
                    </li>
                    <li>
                      Edge formats such as <strong>.5</strong> and{" "}
                      <strong>12.</strong> are supported
                    </li>
                  </ul>

                  <p>
                    If an input could reasonably be interpreted in more than one
                    way, the tool should show a warning or error instead of
                    producing a clean-looking but misleading result.
                  </p>

                  <p>
                    You can export the breakdown to CSV for record-keeping or
                    print the page and save it as a PDF. This section is marked
                    no-print so it does not clutter printed output.
                  </p>
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-800">
                  Monthly here is an average, not a billing schedule
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This page produces a monthly equivalent derived from an annual
                  total. It does not attempt to model calendar due dates or
                  payment timing. If your rent is billed every 28 days, that is
                  shown as a separate 4-week line, not merged into the monthly
                  value.
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
