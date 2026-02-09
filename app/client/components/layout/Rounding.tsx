export default function Rounding({
  roundDisplay,
  setRoundDisplay,
  displayDecimals,
  setDisplayDecimals,
}: {
  roundDisplay: boolean;
  setRoundDisplay: (roundDisplay: boolean) => void;
  displayDecimals: number;
  setDisplayDecimals: (displayDecimals: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={roundDisplay}
          onChange={(e) => setRoundDisplay(e.target.checked)}
          className="mt-0.5 h-4 w-4 cursor-pointer accent-blue-600 focus:ring-2 focus:ring-blue-200"
          aria-label="Round displayed values"
        />

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer">
            <span>Round display</span>
          </label>

          <p className="mt-0.5 text-[11px] text-slate-500">
            Display only. Internally uses up to 12 decimals for calculation.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        <div className="text-[11px] text-slate-500">Decimals</div>
        <select
          value={displayDecimals}
          onChange={(e) => {
            const v = Math.trunc(Number(e.target.value));
            setDisplayDecimals(
              v === 0 || v === 2 || v === 4 || v === 6 ? v : 2,
            );
          }}
          className="cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none hover:border-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          aria-label="Displayed decimals"
        >
          <option value={0}>0</option>
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={6}>6</option>
        </select>
      </div>
    </div>
  );
}
