import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "./+types/rent-vs-buy-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  { title: "Rent vs Buy Calculator" },
  {
    name: "description",
    content:
      "Compare renting vs buying using a simple cost model over a chosen time horizon. See total rent cost, total ownership outflow, estimated equity, and an estimated break-even year. Includes a year-by-year table and export options.",
  },
  {
    name: "keywords",
    content:
      "rent vs buy calculator, renting vs buying, rent or buy, break even rent vs buy, home ownership cost calculator, total cost of owning",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },

  { property: "og:type", content: "website" },
  { property: "og:title", content: "Rent vs Buy Calculator" },
  {
    property: "og:description",
    content:
      "Compare renting vs buying over time with a clear breakdown of rent costs, ownership costs, and estimated equity.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-vs-buy-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },

  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent vs Buy Calculator" },
  {
    name: "twitter:description",
    content:
      "Compare renting vs buying over time with a clear breakdown of rent costs, ownership costs, and estimated equity.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },

  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-vs-buy-calculator",
  },
];

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

function toNumberSafe(scaled: bigint): number {
  return Number(scaled) / Number(SCALE);
}

function formatCurrencyFromScaled(
  scaled: bigint,
  currency: Currency,
  displayDecimals: number,
): string {
  const n = toNumberSafe(scaled);
  if (!Number.isFinite(n)) return "N/A";
  const digits = Math.max(0, Math.min(12, displayDecimals));
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
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

function safeParseInt(
  raw: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  if (raw === null) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const t = Math.trunc(n);
  return Math.max(min, Math.min(max, t));
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
  return BigInt(Math.round(n * Number(SCALE)));
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
  const canonicalUrl = "https://rentconverter.com/rent-vs-buy-calculator";

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
    return safeParseInt(
      localStorage.getItem("rc_rvb_display_decimals"),
      2,
      0,
      6,
    );
  });

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

  const effectiveDisplayDecimals = roundDisplay ? displayDecimals : 12;
  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, effectiveDisplayDecimals);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleExportCsv = () => {
    if (!computed.ok) return;

    const rows: string[] = [];
    rows.push(buildCsvRow([pageName]));
    rows.push(buildCsvRow(["Currency", currency]));
    rows.push(buildCsvRow([""]));

    rows.push(buildCsvRow(["Headline results"]));
    rows.push(
      buildCsvRow(["Total rent cost", money(computed.totalRentCostScaled)]),
    );
    rows.push(
      buildCsvRow([
        "Ownership net cost",
        money(computed.ownershipNetCostScaled),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Break-even year",
        computed.breakEvenYear === null ? "" : String(computed.breakEvenYear),
      ]),
    );

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["Key computed values"]));
    rows.push(buildCsvRow(["Down payment", money(computed.downPaymentScaled)]));
    rows.push(
      buildCsvRow(["Buy closing costs", money(computed.buyCloseScaled)]),
    );
    rows.push(
      buildCsvRow(["Loan principal", money(computed.loanPrincipalScaled)]),
    );
    rows.push(
      buildCsvRow([
        "Monthly mortgage payment (P+I)",
        money(computed.monthlyMortgagePaymentScaled),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Estimated net sale proceeds",
        money(computed.estimatedNetSaleProceedsScaled),
      ]),
    );
    rows.push(
      buildCsvRow([
        "Estimated selling costs",
        money(computed.estimatedSellCostsScaled),
      ]),
    );
    rows.push(
      buildCsvRow(["Ending home value", money(computed.endingHomeValueScaled)]),
    );
    rows.push(
      buildCsvRow([
        "Ending mortgage balance",
        money(computed.endingBalanceScaled),
      ]),
    );

    rows.push(buildCsvRow([""]));
    rows.push(buildCsvRow(["Year-by-year table"]));
    rows.push(
      buildCsvRow([
        "Year",
        "Rent (annual)",
        "Rent (cumulative)",
        "Home value",
        "Mortgage balance (end)",
        "Ownership outflow (annual)",
        "Ownership outflow (cumulative)",
        "Interest paid (year)",
        "Principal paid (year)",
        "Equity (end)",
      ]),
    );

    for (const r of computed.rows) {
      rows.push(
        buildCsvRow([
          String(r.year),
          money(r.rentAnnual),
          money(r.rentCumulative),
          money(r.homeValue),
          money(r.mortgageBalanceEnd),
          money(r.ownershipAnnualOutflow),
          money(r.ownershipCumulativeOutflow),
          money(r.interestPaidThisYear),
          money(r.principalPaidThisYear),
          money(r.equityEnd),
        ]),
      );
    }

    downloadTextFile(
      "rent-vs-buy.csv",
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
        <p className="text-slate-600 max-w-3xl mx-auto text-lg">
          Compare rent costs to a simplified cost of ownership over a time
          horizon. The model shows cash outflow, estimated equity, and an
          end-of-horizon sale estimate.
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Compare costs over time
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Invalid input hides results to avoid misleading “0” outputs.
                Calculations preserve decimals; rounding is display-only.
              </p>
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

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 rc-no-print">
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
                        Math.min(6, Math.trunc(Number(e.target.value) || 2)),
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
              Internal math is fixed-point up to 12 decimals. This control only
              changes what is displayed.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Rent assumptions
              </h3>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Monthly rent
              </label>
              <input
                inputMode="decimal"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g. 2200"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-invalid={!parsed.rent.ok}
              />

              <div className="mt-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Annual rent increase (%)
                </label>
                <input
                  inputMode="decimal"
                  value={rentIncreasePct}
                  onChange={(e) => setRentIncreasePct(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Buy assumptions
              </h3>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Home price
              </label>
              <input
                inputMode="decimal"
                value={homePrice}
                onChange={(e) => setHomePrice(e.target.value)}
                placeholder="e.g. 550000"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-invalid={!parsed.price.ok}
              />

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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
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
                    value={homeInsuranceAnnual}
                    onChange={(e) => setHomeInsuranceAnnual(e.target.value)}
                    placeholder="e.g. 1200"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!parsed.insAnnual.ok}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    HOA (monthly)
                  </label>
                  <input
                    inputMode="decimal"
                    value={hoaMonthly}
                    onChange={(e) => setHoaMonthly(e.target.value)}
                    placeholder="e.g. 0"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!parsed.hoa.ok}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Buy closing costs (one-time)
                  </label>
                  <input
                    inputMode="decimal"
                    value={buyClosingCosts}
                    onChange={(e) => setBuyClosingCosts(e.target.value)}
                    placeholder="e.g. 8000"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!parsed.buyClose.ok}
                  />
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={!parsed.sellPct.ok}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Time horizon
              </h3>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Compare over (years)
              </label>
              <input
                inputMode="numeric"
                value={horizonYears}
                onChange={(e) => setHorizonYears(e.target.value)}
                placeholder="e.g. 7"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                aria-invalid={!parsed.years.ok}
              />
              <p className="mt-2 text-xs text-slate-500">
                Used for totals and the year-by-year table.
              </p>

              {computed.ok ? (
                <>
                  <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs text-slate-500">
                      Estimated mortgage payment (monthly)
                    </div>
                    <div className="mt-1 text-lg font-extrabold text-slate-900">
                      {money(computed.monthlyMortgagePaymentScaled)}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Principal + interest only.
                    </p>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs text-slate-500">
                      Upfront cash at purchase
                    </div>
                    <div className="mt-1 text-lg font-extrabold text-slate-900">
                      {money(
                        scaledAdd(
                          computed.downPaymentScaled,
                          computed.buyCloseScaled,
                        ),
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Down payment + buy closing costs.
                    </p>
                  </div>
                </>
              ) : null}
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
          ) : (
            <>
              {computed.ok && computed.warnings.length ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
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
                      <div className="mt-2 text-3xl font-extrabold text-slate-900">
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
                      <div className="mt-2 text-3xl font-extrabold text-sky-800">
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

                  <div className="rc-no-print mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "headline",
                          `Rent total: ${money(computed.totalRentCostScaled)}; Ownership net cost: ${money(
                            computed.ownershipNetCostScaled,
                          )}; Break-even year: ${
                            computed.breakEvenYear === null
                              ? "N/A"
                              : computed.breakEvenYear
                          }`,
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "headline"
                        ? "Copied"
                        : "Copy headline results"}
                    </button>
                    {copiedKey === "copy_failed" ? (
                      <span className="self-center text-sm font-semibold text-rose-700">
                        Copy failed
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 rc-print-block">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      What the comparison is doing
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-xs text-slate-500">
                          Ownership outflow (total)
                        </div>
                        <div className="mt-1 font-bold text-slate-800">
                          {money(computed.totalOwnershipOutflowScaled)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-xs text-slate-500">
                          Estimated net sale proceeds
                        </div>
                        <div className="mt-1 font-bold text-slate-800">
                          {money(computed.estimatedNetSaleProceedsScaled)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-xs text-slate-500">
                          Ending home value (modeled)
                        </div>
                        <div className="mt-1 font-bold text-slate-800">
                          {money(computed.endingHomeValueScaled)}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-xs text-slate-500">
                          Ending mortgage balance (modeled)
                        </div>
                        <div className="mt-1 font-bold text-slate-800">
                          {money(computed.endingBalanceScaled)}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      Notes: Rent grows once per year. Home value grows once per
                      year. Mortgage amortization uses a standard monthly
                      payment formula. Property tax and maintenance are modeled
                      as percentages of home value.
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 rc-print-block">
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

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 rc-print-block">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Disclaimer
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Disclaimer:</strong>
              <br />
              Tools on this site are provided for informational, budgeting, and
              comparison purposes only. Calculations are based on standard
              time-period assumptions and simplified models. Results are
              estimates, not guarantees.
              <br />
              <br />
              This website does not provide financial, legal, or tax advice.
              Rental costs, affordability, payment schedules, and obligations
              vary by location, landlord, lease terms, and individual
              circumstances. Always review your agreement and consult qualified
              professionals before making financial decisions.
            </p>
          </section>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-8 rc-no-print">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          How this tool works and what you can expect
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-slate-700 mb-4">
            Renting is mostly a cash expense. Buying includes cash expenses and
            also builds equity as the mortgage balance decreases and the home
            value changes. This tool models both sides in a consistent way, then
            produces summary totals and a year-by-year table so you can see what
            is driving the comparison.
          </p>

          <p className="text-slate-700 mb-4">
            On the rent side, the calculator starts from a monthly rent and
            grows it once per year by the rent increase percentage, then sums
            rent paid over the chosen horizon. On the buy side, it estimates a
            standard mortgage payment (principal + interest), adds ownership
            costs (property tax, insurance, maintenance, HOA), and tracks a
            simplified mortgage balance and equity estimate over time.
          </p>

          <p className="text-slate-700 mb-4">
            At the end of the horizon, the tool estimates net sale proceeds by
            subtracting selling costs and the remaining mortgage balance from
            the modeled home value. The “ownership net cost” is total ownership
            outflow (including upfront costs) minus estimated net sale proceeds.
            It is an estimate, not a prediction.
          </p>

          <p className="text-slate-700 mt-6">
            Related tools:{" "}
            <a
              href={safeHref("/rent-affordability-calculator")}
              className="text-sky-700 hover:underline"
            >
              rent affordability calculator
            </a>{" "}
            and{" "}
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

      <OtherUsefulTools />
      <RenterChecklists />
      <RentToolsByCountry />

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          <em>
            Tools on this site are for budgeting and comparison. Calculations
            use simplified assumptions. Always confirm payment schedules and
            terms in your agreements.
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
