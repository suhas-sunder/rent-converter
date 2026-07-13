import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-split-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-split-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-split-calculator/ToolFit";
import {
  useHydrationSafeSavedState,
  validSavedMoney,
  validSavedWholeNumber,
} from "~/client/utils/savedState";
import { calculateEqualCentAllocation } from "~/client/utils/generatedTools.js";

export const meta: Route.MetaFunction = () => {
  const title = "Rent Split Calculator | Split Rent by Roommates";
  const description =
    "Split rent and optional shared monthly costs evenly. See each person's share by rent period, with exact cent-remainder guidance.";

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
    { name: "theme-color", content: "#f0f9ff" },

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
): string {
  const digits = 2;
  const scaledForDisplay = roundScaledToDecimals(scaled, digits);

  const { group, decimal } = getNumberSeparators();
  const { negative, intStr, fracStr } = scaledToDecimalStrings(
    scaledForDisplay,
    digits,
    false,
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  const parts = fmt.formatToParts(0);
  const currencyPart = parts.find((p) => p.type === "currency");
  const symbol = currencyPart?.value ?? "";
  const minus = negative ? "-" : "";

  return minus + symbol + groupedInt + (digits > 0 ? decimal + fracStr.padEnd(digits, "0") : "");
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
function parseMoneyInputToScaled(
  raw: string,
  options: { label?: string; allowZero?: boolean } = {},
): ParsedScaled {
  const label = options.label ?? "Rent";
  const allowZero = options.allowZero ?? false;
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0)
    return {
      ok: false,
      error: `Enter ${label.toLowerCase()}.`,
      warnings,
    };

  if (/[A-Za-z]/.test(s0)) {
    return {
      ok: false,
      error: `Enter a valid ${label.toLowerCase()} (example: 2400 or 2400.00).`,
      warnings,
    };
  }

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
    return {
      ok: false,
      error: `${label} must be ${allowZero ? "zero or greater" : "greater than zero"}.`,
      warnings,
    };
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

  if (!allowZero && clamped === 0n) {
    return {
      ok: false,
      error: `${label} must be greater than zero.`,
      warnings,
    };
  }

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

  if (!/^\d+$/.test(s))
    return { ok: false, error: "Enter a whole number of people." };

  const n = Number.parseInt(s, 10);
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
  if (period === "weekly") return mulDivRound(valueScaled, 365n, 7n);
  if (period === "biweekly") return mulDivRound(valueScaled, 365n, 14n);
  if (period === "every_4_weeks") return mulDivRound(valueScaled, 365n, 28n);
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

export default function RentPerPerson() {
  const pageName = "Rent Split Calculator";
  const canonicalUrl = "https://www.rentconverter.com/rent-split-calculator";

  const totalRentInputRef = useRef<HTMLInputElement | null>(null);
  const [isTotalRentFocused, setIsTotalRentFocused] = useState(false);

  const [totalRent, setTotalRent] = useState<string>("2400");
  const [sharedCosts, setSharedCosts] = useState<string>("0");
  const [period, setPeriod] = useState<Period>("monthly");
  const [people, setPeople] = useState<string>("3");
  const [currency, setCurrency] = useState<Currency>("USD");

  useHydrationSafeSavedState({
    restore(storage) {
      const savedRent = validSavedMoney(storage.getItem("rc_rpp_total"), {
        allowZero: false,
      });
      const savedSharedCosts = validSavedMoney(
        storage.getItem("rc_rpp_shared_costs"),
        { allowZero: true },
      );
      const savedPeriod = storage.getItem("rc_rpp_period");
      const savedPeople = validSavedWholeNumber(
        storage.getItem("rc_rpp_people"),
        { min: 1, max: 100 },
      );
      const savedCurrency = storage.getItem("rc_rpp_currency");

      let applied = false;
      if (savedRent !== undefined) {
        setTotalRent(savedRent);
        applied = true;
      }
      if (savedSharedCosts !== undefined) {
        setSharedCosts(savedSharedCosts);
        applied = true;
      }
      if (savedPeriod && isPeriod(savedPeriod)) {
        setPeriod(savedPeriod);
        applied = true;
      }
      if (savedPeople !== undefined) {
        setPeople(savedPeople);
        applied = true;
      }
      if (savedCurrency && isCurrency(savedCurrency)) {
        setCurrency(savedCurrency);
        applied = true;
      }
      return applied;
    },
    persist(storage) {
      storage.setItem("rc_rpp_total", totalRent);
      storage.setItem("rc_rpp_shared_costs", sharedCosts);
      storage.setItem("rc_rpp_period", period);
      storage.setItem("rc_rpp_people", people);
      storage.setItem("rc_rpp_currency", currency);
    },
    dependencies: [totalRent, sharedCosts, period, people, currency],
  });

  const parsedRent = useMemo(
    () => parseMoneyInputToScaled(totalRent, { label: "Rent" }),
    [totalRent],
  );
  const parsedSharedCosts = useMemo(
    () =>
      parseMoneyInputToScaled(sharedCosts, {
        label: "Shared monthly costs",
        allowZero: true,
      }),
    [sharedCosts],
  );
  const parsedPeople = useMemo(() => parsePeopleInput(people), [people]);

  const computed = useMemo(() => {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!parsedRent.ok)
      errors.push(parsedRent.error ?? "Enter a valid rent amount.");
    if (parsedRent.warnings.length) warnings.push(...parsedRent.warnings);

    if (!parsedSharedCosts.ok)
      errors.push(
        parsedSharedCosts.error ?? "Enter valid optional shared monthly costs.",
      );
    if (parsedSharedCosts.warnings.length)
      warnings.push(...parsedSharedCosts.warnings);

    if (!parsedPeople.ok)
      errors.push(parsedPeople.error ?? "Enter a valid number of people.");

    if (errors.length) return { ok: false as const, errors, warnings };

    const rentScaled = parsedRent.scaled as bigint;
    const sharedMonthlyScaled = parsedSharedCosts.scaled as bigint;
    const peopleN = parsedPeople.value as number;

    const annualRentScaled = annualizeFromScaled(rentScaled, period);
    const annualSharedCostsScaled = sharedMonthlyScaled * 12n;
    const annualTotalScaled = annualRentScaled + annualSharedCostsScaled;
    const annualPerPersonScaled = annualTotalScaled / BigInt(peopleN);

    const selectedPeriodTotalScaled = fromAnnualScaled(annualTotalScaled, period);

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

    const centsScale = SCALE / 100n;
    const displayedTotalScaled = roundScaledToDecimals(
      selectedPeriodTotalScaled,
      2,
    );
    const totalCents = displayedTotalScaled / centsScale;
    const allocation = calculateEqualCentAllocation(totalCents, peopleN);
    const perSelectedPeriodScaled = allocation.baseShare * centsScale;

    return {
      ok: true as const,
      warnings,
      peopleN,
      rentScaled,
      sharedMonthlyScaled,
      displayedTotalScaled,
      annualTotalScaled,
      annualPerPersonScaled,
      perSelectedPeriodScaled,
      higherShareScaled: allocation.higherShare * centsScale,
      monthlyAvgPerPersonScaled,
      fourWeekPerPersonScaled,
      breakdown,
      allocation,
    };
  }, [parsedRent, parsedSharedCosts, parsedPeople, period]);

  const fmtMoney = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

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
      q: "How do I split rent equally?",
      a: "Enter the rent, optional shared monthly costs, and number of people. The calculator divides the displayed total evenly for the selected rent period.",
    },
    {
      q: "Can I split monthly rent between roommates?",
      a: "Yes. Select monthly rent, enter the total rent, and enter the number of people. The result shows the monthly amount per person and related breakdowns.",
    },
    {
      q: "Does this calculator handle uneven rent splits?",
      a: "No. This page calculates equal shares only. Use the separate income-based or custom-percentage calculator when the shares should differ.",
    },
    {
      q: "What if the rent does not divide evenly to the cent?",
      a: "The page shows exactly how many people pay one cent more so the displayed shares reconcile to the displayed total.",
    },
    {
      q: "Why does the page show monthly and every 4 weeks separately?",
      a: "Monthly rent and 4-week rent are not the same. A 4-week period is 28 days, while an average month is about 30.42 days.",
    },
    {
      q: "Can I include utilities, parking, or other shared costs?",
      a: "Yes. Enter optional shared monthly costs that should use the same equal split. Leave the field at zero to split rent only.",
    },
    {
      q: "What assumptions does this page use?",
      a: "The calculator uses 365 days per year, 7 days per week, 14 days for biweekly rent, 28 days for every 4 weeks, and 365 ÷ 12 days for an average month.",
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
      "Split rent and optional shared monthly costs evenly, with exact cent-remainder guidance for the selected rent period.",
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

  const sharedCostsId = "rpp_shared_costs";
  const sharedCostsHelpId = "rpp_shared_costs_help";
  const sharedCostsErrorId = "rpp_shared_costs_error";

  const periodId = "rpp_period";
  const peopleId = "rpp_people";
  const peopleHelpId = "rpp_people_help";
  const peopleErrorId = "rpp_people_error";

  const currencyId = "rpp_currency";

  return (
    <main className="min-h-screen bg-sky-50 text-slate-700 scroll-smooth antialiased">
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

      <section id="converter" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 pb-6 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="rc-page-eyebrow">
                  Roommate rent tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Rent Split Calculator
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Split rent and optional shared monthly costs evenly across the
                  selected number of people.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex shrink-0 justify-start sm:justify-end"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window === "undefined") return;
                    window.print();
                  }}
                  className="rc-print-button"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-x-5 gap-y-4 md:grid-cols-12">
            <div className="md:col-span-4">
              <label
                htmlFor={totalRentId}
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className={`w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                  parsedRent.ok
                    ? "focus:bg-white"
                    : "border-rose-300 focus:border-rose-500"
                }`}
                aria-invalid={!parsedRent.ok}
                aria-describedby={`${totalRentHelpId}${!parsedRent.ok ? ` ${totalRentErrorId}` : ""}`}
              />
              <p id={totalRentHelpId} className="mt-1 text-xs text-slate-700">
                Enter the total rent before splitting.
              </p>

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

            <div className="md:col-span-4">
              <label
                htmlFor={sharedCostsId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Optional shared monthly costs
              </label>
              <input
                id={sharedCostsId}
                inputMode="decimal"
                value={sharedCosts}
                onChange={(e) => setSharedCosts(e.target.value)}
                placeholder="e.g. 150 or 0"
                className={`w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                  parsedSharedCosts.ok
                    ? "focus:bg-white"
                    : "border-rose-300 focus:border-rose-500"
                }`}
                aria-invalid={!parsedSharedCosts.ok}
                aria-describedby={`${sharedCostsHelpId}${!parsedSharedCosts.ok ? ` ${sharedCostsErrorId}` : ""}`}
              />
              <p id={sharedCostsHelpId} className="mt-1 text-xs text-slate-700">
                Defaults to zero. Add only monthly costs using the same split.
              </p>

              {!parsedSharedCosts.ok ? (
                <p
                  id={sharedCostsErrorId}
                  className="mt-2 text-sm font-semibold text-rose-700"
                  role="alert"
                >
                  {parsedSharedCosts.error}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-4">
              <label
                htmlFor={periodId}
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
              >
                {(Object.keys(PERIOD_LABEL) as Period[]).map((p) => (
                  <option key={p} value={p}>
                    {PERIOD_LABEL[p]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-6">
              <label
                htmlFor={peopleId}
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                People
              </label>
              <input
                id={peopleId}
                inputMode="numeric"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="e.g. 3"
                className={`w-full rounded-xl bg-slate-100 px-4 py-2 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                  parsedPeople.ok
                    ? "focus:bg-white"
                    : "border-rose-300 focus:border-rose-500"
                }`}
                aria-invalid={!parsedPeople.ok}
                aria-describedby={`${peopleHelpId}${!parsedPeople.ok ? ` ${peopleErrorId}` : ""}`}
              />
              <p id={peopleHelpId} className="mt-1 text-xs text-slate-700">
                Enter how many people are splitting rent.
              </p>

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

            <div className="md:col-span-6">
              <label
                htmlFor={currencyId}
                className="block text-sm font-semibold text-slate-700 mb-2"
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
                className="cursor-pointer w-full rounded-xl bg-slate-100 px-4 py-2 text-lg font-semibold text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
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
            className="mt-5 overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
            role="region"
            aria-label="Results"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

            <div className="p-5 sm:px-6">
              {!computed.ok ? (
                <div className="rounded-2xl bg-white p-4">
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
                    <div className="mt-3 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
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
                  {computed.warnings.length ? (
                    <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
                      <div className="font-semibold">Notes</div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {computed.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full bg-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-semibold text-slate-950">
                      Equal base share
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700 tabular-nums break-words">
                      {fmtMoney(computed.perSelectedPeriodScaled)}
                    </div>
                    <p className="text-sm text-slate-700">
                      Base cent amount for {computed.peopleN}{" "}
                      {computed.peopleN === 1 ? "person" : "people"} in the
                      selected rent period.
                    </p>
                  </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <div className="text-xs text-slate-700">Base rent</div>
                        <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.rentScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-700">Selected rent period</div>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3">
                        <div className="text-xs text-slate-700">Optional shared costs</div>
                        <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.sharedMonthlyScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-700">Per calendar month</div>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3">
                        <div className="text-xs text-slate-700">Total shared cost</div>
                        <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                          {fmtMoney(computed.displayedTotalScaled)}
                        </div>
                        <div className="mt-1 text-xs text-slate-700 leading-relaxed">
                          For the selected rent period
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3">
                        <div className="text-xs text-slate-700">Participants</div>
                        <div className="mt-1 text-lg font-bold text-slate-950 tabular-nums whitespace-nowrap">
                          {computed.peopleN}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white px-4 py-3 sm:col-span-2">
                        <div className="text-xs text-slate-700">Cent-remainder allocation</div>
                        <div className="mt-1 text-sm font-semibold text-slate-950 leading-relaxed">
                          {computed.allocation.remainderCount === 0
                            ? `Everyone pays ${fmtMoney(computed.perSelectedPeriodScaled)}; no cent adjustment is needed.`
                            : `${computed.allocation.remainderCount} ${computed.allocation.remainderCount === 1 ? "person pays" : "people pay"} ${fmtMoney(computed.higherShareScaled)} and ${computed.allocation.baseShareCount} ${computed.allocation.baseShareCount === 1 ? "person pays" : "people pay"} ${fmtMoney(computed.perSelectedPeriodScaled)}.`}
                        </div>
                        <div className="mt-1 text-xs text-slate-700 leading-relaxed">
                          This allocation reconciles exactly to {fmtMoney(computed.displayedTotalScaled)}.
                        </div>
                      </div>

                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-emerald-50 px-4 py-3">
                      <div className="text-xs font-semibold text-emerald-800">
                        Monthly vs every 4 weeks per person
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-xl bg-white/70 px-3 py-2 text-sm text-slate-700 leading-relaxed">
                          Monthly average:{" "}
                          <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                            {fmtMoney(computed.monthlyAvgPerPersonScaled)}
                          </strong>
                        </div>
                        <div className="rounded-xl bg-white/70 px-3 py-2 text-sm text-slate-700 leading-relaxed">
                          Every 4 weeks:{" "}
                          <strong className="text-slate-950 tabular-nums whitespace-nowrap">
                            {fmtMoney(computed.fourWeekPerPersonScaled)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] bg-white p-5 sm:px-6 rc-print-block">
                    <h3 className="text-lg font-bold text-sky-800 mb-2">
                      Full breakdown
                    </h3>
                    <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                      The table annualizes the rent and monthly shared costs,
                      then shows total and per-person amounts across common periods.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="min-w-[860px] w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-700 border-b border-slate-200">
                            <th className="py-2 pr-4 font-semibold">Period</th>
                            <th className="py-2 pr-4 font-semibold">
                              Total shared cost
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Per person
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {computed.breakdown.map((row, index) => (
                            <tr
                              key={row.period}
                              className={`border-b border-slate-100 ${
                                index % 2 === 1 ? "bg-slate-50/50" : ""
                              }`}
                            >
                              <td className="py-2 pr-4 font-semibold text-slate-950">
                                {PERIOD_LABEL[row.period]}
                              </td>
                              <td className="py-2 pr-4 text-slate-950 tabular-nums whitespace-nowrap">
                                {fmtMoney(row.totalScaled)}
                              </td>
                              <td className="py-2 pr-4 text-slate-950 tabular-nums whitespace-nowrap">
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
          </div>

          <Assumptions />

        </div>
      </section>

      <HowItWorks />

      <section className="rc-breadcrumb-section rc-no-print">
        <nav

          aria-label="Breadcrumb"
         className="rc-breadcrumb-nav">
          <a
            href={safeHref("/")}
            className="rc-breadcrumb-link"
          >
            Home
          </a>{" "}
          / <span className="text-slate-800">{pageName}</span>
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between rounded hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 text-slate-700 leading-relaxed">
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
