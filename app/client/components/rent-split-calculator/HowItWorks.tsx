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
            How this rent split calculator works
          </h2>

          <p className="text-slate-600 leading-7">
            Use this page to answer one question:{" "}
            <strong className="font-semibold text-slate-800">
              what does each person owe for this rent amount
            </strong>{" "}
            in the same billing period the listing or lease uses (monthly stays
            monthly, weekly stays weekly, every 4 weeks stays 28-day).
          </p>
          <p className="mt-4 text-slate-600 leading-7">
            The extra period breakdown is a comparison view. It converts through
            a single 365-day annual basis so weekly, 28-day, monthly average,
            and daily equivalents all reconcile to the same implied annual
            total. It is not a payment schedule.
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

          <div className="rounded-3xl my-8 bg-white ring-1 ring-slate-200/80 shadow-sm p-5 sm:px-6">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>
            <ul className="list-disc ml-6 text-slate-700 space-y-2">
              <li>
                <Link
                  to="/rent-per-paycheck-calculator"
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  Rent per paycheck
                </Link>
                <span className="text-slate-600">
                  {" "}
                  Useful when your budget is paycheck-based and you want a clean
                  rent-per-pay number to sanity check affordability.
                </span>
              </li>
              <li>
                <Link
                  to="/rent-paid-every-4-weeks-calculator"
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  Rent paid every 4 weeks
                </Link>
                <span className="text-slate-600">
                  {" "}
                  Relevant when a listing is billed on a 28-day cycle and you
                  need a fair comparison against monthly figures.
                </span>
              </li>
              <li>
                <Link
                  to="/rent-per-week-calculator"
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  Rent per week
                </Link>
                <span className="text-slate-600">
                  {" "}
                  Best for weekly-priced listings where you want the implied
                  annual and monthly averages without guessing month length.
                </span>
              </li>
              <li>
                <Link
                  to="/rent-per-day-calculator"
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  Rent per day
                </Link>
                <span className="text-slate-600">
                  {" "}
                  Helps when you need a day-level baseline for short stays,
                  proration checks, or comparing options with different billing
                  cycles.
                </span>
              </li>
            </ul>
          </div>

          {/* Examples section (separate) */}
          <div className="my-8 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="p-5 sm:p-6">
              <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                Examples
              </h3>
              <p className="mt-3 text-slate-600 leading-7">
                These are decision-style examples. Each one ends with a specific
                action that changes (accept, reject, negotiate, or compare
                fairly) based on the output.
              </p>

              <div className="mt-6 grid gap-4 sm:gap-5">
                {/* Example 1: Monthly */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 1: Monthly lease, deciding if you need a third
                    roommate
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> A $2,400/month place is on the
                      table. Two people want it, but each has an $850/month rent
                      cap.
                    </li>
                    <li>
                      <strong>Numbers:</strong> Rent = $2,400 monthly, People =
                      3 (considering adding one roommate), Cap = $850 per person
                      per month.
                    </li>
                    <li>
                      <strong>Calculation:</strong> Per-person (monthly) ={" "}
                      <strong>$800.00</strong> (2400 ÷ 3). Annual total ={" "}
                      <strong>$28,800.00</strong> (2400 × 12). Per-person weekly
                      (derived) = <strong>$184.109589</strong> (9,600 × 7 ÷
                      365).
                    </li>
                    <li>
                      <strong>Result:</strong> $800/month per person (and
                      $184.11/week as a comparison view).
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> With three people, the split
                      stays under the $850 cap, so the group can proceed. If you
                      stayed at two people, it would be $1,200/month each and
                      the decision flips to "find a third roommate or pick a
                      cheaper place."
                    </li>
                  </ul>
                </div>

                {/* Example 2: Every 4 weeks */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 2: "Every 4 weeks" looks cheaper, but the monthly
                    average is higher
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> Two listings are competing.
                      One advertises "$2,000 every 4 weeks" and the other is
                      "$2,100 monthly." You want a fair apples-to-apples
                      comparison for a four-person split.
                    </li>
                    <li>
                      <strong>Numbers:</strong> Option A = $2,000 per 28 days,
                      Option B = $2,100 per month, People = 4.
                    </li>
                    <li>
                      <strong>Calculation:</strong> Option A per-person (28-day)
                      = <strong>$500.00</strong> (2000 ÷ 4). Option A daily
                      total = <strong>$71.428571</strong> (2000 ÷ 28). Option A
                      annual total = <strong>$26,071.428571</strong> (daily ×
                      365). Option A per-person monthly (avg, derived) ={" "}
                      <strong>$543.154762</strong> (26,071.428571 ÷ 12 ÷ 4).
                      Option B per-person (monthly) = <strong>$525.00</strong>{" "}
                      (2100 ÷ 4).
                    </li>
                    <li>
                      <strong>Result:</strong> Option A is $500 per 28 days, but
                      averages about $543.15 per month per person. Option B is
                      $525 per month per person.
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> Even though "$2,000 every 4
                      weeks" feels cheaper at payment time, the implied monthly
                      average per person is higher than the $2,100/month option.
                      If your budget is monthly, the decision changes to favor
                      the monthly listing (or to negotiate the 28-day price
                      down).
                    </li>
                  </ul>
                </div>

                {/* Example 3: Weekly with decimals */}
                <div className="rounded-3xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Example 3: Weekly rent passes weekly budget, fails monthly
                    budget
                  </div>
                  <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <strong>Situation:</strong> A $975/week rental is proposed
                      for two people. Weekly feels manageable, but you budget
                      rent monthly and need to stay under $2,000/month each.
                    </li>
                    <li>
                      <strong>Numbers:</strong> Rent = $975 weekly, People = 2,
                      Monthly cap = $2,000 per person.
                    </li>
                    <li>
                      <strong>Calculation:</strong> Per-person (weekly) ={" "}
                      <strong>$487.50</strong> (975 ÷ 2). Annual total ={" "}
                      <strong>$50,803.571429</strong> (975 × 365 ÷ 7).
                      Per-person monthly (avg, derived) ={" "}
                      <strong>$2,116.815476</strong> (25,401.785714 ÷ 12).
                    </li>
                    <li>
                      <strong>Result:</strong> $487.50/week each, but about
                      $2,116.82/month each on a consistent annual basis.
                    </li>
                    <li className="text-slate-600">
                      <strong>Meaning:</strong> If you only looked at the weekly
                      number, you might accept. Converting to a monthly average
                      crosses the $2,000 cap, so the decision changes to
                      "reject, negotiate, or add a roommate" based on your
                      monthly budget.
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What these examples are doing
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      They use a consistent structure:{" "}
                      <strong>
                        Situation → Numbers → Calculation → Result → Meaning
                      </strong>
                      , so the conclusion is a decision, not a math recap.
                    </li>
                    <li>
                      The headline split stays in the listing period, while
                      comparisons come from{" "}
                      <strong>a single 365-day annual anchor</strong>.
                    </li>
                    <li>
                      Decimals are preserved so derived equivalents reconcile
                      cleanly when you compare periods or add splits back up.
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
                  1) The split is calculated in your selected rent period
                </h3>

                <p className="mt-4">
                  The main output is the equal per-person split in the same
                  period as your input. That keeps the number aligned with the
                  way rent is quoted in a listing or written in a lease.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What to do with the headline per-person number
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Use it as the baseline for agreement:{" "}
                      <strong>
                        each person owes this amount per billing period
                      </strong>
                      .
                    </li>
                    <li>
                      Check it against each person’s rent cap (weekly cap for
                      weekly leases, monthly cap for monthly leases).
                    </li>
                    <li>
                      If you plan an uneven split, treat this as the neutral
                      reference point, then adjust the difference separately.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If your household uses an uneven split, keep the decision
                  logic simple: agree on the equal baseline first, then apply
                  your own rule (bigger room, parking, ensuite) outside the
                  calculator. This page intentionally avoids inventing weights.
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
                  2) Why the page converts through an annual basis
                </h3>

                <p className="mt-4">
                  Comparisons break down when each period uses a different
                  hidden assumption. This calculator normalizes to one implied
                  annual total (365-day year), then derives every other period
                  view from that same anchor.
                </p>

                <p className="mt-4">
                  That matters most for “monthly vs every 4 weeks.” A 4-week
                  cycle is always 28 days. A month is longer on average.
                  Converting monthly rent with a fixed 30-day guess changes the
                  annual total and can flip a comparison.
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
                  Treat the breakdown as a comparison lens, not a promise about
                  due dates. Its job is to make two rents comparable when they
                  are quoted in different cycles.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Comparisons this breakdown is built for
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Weekly listing vs monthly listing: compare the implied
                      annual totals on one basis.
                    </li>
                    <li>
                      Every-4-weeks vs monthly: see whether the 28-day price is
                      effectively higher over a year.
                    </li>
                    <li>
                      Budget translation: convert the same rent into the period
                      your budget uses, without changing the implied annual
                      cost.
                    </li>
                    <li>
                      Roommate planning: test different people counts and see
                      which splits cross an affordability threshold.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you need actual due dates, calendar-month totals, or
                  proration rules, this is the wrong tool. Those are schedule
                  problems, not equivalence problems.
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
                  It does not add fees, utilities, deposits, or one-time
                  charges. It does not model payment timing, due dates, or
                  proration. Use it to get an equal-split baseline and a
                  consistent comparison view, then apply your real-world
                  arrangement separately.
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
