export default function FAQ() {
  const faqData = [
    {
      q: "How does this UK page convert weekly rent to monthly (PCM)?",
      a: "It converts a weekly (pw) figure into a per-calendar-month (PCM) equivalent using a day-based annual model: daily = weekly ÷ 7, annual = daily × 365, then PCM = annual ÷ 12. This keeps the result consistent with an average calendar month (365 ÷ 12 days), which is the cleanest way to compare UK weekly ads to monthly budgets and monthly listings.",
    },
    {
      q: "Why isn’t “weekly × 4” the same as the PCM result?",
      a: "Because “× 4” is a 4-week cycle (28 days), not a calendar month. A calendar month averages about 30.42 days (365 ÷ 12), so weekly × 4 usually understates the monthly equivalent when you’re trying to compare a pw advert to a pcm price.",
    },
    {
      q: "In the UK, what’s the difference between 4-weekly rent and monthly rent?",
      a: "4-weekly rent is billed every 28 days and typically results in about 13 payments per year. Monthly (PCM) is usually framed as 12 calendar-month payments per year. Even if the numbers look close, the annual totals and the timing can differ, which is why this page focuses on a calendar-month equivalent for comparison.",
    },
    {
      q: "Does this match what my landlord or letting agent will actually charge each month?",
      a: "Not necessarily. This is a conversion for comparison and budgeting. Actual cashflow depends on the tenancy terms, the due date, whether the rent is collected weekly/4-weekly/monthly, and any pro-rata adjustments around move-in or renewal.",
    },
    {
      q: "Can a weekly price look cheaper but work out higher when converted to PCM?",
      a: "Yes. Weekly figures can feel lower because they’re on a shorter time basis. Converting both options to the same annual total (and then to PCM) makes the comparison fair, especially when you’re weighing a pw room listing against pcm flats or studios.",
    },
    {
      q: "Does anything change in the UK compared with other countries?",
      a: "The math is the same everywhere, but the context is different. In the UK, you’ll often compare pw quotes (common in room shares and some adverts) against pcm listings and monthly pay cycles. This page is written for that UK browsing pattern while using the same underlying day-based conversion.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
