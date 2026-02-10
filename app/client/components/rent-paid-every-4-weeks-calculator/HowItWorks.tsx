import { Link } from "react-router";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm rc-no-print mt-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
      </div>

      <div className="relative p-6 sm:p-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
            How this 4-week rent calculator works
          </h2>

          <div className="space-y-6 text-lg text-slate-700 leading-7">
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  A 4-week schedule is a 28-day schedule
                </h3>
                <p className="mt-4">
                  “Rent paid every 4 weeks” means the due date repeats every 28
                  days. Because calendar months are usually longer than 28 days,
                  the due date moves through the calendar rather than staying
                  anchored on the same month day. This is why people often
                  experience “extra” payments over a long horizon when they
                  mentally compare it to a monthly schedule.
                </p>
                <p className="mt-4">
                  This tool keeps the 28-day definition explicit. It does not
                  treat 4 weeks as “basically monthly,” and it does not replace
                  calendar month behavior with a 28-day shortcut.
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  Conversions use an annual total as the source of truth
                </h3>
                <p className="mt-4">
                  The calculator converts your 28-day rent amount to an annual
                  total first using a 365-day year. That annual total is the
                  reference point for the rest of the page. Monthly (average),
                  weekly, biweekly, daily, and hourly values are derived from
                  the same annual total so the breakdown does not mix
                  assumptions.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Assumptions used for equivalence
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>Year = 365 days</li>
                    <li>Average month = 365 ÷ 12 days</li>
                    <li>Every 4 weeks = 28 days</li>
                    <li>Week = 7 days</li>
                    <li>Hourly conversions assume 24 hours/day</li>
                  </ul>
                </div>

                <p className="mt-4">
                  This is why the page can show a monthly equivalent without
                  claiming that “4 weeks equals a month.” The tool translates
                  the annual total into an average-month value (annual ÷ 12)
                  rather than forcing 28-day blocks to fit calendar months.
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  The “4-week × 13” comparison is shown separately on purpose
                </h3>

                <p className="mt-4">
                  The page may show a “4-week × 13” figure because it’s a common
                  shorthand when people think in 52-week blocks. That framing is
                  useful for schedule intuition, but it is not the same as the
                  365-day annual equivalence used for conversions. The
                  difference is small, but it exists, and the tool keeps it
                  visible.
                </p>

                <p className="mt-4">
                  If you want a clean equivalence breakdown across daily,
                  weekly, biweekly, 4-week, and monthly, the 365-day annual
                  basis is the consistent model. If you want schedule intuition
                  (how many payments you might see inside a 52-week framing),
                  the ×13 line is the quick shorthand. This tool separates them
                  instead of collapsing them into one number.
                </p>
              </div>
            </div>

            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  Decimals and rounding behavior
                </h3>

                <p className="mt-4">
                  Decimals are preserved end-to-end. Internally, calculations
                  keep precision (up to 12 decimals). If the UI offers rounding,
                  rounding is display-only, meaning it formats the output
                  without changing the computed annual total or the derived
                  breakdown values.
                </p>

                <p className="mt-4 text-slate-600">
                  Outputs are estimates. Exact totals can vary based on lease
                  terms, start dates, proration, fees, and what the agreement
                  defines as “rent.”
                </p>
              </div>
            </div>

            {/* Examples section (separate, real numbers) */}
            <div className="mt-10 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div className="p-5 sm:px-6">
                <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                  Examples
                </h3>
                <p className="mt-3 text-slate-600 leading-7">
                  These examples show the two different ideas side by side:
                  365-day equivalence (used for conversions) and the “×13”
                  shorthand (useful for schedule intuition).
                </p>

                <div className="mt-6 grid gap-4 sm:gap-5">
                  {/* Example 1 */}
                  <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 1: $2,000 every 4 weeks (28 days)
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Equivalence math (365-day basis)
                        </div>
                        <ul className="mt-2 space-y-1 text-slate-700">
                          <li>
                            Daily = <strong>$71.428571</strong> (2000 ÷ 28)
                          </li>
                          <li>
                            Annual = <strong>$26,071.428571</strong> (daily ×
                            365)
                          </li>
                          <li>
                            Monthly (avg) = <strong>$2,172.619048</strong>{" "}
                            (annual ÷ 12)
                          </li>
                          <li>
                            Weekly = <strong>$500.00</strong> (daily × 7)
                          </li>
                          <li>
                            Hourly = <strong>$2.976190</strong> (daily ÷ 24)
                          </li>
                        </ul>
                      </div>

                      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Schedule shorthand (shown separately)
                        </div>
                        <ul className="mt-2 space-y-1 text-slate-700">
                          <li>
                            4-week × 13 = <strong>$26,000.00</strong>
                          </li>
                          <li>
                            Difference vs 365-day annual ={" "}
                            <strong>$71.428571</strong>
                          </li>
                        </ul>
                        <p className="mt-3 text-sm text-slate-600">
                          The shorthand counts 13 payments in 52 weeks. The
                          equivalence math anchors to 365 days, then derives
                          every other period from that same annual total.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Example 2 */}
                  <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 2: $1,500 every 4 weeks (28 days)
                    </div>

                    <div className="mt-3 grid sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Equivalence math (365-day basis)
                        </div>
                        <ul className="mt-2 space-y-1 text-slate-700">
                          <li>
                            Daily = <strong>$53.571429</strong> (1500 ÷ 28)
                          </li>
                          <li>
                            Annual = <strong>$19,553.571429</strong> (daily ×
                            365)
                          </li>
                          <li>
                            Monthly (avg) = <strong>$1,629.464286</strong>{" "}
                            (annual ÷ 12)
                          </li>
                          <li>
                            Weekly = <strong>$375.00</strong> (daily × 7)
                          </li>
                          <li>
                            Hourly = <strong>$2.232143</strong> (daily ÷ 24)
                          </li>
                        </ul>
                      </div>

                      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Schedule shorthand (shown separately)
                        </div>
                        <ul className="mt-2 space-y-1 text-slate-700">
                          <li>
                            4-week × 13 = <strong>$19,500.00</strong>
                          </li>
                          <li>
                            Difference vs 365-day annual ={" "}
                            <strong>$53.571429</strong>
                          </li>
                        </ul>
                        <p className="mt-3 text-sm text-slate-600">
                          Over short horizons this gap looks tiny, but it
                          accumulates if you mix models while budgeting.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      What to take from the examples
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        The conversion breakdown uses <strong>365-day</strong>{" "}
                        equivalence so each derived period reconciles to the
                        same annual total.
                      </li>
                      <li>
                        The “×13” line is <strong>not</strong> used to derive
                        monthly (avg), daily, or hourly equivalents. It’s shown
                        as a separate intuition check.
                      </li>
                      <li>
                        If you are comparing “monthly” listings to “every 4
                        weeks,” use the derived equivalents rather than dividing
                        by 4.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
              <div className="text-sm font-bold text-sky-900">
                What you can do here
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
                <li>
                  Translate a 28-day rent amount into a consistent annual and
                  monthly (average) basis
                </li>
                <li>
                  Compare 4-week, weekly, and monthly equivalents without
                  treating them as interchangeable
                </li>
                <li>
                  See the difference between schedule shorthand (4-week × 13)
                  and 365-day annual equivalence
                </li>
                <li>
                  Copy or print the results for documentation (including
                  save-as-PDF)
                </li>
              </ul>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/rent-converter"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent converter
              </Link>
              ,{" "}
              <Link
                to="/weekly-to-monthly-rent-converter"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                weekly to monthly
              </Link>
              ,{" "}
              <Link
                to="/monthly-to-annual-rent-converter"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                monthly to annual
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
