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
                  How the annual to monthly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page answers one simple input-to-output question: you
                  enter an annual rent total and get the monthly budgeting
                  equivalent using{" "}
                  <span className="font-semibold text-slate-900">
                    annual ÷ 12
                  </span>
                  . A full breakdown is also shown so you can compare the same
                  annual basis against weekly, biweekly, daily, hourly, and a
                  4-week (28-day) schedule without switching tools. If you want
                  to switch between rent periods on one page, use the{" "}
                  <Link
                    to="/rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    rent converter
                  </Link>
                  .
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Monthly = annual ÷ 12
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  28-day comparison shown
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
                  PRIMARY
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual ÷ 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BREAKDOWN
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Same annual basis
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXTRA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  28-day schedule line
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Related tools
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    For the reverse direction, use{" "}
                    <Link
                      to="/monthly-to-annual-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      monthly to annual
                    </Link>
                    . If you are comparing a listing that is not monthly, these
                    routes keep the same annual anchor while changing the output
                    period:{" "}
                    <Link
                      to="/annual-to-weekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to weekly
                    </Link>
                    ,{" "}
                    <Link
                      to="/annual-to-biweekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to biweekly
                    </Link>
                    ,{" "}
                    <Link
                      to="/annual-to-daily-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to daily
                    </Link>
                    , and{" "}
                    <Link
                      to="/annual-to-hourly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to hourly
                    </Link>
                    . If you want all conversions on one page, use the{" "}
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent converter
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: what it does */}
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
                      What the monthly result represents
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The monthly number on this route is the simplest budgeting
                    interpretation: the annual total divided into twelve equal
                    parts. If you enter{" "}
                    <span className="font-semibold text-slate-900">
                      $24,000
                    </span>
                    , the monthly equivalent is{" "}
                    <span className="font-semibold text-slate-900">
                      $24,000 ÷ 12 = $2,000
                    </span>
                    .
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Primary formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Monthly equivalent
                      </span>{" "}
                      = annual rent ÷ 12
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      This is the primary result on this page. It is a budgeting
                      split, not a day-based equivalence.
                    </p>
                  </div>

                  <p>
                    The breakdown is there so you can compare the same annual
                    basis against other listing periods. Weekly, daily, and
                    hourly lines are shown as time-length equivalents derived
                    from a 365-day year so the breakdown stays internally
                    consistent.
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Each example uses the primary monthly formula (annual ÷ 12).
                    When the breakdown shows day-based rows, those rows use a
                    365-day year so the table stays internally consistent.
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
                        Monthly = 24,000 ÷ 12 ={" "}
                        <span className="font-semibold text-slate-900">
                          2,000
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
                        Monthly = 30,000.50 ÷ 12 = 2,500.0416… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          2,500.04
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Annual = 52,000
                      </div>
                      <div className="mt-1">
                        Monthly = 52,000 ÷ 12 = 4,333.3333… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          4,333.33
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        For comparison in the breakdown: 4-week (28-day) is a
                        different interval than monthly.
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (28-day comparison)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Annual = 24,000
                      </div>
                      <div className="mt-1">
                        4-week = 24,000 × 28 ÷ 365 = 1,841.0958… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          1,841.10
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        This is why a 28-day schedule is shown separately from
                        the monthly budgeting split.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: step-by-step */}
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
                      How it works on this route
                    </h3>
                  </div>
                </div>

                <div className="mt-4">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong className="text-slate-900">
                        Enter an annual rent total.
                      </strong>{" "}
                      The tool treats your number as the single source value and
                      does not add or remove anything.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Compute monthly as annual ÷ 12.
                      </strong>{" "}
                      This is the primary output and matches the page title and
                      intent.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Compute breakdown lines from the same annual basis.
                      </strong>{" "}
                      Day-based equivalents use a 365-day model so daily,
                      weekly, and hourly reconcile back to the same annual
                      number.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Show 4-week (28-day) explicitly.
                      </strong>{" "}
                      A 28-day schedule is a different interval and is not
                      merged into “monthly.”
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* SectionCard: common mismatches */}
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
                      Monthly vs 4-week (28-day)
                    </div>
                    <p className="mt-2">
                      Monthly on this page is a budgeting split (annual ÷ 12). A
                      4-week schedule is a fixed 28-day interval. They are not
                      the same thing, so the breakdown shows them as different
                      rows with different definitions.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Weekly × 4 vs monthly
                    </div>
                    <p className="mt-2">
                      Weekly × 4 is also a 28-day amount. That is why it can
                      differ from monthly, even when it looks close. If you want
                      a weekly comparison, use{" "}
                      <Link
                        to="/annual-to-weekly-rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        annual to weekly
                      </Link>{" "}
                      or the{" "}
                      <Link
                        to="/rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        rent converter
                      </Link>{" "}
                      so everything stays anchored to the same annual total.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Equivalents vs due dates
                    </div>
                    <p className="mt-2">
                      These are equivalents under a fixed basis. They do not
                      determine invoice timing, due dates, or how many payments
                      land inside a calendar month. For actual due dates, use{" "}
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
            </div>

            {/* SectionCard: input formats + rounding */}
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
                      Input formats and rounding
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The calculator accepts common numeric formats and should
                    reject or warn on ambiguous formats rather than guessing.
                    Decimals are preserved internally end to end. Rounding is
                    display-only.
                  </p>

                  <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left font-semibold text-slate-900 px-4 py-3">
                            Format
                          </th>
                          <th className="text-left font-semibold text-slate-900 px-4 py-3">
                            Examples accepted
                          </th>
                          <th className="text-left font-semibold text-slate-900 px-4 py-3">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr className="bg-white">
                          <td className="px-4 py-3">Decimals</td>
                          <td className="px-4 py-3">1200.50, .5, 12.</td>
                          <td className="px-4 py-3">
                            Decimal point is supported. Trailing dot is treated
                            as a decimal with no fractional digits.
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-3">Thousands grouping</td>
                          <td className="px-4 py-3">1,200; 1,200.50</td>
                          <td className="px-4 py-3">
                            Commas are treated as thousands separators.
                          </td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-4 py-3">Currency symbols</td>
                          <td className="px-4 py-3">$1,200.50; €1200</td>
                          <td className="px-4 py-3">
                            Currency symbols are ignored for numeric parsing.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm text-slate-600">
                    If a value can reasonably be read in more than one way, the
                    tool should warn or block instead of guessing. The goal is
                    to avoid producing clean-looking numbers from a misread
                    input.
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
                  Monthly here is a budgeting split, not a 30-day assumption
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The monthly headline result is annual ÷ 12. Day-based
                  equivalents in the breakdown use a 365-day model for
                  consistency. A 4-week (28-day) schedule is shown separately
                  because it is a different billing interval and often
                  annualizes differently.
                </p>
                <div className="mt-4">
                  <Link
                    to="/rent-paid-every-4-weeks-calculator"
                    className="cursor-pointer inline-flex items-center font-semibold text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                  >
                    Rent paid every 4 weeks calculator →
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
