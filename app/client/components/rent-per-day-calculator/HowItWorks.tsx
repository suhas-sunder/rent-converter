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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
            How this rent per day calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            Use the daily equivalent when you need one number that makes
            different rent periods directly comparable. The calculator takes
            your <strong>amount + period</strong>, normalizes it to an
            <strong> annual total</strong> using consistent time definitions,
            then converts that annual cost into a <strong>per-day value</strong>
            . The goal is a daily figure you can trust as a baseline for
            comparing listings, checking budget limits, and scaling to a
            specific number of days without switching assumptions.
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

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>
            {/* Related tools (kept) */}
            <p className="text-slate-700 leading-relaxed">
              <ul>
                <li className="mb-2 list-disc ml-5">
                  <Link
                    to="/rent-converter"
                    className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    rent converter
                  </Link>
                  <span className="text-slate-600">
                    {" "}
                    for a full breakdown across common periods when you want
                    more than the daily baseline
                  </span>{" "}
                </li>

                <li className="mb-2 list-disc ml-5">
                  {" "}
                  <Link
                    to="/monthly-to-daily-rent-converter"
                    className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    monthly to daily
                  </Link>
                  <span className="text-slate-600">
                    {" "}
                    for a focused monthly-only workflow when the input is always
                    a calendar month
                  </span>{" "}
                </li>

                <li className="mb-2 list-disc ml-5">
                  {" "}
                  <Link
                    to="/rent-paid-every-4-weeks-calculator"
                    className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    rent paid every 4 weeks
                  </Link>
                  <span className="text-slate-600">
                    {" "}
                    for situations where the listing is explicitly on a 28-day
                    cycle and you want that schedule shown clearly
                  </span>
                  .
                </li>
              </ul>
            </p>
          </div>

          {/* Examples section (separate) */}
          <div className="mt-8 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="p-5 sm:p-6">
              <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                Examples
              </h3>
              <p className="mt-3 text-slate-600 leading-7">
                These are decision scenarios, not formula demos. Each one shows
                what changes once you convert to a daily equivalent: which
                option you pick, what you reject, or what you can safely
                compare.
              </p>

              <div className="mt-6 grid gap-4 sm:gap-5">
                {/* Example A: Monthly */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 1: $2,400 monthly
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> You are comparing a monthly
                      listing to another option advertised as “$80 per day” for
                      a shorter-term stay.
                    </li>
                    <li>
                      <strong>Numbers:</strong> $2,400 monthly versus $80 per
                      day.
                    </li>
                    <li>
                      <strong>Calculation:</strong> Annual ={" "}
                      <strong>$28,800</strong> (2400 × 12). Daily ={" "}
                      <strong>$78.904110</strong> (28,800 ÷ 365).
                    </li>
                    <li>
                      <strong>Result:</strong> $2,400 monthly implies about{" "}
                      <strong>$78.90/day</strong>, which is below $80/day.
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> The “$80/day” option is not
                      cheaper. If your only goal is minimizing cost per day, the
                      monthly listing wins on price even before you weigh other
                      factors.
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
                      <strong>Situation:</strong> Two listings look similar: one
                      is “$2,000 every 4 weeks,” the other is “$2,150 monthly.”
                      You want the cheaper annual cost.
                    </li>
                    <li>
                      <strong>Numbers:</strong> $2,000 per 28 days versus $2,150
                      per month.
                    </li>
                    <li>
                      <strong>Calculation:</strong> 28-day daily ={" "}
                      <strong>$71.428571</strong> (2000 ÷ 28). Annual ={" "}
                      <strong>$26,071.428571</strong> (daily × 365). Monthly
                      option annual = <strong>$25,800</strong> (2150 × 12).
                    </li>
                    <li>
                      <strong>Result:</strong> The 4-week listing is about{" "}
                      <strong>$271.43/year</strong> more expensive (26,071.43 −
                      25,800), even though “$2,000” looks lower.
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> If you are optimizing total
                      yearly cost, you reject the “$2,000 every 4 weeks” option
                      on price. The monthly listing is the cheaper contract over
                      time.
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
                      <strong>Situation:</strong> You need housing for 45 days
                      and have two quotes: $700 weekly or $4,300 for the full
                      45-day period. You choose the cheaper total for the exact
                      window.
                    </li>
                    <li>
                      <strong>Numbers:</strong> $700 per week and a flat $4,300
                      for 45 days.
                    </li>
                    <li>
                      <strong>Calculation:</strong> Weekly daily ={" "}
                      <strong>$100.000000</strong> (700 ÷ 7). Total for 45 days
                      = <strong>$4,500</strong> (100 × 45).
                    </li>
                    <li>
                      <strong>Result:</strong> Weekly pricing implies{" "}
                      <strong>$4,500</strong> for 45 days, which is higher than
                      $4,300.
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> For a fixed 45-day plan, you
                      take the $4,300 quote on price. The daily baseline turns a
                      weekly rate into an apples-to-apples total for the same
                      window.
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What these examples are doing
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      They label the decision first (compare, accept/reject, or
                      choose for a fixed window), then show the minimal math
                      needed to support it.
                    </li>
                    <li>
                      They keep comparisons in one unit (daily or annual) so you
                      do not mix month lengths or payment schedules.
                    </li>
                    <li>
                      They use decimals where it prevents a real mistake, not to
                      make the page look “more precise” than needed.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6 text-lg text-slate-700 leading-7">
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
                  The daily number is built to be a stable comparison unit. The
                  calculator does <strong>not</strong> treat “monthly” as “30
                  days” or quietly change assumptions depending on the input.
                  Instead it follows one rule:
                  <strong>
                    {" "}
                    convert to an annual total first, then divide by 365 for the
                    daily equivalent
                  </strong>
                  .
                </p>

                <p className="mt-4">
                  This protects a common decision mistake: two listings can look
                  close on the surface, but a shortcut like “monthly ÷ 30” can
                  make one option appear cheaper when its implied annual cost is
                  higher. With a daily baseline coming from a single annual
                  basis, you can compare a monthly amount against a 4-week
                  amount, weekly rent, or any other period without the math
                  shifting under you.
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
                  Period labels are treated as time lengths so you can compare
                  like with like. This matters most when a listing uses a
                  payment schedule that feels “monthly,” but is actually a fixed
                  cycle (like every 4 weeks).
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
                  Practical read: if two listings have different periods, trust
                  the <strong>daily equivalent</strong> to show which one is
                  actually cheaper per unit of time. You can then scale that
                  daily value to whatever timeframe you care about (your budget
                  horizon, a planned stay length, or a comparison window).
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
                  The days-total box turns a per-day comparison into a concrete
                  dollar amount for a specific time window. It answers questions
                  like: “Over the next 60 days, how much more does Option A
                  cost?” or “If I stay 45 days, what is the implied total?”
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
                      It is a planning estimator, not a lease proration rule
                      engine.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you need exact billing behavior, you must follow the lease
                  rules (due dates, proration method, fees, minimums). This box
                  stays focused on equivalence math so the comparison stays
                  clean.
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
