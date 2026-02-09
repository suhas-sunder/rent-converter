import { useState } from "react";

type FourWeekVsMonthlyProps = {
  monthlyMinus4w: bigint;
  monthlyMinus4wPct: number;
  fmt: (v: bigint) => string;
  formatPercent: (v: number, decimals?: number) => string;
  className?: string;
};

export default function FourWeekVsMonthly({
  monthlyMinus4w,
  monthlyMinus4wPct,
  fmt,
  formatPercent,
  className = "",
}: FourWeekVsMonthlyProps) {
  return (
    <div
      className={`sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-3 py-2 ${className}`}
    >
      <div className="text-[11px] text-slate-500">4-week vs monthly</div>

      <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
        <div className="text-sm text-slate-700">
          Monthly minus 4-week:{" "}
          <strong className="text-slate-900">{fmt(monthlyMinus4w)}</strong>
        </div>

        <div className="text-sm text-slate-700">
          Difference:{" "}
          <strong className="text-slate-900">
            {formatPercent(monthlyMinus4wPct, 2)}
          </strong>
        </div>
      </div>

      <p className="mt-1 text-[11px] text-slate-500">
        28-day 4-week periods vs ~30.42-day months cause different equivalents.
      </p>
    </div>
  );
}
