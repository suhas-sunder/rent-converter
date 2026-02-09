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
                  How the annual to hourly rent converter works (8,760-hour
                  equivalence)
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a yearly rent total into an hourly
                  equivalent using a fixed 365-day year. The default result
                  spreads the same annual cost across every hour in the year,
                  which is{" "}
                  <span className="font-semibold text-slate-900">
                    365 × 24 = 8,760 hours
                  </span>
                  . You can optionally enable a paid-hours scenario to compare
                  against a work-hours assumption, but the time-based hourly is
                  the primary conversion used for consistent breakdowns.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Time-based hourly
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Optional paid-hours
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
                  OPTION
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  annual ÷ (hrs/wk × 52)
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
            {/* SectionCard: what you get */}
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
                      What this annual to hourly converter returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    You enter an annual rent total and the tool computes a
                    time-based hourly equivalent using{" "}
                    <span className="font-semibold text-slate-900">
                      8,760 hours
                    </span>
                    . The hourly number is the same annual cost expressed per
                    hour under a fixed-year model.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Default conversion
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Time-based hourly
                      </span>{" "}
                      = annual rent ÷ (365 × 24) = annual rent ÷ 8,760
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      This is the primary hourly used for consistency across the
                      breakdown.
                    </p>
                  </div>

                  <p>
                    The results section can also show a breakdown derived from
                    the same annual basis. Weekly, biweekly, 4-week, monthly,
                    daily, and hourly equivalents should all reconcile back to
                    the annual total under the same assumptions. If you toggle
                    paid-hours, it is shown as a clearly labeled alternative
                    hourly for comparison.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why every hour and consistency */}
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
                      Why the time-based hourly uses every hour
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The time-based hourly is designed to stay compatible with
                    the rest of the period breakdowns on the site. When
                    everything is derived from a fixed day-length model, the
                    table stays internally consistent. Using every hour in the
                    year is the cleanest way to keep hourly aligned with daily,
                    weekly, biweekly, 4-week, and monthly lines.
                  </p>

                  <p>
                    This is why the default uses{" "}
                    <span className="font-semibold text-slate-900">
                      annual ÷ (365 × 24)
                    </span>{" "}
                    and not a paid-hours assumption. If the default used only a
                    subset of hours, the hourly line would no longer reconcile
                    cleanly with day-based periods, and the breakdown would mix
                    two different models.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Time-based model
                      </div>
                      <p className="mt-2">
                        Best for keeping the breakdown consistent. Annual,
                        monthly, weekly, daily, and hourly all come from the
                        same base.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Alternative scenario
                      </div>
                      <p className="mt-2">
                        Paid-hours hourly is optional and explicitly labeled so
                        it is not confused with the default.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: paid-hours scenario */}
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
                      Paid-hours hourly (optional) and how it is computed
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The paid-hours scenario is useful when you want an
                    alternative hourly derived from a chosen hours-per-week
                    assumption. It does not replace the time-based hourly. It is
                    a comparison line that shows how different the number
                    becomes when you divide the same annual total by a smaller
                    set of hours.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Paid-hours conversion
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Paid-hours hourly
                      </span>{" "}
                      = annual rent ÷ (hours/week × 52)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      The hours/week value should be positive. If it is missing,
                      zero, or invalid, the paid-hours line should be disabled
                      or show an explicit warning.
                    </p>
                  </div>

                  <p>
                    If paid-hours is enabled, the page should show both values
                    with clear labels: time-based hourly (annual ÷ 8,760) and
                    paid-hours hourly (annual ÷ (hours/week × 52)). The tool
                    should not guess your schedule.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: examples + parsing */}
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
                      Examples and input parsing rules
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    These examples match the displayed formulas. If the UI
                    formats the result to fewer decimals, that should be
                    display-only and not change the underlying math.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      If annual rent is{" "}
                      <strong className="text-slate-900">$30,000</strong>,
                      time-based hourly is about{" "}
                      <strong className="text-slate-900">
                        $30,000 ÷ 8,760 ≈ $3.4247
                      </strong>
                      .
                    </li>
                    <li>
                      With{" "}
                      <strong className="text-slate-900">40 hours/week</strong>,
                      paid-hours hourly is{" "}
                      <strong className="text-slate-900">
                        $30,000 ÷ (40 × 52) ≈ $14.4231
                      </strong>
                      .
                    </li>
                    <li>
                      <strong className="text-slate-900">1,234</strong> is
                      interpreted as 1234 (grouping). If you meant a decimal,
                      type <strong className="text-slate-900">1.234</strong>.
                    </li>
                  </ul>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Accepted numeric formats
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Decimals:{" "}
                        <strong className="text-slate-900">30000.50</strong>,{" "}
                        <strong className="text-slate-900">.5</strong>,{" "}
                        <strong className="text-slate-900">12.</strong>
                      </li>
                      <li>
                        Thousands grouping:{" "}
                        <strong className="text-slate-900">30,000</strong>,{" "}
                        <strong className="text-slate-900">30,000.50</strong>
                      </li>
                      <li>
                        Currency symbols are ignored:{" "}
                        <strong className="text-slate-900">$30,000</strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      If an input could be interpreted more than one way, the
                      correct behavior is a warning or error instead of silently
                      guessing.
                    </p>
                  </div>

                  <p>
                    This converter treats the annual figure as the source of
                    truth. It does not add fees, utilities, deposits, or taxes.
                    It only converts the number you entered.
                  </p>
                </div>
              </div>
            </div>

            {/* Related tools */}
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
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Related rent converters
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    If you need a different direction or want to start from a
                    monthly rate, use a dedicated converter page.
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Rent converter →
                    </Link>
                    <Link
                      to="/monthly-to-hourly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Monthly to hourly →
                    </Link>
                    <Link
                      to="/hourly-to-annual-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Hourly to annual →
                    </Link>
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
                  Paid-hours is a comparison assumption, not the default model
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Time-based hourly uses all 8,760 hours in a 365-day year so
                  the hourly value stays consistent with the rest of the
                  breakdown. Paid-hours divides by (hours/week × 52) and can
                  produce a much larger number because it spreads the same
                  annual total across fewer hours. If the paid-hours line is
                  shown, it should always be clearly labeled as optional.
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
