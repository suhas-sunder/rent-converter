import { useEffect, useState } from "react";
import { calculatePaycheckDeadline } from "~/client/utils/paycheckDeadline.js";
import type { PayFrequency } from "~/client/utils/paycheckDeadline.js";
import { parseMoneyToCents } from "~/client/utils/rentMath";
import { parseWholeNumber } from "~/client/utils/calendarDate.js";
import { checkPaycheckAverage } from "~/client/utils/paycheckAverageCheck.js";

type Props = {
  monthlyRentCents?: bigint;
  averageReserveCents?: bigint;
  frequency: PayFrequency;
  currency: string;
  formatMoney: (cents: bigint) => string;
};

const frequencyLabels: Record<PayFrequency, string> = {
  weekly: "weekly", biweekly: "biweekly (every 14 days)",
  semimonthly: "semimonthly (two chosen dates each month)", monthly: "monthly",
};
const fieldClass = "w-full min-w-0 rounded-xl bg-slate-100 px-3 py-2 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2";
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

export default function PaycheckDeadlinePlan({ monthlyRentCents, averageReserveCents, frequency, currency, formatMoney }: Props) {
  const [hydrated, setHydrated] = useState(false);
  const [rentOverride, setRentOverride] = useState<string | null>(null);
  const [saved, setSaved] = useState("0");
  const [nextPayday, setNextPayday] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [firstPayDay, setFirstPayDay] = useState("1");
  const [secondPayDay, setSecondPayDay] = useState("15");
  const [includeDueDay, setIncludeDueDay] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  const rent = rentOverride ?? (monthlyRentCents === undefined ? "" : `${monthlyRentCents / 100n}.${String(monthlyRentCents % 100n).padStart(2, "0")}`);
  const parsedRent = parseMoneyToCents(rent, "Enter the actual rent payment due.");
  const parsedSaved = parseMoneyToCents(saved, "Enter the amount already saved, or 0.");
  const parsedFirstDay = parseWholeNumber(firstPayDay, "Earlier pay day", 1, 31);
  const parsedSecondDay = parseWholeNumber(secondPayDay, "Later pay day", 1, 31);
  const payDayError = frequency === "semimonthly"
    ? !parsedFirstDay.ok ? parsedFirstDay.error : !parsedSecondDay.ok ? parsedSecondDay.error : null
    : null;
  const result = payDayError ? { ok: false as const, error: payDayError } : parsedRent.ok && parsedSaved.ok
    ? calculatePaycheckDeadline({
      rentCents: parsedRent.cents, savedCents: parsedSaved.cents,
      nextPayday, dueDate, frequency, includeDueDay,
      firstPayDay: parsedFirstDay.ok ? parsedFirstDay.value : undefined,
      secondPayDay: parsedSecondDay.ok ? parsedSecondDay.value : undefined,
    })
    : { ok: false as const, error: !parsedRent.ok ? parsedRent.error : !parsedSaved.ok ? parsedSaved.error : "Check the amounts." };
  const averageCheck = result.ok && parsedRent.ok && parsedSaved.ok && averageReserveCents !== undefined
    ? checkPaycheckAverage({ rentCents: parsedRent.cents, savedCents: parsedSaved.cents, reserveCents: averageReserveCents, paydayCount: result.rows.length })
    : null;

  return (
    <details className="mt-6 rounded-2xl bg-slate-50 p-4 sm:p-5">
      <summary className="cursor-pointer rounded-lg text-lg font-semibold text-sky-900 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2">
        Plan for your next rent due date
      </summary>
      <p className="mt-3 text-sm text-slate-700">
        The annual average above may not cover your next bill in time. Enter your actual dates to divide the amount still needed across the paydays before rent is due.
      </p>
      <noscript><p className="mt-3 text-sm font-semibold text-slate-700">Enable JavaScript to calculate this date-based plan. The annual-average example above is static without JavaScript.</p></noscript>
      <form className="mt-4" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} noValidate>
        <fieldset disabled={!hydrated}>
          <legend className="mb-3 text-sm text-slate-700">Using {frequencyLabels[frequency]} pay selected above. All amounts are in {currency}.</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="deadline-rent" className={labelClass}>Actual rent payment due ({currency})</label>
              <input id="deadline-rent" inputMode="decimal" value={rent} onChange={(event) => setRentOverride(event.target.value)} className={fieldClass} aria-invalid={submitted && !parsedRent.ok} aria-describedby="deadline-rent-help" />
              <p id="deadline-rent-help" className="mt-1 text-xs text-slate-700">Enter the bill due on your chosen date, including any amount you need to add. A weekly rent equivalent is not a monthly bill.</p>
            </div>
            <div>
              <label htmlFor="deadline-saved" className={labelClass}>Already saved for this payment ({currency})</label>
              <input id="deadline-saved" inputMode="decimal" value={saved} onChange={(event) => setSaved(event.target.value)} className={fieldClass} aria-invalid={submitted && !parsedSaved.ok} />
            </div>
            <div>
              <label htmlFor="deadline-next-payday" className={labelClass}>Next payday</label>
              <input id="deadline-next-payday" type="date" min="1900-01-01" max="9999-12-31" value={nextPayday} onChange={(event) => setNextPayday(event.target.value)} className={`${fieldClass} cursor-pointer`} />
            </div>
            <div>
              <label htmlFor="deadline-due-date" className={labelClass}>Rent due date</label>
              <input id="deadline-due-date" type="date" min="1900-01-01" max="9999-12-31" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={`${fieldClass} cursor-pointer`} />
            </div>
            {frequency === "semimonthly" && <>
              <div>
                <label htmlFor="deadline-first-pay-day" className={labelClass}>Earlier pay day of month (1–31)</label>
                <input id="deadline-first-pay-day" inputMode="numeric" value={firstPayDay} onChange={(event) => setFirstPayDay(event.target.value)} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="deadline-second-pay-day" className={labelClass}>Later pay day of month (1–31)</label>
                <input id="deadline-second-pay-day" inputMode="numeric" value={secondPayDay} onChange={(event) => setSecondPayDay(event.target.value)} className={fieldClass} />
              </div>
            </>}
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-slate-700">
            <input type="checkbox" checked={includeDueDay} onChange={(event) => setIncludeDueDay(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-sky-700 focus-visible:outline-2 focus-visible:outline-sky-600" />
            Count a payday on the due date — only if the money is available before rent must be paid.
          </label>
          <button type="submit" data-nosnippet className="rc-no-print mt-4 cursor-pointer rounded-xl bg-sky-800 px-4 py-2 font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2">Calculate deadline plan</button>
        </fieldset>
      </form>
      {submitted && <div className="mt-4" role="region" aria-label="Paycheck deadline plan" aria-live="polite">
        {!result.ok ? <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800">{result.error}</p> : <>
          <div className={`rounded-xl p-4 ${result.unfundedCents > 0n ? "bg-amber-50" : "bg-sky-100"}`}>
            <p className="font-semibold text-sky-900">
              {result.remainingCents === 0n
                ? "This rent payment is already covered by the amount saved."
                : result.rows.length === 0
                  ? `No eligible payday before rent is due. You still need ${formatMoney(result.unfundedCents)}.`
                  : `${formatMoney(result.remainingCents)} still needed across ${result.rows.length} payday${result.rows.length === 1 ? "" : "s"}.`}
            </p>
            {result.rows.length > 0 && result.remainingCents > 0n && <p className="mt-1 text-sm text-slate-700">Reserve the amounts below from each paycheck. This assumes each paycheck can cover its reserve; income and other bills are not assessed.</p>}
            {result.excessCents > 0n && <p className="mt-1 text-sm text-slate-700">{formatMoney(result.excessCents)} of the amount saved is above this payment.</p>}
          </div>
          {averageCheck?.ok && averageReserveCents !== undefined && <section className="mt-3 rounded-xl bg-white p-4" aria-label="Annual average deadline check">
            <h3 className="font-semibold text-sky-900">Would the annual average cover this bill?</h3>
            <p className="mt-2 text-sm text-slate-700">Saving {formatMoney(averageReserveCents)} on each of these {result.rows.length} actual payday{result.rows.length === 1 ? "" : "s"} adds {formatMoney(averageCheck.newSavingsCents)}. Including your existing savings, you would have {formatMoney(averageCheck.availableCents)} by {dueDate}.</p>
            <p className={`mt-2 font-semibold ${averageCheck.shortfallCents > 0n ? "text-amber-900" : "text-sky-900"}`}>
              {averageCheck.shortfallCents > 0n ? `${formatMoney(averageCheck.shortfallCents)} short of this rent payment.` : averageCheck.surplusCents > 0n ? `${formatMoney(averageCheck.surplusCents)} left after this rent payment.` : "The average saving amount covers this payment exactly."}
            </p>
            <p className="mt-2 text-xs text-slate-700">This check repeats the displayed, cent-rounded annual-average amount from the calculator above. It does not count future paychecks after the deadline or other bills. Changing the actual bill here does not change that annual average.</p>
          </section>}
          {result.rows.length > 0 && <div role="region" aria-label="Paycheck reserve schedule" tabIndex={0} className="mt-3 overflow-x-auto rounded-xl bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500">
            <table className="w-full text-left text-sm">
              <caption className="px-3 py-2 text-left text-sm font-semibold text-sky-900">Reserve schedule for rent due {dueDate}</caption>
              <thead><tr className="bg-sky-50 text-sky-900"><th scope="col" className="p-3">Payday</th><th scope="col" className="p-3 text-right">Set aside</th><th scope="col" className="p-3 text-right">Saved total</th></tr></thead>
              <tbody>{result.rows.map((row) => <tr key={row.date} className="border-t border-slate-100 text-slate-800"><th scope="row" className="whitespace-nowrap p-3 font-normal">{row.date}</th><td className="p-3 text-right tabular-nums">{formatMoney(row.reserveCents)}</td><td className="p-3 text-right tabular-nums">{formatMoney(row.balanceCents)}</td></tr>)}</tbody>
            </table>
          </div>}
        </>}
      </div>}
      <p className="mt-3 text-xs leading-relaxed text-slate-700">
        Monthly pay repeats the day of your next payday. Semimonthly pay uses the two days entered. A day missing from a shorter month moves to month-end; coincident dates count once. Weekly and biweekly pay repeat every 7 and 14 days. Weekends, bank holidays and deposit delays are not adjusted. Check your employer’s schedule. Extra cents go to the earliest paydays so the reserves add up exactly. This plan stays in this tab and is included when you print with this section open.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-slate-700">Biweekly means every 14 days; semimonthly means two dates each month. The annual comparison uses 26 and 24 paychecks respectively, while this plan counts the entered dates. Some calendar years contain 27 biweekly paydays. Four-week rent covers 28 days, not a calendar month. Currency changes labels only, not exchange rates. This is a planning estimate, not financial advice.</p>
      <p className="mt-2 text-xs text-slate-700">Sources checked November 13, 2026: <a className="cursor-pointer text-sky-800 underline hover:text-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/income-tax/increasing-income-tax-deductions.html">CRA common and uncommon pay-period counts</a>; <a className="cursor-pointer text-sky-800 underline hover:text-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" href="https://www.consumerfinance.gov/archive/blog/budget-help-manage-your-monthly-expenses-bill-calendar/">CFPB bill-calendar guidance</a>. These sources explain timing; they do not verify your employer’s dates or lease obligations.</p>
    </details>
  );
}
