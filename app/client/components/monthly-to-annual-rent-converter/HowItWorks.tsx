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
                  How the monthly to annual rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page turns a monthly rent into a decision-ready annual
                  cost, then shows the same annual total expressed as weekly,
                  biweekly, every 4 weeks, daily, and hourly. The point is not
                  to “do math,” it is to prevent pricing labels from steering
                  you into the wrong choice when you are comparing listings.
                </p>
                <p className="mt-3 text-slate-600 leading-7 max-w-2xl">
                  If you are choosing between two rentals, set annual as your
                  baseline first. Once you trust the annual number, the other
                  cycles become quick “views” you can use to sanity-check
                  affordability and spot hidden cost differences.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Monthly = average month
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Annual via 365 days
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INTERPRET
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Avg month
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SCALE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  × 12
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
                <p>
                  These are useful when the price you have is not monthly, or
                  when you have already picked a place and your next decision is
                  planning, splitting, or comparing bigger alternatives.
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
                        Best when you are comparing more than two cycles at once
                        or starting from a non-monthly listing.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/annual-to-monthly-rent-converter"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Annual to monthly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when your budget is annual but you want a clean
                        monthly number to match how leases are advertised.
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
                        Use this when your shortlist is mostly weekly listings
                        and you want the same weekly view for your monthly
                        option.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/monthly-to-biweekly-rent-converter"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Monthly to biweekly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Useful when you budget biweekly (often aligned with pay
                        cycles) and want a comparable biweekly view of rent.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-split-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent split calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Relevant after you pick a place and need a fair,
                        repeatable way to divide the rent across roommates.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-vs-buy-calculator"
                        className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent vs buy calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use this when the decision is no longer “which rental,”
                        but “rent at all or buy,” including broader costs.
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="text-slate-700">
                  If you need other directions:{" "}
                  <Link
                    to="/weekly-to-monthly-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    weekly to monthly rent converter →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/biweekly-to-annual-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    biweekly to annual rent converter →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/hourly-to-annual-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    hourly to annual rent converter →
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* SectionCard: examples (own section) */}
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
                <p>
                  Each example ends in a concrete action. If the result does not
                  change what you do next, the comparison is not finished.
                </p>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-3">
                    <li>
                      <p className="font-semibold text-slate-900">
                        Listing looks cheaper, but is not after conversion
                      </p>
                      <p className="mt-2">
                        <strong>Situation:</strong> You are choosing between two
                        rentals and one is advertised weekly, so the sticker
                        price feels lower.
                      </p>
                      <p className="mt-2">
                        <strong>Numbers:</strong> Listing A is{" "}
                        <strong>$2,100/month</strong>. Listing B is{" "}
                        <strong>$500/week</strong>.
                      </p>
                      <p className="mt-2">
                        <strong>Calculation:</strong> Convert Listing A to
                        annual: 2,100 × 12 = 25,200. Convert Listing B to annual
                        using the same year model: 500 × 365 ÷ 7 = 26,071.43.
                      </p>
                      <p className="mt-2">
                        <strong>Result:</strong> Listing A ≈{" "}
                        <strong>$25,200/year</strong>. Listing B ≈{" "}
                        <strong>$26,071.43/year</strong>.
                      </p>
                      <p className="mt-2">
                        <strong>Meaning:</strong> The “$500/week” option is
                        actually about <strong>$871.43/year</strong> more. If
                        both homes are otherwise comparable, you stop treating
                        Listing B as the cheaper pick.
                      </p>
                    </li>

                    <li>
                      <p className="font-semibold text-slate-900">
                        Budget cap crossed (accept vs reject)
                      </p>
                      <p className="mt-2">
                        <strong>Situation:</strong> Your hard ceiling is an
                        annual housing budget. The listing is monthly, but you
                        need a yes or no against the cap.
                      </p>
                      <p className="mt-2">
                        <strong>Numbers:</strong> Monthly rent is{" "}
                        <strong>$2,450/month</strong>. Annual cap is{" "}
                        <strong>$29,000/year</strong>.
                      </p>
                      <p className="mt-2">
                        <strong>Calculation:</strong> Annual = 2,450 × 12 =
                        29,400.
                      </p>
                      <p className="mt-2">
                        <strong>Result:</strong> <strong>$29,400/year</strong>.
                      </p>
                      <p className="mt-2">
                        <strong>Meaning:</strong> It breaks the cap by{" "}
                        <strong>$400/year</strong>. If the cap is real, this
                        becomes a reject unless the landlord drops the price or
                        you cut other housing costs enough to make room.
                      </p>
                    </li>

                    <li>
                      <p className="font-semibold text-slate-900">
                        Rounding pitfall that can mislead a decision
                      </p>
                      <p className="mt-2">
                        <strong>Situation:</strong> Two options look tied if you
                        only glance at rounded outputs, but the exact annual
                        totals break the tie.
                      </p>
                      <p className="mt-2">
                        <strong>Numbers:</strong> Option A is{" "}
                        <strong>$2,000/month</strong>. Option B is{" "}
                        <strong>$460/week</strong>.
                      </p>
                      <p className="mt-2">
                        <strong>Calculation:</strong> A annual: 2,000 × 12 =
                        24,000. B annual: 460 × 365 ÷ 7 = 23,971.43.
                      </p>
                      <p className="mt-2">
                        <strong>Result:</strong> A is{" "}
                        <strong>$24,000/year</strong>. B is{" "}
                        <strong>$23,971.43/year</strong>.
                      </p>
                      <p className="mt-2">
                        <strong>Meaning:</strong> If you round both to “about
                        $24k,” they look equal. Using the exact annual numbers,
                        Option B is cheaper by <strong>$28.57/year</strong>.
                        That is small, but it can be the tiebreaker when you are
                        choosing between otherwise identical units.
                      </p>
                    </li>
                  </ul>
                </div>

                <p>
                  If you already have a weekly price and want the reverse
                  direction, use{" "}
                  <Link
                    to="/weekly-to-annual-rent-converter"
                    className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    weekly to annual rent converter →
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: core model */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The conversion model used on this page
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    This page treats your monthly input as an average month,
                    defined as one-twelfth of a 365-day year. That keeps the
                    annual equivalent stable and avoids accidental “month”
                    assumptions (28 days, 30 days, or a specific calendar
                    month).
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Annual</strong> = monthly × 12
                      </li>
                      <li>Equivalent view: monthly = annual ÷ 12</li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      Monthly corresponds to an average month length of 365 ÷ 12
                      days.
                    </p>
                  </div>

                  <p>
                    The annual number is the one you use for decisions. Treat
                    the other periods as alternate views of that same annual
                    total, not separate “truths.”
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: why schedule is separate */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why “monthly” can be confusing (and how this page avoids it)
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    “Monthly” gets used in two different ways: as a time-based
                    equivalent (a share of a year) and as a payment schedule
                    (what you actually get billed, and when). Confusing those
                    leads to bad comparisons, especially against weekly or
                    every-4-weeks listings.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Equivalence basis
                      </div>
                      <p className="mt-2">
                        A pure time comparison: your monthly price expressed as
                        an annual total (monthly × 12).
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Schedule context
                      </div>
                      <p className="mt-2">
                        A billing pattern can change how payments land across a
                        year (for example, “every 4 weeks” is not the same as
                        “monthly” in practice).
                      </p>
                    </div>
                  </div>

                  <p>
                    If you want to compare rent across cycles directly, you can
                    also use the{" "}
                    <Link
                      to="/rent-converter"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      universal rent converter →
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: breakdown */}
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
                    After the annual equivalent is set, the breakdown is
                    computed from that single annual basis. This prevents
                    “rounding drift,” where you round one step and then build
                    the next step on a rounded number.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Daily</strong> = annual ÷ 365
                    </li>
                    <li>
                      <strong>Weekly</strong> = daily × 7
                    </li>
                    <li>
                      <strong>Biweekly</strong> = daily × 14
                    </li>
                    <li>
                      <strong>4-week</strong> = daily × 28
                    </li>
                    <li>
                      <strong>Hourly</strong> = daily ÷ 24
                    </li>
                  </ul>

                  <p>
                    Use these views for fast checks. If weekly looks out of line
                    versus what the listing claims, that is a signal to double
                    check the listing’s cycle and what is included.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: parsing */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Parsing, precision, and safeguards
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Inputs are parsed as decimals so cents are preserved.
                    Currency symbols are ignored for parsing, and thousands
                    separators are treated as grouping characters.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>1,234</strong> → 1234
                    </li>
                    <li>
                      <strong>1.234</strong> → 1.234
                    </li>
                    <li>
                      Edge formats like <strong>.5</strong> and{" "}
                      <strong>12.</strong> are supported
                    </li>
                  </ul>

                  <p>
                    Calculations keep high internal precision (up to twelve
                    decimal places) so the displayed figures can round cleanly
                    without changing the underlying comparison. When an entry is
                    genuinely ambiguous, the goal is to avoid producing a
                    confident-looking number that could push a wrong decision.
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
                  Printing and usage notes
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    Use your browser’s print dialog to print the results or save
                    them as a PDF. This explanation section is marked no-print
                    so it does not appear in exported copies.
                  </p>

                  <p>
                    This converter is for cost equivalence, not bill timing. If
                    you are planning cash flow around a due date (and not just
                    comparing totals), use{" "}
                    <Link
                      to="/rent-due-date-calculator"
                      className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                    >
                      rent due date calculator →
                    </Link>
                    .
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
