import { useState } from "react";
import { checkLeaseBoundary } from "~/client/utils/leaseBoundary.js";
import { formatMoney, parseMoneyToCents, SUPPORTED_CURRENCIES, type Currency } from "~/client/utils/rentMath";

const inputClass = "mt-2 w-full cursor-pointer rounded-xl bg-white px-4 py-3 text-base text-slate-950 ring-1 ring-slate-300 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-600";

export default function LeaseBoundaryCheck({ start, calculatedEnd }: { start: string; calculatedEnd: string }) {
  const [lastDay, setLastDay] = useState("");
  const [rent, setRent] = useState("1800");
  const [currency, setCurrency] = useState<Currency>("USD");
  const parsedRent = parseMoneyToCents(rent);
  const result = parsedRent.ok ? checkLeaseBoundary({ start, calculatedEnd, lastDay, monthlyRentCents: parsedRent.cents }) : null;
  const error = !parsedRent.ok ? parsedRent.error : lastDay && result && !result.ok ? result.error : null;
  return <details className="mt-6 rounded-2xl bg-slate-50 p-4 print:break-inside-avoid print:bg-white" id="lease-boundary-check">
    <summary className="cursor-pointer font-semibold text-sky-900 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700">Check an agreed end date and final-month rent</summary>
    <p className="mt-3 text-sm text-slate-700">Enter the final day you expect to occupy the property. This checks the date against the calculated end above and estimates the final calendar month using actual days. It does not establish a right to end a tenancy or change your agreement.</p>
    <div className="mt-4 grid gap-4 sm:grid-cols-3 rc-no-print">
      <label className="text-sm font-semibold text-slate-800" htmlFor="lease-check-last-day">Last occupied day (from your agreement)<input className={inputClass} id="lease-check-last-day" type="date" value={lastDay} onChange={event => setLastDay(event.target.value)} aria-describedby="lease-check-help lease-check-status" /></label>
      <label className="text-sm font-semibold text-slate-800" htmlFor="lease-check-rent">Monthly rent<input className={inputClass} id="lease-check-rent" inputMode="decimal" value={rent} onChange={event => setRent(event.target.value)} aria-invalid={!parsedRent.ok} aria-describedby="lease-check-status" /></label>
      <label className="text-sm font-semibold text-slate-800" htmlFor="lease-check-currency">Currency<select className={inputClass} id="lease-check-currency" value={currency} onChange={event => setCurrency(event.target.value as Currency)}>{SUPPORTED_CURRENCIES.map(code => <option key={code} value={code}>{code}</option>)}</select></label>
    </div>
    <p className="mt-3 text-sm text-slate-600" id="lease-check-help">The first and last occupied days both count. Currency labels the amount; no exchange conversion is applied. Nothing is saved.</p>
    <div id="lease-check-status" role="status" aria-live="polite" className="mt-4 text-sm text-slate-800">
      {error ? <p className="text-rose-900">{error}</p> : result?.ok && parsedRent.ok ? <>
        <p className="font-semibold text-sky-900">{result.occupiedDays} occupied {result.occupiedDays === 1 ? "day" : "days"}, including {start} and {lastDay}.</p>
        <p className="mt-2">{result.differenceDays === 0 ? "Your entered last day matches the displayed calculated date." : `Your entered last day is ${Math.abs(result.differenceDays!)} day${Math.abs(result.differenceDays!) === 1 ? "" : "s"} ${result.differenceDays! > 0 ? "later" : "earlier"} than the displayed calculated date (${calculatedEnd}).`} Confirm any difference with the agreement; this comparison does not resolve it.</p>
        <p className="mt-3 text-xl font-bold text-sky-900 break-words">Final calendar-month estimate: {formatMoney(result.finalMonthCents!, currency)} {currency}</p>
        <p className="mt-2">{formatMoney(parsedRent.cents, currency)} monthly rent × {result.chargedDays} occupied {result.chargedDays === 1 ? "day" : "days"} ÷ {result.monthDays} calendar days. Charged dates: {result.chargedStart} through {result.chargedEnd}, inclusive.</p>
        <p className="mt-2">Rounded once to the nearest cent. This is only the final calendar month, not the whole lease total. A 30-day, weekly, or other contractual proration basis can give a different amount. No deposits, fees, notice periods or legal entitlements are calculated.</p>
      </> : <p>Enter your last occupied day to check the boundary.</p>}
    </div>
  </details>;
}
