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
                  Weekly to monthly rent (Australia)
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  In Australia, rent is commonly advertised{" "}
                  <span className="font-semibold text-slate-900">
                    per week (pw)
                  </span>
                  , but many people budget by the month. This page converts any
                  weekly rent into a{" "}
                  <span className="font-semibold text-slate-900">
                    per-calendar-month (PCM)
                  </span>{" "}
                  equivalent so you can compare a weekly listing to a monthly
                  budget, a monthly affordability target, or a monthly figure
                  from a different market. Weekly is treated as{" "}
                  <span className="font-semibold text-slate-900">7 days</span>.
                  “Monthly” here means the average calendar month length of{" "}
                  <span className="font-semibold text-slate-900">
                    365 ÷ 12 days
                  </span>{" "}
                  (about 30.42 days). The calculator uses a{" "}
                  <span className="font-semibold text-slate-900">
                    365-day year
                  </span>{" "}
                  so the headline PCM result and the breakdown stay consistent.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Week = 7 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Month = 365 ÷ 12
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly rent (pw)
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  365-day year
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  FORMULA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  weekly × 365 ÷ (7 × 12)
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  PCM + comparisons
                </div>
              </div>
            </div>
          </div>

          {/* SectionCard: examples + input handling */}
          <div className="group my-8 relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm transition hover:ring-sky-200/80">
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
                  <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                    Australian examples you can sanity-check
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  Weekly pricing is normal on Australian listings, but month-by-
                  month budgeting is also common (especially when you pay bills
                  monthly or get paid monthly). These examples show why the
                  monthly equivalent is not the same as “weekly × 4”. If the UI
                  displays fewer decimals, the PCM may be rounded for display,
                  but the underlying math is the same.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    You’re looking at a listing for{" "}
                    <strong className="text-slate-900">$650 pw</strong> and
                    trying to see if it fits a{" "}
                    <strong className="text-slate-900">$2,800 pcm</strong>{" "}
                    budget. Convert weekly to PCM:{" "}
                    <strong className="text-slate-900">
                      $650 × 365 ÷ (7 × 12) = $2,823.80 pcm
                    </strong>
                    . That is slightly above the cap before bills or parking.
                  </li>
                  <li>
                    You keep thinking in “four weeks” because many costs feel
                    like they repeat monthly. The 4-week shortcut for{" "}
                    <strong className="text-slate-900">$500 pw</strong> is{" "}
                    <strong className="text-slate-900">
                      $500 × 4 = $2,000
                    </strong>
                    , but the calendar-month equivalent is{" "}
                    <strong className="text-slate-900">
                      $500 × 365 ÷ (7 × 12) = $2,172.62 pcm
                    </strong>
                    . The difference is{" "}
                    <span className="font-semibold text-slate-900">
                      $172.62
                    </span>{" "}
                    per month-equivalent, which adds up over a year.
                  </li>
                  <li>
                    You’re planning cashflow and want a yearly view from a
                    weekly Australian listing. For{" "}
                    <strong className="text-slate-900">$720 pw</strong>, annual
                    equivalence is{" "}
                    <strong className="text-slate-900">
                      ($720 ÷ 7) × 365 = $37,542.86 per year
                    </strong>
                    . Monthly (PCM) equivalence is{" "}
                    <strong className="text-slate-900">
                      $37,542.86 ÷ 12 = $3,128.57 pcm
                    </strong>
                    .
                  </li>
                  <li>
                    A real listing might include cents (discounts, proration, or
                    negotiated rates). The calculator keeps decimals through the
                    conversion, so{" "}
                    <strong className="text-slate-900">$615.50 pw</strong> is
                    handled directly rather than rounded first.
                  </li>
                  <li>
                    Input <strong className="text-slate-900">1,234</strong> → a
                    comma is treated as thousands grouping{" "}
                    <strong className="text-slate-900">(1234)</strong>. If you
                    mean a decimal amount, enter{" "}
                    <strong className="text-slate-900">1.234</strong>.
                  </li>
                </ul>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
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
                  Practical tip for Australia: use PCM for comparisons
                  (budgeting and comparing to monthly numbers), then separately
                  confirm the actual payment cadence in the lease (weekly,
                  fortnightly, 4-weekly, or monthly) and what is included
                  (utilities, parking, internet).
                </p>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="mt-2">
              If you are comparing Australian weekly ads to monthly budgets or
              other rent periods, these save you from redoing the math.
            </p>

            <p className="text-slate-700 leading-relaxed">
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>{" "}
              explains why weekly and PCM do not line up by multiplying by 4,{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
              </Link>{" "}
              helps switch between common rent periods when listings use
              different terms, and{" "}
              <Link
                to="/rent-affordability-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent affordability calculator
              </Link>{" "}
              helps you check whether a PCM number fits your income and budget.{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                Rent converter →
              </Link>
            </p>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
            {/* SectionCard: what it returns */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm transition hover:ring-sky-200/80">
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
                    Enter a weekly rent amount (typical for Australia) and the
                    tool returns a{" "}
                    <span className="font-semibold text-slate-900">
                      monthly equivalent (PCM)
                    </span>{" "}
                    that represents the same annual cost under a 365-day model.
                    This is an equivalent used for comparison and budgeting, not
                    a rule that changes how a lease will bill you.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Monthly equivalent
                      </span>{" "}
                      = weekly × 365 ÷ (7 × 12)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Same idea, shown stepwise: daily = weekly ÷ 7 → annual =
                      daily × 365 → monthly = annual ÷ 12.
                    </p>
                  </div>

                  <p>
                    The breakdown table (daily, biweekly, 4-week, monthly, and
                    annual) is derived from the same annual basis. That is
                    useful when you are comparing Australian weekly listings to
                    monthly numbers, or when different listings mix weekly, 4-
                    weekly/28-day cycles, and PCM-style budgeting.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: what “monthly” means here + common mismatch */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm transition hover:ring-sky-200/80">
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
                      What “monthly” means here (and why it can differ from “×
                      4”)
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    This page defines a month as an{" "}
                    <span className="font-semibold text-slate-900">
                      average calendar month
                    </span>{" "}
                    length: 365 ÷ 12 days. It does not assume a month is 28, 30,
                    or 31 days. Using an annual basis keeps the PCM figure
                    anchored to a consistent year, which is what you want when
                    you are converting an Australian weekly listing into a
                    monthly budget number.
                  </p>

                  <p>
                    The most common mismatch is treating “every 4 weeks” as
                    monthly. A 4-week period is exactly{" "}
                    <span className="font-semibold text-slate-900">
                      28 days
                    </span>
                    . A calendar month is longer on average, so “weekly × 4”
                    usually understates the monthly equivalent when you are
                    converting a weekly rent figure into PCM.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Best for comparing listings
                      </div>
                      <p className="mt-2">
                        Use PCM (365 ÷ 12) when you are comparing to monthly
                        budgets or monthly-listed prices from other sources.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Best for payment-cadence checks
                      </div>
                      <p className="mt-2">
                        Weekly × 52 is a quick way to sanity-check an annual
                        total when thinking in payments per year.
                      </p>
                    </div>
                  </div>

                  <p>
                    Real-world note: in Australia you may pay weekly or
                    fortnightly even if you budget monthly. This tool is for
                    comparison and planning, not for predicting your exact bill
                    in a specific calendar month.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: step-by-step + rounding + printing + related */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm transition hover:ring-sky-200/80">
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      How it works
                    </h3>
                  </div>
                </div>

                <div className="mt-4">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong className="text-slate-900">
                        You enter a weekly rent amount (pw).
                      </strong>{" "}
                      Use the weekly figure from the Australian listing or lease
                      offer. The tool does not add utilities, parking, internet,
                      one-off fees, deposits/bond, or proration.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Weekly is converted to a daily equivalent.
                      </strong>{" "}
                      Daily = weekly ÷ 7. This creates a 1-day basis that makes
                      it easy to compare periods consistently.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Annual equivalence is derived from days.
                      </strong>{" "}
                      Annual = daily × 365. The annual total becomes the shared
                      reference for every other period shown on the page.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Monthly (PCM) is derived from annual.
                      </strong>{" "}
                      Monthly = annual ÷ 12, which corresponds to an average
                      calendar-month length of 365 ÷ 12 days.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Decimals are preserved; rounding is display-only.
                      </strong>{" "}
                      The calculator carries decimals through the math. If
                      rounding is enabled, it only affects formatting, not the
                      underlying calculation.
                    </li>
                  </ol>
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
