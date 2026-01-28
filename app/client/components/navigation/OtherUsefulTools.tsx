import * as React from "react";
import { useLocation } from "react-router";

type ToolLink = {
  label: string;
  href: string;
  desc: string;
  badge?: string;
};

type ToolSection = {
  title: string;
  blurb: string;
  items: ToolLink[];
};

const ALL_SECTIONS: ToolSection[] = [
  {
    title: "Most common conversions",
    blurb:
      "Use these when your rent is listed in one period, but your budget uses another.",
    items: [
      {
        label: "Weekly → Monthly",
        href: "/weekly-to-monthly-rent-converter",
        desc: "Compare weekly listings to monthly budgets or PCM-style pricing.",
        badge: "Popular",
      },
      {
        label: "Monthly → Weekly",
        href: "/monthly-to-weekly-rent-converter",
        desc: "Convert monthly rent into weekly for apples-to-apples comparisons.",
        badge: "Popular",
      },
      {
        label: "Biweekly → Monthly",
        href: "/biweekly-to-monthly-rent-converter",
        desc: "For paychecks every 2 weeks. Convert to a monthly equivalent.",
      },
      {
        label: "Monthly → Biweekly",
        href: "/monthly-to-biweekly-rent-converter",
        desc: "Translate monthly rent into a biweekly amount for budgeting.",
      },
      {
        label: "Weekly → Biweekly",
        href: "/weekly-to-biweekly-rent-converter",
        desc: "Helpful if rent is weekly but you budget per paycheck.",
      },
      {
        label: "Biweekly → Weekly",
        href: "/biweekly-to-weekly-rent-converter",
        desc: "Turn a biweekly figure into weekly rent for comparisons.",
      },
    ],
  },
  {
    title: "Annual conversions",
    blurb:
      "Useful for long-term budgeting, total cost comparisons, and rent reporting.",
    items: [
      {
        label: "Monthly → Annual",
        href: "/monthly-to-annual-rent-converter",
        desc: "See the full-year cost of a monthly rent number.",
      },
      {
        label: "Annual → Monthly",
        href: "/annual-to-monthly-rent-converter",
        desc: "Convert annual rent totals into a monthly amount.",
      },
      {
        label: "Weekly → Annual",
        href: "/weekly-to-annual-rent-converter",
        desc: "Estimate yearly cost when rent is advertised weekly.",
      },
      {
        label: "Annual → Weekly",
        href: "/annual-to-weekly-rent-converter",
        desc: "Convert annual totals into weekly rent equivalents.",
      },
      {
        label: "Biweekly → Annual",
        href: "/biweekly-to-annual-rent-converter",
        desc: "Estimate annual cost when budgeting per paycheck.",
      },
      {
        label: "Annual → Biweekly",
        href: "/annual-to-biweekly-rent-converter",
        desc: "Convert yearly totals into biweekly payments.",
      },
    ],
  },
  {
    title: "Daily and hourly edge cases",
    blurb:
      "For short-term rentals, room rentals, or cases where rates are not monthly.",
    items: [
      {
        label: "Monthly → Daily",
        href: "/monthly-to-daily-rent-converter",
        desc: "Get a daily equivalent from monthly rent for short stays and comparisons.",
      },
      {
        label: "Daily → Monthly",
        href: "/daily-to-monthly-rent-converter",
        desc: "Convert daily pricing into a realistic monthly cost.",
      },
      {
        label: "Monthly → Hourly",
        href: "/monthly-to-hourly-rent-converter",
        desc: "Turn monthly rent into an hourly cost for value comparisons.",
      },
      {
        label: "Hourly → Monthly",
        href: "/hourly-to-monthly-rent-converter",
        desc: "Estimate monthly cost from an hourly rate.",
      },
      {
        label: "Hourly → Annual",
        href: "/hourly-to-annual-rent-converter",
        desc: "Estimate annual totals based on an hourly rate.",
      },
      {
        label: "Annual → Hourly",
        href: "/annual-to-hourly-rent-converter",
        desc: "Convert yearly totals into an hourly equivalent.",
      },
    ],
  },
  {
    title: "Rent calculators",
    blurb:
      "Calculators for breakouts, due dates, roommate splits, and paycheck budgeting.",
    items: [
      {
        label: "Rent calculator",
        href: "/rent-calculator",
        desc: "General-purpose rent calculator for quick totals and comparisons.",
        badge: "Core",
      },
      {
        label: "Rent paid every 4 weeks",
        href: "/rent-paid-every-4-weeks-calculator",
        desc: "A 4-week cycle usually means 13 payments per year, not 12.",
        badge: "Good to know",
      },
      {
        label: "Rent per paycheck",
        href: "/rent-per-paycheck-calculator",
        desc: "Budget rent as a slice of each paycheck (weekly, biweekly, monthly).",
      },
      {
        label: "Rent due date calculator",
        href: "/rent-due-date-calculator",
        desc: "Figure out due dates, next payment timing, and rent cycles.",
      },
      {
        label: "Rent per day calculator",
        href: "/rent-per-day-calculator",
        desc: "Calculate the per-day cost from your rent amount and period.",
      },
      {
        label: "Rent per week calculator",
        href: "/rent-per-week-calculator",
        desc: "Calculate the per-week cost from your rent amount and period.",
      },
      {
        label: "Rent split calculator",
        href: "/rent-split-calculator",
        desc: "Split rent across roommates.",
      },
    ],
  },
  {
    title: "Budget and affordability",
    blurb: "Sanity-check rent against income and take-home pay assumptions.",
    items: [
      {
        label: "Rent as a percentage of income",
        href: "/rent-as-percentage-of-income-calculator",
        desc: "See what portion of your income goes to rent.",
        badge: "Popular",
      },
      {
        label: "How much rent can I afford?",
        href: "/how-much-rent-can-i-afford-calculator",
        desc: "Estimate a rent range that fits your budget assumptions.",
        badge: "Popular",
      },
      {
        label: "Rent after-tax income",
        href: "/rent-after-tax-income-calculator",
        desc: "Compare rent to take-home pay instead of gross income.",
      },
      {
        label: "Rent vs take-home pay",
        href: "/rent-vs-take-home-pay-calculator",
        desc: "Compare rent to what you actually bring home.",
      },
    ],
  },
  {
    title: "Rent increases",
    blurb:
      "When rent changes and you want the new amount or the change percentage.",
    items: [
      {
        label: "Rent increase calculator",
        href: "/rent-increase-calculator",
        desc: "Compute the new rent after a flat increase amount.",
      },
      {
        label: "Rent increase percentage calculator",
        href: "/rent-increase-percentage-calculator",
        desc: "Calculate the percent increase from old rent to new rent.",
      },
      {
        label: "Rent after increase calculator",
        href: "/rent-after-increase-calculator",
        desc: "Apply a percentage increase and see the resulting rent.",
      },
    ],
  },
  {
    title: "Rent vs buy",
    blurb: "Compare renting and buying using your assumptions.",
    items: [
      {
        label: "Rent vs buy calculator",
        href: "/rent-vs-buy-calculator",
        desc: "Compare renting and buying using your assumptions.",
      },
    ],
  },
  {
    title: "Core tools",
    blurb: "Start here if you want the hub or a general rent conversion tool.",
    items: [
      {
        label: "Rent converter",
        href: "/rent-converter",
        desc: "Convert between rent periods with a full breakdown.",
        badge: "Popular",
      },
    ],
  },
];

type IntentKey =
  | "hub"
  | "converter_family"
  | "calc_general"
  | "calc_split"
  | "calc_due"
  | "calc_perday"
  | "calc_perweek"
  | "calc_4weeks"
  | "calc_paycheck"
  | "affordability"
  | "income_ratio"
  | "after_tax"
  | "take_home"
  | "increase"
  | "increase_percent"
  | "after_increase"
  | "rent_vs_buy"
  | "daily_hourly"
  | "annual_conversions"
  | "common_conversions";

function normalizePathname(pathname: string) {
  // treat "/" as hub (you said it redirects)
  if (pathname === "/") return "/rent-converter";
  return pathname;
}

function detectIntent(pathnameRaw: string): IntentKey {
  const pathname = normalizePathname(pathnameRaw);

  // Hub
  if (pathname === "/rent-converter") return "hub";

  // Converter family pages
  if (pathname.endsWith("-rent-converter")) {
    if (pathname.includes("daily") || pathname.includes("hourly"))
      return "daily_hourly";
    if (pathname.includes("annual")) return "annual_conversions";
    return "common_conversions";
  }

  // Calculators
  if (pathname === "/rent-calculator") return "calc_general";
  if (pathname === "/rent-split-calculator") return "calc_split";
  if (pathname === "/rent-due-date-calculator") return "calc_due";
  if (pathname === "/rent-per-day-calculator") return "calc_perday";
  if (pathname === "/rent-per-week-calculator") return "calc_perweek";
  if (pathname === "/rent-paid-every-4-weeks-calculator") return "calc_4weeks";
  if (pathname === "/rent-per-paycheck-calculator") return "calc_paycheck";

  // Affordability and income
  if (pathname === "/how-much-rent-can-i-afford-calculator")
    return "affordability";
  if (pathname === "/rent-as-percentage-of-income-calculator")
    return "income_ratio";
  if (pathname === "/rent-after-tax-income-calculator") return "after_tax";
  if (pathname === "/rent-vs-take-home-pay-calculator") return "take_home";

  // Rent increases
  if (pathname === "/rent-increase-calculator") return "increase";
  if (pathname === "/rent-increase-percentage-calculator")
    return "increase_percent";
  if (pathname === "/rent-after-increase-calculator") return "after_increase";

  // Rent vs buy
  if (pathname === "/rent-vs-buy-calculator") return "rent_vs_buy";

  // Policies or unknown: show the hub-oriented set
  return "hub";
}

function pickSectionsForIntent(intent: IntentKey): ToolSection[] {
  const byTitle = new Map(ALL_SECTIONS.map((s) => [s.title, s]));

  const get = (title: ToolSection["title"]) => {
    const s = byTitle.get(title);
    return s ? [s] : [];
  };

  // Keep this tight: render only 1–2 sections per page, not the whole directory.
  switch (intent) {
    case "hub":
      return [...get("Most common conversions"), ...get("Rent calculators")];

    case "common_conversions":
      return [...get("Most common conversions"), ...get("Annual conversions")];

    case "annual_conversions":
      return [...get("Annual conversions"), ...get("Most common conversions")];

    case "daily_hourly":
      return [
        ...get("Daily and hourly edge cases"),
        ...get("Most common conversions"),
      ];

    case "calc_general":
      return [...get("Rent calculators"), ...get("Most common conversions")];

    case "calc_split":
      return [
        {
          title: "Related rent calculators",
          blurb: "Common adjacent tools for roommates and budgeting.",
          items: [
            ...ALL_SECTIONS.find(
              (s) => s.title === "Rent calculators",
            )!.items.filter((i) =>
              [
                "/rent-calculator",
                "/rent-per-paycheck-calculator",
                "/rent-due-date-calculator",
              ].includes(i.href),
            ),
          ],
        },
        ...get("Budget and affordability"),
      ];

    case "calc_due":
      return [
        {
          title: "Related rent calculators",
          blurb: "Useful tools alongside due dates and payment timing.",
          items: [
            ...ALL_SECTIONS.find(
              (s) => s.title === "Rent calculators",
            )!.items.filter((i) =>
              [
                "/rent-calculator",
                "/rent-per-paycheck-calculator",
                "/rent-paid-every-4-weeks-calculator",
              ].includes(i.href),
            ),
          ],
        },
      ];

    case "calc_perday":
      return [...get("Daily and hourly edge cases")];

    case "calc_perweek":
      return [...get("Most common conversions")];

    case "calc_4weeks":
      return [
        {
          title: "Paid every 4 weeks: related tools",
          blurb:
            "These help you compare 4-week cycles to monthly and annual totals.",
          items: [
            {
              label: "Rent paid every 4 weeks",
              href: "/rent-paid-every-4-weeks-calculator",
              desc: "A 4-week cycle usually means 13 payments per year, not 12.",
              badge: "Core",
            },
            {
              label: "Monthly → Annual",
              href: "/monthly-to-annual-rent-converter",
              desc: "See the full-year cost of a monthly rent number.",
            },
            {
              label: "Weekly → Annual",
              href: "/weekly-to-annual-rent-converter",
              desc: "Estimate yearly cost when rent is advertised weekly.",
            },
            {
              label: "Weekly → Monthly",
              href: "/weekly-to-monthly-rent-converter",
              desc: "Compare weekly listings to monthly budgets or PCM-style pricing.",
            },
          ],
        },
      ];

    case "calc_paycheck":
      return [
        ...get("Most common conversions"),
        ...get("Budget and affordability"),
      ];

    case "affordability":
    case "income_ratio":
    case "after_tax":
    case "take_home":
      return [...get("Budget and affordability"), ...get("Rent calculators")];

    case "increase":
    case "increase_percent":
    case "after_increase":
      return [...get("Rent increases"), ...get("Budget and affordability")];

    case "rent_vs_buy":
      return [...get("Rent vs buy"), ...get("Budget and affordability")];

    default:
      return [...get("Most common conversions")];
  }
}

function clampItems(sections: ToolSection[], maxItemsPerSection: number) {
  return sections.map((s) => ({
    ...s,
    items: s.items.slice(0, maxItemsPerSection),
  }));
}

export default function OtherUsefulTools(props: { id?: string }) {
  const { pathname } = useLocation();

  const intent = React.useMemo(() => detectIntent(pathname), [pathname]);

  // Tight defaults: render 1–2 sections, each capped in size.
  const sections = React.useMemo(() => {
    const picked = pickSectionsForIntent(intent);

    // If we ended up with a custom small section (like split/due), keep it as-is.
    // Otherwise clamp to avoid big blocks everywhere.
    return clampItems(picked, intent === "hub" ? 6 : 6);
  }, [intent]);

  // If you're on the hub, keep your existing anchor id so your navbar "All Conversion Tools" works.
  const sectionId =
    props.id ??
    (normalizePathname(pathname) === "/rent-converter"
      ? "links"
      : "related-tools");

  return (
    <section id={sectionId} className="max-w-6xl mx-auto px-6 pt-6 mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-800">
        {normalizePathname(pathname) === "/rent-converter"
          ? "Rent calculators and tools"
          : "Related tools"}
      </h2>

      <p className="mt-3 text-slate-600 text-center max-w-3xl mx-auto">
        {normalizePathname(pathname) === "/rent-converter"
          ? "Choose the calculator that matches how your rent is listed and how you budget."
          : "Based on this page, here are the most relevant tools people use next."}
      </p>

      <div className="mt-8 space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {section.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 max-w-3xl">
                {section.blurb}
              </p>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {section.items.map((x) => (
                <a
                  key={x.href}
                  href={x.href}
                  className="cursor-pointer block border border-slate-200 rounded-2xl p-6 hover:shadow-md transition bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-base font-semibold text-slate-900">
                      {x.label}
                    </div>
                    {x.badge ? (
                      <span className="shrink-0 text-[11px] font-semibold rounded-full px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200">
                        {x.badge}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm text-slate-600">{x.desc}</p>
                  <div className="mt-4 text-sm font-semibold text-sky-700">
                    Open calculator →
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
