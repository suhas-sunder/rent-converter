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
                  How the hourly to annual rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts an hourly amount into an annual equivalent
                  using a clear time-based assumption: 24 hours per day and 365
                  days per year. You’ll also see an optional work-hours view so
                  you can compare what changes when hourly applies only to a set
                  number of hours each week.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  24 × 365 model
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Work-hours comparison
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
                  TIME BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  × 24 × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  COMPARE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Hours/week × 52
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: Related tools (near top) */}
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
                    If you need the reverse direction, convert annual to hourly.
                    If you want a flexible period converter (with a full
                    breakdown in one place), use the rent converter.
                  </p>

                  <div className="mt-3 text-sm flex flex-wrap gap-x-5 gap-y-2">
                    <Link
                      to="/annual-to-hourly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Annual to hourly →
                    </Link>
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Rent converter →
                    </Link>
                    <Link
                      to="/rent-due-date-calculator"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Rent due date calculator →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: Examples (directly under Related tools) */}
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
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    These use the same formulas shown below. Display rounding
                    can change the last digits without changing the underlying
                    math.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1 (clock-hour)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Hourly = 2.50
                      </div>
                      <div className="mt-1">
                        Annual = 2.50 × 24 × 365 ={" "}
                        <span className="font-semibold text-slate-900">
                          21,900
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2 (clock-hour)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Hourly = 3.25
                      </div>
                      <div className="mt-1">
                        Annual = 3.25 × 24 × 365 ={" "}
                        <span className="font-semibold text-slate-900">
                          28,470
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3 (decimals preserved)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Hourly = 1.10
                      </div>
                      <div className="mt-1">
                        Annual = 1.10 × 24 × 365 ={" "}
                        <span className="font-semibold text-slate-900">
                          9,636
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (work-hours comparison)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Hourly = 20, hours/week = 40
                      </div>
                      <div className="mt-1">
                        Annual = 20 × 40 × 52 ={" "}
                        <span className="font-semibold text-slate-900">
                          41,600
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      What to look for
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      If you double hourly, annual doubles. If you halve hourly,
                      annual halves. That linear relationship is a quick sanity
                      check.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: Clock-hour model */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Clock-hour annual equivalence
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The default annual result treats your hourly amount as
                    applying to every hour in the day. Under that assumption,
                    daily is hourly × 24 and annual is daily × 365.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Daily
                        </span>{" "}
                        = hourly × 24
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Annual
                        </span>{" "}
                        = daily × 365
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Annual
                        </span>{" "}
                        = hourly × 24 × 365
                      </li>
                    </ul>
                  </div>

                  <p>
                    This matches the same fixed-length day model used across the
                    rent converter breakdown so daily, weekly, biweekly, and
                    4-week values reconcile cleanly.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: Work-hours comparison */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Work-hours comparison
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Some hourly amounts only apply to a limited number of hours
                    each week. If you choose that option, the annual value uses
                    your hours per week and assumes 52 weeks.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Annual
                      </span>{" "}
                      = hourly × (hours per week) × 52
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Use this when hourly clearly applies only to a set number
                      of paid hours, not to continuous time.
                    </p>
                  </div>

                  <p>
                    The point is to compare how assumptions change the annual
                    number, not to “pick a winner.” Use the one that matches the
                    way your hourly rate is actually applied.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: Breakdown */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  How the breakdown is derived
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The breakdown converts through a daily rate so every period
                    stays consistent with the same fixed-length model.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Period lengths used
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>Week = 7 days</li>
                      <li>Biweekly = 14 days</li>
                      <li>4-week = 28 days</li>
                      <li>Year = 365 days</li>
                      <li>Average month = 365 ÷ 12 days</li>
                    </ul>
                  </div>

                  <p>
                    If you are comparing listings that say “monthly” vs “every 4
                    weeks,” this is why the numbers differ: those labels cover
                    different lengths of time.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: Precision */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Input parsing and rounding
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Hourly input is parsed as a decimal number. Commas are
                    treated as thousands separators. Currency symbols are
                    ignored for numeric parsing. Precision is kept during math,
                    and rounding (if enabled) affects display only.
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
                        → 1234
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          1.234
                        </span>{" "}
                        → 1.234
                      </li>
                      <li>
                        Edge formats:{" "}
                        <span className="font-semibold text-slate-900">.5</span>{" "}
                        and{" "}
                        <span className="font-semibold text-slate-900">
                          12.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: Printing */}
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-200">
                  “Hourly” depends on how many hours actually apply
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  A clock-hour model assumes 24 hours per day. A work-hours view
                  assumes a specific number of hours per week. Use the one that
                  matches how the hourly rate is meant to be applied in your
                  situation.
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
