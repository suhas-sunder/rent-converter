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
                  How the monthly to biweekly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a monthly rent amount into a biweekly
                  equivalent using a time-based model. Monthly is treated as an
                  average month derived from a 365-day year, and biweekly is
                  defined as a fixed 14-day period. The result is a biweekly
                  figure that stays consistent with all other breakdown values.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Monthly = avg month
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Biweekly = 14 days
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly rent
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  To annual
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CONVERT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  14-day basis
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Full breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 1: Enter the monthly amount
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Enter the rent amount exactly as written on the listing and
                    select “monthly” as the period. The input parser accepts
                    currency symbols, thousands separators, and decimal formats.
                    If an entry could be read more than one way, the calculator
                    blocks the result instead of guessing.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Parsing behavior
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>1,234</strong> is treated as 1234
                      </li>
                      <li>
                        <strong>1.234</strong> is treated as 1.234
                      </li>
                      <li>
                        Formats like <strong>.5</strong> and{" "}
                        <strong>12.</strong> are valid
                      </li>
                    </ul>
                  </div>

                  <p>
                    The page does not infer what the rent includes. Taxes,
                    utilities, fees, and deposits are outside the scope of the
                    calculation.
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
                  Step 2: Convert monthly to a biweekly equivalent
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Monthly is first interpreted as an average month. That
                    average month is defined as one-twelfth of a 365-day year.
                    From that annual basis, the biweekly equivalent is computed
                    as a fixed 14-day amount.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Annual</strong> = monthly × 12
                      </li>
                      <li>
                        <strong>Daily</strong> = annual ÷ 365
                      </li>
                      <li>
                        <strong>Biweekly</strong> = daily × 14
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Biweekly here always means a 14-day period, not twice per
                      calendar month.
                    </p>
                  </div>

                  <p>
                    Using a daily intermediary keeps the conversion aligned with
                    other period outputs shown on the page.
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
                  How the breakdown stays consistent
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Once the annual basis exists, all other periods are derived
                    from it using fixed time lengths. This prevents the
                    breakdown from mixing assumptions or chaining rounded
                    values.
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
                      <strong>Hourly</strong> = daily ÷ 24
                    </li>
                  </ul>

                  <p>
                    Each line reconciles back to the same annual figure implied
                    by the monthly input.
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
                  Equivalence vs payment schedules
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The biweekly result is a time-based equivalent, not a
                    statement about how many payments occur in a year. Schedule
                    totals are shown separately so the difference is visible.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Equivalence
                      </div>
                      <p className="mt-2">
                        Derived from days and annual totals.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Schedules
                      </div>
                      <p className="mt-2">
                        Monthly × 12, biweekly × 26 (illustrative).
                      </p>
                    </div>
                  </div>

                  <p>
                    This makes it easier to spot cases where “twice monthly” and
                    “biweekly” lead to different annual costs.
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
                  Printing and saved copies
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Use your browser’s print dialog to print the results or save
                    them as a PDF. This explanation section is excluded from
                    print layouts.
                  </p>
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-800">
                  Biweekly is not twice monthly
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  A biweekly amount represents 14 days of rent. A “twice
                  monthly” amount represents half of a calendar month. This page
                  keeps those definitions separate so the math stays honest.
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
