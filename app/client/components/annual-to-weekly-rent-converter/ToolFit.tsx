import { Link } from "react-router";

export default function ToolFit() {
  return (
    <section id="tool-fit" className="max-w-5xl mx-auto pb-12 pt-8 px-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-[#f7fbff] border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full bg-sky-600"
              aria-hidden="true"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-sky-800 tracking-tight">
              Who this tool is for (and not for)
            </h2>
          </div>
          <p className="mt-2 text-slate-700 leading-relaxed ">
            Use this page when you have a yearly rent total and you want a clean
            weekly number you can compare across listings or budgets.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:p-8">
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This tool is for
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              Converting an annual rent amount into a weekly equivalent, with
              extra context for common “weekly” conventions (annual ÷ 52 versus
              a 365-day week).
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Why this tool is different
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              It does not pretend “weekly” has only one definition. You get a
              clear headline result plus a side-by-side check against the true
              365-day weekly rate, so the small drift is visible instead of
              silently baked in.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              This tool is not for
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              Predicting your exact payment schedule, prorations, or what a
              property manager will bill on specific due dates. This is a
              conversion and comparison view.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#f7fbff] px-5 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              When to use another tool
            </div>
            <p className="mt-2 text-slate-800 leading-relaxed ">
              If your rent is already quoted weekly and you want the yearly
              total behind it, use the{" "}
              <Link
                to="/weekly-to-annual-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-2"
              >
                weekly to annual rent converter
              </Link>
              . If the listing is “every 2 weeks,” use the{" "}
              <Link
                to="/annual-to-biweekly-rent-converter"
                className="cursor-pointer font-semibold text-sky-800 hover:text-sky-900 underline underline-offset-2"
              >
                annual to biweekly rent converter
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
