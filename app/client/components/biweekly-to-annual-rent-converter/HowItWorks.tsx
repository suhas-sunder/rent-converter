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
                  How the biweekly to annual rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a biweekly rent amount into an annual
                  equivalent using a fixed time-length definition. Biweekly is
                  treated as{" "}
                  <span className="font-semibold text-slate-900">14 days</span>.
                  The tool normalizes your input to a daily rate, then scales it
                  to a 365-day year. The same daily basis is also used to
                  produce a consistent breakdown across weekly, 4-week (28-day),
                  and average monthly equivalents.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 14 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Annual uses 365 days
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
                  BREAKDOWN
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  All periods from daily
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: core conversion */}
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
                </div>

                <div className="mt-3 space-y-3">
                  <p>
                    The tool treats your biweekly number as an amount that
                    covers exactly 14 days. It converts that amount into a
                    per-day rate, then multiplies by 365 to produce the annual
                    equivalent. This approach avoids mixing “payment counts”
                    into the math and makes the assumptions explicit.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas used
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Daily
                        </span>{" "}
                        = biweekly ÷ 14
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Annual
                        </span>{" "}
                        = daily × 365
                      </li>
                      <li>
                        Combined:{" "}
                        <span className="font-semibold text-slate-900">
                          Annual = biweekly × 365 ÷ 14
                        </span>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Biweekly is treated as a 14-day period. Annual uses a
                      fixed 365-day year.
                    </p>
                  </div>

                  <p>
                    If your listing uses “biweekly” as a vague label, this page
                    still produces a clear answer because it commits to a single
                    definition. Biweekly here does not mean “twice a month.” It
                    means every 14 days.
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
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Why all other periods come from the daily basis
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Once the tool has a daily rate, every other period can be
                    derived without changing assumptions. That is why the
                    breakdown stays consistent. It avoids a common error where a
                    “weekly” line is computed one way, then a “monthly” line is
                    computed with a different implied model.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Fixed-length periods
                      </div>
                      <p className="mt-2">
                        Weekly uses 7 days. 4-week uses 28 days. Biweekly uses
                        14 days. These are direct multiples of daily.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Average month
                      </div>
                      <p className="mt-2">
                        Monthly breakdowns use an average month length of 365 ÷
                        12 days so the year reconciles cleanly.
                      </p>
                    </div>
                  </div>

                  <p>
                    If the page shows a monthly line, it is an average-month
                    equivalent derived from the same annual basis. If it shows a
                    4-week line, it is explicitly labeled as 28 days. The point
                    is that you can compare across billing labels without the
                    calculator quietly switching definitions.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: parsing + decimals */}
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
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Input formats, ambiguity handling, and rounding
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The biweekly input is parsed as a decimal amount. Thousands
                    separators are treated as grouping. Currency symbols may be
                    present and should be ignored for numeric parsing. Precision
                    is retained during the math, and rounding (if used) should
                    be applied only when formatting values for display.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Accepted formats
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-semibold text-slate-900">
                          1,234
                        </span>{" "}
                        is interpreted as 1234
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          1.234
                        </span>{" "}
                        is interpreted as 1.234
                      </li>
                      <li>
                        Decimal edge formats are supported:{" "}
                        <span className="font-semibold text-slate-900">.5</span>{" "}
                        and{" "}
                        <span className="font-semibold text-slate-900">
                          12.
                        </span>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      If the input could reasonably mean two different numbers,
                      the correct behavior is a warning or an error instead of a
                      guessed output.
                    </p>
                  </div>

                  <p>
                    A practical check is that the annual number should scale
                    linearly with the biweekly input. If you double the biweekly
                    amount, the annual equivalent should double as well. That is
                    a basic consistency property of this converter.
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
                  “Biweekly” is locked to 14 days on this page
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This converter uses a time-length definition: daily is
                  computed as biweekly ÷ 14 and annual is derived as daily ×
                  365. If you need a different assumption (for example,
                  calendar-driven due dates), this page is not trying to model
                  that schedule. It is producing clean equivalents under
                  explicit, fixed period lengths.
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
