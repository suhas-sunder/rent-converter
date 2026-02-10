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
            How this rent per day calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            This page converts your entered rent amount into a{" "}
            <strong>daily equivalent</strong>. It does that by using an annual
            total as the common basis. First, your selected input period is
            converted into an annual amount using a consistent time-length
            model. Then that annual amount is converted into a 1-day value. The
            result is a daily figure that lines up with the rest of the
            breakdown (weekly, biweekly, 28-day, monthly average, and annual)
            without switching assumptions mid-stream.
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
                Daily equivalent
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                EXTRA
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Days total box
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
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  1) The daily value is derived from an annual basis
                </h3>

                <p className="mt-4">
                  The daily equivalent is not computed by taking a shortcut like
                  “monthly ÷ 30” or “weekly ÷ 7 unless the input was weekly.”
                  The page uses one consistent basis for all inputs:
                  <strong>
                    {" "}
                    convert the input to an annual total, then divide by 365 to
                    get daily
                  </strong>
                  . That way, daily, weekly, 28-day, and monthly outputs
                  reconcile cleanly because they all come from the same annual
                  number.
                </p>

                <p className="mt-4">
                  This matters most when the input is monthly or every 4 weeks.
                  A calendar month is not a fixed number of days, and a 4-week
                  period is exactly 28 days. If you convert monthly to daily by
                  dividing by 30, you have implicitly changed the annual total.
                  This page avoids that by mapping monthly through an average
                  month length (365 ÷ 12 days) and using a 365-day year.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  2) Period definitions used on this page
                </h3>

                <p className="mt-4">
                  The converter treats each period label as a time length. That
                  prevents mixing calendar-based payment schedules with
                  fixed-day cycles when you are trying to compare costs.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Assumptions used
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>Year = 365 days</li>
                    <li>Average month = 365 ÷ 12 days</li>
                    <li>Week = 7 days</li>
                    <li>Biweekly = 14 days</li>
                    <li>Every 4 weeks = 28 days</li>
                    <li>Hourly conversions assume 24 hours per day</li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you are comparing listings, the daily equivalent is often
                  the simplest common unit because it can be scaled into any
                  other period without switching definitions. It also helps you
                  see whether a “monthly” listing and a “4-week” listing that
                  look similar are actually the same annual cost.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  3) What the “total for a chosen number of days” box does
                </h3>

                <p className="mt-4">
                  The days-total box is a quick estimator: it multiplies the
                  daily equivalent by a day count you choose. That makes it
                  useful for “what does this difference mean over 10 days, 45
                  days, or 90 days” comparisons, or for rough planning across a
                  defined number of days.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Estimator behavior
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      It uses the <strong>computed daily equivalent</strong>{" "}
                      from this page as the base.
                    </li>
                    <li>
                      It multiplies by your selected day count (no extra
                      assumptions are added).
                    </li>
                    <li>
                      It is not a proration engine and does not model
                      lease-specific rules.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  Real proration depends on what the lease defines as a billing
                  month, due dates, partial periods, and any fees or minimums.
                  This tool keeps that out of scope and stays strictly in
                  equivalence math territory.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  4) Decimals and rounding
                </h3>

                <p className="mt-4">
                  Inputs are parsed in a decimal-safe way and calculations
                  preserve precision internally (up to 12 decimals). If rounding
                  is enabled in the UI, it should be display-only: formatting
                  what you see without changing the underlying daily or annual
                  numbers that the breakdown is based on.
                </p>

                <p className="mt-4">
                  If an input is invalid or ambiguous, the page should avoid
                  showing a misleading “0” daily result. A daily equivalent is
                  often used as a base for other calculations on the page, so
                  hiding results on bad input is the correct behavior.
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
                  Each example shows the same structure: convert the input to an
                  annual total using this page’s period definition, then divide
                  by 365 to get a daily equivalent. Values below are shown with
                  decimals to make the math transparent.
                </p>

                <div className="mt-6 grid gap-4 sm:gap-5">
                  {/* Example A: Monthly */}
                  <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 1: $2,400 monthly
                    </div>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Annual = <strong>$28,800</strong> (2400 × 12)
                      </li>
                      <li>
                        Daily = <strong>$78.904110</strong> (28,800 ÷ 365)
                      </li>
                      <li className="text-slate-600">
                        Why this differs from “÷ 30”: monthly here is treated as
                        annual ÷ 12, not a fixed 30-day month.
                      </li>
                    </ul>
                  </div>

                  {/* Example B: Every 4 weeks */}
                  <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 2: $2,000 every 4 weeks (28 days)
                    </div>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Daily = <strong>$71.428571</strong> (2000 ÷ 28)
                      </li>
                      <li>
                        Annual = <strong>$26,071.428571</strong> (daily × 365)
                      </li>
                      <li className="text-slate-600">
                        This is why “every 4 weeks” is not interchangeable with
                        “monthly” even if the numbers look close.
                      </li>
                    </ul>
                  </div>

                  {/* Example C: Weekly + days-total */}
                  <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 3: $700 weekly, plus a 45-day total
                    </div>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Daily = <strong>$100.000000</strong> (700 ÷ 7)
                      </li>
                      <li>
                        Annual = <strong>$36,500</strong> (100 × 365)
                      </li>
                      <li>
                        Total for 45 days = <strong>$4,500</strong> (100 × 45)
                      </li>
                      <li className="text-slate-600">
                        The 45-day total is just daily × days. No proration or
                        lease rules are applied.
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
                        daily is annual ÷ 365.
                      </li>
                      <li>
                        28-day inputs annualize via{" "}
                        <strong>(amount ÷ 28) × 365</strong>, then daily is
                        annual ÷ 365, which returns to amount ÷ 28.
                      </li>
                      <li>
                        Fixed-day inputs (weekly, biweekly, 28-day) stay
                        consistent because the day count is explicit.
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
                  This is an equivalence calculator, not a billing simulator
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The outputs are consistent comparisons derived from explicit
                  time assumptions. They are useful for comparing listings,
                  sanity-checking implied annual cost, and estimating day-based
                  totals. They do not model lease-specific proration, due-date
                  rules, partial periods, or fees.
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
                to="/monthly-to-daily-rent-converter"
                className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                monthly to daily
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
