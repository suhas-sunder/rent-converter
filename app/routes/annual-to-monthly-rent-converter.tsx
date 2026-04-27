import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/annual-to-monthly-rent-converter";
import Assumptions from "~/client/components/layout/Assumptions";
import FourWeekVsMonthly from "~/client/components/layout/FourWeekVsMonthly";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/annual-to-monthly-rent-converter/HowItWorks";
import ToolFit from "~/client/components/annual-to-monthly-rent-converter/ToolFit";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/annual-to-monthly-rent-converter";

export const meta: Route.MetaFunction = () => {
  const title = "Free Annual/Monthly Rental Rate Calculator";
  const description =
    "Convert annual rent to rent per calendar month. See the yearly to monthly rent formula, instant result, 4-week comparison, and export options.";

  const url = `${SITE_URL}${PAGE_PATH}`;

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "annual to monthly rent, yearly to monthly rent, true monthly rent, annual rent to monthly calculator, 4 week rent vs monthly, 28 day rent vs monthly, 12 vs 13 payments per year, rent converter annual to monthly",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: `${SITE_URL}/og-image.jpg` },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },

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

// Whitelist rule (single source of truth)
//
// Use this everywhere you create internal links.
// If a link is not in ROUTE_WHITELIST, it must not appear anywhere in the UI.
const ROUTE_WHITELIST = new Set<string>([
  "/",
  "/rent-converter",

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

  "/rent-calculator",
  "/rent-per-day-calculator",
  "/rent-per-week-calculator",
  "/rent-paid-every-4-weeks-calculator",
  "/rent-per-paycheck-calculator",
  "/rent-split-calculator",
  "/rent-due-date-calculator",

  "/rent-as-percentage-of-income-calculator",
  "/how-much-rent-can-i-afford-calculator",
  "/rent-after-tax-income-calculator",
  "/rent-vs-take-home-pay-calculator",

  "/rent-increase-calculator",
  "/rent-increase-percentage-calculator",
  "/rent-after-increase-calculator",

  "/rent-vs-buy-calculator",
]);

function SafeLink({
  href,
  className,
  children,
  id,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  if (!ROUTE_WHITELIST.has(href)) return null;
  return (
    <a id={id} href={href} className={className}>
      {children}
    </a>
  );
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

/**
 * Decimal-safe fixed-point representation
 * - Parse money-like inputs into scaled integers (BigInt).
 * - Do not round during computation.
 * - Allow display rounding only (explicit and labeled).
 */
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

function roundScaledToDigits(scaled: bigint, digits: number): bigint {
  const d = Math.max(0, Math.min(12, Math.trunc(digits)));
  const drop = 12 - d;
  const factor = 10n ** BigInt(drop);
  if (factor === 1n) return scaled;

  const half = factor / 2n;
  const neg = scaled < 0n;
  const x = absBigInt(scaled);

  const rounded = (x + half) / factor;
  const back = rounded * factor;
  return neg ? -back : back;
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
    return { ok: false, error: "Enter an annual rent amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 24000 or 24000.50).",
      warnings,
    };
  }

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
    if (split.length > 2) {
      return {
        ok: false,
        error: "Enter a valid number (too many decimal separators).",
        warnings,
      };
    }
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  intPart = intPart.replace(/^0+(?=\d)/, "");

  if (!/^\d+$/.test(intPart)) {
    return {
      ok: false,
      error: "Enter a valid number (invalid digits).",
      warnings,
    };
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    return {
      ok: false,
      error: "Enter a valid number (invalid decimals).",
      warnings,
    };
  }

  const maxDec = Number(MAX_DECIMALS);
  const fracRaw = fracPart ?? "";
  const fracCapped =
    fracRaw.length > maxDec ? fracRaw.slice(0, maxDec) : fracRaw;
  const fracPadded = fracCapped.padEnd(maxDec, "0");

  const scaled =
    BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  const maxAnnual = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxAnnual);
  if (clamped !== scaled) {
    warnings.push("Value was clamped to the supported maximum for safety.");
  }

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

function annualToPeriodScaled(annualScaled: bigint, period: Period): bigint {
  switch (period) {
    case "annual":
      return annualScaled;
    case "monthly":
      // Intent of this route: monthly budgeting view = annual ÷ 12
      return mulDivScaled(annualScaled, 1n, 12n);
    case "every_4_weeks":
      return mulDivScaled(annualScaled, 1n, 13n);
    case "biweekly":
      return mulDivScaled(annualScaled, 1n, 26n);
    case "weekly":
      return mulDivScaled(annualScaled, 1n, 52n);
    case "daily":
      return mulDivScaled(annualScaled, 1n, 365n);
    case "hourly":
      return mulDivScaled(annualScaled, 1n, 2080n);
    default:
      return annualScaled;
  }
}

function buildCsvRow(cols: string[]): string {
  return cols
    .map((c) => {
      const s = String(c ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    })
    .join(",");
}

function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/plain;charset=utf-8",
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
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
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  if (t === 0 || t === 2 || t === 4 || t === 6) return t;
  return 2;
}

function groupDigitsFromNormalized(normalized: string): string {
  const s = String(normalized ?? "").trim();
  if (!s) return "";
  const parts = s.split(".");
  const intPartRaw = parts[0] ?? "0";
  const fracPart = parts[1] ?? "";

  const intPart = intPartRaw.replace(/^0+(?=\d)/, "") || "0";
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fracPart ? `${grouped}.${fracPart}` : grouped;
}

export default function AnnualToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "24000";
    const saved = window.localStorage.getItem("rc_atm_amount");
    return saved ?? "24000";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_atm_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<0 | 2 | 4 | 6>(() => {
    if (typeof window === "undefined") return 2;
    return validateDisplayDecimals(
      window.localStorage.getItem("rc_atm_display_decimals"),
    );
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("rc_atm_round_display");
    return safeParseBoolean(saved, true);
  });

  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_atm_amount", amount);
      window.localStorage.setItem("rc_atm_currency", currency);
      window.localStorage.setItem(
        "rc_atm_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_atm_round_display",
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

  const parsedAnnual = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const annualScaled = parsedAnnual.ok ? (parsedAnnual.scaled as bigint) : 0n;

  const amountPreview = useMemo(() => {
    if (!parsedAnnual.ok) return null;
    const normalized = parsedAnnual.normalized ?? "";
    if (!normalized) return null;
    return groupDigitsFromNormalized(normalized);
  }, [parsedAnnual.ok, parsedAnnual.normalized]);

  const amountInputValue = amountFocused
    ? amount
    : parsedAnnual.ok && amountPreview
      ? amountPreview
      : amount;

  const canShowResults = parsedAnnual.ok;

  const breakdownScaled = useMemo(() => {
    if (!parsedAnnual.ok) return null;

    const hourly = annualToPeriodScaled(annualScaled, "hourly");
    const daily = annualToPeriodScaled(annualScaled, "daily");
    const weekly = annualToPeriodScaled(annualScaled, "weekly");
    const biweekly = annualToPeriodScaled(annualScaled, "biweekly");
    const every4w = annualToPeriodScaled(annualScaled, "every_4_weeks");
    const monthly = annualToPeriodScaled(annualScaled, "monthly");
    const annual = annualScaled;

    // 12 vs 13 payment schedule context
    const annualFromMonthly12 = monthly * 12n;
    const annualFrom4w13 = every4w * 13n;
    const annualFromWeekly52 = weekly * 52n;

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

    const annualDiff_13vs12 = annualFrom4w13 - annualFromMonthly12;
    const annualDiff_13vs12Pct =
      annualFromMonthly12 === 0n
        ? 0
        : Number(annualDiff_13vs12) / Number(annualFromMonthly12);

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annual,

      monthlyMinus4w,
      monthlyMinus4wPct,

      annualFromMonthly12,
      annualFrom4w13,
      annualFromWeekly52,

      annualDiff_13vs12,
      annualDiff_13vs12Pct,
    };
  }, [parsedAnnual.ok, annualScaled]);

  const fmt = (scaled: bigint) =>
    roundDisplay
      ? formatCurrencyFromScaled(scaled, currency, true, displayDecimals)
      : formatCurrencyFromScaled(scaled, currency, false, displayDecimals);

  const monthlyHeadlineScaled = breakdownScaled?.monthly ?? 0n;

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How do you convert annual rent to monthly rent on this page?",
      a: "This page uses a monthly budgeting view: monthly = annual ÷ 12. Your annual total is treated as the source of truth, and the monthly value is the annual-equivalent amount for comparison.",
    },
    {
      q: "Is monthly rent always annual rent ÷ 12?",
      a: "For budgeting and comparison, yes. Real leases can bill on specific dates, include prorations, or use non-monthly cycles. This tool shows the annual-equivalent monthly amount (annual ÷ 12) so different offers can be compared on the same basis.",
    },
    {
      q: "Why does 4-week (28-day) rent differ from monthly rent?",
      a: "A 4-week cycle is 28 days and results in about 13 payments per year, while monthly billing is typically 12 payments. Because the time lengths differ, the annual totals differ even when the sticker prices look similar.",
    },
    {
      q: "What assumptions does this converter use?",
      a: "Year = 365 days, week = 7 days, biweekly = 14 days, 4-week = 28 days, and monthly uses annual ÷ 12 as the budgeting equivalent. Outputs are for comparison, not exact billing dates.",
    },
    {
      q: "Does this tool include utilities, fees, taxes, or deposits?",
      a: "No. The calculator does not guess what is included. Enter only what you personally treat as rent for your budgeting comparison.",
    },
    {
      q: "Does this convert currencies or exchange rates?",
      a: "No. Currency selection only changes formatting. Convert exchange rates externally before using this calculator if needed.",
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
        item: SITE_URL, // no trailing slash
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Annual to Monthly Rent Converter",
        item: `${SITE_URL}${PAGE_PATH}`,
      },
    ],
  };
  const annualInterpreted = useMemo(() => {
    if (!parsedAnnual.ok) return null;
    return fmt(annualScaled);
  }, [parsedAnnual.ok, annualScaled, currency, roundDisplay, displayDecimals]);

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

      <section
        id="converter"
        className="mx-auto max-w-6xl px-6 pb-6 mt-2 sm:mt-6"
      >
        <div className="rounded-2xl pb-6 bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8">
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-center mb-1 sm:mb-0 sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-800 tracking-tight">
              Annual to Monthly Rent Converter
            </h1>

            <div
              id="export-controls"
              className="hidden sm:flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbff]"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <p className="hidden md:flex w-full py-2 text-base text-slate-600">
            Convert annual rent into a monthly amount instantly. Clear
            calculations, no sign-up required.
          </p>

          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Annual rent total
              </label>

              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountInputValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  placeholder="e.g. 24000 or 24000.50"
                  className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-sky-600"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-slate-800">
                Monthly equivalent
              </div>
            </div>

            {!canShowResults ? (
              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700">
                <div className="font-semibold">No result to show yet</div>
                <p className="mt-1 text-sm text-slate-600">
                  Enter a valid annual rent total above to see the monthly
                  equivalent and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                    {fmt(monthlyHeadlineScaled)}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", breakdownScaled!.hourly, "hourly"],
                      ["Daily", breakdownScaled!.daily, "daily"],
                      ["Weekly", breakdownScaled!.weekly, "weekly"],
                      [
                        "2 weeks (14 days)",
                        breakdownScaled!.biweekly,
                        "biweekly",
                      ],
                      [
                        "4 weeks (28 days)",
                        breakdownScaled!.every4w,
                        "every_4_weeks",
                      ],
                      ["Annual", breakdownScaled!.annual, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {fmt(val)}
                      </div>
                    </div>
                  ))}

                  {breakdownScaled && (
                    <FourWeekVsMonthly
                      monthlyMinus4w={breakdownScaled.monthlyMinus4w}
                      monthlyMinus4wPct={breakdownScaled.monthlyMinus4wPct}
                      fmt={fmt}
                      formatPercent={formatPercent as any}
                    />
                  )}
                </div>
              </>
            )}
          </div>

          <Assumptions />
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 rc-no-print">
          <div className="rc-no-print md:hidden flex flex-col sm:flex-row gap-2 mb-4">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
            >
              Print / Save as PDF
            </button>
          </div>
          <Rounding
            roundDisplay={roundDisplay}
            setRoundDisplay={setRoundDisplay}
            displayDecimals={displayDecimals}
            setDisplayDecimals={setDisplayDecimals as any}
          />
        </div>
      </section>

      <HowItWorks />
      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <SafeLink href="/" className="hover:underline">
            Home
          </SafeLink>{" "}
          / Annual to Monthly Rent Converter
        </nav>
      </section>

      <ToolFit />

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
