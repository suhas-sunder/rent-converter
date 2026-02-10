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
                  How the biweekly to monthly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a biweekly rent amount into a monthly
                  equivalent by normalizing the input through days, then scaling
                  it to an annual total and dividing by twelve. Biweekly is
                  treated as a fixed 14-day period. Monthly is treated as an
                  average month based on a 365-day year.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 14 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Monthly = annual ÷ 12
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
                  FINAL
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly = ÷ 12
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
                    If you need other period conversions that keep the same
                    time-length definitions, use the{" "}
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent converter
                    </Link>
                    .
                  </p>

                  <p className="text-sm text-slate-600">
                    Common neighbors:{" "}
                    <Link
                      to="/monthly-to-biweekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      monthly to biweekly
                    </Link>
                    ,{" "}
                    <Link
                      to="/biweekly-to-annual-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      biweekly to annual
                    </Link>
                    , and{" "}
                    <Link
                      to="/biweekly-to-weekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      biweekly to weekly
                    </Link>
                    .
                  </p>

                  <p className="text-sm text-slate-600">
                    If you need due dates (not equivalents), use{" "}
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
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Examples you can cross-check
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    These examples follow the exact formulas above. Any “≈” is
                    display rounding only.
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
                        Annual = daily × 365 = 26,071.428571…
                      </div>
                      <div className="mt-1">
                        Monthly = annual ÷ 12 = 2,172.619047… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          2,172.62
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
                        Annual = daily × 365 = 29,999.392857…
                      </div>
                      <div className="mt-1">
                        Monthly = annual ÷ 12 = 2,499.949404… ≈{" "}
                        <span className="font-semibold text-slate-900">
                          2,499.95
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3 (why biweekly × 2 drifts)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly = 1,000
                      </div>
                      <div className="mt-1">
                        Biweekly × 2 = 2,000 (this is a 28-day amount)
                      </div>
                      <div className="mt-1">
                        Monthly (average) ≈{" "}
                        <span className="font-semibold text-slate-900">
                          2,172.62
                        </span>{" "}
                        (from annual ÷ 12)
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        The shortcut compares a 28-day value to an average
                        month.
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (4-week comparison)
                      </div>
                      <div className="mt-2 text-sm text-slate-700">
                        Biweekly = 1,000
                      </div>
                      <div className="mt-1">
                        4-week (28-day) = daily × 28 = (1,000 ÷ 14) × 28 ={" "}
                        <span className="font-semibold text-slate-900">
                          2,000.00
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-slate-600">
                        This is why “biweekly × 2” matches a 28-day cycle, not
                        an average calendar month.
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">
                    Linearity check: double the biweekly input and the monthly
                    output doubles.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: core model */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The conversion path used on this page
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The converter follows a single, explicit path so assumptions
                    do not change mid-calculation. Your biweekly input is first
                    converted into a per-day amount, then expanded to an annual
                    total, and finally divided into twelve equal monthly parts.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong className="text-slate-900">Daily</strong> =
                        biweekly ÷ 14
                      </li>
                      <li>
                        <strong className="text-slate-900">Annual</strong> =
                        daily × 365
                      </li>
                      <li>
                        <strong className="text-slate-900">Monthly</strong> =
                        annual ÷ 12
                      </li>
                      <li>
                        Combined:{" "}
                        <strong className="text-slate-900">
                          Monthly = biweekly × 365 ÷ (14 × 12)
                        </strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Monthly corresponds to an average month length of 365 ÷ 12
                      days.
                    </p>
                  </div>

                  <p>
                    This avoids treating “biweekly” as “twice per month” and
                    avoids treating “monthly” as a fixed 30-day or 28-day
                    interval. Each step is derived from time length, not payment
                    counts.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why not divide by 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why monthly is not biweekly × 2
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    A common shortcut is to double a biweekly amount to estimate
                    a monthly cost. That shortcut assumes a month is exactly two
                    biweekly periods (28 days). Calendar months average about
                    30.42 days under a 365-day year.
                  </p>

                  <p>
                    Over a full year, the shortcut produces drift because it
                    mixes a 28-day cycle with a monthly label. This page avoids
                    that by anchoring everything to the same annual total before
                    computing the monthly equivalent.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Biweekly definition
                      </div>
                      <p className="mt-2">
                        Biweekly always means 14 days on this page.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Monthly definition
                      </div>
                      <p className="mt-2">
                        Monthly is an average month derived from annual ÷ 12.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown behavior */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  How the breakdown stays consistent
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Once the daily rate is established, every other period is
                    derived from that same basis. Weekly uses 7 days. 4-week
                    uses 28 days. Monthly uses an average month length. Because
                    all lines reconcile to the same annual total, comparisons
                    stay coherent.
                  </p>

                  <p>
                    The breakdown should be derived from daily (the normalized
                    basis), not from the monthly display value. That prevents
                    rounding drift and keeps reconciliation clean.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: scope + precision */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Input formats, ambiguity handling, and rounding
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Inputs are parsed as decimal numbers. Commas are treated as
                    thousands separators. Currency symbols may be present and
                    ignored for numeric parsing. Precision should be preserved
                    end to end, and rounding should be display-only.
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
                      If an input could reasonably mean two different numbers,
                      the correct behavior is a warning or an error instead of a
                      guessed output.
                    </p>
                  </div>

                  <p>
                    Scope: this converter does not add fees, utilities,
                    deposits, taxes, insurance, discounts, or proration. It
                    converts only the amount you enter.
                  </p>

                  <p className="text-sm text-slate-600">
                    If you export the breakdown (CSV) or print to PDF, the
                    outputs should match the same formulas and basis described
                    above.
                  </p>
                </div>
              </div>
            </div>

            {/* Dark callout */}
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
                  Monthly here is an average, not a billing schedule
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This page produces a monthly equivalent derived from an annual
                  total. It does not model due dates or payment timing. If your
                  rent is billed every 28 days, that should be shown as a
                  separate 4-week line rather than being merged into “monthly.”
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
