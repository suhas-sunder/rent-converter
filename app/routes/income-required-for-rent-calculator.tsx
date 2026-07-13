// app/routes/income-required-for-rent-calculator.tsx
import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/income-required-for-rent-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "../client/components/income-required-for-rent-calculator/HowItWorks";
import ToolFit from "~/client/components/income-required-for-rent-calculator/ToolFit";
import {
  useHydrationSafeSavedState,
  validSavedBoolean,
  validSavedDecimal,
  validSavedMoney,
} from "~/client/utils/savedState";

const SITE_URL = "https://www.rentconverter.com";
const PAGE_PATH = "/income-required-for-rent-calculator";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

export const meta: Route.MetaFunction = () => {
  const title = "Income Required for Rent Calculator | 2x 3x Rent Rule";
  const description =
    "Calculate the income required for rent using 2x, 2.5x, 3x, or a custom multiplier. See monthly and annual income targets with printable results.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "income required for rent calculator, rent income multiplier, 3x rent rule, 2.5x rent rule, 2x rent rule, qualify for rent income, gross income for rent, income to rent calculator, maximum rent based on income",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f0f9ff" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: PAGE_URL },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: OG_IMAGE_URL },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE_URL },

    { tagName: "link", rel: "canonical", href: PAGE_URL },
  ];
};

type Period = "monthly" | "annual";

const PERIOD_LABEL: Record<Period, string> = {
  monthly: "Monthly",
  annual: "Annual",
};

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
  "/rent-vs-buy-calculator",
  "/income-required-for-rent-calculator",
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

function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return (n * 100).toFixed(2) + "%";
}

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) {
    return { ok: false, error: "Enter a valid amount.", warnings };
  }
  if (/[a-z]/i.test(s0)) {
    return { ok: false, error: "Enter a valid number without letters.", warnings };
  }

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 1500 or 1500.50).",
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
    return { ok: false, error: "Value must be 0 or greater.", warnings };
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
      const after = parts[1] ?? "";
      const before = parts[0] ?? "";

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

  const maxVal = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxVal);

  if (clamped !== scaled) {
    warnings.push("Value was clamped to the supported maximum for safety.");
  }

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;

  return { ok: true, scaled: clamped, normalized, warnings };
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

type MultiplierPreset = "2" | "2.5" | "3" | "custom";

function isMultiplierPreset(x: string): x is MultiplierPreset {
  return x === "2" || x === "2.5" || x === "3" || x === "custom";
}

function parseMultiplierToScaled(raw: string): ParsedAmount {
  const base = parseMoneyInputToScaled(raw);
  if (!base.ok) {
    return { ...base, error: base.error ?? "Enter a valid multiplier." };
  }
  const scaled = base.scaled as bigint;
  if (scaled <= 0n) {
    return {
      ok: false,
      error: "Multiplier must be greater than 0.",
      warnings: [],
    };
  }
  const maxMul = 100n * SCALE;
  const clamped = clampScaled(scaled, 1n, maxMul);
  const warnings = [...base.warnings];
  if (clamped !== scaled) {
    warnings.push(
      "Multiplier was clamped to the supported maximum for safety.",
    );
  }
  return { ok: true, scaled: clamped, normalized: base.normalized, warnings };
}

function mulScaledByScaled(aScaled: bigint, bScaled: bigint): bigint {
  return (aScaled * bScaled) / SCALE;
}

function divScaledByScaled(
  numeratorScaled: bigint,
  denomScaled: bigint,
): bigint {
  if (denomScaled === 0n) return 0n;
  return (numeratorScaled * SCALE) / denomScaled;
}

export default function IncomeRequiredForRentCalculator() {
  const [modeReverse, setModeReverse] = useState<boolean>(false);
  const [rentMonthly, setRentMonthly] = useState<string>("1500");
  const [incomeMonthly, setIncomeMonthly] = useState<string>("4500");

  const [rentFocused, setRentFocused] = useState<boolean>(false);
  const [incomeFocused, setIncomeFocused] = useState<boolean>(false);

  const [multiplierPreset, setMultiplierPreset] =
    useState<MultiplierPreset>("3");
  const [multiplierCustom, setMultiplierCustom] = useState<string>("3");
  const [currency, setCurrency] = useState<Currency>("USD");

  const copyTimerRef = useRef<number | null>(null);

  useHydrationSafeSavedState({
    restore(storage) {
      const savedMode = validSavedBoolean(storage.getItem("rc_ir_reverse_mode"));
      const savedRent = validSavedMoney(storage.getItem("rc_ir_rent_monthly"), {
        allowZero: true,
      });
      const savedIncome = validSavedMoney(
        storage.getItem("rc_ir_income_monthly"),
        { allowZero: true },
      );
      const savedPreset = storage.getItem("rc_ir_multiplier_preset");
      const savedCustom = validSavedDecimal(
        storage.getItem("rc_ir_multiplier_custom"),
        { min: 0.01, max: 100 },
      );
      const savedCurrency = storage.getItem("rc_ir_currency");

      // These fields describe one direction/multiplier calculation. Restore the
      // group only when it is complete so partial legacy state cannot contradict
      // the visible mode or selected multiplier.
      if (
        savedMode === undefined ||
        savedRent === undefined ||
        savedIncome === undefined ||
        !savedPreset ||
        !isMultiplierPreset(savedPreset) ||
        savedCustom === undefined ||
        !savedCurrency ||
        !isCurrency(savedCurrency)
      ) {
        return false;
      }

      setModeReverse(savedMode);
      setRentMonthly(savedRent);
      setIncomeMonthly(savedIncome);
      setMultiplierPreset(savedPreset);
      setMultiplierCustom(savedCustom);
      setCurrency(savedCurrency);
      return true;
    },
    persist(storage) {
      storage.setItem("rc_ir_reverse_mode", JSON.stringify(modeReverse));
      storage.setItem("rc_ir_rent_monthly", rentMonthly);
      storage.setItem("rc_ir_income_monthly", incomeMonthly);
      storage.setItem("rc_ir_multiplier_preset", multiplierPreset);
      storage.setItem("rc_ir_multiplier_custom", multiplierCustom);
      storage.setItem("rc_ir_currency", currency);
    },
    dependencies: [
      modeReverse,
      rentMonthly,
      incomeMonthly,
      multiplierPreset,
      multiplierCustom,
      currency,
    ],
  });

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const rentParsed = useMemo(
    () => parseMoneyInputToScaled(rentMonthly),
    [rentMonthly],
  );
  const incomeParsed = useMemo(
    () => parseMoneyInputToScaled(incomeMonthly),
    [incomeMonthly],
  );

  const multiplierRaw =
    multiplierPreset === "custom" ? multiplierCustom : multiplierPreset;

  const multiplierParsed = useMemo(
    () => parseMultiplierToScaled(multiplierRaw),
    [multiplierRaw],
  );

  const rentMonthlyScaled = rentParsed.ok ? (rentParsed.scaled as bigint) : 0n;
  const incomeMonthlyScaled = incomeParsed.ok
    ? (incomeParsed.scaled as bigint)
    : 0n;
  const multiplierScaled = multiplierParsed.ok
    ? (multiplierParsed.scaled as bigint)
    : 0n;

  const fmt = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const rentPreview = useMemo(() => {
    if (!rentParsed.ok) return null;
    const normalized = rentParsed.normalized ?? "";
    if (!normalized) return null;
    return groupDigitsFromNormalized(normalized);
  }, [rentParsed.ok, rentParsed.normalized]);

  const incomePreview = useMemo(() => {
    if (!incomeParsed.ok) return null;
    const normalized = incomeParsed.normalized ?? "";
    if (!normalized) return null;
    return groupDigitsFromNormalized(normalized);
  }, [incomeParsed.ok, incomeParsed.normalized]);

  const rentInputValue = rentFocused
    ? rentMonthly
    : rentParsed.ok && rentPreview
      ? rentPreview
      : rentMonthly;

  const incomeInputValue = incomeFocused
    ? incomeMonthly
    : incomeParsed.ok && incomePreview
      ? incomePreview
      : incomeMonthly;

  const canShowResults = useMemo(() => {
    if (!multiplierParsed.ok) return false;
    if (modeReverse) return incomeParsed.ok;
    return rentParsed.ok;
  }, [modeReverse, rentParsed.ok, incomeParsed.ok, multiplierParsed.ok]);

  const resultsScaled = useMemo(() => {
    if (!multiplierParsed.ok) return null;

    const m = multiplierScaled;

    if (!modeReverse) {
      if (!rentParsed.ok) return null;

      const requiredMonthlyIncome = mulScaledByScaled(rentMonthlyScaled, m);
      const requiredAnnualIncome = requiredMonthlyIncome * 12n;

      return {
        headlineLabel: "Required monthly gross income",
        headlineValue: requiredMonthlyIncome,
        rowA: {
          label: "Required annual gross income",
          value: requiredAnnualIncome,
          key: "annual" as const,
        },
        rowB: {
          label: "Multiplier used",
          valueText: `${toNumberSafe(m).toString()}x`,
          key: "multiplier" as const,
        },
        rowC: {
          label: "Monthly rent input",
          value: rentMonthlyScaled,
          key: "rent" as const,
        },
      };
    }

    if (!incomeParsed.ok) return null;

    const maxRentMonthly = divScaledByScaled(incomeMonthlyScaled, m);
    const maxRentAnnual = maxRentMonthly * 12n;

    return {
      headlineLabel: "Maximum rent allowed (monthly)",
      headlineValue: maxRentMonthly,
      rowA: {
        label: "Maximum rent allowed (annual)",
        value: maxRentAnnual,
        key: "annual" as const,
      },
      rowB: {
        label: "Multiplier used",
        valueText: `${toNumberSafe(m).toString()}x`,
        key: "multiplier" as const,
      },
      rowC: {
        label: "Monthly income input",
        value: incomeMonthlyScaled,
        key: "income" as const,
      },
    };
  }, [
    modeReverse,
    rentParsed.ok,
    incomeParsed.ok,
    multiplierParsed.ok,
    rentMonthlyScaled,
    incomeMonthlyScaled,
    multiplierScaled,
  ]);

  const faqData = [
    {
      q: "How does the income required for rent calculation work?",
      a: "In standard mode, required income equals monthly rent multiplied by the selected multiplier. Reverse mode calculates maximum rent by dividing monthly income by that multiplier.",
    },
    {
      q: "What does 3x rent mean?",
      a: "It means monthly gross income is at least three times the monthly rent.",
    },
    {
      q: "Is this gross income or take-home pay?",
      a: "This calculator is designed for gross income, because that is how many listings describe income requirements.",
    },
    {
      q: "Does this include utilities, parking, or fees?",
      a: "No. Enter the rent amount you want to test. If a landlord uses total housing cost, include those costs in the input.",
    },
    {
      q: "Will this guarantee I qualify?",
      a: "No. Actual qualification can depend on the landlord or property manager, jurisdiction, lease, income definition, credit, debt, references, deposits, and other requirements.",
    },
    {
      q: "Does this tool convert currencies or exchange rates?",
      a: "No. Currency selection only changes formatting.",
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
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Income Required for Rent Calculator",
        item: PAGE_URL,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: SITE_URL,
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Income Required for Rent Calculator",
    description:
      "Calculate the income required for rent using common rent multiplier rules.",
    url: PAGE_URL,
    isPartOf: {
      "@type": "WebSite",
      name: "RentConverter.com",
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Income required for rent calculation",
    },
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const activeError = useMemo(() => {
    if (!multiplierParsed.ok)
      return multiplierParsed.error ?? "Enter a valid multiplier.";
    if (!modeReverse) {
      if (!rentParsed.ok)
        return rentParsed.error ?? "Enter a valid monthly rent.";
      return null;
    }
    if (!incomeParsed.ok)
      return incomeParsed.error ?? "Enter a valid monthly income.";
    return null;
  }, [
    modeReverse,
    rentParsed.ok,
    incomeParsed.ok,
    multiplierParsed.ok,
    rentParsed.error,
    incomeParsed.error,
    multiplierParsed.error,
  ]);

  const activeWarnings = useMemo(() => {
    const w: string[] = [];
    if (modeReverse) {
      if (incomeParsed.ok) w.push(...incomeParsed.warnings);
    } else {
      if (rentParsed.ok) w.push(...rentParsed.warnings);
    }
    if (multiplierParsed.ok) w.push(...multiplierParsed.warnings);
    return w;
  }, [
    modeReverse,
    rentParsed.ok,
    incomeParsed.ok,
    multiplierParsed.ok,
    rentParsed.warnings,
    incomeParsed.warnings,
    multiplierParsed.warnings,
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700 scroll-smooth">
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
        id="calculator"
        className="mx-auto max-w-6xl px-4 sm:px-6 pb-6 pt-3 sm:pt-6"
      >
        <div className="overflow-hidden rounded-[1.75rem] bg-white px-5 py-6 sm:px-8 sm:py-7">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 rc-page-eyebrow">
                  Rent income rule calculator
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
                  Income Required for Rent Calculator
                </h1>

                <p className="mt-2 text-base text-slate-700">
                  Calculate the income required for rent using common multiplier
                  rules. You can also reverse it to estimate maximum rent from
                  income.
                </p>
              </div>

              <div
                id="export-controls"
                data-nosnippet
                className="rc-no-print flex flex-wrap gap-2 sm:justify-end"
              >
                <button
                  type="button"
                  onClick={handlePrint}
                  className="rc-print-button"
                >
                  Print / Save PDF
                </button>

              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-xl border border-slate-200 bg-sky-50/60 px-4 py-3 rc-no-print">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={modeReverse}
                    onChange={(e) => setModeReverse(e.target.checked)}
                    className="cursor-pointer h-4 w-4 rounded border-slate-300 text-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  />
                  Reverse mode: income to max rent
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {!modeReverse ? (
                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Monthly rent
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        inputMode="decimal"
                        value={rentInputValue}
                        onChange={(e) => setRentMonthly(e.target.value)}
                        onFocus={() => setRentFocused(true)}
                        onBlur={() => setRentFocused(false)}
                        placeholder="e.g. 1500 or 1500.50"
                        className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                        aria-invalid={!rentParsed.ok && !modeReverse}
                        aria-describedby="rc-rent-help rc-active-error"
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
                        className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition hover:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
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
                      id="rc-rent-help"
                      className="mt-2 text-xs text-slate-700"
                    >
                      Enter the monthly rent amount. Currency symbols, commas,
                      and decimals are accepted.
                    </p>
                  </div>
                ) : (
                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Monthly gross income
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        inputMode="decimal"
                        value={incomeInputValue}
                        onChange={(e) => setIncomeMonthly(e.target.value)}
                        onFocus={() => setIncomeFocused(true)}
                        onBlur={() => setIncomeFocused(false)}
                        placeholder="e.g. 4500 or 4500.00"
                        className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                        aria-invalid={!incomeParsed.ok && modeReverse}
                        aria-describedby="rc-income-help rc-active-error"
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
                        className="cursor-pointer rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition hover:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
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
                      id="rc-income-help"
                      className="mt-2 text-xs text-slate-700"
                    >
                      Enter monthly gross income. Currency symbols, commas, and
                      decimals are accepted.
                    </p>
                  </div>
                )}

                <div className="sm:col-span-1">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Income multiplier
                  </label>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={multiplierPreset}
                      onChange={(e) =>
                        setMultiplierPreset(
                          isMultiplierPreset(e.target.value)
                            ? (e.target.value as MultiplierPreset)
                            : "3",
                        )
                      }
                      className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-lg font-semibold text-slate-950 outline-none transition hover:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                      aria-label="Income multiplier preset"
                      aria-invalid={!multiplierParsed.ok}
                      aria-describedby="rc-multiplier-help rc-active-error"
                    >
                      <option value="2">2x</option>
                      <option value="2.5">2.5x</option>
                      <option value="3">3x</option>
                      <option value="custom">Custom</option>
                    </select>

                    {multiplierPreset === "custom" ? (
                      <input
                        inputMode="decimal"
                        value={multiplierCustom}
                        onChange={(e) => setMultiplierCustom(e.target.value)}
                        placeholder="e.g. 3"
                        className="w-full cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-lg text-slate-950 placeholder:text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-sky-200 focus-visible:ring-2 focus-visible:ring-sky-400"
                        aria-invalid={!multiplierParsed.ok}
                        aria-describedby="rc-multiplier-help rc-active-error"
                      />
                    ) : null}
                  </div>

                  <p
                    id="rc-multiplier-help"
                    className="mt-2 text-xs text-slate-700"
                  >
                    Choose a preset multiplier or enter a custom value.
                  </p>
                </div>
              </div>

              {activeError ? (
                <p
                  id="rc-active-error"
                  className="text-sm font-semibold text-rose-700"
                  role="alert"
                  aria-live="assertive"
                >
                  {activeError}
                </p>
              ) : activeWarnings.length ? (
                <div
                  className="rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900"
                  role="status"
                  aria-live="polite"
                >
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {activeWarnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div
              className="overflow-hidden rounded-[1.5rem] bg-sky-50 rc-print-block"
              aria-live="polite"
              role="region"
              aria-label={
                modeReverse
                  ? "Maximum rent allowed results"
                  : "Income required results"
              }
            >
              <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />


              <div className="p-5 sm:px-6">

              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full bg-sky-600"
                  aria-hidden="true"
                />
                <div className="text-sm font-semibold text-slate-950">
                  {modeReverse ? "Maximum rent allowed" : "Income required"}
                </div>
              </div>

              {!canShowResults || !resultsScaled ? (
                <div className="mt-3 rounded-2xl bg-white px-4 py-4 text-slate-700 shadow-sm">
                  <div className="font-semibold text-slate-950">
                    No result to show yet
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Enter a valid {modeReverse ? "income" : "monthly rent"} and
                    multiplier above to see the result.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3">
                    <div className="text-xs font-medium text-emerald-700">
                      {resultsScaled.headlineLabel}
                    </div>
                    <div className="mt-1 text-3xl font-extrabold text-emerald-700 sm:text-5xl">
                      {fmt(resultsScaled.headlineValue)}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      Based on the selected income multiplier.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs font-medium text-slate-700">
                        {resultsScaled.rowA.label}
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950">
                        {fmt(resultsScaled.rowA.value)}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs font-medium text-slate-700">
                        {resultsScaled.rowB.label}
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950">
                        {resultsScaled.rowB.valueText}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3">
                      <div className="text-xs font-medium text-slate-700">
                        {resultsScaled.rowC.label}
                      </div>
                      <div className="mt-1 text-lg font-bold text-slate-950">
                        {fmt(resultsScaled.rowC.value)}
                      </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3 rounded-2xl bg-emerald-50 px-4 py-3">
                      <div className="text-xs font-medium text-emerald-700">
                        Quick example
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">
                        {fmt(1500n * SCALE)} rent at{" "}
                        {fmt(3n * SCALE).replace(/[^0-9.,]/g, "")}x income
                        requires{" "}
                        <span className="font-semibold text-slate-950">
                          {fmt(mulScaledByScaled(1500n * SCALE, 3n * SCALE))}
                        </span>{" "}
                        monthly gross income, or{" "}
                        <span className="font-semibold text-slate-950">
                          {fmt(
                            mulScaledByScaled(1500n * SCALE, 3n * SCALE) * 12n,
                          )}
                        </span>{" "}
                        annually.
                      </p>
                    </div>
                  </div>
                </>
              )}


              </div></div>

            <Assumptions />

            <div className="rc-no-print rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-slate-950">
                Precision note
              </div>

              <p className="text-xs leading-relaxed text-slate-700">
                Calculations preserve precision internally, while displayed
                money values are rounded to cents.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="mx-auto max-w-6xl px-6 text-sm text-slate-700">
          {ROUTE_WHITELIST.has("/") ? (
            <SafeLink
              href="/"
              className="cursor-pointer rounded text-sky-800 transition hover:text-sky-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              Home
            </SafeLink>
          ) : (
            <span>Home</span>
          )}{" "}
          / Income Required for Rent Calculator
        </nav>
      </section>

      <ToolFit />

      <section id="faq" className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-sky-800">
          Frequently Asked Questions
        </h2>

        <p className="mx-auto mb-6 max-w-6xl text-center text-slate-700">
          These answers explain income multiplier rules, reverse mode, and what
          the result does not guarantee.
        </p>

        <div className="space-y-3">
          {faqData.map((f, i) => (
            <details key={i} className="group rounded-2xl bg-slate-50 px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded text-lg font-semibold text-sky-800 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                <span>{f.q}</span>
                <span className="ml-4 text-slate-600 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="mt-2 leading-relaxed text-slate-700">
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
