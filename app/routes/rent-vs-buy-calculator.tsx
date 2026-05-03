import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-vs-buy-calculator";
import Assumptions from "~/client/components/layout/Assumptions";
import HowItWorks from "~/client/components/rent-vs-buy-calculator/HowItWorks";
import ToolFit from "~/client/components/rent-vs-buy-calculator/ToolFit";

export const meta: Route.MetaFunction = () => {
  const title = "Rent vs Buy Calculator | Compare Renting and Buying";
  const description =
    "Compare renting vs buying over time with rent paid, ownership costs, equity, and break-even estimates. Results calculate in your browser.";

  const canonicalUrl = "https://www.rentconverter.com/rent-vs-buy-calculator";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },

    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "rent vs buy calculator, rent or buy calculator, break even rent vs buy, renting vs buying, home ownership cost calculator, buy vs rent analysis",
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
  "/rent-affordability-calculator",
  "/rent-paid-weekly-vs-monthly",
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

const MAX_SAFE_INT_FOR_NUMBER = 9_000_000_000_000_000n; // ~9e15, JS Number integer precision limit

function absBigInt(x: bigint): bigint {
  return x < 0n ? -x : x;
}

function toNumberSafe(scaled: bigint): number {
  const a = absBigInt(scaled);
  const limit = MAX_SAFE_INT_FOR_NUMBER * SCALE;
  if (a > limit) return Number.NaN;
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

type ParsedPercent = { ok: boolean; value?: number; error?: string };
function parsePercentInput(raw: string, label: string): ParsedPercent {
  const s0 = (raw ?? "").trim();
  if (!s0) return { ok: false, error: `Enter ${label}.` };

  const cleaned = s0.replace(/[^\d.,\-]/g, "");
  if (!cleaned) return { ok: false, error: `Enter a valid ${label}.` };
  if (cleaned.includes("-"))
    return { ok: false, error: `${label} must be 0 or greater.` };

  let s = cleaned;
  if (s.includes(",") && !s.includes(".")) s = s.replace(",", ".");
  if (s.includes(",") && s.includes(".")) s = s.replace(/,/g, "");

  const n = Number.parseFloat(s);
  if (!Number.isFinite(n))
    return { ok: false, error: `Enter a valid ${label}.` };
  if (n < 0) return { ok: false, error: `${label} must be 0 or greater.` };
  if (n > 100) return { ok: false, error: `${label} must be 100 or less.` };
  return { ok: true, value: n };
}

type ParsedInt = { ok: boolean; value?: number; error?: string };
function parseNonNegInt(raw: string, label: string, max: number): ParsedInt {
  const s = (raw ?? "").trim();
  if (!s) return { ok: false, error: `Enter ${label}.` };
  const cleaned = s.replace(/[^\d]/g, "");
  if (!cleaned)
    return { ok: false, error: `Enter a whole number for ${label}.` };
  const n = Number.parseInt(cleaned, 10);
  if (!Number.isFinite(n))
    return { ok: false, error: `Enter a valid ${label}.` };
  if (n < 0) return { ok: false, error: `${label} must be 0 or more.` };
  if (n > max) return { ok: false, error: `${label} must be ${max} or less.` };
  return { ok: true, value: n };
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

function groupThousandsEnUs(intStr: string): string {
  const s = intStr.replace(/^0+(?=\d)/, "") || "0";
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const idxFromRight = s.length - i;
    out += s[i];
    if (idxFromRight > 1 && idxFromRight % 3 === 1) out += ",";
  }
  return out;
}

function inferPreviewDecimalsFromRaw(raw: string): number {
  const s0 = (raw ?? "").trim();
  if (!s0) return 0;

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,]/g, "");
  if (!s) return 0;

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

  if (!decimalSep) return 0;

  const split = s.split(decimalSep);
  if (split.length !== 2) return 0;
  const frac = split[1] ?? "";
  if (!frac) return 0;
  if (!/^\d+$/.test(frac)) return 0;
  return Math.max(0, Math.min(12, frac.length));
}

function formatPreviewFromScaledAndRaw(scaled: bigint, raw: string): string {
  const decimals = inferPreviewDecimalsFromRaw(raw);
  const intPart = scaled / SCALE;
  const fracPart = scaled % SCALE;

  const intStr = groupThousandsEnUs(intPart.toString());

  if (decimals <= 0) return intStr;

  const fracFull = fracPart.toString().padStart(Number(MAX_DECIMALS), "0");
  const fracOut = fracFull.slice(0, decimals);
  return `${intStr}.${fracOut}`;
}

function pctToRate(p: number) {
  return (Number.isFinite(p) ? p : 0) / 100;
}

function monthlyPayment(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12;
  if (r <= 0) return principal / months;
  const pow = Math.pow(1 + r, months);
  return principal * ((r * pow) / (pow - 1));
}

type YearRow = {
  year: number;
  rentAnnual: bigint;
  rentCumulative: bigint;
  homeValue: bigint;
  mortgageBalanceEnd: bigint;
  principalPaidThisYear: bigint;
  interestPaidThisYear: bigint;
  ownershipAnnualOutflow: bigint;
  ownershipCumulativeOutflow: bigint;
  equityEnd: bigint;
};

function roundToScaled(n: number): bigint {
  if (!Number.isFinite(n)) return 0n;

  const sign = n < 0 ? -1n : 1n;
  const abs = Math.abs(n);

  // Avoid `n * Number(SCALE)` which can lose precision for large values.
  // Convert to a fixed-decimal string and scale via bigint math.
  const fixed = abs.toFixed(Number(MAX_DECIMALS));
  const [intPart, fracPartRaw = ""] = fixed.split(".");
  const fracPart = fracPartRaw
    .padEnd(Number(MAX_DECIMALS), "0")
    .slice(0, Number(MAX_DECIMALS));

  const scaled =
    BigInt(intPart || "0") * SCALE + BigInt(fracPart.length ? fracPart : "0");

  return sign < 0n ? -scaled : scaled;
}

function divRound(n: bigint, d: bigint): bigint {
  if (d === 0n) return 0n;
  return (n + d / 2n) / d;
}

function mulDivRound(a: bigint, b: bigint, d: bigint): bigint {
  return divRound(a * b, d);
}

function rateToScaled(rate: number): bigint {
  if (!Number.isFinite(rate) || rate <= 0) return 0n;
  const v = Math.round(rate * Number(SCALE));
  if (!Number.isFinite(v) || v <= 0) return 0n;
  return BigInt(v);
}

function scaledMulRate(scaled: bigint, rate: number): bigint {
  const rScaled = rateToScaled(rate);
  if (rScaled <= 0n) return 0n;
  return mulDivRound(scaled, rScaled, SCALE);
}

function scaledAdd(a: bigint, b: bigint): bigint {
  return a + b;
}

function scaledSub(a: bigint, b: bigint): bigint {
  return a - b;
}

function scaledMax0(a: bigint): bigint {
  return a < 0n ? 0n : a;
}

export default function RentVsBuyCalculator() {
  const pageName = "Rent vs Buy Calculator";
  const canonicalUrl = "https://www.rentconverter.com/rent-vs-buy-calculator";

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = localStorage.getItem("rc_rvb_currency") ?? "USD";
    return isCurrency(saved) ? saved : "USD";
  });

  const [monthlyRent, setMonthlyRent] = useState<string>(() => {
    if (typeof window === "undefined") return "2200";
    return localStorage.getItem("rc_rvb_rent") ?? "2200";
  });
  const [rentIncreasePct, setRentIncreasePct] = useState<string>(() => {
    if (typeof window === "undefined") return "3";
    return localStorage.getItem("rc_rvb_rent_increase") ?? "3";
  });

  const [homePrice, setHomePrice] = useState<string>(() => {
    if (typeof window === "undefined") return "550000";
    return localStorage.getItem("rc_rvb_price") ?? "550000";
  });
  const [downPaymentPct, setDownPaymentPct] = useState<string>(() => {
    if (typeof window === "undefined") return "20";
    return localStorage.getItem("rc_rvb_down") ?? "20";
  });
  const [mortgageRatePct, setMortgageRatePct] = useState<string>(() => {
    if (typeof window === "undefined") return "5.5";
    return localStorage.getItem("rc_rvb_rate") ?? "5.5";
  });
  const [mortgageTermYears, setMortgageTermYears] = useState<string>(() => {
    if (typeof window === "undefined") return "25";
    return localStorage.getItem("rc_rvb_term") ?? "25";
  });

  const [propertyTaxPct, setPropertyTaxPct] = useState<string>(() => {
    if (typeof window === "undefined") return "1.0";
    return localStorage.getItem("rc_rvb_tax") ?? "1.0";
  });
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<string>(() => {
    if (typeof window === "undefined") return "1200";
    return localStorage.getItem("rc_rvb_ins") ?? "1200";
  });
  const [maintenancePct, setMaintenancePct] = useState<string>(() => {
    if (typeof window === "undefined") return "1.0";
    return localStorage.getItem("rc_rvb_maint") ?? "1.0";
  });
  const [hoaMonthly, setHoaMonthly] = useState<string>(() => {
    if (typeof window === "undefined") return "0";
    return localStorage.getItem("rc_rvb_hoa") ?? "0";
  });

  const [buyClosingCosts, setBuyClosingCosts] = useState<string>(() => {
    if (typeof window === "undefined") return "8000";
    return localStorage.getItem("rc_rvb_buy_close") ?? "8000";
  });
  const [sellCostPct, setSellCostPct] = useState<string>(() => {
    if (typeof window === "undefined") return "5";
    return localStorage.getItem("rc_rvb_sell_cost") ?? "5";
  });

  const [homeAppreciationPct, setHomeAppreciationPct] = useState<string>(() => {
    if (typeof window === "undefined") return "3";
    return localStorage.getItem("rc_rvb_app") ?? "3";
  });

  const [horizonYears, setHorizonYears] = useState<string>(() => {
    if (typeof window === "undefined") return "7";
    return localStorage.getItem("rc_rvb_years") ?? "7";
  });

  const [rentFocused, setRentFocused] = useState(false);
  const [homePriceFocused, setHomePriceFocused] = useState(false);
  const [homeInsuranceFocused, setHomeInsuranceFocused] = useState(false);
  const [hoaFocused, setHoaFocused] = useState(false);
  const [buyClosingFocused, setBuyClosingFocused] = useState(false);

  const [rentTouched, setRentTouched] = useState(false);
  const [homePriceTouched, setHomePriceTouched] = useState(false);
  const [homeInsuranceTouched, setHomeInsuranceTouched] = useState(false);
  const [hoaTouched, setHoaTouched] = useState(false);
  const [buyClosingTouched, setBuyClosingTouched] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_rvb_currency", currency);

      localStorage.setItem("rc_rvb_rent", monthlyRent);
      localStorage.setItem("rc_rvb_rent_increase", rentIncreasePct);

      localStorage.setItem("rc_rvb_price", homePrice);
      localStorage.setItem("rc_rvb_down", downPaymentPct);
      localStorage.setItem("rc_rvb_rate", mortgageRatePct);
      localStorage.setItem("rc_rvb_term", mortgageTermYears);

      localStorage.setItem("rc_rvb_tax", propertyTaxPct);
      localStorage.setItem("rc_rvb_ins", homeInsuranceAnnual);
      localStorage.setItem("rc_rvb_maint", maintenancePct);
      localStorage.setItem("rc_rvb_hoa", hoaMonthly);

      localStorage.setItem("rc_rvb_buy_close", buyClosingCosts);
      localStorage.setItem("rc_rvb_sell_cost", sellCostPct);

      localStorage.setItem("rc_rvb_app", homeAppreciationPct);
      localStorage.setItem("rc_rvb_years", horizonYears);
    } catch {}
  }, [
    currency,
    monthlyRent,
    rentIncreasePct,
    homePrice,
    downPaymentPct,
    mortgageRatePct,
    mortgageTermYears,
    propertyTaxPct,
    homeInsuranceAnnual,
    maintenancePct,
    hoaMonthly,
    buyClosingCosts,
    sellCostPct,
    homeAppreciationPct,
    horizonYears,
  ]);

  const parsed = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const rent = parseMoneyInputToScaled(monthlyRent, "monthly rent");
    if (!rent.ok) errors.push(rent.error ?? "Enter monthly rent.");
    warnings.push(...rent.warnings);

    const rentIncrease = parsePercentInput(
      rentIncreasePct,
      "annual rent increase (%)",
    );
    if (!rentIncrease.ok)
      errors.push(rentIncrease.error ?? "Enter annual rent increase.");

    const price = parseMoneyInputToScaled(homePrice, "home price");
    if (!price.ok) errors.push(price.error ?? "Enter home price.");
    warnings.push(...price.warnings);

    const downPct = parsePercentInput(downPaymentPct, "down payment (%)");
    if (!downPct.ok) errors.push(downPct.error ?? "Enter down payment.");

    const ratePct = parsePercentInput(mortgageRatePct, "mortgage rate (%)");
    if (!ratePct.ok) errors.push(ratePct.error ?? "Enter mortgage rate.");

    const termYears = parseNonNegInt(
      mortgageTermYears,
      "mortgage term (years)",
      50,
    );
    if (!termYears.ok) errors.push(termYears.error ?? "Enter mortgage term.");

    const propTax = parsePercentInput(
      propertyTaxPct,
      "property tax (% per year)",
    );
    if (!propTax.ok) errors.push(propTax.error ?? "Enter property tax.");

    const insAnnual = parseMoneyInputToScaled(
      homeInsuranceAnnual,
      "annual home insurance",
    );
    if (!insAnnual.ok)
      errors.push(insAnnual.error ?? "Enter annual home insurance.");
    warnings.push(...insAnnual.warnings);

    const maint = parsePercentInput(maintenancePct, "maintenance (% per year)");
    if (!maint.ok) errors.push(maint.error ?? "Enter maintenance.");

    const hoa = parseMoneyInputToScaled(hoaMonthly, "monthly HOA");
    if (!hoa.ok) errors.push(hoa.error ?? "Enter HOA.");
    warnings.push(...hoa.warnings);

    const buyClose = parseMoneyInputToScaled(
      buyClosingCosts,
      "buy closing costs",
    );
    if (!buyClose.ok) errors.push(buyClose.error ?? "Enter buy closing costs.");
    warnings.push(...buyClose.warnings);

    const sellPct = parsePercentInput(sellCostPct, "selling costs (%)");
    if (!sellPct.ok) errors.push(sellPct.error ?? "Enter selling costs.");

    const appPct = parsePercentInput(
      homeAppreciationPct,
      "home appreciation (%)",
    );
    if (!appPct.ok) errors.push(appPct.error ?? "Enter home appreciation.");

    const years = parseNonNegInt(horizonYears, "time horizon (years)", 60);
    if (!years.ok) errors.push(years.error ?? "Enter time horizon.");

    return {
      ok: errors.length === 0,
      errors,
      warnings,
      rent,
      rentIncrease,
      price,
      downPct,
      ratePct,
      termYears,
      propTax,
      insAnnual,
      maint,
      hoa,
      buyClose,
      sellPct,
      appPct,
      years,
    };
  }, [
    monthlyRent,
    rentIncreasePct,
    homePrice,
    downPaymentPct,
    mortgageRatePct,
    mortgageTermYears,
    propertyTaxPct,
    homeInsuranceAnnual,
    maintenancePct,
    hoaMonthly,
    buyClosingCosts,
    sellCostPct,
    homeAppreciationPct,
    horizonYears,
  ]);

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const horizon = parsed.years.value as number;

    const rentMonthlyScaled = parsed.rent.scaled as bigint;
    const rentIncreaseRate = pctToRate(parsed.rentIncrease.value as number);

    const priceScaled = parsed.price.scaled as bigint;
    const downRate = pctToRate(parsed.downPct.value as number);
    const mortgageRate = pctToRate(parsed.ratePct.value as number);
    const termYears = parsed.termYears.value as number;

    const propTaxRate = pctToRate(parsed.propTax.value as number);
    const insAnnualScaled = parsed.insAnnual.scaled as bigint;
    const maintRate = pctToRate(parsed.maint.value as number);
    const hoaMonthlyScaled = parsed.hoa.scaled as bigint;

    const buyCloseScaled = parsed.buyClose.scaled as bigint;
    const sellRate = pctToRate(parsed.sellPct.value as number);
    const appRate = pctToRate(parsed.appPct.value as number);

    const priceNum = toNumberSafe(priceScaled);
    const downPaymentNum = priceNum * downRate;
    const loanPrincipalNum = Math.max(0, priceNum - downPaymentNum);
    const termMonths = Math.max(0, termYears * 12);
    const paymentMonthlyNum = monthlyPayment(
      loanPrincipalNum,
      mortgageRate,
      termMonths,
    );

    const downPaymentScaled = roundToScaled(downPaymentNum);
    const loanPrincipalScaled = scaledMax0(
      scaledSub(priceScaled, downPaymentScaled),
    );
    const monthlyMortgagePaymentScaled = roundToScaled(paymentMonthlyNum);

    let rentMonthlyThisYearScaled = rentMonthlyScaled;
    let rentCumScaled = 0n;

    let homeValueScaled = priceScaled;
    let balanceNum = loanPrincipalNum;
    let ownCumOutflowScaled = 0n;

    const rows: YearRow[] = [];

    for (let y = 1; y <= horizon; y++) {
      const rentAnnualScaled = rentMonthlyThisYearScaled * 12n;
      rentCumScaled = scaledAdd(rentCumScaled, rentAnnualScaled);

      if (y > 1) {
        const hv = toNumberSafe(homeValueScaled) * (1 + appRate);
        homeValueScaled = roundToScaled(hv);
      }

      let interestThisYearNum = 0;
      let principalThisYearNum = 0;

      for (let m = 0; m < 12; m++) {
        if (balanceNum <= 0) break;
        const i = balanceNum * (mortgageRate / 12);
        const p = Math.max(0, paymentMonthlyNum - i);
        interestThisYearNum += i;
        principalThisYearNum += Math.min(p, balanceNum);
        balanceNum = Math.max(0, balanceNum - p);
      }

      const interestThisYearScaled = roundToScaled(interestThisYearNum);
      const principalThisYearScaled = roundToScaled(principalThisYearNum);
      const mortgageBalanceEndScaled = roundToScaled(balanceNum);

      const propertyTaxAnnualScaled = scaledMulRate(
        homeValueScaled,
        propTaxRate,
      );
      const maintenanceAnnualScaled = scaledMulRate(homeValueScaled, maintRate);
      const hoaAnnualScaled = hoaMonthlyScaled * 12n;
      const mortgageOutflowAnnualScaled = monthlyMortgagePaymentScaled * 12n;

      const ownershipAnnualOutflowScaled = scaledAdd(
        scaledAdd(
          scaledAdd(mortgageOutflowAnnualScaled, propertyTaxAnnualScaled),
          insAnnualScaled,
        ),
        scaledAdd(maintenanceAnnualScaled, hoaAnnualScaled),
      );

      ownCumOutflowScaled = scaledAdd(
        ownCumOutflowScaled,
        ownershipAnnualOutflowScaled,
      );

      const equityEndScaled = scaledMax0(
        scaledSub(homeValueScaled, mortgageBalanceEndScaled),
      );

      rows.push({
        year: y,
        rentAnnual: rentAnnualScaled,
        rentCumulative: rentCumScaled,

        homeValue: homeValueScaled,
        mortgageBalanceEnd: mortgageBalanceEndScaled,
        principalPaidThisYear: principalThisYearScaled,
        interestPaidThisYear: interestThisYearScaled,

        ownershipAnnualOutflow: ownershipAnnualOutflowScaled,
        ownershipCumulativeOutflow: ownCumOutflowScaled,

        equityEnd: equityEndScaled,
      });

      const nextRentNum =
        toNumberSafe(rentMonthlyThisYearScaled) * (1 + rentIncreaseRate);
      rentMonthlyThisYearScaled = roundToScaled(nextRentNum);
    }

    const last = rows[rows.length - 1];

    const endingHomeValueScaled = last ? last.homeValue : priceScaled;
    const endingBalanceScaled = last
      ? last.mortgageBalanceEnd
      : loanPrincipalScaled;

    const estimatedSellCostsScaled = scaledMulRate(
      endingHomeValueScaled,
      sellRate,
    );
    const estimatedNetSaleProceedsScaled = scaledMax0(
      scaledSub(
        scaledSub(endingHomeValueScaled, estimatedSellCostsScaled),
        endingBalanceScaled,
      ),
    );

    const totalRentCostScaled = rentCumScaled;

    const totalOwnershipOutflowScaled = scaledAdd(
      scaledAdd(ownCumOutflowScaled, buyCloseScaled),
      downPaymentScaled,
    );

    const ownershipNetCostScaled = scaledMax0(
      scaledSub(totalOwnershipOutflowScaled, estimatedNetSaleProceedsScaled),
    );

    let breakEvenYear: number | null = null;
    for (const r of rows) {
      const ownApproxNetToDateScaled = scaledMax0(
        scaledSub(
          scaledAdd(
            scaledAdd(r.ownershipCumulativeOutflow, downPaymentScaled),
            buyCloseScaled,
          ),
          r.equityEnd,
        ),
      );
      if (ownApproxNetToDateScaled <= r.rentCumulative) {
        breakEvenYear = r.year;
        break;
      }
    }

    const firstYear = rows[0];
    const firstYearRentAnnualScaled = firstYear
      ? firstYear.rentAnnual
      : rentMonthlyScaled * 12n;
    const firstYearOwnOutflowScaled = firstYear
      ? firstYear.ownershipAnnualOutflow
      : 0n;
    const annualCashGapScaled = scaledSub(
      firstYearOwnOutflowScaled,
      firstYearRentAnnualScaled,
    );

    return {
      ok: true as const,
      warnings: parsed.warnings,

      inputs: {
        horizon,
        rentIncreasePct: parsed.rentIncrease.value as number,
        mortgageRatePct: parsed.ratePct.value as number,
        downPaymentPct: parsed.downPct.value as number,
        termYears,
        propertyTaxPct: parsed.propTax.value as number,
        maintenancePct: parsed.maint.value as number,
        homeAppreciationPct: parsed.appPct.value as number,
        sellCostPct: parsed.sellPct.value as number,
      },

      downPaymentScaled,
      buyCloseScaled,
      loanPrincipalScaled,
      monthlyMortgagePaymentScaled,

      totalRentCostScaled,
      totalOwnershipOutflowScaled,
      estimatedSellCostsScaled,
      estimatedNetSaleProceedsScaled,
      ownershipNetCostScaled,

      breakEvenYear,
      annualCashGapScaled,

      endingHomeValueScaled,
      endingBalanceScaled,

      rows,
    };
  }, [parsed]);

  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "What does this rent vs buy calculator estimate?",
      a: "It estimates total rent paid over a chosen time horizon and compares it to a simplified ownership model that includes mortgage payments, property tax, insurance, maintenance, HOA, and estimated selling costs, then subtracts estimated net sale proceeds.",
    },
    {
      q: "Why show both ownership “outflow” and a “net cost”?",
      a: "Buying has cash leaving the household and also builds equity. Net cost compares ownership outflow after accounting for estimated sale proceeds at the end of the horizon.",
    },
    {
      q: "Does the mortgage payment include property tax and insurance?",
      a: "No. The mortgage payment shown is principal and interest only. Property tax, insurance, maintenance, and HOA are added separately so the full ownership cost is visible.",
    },
    {
      q: "How are rent increases applied?",
      a: "Rent is grown once per year by the annual rent increase percentage. The model uses a 12-month year for rent budgeting and comparison.",
    },
    {
      q: "How is home appreciation applied?",
      a: "Home value is grown once per year by the appreciation rate. This affects estimated sale proceeds and any costs modeled as a percent of home value.",
    },
    {
      q: "What does “break-even year” mean here?",
      a: "It is the first year where the ownership estimate becomes less expensive than renting in this model, comparing cumulative ownership outflow (plus upfront costs, minus estimated equity) against cumulative rent paid.",
    },
    {
      q: "Does this include tax effects or deductions?",
      a: "No. Tax impacts are not modeled. This keeps the tool focused on cash costs and a basic equity estimate rather than jurisdiction-specific tax rules.",
    },
    {
      q: "How accurate are the results?",
      a: "They are estimates based on simplified assumptions. Real outcomes depend on mortgage terms, fees, maintenance, market changes, move timing, and the exact terms of rent and sale.",
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
        item: "https://www.rentconverter.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: pageName,
        item: canonicalUrl,
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RentConverter.com",
    url: "https://www.rentconverter.com",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    description:
      "Compare renting and buying using rent, mortgage, ownership costs, equity, and selling costs.",
    url: canonicalUrl,
    isPartOf: { "@type": "WebSite", url: "https://www.rentconverter.com" },
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
  };

  const monthlyRentDisplayValue = rentFocused
    ? monthlyRent
    : parsed.rent.ok
      ? formatPreviewFromScaledAndRaw(parsed.rent.scaled as bigint, monthlyRent)
      : monthlyRent;

  const homePriceDisplayValue = homePriceFocused
    ? homePrice
    : parsed.price.ok
      ? formatPreviewFromScaledAndRaw(parsed.price.scaled as bigint, homePrice)
      : homePrice;

  const homeInsuranceDisplayValue = homeInsuranceFocused
    ? homeInsuranceAnnual
    : parsed.insAnnual.ok
      ? formatPreviewFromScaledAndRaw(
          parsed.insAnnual.scaled as bigint,
          homeInsuranceAnnual,
        )
      : homeInsuranceAnnual;

  const hoaDisplayValue = hoaFocused
    ? hoaMonthly
    : parsed.hoa.ok
      ? formatPreviewFromScaledAndRaw(parsed.hoa.scaled as bigint, hoaMonthly)
      : hoaMonthly;

  const buyClosingDisplayValue = buyClosingFocused
    ? buyClosingCosts
    : parsed.buyClose.ok
      ? formatPreviewFromScaledAndRaw(
          parsed.buyClose.scaled as bigint,
          buyClosingCosts,
        )
      : buyClosingCosts;

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 text-slate-700 scroll-smooth antialiased">
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
        className="mx-auto max-w-6xl px-6 py-6"
      >
        <div className="rounded-2xl bg-white/95 pb-6 shadow-sm border border-slate-200 sm:px-8">
          <div className="pt-5 sm:pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                  Rent vs buy tool
                </div>

                <h1 className="mt-3 text-center sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-900 tracking-tight">
                  Rent vs Buy Calculator
                </h1>

                <p className="mt-2 max-w-3xl text-base text-slate-700">
                  Compare renting and buying over time. The calculator estimates
                  rent paid, ownership costs, equity, and break-even timing.
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
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-12">
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
              <h3 className="text-lg font-bold text-sky-800 mb-3">
                Rent assumptions
              </h3>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Monthly rent
              </label>
              <input
                inputMode="decimal"
                value={monthlyRentDisplayValue}
                onChange={(e) => setMonthlyRent(e.target.value)}
                onFocus={() => setRentFocused(true)}
                onBlur={() => {
                  setRentFocused(false);
                  setRentTouched(true);
                }}
                placeholder="e.g. 2200"
                className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                  parsed.rent.ok
                    ? "border-slate-300 focus:border-sky-500"
                    : "border-rose-300 focus:border-rose-500"
                }`}
                aria-invalid={!parsed.rent.ok}
              />
              {rentTouched && !rentFocused && !parsed.rent.ok ? (
                <p className="mt-2 text-xs font-semibold text-rose-700">
                  {parsed.rent.error ?? "Enter monthly rent."}
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-600">
                  Accepted inputs: $2,200, 2200.00, .5, 12., 2200,50.
                </p>
              )}

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Annual rent increase (%)
                </label>
                <input
                  inputMode="decimal"
                  value={rentIncreasePct}
                  onChange={(e) => setRentIncreasePct(e.target.value)}
                  placeholder="e.g. 3"
                  className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                    parsed.rentIncrease.ok
                      ? "border-slate-300 focus:border-sky-500"
                      : "border-rose-300 focus:border-rose-500"
                  }`}
                  aria-invalid={!parsed.rentIncrease.ok}
                />
                <p className="mt-2 text-xs text-slate-600">
                  Applied once per year.
                </p>
              </div>

              <div className="mt-4">
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
                  className="cursor-pointer w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition hover:border-sky-300 hover:bg-sky-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Time horizon (years)
                </label>
                <input
                  inputMode="numeric"
                  value={horizonYears}
                  onChange={(e) => setHorizonYears(e.target.value)}
                  placeholder="e.g. 7"
                  className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                    parsed.years.ok
                      ? "border-slate-300 focus:border-sky-500"
                      : "border-rose-300 focus:border-rose-500"
                  }`}
                  aria-invalid={!parsed.years.ok}
                />
              </div>
            </div>

            <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
              <h3 className="text-lg font-bold text-sky-800 mb-3">
                Buy assumptions
              </h3>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Home price
              </label>
              <input
                inputMode="decimal"
                value={homePriceDisplayValue}
                onChange={(e) => setHomePrice(e.target.value)}
                onFocus={() => setHomePriceFocused(true)}
                onBlur={() => {
                  setHomePriceFocused(false);
                  setHomePriceTouched(true);
                }}
                placeholder="e.g. 550000"
                className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                  parsed.price.ok
                    ? "border-slate-300 focus:border-sky-500"
                    : "border-rose-300 focus:border-rose-500"
                }`}
                aria-invalid={!parsed.price.ok}
              />
              {homePriceTouched && !homePriceFocused && !parsed.price.ok ? (
                <p className="mt-2 text-xs font-semibold text-rose-700">
                  {parsed.price.error ?? "Enter home price."}
                </p>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Down payment (%)
                  </label>
                  <input
                    inputMode="decimal"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(e.target.value)}
                    placeholder="e.g. 20"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.downPct.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.downPct.ok}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mortgage rate (%)
                  </label>
                  <input
                    inputMode="decimal"
                    value={mortgageRatePct}
                    onChange={(e) => setMortgageRatePct(e.target.value)}
                    placeholder="e.g. 5.5"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.ratePct.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.ratePct.ok}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mortgage term (years)
                  </label>
                  <input
                    inputMode="numeric"
                    value={mortgageTermYears}
                    onChange={(e) => setMortgageTermYears(e.target.value)}
                    placeholder="e.g. 25"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.termYears.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.termYears.ok}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Home appreciation (%)
                  </label>
                  <input
                    inputMode="decimal"
                    value={homeAppreciationPct}
                    onChange={(e) => setHomeAppreciationPct(e.target.value)}
                    placeholder="e.g. 3"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.appPct.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.appPct.ok}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Property tax (% per year)
                  </label>
                  <input
                    inputMode="decimal"
                    value={propertyTaxPct}
                    onChange={(e) => setPropertyTaxPct(e.target.value)}
                    placeholder="e.g. 1.0"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.propTax.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.propTax.ok}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Maintenance (% per year)
                  </label>
                  <input
                    inputMode="decimal"
                    value={maintenancePct}
                    onChange={(e) => setMaintenancePct(e.target.value)}
                    placeholder="e.g. 1.0"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.maint.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.maint.ok}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Home insurance (annual)
                  </label>
                  <input
                    inputMode="decimal"
                    value={homeInsuranceDisplayValue}
                    onChange={(e) => setHomeInsuranceAnnual(e.target.value)}
                    onFocus={() => setHomeInsuranceFocused(true)}
                    onBlur={() => {
                      setHomeInsuranceFocused(false);
                      setHomeInsuranceTouched(true);
                    }}
                    placeholder="e.g. 1200"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.insAnnual.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.insAnnual.ok}
                  />
                  {homeInsuranceTouched &&
                  !homeInsuranceFocused &&
                  !parsed.insAnnual.ok ? (
                    <p className="mt-2 text-xs font-semibold text-rose-700">
                      {parsed.insAnnual.error ?? "Enter annual home insurance."}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    HOA (monthly)
                  </label>
                  <input
                    inputMode="decimal"
                    value={hoaDisplayValue}
                    onChange={(e) => setHoaMonthly(e.target.value)}
                    onFocus={() => setHoaFocused(true)}
                    onBlur={() => {
                      setHoaFocused(false);
                      setHoaTouched(true);
                    }}
                    placeholder="e.g. 0"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.hoa.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.hoa.ok}
                  />
                  {hoaTouched && !hoaFocused && !parsed.hoa.ok ? (
                    <p className="mt-2 text-xs font-semibold text-rose-700">
                      {parsed.hoa.error ?? "Enter HOA."}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Buy closing costs (one-time)
                  </label>
                  <input
                    inputMode="decimal"
                    value={buyClosingDisplayValue}
                    onChange={(e) => setBuyClosingCosts(e.target.value)}
                    onFocus={() => setBuyClosingFocused(true)}
                    onBlur={() => {
                      setBuyClosingFocused(false);
                      setBuyClosingTouched(true);
                    }}
                    placeholder="e.g. 8000"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.buyClose.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.buyClose.ok}
                  />
                  {buyClosingTouched &&
                  !buyClosingFocused &&
                  !parsed.buyClose.ok ? (
                    <p className="mt-2 text-xs font-semibold text-rose-700">
                      {parsed.buyClose.error ?? "Enter buy closing costs."}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Selling costs (% of sale price)
                  </label>
                  <input
                    inputMode="decimal"
                    value={sellCostPct}
                    onChange={(e) => setSellCostPct(e.target.value)}
                    placeholder="e.g. 5"
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-lg text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 focus:ring-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 ${
                      parsed.sellPct.ok
                        ? "border-slate-300 focus:border-sky-500"
                        : "border-rose-300 focus:border-rose-500"
                    }`}
                    aria-invalid={!parsed.sellPct.ok}
                  />
                </div>
              </div>
            </div>
          </div>

          {!parsed.ok ? (
            <div
              className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-sky-50/60 shadow-sm rc-print-block"
              role="region"
              aria-label="Results"
              aria-live="polite"
            >
              <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />
              <div className="p-5 sm:px-6">
                <div className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm">
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
                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                      <div className="font-semibold">Notes</div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {parsed.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <>
              {computed.ok && computed.warnings.length ? (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
                  <div className="font-semibold">Notes</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {computed.ok ? (
                <>
                  <div
                    className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-sky-50/60 shadow-sm rc-print-block"
                    role="region"
                    aria-label="Results"
                    aria-live="polite"
                  >
                    <div className="h-1 bg-gradient-to-r from-sky-500 to-emerald-400" />

                    <div className="p-5 sm:px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full bg-emerald-600"
                          aria-hidden="true"
                        />
                        <div className="text-sm font-semibold text-slate-900">
                          Rent vs buy estimate
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 lg:grid-cols-3">
                        <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
                          <div className="text-xs text-slate-600">
                            Rent total
                          </div>
                          <div className="mt-1 text-2xl font-extrabold text-emerald-700 tabular-nums break-words">
                            {money(computed.totalRentCostScaled)}
                          </div>
                          <p className="mt-2 text-xs text-slate-600">
                            Over {computed.inputs.horizon} years, with rent
                            increasing by{" "}
                            {formatPercent(computed.inputs.rentIncreasePct)}
                            annually.
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
                          <div className="text-xs text-slate-600">
                            Ownership net cost
                          </div>
                          <div className="mt-1 text-2xl font-extrabold text-emerald-700 tabular-nums break-words">
                            {money(computed.ownershipNetCostScaled)}
                          </div>
                          <p className="mt-2 text-xs text-slate-600">
                            Ownership outflow minus estimated net sale proceeds.
                          </p>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
                          <div className="text-xs text-slate-600">
                            Break-even year
                          </div>
                          <div className="mt-1 text-2xl font-extrabold text-slate-900 tabular-nums break-words">
                            {computed.breakEvenYear === null
                              ? "N/A"
                              : computed.breakEvenYear}
                          </div>
                          <p className="mt-2 text-xs text-slate-600">
                            First year buying is estimated to cost no more than
                            renting in this model.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 shadow-sm">
                          <div className="text-xs text-emerald-800">
                            Monthly mortgage payment
                          </div>
                          <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {money(computed.monthlyMortgagePaymentScaled)}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-2 shadow-sm">
                          <div className="text-xs text-slate-600">
                            Down payment
                          </div>
                          <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {money(computed.downPaymentScaled)}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-2 shadow-sm">
                          <div className="text-xs text-slate-600">
                            Loan principal
                          </div>
                          <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {money(computed.loanPrincipalScaled)}
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-2 shadow-sm">
                          <div className="text-xs text-slate-600">
                            Net sale proceeds
                          </div>
                          <div className="mt-1 text-lg font-bold text-slate-900 tabular-nums whitespace-nowrap">
                            {money(computed.estimatedNetSaleProceedsScaled)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="my-6 rounded-2xl border border-slate-200 bg-white/95 p-5 rc-print-block shadow-sm">
                    <h3 className="text-lg font-bold text-sky-800 mb-2">
                      Year-by-year comparison
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Shows rent paid, ownership cash outflow, and estimated
                      equity for each year.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="min-w-[1060px] w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-600 border-b border-slate-200">
                            <th className="py-2 pr-4 font-semibold">Year</th>
                            <th className="py-2 pr-4 font-semibold">
                              Rent annual
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Rent cumulative
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Home value
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Mortgage balance
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Ownership outflow annual
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Ownership outflow cumulative
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Interest paid
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Principal paid
                            </th>
                            <th className="py-2 pr-4 font-semibold">
                              Equity end
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {computed.rows.map((r, index) => (
                            <tr
                              key={r.year}
                              className={`border-b border-slate-100 ${
                                index % 2 === 1 ? "bg-slate-50/50" : ""
                              }`}
                            >
                              <td className="py-2 pr-4 font-semibold text-slate-900">
                                {r.year}
                              </td>
                              <td className="py-2 pr-4 text-slate-900 tabular-nums whitespace-nowrap">
                                {money(r.rentAnnual)}
                              </td>
                              <td className="py-2 pr-4 text-slate-900 tabular-nums whitespace-nowrap">
                                {money(r.rentCumulative)}
                              </td>
                              <td className="py-2 pr-4 text-slate-900 tabular-nums whitespace-nowrap">
                                {money(r.homeValue)}
                              </td>
                              <td className="py-2 pr-4 text-slate-900 tabular-nums whitespace-nowrap">
                                {money(r.mortgageBalanceEnd)}
                              </td>
                              <td className="py-2 pr-4 text-slate-900 tabular-nums whitespace-nowrap">
                                {money(r.ownershipAnnualOutflow)}
                              </td>
                              <td className="py-2 pr-4 text-slate-900 tabular-nums whitespace-nowrap">
                                {money(r.ownershipCumulativeOutflow)}
                              </td>
                              <td className="py-2 pr-4 text-slate-900 tabular-nums whitespace-nowrap">
                                {money(r.interestPaidThisYear)}
                              </td>
                              <td className="py-2 pr-4 text-slate-900 tabular-nums whitespace-nowrap">
                                {money(r.principalPaidThisYear)}
                              </td>
                              <td className="py-2 pr-4 text-slate-900 tabular-nums whitespace-nowrap">
                                {money(r.equityEnd)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-4 text-xs text-slate-600">
                      Annual ownership outflow does not include the final sale
                      event. Upfront costs are included in the ownership totals.
                    </p>
                  </div>
                </>
              ) : null}
            </>
          )}

          <Assumptions />

          <div className="mt-3 rounded-xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm rc-no-print">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculations preserve precision internally, while displayed money values are rounded to cents.
              </p>

              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 md:hidden"
              >
                Print / Save PDF
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Calculations preserve precision internally, while displayed money values are rounded to cents.
            </p>
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
            className="cursor-pointer rounded text-sky-700 hover:text-sky-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
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

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/90 px-5 shadow-sm">
          {faqData.map((f, i) => (
            <details key={i} className="group py-4">
              <summary className="cursor-pointer list-none font-semibold text-lg text-sky-800 flex items-center justify-between rounded hover:text-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2">
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
