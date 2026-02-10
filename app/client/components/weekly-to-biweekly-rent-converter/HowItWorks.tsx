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
          <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                  Weekly to biweekly rent conversion
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a weekly rent amount into a biweekly
                  equivalent using a fixed day-length definition. Weekly is
                  treated as{" "}
                  <span className="font-semibold text-slate-900">7 days</span>{" "}
                  and biweekly is treated as{" "}
                  <span className="font-semibold text-slate-900">14 days</span>.
                  The calculator converts through a consistent annual basis so
                  the full breakdown stays aligned across other periods.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 14 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  365-day model
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DEFINITION
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Biweekly = 14 days
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CORE RULE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  biweekly = weekly × 2
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Biweekly + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: what it returns */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      What this converter returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    You enter a weekly rent amount and the tool returns the
                    biweekly equivalent as a{" "}
                    <span className="font-semibold text-slate-900">14-day</span>{" "}
                    amount. Under these definitions, the biweekly figure is
                    exact: two 7-day weeks make one 14-day period.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Biweekly equivalent
                      </span>{" "}
                      = weekly rent × 2
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      This is a time-length definition (14 days). It is not a
                      claim about how a lease bills payments across calendar
                      dates.
                    </p>
                  </div>

                  <p>
                    In addition to the headline biweekly number, the page can
                    show a breakdown table across common periods. Those values
                    are derived from one consistent basis so the outputs do not
                    mix assumptions. That matters when you are comparing weekly,
                    biweekly, 4-week (28 days), and monthly averages in the same
                    view.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: how the breakdown stays consistent */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      How the math stays consistent across periods
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Weekly to biweekly is simple, but most people use this page
                    while they are also looking at monthly listings or 4-week
                    listings. The breakdown is built to keep those comparisons
                    stable by converting through daily and annual equivalents on
                    a{" "}
                    <span className="font-semibold text-slate-900">
                      365-day year
                    </span>
                    .
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        One shared basis
                      </div>
                      <p className="mt-2">
                        Daily = weekly ÷ 7. Annual = daily × 365. Monthly =
                        annual ÷ 12. 4-week = daily × 28. Biweekly = daily × 14.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        What that avoids
                      </div>
                      <p className="mt-2">
                        It avoids treating “monthly” as a fixed number of weeks,
                        and it avoids hiding the difference between 28 days and
                        an average month (365 ÷ 12 days).
                      </p>
                    </div>
                  </div>

                  <p>
                    If you only need weekly and biweekly, the direct rule (× 2)
                    is the main output. If you are comparing across listings
                    that quote different cycles, the breakdown gives you a
                    common frame without forcing you to do mental conversions or
                    rely on 30-day shortcuts.
                  </p>
                </div>
              </div>
            </div>

            {/* Examples section (separate) */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Examples
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Each example uses the same rule:{" "}
                    <span className="font-semibold text-slate-900">
                      biweekly = weekly × 2
                    </span>
                    . If the UI rounds display values, the final digits can
                    differ, but the conversion logic is unchanged.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-sky-900">
                        Example 1: $500 weekly
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          Biweekly ={" "}
                          <strong className="text-slate-900">
                            $500 × 2 = $1,000
                          </strong>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-sky-900">
                        Example 2: $625.75 weekly
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          Biweekly ={" "}
                          <strong className="text-slate-900">$1,251.50</strong>
                        </li>
                        <li className="text-slate-600">
                          Decimals are preserved end-to-end; rounding is
                          display-only.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      What these examples are doing
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Weekly and biweekly are fixed-day periods (7 and 14
                        days), so the ×2 conversion is exact.
                      </li>
                      <li>
                        Any additional period values in the breakdown should be
                        derived from one shared annual basis to avoid mixed
                        assumptions.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: input formats (separate) */}
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
                        d="M4 7h16M7 11h10M7 15h6"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Input formats supported
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Parsing rules
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Decimals:{" "}
                        <strong className="text-slate-900">1200.50</strong>,{" "}
                        <strong className="text-slate-900">.5</strong>,{" "}
                        <strong className="text-slate-900">12.</strong>
                      </li>
                      <li>
                        Thousands grouping:{" "}
                        <strong className="text-slate-900">1,200</strong>,{" "}
                        <strong className="text-slate-900">1,200.50</strong>
                      </li>
                      <li>
                        Currency symbols are ignored for parsing:{" "}
                        <strong className="text-slate-900">$1,200.50</strong>
                      </li>
                    </ul>
                  </div>

                  <p>
                    If an input could reasonably be interpreted more than one
                    way, the correct behavior is to warn or block instead of
                    guessing and returning a clean-looking but incorrect result.
                  </p>

                  <p className="text-sm text-slate-600">
                    Example: <strong className="text-slate-900">1,234</strong>{" "}
                    is treated as thousands grouping (1234). If you meant a
                    decimal, use{" "}
                    <strong className="text-slate-900">1.234</strong>.
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  This converts periods, not due dates
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The biweekly result is a 14-day equivalent. It does not infer
                  a calendar schedule and it does not tell you which months have
                  more or fewer payments. If you need a list of due dates over a
                  horizon, use a due-date schedule tool.
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

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>
              ,{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
              </Link>
              , and{" "}
              <Link
                to="/rent-affordability-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent affordability calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
