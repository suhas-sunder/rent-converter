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
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
            How this 4-week rent calculator works
          </h2>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="text-slate-700 leading-relaxed">
              <ul>
                <li className="mb-2 list-disc ml-5">
                  <Link
                    to="/rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Rent converter
                  </Link>
                  <p className="mt-1 text-slate-600">
                    Relevant when you already know the rent period and want the
                    full cross-period breakdown (daily, weekly, monthly, annual)
                    in one place.
                  </p>
                </li>

                <li className="mb-2 list-disc ml-5">
                  {" "}
                  <Link
                    to="/weekly-to-monthly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Weekly to monthly
                  </Link>
                  <p className="mt-1 text-slate-600">
                    Relevant when the listing is posted weekly and the decision
                    you need is a monthly budget match or a monthly listing
                    comparison.
                  </p>
                </li>

                <li className="mb-2 list-disc ml-5">
                  {" "}
                  <Link
                    to="/monthly-to-annual-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    Monthly to annual
                  </Link>
                  <p className="mt-1 text-slate-600">
                    Relevant when your constraint is yearly (salary planning,
                    stipend, housing allowance) and you need an annual number
                    that matches how you report income.
                  </p>
                </li>
              </ul>
            </p>
          </div>

          <div className="my-8 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="p-5 sm:px-6">
              <h3 className="text-2xl font-extrabold text-sky-900 tracking-tight">
                Examples
              </h3>
              <p className="mt-3 text-slate-600 leading-7">
                Each example forces a decision you can actually make after the
                conversion. The left side is the affordability comparison basis
                (365-day equivalence). The right side is cadence planning only
                (payment-count intuition), because those are different
                questions.
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

                      <div className="mt-3 space-y-3 text-slate-700">
                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Situation:
                          </span>{" "}
                          You are choosing between{" "}
                          <strong>$2,000 every 4 weeks</strong> and{" "}
                          <strong>$2,100 monthly</strong>. Your rule is “pick
                          the cheaper monthly cost,” because that is how your
                          budget is tracked.
                        </p>

                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-sky-900">Numbers:</p>
                          <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-700">
                            <li>
                              4-week payment: <strong>$2,000</strong> (28 days)
                            </li>
                            <li>
                              Monthly listing: <strong>$2,100</strong>
                            </li>
                          </ul>
                        </div>

                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-sky-900">
                            Calculation:
                          </p>
                          <ul className="mt-1 space-y-1 text-slate-700">
                            <li>
                              Daily = <strong>$71.428571</strong> (2000 ÷ 28)
                            </li>
                            <li>
                              Annual (equivalent) ={" "}
                              <strong>$26,071.428571</strong> (daily × 365)
                            </li>
                            <li>
                              Monthly (avg) = <strong>$2,172.619048</strong>{" "}
                              (annual ÷ 12)
                            </li>
                          </ul>
                        </div>

                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Result:
                          </span>{" "}
                          Monthly equivalent is <strong>$2,172.619048</strong>,
                          which is <strong>$72.619048</strong> higher than
                          $2,100.
                        </p>

                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Meaning:
                          </span>{" "}
                          The “$2,000” looks cheaper, but it fails your monthly
                          rule. You choose <strong>$2,100 monthly</strong>{" "}
                          unless there is some other compensating value
                          (location, inclusions) that justifies paying more.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Schedule shorthand (shown separately)
                      </div>

                      <div className="mt-3 space-y-3 text-slate-700">
                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Situation:
                          </span>{" "}
                          You already made the affordability call. Now you are
                          checking cash-flow timing so the rent pull does not
                          collide with other bill dates.
                        </p>

                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-sky-900">Numbers:</p>
                          <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-700">
                            <li>
                              4-week payment: <strong>$2,000</strong>
                            </li>
                            <li>
                              Payment count framing:{" "}
                              <strong>13 payments</strong> in a 52-week year
                            </li>
                          </ul>
                        </div>

                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-sky-900">
                            Calculation:
                          </p>
                          <ul className="mt-1 space-y-1 text-slate-700">
                            <li>
                              4-week × 13 = <strong>$26,000.00</strong>
                            </li>
                            <li>
                              Difference vs 365-day annual ={" "}
                              <strong>$71.428571</strong>
                            </li>
                          </ul>
                        </div>

                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Result:
                          </span>{" "}
                          The totals are close but not identical, because this
                          is a different basis than the 365-day equivalence.
                        </p>

                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Meaning:
                          </span>{" "}
                          This changes how you plan your buffer (you will see
                          rent hit 13 times), but it does not change which
                          listing is cheaper on a monthly basis.
                        </p>
                      </div>
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

                      <div className="mt-3 space-y-3 text-slate-700">
                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Situation:
                          </span>{" "}
                          Your hard rent cap is <strong>$1,600/month</strong>. A
                          listing is advertised as{" "}
                          <strong>$1,500 every 4 weeks</strong>. You need a
                          strict pass/fail against your cap before you spend
                          time applying.
                        </p>

                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-sky-900">Numbers:</p>
                          <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-700">
                            <li>
                              Monthly cap: <strong>$1,600</strong>
                            </li>
                            <li>
                              4-week payment: <strong>$1,500</strong> (28 days)
                            </li>
                          </ul>
                        </div>

                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-sky-900">
                            Calculation:
                          </p>
                          <ul className="mt-1 space-y-1 text-slate-700">
                            <li>
                              Daily = <strong>$53.571429</strong> (1500 ÷ 28)
                            </li>
                            <li>
                              Annual (equivalent) ={" "}
                              <strong>$19,553.571429</strong> (daily × 365)
                            </li>
                            <li>
                              Monthly (avg) = <strong>$1,629.464286</strong>{" "}
                              (annual ÷ 12)
                            </li>
                          </ul>
                        </div>

                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Result:
                          </span>{" "}
                          Monthly equivalent is <strong>$1,629.464286</strong>,
                          which is <strong>$29.464286</strong> above your cap.
                        </p>

                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Meaning:
                          </span>{" "}
                          If your cap is non-negotiable, it is a{" "}
                          <strong>reject</strong>. The action changes here: you
                          skip the application unless the landlord agrees to a
                          lower rent or you intentionally raise your cap.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Schedule shorthand (shown separately)
                      </div>

                      <div className="mt-3 space-y-3 text-slate-700">
                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Situation:
                          </span>{" "}
                          Even if you do not proceed with this listing, you are
                          calibrating your cash-flow plan: “What does a 4-week
                          rent schedule feel like across a year?”
                        </p>

                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-sky-900">Numbers:</p>
                          <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-700">
                            <li>
                              4-week payment: <strong>$1,500</strong>
                            </li>
                            <li>
                              Payment count framing:{" "}
                              <strong>13 payments</strong> in a 52-week year
                            </li>
                          </ul>
                        </div>

                        <div className="text-sm text-slate-700">
                          <p className="font-semibold text-sky-900">
                            Calculation:
                          </p>
                          <ul className="mt-1 space-y-1 text-slate-700">
                            <li>
                              4-week × 13 = <strong>$19,500.00</strong>
                            </li>
                            <li>
                              Difference vs 365-day annual ={" "}
                              <strong>$53.571429</strong>
                            </li>
                          </ul>
                        </div>

                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Result:
                          </span>{" "}
                          This is a payment-count view, not a monthly
                          affordability view, and it should be read as cadence
                          planning.
                        </p>

                        <p className="text-sm text-slate-700 leading-6">
                          <span className="font-semibold text-sky-900">
                            Meaning:
                          </span>{" "}
                          The decision this supports is buffer sizing and timing
                          (how many pulls to expect). It does not turn a failed
                          monthly cap into a pass.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What to take from the examples
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Use <strong>monthly (avg)</strong> when your next action
                      is a monthly decision: budget caps, comparing to a monthly
                      listing, or choosing between apartments.
                    </li>
                    <li>
                      Keep <strong>×13</strong> for cadence decisions only:
                      cash-flow timing, buffer planning, and pay-cycle
                      alignment.
                    </li>
                    <li>
                      When you are close to a threshold, read the unrounded
                      monthly equivalent first, then round for presentation.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

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
                  “Every 4 weeks” is <strong>every 28 days</strong>. That is a
                  different unit than a calendar month. Because most months are
                  longer than 28 days, the due date will drift earlier over time
                  if it is anchored to “every 28 days,” not “the 1st of the
                  month.”
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    Why that matters for real decisions
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Listing comparisons break unless you convert. A 4-week
                      price can look lower but still be{" "}
                      <strong>higher per month</strong> once you put both on the
                      same basis.
                    </li>
                    <li>
                      Budget caps are usually monthly. The number that matches
                      that decision is an{" "}
                      <strong>average-month equivalent</strong>, not a “close
                      enough” assumption.
                    </li>
                    <li>
                      The 28-day cadence impacts cash flow. If you are paid
                      monthly or biweekly, the drift can change which weeks feel
                      tight.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  Use this section to keep your units straight: 4-week rent is a
                  28-day product, and the monthly equivalent is what makes it
                  comparable to monthly pricing and monthly caps.
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
                  The calculator first turns your 4-week payment into a single{" "}
                  <strong>annual equivalent</strong> on a 365-day year.
                  Everything else (monthly average, weekly, daily, hourly) is
                  derived from that same annual total so you are not mixing
                  bases across the breakdown.
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
                  The decision mapping is straightforward: use{" "}
                  <strong>monthly (avg)</strong> when you are evaluating a
                  monthly cap or comparing to a monthly listing. Use{" "}
                  <strong>annual</strong> when you are checking a yearly limit
                  (an allowance, stipend, or income planning).
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
                  “4-week × 13” is a common mental shortcut because 52 ÷ 4 = 13.
                  It is good for understanding how many payments you will face,
                  but it is not the same as the 365-day equivalence model used
                  for the core conversion.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    How to use each number
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Use the <strong>365-day equivalents</strong> when the
                      decision is “which rent is cheaper on my budget basis?”
                    </li>
                    <li>
                      Use <strong>×13</strong> when the decision is “how many
                      rent pulls will I need to plan for?”
                    </li>
                    <li>
                      Treat them as separate. Mixing them is how people
                      rationalize a “cheaper” listing that is not cheaper on the
                      basis they actually pay attention to.
                    </li>
                  </ul>
                </div>

                <p className="mt-4">
                  If you remember one rule: the conversion is for comparability
                  and caps; the ×13 line is for cadence and buffer planning.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
              <div className="text-sm font-bold text-sky-900">
                What you can do here
              </div>
              <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
                <li>
                  Convert a 28-day rent amount into a monthly (average) number
                  you can compare against a monthly listing or a monthly budget
                  cap
                </li>
                <li>
                  Produce a consistent annual equivalent you can compare to
                  annual constraints (allowances, stipends, income planning)
                </li>
                <li>
                  Separate affordability from cadence by showing 365-day
                  equivalence and the 4-week × 13 shorthand as different
                  decision tools
                </li>
                <li>
                  Use the same converted basis to compare listings that are
                  written in different periods without mental-math shortcuts
                </li>
              </ul>
              <p className="mt-4 text-slate-600">
                Practical rule: for accept/reject decisions and listing
                comparisons, anchor on <strong>monthly (avg)</strong>. For
                cash-flow timing and buffer planning, read the{" "}
                <strong>×13</strong> shorthand separately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
