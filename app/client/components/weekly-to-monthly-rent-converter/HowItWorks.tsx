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
                  Weekly to monthly rent conversion
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Convert a weekly rent amount into a{" "}
                  <span className="font-semibold text-slate-900">
                    per-calendar-month (PCM)
                  </span>{" "}
                  equivalent so you can compare weekly-listed rentals with
                  monthly listings side by side. Weekly is treated as{" "}
                  <span className="font-semibold text-slate-900">7 days</span>.
                  “Monthly” here means the average calendar month length of{" "}
                  <span className="font-semibold text-slate-900">
                    365 ÷ 12 days
                  </span>{" "}
                  (about 30.42 days). The calculator uses a{" "}
                  <span className="font-semibold text-slate-900">
                    365-day year
                  </span>{" "}
                  so the headline PCM result and the breakdown are consistent.
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
                  Weekly amount
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
                  Monthly + breakdown
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
                    Examples you can cross-check
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  These examples mirror how people actually use a “pw to pcm”
                  calculator when comparing listings, setting a monthly cap, or
                  sanity-checking what a weekly figure means over a calendar
                  month. Each calculation matches the rule used by the tool. If
                  the UI shows fewer decimals, the displayed PCM may be rounded,
                  but the underlying math is the same.
                </p>

                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    You’re deciding between two listings:{" "}
                    <strong className="text-slate-900">$500 per week</strong>{" "}
                    and <strong className="text-slate-900">$2,150 pcm</strong>.
                    Convert the weekly listing:{" "}
                    <strong className="text-slate-900">
                      $500 × 365 ÷ (7 × 12) = $2,172.62 pcm
                    </strong>
                    . On a like-for-like basis, the "$500 pw" place is about{" "}
                    <span className="font-semibold text-slate-900">$22.62</span>{" "}
                    more per calendar month before extras like utilities,
                    parking, or internet.
                  </li>
                  <li>
                    You found a room advertised at{" "}
                    <strong className="text-slate-900">$170 per week</strong>{" "}
                    and you’re trying to keep rent under{" "}
                    <strong className="text-slate-900">$800 pcm</strong>.
                    Monthly equivalent:{" "}
                    <strong className="text-slate-900">
                      $170 × 365 ÷ (7 × 12) = $738.69 pcm
                    </strong>
                    . That fits your rent-only cap, leaving roughly{" "}
                    <span className="font-semibold text-slate-900">$61.31</span>{" "}
                    per month buffer for bills (which can vary a lot by market
                    and what’s included).
                  </li>
                  <li>
                    You’re filtering listings under{" "}
                    <strong className="text-slate-900">$1,800 pcm</strong>, but
                    one apartment is listed as{" "}
                    <strong className="text-slate-900">$410 per week</strong>.
                    Convert it:{" "}
                    <strong className="text-slate-900">
                      $410 × 365 ÷ (7 × 12) = $1,781.55 pcm
                    </strong>
                    . It’s technically under your cap on rent alone, but it’s
                    close enough that add-ons (utilities not included, pet rent,
                    parking, etc.) can flip the decision.
                  </li>
                  <li>
                    The agent quotes{" "}
                    <strong className="text-slate-900">$320 per week</strong>{" "}
                    and you want a quick sense of annual cost for budgeting
                    (applications, moving costs, and a longer-term plan). Annual
                    equivalent:{" "}
                    <strong className="text-slate-900">
                      ($320 ÷ 7) × 365 = $16,685.71 per year
                    </strong>
                    . Monthly (PCM) equivalent:{" "}
                    <strong className="text-slate-900">
                      $16,685.71 ÷ 12 = $1,390.48 pcm
                    </strong>
                    . This is useful when you’re checking what rent does to your
                    yearly budget.
                  </li>
                  <li>
                    Your lease offer is{" "}
                    <strong className="text-slate-900">$625.75 per week</strong>{" "}
                    (common if a discount, partial-week proration, or an
                    odd-numbered rate is used). Monthly equivalent:{" "}
                    <strong className="text-slate-900">
                      $625.75 × 365 ÷ (7 × 12) = $2,719.14 pcm
                    </strong>{" "}
                    (decimals stay part of the calculation).
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
                  If an input could reasonably be read more than one way, the
                  safest approach is to correct the input format rather than
                  rely on a “neat-looking” output. When in doubt, enter the
                  value exactly as it appears on the listing (including decimals
                  if shown).
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
                    that represents the same annual cost under a 365-day model.
                    It’s an{" "}
                    <span className="font-semibold text-slate-900">
                      equivalent
                    </span>{" "}
                    value used for comparisons, not a billing rule. This is the
                    number that helps answer questions like: is “$500 pw” closer
                    to “$2,000 pcm” or “$2,300 pcm” once you convert the time
                    basis.
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
                    annual) is derived from the same annual basis. That’s useful
                    when listings mix weekly, 4-weekly/28-day cycles, and PCM,
                    because you’re comparing like with like.
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
                    anchored to a consistent year, which is the point of a “pw
                    to pcm” comparison.
                  </p>

                  <p>
                    The most common mismatch is treating “every 4 weeks” as
                    monthly. A 4-week period is exactly{" "}
                    <span className="font-semibold text-slate-900">
                      28 days
                    </span>
                    . A calendar month is longer on average, so “weekly × 4”
                    usually understates the monthly equivalent when you’re
                    converting a weekly listing into PCM.
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
                        Weekly × 52 is a quick way to sanity-check annual rent,
                        but it describes a payment cadence, not what “per
                        calendar month” means on most listings.
                      </p>
                    </div>
                  </div>

                  <p>
                    Real-world note: some markets advertise “pcm” but collect
                    rent on different schedules (weekly, fortnightly, 4-weekly,
                    or fixed due dates). This tool is for price comparison, not
                    for predicting how many payments land in a specific calendar
                    month.
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
                        You enter a weekly rent amount.
                      </strong>{" "}
                      Use the weekly figure from the listing or lease offer. The
                      tool does not add utilities, parking, internet, one-off
                      fees, deposits, or proration.
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
                      The calculator carries decimals through the math (up to
                      the internal precision limit). If rounding is enabled, it
                      only affects formatting, not the underlying calculation.
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
