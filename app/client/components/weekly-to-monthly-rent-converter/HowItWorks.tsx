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
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                  Weekly to monthly rent conversion
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a weekly rent amount into a monthly
                  equivalent using a fixed time-length model. Weekly is treated
                  as{" "}
                  <span className="font-semibold text-slate-900">7 days</span>.
                  A “month” here is an average month length of{" "}
                  <span className="font-semibold text-slate-900">
                    365 ÷ 12 days
                  </span>
                  . The conversion is computed through a{" "}
                  <span className="font-semibold text-slate-900">
                    365-day year
                  </span>{" "}
                  so the headline value and the breakdown stay consistent.
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
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  365-day year
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  FORMULA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  weekly × 365 ÷ (7 × 12)
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly + breakdown
                </div>
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
                    You enter a weekly rent amount and the tool returns a
                    monthly equivalent that represents the same annual cost
                    under a 365-day model. It is an{" "}
                    <span className="font-semibold text-slate-900">
                      equivalent
                    </span>{" "}
                    value, not a billing rule. If your listing is weekly but
                    your budget is monthly, this gives you one number you can
                    compare against monthly-advertised options without treating
                    a month as “4 weeks.”
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
                    The breakdown table (daily, biweekly, 4-week, monthly,
                    annual, and sometimes hourly) is derived from the same
                    annual basis. That matters when you’re comparing across
                    listings that mix weekly, 28-day cycles, and monthly
                    pricing.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: what “monthly” means here + common mismatch */}
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
                      What “monthly” means here (and why it can differ from “×
                      4”)
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    This page defines a month as an{" "}
                    <span className="font-semibold text-slate-900">
                      average
                    </span>{" "}
                    month length: 365 ÷ 12 days. It does not assume that a month
                    is 28 days or 30 days. That’s the point of using an annual
                    basis: it keeps “monthly” anchored to a consistent year
                    rather than whichever shortcut happens to be used.
                  </p>

                  <p>
                    The most common mismatch is treating “every 4 weeks” as
                    monthly. A 4-week period is exactly{" "}
                    <span className="font-semibold text-slate-900">
                      28 days
                    </span>
                    . A month is longer on average. Those are different time
                    lengths, and the implied annual totals can drift apart when
                    you compare listings side by side.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Time-length equivalence
                      </div>
                      <p className="mt-2">
                        Uses day counts (7, 14, 28, 365, 365 ÷ 12) so every
                        period is derived from the same base.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Payment-count shortcut
                      </div>
                      <p className="mt-2">
                        Weekly × 52 can be useful as context for some leases,
                        but it is a schedule framing, not the only reasonable
                        basis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: examples + input handling */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    These examples follow the exact rule used by the calculator.
                    If the UI is set to display fewer decimals, the formatted
                    number can look slightly different, but the conversion basis
                    is the same.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Weekly rent{" "}
                      <strong className="text-slate-900">$500</strong> → monthly
                      equivalent{" "}
                      <strong className="text-slate-900">
                        $500 × 365 ÷ (7 × 12) ≈ $2,172.62
                      </strong>
                    </li>
                    <li>
                      Weekly rent{" "}
                      <strong className="text-slate-900">$625.75</strong> →
                      monthly equivalent{" "}
                      <strong className="text-slate-900">
                        $625.75 × 365 ÷ (7 × 12) ≈ $2,719.14
                      </strong>{" "}
                      (decimals stay part of the calculation)
                    </li>
                    <li>
                      Input <strong className="text-slate-900">1,234</strong> →
                      comma is treated as thousands grouping (1234). If you
                      meant a decimal, use{" "}
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
                    If an input could reasonably be interpreted more than one
                    way, the safe behavior is to warn or block instead of
                    guessing and producing a neat-looking result that’s wrong.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: step-by-step + rounding + printing + related */}
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
                    <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                      How it works (exactly)
                    </h3>
                  </div>
                </div>

                <div className="mt-4">
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong className="text-slate-900">
                        You enter a weekly rent amount.
                      </strong>{" "}
                      This should be the weekly figure you want converted. The
                      tool does not add fees, utilities, deposits, taxes, or
                      proration.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Weekly is converted to a daily equivalent.
                      </strong>{" "}
                      Daily = weekly ÷ 7. This sets a clear 1-day basis.
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
                        Monthly is derived from annual.
                      </strong>{" "}
                      Monthly = annual ÷ 12, which corresponds to an average
                      month length of 365 ÷ 12 days.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Decimals are preserved; rounding is display-only.
                      </strong>{" "}
                      The calculator should carry decimals through the math (up
                      to the internal precision limit). If rounding is enabled,
                      it only changes formatting, not the underlying
                      calculation.
                    </li>
                  </ol>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Related tools
                      </div>
                      <p className="mt-2">
                        If you’re comparing the same listing in other cycles,
                        these pages are faster than reworking inputs.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <Link
                          to="/rent-paid-weekly-vs-monthly"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          Weekly vs monthly rent →
                        </Link>
                        <Link
                          to="/rent-converter"
                          className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                        >
                          Rent converter →
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Printing
                      </div>
                      <p className="mt-2">
                        You can print the results and save as a PDF from your
                        browser. This section is marked{" "}
                        <span className="font-semibold text-slate-900">
                          no-print
                        </span>{" "}
                        so it doesn’t clutter the output.
                      </p>
                    </div>
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
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                  Equivalent monthly is not a calendar due-date schedule
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  This conversion expresses the same cost in a monthly unit
                  under a 365-day model. It does not tell you which dates rent
                  is due or how many payments land in a specific calendar month.
                  If you need a due date list over a horizon, use the due-date
                  calculator instead of relying on period equivalents.
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

            <p className="text-slate-700 leading-relaxed">
              Related pages:{" "}
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>
              ,{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
              </Link>
              , and{" "}
              <Link
                to="/rent-affordability-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent affordability calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
