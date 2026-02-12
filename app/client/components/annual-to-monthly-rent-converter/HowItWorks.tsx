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
                  How the annual to monthly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Use this route when you have an annual rent figure and need a
                  monthly number you can compare against a monthly budget or a
                  monthly listing. The headline output is computed as{" "}
                  <span className="font-semibold text-slate-900">
                    annual ÷ 12
                  </span>
                  , and the breakdown keeps the same annual anchor so you can
                  sanity-check other payment periods without changing your
                  input. If you want to switch between rent periods on one page,
                  use the{" "}
                  <Link
                    to="/rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    rent converter
                  </Link>
                  .
                </p>
                <ul className="mt-4 space-y-2 text-slate-600">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span>
                      Best for decisions like “Does this annual offer fit my
                      monthly limit?” or “Which option is cheaper after making
                      periods comparable?”
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span>
                      Not a billing-calendar estimate. It does not assume 30
                      days, and it does not predict which dates payments land
                      on.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Monthly = annual ÷ 12
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  28-day comparison shown
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
                  PRIMARY
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual ÷ 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BREAKDOWN
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Same annual basis
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXTRA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  28-day schedule line
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
                    <h3 className="text-xl font-extrabold text-sky-700 tracking-tight">
                      Related tools
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    For the reverse direction, use{" "}
                    <Link
                      to="/monthly-to-annual-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      monthly to annual
                    </Link>
                    .
                  </p>
                  <ul className="space-y-2">
                    <li>
                      If your starting number is annual but you need a different
                      comparison period, these routes keep the same annual
                      anchor while changing the output period:{" "}
                      <Link
                        to="/annual-to-weekly-rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        annual to weekly
                      </Link>
                      ,{" "}
                      <Link
                        to="/annual-to-biweekly-rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        annual to biweekly
                      </Link>
                      ,{" "}
                      <Link
                        to="/annual-to-daily-rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        annual to daily
                      </Link>
                      , and{" "}
                      <Link
                        to="/annual-to-hourly-rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        annual to hourly
                      </Link>
                      .
                    </li>
                    <li>
                      If you are comparing multiple listings with mixed rent
                      periods and want a single place to normalize them, the{" "}
                      <Link
                        to="/rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        rent converter
                      </Link>{" "}
                      keeps the conversions together so you can compare on a
                      consistent basis.
                    </li>
                  </ul>
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
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Each example ends with a concrete decision that changes once
                    the annual figure is expressed as a monthly number. When a
                    28-day line appears in the breakdown, it is shown separately
                    because it is not the same interval as “monthly.”
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
                          You have a hard monthly rent cap of $2,050 and a
                          listing is quoted as an annual total.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Annual = 24,600
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Monthly = 24,600 ÷ 12
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Monthly ={" "}
                          <span className="font-semibold text-slate-900">
                            2,050
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          It lands exactly on your cap, so it stays in your
                          “still possible” list (but you have no cushion).
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
                          Two options look close, but you only approve anything
                          under $2,500 per month.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Annual = 30,240.00
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Monthly = 30,240.00 ÷ 12
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Monthly ={" "}
                          <span className="font-semibold text-slate-900">
                            2,520.00
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          It fails the cap, so you reject it immediately instead
                          of spending time comparing features.
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
                          You are choosing between a monthly listing and an
                          annual offer, and you want a like-for-like monthly
                          comparison.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Option A annual = 28,800; Option B monthly = 2,450
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Option A monthly = 28,800 ÷ 12
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Option A monthly ={" "}
                          <span className="font-semibold text-slate-900">
                            2,400
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          Option A is $50 cheaper per month on the annual basis,
                          so it becomes the price winner (then you compare
                          terms).
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (28-day comparison)
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          A rent schedule is “every 4 weeks,” and someone
                          assumes it is basically the same as monthly.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Annual = 24,000
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          4-week = 24,000 × 28 ÷ 365
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          4-week ≈{" "}
                          <span className="font-semibold text-slate-900">
                            1,841.10
                          </span>{" "}
                          (not “monthly”)
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          You stop using “weekly × 4” as a shortcut and treat
                          28-day payments as their own schedule when comparing
                          affordability.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: what it does */}
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
                      What the monthly result represents
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The monthly result is the annual rent spread evenly across
                    12 months. Use it as a monthly planning number when your
                    rent is quoted annually but your budget, income, or
                    comparisons are monthly.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Primary formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Monthly equivalent
                      </span>{" "}
                      = annual rent ÷ 12
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span>
                          Treat the output as the monthly cost you are
                          committing to, even if payments are not made monthly.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span>
                          If your decision is “under a monthly cap,” compare
                          your cap to this number, not to weekly times four.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span>
                          If the annual amount includes cents, the true monthly
                          value can be fractional; rounding is for display.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p>
                    The breakdown keeps everything tied back to the same annual
                    total, which makes it useful for quick cross-checks when a
                    listing is described in a different period.
                  </p>
                </div>
              </div>
            </div>
            {/* SectionCard: step-by-step */}
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
                      How it works on this route
                    </h3>
                  </div>
                </div>

                <div className="mt-4">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong className="text-slate-900">
                        Enter an annual rent total.
                      </strong>{" "}
                      Use the full amount as quoted (include cents if they are
                      part of the figure).
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Read the headline monthly output.
                      </strong>{" "}
                      That number is what you compare to a monthly budget, a
                      monthly listing, or a monthly affordability rule.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Use the breakdown only when you need comparability.
                      </strong>{" "}
                      It keeps every line anchored to the same annual total so
                      you can cross-check a weekly, daily, or hourly quote on a
                      consistent basis.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Treat the 28-day line as its own schedule.
                      </strong>{" "}
                      It is shown separately so you do not accidentally replace
                      “monthly” with a fixed 4-week interval.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* SectionCard: common mismatches */}
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
                      Monthly vs 4-week (28-day)
                    </div>
                    <p className="mt-2">
                      Monthly on this page is the annual amount split into 12
                      equal parts. A 4-week schedule is always 28 days. Because
                      those are different intervals, the breakdown shows them on
                      separate rows so you do not make a “close enough”
                      assumption.
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Use monthly for monthly budgeting decisions. Use the
                      28-day row only when the payment schedule is actually
                      every 4 weeks.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Weekly × 4 vs monthly
                    </div>
                    <p className="mt-2">
                      Weekly × 4 is just another way to describe a 28-day
                      amount. That shortcut can look reasonable while still
                      being wrong for “monthly” decisions. If your comparison
                      starts from an annual quote and you need a weekly view,
                      keep the basis consistent with{" "}
                      <Link
                        to="/annual-to-weekly-rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        annual to weekly
                      </Link>{" "}
                      or the{" "}
                      <Link
                        to="/rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        rent converter
                      </Link>{" "}
                      so the comparisons stay on the same anchor.
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      If your decision is “fits my monthly cap,” compare against
                      the headline monthly output (annual ÷ 12), not weekly × 4.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Equivalents vs due dates
                    </div>
                    <p className="mt-2">
                      The breakdown shows equivalents under a fixed basis. It
                      does not predict invoice timing, payment cadence inside a
                      calendar month, or specific due dates. For due date
                      planning, use{" "}
                      <Link
                        to="/rent-due-date-calculator"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        rent due date calculator
                      </Link>
                      .
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Treat this page as a comparability and budgeting bridge
                      from annual to monthly, not a scheduling calendar.
                    </p>
                  </div>
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
