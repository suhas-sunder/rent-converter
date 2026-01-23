import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/biweekly-to-annual-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => {
  const title = "Biweekly to Annual Rent Converter (14-day basis)";
  const description =
    "Convert biweekly rent (every 14 days) to an annual equivalent using a 365-day year. Decimal-safe input, full breakdown, payment-count context (26 vs 365/14), CSV export, and print-to-PDF.";

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
    {
      property: "og:url",
      content: "https://rentconverter.com/biweekly-to-annual-rent",
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
      href: "https://rentconverter.com/biweekly-to-annual-rent",
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
  "/",
  "/rent-converter",
  "/rent-paid-every-4-weeks",
  "/how-much-rent-can-i-afford",
  "/rent-affordability-calculator",
  "/rent-paid-weekly-vs-monthly",
  "/weekly-to-monthly-rent",
  "/monthly-to-weekly-rent",
  "/weekly-to-annual-rent",
  "/annual-to-weekly-rent",
  "/monthly-to-annual-rent",
  "/annual-to-monthly-rent",
  "/biweekly-to-monthly-rent",
  "/monthly-to-biweekly-rent",
  "/biweekly-to-annual-rent",
  "/annual-to-biweekly-rent",
  "/hourly-to-annual-rent",
  "/annual-to-hourly-rent",
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

export default function BiweeklyToAnnualRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "900";
    const saved = window.localStorage.getItem("rc_b2a_amount");
    return saved ?? "900";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "CAD";
    const saved = window.localStorage.getItem("rc_b2a_currency");
    return saved && isCurrency(saved) ? saved : "CAD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = window.localStorage.getItem("rc_b2a_display_decimals");
    const n = saved ? Number(saved) : 2;
    if (!Number.isFinite(n)) return 2;
    return Math.max(0, Math.min(6, Math.trunc(n)));
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("rc_b2a_round_display");
    return safeParseBoolean(saved, true);
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
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

  const breakdownScaled = useMemo(() => {
    if (!parsedBiweekly.ok) return null;

    const hourly = biweeklyToPeriodScaled(biweeklyScaled, "hourly");
    const daily = biweeklyToPeriodScaled(biweeklyScaled, "daily");
    const weekly = biweeklyToPeriodScaled(biweeklyScaled, "weekly");
    const biweekly = biweeklyScaled;
    const every4w = biweeklyToPeriodScaled(biweeklyScaled, "every_4_weeks");
    const monthly = biweeklyToPeriodScaled(biweeklyScaled, "monthly");
    const annual = biweeklyToPeriodScaled(biweeklyScaled, "annual");

    // Payment-count context: 26 vs 365/14
    const annualVia26 = biweeklyScaled * 26n;
    const countBiweeks365_num = 365 / 14; // for display only, use number below
    const annualVia365Day = annual;

    const annualDiff = annualVia365Day - annualVia26;
    const annualDiffPct =
      annualVia26 === 0n ? 0 : Number(annualDiff) / Number(annualVia26);

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

      annualVia26,
      annualVia365Day,
      countBiweeks365_num,

      annualDiff,
      annualDiffPct,

      monthlyMinus4w,
      monthlyMinus4wPct,
    };
  }, [parsedBiweekly.ok, biweeklyScaled]);

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, effectiveDisplayDecimals);

  const annualHeadlineScaled = breakdownScaled?.annual ?? 0n;

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
    if (!canShowResults || !breakdownScaled) return;

    const rows: string[] = [];
    rows.push(buildCsvRow(["Biweekly to Annual Rent Converter"]));
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
    rows.push(buildCsvRow(["Headline (Annual)", fmt(annualHeadlineScaled)]));
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
    rows.push(buildCsvRow(["Payment-count context (illustrative)"]));
    rows.push(buildCsvRow(["Biweekly × 26", fmt(breakdownScaled.annualVia26)]));
    rows.push(
      buildCsvRow([
        "365-day annual equivalence",
        fmt(breakdownScaled.annualVia365Day),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Difference (365-day minus 26x)",
        fmt(breakdownScaled.annualDiff),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Difference (%) of 26x",
        formatPercent(breakdownScaled.annualDiffPct, 2),
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
      "biweekly-to-annual-rent.csv",
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
        item: "https://rentconverter.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Biweekly to Annual Rent Converter",
        item: "https://rentconverter.com/biweekly-to-annual-rent",
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

      <section className="pb-4 rc-no-print">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="hover:underline">
            Home
          </a>{" "}
          / Biweekly to Annual Rent Converter
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Biweekly to Annual Rent Converter
        </h1>
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Convert a biweekly rent amount (every 14 days) into an annual
          equivalent using a 365-day year. Results update instantly and include
          a full breakdown plus a 26-payments shortcut comparison.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href={safeHref("/rent-converter")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter hub
          </a>
          <a
            href={safeHref("/rent-paid-every-4-weeks")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent paid every 4 weeks
          </a>
          <a
            href={safeHref("/how-much-rent-can-i-afford")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            How much rent can I afford
          </a>
        </div>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Instant biweekly to annual conversion
            </h2>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={!canShowResults}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  canShowResults
                    ? "border-slate-200 bg-white text-slate-800 hover:bg-sky-50 hover:border-sky-200"
                    : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                }`}
                aria-disabled={!canShowResults}
              >
                Export CSV
              </button>
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
                Biweekly rent amount (every 14 days)
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 900 or 900.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsedBiweekly.ok}
                  aria-describedby="rc-amount-help rc-amount-error"
                />
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value)
                        ? (e.target.value as Currency)
                        : "CAD",
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

              <p id="rc-amount-help" className="mt-2 text-xs text-slate-500">
                Accepted inputs: $900.50, 900, 900.00, .5, 12., 1250,50 (comma
                decimal). If your input is ambiguous, you will see a warning or
                an error instead of a misleading result.
              </p>

              {!parsedBiweekly.ok ? (
                <p
                  id="rc-amount-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {parsedBiweekly.error}
                </p>
              ) : parsedBiweekly.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedBiweekly.warnings.map((w, i) => (
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
                    {PERIOD_LABEL.biweekly}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.annual}
                  </div>
                </div>
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
                      Calculations use up to 12 decimals internally. If enabled,
                      displayed values are rounded to your chosen decimals.
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-xs text-slate-500">
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
                      className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    What the annual result represents
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    Biweekly is treated as a 14-day amount. This tool converts
                    to a daily equivalent (biweekly ÷ 14) and multiplies by 365
                    to produce an annual equivalence. A separate panel shows the
                    common shortcut biweekly × 26 so you can see the difference.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            <div className="text-sm text-slate-600">Annual equivalent</div>

            {!canShowResults ? (
              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700">
                <div className="font-semibold">No result to show yet</div>
                <p className="mt-1 text-sm text-slate-600">
                  Enter a valid biweekly amount above to see the annual
                  equivalent and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                    {fmt(annualHeadlineScaled)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {fmt(biweeklyScaled)} biweekly ≈{" "}
                    <strong>{fmt(annualHeadlineScaled)}</strong> annual (365-day
                    equivalence)
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("annual", fmt(annualHeadlineScaled))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "annual" ? "Copied" : "Copy annual amount"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Biweekly: ${fmt(biweeklyScaled)} | Annual (365-day): ${fmt(
                            annualHeadlineScaled,
                          )} | Assumptions: biweekly=14 days, year=365 days`,
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

                  <div className="mt-1 text-xs text-slate-500">
                    {roundDisplay ? (
                      <>
                        Displayed values rounded to {displayDecimals} decimals.
                        Calculations use up to 12 decimals internally.
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
                      Payment-count context (26 vs 365 ÷ 14)
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Biweekly × 26 (common shortcut)
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.annualVia26)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          26 cycles used as a schedule count
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          365-day annual equivalence (this tool)
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.annualVia365Day)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Uses 365 ÷ 14 ≈ {(365 / 14).toFixed(2)} biweekly
                          periods
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                        <div className="text-xs text-slate-500">
                          Difference (365-day minus 26x)
                        </div>
                        <div className="mt-1 text-sm font-bold text-slate-800">
                          {fmt(breakdownScaled!.annualDiff)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          ≈ {formatPercent(breakdownScaled!.annualDiffPct, 2)}{" "}
                          of 26x
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      This comparison is illustrative. Leases may define
                      schedule counts, proration rules, and due-date handling.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Monthly vs 4-week comparison
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week ={" "}
                        <strong className="text-slate-900">
                          {fmt(breakdownScaled!.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference ≈{" "}
                        <strong className="text-slate-900">
                          {formatPercent(breakdownScaled!.monthlyMinus4wPct, 2)}
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      4-week is 28 days. An average month is about 30.42 days
                      (365 ÷ 12). Different lengths lead to different annual
                      equivalents.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: year = 365 days, week = 7 days, biweekly = 14 days,
            4-week = 28 days, month = 365 ÷ 12 days (average). Actual due dates
            and billing terms vary by agreement.
          </p>
        </div>
      </section>

      {/* Required: explanation above FAQ */}
      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-16 rc-no-print"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-slate-900">
          How it works
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal pl-5 space-y-3 text-slate-700">
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
              <strong>
                All other periods are derived from the same daily basis.
              </strong>{" "}
              This keeps the breakdown consistent (weekly, 4-week, monthly
              average).
            </li>
            <li>
              <strong>Decimals are preserved.</strong> Inputs are parsed into
              fixed-point integers (up to 12 decimals). If an input is
              ambiguous, you see a warning or an error instead of a misleading
              result.
            </li>
          </ol>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-20 px-6 rc-no-print">
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
