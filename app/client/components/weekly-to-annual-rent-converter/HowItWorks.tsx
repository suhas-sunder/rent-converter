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
          <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                  Weekly to annual rent conversion
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Convert a weekly rent into a yearly cost so you can make a
                  clean decision: does this weekly listing fit your annual
                  budget, and is it actually cheaper than the alternatives once
                  everything is on the same basis?
                </p>
                <p className="mt-3 text-slate-600 leading-7 max-w-2xl">
                  This page shows two common framings people mix up:{" "}
                  <span className="font-semibold text-slate-900">
                    a time-based 365-day equivalence
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-slate-900">
                    a 52-payment schedule shortcut
                  </span>
                  . They answer different questions, so both stay visible.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Weekly = 7 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Annual basis shown
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly rent amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  365-day equivalence
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  CONTEXT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly × 52 (schedule)
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual total + breakdown
                </div>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>
            <p className="text-slate-700 leading-relaxed">
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>
              <span className="text-slate-700">
                {" "}
                for deciding whether a weekly quote is genuinely competitive
                once you normalize it against monthly pricing norms,{" "}
              </span>
              <Link
                to="/monthly-to-annual-rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                monthly to annual rent
              </Link>
              <span className="text-slate-700">
                {" "}
                when you already have a monthly figure and want a yearly budget
                number without changing assumptions,{" "}
              </span>
              <span className="text-slate-700">and </span>
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
              </Link>
              <span className="text-slate-700">
                {" "}
                if you need to switch between multiple rent periods (weekly,
                fortnightly, monthly, annual) in one place while keeping the
                same underlying basis.
              </span>
              .
            </p>
          </div>

          {/* SectionCard: examples (separate) */}
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
                      d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                    Examples
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  Each example ends in a concrete decision. The time-based
                  annual is the reference number; the 52-payment line is used
                  only when the decision is about a payment schedule claim.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 1: Budget cap (accept vs reject)
                    </div>
                    <ul className="mt-3 space-y-2">
                      <li>
                        <strong className="text-slate-900">Situation:</strong>{" "}
                        Your annual rent cap is{" "}
                        <strong className="text-slate-900">$26,000</strong>. A
                        listing is{" "}
                        <strong className="text-slate-900">$500/week</strong>.
                      </li>
                      <li>
                        <strong className="text-slate-900">Numbers:</strong>{" "}
                        Weekly = $500, cap = $26,000.
                      </li>
                      <li>
                        <strong className="text-slate-900">Calculation:</strong>{" "}
                        Time-based annual = $500 × 365 ÷ 7 ≈ $26,071.43.
                      </li>
                      <li>
                        <strong className="text-slate-900">Result:</strong>{" "}
                        <strong className="text-slate-900">$26,071.43</strong>{" "}
                        (time-based) vs{" "}
                        <strong className="text-slate-900">$26,000</strong>{" "}
                        (schedule: $500 × 52).
                      </li>
                      <li>
                        <strong className="text-slate-900">Meaning:</strong> If
                        your cap is strict, this fails the cap on a 365-day
                        basis. You either negotiate, choose a cheaper weekly
                        rate, or raise the cap. Using weekly × 52 would hide the
                        overage.
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 2: A “cheaper” listing isn’t cheaper
                    </div>
                    <ul className="mt-3 space-y-2">
                      <li>
                        <strong className="text-slate-900">Situation:</strong>{" "}
                        You are comparing{" "}
                        <strong className="text-slate-900">$725/week</strong>{" "}
                        against{" "}
                        <strong className="text-slate-900">$3,160/month</strong>{" "}
                        and want a single annual basis.
                      </li>
                      <li>
                        <strong className="text-slate-900">Numbers:</strong>{" "}
                        Weekly = $725, monthly = $3,160.
                      </li>
                      <li>
                        <strong className="text-slate-900">Calculation:</strong>{" "}
                        Weekly annual (time-based) = $725 × 365 ÷ 7 ≈
                        $37,803.57. Monthly annual = $3,160 × 12 = $37,920.
                      </li>
                      <li>
                        <strong className="text-slate-900">Result:</strong>{" "}
                        Weekly listing ≈{" "}
                        <strong className="text-slate-900">$37,803.57</strong>{" "}
                        vs monthly listing{" "}
                        <strong className="text-slate-900">$37,920</strong>.
                      </li>
                      <li>
                        <strong className="text-slate-900">Meaning:</strong>{" "}
                        They are effectively the same price. If the monthly
                        place includes an extra perk (parking, utilities, a
                        shorter commute), you stop treating the weekly listing
                        as “obviously cheaper” and decide based on value, not
                        the period label.
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-slate-600">
                  Display rounding can change the last digits. Internally,
                  calculations should preserve decimals end-to-end, with
                  rounding applied only to display.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: what it returns */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      What this converter returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Enter the weekly price and you get a yearly total that you
                    can use as a budgeting anchor. The main output is the
                    time-based annual amount, so every other breakdown line
                    stays consistent with the same underlying year length.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Annual (time-based)
                      </span>{" "}
                      = weekly × 365 ÷ 7
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Equivalent form: daily = weekly ÷ 7, then annual = daily ×
                      365.
                    </p>
                  </div>

                  <ul className="mt-4 list-disc pl-5 space-y-2">
                    <li>
                      Use the annual total to check a yearly cap (for example, a
                      maximum rent line in your budget).
                    </li>
                    <li>
                      Use the breakdown to compare a weekly listing against a
                      monthly or annual listing without guessing.
                    </li>
                    <li>
                      Treat the time-based annual as the “apples-to-apples”
                      number when you are comparing periods.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SectionCard: why there are two answers */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Why weekly to annual can yield two reasonable numbers
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    People use “weekly” in two ways: as a 7-day rate, or as a
                    promise of 52 payments. Those are close but not identical
                    because{" "}
                    <span className="font-semibold text-slate-900">
                      365 days is about 52.14 weeks
                    </span>
                    .
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Time-based equivalence
                      </div>
                      <p className="mt-2">
                        Best when you are converting between periods (weekly vs
                        monthly vs annual) and want one consistent “year” behind
                        every line item.
                      </p>
                      <p className="mt-3 text-sm text-slate-600">
                        Decision use: compare listings across different period
                        labels without being tricked by the label.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Payment schedule shortcut
                      </div>
                      <p className="mt-2">
                        Best when you are estimating total cash paid if a lease
                        genuinely collects 52 weekly payments in a defined year
                        frame.
                      </p>
                      <p className="mt-3 text-sm text-slate-600">
                        Decision use: sanity-check a quoted “annual cost” that
                        was computed as weekly × 52.
                      </p>
                    </div>
                  </div>

                  <p>
                    This converter keeps the breakdown internally consistent by
                    using the time-based annual figure as the backbone, then
                    deriving the other period views from that same annual.
                  </p>

                  <p className="text-sm text-slate-600">
                    Practical note: the schedule line is context, not the “main”
                    answer. Mixing them will quietly skew comparisons.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: input formats (separate) */}
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
                        d="M4 7h16M7 11h10M7 15h6"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Input parsing and decimals
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Input formats supported
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        Decimals:{" "}
                        <strong className="text-slate-900">1200.50</strong>,{" "}
                        <strong className="text-slate-900">.5</strong>,{" "}
                        <strong className="text-slate-900">12.</strong>
                      </li>
                      <li>
                        Thousands grouping:{" "}
                        <strong className="text-slate-900">1,200</strong>,{" "}
                        <strong className="text-slate-900">1,200.50</strong>
                      </li>
                      <li>
                        Currency symbols are ignored for parsing:{" "}
                        <strong className="text-slate-900">$1,200.50</strong>
                      </li>
                    </ul>
                  </div>

                  <p>
                    Parsing matters because a “clean-looking” annual number can
                    still be wrong if the input was misread. If a value could
                    reasonably be interpreted more than one way, the page should
                    warn or block instead of guessing.
                  </p>

                  <ul className="mt-4 list-disc pl-5 space-y-2">
                    <li>
                      Use a decimal point when you mean cents. Do not rely on
                      commas to imply decimals.
                    </li>
                    <li>
                      If you paste a formatted currency amount, the symbol is
                      ignored, but the digits and separators still need to be
                      unambiguous.
                    </li>
                    <li>
                      When comparing listings, keep precision through the
                      conversion, then round at the end for display.
                    </li>
                  </ul>

                  <p className="text-sm text-slate-600">
                    Example: <strong className="text-slate-900">1,234</strong>{" "}
                    is treated as thousands grouping (1234). If you meant a
                    decimal, use{" "}
                    <strong className="text-slate-900">1.234</strong>.
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                  Equivalent conversion is not a lease billing engine
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  Use the annual equivalents for decisions and comparisons, not
                  for predicting exact due dates. Real leases can start
                  mid-week, include pro-rated first periods, and collect
                  payments on specific calendar dates. If you need a calendar
                  schedule for what gets paid and when, you need a due-date
                  tool.
                </p>
                <p className="mt-3 text-slate-200 leading-7">
                  Also, if someone claims an “annual total” for a weekly rent,
                  this page helps you identify whether they used a 365-day
                  equivalence or a 52-payment shortcut. That difference is small
                  per week, but it can flip a tight budget decision.
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
