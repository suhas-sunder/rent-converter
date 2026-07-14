import { adSlots, type AdSlotName } from "~/client/data/adSlots";

type AdPlaceholderProps = {
  slot: AdSlotName;
  className?: string;
};

const slotClasses: Record<AdSlotName, string> = {
  home_top_banner: "min-h-[100px] sm:min-h-[90px]",
  home_left_sidebar: "min-h-[600px] w-[160px]",
  home_right_sidebar: "min-h-[600px] w-[160px]",
  home_below_utility_banner: "min-h-[100px] sm:min-h-[90px]",
  home_seo_square: "min-h-[250px] max-w-[300px]",
  home_all_tools_banner: "min-h-[100px] sm:min-h-[90px]",
};

/**
 * Static reserved space for a future provider integration. This component
 * intentionally has no provider code, storage, network activity, or controls.
 */
export default function AdPlaceholder({ slot, className = "" }: AdPlaceholderProps) {
  const config = adSlots[slot];

  return (
    <div
      className={`print:hidden flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 ${slotClasses[slot]} ${className}`}
      data-ad-placeholder={slot}
      data-ad-placement={config.placement}
      data-nosnippet
    >
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Advertisement
      </span>
    </div>
  );
}
