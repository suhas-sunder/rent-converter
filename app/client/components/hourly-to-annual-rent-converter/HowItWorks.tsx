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
                  How the hourly to annual rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts an hourly amount into an annual equivalent
                  using two clearly separated approaches. The default result
                  treats hourly as a continuous clock-hour rate (24 hours per
                  day, 365 days per year). An optional paid-hours scenario shows
                  how the result changes when hourly applies only to certain
                  hours.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Clock-hour basis
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Paid-hours optional
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Hourly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  TIME
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  × 24 × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SCENARIO
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Paid hours
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BREAKDOWN
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  All periods shown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: clock-hour model */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Clock-hour annual equivalence (default)
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    By default, the converter treats your hourly amount as
                    applying to every clock hour. That means one day contains
                    twenty-four applicable hours, and one year contains three
                    hundred sixty-five days.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Daily</strong> = hourly × 24
                      </li>
                      <li>
                        <strong>Annual</strong> = daily × 365
                      </li>
                      <li>
                        Combined: <strong>Annual = hourly × 24 × 365</strong>
                      </li>
                    </ul>
                  </div>

                  <p>
                    This is the same time-length model used by daily, weekly,
                    biweekly, and monthly conversions on the site. It provides a
                    single annual basis that all other period lines can
                    reconcile to without switching assumptions.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why hourly is ambiguous */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why hourly needs a stated assumption
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Unlike daily or weekly amounts, an hourly number does not
                    inherently describe how many hours apply per day or per
                    year. Without an assumption, there is no single correct
                    annual equivalent.
                  </p>

                  <p>
                    This page makes the assumption explicit. The default treats
                    hourly as continuous clock time. An optional paid-hours
                    scenario is shown separately so you can see how a different
                    assumption changes the result.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Clock-hour meaning
                      </div>
                      <p className="mt-2">
                        Hourly applies to every hour in the day.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Paid-hour meaning
                      </div>
                      <p className="mt-2">
                        Hourly applies only to selected hours per week.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: paid-hours scenario */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Paid-hours scenario (optional comparison)
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    If hourly does not apply to all twenty-four hours, the
                    paid-hours scenario shows an alternative annual calculation
                    based on a weekly hours assumption. This does not replace
                    the clock-hour annual. It is shown alongside it.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Paid-hours formula
                    </div>
                    <p className="mt-2">
                      <strong>Annual (paid)</strong> = hourly × (hours per week)
                      × 52
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      The number of weeks is fixed at 52 for schedule
                      comparison.
                    </p>
                  </div>

                  <p>
                    This scenario is useful for seeing how sensitive the annual
                    total is to the assumed number of applicable hours. It is
                    intentionally labeled as a scenario so it is not confused
                    with the primary time-length result.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown */}
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
                    All breakdown values are derived from the same clock-hour
                    daily rate. Weekly, biweekly, and 4-week values use fixed
                    day counts. Monthly is derived from the annual total so the
                    year reconciles cleanly.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Weekly</strong> = daily × 7
                    </li>
                    <li>
                      <strong>Biweekly</strong> = daily × 14
                    </li>
                    <li>
                      <strong>4-week</strong> = daily × 28
                    </li>
                    <li>
                      <strong>Monthly</strong> = annual ÷ 12
                    </li>
                  </ul>

                  <p>
                    The breakdown does not reuse the paid-hours result. That
                    scenario exists only to show contrast. The primary breakdown
                    remains anchored to clock-hour time.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: precision */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Parsing, precision, and output behavior
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Hourly input is parsed as a decimal value. Thousands
                    separators are treated as grouping characters. Currency
                    symbols may be present and are ignored for numeric parsing.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>1,234</strong> → 1234
                    </li>
                    <li>
                      <strong>1.234</strong> → 1.234
                    </li>
                    <li>
                      Edge formats such as <strong>.5</strong> and{" "}
                      <strong>12.</strong> are supported
                    </li>
                  </ul>

                  <p>
                    Computation preserves precision internally, up to twelve
                    decimal places. Rounding, if enabled, affects only display
                    formatting. When disabled, additional decimals remain
                    visible so comparisons do not collapse into identical
                    values.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: printing */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Printing and saved copies
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    You can print the page or save it as a PDF using your
                    browser’s print function. This explanation section is marked
                    no-print so it does not appear in exported copies.
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-800">
                  Hourly does not imply how many hours apply
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This page separates clock-hour equivalence from paid-hour
                  scenarios so you can see the difference clearly. If you
                  compare hourly numbers across listings, make sure the same
                  assumption is being used.
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
