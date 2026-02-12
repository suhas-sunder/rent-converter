import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="mx-auto max-w-6xl px-6 pb-10 mt-8 scroll-mt-24"
      aria-labelledby="tool-fit-title"
    >
      <div className="rounded-2xl border border-slate-200 bg-white sm:shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-sky-600" aria-hidden="true" />
          <h2
            id="tool-fit-title"
            className="text-xl sm:text-2xl font-extrabold text-sky-800 tracking-tight"
          >
            Who this tool is for (and not for)
          </h2>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-xs font-semibold text-slate-500">
              This tool is for
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              This tool is for calculating what percent of your income goes to
              rent when your rent and income are paid on different schedules.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-xs font-semibold text-slate-500">
              Why this tool is different
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              Why this tool is different: it converts both inputs to annual
              totals first (365-day year), so the ratio isn’t distorted by
              monthly vs 4-week vs weekly cycles.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
            <div className="text-xs font-semibold text-slate-500">
              This tool is not for
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              This tool is not for deciding what rent you “should” pay or
              replacing a full budget, since debts, household costs, and
              irregular income aren’t modeled.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-2">
            <div className="text-xs font-semibold text-slate-500">
              When to use another tool
            </div>
            <p className="mt-1 text-sm sm:text-base text-slate-700 leading-relaxed">
              When to use another tool: if you want to estimate the maximum rent
              you can afford from your income instead of just the ratio, use{" "}
              <Link
                to="/how-much-rent-can-i-afford-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
              >
                how much rent can I afford
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
