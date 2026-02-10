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
                  How the hourly to annual rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Use this when a price is quoted per hour and you need an
                  annual-equivalent number to make a real decision, usually a
                  budget check or a like-for-like comparison against rent listed
                  as monthly or yearly. The default view assumes the hourly
                  amount applies continuously (24 hours per day, 365 days per
                  year). The optional work-hours view is for hourly charges that
                  apply only to a fixed number of hours each week.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  24 × 365 model
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Work-hours comparison
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Hourly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  TIME BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  × 24 × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  COMPARE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Hours/week × 52
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: Related tools (near top) */}
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
                    Use these when your decision starts with a different price
                    period or when the question is timing rather than cost.
                  </p>

                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      <span className="font-semibold text-slate-900">
                        Annual to hourly
                      </span>{" "}
                      is for checking whether a yearly price works out to an
                      hourly rate that feels reasonable for short-term usage.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Rent converter
                      </span>{" "}
                      is for converting between common rent periods in one place
                      when listings use different labels.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Rent due date calculator
                      </span>{" "}
                      is for planning payment timing once you have accepted a
                      rent amount.
                    </li>
                  </ul>

                  <div className="mt-3 text-sm flex flex-wrap gap-x-5 gap-y-2">
                    <Link
                      to="/annual-to-hourly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Annual to hourly →
                    </Link>
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Rent converter →
                    </Link>
                    <Link
                      to="/rent-due-date-calculator"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Rent due date calculator →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: Examples (directly under Related tools) */}
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
                        d="M4 7h16M4 12h12M4 17h14"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1 (clock-hour budget check)
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          A storage unit is billed at an hourly rate and runs
                          continuously.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Hourly = 2.50, budget cap = 20,000 per year
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          2.50 × 24 × 365
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          <span className="font-semibold text-slate-900">
                            21,900
                          </span>{" "}
                          per year
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          It breaks the annual cap, so this rate is a reject
                          unless you know it will not run 24/7.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2 (clock-hour vs “cheap” monthly)
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          Parking offers 3.25 per hour, or a different lot
                          offers 2,200 per month.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Hourly = 3.25, Monthly = 2,200
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          3.25 × 24 × 365
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          <span className="font-semibold text-slate-900">
                            28,470
                          </span>{" "}
                          per year (hourly, continuous) vs 2,200 × 12 ={" "}
                          <span className="font-semibold text-slate-900">
                            26,400
                          </span>{" "}
                          per year
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          The hourly listing is not the cheaper option under a
                          24/7 assumption, so the monthly lot wins for always-on
                          use.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3 (small hourly, big annual)
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          A service fee is quoted as “only 1.10 per hour” and is
                          billed continuously.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Hourly = 1.10, alternative flat fee = 8,500 per year
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          1.10 × 24 × 365
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          <span className="font-semibold text-slate-900">
                            9,636
                          </span>{" "}
                          per year
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          The “tiny” hourly fee costs more annually than the
                          flat fee, so the flat fee is the rational pick if both
                          cover the same thing.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (work-hours decision)
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          A paid on-site role includes accommodation deductions
                          at 20 per hour, but only for scheduled hours.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Hourly = 20, hours/week = 40, alternative annual rent
                          quote = 60,000
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          20 × 40 × 52
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          <span className="font-semibold text-slate-900">
                            41,600
                          </span>{" "}
                          per year (work-hours)
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          Under the hours-limited assumption, the effective
                          annual cost is below the 60,000 alternative, so this
                          option stays on the shortlist.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      What to look for
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-sm text-slate-700">
                      <li>
                        If a quote is truly continuous, the annual number
                        escalates quickly even when the hourly amount looks
                        small.
                      </li>
                      <li>
                        If the quote is hours-limited, the work-hours view is a
                        reality check that prevents an obvious overestimate.
                      </li>
                      <li>
                        When comparing two options, convert both to the same
                        baseline (annual or monthly) before deciding.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: Clock-hour model */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Clock-hour annual equivalence
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    This is the “always-on” interpretation: the hourly rate
                    applies to every hour of the day. Use it for costs that
                    accrue continuously (for example, space or equipment billed
                    by time, not scheduled shifts).
                  </p>

                  <ul className="list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      Best for: 24/7 billing, uninterrupted occupancy, or
                      metered usage that never stops.
                    </li>
                    <li>
                      Not for: labor-style hourly rates tied to scheduled work
                      hours (use the work-hours comparison instead).
                    </li>
                  </ul>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Daily
                        </span>{" "}
                        = hourly × 24
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Annual
                        </span>{" "}
                        = daily × 365
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          Annual
                        </span>{" "}
                        = hourly × 24 × 365
                      </li>
                    </ul>
                  </div>

                  <p>
                    Once you have the annual number, treat it like any other
                    annual rent figure: compare it directly to yearly quotes, or
                    use the breakdown below to translate it into monthly,
                    weekly, or 4-week amounts for side-by-side checking.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: Work-hours comparison */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Work-hours comparison
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Use this view when the hourly amount only applies for a
                    defined schedule. The decision you are making here is not
                    which number is lower, but which assumption matches the way
                    the charge is actually billed.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Annual
                      </span>{" "}
                      = hourly × (hours per week) × 52
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-700">
                      <li>
                        If the billing stops when the schedule stops, this is
                        the appropriate baseline for comparing against annual
                        rent figures.
                      </li>
                      <li>
                        If the billing continues outside the schedule, do not
                        use this view since it will understate the annual cost.
                      </li>
                    </ul>
                  </div>

                  <p>
                    A common mistake is treating a schedule-based hourly number
                    as if it were 24/7. That inflates the annual equivalent and
                    can wrongly eliminate an option that actually fits the
                    budget.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: Breakdown */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  How the breakdown is derived
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    The breakdown is for comparisons across listing formats. It
                    expresses the same annual-equivalent cost using standard
                    period lengths so you can line up “weekly,” “monthly,” and
                    “every 4 weeks” without guesswork.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Period lengths used
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>Week = 7 days</li>
                      <li>Biweekly = 14 days</li>
                      <li>4-week = 28 days</li>
                      <li>Year = 365 days</li>
                      <li>Average month = 365 ÷ 12 days</li>
                    </ul>
                  </div>

                  <p>
                    Use this when you need a clean comparison between labels
                    that sound similar but are not the same length. “Monthly”
                    and “every 4 weeks” are different time spans, so they will
                    not match even when the underlying annual cost is identical.
                  </p>
                </div>
              </div>
            </div>

            {/* Dark utility callout */}
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-200">
                  “Hourly” depends on how many hours actually apply
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The 24 × 365 view answers “What if this rate runs all the
                  time?” The work-hours view answers “What if it applies only to
                  scheduled hours?” If you choose the wrong assumption, the
                  annual figure can be off by a lot, and that can flip an accept
                  vs reject decision.
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
