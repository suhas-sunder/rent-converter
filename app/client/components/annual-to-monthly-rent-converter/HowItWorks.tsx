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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
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
                  4-week (28-day) schedule without switching tools.
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
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
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

            {/* SectionCard: 28-day clarification */}
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
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      4-week (28-day) versus monthly, kept visible on purpose
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    If a listing is billed “every 4 weeks” or “every 28 days,”
                    it is not a monthly schedule. A 28-day cycle repeats 13
                    times in a year. That can produce a different implied annual
                    total than a monthly price that looks similar at a glance.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example annualization
                      </div>
                      <p className="mt-2">
                        If a listing says{" "}
                        <span className="font-semibold text-slate-900">
                          $2,000 every 4 weeks
                        </span>
                        , a simple annualization is{" "}
                        <span className="font-semibold text-slate-900">
                          $2,000 × 13 = $26,000
                        </span>
                        .
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Why it’s separate
                      </div>
                      <p className="mt-2">
                        The 4-week line is labeled explicitly so it is not
                        confused with the monthly budgeting split (annual ÷ 12).
                      </p>
                    </div>
                  </div>

                  <p>
                    This page does not try to pick the “right” schedule. It
                    keeps the 28-day interval visible so comparisons stay
                    honest.
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
                        d="M7 7h10v10H7z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Input parsing rules and precision behavior
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Inputs are treated as numeric amounts. Thousands separators
                    (commas) are interpreted as grouping, not decimals. If you
                    type{" "}
                    <span className="font-semibold text-slate-900">1,234</span>,
                    it is interpreted as 1234. If you meant one point two three
                    four, type{" "}
                    <span className="font-semibold text-slate-900">1.234</span>.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Accepted numeric formats
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Decimals:{" "}
                        <span className="font-semibold text-slate-900">
                          1200.50
                        </span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">.5</span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">
                          12.
                        </span>
                      </li>
                      <li>
                        Grouping:{" "}
                        <span className="font-semibold text-slate-900">
                          1,200
                        </span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">
                          1,200.50
                        </span>
                      </li>
                      <li>
                        Currency symbols may be present and ignored for parsing:{" "}
                        <span className="font-semibold text-slate-900">
                          $1,200.50
                        </span>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      If an input format is ambiguous, the correct behavior is a
                      warning or error instead of a guessed value.
                    </p>
                  </div>

                  <p>
                    Decimals are preserved through the calculation. Any rounding
                    you see should be display-only so comparisons do not
                    collapse into identical results.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: step-by-step + related tool */}
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
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
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
                      Time-length equivalents use a 365-day model so daily,
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

                  <div className="mt-5 rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Related tool
                    </div>
                    <p className="mt-2">
                      If you need conversions in other directions, use the
                      general converter.
                    </p>
                    <div className="mt-3 text-sm">
                      <Link
                        to="/rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        Rent converter →
                      </Link>
                    </div>
                  </div>
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                  Monthly here is a budgeting split, not a 30-day assumption
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The monthly headline result is annual ÷ 12. Day-based
                  equivalents in the breakdown use a 365-day model for
                  consistency. A 4-week (28-day) schedule is shown separately
                  because it is a different billing interval and often
                  annualizes differently.
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
