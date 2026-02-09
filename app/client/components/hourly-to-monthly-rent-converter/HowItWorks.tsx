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
                  How the hourly to monthly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts an hourly amount into a monthly equivalent
                  by scaling through a full year. Hourly is treated as a
                  clock-hour rate unless stated otherwise. Monthly is defined as
                  one-twelfth of an annual total derived from that hourly input.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Hourly = base
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
                  Hourly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXPAND
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  × 24 × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DIVIDE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  ÷ 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUTS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Full breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: core path */}
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
                    The converter treats the hourly input as a rate that applies
                    to every hour in the day. That hourly rate is expanded into
                    a daily amount, then into an annual total. The monthly value
                    is computed by dividing that annual total into twelve equal
                    parts.
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
                        <strong>Monthly</strong> = annual ÷ 12
                      </li>
                      <li>
                        Combined:{" "}
                        <strong>Monthly = hourly × 24 × 365 ÷ 12</strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Monthly corresponds to an average month length of 365 ÷ 12
                      days.
                    </p>
                  </div>

                  <p>
                    This keeps the math reversible. Multiplying the monthly
                    result by twelve returns the same annual total. Dividing the
                    annual total by 365 returns the original daily rate implied
                    by the hourly input.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why hourly needs clarification */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  What “hourly” means in this context
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    An hourly number does not, by itself, describe how many
                    hours apply per day or per year. Without an assumption,
                    there is no single correct monthly equivalent.
                  </p>

                  <p>
                    This page makes the assumption explicit. Hourly is treated
                    as a clock-hour rate that applies to all twenty-four hours
                    of each day. Alternative interpretations, such as paid-hours
                    schedules, are not used as the primary basis here.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Included
                      </div>
                      <p className="mt-2">
                        Hourly applies to every hour in the day.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Not modeled
                      </div>
                      <p className="mt-2">
                        Work schedules or limited paid hours.
                      </p>
                    </div>
                  </div>
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
                    All period values shown on the page are derived from the
                    same clock-hour assumption. Daily, weekly, biweekly, and
                    4-week lines are computed using fixed day counts. Monthly is
                    derived from the annual total so the year reconciles
                    cleanly.
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
                    No value in the breakdown is chained from a rounded
                    intermediate result. Each line reconciles back to the same
                    annual figure implied by the hourly input.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: parsing and precision */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Parsing rules and precision handling
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Hourly inputs are parsed as decimal values. Thousands
                    separators are treated as grouping characters. Currency
                    symbols may be present and are ignored during numeric
                    parsing.
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
                    Computation preserves precision internally, up to twelve
                    decimal places. Rounding, if enabled, affects display only.
                    When rounding is disabled, additional decimals remain
                    visible for close comparisons.
                  </p>

                  <p>
                    If an input could reasonably be interpreted in more than one
                    way, the tool shows a warning or error instead of producing
                    a misleading result.
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
                  Monthly here is an average, not a schedule
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This page produces a monthly equivalent derived from an hourly
                  rate via an annual total. It does not attempt to model billing
                  dates or work schedules. If you need schedule-based
                  assumptions, use a paid-hours or due-date tool instead.
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
