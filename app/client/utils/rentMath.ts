export const SUPPORTED_CURRENCIES = [
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

export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export function isCurrency(value: string): value is Currency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export type MoneyParseResult =
  | { ok: true; cents: bigint; normalized: string; warnings: string[] }
  | { ok: false; error: string; warnings: string[] };

export function parseMoneyToCents(raw: string, emptyMessage = "Enter an amount."): MoneyParseResult {
  const warnings: string[] = [];
  const source = (raw ?? "").trim();
  if (!source) return { ok: false, error: emptyMessage, warnings };

  let value = source.replace(/\s+/g, "").replace(/[^\d.,-]/g, "");
  if (!value) {
    return { ok: false, error: "Enter a valid number, such as 1250 or 1,250.50.", warnings };
  }
  if (value.includes("-")) {
    return { ok: false, error: "Amount cannot be negative.", warnings };
  }

  const lastDot = value.lastIndexOf(".");
  const lastComma = value.lastIndexOf(",");
  let decimalSep: "." | "," | null = null;

  if (lastDot >= 0 && lastComma >= 0) {
    decimalSep = lastDot > lastComma ? "." : ",";
  } else if (lastDot >= 0) {
    decimalSep = ".";
  } else if (lastComma >= 0) {
    const parts = value.split(",");
    if (parts.length === 2) {
      const after = parts[1] ?? "";
      const before = parts[0] ?? "";
      if (/^\d{1,2}$/.test(after)) {
        decimalSep = ",";
      } else if (/^\d{3}$/.test(after) && /^\d{1,3}$/.test(before)) {
        warnings.push(`Interpreted "${source}" as thousands grouping. Use a decimal point for cents.`);
        decimalSep = null;
      } else {
        return {
          ok: false,
          error: 'That number format is ambiguous. Try "1250.50" or "1,250.50".',
          warnings,
        };
      }
    } else {
      decimalSep = null;
    }
  }

  let wholePart = value;
  let fracPart = "";
  if (decimalSep) {
    const split = value.split(decimalSep);
    if (split.length > 2) {
      return { ok: false, error: "Enter a valid number with one decimal separator.", warnings };
    }
    wholePart = split[0] ?? "";
    fracPart = split[1] ?? "";
  }

  if (decimalSep === ".") wholePart = wholePart.replace(/,/g, "");
  else if (decimalSep === ",") wholePart = wholePart.replace(/\./g, "");
  else wholePart = wholePart.replace(/[.,]/g, "");

  if (wholePart === "") wholePart = "0";
  wholePart = wholePart.replace(/^0+(?=\d)/, "");

  if (!/^\d+$/.test(wholePart) || (fracPart && !/^\d+$/.test(fracPart))) {
    return { ok: false, error: "Enter a valid number.", warnings };
  }

  const centsPartRaw = fracPart.padEnd(3, "0").slice(0, 3);
  const centsPart = BigInt(centsPartRaw.slice(0, 2) || "0");
  const thirdDigit = Number(centsPartRaw[2] ?? "0");
  const cents = BigInt(wholePart || "0") * 100n + centsPart + (thirdDigit >= 5 ? 1n : 0n);
  const normalized = fracPart ? `${wholePart}.${fracPart.slice(0, 12)}` : wholePart;

  return { ok: true, cents, normalized, warnings };
}

export function parsePositiveNumber(raw: string, fallback: number, min = 0, max = Number.MAX_SAFE_INTEGER) {
  const value = Number(String(raw).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

export function divRound(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) return 0n;
  const sign = numerator < 0n ? -1n : 1n;
  const abs = numerator < 0n ? -numerator : numerator;
  return sign * ((abs + denominator / 2n) / denominator);
}

export function multiplyRatio(cents: bigint, numerator: bigint, denominator: bigint): bigint {
  return divRound(cents * numerator, denominator);
}

export function formatMoney(cents: bigint | undefined, currency: Currency): string {
  if (cents === undefined) return "-";
  const amount = Number(cents) / 100;
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(2)}%`;
}

export function weeklyToMonthlyCents(weekly: bigint): bigint {
  return multiplyRatio(weekly, 365n, 84n);
}

export function weeklyToAnnualCents(weekly: bigint): bigint {
  return multiplyRatio(weekly, 365n, 7n);
}

export function weeklyToDailyCents(weekly: bigint): bigint {
  return multiplyRatio(weekly, 1n, 7n);
}

export function monthlyToWeeklyCents(monthly: bigint): bigint {
  return multiplyRatio(monthly, 84n, 365n);
}

export function monthlyToAnnualCents(monthly: bigint): bigint {
  return monthly * 12n;
}

export function dailyToMonthlyCents(daily: bigint): bigint {
  return multiplyRatio(daily, 365n, 12n);
}

export function dailyToWeeklyCents(daily: bigint): bigint {
  return daily * 7n;
}

export function fourWeekToMonthlyCents(fourWeek: bigint): bigint {
  return multiplyRatio(fourWeek, 365n, 336n);
}

export function fortnightlyToMonthlyCents(fortnightly: bigint): bigint {
  return multiplyRatio(fortnightly, 365n, 168n);
}
