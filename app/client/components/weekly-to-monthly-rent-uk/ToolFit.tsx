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
              UK renters who are looking at a{" "}
              <span className="font-semibold text-slate-900">
                per week (pw)
              </span>{" "}
              price and need the{" "}
              <span className="font-semibold text-slate-900">
                per calendar month (pcm)
              </span>{" "}
              equivalent for a monthly budget, affordability check, or comparing
              against pcm listings. It converts weekly rent using a consistent{" "}
              <span className="font-semibold text-slate-900">365-day</span>{" "}
              basis so the monthly number is anchored to an average calendar
              month, not a 4-week shortcut.
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
              It separates{" "}
              <span className="font-semibold text-slate-900">PCM</span> from{" "}
              <span className="font-semibold text-slate-900">4-weekly</span>{" "}
              (28-day) thinking. You’ll see the monthly equivalent and a 4-week
              comparison derived from the same annual total, so it’s obvious why{" "}
              <span className="font-semibold text-slate-900">weekly × 4</span>{" "}
              doesn’t match a calendar month. Decimals are preserved internally
              so the breakdown stays consistent.
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
              Predicting your exact rent collection pattern in the UK (weekly,
              4-weekly, or monthly due dates) or calculating an invoice-ready
              amount. It does not include deposits, council tax, bills,
              utilities, parking, fees, or pro-rata rules tied to move-in dates.
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
              If you want the yearly figure behind a UK weekly advert (useful
              for salary-based affordability or comparing to an annual total),
              use{" "}
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
