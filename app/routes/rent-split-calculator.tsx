import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-split-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import Rounding from "~/client/components/layout/Rounding";
import HowItWorks from "~/client/components/rent-split-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-split-calculator/ToolFit";

export const meta: Route.MetaFunction = () => {
  const title = "Free Rent Split Calculator";
  const description =
    "Calculate how much each roommate pays for rent. Split rent equally and see per-person monthly, weekly, 4-week, and yearly breakdowns.";

  const canonicalUrl = "https://www.rentconverter.com/rent-split-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent split calculator, split rent per roommate, rent per roommate, divide rent equally, roommate rent split",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { tagName: "link", rel: "canonical", href: canonicalUrl },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "RentConverter.com preview image" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    { name: "twitter:image:alt", content: "RentConverter.com preview image" },
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
  biweekly: "2 weeks",
  every_4_weeks: "4 weeks (28 days)",
  monthly: "Monthly (average)",
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
 * Route whitelist. Only include routes you know exist.
 * Add to this list only when the route is confirmed in your app.
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

function groupThousandsEnUS(intDigits: string): string {
  const s = (intDigits ?? "").replace(/^0+(?=\d)/, "");
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatMoneyPreviewFromParsed(parsed: ParsedScaled): string {
  const normalized = parsed.normalized ?? "";
  const [intPartRaw, fracPartRaw] = normalized.split(".");
  const intPart = intPartRaw ?? "0";
  const fracPart = fracPartRaw ?? "";

  const groupedInt = groupThousandsEnUS(intPart);

  if (normalized.includes("."))
    return `${groupedInt}.${fracPart}`.replace(/^\./, "0.");
  return groupedInt;
}

/**
 * Accepts: $650, 650, 650.00, .5, 12., 650,50 (comma decimal).
 * Rejects ambiguous formats like "1,2,3".
 */
function parseMoneyInputToScaled(raw: string): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: "Enter a rent amount.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 2400 or 2400.00).",
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
  if (!/^\d+$/.test(intPart))
    return { ok: false, error: "Enter a valid number.", warnings };
  if (fracPart && !/^\d+$/.test(fracPart))
    return { ok: false, error: "Enter a valid number.", warnings };

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

type ParsedPeople = {
  ok: boolean;
  value?: number;
  error?: string;
};

function parsePeopleInput(raw: string): ParsedPeople {
  const s = (raw ?? "").trim();
  if (!s) return { ok: false, error: "Enter number of people." };

  // allow "3", "03", "3 people" (strip non-digits)
  const cleaned = s.replace(/[^\d]/g, "");
  if (!cleaned) return { ok: false, error: "Enter a whole number of people." };

  const n = Number.parseInt(cleaned, 10);
  if (!Number.isFinite(n) || n <= 0)
    return { ok: false, error: "People must be 1 or more." };
  if (n > 100) return { ok: false, error: "People must be 100 or less." };
  return { ok: true, value: n };
}

/**
 * Assumptions (source of truth):
 * - Year = 365 days
 * - Month = 365/12 days (average month)
 * - Week = 7 days
 * - Biweekly = 14 days
 * - Every 4 weeks = 28 days
 * - Hour = 1/24 day
 *
 * Conversions are annual-basis:
 * 1) convert input to annual (365-day basis)
 * 2) derive any other period from annual
 */
function annualizeFromScaled(valueScaled: bigint, period: Period): bigint {
  if (period === "hourly") return valueScaled * 2080n;
  if (period === "daily") return valueScaled * 365n;
  if (period === "weekly") return valueScaled * 52n;
  if (period === "biweekly") return valueScaled * 26n;
  if (period === "every_4_weeks") return valueScaled * 13n;
  if (period === "monthly") return valueScaled * 12n;
  return valueScaled;
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

function fromAnnualScaled(annualScaled: bigint, to: Period): bigint {
  if (to === "hourly") return mulDivRound(annualScaled, 1n, 2080n);
  if (to === "daily") return annualScaled / 365n;
  if (to === "weekly") return mulDivRound(annualScaled, 1n, 52n);
  if (to === "biweekly") return mulDivRound(annualScaled, 1n, 26n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 1n, 13n);
  if (to === "monthly") return annualScaled / 12n;
  return annualScaled;
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

function safeParseDisplayDecimals(raw: string | null, fallback = 2): number {
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : fallback;
}

export default function RentPerPerson() {
  const pageName = "Rent Split Calculator";
  const canonicalUrl = "https://www.rentconverter.com/rent-split-calculator";

  const totalRentInputRef = useRef<HTMLInputElement | null>(null);
  const [isTotalRentFocused, setIsTotalRentFocused] = useState(false);

  const [totalRent, setTotalRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2400";
    const saved = localStorage.getItem("rc_rpp_total") ?? "2400";
    return saved.replace(/,/g, "");
  });

  const [period, setPeriod] = useState<Period>(() => {
    if (typeof window === "undefined") return "monthly";
    const saved = localStorage.getItem("rc_rpp_period") ?? "monthly";
    return isPeriod(saved) ? saved : "monthly";
  });

  const [people, setPeople] = useState<string>(() => {
    if (typeof window === "undefined") return "3";
    return localStorage.getItem("rc_rpp_people") ?? "3";
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_rpp_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  // Display-only rounding controls (do not affect computation)
  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rc_rpp_round_display"), true);
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rc_rpp_display_decimals"),
      2,
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rpp_total", totalRent);
      localStorage.setItem("rc_rpp_period", period);
      localStorage.setItem("rc_rpp_people", people);
      localStorage.setItem("rc_rpp_currency", currency);
      localStorage.setItem(
        "rc_rpp_round_display",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem("rc_rpp_display_decimals", String(displayDecimals));
    } catch {
      // ignore
    }
  }, [totalRent, period, people, currency, roundDisplay, displayDecimals]);

  const parsedRent = useMemo(
    () => parseMoneyInputToScaled(totalRent),
    [totalRent],
  );
  const parsedPeople = useMemo(() => parsePeopleInput(people), [people]);

  const computed = useMemo(() => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!parsedRent.ok)
      errors.push(parsedRent.error ?? "Enter a valid rent amount.");
    if (parsedRent.warnings.length) warnings.push(...parsedRent.warnings);

    if (!parsedPeople.ok)
      errors.push(parsedPeople.error ?? "Enter a valid number of people.");

    if (errors.length) return { ok: false as const, errors, warnings };

    const rentScaled = parsedRent.scaled as bigint;
    const peopleN = parsedPeople.value as number;

    const annualTotalScaled = annualizeFromScaled(rentScaled, period);
    const annualPerPersonScaled = annualTotalScaled / BigInt(peopleN);

    // equal split in the same stated period (pure split of input, not annualized)
    const perSelectedPeriodScaled = rentScaled / BigInt(peopleN);

    const periods: Period[] = [
      "hourly",
      "daily",
      "weekly",
      "biweekly",
      "every_4_weeks",
      "monthly",
      "annual",
    ];

    const breakdown = periods.map((p) => ({
      period: p,
      totalScaled: fromAnnualScaled(annualTotalScaled, p),
      perPersonScaled: fromAnnualScaled(annualPerPersonScaled, p),
    }));

    const monthlyAvgPerPersonScaled = fromAnnualScaled(
      annualPerPersonScaled,
      "monthly",
    );
    const fourWeekPerPersonScaled = fromAnnualScaled(
      annualPerPersonScaled,
      "every_4_weeks",
    );

    // remainder (in cents) when splitting the selected-period rent into cents
    const centsScale = SCALE / 100n;
    const totalCents = rentScaled / centsScale;
    const peopleB = BigInt(peopleN);

    const remainderCents = totalCents % peopleB; // this is the real remainder (0..peopleN-1)

    const leftoverCents = Number(remainderCents);

    return {
      ok: true as const,
      warnings,
      peopleN,
      rentScaled,
      annualTotalScaled,
      annualPerPersonScaled,
      perSelectedPeriodScaled,
      monthlyAvgPerPersonScaled,
      fourWeekPerPersonScaled,
      breakdown,
      leftoverCents,
    };
  }, [parsedRent, parsedPeople, period]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const avgMonthDays = 365 / 12;

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const totalRentDisplayValue = isTotalRentFocused
    ? totalRent
    : parsedRent.ok
      ? formatMoneyPreviewFromParsed(parsedRent)
      : totalRent;

  const handleTotalRentChange = (next: string) => {
    const inputEl = totalRentInputRef.current;
    const start = inputEl?.selectionStart ?? null;
    const end = inputEl?.selectionEnd ?? null;

    if (start === null || end === null) {
      setTotalRent(next.replace(/,/g, ""));
      return;
    }

    const beforeCaret = next.slice(0, start);
    const commasBeforeCaret = (beforeCaret.match(/,/g) ?? []).length;
    const nextSanitized = next.replace(/,/g, "");

    setTotalRent(nextSanitized);

    requestAnimationFrame(() => {
      const el = totalRentInputRef.current;
      if (!el) return;

      const newPos = Math.max(0, start - commasBeforeCaret);
      try {
        el.setSelectionRange(newPos, newPos);
      } catch {
        // ignore
      }
    });
  };

  const faqData = [
    {
      q: "What does rent per person mean on this page?",
      a: "It is an equal split of the rent amount you entered. The page also shows annual equivalents so the per-person share stays comparable across billing cycles.",
    },
    {
      q: "What if rent is listed monthly but paid every 4 weeks?",
      a: "Monthly and every 4 weeks are different time lengths. This page shows both so per-person costs can be compared without treating them as interchangeable.",
    },
    {
      q: "Does the calculator handle uneven splits?",
      a: "No. It calculates equal splits only. If one person pays more due to room size, shared rooms, or other agreements, use this as a baseline and adjust outside the tool.",
    },
    {
      q: "Why does the tool convert everything through annual totals?",
      a: "Annual equivalence keeps comparisons consistent and avoids mixing assumptions when rent is discussed in one period but budgeted in another.",
    },
    {
      q: "What if the split does not divide evenly to the cent?",
      a: "Rent often does not split perfectly. You can assign the small remainder to one person or rotate it over time. The page shows any cents remainder for the selected period.",
    },
    {
      q: "Does this include utilities, parking, or fees?",
      a: "No. This is rent-only. Add shared bills to the rent input or calculate them separately and combine totals.",
    },
    {
      q: "What time assumptions does this page use?",
      a: "Assumptions: year = 365 days, week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Billing schedules vary by agreement.",
    },
  ];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://www.rentconverter.com",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.rentconverter.com",
      },
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    description:
      "Split rent per person using annual equivalence on a 365-day basis and compare monthly (average) vs every 4 weeks.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntityOfPage: canonicalUrl,
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const totalRentId = "rpp_total_rent";
  const totalRentHelpId = "rpp_total_rent_help";
  const totalRentErrorId = "rpp_total_rent_error";

  const periodId = "rpp_period";
  const peopleId = "rpp_people";
  const peopleHelpId = "rpp_people_help";
  const peopleErrorId = "rpp_people_error";

  const currencyId = "rpp_currency";
  const roundId = "rpp_round";
  const decimalsId = "rpp_decimals";

  return (
    <main className="bg-white text-slate-700 scroll-smooth antialiased">
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
              Split Rent Equally Calculator
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
            Split rent evenly between roommates and see each person’s share
            instantly. Clear calculations, no sign-up required.
          </p>

          <div className="grid gap-x-5 gap-y-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <label
                htmlFor={totalRentId}
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Total rent
              </label>
              <input
                ref={totalRentInputRef}
                id={totalRentId}
                inputMode="decimal"
                value={totalRentDisplayValue}
                onFocus={() => setIsTotalRentFocused(true)}
                onBlur={() => setIsTotalRentFocused(false)}
                onChange={(e) => handleTotalRentChange(e.target.value)}
                placeholder="e.g. 2400 or 2400.00"
                className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
                aria-invalid={!parsedRent.ok}
                aria-describedby={`${totalRentHelpId}${!parsedRent.ok ? ` ${totalRentErrorId}` : ""}`}
              />

              {!parsedRent.ok ? (
                <p
                  id={totalRentErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedRent.error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-3">
              <label
                htmlFor={periodId}
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Rent is listed as
              </label>
              <select
                id={periodId}
                value={period}
                onChange={(e) =>
                  setPeriod(
                    isPeriod(e.target.value) ? e.target.value : "monthly",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
              >
                {(Object.keys(PERIOD_LABEL) as Period[]).map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor={peopleId}
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                People
              </label>
              <input
                id={peopleId}
                inputMode="numeric"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="e.g. 3"
                className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
                aria-invalid={!parsedPeople.ok}
                aria-describedby={`${peopleHelpId}${!parsedPeople.ok ? ` ${peopleErrorId}` : ""}`}
              />
              {!parsedPeople.ok ? (
                <p
                  id={peopleErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedPeople.error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor={currencyId}
                className="block text-sm font-semibold text-slate-800 mb-2"
              >
                Currency
              </label>
              <select
                id={currencyId}
                value={currency}
                onChange={(e) =>
                  setCurrency(
                    isCurrency(e.target.value) ? e.target.value : "USD",
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-lg font-semibold text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
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

          <div
            className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block"
            role="region"
            aria-label="Results"
            aria-live="polite"
            aria-atomic="true"
          >
            {!computed.ok ? (
              <div className="rounded-xl border border-slate-200 bg-[#f7fbff] p-4">
                <div className="font-semibold text-slate-950">
                  No results to show
                </div>
                <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                  Fix the input to calculate rent per person.
                </p>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-rose-700">
                  {computed.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                {computed.warnings.length ? (
                  <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-amber-800">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <>
                {computed.warnings.length ? (
                  <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <ul className="list-disc pl-5 space-y-1">
                      {computed.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    Per-person rent (equal split)
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums break-words">
                    {fmtMoney(computed.perSelectedPeriodScaled)}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Annual per person (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {fmtMoney(computed.annualPerPersonScaled)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Annual total (annualized)
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {fmtMoney(computed.annualTotalScaled)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Cents remainder for the split
                    </div>
                    <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {computed.leftoverCents}¢
                    </div>
                    <div className="mt-1 text-xs text-slate-600 leading-relaxed">
                      After splitting the selected period amount to cents.
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2 shadow-sm">
                    <div className="text-xs text-slate-600">
                      Monthly (average) vs every 4 weeks (per person)
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div className="text-sm text-slate-800 leading-relaxed">
                        Monthly (average):{" "}
                        <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.monthlyAvgPerPersonScaled)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-800 leading-relaxed">
                        Every 4 weeks (28 days):{" "}
                        <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.fourWeekPerPersonScaled)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:px-6 rc-print-block shadow-sm">
                  <h3 className="text-lg font-bold text-slate-950 mb-3">
                    Full breakdown (annual-equivalent totals and per person)
                  </h3>
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                    The table annualizes the total rent first, then expresses
                    the total and per-person values across common periods.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-[860px] w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-700 border-b border-slate-200">
                          <th className="py-2 pr-4 font-semibold">Period</th>
                          <th className="py-2 pr-4 font-semibold">
                            Total rent
                          </th>
                          <th className="py-2 pr-4 font-semibold">
                            Per person
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {computed.breakdown.map((row) => (
                          <tr
                            key={row.period}
                            className="border-b border-slate-100"
                          >
                            <td className="py-2 pr-4 font-semibold text-slate-900">
                              {PERIOD_LABEL[row.period]}
                            </td>
                            <td className="py-2 pr-4 text-slate-800 tabular-nums whitespace-nowrap">
                              {fmtMoney(row.totalScaled)}
                            </td>
                            <td className="py-2 pr-4 text-slate-800 tabular-nums whitespace-nowrap">
                              {fmtMoney(row.perPersonScaled)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

          <Assumptions />
        </div>

        <div className="md:col-span-12 mt-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
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
        </div>
      </section>

      <HowItWorks />

      <section className="mt-8 mb-4 hidden sm:block">
        <nav
          className="max-w-6xl mx-auto px-6 text-sm text-slate-600"
          aria-label="Breadcrumb"
        >
          <a
            href={safeHref("/")}
            className="hover:underline text-slate-700 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
          >
            Home
          </a>{" "}
          / <span className="text-slate-800">{pageName}</span>
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
