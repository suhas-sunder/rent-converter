export default function FAQ() {
  const faqData = [
    {
      q: "How do you calculate rent per paycheck in the US?",
      a: "This tool takes your rent and turns it into a per-paycheck set-aside amount. It annualizes rent (monthly × 12) and divides by your paycheck count: 52 (weekly), 26 (biweekly), 24 (semi-monthly), or 12 (monthly). That gives a consistent “rent per paycheck” number you can use for budgeting and automatic transfers.",
    },
    {
      q: "Biweekly vs semi-monthly: why do the numbers come out different?",
      a: "Biweekly pay is every 2 weeks, which usually means 26 paychecks per year. Semi-monthly pay is twice per month on fixed dates, which is 24 paychecks per year. Same rent, fewer checks means a bigger rent-per-check amount on semi-monthly. Biweekly spreads rent across two extra paydays each year, so the per-check amount is lower.",
    },
    {
      q: "Do I need to budget differently in months with “extra” paychecks?",
      a: "If you’re paid biweekly (26 checks) or weekly (52 checks), some months will have an extra payday compared with a strict twice-a-month rhythm. This tool smooths rent across the whole year, so you can set aside the same amount each paycheck. Many people treat those “extra-paycheck” months as breathing room for savings, debt, or catching up on other expenses after rent is covered.",
    },
    {
      q: "Is this what my landlord will withdraw from each paycheck?",
      a: "No. In the US, rent is typically due monthly, not per paycheck. This is a planning tool: it tells you how much to earmark from each check so your monthly rent is fully funded by the due date (without scrambling on one paycheck).",
    },
    {
      q: "Should I split rent across multiple paychecks or pay it from one check?",
      a: "Split it if you want predictable cash flow. Paying from one check can work if your due date lines up with a larger paycheck and your other bills are light. Splitting across paychecks usually feels safer because it reduces the chance that one week of unexpected spending forces you to juggle rent.",
    },
    {
      q: "Does the calculator include utilities, HOA fees, parking, or roommate splits?",
      a: "No. This page focuses on rent only, because those extras vary a lot by household and lease. If you split rent with roommates, enter your share. If your lease bundles utilities, you can include them in the rent number, but keep in mind it stops being “rent-only” budgeting at that point.",
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
