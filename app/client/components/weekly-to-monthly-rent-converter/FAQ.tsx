type FAQProps = {
  includeSchema?: boolean;
};

export default function FAQ({ includeSchema = true }: FAQProps) {
  const faqData = [
    {
      q: "What is the formula for weekly to monthly rent on this page?",
      a: "The conversion uses annual equivalence: weekly is treated as a 7-day amount, converted to an annual total using a 365-day year (weekly / 7 x 365), then divided by 12 to produce a monthly equivalent.",
    },
    {
      q: "Why does weekly x 4 not match the monthly result?",
      a: "Four weeks is 28 days. An average month is about 30.42 days (365 / 12). Weekly x 4 matches a 28-day cycle, not a calendar-month equivalent.",
    },
    {
      q: "How is every-4-weeks rent different from monthly rent?",
      a: "Every 4 weeks is a fixed 28-day cycle and often implies about 13 payments per year. Monthly billing is typically described as 12 payments per year. Even if the per-payment amounts look similar, the annual totals can differ.",
    },
    {
      q: "Can weekly rent look cheaper but cost more over a year?",
      a: "Yes. Weekly and monthly quotes can appear cheaper or more expensive depending on how they are framed. Converting both to annual totals is the cleanest way to compare true cost.",
    },
    {
      q: "Does this match the exact day rent is due?",
      a: "No. This is an equivalence for budgeting and comparison. Exact totals depend on lease terms, start dates, proration rules, and how billing periods are defined.",
    },
    {
      q: "Does the math change by country?",
      a: "No. The math is the same everywhere. What changes is how rent is commonly advertised.",
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
                  v
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
