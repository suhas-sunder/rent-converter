type ToolLink = {
  label: string;
  href: string;
  desc: string;
  badge?: string;
};

export default function OtherUsefulTools() {
  const sections: Array<{
    title: string;
    blurb: string;
    items: ToolLink[];
  }> = [
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
          label: "Rent per person calculator",
          href: "/rent-per-person-calculator",
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
      blurb:
        "Start here if you want the hub or a general rent conversion tool.",
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

  return (
    <section id="links" className="max-w-6xl mx-auto px-6 pt-6 mb-6">
      <h2 className="text-3xl font-bold text-center text-slate-800">
        Rent calculators and tools
      </h2>
      <p className="mt-3 text-slate-600 text-center max-w-3xl mx-auto">
        Choose the calculator that matches how your rent is listed and how you
        budget. Billing cycles like 4-week rent can be easy to compare
        incorrectly, so those tools are grouped together below.
      </p>

      <div className="mt-10 space-y-12">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-slate-900">
                {section.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 max-w-3xl">
                {section.blurb}
              </p>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {section.items.map((x) => (
                <a
                  key={x.href}
                  href={x.href}
                  className="block border border-slate-200 rounded-2xl p-6 hover:shadow-md transition bg-white"
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
