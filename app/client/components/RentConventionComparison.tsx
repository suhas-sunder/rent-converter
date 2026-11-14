import { useState } from "react";
import { Link } from "react-router";
import HydrationSafeControls from "./HydrationSafeControls";
import { compareRentConventions, type ConventionDirection } from "~/client/utils/rentConventions.js";
import { formatMoney } from "~/client/utils/rentMath";

export default function RentConventionComparison() {
  const [amount, setAmount] = useState("500");
  const [direction, setDirection] = useState<ConventionDirection>("weekly");
  const result = compareRentConventions(amount, direction);
  const output = direction === "weekly" ? "per calendar month" : "per week";
  const control = "mt-2 w-full cursor-pointer hover:border-sky-500 rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";
  return <section id="rent-conventions" aria-labelledby="rent-conventions-heading" className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
    <div className="rounded-3xl bg-white p-5 sm:p-8">
      <h2 id="rent-conventions-heading" className="text-2xl font-bold text-sky-900">Compare weekly and PCM conventions</h2>
      <p className="mt-3 leading-7">PW (per week) and PCW (per calendar week) both describe a seven-day week here. PCM means per calendar month. Check which conversion your agreement uses: a 52-week budget and a 365-day equivalent give slightly different answers.</p>
      <HydrationSafeControls label="Rent convention comparison">
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="font-semibold text-sky-900" htmlFor="convention-amount">Rent amount (GBP)
            <input id="convention-amount" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} aria-invalid={!result.ok} aria-describedby={!result.ok ? "convention-error" : undefined} className={control}/>
          </label>
          <label className="font-semibold text-sky-900" htmlFor="convention-direction">The amount is quoted
            <select id="convention-direction" value={direction} onChange={e=>setDirection(e.target.value as ConventionDirection)} className={`${control} cursor-pointer hover:border-sky-500`}>
              <option value="weekly">Per week (PW / PCW)</option><option value="monthly">Per calendar month (PCM)</option>
            </select>
          </label>
        </div>
      </HydrationSafeControls>
      <noscript><p className="mt-4">JavaScript is needed to change this example. The values below compare GBP 500 per week.</p></noscript>
      <div aria-live="polite" aria-atomic="true" className="mt-5">
        {!result.ok ? <p id="convention-error" className="rounded-xl bg-rose-50 p-4 text-rose-900">{result.error}</p> : <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-sky-50 p-5"><h3 className="font-bold text-sky-900">52-week budget</h3><p className="mt-2 break-words text-2xl font-bold text-sky-950">{formatMoney(result.budget, "GBP")}</p><p>{output}</p><p className="mt-2 text-sm">{direction === "weekly" ? "Weekly amount × 52 ÷ 12" : "PCM amount × 12 ÷ 52"}</p></div>
            <div className="rounded-2xl bg-sky-50 p-5"><h3 className="font-bold text-sky-900">365-day equivalent</h3><p className="mt-2 break-words text-2xl font-bold text-sky-950">{formatMoney(result.daily, "GBP")}</p><p>{output}</p><p className="mt-2 text-sm">{direction === "weekly" ? "Weekly amount × 365 ÷ 84" : "PCM amount × 84 ÷ 365"}</p></div>
          </div>
          <p className="mt-4 break-words"><strong>{formatMoney(result.difference, "GBP")} {output}</strong> difference between the displayed estimates.</p>
          {result.fourWeeks !== null && <p className="mt-2 break-words">Four weeks would be <strong>{formatMoney(result.fourWeeks, "GBP")}</strong> for 28 days. That is a different payment period from PCM.</p>}
        </>}
      </div>
      <p className="mt-4 text-sm leading-6">Both directions use matching fractions; reversing a rounded display may differ by a few pence. Calculations retain decimal precision until display rounding. A 52-week budget covers 364 days; the daily-rate model spreads 365 days over 12 months, including in leap years. Neither counts the actual payments in a particular year, nor determines what your contract requires. GBP is a currency label, with no exchange conversion.</p>
      <p className="mt-3 text-sm leading-6">Source checked 13 November 2026: <a href="https://www.gov.uk/government/publications/universal-credit-and-landlords/universal-credit-and-rented-housing-guide-for-landlords" className="text-sky-800 underline hover:text-sky-950">DWP’s rented-housing guide</a> uses weekly × 52 ÷ 12 for Universal Credit. That benefit calculation does not prescribe every private agreement. The 365-day figure is RentConverter’s stated comparison model, not a UK legal rule. This comparison is not legal or financial advice.</p>
      <Link to="/pw-to-pcm-calculator" className="mt-4 inline-block cursor-pointer font-semibold text-sky-800 underline hover:text-sky-950">Use the standard 365-day PW-to-PCM converter</Link>
    </div>
  </section>;
}
