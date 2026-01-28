import * as React from "react";
import { Link, useLocation } from "react-router";

type NavItem = {
  label: string;
  to: string;
  keywords: string[]; // used for intent matching
};

const NAV_ITEMS: NavItem[] = [
  // High-intent calculators (keep these discoverable)
  {
    label: "Rent Calculator",
    to: "/",
    keywords: [
      "calculator",
      "rent",
      "converter",
      "convert",
      "monthly",
      "weekly",
      "annual",
      "daily",
      "hourly",
      "biweekly",
    ],
  },
  {
    label: "Split Rent",
    to: "/rent-split-calculator",
    keywords: ["split", "roommate", "rent"],
  },

  // Affordability and income
  {
    label: "Affordability",
    to: "/how-much-rent-can-i-afford-calculator",
    keywords: ["afford", "affordability", "income", "budget"],
  },
  {
    label: "Rent Due Date",
    to: "/rent-due-date-calculator",
    keywords: ["due", "date", "rent"],
  },

  {
    label: "Rent % of Income",
    to: "/rent-as-percentage-of-income-calculator",
    keywords: ["percentage", "income", "ratio"],
  },
  {
    label: "After Tax Income",
    to: "/rent-after-tax-income-calculator",
    keywords: ["after tax", "tax", "take home"],
  },
  {
    label: "Rent vs Take-Home",
    to: "/rent-vs-take-home-pay-calculator",
    keywords: ["take home", "paycheck", "income"],
  },

  // Rent frequency calculators
  {
    label: "Rent Per Day",
    to: "/rent-per-day-calculator",
    keywords: ["per day", "daily"],
  },
  {
    label: "Rent Per Week",
    to: "/rent-per-week-calculator",
    keywords: ["per week", "weekly"],
  },
  {
    label: "Paid Every 4 Weeks",
    to: "/rent-paid-every-4-weeks-calculator",
    keywords: ["4 weeks", "every 4 weeks"],
  },
  {
    label: "Per Paycheck",
    to: "/rent-per-paycheck-calculator",
    keywords: ["paycheck", "biweekly"],
  },

  // Rent increases
  {
    label: "Rent Increase",
    to: "/rent-increase-calculator",
    keywords: ["increase", "raise"],
  },
  {
    label: "Increase %",
    to: "/rent-increase-percentage-calculator",
    keywords: ["increase", "percent"],
  },
  {
    label: "After Increase",
    to: "/rent-after-increase-calculator",
    keywords: ["after increase"],
  },

  // Rent vs buy
  {
    label: "Rent vs Buy",
    to: "/rent-vs-buy-calculator",
    keywords: ["buy", "mortgage", "own"],
  },
];

function isPolicyRoute(pathname: string) {
  return (
    pathname === "/terms-of-service" ||
    pathname === "/privacy-policy" ||
    pathname === "/cookies"
  );
}

function scoreItemForPath(item: NavItem, pathname: string) {
  // Exact match gets top priority
  if (item.to === pathname) return 1000;

  const p = pathname.toLowerCase();
  const t = item.to.toLowerCase();

  let score = 0;

  // Same section boost
  const section = t.split("/")[1] || "";
  const currentSection = (p.split("/")[1] || "").toLowerCase();
  if (section && section === currentSection) score += 40;

  // Keyword matching boost
  for (const k of item.keywords) {
    const kk = k.toLowerCase();
    if (kk && p.includes(kk.replace(/\s+/g, "-"))) score += 12;
    if (kk && p.includes(kk)) score += 8;
  }

  // Rent converter family boost for conversion slugs
  const isConverterSlug =
    p.includes("rent-converter") && p !== "/rent-converter";
  if (isConverterSlug && item.to === "/rent-converter") score += 60;

  // Calculator family boost
  const isCalculatorSlug = p.includes("calculator");
  if (isCalculatorSlug && item.to === "/rent-calculator") score += 20;

  return score;
}

function pickPrimaryLinks(pathname: string) {
  const filtered = NAV_ITEMS.filter((i) => {
    // Policies never belong in primary
    if (
      i.to === "/terms-of-service" ||
      i.to === "/privacy-policy" ||
      i.to === "/cookies"
    )
      return false;

    // If user is on a policy route, still show core nav items
    if (isPolicyRoute(pathname)) return true;

    return true;
  });

  // Always include Home and Rent Converter hub
  const mustHave = new Set<string>(["/", "/rent-converter"]);

  // Rank items by intent score
  const ranked = [...filtered]
    .filter((i) => i.to !== "/" && i.to !== "/rent-converter")
    .sort(
      (a, b) => scoreItemForPath(b, pathname) - scoreItemForPath(a, pathname),
    );

  // Primary count:
  // Mobile: keep it tight (handled by layout), but we still choose 4 core links.
  // Desktop: same list, just displayed inline.
  const primary: NavItem[] = [];
  const byTo = new Map(filtered.map((i) => [i.to, i]));

  // Add must-haves first in order
  for (const to of ["/", "/rent-converter"]) {
    const item = byTo.get(to);
    if (item) primary.push(item);
  }

  // Add top intent matches
  for (const item of ranked) {
    if (primary.length >= 4) break;
    primary.push(item);
  }

  const primarySet = new Set(primary.map((p) => p.to));

  // Everything else (including policies) goes to "More"
  const more = NAV_ITEMS.filter((i) => !primarySet.has(i.to));

  return { primary, more };
}

function useClickOutside(
  refs: React.RefObject<HTMLElement | null>[],
  onOutside: () => void,
  enabled: boolean,
) {
  React.useEffect(() => {
    if (!enabled) return;

    function handler(ev: MouseEvent | TouchEvent) {
      const target = ev.target as Node | null;
      if (!target) return;

      const inside = refs.some((r) => r.current && r.current.contains(target));
      if (!inside) onOutside();
    }

    document.addEventListener("mousedown", handler, { passive: true });
    document.addEventListener("touchstart", handler, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [refs, onOutside, enabled]);
}

export default function NavBar() {
  const { pathname } = useLocation();

  const { primary, more } = React.useMemo(
    () => pickPrimaryLinks(pathname),
    [pathname],
  );

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [moreOpen, setMoreOpen] = React.useState(false);

  const mobilePanelRef = React.useRef<HTMLDivElement>(null);
  const mobileButtonRef = React.useRef<HTMLButtonElement>(null);

  const moreMenuRef = React.useRef<HTMLDivElement>(null);
  const moreButtonRef = React.useRef<HTMLButtonElement>(null);

  // Close menus on route change
  React.useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Escape closes everything
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setMoreOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Click outside closes mobile panel
  useClickOutside(
    [mobilePanelRef, mobileButtonRef],
    () => setMobileOpen(false),
    mobileOpen,
  );

  // Click outside closes "More" dropdown
  useClickOutside(
    [moreMenuRef, moreButtonRef],
    () => setMoreOpen(false),
    moreOpen,
  );

  function NavLinkItem({
    item,
    onClick,
    className = "",
  }: {
    item: NavItem;
    onClick?: () => void;
    className?: string;
  }) {
    const active = item.to === pathname;

    return (
      <Link
        to={item.to}
        onClick={onClick}
        className={[
          "cursor-pointer select-none rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "text-white bg-sky-900/40"
            : "text-slate-200 hover:text-sky-300 hover:bg-sky-900/25",
          className,
        ].join(" ")}
        aria-current={active ? "page" : undefined}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <nav className="sticky mb-6 top-0 left-0 w-full bg-sky-950 border-b border-sky-900/60 shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-3 text-lg font-semibold text-white cursor-pointer"
          aria-label="RentConverter home"
        >
          <img
            src="/images/rent-converter-logo-final.png"
            alt="RentConverter"
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
            loading="eager"
            decoding="async"
          />
          <span className="tracking-tight">
            RentConverter<span className="text-sky-300">.com</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {primary.map((item) => (
            <NavLinkItem key={item.to} item={item} />
          ))}

          {/* More dropdown */}
          <div className="relative" ref={moreMenuRef}>
            <button
              ref={moreButtonRef}
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              className={[
                "cursor-pointer select-none rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "text-slate-200 hover:text-sky-300 hover:bg-sky-900/25",
                moreOpen ? "bg-sky-900/25 text-white" : "",
              ].join(" ")}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
            >
              Other Rent Tools
              <span className="ml-1 inline-block align-middle opacity-80">
                ▾
              </span>
            </button>

            {moreOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-72 rounded-lg border border-sky-900/60 bg-sky-950 shadow-lg overflow-hidden"
              >
                <div className="max-h-[70vh] overflow-auto py-2">
                  {more.map((item) => (
                    <NavLinkItem
                      key={item.to}
                      item={item}
                      onClick={() => setMoreOpen(false)}
                      className="w-full block text-left"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          ref={mobileButtonRef}
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className={[
            "md:hidden cursor-pointer rounded-md px-3 py-2 text-sm font-semibold transition-colors",
            "text-slate-200 hover:text-sky-300 hover:bg-sky-900/25",
            mobileOpen ? "bg-sky-900/25 text-white" : "",
          ].join(" ")}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
        >
          {/* Simple icon (no dependency) */}
          <span className="inline-block leading-none text-base">☰</span>
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen ? (
        <div
          id="mobile-nav-panel"
          ref={mobilePanelRef}
          className="md:hidden border-t border-sky-900/60 bg-sky-950"
        >
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="grid grid-cols-1 gap-2">
              {/* Primary first */}
              <div className="grid grid-cols-1 gap-1">
                <div className="text-xs font-semibold text-sky-200/80 px-2 pt-1">
                  Top links
                </div>
                {primary.map((item) => (
                  <NavLinkItem
                    key={item.to}
                    item={item}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>

              {/* More collapsible */}
              <div className="grid grid-cols-1 gap-1 pt-2">
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  className={[
                    "cursor-pointer w-full text-left rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                    "text-slate-200 hover:text-sky-300 hover:bg-sky-900/25",
                    moreOpen ? "bg-sky-900/25 text-white" : "",
                  ].join(" ")}
                  aria-expanded={moreOpen}
                >
                  More links{" "}
                  <span className="ml-1 opacity-80">
                    {moreOpen ? "▴" : "▾"}
                  </span>
                </button>

                {moreOpen ? (
                  <div className="grid grid-cols-1 gap-1 pl-2">
                    {more.map((item) => (
                      <NavLinkItem
                        key={item.to}
                        item={item}
                        onClick={() => {
                          setMoreOpen(false);
                          setMobileOpen(false);
                        }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
