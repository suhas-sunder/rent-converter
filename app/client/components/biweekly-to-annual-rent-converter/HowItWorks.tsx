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
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                  How the biweekly to annual rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Use this when a listing quotes rent as a biweekly amount and
                  you need a yearly equivalent to evaluate affordability,
                  compare against annual totals, or sanity-check what the rent
                  label really means. This page commits to fixed time lengths so
                  the result is comparable across different billing labels.
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-600 leading-7 max-w-2xl">
                  <li>
                    Converts your biweekly figure into an{" "}
                    <span className="font-semibold text-slate-900">
                      annual total
                    </span>{" "}
                    you can compare to yearly budgets and lease totals.
                  </li>
                  <li>
                    Produces supporting equivalents (weekly, 4-week, monthly
                    average) using the{" "}
                    <span className="font-semibold text-slate-900">
                      same daily basis
                    </span>{" "}
                    so the breakdown stays consistent.
                  </li>
                </ul>
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
                    If you are comparing mixed billing labels and want one place
                    to switch between periods while keeping the same
                    assumptions, use the{" "}
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent converter
                    </Link>
                    . For checking a quoted yearly amount against a biweekly
                    budget, use{" "}
                    <Link
                      to="/annual-to-biweekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to biweekly
                    </Link>
                    .
                  </p>

                  <p className="text-sm text-slate-600">
                    Common follow-ups when your listing or paycheck planning is
                    not expressed annually:{" "}
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
                    If you are trying to figure out when rent is actually due on
                    a calendar (not what it is equivalent to), use{" "}
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
                    These examples use the exact math on this page. Any “≈”
                    shown is display rounding only.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You have a hard annual housing cap of 27,000 and you
                          need a quick accept or reject based on a biweekly
                          quote.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Biweekly = 1,000
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Annual = 1,000 × 365 ÷ 14 = 26,071.428571… ≈{" "}
                          <span className="font-semibold text-slate-900">
                            26,071.43
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Annual equivalent is 26,071.43.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          It stays under the 27,000 cap, so it remains eligible
                          to consider.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          Two rentals look similar, but one is quoted biweekly.
                          You need a yearly total to compare them fairly.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Option A biweekly = 1,150.70. Option B annual total =
                          30,000.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Annual(A) = 1,150.70 × 365 ÷ 14 = 29,999.392857… ≈{" "}
                          <span className="font-semibold text-slate-900">
                            29,999.39
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Option A is about 0.61 less per year than 30,000.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          If your rule is “30,000 or less,” Option A still
                          qualifies while being effectively the same price as
                          the 30,000 annual quote.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3 (weekly equivalent)
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You budget week-by-week and want to compare a biweekly
                          rent quote to a weekly income plan without guessing.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Biweekly = 1,000
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Weekly (365-day) = 1,000 ÷ 14 × 7 ={" "}
                          <span className="font-semibold text-slate-900">
                            500.00
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Weekly equivalent is 500.00.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          If your weekly rent target is 475, you pass on this
                          listing or renegotiate because it is above your weekly
                          limit.
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-600">
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

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          Your landlord quotes biweekly, but your household
                          budget is monthly. You need the monthly average to
                          check a monthly ceiling.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Biweekly = 1,000. Monthly cap = 2,150.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Annual = 1,000 × 365 ÷ 14 = 26,071.428571… then
                          Monthly (average) = annual ÷ 12 = 2,172.619047… ≈{" "}
                          <span className="font-semibold text-slate-900">
                            2,172.62
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Monthly average is 2,172.62.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          It exceeds the 2,150 monthly cap, so you rule it out
                          even though “1,000 biweekly” might sound close enough.
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-600">
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
                    Quick check: doubling the biweekly input doubles the annual
                    result. If your output does not scale that way, the input
                    was likely misread or mistyped.
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
                    This page uses a time-length model. Your biweekly amount is
                    treated as payment for exactly{" "}
                    <span className="font-semibold text-slate-900">
                      14 days
                    </span>
                    , converted into a daily rate, then scaled to a{" "}
                    <span className="font-semibold text-slate-900">
                      365-day year
                    </span>
                    . That keeps the assumption explicit and makes the annual
                    number comparable to yearly budgets.
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
                    This is designed for listings that label rent as “biweekly”
                    but do not clarify anything else. The converter resolves the
                    ambiguity by using one definition consistently. Biweekly
                    here does not mean “twice a month.” It means every 14 days.
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
                    The breakdown is built from one daily rate so you can
                    compare periods without the calculator quietly switching
                    models. That matters when you are evaluating multiple
                    listings that use different labels (weekly, biweekly,
                    monthly, annual) and you want one consistent basis.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Fixed-length periods
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>Weekly uses 7 days.</li>
                        <li>4-week uses 28 days.</li>
                        <li>Biweekly uses 14 days.</li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        These are direct multiples of the same daily rate, so
                        they stay internally consistent.
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
                      <p className="mt-3 text-sm text-slate-600">
                        This is for comparison and budgeting, not a statement
                        about how many days are in the current calendar month.
                      </p>
                    </div>
                  </div>

                  <p>
                    Use the annual line to compare against annual budgets and
                    annual quotes. Use the monthly average line to compare to a
                    monthly budget ceiling. Use the weekly or 4-week lines when
                    you plan cash flow in shorter blocks and want a consistent
                    equivalent.
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
                  This converter answers one question: what annual rent does a
                  biweekly amount imply under a fixed 14-day definition. It does
                  not model calendars, invoice cycles, or the number of payments
                  you will make in a particular month. If you are scheduling
                  payments or confirming due dates, use the{" "}
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
