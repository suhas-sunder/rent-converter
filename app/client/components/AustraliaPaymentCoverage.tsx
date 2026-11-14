import {useState} from "react";
import {Link} from "react-router";
import HydrationSafeControls from "./HydrationSafeControls";
import {calculateAustraliaCoverage} from "~/client/utils/australiaCoverage.js";
import {formatMoney} from "~/client/utils/rentMath";

export default function AustraliaPaymentCoverage({weeklyRent}:{weeklyRent:string}){
 const [firstDay,setFirstDay]=useState("");
 const [lastDay,setLastDay]=useState("");
 const [payment,setPayment]=useState("");
 const [attempted,setAttempted]=useState(false);
 const result=calculateAustraliaCoverage({weeklyRent,firstDay,lastDay,payment});
 const control="mt-2 w-full min-w-0 cursor-pointer hover:border-sky-500 rounded-xl border border-slate-300 bg-white px-3 py-3 text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";
 const errors=(!result.ok&&attempted ? result.errors : {}) as Record<string,string>;
 return <section id="australia-coverage" className="mx-auto max-w-6xl px-4 pb-8 sm:px-6" aria-labelledby="australia-coverage-heading">
  <details className="rounded-3xl bg-white p-5 sm:p-8">
   <summary className="cursor-pointer rounded-xl text-xl font-bold text-sky-900 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500"><span id="australia-coverage-heading">Check the rent covered by a payment</span></summary>
   <p className="mt-4 leading-7">Use the weekly rent entered above to check a dated rent payment. Enter only the rent portion: a bond is separate security and is not credited as rent here. This check uses weekly rent ÷ 7 for each covered day; use it only if that matches your agreement or receipt.</p>
   <HydrationSafeControls label="Australian payment coverage check">
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
     <label htmlFor="coverage-first" className="font-semibold text-sky-900">First covered day<input id="coverage-first" type="date" value={firstDay} onChange={e=>setFirstDay(e.target.value)} aria-invalid={Boolean(errors.firstDay)} aria-describedby={errors.firstDay?'coverage-first-error':undefined} className={control}/>{errors.firstDay&&<span id="coverage-first-error" className="mt-2 block text-sm text-rose-900">{errors.firstDay}</span>}</label>
     <label htmlFor="coverage-last" className="font-semibold text-sky-900">Last covered day (included)<input id="coverage-last" type="date" value={lastDay} onChange={e=>setLastDay(e.target.value)} aria-invalid={Boolean(errors.lastDay)} aria-describedby={errors.lastDay?'coverage-last-error':undefined} className={control}/>{errors.lastDay&&<span id="coverage-last-error" className="mt-2 block text-sm text-rose-900">{errors.lastDay}</span>}</label>
     <label htmlFor="coverage-payment" className="font-semibold text-sky-900">Rent payment excluding bond (AUD)<input id="coverage-payment" inputMode="decimal" value={payment} onChange={e=>setPayment(e.target.value)} aria-invalid={Boolean(errors.payment)} aria-describedby={errors.payment?'coverage-payment-error':undefined} className={control}/>{errors.payment&&<span id="coverage-payment-error" className="mt-2 block text-sm text-rose-900">{errors.payment}</span>}</label>
    </div>
    <button type="button" onClick={()=>setAttempted(true)} className="mt-5 cursor-pointer rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800 focus-visible:ring-2 focus-visible:ring-sky-500 print:hidden" data-nosnippet>Check payment coverage</button>
   </HydrationSafeControls>
   <noscript><p className="mt-3">JavaScript is needed to enter dates and check payment coverage. No payment result has been calculated.</p></noscript>
   <div aria-live="polite" aria-atomic="true">
    {attempted && (!result.ok ? <p className="mt-4 rounded-xl bg-rose-50 p-4 text-rose-900">{errors.weeklyRent??'Check the highlighted fields to calculate coverage.'}</p> : <div className="mt-5 rounded-2xl bg-sky-50 p-5">
     <h3 className="font-bold text-sky-900">{result.days} covered days: {firstDay} through {lastDay}</h3>
     <p className="mt-2 break-words">Weekly rent used: {formatMoney(result.weeklyCents,'AUD')}.</p><p className="mt-2">{result.fullWeeks} full weeks and {result.extraDays} days, including both dates.</p>
     <dl className="mt-4 grid gap-4 sm:grid-cols-2">
      <div><dt>Calculated rent for these dates</dt><dd className="mt-1 break-words text-2xl font-bold text-sky-950">{formatMoney(result.expectedCents,'AUD')}</dd></div>
      <div><dt>Rent payment entered</dt><dd className="mt-1 break-words text-2xl font-bold text-sky-950">{formatMoney(result.paymentCents,'AUD')}</dd></div>
     </dl>
     <p className="mt-4 break-words font-semibold">{result.differenceCents===0n ? 'The entered payment matches this calculated period.' : `${formatMoney(result.differenceCents<0n?-result.differenceCents:result.differenceCents,'AUD')} ${result.differenceCents<0n?'below':'above'} the calculated rent for these dates.`}</p>
     <p className="mt-4 break-words">At the same weekly rate: a fortnight (14 days) is {formatMoney(result.fortnightCents,'AUD')}; the 365-day average calendar-month equivalent is {formatMoney(result.monthlyCents,'AUD')}. Neither sets your next contractual payment date.</p>
    </div>)}
   </div>
   <p className="mt-4 text-sm leading-6">Dates count actual calendar days, including 29 February. The weekly amount uses the same parsing and cent rounding as the estimate above. The daily charge is not rounded before calculating the covered period total. The monthly comparison always uses weekly × 365 ÷ 84. No fees, prior credits, rent changes or bond deductions are included. This is an arithmetic check, not a legal rent ledger, demand for payment, or finding of arrears. AUD labels amounts; no currency exchange takes place.</p>
   <p className="mt-3 text-sm leading-6">Sources checked 13 November 2026: <a href="https://www.consumer.vic.gov.au/housing/renting/rent-bond-bills-and-condition-reports/rent/rent-calculator" className="text-sky-800 underline hover:text-sky-950">Consumer Affairs Victoria’s calculator</a> explains its 365-day monthly comparison. <a href="https://www.nsw.gov.au/housing-and-construction/rules/costs-at-start-of-a-residential-tenancy" className="text-sky-800 underline hover:text-sky-950">NSW Fair Trading</a> lists rental bond and rent in advance separately. Those sources do not establish a universal Australian payment rule. Check your state or territory and agreement; this is not legal advice.</p>
   <Link to="/prorated-rent-calculator-australia" className="mt-4 inline-block cursor-pointer font-semibold text-sky-800 underline hover:text-sky-950">Compare a different rent period or proration basis</Link>
  </details>
 </section>;
}
