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
                  How the biweekly to weekly rent converter works
                </h2>
                <div className="mt-2 text-slate-600 leading-7 max-w-2xl space-y-3">
                  <p>
                    Use this conversion when you’re comparing a{" "}
                    <span className="font-semibold text-slate-900">
                      biweekly rent request
                    </span>{" "}
                    to anything priced weekly (room rentals, short-term sublets,
                    “per week” ads), or when you want to sanity-check whether a
                    “cheap biweekly” number actually fits your weekly budget.
                  </p>
                  <p>
                    This route uses fixed time lengths:{" "}
                    <span className="font-semibold text-slate-900">
                      biweekly = 14 days
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-slate-900">
                      weekly = 7 days
                    </span>
                    . Under those definitions, the weekly equivalent is exactly
                    half of the biweekly amount, so you get a clean comparable
                    number without any calendar assumptions.
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
                  Weekly = 7 days
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
                  DIRECT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly = ÷ 2
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Time-length
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXTRAS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Full breakdown
                </div>
              </div>
            </div>
          </div>

          {/* SectionCard: related tools + EXAMPLES (examples must live here) */}
          <div className="group mt-8 relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
            />
            <div className="p-5 sm:px-6">
              <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                Related tools and examples
              </h3>

              <div className="mt-4 space-y-4">
                <p className="text-slate-700">
                  Use the related tools below when your next decision depends on{" "}
                  <span className="font-semibold text-slate-900">
                    a different comparison frame
                  </span>{" "}
                  (monthly budget planning, annual totals, or a real schedule)
                  rather than a weekly equivalent.
                </p>

                <div className="text-sm flex flex-wrap gap-x-5 gap-y-2">
                  <Link
                    to="/rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    Rent converter →
                  </Link>
                  <Link
                    to="/biweekly-to-annual-rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    Biweekly to annual →
                  </Link>
                  <Link
                    to="/biweekly-to-monthly-rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    Biweekly to monthly →
                  </Link>
                  <Link
                    to="/rent-due-date-calculator"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    Rent due date calculator →
                  </Link>
                </div>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
                    Examples you can cross-check
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1
                      </div>

                      <div className="mt-2 space-y-2 text-sm text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You’re choosing between a room listed at $500/week and
                          a place listed at $1,000 biweekly, and you can’t tell
                          if the biweekly option is “the same deal.”
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Weekly listing = 500/week; Biweekly listing =
                          1,000/biweekly
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Weekly(biweekly listing) = 1,000 ÷ 2
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          500.00/week
                        </p>
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          They’re equivalent on a weekly basis, so the decision
                          should shift to non-price factors (location,
                          utilities, lease terms), not the payment cadence.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2
                      </div>

                      <div className="mt-2 space-y-2 text-sm text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          Your weekly rent cap is $450/week. A landlord asks for
                          $920.55 biweekly, and the rounded weekly display might
                          look “close enough.”
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Cap = 450/week; Biweekly = 920.55
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Weekly = 920.55 ÷ 2
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          460.275/week (if display rounds: 460.28)
                        </p>
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          This exceeds your cap, so it’s a reject or
                          renegotiate, even if the rounded display makes it feel
                          marginal.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3 (linearity check)
                      </div>

                      <div className="mt-2 space-y-2 text-sm text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You’re comparing two biweekly offers that differ by
                          “only $60,” and you want the weekly impact for your
                          budget.
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Offer A = 1,000 biweekly; Offer B = 1,060 biweekly
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          A weekly = 1,000 ÷ 2; B weekly = 1,060 ÷ 2
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          A = 500/week; B = 530/week (difference = 30/week)
                        </p>
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          The “$60 biweekly” gap is a $30/week gap, which is the
                          number that matters if you budget weekly.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (breakdown anchoring)
                      </div>

                      <div className="mt-2 space-y-2 text-sm text-slate-700">
                        <p>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You’re negotiating and the landlord uses weekly talk,
                          but you want to sanity-check the implied annual cost
                          from a biweekly quote before committing.
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Biweekly = 1,000
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Daily = 1,000 ÷ 14; Annual = Daily × 365
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Annual = (1,000 ÷ 14) × 365 = 26,071.428571…
                        </p>
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          If the annualized total is outside what you can carry,
                          the weekly “sounds fine” framing is misleading and the
                          negotiation should focus on lowering the biweekly
                          figure.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  This section is marked no-print so it does not clutter
                  exported copies.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: direct conversion */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The direct weekly conversion
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The output is designed for one decision:{" "}
                    <span className="font-semibold text-slate-900">
                      can this biweekly rent be compared fairly to weekly
                      pricing
                    </span>
                    ? With the fixed definitions on this page, the weekly
                    equivalent is exact and immediate.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Primary formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Weekly
                      </span>{" "}
                      = biweekly ÷ 2
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-600">
                      <li>
                        Use the weekly result to compare listings that advertise
                        “per week.”
                      </li>
                      <li>
                        Use it to check a weekly cap (what you can pay each
                        week) without guessing from a biweekly number.
                      </li>
                    </ul>
                  </div>

                  <p>
                    This route avoids “average month” math entirely. If you only
                    need a weekly comparable number, dividing by 2 is the
                    cleanest and least error-prone conversion you can do.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why not calendar-based */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why this conversion does not use calendar weeks
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Calendar reality varies: paydays shift, lease start dates
                    differ, and some “biweekly” arrangements aren’t perfectly
                    aligned to a strict schedule. This converter intentionally
                    ignores all of that and answers a narrower question:
                    <span className="font-semibold text-slate-900">
                      {" "}
                      what is the 7-day equivalent of a 14-day price
                    </span>
                    ?
                  </p>

                  <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                    <li>It will not tell you which dates rent is due.</li>
                    <li>
                      It will not model “this month has five Fridays” effects.
                    </li>
                    <li>It will not infer anything about payroll timing.</li>
                  </ul>

                  <p>
                    If your decision depends on dates (planning due dates,
                    avoiding late fees, coordinating move-in timing), the period
                    equivalent is the wrong output for that job.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown logic */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  How the full breakdown is derived
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The breakdown is for cross-checking and for decisions that
                    need a different frame (monthly planning, annual
                    affordability), not for re-explaining the weekly result.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Derived periods (from the same daily basis)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Daily
                        </span>{" "}
                        = biweekly ÷ 14{" "}
                        <span className="text-slate-600">
                          (the shared anchor for everything else)
                        </span>
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Annual
                        </span>{" "}
                        = daily × 365{" "}
                        <span className="text-slate-600">
                          (useful for affordability checks and comparisons)
                        </span>
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Monthly
                        </span>{" "}
                        = annual ÷ 12{" "}
                        <span className="text-slate-600">
                          (planning bucket, not a calendar month claim)
                        </span>
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          4-week
                        </span>{" "}
                        = daily × 28{" "}
                        <span className="text-slate-600">
                          (matches a 28-day budgeting block)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p>
                    Using a single daily anchor prevents mismatched definitions
                    across the table and keeps the breakdown internally
                    consistent even when some rows display rounded decimals.
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
