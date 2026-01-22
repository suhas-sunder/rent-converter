type CountryLink = {
  label: string;
  href: string;
  desc: string;
};

export default function RentToolsByCountry() {
  const countryLinks: CountryLink[] = [
    {
      label: "Canada",
      href: "/weekly-to-monthly-rent-canada",
      desc: "Monthly rent is common, but 4-week and 28-day billing also shows up.",
    },
    {
      label: "Australia",
      href: "/weekly-to-monthly-rent-australia",
      desc: "Most listings are weekly. Monthly comparisons need conversion.",
    },
    {
      label: "New Zealand",
      href: "/weekly-to-monthly-rent-new-zealand",
      desc: "Weekly rent is standard, even for long-term leases.",
    },
    {
      label: "UK (PCM)",
      href: "/weekly-to-monthly-rent-uk",
      desc: "Rent is usually PCM (per calendar month), not 4-week periods.",
    },
    {
      label: "Ireland",
      href: "/weekly-to-monthly-rent-ireland",
      desc: "Monthly listings are common, but wording differs from UK PCM.",
    },
    {
      label: "United States",
      href: "/weekly-to-monthly-rent-us",
      desc: "Monthly rent is standard, with occasional weekly or short-term listings.",
    },

    // standard calculators
    {
      label: "Weekly → Monthly (standard)",
      href: "/weekly-to-monthly-rent",
      desc: "Generic conversion without country-specific assumptions.",
    },
    {
      label: "Monthly → Weekly (standard)",
      href: "/monthly-to-weekly-rent",
      desc: "Use when you just need the math, not local context.",
    },
  ];

  return (
    <section id="countries" className="max-w-6xl mx-auto px-6 pt-12 pb-16">
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
        Rent conversion by country
      </h2>

      <p className="text-slate-600 text-center max-w-3xl mx-auto mb-10">
        Rent is listed differently around the world. These calculators reflect
        common local formats so comparisons match what you actually see in
        listings.
      </p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {countryLinks.map((c) => (
          <a
            key={c.href}
            href={c.href}
            className="block p-6 border border-slate-200 rounded-2xl hover:shadow-md transition bg-white"
          >
            <strong className="text-slate-900 block">{c.label}</strong>
            <p className="text-sm text-slate-600 mt-2">{c.desc}</p>
            <div className="mt-3 text-sm font-semibold text-sky-700">
              Open calculator →
            </div>
          </a>
        ))}
      </div>

      <p className="mt-10 text-sm text-slate-500 text-center max-w-3xl mx-auto">
        Don’t see your country? The standard calculators work anywhere, but
        country pages mirror common local listing styles and terminology.
      </p>
    </section>
  );
}
