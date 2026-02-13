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
                  180 per week to monthly rent
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  If a listing says{" "}
                  <span className="font-semibold text-slate-900">
                    180 per week
                  </span>{" "}
                  and you budget by month, this page turns that weekly figure
                  into a{" "}
                  <span className="font-semibold text-slate-900">
                    per-calendar-month (PCM)
                  </span>{" "}
                  equivalent. The point is a like-for-like comparison: weekly
                  prices are based on{" "}
                  <span className="font-semibold text-slate-900">7-day</span>{" "}
                  blocks, while a calendar month averages{" "}
                  <span className="font-semibold text-slate-900">
                    365 ÷ 12 days
                  </span>{" "}
                  (about 30.42). Using a{" "}
                  <span className="font-semibold text-slate-900">
                    365-day year
                  </span>{" "}
                  keeps the monthly result and the breakdown aligned to the same
                  annual cost.
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
                  180 per week
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual equivalence
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  FORMULA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  180 × 365 ÷ (7 × 12)
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  PCM + 4-week check
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
                    180 per week: quick checks and real comparisons
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  People land on this route because they already have a weekly
                  figure in mind:{" "}
                  <span className="font-semibold text-slate-900">
                    180 per week
                  </span>
                  . These checks help you compare it to monthly listings and
                  also explain why “× 4” is not the same as a calendar-month
                  equivalent.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Monthly equivalent for{" "}
                    <strong className="text-slate-900">180 per week</strong>:{" "}
                    <strong className="text-slate-900">
                      180 × 365 ÷ (7 × 12) = 782.11 per calendar month
                    </strong>
                    . Use this when your budget is monthly and the listing is
                    weekly.
                  </li>
                  <li>
                    The common shortcut is{" "}
                    <strong className="text-slate-900">180 × 4 = 720</strong>.
                    That number is a{" "}
                    <span className="font-semibold text-slate-900">28-day</span>{" "}
                    cycle, not a calendar month. The gap is about{" "}
                    <strong className="text-slate-900">
                      782.11 − 720 = 62.11 per month
                    </strong>{" "}
                    on an average-month basis.
                  </li>
                  <li>
                    If you’re comparing against a monthly cap of{" "}
                    <strong className="text-slate-900">800</strong>, then{" "}
                    <strong className="text-slate-900">180 per week</strong>{" "}
                    converts to{" "}
                    <strong className="text-slate-900">782.11 pcm</strong>,
                    leaving roughly{" "}
                    <span className="font-semibold text-slate-900">17.89</span>{" "}
                    of headroom for rent-only (before bills and fees).
                  </li>
                  <li>
                    Annual context for planning:{" "}
                    <strong className="text-slate-900">
                      (180 ÷ 7) × 365 = 9,385.71 per year
                    </strong>
                    . This is useful when you’re checking rent against an annual
                    income target or a yearly budget.
                  </li>
                  <li>
                    If the listing includes cents (for example, a prorated or
                    discounted rate), this page keeps the decimals in the math.
                    Rounding, if shown, is display-only.
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
                  If a number could be interpreted more than one way, it’s
                  better to correct the input format than to trust an output
                  that “looks right.” For weekly listings, enter the weekly
                  amount exactly as shown (including any decimals).
                </p>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="mt-2">
              If you’re comparing the same rental across different pricing
              cycles, these pages help you avoid redoing the math.
            </p>

            <p className="text-slate-700 leading-relaxed">
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>{" "}
              explains why “per week” and “per calendar month” don’t line up by
              simply multiplying by 4,{" "}
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
              helps you check whether a monthly-equivalent number fits your
              income and budget.{" "}
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
                      What this converter returns for 180 per week
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Enter{" "}
                    <span className="font-semibold text-slate-900">
                      180 per week
                    </span>{" "}
                    (or adjust it if the listing changes) and the tool returns a{" "}
                    <span className="font-semibold text-slate-900">
                      monthly equivalent (PCM)
                    </span>{" "}
                    that represents the same annual cost under a 365-day model.
                    This is a comparison number. It helps you answer: “If I pay
                    180 each week, what is that in monthly terms when I compare
                    to PCM listings?”
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule used on this route
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Monthly equivalent
                      </span>{" "}
                      = weekly × 365 ÷ (7 × 12)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Same idea stepwise: daily = weekly ÷ 7 → annual = daily ×
                      365 → monthly = annual ÷ 12.
                    </p>
                  </div>

                  <p>
                    The breakdown table is derived from the same annual basis,
                    so the 4-week (28-day) figure, the biweekly figure, and the
                    monthly equivalent are all consistent with each other rather
                    than being mixed from different shortcuts.
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
                      Why 180 × 4 is not “monthly”
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    A lot of people do a fast mental check:{" "}
                    <span className="font-semibold text-slate-900">
                      180 × 4
                    </span>
                    . That gives a{" "}
                    <span className="font-semibold text-slate-900">4-week</span>{" "}
                    total, which is 28 days. A calendar month is longer on
                    average, so a weekly-to-monthly converter should use an
                    annual basis rather than assume every month is “four weeks.”
                  </p>

                  <p>
                    This page defines a month as the average calendar month
                    length of{" "}
                    <span className="font-semibold text-slate-900">
                      365 ÷ 12 days
                    </span>
                    . That is why the monthly equivalent for a weekly amount
                    usually comes out higher than weekly × 4.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Best for comparing listings
                      </div>
                      <p className="mt-2">
                        If you’re comparing a weekly ad to a PCM ad, an annual
                        basis keeps both on the same time scale.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Good for quick sanity checks
                      </div>
                      <p className="mt-2">
                        Weekly × 52 gives a fast annual estimate, but it’s a
                        payment cadence shortcut, not a definition of PCM.
                      </p>
                    </div>
                  </div>

                  <p>
                    Practical note: some rentals collect weekly or every 4 weeks
                    even when an ad uses monthly language. This tool is designed
                    to compare price levels, not to predict your exact
                    calendar-month cash flow.
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
                      How it works (step-by-step)
                    </h3>
                  </div>
                </div>

                <div className="mt-4">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong className="text-slate-900">
                        Start with the weekly figure.
                      </strong>{" "}
                      Use the advertised weekly rent (here, 180 per week). This
                      tool does not include utilities, one-off fees, deposits,
                      or proration.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert weekly to daily.
                      </strong>{" "}
                      Daily = weekly ÷ 7. This makes every other period
                      comparable by day count.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert daily to annual.
                      </strong>{" "}
                      Annual = daily × 365. The annual total is the single
                      source of truth for the rest of the breakdown.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert annual to monthly (PCM).
                      </strong>{" "}
                      Monthly = annual ÷ 12, matching an average month length of
                      365 ÷ 12 days.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Display rounding is optional.
                      </strong>{" "}
                      The calculation keeps decimals through the math. If
                      rounding is enabled, it changes formatting only.
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
