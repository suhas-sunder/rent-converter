import { useState } from 'react';
import { Link } from 'react-router';
import { compareIncreaseCosts, increaseComparisonCsv } from '~/client/utils/increaseComparison.js';
import { parsePercentage } from '~/client/utils/generatedTools.js';
import { formatMoney, monthlyToWeeklyCents, type Currency } from '~/client/utils/rentMath';

export default function IncreaseCostComparison({rent,rate,years,currency}:{rent:bigint;rate:number;years:number;currency:Currency}) {
  const [comparisonRate,setComparisonRate]=useState('0');
  const parsed=parsePercentage(comparisonRate,'Comparison annual increase');
  const result=parsed.ok ? compareIncreaseCosts(rent,rate,parsed.value,years) : null;
  function download() {
    if(!result || !parsed.ok) return;
    const url=URL.createObjectURL(new Blob([increaseComparisonCsv(result,currency,rate,parsed.value)],{type:'text/csv;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download='rent-increase-comparison.csv';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <details className="mt-6 rounded-2xl border border-sky-200 bg-white p-4 sm:p-6 print:border-0" id="increase-cost-comparison">
    <summary className="cursor-pointer text-lg font-bold text-sky-900 hover:text-sky-700 focus-visible:outline-2">Compare the total cost over these years</summary>
    <p className="mt-4 leading-7">Hypothetical monthly-payment scenarios, not legally permitted rates. Year 1 has 12 payments at the starting rent. The first increase happens after one full year; the final rent above starts after this payment horizon.</p>
    <label htmlFor="comparison-increase-rate" className="mt-4 block text-sm font-semibold">Comparison annual increase (%)</label>
    <input id="comparison-increase-rate" inputMode="decimal" value={comparisonRate} onChange={e=>setComparisonRate(e.target.value)} aria-invalid={!parsed.ok || undefined} aria-describedby="comparison-rate-help" className="mt-2 w-full cursor-pointer rounded-xl bg-slate-100 p-3 hover:bg-sky-50 focus-visible:outline-2 sm:max-w-xs" />
    <p id="comparison-rate-help" className="mt-2 text-sm">Use 0 to compare with rent staying unchanged. Enter 0–100%, up to four decimal places.</p>
    {!parsed.ok ? <p role="status" className="mt-3 font-semibold text-rose-800">{parsed.error}</p> : result ? <div aria-live="polite" className="mt-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[['Total at '+rate+'%',result.total],['Total at '+parsed.value+'%',result.alternativeTotal],['Primary minus comparison over '+years+' years',result.difference]].map(([label,value])=><div className="rounded-xl bg-sky-50 p-4" key={String(label)}><h3 className="font-semibold text-sky-900">{String(label)}</h3><p className="mt-2 break-words text-xl font-bold [overflow-wrap:anywhere]">{formatMoney(value as bigint,currency)}</p></div>)}
      </div>
      <p className="mt-4 leading-7">After {years} annual changes: {formatMoney(result.finalMonthly,currency)} per month at {rate}%, versus {formatMoney(result.alternativeFinalMonthly,currency)} at {parsed.value}%. The first figure is an average weekly equivalent of {formatMoney(monthlyToWeeklyCents(result.finalMonthly),currency)} (monthly × 84 ÷ 365), not a weekly bill.</p>
      <div role="region" aria-label="Annual payment comparison" tabIndex={0} className="mt-4 overflow-x-auto rounded-xl focus-visible:outline-2">
        <table className="w-full min-w-[30rem] text-left text-sm [overflow-wrap:normal] print:min-w-0"><caption className="mb-3 text-left font-semibold text-sky-900">Payments within the horizon — first year uses starting rent</caption><thead><tr>{['Payment year','Monthly at '+rate+'%','Monthly at '+parsed.value+'%','Annual difference (primary minus comparison)'].map(h=><th scope="col" className="p-3" key={h}>{h}</th>)}</tr></thead><tbody>{result.rows.map(row=><tr key={row.year} className="odd:bg-sky-50 print:break-inside-avoid"><th scope="row" className="p-3">{row.year}</th><td className="whitespace-nowrap p-3 print:whitespace-normal print:break-all">{formatMoney(row.monthly,currency)}</td><td className="whitespace-nowrap p-3 print:whitespace-normal print:break-all">{formatMoney(row.alternativeMonthly,currency)}</td><td className="whitespace-nowrap p-3 print:whitespace-normal print:break-all">{formatMoney(row.difference,currency)}</td></tr>)}</tbody></table>
      </div>
      <p className="mt-2 text-sm text-slate-700 print:hidden">On a narrow screen, scroll the table sideways. With a keyboard, focus the table and use the arrow keys.</p>
      <button type="button" onClick={download} data-nosnippet className="mt-4 cursor-pointer rounded-xl bg-sky-800 px-4 py-3 font-semibold text-white hover:bg-sky-950 focus-visible:outline-2 focus-visible:outline-offset-2 print:hidden">Download scenario CSV</button>
    </div> : null}
    <p className="mt-4 text-sm leading-6">Each annual change rounds the new monthly rent to cents before the next change. Totals sum 12 payments at each of those monthly amounts. No fees, utilities, partial years or irregular increases are included. Currency changes the label, not the exchange rate. This is not legal or financial advice.</p>
    <p className="mt-3"><Link to="/rent-budget-calculator" className="cursor-pointer font-semibold text-sky-800 underline hover:text-sky-950 focus-visible:outline-2">Check the new rent against your housing budget</Link></p>
  </details>;
}
