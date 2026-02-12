import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section className="mt-8 mb-12 mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border border-slate-200 bg-white sm:shadow-sm px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-sky-600" aria-hidden="true" />
          <h2 className="text-lg sm:text-xl font-bold text-sky-800 tracking-tight">
            Who this tool is for (and not for)
          </h2>
        </div>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed ">
          This page turns a 14-day rent amount into a clean weekly number you
          can compare against listings, budgets, and pay stubs that speak in
          weeks.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">This tool is for</div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              Converting rent paid every 14 days into an equivalent weekly
              amount (7-day pricing) for apples-to-apples comparisons.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">
              Why this tool is different
            </div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              Weekly is computed directly from the schedule definition (biweekly
              ÷ 2), so you are not relying on vague “monthly-ish” shortcuts or
              hidden rounding.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">This tool is not for</div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              Predicting your exact payment dates, proration on move-in or
              move-out, or any fees that your lease includes outside base rent.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">
              When to use another tool
            </div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              If you want a monthly budget number instead of weekly, use{" "}
              <Link
                to="/biweekly-to-monthly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Biweekly to Monthly Rent Converter
              </Link>
              . If you are comparing yearly totals (or the “26 payments vs
              day-based year” problem), use{" "}
              <Link
                to="/biweekly-to-annual-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Biweekly to Annual Rent Converter
              </Link>
              . If your rent is truly billed every 28 days, use{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Rent Paid Every 4 Weeks Calculator
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-4">
          <div className="text-xs text-slate-600">Quick mental model</div>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed ">
            Biweekly is a fixed 14-day schedule. Weekly is a fixed 7-day
            schedule. That is why the weekly equivalent is simply half of the
            biweekly amount. Calendar months vary in length, so monthly
            comparisons need different math.
          </p>
        </div>
      </div>
    </section>
  );
}
