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
                  How the annual to weekly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Use this route when you have a single annual rent total and
                  need a weekly number you can act on, such as checking a weekly
                  affordability cap, comparing to weekly income, or normalizing
                  listings that quote different periods. The headline result is
                  the budgeting weekly (annual ÷ 52). A separate weekly line is
                  also shown under a 365-day model (annual × 7 ÷ 365) so you can
                  compare week values without mixing definitions.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Weekly budget: ÷ 52
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  365-day weekly shown
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
                  HEADLINE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual ÷ 52
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  COMPARE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual × 7 ÷ 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  EXTRAS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  14-day + 28-day lines
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
                    If you want all rent period conversions from one place, use
                    the{" "}
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent converter
                    </Link>
                    . For the reverse direction of this page, use{" "}
                    <Link
                      to="/weekly-to-annual-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      weekly to annual
                    </Link>
                    . For nearby comparisons, use{" "}
                    <Link
                      to="/annual-to-biweekly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to biweekly
                    </Link>
                    ,{" "}
                    <Link
                      to="/annual-to-monthly-rent-converter"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      annual to monthly
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
                  </p>

                  <p className="text-sm text-slate-600">
                    If your question is about due dates (not equivalents), use{" "}
                    <Link
                      to="/rent-due-date-calculator"
                      className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      rent due date calculator
                    </Link>
                    .
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
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Each example ends in a concrete decision. Notice when the
                    budgeting weekly (÷ 52) is the right number to act on, and
                    when the 365-day weekly is the definition you must match for
                    a policy, worksheet, or day-based comparison.
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
                          You can only spend $450/week on rent without cutting
                          essentials.
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
                          Budgeting weekly = 24,000 ÷ 52 = 461.5384… ≈{" "}
                          <span className="font-semibold text-slate-900">
                            461.54
                          </span>{" "}
                          <br />
                          365-day weekly = 24,000 × 7 ÷ 365 = 460.2740… ≈{" "}
                          <span className="font-semibold text-slate-900">
                            460.27
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Weekly equivalent is about $460 to $462/week depending
                          on definition.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          This fails a hard $450/week cap, so you reject the
                          listing or negotiate before spending time on
                          applications.
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
                          A housing program checks eligibility using a day-based
                          weekly definition and has a $576/week limit.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Numbers:
                          </span>{" "}
                          Annual = 30,000.50
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Calculation:
                          </span>{" "}
                          Budgeting weekly = 30,000.50 ÷ 52 = 576.9326… ≈{" "}
                          <span className="font-semibold text-slate-900">
                            576.93
                          </span>{" "}
                          <br />
                          365-day weekly = 30,000.50 × 7 ÷ 365 = 575.3513… ≈{" "}
                          <span className="font-semibold text-slate-900">
                            575.35
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          One definition is above $576/week; the other is below.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          If the reviewer uses the 365-day weekly, you stay
                          eligible; if they use ÷ 52, you do not. You match the
                          definition required by the policy before you commit to
                          the lease.
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 3 (biweekly)
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          You get paid every two weeks and want a simple “set
                          aside” amount per paycheck.
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
                          Biweekly (365-day) = 24,000 × 14 ÷ 365 = 920.5479… ≈{" "}
                          <span className="font-semibold text-slate-900">
                            920.55
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          Setting aside about $921 per paycheck covers the rent
                          total under the 14-day definition.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          If your “rent bucket” target is $950 per paycheck,
                          this stays inside the limit, so you keep the listing
                          in your short list.
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-600">
                        If you want the dedicated route, use{" "}
                        <Link
                          to="/annual-to-biweekly-rent-converter"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          annual to biweekly
                        </Link>
                        .
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Example 4 (4-week / 28-day)
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <div>
                          <span className="font-semibold text-slate-900">
                            Situation:
                          </span>{" "}
                          A landlord bills every 4 weeks, but your budget is
                          planned monthly.
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
                          4-week (365-day) = 24,000 × 28 ÷ 365 = 1,841.0958… ≈{" "}
                          <span className="font-semibold text-slate-900">
                            1,841.10
                          </span>
                          <br />
                          Monthly budgeting check (for planning) = 24,000 ÷ 12 ={" "}
                          <span className="font-semibold text-slate-900">
                            2,000.00
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Result:
                          </span>{" "}
                          The 4-week invoice is lower than $2,000, but it occurs
                          13 times per year, not 12.
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">
                            Meaning:
                          </span>{" "}
                          If your cash flow cannot handle the “extra” payment
                          cycle, you avoid a 4-week billing lease even if the
                          headline monthly number looks similar.
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-600">
                        If your rent is actually billed every 4 weeks, use{" "}
                        <Link
                          to="/rent-paid-every-4-weeks-calculator"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          rent paid every 4 weeks calculator
                        </Link>
                        .
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">
                    Note: any “≈” is display rounding. Internally, decimals
                    should remain intact.
                  </p>
                </div>
              </div>
            </div>
            {/* SectionCard: what you enter */}
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
                      Step 1: Enter an annual rent total
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Enter one yearly total and treat it as your definition of
                    “rent” for this comparison. If you want utilities, parking,
                    discounts, or fees included, roll them into the annual
                    number before converting. If you want them excluded, remove
                    them first.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Input handling
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Thousands separators (commas) are treated as grouping:{" "}
                        <span className="font-semibold text-slate-900">
                          1,234
                        </span>{" "}
                        → 1234
                      </li>
                      <li>
                        Decimals are supported and preserved:{" "}
                        <span className="font-semibold text-slate-900">
                          30000.50
                        </span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">.5</span>
                        ,{" "}
                        <span className="font-semibold text-slate-900">
                          12.
                        </span>
                      </li>
                      <li>
                        If an input format is ambiguous, the correct behavior is
                        a warning or an error instead of guessing
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-slate-600">
                    Treat the input as a source of truth. If the annual total is
                    wrong, every period will be wrong by the same proportion.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: headline weekly */}
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
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Step 2: Compute weekly budgeting as annual ÷ 52
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    This route’s primary output is the budgeting weekly. It is
                    the number you use when your planning is organized in weeks,
                    or when you need to compare rent to weekly income or a
                    weekly affordability cap.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Headline formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Weekly (budgeting)
                      </span>{" "}
                      = annual rent ÷ 52
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-600">
                      <li>
                        Good for “can I afford this per week?” and “how much
                        should I allocate each week?”
                      </li>
                      <li>
                        Good for comparing two annual totals on the same weekly
                        budget basis
                      </li>
                      <li>
                        Not intended to represent the length of an actual 7-day
                        billing cycle
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-slate-600">
                    If you are cross-checking against a day-based policy or a
                    prorated daily rate, use the labeled 365-day weekly line
                    instead of forcing weekly budgeting into a day-count
                    comparison.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: 365-day weekly comparison */}
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
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      The 365-day weekly equivalent
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The 365-day weekly is a labeled comparison line. It keeps
                    “weekly” consistent with day-based equivalents like daily
                    and hourly, which matters when you are reconciling numbers
                    from policies, prorations, or spreadsheets that start from a
                    per-day rate.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      365-day weekly formula
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Weekly (365-day)
                      </span>{" "}
                      = annual rent × 7 ÷ 365
                    </p>
                    <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-600">
                      <li>
                        Use when a worksheet or program explicitly derives
                        weekly from a daily rate
                      </li>
                      <li>
                        Use when you are comparing to daily, hourly, or other
                        day-count equivalents on the same page
                      </li>
                      <li>
                        Use when you are sanity-checking prorations, since the
                        logic starts from days
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-slate-600">
                    Do not treat this as “more correct” than the headline. It is
                    a different definition designed to prevent mixing weekly
                    budgeting with day-based math.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: other periods + decimals */}
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
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Additional period lines and precision rules
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The extra lines exist for real-world planning. If you budget
                    by paycheck or your landlord bills on a fixed cycle, these
                    equivalents let you decide whether a listing fits your cash
                    flow without rewriting the annual total.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Biweekly definition
                      </div>
                      <p className="mt-2">
                        Biweekly is treated as{" "}
                        <span className="font-semibold text-slate-900">
                          14 days
                        </span>{" "}
                        when shown as a time-based line.
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Useful when you are setting aside rent per paycheck and
                        want the definition to match day-based math.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        4-week definition
                      </div>
                      <p className="mt-2">
                        4-week is treated as{" "}
                        <span className="font-semibold text-slate-900">
                          28 days
                        </span>{" "}
                        and shown explicitly as a distinct cycle.
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        Useful when a listing is billed every 4 weeks and you
                        need to plan for the extra payment cycle over a year.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Precision rules that prevent bad decisions
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-sm text-slate-700">
                      <li>
                        Decimals should be preserved through calculation so
                        cents do not disappear.
                      </li>
                      <li>
                        Rounding should be display-only so “just under” and
                        “just over” checks remain trustworthy.
                      </li>
                      <li>
                        If the UI displays fewer decimals, the underlying value
                        should still retain the full parsed input.
                      </li>
                    </ul>
                  </div>
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
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Common mismatches and how this page treats them
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Weekly × 4 vs monthly
                    </div>
                    <p className="mt-2">
                      Weekly × 4 is a 28-day amount, not a calendar month. If
                      you want a monthly budgeting number, use{" "}
                      <Link
                        to="/annual-to-monthly-rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        annual to monthly
                      </Link>
                      . If your rent is actually billed every 4 weeks, use{" "}
                      <Link
                        to="/rent-paid-every-4-weeks-calculator"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        rent paid every 4 weeks calculator
                      </Link>
                      .
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      This mismatch is a common source of “it looked cheaper”
                      errors when comparing listings.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Two weekly definitions
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-sm text-slate-700">
                      <li>
                        <span className="font-semibold text-slate-900">
                          Budgeting weekly
                        </span>{" "}
                        is for weekly planning and weekly affordability checks
                        (annual ÷ 52).
                      </li>
                      <li>
                        <span className="font-semibold text-slate-900">
                          365-day weekly
                        </span>{" "}
                        is for day-based comparisons and prorations (annual × 7
                        ÷ 365).
                      </li>
                    </ul>
                    <p className="mt-2 text-sm text-slate-600">
                      If a policy, form, or listing uses one definition, match
                      it explicitly instead of swapping models mid-comparison.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Equivalents are not due dates
                    </div>
                    <p className="mt-2">
                      These are equivalents under fixed definitions. They do not
                      determine when rent is due or how invoices are scheduled.
                      For due dates, use{" "}
                      <Link
                        to="/rent-due-date-calculator"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        rent due date calculator
                      </Link>
                      .
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      A weekly equivalent can fit your budget and still fail
                      your cash flow if the due date lands before your pay
                      cycle.
                    </p>
                  </div>
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
                  Two weekly definitions can both be correct if they are labeled
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Treat the headline weekly as a budgeting decision number, and
                  treat the 365-day weekly as a consistency check for day-based
                  math. If you are comparing weekly values across pages, across
                  listings, or against a third-party rule, confirm which
                  definition is being used before you accept or reject a rental.
                </p>
                <ul className="mt-4 list-disc pl-5 space-y-2 text-slate-200">
                  <li>
                    Comparing to a weekly budget cap: use{" "}
                    <span className="font-semibold text-white">
                      annual ÷ 52
                    </span>
                  </li>
                  <li>
                    Reconciling against daily prorations or day-based policies:
                    use{" "}
                    <span className="font-semibold text-white">
                      annual × 7 ÷ 365
                    </span>
                  </li>
                  <li>
                    4-week billing: plan for 13 cycles per year, not 12 months
                  </li>
                </ul>
                <div className="mt-4">
                  <Link
                    to="/rent-converter"
                    className="cursor-pointer inline-flex items-center font-semibold text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-sm"
                  >
                    Rent converter →
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
