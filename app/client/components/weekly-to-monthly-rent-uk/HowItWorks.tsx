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
                  Weekly to monthly rent conversion (UK)
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  In the UK you’ll often see rent quoted{" "}
                  <span className="font-semibold text-slate-900">per week</span>{" "}
                  (especially in room shares and some older listings), while
                  your budget, bills, and salary are usually monthly. This page
                  converts a weekly figure into a{" "}
                  <span className="font-semibold text-slate-900">
                    per-calendar-month (PCM)
                  </span>{" "}
                  equivalent so you can compare weekly ads with monthly listings
                  on the same time basis. Weekly is treated as{" "}
                  <span className="font-semibold text-slate-900">7 days</span>.
                  “Monthly” here means the average calendar month length of{" "}
                  <span className="font-semibold text-slate-900">
                    365 ÷ 12 days
                  </span>{" "}
                  (about 30.42 days). Using a{" "}
                  <span className="font-semibold text-slate-900">
                    365-day year
                  </span>{" "}
                  keeps the PCM headline and the breakdown consistent.
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
                    UK examples people actually check
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  UK renters typically use a weekly-to-PCM conversion for three
                  things: comparing a weekly room ad to a monthly studio
                  listing, matching rent to a monthly pay cycle, and spotting
                  when a “× 4” shortcut is understating the monthly cost. The
                  examples below follow the same rule used by this tool. If the
                  UI shows fewer decimals, the displayed PCM may be rounded, but
                  the underlying calculation stays consistent.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    A room is listed at{" "}
                    <strong className="text-slate-900">£185 per week</strong>{" "}
                    and you want to compare it to a{" "}
                    <strong className="text-slate-900">£800 pcm</strong> budget.
                    Convert it:{" "}
                    <strong className="text-slate-900">
                      £185 × 365 ÷ (7 × 12) = £804.76 pcm
                    </strong>
                    . That’s slightly over an £800 rent-only cap before things
                    like council tax, bills, or internet.
                  </li>
                  <li>
                    You’re choosing between{" "}
                    <strong className="text-slate-900">£250 pw</strong> and{" "}
                    <strong className="text-slate-900">£1,050 pcm</strong>.
                    Weekly to PCM:{" "}
                    <strong className="text-slate-900">
                      £250 × 365 ÷ (7 × 12) = £1,086.31 pcm
                    </strong>
                    . On a like-for-like basis, the £250 pw option is about{" "}
                    <span className="font-semibold text-slate-900">£36.31</span>{" "}
                    higher per calendar month.
                  </li>
                  <li>
                    The “quick” method says{" "}
                    <strong className="text-slate-900">
                      £300 pw × 4 = £1,200
                    </strong>
                    . But that’s a 28-day cycle, not a calendar month. True PCM:{" "}
                    <strong className="text-slate-900">
                      £300 × 365 ÷ (7 × 12) = £1,303.57 pcm
                    </strong>
                    . That gap matters when you’re setting a monthly spending
                    limit.
                  </li>
                  <li>
                    If a letting agent quotes a weekly figure and you want an
                    annual sanity-check:{" "}
                    <strong className="text-slate-900">
                      annual = (weekly ÷ 7) × 365
                    </strong>{" "}
                    and PCM = annual ÷ 12. This is useful when you’re comparing
                    rent to annual income or running affordability numbers.
                  </li>
                  <li>
                    If your weekly rent includes pence (common with pro-rata or
                    discount adjustments), the tool keeps decimals in the math.
                    For example:{" "}
                    <strong className="text-slate-900">£412.50 pw</strong>{" "}
                    converts cleanly using the same PCM rule, without dropping
                    precision.
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
                      <strong className="text-slate-900">£1,200.50</strong>
                    </li>
                  </ul>
                </div>

                <p>
                  Use the PCM number for comparison, then separately check
                  what’s included (bills, council tax, parking) and the actual
                  payment cadence (weekly, monthly, or something else). This
                  page is a conversion tool, not a lease schedule predictor.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="mt-2">
              If you’re comparing rents across different pricing cycles, these
              pages help you avoid redoing the math.
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
                    Enter a weekly rent amount and the tool returns a{" "}
                    <span className="font-semibold text-slate-900">
                      monthly equivalent (PCM)
                    </span>{" "}
                    representing the same annual cost under a 365-day model.
                    It’s an{" "}
                    <span className="font-semibold text-slate-900">
                      equivalence for comparison
                    </span>{" "}
                    (useful for browsing Rightmove/Zoopla style monthly listings
                    while you’re holding a weekly figure), not a rule about how
                    a landlord must bill you.
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
                      Same idea, stepwise: daily = weekly ÷ 7 → annual = daily ×
                      365 → monthly = annual ÷ 12.
                    </p>
                  </div>

                  <p>
                    The breakdown (daily, biweekly, 4-week, monthly, annual) is
                    derived from the same annual basis. That matters when one ad
                    says “pw”, another says “pcm”, and you want a fair
                    comparison.
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
                    On this page, “monthly” means an{" "}
                    <span className="font-semibold text-slate-900">
                      average calendar month
                    </span>{" "}
                    (365 ÷ 12 days). It does not assume 28, 30, or 31 days.
                    Using an annual basis keeps the PCM anchored to a consistent
                    year, which is what you want when comparing listings.
                  </p>

                  <p>
                    The most common UK mistake is treating “every 4 weeks” as
                    “monthly.” A 4-week period is{" "}
                    <span className="font-semibold text-slate-900">
                      28 days
                    </span>
                    . A calendar month is longer on average, so{" "}
                    <span className="font-semibold text-slate-900">
                      weekly × 4
                    </span>{" "}
                    will usually come out lower than the true PCM equivalent.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Best for comparing ads
                      </div>
                      <p className="mt-2">
                        Use PCM when you’re comparing weekly room ads to monthly
                        listings and monthly budgets.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Best for payment cadence
                      </div>
                      <p className="mt-2">
                        Use weekly × 52 as a quick annual sanity-check when
                        you’re thinking in “payments per year.”
                      </p>
                    </div>
                  </div>

                  <p>
                    Practical note: some tenancies advertise one cadence but
                    collect another (weekly, fortnightly, monthly, or fixed due
                    dates). This tool is for comparison and budgeting, not
                    predicting the exact cashflow in a specific calendar month.
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
                        Enter the weekly rent (pw).
                      </strong>{" "}
                      Use the figure from the advert or offer. This tool doesn’t
                      add council tax, bills, parking, internet, one-off fees,
                      deposits, or proration.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert weekly to daily.
                      </strong>{" "}
                      Daily = weekly ÷ 7. This puts everything on a 1-day basis.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert daily to an annual equivalent.
                      </strong>{" "}
                      Annual = daily × 365. That annual figure becomes the
                      shared reference for all other periods.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert annual to a calendar-month equivalent.
                      </strong>{" "}
                      Monthly (PCM) = annual ÷ 12, matching an average month
                      length of 365 ÷ 12 days.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Decimals are preserved; rounding is display-only.
                      </strong>{" "}
                      If rounding is enabled, it changes formatting only. The
                      internal calculation keeps precision for consistent
                      breakdowns.
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
