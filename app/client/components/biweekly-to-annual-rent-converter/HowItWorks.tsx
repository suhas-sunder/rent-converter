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
            {/* SectionCard: related tools */}
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
                        d="M5 12h14"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Related tools
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    If you want to switch to other rent periods without changing
                    the underlying time-length model, use the{" "}
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent converter
                    </Link>
                    . For the reverse direction of this page, use{" "}
                    <Link
                      to="/annual-to-biweekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to biweekly
                    </Link>
                    .
                  </p>

                  <p className="text-sm text-slate-600">
                    Common follow-ups:{" "}
                    <Link
                      to="/biweekly-to-monthly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      biweekly to monthly
                    </Link>
                    ,{" "}
                    <Link
                      to="/biweekly-to-weekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      biweekly to weekly
                    </Link>
                    , and{" "}
                    <Link
                      to="/monthly-to-biweekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      monthly to biweekly
                    </Link>
                    .
                  </p>

                  <p className="text-sm text-slate-600">
                    If your question is about due dates (not equivalents), use{" "}
                    <Link
                      to="/rent-due-date-calculator"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent due date calculator
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
            {/* SectionCard: examples */}
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
                        d="M4 7h16M4 12h16M4 17h16"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    These examples use the exact formula on this page. Any “≈”
                    shown is display rounding only.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly = 1,000
                      </div>
                      <div className="mt-1">
                        Daily = 1,000 ÷ 14 = 71.428571…
                      </div>
                      <div className="mt-1">
                        Annual = 1,000 × 365 ÷ 14 = 26,071.428571… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          26,071.43
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly = 1,150.70
                      </div>
                      <div className="mt-1">
                        Daily = 1,150.70 ÷ 14 = 82.192857…
                      </div>
                      <div className="mt-1">
                        Annual = 1,150.70 × 365 ÷ 14 = 29,999.392857… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          29,999.39
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3 (weekly equivalent)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly = 1,000
                      </div>
                      <div className="mt-1">
                        Weekly (365-day) = 1,000 ÷ 14 × 7 = 500.00
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        Want the dedicated route? Use{" "}
                        <Link
                          to="/biweekly-to-weekly-rent-converter"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          biweekly to weekly
                        </Link>
                        .
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (monthly average)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly = 1,000
                      </div>
                      <div className="mt-1">Annual = 26,071.428571…</div>
                      <div className="mt-1">
                        Monthly (average) = annual ÷ 12 = 2,172.619047… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          2,172.62
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        Want the dedicated route? Use{" "}
                        <Link
                          to="/biweekly-to-monthly-rent-converter"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          biweekly to monthly
                        </Link>
                        .
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">
                    Sanity check: if you double the biweekly input, the annual
                    result doubles. This converter is linear by design.
                  </p>
                </div>
              </div>
            </div>

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
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Core conversion: biweekly → daily → annual
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The tool treats your biweekly number as an amount that
                    covers exactly 14 days. It converts that amount into a
                    per-day rate, then multiplies by 365 to produce the annual
                    equivalent. This avoids mixing payment counts into the math
                    and makes the assumptions explicit.
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
                      Biweekly is fixed at 14 days. Annual is fixed at 365 days.
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
                      Why the breakdown derives everything from the daily basis
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Once the tool has a daily rate, every other period can be
                    derived without changing assumptions. That is why the
                    breakdown stays consistent. It avoids a common mistake where
                    one line is computed using one implied model and another
                    line uses a different implied model.
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
                    amount, the annual equivalent should double as well.
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
                  “Biweekly” is locked to 14 days on this page
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This converter uses a time-length definition: daily is
                  computed as biweekly ÷ 14 and annual is derived as daily ×
                  365. It does not determine due dates, invoice timing, or
                  payment counts inside a calendar month. If you need due dates,
                  use the{" "}
                  <Link
                    to="/rent-due-date-calculator"
                    className="cursor-pointer font-semibold text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                  >
                    rent due date calculator
                  </Link>
                  .
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
