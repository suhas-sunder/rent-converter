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
  if (path === "/" || path === "/rent-converter") return true;
  if (path.endsWith("-calculator") || path.endsWith("-converter")) return true;

  const explicitCanonical = new Set<string>([
    "/500-per-week-to-monthly-rent",
    "/170-per-week-to-monthly-rent",
    "/180-per-week-to-monthly-rent",

    "/weekly-to-monthly-rent-uk",
    "/weekly-to-monthly-rent-australia",
    "/rent-per-paycheck-us",
    "/rent-per-paycheck-canada",
    "/what-does-pcm-mean-rent",
    "/what-does-pw-mean-rent",
    "/pw-to-pcm",
    "/pcw-to-pcm",
    "/when-is-rent-due",
    "/do-you-pay-rent-in-advance-or-after",
  ]);

  return explicitCanonical.has(path);
}

function buildCanonicalItems(): NavItem[] {
  const items: NavItem[] = [
    {
      label: "Universal Rent Converter",
      to: "/",
      keywords: ["rent", "converter", "convert", "hub", "frequency"],
    },

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

    {
      label: "Universal Rent Calculator",
      to: "/rent-calculator",
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
    {
      label: "Prorated Rent",
      to: "/prorated-rent-calculator",
      keywords: ["prorated", "partial month", "move in", "move out", "rent"],
    },

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
    {
      label: "3x Rent",
      to: "/3x-rent-calculator",
      keywords: ["3x", "three times", "rent", "income", "qualification"],
    },
    {
      label: "2.5x Rent",
      to: "/2-5x-rent-calculator",
      keywords: ["2.5x", "two point five", "rent", "income", "qualification"],
    },

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

    {
      label: "Rent vs Buy",
      to: "/rent-vs-buy-calculator",
      keywords: ["rent", "buy", "mortgage", "own", "calculator"],
    },

    {
      label: "$500/week → Monthly",
      to: "/500-per-week-to-monthly-rent",
      keywords: [
        "500",
        "$500",
        "per week",
        "weekly",
        "monthly",
        "convert",
        "answer",
      ],
    },
    {
      label: "$170/week → Monthly",
      to: "/170-per-week-to-monthly-rent",
      keywords: [
        "170",
        "$170",
        "per week",
        "weekly",
        "monthly",
        "convert",
        "answer",
      ],
    },
    {
      label: "$180/week → Monthly",
      to: "/180-per-week-to-monthly-rent",
      keywords: [
        "180",
        "$180",
        "per week",
        "weekly",
        "monthly",
        "convert",
        "answer",
      ],
    },

    {
      label: "Weekly → Monthly (UK)",
      to: "/weekly-to-monthly-rent-uk",
      keywords: ["uk", "britain", "pounds", "weekly", "monthly", "rent"],
    },
    {
      label: "Weekly → Monthly (Australia)",
      to: "/weekly-to-monthly-rent-australia",
      keywords: ["australia", "aud", "weekly", "monthly", "rent"],
    },
    {
      label: "Rent per Paycheck (US)",
      to: "/rent-per-paycheck-us",
      keywords: ["us", "usa", "paycheck", "biweekly", "rent"],
    },
    {
      label: "Rent per Paycheck (Canada)",
      to: "/rent-per-paycheck-canada",
      keywords: ["canada", "cad", "paycheck", "biweekly", "rent"],
    },
    {
      label: "What PCM Means",
      to: "/what-does-pcm-mean-rent",
      keywords: ["pcm", "per calendar month", "meaning", "rent glossary"],
    },
    {
      label: "What PW Means",
      to: "/what-does-pw-mean-rent",
      keywords: ["pw", "per week", "meaning", "rent glossary"],
    },
    {
      label: "PW to PCM",
      to: "/pw-to-pcm",
      keywords: ["pw", "pcm", "weekly", "monthly", "conversion"],
    },
    {
      label: "PCW to PCM",
      to: "/pcw-to-pcm",
      keywords: ["pcw", "pcm", "weekly", "monthly", "conversion"],
    },
    {
      label: "When Rent Is Due",
      to: "/when-is-rent-due",
      keywords: ["rent due", "due date", "what time", "grace period"],
    },
    {
      label: "Rent in Advance or After",
      to: "/do-you-pay-rent-in-advance-or-after",
      keywords: ["rent in advance", "rent after", "payment timing"],
    },
  ];

  return items.filter((i) => isCanonicalToolRoute(i.to));
}

export default function NavBar() {
  const { pathname } = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);
  const [moreRect, setMoreRect] = useState<Rect | null>(null);

  const [desktopQuery, setDesktopQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");

  const moreBtnRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const desktopSearchRef = useRef<HTMLInputElement | null>(null);

  const isClient = useIsClient();

  const SCROLL_CLASS = "rc-scroll";

  const tools: NavItem[] = useMemo(() => buildCanonicalItems(), []);

  const primaryLinks: NavItem[] = useMemo(() => {
    const desiredOrder: string[] = [
      "/weekly-to-monthly-rent-converter",
      "/rent-per-paycheck-calculator",
      "/how-much-rent-can-i-afford-calculator",
    ];

    const byTo = new Map(tools.map((t) => [t.to, t]));
    const primary: NavItem[] = [];

    for (const to of desiredOrder) {
      const item = byTo.get(to);
      if (item) primary.push(item);
      if (primary.length >= 3) break;
    }

    if (primary.length < 3) {
      for (const t of tools) {
        if (primary.length >= 3) break;
        if (t.to !== "/" && !primary.some((p) => p.to === t.to)) {
          primary.push(t);
        }
      }
    }

    return primary.slice(0, 3);
  }, [tools]);

  const desktopMoreList: NavItem[] = useMemo(() => {
    const q = desktopQuery.trim().toLowerCase();

    if (!q) return tools;

    return tools.filter((t) => {
      const hay = [t.label, t.to, ...t.keywords].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [desktopQuery, tools]);

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

  useEffect(() => {
    closeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const id = window.setTimeout(() => {
      desktopSearchRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(id);
    };
  }, [moreOpen]);

  function updateMoreRect() {
    const btn = moreBtnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setMoreRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }

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

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!moreOpen) return;
      const t = e.target as Node | null;
      if (!t) return;

      const btn = moreBtnRef.current;
      const menu = moreMenuRef.current;

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

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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

  const dropdownStyle = useMemo(() => {
    if (!moreRect) return undefined;

    const gap = 8;
    const top = Math.round(moreRect.top + moreRect.height + gap);

    const menuWidth = 360;
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

  function scrollToAllTools(onDone?: () => void) {
    onDone?.();

    window.setTimeout(() => {
      const el = document.getElementById("all-tools");
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

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
            "cursor-pointer select-none rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            active
              ? "bg-sky-100 text-sky-900"
              : "text-slate-700 hover:bg-sky-50 hover:text-sky-800",
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
            "block cursor-pointer select-none px-5 py-3.5 text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset",
            active
              ? "bg-sky-100 text-sky-900 font-semibold"
              : "text-slate-700 hover:bg-sky-50 hover:text-sky-800",
          ].join(" ")}
          aria-current={active ? "page" : undefined}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <Link
        to={item.to}
        onClick={onClick}
        className={[
          "block cursor-pointer select-none px-5 py-4 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset",
          active
            ? "bg-sky-100 text-sky-900"
            : "text-slate-700 hover:bg-sky-50 hover:text-sky-800",
        ].join(" ")}
        aria-current={active ? "page" : undefined}
      >
        {item.label}
      </Link>
    );
  }

  function AllToolsButton({
    variant,
  }: {
    variant: "desktop" | "dropdown" | "mobile";
  }) {
    const classes =
      variant === "desktop"
        ? "inline-flex cursor-pointer select-none items-center rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100 hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        : variant === "dropdown"
          ? "block w-full cursor-pointer select-none px-5 py-3.5 text-left text-base font-semibold text-sky-800 transition-colors hover:bg-sky-50 hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset"
          : "block w-full cursor-pointer select-none px-5 py-4 text-left text-base font-semibold text-sky-800 transition-colors hover:bg-sky-50 hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset";

    return (
      <button
        type="button"
        className={classes}
        onClick={() => scrollToAllTools(closeAll)}
      >
        All tools
      </button>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 text-slate-700 backdrop-blur">
      <style>{`
        .${SCROLL_CLASS} {
          scrollbar-width: thin;
          scrollbar-color: rgba(14,165,233,.55) rgba(248,250,252,1);
          scrollbar-gutter: stable both-edges;
          overscroll-behavior: contain;
        }
        .${SCROLL_CLASS}::-webkit-scrollbar { width: 10px; }
        .${SCROLL_CLASS}::-webkit-scrollbar-track { background: rgba(248,250,252,1); }
        .${SCROLL_CLASS}::-webkit-scrollbar-thumb {
          background-color: rgba(14,165,233,.45);
          border-radius: 10px;
          border: 2px solid rgba(248,250,252,1);
        }
        .${SCROLL_CLASS}::-webkit-scrollbar-thumb:hover { background-color: rgba(14,165,233,.7); }
        .${SCROLL_CLASS}::-webkit-scrollbar-corner { background: rgba(248,250,252,1); }
      `}</style>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-1">
        <div className="flex items-center justify-between py-3">
          <Link
            to="/"
            className="group flex cursor-pointer items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={closeAll}
            aria-label="RentConverter home"
          >
            <img
              src="/images/rent-converter-logo-final_icon_compressed.jpg"
              alt="RentConverter"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain"
              loading="eager"
              decoding="async"
            />
            <div className="text-left leading-tight">
              <div className="text-base font-bold text-slate-950 tracking-tight group-hover:text-sky-800">
                RentConverter<span className="text-sky-600">.com</span>
              </div>
              <div className="text-xs text-slate-600 font-semibold">
                Fast, private rent calculators
              </div>
            </div>
          </Link>

          <button
            type="button"
            className="sm:hidden inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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

          <nav className="hidden sm:flex items-center gap-2 text-sm">
            <AllToolsButton variant="desktop" />

            {primaryLinks.map((l) => (
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
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 font-semibold text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              onClick={() => {
                if (!moreOpen) {
                  setDesktopQuery("");
                  updateMoreRect();
                }
                setMoreOpen((v) => !v);
              }}
            >
              More <IconChevronDown />
            </button>
          </nav>
        </div>
      </div>

      {isClient && moreOpen && dropdownStyle
        ? createPortal(
            <div
              ref={moreMenuRef}
              role="menu"
              className="overflow-hidden rounded-2xl bg-white/95 backdrop-blur"
              style={dropdownStyle}
            >
              <div className="bg-white/95 p-3">
                <label className="sr-only" htmlFor="desktop-tool-search">
                  Search rent tools
                </label>
                <input
                  ref={desktopSearchRef}
                  id="desktop-tool-search"
                  value={desktopQuery}
                  onChange={(e) => setDesktopQuery(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full cursor-text rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setMoreOpen(false);
                    }
                  }}
                />

                <div className="mt-2 text-xs font-medium text-slate-500">
                  {desktopMoreList.length === 1
                    ? "1 page found"
                    : `${desktopMoreList.length} pages found`}
                </div>
              </div>

              <div
                className={`${SCROLL_CLASS} max-h-[min(60vh,520px)] overflow-y-auto`}
              >
                <div className="bg-sky-50/60">
                  <AllToolsButton variant="dropdown" />
                </div>

                {desktopMoreList.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-slate-600">
                    No pages match “{desktopQuery.trim()}”.
                  </div>
                ) : (
                  desktopMoreList.map((l) => (
                    <NavLinkItem
                      key={l.to}
                      item={l}
                      onClick={closeAll}
                      variant="dropdown"
                    />
                  ))
                )}
              </div>
            </div>,
            document.body,
          )
        : null}

      {mobileOpen && (
        <div className="sm:hidden fixed inset-0 z-[2147483647]">
          <div className="absolute inset-0 bg-slate-950/45" />

          <div
            ref={mobilePanelRef}
            className="absolute inset-y-0 right-0 flex w-[92vw] max-w-sm flex-col bg-white"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="shrink-0 bg-white/95 backdrop-blur">
              <div className="flex items-center justify-between px-4 py-3">
                <Link
                  to="/"
                  className="flex cursor-pointer items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
                    <div className="text-sm font-bold text-slate-950">
                      RentConverter<span className="text-sky-600">.com</span>
                    </div>
                    <div className="text-xs text-slate-600 font-semibold">
                      Rent calculators and tools
                    </div>
                  </div>
                </Link>

                <button
                  type="button"
                  className="cursor-pointer rounded-xl px-3 py-2 text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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
                  className="w-full cursor-text rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                />

                <div className="mt-2 text-xs font-medium text-slate-500">
                  {filteredMobileTools.length === 1
                    ? "1 page found"
                    : `${filteredMobileTools.length} pages found`}
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <div className={`${SCROLL_CLASS} h-full overflow-y-auto`}>
                <div className="bg-sky-50/60">
                  <AllToolsButton variant="mobile" />
                </div>

                {filteredMobileTools.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-slate-600">
                    No pages match “{mobileQuery.trim()}”.
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
