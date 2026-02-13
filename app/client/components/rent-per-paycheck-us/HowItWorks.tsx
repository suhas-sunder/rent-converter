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
                  Rent per paycheck in the US
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  If you get paid every week, every two weeks, twice a month, or
                  monthly, this page converts your{" "}
                  <span className="font-semibold text-slate-900">
                    monthly rent
                  </span>{" "}
                  into a{" "}
                  <span className="font-semibold text-slate-900">
                    per-paycheck amount
                  </span>{" "}
                  so you can plan bills around payday. It’s built for US pay
                  schedules where “biweekly” (26 paychecks/year) and
                  “semi-monthly” (24 paychecks/year) are commonly confused. The
                  goal is a clean, repeatable number for budgeting, not a lease
                  billing rule.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 26 checks
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Semi-monthly = 24 checks
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly rent + pay schedule
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Paychecks per year
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  FORMULA
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  monthly × 12 ÷ checks
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  OUTPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent per paycheck
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
                    Examples you can sanity-check
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  In the US, “rent per paycheck” is usually a cash-flow
                  question: how much do you set aside each payday so rent is
                  covered when it’s due. The tool converts monthly rent to an
                  annual total, then spreads it across your paychecks. If the UI
                  shows fewer decimals, the displayed number may be rounded, but
                  the underlying math is the same.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    If rent is{" "}
                    <strong className="text-slate-900">$2,400/month</strong> and
                    you’re paid{" "}
                    <strong className="text-slate-900">biweekly</strong> (26
                    paychecks/year), rent per paycheck is{" "}
                    <strong className="text-slate-900">
                      $2,400 × 12 ÷ 26 = $1,107.69
                    </strong>
                    . This is why biweekly feels “lighter” than twice-monthly:
                    you get two extra paychecks each year.
                  </li>
                  <li>
                    If rent is{" "}
                    <strong className="text-slate-900">$2,400/month</strong> and
                    you’re paid{" "}
                    <strong className="text-slate-900">semi-monthly</strong> (24
                    paychecks/year), rent per paycheck is{" "}
                    <strong className="text-slate-900">
                      $2,400 × 12 ÷ 24 = $1,200.00
                    </strong>
                    . Same rent, different paycheck count.
                  </li>
                  <li>
                    If rent is{" "}
                    <strong className="text-slate-900">$1,800/month</strong> and
                    you’re paid{" "}
                    <strong className="text-slate-900">weekly</strong> (52
                    paychecks/year), rent per paycheck is{" "}
                    <strong className="text-slate-900">
                      $1,800 × 12 ÷ 52 = $415.38
                    </strong>
                    . This pairs well with “pay yourself first” budgeting where
                    you auto-transfer a set amount every payday.
                  </li>
                  <li>
                    If you’re paid{" "}
                    <strong className="text-slate-900">monthly</strong> (12
                    paychecks/year), rent per paycheck is basically the same as
                    monthly rent:{" "}
                    <strong className="text-slate-900">
                      $2,050 × 12 ÷ 12 = $2,050
                    </strong>
                    . The tool still helps if you want the annual number and a
                    consistent breakdown.
                  </li>
                </ul>

                <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-slate-900">
                    Input formats supported
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    <li>
                      Decimals: <strong className="text-slate-900">2400</strong>
                      , <strong className="text-slate-900">2400.50</strong>,{" "}
                      <strong className="text-slate-900">.5</strong>,{" "}
                      <strong className="text-slate-900">12.</strong>
                    </li>
                    <li>
                      Thousands grouping:{" "}
                      <strong className="text-slate-900">2,400</strong>,{" "}
                      <strong className="text-slate-900">2,400.50</strong>
                    </li>
                    <li>
                      Currency symbols are ignored for parsing:{" "}
                      <strong className="text-slate-900">$2,400.50</strong>
                    </li>
                  </ul>
                </div>

                <p>
                  Practical tip: if you’re biweekly, those two “extra” paychecks
                  in some months are a good time to catch up on savings or
                  smooth out large expenses. This page focuses on a consistent
                  per-check allocation so rent doesn’t spike your cash flow.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="mt-2">
              If you’re moving between rent periods or trying to check
              affordability from different angles, these pages help.
            </p>

            <p className="text-slate-700 leading-relaxed">
              <Link
                to="/rent-affordability-calculator"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent affordability calculator
              </Link>{" "}
              helps you gauge whether a monthly rent is realistic for your
              income,{" "}
              <Link
                to="/rent-converter"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                rent converter
              </Link>{" "}
              switches between common rent periods, and{" "}
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>{" "}
              explains why different time bases can make prices look misleading.{" "}
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
                      What this page gives you
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Enter your monthly rent and choose a US pay schedule. The
                    tool returns a{" "}
                    <span className="font-semibold text-slate-900">
                      rent-per-paycheck
                    </span>{" "}
                    number that matches the same annual rent total. This is for
                    planning transfers and cash flow, not for rewriting how your
                    landlord bills you.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Rent per paycheck
                      </span>{" "}
                      = monthly rent × 12 ÷ (paychecks per year)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Paychecks per year are typically: weekly = 52, biweekly =
                      26, semi-monthly = 24, monthly = 12.
                    </p>
                  </div>

                  <p>
                    The breakdown is useful when you’re comparing offers or
                    trying to decide whether to allocate rent from one paycheck
                    or split it across two. The tool keeps the math consistent
                    so you can budget with a fixed rule.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: biweekly vs semi-monthly */}
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
                      Biweekly vs semi-monthly in the US
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    These two pay schedules sound similar, but they produce
                    different per-check rent numbers because the paycheck count
                    is different.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Biweekly (every 2 weeks)
                      </div>
                      <p className="mt-2">
                        <span className="font-semibold text-slate-900">
                          26 paychecks per year
                        </span>
                        . Two months each year will have three paychecks.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Semi-monthly (twice a month)
                      </div>
                      <p className="mt-2">
                        <span className="font-semibold text-slate-900">
                          24 paychecks per year
                        </span>
                        . Paydays are often fixed dates (like the 15th and last
                        day).
                      </p>
                    </div>
                  </div>

                  <p>
                    If you pick the wrong schedule, your per-paycheck rent
                    target will be off. This page makes the difference explicit
                    so your budget doesn’t drift over time.
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
                      Use your rent-only number (before utilities, parking,
                      internet, fees, or deposits).
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Choose your US pay schedule.
                      </strong>{" "}
                      Weekly (52), biweekly (26), semi-monthly (24), or monthly
                      (12).
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert monthly to annual rent.
                      </strong>{" "}
                      Annual = monthly × 12. This becomes the common reference
                      point.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Spread annual rent across paychecks.
                      </strong>{" "}
                      Rent per paycheck = annual ÷ paychecks per year.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Decimals are preserved; rounding is display-only.
                      </strong>{" "}
                      If rounding is enabled, it only changes formatting, not
                      the underlying calculation.
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
