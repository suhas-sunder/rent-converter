import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/biweekly-to-monthly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => {
  const title = "Biweekly to Monthly Rent Converter (14-day basis)";
  const description =
    "Convert rent paid every 14 days (biweekly) into a monthly equivalent using a 365-day year. Decimal-safe input, full breakdown, 26-payments context, CSV export, and print-to-PDF.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "biweekly to monthly rent converter, every 2 weeks to monthly rent, convert biweekly rent to monthly, biweekly rent monthly equivalent, 26 payments per year rent, biweekly vs monthly rent, 28 day vs monthly rent",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://rentconverter.com/biweekly-to-monthly-rent-converter",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://rentconverter.com/og-image.jpg",
    },

    {
      rel: "canonical",
      href: "https://rentconverter.com/biweekly-to-monthly-rent-converter",
    },
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

function toNumberSafe(scaled: bigint): number {
  return Number(scaled) / Number(SCALE);
}

function formatCurrencyFromScaled(
  scaled: bigint,
  currency: Currency,
  displayDecimals: number,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: Math.max(0, Math.min(12, displayDecimals)),
    minimumFractionDigits: 0,
  }).format(n);
}

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "—";
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
      error: "Enter a valid number (example: 1000 or 1000.50).",
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

export default function BiweeklyToMonthlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "1000";
    const saved = window.localStorage.getItem("rc_btm_amount");
    return saved ?? "1000";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_btm_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_btm_display_decimals");
    const n = saved ? Number(saved) : 2;
    if (!Number.isFinite(n)) return 2;
    return Math.max(0, Math.min(6, Math.trunc(n)));
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("rc_btm_round_display");
    return safeParseBoolean(saved, true);
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_btm_amount", amount);
      window.localStorage.setItem("rc_btm_currency", currency);
      window.localStorage.setItem(
        "rc_btm_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_btm_round_display",
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

  const breakdownScaled = useMemo(() => {
    if (!parsedBiweekly.ok) return null;

    const hourly = biweeklyToPeriodScaled(biweeklyScaled, "hourly");
    const daily = biweeklyToPeriodScaled(biweeklyScaled, "daily");
    const weekly = biweeklyToPeriodScaled(biweeklyScaled, "weekly");
    const biweekly = biweeklyScaled;
    const every4w = biweeklyToPeriodScaled(biweeklyScaled, "every_4_weeks");
    const monthly = biweeklyToPeriodScaled(biweeklyScaled, "monthly");
    const annual = biweeklyToPeriodScaled(biweeklyScaled, "annual");

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

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
    };
  }, [parsedBiweekly.ok, biweeklyScaled]);

  const paymentMath = useMemo(() => {
    if (!parsedBiweekly.ok || !breakdownScaled) return null;

    const paymentsPerYear = 26n; // common shortcut schedule count
    const annualFromPayments = biweeklyScaled * paymentsPerYear;
    const monthlyFromPayments = annualFromPayments / 12n; // integer division on scaled cents-like units is ok because scaled is already fixed-point
    const converterMonthly = breakdownScaled.monthly;

    const deltaVsConverter = monthlyFromPayments - converterMonthly;
    const pctVsConverter =
      converterMonthly === 0n
        ? 0
        : Number(deltaVsConverter) / Number(converterMonthly);

    return {
      paymentsPerYear: Number(paymentsPerYear),
      annualFromPayments,
      monthlyFromPayments,
      deltaVsConverter,
      pctVsConverter,
    };
  }, [parsedBiweekly.ok, biweeklyScaled, breakdownScaled]);

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, effectiveDisplayDecimals);

  const monthlyHeadlineScaled = breakdownScaled?.monthly ?? 0n;

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

  const handleExportCsv = () => {
    if (!canShowResults || !breakdownScaled || !paymentMath) return;

    const rows: string[] = [];
    rows.push(buildCsvRow(["Biweekly to Monthly Rent Converter"]));
    rows.push(
      buildCsvRow([
        "Assumptions",
        "Year=365 days",
        "Biweekly=14 days",
        "Month=365 ÷ 12 days (average)",
      ]),
    );
    rows.push(buildCsvRow(["Currency formatting", currency]));
    rows.push(
      buildCsvRow([
        "Display",
        roundDisplay
          ? `Rounded to ${displayDecimals} decimals for display`
          : "No display rounding (shows up to 12 decimals)",
      ]),
    );
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Input (Biweekly)", fmt(biweeklyScaled)]));
    rows.push(buildCsvRow(["Headline (Monthly)", fmt(monthlyHeadlineScaled)]));
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Period", "Amount"]));
    const items: Array<[Period, bigint]> = [
      ["hourly", breakdownScaled.hourly],
      ["daily", breakdownScaled.daily],
      ["weekly", breakdownScaled.weekly],
      ["biweekly", breakdownScaled.biweekly],
      ["every_4_weeks", breakdownScaled.every4w],
      ["monthly", breakdownScaled.monthly],
      ["annual", breakdownScaled.annual],
    ];
    for (const [p, val] of items)
      rows.push(buildCsvRow([PERIOD_LABEL[p], fmt(val)]));

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["26-payments context (illustrative)"]));
    rows.push(
      buildCsvRow(["Payments per year", String(paymentMath.paymentsPerYear)]),
    );
    rows.push(
      buildCsvRow([
        "Biweekly × 26 (annual)",
        fmt(paymentMath.annualFromPayments),
      ]),
    );
    rows.push(
      buildCsvRow([
        "(Biweekly × 26) ÷ 12 (monthly)",
        fmt(paymentMath.monthlyFromPayments),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Delta vs converter monthly",
        fmt(paymentMath.deltaVsConverter),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Delta (%) vs converter monthly",
        formatPercent(paymentMath.pctVsConverter, 2),
      ]),
    );

    rows.push(buildCsvRow([""]));
    rows.push(
      buildCsvRow([
        "Monthly minus 4-week",
        fmt(breakdownScaled.monthlyMinus4w),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Monthly vs 4-week difference (%)",
        formatPercent(breakdownScaled.monthlyMinus4wPct, 2),
      ]),
    );

    downloadTextFile(
      "biweekly-to-monthly-rent-converter.csv",
      rows.join("\n"),
      "text/csv;charset=utf-8",
    );
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What does “biweekly rent” mean?",
      a: "Biweekly rent is rent paid every 14 days. That schedule is often summarized as 26 payments per year, which is why it can feel different from paying once per calendar month.",
    },
    {
      q: "How does this convert biweekly rent to a monthly equivalent?",
      a: "It converts the biweekly amount to a daily equivalent (biweekly ÷ 14), then derives a yearly total (daily × 365) and finally expresses that annual total as a monthly equivalent (annual ÷ 12).",
    },
    {
      q: "How many biweekly payments are in a year?",
      a: "A common shortcut is 26 (52 weeks ÷ 2). A day-based annual equivalence uses 365 ÷ 14 ≈ 26.07 biweekly periods, so the totals can differ slightly.",
    },
    {
      q: "Why doesn’t biweekly map neatly to calendar months?",
      a: "Because 14-day intervals drift across the calendar. Some months include two payments, and the timing can create an extra payment relative to a monthly budget.",
    },
    {
      q: "How is biweekly different from rent paid every 4 weeks?",
      a: "Biweekly is every 14 days (about 26 cycles per year). Every 4 weeks is every 28 days (13 cycles per year). Both are non-monthly schedules, but they imply different annual totals.",
    },
    {
      q: "What assumptions does this page use?",
      a: "Year = 365 days, week = 7 days, biweekly = 14 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Your lease may still use different billing rules.",
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Biweekly to Monthly Rent Converter",
        item: "https://rentconverter.com/biweekly-to-monthly-rent-converter",
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Biweekly to Monthly Rent Converter",
    description:
      "Convert rent paid every 14 days (biweekly) into a monthly equivalent using a 365-day year. Includes a full breakdown, 26-payments context, CSV export, and print-to-PDF.",
    url: "https://rentconverter.com/biweekly-to-monthly-rent-converter",
  };

  const amountInputId = "rc-btm-amount";

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

      <section className="pb-5 rc-no-print">
        <nav className="max-w-6xl mx-auto px-6 text-sm sm:text-[0.95rem] text-slate-600">
          <a
            href={safeHref("/")}
            className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
          >
            Home
          </a>{" "}
          / Biweekly to Monthly Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Biweekly to Monthly Rent Converter
        </h1>
        <p className="text-slate-700/90 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed">
          If rent is quoted every 14 days, a monthly equivalent helps with
          budgeting and comparing listings. This page converts a biweekly amount
          into a monthly figure using a consistent year-based method.
        </p>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Convert biweekly rent into a monthly equivalent
            </h2>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-6 min-w-0">
              <label
                htmlFor={amountInputId}
                className="block text-sm sm:text-[0.95rem] font-semibold text-slate-800 mb-2"
              >
                Biweekly rent amount (every 14 days)
              </label>
              <div className="flex gap-2">
                <input
                  id={amountInputId}
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 1000 or 1000.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-base sm:text-[1.05rem] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:border-sky-500"
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
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3.5 text-sm sm:text-base font-semibold outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:border-sky-500"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p
                id="rc-amount-help"
                className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed"
              >
                Accepted inputs: $1,000.50, 1000, 1000.00, .5, 12., 1250,50
                (comma decimal). If your input is ambiguous, you will see a
                warning or an error instead of a misleading result.
              </p>

              {!parsedBiweekly.ok ? (
                <p
                  id="rc-amount-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedBiweekly.error}
                </p>
              ) : parsedBiweekly.warnings.length ? (
                <div
                  className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950"
                  role="status"
                  aria-live="polite"
                >
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedBiweekly.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6 min-w-0">
              <label className="block text-sm sm:text-[0.95rem] font-semibold text-slate-800 mb-2">
                Display settings
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                  <div className="text-xs text-slate-600">From</div>
                  <div className="mt-1 text-base font-bold text-slate-900">
                    {PERIOD_LABEL.biweekly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                  <div className="text-xs text-slate-600">To</div>
                  <div className="mt-1 text-base font-bold text-slate-900">
                    {PERIOD_LABEL.monthly}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
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
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      />
                      Round displayed values
                    </label>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Calculations use up to 12 decimals internally. If enabled,
                      displayed values are rounded to your chosen decimals.
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-xs text-slate-600">
                      Displayed decimals
                    </div>
                    <select
                      value={displayDecimals}
                      onChange={(e) =>
                        setDisplayDecimals(
                          Math.max(
                            0,
                            Math.min(
                              6,
                              Math.trunc(Number(e.target.value) || 2),
                            ),
                          ),
                        )
                      }
                      className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm sm:text-base font-semibold outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:border-sky-500"
                      aria-label="Displayed decimals"
                    >
                      <option value={0}>0</option>
                      <option value={2}>2</option>
                      <option value={4}>4</option>
                      <option value={6}>6</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800">
                  <div className="font-semibold">
                    What the monthly result represents
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Biweekly is treated as a 14-day amount. The converter uses
                    daily equivalence (biweekly ÷ 14) to derive annual (× 365)
                    and then monthly (÷ 12). A separate panel shows the common
                    26-payments shortcut so you can compare interpretations.
                  </p>
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
              <div className="text-sm sm:text-[0.95rem] text-slate-700">
                Monthly equivalent
              </div>

              {!canShowResults ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-800 shadow-sm">
                  <div className="font-semibold">No result to show yet</div>
                  <p className="mt-1 text-sm text-slate-700">
                    Enter a valid biweekly amount above to see the monthly
                    equivalent and breakdown.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3 flex flex-col gap-2">
                    <div className="text-4xl sm:text-5xl font-extrabold text-sky-900 rc-tabular leading-none min-h-[3.25rem] sm:min-h-[4rem]">
                      <span className="rc-amount">
                        {fmt(monthlyHeadlineScaled)}
                      </span>
                    </div>
                    <div className="text-sm sm:text-[0.95rem] text-slate-700 leading-relaxed">
                      <span className="rc-amount">{fmt(biweeklyScaled)}</span>{" "}
                      biweekly ≈{" "}
                      <strong className="text-slate-900 rc-amount">
                        {fmt(monthlyHeadlineScaled)}
                      </strong>{" "}
                      monthly (annual equivalence, then ÷ 12)
                    </div>

                    <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy("monthly", fmt(monthlyHeadlineScaled))
                        }
                        className="rounded-xl border border-slate-200 bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbff]"
                      >
                        {copiedKey === "monthly"
                          ? "Copied"
                          : "Copy monthly amount"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            "summary",
                            `Biweekly: ${fmt(biweeklyScaled)} | Monthly: ${fmt(monthlyHeadlineScaled)} | Assumptions: biweekly=14 days, year=365 days, month=365/12`,
                          )
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7fbff]"
                      >
                        {copiedKey === "summary" ? "Copied" : "Copy summary"}
                      </button>
                      <span
                        className={`self-center text-sm font-semibold ${
                          copiedKey === "copy_failed"
                            ? "text-rose-700"
                            : "sr-only"
                        }`}
                        role={copiedKey === "copy_failed" ? "alert" : undefined}
                      >
                        Copy failed
                      </span>
                    </div>

                    <div className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {roundDisplay ? (
                        <>
                          Displayed values rounded to {displayDecimals}{" "}
                          decimals. Calculations use up to 12 decimals
                          internally.
                        </>
                      ) : (
                        <>
                          Displayed values show up to 12 decimals (no display
                          rounding).
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                        ["Annual", breakdownScaled!.annual, "annual"],
                      ] as const
                    ).map(([label, val, key]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm min-w-0"
                      >
                        <div className="text-xs text-slate-600">{label}</div>
                        <div className="mt-1 text-lg sm:text-xl font-bold text-slate-900 rc-tabular leading-tight">
                          <span className="rc-amount">{fmt(val)}</span>
                        </div>
                      </div>
                    ))}

                    {paymentMath ? (
                      <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                        <div className="text-xs text-slate-600">
                          26-payments context (common shortcut)
                        </div>

                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                            <div className="text-xs text-slate-600">
                              Payments per year
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900 rc-tabular">
                              <span className="rc-amount">
                                {paymentMath.paymentsPerYear}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              Common schedule count (52 weeks ÷ 2)
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                            <div className="text-xs text-slate-600">
                              Biweekly × 26, then ÷ 12
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900 rc-tabular">
                              <span className="rc-amount">
                                {fmt(paymentMath.monthlyFromPayments)}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              Shortcut monthly = (biweekly × 26) ÷ 12
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
                            <div className="text-xs text-slate-600">
                              Delta vs converter monthly
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-900 rc-tabular">
                              <span className="rc-amount">
                                {fmt(paymentMath.deltaVsConverter)}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-slate-600">
                              ≈{" "}
                              <span className="rc-amount">
                                {formatPercent(paymentMath.pctVsConverter, 2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                          This panel is for interpretation. Some leases treat
                          biweekly as a schedule count, while others effectively
                          follow day-based proration rules.
                        </p>
                      </div>
                    ) : null}

                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
                      <div className="text-xs text-slate-600">
                        4-week (28-day) vs monthly comparison
                      </div>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-sm sm:text-[0.95rem] text-slate-800">
                          Monthly minus 4-week amount ={" "}
                          <strong className="text-slate-900 rc-amount rc-tabular">
                            {fmt(breakdownScaled!.monthlyMinus4w)}
                          </strong>
                        </div>
                        <div className="text-sm sm:text-[0.95rem] text-slate-800">
                          Difference ≈{" "}
                          <strong className="text-slate-900 rc-amount rc-tabular">
                            {formatPercent(
                              breakdownScaled!.monthlyMinus4wPct,
                              2,
                            )}
                          </strong>
                        </div>
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        4-week is 28 days. An average month is about 30.42 days
                        (365 ÷ 12). They are not interchangeable.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="mt-6 text-sm sm:text-[0.95rem] text-slate-600 leading-relaxed">
            Assumptions: year = 365 days, week = 7 days, biweekly = 14 days,
            4-week = 28 days, month = 365 ÷ 12 days (average). Actual due dates
            and proration rules vary by lease.
          </p>
        </div>
      </section>

      {/* Required: explanation above FAQ */}
      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-8 rc-no-print"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-7 text-center text-slate-900 tracking-tight">
          How it works
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <ol className="list-decimal pl-5 space-y-3 text-slate-800 text-base sm:text-[1.05rem] leading-relaxed">
            <li>
              <strong>You enter a biweekly rent amount.</strong> Biweekly is
              treated as a 14-day amount.
            </li>
            <li>
              <strong>The tool converts to a daily equivalent.</strong> Daily =
              biweekly ÷ 14.
            </li>
            <li>
              <strong>Annual equivalence is derived from days.</strong> Annual =
              daily × 365.
            </li>
            <li>
              <strong>Monthly equivalence is derived from annual.</strong>{" "}
              Monthly = annual ÷ 12, which corresponds to an average month
              length of 365 ÷ 12 days.
            </li>
            <li>
              <strong>Decimals are preserved.</strong> Inputs are parsed into
              fixed-point integers (up to 12 decimals). If an input is
              ambiguous, you see a warning or an error instead of a misleading
              result.
            </li>
            <li>
              <strong>Export and printing.</strong> You can export the breakdown
              to CSV and print the page to save as a PDF.
            </li>
          </ol>
        </div>

        <p className="mt-4 text-slate-700 leading-relaxed">
          Related pages:{" "}
          <a
            href={safeHref("/weekly-to-monthly-rent-converter")}
            className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
          >
            weekly to monthly rent
          </a>
          ,{" "}
          <a
            href={safeHref("/rent-paid-every-4-weeks-calculator")}
            className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
          >
            rent paid every 4 weeks
          </a>
          , and{" "}
          <a
            href={safeHref("/how-much-rent-can-i-afford-calculator")}
            className="text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
          >
            rent affordability calculator
          </a>
          .
        </p>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6 rc-no-print">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-9 text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqData.map((f, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg sm:text-xl text-slate-900 mb-1">
                {f.q}
              </h3>
              <p className="text-slate-700 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong>Disclaimer:</strong>
            <br />
            Tools on this site are for informational, budgeting, and comparison
            use. Calculations rely on standard time-period assumptions
            (including a 365-day year and an average month length) and
            simplified models. Outputs are estimates intended to illustrate
            equivalents, not to predict exact lease billing outcomes.
            <br />
            <br />
            This website does not provide financial, legal, or tax advice. Rent,
            payment schedules, proration, fees, and obligations vary by
            location, landlord, and contract terms. Review your agreement for
            the rules that apply to you.
          </p>
        </div>
      </section>

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-10 rc-no-print">
        <p className="text-xs sm:text-sm text-slate-600 text-center leading-relaxed">
          <em>
            Use these calculators for comparisons and budgeting. Confirm your
            real payment schedule, due dates, and fees in your agreement.
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
    </main>
  );
}
