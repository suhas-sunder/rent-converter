import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";

type NavItem = {
  label: string;
  to: string;
  keywords: string[];
};

type Rect = { top: number; left: number; width: number; height: number };

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

function isCanonicalToolRoute(path: string) {
  return (
    path === "/rent-converter" ||
    path.endsWith("-calculator") ||
    path.endsWith("-converter")
  );
}

function buildCanonicalItems(): NavItem[] {
  // Canonical only: your list, filtered to -calculator / -converter plus /rent-converter hub
  // (Redirect aliases are intentionally excluded.)
  const items: NavItem[] = [
    // Hub
    {
      label: "Universal Rent Converter",
      to: "/",
      keywords: ["rent", "converter", "convert", "hub", "frequency"],
    },

    // Frequency converters (canonical)
    {
      label: "Monthly to Weekly",
      to: "/monthly-to-weekly-rent-converter",
      keywords: ["monthly", "weekly", "convert", "frequency"],
    },
    {
      label: "Weekly to Monthly",
      to: "/weekly-to-monthly-rent-converter",
      keywords: ["weekly", "monthly", "convert", "frequency"],
    },
    {
      label: "Weekly to Annual",
      to: "/weekly-to-annual-rent-converter",
      keywords: ["weekly", "annual", "yearly", "convert", "frequency"],
    },
    {
      label: "Weekly to Biweekly",
      to: "/weekly-to-biweekly-rent-converter",
      keywords: ["weekly", "biweekly", "fortnight", "convert", "frequency"],
    },
    {
      label: "Biweekly to Weekly",
      to: "/biweekly-to-weekly-rent-converter",
      keywords: ["biweekly", "weekly", "convert", "frequency"],
    },
    {
      label: "Biweekly to Monthly",
      to: "/biweekly-to-monthly-rent-converter",
      keywords: ["biweekly", "monthly", "convert", "frequency"],
    },
    {
      label: "Biweekly to Annual",
      to: "/biweekly-to-annual-rent-converter",
      keywords: ["biweekly", "annual", "yearly", "convert", "frequency"],
    },
    {
      label: "Monthly to Annual",
      to: "/monthly-to-annual-rent-converter",
      keywords: ["monthly", "annual", "yearly", "convert", "frequency"],
    },
    {
      label: "Annual to Monthly",
      to: "/annual-to-monthly-rent-converter",
      keywords: ["annual", "yearly", "monthly", "convert", "frequency"],
    },
    {
      label: "Monthly to Daily",
      to: "/monthly-to-daily-rent-converter",
      keywords: ["monthly", "daily", "per day", "convert", "frequency"],
    },
    {
      label: "Daily to Monthly",
      to: "/daily-to-monthly-rent-converter",
      keywords: ["daily", "monthly", "per day", "convert", "frequency"],
    },
    {
      label: "Monthly to Hourly",
      to: "/monthly-to-hourly-rent-converter",
      keywords: ["monthly", "hourly", "per hour", "convert", "frequency"],
    },
    {
      label: "Hourly to Monthly",
      to: "/hourly-to-monthly-rent-converter",
      keywords: ["hourly", "monthly", "per hour", "convert", "frequency"],
    },
    {
      label: "Hourly to Annual",
      to: "/hourly-to-annual-rent-converter",
      keywords: ["hourly", "annual", "yearly", "convert", "frequency"],
    },
    {
      label: "Annual to Hourly",
      to: "/annual-to-hourly-rent-converter",
      keywords: ["annual", "yearly", "hourly", "convert", "frequency"],
    },
    {
      label: "Annual to Weekly",
      to: "/annual-to-weekly-rent-converter",
      keywords: ["annual", "yearly", "weekly", "convert", "frequency"],
    },
    {
      label: "Annual to Biweekly",
      to: "/annual-to-biweekly-rent-converter",
      keywords: ["annual", "yearly", "biweekly", "convert", "frequency"],
    },
    {
      label: "Monthly to Biweekly",
      to: "/monthly-to-biweekly-rent-converter",
      keywords: ["monthly", "biweekly", "convert", "frequency"],
    },

    // Rent calculators (canonical)
    {
      label: "Universal Rent Calculator",
      to: "/",
      keywords: ["rent", "calculator", "monthly", "weekly", "annual"],
    },
    {
      label: "Rent Per Day",
      to: "/rent-per-day-calculator",
      keywords: ["rent", "per day", "daily", "calculator"],
    },
    {
      label: "Rent Per Week",
      to: "/rent-per-week-calculator",
      keywords: ["rent", "per week", "weekly", "calculator"],
    },
    {
      label: "Paid Every 4 Weeks",
      to: "/rent-paid-every-4-weeks-calculator",
      keywords: ["rent", "every 4 weeks", "4 weeks", "calculator"],
    },
    {
      label: "Rent Per Paycheck",
      to: "/rent-per-paycheck-calculator",
      keywords: ["rent", "paycheck", "biweekly", "calculator"],
    },
    {
      label: "Split Rent",
      to: "/rent-split-calculator",
      keywords: ["split", "roommate", "rent", "calculator"],
    },
    {
      label: "Rent Due Date",
      to: "/rent-due-date-calculator",
      keywords: ["rent", "due date", "date", "calculator"],
    },

    // Affordability and income (canonical)
    {
      label: "Rent % of Income",
      to: "/rent-as-percentage-of-income-calculator",
      keywords: ["rent", "percentage", "income", "ratio", "calculator"],
    },
    {
      label: "Affordability",
      to: "/how-much-rent-can-i-afford-calculator",
      keywords: ["afford", "affordability", "income", "budget", "calculator"],
    },
    {
      label: "After Tax Income",
      to: "/rent-after-tax-income-calculator",
      keywords: ["after tax", "tax", "take home", "income", "calculator"],
    },
    {
      label: "Rent vs Take-Home",
      to: "/rent-vs-take-home-pay-calculator",
      keywords: ["take home", "income", "pay", "calculator"],
    },

    // Rent increases (canonical)
    {
      label: "Rent Increase",
      to: "/rent-increase-calculator",
      keywords: ["rent", "increase", "raise", "calculator"],
    },
    {
      label: "Increase Percentage",
      to: "/rent-increase-percentage-calculator",
      keywords: ["rent", "increase", "percentage", "percent", "calculator"],
    },
    {
      label: "After Increase",
      to: "/rent-after-increase-calculator",
      keywords: ["rent", "after increase", "new rent", "calculator"],
    },

    // Rent vs buy (canonical)
    {
      label: "Rent vs Buy",
      to: "/rent-vs-buy-calculator",
      keywords: ["rent", "buy", "mortgage", "own", "calculator"],
    },
  ];

  // Safety: ensure only canonical tool routes make it through
  return items.filter((i) => isCanonicalToolRoute(i.to));
}

export default function NavBar() {
  const { pathname } = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop dropdown state
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreRect, setMoreRect] = useState<Rect | null>(null);

  // Mobile search
  const [mobileQuery, setMobileQuery] = useState("");

  const moreBtnRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);

  const isClient = useIsClient();

  // Unique class so injected CSS only hits these menus
  const SCROLL_CLASS = "rc-scroll";

  const tools: NavItem[] = useMemo(() => buildCanonicalItems(), []);

  // Pick 4 primary links (like ATC) and put the rest in the dropdown
  const primaryLinks: NavItem[] = useMemo(() => {
    const desiredOrder: string[] = [
      "/rent-calculator",
      "/rent-converter",
      "/rent-split-calculator",
      "/how-much-rent-can-i-afford-calculator",
    ];

    const byTo = new Map(tools.map((t) => [t.to, t]));
    const primary: NavItem[] = [];

    for (const to of desiredOrder) {
      const item = byTo.get(to);
      if (item) primary.push(item);
      if (primary.length >= 4) break;
    }

    // Fallback if something is missing
    if (primary.length < 4) {
      for (const t of tools) {
        if (primary.length >= 4) break;
        if (!primary.some((p) => p.to === t.to)) primary.push(t);
      }
    }

    return primary.slice(0, 4);
  }, [tools]);

  const desktopMoreList: NavItem[] = useMemo(() => {
    const primarySet = new Set(primaryLinks.map((l) => l.to));
    return tools.filter((t) => !primarySet.has(t.to));
  }, [tools, primaryLinks]);

  const filteredMobileTools: NavItem[] = useMemo(() => {
    const q = mobileQuery.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((t) => {
      const hay = [t.label, t.to, ...t.keywords].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [mobileQuery, tools]);

  const closeAll = () => {
    setMobileOpen(false);
    setMoreOpen(false);
  };

  // Close menus when route changes (important in SPA)
  useEffect(() => {
    closeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function updateMoreRect() {
    const btn = moreBtnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setMoreRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }

  // When opening dropdown, measure button location and keep it updated on scroll/resize
  useLayoutEffect(() => {
    if (!moreOpen) return;
    updateMoreRect();

    function onScrollOrResize() {
      updateMoreRect();
    }

    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [moreOpen]);

  // Close desktop dropdown on outside click + Escape
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!moreOpen) return;
      const t = e.target as Node | null;
      if (!t) return;

      const btn = moreBtnRef.current;
      const menu = moreMenuRef.current;

      // menu is in a portal, but ref still works
      if (btn?.contains(t) || menu?.contains(t)) return;

      setMoreOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen]);

  // Mobile body lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Mobile close on backdrop click
  useEffect(() => {
    if (!mobileOpen) return;

    function onDown(e: MouseEvent | TouchEvent) {
      const t = e.target as Node | null;
      if (!t) return;
      const panel = mobilePanelRef.current;
      if (panel && panel.contains(t)) return;
      setMobileOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown as any);
    };
  }, [mobileOpen]);

  // Dropdown placement (ATC style)
  const dropdownStyle = useMemo(() => {
    if (!moreRect) return undefined;

    const gap = 8;
    const top = Math.round(moreRect.top + moreRect.height + gap);

    // Align right edge of menu to button right edge
    const menuWidth = 320; // matches w-80 in ATC
    const rightEdge = Math.round(moreRect.left + moreRect.width);
    const left = Math.max(8, rightEdge - menuWidth);

    return {
      position: "fixed" as const,
      top,
      left,
      width: menuWidth,
      zIndex: 2147483647,
    };
  }, [moreRect]);

  function NavLinkItem({
    item,
    onClick,
    variant = "desktop",
  }: {
    item: NavItem;
    onClick?: () => void;
    variant?: "desktop" | "dropdown" | "mobile";
  }) {
    const active = item.to === pathname;

    if (variant === "desktop") {
      return (
        <Link
          to={item.to}
          onClick={onClick}
          className={[
            "cursor-pointer select-none rounded-md px-3 py-2 text-sm font-semibold transition-colors",
            active
              ? "text-white bg-sky-900/40"
              : "text-slate-200 hover:text-sky-200 hover:bg-sky-900/25",
          ].join(" ")}
          aria-current={active ? "page" : undefined}
        >
          {item.label}
        </Link>
      );
    }

    if (variant === "dropdown") {
      return (
        <Link
          to={item.to}
          onClick={onClick}
          role="menuitem"
          className={[
            "block cursor-pointer select-none px-5 py-4 text-base transition-colors",
            active
              ? "text-white bg-sky-900/40"
              : "text-slate-100 hover:bg-sky-900/25 hover:text-sky-200",
          ].join(" ")}
          aria-current={active ? "page" : undefined}
        >
          {item.label}
        </Link>
      );
    }

    // mobile
    return (
      <Link
        to={item.to}
        onClick={onClick}
        className={[
          "block cursor-pointer select-none px-5 py-4 text-base font-semibold transition-colors",
          active
            ? "text-white bg-sky-900/40"
            : "text-slate-100 hover:bg-sky-900/25 hover:text-sky-200",
        ].join(" ")}
        aria-current={active ? "page" : undefined}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <header className="bg-sky-950 text-slate-200 border-b border-sky-900/60 shadow-sm">
      {/* Scoped scrollbar styles only for menu containers */}
      <style>{`
        .${SCROLL_CLASS} {
          scrollbar-width: thin;
          scrollbar-color: rgba(125,211,252,.65) rgba(8,47,73,1);
          scrollbar-gutter: stable both-edges;
          overscroll-behavior: contain;
        }
        .${SCROLL_CLASS}::-webkit-scrollbar { width: 10px; }
        .${SCROLL_CLASS}::-webkit-scrollbar-track { background: rgba(8,47,73,1); }
        .${SCROLL_CLASS}::-webkit-scrollbar-thumb {
          background-color: rgba(125,211,252,.55);
          border-radius: 10px;
          border: 2px solid rgba(8,47,73,1);
        }
        .${SCROLL_CLASS}::-webkit-scrollbar-thumb:hover { background-color: rgba(125,211,252,.75); }
        .${SCROLL_CLASS}::-webkit-scrollbar-corner { background: rgba(8,47,73,1); }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-1">
        <div className="flex items-center justify-between py-3">
          <Link
            to="/"
            className="group flex items-center gap-3 cursor-pointer"
            onClick={closeAll}
            aria-label="RentConverter home"
          >
            <img
              src="/images/rent-converter-logo-final.png"
              alt="RentConverter"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain"
              loading="eager"
              decoding="async"
            />
            <div className="text-left leading-tight">
              <div className="text-base font-bold text-white tracking-tight group-hover:text-sky-200">
                RentConverter<span className="text-sky-300">.com</span>
              </div>
              <div className="text-xs text-sky-200/80 font-semibold">
                Fast, private rent calculators
              </div>
            </div>
          </Link>

          {/* Mobile burger */}
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center rounded-md px-3 py-2
                       text-slate-200 hover:text-sky-200 hover:bg-sky-900/25 transition-colors
                       cursor-pointer"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileQuery("");
              setMobileOpen(true);
              setMoreOpen(false);
            }}
          >
            <IconMenu />
          </button>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-2 text-sm">
            {primaryLinks.slice(0, 4).map((l) => (
              <NavLinkItem
                key={l.to}
                item={l}
                onClick={closeAll}
                variant="desktop"
              />
            ))}

            <button
              ref={moreBtnRef}
              type="button"
              className="font-semibold transition-colors hover:text-sky-200 hover:bg-sky-900/25
                         rounded-md px-2 py-2 inline-flex items-center gap-2 cursor-pointer"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              onClick={() => {
                if (!moreOpen) updateMoreRect();
                setMoreOpen((v) => !v);
              }}
            >
              More <IconChevronDown />
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop dropdown rendered in portal so it is always above everything */}
      {isClient && moreOpen && dropdownStyle
        ? createPortal(
            <div
              ref={moreMenuRef}
              role="menu"
              className="rounded-xl border border-sky-900/60 bg-sky-950 shadow-xl overflow-hidden"
              style={dropdownStyle}
            >
              <div
                className={`${SCROLL_CLASS} max-h-[min(60vh,520px)] overflow-y-auto`}
              >
                {desktopMoreList.map((l) => (
                  <NavLinkItem
                    key={l.to}
                    item={l}
                    onClick={closeAll}
                    variant="dropdown"
                  />
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-[2147483647]">
          <div className="absolute inset-0 bg-black/55" />

          <div
            ref={mobilePanelRef}
            className="absolute inset-y-0 right-0 w-[92vw] max-w-sm
                       bg-sky-950 border-l border-sky-900/60 shadow-2xl
                       flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="shrink-0 bg-sky-950/95 backdrop-blur border-b border-sky-900/60">
              <div className="flex items-center justify-between px-4 py-3">
                <Link
                  to="/"
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={closeAll}
                  aria-label="RentConverter home"
                >
                  <img
                    src="/images/rent-converter-logo-final.png"
                    alt="RentConverter"
                    className="h-10 w-10 object-contain"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="leading-tight">
                    <div className="text-sm font-bold text-white">
                      RentConverter<span className="text-sky-300">.com</span>
                    </div>
                    <div className="text-xs text-sky-200/80 font-semibold">
                      Rent calculators and tools
                    </div>
                  </div>
                </Link>

                <button
                  type="button"
                  className="rounded-md px-3 py-2 text-slate-200
                             hover:text-sky-200 hover:bg-sky-900/25 transition-colors
                             cursor-pointer"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <IconX />
                </button>
              </div>

              <div className="px-4 pb-3">
                <input
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                  placeholder="Search tools (increase, weekly, biweekly, due date)"
                  className="w-full rounded-lg bg-sky-950 border border-sky-900/60
                             px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400
                             outline-none focus:border-sky-400"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <div className={`${SCROLL_CLASS} h-full overflow-y-auto`}>
                {filteredMobileTools.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-slate-300">
                    No tools match “{mobileQuery.trim()}”.
                  </div>
                ) : (
                  filteredMobileTools.map((l) => (
                    <NavLinkItem
                      key={l.to}
                      item={l}
                      onClick={closeAll}
                      variant="mobile"
                    />
                  ))
                )}

                <div className="h-[env(safe-area-inset-bottom)]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function IconMenu() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
