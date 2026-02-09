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
            How this rent split calculator works and what to expect
          </h2>

          <p className="text-slate-600 leading-7">
            This calculator splits rent across the number of people you enter.
            The headline output is a per-person amount in the same period you
            selected for the rent input (monthly stays monthly, weekly stays
            weekly, and so on). Under the hood, the page also computes an annual
            equivalent on a consistent 365-day basis so it can show a clean
            period-by-period breakdown without mixing assumptions. That
            breakdown is there for comparison and consistency, not to change how
            you actually pay rent.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                INPUT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Rent + rent period
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                SPLIT
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                People count
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                NORMALIZE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Annual basis
              </div>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                COMPARE
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Period breakdown
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
                  1) The split is calculated in your selected rent period
                </h3>

                <p className="mt-4">
                  The primary per-person value is the equal split in the same
                  period as your rent input. If you enter rent as “monthly,” the
                  per-person headline is a monthly number. If you enter rent as
                  “every 4 weeks,” the per-person headline is a 28-day number.
                  This keeps the main output aligned with how the rent is
                  actually written or discussed in the listing or lease.
                </p>

                <p className="mt-4">
                  If your household uses an uneven split, treat the equal split
                  as a baseline. You can still use the per-person breakdown as a
                  shared reference point, then adjust outside the tool (for
                  example, one person pays more for a larger room or a parking
                  spot). This calculator intentionally does not guess your
                  weighting rules.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What the headline per-person value is
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      An equal split across the number of people you entered
                    </li>
                    <li>In the same period as the rent input</li>
                    <li>
                      A budgeting and agreement reference, not a due-date
                      schedule
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
                <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                  2) Why the page converts through an annual basis
                </h3>

                <p className="mt-4">
                  After computing the split, the page converts the rent to an
                  annual equivalent on a 365-day basis. That annual number acts
                  as the source of truth for all other period views. The benefit
                  is that you can compare weekly, biweekly, 28-day, monthly
                  (average), daily, and hourly equivalents without switching
                  definitions between outputs.
                </p>

                <p className="mt-4">
                  This is where the “monthly vs every 4 weeks” mismatch becomes
                  visible. A 4-week period is exactly 28 days. A month is longer
                  on average. If you convert monthly rent by assuming a fixed 30
                  days, you silently change the implied annual total. This page
                  avoids that by treating a month as an average month length
                  (365 ÷ 12 days) and using a 365-day year as the consistent
                  anchor.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Assumptions used for equivalence
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>Year = 365 days</li>
                    <li>Average month = 365 ÷ 12 days</li>
                    <li>Week = 7 days</li>
                    <li>Biweekly = 14 days</li>
                    <li>Every 4 weeks = 28 days</li>
                    <li>Hourly conversions assume 24 hours/day</li>
                  </ul>
                </div>
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
                  3) How to use the breakdown without over-interpreting it
                </h3>

                <p className="mt-4">
                  The breakdown is best used for comparisons, sanity checks, and
                  agreement clarity. It helps answer questions like “If one
                  listing is weekly and the other is monthly, what does each
                  imply on the same basis?” or “If our rent is every 4 weeks,
                  what does that look like as an average monthly amount?” It is
                  not telling you how many payments you will make in a calendar
                  year, and it is not a lease proration engine.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Good uses
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Compare listings that quote different billing cycles
                    </li>
                    <li>
                      Agree on an equal-split baseline, then adjust externally
                      if needed
                    </li>
                    <li>
                      Check whether a “4-week” amount is effectively higher than
                      a similar “monthly” amount
                    </li>
                    <li>
                      Translate one rent amount into a period that fits
                      someone’s budgeting style
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you need a schedule of actual due dates and calendar-month
                  totals, use a due-date schedule tool. This page stays strictly
                  in equivalence math and per-person splitting.
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
                  4) Decimals, rounding, and input handling
                </h3>

                <p className="mt-4">
                  Splits often produce decimals, especially with three or more
                  roommates. This page should preserve decimals internally (up
                  to 12) so a per-person split stays accurate across the
                  breakdown. If rounding is available, it should be display-only
                  so it formats outputs without changing the annual basis the
                  breakdown is derived from.
                </p>

                <p className="mt-4">
                  If an input is invalid or ambiguous, the page should avoid
                  producing a confident-looking per-person number. A split
                  calculator is only useful if it does not silently turn bad
                  inputs into misleading results.
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
                  This tool splits rent and shows equivalents. It does not
                  decide your household rules.
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The calculator does not add or remove fees, utilities, taxes,
                  deposits, or one-time charges. It also does not model due
                  dates, proration rules, or “who pays when.” Use the equal
                  split as a reference point, then handle uneven arrangements
                  separately.
                </p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Related tool:{" "}
              <Link
                to="/rent-converter"
                className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
              >
                rent converter
              </Link>
              .
            </p>

            <div className="mt-10">
              <h3 className="text-2xl font-extrabold mb-4 text-sky-900 tracking-tight">
                Links to related tools
              </h3>

              <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm p-5 sm:px-6">
                <ul className="list-disc ml-6 text-slate-700 space-y-2">
                  <li>
                    <Link
                      to="/rent-per-paycheck-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent per paycheck
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/rent-paid-every-4-weeks-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent paid every 4 weeks
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/rent-per-week-calculator"
                      className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      Rent per week
                    </Link>
                  </li>
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
