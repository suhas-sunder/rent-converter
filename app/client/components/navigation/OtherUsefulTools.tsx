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
          href: "/weekly-to-monthly-rent",
          desc: "Compare weekly listings to monthly budgets or PCM-style pricing.",
          badge: "Popular",
        },
        {
          label: "Monthly → Weekly",
          href: "/monthly-to-weekly-rent",
          desc: "Convert monthly rent into weekly for apples-to-apples comparisons.",
          badge: "Popular",
        },
        {
          label: "Biweekly → Monthly",
          href: "/biweekly-to-monthly-rent",
          desc: "For paychecks every 2 weeks. Convert to a monthly equivalent.",
        },
        {
          label: "Monthly → Biweekly",
          href: "/monthly-to-biweekly-rent",
          desc: "Translate monthly rent into a biweekly amount for budgeting.",
        },
        {
          label: "Weekly → Biweekly",
          href: "/weekly-to-biweekly-rent",
          desc: "Helpful if rent is weekly but you budget per paycheck.",
        },
        {
          label: "Biweekly → Weekly",
          href: "/biweekly-to-weekly-rent",
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
          href: "/monthly-to-annual-rent",
          desc: "See the full-year cost of a monthly rent number.",
        },
        {
          label: "Annual → Monthly",
          href: "/annual-to-monthly-rent",
          desc: "Convert annual rent totals into a monthly amount.",
        },
        {
          label: "Weekly → Annual",
          href: "/weekly-to-annual-rent",
          desc: "Estimate yearly cost when rent is advertised weekly.",
        },
        {
          label: "Annual → Weekly",
          href: "/annual-to-weekly-rent",
          desc: "Convert annual totals into weekly rent equivalents.",
        },
        {
          label: "Biweekly → Annual",
          href: "/biweekly-to-annual-rent",
          desc: "Estimate annual cost when budgeting per paycheck.",
        },
        {
          label: "Annual → Biweekly",
          href: "/annual-to-biweekly-rent",
          desc: "Convert yearly totals into biweekly payments.",
        },
      ],
    },
    {
      title: "Daily and hourly edge cases",
      blurb:
        "For short-term rentals, room rentals, or situations where rates aren’t monthly.",
      items: [
        {
          label: "Monthly → Daily",
          href: "/monthly-to-daily-rent",
          desc: "Get a daily equivalent from monthly rent (useful for stays).",
        },
        {
          label: "Daily → Monthly",
          href: "/daily-to-monthly-rent",
          desc: "Convert daily pricing into a realistic monthly cost.",
        },
        {
          label: "Hourly → Monthly",
          href: "/hourly-to-monthly-rent",
          desc: "Estimate monthly cost from an hourly rate (rare but useful).",
        },
        {
          label: "Monthly → Hourly",
          href: "/monthly-to-hourly-rent",
          desc: "Turn monthly rent into hourly cost for “value” comparisons.",
        },
        {
          label: "Hourly → Annual",
          href: "/hourly-to-annual-rent",
          desc: "Estimate annual totals based on hourly pricing assumptions.",
        },
        {
          label: "Annual → Hourly",
          href: "/annual-to-hourly-rent",
          desc: "Convert yearly totals into an hourly equivalent.",
        },
      ],
    },
    {
      title: "Billing cycles & pay schedules",
      blurb:
        "Use these when rent is charged every 28 days / 4 weeks, or when you budget per paycheck.",
      items: [
        {
          label: "Rent paid every 4 weeks",
          href: "/rent-paid-every-4-weeks",
          desc: "A 4-week cycle usually means 13 payments per year, not 12.",
          badge: "Good to know",
        },
        {
          label: "Rent paid every 2 weeks",
          href: "/rent-paid-every-2-weeks",
          desc: "Biweekly payments can change your yearly total compared to monthly rent.",
        },
        {
          label: "Rent billed every 28 days",
          href: "/rent-billed-every-28-days",
          desc: "28-day billing doesn’t line up with calendar months, so comparisons can be misleading.",
        },
        {
          label: "Rent per paycheck",
          href: "/rent-per-paycheck",
          desc: "Budget rent as a slice of each paycheck (weekly/biweekly/monthly).",
        },
        {
          label: "Rent per pay period",
          href: "/rent-per-pay-period",
          desc: "Choose your pay schedule and calculate rent per period.",
        },
      ],
    },
    {
      title: "Insight tools",
      blurb:
        "Use these to compare options and plan your budget beyond the sticker price.",
      items: [
        {
          label: "True cost of rent per day",
          href: "/true-cost-of-rent-per-day",
          desc: "Break rent down into a daily number for comparisons and planning.",
        },
        {
          label: "True cost of rent per week",
          href: "/true-cost-of-rent-per-week",
          desc: "Convert any rent period into a weekly baseline.",
        },
        {
          label: "Rent affordability calculator",
          href: "/rent-affordability-calculator",
          desc: "Estimate what rent fits your income and budget constraints.",
          badge: "Popular",
        },
        {
          label: "Rent due date calculator",
          href: "/rent-due-date-calculator",
          desc: "Figure out due dates, next payment timing, and rent cycles.",
        },
      ],
    },
  ];

  return (
    <section id="links" className="max-w-6xl mx-auto px-6 pt-6">
      <h2 className="text-3xl font-bold text-center text-slate-800">
        Rent calculators & tools
      </h2>
      <p className="mt-3 text-slate-600 text-center max-w-3xl mx-auto">
        Choose the calculator that matches how your rent is listed and how you
        budget. Billing cycles like 28-day rent and paycheck schedules are easy
        to compare incorrectly, so those tools are grouped together below.
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
