export default function FAQ() {
  const faqData = [
    {
      q: "What is 170 per week per month?",
      a: "Using the same annual-basis method as the calculator, 170 per week converts to 738.69 per calendar month. This is a per-calendar-month (monthly equivalent) figure, not “four weeks of rent.”",
    },
    {
      q: "What calculation does this page use for 170 per week → monthly?",
      a: "It converts the weekly amount to a daily rate (weekly ÷ 7), annualises it using a 365-day year (daily × 365), then divides by 12 to get a per-calendar-month equivalent. In one line: weekly × 365 ÷ (7 × 12).",
    },
    {
      q: "Why isn’t 170 × 4 the same as the monthly result?",
      a: "170 × 4 is a 28-day amount. A calendar month is longer on average (about 30.42 days: 365 ÷ 12). That’s why the monthly equivalent is higher than the 4-week figure when you convert a weekly listing to a calendar-month basis.",
    },
    {
      q: "How much is 170 per week per year?",
      a: "On the same day-count basis, the annual equivalent is (170 ÷ 7) × 365 = 8,864.29 per year. Dividing by 12 brings you back to the monthly equivalent (about 738.69).",
    },
    {
      q: "Is this the amount I’ll be charged each month?",
      a: "Not necessarily. This is a comparison number so you can line up weekly listings with monthly listings. How you’re billed depends on the agreement: weekly collection, fixed due dates, 4-weekly cycles, proration rules, and move-in timing.",
    },
    {
      q: "What costs are not included in this conversion?",
      a: "This conversion is rent-only. It does not add utilities, internet, parking, pet fees, council/municipal taxes, service charges, or one-off costs like deposits and application fees. Those can change the real monthly outlay a lot.",
    },
    {
      q: "What if a listing is paid every 4 weeks instead of monthly?",
      a: "Every 4 weeks is a fixed 28-day cycle and often means about 13 payments per year. Monthly listings are typically described as 12 months per year. This page focuses on a per-calendar-month equivalent so you can compare weekly prices to monthly prices on a consistent annual basis.",
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
