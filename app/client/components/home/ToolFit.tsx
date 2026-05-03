import { Link } from "react-router";

export default function  ToolFit() {
  return (
    <section id="tool-fit" className="bg-sky-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
          Who this tool is for (and not for)
        </h2>

        <div className="grid gap-4">
          <div className="rounded-2xl bg-white p-6 sm:p-7">
            <div className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              This tool is for
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Converting rent between weekly, every-4-weeks (28-day), biweekly,
              daily, hourly, monthly, and annual so you can compare listings on
              the same timeline.
            </p>
          </div>

          <div className="rounded-2xl bg-sky-100 p-6 sm:p-7">
            <div className="text-xs font-semibold uppercase tracking-wide text-sky-800">
              Why this tool is different
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed">
              It uses a consistent day-rate model (365 ÷ 12 for true monthly)
              and preserves decimals end-to-end, so you see the real monthly
              cost instead of rough shortcuts like “×4.”
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 sm:p-7">
            <div className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              This tool is not for
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Building a full housing budget or deciding what you personally can
              afford. It only converts the rent amount you enter into equivalent
              time periods.
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-6 sm:p-7">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              When to use another tool
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed">
              If you’re trying to figure out what rent fits your income (not
              just convert frequencies), use the{" "}
              <Link
                to="/rent-affordability-calculator"
                className="cursor-pointer font-semibold text-sky-800 underline underline-offset-4 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-50"
              >
                rent affordability calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
