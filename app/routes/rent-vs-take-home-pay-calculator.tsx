import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-vs-take-home-pay-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent vs Take-Home Pay Calculator" },
  {
    name: "description",
    content:
      "Compare rent to take-home pay (after-tax income) using annual equivalence (365-day year). See rent as a percentage of net pay, plus estimated take-home pay left after rent across monthly, weekly, and 4-week cycles.",
  },
  {
    name: "keywords",
    content:
      "rent vs take home pay, rent percentage of take home pay, rent to net income, rent vs after tax income, take home pay rent calculator",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent vs Take-Home Pay Calculator" },
  {
    property: "og:description",
    content:
      "Compare rent to take-home pay using annual equivalence. See rent as a percent of net pay and estimated net pay left after rent across pay cycles.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-vs-take-home-pay-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent vs Take-Home Pay Calculator" },
  {
    name: "twitter:description",
    content:
      "Compare rent to take-home pay using annual equivalence. See rent as a percent of net pay and estimated net pay left after rent across pay cycles.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-vs-take-home-pay-calculator",
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

function safeHref(path: string): string {
  return ROUTE_WHITELIST.has(path) ? path : "/";
}

const MAX_DECIMALS = 12n;
const SCALE = 10n ** MAX_DECIMALS;

type ParsedScaled = {
  ok: boolean;
  scaled?: bigint;
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

  const digits = Math.max(0, Math.min(12, displayDecimals));
  const minimumFractionDigits = roundDisplay ? digits : 0;
  const maximumFractionDigits = roundDisplay ? digits : 12;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(n);
}

function parseMoneyInputToScaled(raw: string, label = "value"): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: `Enter ${label}.`, warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: `Enter a valid ${label} (example: 2000 or 2000.00).`,
      warnings,
    };
  }

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
    if (split.length > 2) {
      return {
        ok: false,
        error: `Enter a valid ${label} (too many decimals).`,
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
  if (!/^\d+$/.test(intPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };
  if (fracPart && !/^\d+$/.test(fracPart))
    return { ok: false, error: `Enter a valid ${label}.`, warnings };

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

  return { ok: true, scaled: clamped, warnings };
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

function stripCommas(s: string): string {
  return (s ?? "").replace(/,/g, "");
}

function inferPreviewFraction(raw: string): {
  fractionDigits: number;
  trailingDecimalPoint: boolean;
} {
  const s0 = (raw ?? "").trim();
  if (!s0) return { fractionDigits: 0, trailingDecimalPoint: false };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

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
      const after = parts[1] ?? "";
      if (/^\d{1,2}$/.test(after)) decimalSep = ",";
      else decimalSep = null;
    } else {
      decimalSep = null;
    }
  }

  if (!decimalSep) return { fractionDigits: 0, trailingDecimalPoint: false };

  const idx = s.lastIndexOf(decimalSep);
  const trailingDecimalPoint = idx === s.length - 1;

  const frac = trailingDecimalPoint ? "" : s.slice(idx + 1);
  const fracDigits = /^\d+$/.test(frac) ? Math.min(12, frac.length) : 0;

  return { fractionDigits: fracDigits, trailingDecimalPoint };
}

function formatAmountPreviewFromRaw(raw: string): {
  ok: boolean;
  value: string;
  error?: string;
} {
  const parsed = parseMoneyInputToScaled(raw, "value");
  if (!parsed.ok || parsed.scaled === undefined)
    return { ok: false, value: raw, error: parsed.error ?? "Enter a value." };

  const n = toNumberSafe(parsed.scaled);
  if (!Number.isFinite(n))
    return { ok: false, value: raw, error: "Enter a valid value." };

  const { fractionDigits, trailingDecimalPoint } = inferPreviewFraction(raw);

  const formatted = new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);

  return {
    ok: true,
    value: trailingDecimalPoint ? `${formatted}.` : formatted,
  };
}

export default function RentVsTakeHomePay() {
  const pageName = "Rent vs Take-Home Pay Calculator";
  const canonicalUrl =
    "https://rentconverter.com/rent-vs-take-home-pay-calculator";

  const [takeHomePay, setTakeHomePay] = useState<string>(() => {
    if (typeof window === "undefined") return "5000";
    return stripCommas(localStorage.getItem("rc_rvt_takehome") ?? "5000");
  });

  const [takeHomePeriod, setTakeHomePeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rc_rvt_takehome_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [rentAmount, setRentAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "1800";
    return stripCommas(localStorage.getItem("rc_rvt_rent") ?? "1800");
  });

  const [rentPeriod, setRentPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rc_rvt_rent_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_rvt_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rc_rvt_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rc_rvt_display_decimals"),
      2,
    );
  });

  const [takeHomeFocused, setTakeHomeFocused] = useState(false);
  const [rentFocused, setRentFocused] = useState(false);

  const [takeHomeDisplay, setTakeHomeDisplay] = useState<string>(() => "5000");
  const [rentDisplay, setRentDisplay] = useState<string>(() => "1800");

  const [takeHomeInputError, setTakeHomeInputError] = useState<string | null>(
    null,
  );
  const [rentInputError, setRentInputError] = useState<string | null>(null);

  useEffect(() => {
    if (!takeHomeFocused) {
      const res = formatAmountPreviewFromRaw(takeHomePay);
      setTakeHomeDisplay(res.value);
      setTakeHomeInputError(
        res.ok ? null : (res.error ?? "Enter take-home pay."),
      );
    } else {
      setTakeHomeDisplay(takeHomePay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [takeHomePay, takeHomeFocused]);

  useEffect(() => {
    if (!rentFocused) {
      const res = formatAmountPreviewFromRaw(rentAmount);
      setRentDisplay(res.value);
      setRentInputError(res.ok ? null : (res.error ?? "Enter rent."));
    } else {
      setRentDisplay(rentAmount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentAmount, rentFocused]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rvt_takehome", takeHomePay);
      localStorage.setItem("rc_rvt_takehome_period", takeHomePeriod);
      localStorage.setItem("rc_rvt_rent", rentAmount);
      localStorage.setItem("rc_rvt_rent_period", rentPeriod);
      localStorage.setItem("rc_rvt_currency", currency);
      localStorage.setItem(
        "rc_rvt_round_display",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem("rc_rvt_display_decimals", String(displayDecimals));
    } catch {}
  }, [
    takeHomePay,
    takeHomePeriod,
    rentAmount,
    rentPeriod,
    currency,
    roundDisplay,
    displayDecimals,
  ]);

  const parsed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const takeHome = parseMoneyInputToScaled(takeHomePay, "take-home pay");
    if (!takeHome.ok) errors.push(takeHome.error ?? "Enter take-home pay.");
    warnings.push(...takeHome.warnings);

    const rent = parseMoneyInputToScaled(rentAmount, "rent");
    if (!rent.ok) errors.push(rent.error ?? "Enter rent.");
    warnings.push(...rent.warnings);

    return { ok: errors.length === 0, errors, warnings, takeHome, rent };
  }, [takeHomePay, rentAmount]);

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const annualTakeHome = annualizeScaled(
      parsed.takeHome.scaled as bigint,
      takeHomePeriod,
    );
    const annualRent = annualizeScaled(
      parsed.rent.scaled as bigint,
      rentPeriod,
    );

    const annualLeft = annualTakeHome - annualRent;

    const takeHomeMonthly = fromAnnualScaled(annualTakeHome, "monthly");
    const rentMonthly = fromAnnualScaled(annualRent, "monthly");
    const leftMonthly = takeHomeMonthly - rentMonthly;

    const takeHomeWeekly = fromAnnualScaled(annualTakeHome, "weekly");
    const rentWeekly = fromAnnualScaled(annualRent, "weekly");
    const leftWeekly = takeHomeWeekly - rentWeekly;

    const takeHome4w = fromAnnualScaled(annualTakeHome, "every_4_weeks");
    const rent4w = fromAnnualScaled(annualRent, "every_4_weeks");
    const left4w = takeHome4w - rent4w;

    const monthMinus4wRent = rentMonthly - rent4w;

    const rentPct =
      annualTakeHome > 0n
        ? (toNumberSafe(annualRent) / toNumberSafe(annualTakeHome)) * 100
        : Number.NaN;

    const monthMinus4wRentPct =
      rent4w !== 0n
        ? toNumberSafe(monthMinus4wRent) / toNumberSafe(rent4w)
        : Number.NaN;

    return {
      ok: true as const,
      warnings: parsed.warnings,

      annualTakeHome,
      annualRent,
      annualLeft,

      rentPct,

      takeHomeMonthly,
      rentMonthly,
      leftMonthly,

      takeHomeWeekly,
      rentWeekly,
      leftWeekly,

      takeHome4w,
      rent4w,
      left4w,

      avgMonthDays: 365 / 12,
      monthMinus4wRent,
      monthMinus4wRentPct,
    };
  }, [parsed, takeHomePeriod, rentPeriod]);

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
      q: "What is “take-home pay” on this page?",
      a: "Take-home pay refers to income after payroll deductions such as taxes and other withholdings. This calculator treats the input as a net amount.",
    },
    {
      q: "What does this tool calculate?",
      a: "It annualizes take-home pay and rent using a 365-day year, then calculates rent as a percentage of take-home pay and the estimated amount left after rent. It also shows monthly, weekly, and 4-week equivalents derived from the same annual totals.",
    },
    {
      q: "Why does it convert everything to an annual total?",
      a: "Annualizing both numbers keeps the comparison consistent when rent and pay use different time periods. It prevents treating calendar months as fixed weeks and makes 4-week cycles comparable.",
    },
    {
      q: "Why do monthly and every-4-weeks amounts differ?",
      a: "Every 4 weeks is always 28 days. An average month is about 30.42 days (365 ÷ 12). Over a year, that difference changes totals.",
    },
    {
      q: "If my rent is monthly, can I enter take-home pay weekly or biweekly?",
      a: "Yes. Each input is annualized from its selected period first, then the percent and leftover amount are computed from annual totals.",
    },
    {
      q: "Does “left after rent” include utilities or other bills?",
      a: "No. It is take-home pay minus rent only.",
    },
    {
      q: "What assumptions are used for time periods?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and 1 month = 365 ÷ 12 days (average). Actual pay dates and billing rules vary.",
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
        name: pageName,
        item: canonicalUrl,
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
          / {pageName}
        </nav>
      </section>

      <section className="pb-8 text-center bg-white rc-no-print">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">{pageName}</h1>
        <p className="text-slate-600 max-w-5xl mx-auto text-lg">
          Compare rent to take-home pay on a consistent annual basis, even if
          rent and pay use different cycles. Results use annual equivalence
          (365-day year).
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-bold">
                Compare rent to take-home pay
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
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Take-home pay (net)
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={takeHomeFocused ? takeHomePay : takeHomeDisplay}
                  onFocus={() => {
                    setTakeHomeFocused(true);
                    setTakeHomeDisplay(takeHomePay);
                  }}
                  onBlur={() => {
                    setTakeHomeFocused(false);
                    const res = formatAmountPreviewFromRaw(takeHomePay);
                    setTakeHomeDisplay(res.value);
                    setTakeHomeInputError(
                      res.ok ? null : (res.error ?? "Enter take-home pay."),
                    );
                  }}
                  onChange={(e) => setTakeHomePay(stripCommas(e.target.value))}
                  placeholder="e.g. 5000"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsed.takeHome.ok}
                />
                <select
                  value={takeHomePeriod}
                  onChange={(e) =>
                    setTakeHomePeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Take-home pay period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              {!takeHomeFocused && takeHomeInputError ? (
                <div className="mt-2 text-sm font-semibold text-rose-700">
                  {takeHomeInputError}
                </div>
              ) : null}
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent
              </label>
              <div className="grid grid-cols-12 gap-2">
                <input
                  inputMode="decimal"
                  value={rentFocused ? rentAmount : rentDisplay}
                  onFocus={() => {
                    setRentFocused(true);
                    setRentDisplay(rentAmount);
                  }}
                  onBlur={() => {
                    setRentFocused(false);
                    const res = formatAmountPreviewFromRaw(rentAmount);
                    setRentDisplay(res.value);
                    setRentInputError(
                      res.ok ? null : (res.error ?? "Enter rent."),
                    );
                  }}
                  onChange={(e) => setRentAmount(stripCommas(e.target.value))}
                  placeholder="e.g. 1800"
                  className="col-span-7 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsed.rent.ok}
                />
                <select
                  value={rentPeriod}
                  onChange={(e) =>
                    setRentPeriod(
                      isPeriod(e.target.value) ? e.target.value : "monthly",
                    )
                  }
                  className="col-span-5 rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Rent period"
                >
                  {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              {!rentFocused && rentInputError ? (
                <div className="mt-2 text-sm font-semibold text-rose-700">
                  {rentInputError}
                </div>
              ) : null}
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
            </div>
          </div>

          {!parsed.ok ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="font-semibold text-slate-900">
                No results to show
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Fix the inputs to calculate.
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
                <div className="text-sm text-slate-600">
                  Rent share of take-home pay
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-sky-800">
                    {Number.isFinite(computed.rentPct)
                      ? computed.rentPct.toFixed(2)
                      : "—"}
                    %
                  </div>
                  <div className="text-sm text-slate-600">
                    Annualized rent:{" "}
                    <strong>{money(computed.annualRent)}</strong> and annualized
                    take-home pay:{" "}
                    <strong>{money(computed.annualTakeHome)}</strong>.
                  </div>
                </div>

                <div className="rc-no-print mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "headline",
                        `Rent share: ${
                          Number.isFinite(computed.rentPct)
                            ? computed.rentPct.toFixed(2)
                            : "N/A"
                        }%; Annual rent: ${money(computed.annualRent)}; Annual take-home: ${money(
                          computed.annualTakeHome,
                        )}; Left after rent: ${money(computed.annualLeft)}`,
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                  >
                    {copiedKey === "headline" ? "Copied" : "Copy results"}
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
                      Take-home pay (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {money(computed.annualTakeHome)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Rent (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {money(computed.annualRent)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Take-home pay left after rent (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {money(computed.annualLeft)}
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Monthly, weekly, and 4-week equivalents (from annual
                      totals)
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="text-sm text-slate-700">
                        Take-home per month (avg):{" "}
                        <strong className="text-slate-900">
                          {money(computed.takeHomeMonthly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per month (avg):{" "}
                        <strong className="text-slate-900">
                          {money(computed.rentMonthly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Left per month (avg):{" "}
                        <strong className="text-slate-900">
                          {money(computed.leftMonthly)}
                        </strong>
                      </div>

                      <div className="text-sm text-slate-700">
                        Take-home per week:{" "}
                        <strong className="text-slate-900">
                          {money(computed.takeHomeWeekly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per week:{" "}
                        <strong className="text-slate-900">
                          {money(computed.rentWeekly)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Left per week:{" "}
                        <strong className="text-slate-900">
                          {money(computed.leftWeekly)}
                        </strong>
                      </div>

                      <div className="text-sm text-slate-700">
                        Take-home per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {money(computed.takeHome4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Rent per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {money(computed.rent4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Left per 4 weeks:{" "}
                        <strong className="text-slate-900">
                          {money(computed.left4w)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Monthly vs every 4 weeks (rent)
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly rent (avg) minus 4-week rent:{" "}
                        <strong className="text-slate-900">
                          {money(computed.monthMinus4wRent)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference:{" "}
                        <strong className="text-slate-900">
                          {Number.isFinite(computed.monthMinus4wRentPct)
                            ? (computed.monthMinus4wRentPct * 100).toFixed(2)
                            : "—"}
                          %
                        </strong>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      A 4-week period is 28 days. An average month is{" "}
                      {computed.avgMonthDays.toFixed(2)} days (365 ÷ 12), so
                      these are not interchangeable.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm text-slate-500 rc-print-block">
                Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks =
                28 days, and month = 365 ÷ 12 days (average). Exact pay dates
                and rent due dates vary by employer and agreement.
              </p>
            </>
          ) : null}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 rc-no-print mt-6">
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
              <span className="text-xs text-slate-500">Displayed decimals</span>
              <select
                value={displayDecimals}
                onChange={(e) => {
                  const v = Math.trunc(Number(e.target.value));
                  setDisplayDecimals(
                    v === 0 || v === 2 || v === 4 || v === 6 ? v : 2,
                  );
                }}
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
            Internal math is fixed-point up to 12 decimals. This control only
            changes what is displayed.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-8 rc-no-print">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what you can expect
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-slate-700 mb-4">
            This page answers: “How much of my take-home pay goes to rent?” You
            can enter pay and rent in different periods (weekly pay with monthly
            rent, biweekly pay with 4-week rent, and so on). The tool converts
            both inputs to annual totals first, then calculates the rent share
            and the leftover amount from those annual totals.
          </p>

          <p className="text-slate-700 mb-4">
            The monthly, weekly, and 4-week numbers shown are derived from the
            same annual totals. This prevents common mistakes like treating
            “monthly” as a fixed number of weeks and makes the 28-day payment
            cycle difference visible.
          </p>

          <p className="text-slate-600 text-sm">
            This is a comparison and budgeting estimate. It does not include
            utilities, debt payments, groceries, or other household costs.
          </p>

          <p className="text-slate-700 mt-6">
            Related tools:{" "}
            <a
              href={safeHref("/how-much-rent-can-i-afford-calculator")}
              className="text-sky-700 hover:underline"
            >
              how much rent can I afford
            </a>
            ,{" "}
            <a
              href={safeHref("/rent-after-tax-income-calculator")}
              className="text-sky-700 hover:underline"
            >
              rent after-tax income calculator
            </a>
            , and{" "}
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
