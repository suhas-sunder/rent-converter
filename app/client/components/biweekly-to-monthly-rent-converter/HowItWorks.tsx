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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                  How the biweekly to monthly rent converter works
                </h2>
                <div className="mt-2 text-slate-600 leading-7 max-w-2xl space-y-3">
                  <p>
                    Use this conversion when you are comparing rent options that
                    are quoted in different periods, especially when your budget
                    is set monthly. The output is a monthly equivalent based on
                    time length, not on “two payments per month.”
                  </p>
                  <p>
                    This page treats{" "}
                    <strong className="text-slate-900">biweekly</strong> as a
                    fixed 14-day amount, converts it to a daily rate, scales to
                    a 365-day annual total, and then divides by 12 to produce an
                    average monthly equivalent. That makes two listings
                    comparable even when the payment schedule differs.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 14 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Monthly = annual ÷ 12
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Biweekly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Daily = ÷ 14
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SCALE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual = × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  FINAL
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly = ÷ 12
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: related tools */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Related tools
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    When you are comparing multiple rent quotes across different
                    payment periods and want them normalized under one
                    consistent set of time-length assumptions, the{" "}
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent converter
                    </Link>{" "}
                    keeps all periods aligned to the same basis.
                  </p>

                  <p className="text-sm text-slate-600">
                    Common neighbors:{" "}
                    <Link
                      to="/monthly-to-biweekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      monthly to biweekly
                    </Link>
                    ,{" "}
                    <Link
                      to="/biweekly-to-annual-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      biweekly to annual
                    </Link>
                    , and{" "}
                    <Link
                      to="/biweekly-to-weekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      biweekly to weekly
                    </Link>
                    , for cases where the quote is fixed but your planning
                    period is different.
                  </p>

                  <p className="text-sm text-slate-600">
                    If your main uncertainty is timing (when payments land on a
                    calendar) rather than equivalence (what the rent “works out
                    to”), the{" "}
                    <Link
                      to="/rent-due-date-calculator"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent due date calculator
                    </Link>{" "}
                    matches a payment cadence to actual dates.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: examples */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Examples you can cross-check
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    These examples use the same conversion path shown below. Any
                    “≈” is display rounding only, so your decision should be
                    based on the unrounded value when you are close to a cutoff.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <strong className="text-slate-900">Situation:</strong>{" "}
                          A landlord advertises “$1,000 biweekly” and you are
                          checking whether it fits a $2,100/month cap.
                        </div>
                        <div>
                          <strong className="text-slate-900">Numbers:</strong>{" "}
                          Biweekly = 1,000; cap = 2,100/month
                        </div>
                        <div>
                          <strong className="text-slate-900">
                            Calculation:
                          </strong>{" "}
                          Daily = 1,000 ÷ 14 = 71.428571…; Annual = daily × 365
                          = 26,071.428571…; Monthly = annual ÷ 12 =
                          2,172.619047…
                        </div>
                        <div>
                          <strong className="text-slate-900">Result:</strong>{" "}
                          Monthly ≈{" "}
                          <span className="font-semibold text-slate-900">
                            2,172.62
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Meaning:</strong>{" "}
                          It exceeds the $2,100 cap, so this listing fails your
                          monthly budget check even though “$1,000” can look low
                          at first glance.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <strong className="text-slate-900">Situation:</strong>{" "}
                          Two options are hard to compare: one is biweekly, one
                          is monthly. You want an apples-to-apples choice.
                        </div>
                        <div>
                          <strong className="text-slate-900">Numbers:</strong>{" "}
                          Option A: 1,150.70 biweekly; Option B: 2,450.00
                          monthly
                        </div>
                        <div>
                          <strong className="text-slate-900">
                            Calculation:
                          </strong>{" "}
                          Daily = 1,150.70 ÷ 14 = 82.192857…; Annual = daily ×
                          365 = 29,999.392857…; Monthly = annual ÷ 12 =
                          2,499.949404…
                        </div>
                        <div>
                          <strong className="text-slate-900">Result:</strong>{" "}
                          Option A monthly equivalent ≈{" "}
                          <span className="font-semibold text-slate-900">
                            2,499.95
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Meaning:</strong>{" "}
                          Option B is cheaper on a monthly basis (2,450.00 vs
                          2,499.95), so the decision flips if you were assuming
                          the biweekly quote was lower.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3 (why biweekly × 2 drifts)
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <strong className="text-slate-900">Situation:</strong>{" "}
                          Someone says “just double biweekly to get monthly” and
                          you are deciding whether a rent fits your monthly
                          plan.
                        </div>
                        <div>
                          <strong className="text-slate-900">Numbers:</strong>{" "}
                          Biweekly = 1,000
                        </div>
                        <div>
                          <strong className="text-slate-900">
                            Calculation:
                          </strong>{" "}
                          Shortcut: 1,000 × 2 = 2,000 (this is a 28-day amount);
                          Converter: Monthly = 1,000 × 365 ÷ (14 × 12) =
                          2,172.619047…
                        </div>
                        <div>
                          <strong className="text-slate-900">Result:</strong>{" "}
                          Shortcut ={" "}
                          <span className="font-semibold text-slate-900">
                            2,000.00
                          </span>
                          ; Monthly equivalent ≈{" "}
                          <span className="font-semibold text-slate-900">
                            2,172.62
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Meaning:</strong>{" "}
                          If your budget is near $2,100/month, the shortcut says
                          “fine” while the time-based monthly equivalent says
                          “over cap,” so relying on ×2 can cause a wrong accept.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (4-week comparison)
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <strong className="text-slate-900">Situation:</strong>{" "}
                          A listing is billed on a 28-day cycle and you want to
                          label it correctly in your notes without mixing it
                          into “monthly.”
                        </div>
                        <div>
                          <strong className="text-slate-900">Numbers:</strong>{" "}
                          Biweekly = 1,000
                        </div>
                        <div>
                          <strong className="text-slate-900">
                            Calculation:
                          </strong>{" "}
                          Daily = 1,000 ÷ 14; 4-week (28-day) = daily × 28 =
                          (1,000 ÷ 14) × 28
                        </div>
                        <div>
                          <strong className="text-slate-900">Result:</strong>{" "}
                          4-week amount ={" "}
                          <span className="font-semibold text-slate-900">
                            2,000.00
                          </span>
                        </div>
                        <div>
                          <strong className="text-slate-900">Meaning:</strong>{" "}
                          You should compare a 28-day billed rent against other
                          28-day cycles (or against an annualized equivalent),
                          not against a calendar-month “monthly,” so you do not
                          understate the cost.
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">
                    Quick sanity check: if you double the biweekly input, the
                    monthly equivalent doubles because the conversion is linear.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: core model */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The conversion path used on this page
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    This page uses one fixed path so the meaning of the output
                    stays stable across listings. The monthly number you see is
                    always derived from the same annual total, which is what
                    makes comparisons fair when one quote is biweekly and
                    another is monthly.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong className="text-slate-900">Daily</strong> =
                        biweekly ÷ 14
                      </li>
                      <li>
                        <strong className="text-slate-900">Annual</strong> =
                        daily × 365
                      </li>
                      <li>
                        <strong className="text-slate-900">Monthly</strong> =
                        annual ÷ 12
                      </li>
                      <li>
                        Combined:{" "}
                        <strong className="text-slate-900">
                          Monthly = biweekly × 365 ÷ (14 × 12)
                        </strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      “Monthly” here corresponds to an average month length of
                      365 ÷ 12 days, which is the point of using annual ÷ 12.
                    </p>
                  </div>

                  <p>
                    Keep the output in context: it is meant for comparing costs
                    and checking a monthly budget. It is not intended to predict
                    the exact amount that leaves your account in any specific
                    calendar month.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why not divide by 2 */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why monthly is not biweekly × 2
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Doubling biweekly creates a 28-day figure. That can be
                    useful if the rent is actually billed every 28 days, but it
                    is not the same thing as a monthly equivalent based on a
                    full year.
                  </p>

                  <p>
                    The decision impact shows up when you compare to monthly
                    budgets or to listings advertised per calendar month. This
                    page avoids the mismatch by anchoring to an annual total
                    first, then deriving the monthly equivalent from that same
                    basis.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Biweekly definition
                      </div>
                      <p className="mt-2">
                        Biweekly always means 14 days on this page.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Monthly definition
                      </div>
                      <p className="mt-2">
                        Monthly is an average month derived from annual ÷ 12.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown behavior */}
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
                  <p>
                    The breakdown is meant to help you compare the same rent
                    across different planning windows without changing the
                    underlying cost. Every line should reconcile back to the
                    same annual total, so you can compare “weekly,” “4-week,”
                    and “monthly” without hidden assumptions.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      What to compare against what
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Use <strong className="text-slate-900">weekly</strong>{" "}
                        when your cashflow planning is week-to-week.
                      </li>
                      <li>
                        Use <strong className="text-slate-900">4-week</strong>{" "}
                        when a listing is explicitly on a 28-day cycle.
                      </li>
                      <li>
                        Use <strong className="text-slate-900">monthly</strong>{" "}
                        when your budget, affordability checks, or comparisons
                        are monthly.
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Best practice: derive each line from the daily basis, not
                      from a rounded monthly display, to avoid drift in totals.
                    </p>
                  </div>

                  <p>
                    If two listings only become comparable after you put them in
                    the same period, use the monthly equivalent as the common
                    decision number, then refer back to other lines only for
                    cashflow planning.
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
