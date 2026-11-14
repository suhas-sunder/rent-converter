import { useState } from "react";
import HydrationSafeControls from "~/client/components/HydrationSafeControls";
import { calculateMoveInWorksheet, MOVE_IN_ITEMS, moveInWorksheetCsv, type MoveInInput, type FirstRentMode } from "~/client/utils/moveInWorksheet.js";
import { formatMoney, isCurrency, SUPPORTED_CURRENCIES, type Currency } from "~/client/utils/rentMath";

const control = "w-full min-w-0 cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-400";
const button = "cursor-pointer rounded-xl bg-sky-800 px-4 py-2 font-semibold text-white hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

export default function MoveInWorksheet() {
  const [input, setInput] = useState<MoveInInput>({ monthlyRent: "", firstRent: "full", chargedDays: "", periodDays: "", lastRent: "0", deposit: "0", fees: "0", utilities: "0", moving: "0" });
  const [currency, setCurrency] = useState<Currency>("USD");
  const [submitted, setSubmitted] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState("");
  const result = calculateMoveInWorksheet(input);
  const errors = submitted && !result.ok ? result.errors : {};
  const update = (key: keyof MoveInInput, value: string) => { setInput(current => ({ ...current, [key]: value })); setDownloadMessage(""); };
  const field = (key: keyof MoveInInput, label: string, helper?: string, integer = false) => <div className="min-w-0" key={key}>
    <label htmlFor={`move-in-${key}`} className="mb-2 block text-sm font-semibold text-slate-800">{label}</label>
    <input id={`move-in-${key}`} inputMode={integer ? "numeric" : "decimal"} autoComplete="off" className={control} value={input[key]} onChange={event => update(key, event.target.value)} aria-invalid={!!errors[key]} aria-describedby={`move-in-${key}-help`} />
    <p id={`move-in-${key}-help`} className={`mt-1 text-sm ${errors[key] ? "font-semibold text-rose-800" : "text-slate-600"}`}>{errors[key] || helper || `Enter ${currency}; use 0 if this cost does not apply.`}</p>
  </div>;
  const download = () => {
    if (!result.ok) return;
    try {
      const url = URL.createObjectURL(new Blob([moveInWorksheetCsv(result, currency)], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a"); link.href = url; link.download = "rentconverter-move-in-costs.csv"; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000); setDownloadMessage("Move-in CSV download started.");
    } catch { setDownloadMessage("The download could not start. Print or save this worksheet as a PDF instead."); }
  };
  return <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6" aria-labelledby="move-in-title">
    <details className="rounded-[1.75rem] bg-white px-5 py-6 sm:px-8">
      <summary className="cursor-pointer rounded-lg text-sky-900 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600">
        <h2 id="move-in-title" className="inline text-xl font-bold text-sky-900">Plan your one-time move-in costs</h2>
        <span className="mt-2 block text-sm text-slate-700">Add first rent, prepaid last rent, deposits and setup costs without mixing them into your monthly budget.</span>
      </summary>
      <p className="mt-4 text-sm text-slate-700">Use quoted amounts from your agreement and service providers. Optional items start at zero. This separate worksheet does not copy values from the budgets above or determine which charges are lawful or required.</p>
      <noscript><p className="mt-3 rounded-xl bg-sky-50 p-3">Enable JavaScript for the move-in worksheet. To calculate manually, add the first rent payment, any last rent prepaid, deposit, fees, utility setup and moving costs. Keep recurring monthly rent separate.</p></noscript>
      <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }} noValidate className="mt-5 print:hidden">
        <HydrationSafeControls label="Move-in worksheet inputs">
          <div className="grid gap-4 sm:grid-cols-2">
            {field("monthlyRent", "Monthly rent for move-in worksheet", "Use the actual monthly rent. A weekly equivalent is not necessarily the bill.")}
            <div><label htmlFor="move-in-currency" className="mb-2 block text-sm font-semibold text-slate-800">Move-in currency</label><select id="move-in-currency" className={control} value={currency} onChange={event => { if (isCurrency(event.target.value)) { setCurrency(event.target.value); setDownloadMessage(""); } }}>{SUPPORTED_CURRENCIES.map(code => <option key={code}>{code}</option>)}</select><p className="mt-1 text-sm text-slate-600">Currency labels only; no exchange-rate conversion.</p></div>
            <div><label htmlFor="move-in-firstRent" className="mb-2 block text-sm font-semibold text-slate-800">First rent included</label><select id="move-in-firstRent" className={control} value={input.firstRent} onChange={event => update("firstRent", event.target.value as FirstRentMode)}><option value="full">One full month</option><option value="partial">Partial first month only</option><option value="none">Exclude first rent</option></select><p className="mt-1 text-sm text-slate-600">Partial rent replaces the full first month so it is not counted twice.</p></div>
            {input.firstRent === "partial" && <>{field("chargedDays", "Days charged for first rent", "Whole charged days, including any last day your agreement charges.", true)}{field("periodDays", "Days in the rent month", "Enter 28, 29, 30 or 31. Use this method only if your agreement uses actual days in that month.", true)}</>}
            {MOVE_IN_ITEMS.map(item => field(item.key as keyof MoveInInput, item.label, item.key === "deposit" ? "Enter only deposits described as refundable. Refunds and deductions are not predicted." : undefined))}
          </div>
          <button type="submit" className={`${button} mt-5 rc-no-print`} data-nosnippet>Calculate move-in costs</button>
        </HydrationSafeControls>
      </form>
      {submitted && <div className="mt-5" role="region" aria-label="Move-in cost result" aria-live="polite">
        {!result.ok ? <p role="alert" className="rounded-xl bg-rose-50 p-3 font-semibold text-rose-800">Check the highlighted amounts and day counts before calculating.</p> : <>
          <div className="rounded-xl bg-sky-50 p-4"><h3 className="font-semibold text-sky-900">Total one-time cash to plan for</h3><p className="mt-1 break-all text-2xl font-bold tabular-nums text-sky-900">{formatMoney(result.totalCents, currency)}</p><p className="mt-1 text-sm text-slate-700">Combined estimate, not a statement that all items are due on the same date.</p></div>
          <dl className="mt-3 divide-y divide-slate-100">{result.rows.map(row => <div key={row.key} className="grid break-inside-avoid gap-1 py-3 sm:grid-cols-2"><dt className="text-sm text-slate-700">{row.label}</dt><dd className="break-all font-semibold tabular-nums text-slate-900 sm:text-right">{formatMoney(row.cents, currency)}</dd></div>)}</dl>
          <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700"><strong>Recurring monthly rent, separate:</strong> <span className="inline-block max-w-full break-all">{formatMoney(result.recurringRentCents, currency)}</span>. This is not added again to the one-time total. Utilities and other recurring costs belong in the housing budget above.</p>
          <p className="mt-3 text-sm text-slate-700">{result.firstRentExplanation} Each item is rounded to cents once; the total is the exact sum of those displayed items.</p>
          <div className="rc-no-print mt-4 flex flex-wrap gap-3" data-nosnippet><button type="button" onClick={download} className={button}>Download move-in CSV</button><button type="button" onClick={() => window.print()} className={button}>Print move-in worksheet / Save PDF</button></div>
        </>}
      </div>}
      <p className="rc-no-print mt-2 text-sm text-slate-700" role="status">{downloadMessage}</p>
      <p className="mt-4 text-xs leading-relaxed text-slate-700">The worksheet stays in this tab; it is not saved. Deposits are cash needed upfront even when potentially refundable. Do not enter the same charge under two categories. No deposit cap, fee requirement, legal due date or future refund is assumed. This is arithmetic, not legal or financial advice. For partial rent under a different basis, use the <a className="cursor-pointer text-sky-800 underline hover:text-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" href="/prorated-rent-calculator">prorated rent calculator</a> and check the agreement.</p>
    </details>
  </section>;
}
