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
                  500 per week to monthly rent
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This route answers one specific lookup:{" "}
                  <span className="font-semibold text-slate-900">
                    what does 500 per week equal per calendar month (PCM)?
                  </span>{" "}
                  Use it when a listing is priced weekly but your budget, pay
                  cycle, or comparisons are monthly. Weekly is treated as{" "}
                  <span className="font-semibold text-slate-900">7 days</span>.
                  “Monthly” here means an average calendar month of{" "}
                  <span className="font-semibold text-slate-900">
                    365 ÷ 12 days
                  </span>{" "}
                  (about 30.42 days). The calculator uses a{" "}
                  <span className="font-semibold text-slate-900">
                    365-day year
                  </span>{" "}
                  so the monthly-equivalent and the breakdown stay consistent
                  with the same annual total.
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
                  500 per week
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
                  500 × 365 ÷ (7 × 12)
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
                    The 500/week conversion, shown in practical checks
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  People hit this page when they’re staring at a weekly price
                  and need a single monthly number that lines up with a calendar
                  budget. Here are quick cross-checks for{" "}
                  <span className="font-semibold text-slate-900">
                    500 per week
                  </span>{" "}
                  so you can trust the monthly-equivalent and understand why it
                  won’t match “× 4”.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-slate-900">
                      Calendar-month (PCM) equivalent:
                    </strong>{" "}
                    <strong className="text-slate-900">
                      500 × 365 ÷ (7 × 12) = 2,172.62 per month
                    </strong>
                    . This is the monthly-equivalent that matches the same
                    annual cost (365-day year) and is the best number for
                    comparing against monthly listings or a monthly cap.
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      4-week shortcut (not PCM):
                    </strong>{" "}
                    <strong className="text-slate-900">500 × 4 = 2,000</strong>.
                    That’s a 28-day cycle. The gap between the true
                    calendar-month equivalent and the 4-week shortcut is{" "}
                    <span className="font-semibold text-slate-900">172.62</span>{" "}
                    per month-equivalent.
                  </li>
                  <li>
                    <strong className="text-slate-900">Annual anchor:</strong>{" "}
                    daily = 500 ÷ 7, annual = daily × 365, so{" "}
                    <strong className="text-slate-900">
                      (500 ÷ 7) × 365 = 26,071.43 per year
                    </strong>
                    . Divide by 12 to land back at the same PCM figure.
                  </li>
                </ul>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
                    Input formats supported
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    <li>
                      Decimals: <strong className="text-slate-900">500</strong>,{" "}
                      <strong className="text-slate-900">500.00</strong>,{" "}
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
                      <strong className="text-slate-900">$500</strong>,{" "}
                      <strong className="text-slate-900">$1,200.50</strong>
                    </li>
                  </ul>
                </div>

                <p>
                  If you’re comparing places, use the PCM number as the clean
                  baseline, then separately confirm what’s included (utilities,
                  parking, internet) and whether the lease actually charges
                  weekly, 4-weekly, or monthly.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="mt-2">
              If you keep bouncing between weekly ads and monthly budgets, these
              pages cover the common follow-up questions.
            </p>

            <p className="text-slate-700 leading-relaxed">
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>{" "}
              explains the calendar-month mismatch,{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
              </Link>{" "}
              helps switch between periods, and{" "}
              <Link
                to="/rent-affordability-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent affordability calculator
              </Link>{" "}
              helps you test whether the monthly-equivalent fits your budget.{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                Rent converter →
              </Link>
            </p>
          </div>

          <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
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
                      What this page gives you
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The headline result is the{" "}
                    <span className="font-semibold text-slate-900">
                      monthly-equivalent of 500 per week (PCM)
                    </span>{" "}
                    based on the same annual cost. Everything else in the
                    breakdown (daily, 2-week, 4-week, monthly, annual) is
                    derived from that one annual anchor so the numbers don’t
                    contradict each other.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule used for 500/week
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Monthly equivalent
                      </span>{" "}
                      = 500 × 365 ÷ (7 × 12)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Stepwise: daily = 500 ÷ 7 → annual = daily × 365 → monthly
                      = annual ÷ 12.
                    </p>
                  </div>

                  <p>
                    Use this when you’re comparing a weekly listing to a monthly
                    budget, checking what 500/week “really means” per calendar
                    month, or reconciling a weekly ad with monthly cash flow.
                  </p>
                </div>
              </div>
            </div>

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
                      Why “500 × 4” underestimates a calendar month
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    If you multiply by 4, you’re converting to{" "}
                    <span className="font-semibold text-slate-900">
                      4 weeks (28 days)
                    </span>
                    . A calendar month averages about 30.42 days, so the true
                    monthly-equivalent for a weekly listing is usually higher
                    than the 4-week shortcut.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Use PCM for comparisons
                      </div>
                      <p className="mt-2">
                        If your budget and competing listings are monthly, PCM
                        is the apples-to-apples number.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Use weekly × 52 for a quick annual check
                      </div>
                      <p className="mt-2">
                        It’s a fast sanity-check on annual spend, but it’s not
                        the same thing as “per calendar month.”
                      </p>
                    </div>
                  </div>

                  <p>
                    This page is intentionally focused on comparison math, not
                    on predicting the exact timing of payments in any specific
                    month.
                  </p>
                </div>
              </div>
            </div>

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
                        Start with the weekly figure.
                      </strong>{" "}
                      This route is centered on 500 per week, but the same rule
                      applies to any weekly amount shown in a listing.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert weekly to daily.
                      </strong>{" "}
                      Daily = weekly ÷ 7.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert daily to an annual total.
                      </strong>{" "}
                      Annual = daily × 365. That annual total becomes the shared
                      reference for the rest of the breakdown.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert annual to a calendar-month equivalent.
                      </strong>{" "}
                      Monthly (PCM) = annual ÷ 12, matching an average month of
                      365 ÷ 12 days.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Decimals are preserved; rounding is display-only.
                      </strong>{" "}
                      If rounding is enabled in the UI, it only changes how the
                      numbers are shown, not the underlying calculation.
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
