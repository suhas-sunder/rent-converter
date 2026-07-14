import { useId, useMemo, useState } from "react";
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
  SUPPORTED_CURRENCIES,
  weeklyToAnnualCents,
  weeklyToDailyCents,
  weeklyToMonthlyCents,
  type Currency,
} from "~/client/utils/rentMath";
import {
  calculateHourlyIncome,
  calculateRentBudget,
  calculateSalaryComparison,
  parseHoursPerWeek,
  parseIncomeMoney,
} from "~/client/utils/generatedIncome.js";
import {
  useHydrationSafeSavedState,
  validSavedCurrency,
  validSavedMoney,
} from "~/client/utils/savedState.js";
import {
  calculateLeaseEnd,
  formatCalendarDate,
  formatCalendarDateForDisplay,
  generateLeasePaymentSchedule,
  parseCalendarDate,
  parseWholeNumber,
} from "~/client/utils/calendarDate.js";
import {
  calculateCompoundIncrease,
  calculateAustraliaMoveInCost,
  calculateIncomeSplit,
  calculatePercentageSplit,
  calculateProration,
  parsePercentage,
  parseStrictScalar,
  parseWholeNumberInRange,
  parseYears,
} from "~/client/utils/generatedTools.js";
import { JsonLd, makePageSchemas, type SeoConfig } from "~/client/utils/seo";
import AuthorAttribution from "~/client/components/content/AuthorAttribution";

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
  authorAttribution?: boolean;
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

export type IncomeToolMode =
  | "budget"
  | "hourly"
  | "salary";

export type IncomeToolConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  mode: IncomeToolMode;
  defaultIncome?: string;
  defaultRent?: string;
  defaultExpenses?: string;
  defaultHours?: string;
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  examples: ExampleItem[];
  sections: ContentSection[];
};

export type IncreaseToolConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  mode: "compound";
  defaultRate?: string;
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  examples: ExampleItem[];
};

export type SplitToolConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  mode: "income" | "percentage";
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
};

export type DateToolConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  mode: "lease" | "schedule";
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
};

export type MoveInCostConfig = SeoConfig & {
  eyebrow: string;
  h1: string;
  lead: string;
  defaultCurrency: Currency;
  relatedLinks: RelatedLink[];
  faq: FaqItem[];
  examples: ExampleItem[];
  sections: ContentSection[];
  officialResources: { label: string; url: string }[];
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
  id,
  helper,
  error,
  type = "text",
  describedBy,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: "decimal" | "numeric" | "text";
  id?: string;
  helper?: string;
  error?: string;
  type?: "text" | "date";
  describedBy?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = helper ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedByIds = [helperId, errorId, describedBy].filter(Boolean).join(" ") || undefined;
  return (
    <div className="block">
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedByIds}
        className={`w-full cursor-pointer rounded-xl px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus-visible:ring-sky-400 ${error ? "bg-rose-50 ring-2 ring-rose-300 focus:ring-rose-400" : "bg-slate-100 focus:ring-sky-200"}`}
      />
      {helper ? <p id={helperId} className="mt-2 text-sm leading-relaxed text-slate-600">{helper}</p> : null}
      {error ? <p id={errorId} role="alert" className="mt-2 text-sm font-semibold text-rose-700">{error}</p> : null}
    </div>
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
  if (path === "/prorated-rent-calculator-australia") {
    return "This calculator uses the visible rent period and day count selected by the user. Australian lease terms and state or territory rules may use a different proration convention.";
  }
  if (path.includes("australia") || path.includes("bond") || path.includes("advance")) {
    return "Australian rental rules vary by state and territory. Use this as a budgeting estimate and check your lease or state tenancy authority for exact requirements.";
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
  if (config.path === "/weekly-to-fortnightly-rent-australia") {
    return "Use this when the listing is weekly but your rent collection, pay cycle, or household cash-flow plan is fortnightly. It keeps the simple two-week amount separate from true monthly rent.";
  }
  if (config.path === "/fortnightly-to-monthly-rent-australia") {
    return "Use this when a fortnightly rent amount needs to be checked against monthly bills, salary planning, bond estimates, or rent-in-advance cash needed at move-in.";
  }
  if (config.path.includes("australia")) {
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
  const method =
    config.mode === "hourly"
      ? {
          basis: "This page turns hourly pay and weekly hours into annual and monthly gross income before estimating rent targets.",
          when: "Use it when income is based on an hourly wage, variable hours, or a weekly schedule and a salary-style calculator would hide the pay-frequency detail.",
          read: "The result depends heavily on the hours entered. If hours vary, compare a conservative hour count with your normal schedule before using a rent target.",
          limit: "Hourly estimates do not include unpaid time off, overtime changes, tax withholding, payroll deductions, debt, utilities, transport, or seasonal hour changes.",
        }
      : config.mode === "salary"
        ? {
            basis: "This salary-to-rent calculator converts annual gross salary or annual gross income into monthly income, then shows 30%, 40%, and 3x arithmetic reference amounts.",
            when: "Use it as a rent calculator based on income when the number you know is annual salary but the listing or planned rent is monthly.",
            read: "The 30% and 40% figures are gross-income comparisons. The 3x figure reverses an income-to-rent comparison, and the planned-rent result shows the share of entered gross income used by that rent.",
            limit: "Annual gross salary does not show take-home pay, taxes, deductions, debt, utilities, insurance, childcare, medical costs, transportation, savings, deposits, household size, or changing income.",
          }
        : {
            basis: "This page compares planned monthly rent with annual gross income and subtracts the visible aggregate non-rent expense amount from gross monthly income.",
            when: "Use it when you want to compare a specific rent with one combined monthly estimate for non-rent costs.",
            read: "Only the remaining-amount result uses the entered expenses. The 30%, 40%, and 3x amounts remain gross-income reference points, not expense-adjusted maximums.",
            limit: "The calculator does not separately model taxes, debt, utilities, savings, insurance, deposits, or changing income. Include relevant recurring items in the aggregate expense field if you want them subtracted.",
          };

  return mergeSections(
    [
      {
        title: "How this calculator works",
        body: `${method.basis} The output is a planning estimate, not an approval decision or a complete household budget.`,
        bullets: config.mode === "budget"
          ? [
              "The remaining amount uses only gross monthly income, planned rent, and the aggregate non-rent expenses entered.",
              "The reference amounts do not change when expenses change.",
              "Treat income rules as comparisons, not proof that the rent is comfortable.",
            ]
          : [
              "Use income-based amounts as starting points before checking real household costs.",
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
        body: config.mode === "hourly"
          ? "If hours vary, rerun the calculator with a conservative schedule and compare that result with the rent-per-paycheck calculator. Hourly affordability is sensitive to missed shifts and unpaid time off."
          : "If the target rent is near the high end, compare it with take-home pay, upfront move-in cash, and a specific listing. Broad rules become more useful when checked against a real rent amount.",
      },
    ],
    config.sections,
  );
}

function increaseSections() {
  const modeText = "The calculator applies the entered annual percentage to the prior year’s rent for the whole-number term entered and shows each year’s resulting monthly rent. This repeated compounding is sometimes called annual rent escalation.";

  return mergeSections(
    [
      {
        title: "How this calculator works",
        body: modeText,
      },
      {
        title: "When to use this page",
        body: "Use it to test one repeated annual percentage scenario and inspect the year-by-year rent. It does not calculate cumulative rent paid.",
      },
      {
        title: "What this result does not include",
        body: "This is arithmetic only. It does not decide whether a rent increase is allowed, whether notice is valid, whether a unit is exempt, whether local caps apply, or whether fees and utilities can change separately.",
        bullets: [
          "Check whether the amount is a fixed increase, percentage increase, CPI-linked increase, or scheduled escalation.",
          "Confirm whether the rent amount excludes separate fees, utilities, parking, or service charges.",
          "Verify current official rules before using the result in a dispute or notice response.",
        ],
      },
      {
        title: "How to read the result",
        body: "The final rent and total increase use repeated annual compounding. The table shows the monthly rent after each yearly step.",
      },
      {
        title: "Before acting on an increase",
        body: "Use the calculator to check the arithmetic, then compare the result with the lease clause or rent notice. A correct percentage calculation does not prove that the increase is permitted or that every required notice step was followed.",
      },
    ],
    [],
  );
}

function splitSections(config: SplitToolConfig) {
  const method =
    config.mode === "income"
      ? "Income-based splitting divides rent and entered shared costs in proportion to each roommate income."
      : "Percentage splitting applies the custom share entered for one roommate and assigns the rest to the other.";

  return [
    {
      title: "How this calculator works",
      body: `${method} The table shows the monthly share for each person so the agreement can be checked before anyone pays.`,
    },
    {
      title: "When to use this page",
      body: config.mode === "income"
        ? "Use it when two people agree to allocate shared monthly costs in proportion to their incomes."
        : "Use it when two people have already agreed on Person A’s percentage and Person B will pay the remainder.",
    },
    {
      title: "Choosing a fair split method",
      body: config.mode === "income"
        ? "Income-based rent splitting can help when roommates agree that ability to pay should matter more than identical shares. It works best when everyone is comfortable using income as the basis."
        : "A percentage split is useful when roommates already agreed on exact shares because of room size, private space, parking, pets, or another practical tradeoff.",
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
        body: "$2,400 rent with no added shared costs split between $4,000 and $6,000 monthly incomes assigns 40% to Person A and 60% to Person B.",
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
  return [];
}

function dateSections(config: DateToolConfig) {
  return [
    {
      title: "How this calculator works",
      body: config.mode === "schedule"
        ? "The calculator finds the lease end from the entered calendar-month term, then generates each payment date from the original start-date anchor. Dates on or after the calculated lease end are excluded."
        : "The calculator uses calendar months. When the original day does not exist in the target month, the end date is clamped to that target month’s final day.",
    },
    {
      title: "Calendar-month and month-end assumptions",
      body: "The written lease or agreement controls the contractual end date. Month-end wording and local legal rules may use a different convention, so treat this result as a planning calculation rather than legal interpretation.",
    },
  ];
}

function dateExamples(config: DateToolConfig): ExampleItem[] {
  if (config.mode === "schedule") {
    return [
      {
        title: "One-month weekly schedule",
        body: "A weekly schedule starting 2025-02-01 for one calendar month lists February 1, 8, 15, and 22. It excludes March 1 because that is after the February 28 lease end.",
      },
    ];
  }
  return [
    {
      title: "Month-end start",
      body: "A one-month term starting 2025-01-31 ends 2025-02-28 because February does not have a 31st day.",
    },
    {
      title: "12-month term",
      body: "A 12-month term starting 2025-06-01 ends 2026-05-31 under this calendar-month convention.",
    },
  ];
}

function moveInSections(config: MoveInCostConfig) {
  return mergeSections(
    [
      {
        title: "How this calculator works",
        body: "The calculator multiplies weekly rent by the number of advance-rent weeks entered, then adds the bond amount entered by the user. Both results are rounded and displayed in Australian dollars.",
      },
      {
        title: "When to use this page",
        body: "Use it to check the arithmetic for amounts stated in a proposed agreement or move-in request. It does not determine what may be requested.",
      },
      {
        title: "Australian move-in context",
        body: "Australian listings commonly quote weekly rent. Keeping the calculated advance-rent amount separate from the entered bond makes the combined estimate easier to check.",
      },
      {
        title: "What to check before paying",
        body: "Check the written agreement and the rules for the state or territory where the property is located. Confirm the amounts and what period the advance rent covers.",
      },
      {
        title: "What this result does not include",
        body: "This arithmetic estimate does not decide legal limits, bond handling, agreement terms, or whether an entered amount is permitted. It excludes moving costs, utilities, application costs, and other charges.",
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
          : isPw
                ? "This page defines weekly rent wording, then shows why a weekly listing should be annualized before comparing it with a calendar-month budget."
                : isPcm
                  ? "This page defines per-calendar-month rent, then compares it with weekly and every-4-weeks rent so the listing period does not distort the budget."
                  : "This page explains the listing term, shows the conversion formula when relevant, and connects the term to the calculator that matches the next decision.";
  const pageUse =
    lowerPath.includes("pcm-vs-pw")
      ? "Use it when two listings use different period labels and you need to compare the actual rent rhythm before choosing which one is cheaper or easier to budget."
      : lowerPath.includes("what-does-pcm")
        ? "Use it when a listing says PCM and you need to compare the calendar-month amount with weekly or every-4-weeks rent."
      : lowerPath.includes("what-does-pw")
          ? "Use it when a listing says PW and you need to turn the weekly price into a monthly or annual comparison before deciding whether it fits."
          : "Use it when a listing uses PCM, PW, per calendar month, or 4-weekly wording and you need to understand the term before comparing rent periods.";

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
        body: "PW and PCM describe rent periods only. This guide does not interpret lease terms, fees, included costs, or legal obligations.",
        bullets: [
          "Use PW-to-PCM conversion for rent amount comparison.",
          "Use PCM-to-PW conversion for an average weekly equivalent.",
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
  if (config.authorAttribution) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: config.h1,
      description: config.description,
      mainEntityOfPage: `https://www.rentconverter.com${config.path}`,
      author: {
        "@type": "Person",
        name: "Suhas Sunder",
        url: "https://www.rentconverter.com/about",
      },
    });
  }
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

      {config.authorAttribution ? (
        <section className="bg-white px-6 pb-2">
          <div className="mx-auto max-w-6xl">
            <AuthorAttribution />
          </div>
        </section>
      ) : null}

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

function InvalidIncomeResults({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-rose-900" role="status" aria-live="polite">
      <p className="font-semibold">Fix the highlighted {errors.length === 1 ? "field" : "fields"} to calculate the result.</p>
    </div>
  );
}

const salaryStorageKeys = {
  annualSalary: "rc_salary_to_rent_annual_salary",
  plannedRent: "rc_salary_to_rent_planned_rent",
  currency: "rc_salary_to_rent_currency",
} as const;

function SalaryIncomeTool({ config }: { config: IncomeToolConfig }) {
  const [salary, setSalary] = useState(config.defaultIncome ?? "60000");
  const [plannedRent, setPlannedRent] = useState(config.defaultRent ?? "1500");
  const [currency, setCurrency] = useState<Currency>("USD");

  useHydrationSafeSavedState({
    restore(storage) {
      let applied = false;
      const savedSalary = validSavedMoney(
        storage.getItem(salaryStorageKeys.annualSalary),
        { allowZero: false },
      );
      const savedRent = validSavedMoney(
        storage.getItem(salaryStorageKeys.plannedRent),
        { allowZero: true },
      );
      const savedCurrency = validSavedCurrency(
        storage.getItem(salaryStorageKeys.currency),
      );
      if (savedSalary !== undefined) {
        setSalary(savedSalary);
        applied = true;
      }
      if (savedRent !== undefined) {
        setPlannedRent(savedRent);
        applied = true;
      }
      if (savedCurrency !== undefined && isCurrency(savedCurrency)) {
        setCurrency(savedCurrency);
        applied = true;
      }
      return applied;
    },
    persist(storage) {
      storage.setItem(salaryStorageKeys.annualSalary, salary);
      storage.setItem(salaryStorageKeys.plannedRent, plannedRent);
      storage.setItem(salaryStorageKeys.currency, currency);
    },
    dependencies: [salary, plannedRent, currency],
  });

  const salaryParsed = parseIncomeMoney(salary, "Annual gross salary");
  const rentParsed = parseIncomeMoney(plannedRent, "Planned monthly rent", { allowZero: true });
  const errors = [salaryParsed.ok ? "" : salaryParsed.error, rentParsed.ok ? "" : rentParsed.error].filter(Boolean);
  const result = salaryParsed.ok && rentParsed.ok
    ? calculateSalaryComparison(salaryParsed.cents, rentParsed.cents)
    : undefined;

  return (
    <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5"><TextInput id="annual-gross-salary" label="Annual gross salary" value={salary} onChange={setSalary} error={salaryParsed.ok ? undefined : salaryParsed.error} /></div>
        <div className="lg:col-span-4"><TextInput id="planned-monthly-rent" label="Planned monthly rent" value={plannedRent} onChange={setPlannedRent} error={rentParsed.ok ? undefined : rentParsed.error} /></div>
        <div className="lg:col-span-3"><CurrencySelect value={currency} onChange={setCurrency} /></div>
      </div>
      <InvalidIncomeResults errors={errors} />
      {result ? (
        <ResultPanel
          label="30% gross-income reference"
          value={formatMoney(result.monthlyRentAt30, currency)}
          detail="These amounts compare annual gross income with common income-based rules. They do not calculate taxes, take-home pay, or personal expenses."
          cards={[
            { label: "Monthly gross income", value: formatMoney(result.monthlyGrossIncome, currency) },
            { label: "Monthly rent at 30% of gross income", value: formatMoney(result.monthlyRentAt30, currency) },
            { label: "Monthly rent at 40% of gross income", value: formatMoney(result.monthlyRentAt40, currency) },
            { label: "Monthly rent under a 3x annual-income requirement", value: formatMoney(result.monthlyRentAt3x, currency) },
            { label: "Planned rent as a percentage of monthly gross income", value: formatPercent(result.plannedRentPercent) },
          ]}
        />
      ) : null}
    </ToolCard>
  );
}

function HourlyIncomeTool({ config }: { config: IncomeToolConfig }) {
  const [hourlyPay, setHourlyPay] = useState(config.defaultIncome ?? "21");
  const [hours, setHours] = useState(config.defaultHours ?? "40");
  const [plannedRent, setPlannedRent] = useState(config.defaultRent ?? "1200");
  const [currency, setCurrency] = useState<Currency>("USD");
  const payParsed = parseIncomeMoney(hourlyPay, "Hourly pay");
  const hoursParsed = parseHoursPerWeek(hours);
  const rentParsed = parseIncomeMoney(plannedRent, "Planned monthly rent", { allowZero: true });
  const errors = [payParsed.ok ? "" : payParsed.error, hoursParsed.ok ? "" : hoursParsed.error, rentParsed.ok ? "" : rentParsed.error].filter(Boolean);
  const result = payParsed.ok && hoursParsed.ok && rentParsed.ok
    ? calculateHourlyIncome(payParsed.cents, hoursParsed.hundredths, rentParsed.cents)
    : undefined;

  return (
    <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3"><TextInput id="hourly-pay" label="Hourly pay" value={hourlyPay} onChange={setHourlyPay} error={payParsed.ok ? undefined : payParsed.error} /></div>
        <div className="lg:col-span-3"><TextInput id="hours-per-week" label="Hours per week" value={hours} onChange={setHours} helper="Enter more than 0 and no more than 168 hours." error={hoursParsed.ok ? undefined : hoursParsed.error} /></div>
        <div className="lg:col-span-3"><TextInput id="hourly-planned-rent" label="Planned monthly rent" value={plannedRent} onChange={setPlannedRent} error={rentParsed.ok ? undefined : rentParsed.error} /></div>
        <div className="lg:col-span-3"><CurrencySelect value={currency} onChange={setCurrency} /></div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">The estimate assumes the entered hours are worked every week for 52 paid weeks. Taxes and unpaid time are not deducted.</p>
      <InvalidIncomeResults errors={errors} />
      {result ? (
        <ResultPanel
          label="30% gross-income reference"
          value={formatMoney(result.monthlyRentAt30, currency)}
          detail="This is a gross-income estimate based on the hourly pay and weekly hours shown above, not take-home income."
          cards={[
            { label: "Estimated annual gross income", value: formatMoney(result.annualGrossIncome, currency) },
            { label: "Estimated monthly gross income", value: formatMoney(result.monthlyGrossIncome, currency) },
            { label: "Monthly rent at 30%", value: formatMoney(result.monthlyRentAt30, currency) },
            { label: "Monthly rent at 40%", value: formatMoney(result.monthlyRentAt40, currency) },
            { label: "Monthly rent under a 3x annual-income requirement", value: formatMoney(result.monthlyRentAt3x, currency) },
            { label: "Planned rent as a percentage of monthly gross income", value: formatPercent(result.plannedRentPercent) },
          ]}
        />
      ) : null}
    </ToolCard>
  );
}

function BudgetIncomeTool({ config }: { config: IncomeToolConfig }) {
  const [income, setIncome] = useState(config.defaultIncome ?? "60000");
  const [rent, setRent] = useState(config.defaultRent ?? "1500");
  const [expenses, setExpenses] = useState(config.defaultExpenses ?? "0");
  const [currency, setCurrency] = useState<Currency>("USD");
  const incomeParsed = parseIncomeMoney(income, "Annual gross income");
  const rentParsed = parseIncomeMoney(rent, "Planned monthly rent", { allowZero: true });
  const expensesParsed = parseIncomeMoney(expenses, "Monthly non-rent expenses", { allowZero: true });
  const errors = [incomeParsed.ok ? "" : incomeParsed.error, rentParsed.ok ? "" : rentParsed.error, expensesParsed.ok ? "" : expensesParsed.error].filter(Boolean);
  const result = incomeParsed.ok && rentParsed.ok && expensesParsed.ok
    ? calculateRentBudget(incomeParsed.cents, rentParsed.cents, expensesParsed.cents)
    : undefined;

  return (
    <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3"><TextInput id="budget-income" label="Annual gross income" value={income} onChange={setIncome} error={incomeParsed.ok ? undefined : incomeParsed.error} /></div>
        <div className="lg:col-span-3"><TextInput id="budget-rent" label="Planned monthly rent" value={rent} onChange={setRent} error={rentParsed.ok ? undefined : rentParsed.error} /></div>
        <div className="lg:col-span-3"><TextInput id="budget-expenses" label="Monthly non-rent expenses" value={expenses} onChange={setExpenses} helper="Enter one aggregate amount. You can include debt, utilities, savings, or other non-rent costs here." error={expensesParsed.ok ? undefined : expensesParsed.error} /></div>
        <div className="lg:col-span-3"><CurrencySelect value={currency} onChange={setCurrency} /></div>
      </div>
      <InvalidIncomeResults errors={errors} />
      {result ? (
        <ResultPanel
          label="Planned rent as a percentage of monthly gross income"
          value={formatPercent(result.plannedRentPercent)}
          detail="The remaining amount subtracts the visible planned rent and aggregate non-rent expenses. The reference amounts are based only on gross income."
          cards={[
            { label: "Monthly gross income", value: formatMoney(result.monthlyGrossIncome, currency) },
            { label: "Remaining after planned rent and non-rent expenses", value: formatMoney(result.remainingAfterRentAndExpenses, currency) },
            { label: "30% income-based reference amount", value: formatMoney(result.monthlyRentAt30, currency) },
            { label: "40% income-based reference amount", value: formatMoney(result.monthlyRentAt40, currency) },
            { label: "3x income-requirement comparison amount", value: formatMoney(result.monthlyRentAt3x, currency) },
          ]}
        />
      ) : null}
    </ToolCard>
  );
}

export function IncomeToolPage({ config }: { config: IncomeToolConfig }) {
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });
  const tool =
    config.mode === "salary" ? <SalaryIncomeTool config={config} />
      : config.mode === "hourly" ? <HourlyIncomeTool config={config} />
        : <BudgetIncomeTool config={config} />;

  return (
    <Shell schemas={schemas}>
      {tool}
      <ContentBlocks sections={incomeSections(config)} examples={config.examples} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

function InvalidGeneratedResults({ message = "Fix the highlighted fields to calculate the result." }: { message?: string }) {
  return <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800" role="status" aria-live="polite">{message}</p>;
}

function CompoundIncreaseTool({ config }: { config: IncreaseToolConfig }) {
  const [rent, setRent] = useState("2000");
  const [rate, setRate] = useState(config.defaultRate ?? "4");
  const [years, setYears] = useState("5");
  const [currency, setCurrency] = useState<Currency>("USD");
  const rentParsed = parseIncomeMoney(rent, "Starting monthly rent");
  const rateLabel = "Annual percentage increase";
  const rateParsed = parsePercentage(rate, rateLabel);
  const yearsParsed = parseYears(years);
  const result = rentParsed.ok && rateParsed.ok && yearsParsed.ok
    ? calculateCompoundIncrease(rentParsed.cents, rateParsed.value, yearsParsed.value)
    : undefined;
  const rows = result
    ? [["Year", "Monthly rent", "Annualized rent"], ...result.rows.map((row) => [String(row.year), formatMoney(row.rent, currency), formatMoney(row.rent * 12n, currency)])]
    : [];
  return (
    <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4"><TextInput id={`${config.mode}-starting-rent`} label="Starting monthly rent" value={rent} onChange={setRent} error={rentParsed.ok ? undefined : rentParsed.error} /></div>
        <div className="lg:col-span-3"><TextInput id={`${config.mode}-rate`} label={rateLabel} value={rate} onChange={setRate} error={rateParsed.ok ? undefined : rateParsed.error} /></div>
        <div className="lg:col-span-2"><TextInput id={`${config.mode}-years`} label="Number of years" value={years} onChange={setYears} inputMode="numeric" helper="Enter a whole number from 1 through 100." error={yearsParsed.ok ? undefined : yearsParsed.error} /></div>
        <div className="lg:col-span-3"><CurrencySelect value={currency} onChange={setCurrency} /></div>
      </div>
      {!result ? <InvalidGeneratedResults /> : (
        <ResultPanel
          label="Final rent after annual compounding"
          value={formatMoney(result.finalRent, currency)}
          detail={`Applies the entered percentage once per year for ${result.years} ${result.years === 1 ? "year" : "years"}. The table does not calculate cumulative rent paid.`}
          cards={[
            { label: "Starting monthly rent", value: formatMoney(result.startingRent, currency) },
            { label: rateLabel, value: formatPercent(result.percentage) },
            { label: "Total increase amount", value: formatMoney(result.totalIncrease, currency) },
            { label: "Total percentage increase", value: formatPercent(result.totalPercentage) },
          ]}
          tableRows={rows}
        />
      )}
    </ToolCard>
  );
}

export function IncreaseToolPage({ config }: { config: IncreaseToolConfig }) {
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });
  return (
    <Shell schemas={schemas}>
      <CompoundIncreaseTool config={config} />
      <ContentBlocks sections={increaseSections()} examples={config.examples} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

function SplitBaseFields({ rent, setRent, sharedCosts, setSharedCosts, currency, setCurrency, rentError, sharedCostsError }: {
  rent: string; setRent: (value: string) => void; sharedCosts: string; setSharedCosts: (value: string) => void;
  currency: Currency; setCurrency: (value: Currency) => void; rentError?: string; sharedCostsError?: string;
}) {
  return <>
    <div className="lg:col-span-4"><TextInput id="split-base-rent" label="Base monthly rent" value={rent} onChange={setRent} error={rentError} /></div>
    <div className="lg:col-span-5"><TextInput id="split-shared-costs" label="Optional shared monthly costs" value={sharedCosts} onChange={setSharedCosts} helper="Defaults to zero. Add only costs that should use the same split." error={sharedCostsError} /></div>
    <div className="lg:col-span-3"><CurrencySelect value={currency} onChange={setCurrency} /></div>
  </>;
}

function SplitResult({ currency, rent, sharedCosts, total, rows, cards }: { currency: Currency; rent: bigint; sharedCosts: bigint; total: bigint; rows: string[][]; cards: { label: string; value: string }[] }) {
  return <ResultPanel label="Total shared monthly cost" value={formatMoney(total, currency)} detail="The displayed person amounts are rounded to cents and always reconcile exactly to the displayed total." cards={[
    { label: "Base monthly rent", value: formatMoney(rent, currency) },
    { label: "Optional shared monthly costs", value: formatMoney(sharedCosts, currency) },
    ...cards,
  ]} tableRows={rows} />;
}

function IncomeSplitTool({ config }: { config: SplitToolConfig }) {
  const [rent, setRent] = useState("2400");
  const [sharedCosts, setSharedCosts] = useState("0");
  const [incomeA, setIncomeA] = useState("4000");
  const [incomeB, setIncomeB] = useState("6000");
  const [currency, setCurrency] = useState<Currency>("USD");
  const rentParsed = parseIncomeMoney(rent, "Base monthly rent");
  const sharedParsed = parseIncomeMoney(sharedCosts, "Optional shared monthly costs", { allowZero: true });
  const incomeAParsed = parseIncomeMoney(incomeA, "Person A monthly income", { allowZero: true });
  const incomeBParsed = parseIncomeMoney(incomeB, "Person B monthly income", { allowZero: true });
  const total = rentParsed.ok && sharedParsed.ok ? rentParsed.cents + sharedParsed.cents : undefined;
  const split = total !== undefined && incomeAParsed.ok && incomeBParsed.ok ? calculateIncomeSplit(total, incomeAParsed.cents, incomeBParsed.cents) : undefined;
  const combinedError = split && !split.ok ? split.error : undefined;
  return <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
    <div className="mt-6 grid gap-4 lg:grid-cols-12">
      <SplitBaseFields rent={rent} setRent={setRent} sharedCosts={sharedCosts} setSharedCosts={setSharedCosts} currency={currency} setCurrency={setCurrency} rentError={rentParsed.ok ? undefined : rentParsed.error} sharedCostsError={sharedParsed.ok ? undefined : sharedParsed.error} />
      <div className="lg:col-span-6"><TextInput id="split-income-a" label="Person A monthly income" value={incomeA} onChange={setIncomeA} error={incomeAParsed.ok ? undefined : incomeAParsed.error} describedBy={combinedError ? "split-combined-income-error" : undefined} /></div>
      <div className="lg:col-span-6"><TextInput id="split-income-b" label="Person B monthly income" value={incomeB} onChange={setIncomeB} error={incomeBParsed.ok ? undefined : incomeBParsed.error} describedBy={combinedError ? "split-combined-income-error" : undefined} /></div>
      {combinedError ? <p id="split-combined-income-error" role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 lg:col-span-12">{combinedError}</p> : null}
    </div>
    {!split || !split.ok || total === undefined || !rentParsed.ok || !sharedParsed.ok || !incomeAParsed.ok || !incomeBParsed.ok ? <InvalidGeneratedResults message={combinedError ?? "Fix the highlighted fields to calculate the income-based split."} /> : (
      <SplitResult currency={currency} rent={rentParsed.cents} sharedCosts={sharedParsed.cents} total={total} cards={[
        { label: "Person A percentage", value: formatPercent(split.percentA) },
        { label: "Person A amount", value: formatMoney(split.shareA, currency) },
        { label: "Person B percentage", value: formatPercent(split.percentB) },
        { label: "Person B amount", value: formatMoney(split.shareB, currency) },
      ]} rows={[["Person", "Monthly income", "Percentage", "Amount"], ["Person A", formatMoney(incomeAParsed.cents, currency), formatPercent(split.percentA), formatMoney(split.shareA, currency)], ["Person B", formatMoney(incomeBParsed.cents, currency), formatPercent(split.percentB), formatMoney(split.shareB, currency)]]} />
    )}
  </ToolCard>;
}

function PercentageSplitTool({ config }: { config: SplitToolConfig }) {
  const [rent, setRent] = useState("2400");
  const [sharedCosts, setSharedCosts] = useState("0");
  const [shareA, setShareA] = useState("50");
  const [currency, setCurrency] = useState<Currency>("USD");
  const rentParsed = parseIncomeMoney(rent, "Base monthly rent");
  const sharedParsed = parseIncomeMoney(sharedCosts, "Optional shared monthly costs", { allowZero: true });
  const percentageParsed = parsePercentage(shareA, "Person A percentage");
  const total = rentParsed.ok && sharedParsed.ok ? rentParsed.cents + sharedParsed.cents : undefined;
  const split = total !== undefined && percentageParsed.ok ? calculatePercentageSplit(total, percentageParsed.value) : undefined;
  return <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
    <div className="mt-6 grid gap-4 lg:grid-cols-12">
      <SplitBaseFields rent={rent} setRent={setRent} sharedCosts={sharedCosts} setSharedCosts={setSharedCosts} currency={currency} setCurrency={setCurrency} rentError={rentParsed.ok ? undefined : rentParsed.error} sharedCostsError={sharedParsed.ok ? undefined : sharedParsed.error} />
      <div className="lg:col-span-6"><TextInput id="split-percentage-a" label="Person A percentage" value={shareA} onChange={setShareA} helper="Person B receives the remainder to 100%." error={percentageParsed.ok ? undefined : percentageParsed.error} /></div>
    </div>
    {!split || total === undefined || !rentParsed.ok || !sharedParsed.ok ? <InvalidGeneratedResults message="Fix the highlighted fields to calculate the percentage split." /> : (
      <SplitResult currency={currency} rent={rentParsed.cents} sharedCosts={sharedParsed.cents} total={total} cards={[
        { label: "Person A percentage", value: formatPercent(split.percentA) },
        { label: "Person A amount", value: formatMoney(split.shareA, currency) },
        { label: "Person B percentage", value: formatPercent(split.percentB) },
        { label: "Person B amount", value: formatMoney(split.shareB, currency) },
      ]} rows={[["Person", "Percentage", "Amount"], ["Person A", formatPercent(split.percentA), formatMoney(split.shareA, currency)], ["Person B", formatPercent(split.percentB), formatMoney(split.shareB, currency)]]} />
    )}
  </ToolCard>;
}

export function SplitToolPage({ config }: { config: SplitToolConfig }) {
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });
  return <Shell schemas={schemas}>
    {config.mode === "income" ? <IncomeSplitTool config={config} /> : <PercentageSplitTool config={config} />}
    <ContentBlocks sections={splitSections(config)} examples={splitExamples(config)} />
    <RelatedTools links={config.relatedLinks} />
    <Faq items={config.faq} />
  </Shell>;
}

export function MoveInCostPage({ config }: { config: MoveInCostConfig }) {
  const [weeklyRent, setWeeklyRent] = useState("500");
  const [advanceWeeks, setAdvanceWeeks] = useState("");
  const [bondAmount, setBondAmount] = useState("");
  const currency = config.defaultCurrency;
  const weeklyParsed = parseIncomeMoney(weeklyRent, "Weekly rent");
  const advanceWeeksParsed = parseStrictScalar(advanceWeeks, "Advance-rent weeks", {
    min: 0,
    max: 52,
    maxDecimalPlaces: 4,
  });
  const bondParsed = parseIncomeMoney(bondAmount, "Bond amount", { allowZero: true });
  const result = weeklyParsed.ok && advanceWeeksParsed.ok && bondParsed.ok
    ? calculateAustraliaMoveInCost(weeklyParsed.cents, advanceWeeksParsed.value, bondParsed.cents)
    : undefined;
  const rows = result
    ? [
        ["Entered amount", "AUD value"],
        ["Weekly rent", formatMoney(result.weeklyRent, currency)],
        [`Rent in advance (${result.advanceWeeks} weeks)`, formatMoney(result.rentInAdvance, currency)],
        ["Bond entered by you", formatMoney(result.bond, currency)],
        ["Estimated upfront total", formatMoney(result.total, currency)],
      ]
    : [];
  const schemas = makePageSchemas({ ...config, faq: config.faq });

  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TextInput id="australia-weekly-rent" label="Weekly rent" value={weeklyRent} onChange={setWeeklyRent} error={weeklyParsed.ok ? undefined : weeklyParsed.error} />
          </div>
          <div className="lg:col-span-4">
            <TextInput id="australia-advance-weeks" label="Weeks of rent paid in advance" value={advanceWeeks} onChange={setAdvanceWeeks} inputMode="decimal" helper="Enter the number stated in the agreement or request; no legal default is supplied." error={advanceWeeksParsed.ok ? undefined : advanceWeeksParsed.error} />
          </div>
          <div className="lg:col-span-4">
            <TextInput id="australia-bond-amount" label="Bond amount (AUD)" value={bondAmount} onChange={setBondAmount} helper="Enter 0 intentionally to calculate without a bond." error={bondParsed.ok ? undefined : bondParsed.error} />
          </div>
        </div>
        {!result ? (
          <InvalidGeneratedResults message="Enter valid weekly rent, advance-rent weeks, and bond amount to calculate the estimate." />
        ) : (
          <ResultPanel
            label="Estimated upfront total"
            value={formatMoney(result.total, currency)}
            detail="Estimate based on the amounts you enter. Check your agreement and the rules for your state or territory."
            cards={[
              { label: "Rent in advance", value: formatMoney(result.rentInAdvance, currency) },
              { label: "Bond entered by you", value: formatMoney(result.bond, currency) },
            ]}
            tableRows={rows}
          />
        )}
      </ToolCard>
      <ContentBlocks sections={moveInSections(config)} examples={config.examples} />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-2xl font-bold text-sky-800">Official state and territory rental resources</h2>
        <p className="mt-3 text-slate-700">
          Check the authority for the state or territory where the property is located. These links provide official information; RentConverter does not summarize or apply their legal rules.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {config.officialResources.map((resource) => (
            <li key={resource.url}>
              <a className="font-semibold text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" href={resource.url}>
                {resource.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

export function ProrationToolPage({ config }: { config: ProrationToolConfig }) {
  const [rent, setRent] = useState("1500");
  const [period, setPeriod] = useState<"monthly" | "weekly" | "fortnightly">("monthly");
  const [daysCharged, setDaysCharged] = useState("22");
  const [daysInPeriod, setDaysInPeriod] = useState("31");
  const [currency, setCurrency] = useState<Currency>(config.defaultCurrency);
  const rentParsed = parseIncomeMoney(rent, "Rent amount");
  const chargedParsed = parseWholeNumberInRange(daysCharged, "Charged days", 0, 366);
  const periodDaysParsed = period === "monthly"
    ? parseWholeNumberInRange(daysInPeriod, "Days in monthly rent period", 1, 366)
    : { ok: true as const, value: period === "weekly" ? 7 : 14 };
  const chargedRelationError = chargedParsed.ok && periodDaysParsed.ok && chargedParsed.value > periodDaysParsed.value
    ? `Charged days cannot exceed the ${periodDaysParsed.value}-day ${period} period.`
    : undefined;
  const result = rentParsed.ok && chargedParsed.ok && periodDaysParsed.ok && !chargedRelationError
    ? calculateProration(rentParsed.cents, chargedParsed.value, periodDaysParsed.value)
    : undefined;
  const rows = result ? [
    ["Input period", period === "fortnightly" ? "Fortnightly" : period[0].toUpperCase() + period.slice(1)],
    ["Rent amount", formatMoney(result.rent, currency)],
    ["Days charged", String(result.chargedDays)],
    ["Days in period", String(result.periodDays)],
    ["Daily rent", formatMoney(result.dailyRate, currency)],
    ["Prorated rent", formatMoney(result.proratedRent, currency)],
  ] : [];
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });

  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TextInput id="australia-proration-rent" label="Rent amount" value={rent} onChange={setRent} error={rentParsed.ok ? undefined : rentParsed.error} />
          </div>
          <div className="block lg:col-span-3">
            <label htmlFor="australia-proration-period" className="mb-2 block text-sm font-semibold text-slate-800">Rent period</label>
            <select
              id="australia-proration-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value === "weekly" || event.target.value === "fortnightly" ? event.target.value : "monthly")}
              className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
            </select>
            <p className="mt-2 text-sm text-slate-600">Weekly uses 7 days, fortnightly uses 14 days, and monthly uses the visible day count.</p>
          </div>
          <div className="lg:col-span-2">
            <TextInput id="australia-proration-charged" label="Charged days" value={daysCharged} onChange={setDaysCharged} inputMode="numeric" error={!chargedParsed.ok ? chargedParsed.error : chargedRelationError} />
          </div>
          {period === "monthly" ? (
            <div className="lg:col-span-2">
              <TextInput id="australia-proration-period-days" label="Days in monthly rent period" value={daysInPeriod} onChange={setDaysInPeriod} inputMode="numeric" error={periodDaysParsed.ok ? undefined : periodDaysParsed.error} />
            </div>
          ) : null}
          <div className={period === "monthly" ? "lg:col-span-1" : "lg:col-span-3"}>
            <CurrencySelect value={currency} onChange={setCurrency} />
          </div>
        </div>
        {!result ? <InvalidGeneratedResults message="Fix the highlighted fields to calculate prorated rent." /> : (
          <ResultPanel
            label="Prorated rent"
            value={formatMoney(result.proratedRent, currency)}
            detail={`Formula: ${formatMoney(result.rent, currency)} × ${result.chargedDays} charged days ÷ ${result.periodDays} days in the selected period. The lease or applicable local rules may use a different convention.`}
            cards={[
              { label: "Entered rent", value: formatMoney(result.rent, currency) },
              { label: "Period basis", value: `${result.periodDays} days` },
              { label: "Charged days", value: String(result.chargedDays) },
              { label: "Daily rent", value: formatMoney(result.dailyRate, currency) },
            ]}
            tableRows={rows}
          />
        )}
      </ToolCard>
      <ContentBlocks sections={prorationSections(config)} examples={config.examples} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

function InvalidDateResults({ errors }: { errors: string[] }) {
  return (
    <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-rose-900" role="status" aria-live="polite">
      <p className="font-semibold">Fix the highlighted input before using the date result.</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {errors.map((error) => <li key={error}>{error}</li>)}
      </ul>
    </div>
  );
}

type ScheduleFrequency = "monthly" | "weekly" | "fortnightly" | "every-4-weeks";

export function DateToolPage({ config, initialDate }: { config: DateToolConfig; initialDate: string }) {
  const [start, setStart] = useState(initialDate);
  const [months, setMonths] = useState("12");
  const [rent, setRent] = useState("2000");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [frequency, setFrequency] = useState<ScheduleFrequency>("monthly");
  const startParsed = parseCalendarDate(start, "Lease start date");
  const termParsed = parseWholeNumber(months, "Lease term", 1, 120);
  const rentParsed = parseMoneyToCents(rent);
  const dateCalculation = startParsed.ok && termParsed.ok
    ? calculateLeaseEnd(startParsed.date, termParsed.value)
    : null;
  const scheduleCalculation = config.mode === "schedule" && startParsed.ok && termParsed.ok
    ? { ...generateLeasePaymentSchedule(startParsed.date, termParsed.value, frequency), start: startParsed.date, term: termParsed.value }
    : null;
  const rows = scheduleCalculation && rentParsed.ok
    ? [
        ["Payment", "Payment date", "Amount"],
        ...scheduleCalculation.payments.map((payment, index) => [
          String(index + 1),
          formatCalendarDate(payment),
          formatMoney(rentParsed.cents, currency),
        ]),
      ]
    : [];
  const errors = [
    !startParsed.ok ? startParsed.error : null,
    !termParsed.ok ? termParsed.error : null,
    config.mode === "schedule" && !rentParsed.ok ? rentParsed.error : null,
  ].filter((error): error is string => Boolean(error));
  const schemas = makePageSchemas({ ...config, calculator: true, faq: config.faq });
  return (
    <Shell schemas={schemas}>
      <ToolCard eyebrow={config.eyebrow} h1={config.h1} lead={config.lead} onPrint={() => window.print()}>
        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TextInput id={`${config.mode}-start-date`} type="date" label={config.mode === "schedule" ? "Lease start and first payment date" : "Lease start date"} value={start} onChange={setStart} inputMode="text" error={!startParsed.ok ? startParsed.error : undefined} />
          </div>
          <div className="lg:col-span-3">
            <TextInput id={`${config.mode}-term-months`} label="Term in calendar months" value={months} onChange={setMonths} inputMode="numeric" helper="Enter a whole number from 1 through 120. Enter 12 for a 12-month lease." error={!termParsed.ok ? termParsed.error : undefined} />
          </div>
          {config.mode === "schedule" ? (
            <>
              <div className="lg:col-span-3"><TextInput id="schedule-rent" label="Rent per payment" value={rent} onChange={setRent} error={!rentParsed.ok ? rentParsed.error : undefined} /></div>
              <div className="lg:col-span-2"><CurrencySelect value={currency} onChange={setCurrency} /></div>
              <div className="block lg:col-span-4">
                <label htmlFor="schedule-frequency" className="mb-2 block text-sm font-semibold text-slate-800">Payment frequency</label>
                <select id="schedule-frequency" value={frequency} onChange={(event) => setFrequency(event.target.value as ScheduleFrequency)} className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200">
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly or biweekly (14 days)</option>
                  <option value="every-4-weeks">Every 4 weeks (28 days)</option>
                </select>
              </div>
            </>
          ) : null}
        </div>
        {errors.length ? <InvalidDateResults errors={errors} /> : config.mode === "schedule" && scheduleCalculation && rentParsed.ok ? (
          <ResultPanel
            label="Generated payment schedule"
            value={`${scheduleCalculation.payments.length} ${scheduleCalculation.payments.length === 1 ? "payment" : "payments"}`}
            detail="Payment dates are period starts. The schedule excludes every date on or after the calculated lease end."
            cards={[
              { label: "Lease start", value: formatCalendarDate(scheduleCalculation.start) },
              { label: "Calculated lease end", value: formatCalendarDate(scheduleCalculation.leaseEnd.date) },
              { label: "Term", value: `${scheduleCalculation.term} ${scheduleCalculation.term === 1 ? "month" : "months"}` },
              { label: "Frequency", value: frequency === "every-4-weeks" ? "Every 4 weeks" : frequency === "fortnightly" ? "Fortnightly / biweekly" : frequency[0].toUpperCase() + frequency.slice(1) },
            ]}
            tableRows={rows}
          />
        ) : dateCalculation && startParsed.ok && termParsed.ok ? (
          <ResultPanel
            label="Calculated lease end"
            value={formatCalendarDateForDisplay(dateCalculation.date)}
            detail={dateCalculation.clamped
              ? "The original start day does not exist in the target month, so the result uses that month’s final calendar day. The written agreement controls the contractual end date."
              : "The result is the calendar day immediately before the same numbered day after the entered term. The written agreement controls the contractual end date."}
            cards={[
              { label: "Lease start", value: formatCalendarDate(startParsed.date) },
              { label: "Term", value: `${termParsed.value} ${termParsed.value === 1 ? "month" : "months"}` },
              { label: "Calculated end", value: formatCalendarDate(dateCalculation.date) },
              ...(dateCalculation.clamped ? [{ label: "Month-end handling", value: "Clamped to the target month’s final day" }] : []),
            ]}
          />
        ) : null}
      </ToolCard>
      <ContentBlocks sections={dateSections(config)} examples={dateExamples(config)} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}
