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
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                  How the daily to monthly rent converter works
                </h2>
                <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                  This page converts a daily rent into a comparable monthly
                  figure so you can judge whether a daily-priced listing fits a
                  monthly budget or competes with monthly-priced listings. The
                  conversion reconciles through a full year, then reports an
                  average month. All other period values shown on the page
                  reconcile to the same daily input, so comparisons stay
                  consistent.
                </p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Daily = base unit
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Monthly = annual ÷ 12
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Daily amount
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SCALE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual = × 365
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  DERIVE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Monthly = ÷ 12
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  BREAKDOWN
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  All periods from daily
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
            {/* SectionCard: related tools (near top) */}
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
                        d="M5 12h14"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Related tools
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p>
                    Use the rent converter when you need the same price
                    expressed across periods to compare listings quoted in
                    different terms. Use rent affordability when deciding
                    whether the monthly equivalent fits your income limits and
                    budget rules.
                  </p>

                  <div className="mt-3 text-sm flex flex-wrap gap-x-5 gap-y-2">
                    <Link
                      to="/rent-converter"
                      className="cursor-pointer text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Rent converter →
                    </Link>
                    <Link
                      to="/rent-affordability-calculator"
                      className="cursor-pointer text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                    >
                      Rent affordability →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: examples (directly under related tools) */}
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
                    <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                      Examples you can cross-check
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5 space-y-2">
                      <div className="text-sm font-bold text-slate-900">
                        Example 1
                      </div>
                      <div className="text-sm">
                        <strong>Situation:</strong> Two listings compete for the
                        same unit. One is priced daily, the other monthly.
                      </div>
                      <div className="text-sm">
                        <strong>Numbers:</strong> Daily = 80. Monthly listing =
                        2,350.
                      </div>
                      <div className="text-sm">
                        <strong>Calculation:</strong> 80 × 365 = 29,200 per
                        year. 29,200 ÷ 12 = 2,433.33 per month.
                      </div>
                      <div className="text-sm">
                        <strong>Result:</strong>{" "}
                        <span className="font-semibold text-slate-900">
                          2,433.33 / month
                        </span>
                      </div>
                      <div className="text-sm">
                        <strong>Meaning:</strong> The daily-priced option looks
                        cheaper at a glance, but after conversion it is more
                        expensive than the 2,350/month listing. The decision
                        flips to the monthly listing.
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5 space-y-2">
                      <div className="text-sm font-bold text-slate-900">
                        Example 2
                      </div>
                      <div className="text-sm">
                        <strong>Situation:</strong> You have a hard monthly cap
                        and need to decide whether a daily quote fits it.
                      </div>
                      <div className="text-sm">
                        <strong>Numbers:</strong> Budget cap = 2,000/month.
                        Daily = 65.50.
                      </div>
                      <div className="text-sm">
                        <strong>Calculation:</strong> 65.50 × 365 = 23,907.50
                        per year. 23,907.50 ÷ 12 = 1,992.29 per month.
                      </div>
                      <div className="text-sm">
                        <strong>Result:</strong>{" "}
                        <span className="font-semibold text-slate-900">
                          1,992.29 / month
                        </span>
                      </div>
                      <div className="text-sm">
                        <strong>Meaning:</strong> The converted monthly total
                        stays under the 2,000 cap. This listing passes the
                        budget screen and stays in consideration.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5 space-y-2">
                    <div className="text-sm font-bold text-slate-900">
                      Quick 30-day comparison (rounding pitfall)
                    </div>
                    <div className="text-sm">
                      <strong>Situation:</strong> A landlord advertises “80 per
                      day” and informally says that is “about 2,400 per month.”
                    </div>
                    <div className="text-sm">
                      <strong>Numbers:</strong> Daily = 80. Shortcut month = 30
                      days.
                    </div>
                    <div className="text-sm">
                      <strong>Calculation:</strong> 80 × 30 = 2,400 (shortcut).
                      Page method: 80 × 365 ÷ 12 = 2,433.33.
                    </div>
                    <div className="text-sm">
                      <strong>Result:</strong>{" "}
                      <span className="font-semibold text-slate-900">
                        2,433.33 / month (average)
                      </span>
                    </div>
                    <div className="text-sm">
                      <strong>Meaning:</strong> Treating the shortcut as a
                      “monthly” price understates the true average. If your cap
                      is 2,400, the shortcut suggests acceptance, but the
                      reconciled monthly exceeds the cap and should be rejected.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SectionCard: conversion path */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  The conversion path used on this page
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    This page uses one reversible path so every period stays
                    comparable to the same daily price. The path is fixed and
                    does not change based on calendar months or billing cycles.
                  </p>

                  <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-slate-900">
                      Formulas
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2">
                      <li>
                        <strong>Annual</strong> = daily × 365
                      </li>
                      <li>
                        <strong>Monthly</strong> = annual ÷ 12
                      </li>
                      <li>
                        Combined: <strong>Monthly = daily × 365 ÷ 12</strong>
                      </li>
                    </ul>
                    <p className="mt-3 text-sm text-slate-600">
                      This produces an average month length of 365 ÷ 12 days so
                      the yearly total reconciles cleanly.
                    </p>
                  </div>

                  <p>
                    Use the monthly output when comparing against monthly-priced
                    listings or a monthly budget. Use the annual total when you
                    need to sanity-check the full-year cost of a daily rate.
                  </p>
                </div>
              </div>
            </div>

            {/* SectionCard: 30-day vs average month */}
            <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
              />
              <div className="p-5 sm:px-6">
                <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                  Why 30-day months are shown separately
                </h3>

                <div className="mt-4 space-y-3">
                  <p>
                    A 30-day cycle and an average calendar month are different
                    pricing models. Treating them as interchangeable skews
                    comparisons and can push a listing across a budget boundary.
                  </p>

                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Use a 30-day figure only when the contract bills every 30
                      days.
                    </li>
                    <li>
                      Use the average-month figure when comparing to listings
                      quoted “per month” or to a monthly budget.
                    </li>
                  </ul>

                  <p>
                    The headline monthly on this page is the average-month
                    result (annual ÷ 12) so yearly totals reconcile. The 30-day
                    number is provided only to compare against contracts that
                    actually bill on a 30-day cycle.
                  </p>
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
