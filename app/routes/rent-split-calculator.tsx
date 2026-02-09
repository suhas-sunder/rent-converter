import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-split-calculator";
import Assumptions from "~/client/components/layout/Assumptions";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent Split Calculator (How Much Each Roommate Pays)";
  const description =
    "Instantly split rent per roommate and see exactly how much each person pays. View per-person rent by month, week, 4-week (28-day), and year, with clear breakdowns and fair comparisons. Free and private.";

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
        "rent split calculator, split rent per roommate, rent split equally, rent per roommate, divide rent",
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
    { name: "twitter:title", content: "Rent Split Calculator" },
    {
      name: "twitter:description",
      content:
        "See exactly how much each roommate pays for rent with clear per-person breakdowns.",
    },
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
  if (period === "hourly") return valueScaled * 24n * 365n;
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
  if (to === "hourly") return annualScaled / (365n * 24n);
  if (to === "daily") return annualScaled / 365n;
  if (to === "weekly") return mulDivRound(annualScaled, 7n, 365n);
  if (to === "biweekly") return mulDivRound(annualScaled, 14n, 365n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 28n, 365n);
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
      a: "It is an equal split of the rent amount you entered. The page also shows annual equivalents so the split stays comparable across different billing cycles.",
    },
    {
      q: "What if the rent is listed monthly but paid every 4 weeks?",
      a: "Monthly and every 4 weeks are different time lengths. This page shows both so the per-person cost can be compared without treating them as interchangeable.",
    },
    {
      q: "Does the calculator handle uneven splits?",
      a: "No. It calculates an equal split only. If one person pays more due to room size, a couple sharing a room, or income differences, use the equal split as a baseline and adjust outside the tool.",
    },
    {
      q: "Why does the tool convert everything through annual totals?",
      a: "Annual equivalence keeps comparisons consistent and avoids mixing assumptions when rent is discussed in one period but budgeted in another.",
    },
    {
      q: "What if the split does not divide evenly to the cent?",
      a: "Rent often does not split perfectly. You can assign the small remainder to one person or rotate it over time. The page also shows the cents remainder for the selected split period.",
    },
    {
      q: "Does this include utilities, parking, or fees?",
      a: "No. It is rent-only. Add shared bills to the rent amount first or calculate them separately and combine totals.",
    },
    {
      q: "What assumptions are used for the conversions?",
      a: "Assumptions: 1 year = 365 days, 1 week = 7 days, every 4 weeks = 28 days, and month = 365 ÷ 12 days (average). Actual due dates and billing schedules vary by agreement.",
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

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Split rent equally
              </h1>
            </div>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

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
            className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block"
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

                <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 rc-print-block shadow-sm">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label
                htmlFor={roundId}
                className="flex items-center gap-2 text-sm text-slate-800"
              >
                <input
                  id={roundId}
                  type="checkbox"
                  checked={roundDisplay}
                  onChange={(e) => setRoundDisplay(e.target.checked)}
                  className="cursor-pointer h-5 w-5 accent-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 rounded"
                />
                Round displayed values (display only)
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">
                  Displayed decimals
                </span>
                <select
                  id={decimalsId}
                  value={displayDecimals}
                  onChange={(e) =>
                    setDisplayDecimals(
                      safeParseDisplayDecimals(e.target.value, 2),
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2"
                >
                  <option value={0}>0</option>
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Calculations preserve decimals internally (up to 12). Only display
              rounding changes.
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
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-sky-900 tracking-tight leading-tight">
              How this rent split calculator works and what to expect
            </h2>

            <p className="text-slate-600 leading-7">
              This calculator splits rent across the number of people you enter.
              The headline output is a per-person amount in the same period you
              selected for the rent input (monthly stays monthly, weekly stays
              weekly, and so on). Under the hood, the page also computes an
              annual equivalent on a consistent 365-day basis so it can show a
              clean period-by-period breakdown without mixing assumptions. That
              breakdown is there for comparison and consistency, not to change
              how you actually pay rent.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  INPUT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Rent + rent period
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SPLIT
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  People count
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  NORMALIZE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Annual basis
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  COMPARE
                </div>
                <div className="mt-2 text-sm font-semibold text-slate-900">
                  Period breakdown
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
              {/* Card 1 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    1) The split is calculated in your selected rent period
                  </h3>

                  <p className="mt-4">
                    The primary per-person value is the equal split in the same
                    period as your rent input. If you enter rent as “monthly,”
                    the per-person headline is a monthly number. If you enter
                    rent as “every 4 weeks,” the per-person headline is a 28-day
                    number. This keeps the main output aligned with how the rent
                    is actually written or discussed in the listing or lease.
                  </p>

                  <p className="mt-4">
                    If your household uses an uneven split, treat the equal
                    split as a baseline. You can still use the per-person
                    breakdown as a shared reference point, then adjust outside
                    the tool (for example, one person pays more for a larger
                    room or a parking spot). This calculator intentionally does
                    not guess your weighting rules.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      What the headline per-person value is
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        An equal split across the number of people you entered
                      </li>
                      <li>In the same period as the rent input</li>
                      <li>
                        A budgeting and agreement reference, not a due-date
                        schedule
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    2) Why the page converts through an annual basis
                  </h3>

                  <p className="mt-4">
                    After computing the split, the page converts the rent to an
                    annual equivalent on a 365-day basis. That annual number
                    acts as the source of truth for all other period views. The
                    benefit is that you can compare weekly, biweekly, 28-day,
                    monthly (average), daily, and hourly equivalents without
                    switching definitions between outputs.
                  </p>

                  <p className="mt-4">
                    This is where the “monthly vs every 4 weeks” mismatch
                    becomes visible. A 4-week period is exactly 28 days. A month
                    is longer on average. If you convert monthly rent by
                    assuming a fixed 30 days, you silently change the implied
                    annual total. This page avoids that by treating a month as
                    an average month length (365 ÷ 12 days) and using a 365-day
                    year as the consistent anchor.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Assumptions used for equivalence
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>Year = 365 days</li>
                      <li>Average month = 365 ÷ 12 days</li>
                      <li>Week = 7 days</li>
                      <li>Biweekly = 14 days</li>
                      <li>Every 4 weeks = 28 days</li>
                      <li>Hourly conversions assume 24 hours/day</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    3) How to use the breakdown without over-interpreting it
                  </h3>

                  <p className="mt-4">
                    The breakdown is best used for comparisons, sanity checks,
                    and agreement clarity. It helps answer questions like “If
                    one listing is weekly and the other is monthly, what does
                    each imply on the same basis?” or “If our rent is every 4
                    weeks, what does that look like as an average monthly
                    amount?” It is not telling you how many payments you will
                    make in a calendar year, and it is not a lease proration
                    engine.
                  </p>

                  <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                    <div className="text-sm font-bold text-sky-900">
                      Good uses
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Compare listings that quote different billing cycles
                      </li>
                      <li>
                        Agree on an equal-split baseline, then adjust externally
                        if needed
                      </li>
                      <li>
                        Check whether a “4-week” amount is effectively higher
                        than a similar “monthly” amount
                      </li>
                      <li>
                        Translate one rent amount into a period that fits
                        someone’s budgeting style
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4">
                    If you need a schedule of actual due dates and
                    calendar-month totals, use a due-date schedule tool. This
                    page stays strictly in equivalence math and per-person
                    splitting.
                  </p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-sky-900 tracking-tight">
                    4) Decimals, rounding, and input handling
                  </h3>

                  <p className="mt-4">
                    Splits often produce decimals, especially with three or more
                    roommates. This page should preserve decimals internally (up
                    to 12) so a per-person split stays accurate across the
                    breakdown. If rounding is available, it should be
                    display-only so it formats outputs without changing the
                    annual basis the breakdown is derived from.
                  </p>

                  <p className="mt-4">
                    If an input is invalid or ambiguous, the page should avoid
                    producing a confident-looking per-person number. A split
                    calculator is only useful if it does not silently turn bad
                    inputs into misleading results.
                  </p>
                </div>
              </div>

              {/* Dark callout */}
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
                    Scope note
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight text-sky-100">
                    This tool splits rent and shows equivalents. It does not
                    decide your household rules.
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    The calculator does not add or remove fees, utilities,
                    taxes, deposits, or one-time charges. It also does not model
                    due dates, proration rules, or “who pays when.” Use the
                    equal split as a reference point, then handle uneven
                    arrangements separately.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Related tool:{" "}
                <a
                  href={safeHref("/rent-converter")}
                  className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                >
                  rent converter
                </a>
                .
              </p>

              <div className="mt-10">
                <h3 className="text-2xl font-extrabold mb-4 text-sky-900 tracking-tight">
                  Links to related tools
                </h3>

                <div className="rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm p-5 sm:p-6">
                  <ul className="list-disc ml-6 text-slate-700 space-y-2">
                    <li>
                      <a
                        href={safeHref("/rent-converter")}
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent converter hub
                      </a>
                    </li>
                    <li>
                      <a
                        href={safeHref("/rent-per-paycheck-calculator")}
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent per paycheck
                      </a>
                    </li>
                    <li>
                      <a
                        href={safeHref("/rent-paid-every-4-weeks-calculator")}
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent paid every 4 weeks
                      </a>
                    </li>
                    <li>
                      <a
                        href={safeHref("/rent-per-week-calculator")}
                        className="text-sky-700 hover:text-sky-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm cursor-pointer"
                      >
                        Rent per week
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
