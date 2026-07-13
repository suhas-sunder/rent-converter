type FAQProps = {
  includeSchema?: boolean;
};

export default function FAQ({ includeSchema = true }: FAQProps) {
  const faqData = [
    {
      q: "How do you convert weekly rent to monthly rent in Australia?",
      a: "Multiply weekly rent by 365, divide by 7, then divide by 12. The result is an average calendar-month equivalent based on the same annual rent.",
    },
    {
      q: "Why is weekly rent times 4 different from monthly rent?",
      a: "Four weeks is 28 days. An average calendar month is about 30.42 days, so weekly rent times 4 is a four-week amount, not a calendar-month equivalent.",
    },
    {
      q: "Does the calculation change in Melbourne, Sydney, or another Australian city?",
      a: "No. The rent-period arithmetic is the same across Australian cities. A city name does not change the weekly-to-monthly formula.",
    },
    {
      q: "Can I enter any weekly amount and use another currency?",
      a: "Yes. Enter any weekly rent amount. AUD is selected by default, and you can choose another available currency for display.",
    },
    {
      q: "Does this calculator show market rent or determine tenancy requirements?",
      a: "No. It does not provide market rent data or determine legal rent, tenancy terms, bond requirements, rent-increase limits, or an exact lease payment schedule.",
    },
    {
      q: "What costs are included?",
      a: "Only the rent amount you enter. Utilities, parking, internet, insurance, deposits, and fees are not included unless you add them to the weekly amount.",
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
