import { useState } from "react";
import { Link } from "react-router";
import type { IntentFaq, IntentLink } from "./IntentLandingPage";
import { formatMoney, isCurrency, SUPPORTED_CURRENCIES, type Currency } from "~/client/utils/rentMath";
import { parseIncomeMoney } from "~/client/utils/generatedIncome.js";
import { calculateProration, parseWholeNumberInRange } from "~/client/utils/generatedTools.js";

type ProratedRentCalculatorPageProps = {
  faq: IntentFaq[];
  relatedLinks: IntentLink[];
};

export default function ProratedRentCalculatorPage({
  faq,
  relatedLinks,
}: ProratedRentCalculatorPageProps) {
  const [monthlyRent, setMonthlyRent] = useState("1800");
  const [daysOwed, setDaysOwed] = useState("10");
  const [daysInPeriod, setDaysInPeriod] = useState("30");
  const [currency, setCurrency] = useState<Currency>("USD");

  const rentParsed = parseIncomeMoney(monthlyRent, "Rent amount");
  const periodParsed = parseWholeNumberInRange(daysInPeriod, "Days in rent period", 1, 366);
  const owedParsed = parseWholeNumberInRange(daysOwed, "Charged days", 0, 366);
  const owedRelationError = owedParsed.ok && periodParsed.ok && owedParsed.value > periodParsed.value
    ? "Charged days cannot exceed days in the rent period."
    : undefined;
  const result = rentParsed.ok && periodParsed.ok && owedParsed.ok && !owedRelationError
    ? calculateProration(rentParsed.cents, owedParsed.value, periodParsed.value)
    : undefined;

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 scroll-smooth antialiased">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="rc-page-eyebrow">Prorated rent calculator</p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">Prorated Rent Calculator</h1>
            </div>
            <button type="button" onClick={() => window.print()} data-nosnippet className="rc-print-button rc-no-print cursor-pointer">Print / Save PDF</button>
          </div>
          <p className="mt-3 text-base leading-relaxed text-slate-700">
            Calculate partial-month rent when someone moves in, moves out, or
            pays for only part of a rental period.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <label htmlFor="proration-rent" className="mb-2 block text-sm font-semibold text-slate-800">Rent amount</label>
              <div className="flex gap-2">
                <input
                  id="proration-rent"
                  inputMode="decimal"
                  value={monthlyRent}
                  onChange={(event) => setMonthlyRent(event.target.value)}
                  className={`w-full cursor-pointer rounded-xl px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus-visible:ring-sky-400 ${rentParsed.ok ? "bg-slate-100 focus:ring-sky-200" : "bg-rose-50 ring-2 ring-rose-300 focus:ring-rose-400"}`}
                  aria-invalid={!rentParsed.ok}
                  aria-describedby={!rentParsed.ok ? "proration-rent-error" : undefined}
                />
                <select
                  value={currency}
                  onChange={(event) => {
                    const next = event.target.value;
                    setCurrency(isCurrency(next) ? next : "USD");
                  }}
                  className="cursor-pointer rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {!rentParsed.ok ? (
                <p id="proration-rent-error" role="alert" className="mt-2 text-sm font-medium text-rose-700">
                  {rentParsed.error}
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-3">
              <label htmlFor="proration-charged-days" className="mb-2 block text-sm font-semibold text-slate-800">Charged days</label>
              <input
                id="proration-charged-days"
                inputMode="numeric"
                value={daysOwed}
                onChange={(event) => setDaysOwed(event.target.value)}
                className={`w-full cursor-pointer rounded-xl px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus-visible:ring-sky-400 ${owedParsed.ok && !owedRelationError ? "bg-slate-100 focus:ring-sky-200" : "bg-rose-50 ring-2 ring-rose-300 focus:ring-rose-400"}`}
                aria-invalid={!owedParsed.ok || Boolean(owedRelationError)}
                aria-describedby={!owedParsed.ok || owedRelationError ? "proration-charged-days-error" : undefined}
              />
              {!owedParsed.ok || owedRelationError ? <p id="proration-charged-days-error" role="alert" className="mt-2 text-sm font-medium text-rose-700">{!owedParsed.ok ? owedParsed.error : owedRelationError}</p> : null}
            </div>

            <div className="lg:col-span-4">
              <label htmlFor="proration-period-days" className="mb-2 block text-sm font-semibold text-slate-800">Days in rent period</label>
              <input
                id="proration-period-days"
                inputMode="numeric"
                value={daysInPeriod}
                onChange={(event) => setDaysInPeriod(event.target.value)}
                className={`w-full cursor-pointer rounded-xl px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus-visible:ring-sky-400 ${periodParsed.ok ? "bg-slate-100 focus:ring-sky-200" : "bg-rose-50 ring-2 ring-rose-300 focus:ring-rose-400"}`}
                aria-invalid={!periodParsed.ok}
                aria-describedby={!periodParsed.ok ? "proration-period-days-error" : "proration-period-days-help"}
              />
              <p id="proration-period-days-help" className="mt-2 text-sm text-slate-600">Choose the day-count convention used by the lease or invoice.</p>
              {!periodParsed.ok ? <p id="proration-period-days-error" role="alert" className="mt-2 text-sm font-medium text-rose-700">{periodParsed.error}</p> : null}
            </div>
          </div>

          {!result ? (
            <div className="mt-6 rounded-2xl bg-rose-50 px-5 py-4 text-rose-900" role="status" aria-live="polite">
              <p className="font-semibold">Fix the highlighted fields to calculate prorated rent.</p>
            </div>
          ) : <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block">
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />
            <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
              <div className="rounded-2xl bg-white px-4 py-4 sm:col-span-2">
                <div className="text-sm font-semibold text-slate-800">
                  Prorated rent
                </div>
                <div className="mt-2 text-4xl font-extrabold text-emerald-700 sm:text-5xl">
                  {formatMoney(result.proratedRent, currency)}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Based on {result.chargedDays} day{result.chargedDays === 1 ? "" : "s"} out of{" "}
                  {result.periodDays} day{result.periodDays === 1 ? "" : "s"}.
                </p>
              </div>

              <div className="rounded-2xl bg-white px-4 py-4">
                <div className="text-sm font-semibold text-slate-800">
                  Daily rate
                </div>
                <div className="mt-2 text-2xl font-extrabold text-slate-950">
                  {formatMoney(result.dailyRate, currency)}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Full rent divided by days in the rent period.
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-3 sm:col-span-3">
                <div className="text-sm font-semibold text-emerald-800">
                  Formula
                </div>
                <p className="mt-1 leading-7 text-slate-800">
                  Prorated rent = rent amount / days in period × charged days.
                </p>
              </div>
              <div className="grid gap-3 sm:col-span-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white px-4 py-3"><span className="block text-xs text-slate-600">Entered rent</span><strong>{formatMoney(result.rent, currency)}</strong></div>
                <div className="rounded-2xl bg-white px-4 py-3"><span className="block text-xs text-slate-600">Charged days</span><strong>{result.chargedDays}</strong></div>
                <div className="rounded-2xl bg-white px-4 py-3"><span className="block text-xs text-slate-600">Days in period</span><strong>{result.periodDays}</strong></div>
              </div>
            </div>
          </div>}
        </div>
      </section>

      <section className="bg-white px-6 py-14 rc-no-print">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-sky-900">
              How this calculator works
            </h2>
            <p className="mt-3 leading-8 text-slate-700">
              Proration splits the full rent across the days in the rental
              period, then charges only the days owed. That can happen at
              move-in, move-out, lease changes, roommate changes, or when a
              landlord charges for a partial first month.
            </p>
            <p className="mt-4 leading-8 text-slate-700">
              The safest approach is to match the lease or invoice. Some leases
              use the exact number of days in the month. Others use a fixed
              30-day period. This calculator lets you enter either method.
            </p>
            <h3 className="mt-8 text-xl font-bold tracking-tight text-sky-900">
              What this result does not include
            </h3>
            <p className="mt-3 leading-8 text-slate-700">
              The result covers base rent only. Utilities, deposits, parking,
              late fees, local rules, and lease-specific rounding may need to be
              handled separately.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-sky-900">
              Worked examples
            </h2>
            <div className="mt-4 space-y-4">
              <div className="relative pl-5">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2.5 h-2.5 w-2.5 rounded-full bg-emerald-500"
                />
                <h3 className="font-semibold text-slate-950">
                  Moving in mid-month
                </h3>
                <p className="mt-1 leading-7 text-slate-700">
                  If rent is $1,800 and the tenant owes 10 days out of a 30-day
                  period, the prorated amount is $600.
                </p>
              </div>
              <div className="relative pl-5">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2.5 h-2.5 w-2.5 rounded-full bg-emerald-500"
                />
                <h3 className="font-semibold text-slate-950">
                  Comparing calendar-day and 30-day methods
                </h3>
                <p className="mt-1 leading-7 text-slate-700">
                  A 10-day charge in February can differ from a 10-day charge in
                  a 31-day month. Check which day count your lease uses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sky-50 px-6 py-14 rc-no-print">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold tracking-tight text-sky-900">
            Related calculators
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="cursor-pointer rounded-2xl bg-white px-5 py-4 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50"
              >
                <span className="block font-semibold text-sky-900">
                  {link.label}
                </span>
                {link.description ? (
                  <span className="mt-1 block text-sm leading-6 text-slate-700">
                    {link.description}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-sky-800">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl bg-slate-50 px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="text-slate-700 transition-transform group-open:rotate-180"
                  >
                    v
                  </span>
                </summary>
                <div className="mt-2 leading-relaxed text-slate-700">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
