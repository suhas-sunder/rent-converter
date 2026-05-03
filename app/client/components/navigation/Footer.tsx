import { Link } from "react-router";

type ToolLink = { label: string; to: string };
type ToolCategory = {
  title: string;
  items: ToolLink[];
  // optional: span control in the outer grid
  cardClassName?: string;
  // optional: list layout override
  listClassName?: string;
};

export default function Footer() {
  const year = 2026;

  const categories: ToolCategory[] = [
    {
      title: "Rent Converters",
      // Make this wide so labels don’t wrap badly
      cardClassName: "lg:col-span-2",
      // Use a controlled grid inside the card (not CSS columns)
      listClassName: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1",
      items: [
        { label: "Universal Rent Converter", to: "/" },

        { label: "Monthly → Weekly", to: "/monthly-to-weekly-rent-converter" },
        { label: "Weekly → Monthly", to: "/weekly-to-monthly-rent-converter" },
        { label: "Weekly → Annual", to: "/weekly-to-annual-rent-converter" },
        {
          label: "Weekly → Biweekly",
          to: "/weekly-to-biweekly-rent-converter",
        },

        {
          label: "Biweekly → Weekly",
          to: "/biweekly-to-weekly-rent-converter",
        },
        {
          label: "Biweekly → Monthly",
          to: "/biweekly-to-monthly-rent-converter",
        },
        {
          label: "Biweekly → Annual",
          to: "/biweekly-to-annual-rent-converter",
        },

        { label: "Monthly → Annual", to: "/monthly-to-annual-rent-converter" },
        { label: "Annual → Monthly", to: "/annual-to-monthly-rent-converter" },

        { label: "Monthly → Daily", to: "/monthly-to-daily-rent-converter" },
        { label: "Daily → Monthly", to: "/daily-to-monthly-rent-converter" },

        { label: "Monthly → Hourly", to: "/monthly-to-hourly-rent-converter" },
        { label: "Hourly → Monthly", to: "/hourly-to-monthly-rent-converter" },

        { label: "Hourly → Annual", to: "/hourly-to-annual-rent-converter" },
        { label: "Annual → Hourly", to: "/annual-to-hourly-rent-converter" },

        { label: "Annual → Weekly", to: "/annual-to-weekly-rent-converter" },
        {
          label: "Annual → Biweekly",
          to: "/annual-to-biweekly-rent-converter",
        },

        {
          label: "Monthly → Biweekly",
          to: "/monthly-to-biweekly-rent-converter",
        },
      ],
    },
    {
      title: "Rent Calculators",
      items: [
        { label: "Rent Calculator", to: "/rent-calculator" },
        { label: "Rent Per Day", to: "/rent-per-day-calculator" },
        { label: "Rent Per Week", to: "/rent-per-week-calculator" },
        {
          label: "Paid Every 4 Weeks",
          to: "/rent-paid-every-4-weeks-calculator",
        },
        { label: "Rent Per Paycheck", to: "/rent-per-paycheck-calculator" },
        { label: "Split Rent", to: "/rent-split-calculator" },
        { label: "Rent Due Date", to: "/rent-due-date-calculator" },
      ],
    },
    {
      title: "Affordability & Income",
      items: [
        {
          label: "Rent % of Income",
          to: "/rent-as-percentage-of-income-calculator",
        },
        {
          label: "How Much Rent Can I Afford",
          to: "/how-much-rent-can-i-afford-calculator",
        },
        {
          label: "Rent After Tax Income",
          to: "/rent-after-tax-income-calculator",
        },
        {
          label: "Rent vs Take-Home Pay",
          to: "/rent-vs-take-home-pay-calculator",
        },
      ],
    },
    {
      title: "Rent Increases",
      items: [
        { label: "Rent Increase", to: "/rent-increase-calculator" },
        {
          label: "Increase Percentage",
          to: "/rent-increase-percentage-calculator",
        },
        { label: "After Increase", to: "/rent-after-increase-calculator" },
      ],
    },
    {
      title: "Rent vs Buy",
      items: [{ label: "Rent vs Buy", to: "/rent-vs-buy-calculator" }],
    },
    {
      title: "Popular Weekly → Monthly Answers",
      items: [
        { label: "$500/week → Monthly", to: "/500-per-week-to-monthly-rent" },
        { label: "$170/week → Monthly", to: "/170-per-week-to-monthly-rent" },
        { label: "$180/week → Monthly", to: "/180-per-week-to-monthly-rent" },
      ],
    },
    {
      title: "Country Versions",
      items: [
        { label: "Weekly → Monthly (UK)", to: "/weekly-to-monthly-rent-uk" },
        {
          label: "Weekly → Monthly (Australia)",
          to: "/weekly-to-monthly-rent-australia",
        },
        { label: "Rent Per Paycheck (US)", to: "/rent-per-paycheck-us" },
        {
          label: "Rent Per Paycheck (Canada)",
          to: "/rent-per-paycheck-canada",
        },
      ],
    },
  ];

  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div id="all-tools" className="bg-slate-900/80 px-5 py-6 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                RentConverter.com
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                All Rental Tools
              </h2>
            </div>
            <span className="text-sm font-medium text-slate-300">
              Browse rent converters, calculators, and comparison tools
            </span>
          </div>

          {/* Keep cards compact and avoid stretched empty boxes */}
          <div className="mt-5 grid grid-cols-1 items-start gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className={[
                  "min-w-0",
                  cat.cardClassName || "",
                ].join(" ")}
              >
                <div className="text-sm font-bold uppercase tracking-wide text-sky-100">
                  {cat.title}
                </div>

                <ul
                  className={[
                    "mt-3 text-base leading-snug",
                    cat.listClassName || "space-y-1.5",
                  ].join(" ")}
                >
                  {cat.items.map((item) => (
                    <li key={item.to} className="min-w-0">
                      <Link
                        to={item.to}
                        className="block cursor-pointer whitespace-normal break-words rounded-md text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center">
          <nav aria-label="Footer links" className="text-base">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <li>
                <Link
                  to="/about"
                  className="cursor-pointer text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="cursor-pointer text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/sitemap"
                  className="cursor-pointer text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Sitemap
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="cursor-pointer text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="cursor-pointer text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="cursor-pointer text-slate-200 underline-offset-4 transition-colors hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </nav>

          <p className="text-base font-medium text-slate-300">
            © {year} RentConverter.com • Rent conversion and renter tools
          </p>

          <p className="max-w-5xl text-sm leading-relaxed text-slate-400">
            Tools on this site are for informational, budgeting, and comparison
            purposes only. Always confirm payment schedules and lease terms in
            your rental agreement. This website does not provide financial,
            legal, or tax advice. Rental costs, affordability, payment
            schedules, and obligations vary by location, landlord, lease terms,
            and individual circumstances. Always review your lease agreement and
            consult qualified professionals before making financial decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
