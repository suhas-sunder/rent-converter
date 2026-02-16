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

    // NEW: Answer pages
    {
      title: "Popular Weekly → Monthly Answers",
      items: [
        { label: "$500/week → Monthly", to: "/500-per-week-to-monthly-rent" },
        { label: "$170/week → Monthly", to: "/170-per-week-to-monthly-rent" },
        { label: "$180/week → Monthly", to: "/180-per-week-to-monthly-rent" },
      ],
    },

    // NEW: International variants
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
    <footer className="bg-sky-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div
          id="all-tools"
          className="rounded-2xl border border-sky-900/60 bg-sky-950/30 p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-bold text-white">All Rental Tools</h2>
            <span className="text-base text-slate-400">
              Browse utilities by category
            </span>
          </div>

          {/* Cap at 3 columns so cards stay wide and readable */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className={[
                  "rounded-xl border border-sky-900/40 bg-sky-950/15 p-4",
                  cat.cardClassName || "",
                ].join(" ")}
              >
                <div className="text-base font-bold uppercase tracking-wide text-slate-200">
                  {cat.title}
                </div>

                <ul
                  className={[
                    "mt-3 text-lg leading-snug",
                    cat.listClassName || "space-y-1",
                  ].join(" ")}
                >
                  {cat.items.map((item) => (
                    <li key={item.to} className="min-w-0">
                      <Link
                        to={item.to}
                        className="block text-slate-300 hover:text-white hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-normal break-words"
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
                  to="/privacy-policy"
                  className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                >
                  Cookies
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white hover:underline underline-offset-4 cursor-pointer"
                >
                  About
                </Link>
              </li>
            </ul>
          </nav>

          <p className="text-base text-slate-400">
            © {year} RentConverter.com • Rent conversion and renter tools
          </p>

          <p className=" text-sm text-slate-400/90">
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
