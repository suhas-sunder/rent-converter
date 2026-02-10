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
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-700 tracking-tight leading-tight">
                  How the annual to hourly rent converter works (8,760-hour
                  equivalence)
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Convert a single annual rent total into a time-based hourly
                  cost using a fixed 365-day year (8,760 hours). The hourly
                  figure is an equivalence used for comparisons and budgeting,
                  not a lease schedule or invoice rule.
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-2 text-slate-600 leading-7 max-w-2xl">
                  <li>
                    Use it to translate a yearly rent into an hourly “cost of
                    space” for comparing options that are priced hourly, daily,
                    weekly, or monthly.
                  </li>
                  <li>
                    If you are deciding between listings with different billing
                    periods, rely on the breakdown table so every period is
                    derived from the same annual anchor.
                  </li>
                </ul>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Time-based hourly
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  365-day model
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual total
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DEFAULT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  annual ÷ 8,760
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  365 × 24 hours
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Hourly + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* 10 */}
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Related tools
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    For other period conversions that use the same time-length
                    basis, the{" "}
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent converter
                    </Link>{" "}
                    links the full set when you need a different input period.
                    For the inverse direction of this page, use{" "}
                    <Link
                      to="/hourly-to-annual-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      hourly to annual
                    </Link>{" "}
                    when your starting point is an hourly quote and you want the
                    yearly equivalent on the same 8,760-hour basis. For
                    comparisons against monthly and weekly, use{" "}
                    <Link
                      to="/annual-to-monthly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to monthly
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/annual-to-weekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to weekly
                    </Link>{" "}
                    when you need those periods defined consistently (instead of
                    mixing shortcuts like “4 weeks = monthly”).
                  </p>
                </div>
              </div>
            </div>

            {/* 1 */}
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      What this converter returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    You enter one annual rent total (currency per year). You get
                    a time-based hourly equivalent (currency per hour) plus a
                    breakdown table of other periods that all reconcile to the
                    same annual amount under one fixed model.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-semibold text-slate-900">
                        Hourly (time-based)
                      </span>{" "}
                      is best for comparing against anything priced by time
                      (hourly storage, workspace, parking, short stays, or
                      “per-hour cost” budgeting).
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        The breakdown rows
                      </span>{" "}
                      are best for making two listings comparable when they are
                      advertised in different periods.
                    </li>
                  </ul>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      What the output represents
                    </div>
                    <p className="mt-2">
                      The hourly figure is the annual amount spread across{" "}
                      <span className="font-semibold text-slate-900">
                        8,760 hours
                      </span>{" "}
                      (365 × 24). It is an equivalence for comparisons and
                      planning, not a statement about how rent is billed or when
                      payments happen.
                    </p>
                    <div className="mt-3 text-sm text-slate-600">
                      Practical read: “If this lease costs X per year, it is
                      effectively Y per hour of time on the calendar under one
                      consistent model.”
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6 */}
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Each example is decision-based and uses the same 8,760-hour
                    time model. The on-screen display may round, but the
                    decision should be based on the unrounded value when a
                    threshold is tight.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You are comparing a small storage unit advertised at
                          $3.50/hour to keeping the unit for a year under a
                          $24,000/year lease.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Annual = 24,000; Storage hourly quote = 3.50
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Hourly = 24,000 ÷ 8,760 = 2.739726…
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Hourly ≈{" "}
                          <span className="font-semibold text-slate-900">
                            2.74/hour
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          On a pure time-cost basis, the lease is below the
                          $3.50/hour alternative, so the storage unit is not the
                          cheaper option for year-long use.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          Your internal cap for a project space is $3.40/hour on
                          a time basis. A listing is quoted as $30,000.50/year.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Annual = 30,000.50; Cap = 3.40/hour
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Hourly = 30,000.50 ÷ 8,760 = 3.424714…
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Hourly ≈{" "}
                          <span className="font-semibold text-slate-900">
                            3.42/hour
                          </span>{" "}
                          (unrounded: 3.424714…)
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          This crosses the $3.40/hour cap, so it fails the
                          pricing rule unless you renegotiate or offset with
                          savings elsewhere.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          Two options are both advertised annually, but one
                          includes a smaller annual rent and you want to compare
                          in hourly terms to match an internal dashboard.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Annual = 18,200
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Daily = 18,200 ÷ 365 = 49.863013…; Hourly = Daily ÷ 24
                          = 2.077625…
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Hourly ≈{" "}
                          <span className="font-semibold text-slate-900">
                            2.08/hour
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          If your dashboard target is at or below $2.10/hour,
                          this listing passes without needing any further
                          conversions, and you can compare it directly against
                          other hourly-priced options.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (paid-hours comparison)
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You are tempted to compare rent to a wage rate using
                          only paid work hours. You want to see how that changes
                          the interpretation before using it in a decision.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Annual = 30,000; Hours/week = 40
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Paid-hours hourly = 30,000 ÷ (40 × 52) = 14.423076…
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Paid-hours hourly ≈{" "}
                          <span className="font-semibold text-slate-900">
                            14.42/hour
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          If you mistakenly use paid-hours hourly as if it were
                          time-based rent, you will overstate the “per-hour”
                          cost and may reject a viable lease. For rent period
                          comparisons, stick to the 8,760-hour time basis and
                          treat paid-hours as a separate, labeled perspective.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2 */}
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
                        d="M5 12h14M12 5v14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Definitions used on this page
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    These definitions exist for one reason: to make every period
                    conversion internally consistent so comparisons do not mix
                    incompatible assumptions.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-semibold text-slate-900">Hour</span>
                      : 1 hour. Time-based annual hours = 365 × 24 ={" "}
                      <span className="font-semibold text-slate-900">
                        8,760
                      </span>
                      .
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Day</span>:
                      1 day.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Week</span>
                      : 7 days.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Biweekly
                      </span>
                      : 14 days (not twice per month).
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        4-week
                      </span>
                      : 28 days.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">
                        Month
                      </span>
                      : average month length implied by the model, 365 ÷ 12
                      days. On this page, “monthly” means annual ÷ 12, not 4
                      weeks.
                    </li>
                    <li>
                      <span className="font-semibold text-slate-900">Year</span>
                      : 365 days.
                    </li>
                  </ul>

                  <p className="text-sm text-slate-600">
                    A paid-hours hourly rate (hours/week × 52) is a different
                    framing. It can be useful for wage-style comparisons, but it
                    is not the basis used for the rent equivalence output on
                    this page.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 */}
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
                        d="M4 6h16M9 6v12m6-12v12"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Core formula and conversion basis
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    One input anchors everything: the annual total. Every output
                    period is derived from that same anchor so the headline
                    hourly and the breakdown rows agree with each other.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Exact formulas (annual as input)
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Hourly (time-based)
                        </span>{" "}
                        = annual ÷ (365 × 24) = annual ÷ 8,760
                      </li>
                      <li>Daily = annual ÷ 365</li>
                      <li>Weekly = annual × 7 ÷ 365</li>
                      <li>Biweekly = annual × 14 ÷ 365</li>
                      <li>4-week = annual × 28 ÷ 365</li>
                      <li>
                        Monthly = annual ÷ 12 (equivalently: annual × (365 ÷ 12)
                        ÷ 365)
                      </li>
                    </ul>

                    <div className="mt-4 text-sm">
                      <div className="font-bold text-slate-900">
                        Stepwise version (annual → daily → hourly)
                      </div>
                      <div className="mt-2">Daily = annual ÷ 365</div>
                      <div>Hourly = daily ÷ 24 = (annual ÷ 365) ÷ 24</div>
                    </div>

                    <p className="mt-4 text-sm text-slate-600">
                      The point of this basis is comparability: every period is
                      computed from the same annual reference so you do not get
                      drift from chaining rounded rows together.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 */}
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
                        d="M7 7h10v10H7z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      What the breakdown table represents
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The breakdown table exists to make comparisons fair across
                    period labels. Each row is calculated from the annual total,
                    not from another row.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Weekly is not computed as hourly × 168, and monthly is not
                      computed as weekly × 4.
                    </li>
                    <li>
                      Chaining rows can amplify rounding and can bake in the
                      wrong definition (for example, treating “monthly” as 28
                      days).
                    </li>
                  </ul>

                  <p>
                    Use the row that matches the period used in the listing you
                    are evaluating, then compare that like-for-like with another
                    listing. The goal is one consistent annual anchor, not
                    matching a landlord’s payment schedule language.
                  </p>
                </div>
              </div>
            </div>

            {/* 5 */}
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
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Common mismatches and how this page treats them
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Hourly by paid-hours vs time-based hourly
                    </div>
                    <p className="mt-2">
                      Time-based hourly spreads the annual total across 8,760
                      hours so it stays compatible with daily and weekly
                      equivalents. A paid-hours model divides by assumed work
                      hours (hours/week × 52) and will usually be much larger
                      because it spreads the same annual total across fewer
                      hours. Treat paid-hours as a separate comparison lens and
                      do not swap it in for the default hourly output.
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-600">
                      <li>
                        Use time-based hourly for rent period comparisons.
                      </li>
                      <li>
                        Use paid-hours hourly only when you explicitly want a
                        wage-style framing.
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Weekly × 4 vs monthly
                    </div>
                    <p className="mt-2">
                      Weekly × 4 is a 28-day amount. Monthly on this page is
                      annual ÷ 12 (average month under a 365-day year). Because
                      a month is not fixed at 28 days, weekly × 4 will not match
                      monthly under this model.
                    </p>
                    <div className="mt-3 text-sm text-slate-600">
                      Decision impact: a “$500/week” listing and a
                      “$2,000/month” listing are not automatically equivalent
                      without using the correct row definitions.
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      4-week vs calendar month
                    </div>
                    <p className="mt-2">
                      4-week is always 28 days. Monthly is computed as annual ÷
                      12. These are different periods, so they are intentionally
                      different rows in the table.
                    </p>
                    <div className="mt-3 text-sm text-slate-600">
                      Decision impact: if a landlord advertises “every 4 weeks,”
                      compare using the 4-week row, not the monthly row.
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      “26 payments” vs time-length conversion
                    </div>
                    <p className="mt-2">
                      “26 payments” describes a payment schedule. This page
                      converts by time length under a fixed 365-day year. If a
                      listing talks about payment counts, keep that as a billing
                      detail and still use this tool to compare the underlying
                      period equivalents.
                    </p>
                    <div className="mt-3 text-sm text-slate-600">
                      Decision impact: you can compare offers without letting
                      schedule language distort the effective rate.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 9 */}
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
                        d="M4 7h16M4 12h16M4 17h16"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Scope and limits of this tool
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    This tool converts only the rent amount you enter. It does
                    not include utilities, parking, internet, deposits, taxes,
                    insurance, proration, incentives, or one-time fees.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      If two listings include different extras, convert the base
                      rent here, then adjust outside the tool so you do not
                      accidentally treat a fee as “rent per hour.”
                    </li>
                    <li>
                      If you are close to a threshold, avoid deciding based on a
                      rounded display. Use the full precision behind the output
                      and treat rounding as presentation.
                    </li>
                  </ul>
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
                  This is an equivalence converter, not a payment schedule
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Use this page when your decision is “which option is cheaper
                  when expressed on the same time basis.” Do not use it to infer
                  due dates, invoice timing, payment counts, or how a landlord
                  structures billing. If your decision depends on dates on a
                  calendar, use a due-date tool instead.
                </p>
                <div className="mt-4">
                  <Link
                    to="/rent-due-date-calculator"
                    className="cursor-pointer inline-flex items-center font-semibold text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                  >
                    Rent due date calculator →
                  </Link>
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
