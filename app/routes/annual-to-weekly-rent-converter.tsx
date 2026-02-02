import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/annual-to-weekly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Annual to Weekly Rent Converter (÷ 52 vs 365-Day Week)";
  const description =
    "Instantly convert annual rent to a weekly amount using annual ÷ 52. Also compare against a true 365-day weekly equivalent (annual × 7 ÷ 365), plus biweekly and 28-day views. Exact decimals, private, no signup.";

  const url = "https://www.rentconverter.com/annual-to-weekly-rent-converter";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "annual to weekly rent converter, annual rent to weekly, yearly to weekly rent, annual divided by 52, annual ÷ 52, weekly rent equivalent, annual × 7 ÷ 365, 365 day year weekly",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: ogImage },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },

    { tagName: "link", rel: "canonical", href: url },
  ];
};

type Period =
  | "hourly"
  | "daily"
  | "weekly_budget_52"
  | "weekly_365"
  | "biweekly"
  | "every_4_weeks"
  | "monthly"
  | "annual";

const ROUTE_WHITELIST = new Set<string>([
  // Home
  "/",

  // Rent converter hub
  "/rent-converter",

  // Frequency converters
  "/monthly-to-weekly-rent-converter",
  "/weekly-to-monthly-rent-converter",
  "/weekly-to-annual-rent-converter",
  "/weekly-to-biweekly-rent-converter",

  "/biweekly-to-weekly-rent-converter",
  "/biweekly-to-monthly-rent-converter",
  "/biweekly-to-annual-rent-converter",

  "/monthly-to-annual-rent-converter",
  "/annual-to-monthly-rent-converter",

  "/monthly-to-daily-rent-converter",
  "/daily-to-monthly-rent-converter",

  "/monthly-to-hourly-rent-converter",
  "/hourly-to-monthly-rent-converter",

  "/hourly-to-annual-rent-converter",
  "/annual-to-hourly-rent-converter",

  "/annual-to-weekly-rent-converter",
  "/annual-to-biweekly-rent-converter",
  "/monthly-to-biweekly-rent-converter",

  // Rent calculators
  "/rent-calculator",
  "/rent-per-day-calculator",
  "/rent-per-week-calculator",
  "/rent-paid-every-4-weeks-calculator",
  "/rent-per-paycheck-calculator",
  "/rent-split-calculator",
  "/rent-due-date-calculator",

  // Affordability and income
  "/rent-as-percentage-of-income-calculator",
  "/how-much-rent-can-i-afford-calculator",
  "/rent-after-tax-income-calculator",
  "/rent-vs-take-home-pay-calculator",

  // Rent increases
  "/rent-increase-calculator",
  "/rent-increase-percentage-calculator",
  "/rent-after-increase-calculator",

  // Rent vs buy
  "/rent-vs-buy-calculator",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

const SUPPORTED_CURRENCIES = [
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

type Currency = (typeof SUPPORTED_CURRENCIES)[number];

function isCurrency(x: string): x is Currency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(x);
}

const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedAmount = {
  ok: boolean;
  scaled?: bigint;
  normalized?: string;
  warnings: string[];
  error?: string;
};

function clampScaled(v: bigint, min: bigint, max: bigint): bigint {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0)
    return { ok: false, error: "Enter an annual rent amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: "Enter a valid number (example: 24000 or 24000.50).",
      warnings,
    };

  if (s.includes("-")) {
    if (!s.startsWith("-") || s.slice(1).includes("-")) {
      return {
        ok: false,
        error: "Enter a valid number (misplaced minus sign).",
        warnings,
      };
    }
    return { ok: false, error: "Annual rent must be 0 or greater.", warnings };
  }

  const lastDot = s.lastIndexOf(".");
  const lastComma = s.lastIndexOf(",");
  let decimalSep: "." | "," | null = null;

  if (lastDot !== -1 && lastComma !== -1) {
    decimalSep = lastDot > lastComma ? "." : ",";
  } else if (lastDot !== -1) {
    decimalSep = ".";
  } else if (lastComma !== -1) {
    const parts = s.split(",");
    if (parts.length === 2) {
      const before = parts[0] ?? "";
      const after = parts[1] ?? "";
      if (/^\d{1,2}$/.test(after)) {
        decimalSep = ",";
      } else if (/^\d{3}$/.test(after) && /^\d{1,3}$/.test(before)) {
        decimalSep = null;
        warnings.push(
          `Interpreted "${s0}" as thousands grouping. If you meant a decimal, use a dot like "1.234".`,
        );
      } else {
        return {
          ok: false,
          error:
            'That format is ambiguous. Try "1234.56" or "1,234.56" or "1234,56".',
          warnings,
        };
      }
    } else {
      decimalSep = null;
    }
  }

  let intPart = s;
  let fracPart = "";

  if (decimalSep) {
    const split = s.split(decimalSep);
    if (split.length > 2)
      return {
        ok: false,
        error: "Enter a valid number (too many decimal separators).",
        warnings,
      };
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  intPart = intPart.replace(/^0+(?=\d)/, "");

  if (!/^\d+$/.test(intPart))
    return {
      ok: false,
      error: "Enter a valid number (invalid digits).",
      warnings,
    };

  if (fracPart && !/^\d+$/.test(fracPart))
    return {
      ok: false,
      error: "Enter a valid number (invalid decimals).",
      warnings,
    };

  const maxDec = Number(MAX_DECIMALS);
  const fracRaw = fracPart ?? "";
  const fracCapped =
    fracRaw.length > maxDec ? fracRaw.slice(0, maxDec) : fracRaw;
  const fracPadded = fracCapped.padEnd(maxDec, "0");

  const scaled =
    BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  const maxAnnual = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxAnnual);
  if (clamped !== scaled)
    warnings.push("Value was clamped to the supported maximum for safety.");

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

function mulDivScaled(
  valueScaled: bigint,
  mulNum: bigint,
  divDen: bigint,
): bigint {
  if (divDen === 0n) return 0n;
  return (valueScaled * mulNum) / divDen;
}

function roundScaledForDisplay(valueScaled: bigint, decimals: number): bigint {
  const d = Math.max(0, Math.min(12, Math.trunc(decimals)));
  if (d >= 12) return valueScaled;

  const drop = 12 - d;
  const factor = 10n ** BigInt(drop);
  return ((valueScaled + factor / 2n) / factor) * factor;
}

function formatMoneyFromScaled(
  valueScaled: bigint,
  currency: Currency,
  decimals: number,
  roundDisplay: boolean,
): string {
  const d = Math.max(0, Math.min(12, Math.trunc(decimals)));
  const scaled = roundDisplay
    ? roundScaledForDisplay(valueScaled, d)
    : valueScaled;

  const negative = scaled < 0n;
  const abs = scaled < 0n ? -scaled : scaled;

  // Decide how many decimals to show when not rounding:
  // show up to 12, trimming trailing zeros.
  let digits = d;
  if (!roundDisplay) {
    const fracPart = abs % SCALE;
    if (fracPart === 0n) {
      digits = 0;
    } else {
      const fracFull = fracPart.toString().padStart(12, "0");
      const trimmed = fracFull.replace(/0+$/g, "");
      digits = Math.min(12, Math.max(0, trimmed.length));
    }
  }

  const intPart = abs / SCALE;
  const fracPart = abs % SCALE;

  const groupedInt = new Intl.NumberFormat(undefined, {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(Number(intPart));

  const fracStrFull = fracPart.toString().padStart(12, "0");
  const fracShown =
    digits > 0 ? fracStrFull.slice(0, digits).padEnd(digits, "0") : "";

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  // Build by parts to preserve locale currency placement without formatting the actual value as a float.
  const parts = fmt.formatToParts(-1);
  const decimalPart = parts.find((p) => p.type === "decimal");
  const decimalSep = decimalPart?.value ?? ".";

  let out = "";
  for (const p of parts) {
    if (p.type === "minusSign") {
      if (negative) out += p.value;
      continue;
    }
    if (p.type === "integer") {
      out += groupedInt;
      continue;
    }
    if (p.type === "group") {
      // We already grouped ourselves.
      continue;
    }
    if (p.type === "decimal") {
      if (digits > 0) out += decimalSep;
      continue;
    }
    if (p.type === "fraction") {
      if (digits > 0) out += fracShown;
      continue;
    }
    out += p.value;
  }

  return out;
}

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "-";
  const d = Math.max(0, Math.min(6, Math.trunc(displayDecimals)));
  return `${(n * 100).toFixed(d)}%`;
}

function ratioToNumber(numer: bigint, denom: bigint, precision = 6): number {
  if (denom === 0n) return 0;
  const p = Math.max(0, Math.min(12, Math.trunc(precision)));
  const factor = 10n ** BigInt(p);
  const scaled = (numer * factor) / denom;
  return Number(scaled) / 10 ** p;
}

function annualToPeriodScaled(annualScaled: bigint, period: Period): bigint {
  switch (period) {
    case "annual":
      return annualScaled;
    case "weekly_budget_52":
      return mulDivScaled(annualScaled, 1n, 52n);
    case "weekly_365":
      return mulDivScaled(annualScaled, 7n, 365n);
    case "biweekly":
      return mulDivScaled(annualScaled, 14n, 365n);
    case "every_4_weeks":
      return mulDivScaled(annualScaled, 28n, 365n);
    case "monthly":
      return mulDivScaled(annualScaled, 1n, 12n);
    case "daily":
      return mulDivScaled(annualScaled, 1n, 365n);
    case "hourly":
      return mulDivScaled(annualScaled, 1n, 365n * 24n);
    default:
      return annualScaled;
  }
}

function impliedAnnualFromWeeklyBudget52(weeklyScaled: bigint): bigint {
  return weeklyScaled * 52n;
}
function impliedAnnualFromWeekly365(weeklyScaled: bigint): bigint {
  return mulDivScaled(weeklyScaled, 365n, 7n);
}
function impliedAnnualFromEvery4Weeks13(fourWeekScaled: bigint): bigint {
  return fourWeekScaled * 13n;
}

function safeParseBoolean(raw: string | null, fallback: boolean): boolean {
  if (raw === null) return fallback;
  try {
    const v = JSON.parse(raw);
    return typeof v === "boolean" ? v : fallback;
  } catch {
    return fallback;
  }
}

function validateDisplayDecimals(raw: string | null): 0 | 2 | 4 | 6 {
  const n = raw === null ? NaN : Number(raw);
  if (n === 0 || n === 2 || n === 4 || n === 6) return n;
  return 2;
}

function formatGroupedPreviewFromNormalized(normalized: string): string {
  const s = (normalized ?? "").trim();
  if (!s) return s;
  const [intRaw, fracRaw] = s.split(".");
  const intPart = intRaw && /^\d+$/.test(intRaw) ? intRaw : "0";
  const groupedInt = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(Number(intPart));
  if (fracRaw === undefined || fracRaw === "") return groupedInt;
  return `${groupedInt}.${fracRaw}`;
}

export default function AnnualToWeeklyRentConverter() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "24000";
    const saved = window.localStorage.getItem("rc_atw_amount");
    return saved ?? "24000";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_atw_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<0 | 2 | 4 | 6>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_atw_display_decimals");
    return validateDisplayDecimals(saved);
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("rc_atw_round_display");
    return safeParseBoolean(saved, true);
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_atw_amount", amount);
      window.localStorage.setItem("rc_atw_currency", currency);
      window.localStorage.setItem(
        "rc_atw_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_atw_round_display",
        JSON.stringify(roundDisplay),
      );
    } catch {
      return;
    }
  }, [amount, currency, displayDecimals, roundDisplay]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedAnnual = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const annualScaled = parsedAnnual.ok ? (parsedAnnual.scaled as bigint) : 0n;
  const canShowResults = parsedAnnual.ok;

  const amountDisplayValue = useMemo(() => {
    if (amountFocused) return amount;
    if (parsedAnnual.ok && parsedAnnual.normalized) {
      return formatGroupedPreviewFromNormalized(parsedAnnual.normalized);
    }
    return amount;
  }, [amountFocused, amount, parsedAnnual.ok, parsedAnnual.normalized]);

  const breakdownScaled = useMemo(() => {
    if (!parsedAnnual.ok) return null;

    const weeklyBudget = annualToPeriodScaled(annualScaled, "weekly_budget_52");
    const weekly365 = annualToPeriodScaled(annualScaled, "weekly_365");
    const biweekly = annualToPeriodScaled(annualScaled, "biweekly");
    const every4w = annualToPeriodScaled(annualScaled, "every_4_weeks");
    const monthly = annualToPeriodScaled(annualScaled, "monthly");
    const daily = annualToPeriodScaled(annualScaled, "daily");
    const hourly = annualToPeriodScaled(annualScaled, "hourly");
    const annual = annualScaled;

    const weeklyBudgetMinus365 = weeklyBudget - weekly365;
    const weeklyBudgetMinus365Pct = ratioToNumber(
      weeklyBudgetMinus365,
      weekly365,
      8,
    );

    const impliedAnnualWeekly52 = impliedAnnualFromWeeklyBudget52(weeklyBudget);
    const impliedAnnualWeekly365 = impliedAnnualFromWeekly365(weekly365);
    const impliedAnnual4w13 = impliedAnnualFromEvery4Weeks13(every4w);

    const diff4w13_vs_weekly52 = impliedAnnual4w13 - impliedAnnualWeekly52;
    const diff4w13_vs_weekly52Pct = ratioToNumber(
      diff4w13_vs_weekly52,
      impliedAnnualWeekly52,
      8,
    );

    const reconstructionGapWeekly52 = annual - impliedAnnualWeekly52;
    const reconstructionGapWeekly365 = annual - impliedAnnualWeekly365;

    return {
      hourly,
      daily,
      weeklyBudget,
      weekly365,
      biweekly,
      every4w,
      monthly,
      annual,
      weeklyBudgetMinus365,
      weeklyBudgetMinus365Pct,
      impliedAnnualWeekly52,
      impliedAnnualWeekly365,
      impliedAnnual4w13,
      diff4w13_vs_weekly52,
      diff4w13_vs_weekly52Pct,
      reconstructionGapWeekly52,
      reconstructionGapWeekly365,
    };
  }, [parsedAnnual.ok, annualScaled]);

  const fmt = (scaled: bigint) =>
    formatMoneyFromScaled(scaled, currency, displayDecimals, roundDisplay);

  const weeklyHeadlineScaled = breakdownScaled?.weeklyBudget ?? 0n;

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedKey(null), 1400);
    } catch {
      setCopiedKey("copy_failed");
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopiedKey(null), 1400);
    }
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What weekly formula does this page use?",
      a: "The headline result uses a weekly budgeting definition: weekly = annual ÷ 52. This is the most common annual-to-weekly conversion used for weekly budgeting.",
    },
    {
      q: "Why is there also a 365-day weekly amount?",
      a: "Some comparisons are day-based (daily, hourly, 14-day, 28-day). The 365-day weekly equivalent uses annual × 7 ÷ 365 so week values stay aligned with those day-based conversions.",
    },
    {
      q: "Which weekly number should I use?",
      a: "Use annual ÷ 52 for a simple weekly budgeting figure. Use annual × 7 ÷ 365 when you want weekly aligned to a 365-day year (useful when comparing to daily, hourly, or 28-day cycles).",
    },
    {
      q: "Why can a 28-day schedule feel different than weekly?",
      a: "A 28-day billing cycle often lands on 13 payments per year. That can imply a different annual total than 52 weekly payments, even if the advertised periodic price sounds similar.",
    },
    {
      q: "Why do I see many decimals when rounding is off?",
      a: "Some conversions produce repeating decimals. When rounding is off, the tool shows up to 12 decimals without forcing trailing zeros, so you can see the computed precision.",
    },
    {
      q: "Does currency selection convert exchange rates?",
      a: "No. Currency selection only changes formatting. Convert currencies elsewhere before entering your annual total.",
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.rentconverter.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Annual to Weekly Rent Converter",
        item: "https://www.rentconverter.com/annual-to-weekly-rent-converter",
      },
    ],
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .rc-no-print { display: none !important; }
              .rc-print-block { break-inside: avoid; }
              main { background: #fff !important; }
              a { text-decoration: none !important; color: #000 !important; }
            }
          `,
        }}
      />

      <section className=" pb-4 rc-no-print">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          /{" "}
          <a href={safeHref("/rent-converter")} className="hover:underline">
            Rent Converter
          </a>{" "}
          / Annual to Weekly Rent Converter
        </nav>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:px-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-xl capitalize sm:text-4xl font-bold text-sky-800">
              Annual to weekly converter
            </h1>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Annual rent total
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 24000 or 24000.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsedAnnual.ok}
                  aria-describedby="rc-amount-help rc-amount-error"
                />
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value)
                        ? (e.target.value as Currency)
                        : "USD",
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {!parsedAnnual.ok ? (
                <p
                  id="rc-amount-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {parsedAnnual.error}
                </p>
              ) : parsedAnnual.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedAnnual.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Display settings
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">From</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    Annual
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    Weekly (annual ÷ 52)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            <div className="text-sm text-slate-600">Weekly equivalent</div>

            {!canShowResults ? (
              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700">
                <div className="font-semibold">No result to show yet</div>
                <p className="mt-1 text-sm text-slate-600">
                  Enter a valid annual rent total above to see the weekly
                  equivalent and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
                    {fmt(weeklyHeadlineScaled)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {fmt(annualScaled)} annual ≈{" "}
                    <strong>{fmt(weeklyHeadlineScaled)}</strong> per week
                    (annual ÷ 52)
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("weekly", fmt(weeklyHeadlineScaled))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "weekly" ? "Copied" : "Copy weekly amount"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Annual: ${fmt(annualScaled)} | Weekly (annual ÷ 52): ${fmt(
                            weeklyHeadlineScaled,
                          )} | Also shown: Weekly (annual × 7 ÷ 365): ${fmt(breakdownScaled!.weekly365)}`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "summary" ? "Copied" : "Copy summary"}
                    </button>
                    {copiedKey === "copy_failed" ? (
                      <span className="self-center text-sm font-semibold text-rose-700">
                        Copy failed
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      [
                        "Hourly (365-day year)",
                        breakdownScaled!.hourly,
                        "hourly",
                      ],
                      ["Daily (365-day year)", breakdownScaled!.daily, "daily"],
                      [
                        "Weekly (annual ÷ 52)",
                        breakdownScaled!.weeklyBudget,
                        "weekly_budget_52",
                      ],
                      [
                        "Weekly (annual × 7 ÷ 365)",
                        breakdownScaled!.weekly365,
                        "weekly_365",
                      ],
                      [
                        "Every 2 weeks (14 days)",
                        breakdownScaled!.biweekly,
                        "biweekly",
                      ],
                      [
                        "Every 4 weeks (28 days)",
                        breakdownScaled!.every4w,
                        "every_4_weeks",
                      ],
                      [
                        "Monthly (annual ÷ 12)",
                        breakdownScaled!.monthly,
                        "monthly",
                      ],
                      ["Annual", breakdownScaled!.annual, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Weekly definition comparison
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        (Annual ÷ 52) minus (Annual × 7 ÷ 365) ={" "}
                        <strong className="text-slate-900">
                          {fmt(breakdownScaled!.weeklyBudgetMinus365)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference ≈{" "}
                        <strong className="text-slate-900">
                          {formatPercent(
                            breakdownScaled!.weeklyBudgetMinus365Pct,
                            2,
                          )}
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      These are two common conventions. The headline matches
                      annual-to-weekly budgeting intent (÷ 52). The 365-day
                      weekly aligns with day-based conversions.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      28-day schedule context (13 payments)
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Implied annual (weekly ÷ 52) × 52
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.impliedAnnualWeekly52)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Illustrative reconstruction
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Implied annual (4-week) × 13
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.impliedAnnual4w13)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Common 28-day schedule
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">Difference</div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.diff4w13_vs_weekly52)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          ≈{" "}
                          {formatPercent(
                            breakdownScaled!.diff4w13_vs_weekly52Pct,
                            2,
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      This panel is illustrative. It shows why every 4 weeks can
                      imply a different annual total than weekly budgeting,
                      because 28-day billing commonly lands on 13 payments.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Precision note (fixed-point math)
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      Dividing by 52 or by 365/7 can produce a repeating
                      decimal. This tool keeps up to 12 decimals internally and
                      does not round during computation. If you reconstruct an
                      annual total by multiplying a weekly figure back, you can
                      see a small remainder due to truncation at 12 decimals.
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Input annual minus (weekly ÷ 52) × 52
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.reconstructionGapWeekly52)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Input annual minus (weekly 365-day) × 365 ÷ 7
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.reconstructionGapWeekly365)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Definitions: weekly (headline) = annual ÷ 52. Day-based conversions
            use a 365-day year. Biweekly = 14 days and 4-week = 28 days. Results
            are for budgeting and comparison, not a promise of exact due dates
            or billed totals.
          </p>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">
                Rounding (display only)
              </div>
              <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4"
                />
                Round displayed values
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Computation preserves up to 12 decimals internally.
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-500">Displayed decimals</div>
              <select
                value={displayDecimals}
                onChange={(e) =>
                  setDisplayDecimals(validateDisplayDecimals(e.target.value))
                }
                disabled={!roundDisplay}
                className={`mt-1 rounded-xl border bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 ${
                  roundDisplay
                    ? "border-slate-300"
                    : "border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                aria-label="Displayed decimals"
              >
                <option value={0}>0</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </select>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="font-semibold">
              What “weekly” means on this page
            </div>
            <p className="mt-1 text-xs text-slate-600">
              The headline weekly result is <strong>annual ÷ 52</strong>{" "}
              (budgeting view). For comparison, the tool also shows{" "}
              <strong>annual × 7 ÷ 365</strong> (365-day-year weekly) so you can
              see the difference.
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-sm rc-no-print"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-slate-100/70 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
        </div>

        <div className="relative p-6 sm:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-800 tracking-tight leading-tight">
                    How the annual to weekly rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This route starts with a single source value (your annual
                    rent total) and expresses it as a weekly amount. The
                    headline weekly result matches “annual ÷ 52” budgeting
                    intent. A second weekly line is shown using a 365-day model
                    (annual × 7 ÷ 365) so you can compare the two definitions
                    without mixing them.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Weekly budget: ÷ 52
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    365-day weekly shown
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual total
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    HEADLINE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual ÷ 52
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    COMPARE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual × 7 ÷ 365
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    EXTRAS
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    14-day + 28-day lines
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: what you enter */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16M4 12h12M4 17h14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        Step 1: Enter an annual rent total
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      “Annual rent” here means the yearly total you want the
                      tool to treat as rent. It is a single source value. The
                      calculator does not guess what the number includes.
                      Utilities, taxes, fees, deposits, and discounts are not
                      added or removed. If you want a different definition of
                      “annual,” change the input, not the settings.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Input handling
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          Thousands separators (commas) are treated as grouping:{" "}
                          <span className="font-semibold text-slate-900">
                            1,234
                          </span>{" "}
                          → 1234
                        </li>
                        <li>
                          Decimals are supported and preserved:{" "}
                          <span className="font-semibold text-slate-900">
                            30000.50
                          </span>
                          ,{" "}
                          <span className="font-semibold text-slate-900">
                            .5
                          </span>
                          ,{" "}
                          <span className="font-semibold text-slate-900">
                            12.
                          </span>
                        </li>
                        <li>
                          If an input format is ambiguous, the correct behavior
                          is a warning or an error instead of guessing
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: headline weekly */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 7h10v10H7z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        Step 2: Compute weekly budgeting as annual ÷ 52
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The headline weekly output on this route uses a 52-week
                      budgeting split. That means the annual total is divided
                      into 52 equal weekly amounts. This matches the route’s
                      “annual-to-weekly” intent and produces a simple weekly
                      number tied directly to the annual input.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Headline formula
                      </div>
                      <p className="mt-2">
                        <span className="font-semibold text-slate-900">
                          Weekly (budgeting)
                        </span>{" "}
                        = annual rent ÷ 52
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        This is the primary result shown at the top. Any
                        rounding applied is display-only.
                      </p>
                    </div>

                    <p>
                      If you see two weekly values on the page, the labels
                      matter. One is the budgeting weekly (÷ 52). The other is a
                      time-length weekly derived from a 365-day model. They are
                      close, but not identical, and the page shows both so you
                      do not accidentally compare different definitions of
                      “weekly.”
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: 365-day weekly comparison */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M12 5v14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        The 365-day weekly equivalent (shown for alignment)
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The tool also shows a weekly value computed by time length
                      so it stays aligned with the day-based breakdown (daily,
                      hourly, and other period lines that come from a 365-day
                      year). This comparison weekly is derived from an annual
                      per-day rate multiplied by seven.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        365-day weekly formula
                      </div>
                      <p className="mt-2">
                        <span className="font-semibold text-slate-900">
                          Weekly (365-day)
                        </span>{" "}
                        = annual rent × 7 ÷ 365
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        This is a comparison line so weekly can be interpreted
                        under the same model as other day-based equivalents.
                      </p>
                    </div>

                    <p>
                      The page keeps both weekly definitions visible because
                      they serve different purposes. The budgeting weekly
                      matches the route’s intent. The 365-day weekly keeps the
                      breakdown consistent with other day-based lines. The
                      calculator should not silently swap one for the other.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: other periods + decimals */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M9 6v12m6-12v12"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-800 tracking-tight">
                        Additional period lines and precision rules
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      Beyond weekly, this route can show biweekly (14-day) and
                      4-week (28-day) equivalents so common pay and billing
                      cycles are visible in one place. These are derived from
                      the same annual total, not from the weekly value, so the
                      breakdown remains anchored to a single source number.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Biweekly definition
                        </div>
                        <p className="mt-2">
                          Biweekly is treated as{" "}
                          <span className="font-semibold text-slate-900">
                            14 days
                          </span>{" "}
                          when shown as a time-based line.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          4-week definition
                        </div>
                        <p className="mt-2">
                          4-week is treated as{" "}
                          <span className="font-semibold text-slate-900">
                            28 days
                          </span>{" "}
                          and shown explicitly as a distinct cycle.
                        </p>
                      </div>
                    </div>

                    <p>
                      Decimals are preserved in computation. If you enter cents
                      or fractional units, the math should keep them. If the UI
                      formats the display to fewer decimals, that should be
                      presentation only. The underlying precision should not be
                      thrown away early.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dark utility callout */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-7">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                >
                  <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sky-500 blur-3xl opacity-20" />
                  <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-500 blur-3xl opacity-30" />
                </div>

                <div className="relative">
                  <div className="text-sm font-semibold text-sky-300">
                    Utility note
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-800">
                    Two weekly definitions can both be correct if they are
                    labeled
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This route’s headline weekly is{" "}
                    <span className="font-semibold text-white">
                      annual ÷ 52
                    </span>
                    . The 365-day weekly line (
                    <span className="font-semibold text-white">
                      annual × 7 ÷ 365
                    </span>
                    ) is shown so weekly can be compared under the same
                    day-based model used in the breakdown. If you are comparing
                    weekly values across pages, make sure you are comparing the
                    same definition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6 rc-no-print">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">
                {f.q}
              </h3>
              <p className="text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are provided for informational, budgeting, and
            comparison purposes only. Calculations are based on standard
            time-period assumptions (including a 365-day year and simplified
            models). Results are estimates, not guarantees.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice.
            Rental costs, affordability, payment schedules, and obligations vary
            by location, landlord, lease terms, and individual circumstances.
            Always review your lease agreement and consult qualified
            professionals before making financial decisions.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Always confirm
            payment schedules and lease terms in your rental agreement.
          </em>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
