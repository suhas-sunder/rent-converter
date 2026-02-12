import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="mx-auto max-w-6xl px-6 pb-12 mt-8"
      aria-label="Tool fit"
    >
      <div className="rounded-2xl border border-slate-200 bg-white sm:shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-sky-800">
            Who this tool is for (and not for)
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              This tool is for:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Estimating when buying a home can break even versus renting by
              comparing year-by-year rent paid, ownership cash outflow, and
              estimated equity.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              Why this tool is different:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              It separates ownership cash leaving your household from an
              end-of-horizon net cost that subtracts estimated sale proceeds, so
              you can see the tradeoff between payments and equity.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              This tool is not for:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Predicting market returns or giving financial advice, and it does
              not model taxes, deductions, refinancing, mortgage insurance, or
              variable-rate changes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              When to use another tool:
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              If you only need to convert or compare rent amounts across
              schedules (monthly, weekly, 4-week), use{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                Rent Paid Every 4 Weeks
              </Link>
              . If you’re checking whether rent fits your income, use{" "}
              <Link
                to="/how-much-rent-can-i-afford-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 rounded"
              >
                How Much Rent Can I Afford
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-emerald-50 p-4">
          <div className="text-sm font-semibold text-slate-900 mb-1">
            Quick reality check:
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            A lower “net cost” for buying can still come with higher monthly
            cash outflow early on. Use the year-by-year table to spot the
            stretch years before the model reaches break-even.
          </p>
        </div>
      </div>
    </section>
  );
}
