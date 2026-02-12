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
          This page converts a daily rent price into a monthly equivalent so you
          can compare day-based pricing to normal monthly listings without
          guessing.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">This tool is for</div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              Converting a rent-per-day amount into a monthly equivalent using a
              consistent 365-day year and an average month length (365 ÷ 12).
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">
              Why this tool is different
            </div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              It separates the two monthly ideas people mix up: “30-day month”
              and “average month,” then shows the breakdown so the assumption is
              obvious.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">This tool is not for</div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              Calculating an exact invoice for a specific calendar month,
              short-term stay, or lease that adds taxes, cleaning fees, parking,
              or bundled utilities.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">
              When to use another tool
            </div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              If you already have a monthly price and want the daily equivalent,
              use{" "}
              <Link
                to="/monthly-to-daily-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Monthly to Daily Rent Converter
              </Link>
              . If the pricing is actually every 28 days (not “monthly”), use{" "}
              <Link
                to="/rent-paid-every-4-weeks"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Rent Paid Every 4 Weeks
              </Link>
              . If you are sanity-checking affordability instead of converting
              periods, use{" "}
              <Link
                to="/rent-affordability-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Rent Affordability Calculator
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-4">
          <div className="text-xs text-slate-600">Quick decision rule</div>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed ">
            If someone says “$X per day,” multiplying by 30 is a shortcut. This
            tool uses average-month math so daily, weekly, 4-week, monthly, and
            annual numbers all stay consistent with each other.
          </p>
        </div>
      </div>
    </section>
  );
}
