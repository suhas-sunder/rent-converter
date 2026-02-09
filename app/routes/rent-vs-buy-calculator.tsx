import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-vs-buy-calculator";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Rent vs Buy Calculator (When Buying Breaks Even)";
  const description =
    "Compare renting vs buying and see when buying breaks even. View total rent paid, total ownership costs, estimated equity, and a year-by-year comparison over your chosen time horizon. Clear assumptions, no fluff.";

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
        "rent vs buy calculator, renting vs buying, rent or buy, break even rent vs buy, home ownership cost calculator, total cost of owning",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { tagName: "link", rel: "canonical", href: canonicalUrl },

    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:url", content: canonicalUrl },
    {
      property: "og:title",
      content: "Rent vs Buy Calculator (Break-Even Analysis)",
    },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: "RentConverter.com preview image" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Rent vs Buy Calculator" },
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

  return out || "—";
}

function formatPercent(pct: number, decimals = 2): string {
  if (!Number.isFinite(pct)) return "N/A";
  return `${pct.toFixed(decimals)}%`;
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

function safeParseDisplayDecimals(raw: string | null): number {
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : 2;
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

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return safeParseBoolean(localStorage.getItem("rc_rvb_round_display"), true);
  });
  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return safeParseDisplayDecimals(
      localStorage.getItem("rc_rvb_display_decimals"),
    );
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

      localStorage.setItem(
        "rc_rvb_round_display",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem("rc_rvb_display_decimals", String(displayDecimals));
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
    roundDisplay,
    displayDecimals,
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
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

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
      q: "Why does the calculator show both “outflow” and a “net cost” for buying?",
      a: "Ownership has cash leaving the household (payments and expenses) and also builds an asset through equity. Net cost is a way to compare ownership outflow after accounting for estimated sale proceeds at the end of the horizon.",
    },
    {
      q: "Does the mortgage payment include property tax and insurance?",
      a: "No. The mortgage payment shown is principal and interest only. Property tax, insurance, maintenance, and HOA are added separately so the ownership total is visible.",
    },
    {
      q: "How are rent increases applied?",
      a: "Rent is grown once per year by the annual rent increase percentage. The model uses a 12-month year for rent budgeting and comparison.",
    },
    {
      q: "How is home appreciation applied?",
      a: "Home value is grown once per year by the home appreciation percentage. This affects property tax, maintenance (if set as a percent of value), and the estimated sale proceeds.",
    },
    {
      q: "What does “break-even year” mean here?",
      a: "It is the first year where the ownership estimate becomes less expensive than renting in this model, using cumulative ownership outflow plus upfront costs, minus estimated equity, compared against cumulative rent paid.",
    },
    {
      q: "Does this include income tax effects or deductions?",
      a: "No. Tax impacts are not modeled. This keeps the tool focused on cash costs and a basic equity estimate rather than jurisdiction-specific tax rules.",
    },
    {
      q: "How accurate are the results?",
      a: "They are estimates based on simplified assumptions. Real outcomes depend on mortgage terms, fees, maintenance realities, move timing, market changes, and the exact terms of rent and sale.",
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

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 mt-4">
        <div className="rounded-2xl bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8 rc-print-block sm:pt-6">
          <div className="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-left text-center capitalize sm:text-4xl text-sky-800 font-bold">
                Compare costs over time
              </h1>
            </div>

            <div className="rc-no-print flex-col sm:flex-row gap-2 hidden md:flex">
              <button
                type="button"
                onClick={handlePrint}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
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
                className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-invalid={!parsed.rent.ok}
              />
              {rentTouched && !rentFocused && !parsed.rent.ok ? (
                <p className="mt-2 text-xs text-rose-700">
                  {parsed.rent.error ?? "Enter monthly rent."}
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  Accepted inputs: $2,200, 2200.00, .5, 12., 2200,50 (comma
                  decimal).
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
                  className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsed.rentIncrease.ok}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Applied once per year in the model.
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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

            <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
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
                className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-invalid={!parsed.price.ok}
              />
              {homePriceTouched && !homePriceFocused && !parsed.price.ok ? (
                <p className="mt-2 text-xs text-rose-700">
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!parsed.insAnnual.ok}
                  />
                  {homeInsuranceTouched &&
                  !homeInsuranceFocused &&
                  !parsed.insAnnual.ok ? (
                    <p className="mt-2 text-xs text-rose-700">
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!parsed.hoa.ok}
                  />
                  {hoaTouched && !hoaFocused && !parsed.hoa.ok ? (
                    <p className="mt-2 text-xs text-rose-700">
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!parsed.buyClose.ok}
                  />
                  {buyClosingTouched &&
                  !buyClosingFocused &&
                  !parsed.buyClose.ok ? (
                    <p className="mt-2 text-xs text-rose-700">
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
                    className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!parsed.sellPct.ok}
                  />
                </div>
              </div>
            </div>
          </div>

          {!parsed.ok ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
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
          ) : (
            <>
              {computed.ok && computed.warnings.length ? (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <ul className="list-disc pl-5 space-y-1">
                    {computed.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {computed.ok ? (
                <>
                  <div className="mt-6 grid gap-4 lg:grid-cols-3 rc-print-block">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="text-sm font-semibold text-slate-700">
                        Rent total (estimated)
                      </div>
                      <div className="mt-2 text-3xl font-extrabold text-emerald-700">
                        {money(computed.totalRentCostScaled)}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        Total rent paid over {computed.inputs.horizon} years
                        (rent grows annually by{" "}
                        {formatPercent(computed.inputs.rentIncreasePct, 2)}).
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="text-sm font-semibold text-slate-700">
                        Ownership net cost (estimated)
                      </div>
                      <div className="mt-2 text-3xl font-extrabold text-emerald-700">
                        {money(computed.ownershipNetCostScaled)}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        Ownership outflow (including upfront costs) minus
                        estimated net sale proceeds at the end of the horizon.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="text-sm font-semibold text-slate-700">
                        Estimated break-even year
                      </div>
                      <div className="mt-2 text-3xl font-extrabold text-slate-900">
                        {computed.breakEvenYear === null
                          ? "N/A"
                          : computed.breakEvenYear}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        First year where (cumulative outflow + upfront costs −
                        estimated equity) is less than or equal to cumulative
                        rent.
                      </p>
                    </div>
                  </div>

                  <div className="my-6 rounded-2xl border border-slate-200 bg-white p-5 rc-print-block">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">
                      Year-by-year comparison
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Shows rent paid, ownership cash outflow, and the equity
                      estimate as the mortgage balance falls and home value
                      changes.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="min-w-[1060px] w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500 border-b border-slate-200">
                            <th className="py-2 pr-4">Year</th>
                            <th className="py-2 pr-4">Rent (annual)</th>
                            <th className="py-2 pr-4">Rent (cumulative)</th>
                            <th className="py-2 pr-4">Home value</th>
                            <th className="py-2 pr-4">
                              Mortgage balance (end)
                            </th>
                            <th className="py-2 pr-4">
                              Ownership outflow (annual)
                            </th>
                            <th className="py-2 pr-4">
                              Ownership outflow (cumulative)
                            </th>
                            <th className="py-2 pr-4">Interest paid (year)</th>
                            <th className="py-2 pr-4">Principal paid (year)</th>
                            <th className="py-2 pr-4">Equity (end)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {computed.rows.map((r) => (
                            <tr
                              key={r.year}
                              className="border-b border-slate-100"
                            >
                              <td className="py-2 pr-4 font-semibold text-slate-800">
                                {r.year}
                              </td>
                              <td className="py-2 pr-4">
                                {money(r.rentAnnual)}
                              </td>
                              <td className="py-2 pr-4">
                                {money(r.rentCumulative)}
                              </td>
                              <td className="py-2 pr-4">
                                {money(r.homeValue)}
                              </td>
                              <td className="py-2 pr-4">
                                {money(r.mortgageBalanceEnd)}
                              </td>
                              <td className="py-2 pr-4">
                                {money(r.ownershipAnnualOutflow)}
                              </td>
                              <td className="py-2 pr-4">
                                {money(r.ownershipCumulativeOutflow)}
                              </td>
                              <td className="py-2 pr-4">
                                {money(r.interestPaidThisYear)}
                              </td>
                              <td className="py-2 pr-4">
                                {money(r.principalPaidThisYear)}
                              </td>
                              <td className="py-2 pr-4">
                                {money(r.equityEnd)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      The annual ownership outflow does not include the
                      end-of-horizon sale event. Upfront costs (down payment and
                      buying closing costs) are included in the ownership totals
                      above.
                    </p>
                  </div>
                </>
              ) : null}
            </>
          )}
          <div className="my-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            <div className="font-semibold">Assumptions used on this page</div>
            <ul className="mt-1 list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>1 year = 365 days</li>
              <li>Biweekly = 14 days</li>
              <li>4-week rent = 28 days</li>
              <li>Month = 365 ÷ 12 days (average)</li>
              <li>
                This tool does not assume what is included in “rent” (fees,
                utilities, taxes). Enter the total you want to budget with.
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-6  rounded-2xl border border-slate-200 bg-white p-5 rc-no-print mt-6">
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
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={roundDisplay}
                onChange={(e) => setRoundDisplay(e.target.checked)}
                className="cursor-pointer h-4 w-4"
              />
              Round displayed values (display only)
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Displayed decimals</span>
              <select
                value={displayDecimals}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  const t = Math.trunc(n);
                  setDisplayDecimals(
                    t === 0 || t === 2 || t === 4 || t === 6 ? t : 2,
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
            <div className="flex flex-col gap-4 sm:gap-x-5 gap-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight">
                    Rent vs buy calculator model and outputs
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page compares renting and buying by running both
                    scenarios under the same time horizon and assumptions.
                    Renting is treated as a cash outflow that can grow once per
                    year. Buying is modeled as cash outflows plus a tracked
                    mortgage balance and an estimated sale result at the end.
                    The goal is a consistent comparison that lets you see what
                    is driving the difference.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Horizon based
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Assumption driven
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUTS
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Rent, home price, rates
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    RENT SIDE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Cash paid over time
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    BUY SIDE
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Costs + balance tracking
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUTS
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Totals + year table
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-lg text-slate-700 leading-7">
              {/* SectionCard: what it returns */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16M4 12h12M4 17h14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        What this calculator returns
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      You get two modeled totals over your chosen horizon: total
                      rent paid and a buying-side ownership net cost. The buying
                      number is computed as total ownership cash outflow
                      (including upfront costs and ongoing costs) minus
                      estimated net sale proceeds at the end of the horizon.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Core idea
                      </div>
                      <p className="mt-2">
                        The comparison is consistent because both sides are
                        evaluated on the same horizon and the same assumptions
                        you enter.
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        The outputs are scenario estimates. They are not a
                        prediction of sale price, rent, or rates.
                      </p>
                    </div>

                    <p>
                      The year-by-year table is the useful part for most people.
                      It shows how rent paid accumulates, how ownership costs
                      stack up, how the mortgage balance changes, and how
                      modeled equity evolves year to year. That makes it easy to
                      see which inputs are doing the work instead of relying on
                      a single headline.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: rent side */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M5 7h14M5 17h10"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        Rent side model
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The rent side starts with a monthly rent and treats it as
                      a cash expense. If you enter a rent increase percentage,
                      rent steps up once per year and the tool sums the total
                      rent paid across the horizon. There is no residual value
                      on the rent side.
                    </p>

                    <p>
                      This is intentionally simple. The rent total is meant to
                      be a clean baseline that stays comparable to the buy-side
                      cash outflows. If your situation includes separate
                      recurring items that you consider rent-adjacent, keep them
                      out of this model unless the calculator has explicit
                      fields for them.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          What counts on rent
                        </div>
                        <ul className="mt-2 list-disc pl-5 space-y-2">
                          <li>Monthly rent amount</li>
                          <li>Annual rent increase, if provided</li>
                          <li>Total paid over the horizon</li>
                        </ul>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          What does not count
                        </div>
                        <ul className="mt-2 list-disc pl-5 space-y-2">
                          <li>Investment returns on savings</li>
                          <li>Tax deductions or credits</li>
                          <li>Move costs unless separately entered</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: buy side */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 10V7a5 5 0 0110 0v3M6 10h12l-1 11H7L6 10z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        Buy side model
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The buy side estimates a standard mortgage payment from
                      the home price, down payment, interest rate, and loan term
                      you enter. The payment is treated as principal plus
                      interest so the remaining mortgage balance can be tracked
                      over time.
                    </p>

                    <p>
                      On top of the mortgage payment, the tool adds ownership
                      costs you provide such as property tax, insurance,
                      maintenance, and HOA. Those items are treated as cash
                      expenses and included in the ownership outflow each year.
                    </p>

                    <p>
                      Home value is updated once per year using your
                      appreciation rate. That modeled home value affects both
                      the estimated equity line in the year table and the
                      estimated sale result at the end of the horizon.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        End-of-horizon sale estimate
                      </div>
                      <p className="mt-2">
                        Net sale proceeds are computed as modeled home value
                        minus selling costs minus remaining mortgage balance.
                        The tool then compares total rent paid against ownership
                        outflow minus net sale proceeds.
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        This is a mechanical estimate based on your inputs. It
                        is not a market quote.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: table interpretation */}
              <div className="group relative rounded-3xl bg-white ring-1 ring-slate-200/80 shadow-sm">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-sky-500/80 via-sky-400/50 to-transparent"
                />
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/60">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-sky-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 19V5m0 14h16M8 15V9m4 6V7m4 8v-5"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-sky-900 tracking-tight">
                        How to read the year-by-year table
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The year table is where the model becomes transparent. The
                      rent columns show rent paid each year and cumulative rent
                      paid. The buy columns show annual ownership outflow,
                      remaining mortgage balance, and estimated equity based on
                      modeled home value.
                    </p>

                    <p>
                      If the buy side changes sharply from one year to the next,
                      it is usually coming from one of three places: a higher
                      ownership cost assumption, a different appreciation rate,
                      or a different loan structure. The table is built to make
                      those drivers obvious.
                    </p>

                    <p>
                      Summary totals at the top are derived directly from the
                      same year-by-year numbers. If you want to sanity-check the
                      headline, the table is the place to do it.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dark utility callout */}
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
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                    This is a scenario comparison, not a forecast
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    The calculator applies the assumptions you enter and keeps
                    them consistent across both sides. It does not attempt to
                    model tax law, investment returns, refinancing, or market
                    timing unless the page has explicit fields for those items.
                    Treat the outputs as a structured way to compare scenarios
                    on the same horizon.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Related tools:{" "}
                <a
                  href={safeHref("/rent-affordability-calculator")}
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent affordability calculator
                </a>{" "}
                and{" "}
                <a
                  href={safeHref("/rent-converter")}
                  className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                >
                  rent converter
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-8 mb-4 hidden sm:block">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <a href={safeHref("/")} className="cursor-pointer hover:underline">
            Home
          </a>{" "}
          / {pageName}
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
    </main>
  );
}
