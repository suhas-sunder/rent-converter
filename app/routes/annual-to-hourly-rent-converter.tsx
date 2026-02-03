import { useMemo, useEffect, useRef, useState } from "react";
import type { Route } from "./+types/annual-to-hourly-rent-converter";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const title = "Annual to Hourly Rent Converter (Exact 8,760-Hour Year)";
  const description =
    "Instantly convert annual rent into an hourly amount using a true 365-day (8,760-hour) year. Exact decimals, full breakdown, optional paid-hours scenario, and print-to-PDF. Free, private, no signup.";

  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content:
        "annual to hourly rent, yearly to hourly rent, annual rent per hour, 8760 hours per year, annual rent to hourly calculator, hourly rent budgeting, rent hourly equivalent",
    },
    { name: "robots", content: "index,follow" },
    { name: "author", content: "RentConverter.com" },
    { name: "theme-color", content: "#f8fafc" },

    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: "https://www.rentconverter.com/annual-to-hourly-rent-converter",
    },
    { property: "og:site_name", content: "RentConverter.com" },
    {
      property: "og:image",
      content: "https://www.rentconverter.com/og-image.jpg",
    },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      name: "twitter:image",
      content: "https://www.rentconverter.com/og-image.jpg",
    },

    {
      tagName: "link",
      rel: "canonical",
      href: "https://www.rentconverter.com/annual-to-hourly-rent-converter",
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
  monthly: "Monthly (average)",
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
  "/rent-after-increase-calculator",
  "/rent-vs-buy-calculator",
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

function roundScaledToDigits(scaled: bigint, digits: number): bigint {
  const d = Math.max(0, Math.min(12, Math.trunc(digits)));
  const drop = 12 - d;
  const factor = 10n ** BigInt(drop);
  if (factor === 1n) return scaled;

  const half = factor / 2n;
  const neg = scaled < 0n;
  const x = absBigInt(scaled);

  const rounded = (x + half) / factor;
  const back = rounded * factor;
  return neg ? -back : back;
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

function formatPercent(n: number, displayDecimals: number): string {
  if (!Number.isFinite(n)) return "-";
  return `${(n * 100).toFixed(Math.max(0, Math.min(6, displayDecimals)))}%`;
}

function parseMoneyInputToScaled(raw: string): ParsedAmount {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) {
    return { ok: false, error: "Enter an annual rent amount.", warnings };
  }

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number (example: 30000 or 30000.50).",
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
    return { ok: false, error: "Annual rent must be 0 or greater.", warnings };
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

  const maxAnnual = 1_000_000_000n * SCALE;
  const clamped = clampScaled(scaled, 0n, maxAnnual);

  if (clamped !== scaled) {
    warnings.push("Value was clamped to the supported maximum for safety.");
  }

  const normalized = fracRaw.length ? `${intPart}.${fracCapped}` : `${intPart}`;

  return { ok: true, scaled: clamped, normalized, warnings };
}

function parseHoursInput(raw: string): {
  ok: boolean;
  hoursPerWeek?: bigint;
  normalized?: string;
  error?: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();
  if (!s0) return { ok: false, error: "Enter paid hours per week.", warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s) {
    return {
      ok: false,
      error: "Enter a valid number of hours (example: 40).",
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
      error: "Paid hours per week must be 0 or greater.",
      warnings,
    };
  }

  const parsed = parseMoneyInputToScaled(s);
  if (!parsed.ok || parsed.scaled === undefined) {
    return {
      ok: false,
      error: parsed.error ?? "Enter a valid number of hours.",
      warnings: parsed.warnings,
    };
  }

  const maxHoursScaled = 168n * SCALE;
  const clamped = clampScaled(parsed.scaled, 0n, maxHoursScaled);

  if (clamped !== parsed.scaled) {
    warnings.push("Hours per week was clamped to 168 (max hours in a week).");
  }

  return {
    ok: true,
    hoursPerWeek: clamped,
    normalized: parsed.normalized,
    warnings: [...parsed.warnings, ...warnings],
  };
}

function mulDivScaled(
  valueScaled: bigint,
  mulNum: bigint,
  divDen: bigint,
): bigint {
  if (divDen === 0n) return 0n;
  return (valueScaled * mulNum) / divDen;
}

function annualToPeriodScaled(annualScaled: bigint, period: Period): bigint {
  switch (period) {
    case "annual":
      return annualScaled;
    case "monthly":
      return mulDivScaled(annualScaled, 1n, 12n);
    case "every_4_weeks":
      return mulDivScaled(annualScaled, 28n, 365n);
    case "biweekly":
      return mulDivScaled(annualScaled, 14n, 365n);
    case "weekly":
      return mulDivScaled(annualScaled, 7n, 365n);
    case "daily":
      return mulDivScaled(annualScaled, 1n, 365n);
    case "hourly":
      return mulDivScaled(annualScaled, 1n, 365n * 24n);
    default:
      return annualScaled;
  }
}

function annualToPaidHoursHourlyScaled(
  annualScaled: bigint,
  hoursPerWeekScaled: bigint,
): bigint {
  const den = hoursPerWeekScaled * 52n;
  if (den === 0n) return 0n;
  return (annualScaled * SCALE) / den;
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

function validateDisplayDecimals(raw: string | null): 0 | 2 | 4 | 6 {
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  if (t === 0 || t === 2 || t === 4 || t === 6) return t;
  return 2;
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

export default function AnnualToHourlyRent() {
  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "30000";
    const saved = window.localStorage.getItem("rc_ath_amount");
    return saved ?? "30000";
  });

  const [amountFocused, setAmountFocused] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "USD";
    const saved = window.localStorage.getItem("rc_ath_currency");
    return saved && isCurrency(saved) ? saved : "USD";
  });

  const [displayDecimals, setDisplayDecimals] = useState<0 | 2 | 4 | 6>(() => {
    if (typeof window === "undefined") return 2;
    return validateDisplayDecimals(
      window.localStorage.getItem("rc_ath_display_decimals"),
    );
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("rc_ath_round_display");
    return safeParseBoolean(saved, true);
  });

  const [showPaidHoursScenario, setShowPaidHoursScenario] = useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      const saved = window.localStorage.getItem("rc_ath_paid_hours_show");
      return safeParseBoolean(saved, false);
    },
  );

  const [paidHoursPerWeek, setPaidHoursPerWeek] = useState<string>(() => {
    if (typeof window === "undefined") return "40";
    const saved = window.localStorage.getItem("rc_ath_paid_hours_week");
    return saved ?? "40";
  });

  const [paidHoursFocused, setPaidHoursFocused] = useState<boolean>(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rc_ath_amount", amount);
      window.localStorage.setItem("rc_ath_currency", currency);
      window.localStorage.setItem(
        "rc_ath_display_decimals",
        String(displayDecimals),
      );
      window.localStorage.setItem(
        "rc_ath_round_display",
        JSON.stringify(roundDisplay),
      );
      window.localStorage.setItem(
        "rc_ath_paid_hours_show",
        JSON.stringify(showPaidHoursScenario),
      );
      window.localStorage.setItem("rc_ath_paid_hours_week", paidHoursPerWeek);
    } catch {
      // ignore
    }
  }, [
    amount,
    currency,
    displayDecimals,
    roundDisplay,
    showPaidHoursScenario,
    paidHoursPerWeek,
  ]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const parsedAnnual = useMemo(() => parseMoneyInputToScaled(amount), [amount]);
  const annualScaled = parsedAnnual.ok ? (parsedAnnual.scaled as bigint) : 0n;

  const amountPreview = useMemo(() => {
    if (!parsedAnnual.ok) return null;
    const normalized = parsedAnnual.normalized ?? "";
    if (!normalized) return null;
    return groupDigitsFromNormalized(normalized);
  }, [parsedAnnual.ok, parsedAnnual.normalized]);

  const amountInputValue = amountFocused
    ? amount
    : parsedAnnual.ok && amountPreview
      ? amountPreview
      : amount;

  const parsedHours = useMemo(() => {
    if (!showPaidHoursScenario) return null;
    return parseHoursInput(paidHoursPerWeek);
  }, [paidHoursPerWeek, showPaidHoursScenario]);

  const hoursPreview = useMemo(() => {
    if (!parsedHours?.ok) return null;
    const normalized = parsedHours.normalized ?? "";
    if (!normalized) return null;
    return groupDigitsFromNormalized(normalized);
  }, [parsedHours?.ok, parsedHours?.normalized]);

  const paidHoursInputValue = paidHoursFocused
    ? paidHoursPerWeek
    : parsedHours?.ok && hoursPreview
      ? hoursPreview
      : paidHoursPerWeek;

  const hoursPerWeekScaled = parsedHours?.ok
    ? (parsedHours.hoursPerWeek as bigint)
    : 0n;

  const fmt = (scaled: bigint) =>
    roundDisplay
      ? formatCurrencyFromScaled(scaled, currency, true, displayDecimals)
      : formatCurrencyFromScaled(scaled, currency, false, displayDecimals);

  const annualInterpreted = useMemo(() => {
    if (!parsedAnnual.ok) return null;
    return fmt(annualScaled);
  }, [parsedAnnual.ok, annualScaled, currency, roundDisplay, displayDecimals]);

  const canShowAnnualResults = parsedAnnual.ok;

  const breakdownScaled = useMemo(() => {
    if (!parsedAnnual.ok) return null;

    const hourly = annualToPeriodScaled(annualScaled, "hourly");
    const daily = annualToPeriodScaled(annualScaled, "daily");
    const weekly = annualToPeriodScaled(annualScaled, "weekly");
    const biweekly = annualToPeriodScaled(annualScaled, "biweekly");
    const every4w = annualToPeriodScaled(annualScaled, "every_4_weeks");
    const monthly = annualToPeriodScaled(annualScaled, "monthly");
    const annual = annualScaled;

    const monthlyMinus4w = monthly - every4w;
    const monthlyMinus4wPct =
      every4w === 0n ? 0 : Number(monthlyMinus4w) / Number(every4w);

    let paidHourly: bigint | null = null;
    let paidMinusClock: bigint | null = null;
    let paidMinusClockPct: number | null = null;
    let paidHoursPerYearLabel: string | null = null;

    if (showPaidHoursScenario) {
      if (!parsedHours?.ok) {
        paidHourly = null;
        paidMinusClock = null;
        paidMinusClockPct = null;
        paidHoursPerYearLabel = null;
      } else {
        const hoursPerYearScaled = hoursPerWeekScaled * 52n;
        paidHoursPerYearLabel = `${toNumberSafe(
          hoursPerYearScaled,
        ).toLocaleString(undefined, { maximumFractionDigits: 4 })} hours/year`;

        paidHourly = annualToPaidHoursHourlyScaled(
          annualScaled,
          hoursPerWeekScaled,
        );
        paidMinusClock = paidHourly - hourly;
        paidMinusClockPct =
          hourly === 0n ? 0 : Number(paidMinusClock) / Number(hourly);
      }
    }

    return {
      hourly,
      daily,
      weekly,
      biweekly,
      every4w,
      monthly,
      annual,
      monthlyMinus4w,
      monthlyMinus4wPct,
      paidHourly,
      paidMinusClock,
      paidMinusClockPct,
      paidHoursPerYearLabel,
    };
  }, [
    parsedAnnual.ok,
    annualScaled,
    showPaidHoursScenario,
    parsedHours?.ok,
    hoursPerWeekScaled,
  ]);

  const headlineHourlyScaled = breakdownScaled?.hourly ?? 0n;

  const canShowPaidScenario =
    showPaidHoursScenario &&
    parsedAnnual.ok &&
    parsedHours !== null &&
    parsedHours.ok &&
    breakdownScaled?.paidHourly !== null;

  const paidScenarioBlocked =
    showPaidHoursScenario &&
    (!parsedHours || !parsedHours.ok) &&
    parsedAnnual.ok;

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

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const faqData = [
    {
      q: "How does this convert annual rent to an hourly amount?",
      a: "The main result is time-based: annual rent is spread across every hour in a 365-day year. That is annual ÷ (365 × 24) = annual ÷ 8,760.",
    },
    {
      q: "Is this the same as dividing annual rent by 8,760 hours?",
      a: "Yes. Under the page assumptions (365 days, 24 hours/day), the hourly equivalence is annual ÷ 8,760.",
    },
    {
      q: "Why can the hourly equivalent look surprisingly small?",
      a: "Because the annual total is divided by a large denominator (8,760 hours). This is an equivalence for comparison, not a lease billing rate.",
    },
    {
      q: "What is the paid-hours scenario?",
      a: "It’s an optional comparison that spreads the annual total across only assumed paid hours (hours/week × 52). It shows how the implied hourly changes when you allocate the same annual cost to fewer hours.",
    },
    {
      q: "What does “annual rent” mean here?",
      a: "It means the total amount you want to treat as rent for budgeting. This tool does not guess what is included (utilities, fees, taxes, deposits).",
    },
    {
      q: "Does this tool convert currencies or exchange rates?",
      a: "No. Currency selection only changes formatting. Convert the currency externally first if needed.",
    },
    {
      q: "Does this use leap years?",
      a: "No. The calculator uses a 365-day year and an average month length of 365 ÷ 12 days for consistency.",
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
        item: "https://www.rentconverter.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Annual to Hourly Rent Converter",
        item: "https://www.rentconverter.com/annual-to-hourly-rent-converter",
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

      <section className=" pb-4 rc-no-print">
        <nav className="max-w-6xl mx-auto px-6 text-sm text-slate-500">
          <SafeLink href="/" className="hover:underline">
            Home
          </SafeLink>{" "}
          / Annual to Hourly Rent Converter
        </nav>
      </section>

      <section id="converter" className="mx-auto max-w-6xl px-6 pb-6">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:px-8 rc-print-block">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-xl capitalize sm:text-4xl text-sky-800 font-bold">
              Instant annual to hourly converter
            </h1>

            <div className=" rounded-xl border border-slate-200 bg-white p-4 rc-no-print">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-700">
                    Paid-hours scenario (optional)
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Compare the 8,760-hour equivalence against an assumed
                    paid-hours schedule (hours/week × 52).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPaidHoursScenario((v) => !v)}
                  className={`relative inline-flex h-6 w-11 rounded-full transition cursor-pointer ${
                    showPaidHoursScenario ? "bg-sky-600" : "bg-slate-300"
                  }`}
                  aria-label="Toggle paid-hours scenario"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      showPaidHoursScenario ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {showPaidHoursScenario ? (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Paid hours per week
                  </label>
                  <input
                    inputMode="decimal"
                    value={paidHoursInputValue}
                    onChange={(e) => setPaidHoursPerWeek(e.target.value)}
                    onFocus={() => setPaidHoursFocused(true)}
                    onBlur={() => setPaidHoursFocused(false)}
                    placeholder="e.g. 40 or 37.5"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    aria-invalid={Boolean(parsedHours && !parsedHours.ok)}
                    aria-describedby="rc-hours-help rc-hours-error"
                  />
                  <p id="rc-hours-help" className="mt-2 text-xs text-slate-500">
                    Valid range is 0 to 168 hours/week. This does not replace
                    the main conversion. It’s only an illustrative comparison.
                  </p>

                  {parsedHours && !parsedHours.ok ? (
                    <p
                      id="rc-hours-error"
                      className="mt-2 text-sm font-semibold text-rose-700"
                    >
                      {parsedHours.error}
                    </p>
                  ) : parsedHours && parsedHours.warnings.length ? (
                    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <div className="font-semibold">Hours input note</div>
                      <ul className="mt-1 list-disc pl-5 space-y-1">
                        {parsedHours.warnings.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Annual rent total
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountInputValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setAmountFocused(true)}
                  onBlur={() => setAmountFocused(false)}
                  placeholder="e.g. 30000 or 30000.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={!parsedAnnual.ok}
                  aria-describedby="rc-amount-help rc-amount-error"
                />
                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value)
                        ? (e.target.value as Currency)
                        : "USD",
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
              {!parsedAnnual.ok ? (
                <p
                  id="rc-amount-error"
                  className="mt-2 text-sm font-semibold text-rose-700"
                >
                  {parsedAnnual.error}
                </p>
              ) : parsedAnnual.warnings.length ? (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="font-semibold">Input interpretation note</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsedAnnual.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {parsedAnnual.ok ? (
                <p className="mt-2 text-xs text-slate-600">
                  Interpreting your annual total as:{" "}
                  <span className="font-semibold text-slate-800">
                    {annualInterpreted}
                  </span>
                </p>
              ) : null}

              {!amountFocused && parsedAnnual.ok && amountPreview ? (
                <p className="mt-1 text-xs text-slate-500">
                  Preview (grouped):{" "}
                  <span className="font-semibold text-slate-700">
                    {amountPreview}
                  </span>
                </p>
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
                    {PERIOD_LABEL.annual}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="text-xs text-slate-500">To</div>
                  <div className="mt-1 text-base font-bold text-slate-800">
                    {PERIOD_LABEL.hourly}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6 rc-print-block">
            <div className="text-sm text-slate-600">Hourly equivalent</div>

            {!canShowAnnualResults ? (
              <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700">
                <div className="font-semibold">No result to show yet</div>
                <p className="mt-1 text-sm text-slate-600">
                  Enter a valid annual rent total above to see the hourly
                  equivalent and breakdown.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
                    {fmt(headlineHourlyScaled)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {fmt(annualScaled)} annual ≈{" "}
                    <strong>{fmt(headlineHourlyScaled)}</strong> per hour
                    (time-based, 8,760 hours/year)
                  </div>

                  <div className="rc-no-print mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy("hourly", fmt(headlineHourlyScaled))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      {copiedKey === "hourly" ? "Copied" : "Copy hourly amount"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          "summary",
                          `Annual: ${fmt(annualScaled)} | Hourly (time-based): ${fmt(
                            headlineHourlyScaled,
                          )} | Assumptions: 365-day year, 24 hours/day`,
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
                        "Monthly (average)",
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

                  {showPaidHoursScenario ? (
                    <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs text-slate-500">
                        Paid-hours hourly comparison (optional)
                      </div>

                      {paidScenarioBlocked ? (
                        <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                          <div className="font-semibold">
                            Paid-hours scenario needs a valid hours/week input
                          </div>
                          <p className="mt-1 text-sm">
                            Fix the “paid hours per week” field to see the
                            paid-hours hourly comparison.
                          </p>
                        </div>
                      ) : canShowPaidScenario ? (
                        <div className="mt-2 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                            <div className="text-xs text-slate-500">
                              Time-based hourly
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-800">
                              {fmt(breakdownScaled!.hourly)}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              Annual ÷ 8,760
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                            <div className="text-xs text-slate-500">
                              Paid-hours hourly
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-800">
                              {fmt(breakdownScaled!.paidHourly as bigint)}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              Annual ÷ (hours/week × 52)
                              {breakdownScaled!.paidHoursPerYearLabel
                                ? ` ≈ ${breakdownScaled!.paidHoursPerYearLabel}`
                                : ""}
                            </div>
                          </div>

                          <div className="rounded-xl border border-slate-100 bg-white px-4 py-3">
                            <div className="text-xs text-slate-500">
                              Difference
                            </div>
                            <div className="mt-1 text-sm font-bold text-slate-800">
                              {fmt(breakdownScaled!.paidMinusClock as bigint)}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              ≈{" "}
                              {formatPercent(
                                breakdownScaled!.paidMinusClockPct as number,
                                2,
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-600">
                          Enter paid hours per week to see the paid-hours
                          scenario comparison.
                        </p>
                      )}

                      <p className="mt-3 text-xs text-slate-500">
                        The paid-hours scenario is a comparison tool. It does
                        not replace the main time-based hourly equivalence.
                      </p>
                    </div>
                  ) : null}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      4-week vs monthly context
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
                      4-week rent is 28 days. This page uses an average month
                      length of 365 ÷ 12 days (about 30.42). Different lengths
                      produce different equivalents.
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs text-slate-500">
                      Avoid misleading interpretations
                    </div>
                    <p className="mt-1 text-sm text-slate-700">
                      The hourly number is an equivalence for comparison. It
                      does not mean your lease bills hourly. If your annual
                      total includes fees or utilities, the hourly equivalence
                      includes them too because it uses your annual total as
                      input.
                    </p>
                  </div>

                  <div className="rc-no-print flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="rounded-xl cursor-pointer border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-sky-50 hover:border-sky-200 transition"
                    >
                      Print / Save as PDF
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions (used consistently across outputs): year = 365 days, day
            = 24 hours (8,760 hours/year), week = 7 days, biweekly = 14 days,
            4-week = 28 days, month = 365 ÷ 12 days (average). Exact amounts due
            can differ by lease schedule, prorations, fees, and what is included
            in rent.
          </p>
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
              <div className="text-xs text-slate-500">Displayed decimals</div>
              <select
                value={displayDecimals}
                onChange={(e) => {
                  const v = Math.trunc(Number(e.target.value));
                  setDisplayDecimals(
                    v === 0 || v === 2 || v === 4 || v === 6 ? v : 2,
                  );
                }}
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
            <div className="font-semibold">Assumptions used on this page</div>
            <ul className="mt-1 list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>1 year = 365 days</li>
              <li>24 hours per day (so 8,760 hours per year)</li>
              <li>Month = 365 ÷ 12 days (average)</li>
              <li>
                This tool does not assume what is included in “rent” (fees,
                utilities, taxes). Enter the total you want to budget with.
              </li>
            </ul>
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
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    How the annual to hourly rent converter works (8,760-hour
                    equivalence)
                  </h2>
                  <p className="mt-2 text-slate-600 leading-7 max-w-2xl">
                    This page converts a yearly rent total into an hourly
                    equivalent using a fixed 365-day year. The default result
                    spreads the same annual cost across every hour in the year,
                    which is{" "}
                    <span className="font-semibold text-slate-900">
                      365 × 24 = 8,760 hours
                    </span>
                    . You can optionally enable a paid-hours scenario to compare
                    against a work-hours assumption, but the time-based hourly
                    is the primary conversion used for consistent breakdowns.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200/70 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Time-based hourly
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 text-slate-700 ring-1 ring-slate-200 px-3 py-1 text-xs font-semibold">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    Optional paid-hours
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    INPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Annual total
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    DEFAULT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    annual ÷ 8,760
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OPTION
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    annual ÷ (hrs/wk × 52)
                  </div>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-4 hover:ring-sky-200/80 transition">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    OUTPUT
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Hourly + breakdown
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-base text-slate-700 leading-7">
              {/* SectionCard: what you get */}
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
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        What this annual to hourly converter returns
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      You enter an annual rent total and the tool computes a
                      time-based hourly equivalent using{" "}
                      <span className="font-semibold text-slate-900">
                        8,760 hours
                      </span>
                      . The hourly number is the same annual cost expressed per
                      hour under a fixed-year model.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Default conversion
                      </div>
                      <p className="mt-2">
                        <span className="font-semibold text-slate-900">
                          Time-based hourly
                        </span>{" "}
                        = annual rent ÷ (365 × 24) = annual rent ÷ 8,760
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        This is the primary hourly used for consistency across
                        the breakdown.
                      </p>
                    </div>

                    <p>
                      The results section can also show a breakdown derived from
                      the same annual basis. Weekly, biweekly, 4-week, monthly,
                      daily, and hourly equivalents should all reconcile back to
                      the annual total under the same assumptions. If you toggle
                      paid-hours, it is shown as a clearly labeled alternative
                      hourly for comparison.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: why every hour and consistency */}
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
                          d="M5 12h14M12 5v14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Why the time-based hourly uses every hour
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The time-based hourly is designed to stay compatible with
                      the rest of the period breakdowns on the site. When
                      everything is derived from a fixed day-length model, the
                      table stays internally consistent. Using every hour in the
                      year is the cleanest way to keep hourly aligned with
                      daily, weekly, biweekly, 4-week, and monthly lines.
                    </p>

                    <p>
                      This is why the default uses{" "}
                      <span className="font-semibold text-slate-900">
                        annual ÷ (365 × 24)
                      </span>{" "}
                      and not a paid-hours assumption. If the default used only
                      a subset of hours, the hourly line would no longer
                      reconcile cleanly with day-based periods, and the
                      breakdown would mix two different models.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Time-based model
                        </div>
                        <p className="mt-2">
                          Best for keeping the breakdown consistent. Annual,
                          monthly, weekly, daily, and hourly all come from the
                          same base.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5">
                        <div className="text-sm font-bold text-slate-900">
                          Alternative scenario
                        </div>
                        <p className="mt-2">
                          Paid-hours hourly is optional and explicitly labeled
                          so it is not confused with the default.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SectionCard: paid-hours scenario */}
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
                          d="M7 7h10v10H7z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Paid-hours hourly (optional) and how it is computed
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      The paid-hours scenario is useful when you want an
                      alternative hourly derived from a chosen hours-per-week
                      assumption. It does not replace the time-based hourly. It
                      is a comparison line that shows how different the number
                      becomes when you divide the same annual total by a smaller
                      set of hours.
                    </p>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Paid-hours conversion
                      </div>
                      <p className="mt-2">
                        <span className="font-semibold text-slate-900">
                          Paid-hours hourly
                        </span>{" "}
                        = annual rent ÷ (hours/week × 52)
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        The hours/week value should be positive. If it is
                        missing, zero, or invalid, the paid-hours line should be
                        disabled or show an explicit warning.
                      </p>
                    </div>

                    <p>
                      If paid-hours is enabled, the page should show both values
                      with clear labels: time-based hourly (annual ÷ 8,760) and
                      paid-hours hourly (annual ÷ (hours/week × 52)). The tool
                      should not guess your schedule.
                    </p>
                  </div>
                </div>
              </div>

              {/* SectionCard: examples + parsing */}
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
                          d="M4 6h16M9 6v12m6-12v12"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Examples and input parsing rules
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      These examples match the displayed formulas. If the UI
                      formats the result to fewer decimals, that should be
                      display-only and not change the underlying math.
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        If annual rent is{" "}
                        <strong className="text-slate-900">$30,000</strong>,
                        time-based hourly is about{" "}
                        <strong className="text-slate-900">
                          $30,000 ÷ 8,760 ≈ $3.4247
                        </strong>
                        .
                      </li>
                      <li>
                        With{" "}
                        <strong className="text-slate-900">
                          40 hours/week
                        </strong>
                        , paid-hours hourly is{" "}
                        <strong className="text-slate-900">
                          $30,000 ÷ (40 × 52) ≈ $14.4231
                        </strong>
                        .
                      </li>
                      <li>
                        <strong className="text-slate-900">1,234</strong> is
                        interpreted as 1234 (grouping). If you meant a decimal,
                        type <strong className="text-slate-900">1.234</strong>.
                      </li>
                    </ul>

                    <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-5">
                      <div className="text-sm font-bold text-slate-900">
                        Accepted numeric formats
                      </div>
                      <ul className="mt-2 list-disc pl-5 space-y-2">
                        <li>
                          Decimals:{" "}
                          <strong className="text-slate-900">30000.50</strong>,{" "}
                          <strong className="text-slate-900">.5</strong>,{" "}
                          <strong className="text-slate-900">12.</strong>
                        </li>
                        <li>
                          Thousands grouping:{" "}
                          <strong className="text-slate-900">30,000</strong>,{" "}
                          <strong className="text-slate-900">30,000.50</strong>
                        </li>
                        <li>
                          Currency symbols are ignored:{" "}
                          <strong className="text-slate-900">$30,000</strong>
                        </li>
                      </ul>
                      <p className="mt-3 text-sm text-slate-600">
                        If an input could be interpreted more than one way, the
                        correct behavior is a warning or error instead of
                        silently guessing.
                      </p>
                    </div>

                    <p>
                      This converter treats the annual figure as the source of
                      truth. It does not add fees, utilities, deposits, or
                      taxes. It only converts the number you entered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Related tools */}
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
                          d="M5 12h14"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Related rent converters
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p>
                      If you need a different direction or want to start from a
                      monthly rate, use a dedicated converter page.
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      <SafeLink
                        href="/rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        Rent converter →
                      </SafeLink>
                      <SafeLink
                        href="/monthly-to-hourly-rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        Monthly to hourly →
                      </SafeLink>
                      <SafeLink
                        href="/hourly-to-annual-rent-converter"
                        className="cursor-pointer font-semibold text-sky-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
                      >
                        Hourly to annual →
                      </SafeLink>
                    </div>
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
                    Utility note
                  </div>
                  <h3 className="mt-2 text-xl sm:text-2xl font-extrabold tracking-tight">
                    Paid-hours is a comparison assumption, not the default model
                  </h3>
                  <p className="mt-3 text-slate-200 leading-7">
                    Time-based hourly uses all 8,760 hours in a 365-day year so
                    the hourly value stays consistent with the rest of the
                    breakdown. Paid-hours divides by (hours/week × 52) and can
                    produce a much larger number because it spreads the same
                    annual total across fewer hours. If the paid-hours line is
                    shown, it should always be clearly labeled as optional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-sky-800 tracking-tight">
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

      <section className="max-w-6xl mx-auto px-6 pb-8 rc-no-print">
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
