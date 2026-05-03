export default function FAQ() {
  const faqData = [
    {
      q: "What does $500 per week equal per calendar month (PCM) on this page?",
      a: "This page converts $500 per week into a per-calendar-month (PCM) equivalent using a 365-day year. The rule is: monthly equivalent = weekly × 365 ÷ (7 × 12). For $500/week, that’s $500 × 365 ÷ (7 × 12) = $2,172.62 per month (PCM).",
    },
    {
      q: "Why isn’t $500 per week × 4 the same as the monthly result?",
      a: "$500 × 4 = $2,000 is a 4-week (28-day) amount, not a calendar-month equivalent. A calendar month averages about 30.42 days (365 ÷ 12), so the PCM equivalent for a weekly price is typically higher than the 4-week shortcut.",
    },
    {
      q: "How much higher is the PCM equivalent than the 4-week shortcut for $500/week?",
      a: "For $500/week, the PCM equivalent is $2,172.62 per month, while the 4-week shortcut is $2,000. The difference is $172.62 per month-equivalent. That gap is exactly why weekly listings can feel cheaper if you mentally convert them using ×4.",
    },
    {
      q: "Is this the same as saying rent is billed 12 times per year?",
      a: "Not necessarily. This is a comparison and budgeting equivalent based on annual cost, not a statement about how a landlord bills. Some leases collect weekly, fortnightly, 4-weekly, or on fixed due dates. The tool’s job is to put a weekly figure onto a calendar-month basis so you can compare like with like.",
    },
    {
      q: "Does $500/week correspond to a clear annual rent number too?",
      a: "Yes. The conversion is anchored to an annual total: annual equivalent = (weekly ÷ 7) × 365. For $500/week, that’s (500 ÷ 7) × 365 = $26,071.43 per year. Dividing by 12 gives the same $2,172.62 PCM equivalent.",
    },
    {
      q: "What should I double-check when comparing a $500/week listing to monthly listings?",
      a: "Use the PCM equivalent to compare base rent, then check the real drivers that can swing the total: what’s included (utilities, internet, parking), any separate fees, and whether the lease is truly weekly/4-weekly/monthly. The PCM number helps you compare pricing periods, but it won’t tell you what extras you’ll actually pay.",
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
