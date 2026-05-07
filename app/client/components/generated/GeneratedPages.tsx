import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  dailyToMonthlyCents,
  dailyToWeeklyCents,
  divRound,
  formatMoney,
  formatPercent,
  fourWeekToMonthlyCents,
  fortnightlyToMonthlyCents,
  isCurrency,
  monthlyToAnnualCents,
  monthlyToWeeklyCents,
  parseMoneyToCents,
  parsePositiveNumber,
  SUPPORTED_CURRENCIES,
  weeklyToAnnualCents,
  weeklyToDailyCents,
  weeklyToMonthlyCents,
  type Currency,
} from "~/client/utils/rentMath";
import { JsonLd, makePageSchemas, type SeoConfig } from "~/client/utils/seo";

export type RelatedLink = {
  to: string;
  label: string;
  description?: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type ContentSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type ExampleItem = {
  title: string;
  body: string;
};

export type TermRow = {
  term: string;
  meaning: string;
  note: string;
};

export type InfoPageConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  answerTitle: string;
  answer: string;
  formula?: string;
  caveat?: string;
  tableTitle?: string;
  tableRows?: TermRow[];
  ctaLinks: RelatedLink[];
  sections: ContentSection[];
  examples: ExampleItem[];
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
};

export type ConversionMode =
  | "weekly-to-monthly"
  | "monthly-to-weekly"
  | "four-week-to-monthly"
  | "weekly-to-fortnightly"
  | "fortnightly-to-monthly"
  | "daily-to-monthly";

export type ConversionPageConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  inputLabel: string;
  defaultAmount: string;
  defaultCurrency: Currency;
  mode: ConversionMode;
  resultLabel: string;
  formulaLabel: string;
  context: string;
  commonAmounts?: number[];
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  examples: ExampleItem[];
  sections: ContentSection[];
};

export type WeeklyAnswerPageConfig = SeoConfig & {
  amount: number;
  currency: Currency;
  path: string;
  h1: string;
  eyebrow: string;
  description: string;
  title: string;
  labelPrefix?: string;
  daily?: boolean;
  relatedLinks: RelatedLink[];
};

export type IncomeToolMode =
  | "multiplier"
  | "ratio"
  | "rent-rule"
  | "max-rent"
  | "budget"
  | "hourly"
  | "salary";

export type IncomeToolConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  mode: IncomeToolMode;
  multiplier?: number;
  percent?: number;
  defaultIncome?: string;
  defaultRent?: string;
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  examples: ExampleItem[];
  sections: ContentSection[];
};

export type SalaryAnswerConfig = SeoConfig & {
  salary: number;
  h1: string;
  eyebrow: string;
  relatedLinks: RelatedLink[];
};

export type IncreaseToolConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  mode: "simple" | "compound" | "cpi" | "escalation" | "regional" | "formula";
  defaultRate?: string;
  defaultFixed?: string;
  regionNote?: string;
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  examples: ExampleItem[];
};

export type SplitToolConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  mode: "income" | "roommate" | "percentage";
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
};

export type DateToolConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  mode: "lease" | "lease-range" | "twelve-month" | "schedule";
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
};

export type MoveInCostConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  mode: "advance" | "bond-advance";
  defaultCurrency: Currency;
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  examples: ExampleItem[];
  sections: ContentSection[];
};

export type ProrationToolConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  defaultCurrency: Currency;
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  examples: ExampleItem[];
  sections: ContentSection[];
};

function Shell({
  children,
  schemas,
}: {
  children: React.ReactNode;
  schemas: object[];
}) {
  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 scroll-smooth antialiased">
      <style>{`
        @media print {
          .rc-no-print { display: none !important; }
          header, footer { display: none !important; }
          main { background: #fff !important; }
        }
      `}</style>
      <JsonLd schemas={schemas} />
      {children}
    </main>
  );
}

function ToolCard({
  eyebrow,
  h1,
  lead,
  children,
  onPrint,
}: {
  eyebrow: string;
  h1: string;
  lead: string;
  children: React.ReactNode;
  onPrint?: () => void;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="rc-page-eyebrow">{eyebrow}</p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
              {h1}
            </h1>
            <p className="mt-3 max-w-none text-base leading-relaxed text-slate-700">
              {lead}
            </p>
          </div>
          {onPrint ? (
            <button
              type="button"
              onClick={onPrint}
              data-nosnippet
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Print / Save PDF
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
  inputMode = "decimal",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "decimal" | "numeric" | "text";
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </span>
      <input
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
      />
    </label>
  );
}

function CurrencySelect({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (value: Currency) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-800">
        Currency
      </span>
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          onChange(isCurrency(next) ? next : "USD");
        }}
        className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
      >
        {SUPPORTED_CURRENCIES.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultPanel({
  label,
  value,
  detail,
  cards,
  tableRows,
}: {
  label: string;
  value: string;
  detail?: string;
  cards?: Array<{ label: string; value: string }>;
  tableRows?: string[][];
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-sky-50" aria-live="polite">
      <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sky-600" />
          <h2 className="text-base font-bold text-slate-950">{label}</h2>
        </div>
        <div className="mt-2 text-4xl font-extrabold tracking-tight text-emerald-700 sm:text-5xl">
          {value}
        </div>
        {detail ? <p className="mt-2 leading-7 text-slate-700">{detail}</p> : null}

        {cards?.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div key={card.label} className="rounded-2xl bg-white px-4 py-3">
                <div className="text-sm font-medium text-slate-700">{card.label}</div>
                <div className="mt-1 text-xl font-bold text-slate-950">{card.value}</div>
              </div>
            ))}
          </div>
        ) : null}

        {tableRows?.length ? (
          <div className="mt-5 overflow-hidden rounded-2xl bg-white">
            <table className="w-full text-left text-sm">
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row.join("|")} className="odd:bg-white even:bg-sky-50/45">
                    {row.map((cell, index) => (
                      <td
                        key={`${cell}-${index}`}
                        className={[
                          "px-4 py-2",
                          index === 0 ? "font-semibold text-slate-800" : "text-slate-700",
                          index === row.length - 1 ? "text-right font-bold text-slate-950" : "",
                        ].join(" ")}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

      </div>
    </div>
  );
}

function RelatedTools({ links }: { links: RelatedLink[] }) {
  if (!links.length) return null;
  return (
    <section className="bg-sky-50 px-6 py-14 rc-no-print">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight text-sky-900">
          Related calculators and guides
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="cursor-pointer rounded-2xl bg-white px-5 py-4 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50"
            >
              <span className="block font-semibold text-sky-900">{link.label}</span>
              {link.description ? (
                <span className="mt-1 block text-sm leading-6 text-slate-700">
                  {link.description}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContentBlocks({
  sections,
  examples,
}: {
  sections: ContentSection[];
  examples?: ExampleItem[];
}) {
  const visibleExamples = examples ?? [];
  const hasExamples = visibleExamples.length > 0;

  return (
    <section className="bg-white px-6 py-14 rc-no-print">
      <div
        className={[
          "mx-auto grid max-w-6xl gap-10",
          hasExamples
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)]"
            : "",
        ].join(" ")}
      >
        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-bold tracking-tight text-sky-900">
                {section.title}
              </h2>
              <p className="mt-3 leading-8 text-slate-700">{section.body}</p>
              {section.bullets?.length ? (
                <ul className="mt-4 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 leading-7 text-slate-700">
                      <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {hasExamples ? (
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-sky-900">
              Worked examples
            </h2>
            <div className="mt-4 space-y-4">
              {visibleExamples.map((example) => (
                <div key={example.title} className="relative pl-5">
                  <span aria-hidden="true" className="absolute left-0 top-2.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <h3 className="font-semibold text-slate-950">{example.title}</h3>
                  <p className="mt-1 leading-7 text-slate-700">{example.body}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Faq({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-sky-800">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-3">
          {items.map((item) => (
            <details key={item.q} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50">
                <span>{item.q}</span>
                <span aria-hidden="true" className="text-slate-700 transition-transform group-open:rotate-180">
                  v
                </span>
              </summary>
              <div className="mt-2 leading-relaxed text-slate-700">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function assumptionsText(path: string) {
  if (path.includes("increase") || path.includes("ontario") || path.includes("california") || path.includes("quebec") || path.includes("bc-")) {
    return "This page estimates rent math only. Local rules, notice requirements, lease terms, and allowable increases can change, so check the official tenancy authority for your location.";
  }
  if (path.includes("australia") || path.includes("melbourne") || path.includes("sydney") || path.includes("bond") || path.includes("advance")) {
    return "Australian rental rules vary by state and territory. Calculation assumptions reviewed May 7, 2026. Use this as a budgeting estimate and check your lease or state tenancy authority for exact requirements.";
  }
  return "Calculations use a 365-day year, 7-day weeks, 14-day fortnightly or biweekly periods, 28-day four-week periods, and 365 divided by 12 days for a calendar month.";
}

function AssumptionNote({ path }: { path: string }) {
  return (
    <section className="bg-sky-50 px-6 pb-10 rc-no-print">
      <div className="mx-auto max-w-6xl rounded-2xl bg-sky-100/75 px-5 py-3 text-sm leading-6 text-slate-700">
        {assumptionsText(path)}
      </div>
    </section>
  );
}

function mergeSections(required: ContentSection[], existing: ContentSection[] = []) {
  const seen = new Set<string>();
  const merged: ContentSection[] = [];
  for (const section of [...required, ...existing]) {
    const key = section.title.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(section);
  }
  return merged;
}

function conversionUseCase(config: ConversionPageConfig) {
  if (config.path === "/weekly-to-monthly-rent-formula-uk") {
    return "Use this when you want to check the PW-to-PCM formula behind a UK listing, not just copy a converted number. It is most useful when a listing quotes weekly rent and your rent cap or salary planning is monthly.";
  }
  if (config.path === "/convert-weekly-rent-to-monthly-uk") {
    return "Use this when a UK listing is quoted weekly and you need to compare it with a monthly budget, another PCM listing, or a rent cap before deciding whether to enquire.";
  }
  if (config.path === "/4-weekly-to-monthly-rent-uk") {
    return "Use this when the payment wording says every 4 weeks or 28 days. That rhythm creates 13 payment periods per year, so it should not be treated as ordinary PCM rent.";
  }
  if (config.path === "/pcm-rent-calculator") {
    return "Use this when you need to move between UK-style PW and PCM wording and keep the annual rent consistent. It helps compare room listings, flat listings, and monthly salary planning on the same basis.";
  }
  if (config.path === "/pw-rent-calculator") {
    return "Use this when a PCM amount needs a weekly equivalent for a PW comparison, shared-housing discussion, or weekly-paid budget.";
  }
  if (config.path === "/australia-rent-calculator") {
    return "Use this as the broad Australia rent-period check when a listing, bond estimate, rent-in-advance amount, or household budget uses a different period than the number you need.";
  }
  if (config.path === "/weekly-to-fortnightly-rent-australia") {
    return "Use this when the listing is weekly but your rent collection, pay cycle, or household cash-flow plan is fortnightly. It keeps the simple two-week amount separate from true monthly rent.";
  }
  if (config.path === "/fortnightly-to-monthly-rent-australia") {
    return "Use this when a fortnightly rent amount needs to be checked against monthly bills, salary planning, bond estimates, or rent-in-advance cash needed at move-in.";
  }
  if (config.path.includes("melbourne") || config.path.includes("sydney")) {
    return "Use this when comparing weekly listings in that city against a monthly budget. It is a rent calculation page, not a local legal guide or market-average claim.";
  }
  if (config.path.includes("australia") || config.path.includes("melbourne") || config.path.includes("sydney")) {
    return "Use this when an Australian listing is quoted weekly or fortnightly but your budget, bond estimate, rent-in-advance estimate, or household plan is monthly.";
  }
  if (config.path.includes("pcm") || config.path.includes("pw-") || config.path.includes("uk")) {
    return "Use this when a UK-style listing uses PW, PCM, or 4-weekly wording and you need one clear monthly or weekly comparison.";
  }
  if (config.mode.includes("monthly")) {
    return "Use this when a listing, lease, paycheck plan, or budget uses a different rent period than the number you want to compare.";
  }
  return "Use this when you need to compare rent across payment periods without changing the underlying lease amount.";
}

function conversionSections(config: ConversionPageConfig) {
  return mergeSections(
    [
      {
        title: "How this calculator works",
        body: `${config.formulaLabel}. ${config.context} The result keeps the period math consistent, so a weekly, 14-day, 28-day, monthly, or annual amount can be compared on the same basis.`,
      },
      {
        title: "When to use this page",
        body: conversionUseCase(config),
      },
      {
        title: "What this result does not include",
        body: "The result converts rent only. Utilities, deposits, parking, pet rent, service charges, insurance, move-in fees, proration, and lease-specific payment rules are not included unless you add them to the rent amount yourself.",
      },
      {
        title: "How to read the comparison",
        body: "Use the converted amount for the budget period you actually plan with, then keep the original listing period visible so you do not lose track of how rent is collected. A calendar-month result is best for monthly bills, while a weekly, fortnightly, or 4-week result is better for matching a payment cycle.",
      },
    ],
    config.sections,
  );
}

function incomeSections(config: IncomeToolConfig) {
  const multiplier = config.multiplier ?? 3;
  const percent = config.percent ?? 30;
  const method =
    config.mode === "multiplier"
      ? {
          basis: `This page applies a ${multiplier}x gross-income screening rule to the rent amount entered.`,
          when: "Use it when a listing or application mentions a 2x, 2.5x, or 3x rent rule and you need to know the gross income number before applying.",
          read: `A ${multiplier}x rule is a qualification screen. It answers whether income is high enough relative to rent, not whether the household budget will feel comfortable after taxes and bills.`,
          limit: "Screening multiples do not include take-home pay, debts, utilities, deposits, savings goals, credit profile, guarantor options, or whether the landlord combines household income.",
        }
      : config.mode === "ratio"
        ? {
            basis: "This page divides rent by income to show the rent-to-income percentage.",
            when: "Use it when you already know the rent and income and want to interpret the percentage instead of starting from a rule of thumb.",
            read: "The percentage shows how much income rent consumes before other costs. A lower ratio leaves more room for utilities, debt, savings, transport, insurance, and irregular expenses.",
            limit: "A rent-to-income ratio does not show take-home pay, tax withholding, debt minimums, household size, local costs, deposits, or whether the rent includes utilities.",
          }
        : config.mode === "hourly"
          ? {
              basis: "This page turns hourly pay and weekly hours into annual and monthly gross income before estimating rent targets.",
              when: "Use it when income is based on an hourly wage, variable hours, or a weekly schedule and a salary-style calculator would hide the pay-frequency detail.",
              read: "The result depends heavily on the hours entered. If hours vary, compare a conservative hour count with your normal schedule before using a rent target.",
              limit: "Hourly estimates do not include unpaid time off, overtime changes, tax withholding, payroll deductions, debt, utilities, transport, or seasonal hour changes.",
            }
          : config.mode === "rent-rule"
            ? {
                basis: `This page applies a ${percent}% gross-income rent guideline to the income entered.`,
                when: `Use it when you want a quick ${percent}% benchmark before comparing the result with a stricter take-home-pay or rent-budget check.`,
                read: percent >= 40
                  ? "A 40% target is a stretch benchmark for many renters. It can be useful for comparison, but it should be tested against real paycheck cash flow before signing."
                  : "A 30% target is a common starting point. It is usually more useful as a ceiling to investigate than as proof that a rent amount is safe.",
                limit: "Percentage rules do not account for tax, debt, utilities, deposits, transport, savings, insurance, childcare, medical costs, or local rent levels.",
              }
            : config.mode === "salary"
              ? {
                  basis: "This page converts annual salary into gross monthly income, then compares rent targets and qualification-style limits.",
                  when: "Use it when the number you know is annual salary but the lease, listing, or budget decision is monthly.",
                  read: "Salary-based rent targets are clean benchmarks. They become more realistic after you compare them with actual take-home pay and fixed monthly costs.",
                  limit: "Annual salary does not show taxes, deductions, bonuses, variable income, debt, utilities, deposits, transport, household size, or city-level cost pressure.",
                }
              : {
                  basis: "This page turns income, target rent, and entered expenses into rent targets using common budgeting bands.",
                  when: "Use it when you want a renter-budget view instead of a landlord-screening answer.",
                  read: "The result is strongest when the expense number reflects real recurring costs. A lower target usually gives more room for move-in costs and unexpected bills.",
                  limit: "Budget estimates depend on the expenses entered and do not decide approval, legal rent limits, utility charges, deposits, insurance, or future income changes.",
                };

  return mergeSections(
    [
      {
        title: "How this calculator works",
        body: `${method.basis} The output is a planning estimate, not an approval decision or a complete household budget.`,
        bullets: [
          "Use the rent target as a starting point before adding utilities, debt payments, savings, and transport.",
          "Compare gross-income rules with take-home pay when the household budget is tight.",
          "Treat landlord screening rules as qualification checks, not proof that the rent is comfortable.",
        ],
      },
      {
        title: "When to use this page",
        body: method.when,
      },
      {
        title: "How to read the result",
        body: method.read,
      },
      {
        title: "What this result does not include",
        body: method.limit,
      },
      {
        title: "Next check after this result",
        body: config.mode === "multiplier"
          ? "If the required income looks close, compare the same rent with take-home pay and monthly expenses before paying an application fee. A screening rule can approve a number that still feels tight."
          : config.mode === "ratio"
            ? "If the ratio lands near a cutoff, test the same rent with take-home pay and fixed expenses. The percentage is most useful when it leads to a real cash-flow check."
            : config.mode === "hourly"
              ? "If hours vary, rerun the calculator with a conservative schedule and compare that result with the rent-per-paycheck calculator. Hourly affordability is sensitive to missed shifts and unpaid time off."
              : "If the target rent is near the high end, compare it with take-home pay, upfront move-in cash, and a specific listing. Broad rules become more useful when checked against a real rent amount.",
      },
    ],
    config.sections,
  );
}

function increaseSections(config: IncreaseToolConfig) {
  const modeText =
    config.mode === "compound"
      ? "The calculator applies the entered percentage repeatedly for the number of years entered."
      : config.mode === "escalation"
        ? "The calculator models scheduled increases from a starting rent and escalation rate."
        : config.mode === "formula"
          ? "The calculator compares percentage, fixed-dollar, and old-to-new rent formulas side by side."
          : config.mode === "regional"
            ? "The calculator applies the percentage you enter to the current monthly rent so the arithmetic is visible."
            : "The calculator applies the entered increase percentage to the current monthly rent.";

  const regionalText =
    config.mode === "regional"
      ? " Calculation assumptions reviewed May 7, 2026. Official rules, exemptions, notice timing, local caps, and lease terms can change, so verify the current government or tenancy-source rules before acting."
      : "";

  return mergeSections(
    [
      {
        title: "How this calculator works",
        body: `${modeText} It shows the new monthly rent, monthly change, annual rent before, and annual rent after so the increase is visible beyond one payment.${regionalText}`,
      },
      {
        title: "When to use this page",
        body: "Use it to check renewal offers, rent notices, budget changes, CPI-linked clauses, scheduled increases, or before-and-after rent math before you decide whether to move, negotiate, or ask for clarification.",
      },
      {
        title: "What this result does not include",
        body: "This is arithmetic only. It does not decide whether a rent increase is allowed, whether notice is valid, whether a unit is exempt, whether local caps apply, or whether fees and utilities can change separately.",
        bullets: [
          "Check whether the amount is a fixed increase, percentage increase, CPI-linked increase, or scheduled escalation.",
          "Confirm whether the rent amount excludes separate fees, utilities, parking, or service charges.",
          "For regional pages, verify current official rules before using the result in a dispute or notice response.",
        ],
      },
      ...(config.mode === "regional"
        ? [
            {
              title: "Calculation math vs official rules",
              body: "The percentage result only checks the numbers. It should be kept separate from legal eligibility, notice timing, exemption status, local rent-control coverage, and any official calculator or worksheet required for that region.",
              bullets: [
                "Use the entered rate as a scenario to test, not as a guarantee that the rate applies.",
                "Compare the result with the notice, lease wording, and current official guidance before acting.",
                "Local or unit-specific exceptions can matter even when the arithmetic is correct.",
              ],
            },
          ]
        : []),
      {
        title: "How to read the result",
        body: "The monthly change shows the immediate payment impact. The annual before-and-after amounts show the full-year impact, which is usually the better number for deciding whether a renewal offer, CPI adjustment, or escalation clause fits your budget. If rent is paid weekly, fortnightly, or every 4 weeks, convert the new monthly rent before comparing payment-cycle cash flow.",
      },
      {
        title: "Before acting on an increase",
        body: config.mode === "regional"
          ? "Use the calculator to check the arithmetic, then compare the notice, dates, exemption status, and allowed-increase language against the current official tenancy source for that region."
          : "Use the calculator to check the arithmetic, then compare the result with the lease clause or rent notice. A correct percentage calculation does not prove that the increase is permitted or that every required notice step was followed.",
      },
    ],
    [],
  );
}

function splitSections(config: SplitToolConfig) {
  const method =
    config.mode === "income"
      ? "Income-based splitting divides rent and entered shared costs in proportion to each roommate income."
      : config.mode === "percentage"
        ? "Percentage splitting applies the custom share entered for one roommate and assigns the rest to the other."
        : "The roommate split view starts with an equal split and lets you compare the shared monthly amount clearly.";

  return [
    {
      title: "How this calculator works",
      body: `${method} The table shows the monthly share for each person so the agreement can be checked before anyone pays.`,
    },
    {
      title: "When to use this page",
      body: "Use it when roommates have different incomes, different room values, parking arrangements, private bathrooms, or shared utilities that need to be discussed before signing or renewing a lease.",
    },
    {
      title: "Choosing a fair split method",
      body: config.mode === "income"
        ? "Income-based rent splitting can help when roommates agree that ability to pay should matter more than identical shares. It works best when everyone is comfortable using income as the basis."
        : config.mode === "percentage"
          ? "A percentage split is useful when roommates already agreed on exact shares because of room size, private space, parking, pets, or another practical tradeoff."
          : "An equal split is the cleanest starting point when rooms and incomes are similar. If one room is larger or one roommate gets an extra benefit, compare it with percentage or income-based splits.",
    },
    {
      title: "Utilities and shared costs",
      body: "Rent and utilities do not always need the same split. Some households split rent by room value but split internet, electricity, water, or supplies equally. Put only the shared costs you want included into the calculator.",
    },
    {
      title: "What this result does not include",
      body: "This does not decide legal responsibility under the lease, damage deposits, late fees, household chores, variable utility usage, or what happens if one roommate cannot pay.",
    },
  ];
}

function splitExamples(config: SplitToolConfig): ExampleItem[] {
  if (config.mode === "income") {
    return [
      {
        title: "Different incomes",
        body: "$2,400 rent plus $300 utilities split between $4,000 and $6,000 monthly incomes gives the higher-income roommate a larger share.",
      },
      {
        title: "When income-based split helps",
        body: "If one roommate earns much less but both want the same apartment, an income-based split can make the rent conversation more explicit before the lease is signed.",
      },
    ];
  }
  if (config.mode === "percentage") {
    return [
      {
        title: "Room value adjustment",
        body: "A 60/40 split can fit a larger bedroom, private bathroom, parking spot, or other agreed value difference.",
      },
      {
        title: "Custom share check",
        body: "Use the percentage result to confirm the exact dollar shares before collecting rent, especially when the split includes utilities or fees.",
      },
    ];
  }
  return [
    {
      title: "Equal-share starting point",
      body: "$2,400 rent plus $300 shared costs is $2,700 total, or $1,350 each for two roommates before any room adjustments.",
    },
    {
      title: "Roommate discussion",
      body: "Start with the equal split, then adjust only if the roommates agree that room size, parking, private bathroom access, or income differences should change the shares.",
    },
  ];
}

function dateSections(config: DateToolConfig) {
  const task =
    config.mode === "schedule"
      ? "The calculator builds payment dates from the first due date, lease length, rent amount, and payment frequency."
      : "The calculator adds the lease length to the start date and treats the end date as the day before the same calendar date after that length.";

  return [
    {
      title: "How this calculator works",
      body: `${task} Date output is a planning aid; exact dates depend on the lease wording and payment terms.`,
    },
    {
      title: "When to use this page",
      body: "Use it before move-in, renewal, notice planning, payment scheduling, or when you need a quick check of lease start dates, end dates, due dates, and reminders.",
    },
      {
        title: "What this result does not include",
        body: "This does not override lease language, grace periods, holiday rules, payment portal cutoffs, local notice rules, proration clauses, or agreement-specific due-date changes.",
        bullets: [
          "Use lease wording for the final legal date when it differs from a calculator result.",
          "Build reminders earlier than the calculated date when payment processing time matters.",
          "Check notice periods separately from rent payment dates because they can use different rules.",
        ],
      },
      {
        title: "How to read the calculated date",
        body: config.mode === "schedule"
          ? "The schedule lists the payment dates produced from the start date and frequency entered. Monthly schedules stay on calendar months, while weekly, fortnightly, and every-4-weeks schedules move by fixed day intervals."
          : "The end date is calculated by adding the lease length to the start date, then stepping back one day. This matches a common lease-counting convention, but the lease wording controls the final date.",
      },
      {
        title: "Before you put dates on a calendar",
        body: "Check whether the lease uses calendar days, business days, a specific payment portal cutoff, or a notice deadline that falls before the visible rent due date. Those details can change when you should schedule the actual payment or reminder.",
      },
      {
        title: "After you get the date",
        body: "Use the output to plan rent reminders, renewal conversations, notice timing, move-in budgeting, or a proration check. If money is due before move-in, compare the date result with the rent-in-advance and prorated-rent calculators. Keep a copy for your own records when dates affect deposits or payments.",
      },
      {
        title: "Common date mistakes to avoid",
        body: "Do not assume every lease ends on the same numbered day it starts, and do not treat a reminder date as the legal deadline. Month lengths, leap years, weekends, portal cutoff times, and lease wording can all change how a date should be used in practice. When dates affect money, save the calculation beside the lease clause or invoice line it is based on.",
      },
    ];
}

function dateExamples(config: DateToolConfig): ExampleItem[] {
  if (config.mode === "schedule") {
    return [
      {
        title: "Monthly rent schedule",
        body: "A lease starting 2026-06-01 with monthly rent due monthly generates one payment date for each month in the lease length entered.",
      },
    ];
  }
  return [
    {
      title: "12-month lease",
      body: "A 12-month lease starting June 1 commonly ends May 31 the next year under this counting method, but the lease controls the final date.",
    },
  ];
}

function moveInSections(config: MoveInCostConfig) {
  return mergeSections(
    [
      {
        title: "How this calculator works",
        body: config.mode === "advance"
          ? "The calculator multiplies weekly rent by the number of weeks paid in advance and compares that with calendar-month rent."
          : "The calculator estimates bond, rent in advance, optional moving costs, and the combined upfront amount from the weekly rent entered.",
      },
      {
        title: "When to use this page",
        body: "Use it before applying, signing, or moving so bond, rent in advance, and other upfront costs are visible before you commit cash.",
      },
      {
        title: "Australian move-in context",
        body: config.mode === "advance"
          ? "Australian listings often start from weekly rent even when renters budget by fortnight or month. Converting the weekly rent into rent-in-advance amounts helps separate future rent from bond and other move-in cash."
          : "Bond, rent in advance, and moving costs can arrive together even though they cover different purposes. Keeping them separated makes it easier to check the lease, receipt, and state or territory guidance.",
      },
      {
        title: "What to check before paying",
        body: "Confirm the number of weeks requested, what period the advance rent covers, how bond is lodged or receipted, and whether utilities, keys, moving costs, or cleaning charges are separate.",
      },
      {
        title: "What this result does not include",
        body: "Rules vary by state, territory, lease, and property. This does not decide legal maximums, bond lodgement rules, utility connections, moving quotes, pet costs, or inspection fees.",
      },
    ],
    config.sections,
  );
}

function prorationSections(config: ProrationToolConfig) {
  return mergeSections(
    [
      {
        title: "How this calculator works",
        body: "The calculator divides rent by the days in the selected period, then multiplies that daily rate by the number of days charged.",
      },
      {
        title: "When to use this page",
        body: "Use it for mid-period move-ins, move-outs, lease changes, partial first months, or checking a prorated rent line before paying.",
      },
      {
        title: "What this result does not include",
        body: "Your lease or local rules may require a different proration method. Utilities, deposits, cleaning fees, late fees, and move-in charges are not included.",
      },
    ],
    config.sections,
  );
}

function infoSections(config: InfoPageConfig) {
  const lowerPath = config.path.toLowerCase();
  const isPw = lowerPath.includes("pw") || lowerPath.includes("weekly");
  const isPcm = lowerPath.includes("pcm") || lowerPath.includes("calendar-month");
  const isDueDate = lowerPath.includes("rent-due") || lowerPath.includes("current-month") || lowerPath.includes("first");

  if (isDueDate) {
    return mergeSections(
      [
        {
          title: "How this page works",
          body: "This guide separates the common rent-payment convention from the lease-specific answer. It explains the usual timing, then points you back to the calculator when dates, grace periods, or payment schedules need to be checked.",
        },
        {
          title: "When to use this page",
          body: "Use it when you need to understand what a rent payment usually covers before checking the exact due date, schedule, first-month payment, or rent-in-advance language in your lease.",
        },
        {
          title: "What this page does not include",
          body: "It does not override a lease, payment portal cutoff, grace period, notice rule, holiday rule, or local requirement. Use it as planning guidance and confirm the final answer from the lease or local rule.",
          bullets: [
            "Grace periods can affect late fees without changing the original due date.",
            "Payment processing time can matter when bank transfers or portals settle after submission.",
            "Move-in, move-out, and proration language can use separate timing rules.",
          ],
        },
        {
          title: "How to use this with a lease",
          body: "Read the lease clause first, then use the related calculator to turn the clause into dates or partial-period amounts. That keeps the guide from replacing the agreement while still making the rental math easier to check.",
        },
      ],
      config.sections,
    );
  }

  const pageWork =
    lowerPath.includes("pcm-vs-pw")
      ? "This page compares two listing periods side by side: PCM for calendar-month rent and PW for weekly rent. It focuses on comparison traps rather than defining only one term."
      : lowerPath.includes("what-does-pcm")
        ? "This page defines PCM as per calendar month, then shows why PCM should not be confused with weekly rent or every-4-weeks rent."
        : lowerPath.includes("what-does-pw")
          ? "This page defines PW as per week, then shows why the weekly amount should be annualized before it is compared with a monthly rent cap."
          : lowerPath.includes("per-calendar-month-rent-uk")
            ? "This page focuses on UK per-calendar-month wording and how it relates to PW, 4-weekly rent, deposits, bills, and monthly budgeting."
            : lowerPath.includes("per-calendar-month-rent")
              ? "This page explains per-calendar-month rent as a payment period, then separates it from daily month length and 28-day rent cycles."
              : isPw
                ? "This page defines weekly rent wording, then shows why a weekly listing should be annualized before comparing it with a calendar-month budget."
                : isPcm
                  ? "This page defines per-calendar-month rent, then compares it with weekly and every-4-weeks rent so the listing period does not distort the budget."
                  : "This page explains the listing term, shows the conversion formula when relevant, and connects the term to the calculator that matches the next decision.";
  const pageUse =
    lowerPath.includes("pcm-vs-pw")
      ? "Use it when two listings use different period labels and you need to compare the actual rent rhythm before choosing which one is cheaper or easier to budget."
      : lowerPath.includes("what-does-pcm")
        ? "Use it when a listing says PCM and you need to know whether the amount is monthly, whether bills are included, and how it compares with weekly rent."
        : lowerPath.includes("what-does-pw")
          ? "Use it when a listing says PW and you need to turn the weekly price into a monthly or annual comparison before deciding whether it fits."
          : lowerPath.includes("per-calendar-month")
            ? "Use it when the phrase per calendar month appears in a listing or lease and you need to separate monthly rent from weekly or 28-day payment wording."
            : "Use it when a listing uses PCM, PW, per calendar month, or 4-weekly wording and you need to understand the term before comparing rent, bills, or affordability.";

  return mergeSections(
    [
      {
        title: "How this page works",
        body: pageWork,
      },
      {
        title: "When to use this page",
        body: pageUse,
      },
      {
        title: "What this page does not include",
        body: "The term does not prove what bills, council tax, service charges, parking, deposits, or utilities are included. The listing and lease control those details.",
        bullets: [
          "Use PW-to-PCM conversion for rent amount comparison, not for included-bills assumptions.",
          "Use the lease or listing to confirm payment dates, deposits, and service charges.",
          "Use the 4-week comparison only when the listing is actually collected every 28 days.",
        ],
      },
      {
        title: "How to use the term in a listing",
        body: "Translate the listing term into the period you budget with, then compare like with like. A PCM amount fits monthly bills, a PW amount fits weekly listings, and a 4-weekly amount should be checked separately because it creates 13 payment periods per year.",
      },
    ],
    config.sections,
  );
}

export function InfoPage({ config }: { config: InfoPageConfig }) {
  const schemas = makePageSchemas({ ...config, faq: config.faq });
  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead}>
        <div className="mt-6 overflow-hidden rounded-[1.5rem] bg-sky-50">
          <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sky-600" />
              <h2 className="text-base font-bold text-slate-950">{config.answerTitle}</h2>
            </div>
            <p className="mt-3 text-base leading-7 text-slate-800">
              {config.answer}
            </p>
            {config.formula ? (
              <div className="mt-4 rounded-2xl bg-white px-4 py-3 font-mono text-sm font-semibold text-slate-950">
                {config.formula}
              </div>
            ) : null}
            {config.caveat ? (
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {config.caveat}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3" data-nosnippet>
              {config.ctaLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ToolCard>

      {config.tableRows?.length ? (
        <section className="bg-white px-6 py-12 rc-no-print">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold tracking-tight text-sky-900">
              {config.tableTitle ?? "Comparison"}
            </h2>
            <div className="mt-5 overflow-hidden rounded-2xl bg-sky-50">
              {config.tableRows.map((row) => (
                <div key={row.term} className="grid gap-2 px-4 py-3 sm:grid-cols-[150px_minmax(0,1fr)]">
                  <div className="font-bold text-slate-950">{row.term}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{row.meaning}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-700">{row.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ContentBlocks sections={infoSections(config)} examples={config.examples} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq ?? []} />
    </Shell>
  );
}

type ConversionValues = {
  main: bigint;
  cards: Array<[string, bigint]>;
  detail: string;
};

function conversionValues(mode: ConversionMode, cents: bigint): ConversionValues {
  if (mode === "monthly-to-weekly") {
    const weekly = monthlyToWeeklyCents(cents);
    return {
      main: weekly,
      cards: [
        ["Monthly rent", cents],
        ["Annual rent", monthlyToAnnualCents(cents)],
        ["Daily equivalent", weeklyToDailyCents(weekly)],
      ],
      detail: "Monthly rent is annualized over 12 months, then divided into 7-day weekly periods.",
    };
  }
  if (mode === "four-week-to-monthly") {
    const monthly = fourWeekToMonthlyCents(cents);
    return {
      main: monthly,
      cards: [
        ["Every 4 weeks", cents],
        ["Weekly equivalent", divRound(cents, 4n)],
        ["Annual rent", divRound(cents * 365n, 28n)],
      ],
      detail: "A 28-day rent cycle is annualized over a 365-day year, so it is not the same as monthly rent.",
    };
  }
  if (mode === "weekly-to-fortnightly") {
    return {
      main: cents * 2n,
      cards: [
        ["Monthly equivalent", weeklyToMonthlyCents(cents)],
        ["Annual rent", weeklyToAnnualCents(cents)],
        ["4-week amount", cents * 4n],
      ],
      detail: "Fortnightly rent is two weekly payments. Calendar monthly rent is still a separate average.",
    };
  }
  if (mode === "fortnightly-to-monthly") {
    const monthly = fortnightlyToMonthlyCents(cents);
    return {
      main: monthly,
      cards: [
        ["Weekly equivalent", divRound(cents, 2n)],
        ["Annual rent", divRound(cents * 365n, 14n)],
        ["Two fortnightly payments", cents * 2n],
      ],
      detail: "Fortnightly rent is a 14-day amount annualized over a 365-day year. Two fortnightly payments cover 28 days.",
    };
  }
  if (mode === "daily-to-monthly") {
    return {
      main: dailyToMonthlyCents(cents),
      cards: [
        ["Daily amount", cents],
        ["Weekly equivalent", dailyToWeeklyCents(cents)],
        ["Annual rent", cents * 365n],
      ],
      detail: "Nightly rent is treated as daily rent for comparison across months and years.",
    };
  }

  const monthly = weeklyToMonthlyCents(cents);
  return {
    main: monthly,
    cards: [
      ["Annual rent", weeklyToAnnualCents(cents)],
      ["Every 4 weeks", cents * 4n],
      ["Difference from 4 weeks", monthly - cents * 4n],
    ],
    detail: "Weekly rent is annualized over 365 days, then divided by 12 calendar months.",
  };
}

export function ConversionCalculatorPage({ config }: { config: ConversionPageConfig }) {
  const [amount, setAmount] = useState(config.defaultAmount);
  const [currency, setCurrency] = useState<Currency>(config.defaultCurrency);
  const parsed = useMemo(() => parseMoneyToCents(amount), [amount]);
  const values = useMemo(() => {
    if (!parsed.ok) return undefined;
    return conversionValues(config.mode, parsed.cents);
  }, [config.mode, parsed]);
  const tableRows = useMemo(() => {
    if (!config.commonAmounts?.length) return [];
    return config.commonAmounts.map((item) => {
      const cents = BigInt(Math.round(item * 100));
      const converted = conversionValues(config.mode, cents).main;
      return [formatMoney(cents, currency), formatMoney(converted, currency)];
    });
  }, [config.commonAmounts, config.mode, currency]);
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });

  return (
    <Shell schemas={schemas}>
      <ToolCard
        eyebrow={config.eyebrow}
        h1={config.h1}
        lead={config.lead}
        onPrint={() => window.print()}
      >
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px]">
          <TextInput label={config.inputLabel} value={amount} onChange={setAmount} />
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>
        {!parsed.ok ? <p className="mt-2 text-sm font-semibold text-rose-700">{parsed.error}</p> : null}
        {parsed.ok && parsed.warnings.length ? (
          <p className="mt-2 text-sm text-amber-800">{parsed.warnings.join(" ")}</p>
        ) : null}
        <ResultPanel
          label={config.resultLabel}
          value={formatMoney(values?.main, currency)}
          detail={values?.detail ?? config.context}
          cards={values?.cards.map(([label, value]) => ({
            label,
            value: formatMoney(value, currency),
          }))}
          tableRows={tableRows.length ? [["Input", "Result"], ...tableRows] : undefined}
        />
      </ToolCard>
      <DirectAnswer
        title="Direct answer"
        body={config.context}
        formula={config.formulaLabel}
      />
      <ContentBlocks sections={conversionSections(config)} examples={config.examples} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

function DirectAnswer({
  title,
  body,
  formula,
}: {
  title: string;
  body: string;
  formula?: string;
}) {
  return (
    <section className="bg-white px-6 py-10 rc-no-print">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.5rem] bg-sky-50">
        <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />
        <div className="p-5 sm:p-6">
          <h2 className="text-2xl font-bold tracking-tight text-sky-900">
            {title}
          </h2>
          <p className="mt-3 leading-8 text-slate-700">{body}</p>
          {formula ? (
            <div className="mt-4 rounded-2xl bg-white px-4 py-3 font-mono text-sm font-semibold text-slate-950">
              {formula}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

const exactAnswerAmounts = [150, 160, 170, 180, 200, 220, 230, 250, 300, 320, 350, 370, 400, 450, 500, 550, 600, 650, 750];

function nearbyWeeklyAnswerLinks(config: WeeklyAnswerPageConfig): RelatedLink[] {
  if (config.currency !== "USD" || config.daily) return config.relatedLinks.slice(0, 6);

  const index = exactAnswerAmounts.indexOf(config.amount);
  const nearby =
    index === -1
      ? []
      : [exactAnswerAmounts[index - 1], exactAnswerAmounts[index + 1]]
          .filter((amount): amount is number => typeof amount === "number")
          .map((amount) => ({
            to: `/${amount}-per-week-to-monthly-rent`,
            label: `$${amount} per week to monthly rent`,
            description: "Compare a nearby weekly amount with this result.",
          }));

  const links = [...nearby, ...config.relatedLinks];
  return Array.from(new Map(links.map((link) => [link.to, link])).values()).slice(0, 6);
}

type ExactAnswerCopy = {
  lead: string;
  budgetTitle: string;
  budgetBody: string;
  sections: ContentSection[];
  examples: ExampleItem[];
};

function exactAnswerCopy(
  config: WeeklyAnswerPageConfig,
  cents: bigint,
  weekly: bigint,
  monthly: bigint,
  fourWeek: bigint,
  annual: bigint,
  diff: bigint,
): ExactAnswerCopy {
  const amountLabel = `${formatMoney(cents, config.currency)} ${config.daily ? "per night" : "per week"}`;
  const monthlyLabel = formatMoney(monthly, config.currency);
  const fourWeekLabel = formatMoney(fourWeek, config.currency);
  const annualLabel = formatMoney(annual, config.currency);
  const diffLabel = formatMoney(diff, config.currency);

  if (config.daily) {
    return {
      lead: "Use it to compare a nightly room or short-stay quote with monthly housing before cleaning fees, platform fees, taxes, or minimum-stay terms.",
      budgetTitle: "Short-stay quote vs monthly rent",
      budgetBody: `${amountLabel} becomes ${monthlyLabel} per average calendar month and ${annualLabel} per year before fees. That turns a nightly quote into a number you can compare with a lease, sublet, or temporary housing budget.`,
      sections: [
        {
          title: "How this nightly answer is calculated",
          body: "The nightly amount is treated as daily rent, multiplied by 365, then divided by 12 calendar months.",
          bullets: [
            `${formatMoney(weekly, config.currency)} is the 7-night equivalent before fees.`,
            `${monthlyLabel} is the average calendar-month comparison number.`,
            `${annualLabel} is the annualized amount before taxes, cleaning fees, deposits, or platform charges.`,
            "Use the result as a rent comparison, then confirm the booking or lease terms before relying on it.",
          ],
        },
        {
          title: "When the nightly comparison helps",
          body: "Use it when a room, short-stay, or temporary accommodation quote looks affordable by the night but needs to be checked against a monthly rent budget.",
        },
        {
          title: "What this result does not include",
          body: "Cleaning fees, deposits, minimum stays, taxes, utilities, parking, and platform fees are not included unless you add them separately.",
        },
        {
          title: "How to compare with a lease",
          body: "A nightly quote can be useful for a gap between leases, but it does not always behave like base rent. Check whether the price covers one person, one room, or the whole property before comparing it with a normal monthly lease.",
        },
        {
          title: "Before relying on the monthly equivalent",
          body: "Confirm how many nights are actually available, whether the quote can be extended, and which charges are unavoidable. The rent math is only a comparison point.",
        },
      ],
      examples: [
        {
          title: "Temporary stay check",
          body: `A ${amountLabel} room is ${monthlyLabel} on an average-month basis before fees, so a one-month stay can cost more than the headline night price suggests.`,
        },
        {
          title: "Lease comparison",
          body: `Compare ${monthlyLabel} with the monthly rent on a sublet or lease only after adding taxes, cleaning, and any required deposit.`,
        },
      ],
    };
  }

  const formulaSection: ContentSection = {
    title: "How this exact answer is calculated",
    body: `${formatMoney(weekly, config.currency)} per week is converted with weekly x 365 / 7 / 12. That gives ${monthlyLabel} per average calendar month and ${annualLabel} per year.`,
    bullets: [
      `${fourWeekLabel} is the 28-day amount, not the average calendar-month amount.`,
      `${diffLabel} is the monthly gap created by using 4 weeks instead of a true month.`,
      `${annualLabel} is the annual rent before bills, deposits, or fees.`,
      "Use the calendar-month number for monthly budgets and the original weekly number for checking the lease payment wording.",
    ],
  };

  if (config.currency === "GBP") {
    return {
      lead: "Use it for UK-style PW listings where the PCM comparison matters more than multiplying the weekly rent by 4.",
      budgetTitle: "PW listing converted to PCM",
      budgetBody: `${amountLabel} is ${monthlyLabel} PCM on a 365-day basis, not ${fourWeekLabel}. The ${diffLabel} monthly gap is the part often missed when a weekly UK listing is compared with a monthly budget.`,
      sections: [
        formulaSection,
        {
          title: "UK room or student listing check",
          body: "This amount is useful when a room, student let, or shared-house listing is quoted PW but your salary, bills, or comparison listing is monthly.",
        },
        {
          title: "What this result does not include",
          body: "Bills, council tax, internet, service charges, deposits, and rent-in-advance wording are included only when the listing or lease says so.",
        },
        {
          title: "PW, 4-weekly, and PCM wording",
          body: "PW is weekly rent. PCM is per calendar month. A 4-week amount covers 28 days, so it is useful only when the payment cycle is actually every 4 weeks.",
        },
        {
          title: "What to check in the listing",
          body: "Check whether the price is for one room or the whole property, whether bills are included, when rent is due, and whether any deposit or advance rent is required before move-in.",
        },
      ],
      examples: [
        {
          title: "Room listing comparison",
          body: `A ${amountLabel} room is ${monthlyLabel} PCM before bills. That is the number to compare with a monthly room budget or a PCM listing nearby.`,
        },
        {
          title: "4-week shortcut check",
          body: `${fourWeekLabel} covers only 28 days. If your budget is monthly, the missing ${diffLabel} can matter once council tax, utilities, or transport are added.`,
        },
      ],
    };
  }

  if (config.currency === "EUR") {
    return {
      lead: "Use it when a euro weekly listing needs to be checked against a monthly budget, annual rent total, and lease payment wording.",
      budgetTitle: "Euro weekly rent converted to monthly",
      budgetBody: `${amountLabel} becomes ${monthlyLabel} per average calendar month and ${annualLabel} per year. The 4-week amount is ${fourWeekLabel}, so using weekly x 4 would miss ${diffLabel} each month on this comparison.`,
      sections: [
        formulaSection,
        {
          title: "When this euro amount helps",
          body: "Use it when a weekly quote needs to be compared with monthly income, a monthly rent cap, or another listing that uses a monthly price.",
        },
        {
          title: "What this result does not include",
          body: "The conversion does not decide whether utilities, building charges, deposits, agency fees, furnishings, parking, or local taxes are included.",
        },
        {
          title: "Why annualizing is cleaner",
          body: "Annualizing the weekly amount first keeps the comparison consistent across months of different lengths. That is safer than treating every month as exactly 4 weeks.",
        },
        {
          title: "What to check next",
          body: "Confirm the payment period in the listing, the first due date, the deposit or advance rent, and whether the weekly amount applies to a room or the whole property.",
        },
      ],
      examples: [
        {
          title: "Monthly rent cap",
          body: `If a monthly cap is close to ${monthlyLabel}, the ${fourWeekLabel} shortcut would understate the listing by ${diffLabel}.`,
        },
        {
          title: "Annual housing plan",
          body: `${annualLabel} is the annual rent before other charges, which is often the cleaner number for comparing options over a full lease year.`,
        },
      ],
    };
  }

  if (config.amount <= 180) {
    return {
      lead: `The monthly gap from multiplying by 4 is ${diffLabel}, which matters for room, student, or shared-housing budgets.`,
      budgetTitle: "Room listing monthly check",
      budgetBody: `${amountLabel} is ${monthlyLabel} per average calendar month, not ${fourWeekLabel}. That keeps a low weekly room price from being mistaken for a lower monthly commitment.`,
      sections: [
        formulaSection,
        {
          title: "Room or shared-housing use case",
          body: "Lower weekly amounts often show up on room, student, or shared accommodation searches. The monthly conversion helps compare the room with monthly bills and other shared-house costs.",
        },
        {
          title: "What this result does not include",
          body: "A low rent figure can still change once utilities, shared supplies, internet, parking, deposits, or move-in charges are added.",
        },
        {
          title: "Why the monthly gap matters at lower rents",
          body: `${diffLabel} can be meaningful when the listing is chosen because every dollar of monthly room cost matters. It is better to budget the true monthly equivalent before applying.`,
        },
        {
          title: "Next checks for a budget listing",
          body: "Confirm whether the amount is for one room or the whole unit, whether bills are included, when rent is due, and whether the lease uses weekly, 4-weekly, or monthly payment wording.",
        },
      ],
      examples: [
        {
          title: "Student room budget",
          body: `If a room budget is around ${monthlyLabel}, the ${fourWeekLabel} shortcut leaves out ${diffLabel} before utilities or transport.`,
        },
        {
          title: "Shared-house comparison",
          body: `Compare ${amountLabel} with monthly room listings by using ${monthlyLabel}, then add any shared bills that are not included.`,
        },
      ],
    };
  }

  if (config.amount <= 250) {
    return {
      lead: `Use it for budget listings where the ${diffLabel} gap between 4 weeks and a calendar month can change the monthly rent cap.`,
      budgetTitle: "Budget listing converted to monthly",
      budgetBody: `${amountLabel} converts to ${monthlyLabel} per average calendar month and ${annualLabel} per year. The 4-week shortcut gives ${fourWeekLabel}, so it is too low for a monthly budget.`,
      sections: [
        formulaSection,
        {
          title: "Budget listing use case",
          body: "This amount can fit room searches, smaller units, or lower-cost listings where renters often compare several weekly prices quickly.",
        },
        {
          title: "What this result does not include",
          body: "Add utilities, renter-paid services, parking, pet rent, deposits, application fees, and any rent in advance before deciding the listing fits.",
        },
        {
          title: "Why the 4-week shortcut can mislead",
          body: "Four weeks is 28 days, while an average calendar month is about 30.42 days. The weekly price needs the extra days included before it matches monthly income and bills.",
        },
        {
          title: "What to check next",
          body: "Check the lease payment wording, first due date, deposit or bond, and whether the listing is quoted weekly, every 4 weeks, monthly, PCM, or annually.",
        },
      ],
      examples: [
        {
          title: "Monthly cap check",
          body: `A renter comparing listings near ${monthlyLabel} should use the true monthly number rather than the ${fourWeekLabel} 28-day amount.`,
        },
        {
          title: "Annual cost check",
          body: `${annualLabel} is the rent-only annual total, which makes it easier to compare against savings plans or salary-based rent targets.`,
        },
      ],
    };
  }

  if (config.amount <= 370) {
    return {
      lead: "Use this for mid-range weekly listings where the monthly equivalent is the number most budgets and bills are built around.",
      budgetTitle: "Mid-range weekly listing check",
      budgetBody: `${amountLabel} is ${monthlyLabel} per average calendar month. Using ${fourWeekLabel} would understate the rent by ${diffLabel} before bills or fees.`,
      sections: [
        formulaSection,
        {
          title: "Apartment comparison use case",
          body: "This range is useful when comparing weekly listings with monthly apartment listings, monthly pay, or a rent cap set from income.",
        },
        {
          title: "What this result does not include",
          body: "If two listings are close, utilities, commute costs, parking, deposits, pet charges, internet, and move-in timing can matter more than a small rent difference.",
        },
        {
          title: "Why calendar-month rent is the cleaner comparison",
          body: "Monthly bills, salary planning, and many leases use calendar months. Annualizing the weekly amount first keeps the comparison from treating a month as exactly 28 days.",
        },
        {
          title: "What to verify before signing",
          body: "Confirm the payment frequency, due date, included services, deposit or bond, and whether the quoted rent applies to the whole property or a room.",
        },
      ],
      examples: [
        {
          title: "Listing shortlist",
          body: `When two listings look close, compare ${monthlyLabel} with the other monthly price and then add utilities and commute costs.`,
        },
        {
          title: "Income check",
          body: `${annualLabel} is the rent-only yearly total, useful for comparing the listing with a salary-based affordability target.`,
        },
      ],
    };
  }

  if (config.amount <= 500) {
    return {
      lead: "Use this for weekly apartment listings where the 4-week shortcut can make the rent look materially lower than the monthly budget impact.",
      budgetTitle: "Apartment monthly budget check",
      budgetBody: `${amountLabel} is ${monthlyLabel} per average calendar month, while 4 weeks is ${fourWeekLabel}. The ${diffLabel} difference is enough to affect a monthly rent cap or paycheck plan.`,
      sections: [
        formulaSection,
        {
          title: "Weekly apartment listing use case",
          body: "At this level, the weekly amount is often compared with full monthly rent, paycheck budgeting, and affordability rules rather than only room-level costs.",
        },
        {
          title: "What this result does not include",
          body: "Utilities, parking, renter insurance, pet rent, internet, service charges, deposits, and moving costs can change whether the listing still fits.",
        },
        {
          title: "Why 4 weeks is not enough",
          body: "A 28-day figure can look tidy on paper, but a 12-month lease covers the whole year. The monthly equivalent is annual rent divided by 12.",
        },
        {
          title: "What to check after the conversion",
          body: "Check whether rent is due weekly, every 4 weeks, or monthly; whether the first payment is prorated; and whether the listing requires a deposit, bond, or rent in advance.",
        },
      ],
      examples: [
        {
          title: "Monthly bill planning",
          body: `If monthly bills reset around ${monthlyLabel}, using ${fourWeekLabel} would leave ${diffLabel} unplanned before utilities.`,
        },
        {
          title: "Annual lease view",
          body: `The rent-only annual total is ${annualLabel}, which is the better number for comparing a full lease year with moving costs or salary changes.`,
        },
      ],
    };
  }

  if (config.amount <= 650) {
    return {
      lead: `At this level, the annual total of ${annualLabel} and the ${diffLabel} monthly gap are worth checking before treating the weekly price as affordable.`,
      budgetTitle: "Higher-cost weekly listing check",
      budgetBody: `${amountLabel} converts to ${monthlyLabel} per average calendar month and ${annualLabel} per year. The 4-week amount is ${fourWeekLabel}, which is not enough for monthly planning.`,
      sections: [
        formulaSection,
        {
          title: "Higher-cost market use case",
          body: "Use this when the listing is in a higher-cost area, covers a larger property, or sits near the top of a rent budget. The monthly and annual totals matter more than the weekly headline.",
        },
        {
          title: "What this result does not include",
          body: "A higher base rent leaves less room for utilities, parking, transport, insurance, deposits, pet rent, or move-in cash unless those costs are already planned.",
        },
        {
          title: "Why the annual number matters",
          body: `${annualLabel} shows the full rent-only commitment before lease extras. It is useful for comparing against salary, savings, or moving-cost tradeoffs.`,
        },
        {
          title: "What to check before enquiring",
          body: "Confirm whether the weekly price is negotiable, when payments are due, what is included, and whether the first month includes prorated rent, bond, deposit, or rent in advance.",
        },
      ],
      examples: [
        {
          title: "Affordability screen",
          body: `If ${monthlyLabel} is near the top of the rent range, run the affordability or take-home-pay calculator before applying.`,
        },
        {
          title: "4-week gap check",
          body: `Budgeting only ${fourWeekLabel} would miss ${diffLabel} in an average month before any separate charges.`,
        },
      ],
    };
  }

  return {
    lead: `The annual total is ${annualLabel}, so this page is most useful for checking a larger weekly rental against income, deposits, and payment timing.`,
    budgetTitle: "Large weekly rent converted to monthly",
    budgetBody: `${amountLabel} is ${monthlyLabel} per average calendar month and ${annualLabel} per year. The 4-week amount is ${fourWeekLabel}, which understates the monthly comparison by ${diffLabel}.`,
    sections: [
      formulaSection,
      {
        title: "Large rental or high-cost-market use case",
        body: "Use this when a larger property or high-cost-market listing is quoted weekly but the decision depends on monthly cash flow and annual housing cost.",
      },
      {
        title: "What this result does not include",
        body: "Higher weekly rent can make deposits, rent in advance, parking, utilities, insurance, pet rent, and moving costs more important to the signing decision.",
      },
      {
        title: "Why the monthly equivalent matters",
        body: "A larger weekly rent can look manageable until the full calendar-month and annual totals are visible. The monthly equivalent is the number to compare with paycheck planning.",
      },
      {
        title: "What to check next",
        body: "Verify payment frequency, first due date, deposit or bond, included services, and whether the lease quotes weekly, every 4 weeks, monthly, PCM, or annual rent.",
      },
    ],
    examples: [
      {
        title: "Full-year commitment",
        body: `${annualLabel} is the rent-only annual amount before bills. Compare that with income, savings goals, and moving costs before treating the weekly rent as comfortable.`,
      },
      {
        title: "Monthly cash-flow check",
        body: `If ${monthlyLabel} is close to the maximum rent target, the ${diffLabel} gap from the 4-week shortcut is too large to ignore.`,
      },
    ],
  };
}

export function WeeklyAnswerPage({ config }: { config: WeeklyAnswerPageConfig }) {
  const cents = BigInt(Math.round(config.amount * 100));
  const monthly = config.daily ? dailyToMonthlyCents(cents) : weeklyToMonthlyCents(cents);
  const weekly = config.daily ? dailyToWeeklyCents(cents) : cents;
  const annual = config.daily ? cents * 365n : weeklyToAnnualCents(cents);
  const fourWeek = weekly * 4n;
  const diff = monthly - fourWeek;
  const amountLabel = `${formatMoney(cents, config.currency)} ${config.daily ? "per night" : "per week"}`;
  const schemas = makePageSchemas({ ...config, calculator: true, faq: answerFaq(config.daily) });
  const resultCards = config.daily
    ? [
        { label: "Daily amount", value: formatMoney(cents, config.currency) },
        { label: "Weekly equivalent", value: formatMoney(weekly, config.currency) },
        { label: "Annual amount", value: formatMoney(annual, config.currency) },
      ]
    : [
        { label: "Weekly amount", value: formatMoney(cents, config.currency) },
        { label: "Every 4 weeks", value: formatMoney(fourWeek, config.currency) },
        { label: "Annual amount", value: formatMoney(annual, config.currency) },
        { label: "Monthly minus 4 weeks", value: formatMoney(diff, config.currency) },
      ];
  const tableRows = config.daily
    ? [
        ["Formula", "daily x 365 / 12"],
        ["Weekly equivalent", formatMoney(weekly, config.currency)],
        ["Annual equivalent", formatMoney(annual, config.currency)],
      ]
    : [
        ["Formula", "weekly x 365 / 7 / 12"],
        ["Weekly rent", formatMoney(cents, config.currency)],
        ["Every 4 weeks", formatMoney(fourWeek, config.currency)],
        ["Average monthly rent", formatMoney(monthly, config.currency)],
        ["Annual rent", formatMoney(annual, config.currency)],
        ["Budget point", `${formatMoney(diff, config.currency)} is the gap between 4 weeks and a calendar month.`],
      ];
  const copy = exactAnswerCopy(config, cents, weekly, monthly, fourWeek, annual, diff);

  return (
    <Shell schemas={schemas}>
      <ToolCard
        eyebrow={config.eyebrow}
        h1={config.h1}
        lead={`${amountLabel} is ${formatMoney(monthly, config.currency)} per calendar month using the 365-day model. ${copy.lead}`}
        onPrint={() => window.print()}
      >
        <ResultPanel
          label={config.daily ? "Monthly equivalent" : "True monthly equivalent"}
          value={formatMoney(monthly, config.currency)}
          detail={
            config.daily
              ? "Per night is treated as daily rent, then annualized and divided by 12."
              : `${formatMoney(fourWeek, config.currency)} covers only 4 weeks. The calendar-month equivalent is higher because an average month is about 30.42 days.`
          }
          cards={resultCards}
          tableRows={tableRows}
        />
      </ToolCard>
      <DirectAnswer
        title={copy.budgetTitle}
        body={copy.budgetBody}
        formula={config.daily ? "monthly = daily x 365 / 12" : "monthly = weekly x 365 / 7 / 12"}
      />
      <ContentBlocks sections={copy.sections} examples={copy.examples} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={nearbyWeeklyAnswerLinks(config)} />
      <Faq items={answerFaq(config.daily)} />
    </Shell>
  );
}

function answerFaq(daily?: boolean): FaqItem[] {
  return [
    {
      q: daily ? "Is per night the same as daily rent?" : "Why is weekly rent not multiplied by 4?",
      a: daily
        ? "For rent comparison, this page treats a per-night price like a daily price. Your contract can still use different hotel, short-stay, or lease rules."
        : "Multiplying by 4 only covers 28 days. A calendar month averages about 30.42 days, so the true monthly equivalent is based on annual rent divided by 12.",
    },
    {
      q: "Does this include utilities or fees?",
      a: "No. The result only converts the rent amount entered. Add utilities, parking, internet, deposits, and other charges separately.",
    },
  ];
}

export function IncomeToolPage({ config }: { config: IncomeToolConfig }) {
  const [rent, setRent] = useState(config.defaultRent ?? "2000");
  const [income, setIncome] = useState(config.defaultIncome ?? "60000");
  const [expenses, setExpenses] = useState("900");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [hours, setHours] = useState("40");
  const rentParsed = useMemo(() => parseMoneyToCents(rent), [rent]);
  const incomeParsed = useMemo(() => parseMoneyToCents(income), [income]);
  const expensesParsed = useMemo(() => parseMoneyToCents(expenses), [expenses]);
  const hourlyIncome = useMemo(() => {
    if (!incomeParsed.ok) return undefined;
    const h = parsePositiveNumber(hours, 40, 1, 100);
    return divRound(incomeParsed.cents * BigInt(Math.round(h * 100)) * 52n, 100n);
  }, [hours, incomeParsed]);
  const monthlyIncome = useMemo(() => {
    if (config.mode === "hourly") return hourlyIncome ? divRound(hourlyIncome, 12n) : undefined;
    if (!incomeParsed.ok) return undefined;
    if (config.mode === "salary" || config.mode === "rent-rule" || config.mode === "max-rent" || config.mode === "budget") {
      return divRound(incomeParsed.cents, 12n);
    }
    return incomeParsed.cents;
  }, [config.mode, hourlyIncome, incomeParsed]);
  const percent = config.percent ?? 30;
  const multiplier = config.multiplier ?? 3;
  const maxByPercent = monthlyIncome ? divRound(monthlyIncome * BigInt(Math.round(percent * 100)), 10000n) : undefined;
  const maxBy30 = monthlyIncome ? divRound(monthlyIncome * 30n, 100n) : undefined;
  const maxBy40 = monthlyIncome ? divRound(monthlyIncome * 40n, 100n) : undefined;
  const maxBy3x = monthlyIncome ? divRound(monthlyIncome, 3n) : undefined;
  const requiredIncome = rentParsed.ok
    ? divRound(rentParsed.cents * BigInt(Math.round(multiplier * 100)), 100n)
    : undefined;
  const requiredAnnualIncome = requiredIncome !== undefined ? requiredIncome * 12n : undefined;
  const ratio =
    rentParsed.ok && monthlyIncome && monthlyIncome > 0n
      ? Number(divRound(rentParsed.cents * 10000n, monthlyIncome)) / 100
      : 0;
  const remaining =
    monthlyIncome && rentParsed.ok
      ? monthlyIncome - rentParsed.cents - (expensesParsed.ok ? expensesParsed.cents : 0n)
      : undefined;
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });

  const mainValue =
    config.mode === "multiplier"
      ? formatMoney(requiredIncome, currency)
      : config.mode === "ratio"
        ? formatPercent(ratio)
        : formatMoney(maxByPercent ?? maxBy30, currency);

  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          {config.mode === "hourly" ? (
            <>
              <div className="lg:col-span-5"><TextInput label="Hourly pay" value={income} onChange={setIncome} /></div>
              <div className="lg:col-span-3"><TextInput label="Hours per week" value={hours} onChange={setHours} inputMode="numeric" /></div>
            </>
          ) : (
            <div className="lg:col-span-5">
              <TextInput label={config.mode === "multiplier" ? "Monthly rent" : "Income"} value={config.mode === "multiplier" ? rent : income} onChange={config.mode === "multiplier" ? setRent : setIncome} />
            </div>
          )}
          {config.mode !== "multiplier" && config.mode !== "rent-rule" ? (
            <div className="lg:col-span-4"><TextInput label="Target monthly rent" value={rent} onChange={setRent} /></div>
          ) : null}
          {config.mode === "budget" || config.mode === "max-rent" ? (
            <div className="lg:col-span-3"><TextInput label="Monthly expenses" value={expenses} onChange={setExpenses} /></div>
          ) : null}
          <div className="lg:col-span-3"><CurrencySelect value={currency} onChange={setCurrency} /></div>
        </div>
        <ResultPanel
          label={config.mode === "ratio" ? "Rent-to-income ratio" : config.mode === "multiplier" ? "Required monthly income" : "Estimated rent target"}
          value={mainValue}
          detail={
            config.mode === "multiplier"
              ? `Under a ${multiplier}x rule, ${formatMoney(rentParsed.ok ? rentParsed.cents : undefined, currency)} rent needs about ${formatMoney(requiredIncome, currency)} gross income per month.`
              : "Use this as a planning estimate. Debt, utilities, savings, deposits, and local rent prices can move the comfortable number lower."
          }
          cards={
            config.mode === "multiplier"
              ? [
                  { label: "Monthly rent", value: formatMoney(rentParsed.ok ? rentParsed.cents : undefined, currency) },
                  { label: "Required monthly income", value: formatMoney(requiredIncome, currency) },
                  { label: "Required annual income", value: formatMoney(requiredAnnualIncome, currency) },
                  { label: "Rent share of gross income", value: formatPercent(100 / multiplier) },
                ]
              : [
                  { label: "Monthly income", value: formatMoney(monthlyIncome, currency) },
                  { label: "30% rent target", value: formatMoney(maxBy30, currency) },
                  { label: "40% rent target", value: formatMoney(maxBy40, currency) },
                  { label: "3x qualification max", value: formatMoney(maxBy3x, currency) },
                  { label: "Rent ratio", value: formatPercent(ratio) },
                  { label: "Remaining after rent and expenses", value: formatMoney(remaining, currency) },
                ]
          }
          tableRows={[
            ["Band", "Interpretation"],
            ["Under 30%", "Generally more comfortable"],
            ["30% to 40%", "Common, but tighter"],
            ["40% to 50%", "Rent-heavy"],
            ["Over 50%", "High pressure budget"],
          ]}
        />
      </ToolCard>
      <ContentBlocks sections={incomeSections(config)} examples={config.examples} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

type SalaryAnswerCopy = {
  lead: string;
  resultDetail: string;
  sections: ContentSection[];
  examples: ExampleItem[];
};

function salaryAnswerCopy(
  salary: number,
  monthlyIncome: bigint,
  rent30: bigint,
  rent40: bigint,
  rent3x: bigint,
): SalaryAnswerCopy {
  const salaryLabel = `$${salary.toLocaleString()}`;
  const incomeLabel = formatMoney(monthlyIncome, "USD");
  const rent30Label = formatMoney(rent30, "USD");
  const rent40Label = formatMoney(rent40, "USD");
  const rent3xLabel = formatMoney(rent3x, "USD");

  const profile =
    salary <= 50000
      ? {
          lead: "The 30% target is the cleanest starting point here because taxes, utilities, transportation, and debt can narrow the real monthly margin quickly.",
          readTitle: "How to read a $50,000 salary result",
          readBody: `At ${salaryLabel}, ${rent30Label} is a rent-first benchmark, not a full budget. If take-home pay is tight, use the take-home-pay calculator before treating ${rent3xLabel} as comfortable.`,
          tightTitle: "When this salary may feel tight",
          tightBody: "This salary can feel tighter when the rent does not include utilities, when commute costs are high, or when deposits and first-month payments are due at the same time.",
          exampleTitle: "Budget-first search",
          exampleBody: `A renter using ${rent30Label} as a cap should still add utilities, insurance, transport, and move-in cash before applying.`,
        }
      : salary <= 60000
        ? {
            lead: "This salary is useful for comparing a conservative 30% rent target with the higher 40% or 2.5x screening-style number.",
            readTitle: "How to read a $60,000 salary result",
            readBody: `At ${salaryLabel}, ${rent30Label} is the lower planning target and ${rent40Label} is the stretchier 40% or 2.5x-style amount. The right number depends on take-home pay and fixed costs.`,
            tightTitle: "What to check before signing",
            tightBody: "Check whether the listing adds utilities, parking, pet rent, renters insurance, or a large deposit. Those costs can turn an acceptable gross-income target into a tight monthly cash-flow decision.",
            exampleTitle: "Listing shortlist",
            exampleBody: `If two listings are near ${rent30Label} and ${rent40Label}, compare included utilities and commute costs before choosing the higher rent.`,
          }
        : salary <= 65000
          ? {
              lead: "This in-between salary is useful when a listing sits near a common rent cap and you want to see both comfort and screening numbers clearly.",
              readTitle: "How to read a $65,000 salary result",
              readBody: `${salaryLabel} produces ${incomeLabel} in gross monthly income. A rent near ${rent30Label} leaves more planning room than a rent near ${rent40Label}, even if both appear in common affordability discussions.`,
              tightTitle: "When the middle of the range matters",
              tightBody: "If income is steady but expenses vary, the space between the 30% and 40% numbers is where utilities, loan payments, transport, and savings goals usually decide the practical answer.",
              exampleTitle: "Between two rent caps",
              exampleBody: `A listing around ${rent30Label} is easier to defend in a budget than one near ${rent40Label} unless take-home pay and other costs are already known.`,
            }
          : salary <= 70000
            ? {
                lead: "Use this salary page to separate a comfortable rent target from a qualification-style number before a listing looks affordable only on gross income.",
                readTitle: "How to read a $70,000 salary result",
                readBody: `At ${salaryLabel}, the 30% target is ${rent30Label}. The 3x screening number is ${rent3xLabel}, while the 40% or 2.5x comparison is ${rent40Label}. Treat the higher end as a stress test, not a default.`,
                tightTitle: "What can make the higher number risky",
                tightBody: "The higher target can feel risky when car payments, student loans, childcare, medical costs, or variable income are part of the budget.",
                exampleTitle: "Screening vs comfort",
                exampleBody: `A landlord-style cap near ${rent3xLabel} can still be less comfortable than a budget target near ${rent30Label}.`,
              }
            : salary <= 80000
              ? {
                  lead: "This page helps compare a stronger gross salary with the rent level that still leaves room for savings, moving costs, and bills.",
                  readTitle: "How to read an $80,000 salary result",
                  readBody: `${salaryLabel} gives ${incomeLabel} in gross monthly income. The 30% rent target is ${rent30Label}, while ${rent40Label} shows the upper 40% or 2.5x comparison before take-home pay is considered.`,
                  tightTitle: "What to check at this salary",
                  tightBody: "A higher salary can still become rent-heavy in expensive markets or when deposits, parking, utilities, insurance, and commuting all stack on top of base rent.",
                  exampleTitle: "Higher-cost listing check",
                  exampleBody: `If a listing is close to ${rent40Label}, compare it with actual take-home pay and move-in costs rather than relying on gross salary alone.`,
                }
              : {
                  lead: "Higher income can still become rent-heavy in expensive markets, so compare the comfort target with the qualification-style cap and the annual rent commitment.",
                  readTitle: "How to read a $100,000 salary result",
                  readBody: `At ${salaryLabel}, ${rent30Label} is the 30% monthly target and ${rent40Label} is the 40% or 2.5x-style comparison. The higher number may qualify on paper, but it still deserves a take-home-pay check in high-cost areas.`,
                  tightTitle: "When a high salary can still feel stretched",
                  tightBody: "Large deposits, high local taxes, childcare, debt, transport, insurance, and higher-cost-market utilities can make a gross-income benchmark look cleaner than the real budget.",
                  exampleTitle: "High-cost-market check",
                  exampleBody: `A listing near ${rent40Label} should be checked against take-home pay, savings goals, and annual rent before signing.`,
                };

  return {
    lead: profile.lead,
    resultDetail: "The 30% figure is a conservative starting point. The 3x rule is a qualification-style cap, while the 40% figure also mirrors a 2.5x rent screen.",
    sections: [
      {
        title: "How this salary answer is calculated",
        body: `${salaryLabel} is divided by 12 to estimate ${incomeLabel} in gross monthly income. The page then compares 30%, 40%, 2.5x, and 3x-style rent checks without changing the underlying salary assumption.`,
        bullets: [
          `${rent30Label} is the 30% target before utilities and fees.`,
          `${rent40Label} is the 40% target and the same rent level implied by a 2.5x gross-income screen.`,
          `${rent3xLabel} is the rent amount implied by a simple 3x gross-income screen.`,
        ],
      },
      {
        title: profile.readTitle,
        body: profile.readBody,
      },
      {
        title: "Gross salary vs take-home pay",
        body: "These figures start from gross salary because many screening rules do. A personal rent budget should also check take-home pay after tax withholding, payroll deductions, insurance, retirement contributions, and recurring debt.",
      },
      {
        title: profile.tightTitle,
        body: profile.tightBody,
      },
      {
        title: "Before using the higher target",
        body: "The higher rent number can be useful for screening or stress testing, but it should be checked against actual paycheck deposits, deposits due at signing, and recurring bills that do not appear in gross salary.",
      },
      {
        title: "What this result does not include",
        body: "The result does not include tax, debt, savings goals, childcare, transportation, insurance, utilities, deposits, application fees, household size, local rent levels, or whether income is stable every month.",
      },
      {
        title: "Next check after this page",
        body: "If the rent target is close to the edge, run the take-home-pay, rent-to-income-ratio, or income-required calculator with the actual rent number. That gives a clearer view than salary alone.",
      },
    ],
    examples: [
      {
        title: profile.exampleTitle,
        body: profile.exampleBody,
      },
      {
        title: "Annual rent view",
        body: `At the 30% target, annual rent is ${formatMoney(rent30 * 12n, "USD")}. At the 40% target, annual rent is ${formatMoney(rent40 * 12n, "USD")} before utilities or fees.`,
      },
    ],
  };
}

export function SalaryAnswerPage({ config }: { config: SalaryAnswerConfig }) {
  const salaryCents = BigInt(config.salary * 100);
  const monthlyIncome = divRound(salaryCents, 12n);
  const rent30 = divRound(monthlyIncome * 30n, 100n);
  const rent40 = divRound(monthlyIncome * 40n, 100n);
  const rent3x = divRound(monthlyIncome, 3n);
  const copy = salaryAnswerCopy(config.salary, monthlyIncome, rent30, rent40, rent3x);
  const schemas = makePageSchemas({ ...config, calculator: false, faq: salaryFaq });
  return (
    <Shell schemas={schemas}>
      <ToolCard
        eyebrow={config.eyebrow}
        h1={config.h1}
        lead={`On a $${config.salary.toLocaleString()} salary, common rent estimates range from ${formatMoney(rent30, "USD")} at 30% of gross income to ${formatMoney(rent40, "USD")} at 40%. ${copy.lead}`}
      >
        <ResultPanel
          label="Estimated rent range"
          value={formatMoney(rent30, "USD")}
          detail={copy.resultDetail}
          cards={[
            { label: "Gross monthly income", value: formatMoney(monthlyIncome, "USD") },
            { label: "30% rent target", value: formatMoney(rent30, "USD") },
            { label: "40% / 2.5x target", value: formatMoney(rent40, "USD") },
            { label: "3x qualification max", value: formatMoney(rent3x, "USD") },
          ]}
          tableRows={[
            ["Method", "Monthly rent"],
            ["30% of gross income", formatMoney(rent30, "USD")],
            ["40% of gross income / 2.5x screen", formatMoney(rent40, "USD")],
            ["3x rent screening", formatMoney(rent3x, "USD")],
            ["Annual rent at 30%", formatMoney(rent30 * 12n, "USD")],
          ]}
        />
      </ToolCard>
      <ContentBlocks sections={copy.sections} examples={copy.examples} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={salaryFaq} />
    </Shell>
  );
}

const salaryFaq: FaqItem[] = [
  {
    q: "Should I use gross income or take-home pay?",
    a: "Many landlord rules use gross income, but a personal budget should also consider take-home pay, debts, utilities, savings, and other monthly costs.",
  },
  {
    q: "Is 30% rent always affordable?",
    a: "No. It is a common guideline, not a guarantee. A renter with high debt, childcare, car costs, or expensive utilities may need a lower rent target.",
  },
];

export function IncreaseToolPage({ config }: { config: IncreaseToolConfig }) {
  const [rent, setRent] = useState("2000");
  const [rate, setRate] = useState(config.defaultRate ?? "5");
  const [fixed, setFixed] = useState(config.defaultFixed ?? "100");
  const [newRentInput, setNewRentInput] = useState("2100");
  const [years, setYears] = useState("5");
  const [currency, setCurrency] = useState<Currency>("USD");
  const rentParsed = useMemo(() => parseMoneyToCents(rent), [rent]);
  const rateNum = parsePositiveNumber(rate, 5, 0, 100);
  const fixedParsed = parseMoneyToCents(fixed);
  const newRentParsed = parseMoneyToCents(newRentInput);
  const yearCount = Math.round(parsePositiveNumber(years, 5, 1, 50));
  const newRent = useMemo(() => {
    if (!rentParsed.ok) return undefined;
    if (config.mode === "simple" || config.mode === "regional" || config.mode === "cpi" || config.mode === "formula") {
      return divRound(rentParsed.cents * BigInt(Math.round((100 + rateNum) * 100)), 10000n);
    }
    if (config.mode === "compound" || config.mode === "escalation") {
      let current = rentParsed.cents;
      for (let i = 0; i < yearCount; i += 1) {
        current = divRound(current * BigInt(Math.round((100 + rateNum) * 100)), 10000n);
      }
      return current;
    }
    return fixedParsed.ok ? rentParsed.cents + fixedParsed.cents : undefined;
  }, [config.mode, fixedParsed, rateNum, rentParsed, yearCount]);
  const increase = rentParsed.ok && newRent !== undefined ? newRent - rentParsed.cents : undefined;
  const fixedNewRent =
    rentParsed.ok && fixedParsed.ok ? rentParsed.cents + fixedParsed.cents : undefined;
  const reverseIncrease =
    rentParsed.ok && newRentParsed.ok ? newRentParsed.cents - rentParsed.cents : undefined;
  const reversePercent =
    rentParsed.ok && newRentParsed.ok && rentParsed.cents > 0n
      ? Number(divRound(reverseIncrease! * 10000n, rentParsed.cents)) / 100
      : undefined;
  const rows = useMemo(() => {
    if (!rentParsed.ok) return [];
    if (config.mode === "formula") {
      return [
        ["Formula", "Result"],
        ["new rent = current rent x (1 + percentage / 100)", formatMoney(newRent, currency)],
        ["new rent = current rent + fixed increase", formatMoney(fixedNewRent, currency)],
        ["percentage increase = (new rent - old rent) / old rent x 100", reversePercent === undefined ? "-" : formatPercent(reversePercent)],
      ];
    }
    let current = rentParsed.cents;
    const out: string[][] = [["Year", "Monthly rent", "Annual rent"]];
    for (let i = 0; i <= yearCount; i += 1) {
      out.push([String(i), formatMoney(current, currency), formatMoney(current * 12n, currency)]);
      current = divRound(current * BigInt(Math.round((100 + rateNum) * 100)), 10000n);
    }
    return out;
  }, [config.mode, currency, fixedNewRent, newRent, rateNum, rentParsed, reversePercent, yearCount]);
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });
  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4"><TextInput label="Current monthly rent" value={rent} onChange={setRent} /></div>
          <div className="lg:col-span-3"><TextInput label={config.mode === "cpi" ? "CPI or cap percentage" : "Increase percentage"} value={rate} onChange={setRate} /></div>
          {config.mode === "formula" ? (
            <>
              <div className="lg:col-span-2"><TextInput label="Fixed increase" value={fixed} onChange={setFixed} /></div>
              <div className="lg:col-span-3"><TextInput label="New monthly rent" value={newRentInput} onChange={setNewRentInput} /></div>
            </>
          ) : (
            <div className="lg:col-span-2"><TextInput label="Years" value={years} onChange={setYears} inputMode="numeric" /></div>
          )}
          <div className={config.mode === "formula" ? "lg:col-span-12" : "lg:col-span-3"}><CurrencySelect value={currency} onChange={setCurrency} /></div>
        </div>
        <ResultPanel
          label={config.mode === "formula" ? "New rent from percentage" : "Estimated new rent"}
          value={formatMoney(newRent, currency)}
          detail={
            config.mode === "formula"
              ? "Use the percentage, fixed increase, and old-to-new formulas side by side to check the rent math."
              : config.regionNote ?? "This estimates the math impact. Lease terms and local rules can change whether an increase is allowed."
          }
          cards={[
            ...(config.mode === "formula"
              ? [
                  { label: "Fixed increase result", value: formatMoney(fixedNewRent, currency) },
                  { label: "Reverse percentage", value: reversePercent === undefined ? "-" : formatPercent(reversePercent) },
                  { label: "Reverse monthly change", value: formatMoney(reverseIncrease, currency) },
                ]
              : []),
            { label: "Monthly increase", value: formatMoney(increase, currency) },
            { label: "Annual rent before", value: rentParsed.ok ? formatMoney(rentParsed.cents * 12n, currency) : "-" },
            { label: "Annual rent after", value: newRent ? formatMoney(newRent * 12n, currency) : "-" },
          ]}
          tableRows={config.mode === "compound" || config.mode === "escalation" || config.mode === "formula" ? rows : undefined}
        />
      </ToolCard>
      <ContentBlocks sections={increaseSections(config)} examples={config.examples} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

export function SplitToolPage({ config }: { config: SplitToolConfig }) {
  const [rent, setRent] = useState("2400");
  const [utilities, setUtilities] = useState("300");
  const [a, setA] = useState("4000");
  const [b, setB] = useState("6000");
  const [shareA, setShareA] = useState("50");
  const [currency, setCurrency] = useState<Currency>("USD");
  const rentParsed = parseMoneyToCents(rent);
  const utilitiesParsed = parseMoneyToCents(utilities);
  const aParsed = parseMoneyToCents(a);
  const bParsed = parseMoneyToCents(b);
  const total = rentParsed.ok && utilitiesParsed.ok ? rentParsed.cents + utilitiesParsed.cents : undefined;
  const rows = useMemo(() => {
    if (total === undefined) return [];
    if (config.mode === "income" && aParsed.ok && bParsed.ok) {
      const combined = aParsed.cents + bParsed.cents;
      const aShare = combined > 0n ? divRound(total * aParsed.cents, combined) : 0n;
      const bShare = total - aShare;
      return [["Person", "Basis", "Share"], ["Roommate A", formatMoney(aParsed.cents, currency), formatMoney(aShare, currency)], ["Roommate B", formatMoney(bParsed.cents, currency), formatMoney(bShare, currency)]];
    }
    if (config.mode === "percentage") {
      const pct = parsePositiveNumber(shareA, 50, 0, 100);
      const aShare = divRound(total * BigInt(Math.round(pct * 100)), 10000n);
      return [["Person", "Percent", "Share"], ["Roommate A", `${pct.toFixed(2)}%`, formatMoney(aShare, currency)], ["Roommate B", `${(100 - pct).toFixed(2)}%`, formatMoney(total - aShare, currency)]];
    }
    return [["Person", "Method", "Share"], ["Roommate A", "Equal", formatMoney(divRound(total, 2n), currency)], ["Roommate B", "Equal", formatMoney(total - divRound(total, 2n), currency)]];
  }, [aParsed, bParsed, config.mode, currency, shareA, total]);
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });
  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4"><TextInput label="Total monthly rent" value={rent} onChange={setRent} /></div>
          <div className="lg:col-span-4"><TextInput label="Utilities or fees" value={utilities} onChange={setUtilities} /></div>
          <div className="lg:col-span-4"><CurrencySelect value={currency} onChange={setCurrency} /></div>
          {config.mode === "income" ? (
            <>
              <div className="lg:col-span-6"><TextInput label="Roommate A monthly income" value={a} onChange={setA} /></div>
              <div className="lg:col-span-6"><TextInput label="Roommate B monthly income" value={b} onChange={setB} /></div>
            </>
          ) : null}
          {config.mode === "percentage" ? (
            <div className="lg:col-span-6"><TextInput label="Roommate A percent" value={shareA} onChange={setShareA} /></div>
          ) : null}
        </div>
        <ResultPanel
          label="Split result"
          value={total !== undefined ? formatMoney(total, currency) : "-"}
          detail="The table shows each roommate share. Add other costs if you want rent plus utilities instead of rent alone."
          tableRows={rows}
        />
      </ToolCard>
      <ContentBlocks sections={splitSections(config)} examples={splitExamples(config)} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

export function MoveInCostPage({ config }: { config: MoveInCostConfig }) {
  const [weeklyRent, setWeeklyRent] = useState("500");
  const [bondWeeks, setBondWeeks] = useState("4");
  const [advanceWeeks, setAdvanceWeeks] = useState("2");
  const [movingCosts, setMovingCosts] = useState("0");
  const [currency, setCurrency] = useState<Currency>(config.defaultCurrency);
  const weeklyParsed = useMemo(() => parseMoneyToCents(weeklyRent), [weeklyRent]);
  const movingParsed = useMemo(() => parseMoneyToCents(movingCosts), [movingCosts]);
  const bondWeekCount = parsePositiveNumber(bondWeeks, 4, 0, 12);
  const advanceWeekCount = parsePositiveNumber(advanceWeeks, 2, 0, 12);
  const bond = weeklyParsed.ok
    ? divRound(weeklyParsed.cents * BigInt(Math.round(bondWeekCount * 100)), 100n)
    : undefined;
  const advance = weeklyParsed.ok
    ? divRound(weeklyParsed.cents * BigInt(Math.round(advanceWeekCount * 100)), 100n)
    : undefined;
  const moving = movingParsed.ok ? movingParsed.cents : 0n;
  const total = bond !== undefined && advance !== undefined ? bond + advance + moving : undefined;
  const advanceRows =
    weeklyParsed.ok
      ? [
          ["Period", "Estimate"],
          ["1 week in advance", formatMoney(weeklyParsed.cents, currency)],
          ["2 weeks in advance", formatMoney(weeklyParsed.cents * 2n, currency)],
          ["4 weeks in advance", formatMoney(weeklyParsed.cents * 4n, currency)],
          ["1 calendar month", formatMoney(weeklyToMonthlyCents(weeklyParsed.cents), currency)],
        ]
      : [];
  const bondRows =
    weeklyParsed.ok
      ? [
          ["Cost", "Amount"],
          [`Bond at ${bondWeekCount.toFixed(1)} weeks`, formatMoney(bond, currency)],
          [`Rent in advance at ${advanceWeekCount.toFixed(1)} weeks`, formatMoney(advance, currency)],
          ["Extra moving costs entered", formatMoney(moving, currency)],
          ["Estimated upfront total", formatMoney(total, currency)],
        ]
      : [];
  const rows = config.mode === "advance" ? advanceRows : bondRows;
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });

  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TextInput label="Weekly rent" value={weeklyRent} onChange={setWeeklyRent} />
          </div>
          {config.mode === "bond-advance" ? (
            <>
              <div className="lg:col-span-2">
                <TextInput label="Bond weeks" value={bondWeeks} onChange={setBondWeeks} inputMode="decimal" />
              </div>
              <div className="lg:col-span-2">
                <TextInput label="Advance weeks" value={advanceWeeks} onChange={setAdvanceWeeks} inputMode="decimal" />
              </div>
              <div className="lg:col-span-2">
                <TextInput label="Other upfront costs" value={movingCosts} onChange={setMovingCosts} />
              </div>
            </>
          ) : null}
          <div className={config.mode === "bond-advance" ? "lg:col-span-2" : "lg:col-span-3"}>
            <CurrencySelect value={currency} onChange={setCurrency} />
          </div>
        </div>
        {!weeklyParsed.ok ? <p className="mt-2 text-sm font-semibold text-rose-700">{weeklyParsed.error}</p> : null}
        <ResultPanel
          label={config.mode === "advance" ? "Rent in advance estimate" : "Estimated upfront total"}
          value={
            config.mode === "advance"
              ? formatMoney(weeklyParsed.ok ? weeklyParsed.cents * 2n : undefined, currency)
              : formatMoney(total, currency)
          }
          detail={
            config.mode === "advance"
              ? "Rent in advance usually pays for future occupancy. It is not the same as a separate fee."
              : "Bond and rent in advance are different move-in costs. Local rules and lease terms can change exact amounts."
          }
          tableRows={rows}
        />
      </ToolCard>
      <ContentBlocks sections={moveInSections(config)} examples={config.examples} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

export function ProrationToolPage({ config }: { config: ProrationToolConfig }) {
  const [rent, setRent] = useState("1500");
  const [period, setPeriod] = useState("monthly");
  const [daysCharged, setDaysCharged] = useState("22");
  const [daysInPeriod, setDaysInPeriod] = useState("31");
  const [currency, setCurrency] = useState<Currency>(config.defaultCurrency);
  const rentParsed = useMemo(() => parseMoneyToCents(rent), [rent]);
  const charged = Math.round(parsePositiveNumber(daysCharged, 22, 1, 366));
  const denominatorDays =
    period === "weekly"
      ? 7
      : period === "fortnightly"
        ? 14
        : Math.round(parsePositiveNumber(daysInPeriod, 31, 1, 366));
  const dailyRate = rentParsed.ok ? divRound(rentParsed.cents, BigInt(denominatorDays)) : undefined;
  const prorated = rentParsed.ok
    ? divRound(rentParsed.cents * BigInt(charged), BigInt(denominatorDays))
    : undefined;
  const rows = [
    ["Input period", period],
    ["Days charged", String(charged)],
    ["Days in period", String(denominatorDays)],
    ["Daily rent", formatMoney(dailyRate, currency)],
    ["Prorated rent", formatMoney(prorated, currency)],
  ];
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });

  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TextInput label="Rent amount" value={rent} onChange={setRent} />
          </div>
          <label className="block lg:col-span-3">
            <span className="mb-2 block text-sm font-semibold text-slate-800">Rent period</span>
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
            </select>
          </label>
          <div className="lg:col-span-2">
            <TextInput label="Days charged" value={daysCharged} onChange={setDaysCharged} inputMode="numeric" />
          </div>
          {period === "monthly" ? (
            <div className="lg:col-span-1">
              <TextInput label="Days" value={daysInPeriod} onChange={setDaysInPeriod} inputMode="numeric" />
            </div>
          ) : null}
          <div className={period === "monthly" ? "lg:col-span-2" : "lg:col-span-3"}>
            <CurrencySelect value={currency} onChange={setCurrency} />
          </div>
        </div>
        {!rentParsed.ok ? <p className="mt-2 text-sm font-semibold text-rose-700">{rentParsed.error}</p> : null}
        <ResultPanel
          label="Prorated rent"
          value={formatMoney(prorated, currency)}
          detail="The daily rate is based on the period and day count entered. Your lease or local rules may require a different method."
          cards={[
            { label: "Daily rent", value: formatMoney(dailyRate, currency) },
            { label: "Days charged", value: String(charged) },
            { label: "Period days", value: String(denominatorDays) },
          ]}
          tableRows={rows}
        />
      </ToolCard>
      <ContentBlocks sections={prorationSections(config)} examples={config.examples} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

function addMonths(date: Date, months: number) {
  const targetMonth = date.getMonth() + months;
  const firstOfTarget = new Date(date.getFullYear(), targetMonth, 1);
  const lastDayOfTarget = new Date(
    firstOfTarget.getFullYear(),
    firstOfTarget.getMonth() + 1,
    0,
  ).getDate();

  return new Date(
    firstOfTarget.getFullYear(),
    firstOfTarget.getMonth(),
    Math.min(date.getDate(), lastDayOfTarget),
  );
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseIsoDate(value: string, fallback: Date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback;
  const date = new Date(`${value}T00:00:00`);
  if (!Number.isFinite(date.getTime())) return fallback;
  return isoDate(date) === value ? date : fallback;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(date);
}

export function DateToolPage({ config }: { config: DateToolConfig }) {
  const today = isoDate(new Date());
  const [start, setStart] = useState(today);
  const [months, setMonths] = useState(config.mode === "twelve-month" ? "12" : "12");
  const [rent, setRent] = useState("2000");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [frequency, setFrequency] = useState("monthly");
  const startDate = parseIsoDate(start, new Date());
  const startIsValid = isoDate(startDate) === start;
  const monthCount = Math.round(parsePositiveNumber(months, 12, 1, 120));
  const endDate = addDays(addMonths(startDate, monthCount), -1);
  const renewalReminder = addDays(endDate, -60);
  const renewalReminderText =
    renewalReminder >= startDate ? formatDate(renewalReminder) : "Check lease terms";
  const rentParsed = parseMoneyToCents(rent);
  const rows = useMemo(() => {
    if (config.mode !== "schedule" || !rentParsed.ok || !startIsValid) return [];
    const interval = frequency === "weekly" ? 7 : frequency === "fortnightly" ? 14 : frequency === "every 4 weeks" ? 28 : 30;
    const count = frequency === "monthly" ? monthCount : Math.min(120, Math.ceil((monthCount * 365) / 12 / interval));
    const out = [["Payment", "Due date", "Amount"]];
    for (let i = 0; i < count; i += 1) {
      const due = frequency === "monthly" ? addMonths(startDate, i) : addDays(startDate, i * interval);
      out.push([String(i + 1), formatDate(due), formatMoney(rentParsed.cents, currency)]);
    }
    return out;
  }, [config.mode, currency, frequency, monthCount, rentParsed, startDate, startIsValid]);
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });
  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4"><TextInput label="Lease start date" value={start} onChange={setStart} inputMode="text" /></div>
          <div className="lg:col-span-3"><TextInput label="Lease length in months" value={months} onChange={setMonths} inputMode="numeric" /></div>
          {config.mode === "schedule" ? (
            <>
              <div className="lg:col-span-3"><TextInput label="Rent amount" value={rent} onChange={setRent} /></div>
              <div className="lg:col-span-2"><CurrencySelect value={currency} onChange={setCurrency} /></div>
              <label className="block lg:col-span-4">
                <span className="mb-2 block text-sm font-semibold text-slate-800">Frequency</span>
                <select value={frequency} onChange={(event) => setFrequency(event.target.value)} className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200">
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly or biweekly</option>
                  <option value="every 4 weeks">Every 4 weeks</option>
                </select>
              </label>
            </>
          ) : null}
        </div>
        {!startIsValid ? (
          <p className="mt-2 text-sm font-semibold text-rose-700">
            Enter a valid date in YYYY-MM-DD format.
          </p>
        ) : null}
        <ResultPanel
          label="Calculated date"
          value={startIsValid ? formatDate(endDate) : "-"}
          detail={
            startIsValid
              ? "This treats the lease end date as the day before the same calendar date after the lease length. Your lease wording controls the actual final day."
              : "Enter a valid start date before using the calculated lease date."
          }
          cards={
            startIsValid
              ? [
                  { label: "Start date", value: formatDate(startDate) },
                  { label: "Lease length", value: monthCount === 1 ? "1 month" : `${monthCount} months` },
                  { label: "Renewal reminder", value: renewalReminderText },
                ]
              : undefined
          }
          tableRows={rows.length ? rows : undefined}
        />
      </ToolCard>
      <ContentBlocks sections={dateSections(config)} examples={dateExamples(config)} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}
