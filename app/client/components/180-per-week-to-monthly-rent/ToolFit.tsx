import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section
      id="tool-fit"
      className="max-w-6xl mx-auto px-6 pb-12 pt-8 rc-no-print"
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-sky-800 tracking-tight">
          Who this tool is for
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                This tool is for
              </div>
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Anyone who has a listing at{" "}
              <span className="font-semibold text-slate-900">180 per week</span>{" "}
              and wants the{" "}
              <span className="font-semibold text-slate-900">
                per-calendar-month (PCM)
              </span>{" "}
              equivalent to compare against monthly budgets or monthly listings
              without doing the math by hand.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-emerald-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                Why this tool is different
              </div>
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              It’s built around a{" "}
              <span className="font-semibold text-slate-900">365-day year</span>{" "}
              and an average calendar month (365 ÷ 12), and it also shows the{" "}
              <span className="font-semibold text-slate-900">
                4-week (28-day)
              </span>{" "}
              comparison so you can see the gap between{" "}
              <span className="font-semibold text-slate-900">180 × 4</span> and
              a true calendar-month equivalent.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-rose-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                This tool is not for
              </div>
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              Calculating an exact amount you’ll be billed in a specific month.
              Real payments depend on due dates (weekly, fortnightly, 4-weekly,
              or monthly), proration, fees, and what the lease includes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-sky-50 p-5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-700"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                When to use another tool
              </div>
            </div>
            <p className="mt-2 text-slate-700 leading-relaxed">
              If you’re planning around a yearly budget (or comparing to annual
              income), convert the weekly figure to an annual total instead: use{" "}
              <Link
                to="/weekly-to-annual-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Weekly to Annual Rent Converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
