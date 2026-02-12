import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section className="mt-8 mb-12 mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border border-slate-200 bg-white sm:shadow-sm px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-sky-800 tracking-tight">
            Who this tool is for (and not for)
          </h2>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">This tool is for</div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              Converting rent paid every 14 days into a monthly equivalent you
              can compare with normal monthly listings and budgets.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">
              Why this tool is different
            </div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              It anchors the monthly result to a day-based year (biweekly ÷ 14 ×
              365 ÷ 12) and also shows the 28-day view, so you can spot schedule
              drift instead of treating every month like “four weeks.”
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">This tool is not for</div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              Reproducing your exact invoice dates or proration rules if your
              lease uses mid-month starts, partial periods, fees, or custom
              billing logic.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-4 py-4">
            <div className="text-xs text-slate-600">
              When to use another tool
            </div>
            <p className="mt-1 text-sm sm:text-[0.95rem] text-slate-800 leading-relaxed ">
              If you are actually billed every 28 days (not every 14), use{" "}
              <Link
                to="/rent-paid-every-4-weeks-calculator"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Rent Paid Every 4 Weeks Calculator
              </Link>
              . If you already have a weekly amount and want monthly, use{" "}
              <Link
                to="/weekly-to-monthly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Weekly to Monthly Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-4">
          <div className="text-xs text-slate-600">
            Common confusion this avoids
          </div>
          <p className="mt-1 text-sm text-slate-700 leading-relaxed ">
            Biweekly is every 14 days, so it does not line up cleanly with
            calendar months. Some months will contain two payments, and over
            time the payment timing shifts. That is why a simple “twice a month”
            mental model can mislead you.
          </p>
        </div>
      </div>
    </section>
  );
}
