import { Link } from "react-router";

export default function  ToolFit() {
  return (
    <section id="tool-fit" className="max-w-5xl mx-auto pt-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
        Who this tool is for (and not for)
      </h2>

      <div className="grid gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-7">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            This tool is for
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed ">
            Converting rent between weekly, every-4-weeks (28-day), biweekly,
            daily, hourly, monthly, and annual so you can compare listings on the
            same timeline.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-7">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Why this tool is different
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed ">
            It uses a consistent day-rate model (365 ÷ 12 for true monthly) and
            preserves decimals end-to-end, so you see the real monthly cost
            instead of rough shortcuts like “×4.”
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-7">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            This tool is not for
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed ">
            Building a full housing budget or deciding what you personally can
            afford. It only converts the rent amount you enter into equivalent
            time periods.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] shadow-sm p-6 sm:p-7">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            When to use another tool
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed ">
            If you’re trying to figure out what rent fits your income (not just
            convert frequencies), use the{" "}
            <Link
             to="/rent-affordability-calculator"
              className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-2"
            >
              rent affordability calculator
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

