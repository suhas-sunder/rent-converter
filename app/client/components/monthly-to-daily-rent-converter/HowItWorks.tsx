import { Link } from "react-router";

const HowItWorks = () => {
  return (
    <>
      <section
        id="how-it-works"
        className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm rc-no-print"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
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
                    How the monthly to daily rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    Use this when you need a single, apples-to-apples daily cost
                    for a monthly rent figure so you can judge it against daily
                    budgets or listings priced in other cycles.
                  </p>
                  <p className="mt-3 text-slate-600 leading-7 max-w-2xl">
                    “Monthly” is treated as an average month from a 365-day
                    year, not a 30-day shortcut. That choice is what keeps the
                    daily output aligned with the weekly, biweekly, and
                    every-4-weeks numbers shown in the breakdown.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Month = 365 ÷ 12 days
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Day = 1 day
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
                    Annual ÷ 365
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Daily + breakdown
                  </div>
                </div>
              </div>
            </div>

            {/* Related tools (required) */}
            <div className="rounded-3xl my-8 bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Related tools
                </h3>

                <p className="mt-4 text-slate-700 leading-7">
                  Use these when your decision is being made in a different pay
                  cycle, or when you need to compare listings that use different
                  labels for similar-looking prices.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <Link
                        to="/rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Universal rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Best when you have two listings in different cycles and
                        need a single comparable baseline in one step.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/daily-to-monthly-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Daily to monthly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Useful when a daily figure is your budget screen but the
                        lease is negotiated and signed in monthly terms.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/monthly-to-weekly-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Monthly to weekly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use when you are comparing a monthly apartment to a
                        weekly-priced room, short stay, or sublet.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/monthly-to-biweekly-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Monthly to biweekly rent converter →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Helps when rent needs to fit into a
                        two-paychecks-per-month cash flow plan.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/how-much-rent-can-i-afford-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        How much rent can I afford calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use when the constraint is income and you want a rent
                        ceiling before comparing listings.
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/rent-as-percentage-of-income-calculator"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent as percentage of income calculator →
                      </Link>{" "}
                      <span className="text-slate-600">
                        Use when two rents look close but you need to see the
                        affordability impact relative to income.
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="mt-4 text-slate-700">
                  More conversions:{" "}
                  <Link
                    to="/weekly-to-monthly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    weekly to monthly →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/monthly-to-annual-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    monthly to annual →
                  </Link>{" "}
                  <span className="text-slate-400">·</span>{" "}
                  <Link
                    to="/hourly-to-monthly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    hourly to monthly →
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Examples (required, own section) */}
            <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Examples
                </h3>

                <p className="mt-4 text-slate-700 leading-7">
                  Each example ends with a concrete choice that changes after
                  converting to a daily baseline.
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <ul className="list-disc pl-5 space-y-4 text-slate-700">
                    <li>
                      <p className="font-semibold text-slate-900">Situation</p>
                      <p className="mt-1">
                        Two listings look similar, but one is “every 4 weeks,”
                        and you only want the cheaper true day-to-day cost.
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Numbers
                      </p>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>
                          Listing A: <strong>$2,300/month</strong>
                        </li>
                        <li>
                          Listing B: <strong>$2,150 every 4 weeks</strong>
                        </li>
                      </ul>
                      <p className="mt-3 font-semibold text-slate-900">
                        Calculation
                      </p>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>
                          A daily = 2,300 × 12 ÷ 365 ={" "}
                          <strong>$75.62/day</strong> (approx)
                        </li>
                        <li>
                          B daily = 2,150 ÷ 28 = <strong>$76.79/day</strong>{" "}
                          (approx)
                        </li>
                      </ul>
                      <p className="mt-3 font-semibold text-slate-900">
                        Result
                      </p>
                      <p className="mt-1">
                        Listing A is cheaper by about <strong>$1.17/day</strong>{" "}
                        (roughly <strong>$8.19/week</strong>).
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Meaning
                      </p>
                      <p className="mt-1">
                        If you were leaning toward Listing B because “$2,150”
                        looks lower than “$2,300,” the daily view flips the
                        decision: Listing A is the better price for the same
                        daily cost baseline.
                      </p>
                    </li>

                    <li>
                      <p className="font-semibold text-slate-900">Situation</p>
                      <p className="mt-1">
                        You are screening listings against a hard daily cap,
                        because it keeps your spending under control regardless
                        of billing label.
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Numbers
                      </p>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>
                          Your cap: <strong>$80/day</strong>
                        </li>
                        <li>
                          Listing: <strong>$2,450/month</strong>
                        </li>
                      </ul>
                      <p className="mt-3 font-semibold text-slate-900">
                        Calculation
                      </p>
                      <p className="mt-1">
                        Daily = 2,450 × 12 ÷ 365 = <strong>$80.55/day</strong>{" "}
                        (approx)
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Result
                      </p>
                      <p className="mt-1">
                        The listing is slightly over your cap by about{" "}
                        <strong>$0.55/day</strong>.
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Meaning
                      </p>
                      <p className="mt-1">
                        If your rule is “do not exceed $80/day,” this becomes a
                        reject or a negotiate decision. If you accept it anyway,
                        you are knowingly breaking the cap rather than drifting
                        past it because the monthly price looked close.
                      </p>
                    </li>

                    <li>
                      <p className="font-semibold text-slate-900">Situation</p>
                      <p className="mt-1">
                        Two monthly options are close, and you want to decide
                        whether the difference is worth paying for a specific
                        benefit (better location, parking, or included
                        utilities).
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Numbers
                      </p>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>
                          Option A: <strong>$2,125/month</strong>
                        </li>
                        <li>
                          Option B: <strong>$2,225/month</strong>
                        </li>
                        <li>
                          Difference: <strong>$100/month</strong>
                        </li>
                      </ul>
                      <p className="mt-3 font-semibold text-slate-900">
                        Calculation
                      </p>
                      <p className="mt-1">
                        Daily difference = 100 × 12 ÷ 365 ={" "}
                        <strong>$3.29/day</strong> (approx)
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Result
                      </p>
                      <p className="mt-1">
                        The upgrade costs about <strong>$3.29/day</strong>{" "}
                        (about <strong>$23.01/week</strong>).
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Meaning
                      </p>
                      <p className="mt-1">
                        If the upgrade benefit is not worth about $3.29/day to
                        you, you pick Option A. If it is (for example, it avoids
                        a $5/day commute cost), Option B becomes the rational
                        choice.
                      </p>
                    </li>

                    <li>
                      <p className="font-semibold text-slate-900">Situation</p>
                      <p className="mt-1">
                        You are comparing two very close monthly rents and want
                        to avoid a rounding trap that makes them look equal.
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Numbers
                      </p>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        <li>
                          Listing A: <strong>$1,999/month</strong>
                        </li>
                        <li>
                          Listing B: <strong>$2,000/month</strong>
                        </li>
                      </ul>
                      <p className="mt-3 font-semibold text-slate-900">
                        Calculation
                      </p>
                      <p className="mt-1">
                        Daily difference = 1 × 12 ÷ 365 ={" "}
                        <strong>$0.03/day</strong> (approx)
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Result
                      </p>
                      <p className="mt-1">
                        The difference is only a few cents per day, but it is
                        real. If your display rounding hides decimals, the two
                        can appear identical.
                      </p>
                      <p className="mt-3 font-semibold text-slate-900">
                        Meaning
                      </p>
                      <p className="mt-1">
                        If you are choosing purely on price, keep enough
                        precision visible to break ties cleanly. If you consider
                        them “the same,” do it intentionally, not because the
                        display rounded away the difference.
                      </p>
                    </li>
                  </ul>
                </div>

                <p className="mt-4 text-slate-700 leading-7">
                  Have a daily price and want monthly? Use{" "}
                  <Link
                    to="/daily-to-monthly-rent-converter"
                    className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                  >
                    daily to monthly rent converter →
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6 text-lg text-slate-700 leading-7">
              {/* Step card: input parsing */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 1: Enter the monthly rent amount
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      Enter the rent amount exactly as it appears on the listing
                      and keep the period set to “monthly.” This is the fastest
                      way to translate a headline monthly price into a daily
                      baseline you can actually screen against.
                    </p>

                    <p className="text-slate-700 leading-7">
                      The parser accepts thousands separators, currency symbols,
                      and decimals. If an entry could reasonably be read more
                      than one way, the calculator blocks the result instead of
                      guessing, because a “close enough” parse can flip a rent
                      decision.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Parsing rules
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <strong>1,234</strong> is treated as 1234 (grouping)
                        </li>
                        <li>
                          <strong>1.234</strong> is treated as 1.234 (decimal)
                        </li>
                        <li>
                          Formats like <strong>.5</strong> and{" "}
                          <strong>12.</strong> are valid
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600 leading-6">
                        If you paste a value that includes extra text (for
                        example “$2,300/mo”), trim it to the number so you do
                        not accidentally trigger an ambiguity block.
                      </p>
                    </div>

                    <p>
                      This page stays scoped to rent only. It does not add or
                      subtract utilities, fees, parking, deposits, or one-time
                      move-in costs. If those change the decision, convert rent
                      first, then compare the extras separately so you can see
                      which part is driving the difference.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step card: conversion path */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 2: Convert monthly to daily using a 365-day basis
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The conversion is designed for decisions where you must
                      compare different billing labels. It treats “monthly” as
                      an average month based on a 365-day year, then expresses
                      your rent as a true per-day cost on that same basis.
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
                          Combined: <strong>Daily = monthly × 12 ÷ 365</strong>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        This corresponds to an average month length of 365 ÷ 12
                        days.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        When daily is the right comparison
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          You have a daily cap (or daily comfort zone) and want
                          to accept, reject, or negotiate quickly.
                        </li>
                        <li>
                          You are comparing “monthly” against “every 4 weeks,”
                          weekly, biweekly, or other cycles that can look
                          similar but represent different time lengths.
                        </li>
                        <li>
                          Two listings are close and you want a stable baseline
                          before you weigh location, commute, or included
                          extras.
                        </li>
                      </ul>
                    </div>

                    <p>
                      This approach avoids the common 30-day shortcut that makes
                      some monthly rents look artificially cheaper (or more
                      expensive) when you compare them against true weekly or
                      28-day pricing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step card: breakdown + rounding */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:px-6">
                  <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                    Step 3: Keep the breakdown consistent and keep rounding
                    honest
                  </h3>

                  <div className="mt-4 space-y-3">
                    <p>
                      The daily figure is the baseline. The breakdown exists so
                      you can translate that baseline back into the period you
                      actually use for decisions without switching assumptions.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Breakdown conversions (all derived from the same daily)
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
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
                    </div>

                    <p>
                      Calculations preserve decimals internally (up to 12
                      places). If you enable rounding, it affects display only.
                      That keeps the decision stable: you are not changing the
                      math, only how many digits you see.
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        What you can do here
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                        <li>
                          Apply a daily cap to monthly listings and decide
                          quickly whether they fit.
                        </li>
                        <li>
                          Compare a monthly lease against weekly or 4-week
                          pricing without letting “similar” labels hide real
                          cost differences.
                        </li>
                        <li>
                          Keep enough precision visible when two options are
                          close and rounding would create a false tie.
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600 leading-6">
                        If you are negotiating, using the daily or weekly delta
                        often makes small monthly differences feel concrete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related tools (required) */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
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
                      Use these when your next decision is about budgeting in a
                      specific cycle, or when you want to compare rent against
                      income constraints instead of against other listings.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <Link
                            to="/rent-converter"
                            className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                          >
                            Universal rent converter →
                          </Link>{" "}
                          <span className="text-slate-600">
                            Best when you need to normalize two listings that
                            start in different cycles (weekly vs monthly, 4-week
                            vs monthly, and more).
                          </span>
                        </li>
                        <li>
                          <Link
                            to="/monthly-to-weekly-rent-converter"
                            className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                          >
                            Monthly to weekly rent converter →
                          </Link>{" "}
                          <span className="text-slate-600">
                            Useful when your short-term alternatives are priced
                            weekly and you want the clean weekly equivalent of a
                            monthly lease.
                          </span>
                        </li>
                        <li>
                          <Link
                            to="/monthly-to-biweekly-rent-converter"
                            className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                          >
                            Monthly to biweekly rent converter →
                          </Link>{" "}
                          <span className="text-slate-600">
                            Helpful when your cash flow is paycheck-based and
                            the question is “what do I need set aside every two
                            weeks?”
                          </span>
                        </li>
                        <li>
                          <Link
                            to="/monthly-to-annual-rent-converter"
                            className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                          >
                            Monthly to annual rent converter →
                          </Link>{" "}
                          <span className="text-slate-600">
                            Useful for year-level planning, lease comparisons,
                            and “total cost” conversations.
                          </span>
                        </li>
                        <li>
                          <Link
                            to="/rent-per-paycheck-calculator"
                            className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                          >
                            Rent per paycheck calculator →
                          </Link>{" "}
                          <span className="text-slate-600">
                            Useful when you already like a place but need to
                            confirm the rent fits your paycheck cycle without
                            squeezing other bills.
                          </span>
                        </li>
                        <li>
                          <Link
                            to="/how-much-rent-can-i-afford-calculator"
                            className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                          >
                            How much rent can I afford calculator →
                          </Link>{" "}
                          <span className="text-slate-600">
                            Useful when you need a rent range first, then you
                            can convert listings into the same baseline.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <p className="text-slate-700">
                      Quick conversions:{" "}
                      <Link
                        to="/daily-to-monthly-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        daily to monthly →
                      </Link>{" "}
                      <span className="text-slate-400">·</span>{" "}
                      <Link
                        to="/weekly-to-monthly-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        weekly to monthly →
                      </Link>{" "}
                      <span className="text-slate-400">·</span>{" "}
                      <Link
                        to="/monthly-to-annual-rent-converter"
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        monthly to annual →
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
    </>
  );
};

export default HowItWorks;
