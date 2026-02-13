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
              People renting in Australia who see prices advertised{" "}
              <span className="font-semibold text-slate-900">
                per week (pw)
              </span>{" "}
              and want a clean{" "}
              <span className="font-semibold text-slate-900">
                monthly-equivalent
              </span>{" "}
              for planning. Use it to compare a weekly listing to a monthly
              budget, align rent with monthly bills, or sanity-check what “$X
              pw” means over a calendar month.
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
              Australia is full of “quick maths” conversions like{" "}
              <span className="font-semibold text-slate-900">weekly × 4</span>.
              This tool avoids that trap by converting from a{" "}
              <span className="font-semibold text-slate-900">
                365-day annual basis
              </span>{" "}
              and showing a{" "}
              <span className="font-semibold text-slate-900">
                4-week (28-day)
              </span>{" "}
              comparison side by side, so you can see exactly why a 28-day cycle
              and a calendar month aren’t the same thing.
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
              Calculating your exact rent payments for a specific lease. Real
              rent schedules in Australia can be weekly, fortnightly, 4-weekly,
              or monthly, and the true amount paid in a given month depends on
              due dates, start dates, proration, and inclusions like utilities,
              parking, or internet.
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
              If you’re checking affordability against income or doing a proper
              budget (bond, moving costs, annual rent totals), you’ll usually
              want the yearly number first. Use{" "}
              <Link
                to="/weekly-to-annual-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 hover:underline"
              >
                Weekly to Annual Rent Converter
              </Link>{" "}
              to convert a weekly Australian rent into an annual equivalent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
