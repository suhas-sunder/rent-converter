import { Link } from "react-router";

interface RelatedLink {
  href: string;
  text: string;
}

type Props = {
  relatedLinks: RelatedLink[];
  safeHref: (href: string) => string;
};

const HowItWorks = ({ relatedLinks, safeHref }: Props) => {
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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-800 tracking-tight leading-tight">
            How this rent due date calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            This calculator builds a forward-looking rent schedule so you can
            plan cash flow and avoid “surprise” months with more payments than
            you expected. Enter the amount due per payment, choose the billing
            cycle, set an as-of date (when planning starts), and pick how far
            ahead to project.
          </p>
          <p className="mt-4 text-slate-600 leading-7">
            The output is two views of the same schedule: a due-date list and a
            calendar-month rollup. The due-date list tells you the exact payment
            dates you need to be ready for. The month rollup shows how many
            payments land inside each calendar month so you can spot months that
            are heavier under fixed-day cycles.
          </p>

          <div className="my-8 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="p-5 sm:px-6">
              <h3 className="text-2xl font-extrabold text-sky-800 tracking-tight">
                Related pages
              </h3>
              <ul className="mt-3 list-disc ml-6 text-slate-700 space-y-2">
                {relatedLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      to={safeHref(l.href)}
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      {l.text}
                    </Link>
                    <p className="mt-1 text-sm text-slate-600 leading-6">
                      Use this when you need the same rent expressed across
                      different periods so two listings can be compared on equal
                      terms.
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Examples (real examples, standalone section) */}
          <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                Examples
              </h3>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Example 1: Weekly rent, 12 weeks ahead
                  </div>

                  <div className="mt-3 space-y-3 text-slate-700">
                    <p>
                      <strong>Situation:</strong> You can cover $2,000 in most
                      months, but only if there are four payments. You want to
                      know whether any month in the next 12 weeks will force a
                      higher outflow.
                    </p>
                    <p>
                      <strong>Numbers:</strong> Rent per payment{" "}
                      <strong>$500</strong>. Cycle <strong>weekly</strong>.
                      As-of date <strong>March 1, 2026</strong>. Horizon{" "}
                      <strong>12 weeks</strong>.
                    </p>
                    <p>
                      <strong>Calculation:</strong> Count due dates in range. If
                      the schedule contains <strong>12</strong> due dates, total
                      paid over the horizon is{" "}
                      <strong>$500 × 12 = $6,000</strong>. Then group those due
                      dates by calendar month to see whether a month has{" "}
                      <strong>4</strong> or <strong>5</strong> payments.
                    </p>
                    <p>
                      <strong>Result:</strong> Any month with <strong>5</strong>{" "}
                      weekly due dates totals <strong>$2,500</strong> instead of{" "}
                      <strong>$2,000</strong>.
                    </p>
                    <p>
                      <strong>Meaning:</strong> If a 5-payment month appears,
                      you treat that month as a cash-flow spike (you may keep a
                      buffer, shift other bills, or avoid scheduling large
                      purchases in that month).
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Example 2: Every 28 days (4-week), 6 months ahead
                  </div>

                  <div className="mt-3 space-y-3 text-slate-700">
                    <p>
                      <strong>Situation:</strong> Your pay cycle is monthly, but
                      the lease due date is every 28 days. You want to see when
                      two payments land in the same calendar month so you do not
                      get caught short.
                    </p>
                    <p>
                      <strong>Numbers:</strong> Rent per payment{" "}
                      <strong>$2,000</strong>. Cycle{" "}
                      <strong>every 28 days</strong>. As-of date{" "}
                      <strong>January 15, 2026</strong>. Horizon{" "}
                      <strong>6 months</strong>.
                    </p>
                    <p>
                      <strong>Calculation:</strong> Generate each due date by
                      adding <strong>28 days</strong>. Count how many due dates
                      fall inside the 6-month window. If there are{" "}
                      <strong>7</strong> due dates, total paid is{" "}
                      <strong>$2,000 × 7 = $14,000</strong>. Then check the
                      calendar-month rollup to see whether any month contains{" "}
                      <strong>2</strong> payments.
                    </p>
                    <p>
                      <strong>Result:</strong> The month rollup can show a month
                      with <strong>2</strong> payments even though you think in
                      “monthly” terms.
                    </p>
                    <p>
                      <strong>Meaning:</strong> If a two-payment month shows up,
                      you plan for that month as a higher-cash requirement (or
                      you set aside part of each month’s income so the second
                      payment is already funded).
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Example 3: Monthly on the 31st (month-end fallback)
                  </div>

                  <div className="mt-3 space-y-3 text-slate-700">
                    <p>
                      <strong>Situation:</strong> Your lease says rent is due on
                      the 31st. You need the next few due dates for reminders
                      and transfers, but some months do not have a 31st.
                    </p>
                    <p>
                      <strong>Numbers:</strong> Rent per payment{" "}
                      <strong>$2,400</strong>. Cycle <strong>monthly</strong>.
                      Anchor day <strong>31</strong>. As-of date{" "}
                      <strong>January 31, 2026</strong>. Horizon{" "}
                      <strong>4 months</strong>.
                    </p>
                    <p>
                      <strong>Calculation:</strong> For each next month, try to
                      use the same anchor day. If that day does not exist, fall
                      back to the last day of that month (month-end fallback).
                    </p>
                    <p>
                      <strong>Result:</strong> February uses{" "}
                      <strong>February 28, 2026</strong> (or Feb 29 in leap
                      years). March returns to <strong>March 31, 2026</strong>.
                      April uses <strong>April 30, 2026</strong>.
                    </p>
                    <p>
                      <strong>Meaning:</strong> You schedule transfers and
                      reminders on the fallback dates instead of assuming “31st
                      every month,” which prevents missed or late payments in
                      short months.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Rent per payment
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                CYCLE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Weekly to annual
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                WINDOW
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                As-of + horizon
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                OUTPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Dates + totals
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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  1) Rent per payment is multiplied by due dates in range
                </h3>

                <p className="mt-4">
                  The total is based on one thing: how many scheduled due dates
                  fall inside your window. The calculator counts the due dates
                  that land on or after your as-of date and before the end of
                  your horizon, then multiplies that count by your rent per
                  payment.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    How to use the total
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Treat it as the minimum cash you need earmarked for rent
                      over the selected horizon.
                    </li>
                    <li>
                      If you are comparing schedules (weekly vs 28-day vs
                      monthly), use totals over the same horizon to see which
                      creates a tighter month.
                    </li>
                    <li>
                      If the tool outputs more payments than you expected, your
                      mental “monthly” estimate was the risky assumption.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  2) Billing cycles define how the next due date is generated
                </h3>

                <p className="mt-4">
                  The cycle determines how each next due date is produced. Some
                  cycles move by a fixed number of days. Others move by calendar
                  units (month or year) and try to keep the same “anchor” day.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Fixed-day cycles
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Weekly</strong>: repeats every 7 days (weekday
                      stays consistent)
                    </li>
                    <li>
                      <strong>Biweekly</strong>: repeats every 14 days (weekday
                      stays consistent)
                    </li>
                    <li>
                      <strong>Every 28 days</strong>: repeats every 28 days (it
                      will drift across calendar months)
                    </li>
                  </ul>

                  <div className="mt-4 text-sm font-bold text-sky-800">
                    Calendar-based cycles
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Monthly</strong>: repeats by calendar month using
                      an anchor day when possible
                    </li>
                    <li>
                      <strong>Annual</strong>: repeats by calendar year using
                      the same month/day when possible
                    </li>
                  </ul>

                  <p className="mt-4 text-sm text-slate-600">
                    If you need “same day each month,” choose a calendar-based
                    cycle. If the lease is truly every X days, choose a
                    fixed-day cycle and expect calendar months to vary.
                  </p>
                </div>

                <p className="mt-4">
                  Monthly and annual cycles use a month-end fallback when the
                  anchor day does not exist in a given month (for example, the
                  31st). The schedule makes those fallback dates explicit so you
                  can plan transfers and reminders around the real due date, not
                  the idealized one.
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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  3) As-of date and horizon control what appears in the schedule
                </h3>

                <p className="mt-4">
                  The as-of date is the planning start. The horizon is how far
                  forward the schedule should run. Together, they define the
                  window the calculator uses to decide which due dates appear
                  and which are excluded.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    Common edge cases this avoids
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      If the as-of date falls between two due dates, the list
                      starts at the next due date (so you do not budget for a
                      payment that already passed).
                    </li>
                    <li>
                      If the as-of date matches a due date exactly, that payment
                      is included (so “due today” is not silently skipped).
                    </li>
                    <li>
                      “Months ahead” and “years ahead” are computed from the
                      as-of date, so the window reflects your planning start,
                      not the start of a calendar month.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  The calculator does not apply lease-specific rules like grace
                  periods, business-day shifts, late fees, or “paid in arrears.”
                  If your real-world process moves payments earlier or later,
                  use the schedule as the base truth, then adjust reminders and
                  transfers to match your lease terms.
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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight">
                  4) Monthly totals are calendar rollups, not conversions
                </h3>

                <p className="mt-4">
                  The monthly totals panel answers a budgeting question: “How
                  much rent lands inside each calendar month?” It groups the due
                  dates by calendar month, then multiplies the count in each
                  month by your rent per payment.
                </p>

                <p className="mt-4">
                  This is intentionally different from converting a weekly
                  amount into a monthly equivalent. The rollup keeps the real
                  payment dates intact so you can see the months where fixed-day
                  schedules stack extra payments into the same month.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-800">
                    What the rollup answers
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Which months are “heavier” because they contain more due
                      dates
                    </li>
                    <li>
                      What your rent outflow looks like on a calendar-month
                      budget
                    </li>
                    <li>
                      Whether a fixed-day cycle is realistic for your monthly
                      cash flow without a buffer
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
              <div className="text-sm font-bold text-sky-800">Useful for</div>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                <li>Building a forward schedule of exact rent due dates</li>
                <li>
                  Identifying calendar months that require extra cash under
                  fixed-day cycles
                </li>
                <li>
                  Budgeting totals over a defined window using the actual count
                  of payments, not a period conversion
                </li>
                <li>
                  Saving or printing a shareable schedule and month rollup for
                  planning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
