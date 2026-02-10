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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-700 tracking-tight leading-tight">
                  How the annual to hourly rent converter works (8,760-hour
                  equivalence)
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts an annual rent total into an hourly
                  equivalent under a fixed time-length model. Input is one
                  annual amount. Output is an hourly equivalent that represents
                  the same annual cost under that model. Results are equivalents
                  under a fixed basis, not billing rules, not due dates, and not
                  lease terms.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Time-based hourly
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  365-day model
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual total
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DEFAULT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  annual ÷ 8,760
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  365 × 24 hours
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Hourly + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* 10 */}
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Related tools
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    For other period conversions that use the same time-length
                    basis, the{" "}
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent converter
                    </Link>{" "}
                    links the full set. For the inverse direction of this page,
                    use{" "}
                    <Link
                      to="/hourly-to-annual-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      hourly to annual
                    </Link>{" "}
                    so the same 8,760-hour basis is applied in reverse. For
                    comparisons against monthly and weekly, use{" "}
                    <Link
                      to="/annual-to-monthly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to monthly
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/annual-to-weekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to weekly
                    </Link>{" "}
                    to avoid mixing incompatible shortcuts.
                  </p>
                </div>
              </div>
            </div>

            {/* 1 */}
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      What this converter returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Input is an annual rent total (currency per year). Output is
                    a time-based hourly equivalent (currency per hour) plus a
                    breakdown table of other period equivalents that all
                    reconcile back to the same annual total under one fixed
                    model.
                  </p>
                  <p>
                    Results are equivalents under a fixed time-length basis.
                    This page is not a billing rules engine. It does not
                    determine due dates, it does not interpret lease terms, and
                    it does not infer payment schedules or payment counts.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      What the output represents
                    </div>
                    <p className="mt-2">
                      Hourly is the annual amount expressed per hour under the
                      same model used for daily, weekly, biweekly, 4-week, and
                      monthly equivalents.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 6 */}
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Each example uses the exact formula shown on this page and
                    an approximate result. Display rounding can change the last
                    digits without changing the underlying math.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Annual = 24,000
                      </div>
                      <div className="mt-1">
                        Hourly = 24,000 ÷ 8,760 = 2.739726… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          2.74
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Annual = 30,000.50
                      </div>
                      <div className="mt-1">
                        Hourly = 30,000.50 ÷ 8,760 = 3.424714… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          3.42
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Annual = 18,200
                      </div>
                      <div className="mt-1">
                        Daily = 18,200 ÷ 365 = 49.863013…
                      </div>
                      <div className="mt-1">
                        Hourly = Daily ÷ 24 = 49.863013… ÷ 24 = 2.077625… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          2.08
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (paid-hours comparison)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Annual = 30,000, hours/week = 40
                      </div>
                      <div className="mt-1">
                        Paid-hours hourly = 30,000 ÷ (40 × 52) = 14.423076… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          14.42
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2 */}
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
                        d="M5 12h14M12 5v14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Definitions used on this page
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Periods are defined by fixed day counts so every conversion
                    uses the same model. The year model used here is a 365-day
                    year.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-semibold text-slate-900">Hour</span>
                      : 1 hour. Time-based annual hours = 365 × 24 ={" "}
                      <span className="font-semibold text-slate-900">
                        8,760
                      </span>
                      .
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Day</span>:
                      1 day.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Week</span>
                      : 7 days.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Biweekly
                      </span>
                      : 14 days (not twice per month).
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        4-week
                      </span>
                      : 28 days.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Month
                      </span>
                      : average month length implied by the model, 365 ÷ 12
                      days. On this page, “monthly” means annual ÷ 12, not 4
                      weeks.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Year</span>
                      : 365 days.
                    </li>
                  </ul>

                  <p className="text-sm text-slate-600">
                    If a paid-hours scenario exists on the page, it is a
                    separate model that divides by assumed work hours. The
                    default hourly shown by this converter is time-based and
                    uses 8,760 hours for internal consistency.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 */}
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Core formula and conversion basis
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The annual total is the anchor. Every period shown is
                    derived from the same annual basis. This is done so the
                    hourly line and the breakdown table stay internally
                    consistent.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Exact formulas (annual as input)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Hourly (time-based)
                        </span>{" "}
                        = annual ÷ (365 × 24) = annual ÷ 8,760
                      </li>
                      <li>Daily = annual ÷ 365</li>
                      <li>Weekly = annual × 7 ÷ 365</li>
                      <li>Biweekly = annual × 14 ÷ 365</li>
                      <li>4-week = annual × 28 ÷ 365</li>
                      <li>
                        Monthly = annual ÷ 12 (equivalently: annual × (365 ÷ 12)
                        ÷ 365)
                      </li>
                    </ul>

                    <div className="mt-4 text-sm">
                      <div className="font-bold text-slate-900">
                        Stepwise version (annual → daily → hourly)
                      </div>
                      <div className="mt-2">Daily = annual ÷ 365</div>
                      <div>Hourly = daily ÷ 24 = (annual ÷ 365) ÷ 24</div>
                    </div>

                    <p className="mt-4 text-sm text-slate-600">
                      This basis is used to keep one coherent model across the
                      headline result and the breakdown table.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 */}
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      What the breakdown table represents
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The breakdown table is a set of equivalent amounts for
                    different periods, all derived from the same annual basis.
                    Rows are not computed from each other. Weekly is not
                    computed as hourly × 168, and monthly is not computed as
                    weekly × 4. Each row is derived from the annual anchor so
                    everything reconciles to the same annual total.
                  </p>
                  <p>
                    This matters when comparing weekly, 28-day, and monthly
                    listings. Those periods are defined differently, so the
                    equivalents differ even when they look close. These rows are
                    equivalents, not payment schedules.
                  </p>
                </div>
              </div>
            </div>

            {/* 5 */}
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
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Common mismatches and how this page treats them
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Hourly by paid-hours vs time-based hourly
                    </div>
                    <p className="mt-2">
                      Time-based hourly uses 8,760 hours so hourly stays
                      compatible with daily and weekly equivalents. A paid-hours
                      model divides by assumed work hours (hours/week × 52) and
                      will usually be larger because it spreads the same annual
                      total across fewer hours. If a paid-hours scenario is
                      shown, it should be labeled as a separate comparison
                      model, not the default basis.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Weekly × 4 vs monthly
                    </div>
                    <p className="mt-2">
                      Weekly × 4 is a 28-day amount. Monthly on this page is
                      annual ÷ 12 (average month under a 365-day year). Because
                      a month is not fixed at 28 days, weekly × 4 does not match
                      monthly under this model.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      4-week vs calendar month
                    </div>
                    <p className="mt-2">
                      4-week is always 28 days. Monthly is computed as annual ÷
                      12. These are different definitions, so they are different
                      rows.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      “26 payments” vs time-length conversion
                    </div>
                    <p className="mt-2">
                      Payment counts are schedule language. This page converts
                      by time length under a fixed 365-day year. Outputs are
                      equivalents, not a statement about payment counts or due
                      dates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 9 */}
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Scope and limits of this tool
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    This tool converts only the rent amount you enter. It does
                    not include fees, utilities, deposits, taxes, insurance,
                    proration, or discounts. It does not interpret lease terms
                    or local billing rules.
                  </p>
                  <p>
                    Outputs are equivalences under a fixed time-length model,
                    not due-date schedules. If the task is determining due dates
                    or a calendar of payments, use a due-date calculator rather
                    than period equivalents.
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
                  This is an equivalence converter, not a payment schedule
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The hourly result is derived from annual ÷ 8,760 under a
                  365-day model. It does not determine due dates, invoice
                  timing, or payment counts within a month. If you need due
                  dates, use a due-date calculator instead of relying on period
                  equivalents.
                </p>
                <div className="mt-4">
                  <Link
                    to="/rent-due-date-calculator"
                    className="cursor-pointer inline-flex items-center font-semibold text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                  >
                    Rent due date calculator →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
