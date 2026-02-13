import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/weekly-to-monthly-rent-uk";
import HowItWorks from "~/client/components/weekly-to-monthly-rent-uk/HowItWorks";
import ToolFit from "~/client/components/weekly-to-monthly-rent-uk/ToolFit";
import FAQ from "~/client/components/weekly-to-monthly-rent-uk/FAQ";

function safeToFixed(n: number, digits: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(digits);
}

export const meta: Route.MetaFunction = () => {
  const url = "https://www.rentconverter.com/weekly-to-monthly-rent-uk";
  const ogImage = "https://www.rentconverter.com/og-image.jpg";

  return [
    { title: "Weekly to Monthly Rent Converter UK (True Monthly Cost)" },
    {
      name: "description",
      content:
        "Convert weekly rent to monthly in the UK using true calendar-month math. Compare weekly vs 4-week pricing with exact decimals and clear breakdowns.",
    },
    { name: "robots", content: "index,follow" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Weekly to Monthly Rent Converter UK" },
    {
      property: "og:description",
      content:
        "Find the true monthly cost of weekly rent in the UK and compare weekly vs 4-week billing.",
    },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "RentConverter.com" },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Weekly to Monthly Rent Converter UK" },
    {
      name: "twitter:description",
      content:
        "See the true monthly cost of weekly rent in the UK with clear breakdowns.",
    },
    { name: "twitter:image", content: ogImage },
    { tagName: "link", rel: "canonical", href: url },
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

const SUPPORTED_CURRENCIES = [
  "GBP",
  "USD",
  "CAD",
  "EUR",
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

const MAX_SAFE_INT_FOR_NUMBER = 9_000_000_000_000_000n;

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
    if (trimTrailingZeros) fracStr = fracStr.replace(/0+$/g, "");
  }
  return { negative, intStr: intPart.toString(), fracStr };
}

function formatPlainNumberFromScaled(
  scaled: bigint,
  maxFractionDigits: number,
): string {
  const digitsCap = Math.max(0, Math.min(12, maxFractionDigits));
  const { group, decimal } = getNumberSeparators();

  const negative = scaled < 0n;
  const a = absBigInt(scaled);
  const intPart = a / SCALE;
  const fracPart = a % SCALE;

  let digits = 0;
  if (digitsCap > 0 && fracPart !== 0n) {
    const fracFull = fracPart.toString().padStart(12, "0");
    const trimmed = fracFull.replace(/0+$/g, "");
    digits = Math.min(digitsCap, Math.max(0, trimmed.length));
  }

  const { intStr, fracStr } = scaledToDecimalStrings(scaled, digits, true);

  const groupedInt = groupInt(intStr, group);

  if (digits > 0 && fracStr.length > 0) {
    return `${negative ? "-" : ""}${groupedInt}${decimal}${fracStr}`;
  }

  return `${negative ? "-" : ""}${groupedInt}`;
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
    !roundDisplay,
  );

  const groupedInt = groupInt(intStr, group);

  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

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

function parseMoneyInputToScaled(raw: string, label = "value"): ParsedScaled {
  const warnings: string[] = [];
  const s0 = (raw ?? "").trim();

  if (!s0) return { ok: false, error: `Enter ${label}.`, warnings };

  let s = s0.replace(/\s+/g, "");
  s = s.replace(/[^\d.,\-]/g, "");

  if (!s)
    return {
      ok: false,
      error: `Enter a valid ${label} (example: 650 or 650.00).`,
      warnings,
    };

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
    if (split.length > 2)
      return {
        ok: false,
        error: `Enter a valid ${label} (too many decimals).`,
        warnings,
      };
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
  if (to === "hourly") return mulDivRound(annualScaled, 1n, 365n * 24n);
  if (to === "daily") return mulDivRound(annualScaled, 1n, 365n);
  if (to === "weekly") return mulDivRound(annualScaled, 7n, 365n);
  if (to === "biweekly") return mulDivRound(annualScaled, 14n, 365n);
  if (to === "every_4_weeks") return mulDivRound(annualScaled, 28n, 365n);
  if (to === "monthly") return mulDivRound(annualScaled, 1n, 12n);
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

function parseStrictDisplayDecimals(raw: string | null): number {
  if (raw === null) return 2;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 2;
  const t = Math.trunc(n);
  return t === 0 || t === 2 || t === 4 || t === 6 ? t : 2;
}

export default function WeeklyToMonthlyRentUK() {
  const canonicalUrl =
    "https://www.rentconverter.com/weekly-to-monthly-rent-uk";

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "500";
    return localStorage.getItem("rc_wtm_amount_uk") ?? "500";
  });

  const [isAmountFocused, setIsAmountFocused] = useState<boolean>(false);
  const [amountTouched, setAmountTouched] = useState<boolean>(false);

  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window === "undefined") return "GBP";
    const saved = localStorage.getItem("rc_wtm_currency_uk") ?? "GBP";
    return isCurrency(saved) ? saved : "GBP";
  });

  const [roundDisplay, setRoundDisplay] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const raw = localStorage.getItem("rc_wtm_round_display_uk");
    return raw ? safeParseBoolean(raw, true) : true;
  });

  const [displayDecimals, setDisplayDecimals] = useState<number>(() => {
    if (typeof window === "undefined") return 2;
    return parseStrictDisplayDecimals(
      localStorage.getItem("rc_wtm_display_decimals_uk"),
    );
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("rc_wtm_amount_uk", amount);
      localStorage.setItem("rc_wtm_currency_uk", currency);
      localStorage.setItem(
        "rc_wtm_round_display_uk",
        JSON.stringify(roundDisplay),
      );
      localStorage.setItem(
        "rc_wtm_display_decimals_uk",
        String(displayDecimals),
      );
    } catch {}
  }, [amount, currency, roundDisplay, displayDecimals]);

  const parsed = useMemo(() => {
    const p = parseMoneyInputToScaled(amount, "weekly rent amount");
    const errors: string[] = [];
    if (!p.ok) errors.push(p.error ?? "Enter a weekly rent amount.");
    return { ok: errors.length === 0, errors, warnings: p.warnings, p };
  }, [amount]);

  const amountPreviewValue = useMemo(() => {
    if (!parsed.ok || parsed.p.scaled === undefined) return amount;
    return formatPlainNumberFromScaled(parsed.p.scaled, 12);
  }, [amount, parsed]);

  const amountInputValue = isAmountFocused
    ? amount
    : parsed.ok
      ? amountPreviewValue
      : amount;

  const computed = useMemo(() => {
    if (!parsed.ok)
      return {
        ok: false as const,
        errors: parsed.errors,
        warnings: parsed.warnings,
      };

    const weekly = parsed.p.scaled as bigint;
    const annual = annualizeScaled(weekly, "weekly");
    const monthly = fromAnnualScaled(annual, "monthly");

    const hourly = fromAnnualScaled(annual, "hourly");
    const daily = fromAnnualScaled(annual, "daily");
    const biweekly = fromAnnualScaled(annual, "biweekly");
    const fourWeeks = fromAnnualScaled(annual, "every_4_weeks");

    const monthlyMinus4w = monthly - fourWeeks;
    const monthlyMinus4wPct =
      fourWeeks !== 0n
        ? toNumberSafe(monthlyMinus4w) / toNumberSafe(fourWeeks)
        : Number.NaN;

    const weeklyTimes4 = weekly * 4n;
    const weeklyTimes4Delta = monthly - weeklyTimes4;

    return {
      ok: true as const,
      warnings: parsed.warnings,
      weekly,
      monthly,
      annual,
      hourly,
      daily,
      biweekly,
      every_4_weeks: fourWeeks,
      monthlyMinus4w,
      monthlyMinus4wPct,
      weeklyTimes4,
      weeklyTimes4Delta,
    };
  }, [parsed]);

  const money = (scaled: bigint) =>
    formatCurrencyFromScaled(scaled, currency, roundDisplay, displayDecimals);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
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

      <section
        id="converter"
        className="mx-auto max-w-6xl px-6 pb-6 mt-2 sm:mt-6"
      >
        <div className="rounded-2xl pb-6 bg-white sm:shadow-sm sm:border border-slate-200 sm:px-8">
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-center mb-1 sm:mb-0 sm:text-left text-2xl sm:text-3xl capitalize font-bold text-sky-800 tracking-tight">
              Weekly to Monthly Rent (UK)
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
            Convert weekly rent to monthly rent in the UK instantly. Clear
            calculations, no sign-up required.
          </p>

          <div className="grid gap-x-5 gap-y-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Weekly rent amount
              </label>

              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amountInputValue}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={() => setIsAmountFocused(true)}
                  onBlur={() => {
                    setIsAmountFocused(false);
                    setAmountTouched(true);
                  }}
                  placeholder="e.g. 500"
                  className="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-invalid={amountTouched && !parsed.ok}
                />

                <select
                  value={currency}
                  onChange={(e) =>
                    setCurrency(
                      isCurrency(e.target.value)
                        ? (e.target.value as Currency)
                        : "GBP",
                    )
                  }
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Currency"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {amountTouched && !parsed.ok ? (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800">
                  <div className="font-semibold">Invalid amount</div>
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {parsed.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          {!parsed.ok ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:px-6">
              <div className="font-semibold text-slate-900">
                No results to show
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Fix the input to calculate.
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

              <div className="mt-3 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:px-6 rc-print-block">
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full bg-sky-600"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold text-slate-800">
                    Monthly equivalent
                  </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-700">
                    {money(computed.monthly)}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      ["Hourly", computed.hourly, "hourly"],
                      ["Daily", computed.daily, "daily"],
                      ["Weekly", computed.weekly, "weekly"],
                      ["2 weeks", computed.biweekly, "biweekly"],
                      [
                        "4 weeks (28 days)",
                        computed.every_4_weeks,
                        "every_4_weeks",
                      ],
                      ["Monthly (average)", computed.monthly, "monthly"],
                    ] as const
                  ).map(([label, val, key]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2"
                    >
                      <div className="text-xs text-slate-500">{label}</div>
                      <div className="mt-1 text-lg font-bold text-slate-800">
                        {money(val)}
                      </div>
                    </div>
                  ))}

                  <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-emerald-50 px-4 py-2">
                    <div className="text-xs text-slate-500">
                      4-week (28-day) vs monthly comparison
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm text-slate-700">
                        Monthly minus 4-week ={" "}
                        <strong className="text-slate-900">
                          {money(computed.monthlyMinus4w)}
                        </strong>
                      </div>
                      <div className="text-sm text-slate-700">
                        Difference ≈{" "}
                        <strong className="text-slate-900">
                          {Number.isFinite(computed.monthlyMinus4wPct)
                            ? safeToFixed(computed.monthlyMinus4wPct * 100, 2)
                            : "N/A"}
                          %
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>
      <HowItWorks />
      <ToolFit />
      <FAQ />
    </main>
  );
}
