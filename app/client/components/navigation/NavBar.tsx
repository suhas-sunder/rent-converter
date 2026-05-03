import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import {
  navItems as registryNavItems,
  navSections as registryNavSections,
} from "~/client/data/routeRegistry";

type NavItem = {
  label: string;
  to: string;
  description?: string;
  keywords: string[];
};

type NavSection = {
  title: string;
  description: string;
  items: NavItem[];
};

type Rect = { top: number; left: number; width: number; height: number };

const SCROLL_CLASS = "rc-scroll";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

function buildCanonicalItems(): NavItem[] {
  return registryNavItems.map((item) => ({
    label: item.label,
    to: item.href,
    description: item.description,
    keywords: item.keywords ?? [],
  }));
}

function buildNavSections(): NavSection[] {
  return registryNavSections
    .map((section) => ({
      title: section.title,
      description: section.description,
      items: section.links.map((item) => ({
        label: item.label,
        to: item.href,
        description: item.description,
        keywords: item.keywords ?? [],
      })),
    }))
    .filter((section) => section.items.length > 0);
}

function itemMatches(item: NavItem, query: string) {
  if (!query) return true;
  const haystack = [item.label, item.description ?? "", item.to, ...item.keywords]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function filterSections(sections: NavSection[], rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return sections;

  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => itemMatches(item, query)),
    }))
    .filter((section) => section.items.length > 0);
}

function countSectionItems(sections: NavSection[]) {
  return sections.reduce((total, section) => total + section.items.length, 0);
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
  const tools: NavItem[] = useMemo(() => buildCanonicalItems(), []);
  const sections: NavSection[] = useMemo(() => buildNavSections(), []);

  const primaryLinks: NavItem[] = useMemo(() => {
    const desiredOrder = [
      "/weekly-to-monthly-rent-converter",
      "/rent-per-paycheck-calculator",
      "/how-much-rent-can-i-afford-calculator",
    ];

    const byTo = new Map(tools.map((tool) => [tool.to, tool]));
    const primary: NavItem[] = [];

    for (const to of desiredOrder) {
      const item = byTo.get(to);
      if (item) primary.push(item);
      if (primary.length >= 3) break;
    }

    if (primary.length < 3) {
      for (const tool of tools) {
        if (primary.length >= 3) break;
        if (tool.to !== "/" && !primary.some((item) => item.to === tool.to)) {
          primary.push(tool);
        }
      }
    }

    return primary.slice(0, 3);
  }, [tools]);

  const desktopMoreSections = useMemo(
    () => filterSections(sections, desktopQuery),
    [desktopQuery, sections],
  );
  const mobileSections = useMemo(
    () => filterSections(sections, mobileQuery),
    [mobileQuery, sections],
  );

  const desktopResultCount = useMemo(
    () => countSectionItems(desktopMoreSections),
    [desktopMoreSections],
  );
  const mobileResultCount = useMemo(
    () => countSectionItems(mobileSections),
    [mobileSections],
  );

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
      const target = e.target as Node | null;
      if (!target) return;

      const btn = moreBtnRef.current;
      const menu = moreMenuRef.current;

      if (btn?.contains(target) || menu?.contains(target)) return;

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

    function onDown(e: Event) {
      const target = e.target as Node | null;
      if (!target) return;
      const panel = mobilePanelRef.current;
      if (panel && panel.contains(target)) return;
      setMobileOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [mobileOpen]);

  const dropdownStyle = useMemo(() => {
    if (!moreRect) return undefined;

    const gap = 8;
    const top = Math.round(moreRect.top + moreRect.height + gap);
    const menuWidth = Math.min(760, Math.max(440, window.innerWidth - 16));
    const rightEdge = Math.round(moreRect.left + moreRect.width);
    const left = Math.min(
      Math.max(8, rightEdge - menuWidth),
      window.innerWidth - menuWidth - 8,
    );

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
  }: {
    item: NavItem;
    onClick?: () => void;
  }) {
    const active = item.to === pathname;

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

  function SectionLink({
    item,
    onClick,
    compact = false,
  }: {
    item: NavItem;
    onClick?: () => void;
    compact?: boolean;
  }) {
    const active = item.to === pathname;

    return (
      <Link
        to={item.to}
        onClick={onClick}
        role="menuitem"
        className={[
          "block cursor-pointer rounded-xl px-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset",
          compact ? "py-2.5" : "py-3",
          active
            ? "bg-white text-sky-900"
            : "text-slate-800 hover:bg-white/80 hover:text-sky-800",
        ].join(" ")}
        aria-current={active ? "page" : undefined}
      >
        <span className="block text-sm font-semibold leading-snug">
          {item.label}
        </span>
        {item.description ? (
          <span className="mt-1 block text-xs leading-relaxed text-slate-600">
            {item.description}
          </span>
        ) : null}
      </Link>
    );
  }

  function SectionedNavList({
    sectionsToRender,
    query,
    count,
    onClick,
    compact = false,
  }: {
    sectionsToRender: NavSection[];
    query: string;
    count: number;
    onClick?: () => void;
    compact?: boolean;
  }) {
    if (count === 0) {
      return (
        <div className="px-5 py-6 text-sm text-slate-600">
          No pages match "{query.trim()}".
        </div>
      );
    }

    return (
      <div className={compact ? "space-y-3 p-3" : "space-y-4 p-4"}>
        {sectionsToRender.map((section) => (
          <section key={section.title} className="rounded-2xl bg-sky-50/65 p-2">
            <div className="px-2 pb-2">
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-sky-800">
                {section.title}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {section.description}
              </p>
            </div>
            <div className={compact ? "grid gap-1" : "grid gap-1 md:grid-cols-2"}>
              {section.items.map((item) => (
                <SectionLink
                  key={`${section.title}-${item.to}`}
                  item={item}
                  onClick={onClick}
                  compact={compact}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
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
          ? "block w-full cursor-pointer select-none rounded-xl px-3 py-3 text-left text-sm font-semibold text-sky-800 transition-colors hover:bg-white/80 hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset"
          : "block w-full cursor-pointer select-none rounded-xl px-3 py-3 text-left text-base font-semibold text-sky-800 transition-colors hover:bg-white/80 hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset";

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

      <div className="mx-auto max-w-6xl px-4 py-1 sm:px-6">
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
              className="h-10 w-10 object-contain sm:h-11 sm:w-11"
              loading="eager"
              decoding="async"
            />
            <div className="text-left leading-tight">
              <div className="text-base font-bold tracking-tight text-slate-950 group-hover:text-sky-800">
                RentConverter<span className="text-sky-600">.com</span>
              </div>
              <div className="text-xs font-semibold text-slate-600">
                Fast, private rent calculators
              </div>
            </div>
          </Link>

          <button
            type="button"
            className="inline-flex cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:hidden"
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

          <nav className="hidden items-center gap-2 text-sm sm:flex">
            <AllToolsButton variant="desktop" />

            {primaryLinks.map((linkItem) => (
              <NavLinkItem
                key={linkItem.to}
                item={linkItem}
                onClick={closeAll}
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
                setMoreOpen((value) => !value);
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
                  onChange={(event) => setDesktopQuery(event.target.value)}
                  placeholder="Search tools..."
                  className="w-full cursor-text rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setMoreOpen(false);
                    }
                  }}
                />

                <div className="mt-2 text-xs font-medium text-slate-500">
                  {desktopResultCount === 1
                    ? "1 page found"
                    : `${desktopResultCount} pages found`}
                </div>
              </div>

              <div
                className={`${SCROLL_CLASS} max-h-[min(68vh,620px)] overflow-y-auto`}
              >
                <div className="bg-sky-50/70 p-3 pb-0">
                  <AllToolsButton variant="dropdown" />
                </div>

                <SectionedNavList
                  sectionsToRender={desktopMoreSections}
                  query={desktopQuery}
                  count={desktopResultCount}
                  onClick={closeAll}
                />
              </div>
            </div>,
            document.body,
          )
        : null}

      {isClient && mobileOpen
        ? createPortal(
            <div className="fixed inset-0 z-[2147483647] sm:hidden">
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
                        <div className="text-xs font-semibold text-slate-600">
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
                    <label className="sr-only" htmlFor="mobile-tool-search">
                      Search rent tools
                    </label>
                    <input
                      id="mobile-tool-search"
                      value={mobileQuery}
                      onChange={(event) => setMobileQuery(event.target.value)}
                      placeholder="Search tools"
                      className="w-full cursor-text rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-sky-400"
                    />

                    <div className="mt-2 text-xs font-medium text-slate-500">
                      {mobileResultCount === 1
                        ? "1 page found"
                        : `${mobileResultCount} pages found`}
                    </div>
                  </div>
                </div>

                <div className="min-h-0 flex-1">
                  <div className={`${SCROLL_CLASS} h-full overflow-y-auto`}>
                    <div className="bg-sky-50/70 p-3 pb-0">
                      <AllToolsButton variant="mobile" />
                    </div>

                    <SectionedNavList
                      sectionsToRender={mobileSections}
                      query={mobileQuery}
                      count={mobileResultCount}
                      onClick={closeAll}
                      compact
                    />

                    <div className="h-[env(safe-area-inset-bottom)]" />
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
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
