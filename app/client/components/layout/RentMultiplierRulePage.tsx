import { useMemo, useState } from "react";
import { Link } from "react-router";
import type { IntentFaq, IntentLink } from "./IntentLandingPage";

const CURRENCY_OPTIONS = [
  "USD",
  "CAD",
  "EUR",
  "GBP",
  "AUD",
  "NZD",
  "JPY",
  "CNY",
  "HKD",
  "SGD",
  "INR",
  "KRW",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "MXN",
  "BRL",
] as const;

type Currency = (typeof CURRENCY_OPTIONS)[number];

function isCurrency(value: string): value is Currency {
  return (CURRENCY_OPTIONS as readonly string[]).includes(value);
}

function parseMoneyToCents(raw: string): {
  ok: boolean;
  cents?: bigint;
  error?: string;
} {
  const clean = raw.trim().replace(/[^\d.,-]/g, "");
  if (!clean) return { ok: false, error: "Enter an amount." };
  if (clean.includes("-")) {
    return { ok: false, error: "Amount cannot be negative." };
  }

  let value = clean;
  const lastDot = value.lastIndexOf(".");
  const lastComma = value.lastIndexOf(",");

  if (lastDot >= 0 && lastComma >= 0) {
    const decimal = lastDot > lastComma ? "." : ",";
    const thousands = decimal === "." ? "," : ".";
    value = value.split(thousands).join("");
    if (decimal === ",") value = value.replace(",", ".");
  } else if (lastComma >= 0 && lastDot < 0) {
    const parts = value.split(",");
    if (parts.length === 2 && (parts[1] ?? "").length === 2) {
      value = `${parts[0]}.${parts[1]}`;
    } else {
      value = value.replace(/,/g, "");
    }
  } else {
    value = value.replace(/,/g, "");
  }

  if (value.startsWith(".")) value = `0${value}`;
  if (value.endsWith(".")) value = `${value}0`;

  if (!/^\d+(\.\d+)?$/.test(value)) {
    return { ok: false, error: "Use a number like 2000 or 2,000.50." };
  }

  const [wholeRaw, fracRaw = ""] = value.split(".");
  const whole = BigInt(wholeRaw || "0");
  const frac3 = fracRaw.padEnd(3, "0").slice(0, 3);
  const centsBase = BigInt(frac3.slice(0, 2) || "0");
  const thirdDigit = Number(frac3[2] ?? "0");
  const cents = whole * 100n + centsBase + (thirdDigit >= 5 ? 1n : 0n);

  return { ok: true, cents };
}

function divRound(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) return 0n;
  return (numerator + denominator / 2n) / denominator;
}

function formatMoney(cents: bigint | undefined, currency: Currency): string {
  if (cents === undefined) return "-";
  const value = Number(cents) / 100;
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type RentMultiplierRulePageProps = {
  eyebrow: string;
  title: string;
  lead: string;
  multiplierLabel: string;
  multiplierNumerator: bigint;
  multiplierDenominator: bigint;
  defaultRent: string;
  defaultIncome: string;
  explanation: string;
  examples: Array<{ title: string; body: string }>;
  relatedLinks: IntentLink[];
  faq: IntentFaq[];
};

export default function RentMultiplierRulePage({
  eyebrow,
  title,
  lead,
  multiplierLabel,
  multiplierNumerator,
  multiplierDenominator,
  defaultRent,
  defaultIncome,
  explanation,
  examples,
  relatedLinks,
  faq,
}: RentMultiplierRulePageProps) {
  const [rent, setRent] = useState(defaultRent);
  const [income, setIncome] = useState(defaultIncome);
  const [currency, setCurrency] = useState<Currency>("USD");

  const rentParsed = useMemo(() => parseMoneyToCents(rent), [rent]);
  const incomeParsed = useMemo(() => parseMoneyToCents(income), [income]);

  const requiredIncome = useMemo(() => {
    if (!rentParsed.ok || rentParsed.cents === undefined) return undefined;
    return divRound(
      rentParsed.cents * multiplierNumerator,
      multiplierDenominator,
    );
  }, [multiplierDenominator, multiplierNumerator, rentParsed]);

  const maxRent = useMemo(() => {
    if (!incomeParsed.ok || incomeParsed.cents === undefined) return undefined;
    return divRound(
      incomeParsed.cents * multiplierDenominator,
      multiplierNumerator,
    );
  }, [incomeParsed, multiplierDenominator, multiplierNumerator]);

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 scroll-smooth antialiased">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 py-7 sm:px-8 sm:py-8">
          <p className="rc-page-eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-700">
            {lead}
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Monthly rent
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={rent}
                  onChange={(event) => setRent(event.target.value)}
                  className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
                  aria-label="Monthly rent"
                />
                <select
                  value={currency}
                  onChange={(event) => {
                    const next = event.target.value;
                    setCurrency(isCurrency(next) ? next : "USD");
                  }}
                  className="cursor-pointer rounded-xl bg-slate-100 px-3 py-3 text-sm font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
                  aria-label="Currency"
                >
                  {CURRENCY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {!rentParsed.ok ? (
                <p className="mt-2 text-sm font-medium text-rose-700">
                  {rentParsed.error}
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-5">
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Monthly gross income
              </label>
              <input
                inputMode="decimal"
                value={income}
                onChange={(event) => setIncome(event.target.value)}
                className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-sky-400"
                aria-label="Monthly gross income"
              />
              {!incomeParsed.ok ? (
                <p className="mt-2 text-sm font-medium text-rose-700">
                  {incomeParsed.error}
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-slate-100 px-4 py-3">
                <div className="text-xs font-semibold text-slate-700">
                  Rule
                </div>
                <div className="mt-1 text-xl font-bold text-slate-950">
                  {multiplierLabel}
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-6 overflow-hidden rounded-[1.5rem] bg-sky-50"
            aria-live="polite"
          >
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />
            <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
              <div className="rounded-2xl bg-white px-4 py-4">
                <div className="text-sm font-semibold text-slate-800">
                  Income required
                </div>
                <div className="mt-2 text-3xl font-extrabold text-emerald-700 sm:text-4xl">
                  {formatMoney(requiredIncome, currency)}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Monthly gross income needed for the rent entered above.
                </p>
              </div>

              <div className="rounded-2xl bg-white px-4 py-4">
                <div className="text-sm font-semibold text-slate-800">
                  Maximum rent from income
                </div>
                <div className="mt-2 text-3xl font-extrabold text-emerald-700 sm:text-4xl">
                  {formatMoney(maxRent, currency)}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Rent cap implied by the monthly gross income entered above.
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-3 sm:col-span-2">
                <div className="text-sm font-semibold text-emerald-800">
                  Formula
                </div>
                <p className="mt-1 leading-7 text-slate-800">
                  Required income = rent x {multiplierLabel}. Max rent = income
                  / {multiplierLabel}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14 rc-no-print">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.82fr)]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-sky-900">
              What the {multiplierLabel} rent rule means
            </h2>
            <p className="mt-3 leading-8 text-slate-700">{explanation}</p>
            <p className="mt-4 leading-8 text-slate-700">
              This is a screening shortcut, not a full budget. It does not know
              your debts, utilities, deposits, savings target, local rules, or
              whether a landlord uses gross income or net income.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-sky-900">
              Real situations
            </h2>
            <div className="mt-4 space-y-4">
              {examples.map((example) => (
                <div key={example.title} className="relative pl-5">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2.5 h-2.5 w-2.5 rounded-full bg-emerald-500"
                  />
                  <h3 className="font-semibold text-slate-950">
                    {example.title}
                  </h3>
                  <p className="mt-1 leading-7 text-slate-700">
                    {example.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sky-50 px-6 py-14 rc-no-print">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold tracking-tight text-sky-900">
            Related calculators
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="cursor-pointer rounded-2xl bg-white px-5 py-4 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50"
              >
                <span className="block font-semibold text-sky-900">
                  {link.label}
                </span>
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

      <section id="faq" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-sky-800">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-3">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl bg-slate-50 px-5 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="text-slate-700 transition-transform group-open:rotate-180"
                  >
                    v
                  </span>
                </summary>
                <div className="mt-2 max-w-prose leading-relaxed text-slate-700">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
