import { Link } from "react-router";

interface RelatedLink {
  href: string;
  text: string;
}

const HowItWorks = ({
  relatedLinks,
  safeHref,
}: {
  relatedLinks: RelatedLink[];
  safeHref: (href: string) => string;
}) => {
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
            How this rent due date calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            This tool generates a schedule of upcoming rent due dates and totals
            the amount paid over a defined horizon. You enter a rent amount per
            payment, pick a billing cycle, choose an as-of date, and set how far
            ahead to project. The output includes a due-date list and
            calendar-month rollups so it is clear when fixed-day cycles create
            months with extra payments.
          </p>

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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  1) Rent per payment is multiplied by due dates in range
                </h3>
                <p className="mt-4">
                  You enter the amount owed each time rent is due. The tool does
                  not “convert” this into a different period. Instead, it
                  generates the due dates that fall inside your selected window
                  and multiplies the count of those dates by your rent per
                  payment.
                </p>
                <p className="mt-4">
                  If your horizon contains 5 due dates and your rent per payment
                  is $2,000, the total paid over that horizon is $10,000. The
                  calendar month totals use the same idea: count due dates that
                  land within each calendar month, then multiply by rent per
                  payment.
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
                  2) Billing cycles define how the next due date is generated
                </h3>

                <p className="mt-4">
                  Cycles fall into two groups: fixed-day intervals and
                  calendar-based intervals. Fixed-day cycles repeat by adding a
                  constant number of days each time. Calendar-based cycles
                  repeat by moving across calendar months or years while
                  preserving an anchor day where possible.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Fixed-day cycles
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Weekly</strong>: repeats every 7 days
                    </li>
                    <li>
                      <strong>Biweekly</strong>: repeats every 14 days
                    </li>
                    <li>
                      <strong>Every 28 days</strong>: repeats every 28 days
                    </li>
                  </ul>

                  <div className="mt-4 text-sm font-bold text-sky-900">
                    Calendar-based cycles
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Monthly</strong>: repeats by calendar month
                    </li>
                    <li>
                      <strong>Annual</strong>: repeats by calendar year
                    </li>
                  </ul>

                  <p className="mt-4 text-sm text-slate-600">
                    Fixed-day cycles drift across weekdays and month boundaries
                    naturally. Calendar cycles stay attached to the calendar and
                    are sensitive to month length.
                  </p>
                </div>

                <p className="mt-4">
                  Monthly uses a month-end fallback when the anchor day does not
                  exist in a given month. Example: an anchor of the 31st falls
                  back to the last day of shorter months. Annual repeats on the
                  same month/day, with similar fallback behavior when the anchor
                  day does not exist.
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
                  3) As-of date and horizon control what appears in the schedule
                </h3>

                <p className="mt-4">
                  The schedule lists due dates that fall on or after the as-of
                  date, continuing until the end of the horizon window. If you
                  choose a “years ahead” option, the end date is computed from
                  the as-of date plus the selected number of years.
                </p>

                <p className="mt-4">
                  The as-of date is treated as the point where you want the
                  schedule to begin. The tool does not assume anything about
                  arrears, grace days, late fees, or “paid on the previous
                  business day.” It simply lists the computed due dates under
                  the selected cycle.
                </p>

                <p className="mt-4">
                  If the as-of date lands between two due dates, the schedule
                  starts from the next computed due date. If the as-of date
                  exactly matches a computed due date, that due date is
                  included.
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
                  4) Monthly totals are calendar rollups, not conversions
                </h3>

                <p className="mt-4">
                  The monthly totals panel is a calendar-based rollup. It counts
                  how many due dates land inside each calendar month, then
                  multiplies by your rent per payment. It is not the same as
                  converting a weekly amount into a monthly equivalent.
                </p>

                <p className="mt-4">
                  This distinction is the point of the tool. Under fixed-day
                  cycles (weekly, biweekly, 28-day), the number of due dates
                  that land in a calendar month can vary. That’s how you end up
                  with months that contain more payments than expected if you
                  mentally treat the cycle as “monthly-ish.”
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What the rollup answers
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>How many due dates land in each calendar month</li>
                    <li>What that implies for total paid in that month</li>
                    <li>
                      How totals vary when the cycle is a fixed-day interval
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  5) Rounding is display-only
                </h3>

                <p className="mt-4">
                  Internally, decimals are preserved (up to 12 places). If
                  rounding is enabled, only the displayed values are rounded.
                  This keeps the schedule totals stable and avoids compounding
                  rounding effects when multiple due dates are added.
                </p>

                <p className="mt-4">
                  Printing uses your browser’s print dialog and supports
                  save-as-PDF. The print layout is intended to keep the date
                  list and month totals readable.
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
                  Utility note
                </div>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  Fixed-day cycles can create uneven calendar months
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Weekly, biweekly, and 28-day schedules repeat by adding days.
                  Calendar months don’t have a fixed length. The schedule view
                  and month rollups are designed to make that mismatch visible
                  without converting your rent into a different pricing period.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
              <div className="text-sm font-bold text-sky-900">Useful for</div>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  Listing future due dates for a chosen cycle within a horizon
                </li>
                <li>
                  Seeing why some calendar months contain more payments under
                  fixed-day intervals
                </li>
                <li>
                  Estimating total paid over a date range using rent per payment
                </li>
                <li>
                  Printing or saving a PDF copy of the schedule and rollups
                </li>
              </ul>
            </div>

            <div className="mt-10 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div className="p-5 sm:px-6">
                <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                  Related pages
                </h3>
                <ul className="mt-3 list-disc ml-6 text-slate-700 space-y-2">
                  {relatedLinks.map((l: RelatedLink) => (
                    <li key={l.href}>
                      <Link
                        to={safeHref(l.href)}
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        {l.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
