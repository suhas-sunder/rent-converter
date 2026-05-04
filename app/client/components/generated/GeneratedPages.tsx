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
              Real situations
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

      <ContentBlocks sections={config.sections} examples={config.examples} />
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
      <ContentBlocks sections={config.sections} examples={config.examples} />
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
        ["Budget point", `${formatMoney(diff, config.currency)} is the gap between 4 weeks and a calendar month.`],
      ];

  return (
    <Shell schemas={schemas}>
      <ToolCard
        eyebrow={config.eyebrow}
        h1={config.h1}
        lead={`${amountLabel} is ${formatMoney(monthly, config.currency)} per calendar month using the 365-day model.`}
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
        title="What this means for your budget"
        body={
          config.daily
            ? `${amountLabel} turns into ${formatMoney(monthly, config.currency)} per average calendar month and ${formatMoney(annual, config.currency)} per year. That helps compare short-stay pricing with a monthly rent budget.`
            : `${amountLabel} turns into ${formatMoney(monthly, config.currency)} per average calendar month, not ${formatMoney(fourWeek, config.currency)}. The difference matters when a listing looks affordable weekly but your bills are planned monthly.`
        }
        formula={config.daily ? "monthly = daily x 365 / 12" : "monthly = weekly x 365 / 7 / 12"}
      />
      <ContentBlocks
        sections={
          config.daily
            ? [
                {
                  title: "Why nightly rent needs a monthly view",
                  body: "A nightly amount can look manageable until it is annualized. The monthly equivalent helps compare short-stay pricing with a normal monthly rental budget.",
                },
                {
                  title: "Where this shows up",
                  body: "This calculation is useful when comparing short stays, temporary housing, daily room rates, and rental ads that need to be compared against a monthly budget.",
                },
              ]
            : [
                {
                  title: "Why 4 weeks can mislead",
                  body: "Four weeks is 28 days. An average calendar month is 365 divided by 12 days, about 30.42 days. That gap is small each week but noticeable across a monthly budget.",
                },
                {
                  title: "Where this shows up",
                  body: "This calculation is useful when comparing weekly listings, room rentals, student housing, short stays, and rent pages that use PW, PCW, PCM, or per calendar month wording.",
                },
              ]
        }
        examples={[
          {
            title: "Monthly budget check",
            body: `If your rent cap is close to ${formatMoney(monthly, config.currency)}, the 4-week shortcut can make the listing look cheaper than it is over a full year.`,
          },
          {
            title: "Annual cost check",
            body: `The annual equivalent is ${formatMoney(annual, config.currency)}. That gives a cleaner comparison against salary, savings, or yearly housing plans.`,
          },
        ]}
      />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
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
      <ContentBlocks sections={config.sections} examples={config.examples} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}

export function SalaryAnswerPage({ config }: { config: SalaryAnswerConfig }) {
  const salaryCents = BigInt(config.salary * 100);
  const monthlyIncome = divRound(salaryCents, 12n);
  const rent30 = divRound(monthlyIncome * 30n, 100n);
  const rent40 = divRound(monthlyIncome * 40n, 100n);
  const rent3x = divRound(monthlyIncome, 3n);
  const schemas = makePageSchemas({ ...config, calculator: false, faq: salaryFaq });
  return (
    <Shell schemas={schemas}>
      <ToolCard
        eyebrow={config.eyebrow}
        h1={config.h1}
        lead={`On a $${config.salary.toLocaleString()} salary, common rent estimates range from ${formatMoney(rent30, "USD")} at 30% of gross income to ${formatMoney(rent40, "USD")} at 40%.`}
      >
        <ResultPanel
          label="Estimated rent range"
          value={formatMoney(rent30, "USD")}
          detail="The 30% figure is a conservative starting point. The 3x rule gives a similar qualification-style cap because rent is one third of gross monthly income."
          cards={[
            { label: "Gross monthly income", value: formatMoney(monthlyIncome, "USD") },
            { label: "30% rent target", value: formatMoney(rent30, "USD") },
            { label: "40% rent target", value: formatMoney(rent40, "USD") },
            { label: "3x qualification max", value: formatMoney(rent3x, "USD") },
          ]}
        />
      </ToolCard>
      <ContentBlocks
        sections={[
          {
            title: "Salary is not the same as take-home pay",
            body: "These numbers use gross salary because that is how many simple rent rules are stated. Your comfortable rent may be lower after tax withholding, debt payments, insurance, savings, utilities, and transportation.",
          },
          {
            title: "Qualification max vs comfort max",
            body: "A landlord rule can say you qualify for one rent amount while your monthly budget points to a lower amount. The safer number is usually the one that still leaves room for bills and emergencies.",
          },
        ]}
        examples={[
          {
            title: "Rent-only budget",
            body: `At $${config.salary.toLocaleString()}, ${formatMoney(rent30, "USD")} is the 30% target before utilities or fees.`,
          },
          {
            title: "Stretch comparison",
            body: `${formatMoney(rent40, "USD")} may be possible for some renters, but it leaves less room for savings and variable costs.`,
          },
        ]}
      />
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
      <ContentBlocks sections={[{ title: "How to read the result", body: "The output shows the arithmetic result from the rent, rate, and years entered. It does not decide whether an increase is allowed, whether notice is valid, or whether a local cap applies." }]} examples={config.examples} />
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
      <ContentBlocks sections={[{ title: "Choosing a split method", body: "Equal splits are easy when rooms and incomes are similar. Income-based splits can feel fairer when roommates earn very different amounts. Custom percentages work when room size, parking, or private bathrooms change the value of each share." }]} examples={[]} />
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
      <ContentBlocks sections={config.sections} examples={config.examples} />
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
      <ContentBlocks sections={config.sections} examples={config.examples} />
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
      <ContentBlocks sections={[{ title: "Lease date assumptions", body: "Lease documents can describe dates in different ways. A 12-month lease starting June 1 often ends May 31 the next year, but the lease language controls the official dates." }]} examples={[]} />
      <AssumptionNote path={config.path} />
      <RelatedTools links={config.relatedLinks} />
      <Faq items={config.faq} />
    </Shell>
  );
}
