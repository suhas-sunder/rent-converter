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
                  Rent per paycheck calculator (Canada)
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page answers one Canada-specific budgeting question:{" "}
                  <span className="font-semibold text-slate-900">
                    how much rent should you set aside from each paycheck so
                    your monthly rent is covered?
                  </span>{" "}
                  It converts your monthly rent into a per-pay amount using your
                  pay schedule. In Canada that’s commonly{" "}
                  <span className="font-semibold text-slate-900">
                    biweekly (26)
                  </span>
                  ,{" "}
                  <span className="font-semibold text-slate-900">
                    semi-monthly (24)
                  </span>
                  ,{" "}
                  <span className="font-semibold text-slate-900">
                    weekly (52)
                  </span>
                  , or{" "}
                  <span className="font-semibold text-slate-900">
                    monthly (12)
                  </span>{" "}
                  paycheques per year. The result is a planning number you can
                  automate into a separate rent account.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  26 = biweekly
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  24 = semi-monthly
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly rent
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  PAY SCHEDULE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  52 / 26 / 24 / 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  FORMULA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  (rent × 12) ÷ pays
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent per paycheque
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
                    Canada pay schedule examples you can sanity-check
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  Most Canadian leases are paid monthly, but a lot of Canadians
                  are paid biweekly or semi-monthly. These quick checks show why
                  the{" "}
                  <span className="font-semibold text-slate-900">
                    same monthly rent
                  </span>{" "}
                  becomes a different{" "}
                  <span className="font-semibold text-slate-900">
                    per-paycheque
                  </span>{" "}
                  amount depending on whether you get{" "}
                  <span className="font-semibold text-slate-900">26</span> or{" "}
                  <span className="font-semibold text-slate-900">24</span>{" "}
                  paycheques a year.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Monthly rent{" "}
                    <strong className="text-slate-900">$2,000</strong>, paid{" "}
                    <strong className="text-slate-900">biweekly (26)</strong>:
                    annual rent = $2,000 × 12 ={" "}
                    <strong className="text-slate-900">$24,000</strong> → per
                    paycheque ={" "}
                    <strong className="text-slate-900">
                      $24,000 ÷ 26 = $923.08
                    </strong>
                    .
                  </li>
                  <li>
                    Same rent <strong className="text-slate-900">$2,000</strong>
                    , paid{" "}
                    <strong className="text-slate-900">
                      semi-monthly (24)
                    </strong>
                    : per paycheque ={" "}
                    <strong className="text-slate-900">
                      $24,000 ÷ 24 = $1,000
                    </strong>
                    . Semi-monthly is higher because there are fewer paycheques
                    in a year.
                  </li>
                  <li>
                    Monthly rent{" "}
                    <strong className="text-slate-900">$1,650</strong>, paid{" "}
                    <strong className="text-slate-900">weekly (52)</strong>:
                    annual = $19,800 → per week set-aside ={" "}
                    <strong className="text-slate-900">
                      $19,800 ÷ 52 = $380.77
                    </strong>
                    .
                  </li>
                  <li>
                    If you’re paid biweekly, remember you’ll usually get{" "}
                    <strong className="text-slate-900">
                      two “extra” paycheques
                    </strong>{" "}
                    each year compared with a twice-a-month schedule. Many
                    people use those to catch up on savings, cover moving costs,
                    or build a buffer for higher winter utility months.
                  </li>
                </ul>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
                    Input formats supported
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    <li>
                      Decimals: <strong className="text-slate-900">2000</strong>
                      , <strong className="text-slate-900">2000.00</strong>,{" "}
                      <strong className="text-slate-900">.5</strong>,{" "}
                      <strong className="text-slate-900">12.</strong>
                    </li>
                    <li>
                      Thousands grouping:{" "}
                      <strong className="text-slate-900">1,950</strong>,{" "}
                      <strong className="text-slate-900">1,950.50</strong>
                    </li>
                    <li>
                      Currency symbols are ignored for parsing:{" "}
                      <strong className="text-slate-900">$1,950.50</strong>,{" "}
                      <strong className="text-slate-900">C$1,950.50</strong>
                    </li>
                  </ul>
                </div>

                <p>
                  If your rent is due on the 1st but your pay dates don’t line
                  up, the per-paycheque number still works. You’re building a
                  rent fund across paydays so the full amount is ready when it’s
                  due.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="mt-2">
              If your rent is listed in a different period than how you budget,
              these pages help you translate it.
            </p>

            <p className="text-slate-700 leading-relaxed">
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
              </Link>{" "}
              converts between weekly, 4-weekly, monthly, and annual amounts,{" "}
              <Link
                to="/rent-affordability-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent affordability calculator
              </Link>{" "}
              helps you check the rent against income, and{" "}
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>{" "}
              explains why “× 4” can mislead when comparing time periods.
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
                      What this calculator returns
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    You enter your{" "}
                    <span className="font-semibold text-slate-900">
                      monthly rent
                    </span>{" "}
                    and select how often you’re paid. The tool returns a{" "}
                    <span className="font-semibold text-slate-900">
                      rent-per-paycheque
                    </span>{" "}
                    amount that adds up to the same annual rent. It’s meant for
                    budgeting and automating transfers, not for changing your
                    lease terms.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule (Canada)
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Rent per paycheque
                      </span>{" "}
                      = (monthly rent × 12) ÷ paycheques per year
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Typical paycheque counts: weekly = 52, biweekly = 26,
                      semi-monthly = 24, monthly = 12.
                    </p>
                  </div>

                  <p>
                    If you’re paid biweekly, the per-pay amount can feel
                    “lighter” because you’re spreading the same annual rent over
                    more paydays than semi-monthly.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: key mismatch (26 vs 24) */}
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
                      Biweekly vs semi-monthly in Canada (26 vs 24)
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    This is the most common Canadian budgeting mistake: treating{" "}
                    <span className="font-semibold text-slate-900">
                      biweekly pay
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-slate-900">
                      semi-monthly pay
                    </span>{" "}
                    as interchangeable. They’re not.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong className="text-slate-900">Biweekly</strong> means
                      every two weeks:{" "}
                      <strong className="text-slate-900">26</strong> paycheques
                      a year.
                    </li>
                    <li>
                      <strong className="text-slate-900">Semi-monthly</strong>{" "}
                      means twice per month on set dates:{" "}
                      <strong className="text-slate-900">24</strong> paycheques
                      a year.
                    </li>
                  </ul>

                  <p>
                    If you choose 24 when you’re actually paid 26 times, you’ll
                    over-save each paycheque. If you choose 26 when you’re
                    actually paid 24 times, you can come up short when rent is
                    due.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: step-by-step */}
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
                        Enter your monthly rent.
                      </strong>{" "}
                      Use the rent amount you actually owe each month (before
                      utilities and optional extras).
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Choose your pay schedule.
                      </strong>{" "}
                      Pick the option that matches how often you receive wages
                      (weekly, biweekly, semi-monthly, or monthly).
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert to an annual rent total.
                      </strong>{" "}
                      Annual rent = monthly × 12. This keeps the math anchored
                      to the same yearly cost.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Divide by paycheques per year.
                      </strong>{" "}
                      Per-pay amount = annual ÷ paycheques. That number is what
                      you can move into a rent fund each pay.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Use it for cash flow, not billing.
                      </strong>{" "}
                      The output is for planning. Your landlord still bills on
                      your lease schedule (usually monthly).
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
