export default function FAQ() {
  const faqData = [
    {
      q: "How does this rent-per-paycheque calculator work in Canada?",
      a: "It starts with your monthly rent and converts it to an annual total (monthly × 12). Then it divides by your pay frequency to show how much rent to set aside from each paycheque. Common Canadian schedules are 52 (weekly), 26 (biweekly), 24 (semi-monthly), and 12 (monthly).",
    },
    {
      q: "What’s the difference between biweekly and semi-monthly pay in Canada?",
      a: "Biweekly means you’re paid every 2 weeks, which is 26 paycheques per year. Semi-monthly means you’re paid twice per month on fixed dates (often the 15th and last day), which is 24 paycheques per year. With the same monthly rent, biweekly usually results in a lower rent-per-paycheque amount because you spread rent across two extra paydays each year.",
    },
    {
      q: "If rent is due monthly, why bother calculating it per paycheque?",
      a: "Because your cash flow is paycheque-based. This breakdown tells you what to transfer into a rent bucket each payday so the full month’s rent is ready when it’s due, without relying on a big single-paycheque hit.",
    },
    {
      q: "Will this match my exact rent due date or the month with three paydays?",
      a: "Not exactly. This is a budgeting allocation based on annual totals, not a calendar simulation. Some months have an extra weekly or biweekly payday, and your rent due date might not line up with your pay cycle. The point is consistency across the year so you don’t run short.",
    },
    {
      q: "Should I set aside rent from every paycheque or only from certain ones?",
      a: "Most people set aside a smaller amount from every paycheque to keep things smooth. If you prefer paying rent from a specific cheque (for example, the first cheque after the 1st), you can still use the per-paycheque figure as your baseline and adjust your transfers around your due date.",
    },
    {
      q: "Does this include utilities, parking, internet, or roommate splits?",
      a: "No. It’s rent only. Add-ons and splits vary a lot across Canadian rentals, so treat them as separate lines in your budget and use this tool just for the base rent allocation.",
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
