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
                  How the biweekly to weekly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a biweekly rent amount into a weekly
                  equivalent using fixed time-length definitions. Biweekly is
                  treated as exactly{" "}
                  <span className="font-semibold text-slate-900">14 days</span>{" "}
                  and weekly as{" "}
                  <span className="font-semibold text-slate-900">7 days</span>.
                  Under those definitions, the weekly result is computed
                  directly and exactly as half of the biweekly amount.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 14 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Weekly = 7 days
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
                  DIRECT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly = ÷ 2
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Time-length
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXTRAS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Full breakdown
                </div>
              </div>
            </div>
          </div>
          {/* SectionCard: related tools + EXAMPLES (examples must live here) */}
          <div className="group mt-8 relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                Related tools and examples
              </h3>

              <div className="mt-4 space-y-4">
                <p>
                  If you need other rent period equivalents under the same fixed
                  time-length definitions, use these:
                </p>

                <div className="text-sm flex flex-wrap gap-x-5 gap-y-2">
                  <Link
                    to="/rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    Rent converter →
                  </Link>
                  <Link
                    to="/biweekly-to-annual-rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    Biweekly to annual →
                  </Link>
                  <Link
                    to="/biweekly-to-monthly-rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    Biweekly to monthly →
                  </Link>
                  <Link
                    to="/rent-due-date-calculator"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    Rent due date calculator →
                  </Link>
                </div>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
                    Examples you can cross-check
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Weekly is exact here because 14 days ÷ 2 = 7 days.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly = 1,000
                      </div>
                      <div className="mt-1">
                        Weekly = 1,000 ÷ 2 ={" "}
                        <span className="font-semibold text-slate-900">
                          500.00
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        Daily = 1,000 ÷ 14 = 71.428571…
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly = 920.55
                      </div>
                      <div className="mt-1">
                        Weekly = 920.55 ÷ 2 ={" "}
                        <span className="font-semibold text-slate-900">
                          460.275
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        If display rounds: 460.28 (rounding is display-only)
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3 (linearity check)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly doubles: 1,000 → 2,000
                      </div>
                      <div className="mt-1">
                        Weekly doubles: 500 →{" "}
                        <span className="font-semibold text-slate-900">
                          1,000
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        This must always hold for this route.
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (breakdown anchoring)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly = 1,000
                      </div>
                      <div className="mt-1 text-sm text-slate-700">
                        Annual = (1,000 ÷ 14) × 365 = 26,071.428571…
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        The breakdown should reconcile to this annual basis.
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  This section is marked no-print so it does not clutter
                  exported copies.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: direct conversion */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The direct weekly conversion
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Because biweekly is defined here as a 14-day amount and
                    weekly as a 7-day amount, the weekly value is exactly one
                    half of the biweekly input. No normalization step is
                    required to compute the headline result.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Primary formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Weekly
                      </span>{" "}
                      = biweekly ÷ 2
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      This is exact under the 14-day and 7-day definitions used
                      on this page.
                    </p>
                  </div>

                  <p>
                    This is one of the few routes where the direct division is
                    mathematically exact and does not rely on average month
                    lengths or annualization.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why not calendar-based */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why this conversion does not use calendar weeks
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    This page does not attempt to model paydays, due dates, or
                    calendar alignment. It converts strictly by time length. A
                    week is always seven days and a biweekly period is always
                    fourteen days, regardless of where those days fall on a
                    calendar.
                  </p>
                  <p>
                    If you need actual due dates or a schedule, use a due-date
                    tool, not period equivalents.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown logic */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  How the full breakdown is derived
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    While the weekly headline result is computed directly, the
                    rest of the breakdown is derived from a single daily basis
                    so all periods remain consistent with each other.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Derived periods (from the same daily basis)
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
                        <span className="font-semibold text-slate-900">
                          Monthly
                        </span>{" "}
                        = annual ÷ 12 (average month)
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          4-week
                        </span>{" "}
                        = daily × 28
                      </li>
                    </ul>
                  </div>

                  <p>
                    The breakdown does not reuse the weekly value to compute
                    other periods. Everything reconciles back to daily so the
                    table does not accumulate rounding drift or mix definitions.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: decimals + rounding */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Precision, rounding, and ambiguity handling
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Inputs are parsed as decimal values. Thousands separators
                    are treated as grouping characters. Currency symbols may be
                    present and are ignored for numeric parsing.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
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
                      Edge formats such as{" "}
                      <span className="font-semibold text-slate-900">.5</span>{" "}
                      and{" "}
                      <span className="font-semibold text-slate-900">12.</span>{" "}
                      are accepted
                    </li>
                  </ul>

                  <p>
                    Computation preserves decimals internally. Rounding, if
                    enabled, affects only how many decimals are displayed.
                    Ambiguous inputs should be blocked or warned on instead of
                    producing a clean-looking but incorrect result.
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-200">
                  This is the simplest conversion on the site
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Because biweekly is defined as 14 days and weekly as 7 days,
                  the weekly result is exactly half of the biweekly amount.
                  Other routes require normalization through days or annual
                  totals. This one does not.
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
