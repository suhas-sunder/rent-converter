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
            How this rent per week calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            This page converts the rent you enter into a{" "}
            <strong>weekly equivalent</strong> (a 7-day cost) so you can make a
            clean decision when listings use different billing cycles. It
            normalizes your input to a single annual total first, then expresses
            that same total as a weekly amount. That prevents hidden assumption
            changes when you compare a monthly listing, a 28-day listing, and a
            weekly quote side by side.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4  transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Amount + period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4  transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                NORMALIZE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Annual total
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4  transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                CONVERT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Weekly (7 days)
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4  transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                EXTRA
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Weeks total box
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
                    Rent converter
                  </Link>
                  <span className="text-slate-600">
                    {" "}
                    for converting the same rent into multiple periods when you
                    are reviewing listings that quote different cycles.
                  </span>{" "}
                </li>

                <li className="mb-2 list-disc ml-5">
                  {" "}
                  <Link
                    to="/monthly-to-weekly-rent-converter"
                    className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Monthly to weekly
                  </Link>
                  <span className="text-slate-600">
                    {" "}
                    when your input is explicitly monthly and you want the
                    weekly number without extra period options.
                  </span>{" "}
                </li>

                <li className="mb-2 list-disc ml-5">
                  {" "}
                  <Link
                    to="/rent-paid-every-4-weeks-calculator"
                    className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Rent paid every 4 weeks
                  </Link>
                  <span className="text-slate-600">
                    {" "}
                    when a listing is quoted in 28-day cycles and you want to
                    compare it fairly against weekly or monthly rent
                  </span>
                  .
                </li>
              </ul>
            </p>
          </div>

          {/* Examples section (separate) */}
          <div className="mb-8 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="p-5 sm:p-6">
              <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                Examples
              </h3>
              <p className="mt-3 text-slate-600 leading-7">
                Each example follows the same structure: convert the input to an
                annual total using this page’s period definition, then convert
                that annual total into a 7-day (weekly) equivalent.
              </p>

              <div className="mt-6 grid gap-4 sm:gap-5">
                {/* Example 1: Monthly */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 1: $2,400 monthly
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> You can afford up to about{" "}
                      <strong>$550/week</strong> and are deciding whether this
                      monthly listing fits your weekly budget.
                    </li>
                    <li>
                      <strong>Numbers:</strong> $2,400/month (CAD), using an
                      average month (365 ÷ 12 days).
                    </li>
                    <li>
                      <strong>Calculation:</strong> Annual ={" "}
                      <strong>$28,800</strong> (2400 × 12). Weekly ={" "}
                      <strong>$552.328767</strong> (28,800 × 7 ÷ 365).
                    </li>
                    <li>
                      <strong>Result:</strong> Weekly equivalent is{" "}
                      <strong>$552.33/week</strong> (rounded for display).
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> This crosses a $550/week cap, so
                      you either negotiate, adjust the budget, or reject it,
                      even though “$2,400 monthly” might feel like it fits if
                      you do a rough monthly ÷ 4 shortcut.
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
                      <strong>Situation:</strong> Two places look similar: one
                      is “$2,000 every 4 weeks,” another is “$2,000 monthly.”
                      You want to know which is actually cheaper per week.
                    </li>
                    <li>
                      <strong>Numbers:</strong> $2,000 per 28 days (CAD).
                    </li>
                    <li>
                      <strong>Calculation:</strong> Daily ={" "}
                      <strong>$71.428571</strong> (2000 ÷ 28). Weekly ={" "}
                      <strong>$500.000000</strong> (daily × 7). Annual ={" "}
                      <strong>$26,071.428571</strong> (daily × 365).
                    </li>
                    <li>
                      <strong>Result:</strong> Weekly equivalent is{" "}
                      <strong>$500.00/week</strong>.
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> If the other listing is $2,000
                      monthly, its weekly equivalent will be higher than
                      $500/week. The 28-day listing is the better deal at the
                      same “$2,000” headline, so it should rank higher in your
                      shortlist.
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
                      <strong>Situation:</strong> You are deciding between a
                      short-term stay and staying put for 12 weeks. You need a
                      fast “cash outlay over the next 12 weeks” number.
                    </li>
                    <li>
                      <strong>Numbers:</strong> $700/week (CAD) for 12 weeks.
                    </li>
                    <li>
                      <strong>Calculation:</strong> Weekly ={" "}
                      <strong>$700.00</strong> (already 7 days). Annual ={" "}
                      <strong>$36,500</strong> (700 × 365 ÷ 7). Total for 12
                      weeks = <strong>$8,400</strong> (700 × 12).
                    </li>
                    <li>
                      <strong>Result:</strong> 12-week total is{" "}
                      <strong>$8,400</strong>.
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> If your available cash for the
                      next 12 weeks is below $8,400 (before utilities and
                      deposits), this option is not viable, even if the weekly
                      number “seems manageable” in isolation.
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What these examples are doing
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      They force every option into a single decision unit:{" "}
                      <strong>cost per 7 days</strong>, so you can rank listings
                      that are quoted in different cycles.
                    </li>
                    <li>
                      They show when a “same headline number” is not the same
                      cost, especially for <strong>28-day</strong> cycles versus
                      <strong>monthly</strong>.
                    </li>
                    <li>
                      They treat rounding as presentation, so you do not make a
                      close-call decision on a rounded display that hides a
                      small but real difference.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className=" space-y-6 text-lg text-slate-700 leading-7">
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
                  The weekly result is a comparison number: it represents the
                  same underlying rent cost as your input, expressed as a 7-day
                  equivalent. The key point is that the annual total is treated
                  as the source of truth, so the weekly output does not drift
                  depending on whether you started with monthly, biweekly, or a
                  28-day cycle.
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
                  This matters most when a listing is described as “monthly” but
                  another is “every 4 weeks.” Those can look similar on paper,
                  but they are not the same calendar length. Normalizing through
                  a single annual basis keeps that difference visible so you can
                  decide using the true weekly cost, not a shortcut.
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
                  The breakdown cards let you compare real offers in the way
                  people actually talk about rent. Once the annual total is
                  fixed, each card is the same cost expressed in a different
                  period, so you can align two listings on the period you care
                  about (weekly budget, monthly cashflow, pay cycle timing).
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
                  If the breakdown does not match what you expected, treat it as
                  a validation check. The most common cause is selecting the
                  wrong period for the number you typed (for example, entering a
                  monthly figure while “every 4 weeks” is selected).
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
                  The weeks-total box turns the weekly equivalent into a short
                  planning number. Use it when your decision is based on a fixed
                  time window, like covering a gap before a new job starts,
                  pricing a temporary place, or comparing two listings over the
                  same 6–12 week span.
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
                  Treat the result as a budget yardstick, not a lease schedule.
                  If you need calendar-accurate totals tied to exact due dates
                  (like “rent due on the 1st” or mid-month move-ins), you will
                  want a calendar-based estimator rather than a weekly
                  equivalence multiplier.
                </p>
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
                  Use the weekly equivalent to choose between listings and to
                  sanity-check “monthly vs 28-day vs weekly” pricing. Do not use
                  it to predict your exact payment calendar. Leases can bill on
                  specific due dates and may include proration rules, fees, and
                  utilities that are not modeled here, so the weekly number
                  should drive comparisons and budgets, not legal payment
                  timing.
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
