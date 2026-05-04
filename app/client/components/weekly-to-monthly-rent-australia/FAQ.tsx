type FAQProps = {
  includeSchema?: boolean;
};

export default function FAQ({ includeSchema = true }: FAQProps) {
  const faqData = [
    {
      q: "How do you convert weekly rent to monthly rent in Australia on this page?",
      a: "This calculator converts an Australian weekly rent (pw) into a per-calendar-month (PCM) equivalent using a 365-day basis: monthly = weekly × 365 ÷ (7 × 12). It treats a week as 7 days and a month as the average calendar month length (365 ÷ 12 days).",
    },
    {
      q: "What does “PCM” mean if rent is advertised weekly in Australia?",
      a: "PCM here means a calendar-month equivalent used for comparison and budgeting. In Australia most ads quote rent per week, but many budgets, affordability checks, and monthly bills are easier to think about monthly. PCM lets you compare a weekly listing to a monthly number on the same annual cost basis.",
    },
    {
      q: "Why is weekly × 4 not the same as monthly rent?",
      a: "Because 4 weeks is 28 days, not a calendar month. A calendar month averages about 30.42 days (365 ÷ 12). Weekly × 4 gives a 28-day (4-week) figure, while this tool outputs a per-calendar-month equivalent.",
    },
    {
      q: "In Australia, how is 4-weekly (every 28 days) different from monthly?",
      a: "A 4-weekly cycle is always 28 days and typically produces 13 payments over a year (52 ÷ 4). Monthly is generally understood as 12 months in a year. Even if the payment amounts look close, the annual total can differ, so it helps to compare everything using an annual basis.",
    },
    {
      q: "Can a weekly rent price look cheaper but cost more over a year?",
      a: "Yes. Weekly, 4-weekly, and monthly figures can look similar while describing different time bases. Converting them to the same annual total (or to PCM using the same annual basis) is the cleanest way to compare true cost across listings.",
    },
    {
      q: "Will this match my exact rent payments or lease schedule in Australia?",
      a: "Not exactly. This is a budgeting and comparison conversion. Your actual payments depend on what your lease specifies (weekly, fortnightly, 4-weekly, monthly), the start date, any proration, and what is included (utilities, parking, internet, fees).",
    },
    {
      q: "Does the weekly-to-monthly conversion change for Australia specifically?",
      a: "The math does not change by country. What changes is how rent is commonly advertised. Australia often lists rent per week, so this page focuses on turning a weekly figure into a monthly-equivalent (PCM) number that’s easier to compare to monthly budgets.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <section id="faq" className="max-w-5xl mx-auto pb-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-3 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-200">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between hover:text-sky-900">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-400 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>
      {includeSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      ) : null}
    </>
  );
}
