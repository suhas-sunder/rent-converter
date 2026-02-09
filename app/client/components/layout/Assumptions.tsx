import { useState } from "react";

export default function Assumptions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="my-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left text-slate-600 hover:text-slate-900 cursor-pointer"
      >
        <span>Assumptions: 365-day year, 28-day 4-week period</span>
        <span
          className={`ml-2 inline-block transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul className="mt-2 list-disc pl-4 space-y-1 text-[11px] text-slate-600">
          <li>1 year = 365 days</li>
          <li>Biweekly = 14 days</li>
          <li>4-week rent = 28 days</li>
          <li>Month = 365 ÷ 12 days (average)</li>
          <li>
            “Rent” is not defined by this tool. Enter the total you want to
            budget with.
          </li>
        </ul>
      )}
    </div>
  );
}
