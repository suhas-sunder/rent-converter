export default function FAQ() {
  const faqData = [
    {
      q: "What is 180 per week in monthly rent?",
      a: "Using the page’s calendar-month method (365-day year), 180 per week converts to 180 × 365 ÷ (7 × 12) = 782.11 per calendar month (PCM). This is an equivalence for comparing weekly listings to monthly listings.",
    },
    {
      q: "Why isn’t 180 × 4 the same as the monthly result?",
      a: "180 × 4 = 720 is a 4-week total (28 days). A calendar month averages about 30.42 days (365 ÷ 12), so the monthly equivalent is higher. For 180 per week, the gap is about 62.11 per month on an average-month basis (782.11 − 720).",
    },
    {
      q: "What does “monthly” mean on this page?",
      a: "“Monthly” means a per-calendar-month (PCM) equivalent based on an average month length: 365 ÷ 12 days. The tool converts weekly rent to an annual total using days, then divides by 12 so the monthly figure stays consistent with the same yearly cost.",
    },
    {
      q: "Does this mean I will pay 782.11 every month?",
      a: "Not necessarily. Some rentals collect weekly, fortnightly, or every 4 weeks even if the listing mentions a monthly figure. This page gives an equivalent monthly number for comparison and budgeting, not a prediction of your exact billing schedule.",
    },
    {
      q: "What is the yearly cost of 180 per week?",
      a: "On a 365-day basis, annual rent is (180 ÷ 7) × 365 = 9,385.71 per year. A common shortcut is 180 × 52 = 9,360, which reflects a 52-payment cadence rather than the day-based annual equivalence used for PCM comparisons.",
    },
    {
      q: "Does the conversion change by country or lease terms?",
      a: "The math on this page does not change by country because it’s based on day counts (7-day weeks and a 365-day year). What can change is how rent is advertised and collected, plus any proration, fees, or inclusions in the lease, which this conversion does not add.",
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

              <div className="mt-2 text-slate-700 leading-relaxed max-w-prose">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
