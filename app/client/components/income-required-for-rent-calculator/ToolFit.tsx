// app/client/components/income-required-for-rent-calculator/ToolFit.tsx
import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section id="tool-fit" className="max-w-5xl mx-auto py-8 px-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-[#f7fbff] border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-sky-800 tracking-tight">
              Who this tool is for (and not for)
            </h2>
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed ">
            Quick scope check so you use the right calculator for the job.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:p-8">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This tool is for
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              Estimating the gross income required to qualify for a monthly rent
              using common landlord rules like 2x, 2.5x, and 3x rent.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Why this tool is different
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              It supports both directions in one place: rent → required income,
              and income → maximum rent allowed. Results preserve decimals
              end-to-end, with rounding only applied for display.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This tool is not for
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              Guaranteeing approval or modeling full underwriting (credit score,
              debts, employment history, guarantors). It also does not guess
              what counts as rent. Include utilities, parking, or fees in your
              rent input only if your requirement treats them as part of rent.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              When to use another tool
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              If you’re trying to decide what rent fits your income after taxes
              (not just a gross income multiple rule), use the{" "}
              <Link
                to="/how-much-rent-can-i-afford-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-2"
              >
                how much rent can I afford calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
