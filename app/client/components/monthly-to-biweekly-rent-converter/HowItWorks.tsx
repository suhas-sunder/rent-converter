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
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl max-w-6xlfont-extrabold text-sky-800 tracking-tight leading-tight">
                  How the monthly to biweekly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Use this page when a listing is priced monthly but your
                  decisions happen on a 14-day rhythm: paychecks, budgeting, or
                  comparing to biweekly and 4-week listings. The tool converts
                  your monthly figure into a time-equivalent biweekly amount,
                  anchored to a 365-day year so every period shown is
                  mathematically consistent.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Monthly = avg month
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Biweekly = 14 days
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly rent
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  To annual
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CONVERT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  14-day basis
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Full breakdown
                </div>
              </div>
            </div>
          </div>

          {/* SectionCard: related tools (required) */}
          <div className="group my-8 relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                Related tools
              </h3>

              <div className="mt-4 space-y-3">
                <p className="text-slate-700 leading-7">
                  Each tool below solves a different comparison problem, based
                  on how the rent is quoted or how you prefer to sanity-check
                  totals.
                </p>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <Link
                        to="/rent-converter"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Universal rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Best when you have mixed listing formats and want one
                        consistent breakdown (weekly, biweekly, 4-week, annual,
                        daily, hourly) for every option.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/biweekly-to-monthly-rent-converter"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Biweekly to monthly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when the listing is already biweekly and you
                        need the monthly equivalent that fits a monthly budget
                        cap.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/monthly-to-annual-rent-converter"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Monthly to annual rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when your decision is “total cost over a year,”
                        such as comparing leases, incentives, or renewal offers.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/monthly-to-weekly-rent-converter"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Monthly to weekly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when a comparable unit is advertised weekly and
                        you want a like-for-like weekly number.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/weekly-to-monthly-rent-converter"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Weekly to monthly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when your rent limit is monthly but the listing
                        is weekly, so you can quickly screen out over-budget
                        options.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-per-paycheck-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent per paycheck calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when rent needs to fit alongside other bills in
                        a paycheck plan, not just in a monthly budget.
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="text-slate-700 leading-7">
                  Need more directions?{" "}
                  <Link
                    to="/monthly-to-weekly-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    monthly to weekly →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/monthly-to-annual-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    monthly to annual →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/biweekly-to-annual-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    biweekly to annual →
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* SectionCard: examples (required, own section) */}
          <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                Examples
              </h3>

              <div className="mt-4 space-y-3">
                <p className="text-slate-700 leading-7">
                  Each example ends with a concrete choice that changes once the
                  monthly price is translated into a true 14-day amount.
                </p>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-3">
                    <li className="space-y-2">
                      <div>
                        <span className="font-semibold text-slate-900">
                          Budget cap (accept vs reject)
                        </span>
                      </div>
                      <p className="text-slate-700 leading-7">
                        <strong>Situation:</strong> You can set aside at most{" "}
                        <strong>$1,100</strong> per paycheck for rent.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Numbers:</strong> Listing is{" "}
                        <strong>$2,300/month</strong>; you are paid biweekly.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Calculation:</strong> Annual = 2,300 × 12 ={" "}
                        27,600. Daily = 27,600 ÷ 365 ≈ 75.62. Biweekly = 75.62 ×
                        14 ≈ <strong>$1,058.68</strong>.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Result:</strong> About{" "}
                        <strong>$1,058.68</strong> per paycheck.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Meaning:</strong> It fits under{" "}
                        <strong>$1,100</strong>, so the listing stays in your
                        shortlist instead of being rejected.
                      </p>
                    </li>

                    <li className="space-y-2">
                      <div>
                        <span className="font-semibold text-slate-900">
                          “Looks cheaper” but isn’t after conversion
                        </span>
                      </div>
                      <p className="text-slate-700 leading-7">
                        <strong>Situation:</strong> Two similar units are priced
                        differently, and you need the real per-paycheck impact.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Numbers:</strong> Option A is{" "}
                        <strong>$2,150/month</strong>. Option B is{" "}
                        <strong>$1,050/biweekly</strong>.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Calculation:</strong> Convert Option A to
                        biweekly: Annual = 2,150 × 12 = 25,800. Daily = 25,800 ÷
                        365 ≈ 70.68. Biweekly = 70.68 × 14 ≈{" "}
                        <strong>$989.56</strong>.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Result:</strong> A is about{" "}
                        <strong>$989.56</strong> per 14 days versus B at{" "}
                        <strong>$1,050</strong>.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Meaning:</strong> Option A is cheaper per
                        paycheck, even though B can look attractive at first
                        glance. If you are optimizing cashflow between paydays,
                        A is the better pick.
                      </p>
                    </li>

                    <li className="space-y-2">
                      <div>
                        <span className="font-semibold text-slate-900">
                          “Twice monthly” trap (avoid a bad comparison)
                        </span>
                      </div>
                      <p className="text-slate-700 leading-7">
                        <strong>Situation:</strong> A landlord offers “pay
                        half-monthly” and you want to compare it to a true
                        biweekly budget.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Numbers:</strong> Rent is{" "}
                        <strong>$2,400/month</strong>. Landlord proposes{" "}
                        <strong>$1,200 twice monthly</strong>. You budget by
                        biweekly paychecks.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Calculation:</strong> True biweekly equivalent
                        from monthly: Annual = 2,400 × 12 = 28,800. Daily =
                        28,800 ÷ 365 ≈ 78.90. Biweekly = 78.90 × 14 ≈{" "}
                        <strong>$1,104.66</strong>.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Result:</strong> Time-equivalent biweekly is{" "}
                        <strong>$1,104.66</strong>, not <strong>$1,200</strong>.
                      </p>
                      <p className="text-slate-700 leading-7">
                        <strong>Meaning:</strong> If you mistakenly treat “twice
                        monthly” as “biweekly,” you would over-allocate cash per
                        paycheck. The correct move is to fund rent at about{" "}
                        <strong>$1,104.66</strong> per paycheck and keep the
                        difference for other bills or savings.
                      </p>
                    </li>
                  </ul>
                </div>

                <p className="text-slate-700 leading-7">
                  If your listing is priced every 4 weeks, you may want{" "}
                  <Link
                    to="/monthly-to-weekly-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    monthly to weekly rent converter →
                  </Link>{" "}
                  alongside{" "}
                  <Link
                    to="/weekly-to-biweekly-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    weekly to biweekly rent converter →
                  </Link>{" "}
                  to line up the pricing in the same cycle.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: step 1 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 1: Enter the monthly amount from the listing
                </h3>

                <div className="mt-4 space-y-3">
                  <p className="text-slate-700 leading-7">
                    Enter the monthly rent exactly as advertised, including
                    cents if they are shown. This matters when you are comparing
                    two close options or trying to stay under a strict
                    per-paycheck limit.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Parsing behavior
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>1,234</strong> is treated as 1234
                      </li>
                      <li>
                        <strong>1.234</strong> is treated as 1.234
                      </li>
                      <li>
                        Formats like <strong>.5</strong> and{" "}
                        <strong>12.</strong> are valid
                      </li>
                      <li>
                        If an entry could be interpreted more than one way, the
                        calculator blocks the result instead of guessing.
                      </li>
                    </ul>
                  </div>

                  <p className="text-slate-700 leading-7">
                    This conversion only translates time periods. It does not
                    estimate add-ons like utilities, parking, mandatory fees, or
                    deposits. If those costs are material to your decision,
                    compare them separately after you have a clean rent
                    equivalent.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: step 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Step 2: Convert monthly to biweekly using one time model
                </h3>

                <div className="mt-4 space-y-3">
                  <p className="text-slate-700 leading-7">
                    The math is intentionally chained through a single time
                    basis so the biweekly output matches the rest of the period
                    breakdown. Practically, you use the biweekly number to plan
                    what must leave your account every paycheck.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Annual</strong> = monthly × 12
                      </li>
                      <li>
                        <strong>Daily</strong> = annual ÷ 365
                      </li>
                      <li>
                        <strong>Biweekly</strong> = daily × 14
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Biweekly here always means a fixed 14-day period, not
                      “twice per month.”
                    </p>
                  </div>

                  <p className="text-slate-700 leading-7">
                    Use the biweekly output when you are screening listings
                    against a paycheck-based limit, or when you need to make a
                    monthly listing comparable to a unit advertised biweekly or
                    every 4 weeks.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown consistency */}
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
                  <p className="text-slate-700 leading-7">
                    The breakdown is designed for comparisons. It starts with a
                    single annual total implied by your monthly input, then
                    derives every other line from that same annual basis using
                    fixed time lengths. That avoids “rounding drift,” where one
                    rounded result is used to compute the next.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      What each line is for
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Weekly</strong> helps compare to weekly
                        advertising without rethinking the whole budget.
                      </li>
                      <li>
                        <strong>Biweekly</strong> aligns with paycheck planning
                        and “can I afford this between paydays?”
                      </li>
                      <li>
                        <strong>4-week</strong> lines up with “every 28 days”
                        listings, which often feel like monthly but aren’t.
                      </li>
                      <li>
                        <strong>Hourly</strong> is a sanity check for short-stay
                        framing or “what does this cost per day/hour?”
                      </li>
                    </ul>
                  </div>

                  <p className="text-slate-700 leading-7">
                    When you are choosing between two rentals, anchor on the{" "}
                    <strong>annual</strong> total for fairness, then use the
                    other periods only as different views of the same implied
                    cost.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: equivalence vs schedules */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Equivalence vs payment schedules
                </h3>

                <div className="mt-4 space-y-3">
                  <p className="text-slate-700 leading-7">
                    This page outputs a <strong>time-equivalent</strong>{" "}
                    biweekly number. That is different from how a landlord
                    actually invoices rent. The distinction prevents a common
                    mistake: treating “twice monthly” and “every 14 days” as the
                    same thing.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Equivalence
                      </div>
                      <p className="mt-2 text-slate-700 leading-7">
                        A comparable biweekly figure derived from days and the
                        annual total implied by your monthly input.
                      </p>
                      <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700 leading-7">
                        <li>
                          Best for “which option costs less?” comparisons.
                        </li>
                        <li>
                          Best for paycheck planning when the listing is
                          monthly.
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Schedules (context)
                      </div>
                      <p className="mt-2 text-slate-700 leading-7">
                        A billing pattern is a contract detail. A “biweekly
                        billing” schedule could imply a different number of
                        payments than a monthly lease.
                      </p>
                      <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700 leading-7">
                        <li>
                          Useful when reviewing payment terms before signing.
                        </li>
                        <li>
                          Not a substitute for reading the lease schedule.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-7">
                    If you are converting a rent amount that is already labeled
                    biweekly, use{" "}
                    <Link
                      to="/biweekly-to-monthly-rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      biweekly to monthly rent converter →
                    </Link>{" "}
                    to go the other direction.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: printing */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Printing and saved copies
                </h3>

                <div className="mt-4 space-y-3">
                  <p className="text-slate-700 leading-7">
                    Print the results when you need a stable reference for
                    roommate discussions, lease negotiations, or side-by-side
                    comparisons with other units. Use your browser’s print
                    dialog to print or save as a PDF. This explanation section
                    is excluded from print layouts.
                  </p>
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
