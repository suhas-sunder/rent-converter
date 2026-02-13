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
              People looking at a listing priced at{" "}
              <span className="font-semibold text-slate-900">170 per week</span>{" "}
              and wanting a{" "}
              <span className="font-semibold text-slate-900">
                per-calendar-month
              </span>{" "}
              equivalent they can compare against monthly listings, a rent cap,
              or a monthly budget line item.
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
              It treats{" "}
              <span className="font-semibold text-slate-900">
                a week as 7 days
              </span>{" "}
              and builds everything from a{" "}
              <span className="font-semibold text-slate-900">365-day year</span>
              , so the monthly equivalent and the 4-week (28-day) comparison are
              derived from the same annual cost. Decimals are preserved through
              the calculation, and rounding only affects what you see on screen.
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
              Predicting exactly what will be charged in a specific month. Real
              billing depends on due dates, proration, fees, included bills, and
              whether payments are collected weekly, monthly, or every 4 weeks.
              This page is for a clean monthly-equivalent comparison of{" "}
              <span className="font-semibold text-slate-900">170 per week</span>
              .
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
              If you’re planning around a yearly budget (income, savings goals,
              or a year-long lease comparison), convert the same weekly figure
              into a full annual total with{" "}
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
