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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
            How this rent per week calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            This page converts whatever rent amount you enter into a{" "}
            <strong>weekly equivalent</strong> (a 7-day amount) using a
            consistent annual basis. The calculator first translates your input
            period into an annual total using a 365-day year (and an average
            month length when monthly is involved). It then expresses that same
            annual total as a weekly figure. That “annual first” approach is the
            cleanest way to compare listings that use different billing cycles
            without quietly switching assumptions between outputs.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Amount + period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                NORMALIZE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Annual total
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                CONVERT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Weekly (7 days)
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                EXTRA
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Weeks total box
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* Card 1 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  1) Weekly is computed from a single annual basis
                </h3>

                <p className="mt-4">
                  The weekly result represents the same underlying cost as your
                  input, expressed as a 7-day equivalent. The page does not use
                  “quick conversions” that can change the implied annual total
                  depending on the input period. Instead, it uses an annual
                  total as the source of truth and derives everything from that.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Assumptions used
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>Year = 365 days</li>
                    <li>Week = 7 days</li>
                    <li>Biweekly = 14 days</li>
                    <li>Every 4 weeks = 28 days</li>
                    <li>Average month = 365 ÷ 12 days</li>
                    <li>Hourly conversions assume 24 hours per day</li>
                  </ul>
                </div>

                <p className="mt-4">
                  This is especially helpful when comparing a monthly listing
                  against a 4-week listing. A 4-week period is always 28 days,
                  and a month is longer on average. Converting through an annual
                  total keeps that difference visible across the breakdown
                  rather than hiding it behind a “close enough” shortcut.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  2) What the breakdown cards are for
                </h3>

                <p className="mt-4">
                  In addition to the weekly headline number, the page shows a
                  breakdown across common periods. Those values are not
                  independent guesses. They are the same annual total expressed
                  as hourly, daily, weekly, biweekly, every 4 weeks, monthly
                  (average), and annual equivalents. If the breakdown looks
                  inconsistent, that’s a signal that the inputs or the selected
                  period don’t match what you intended.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Common comparisons this supports
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Monthly vs weekly listings (calendar month vs 7-day
                      periods)
                    </li>
                    <li>
                      Every-4-weeks vs weekly (28-day periods vs 7-day periods)
                    </li>
                    <li>
                      Biweekly vs weekly (14-day vs 7-day, useful for pay
                      cycles)
                    </li>
                    <li>
                      Daily or hourly equivalents for short-window comparisons
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  The intent is consistency: once the annual number is fixed,
                  you can interpret each period view without wondering whether a
                  different assumption was used for each output.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  3) The “total for a chosen number of weeks” estimator
                </h3>

                <p className="mt-4">
                  The weeks-total box is a quick estimator that multiplies the
                  computed weekly equivalent by a number of weeks you choose.
                  It’s useful for “what does this cost over 6 weeks” or “what is
                  the difference over a 12-week span” comparisons, especially
                  when you’re comparing two listings that quote different
                  cycles.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Estimator scope
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Uses the weekly equivalent computed from the annual basis
                    </li>
                    <li>Multiplies by your chosen number of weeks</li>
                    <li>
                      Does not model due dates, proration, partial periods, or
                      fees
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you need calendar-accurate totals based on due dates, month
                  boundaries, or “rent due on the 1st” behavior, that’s a
                  different type of tool. This one stays in equivalence math and
                  week-count estimation.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  4) Decimals and rounding
                </h3>

                <p className="mt-4">
                  Decimals are preserved internally (up to 12). If the UI offers
                  rounding, rounding should be display-only so it formats what
                  you see without changing the underlying annual and weekly
                  calculations. The input parser should accept common formats
                  (currency symbols, commas, .5, 12.) and avoid producing a
                  misleading “0” result when input is invalid or ambiguous.
                </p>
              </div>
            </div>

            {/* Examples section (separate) */}
            <div className="mt-10 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div className="p-5 sm:p-6">
                <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                  Examples
                </h3>
                <p className="mt-3 text-slate-600 leading-7">
                  Each example follows the same structure: convert the input to
                  an annual total using this page’s period definition, then
                  convert that annual total into a 7-day (weekly) equivalent.
                </p>

                <div className="mt-6 grid gap-4 sm:gap-5">
                  {/* Example 1: Monthly */}
                  <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 1: $2,400 monthly
                    </div>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Annual = <strong>$28,800</strong> (2400 × 12)
                      </li>
                      <li>
                        Weekly = <strong>$552.328767</strong> (28,800 × 7 ÷ 365)
                      </li>
                      <li className="text-slate-600">
                        This differs from “monthly ÷ 4” because a month here is
                        treated as an average month length (365 ÷ 12 days), not
                        a fixed 4-week block.
                      </li>
                    </ul>
                  </div>

                  {/* Example 2: Every 4 weeks */}
                  <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 2: $2,000 every 4 weeks (28 days)
                    </div>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Daily = <strong>$71.428571</strong> (2000 ÷ 28)
                      </li>
                      <li>
                        Weekly = <strong>$500.000000</strong> (daily × 7)
                      </li>
                      <li>
                        Annual = <strong>$26,071.428571</strong> (daily × 365)
                      </li>
                      <li className="text-slate-600">
                        Fixed-day cycles stay clean because the day count is
                        explicit. This is why 28-day rent is not the same thing
                        as monthly rent, even if the numbers look close.
                      </li>
                    </ul>
                  </div>

                  {/* Example 3: Weekly + weeks-total */}
                  <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 3: $700 weekly, plus a 12-week total
                    </div>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Weekly = <strong>$700.00</strong> (already a 7-day
                        amount)
                      </li>
                      <li>
                        Annual = <strong>$36,500</strong> (700 × 365 ÷ 7)
                      </li>
                      <li>
                        Total for 12 weeks = <strong>$8,400</strong> (700 × 12)
                      </li>
                      <li className="text-slate-600">
                        The weeks-total box is just weekly × weeks. No due-date
                        logic, proration, or fees are applied.
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      What these examples are doing
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Monthly inputs annualize via <strong>× 12</strong>, then
                        weekly is <strong>annual × 7 ÷ 365</strong>.
                      </li>
                      <li>
                        28-day inputs use explicit days (amount ÷ 28), then
                        scale to weekly (× 7) and annual (× 365).
                      </li>
                      <li>
                        Weekly inputs are already 7-day amounts, so they map
                        directly.
                      </li>
                    </ul>
                  </div>
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
                  Scope note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  Weekly equivalence is a comparison value
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The weekly number is the same annual cost expressed as a 7-day
                  equivalent. It does not change how rent is billed under a
                  lease, and it does not apply proration rules, due-date logic,
                  or fees. It’s designed for clean comparisons across billing
                  cycles and quick week-count estimates.
                </p>
              </div>
            </div>

            {/* Related tools (kept) */}
            <p className="text-slate-700 leading-relaxed">
              Related tools:{" "}
              <Link
                to="/rent-converter"
                className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent converter
              </Link>
              ,{" "}
              <Link
                to="/monthly-to-weekly-rent-converter"
                className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                monthly to weekly
              </Link>
              ,{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent paid every 4 weeks
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
