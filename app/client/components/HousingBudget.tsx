import { useState } from "react";
import {
  calculateHousingBudget,
  HOUSING_FREQUENCIES,
  HOUSING_ITEMS,
  restoreHousingBudget,
  type HousingBudgetInput,
  type HousingFrequency,
} from "~/client/utils/housingBudget.js";
import { isCurrency, SUPPORTED_CURRENCIES, type Currency } from "~/client/utils/rentMath";
import { useHydrationSafeSavedState } from "~/client/utils/savedState.js";

const FREQUENCY_LABELS: Record<HousingFrequency, string> = {
  monthly: "Monthly", weekly: "Weekly", fortnightly: "Every 2 weeks", quarterly: "Every 3 months", annual: "Yearly",
};
const controlClass = "w-full min-w-0 cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-300 focus-visible:ring-sky-400";

// Keep cents exact even for large totals; Number(cents) can lose cents before
// formatting. Currency symbols and grouping still come from Intl.
function formatBudgetMoney(cents: bigint, currency: Currency) {
  const absolute = cents < 0n ? -cents : cents;
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const parts = formatter.formatToParts(absolute / 100n);
  return `${cents < 0n ? "−" : ""}${parts.map(part => part.type === "fraction" ? String(absolute % 100n).padStart(2, "0") : part.value).join("")}`;
}

function BudgetField({ field, label, value, onChange, error, helper }: {
  field: string; label: string; value: string; onChange: (value: string) => void; error?: string; helper?: string;
}) {
  const id = `housing-budget-${field}`;
  const description = [helper ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return <div className="min-w-0">
    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">{label}</label>
    <input id={id} type="text" inputMode="decimal" autoComplete="off" value={value} onChange={event => onChange(event.target.value)}
      aria-invalid={error ? true : undefined} aria-describedby={description} className={controlClass} />
    {helper ? <p id={`${id}-help`} className="mt-2 text-sm text-slate-600">{helper}</p> : null}
    {error ? <p id={`${id}-error`} className="mt-2 text-sm font-semibold text-rose-800">{error}</p> : null}
  </div>;
}

export default function HousingBudget() {
  const [input, setInput] = useState<HousingBudgetInput>(() => ({
    income: "", commitments: "0", savings: "0",
    items: HOUSING_ITEMS.map(item => ({ ...item, amount: item.key === "rent" ? "" : "0", frequency: "monthly" })),
  }));
  const [currency, setCurrency] = useState<Currency>("USD");
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const result = calculateHousingBudget(input);
  const errors = result.ok ? {} : result.errors;
  useHydrationSafeSavedState({
    restore(storage) {
      const saved = restoreHousingBudget(storage.getItem("rc_housing_budget_v1"));
      if (!saved || !isCurrency(saved.currency)) return false;
      setInput({ income: saved.income, commitments: saved.commitments, savings: saved.savings, items: saved.items });
      setCurrency(saved.currency);
      return true;
    },
    persist(storage) {
      if (result.ok) storage.setItem("rc_housing_budget_v1", JSON.stringify({ ...input, currency }));
    },
    dependencies: [input, currency],
  });
  const touch = (field: string) => setTouched(current => new Set(current).add(field));
  const update = (field: "income" | "commitments" | "savings", value: string) => {
    touch(field);
    setInput(current => ({ ...current, [field]: value }));
  };

  return <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6" aria-labelledby="housing-budget-title">
    <details className="rounded-[1.75rem] bg-white px-5 py-6 sm:px-8">
      <summary className="cursor-pointer rounded-lg text-sky-900 transition hover:text-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-4">
        <h2 id="housing-budget-title" className="inline text-xl font-bold text-sky-900">Check your take-home housing budget</h2>
        <span className="mt-2 block text-sm font-normal text-slate-700">Add bills with different payment periods and see what remains after other commitments and savings.</span>
      </summary>
      <div className="mt-6">
        <p className="mb-5 text-sm leading-relaxed text-slate-700">This is a separate budget from the gross-income comparison above. Enter your own after-tax income and costs; values are not copied between the tools. Use one currency throughout.</p>
        <noscript><p className="mb-4 rounded-xl bg-sky-50 p-4">Enable JavaScript for this interactive budget. To calculate manually, normalize each housing bill to a monthly amount, add them, then subtract that total, other commitments and savings from monthly take-home income.</p></noscript>
        <div className="grid gap-5 sm:grid-cols-2">
          <BudgetField field="income" label="Monthly take-home income" value={input.income} onChange={value => update("income", value)} error={touched.has("income") ? errors.income : undefined} helper="Income available after tax and payroll deductions. Enter 0 if there is no income." />
          <div>
            <label htmlFor="housing-budget-currency" className="mb-2 block text-sm font-semibold text-slate-800">Budget currency</label>
            <select id="housing-budget-currency" className={controlClass} value={currency} onChange={event => { if (isCurrency(event.target.value)) setCurrency(event.target.value); }}>
              {SUPPORTED_CURRENCIES.map(code => <option value={code} key={code}>{code}</option>)}
            </select>
            <p className="mt-2 text-sm text-slate-600">Changes the currency label, not the exchange rate.</p>
          </div>
        </div>
        <fieldset className="mt-6 space-y-4">
          <legend className="mb-3 text-lg font-bold text-sky-900">Recurring housing costs</legend>
          <p className="text-sm text-slate-600">Use 0 for costs already included in rent. Leave deposits and one-off moving costs out of this recurring budget.</p>
          {input.items.map(item => <div key={item.key} className="grid gap-3 sm:grid-cols-2">
            <BudgetField field={item.key} label={item.label} value={item.amount} error={touched.has(item.key) ? errors[item.key] : undefined} onChange={amount => {
              touch(item.key);
              setInput(current => ({ ...current, items: current.items.map(row => row.key === item.key ? { ...row, amount } : row) }));
            }} />
            <div>
              <label htmlFor={`housing-budget-${item.key}-frequency`} className="mb-2 block text-sm font-semibold text-slate-800">{item.label} billing period</label>
              <select id={`housing-budget-${item.key}-frequency`} className={controlClass} value={item.frequency} onChange={event => {
                const frequency = event.target.value as HousingFrequency;
                if (HOUSING_FREQUENCIES.includes(frequency)) setInput(current => ({ ...current, items: current.items.map(row => row.key === item.key ? { ...row, frequency } : row) }));
              }}>
                {HOUSING_FREQUENCIES.map(frequency => <option value={frequency} key={frequency}>{FREQUENCY_LABELS[frequency]}</option>)}
              </select>
            </div>
          </div>)}
        </fieldset>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <BudgetField field="commitments" label="Monthly non-housing commitments" value={input.commitments} onChange={value => update("commitments", value)} error={touched.has("commitments") ? errors.commitments : undefined} helper="Include food, transport, debt and other spending. Do not repeat the housing bills above or savings below." />
          <BudgetField field="savings" label="Monthly savings target" value={input.savings} onChange={value => update("savings", value)} error={touched.has("savings") ? errors.savings : undefined} helper="Additional savings from take-home income; exclude savings already deducted from your paycheck." />
        </div>
        <div className="mt-6" role="status" aria-live="polite" aria-atomic="true">
          {!result.ok ? <p className="rounded-xl bg-sky-50 px-4 py-3 text-sm text-slate-800">{touched.size ? "Complete the required fields and fix any highlighted amounts to see your budget." : "Enter take-home income and rent to see your budget. Other costs start at zero."}</p> : <div className="rounded-2xl bg-sky-50 p-5 sm:p-6">
            <h3 className="text-base font-semibold text-sky-900">Average monthly housing cost</h3>
            <p className="mt-2 break-words text-3xl font-bold tabular-nums text-emerald-800">{formatBudgetMoney(result.monthlyHousingCents, currency)}</p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4"><dt className="text-sm text-slate-700">Share of take-home income</dt><dd className="mt-1 text-xl font-bold text-sky-900">{result.housingPercent === null ? "Not available with zero income" : `${result.housingPercent}%`}</dd></div>
              <div className="rounded-xl bg-white p-4"><dt className="text-sm text-slate-700">{result.remainingCents < 0n ? "Monthly shortfall after costs and savings" : "Monthly amount remaining after costs and savings"}</dt><dd className={`mt-1 break-words text-xl font-bold tabular-nums ${result.remainingCents < 0n ? "text-rose-800" : "text-sky-900"}`}>{formatBudgetMoney(result.remainingCents < 0n ? -result.remainingCents : result.remainingCents, currency)}</dd></div>
            </dl>
            <table className="mt-5 w-full table-fixed text-left text-sm">
              <caption className="mb-2 text-left font-semibold text-sky-900">Monthly breakdown ({currency})</caption>
              <thead><tr><th scope="col" className="py-2">Item</th><th scope="col" className="py-2 text-right">Monthly amount</th></tr></thead>
              <tbody>
                <tr><th scope="row" className="py-2 font-normal">Take-home income</th><td className="break-words py-2 text-right tabular-nums">{formatBudgetMoney(result.incomeCents, currency)}</td></tr>
                {result.items.map(item => <tr key={item.key}><th scope="row" className="py-2 font-normal">{item.label} <span className="block text-xs text-slate-600">{item.amount} {currency} · {FREQUENCY_LABELS[item.frequency]}</span></th><td className="break-words py-2 text-right tabular-nums">{formatBudgetMoney(item.monthlyCents, currency)}</td></tr>)}
                <tr><th scope="row" className="py-2 font-normal">Non-housing commitments</th><td className="break-words py-2 text-right tabular-nums">{formatBudgetMoney(result.commitmentsCents, currency)}</td></tr>
                <tr><th scope="row" className="py-2 font-normal">Savings target</th><td className="break-words py-2 text-right tabular-nums">{formatBudgetMoney(result.savingsCents, currency)}</td></tr>
              </tbody>
            </table>
            <p className="mt-3 text-sm text-slate-700">{result.remainingCents < 0n ? "The entered costs and savings exceed take-home income. Review the amounts or the housing option to close this gap." : "This remainder covers only costs you have not already entered. It is not a rent recommendation or an approval decision."}</p>
          </div>}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-700">Weekly and two-week bills use a 365-day year: weekly × 365 ÷ 7 ÷ 12, or two-week × 365 ÷ 14 ÷ 12. Quarterly bills divide by 3 and yearly bills by 12. This estimates an average month, not the exact cash needed on each payment date. Calculations retain precision until display; rounded rows may differ from the rounded total by a cent. This is a planning calculation, not financial advice.</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 rc-no-print" data-nosnippet>
          <button type="button" onClick={() => window.print()} className="cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2">Print budget / Save PDF</button>
          <p className="text-sm text-slate-600">Valid entries save on this device when browser storage is available.</p>
        </div>
      </div>
    </details>
  </section>;
}
