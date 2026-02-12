import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section id="tool-fit" className="max-w-5xl mx-auto pb-16 pt-8 px-6">
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
              Converting an annual rent total into a true hourly equivalent by
              spreading it across every hour in a 365-day year (8,760 hours) so
              you can compare costs on a per-hour basis.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Why this tool is different
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              It uses a consistent 365-day / 8,760-hour year and preserves
              decimals end-to-end, plus it can optionally compare “clock-time”
              hourly vs a paid-hours-per-week scenario.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This tool is not for
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              Predicting your exact lease billing schedule or full housing costs
              (utilities, fees, deposits, parking, taxes) unless you include
              those in the annual total you enter.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              When to use another tool
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              If you’re deciding what rent fits your income (instead of
              comparing hourly equivalents), use the{" "}
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
