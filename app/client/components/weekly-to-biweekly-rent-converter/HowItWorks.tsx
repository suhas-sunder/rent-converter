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
                  Weekly to biweekly rent conversion
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  Use this when rent is quoted{" "}
                  <span className="font-semibold text-slate-900">per week</span>{" "}
                  but you budget or pay on a{" "}
                  <span className="font-semibold text-slate-900">two-week</span>{" "}
                  cycle. Weekly rent is treated as{" "}
                  <span className="font-semibold text-slate-900">7 days</span>{" "}
                  and biweekly rent as{" "}
                  <span className="font-semibold text-slate-900">14 days</span>,
                  so the conversion is exact.
                </p>
                <p className="mt-3 text-slate-600 leading-7 max-w-2xl">
                  The decision this supports is simple:{" "}
                  <span className="font-semibold text-slate-900">
                    can you accept this place under your 14-day limit
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-slate-900">
                    which listing is actually cheaper over the same window
                  </span>
                  . If you open the breakdown to view other periods, the values
                  stay aligned to a single annual basis so you are not comparing
                  mismatched time assumptions.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Biweekly = 14 days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  365-day basis
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Input
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Weekly amount
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  Use the amount tied to a true 7-day week, not a “4-week month”
                  shorthand.
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Definition
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Biweekly = 14 days
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  Two full weeks, so it matches a two-week pay cycle and a
                  fortnight budget.
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Core rule
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Biweekly = weekly × 2
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  Exact conversion because 14 days is exactly two 7-day weeks.
                </p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition cursor-pointer">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Output
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Biweekly + breakdown
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-6">
                  Use the biweekly figure for the decision, and the breakdown
                  only when another listing is in a different period.
                </p>
              </div>
            </div>
          </div>

          <div className="group relative my-8 p-6 rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
            <div className="text-slate-700 leading-relaxed">
              <h3 className="text-xl mb-2 font-extrabold text-sky-900 tracking-tight">
                Related pages
              </h3>
              <p className="mt-2">
                These tools are relevant when the next decision requires a
                different time window than biweekly, or when you need a strict
                side-by-side check before you shortlist.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>
                  <Link
                    to="/rent-paid-weekly-vs-monthly"
                    className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    weekly vs monthly rent
                  </Link>
                  : Relevant when one listing is weekly and another is monthly
                  and you need a clean comparison before deciding which one is
                  actually cheaper to live in.
                </li>
                <li>
                  <Link
                    to="/rent-converter"
                    className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    rent converter
                  </Link>
                  : Relevant when you want one weekly quote expressed across
                  multiple periods to align it with your broader budget
                  planning.
                </li>
                <li>
                  <Link
                    to="/rent-affordability-calculator"
                    className="cursor-pointer font-semibold text-sky-700 hover:text-sky-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                  >
                    rent affordability calculator
                  </Link>
                  : Relevant after you have a comparable period amount and need
                  to decide whether that rent is realistic for your income
                  range.
                </li>
              </ul>
            </div>
          </div>

          {/* Examples section (separate) */}
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
                    Examples
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p>
                  Each example converts a weekly quote into the{" "}
                  <span className="font-semibold text-slate-900">
                    exact 14-day equivalent
                  </span>{" "}
                  so you can make an accept/reject decision against a two-week
                  budget. Any rounding you see is display-only and does not
                  change the underlying result.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 1: A listing looks cheaper but isn’t
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        <strong className="text-slate-900">Situation:</strong>{" "}
                        You are comparing two places. One is quoted at{" "}
                        <strong className="text-slate-900">$500 weekly</strong>,
                        and another is advertised as{" "}
                        <strong className="text-slate-900">
                          $980 biweekly
                        </strong>
                        . Weekly can feel cheaper at a glance, so you convert to
                        the same 14-day window.
                      </li>
                      <li>
                        <strong className="text-slate-900">Numbers:</strong>{" "}
                        Weekly rent ={" "}
                        <strong className="text-slate-900">$500</strong>.
                        Comparison listing ={" "}
                        <strong className="text-slate-900">
                          $980 biweekly
                        </strong>
                        .
                      </li>
                      <li>
                        <strong className="text-slate-900">Calculation:</strong>{" "}
                        Biweekly equivalent ={" "}
                        <strong className="text-slate-900">
                          $500 × 2 = $1,000
                        </strong>
                        .
                      </li>
                      <li>
                        <strong className="text-slate-900">Result:</strong>{" "}
                        Weekly listing converts to{" "}
                        <strong className="text-slate-900">
                          $1,000 biweekly
                        </strong>
                        , which is higher than{" "}
                        <strong className="text-slate-900">
                          $980 biweekly
                        </strong>
                        .
                      </li>
                      <li>
                        <strong className="text-slate-900">Meaning:</strong> The
                        “$500 weekly” place is not the cheaper option over two
                        weeks, so it drops below the other listing on your
                        shortlist.
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Example 2: A budget cap is crossed
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        <strong className="text-slate-900">Situation:</strong>{" "}
                        Your hard limit is{" "}
                        <strong className="text-slate-900">
                          $1,250 biweekly
                        </strong>{" "}
                        because you want rent to fit your two-week pay cycle
                        without squeezing bills. A landlord quotes{" "}
                        <strong className="text-slate-900">
                          $625.75 per week
                        </strong>
                        , and you need the exact 14-day number before you commit
                        to a viewing.
                      </li>
                      <li>
                        <strong className="text-slate-900">Numbers:</strong>{" "}
                        Weekly rent ={" "}
                        <strong className="text-slate-900">$625.75</strong>.
                        Biweekly cap ={" "}
                        <strong className="text-slate-900">$1,250.00</strong>.
                      </li>
                      <li>
                        <strong className="text-slate-900">Calculation:</strong>{" "}
                        Biweekly equivalent ={" "}
                        <strong className="text-slate-900">
                          $625.75 × 2 = $1,251.50
                        </strong>
                        .
                      </li>
                      <li>
                        <strong className="text-slate-900">Result:</strong>{" "}
                        <strong className="text-slate-900">
                          $1,251.50 biweekly
                        </strong>
                        , which is{" "}
                        <strong className="text-slate-900">$1.50</strong> above
                        your cap.
                      </li>
                      <li className="text-slate-600">
                        Decimals are preserved end-to-end; rounding is
                        display-only.
                      </li>
                      <li>
                        <strong className="text-slate-900">Meaning:</strong> You
                        reject this listing (or negotiate) because it breaks
                        your 14-day limit, even though the weekly number looks
                        close.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white ring-1 ring-slate-200 p-5">
                  <div className="text-sm font-bold text-sky-900">
                    What these examples are doing
                  </div>
                  <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                    <li>
                      They force both options into a{" "}
                      <strong className="text-slate-900">
                        single 14-day window
                      </strong>{" "}
                      so you can rank listings and check a biweekly cap without
                      guessing.
                    </li>
                    <li>
                      They show two different outcomes:{" "}
                      <strong className="text-slate-900">
                        shortlist changes
                      </strong>{" "}
                      and{" "}
                      <strong className="text-slate-900">
                        accept vs reject
                      </strong>{" "}
                      based on a hard limit.
                    </li>
                    <li>
                      They keep cents intact because small differences can flip
                      a close decision.
                    </li>
                  </ul>
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
                    You get one decision-ready number: the weekly quote
                    expressed as a{" "}
                    <span className="font-semibold text-slate-900">
                      biweekly
                    </span>{" "}
                    amount for the same 14-day period. Use this value to:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>check a two-week rent cap before you proceed,</li>
                    <li>
                      compare against listings advertised “per fortnight,”
                    </li>
                    <li>
                      translate weekly ads into the way you actually budget.
                    </li>
                  </ul>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Core rule
                    </div>
                    <p className="mt-2">
                      <span className="font-semibold text-slate-900">
                        Biweekly equivalent
                      </span>{" "}
                      = weekly rent × 2
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      This conversion is exact because it is strictly 14 days.
                      It does not change based on lease start dates, payment
                      timing, or which month you are in.
                    </p>
                  </div>

                  <p>
                    If a breakdown table is shown, treat it as a comparison aid:
                    it expresses the same input in other periods so you can
                    sanity-check against a monthly or 4-week quote when a
                    listing is not advertised in biweekly terms.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: how the breakdown stays consistent */}
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
                      How the math stays consistent across periods
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    The headline conversion is simple (× 2), but the breakdown
                    is for a different job:{" "}
                    <span className="font-semibold text-slate-900">
                      fair comparisons when another listing uses a different
                      period
                    </span>
                    . To prevent “month = 4 weeks” shortcuts, it uses a{" "}
                    <span className="font-semibold text-slate-900">
                      365-day year
                    </span>{" "}
                    as the shared reference.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        One shared basis
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          Daily = weekly ÷{" "}
                          <strong className="text-slate-900">7</strong>
                        </li>
                        <li>
                          Annual = daily ×{" "}
                          <strong className="text-slate-900">365</strong>
                        </li>
                        <li>
                          Monthly (average) = annual ÷{" "}
                          <strong className="text-slate-900">12</strong>
                        </li>
                        <li>
                          4-week = daily ×{" "}
                          <strong className="text-slate-900">28</strong>
                        </li>
                        <li>
                          Biweekly = daily ×{" "}
                          <strong className="text-slate-900">14</strong> (same
                          as weekly × 2)
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        What that avoids
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          It keeps{" "}
                          <strong className="text-slate-900">
                            28 days (4-week)
                          </strong>{" "}
                          separate from{" "}
                          <strong className="text-slate-900">
                            an average month
                          </strong>{" "}
                          (365 ÷ 12 days).
                        </li>
                        <li>
                          It prevents “weekly × 4” from being mistaken as a
                          monthly equivalent.
                        </li>
                        <li>
                          It keeps all periods comparable without changing the
                          underlying rent assumption.
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p>
                    Use the biweekly figure for your two-week budget decision.
                    Use the breakdown only when you are comparing against a
                    listing that is not quoted weekly or biweekly.
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
                      Input formats supported
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Parsing rules
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
                    This matters because rent decisions are often close. A small
                    input mistake can push a listing above or below a cap and
                    still look “reasonable” at a glance.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>If you intended cents, include a decimal point.</li>
                    <li>If you intended thousands, commas are fine.</li>
                    <li>
                      If your locale uses a comma as a decimal separator, enter
                      a dot here to avoid ambiguity.
                    </li>
                  </ul>

                  <p className="text-sm text-slate-600">
                    Example: <strong className="text-slate-900">1,234</strong>{" "}
                    is treated as thousands grouping (1234). If you meant a
                    decimal, enter{" "}
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
                  This converts periods, not due dates
                </h3>
                <p className="mt-3 text-slate-200 leading-7">
                  The biweekly result is a 14-day equivalent used for budgeting
                  and comparison. It does not tell you which day rent is due, or
                  how payments land across calendar months. If your decision
                  depends on exact payment dates (for example, aligning rent
                  with paydays), use a due-date schedule tool.
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
