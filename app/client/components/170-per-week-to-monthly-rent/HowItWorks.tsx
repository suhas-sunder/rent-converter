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
                  170 per week to monthly rent
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page is for one very specific question: what does{" "}
                  <span className="font-semibold text-slate-900">
                    170 per week
                  </span>{" "}
                  come to in{" "}
                  <span className="font-semibold text-slate-900">
                    per calendar month (PCM)
                  </span>
                  ? If you are comparing a weekly advertised room with monthly
                  listings, the only fair comparison is to convert both to the
                  same time basis. Weekly is treated as{" "}
                  <span className="font-semibold text-slate-900">7 days</span>.
                  “Monthly” means an average calendar month length of{" "}
                  <span className="font-semibold text-slate-900">
                    365 ÷ 12 days
                  </span>{" "}
                  (about 30.42 days). That keeps the PCM figure consistent with
                  the same annual cost under a{" "}
                  <span className="font-semibold text-slate-900">
                    365-day year
                  </span>
                  .
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
                  170 per week
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 transition cursor-pointer hover:ring-sky-200/80 hover:bg-sky-50/40">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BASIS
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Calendar-month (PCM)
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
                  PCM + comparison
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
                    170 pw in real monthly terms
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  A weekly price can look lower than it feels once you convert
                  it to PCM. The goal here is not to “make it higher”, it is to
                  make it comparable to the way many listings are written. The
                  conversion used on this page is the same one shown in the
                  calculator.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    The monthly equivalent of{" "}
                    <strong className="text-slate-900">170 per week</strong> is{" "}
                    <strong className="text-slate-900">
                      170 × 365 ÷ (7 × 12) = £738.69 pcm
                    </strong>
                    . If you are browsing monthly listings around £725 to £750
                    PCM, this weekly listing is in that range before bills.
                  </li>
                  <li>
                    A common quick guess is{" "}
                    <strong className="text-slate-900">170 × 4 = £680</strong>.
                    That is a <strong className="text-slate-900">28-day</strong>{" "}
                    amount, not a calendar-month equivalent. Compared to the PCM
                    figure above, the gap is roughly{" "}
                    <strong className="text-slate-900">£58.69</strong> per
                    month.
                  </li>
                  <li>
                    If you want an annual budget number for applications and
                    planning, convert weekly to annual using the same day basis:{" "}
                    <strong className="text-slate-900">
                      (170 ÷ 7) × 365 = £8,864.29 per year
                    </strong>
                    . Divide by 12 and you land back on{" "}
                    <strong className="text-slate-900">£738.69 pcm</strong>.
                  </li>
                  <li>
                    If the listing is weekly but bills are separate, the PCM
                    conversion is the clean starting point. For example, if
                    bills average £100 per month, your all-in estimate becomes
                    roughly{" "}
                    <strong className="text-slate-900">£838.69 pcm</strong>. If
                    bills are included, the weekly listing may be better value
                    even when PCM looks similar.
                  </li>
                  <li>
                    If a weekly figure includes pence (for example,{" "}
                    <strong className="text-slate-900">170.50</strong>),
                    decimals stay in the calculation:{" "}
                    <strong className="text-slate-900">
                      170.50 × 365 ÷ (7 × 12) = £740.86 pcm
                    </strong>
                    .
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
                  If the listing uses an unusual cycle (for example, “every 4
                  weeks”), keep the comparison honest by converting everything
                  to the same basis. A neat-looking monthly number is not useful
                  if the input format was ambiguous.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
              Related pages
            </h3>

            <p className="mt-2">
              If you are comparing the same rental across different pricing
              cycles, these pages help you avoid redoing the math.
            </p>

            <p className="text-slate-700 leading-relaxed">
              <Link
                to="/rent-paid-weekly-vs-monthly"
                className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
              >
                weekly vs monthly rent
              </Link>{" "}
              explains why “per week” and “per calendar month” do not line up by
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
                      What you get from this page
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    This page turns a weekly figure into a{" "}
                    <span className="font-semibold text-slate-900">
                      PCM equivalent
                    </span>{" "}
                    that represents the same annual cost under a 365-day model.
                    It is an{" "}
                    <span className="font-semibold text-slate-900">
                      equivalence
                    </span>{" "}
                    for comparison, not a promise about how a landlord will bill
                    you. For 170 per week, it answers the practical question:
                    what monthly bracket does that weekly listing really sit in?
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule used here
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        PCM equivalent
                      </span>{" "}
                      = weekly × 365 ÷ (7 × 12)
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      Same idea step-by-step: daily = weekly ÷ 7 → annual =
                      daily × 365 → monthly = annual ÷ 12.
                    </p>
                  </div>

                  <p>
                    The breakdown table on the page (daily, fortnightly, 4-week,
                    monthly, annual) is derived from the same annual basis. That
                    is what makes the comparison consistent when listings mix
                    weekly, 4-weekly/28-day cycles, and PCM.
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
                      Why “170 × 4” is not PCM
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
                    anchored to a consistent year.
                  </p>

                  <p>
                    The usual trap is treating “every 4 weeks” as monthly. A
                    4-week period is exactly{" "}
                    <span className="font-semibold text-slate-900">
                      28 days
                    </span>
                    . A calendar month is longer on average, so “weekly × 4”
                    typically understates what that weekly listing means in PCM
                    terms.
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
                        Weekly × 52 is a useful sense-check for annual rent, but
                        it describes a payment cadence, not what “per calendar
                        month” means on most listings.
                      </p>
                    </div>
                  </div>

                  <p>
                    Practical note: some rents are advertised weekly but
                    collected on fixed due dates. This page is for comparing
                    price levels, not for predicting how many payments fall
                    inside a particular calendar month.
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
                      For this route, the focus is 170 per week, but you can
                      still enter any weekly amount if you need to compare
                      similar listings.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert weekly to daily.
                      </strong>{" "}
                      Daily = weekly ÷ 7. That gives a consistent one-day basis.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert daily to annual.
                      </strong>{" "}
                      Annual = daily × 365. This annual total is the shared
                      reference.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Convert annual to PCM.
                      </strong>{" "}
                      Monthly = annual ÷ 12, which corresponds to an average
                      calendar-month length of 365 ÷ 12 days.
                    </li>
                    <li>
                      <strong className="text-slate-900">
                        Decimals are preserved; rounding is display-only.
                      </strong>{" "}
                      If the interface shows fewer decimals, the displayed PCM
                      may be rounded, but the underlying calculation is
                      unchanged.
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
