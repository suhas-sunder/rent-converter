import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/rent-increase-percentage-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Rent Increase Percentage Calculator - Old vs New Rent, Annual Impact, and Equivalents",
  },
  {
    name: "description",
    content:
      "Calculate the percentage rent increase between an old rent and a new rent using annual equivalence (365-day year). Shows the change per period and the annual impact, with monthly vs 4-week comparisons.",
  },
  {
    name: "keywords",
    content:
      "rent increase percentage, rent increase percent calculator, percentage increase in rent, calculate rent raise percentage, old rent vs new rent percent increase",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content:
      "Rent Increase Percentage Calculator - Old vs New Rent, Annual Impact, and Equivalents",
  },
  {
    property: "og:description",
    content:
      "Calculate the percentage rent increase between old and new rent using annual equivalence. Includes per-period equivalents and annual impact.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-increase-percentage",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Increase Percentage Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate the percentage rent increase between old and new rent using annual equivalence. Includes pay-cycle equivalents and annual impact.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-increase-percentage",
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
function isPeriod(x: string): x is Period {
  return (
    x === "hourly" ||
    x === "daily" ||
    x === "weekly" ||
    x === "biweekly" ||
    x === "every_4_weeks" ||
    x === "monthly" ||
    x === "annual"
  );
}

/**
 * Only include routes you are sure exist.
 * If you do not have a whitelist, remove safeHref and use plain hrefs.
 */
const ROUTE_WHITELIST = new Set<string>([
  "/",
  "/rent-increase-percentage",
  "/rent-increase-calculator",
  "/rent-converter",
  "/rent-affordability-calculator",
]);

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

function clampNum(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Fixed-point decimals preserved end-to-end (up to 12 decimals). */
const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedScaled = {
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
  const digits = Math.max(0, Math.min(12, displayDecimals));
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

/**
 * Accepts: $2,000, 2000.00, .5, 12., 2000,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3" etc.
 */
function parseMoneyInputToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter an amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 2000 or 2000.00).",
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
    return { ok: false, error: "Amount must be 0 or greater.", warnings };
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
  if (!/^\d+$/.test(intPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }
  if (fracPart && !/^\d+$/.test(fracPart)) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }

  const maxDec = Number(MAX_DECIMALS);
  const fracRaw = fracPart ?? "";
  const fracCapped =
    fracRaw.length > maxDec ? fracRaw.slice(0, maxDec) : fracRaw;
  const fracPadded = fracCapped.padEnd(maxDec, "0");

  const scaled =
    BigInt(intPart) * SCALE + (fracPadded ? BigInt(fracPadded) : 0n);

  const maxVal = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxVal);
  if (clamped !== scaled)
    warnings.push("Value was clamped to the supported maximum.");

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;
  return { ok: true, scaled: clamped, normalized, warnings };
}

function annualizeFromScaled(valueScaled: bigint, period: Period): bigint {
  if (period === "hourly") {
    return valueScaled * 24n * 365n;
  }
  if (period === "monthly") {
    // monthly average -> annual = monthly * 12
    return valueScaled * 12n;
  }
  if (period === "annual") {
    return valueScaled;
  }
  if (period === "daily") return valueScaled * 365n;
  if (period === "weekly") return (valueScaled * 365n) / 7n;
  if (period === "biweekly") return (valueScaled * 365n) / 14n;
  if (period === "every_4_weeks") return (valueScaled * 365n) / 28n;
  return valueScaled * 12n;
}

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
  if (to === "hourly") return annualScaled / 365n / 24n;
  if (to === "daily") return annualScaled / 365n;
  if (to === "weekly") return (annualScaled / 365n) * 7n;
  if (to === "biweekly") return (annualScaled / 365n) * 14n;
  if (to === "every_4_weeks") return (annualScaled / 365n) * 28n;
  if (to === "monthly") return annualScaled / 12n;
  return annualScaled;
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

export default function RentIncreasePercentage() {
  const pageName = "Rent Increase Percentage Calculator";
  const canonicalUrl = "https://rentconverter.com/rent-increase-percentage";

  const [oldRent, setOldRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rc_rip_old") ?? "2000";
  });

  const [newRent, setNewRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2100";
    return localStorage.getItem("rc_rip_new") ?? "2100";
  });

  const [period, setPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rc_rip_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_rip_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // display-only rounding controls
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rc_rip_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    const saved = localStorage.getItem("rc_rip_display_decimals");
    const n = saved ? Number(saved) : 2;
    if (!Number.isFinite(n)) return 2;
    return Math.max(0, Math.min(6, Math.trunc(n)));
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rip_old", oldRent);
      localStorage.setItem("rc_rip_new", newRent);
      localStorage.setItem("rc_rip_period", period);
      localStorage.setItem("rc_rip_currency", currency);
      localStorage.setItem(
        "rc_rip_round_display",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem("rc_rip_display_decimals", String(displayDecimals));
    } catch {
      // ignore
    }
  }, [oldRent, newRent, period, currency, roundDisplay, displayDecimals]);

  const oldParsed = useMemo(() => parseMoneyInputToScaled(oldRent), [oldRent]);
  const newParsed = useMemo(() => parseMoneyInputToScaled(newRent), [newRent]);

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, effectiveDisplayDecimals);

  const computed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!oldParsed.ok)
      errors.push(oldParsed.error ?? "Enter a valid old rent.");
    if (!newParsed.ok)
      errors.push(newParsed.error ?? "Enter a valid new rent.");

    if (oldParsed.warnings.length) warnings.push(...oldParsed.warnings);
    if (newParsed.warnings.length) warnings.push(...newParsed.warnings);

    if (errors.length) return { ok: false as const, errors, warnings };

    const oldScaled = oldParsed.scaled as bigint;
    const newScaled = newParsed.scaled as bigint;

    const annualOldScaled = annualizeFromScaled(oldScaled, period);
    const annualNewScaled = annualizeFromScaled(newScaled, period);
    const annualDeltaScaled = annualNewScaled - annualOldScaled;

    const annualOld = toNumberSafe(annualOldScaled);
    const annualNew = toNumberSafe(annualNewScaled);
    const annualDelta = toNumberSafe(annualDeltaScaled);

    // Percent change handling:
    // - If annualOld > 0, normal percent.
    // - If annualOld == 0 and annualNew > 0, percent is not meaningful; show "N/A" and focus on absolute deltas.
    // - If both 0, percent is 0.
    let pct: number | null = null;
    let pctNote: string | null = null;

    if (annualOld > 0) {
      pct = (annualDelta / annualOld) * 100;
    } else if (annualNew > 0) {
      pct = null;
      pctNote =
        "Percent increase is not meaningful when the starting rent is 0.";
    } else {
      pct = 0;
    }

    const periods: Period[] = [
      "hourly",
      "daily",
      "weekly",
      "biweekly",
      "every_4_weeks",
      "monthly",
      "annual",
    ];

    const breakdown = periods.map((p) => {
      const oldValScaled = fromAnnualScaled(annualOldScaled, p);
      const newValScaled = fromAnnualScaled(annualNewScaled, p);
      const deltaScaled = newValScaled - oldValScaled;
      return { p, oldValScaled, newValScaled, deltaScaled };
    });

    const avgMonthDays = 365 / 12;

    const oldMonthlyAvgScaled = fromAnnualScaled(annualOldScaled, "monthly");
    const old4wScaled = fromAnnualScaled(annualOldScaled, "every_4_weeks");
    const newMonthlyAvgScaled = fromAnnualScaled(annualNewScaled, "monthly");
    const new4wScaled = fromAnnualScaled(annualNewScaled, "every_4_weeks");

    const oldMonthMinus4wScaled = oldMonthlyAvgScaled - old4wScaled;
    const newMonthMinus4wScaled = newMonthlyAvgScaled - new4wScaled;

    const deltaPerSelectedPeriodScaled = newScaled - oldScaled;

    return {
      ok: true as const,
      warnings,

      annualOldScaled,
      annualNewScaled,
      annualDeltaScaled,

      pct,
      pctNote,

      breakdown,
      avgMonthDays,

      oldMonthlyAvgScaled,
      old4wScaled,
      newMonthlyAvgScaled,
      new4wScaled,
      oldMonthMinus4wScaled,
      newMonthMinus4wScaled,

      deltaPerSelectedPeriodScaled,
    };
  }, [oldParsed, newParsed, period]);

  const faqData = [
    {
      q: "What does “rent increase percentage” mean on this page?",
      a: "It is the percent change between the old rent and the new rent, calculated using annual totals so the result stays consistent across pay cycles.",
    },
    {
      q: "Why does this calculator use annual equivalence instead of a simple percent formula?",
      a: "If both values are entered in the same period, the percent change matches a simple formula. Annualizing is used so the page can also show comparable equivalents across monthly, weekly, and 4-week cycles without mixing assumptions.",
    },
    {
      q: "What if the old rent is zero or blank?",
      a: "A percent increase is not meaningful when the starting value is zero. In that case the page still shows the absolute differences and annual totals.",
    },
    {
      q: "Why are “monthly” and “every 4 weeks” shown separately?",
      a: "A 4-week period is always 28 days. An average month is about 30.42 days (365 ÷ 12). The page shows both so the difference is visible when comparing payment schedules.",
    },
    {
      q: "Does the output include fees, utilities, or taxes?",
      a: "No. It compares rent amounts only. If one option includes bundled costs, treat the result as a baseline comparison.",
    },
    {
      q: "Does this reflect proration or mid-month effective dates?",
      a: "No. The calculation is a full-period comparison. Proration rules and effective dates can change the first payment after a change.",
    },
    {
      q: "What time assumptions are used for conversions?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual due dates and billing schedules vary by agreement.",
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://rentconverter.com/",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    description:
      "Calculate the percentage rent increase between an old rent and a new rent using annual equivalence (365-day year). Includes per-period equivalents and annual impact.",
    url: canonicalUrl,
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleExportCsv = () => {
    if (!computed.ok) return;

    const rows: string[] = [];
    rows.push(buildCsvRow([pageName]));
    rows.push(buildCsvRow(["Currency", currency]));
    rows.push(buildCsvRow(["Billing period", PERIOD_LABEL[period]]));
    rows.push(buildCsvRow(["Old rent (input)", oldRent]));
    rows.push(buildCsvRow(["New rent (input)", newRent]));
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Summary"]));
    rows.push(
      buildCsvRow([
        "Old (same period)",
        fmtMoney(fromAnnualScaled(computed.annualOldScaled, period)),
      ]),
    );
    rows.push(
      buildCsvRow([
        "New (same period)",
        fmtMoney(fromAnnualScaled(computed.annualNewScaled, period)),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Change per selected period",
        fmtMoney(computed.deltaPerSelectedPeriodScaled),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Annual old (annualized)",
        fmtMoney(computed.annualOldScaled),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Annual new (annualized)",
        fmtMoney(computed.annualNewScaled),
      ]),
    );
    rows.push(
      buildCsvRow(["Annual difference", fmtMoney(computed.annualDeltaScaled)]),
    );
    rows.push(
      buildCsvRow([
        "Percent change",
        computed.pct === null ? "N/A" : computed.pct.toFixed(6),
      ]),
    );
    if (computed.pctNote)
      rows.push(buildCsvRow(["Percent note", computed.pctNote]));

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["Breakdown across periods (annual-equivalent)"]));
    rows.push(buildCsvRow(["Period", "Old", "New", "Difference"]));
    computed.breakdown.forEach((b) => {
      rows.push(
        buildCsvRow([
          PERIOD_LABEL[b.p],
          fmtMoney(b.oldValScaled),
          fmtMoney(b.newValScaled),
          fmtMoney(b.deltaScaled),
        ]),
      );
    });

    rows.push(buildCsvRow([""]));
    rows.push(
      buildCsvRow([
        "Assumptions",
        "Year=365 days, Week=7 days, Every 4 weeks=28 days, Month=365/12 days (average).",
      ]),
    );

    downloadTextFile(
      "rent-increase-percentage.csv",
      rows.join("\n"),
      "text/csv;charset=utf-8",
    );
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
          / {pageName}
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">{pageName}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Compare an old rent and a new rent to estimate the percentage change
          and the annual impact. Results are shown using annual equivalence so
          common billing cycles can be compared on the same basis.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <a
            href={safeHref("/rent-increase-calculator")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent increase calculator
          </a>
          <a
            href={safeHref("/rent-converter")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent converter
          </a>
          <a
            href={safeHref("/rent-affordability-calculator")}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
          >
            Rent affordability calculator
          </a>
        </div>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Calculate the percentage increase from old rent to new rent
              </h2>
              <p className="text-sm text-slate-600">
                Enter both rent amounts in the same billing period. The
                calculator annualizes both values to keep the percent and
                comparisons consistent across periods.
              </p>
            </div>

            <div className="rc-no-print flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={!computed.ok}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  computed.ok
                    ? "border-slate-200 bg-white text-slate-800 hover:bg-sky-50 hover:border-sky-200"
                    : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                }`}
                aria-disabled={!computed.ok}
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
                Old rent
              </label>
              <input
                inputMode="decimal"
                value={oldRent}
                onChange={(e) => setOldRent(e.target.value)}
                placeholder="e.g. 2000 or 2000.00"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-invalid={!oldParsed.ok}
              />
              <p className="mt-2 text-xs text-slate-500">
                Accepted inputs: $2,000, 2000.00, .5, 12., 2000,50 (comma
                decimal). Invalid or ambiguous input hides results.
              </p>
              {!oldParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {oldParsed.error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New rent
              </label>
              <input
                inputMode="decimal"
                value={newRent}
                onChange={(e) => setNewRent(e.target.value)}
                placeholder="e.g. 2100 or 2100.00"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-invalid={!newParsed.ok}
              />
              <p className="mt-2 text-xs text-slate-500">
                Use the same period as the old rent for a like-for-like
                comparison.
              </p>
              {!newParsed.ok ? (
                <p className="mt-2 text-sm font-semibold text-rose-700">
                  {newParsed.error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing period (applies to both amounts)
              </label>
              <select
                value={period}
                onChange={(e) =>
                  setPeriod(
                    isPeriod(e.target.value) ? e.target.value : "monthly",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-label="Billing period"
              >
                {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                The period selection affects the annualization and the per-cycle
                differences shown below.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(
                    isCurrency(e.target.value) ? e.target.value : "USD",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-label="Currency"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Currency affects formatting only.
              </p>
            </div>

            <div className="md:col-span-12">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Display
              </label>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
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
                          Math.max(
                            0,
                            Math.min(
                              6,
                              Math.trunc(Number(e.target.value) || 2),
                            ),
                          ),
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
                  Calculations preserve decimals internally (up to 12). Only the
                  displayed values are rounded.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="font-semibold text-slate-800">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Fix the inputs to calculate the percent change.
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                  {computed.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                {computed.warnings.length ? (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <div className="font-semibold">Notes</div>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {computed.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
                <div className="text-sm text-slate-600">
                  Rent increase percentage
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                    {computed.pct === null
                      ? "N/A"
                      : `${computed.pct.toFixed(2)}%`}
                  </div>

                  <div className="text-sm text-slate-600">
                    {fmtMoney(
                      fromAnnualScaled(computed.annualOldScaled, period),
                    )}{" "}
                    to{" "}
                    {fmtMoney(
                      fromAnnualScaled(computed.annualNewScaled, period),
                    )}{" "}
                    per {PERIOD_LABEL[period].toLowerCase()}{" "}
                    {computed.pct === null ? (
                      <>
                        shows an absolute change (percent is not meaningful from
                        0).{" "}
                        <span className="font-semibold">
                          {computed.pctNote}
                        </span>
                      </>
                    ) : (
                      <>
                        is an estimated{" "}
                        <strong>{computed.pct.toFixed(2)}%</strong> change when
                        compared on an annual basis.
                      </>
                    )}
                  </div>
                </div>

                <div className="rc-no-print mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "summary",
                        `Old: ${fmtMoney(fromAnnualScaled(computed.annualOldScaled, period))} (${PERIOD_LABEL[period]}); New: ${fmtMoney(
                          fromAnnualScaled(computed.annualNewScaled, period),
                        )}; Annual difference: ${fmtMoney(computed.annualDeltaScaled)}; Percent: ${
                          computed.pct === null
                            ? "N/A"
                            : `${computed.pct.toFixed(2)}%`
                        }`,
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

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Change per selected period
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.deltaPerSelectedPeriodScaled)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annual rent (old, annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualOldScaled)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Annual rent (new, annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {fmtMoney(computed.annualNewScaled)}
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">Annual impact</div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="text-sm text-slate-700">
                        Annual difference:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.annualDeltaScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Monthly (avg) difference:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(
                            computed.newMonthlyAvgScaled -
                              computed.oldMonthlyAvgScaled,
                          )}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Weekly difference:{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(
                            fromAnnualScaled(
                              computed.annualNewScaled,
                              "weekly",
                            ) -
                              fromAnnualScaled(
                                computed.annualOldScaled,
                                "weekly",
                              ),
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Monthly vs every 4 weeks (old and new)
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="text-sm text-slate-700">
                        Old (monthly avg):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.oldMonthlyAvgScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Old (4 weeks):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.old4wScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        New (monthly avg):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.newMonthlyAvgScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        New (4 weeks):{" "}
                        <strong className="text-slate-900">
                          {fmtMoney(computed.new4wScaled)}
                        </strong>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      A 4-week period is 28 days. An average month is{" "}
                      {computed.avgMonthDays.toFixed(2)} days (365 ÷ 12). The
                      difference here is shown explicitly: old{" "}
                      {fmtMoney(computed.oldMonthMinus4wScaled)}, new{" "}
                      {fmtMoney(computed.newMonthMinus4wScaled)}.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 rc-print-block">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Full breakdown across periods (annual-equivalent)
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    This table converts both rents into annual totals first,
                    then expresses those totals across common cycles. Useful
                    when you track budgets in different periods.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-[860px] w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-200">
                          <th className="py-2 pr-4">Period</th>
                          <th className="py-2 pr-4">Old</th>
                          <th className="py-2 pr-4">New</th>
                          <th className="py-2 pr-4">Difference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {computed.breakdown.map((row) => (
                          <tr key={row.p} className="border-b border-slate-100">
                            <td className="py-2 pr-4 font-semibold text-slate-800">
                              {PERIOD_LABEL[row.p]}
                            </td>
                            <td className="py-2 pr-4 text-slate-800">
                              {fmtMoney(row.oldValScaled)}
                            </td>
                            <td className="py-2 pr-4 text-slate-800">
                              {fmtMoney(row.newValScaled)}
                            </td>
                            <td className="py-2 pr-4 text-slate-800">
                              {fmtMoney(row.deltaScaled)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Assumptions used for conversions: 1 year = 365 days, 1 week
                    = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days
                    (average). Exact billing and due dates vary by agreement.
                  </p>
                </div>

                {computed.warnings.length ? (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 rc-no-print">
                    <div className="font-semibold">Notes</div>
                    <ul className="mt-1 list-disc pl-5 space-y-1">
                      {computed.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500 rc-print-block">
            Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28
            days, and month = 365 ÷ 12 days (average). This page compares full
            period equivalents and does not model fees, proration, or effective
            dates.
          </p>
        </div>
      </section>

      {/* Required explanation section above FAQ */}
      <section
        id="how-it-works"
        className="max-w-5xl mx-auto px-6 pt-16 rc-no-print"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what you can do with it
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <ol className="list-decimal pl-5 space-y-3 text-slate-700">
            <li>
              <strong>
                Enter old rent and new rent in the same billing period.
              </strong>{" "}
              The period dropdown applies to both numbers.
            </li>
            <li>
              <strong>
                The calculator converts both rents to an annual total.
              </strong>{" "}
              It uses a 365-day year and treats a month as 365 ÷ 12 days
              (average).
            </li>
            <li>
              <strong>
                Percent change is computed from those annual totals.
              </strong>{" "}
              This keeps the result consistent when you also view weekly and
              4-week equivalents.
            </li>
            <li>
              <strong>You get practical outputs for budgeting.</strong> The page
              shows the change per selected period, the annual difference, and a
              full breakdown across common cycles.
            </li>
            <li>
              <strong>Decimals are preserved end-to-end.</strong> If you enable
              rounding, only the displayed values are rounded. Exports include
              the displayed formatting.
            </li>
          </ol>

          <p className="mt-6 text-slate-700">
            Use this for: verifying a rent raise percentage, comparing listings
            that quote different cycles, and estimating yearly impact. It does
            not include fees or proration rules.
          </p>

          <p className="mt-6 text-slate-700">
            Related pages:{" "}
            <a
              href={safeHref("/rent-increase-calculator")}
              className="text-sky-700 hover:underline"
            >
              rent increase calculator
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
