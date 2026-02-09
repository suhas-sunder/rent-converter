import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/biweekly-to-annual-rent-converter";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/biweekly-to-annual-rent-converter";

export const meta: Route.MetaFunction = () => {
  const title = "Biweekly to Annual Rent Converter (Exact 14-Day Year)";
  const description =
    "Instantly convert biweekly rent (every 14 days) into an annual total using a true 365-day year. Exact decimals, full breakdown, and payment-count context (×26 vs 365/14), plus print-to-PDF. Free, private, no signup.";

  const url = `${SITE_URL}${PAGE_PATH}`;
  const ogImage = `${SITE_URL}/og-image.jpg`;

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "biweekly to annual rent, biweekly rent to yearly, every 2 weeks to annual rent, convert biweekly rent to annual, biweekly rent yearly equivalent, biweekly rent calculator annual, biweekly × 26 vs 365/14",
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
  | "weekly"
  | "biweekly"
  | "every_4_weeks"
  | "monthly"
  | "annual";

const PERIOD_LABEL: Record<Period, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks (14 days)",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly (average, 365 ÷ 12)",
  annual: "Annual",
};

// Internal link whitelist
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

/** Decimal-safe fixed-point (up to 12 decimals) */
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

const MAX_SAFE_INT_FOR_NUMBER = 9_000_000_000_000_000n; // ~9e15, JS Number integer precision limit

function absBigInt(x: bigint): bigint {
  return x < 0n ? -x : x;
}

function toNumberSafe(scaled: bigint): number {
  const a = absBigInt(scaled);
  if (a > MAX_SAFE_INT_FOR_NUMBER) return Number.NaN;
  return Number(scaled) / Number(SCALE);
}

function groupInt(intStr: string, groupSep: string): string {
  const s = intStr.replace(/^0+(?=\d)/, "");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep);
}

function getNumberSeparators(): { group: string; decimal: string } {
  const parts = new Intl.NumberFormat(undefined, {
    useGrouping: true,
  }).formatToParts(1000.1);
  const group = parts.find((p) => p.type === "group")?.value ?? ",";
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";
  return { group, decimal };
}

function roundScaledToDecimals(scaled: bigint, decimals: number): bigint {
  const d = Math.max(0, Math.min(12, decimals));
  if (d === 12) return scaled;
  const factor = 10n ** BigInt(12 - d);
  const sign = scaled < 0n ? -1n : 1n;
  const a = absBigInt(scaled);
  const q = a / factor;
  const r = a % factor;
  const half = factor / 2n;
  const qRounded = r >= half ? q + 1n : q;
  return sign * qRounded * factor;
}

function scaledToDecimalStrings(
  scaled: bigint,
  decimals: number,
  trimTrailingZeros: boolean,
): { negative: boolean; intStr: string; fracStr: string } {
  const d = Math.max(0, Math.min(12, decimals));
  const negative = scaled < 0n;
  const a = absBigInt(scaled);
  const intPart = a / SCALE;
  const fracPart = a % SCALE;

  let fracStr = "";
  if (d > 0) {
    fracStr = fracPart.toString().padStart(12, "0").slice(0, d);
    if (trimTrailingZeros) {
      fracStr = fracStr.replace(/0+$/g, "");
    }
  }
  return { negative, intStr: intPart.toString(), fracStr };
}

function formatCurrencyFromScaled(
  scaled: bigint,
  currency: Currency,
  roundDisplay: boolean,
  displayDecimals: number,
): string {
  let digits = 12;

  if (roundDisplay) {
    digits = Math.max(0, Math.min(12, displayDecimals));
  } else {
    // Show up to 12 decimals but trim trailing zeros for display.
    const a = absBigInt(scaled);
    const fracPart = a % SCALE;
    if (fracPart === 0n) {
      digits = 0;
    } else {
      const fracFull = fracPart.toString().padStart(12, "0");
      const trimmed = fracFull.replace(/0+$/g, "");
      digits = Math.min(12, Math.max(0, trimmed.length));
    }
  }

  const scaledForDisplay = roundDisplay
    ? roundScaledToDecimals(scaled, digits)
    : scaled;

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaledForDisplay,
    digits,
    !roundDisplay, // trim only when not rounding to fixed digits
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  // Build by parts so we keep locale currency placement and symbols without using floats for the value.
  const parts = fmt.formatToParts(-1);
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
      if (digits > 0 && fracStr.length > 0) out += decimal;
      continue;
    }
    if (p.type === "fraction") {
      if (digits > 0 && fracStr.length > 0) out += fracStr;
      continue;
    }
    out += p.value;
  }

  return out || "-";
}

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "-";
  return `${(n * 100).toFixed(Math.max(0, Math.min(6, displayDecimals)))}%`;
}

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0)
    return { ok: false, error: "Enter a biweekly rent amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: "Enter a valid number (example: 900 or 900.50).",
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
    return { ok: false, error: "Rent must be 0 or greater.", warnings };
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
          `Interpreted "${s0}" as thousands grouping (1234). If you meant a decimal, use a dot like "1.234".`,
        );
      } else {
        return {
          ok: false,
          error:
            'That format is ambiguous. Try "1234.56" or "1,234.56" or "1234,56" (comma decimal).',
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

  const maxRent = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxRent);
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

function biweeklyToPeriodScaled(
  biweeklyScaled: bigint,
  period: Period,
): bigint {
  // Base: biweekly is 14 days
  // Convert to daily: biweekly / 14
  // Then scale to target.
  const daily = mulDivScaled(biweeklyScaled, 1n, 14n);

  switch (period) {
    case "biweekly":
      return biweeklyScaled;
    case "annual":
      return mulDivScaled(daily, 365n, 1n);
    case "monthly":
      return mulDivScaled(daily, 365n, 12n);
    case "every_4_weeks":
      return mulDivScaled(daily, 28n, 1n);
    case "weekly":
      return mulDivScaled(daily, 7n, 1n);
    case "daily":
      return daily;
    case "hourly":
      return mulDivScaled(daily, 1n, 24n);
    default:
      return biweeklyScaled;
  }
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

export default function BiweeklyToAnnualRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "900";
    const saved = window.localStorage.getItem("rc_b2a_amount");
    return saved ?? "900";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_b2a_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<0 | 2 | 4 | 6>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_b2a_display_decimals");
    return validateDisplayDecimals(saved);
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("rc_b2a_round_display");
    return safeParseBoolean(saved, true);
  });

  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_b2a_amount", amount);
      window.localStorage.setItem("rc_b2a_currency", currency);
      window.localStorage.setItem(
        "rc_b2a_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_b2a_round_display",
        JSON.stringify(roundDisplay),
      );
    } catch {
      // ignore
    }
  }, [amount, currency, displayDecimals, roundDisplay]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedBiweekly = useMemo(
    () => parseMoneyInputToScaled(amount),
    [amount],
  );
  const biweeklyScaled = parsedBiweekly.ok
    ? (parsedBiweekly.scaled as bigint)
    : 0n;

  const canShowResults = parsedBiweekly.ok;

  const amountDisplayValue = useMemo(() => {
    if (amountFocused) return amount;
    if (parsedBiweekly.ok && parsedBiweekly.normalized) {
      return formatGroupedPreviewFromNormalized(parsedBiweekly.normalized);
    }
    return amount;
  }, [amountFocused, amount, parsedBiweekly.ok, parsedBiweekly.normalized]);

  const breakdownScaled = useMemo(() => {
    if (!parsedBiweekly.ok) return null;

    const hourly = biweeklyToPeriodScaled(biweeklyScaled, "hourly");
    const daily = biweeklyToPeriodScaled(biweeklyScaled, "daily");
    const weekly = biweeklyToPeriodScaled(biweeklyScaled, "weekly");
    const biweekly = biweeklyScaled;
    const every4w = biweeklyToPeriodScaled(biweeklyScaled, "every_4_weeks");
    const monthly = biweeklyToPeriodScaled(biweeklyScaled, "monthly");
    const annual = biweeklyToPeriodScaled(biweeklyScaled, "annual");

    function ratioToNumber(
      numer: bigint,
      denom: bigint,
      precision = 8,
    ): number {
      if (denom === 0n) return 0;
      const p = Math.max(0, Math.min(12, Math.trunc(precision)));
      const factor = 10n ** BigInt(p);
      const scaled = (numer * factor) / denom;
      return Number(scaled) / 10 ** p;
    }

    // Payment-count context: 26 vs 365/14
    const annualVia26 = biweeklyScaled * 26n;
    const annualVia365Day = annual;

    const annualDiff = annualVia365Day - annualVia26;
    const annualDiffPct = ratioToNumber(annualDiff, annualVia26, 8);

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct = ratioToNumber(monthlyMinus4w, every4w, 8);

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annual,

      annualVia26,
      annualVia365Day,

      annualDiff,
      annualDiffPct,

      monthlyMinus4w,
      monthlyMinus4wPct,
    };
  }, [parsedBiweekly.ok, biweeklyScaled]);

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const annualHeadlineScaled = breakdownScaled?.annual ?? 0n;

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How does this convert biweekly rent to annual rent?",
      a: "It treats biweekly as a 14-day amount. The calculator converts biweekly to a daily equivalent (biweekly ÷ 14) and then multiplies by 365 to produce an annual equivalent.",
    },
    {
      q: "Why is the annual result not always exactly biweekly × 26?",
      a: "A 365-day year contains about 26.07 biweekly periods (365 ÷ 14). Some budgets use 26 payments as a shortcut, while a day-based annual equivalence can be slightly higher.",
    },
    {
      q: "Is biweekly the same as twice per month?",
      a: "No. Twice per month is a calendar schedule (24 payments per year). Biweekly is every 14 days (about 26 cycles per year). The annual totals can differ.",
    },
    {
      q: "What assumptions does this tool use?",
      a: "Year = 365 days, week = 7 days, biweekly = 14 days, 4-week = 28 days, month = 365 ÷ 12 days (average). This is for budgeting and comparison, not exact due dates.",
    },
    {
      q: "Does this match my exact lease payments?",
      a: "Not necessarily. Real billing depends on lease terms, due dates, prorations, fees, and what is included in rent.",
    },
    {
      q: "Does the currency selector convert exchange rates?",
      a: "No. It only changes formatting. Convert currencies elsewhere first if needed.",
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
        item: "https://www.rentconverter.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Biweekly to Annual Rent Converter",
        item: "https://www.rentconverter.combiweekly-to-annual-rent-converter",
      },
    ],
  };

  const amountInputId = "rc-b2a-amount";

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .rc-tabular { font-variant-numeric: tabular-nums; }
            .rc-amount { font-variant-numeric: tabular-nums; white-space: nowrap; }
            @media print {
              .rc-no-print { display: none !important; }
              .rc-print-block { break-inside: avoid; }
              main { background: #fff !important; }
              a { text-decoration: none !important; color: #000 !important; }
            }
          `,
        }}
      />

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
              Instant biweekly to annual conversion
            </h1>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-5">
            <div>
              <label
                htmlFor={amountInputId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Biweekly rent amount (every 14 days)
              </label>

              <div className="flex gap-2">
                <input
                  id={amountInputId}
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 900 or 900.50"
                  className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={amount.trim().length > 0 && !parsedBiweekly.ok}
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {!parsedBiweekly.ok ? (
                <p
                  id="rc-amount-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedBiweekly.error}
                </p>
              ) : parsedBiweekly.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedBiweekly.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-2">
                <div className="flex items-center justify-between  px-1">
                  <span className="text-sm font-semibold text-slate-800">
                    {PERIOD_LABEL.biweekly}
                    <span className="mx-2 text-slate-400">→</span>
                    {PERIOD_LABEL.annual}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-7 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block shadow-[0_1px_0_rgba(2,132,199,0.06)] relative overflow-hidden"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="absolute inset-y-0 left-0 w-1.5 bg-sky-200/80" />
            <div className="absolute top-0 left-0 right-0 h-px bg-sky-200/80" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-800">
                  Annual equivalent
                </div>
              </div>

              {!canShowResults ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-800 shadow-sm">
                  <div className="font-semibold">No result to show yet</div>
                  <p className="mt-1 text-sm text-slate-700">
                    Enter a valid biweekly amount above to see the annual
                    equivalent and breakdown.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 rc-tabular leading-none min-h-[3.25rem] sm:min-h-[4rem]">
                      <span className="rc-amount">
                        {fmt(annualHeadlineScaled)}
                      </span>
                    </div>
                  </div>

                  <div className=" grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(
                      [
                        ["Hourly", breakdownScaled!.hourly, "hourly"],
                        ["Daily", breakdownScaled!.daily, "daily"],
                        ["Weekly", breakdownScaled!.weekly, "weekly"],
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
                          "Monthly (average, 365 ÷ 12)",
                          breakdownScaled!.monthly,
                          "monthly",
                        ],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm min-w-0"
                      >
                        <div className="text-xs text-slate-600">{label}</div>
                        <div className="mt-1 text-lg sm:text-xl font-bold text-slate-900 rc-tabular leading-tight">
                          <span className="rc-amount">{fmt(val)}</span>
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2.5 shadow-sm">
                      <div className="text-xs text-slate-600">
                        Payment-count context (26 vs 365 ÷ 14)
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                          <div className="text-xs text-slate-600">
                            Biweekly × 26 (common shortcut)
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900 rc-tabular">
                            <span className="rc-amount">
                              {fmt(breakdownScaled!.annualVia26)}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-slate-600">
                            26 cycles used as a schedule count
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                          <div className="text-xs text-slate-600">
                            365-day annual equivalence (this tool)
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900 rc-tabular">
                            <span className="rc-amount">
                              {fmt(breakdownScaled!.annualVia365Day)}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-slate-600">
                            Uses 365 ÷ 14 ≈ {safeToFixed(365 / 14, 2)} biweekly
                            periods
                          </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                          <div className="text-xs text-slate-600">
                            Difference (365-day minus 26x)
                          </div>
                          <div className="mt-1 text-sm font-bold text-slate-900 rc-tabular">
                            <span className="rc-amount">
                              {fmt(breakdownScaled!.annualDiff)}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-slate-600">
                            ≈{" "}
                            <span className="rc-amount">
                              {formatPercent(breakdownScaled!.annualDiffPct, 2)}
                            </span>{" "}
                            of 26x
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        This comparison is illustrative. Leases may define
                        schedule counts, proration rules, and due-date handling.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="my-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            <div className="font-semibold">Assumptions used on this page</div>
            <ul className="mt-1 list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>1 year = 365 days</li>
              <li>Biweekly = 14 days</li>
              <li>4-week rent = 28 days</li>
              <li>Month = 365 ÷ 12 days (average)</li>
              <li>
                This tool does not assume what is included in “rent” (fees,
                utilities, taxes). Enter the total you want to budget with.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
            >
              Print / Save as PDF
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-slate-600">
                Rounding (display only)
              </div>
              <label className="mt-1 flex items-center gap-2 text-sm sm:text-[0.95rem] text-slate-800">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="cursor-pointer h-4 w-4 rounded border-slate-300 text-sky-600 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
                Round displayed values
              </label>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Calculations use up to 12 decimals internally. If enabled,
                displayed values are rounded to your chosen decimals.
              </p>
            </div>

            <div className="sm:text-right">
              <div className="text-xs text-slate-600">Displayed decimals</div>
              <select
                value={displayDecimals}
                onChange={(e) =>
                  setDisplayDecimals(validateDisplayDecimals(e.target.value))
                }
                className={`mt-1 rounded-xl border bg-white px-3 py-2.5 text-sm sm:text-base font-semibold outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:border-sky-500 ${
                  roundDisplay
                    ? "border-slate-300"
                    : "border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                aria-label="Displayed decimals"
                disabled={!roundDisplay}
              >
                <option value={0}>0</option>
                <option value={2}>2</option>
                <option value={4}>4</option>
                <option value={6}>6</option>
              </select>
            </div>
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
                    How the biweekly to annual rent converter works
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page converts a biweekly rent amount into an annual
                    equivalent using a fixed time-length definition. Biweekly is
                    treated as{" "}
                    <span className="font-semibold text-slate-900">
                      14 days
                    </span>
                    . The tool normalizes your input to a daily rate, then
                    scales it to a 365-day year. The same daily basis is also
                    used to produce a consistent breakdown across weekly, 4-week
                    (28-day), and average monthly equivalents.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Biweekly = 14 days
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Annual uses 365 days
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Biweekly amount
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    NORMALIZE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Daily = ÷ 14
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SCALE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual = × 365
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    BREAKDOWN
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    All periods from daily
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: core conversion */}
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
                        The conversion model (biweekly → daily → annual)
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The tool treats your biweekly number as an amount that
                      covers exactly 14 days. It converts that amount into a
                      per-day rate, then multiplies by 365 to produce the annual
                      equivalent. This approach avoids mixing “payment counts”
                      into the math and makes the assumptions explicit.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Formulas used
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-semibold text-slate-900">
                            Daily
                          </span>{" "}
                          = biweekly ÷ 14
                        </li>
                        <li>
                          <span className="font-semibold text-slate-900">
                            Annual
                          </span>{" "}
                          = daily × 365
                        </li>
                        <li>
                          Combined:{" "}
                          <span className="font-semibold text-slate-900">
                            Annual = biweekly × 365 ÷ 14
                          </span>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        Biweekly is treated as a 14-day period. Annual uses a
                        fixed 365-day year.
                      </p>
                    </div>

                    <p>
                      If your listing uses “biweekly” as a vague label, this
                      page still produces a clear answer because it commits to a
                      single definition. Biweekly here does not mean “twice a
                      month.” It means every 14 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: breakdown */}
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
                        Why all other periods come from the daily basis
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      Once the tool has a daily rate, every other period can be
                      derived without changing assumptions. That is why the
                      breakdown stays consistent. It avoids a common error where
                      a “weekly” line is computed one way, then a “monthly” line
                      is computed with a different implied model.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Fixed-length periods
                        </div>
                        <p className="mt-2">
                          Weekly uses 7 days. 4-week uses 28 days. Biweekly uses
                          14 days. These are direct multiples of daily.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Average month
                        </div>
                        <p className="mt-2">
                          Monthly breakdowns use an average month length of 365
                          ÷ 12 days so the year reconciles cleanly.
                        </p>
                      </div>
                    </div>

                    <p>
                      If the page shows a monthly line, it is an average-month
                      equivalent derived from the same annual basis. If it shows
                      a 4-week line, it is explicitly labeled as 28 days. The
                      point is that you can compare across billing labels
                      without the calculator quietly switching definitions.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: parsing + decimals */}
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
                        Input formats, ambiguity handling, and rounding
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The biweekly input is parsed as a decimal amount.
                      Thousands separators are treated as grouping. Currency
                      symbols may be present and should be ignored for numeric
                      parsing. Precision is retained during the math, and
                      rounding (if used) should be applied only when formatting
                      values for display.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Accepted formats
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          <span className="font-semibold text-slate-900">
                            1,234
                          </span>{" "}
                          is interpreted as 1234
                        </li>
                        <li>
                          <span className="font-semibold text-slate-900">
                            1.234
                          </span>{" "}
                          is interpreted as 1.234
                        </li>
                        <li>
                          Decimal edge formats are supported:{" "}
                          <span className="font-semibold text-slate-900">
                            .5
                          </span>{" "}
                          and{" "}
                          <span className="font-semibold text-slate-900">
                            12.
                          </span>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        If the input could reasonably mean two different
                        numbers, the correct behavior is a warning or an error
                        instead of a guessed output.
                      </p>
                    </div>

                    <p>
                      A practical check is that the annual number should scale
                      linearly with the biweekly input. If you double the
                      biweekly amount, the annual equivalent should double as
                      well. That is a basic consistency property of this
                      converter.
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
                    “Biweekly” is locked to 14 days on this page
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    This converter uses a time-length definition: daily is
                    computed as biweekly ÷ 14 and annual is derived as daily ×
                    365. If you need a different assumption (for example,
                    calendar-driven due dates), this page is not trying to model
                    that schedule. It is producing clean equivalents under
                    explicit, fixed period lengths.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm sm:text-[0.95rem] text-slate-600">
          <a
            href={safeHref("/")}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
          >
            Home
          </a>{" "}
          / Biweekly to Annual Rent Converter
        </nav>
      </section>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
