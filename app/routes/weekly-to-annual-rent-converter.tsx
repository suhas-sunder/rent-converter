import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/weekly-to-annual-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Weekly to Annual Rent Converter" },
  {
    name: "description",
    content:
      "Convert weekly rent to an annual total using annual equivalence (365-day year). Includes a full period breakdown, 52 vs 365-day context, 4-week (28-day) context, and print-to-PDF.",
  },
  {
    name: "keywords",
    content:
      "weekly to annual rent, weekly to yearly rent, convert weekly rent to annual, weekly rent annual total, weekly rent 52 weeks vs 365 days, rent converter weekly to annual",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Weekly to Annual Rent Converter" },
  {
    property: "og:description",
    content:
      "Convert weekly rent to an annual total using annual equivalence (365-day year). Includes breakdowns and 52-payments context.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/weekly-to-annual-rent-converter",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Weekly to Annual Rent Converter" },
  {
    name: "twitter:description",
    content:
      "Convert weekly rent to an annual total using annual equivalence (365-day year). Includes breakdowns and 52-payments context.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/weekly-to-annual-rent-converter",
  },
];

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
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  monthly: "Monthly",
  annual: "Annual",
};

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
 * Internal link whitelist (only routes you know exist).
 * IMPORTANT: Keep route slugs consistent everywhere (canonical/og/url/schema/whitelist/links).
 */
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
  "/rent-affordability-calculator",
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

  // Context pages
  "/rent-paid-weekly-vs-monthly",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

/** Fixed-point math (store up to 12 decimal places exactly) */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedScaled = {
  ok: boolean;
  scaled?: bigint;
  decimals?: number;
  warnings: string[];
  error?: string;
};

function clampScaled(v: bigint, min: bigint, max: bigint): bigint {
  if (v < min) return min;
  if (v > max) return max;
  return v;
}

function toNumberSafe(scaled: bigint): number {
  return Number(scaled) / Number(SCALE);
}

function formatCurrencyFromScaled(
  scaled: bigint,
  currency: Currency,
  roundDisplay: boolean,
  displayDecimals: number,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "—";

  const dec = Math.max(0, Math.min(12, Math.trunc(displayDecimals)));
  const minimumFractionDigits = roundDisplay ? dec : 0;
  const maximumFractionDigits = roundDisplay ? dec : 12;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(n);
}

function formatPreviewFromParsedScaled(p: ParsedScaled): string {
  if (!p.ok || p.scaled === undefined) return "";
  const n = toNumberSafe(p.scaled);
  if (!Number.isFinite(n)) return "";
  const dec = Math.max(0, Math.min(12, Math.trunc(p.decimals ?? 0)));
  return new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(n);
}

/**
 * Accepts: $550, 550, 550.00, .5, 12., 550,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3".
 */
function parseMoneyInputToScaled(raw: string, label = "value"): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: `Enter ${label}.`, warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: `Enter a valid ${label} (example: 550 or 550.00).`,
      warnings,
    };

  if (s.includes("-")) {
    if (!s.startsWith("-") || s.slice(1).includes("-")) {
      return {
        ok: false,
        error: `Enter a valid ${label} (misplaced minus sign).`,
        warnings,
      };
    }
    return { ok: false, error: `${label} must be 0 or greater.`, warnings };
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
          `Interpreted "${s0}" as thousands grouping. If you meant a decimal, use a dot like "1234.56".`,
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
        error: `Enter a valid ${label} (too many decimals).`,
        warnings,
      };
    intPart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") intPart = intPart.replace(/,/g, "");
  else if (decimalSep === ",") intPart = intPart.replace(/\./g, "");
  else intPart = intPart.replace(/[.,]/g, "");

  if (intPart === "") intPart = "0";
  if (!/^\d+$/.test(intPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };
  if (fracPart && !/^\d+$/.test(fracPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };

  const maxDec = Number(MAX_DECIMALS);
  const fracRaw = fracPart ?? "";
  const fracCapped =
    fracRaw.length > maxDec ? fracRaw.slice(0, maxDec) : fracRaw;
  const decimals = fracCapped.length;
  const fracPadded = fracCapped.padEnd(maxDec, "0");

  const scaled =
    BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  const maxVal = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxVal);
  if (clamped !== scaled)
    warnings.push("Value was clamped to the supported maximum.");

  return { ok: true, scaled: clamped, decimals, warnings };
}

function mulDivRound(a: bigint, num: bigint, den: bigint): bigint {
  if (den === 0n) return 0n;
  const sign =
    (a < 0n ? -1n : 1n) * (num < 0n ? -1n : 1n) * (den < 0n ? -1n : 1n);
  const aa = a < 0n ? -a : a;
  const nn = num < 0n ? -num : num;
  const dd = den < 0n ? -den : den;

  const prod = aa * nn;
  const half = dd / 2n;
  const q = (prod + half) / dd;
  return sign < 0n ? -q : q;
}

function annualizeScaled(valueScaled: bigint, period: Period): bigint {
  switch (period) {
    case "annual":
      return valueScaled;
    case "monthly":
      return valueScaled * 12n;
    case "every_4_weeks":
      return mulDivRound(valueScaled, 365n, 28n);
    case "biweekly":
      return mulDivRound(valueScaled, 365n, 14n);
    case "weekly":
      return mulDivRound(valueScaled, 365n, 7n);
    case "daily":
      return valueScaled * 365n;
    case "hourly":
      return valueScaled * 24n * 365n;
    default:
      return 0n;
  }
}

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
  switch (to) {
    case "annual":
      return annualScaled;
    case "monthly":
      return mulDivRound(annualScaled, 1n, 12n);
    case "every_4_weeks":
      return mulDivRound(annualScaled, 28n, 365n);
    case "biweekly":
      return mulDivRound(annualScaled, 14n, 365n);
    case "weekly":
      return mulDivRound(annualScaled, 7n, 365n);
    case "daily":
      return mulDivRound(annualScaled, 1n, 365n);
    case "hourly":
      return mulDivRound(annualScaled, 1n, 365n * 24n);
    default:
      return 0n;
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

function safeParseDisplayDecimals(
  raw: string | null,
  fallback: number,
): number {
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : fallback;
}

function normalizeDisplayDecimals(n: number, fallback: number): number {
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : fallback;
}

export default function WeeklyToAnnualRent() {
  const pageName = "Weekly to Annual Rent Converter";
  const canonicalUrl =
    "https://rentconverter.com/weekly-to-annual-rent-converter";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "550";
    return localStorage.getItem("rc_wta_amount") ?? "550";
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_wta_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;

    const newKey = localStorage.getItem("rc_wta_round_display");
    if (newKey !== null) return safeParseBoolean(newKey, true);

    const oldKey = localStorage.getItem("rc_wta_rounding");
    if (oldKey !== null) return safeParseBoolean(oldKey, true);

    return true;
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rc_wta_display_decimals"),
      2,
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wta_amount", amount);
      localStorage.setItem("rc_wta_currency", currency);
      localStorage.setItem(
        "rc_wta_round_display",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem("rc_wta_display_decimals", String(displayDecimals));

      // Optional: keep old key in sync so you do not break any older code paths.
      localStorage.setItem("rc_wta_rounding", JSON.stringify(roundDisplay));
    } catch {}
  }, [amount, currency, roundDisplay, displayDecimals]);

  const parsed = useMemo(() => {
    const p = parseMoneyInputToScaled(amount, "weekly rent amount");
    const errors: string[] = [];
    if (!p.ok) errors.push(p.error ?? "Enter a weekly rent amount.");
    return { ok: errors.length === 0, errors, warnings: p.warnings, p };
  }, [amount]);

  const amountDisplayValue = useMemo(() => {
    if (isAmountFocused) return amount;
    if (parsed.ok) return formatPreviewFromParsedScaled(parsed.p);
    return amount;
  }, [amount, isAmountFocused, parsed.ok, parsed.p]);

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const weekly = parsed.p.scaled as bigint;

    // Source of truth: annual equivalence (365-day year), starting from weekly.
    const annual = annualizeScaled(weekly, "weekly");

    // Derive other periods from the same annual total
    const hourly = fromAnnualScaled(annual, "hourly");
    const daily = fromAnnualScaled(annual, "daily");
    const biweekly = fromAnnualScaled(annual, "biweekly");
    const fourWeeks = fromAnnualScaled(annual, "every_4_weeks");
    const monthly = fromAnnualScaled(annual, "monthly");

    // Payment-count interpretations
    const annualIf52Payments = weekly * 52n;
    const annualIf53Payments = weekly * 53n;

    const delta52 = annual - annualIf52Payments;
    const pct52 =
      annualIf52Payments !== 0n
        ? toNumberSafe(delta52) / toNumberSafe(annualIf52Payments)
        : Number.NaN;

    const delta53 = annual - annualIf53Payments;
    const pct53 =
      annualIf53Payments !== 0n
        ? toNumberSafe(delta53) / toNumberSafe(annualIf53Payments)
        : Number.NaN;

    const monthlyMinus4w = monthly - fourWeeks;
    const monthlyMinus4wPct =
      fourWeeks !== 0n
        ? toNumberSafe(monthlyMinus4w) / toNumberSafe(fourWeeks)
        : Number.NaN;

    const impliedWeeksPerYear =
      toNumberSafe(weekly) > 0
        ? toNumberSafe(annual) / toNumberSafe(weekly)
        : Number.NaN;

    return {
      ok: true as const,
      warnings: parsed.warnings,
      weekly,
      annual,
      hourly,
      daily,
      biweekly,
      fourWeeks,
      monthly,
      annualIf52Payments,
      annualIf53Payments,
      delta52,
      pct52,
      delta53,
      pct53,
      monthlyMinus4w,
      monthlyMinus4wPct,
      impliedWeeksPerYear,
    };
  }, [parsed]);

  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

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

  const faqData = [
    {
      q: "How does this convert weekly rent to an annual total?",
      a: "It uses annual equivalence: your weekly amount is converted into an annual total using a 365-day year. That annual total is then used for all other period equivalents shown on the page.",
    },
    {
      q: "Why is weekly rent × 52 not always the same as the annual result here?",
      a: "Weekly × 52 assumes exactly 52 weekly payments. A 365-day year is about 52.14 weeks, so a time-based annual equivalent can differ slightly from the payment-count shortcut.",
    },
    {
      q: "What does the “52 payments” comparison represent?",
      a: "It shows a payment-count interpretation (52 weekly payments) next to the 365-day annual-equivalence interpretation, so you can compare both without mixing assumptions.",
    },
    {
      q: "How does weekly rent relate to 4-week (28-day) pricing?",
      a: "A 4-week period is always 28 days. Converting both to an annual basis helps compare weekly listings to 4-week pricing without treating 4 weeks as a calendar month.",
    },
    {
      q: "Does this match exact lease totals and due dates?",
      a: "It is an annual-equivalent estimate for comparison. Exact totals depend on the lease schedule, start date, and any proration rules.",
    },
    {
      q: "What costs are included in the conversion?",
      a: "Only the rent amount entered. Utilities, parking, insurance, fees, and one-time charges are not included unless you add them into the amount before converting.",
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
        item: "https://rentconverter.com/",
      },
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
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

      <section className="pb-4 rc-no-print">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          / Weekly to Annual Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Weekly to Annual Rent Converter
        </h1>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Instant weekly to annual conversion
              </h2>
            </div>

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
            <div className="md:col-span-7">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Weekly rent amount
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountDisplayValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => setIsAmountFocused(false)}
                  placeholder="e.g. 550"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsed.ok}
                />
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value) ? e.target.value : "USD",
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
            </div>

            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Conversion
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">From</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.weekly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.annual}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!parsed.ok ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="font-semibold text-slate-900">
                No results to show
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Fix the input to calculate.
              </p>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                {parsed.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
              {parsed.warnings.length ? (
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-amber-700">
                  {parsed.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : computed.ok ? (
            <>
              {computed.warnings.length ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <ul className="list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
                <div className="text-sm text-slate-600">Annual equivalent</div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                    {money(computed.annual)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {money(computed.weekly)} weekly ≈{" "}
                    <strong>{money(computed.annual)}</strong> annual (365-day
                    annual equivalence)
                  </div>
                  <div className="text-xs text-slate-500">
                    Implied weeks per 365-day year:{" "}
                    <strong className="text-slate-800">
                      {Number.isFinite(computed.impliedWeeksPerYear)
                        ? computed.impliedWeeksPerYear.toFixed(4)
                        : "—"}
                    </strong>
                  </div>
                </div>

                <div className="rc-no-print mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "headline",
                        `Weekly rent: ${money(computed.weekly)} (${currency}) ≈ Annual: ${money(
                          computed.annual,
                        )} (365-day annual equivalence).`,
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                  >
                    {copiedKey === "headline" ? "Copied" : "Copy result"}
                  </button>
                  {copiedKey === "copy_failed" ? (
                    <span className="self-center text-sm font-semibold text-rose-700">
                      Copy failed
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", computed.hourly, "hourly"],
                      ["Daily", computed.daily, "daily"],
                      ["Weekly", computed.weekly, "weekly"],
                      ["Every 2 weeks", computed.biweekly, "biweekly"],
                      [
                        "Every 4 weeks (28 days)",
                        computed.fourWeeks,
                        "every_4_weeks",
                      ],
                      ["Monthly (average)", computed.monthly, "monthly"],
                      ["Annual", computed.annual, "annual"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {money(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Weekly-to-year interpretation comparison
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          52 weekly payments
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {money(computed.annualIf52Payments)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Difference to 365-day basis:{" "}
                          <span className="font-semibold text-slate-800">
                            {money(computed.delta52)}
                          </span>{" "}
                          (
                          {Number.isFinite(computed.pct52)
                            ? (computed.pct52 * 100).toFixed(2)
                            : "—"}
                          %)
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          53 weekly payments
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {money(computed.annualIf53Payments)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Difference to 365-day basis:{" "}
                          <span className="font-semibold text-slate-800">
                            {money(computed.delta53)}
                          </span>{" "}
                          (
                          {Number.isFinite(computed.pct53)
                            ? (computed.pct53 * 100).toFixed(2)
                            : "—"}
                          %)
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          365-day annual equivalence
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {money(computed.annual)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Used across all periods on this page
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      Weekly rent can be interpreted as a payment schedule (a
                      set number of weekly payments) or as a time-based rate.
                      This page converts through a 365-day year so the breakdown
                      stays consistent across daily, monthly, and 4-week
                      equivalents.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      4-week vs monthly context
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week ={" "}
                        <strong className="text-slate-900">
                          {money(computed.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference ≈{" "}
                        <strong className="text-slate-900">
                          {Number.isFinite(computed.monthlyMinus4wPct)
                            ? (computed.monthlyMinus4wPct * 100).toFixed(2)
                            : "—"}
                          %
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      A 4-week period is 28 days. A calendar month averages
                      about 30.42 days (365 ÷ 12). Converting both through an
                      annual total keeps comparisons consistent.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm text-slate-500 rc-print-block">
                Assumptions: 1 year = 365 days, 1 week = 7 days, biweekly = 14
                days, 4-week rent = 28 days, month = 365 ÷ 12 days (average).
                Actual due dates vary by lease.
              </p>
            </>
          ) : null}
        </div>
        

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 rc-no-print">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="h-4 w-4"
                />
                Round displayed values (display only)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Displayed decimals
                </span>
                <select
                  value={displayDecimals}
                  onChange={(e) =>
                    setDisplayDecimals(
                      normalizeDisplayDecimals(Number(e.target.value), 2),
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none"
                >
                  <option value={0}>0</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Internal math is fixed-point up to 12 decimals. This only changes
              what is displayed.
            </p>
          </div>
      </section>

      <section id="learn" className="max-w-5xl mx-auto px-6 pt-8 rc-no-print">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Weekly vs annual totals
        </h2>

        <p className="text-slate-700 mb-4">
          Weekly rent is often listed as a weekly price, while budgets and
          affordability discussions often reference yearly totals. Converting
          weekly rent to an annual amount helps compare listings that use
          different billing periods. This page uses annual equivalence (365-day
          year) so the results line up across the full breakdown.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Why weekly to annual can produce multiple reasonable answers
        </h3>
        <p className="text-slate-700 mb-4">
          Two interpretations are common: one treats weekly rent as a payment
          schedule (for example, 52 weekly payments), and another treats it as a
          time-based rate that can be expressed over a 365-day year. The
          difference is small in many cases, but it can matter when comparing
          offers or building a consistent budget.
        </p>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Payments per year and what they imply
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Weekly payments: often framed as 52 payments, but a 365-day year is
            about 52.14 weeks.
          </li>
          <li>
            Biweekly payments: typically framed as 26 payments (every 14 days).
          </li>
          <li>
            Every 4 weeks: 13 periods per year because 365 days is more than 28
            × 13.
          </li>
          <li>
            Monthly: commonly framed as 12 payments, but month lengths vary, so
            an average month is used for time-based comparisons.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-slate-900">
          Common misunderstandings specific to weekly-to-annual conversion
        </h3>
        <ul className="list-disc ml-6 text-slate-700 mb-4">
          <li>
            Weekly × 52 is a payment-count shortcut, not a universal rule for
            yearly totals.
          </li>
          <li>
            A 4-week amount is not a monthly amount. They represent different
            period lengths.
          </li>
          <li>
            The yearly figure is an estimate for comparison. Lease start dates,
            proration, and included charges can change the real total.
          </li>
        </ul>

        <p className="text-slate-700 mb-4">
          Related pages:{" "}
          <a
            href={safeHref("/rent-paid-weekly-vs-monthly")}
            className="text-sky-700 hover:underline"
          >
            weekly vs monthly rent
          </a>
          ,{" "}
          <a
            href={safeHref("/rent-converter")}
            className="text-sky-700 hover:underline"
          >
            rent converter
          </a>
          , and{" "}
          <a
            href={safeHref("/rent-affordability-calculator")}
            className="text-sky-700 hover:underline"
          >
            rent affordability calculator
          </a>
          .
        </p>
      </section>

      {/* Required explanation section above FAQ */}
      <section className="max-w-5xl mx-auto px-6 pt-8 rc-no-print">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what to expect
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-slate-700 mb-4">
            Enter a weekly rent amount and choose a currency for formatting. The
            calculator converts your weekly rent into an annual total using
            annual equivalence as the source of truth.
          </p>

          <p className="text-slate-700 mb-4">
            The annual total is computed using a 365-day year (so 1 week = 7
            days). Once the annual total is established, the page derives daily,
            monthly, and 4-week equivalents from that same annual number to keep
            the breakdown consistent.
          </p>

          <p className="text-slate-600 text-sm">
            The result is an estimate intended for comparison. If your lease is
            literally billed as a fixed number of weekly payments, the “weekly ×
            52” context may match your real total better than a 365-day
            equivalence.
          </p>

          <p className="text-slate-700 mt-6">
            Related pages:{" "}
            <a
              href={safeHref("/rent-paid-weekly-vs-monthly")}
              className="text-sky-700 hover:underline"
            >
              weekly vs monthly rent
            </a>
            ,{" "}
            <a
              href={safeHref("/monthly-to-annual-rent-converter")}
              className="text-sky-700 hover:underline"
            >
              monthly to annual rent
            </a>
            ,{" "}
            <a
              href={safeHref("/rent-converter")}
              className="text-sky-700 hover:underline"
            >
              rent converter
            </a>
            .
          </p>
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

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-print-block">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are provided for informational, budgeting, and
            comparison purposes only. Calculations are based on standard
            time-period assumptions (including a 365-day year and average month
            length) and simplified models. Results are estimates, not
            guarantees.
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
            Tools on this site are for budgeting and comparison. Calculations
            use standard time-period assumptions, including a 365-day year and
            average month length. Always confirm payment schedules and lease
            terms in your rental agreement.
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
