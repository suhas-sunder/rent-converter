import { useEffect, useMemo, useState } from "react";
import type { Route } from "./+types/rent-due-date-calculator";
import OtherUsefulTools from "~/client/components/navigation/OtherUsefulTools";
import RentToolsByCountry from "~/client/components/navigation/RentToolsByCountry";
import RenterChecklists from "~/client/components/navigation/RenterChecklists";

export const meta: Route.MetaFunction = () => [
  {
    title:
      "Rent Due Date Calculator – Schedule, Monthly Totals, Cumulative Paid, and Multi-Year View",
  },
  {
    name: "description",
    content:
      "Calculate the next rent due date and a forward schedule, then see how many payments fall in each calendar month, how much rent is paid by an end date, and totals by year. Supports monthly, weekly, biweekly, every 4 weeks (28 days), and annual cycles.",
  },
  {
    name: "keywords",
    content:
      "rent due date calculator, next rent due date, rent payment schedule, rent paid by end of month, monthly rent totals, rent billed every 28 days, rent paid every 4 weeks, rent due weekly, rent due biweekly, rent payment calendar",
  },
  { name: "robots", content: "index,follow" },
  { name: "author", content: "RentConverter.com" },
  { name: "theme-color", content: "#f8fafc" },
  { property: "og:type", content: "website" },
  {
    property: "og:title",
    content:
      "Rent Due Date Calculator – Monthly Totals, Cumulative Paid, and Multi-Year View",
  },
  {
    property: "og:description",
    content:
      "Estimate your rent due dates and see payment counts per month, cumulative paid by an end date, and year totals for monthly, weekly, biweekly, and 28-day rent cycles.",
  },
  {
    property: "og:url",
    content: "https://rentconverter.com/rent-due-date-calculator",
  },
  { property: "og:site_name", content: "RentConverter.com" },
  { property: "og:image", content: "https://rentconverter.com/og-image.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Rent Due Date Calculator" },
  {
    name: "twitter:description",
    content:
      "Calculate rent due dates and see monthly totals, cumulative paid by an end date, and multi-year totals.",
  },
  { name: "twitter:image", content: "https://rentconverter.com/og-image.jpg" },
  {
    rel: "canonical",
    href: "https://rentconverter.com/rent-due-date-calculator",
  },
];

type BillingCycle =
  | "monthly"
  | "weekly"
  | "biweekly"
  | "every_4_weeks"
  | "annual";

const BILLING_LABEL: Record<BillingCycle, string> = {
  monthly: "Monthly",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  every_4_weeks: "Every 4 weeks (28 days)",
  annual: "Annual",
};

const BILLING_PAYMENTS_PER_YEAR: Record<BillingCycle, number> = {
  weekly: 52,
  biweekly: 26,
  every_4_weeks: 13,
  monthly: 12,
  annual: 1,
};

function clampNum(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function safeParseInt(value: string, fallback: number) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return n;
}

function safeParseMoney(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n)) return 0;
  return clampNum(n, 0, 1_000_000_000);
}

function money(n: number, currency: string) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: n < 10 ? 2 : 0,
  }).format(n);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

function toISODateInputValue(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addYears(date: Date, years: number) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function lastDayOfMonth(year: number, monthIndex0: number) {
  return new Date(year, monthIndex0 + 1, 0).getDate();
}

function nextMonthlyDueDate(fromDate: Date, dueDay: number) {
  const start = stripTime(fromDate);
  const y = start.getFullYear();
  const m = start.getMonth();

  const thisMonthLast = lastDayOfMonth(y, m);
  const thisMonthDue = new Date(y, m, Math.min(dueDay, thisMonthLast));

  if (thisMonthDue >= start) return thisMonthDue;

  const nextMonth = m + 1;
  const ny = y + Math.floor(nextMonth / 12);
  const nm = nextMonth % 12;
  const nextLast = lastDayOfMonth(ny, nm);
  return new Date(ny, nm, Math.min(dueDay, nextLast));
}

function nextAnnualDueDate(fromDate: Date, anchor: Date) {
  const start = stripTime(fromDate);
  const a = stripTime(anchor);

  const candidateThisYear = new Date(
    start.getFullYear(),
    a.getMonth(),
    a.getDate(),
  );
  if (candidateThisYear >= start) return candidateThisYear;

  return new Date(start.getFullYear() + 1, a.getMonth(), a.getDate());
}

function nextFixedIntervalDueDate(
  fromDate: Date,
  intervalDays: number,
  anchor: Date,
) {
  const start = stripTime(fromDate);
  const a = stripTime(anchor);

  if (a >= start) return a;

  const diffMs = start.getTime() - a.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const steps = Math.ceil(diffDays / intervalDays);
  return addDays(a, steps * intervalDays);
}

function buildScheduleUntilEnd(
  cycle: BillingCycle,
  asOfDate: Date,
  endDate: Date,
  anchorDate: Date,
  dueDayMonthly: number,
) {
  const start = stripTime(asOfDate);
  const end = stripTime(endDate);

  if (end < start) return [];

  const dates: Date[] = [];

  if (cycle === "monthly") {
    let cursor = nextMonthlyDueDate(start, dueDayMonthly);
    let guard = 0;
    while (cursor <= end && guard < 2000) {
      dates.push(cursor);
      const y = cursor.getFullYear();
      const m = cursor.getMonth() + 1;
      const ny = y + Math.floor(m / 12);
      const nm = m % 12;
      const nextLast = lastDayOfMonth(ny, nm);
      cursor = new Date(ny, nm, Math.min(dueDayMonthly, nextLast));
      guard++;
    }
    return dates;
  }

  if (cycle === "annual") {
    let cursor = nextAnnualDueDate(start, anchorDate);
    let guard = 0;
    while (cursor <= end && guard < 2000) {
      dates.push(cursor);
      cursor = new Date(
        cursor.getFullYear() + 1,
        cursor.getMonth(),
        cursor.getDate(),
      );
      guard++;
    }
    return dates;
  }

  const intervalDays = cycle === "weekly" ? 7 : cycle === "biweekly" ? 14 : 28;
  let cursor = nextFixedIntervalDueDate(start, intervalDays, anchorDate);
  let guard = 0;
  while (cursor <= end && guard < 5000) {
    dates.push(cursor);
    cursor = addDays(cursor, intervalDays);
    guard++;
  }
  return dates;
}

function ymKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function yKey(d: Date) {
  return String(d.getFullYear());
}

function monthLabelFromKey(key: string) {
  const [y, m] = key.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
  }).format(date);
}

function makeMonthKeysBetween(start: Date, end: Date) {
  const s = new Date(start.getFullYear(), start.getMonth(), 1);
  const e = new Date(end.getFullYear(), end.getMonth(), 1);

  const keys: string[] = [];
  let cursor = new Date(s);
  let guard = 0;

  while (cursor <= e && guard < 2000) {
    keys.push(ymKey(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    guard++;
  }
  return keys;
}

export default function RentDueDateCalculator() {
  const pageName = "Rent Due Date Calculator";
  const canonicalUrl = "https://rentconverter.com/rent-due-date-calculator";

  const [cycle, setCycle] = useState<BillingCycle>(() => {
    if (typeof window === "undefined") return "monthly";
    return (
      (localStorage.getItem("rdd2_cycle") as BillingCycle | null) ?? "monthly"
    );
  });

  const [amount, setAmount] = useState<string>(() => {
    if (typeof window === "undefined") return "2000";
    return localStorage.getItem("rdd2_amount") ?? "2000";
  });

  const [currency, setCurrency] = useState<string>(() => {
    if (typeof window === "undefined") return "CAD";
    return localStorage.getItem("rdd2_currency") ?? "CAD";
  });

  const [includeRounding, setIncludeRounding] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("rdd2_rounding");
    if (saved !== null) return JSON.parse(saved);
    return true;
  });

  const [asOfDate, setAsOfDate] = useState<string>(() => {
    const d = new Date();
    if (typeof window === "undefined") return toISODateInputValue(d);
    return localStorage.getItem("rdd2_asOf") ?? toISODateInputValue(d);
  });

  const [horizonMode, setHorizonMode] = useState<"years" | "end_date">(() => {
    if (typeof window === "undefined") return "years";
    return (
      (localStorage.getItem("rdd2_horizonMode") as
        | "years"
        | "end_date"
        | null) ?? "years"
    );
  });

  const [yearsAhead, setYearsAhead] = useState<string>(() => {
    if (typeof window === "undefined") return "1";
    return localStorage.getItem("rdd2_yearsAhead") ?? "1";
  });

  const [endDate, setEndDate] = useState<string>(() => {
    const d = addYears(new Date(), 1);
    if (typeof window === "undefined") return toISODateInputValue(d);
    return localStorage.getItem("rdd2_endDate") ?? toISODateInputValue(d);
  });

  const [anchorDate, setAnchorDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(Math.max(1, Math.min(28, d.getDate())));
    if (typeof window === "undefined") return toISODateInputValue(d);
    return localStorage.getItem("rdd2_anchor") ?? toISODateInputValue(d);
  });

  const [dueDayMonthly, setDueDayMonthly] = useState<string>(() => {
    if (typeof window === "undefined") return "1";
    return localStorage.getItem("rdd2_dueDay") ?? "1";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("rdd2_cycle", cycle);
    localStorage.setItem("rdd2_amount", amount);
    localStorage.setItem("rdd2_currency", currency);
    localStorage.setItem("rdd2_rounding", JSON.stringify(includeRounding));
    localStorage.setItem("rdd2_asOf", asOfDate);
    localStorage.setItem("rdd2_horizonMode", horizonMode);
    localStorage.setItem("rdd2_yearsAhead", yearsAhead);
    localStorage.setItem("rdd2_endDate", endDate);
    localStorage.setItem("rdd2_anchor", anchorDate);
    localStorage.setItem("rdd2_dueDay", dueDayMonthly);
  }, [
    cycle,
    amount,
    currency,
    includeRounding,
    asOfDate,
    horizonMode,
    yearsAhead,
    endDate,
    anchorDate,
    dueDayMonthly,
  ]);

  const parsedAmount = useMemo(() => safeParseMoney(amount), [amount]);
  const rentPerPaymentRaw = parsedAmount;

  const rentPerPayment = useMemo(() => {
    if (!includeRounding) return rentPerPaymentRaw;
    return Math.round(rentPerPaymentRaw * 100) / 100;
  }, [rentPerPaymentRaw, includeRounding]);

  const parsedAsOf = useMemo(() => {
    const d = new Date(asOfDate);
    if (!Number.isFinite(d.getTime())) return stripTime(new Date());
    return stripTime(d);
  }, [asOfDate]);

  const parsedAnchor = useMemo(() => {
    const d = new Date(anchorDate);
    if (!Number.isFinite(d.getTime())) return stripTime(new Date());
    return stripTime(d);
  }, [anchorDate]);

  const dueDay = useMemo(
    () => clampNum(safeParseInt(dueDayMonthly, 1), 1, 31),
    [dueDayMonthly],
  );

  const computedEnd = useMemo(() => {
    if (horizonMode === "end_date") {
      const d = new Date(endDate);
      if (!Number.isFinite(d.getTime())) return addYears(parsedAsOf, 1);
      return stripTime(d);
    }
    const yrs = clampNum(safeParseInt(yearsAhead, 1), 1, 5);
    return stripTime(addYears(parsedAsOf, yrs));
  }, [horizonMode, endDate, yearsAhead, parsedAsOf]);

  const schedule = useMemo(() => {
    return buildScheduleUntilEnd(
      cycle,
      parsedAsOf,
      computedEnd,
      parsedAnchor,
      dueDay,
    );
  }, [cycle, parsedAsOf, computedEnd, parsedAnchor, dueDay]);

  const nextDue = schedule[0] ?? parsedAsOf;

  const monthlyKeys = useMemo(
    () => makeMonthKeysBetween(parsedAsOf, computedEnd),
    [parsedAsOf, computedEnd],
  );

  const paymentsByMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (const k of monthlyKeys) map.set(k, 0);
    for (const d of schedule) {
      const k = ymKey(d);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [schedule, monthlyKeys]);

  const monthRows = useMemo(() => {
    return monthlyKeys.map((k) => {
      const count = paymentsByMonth.get(k) ?? 0;
      const total = count * rentPerPaymentRaw;
      return { key: k, label: monthLabelFromKey(k), payments: count, total };
    });
  }, [monthlyKeys, paymentsByMonth, rentPerPaymentRaw]);

  const paymentsTotal = schedule.length;
  const totalPaidRaw = paymentsTotal * rentPerPaymentRaw;

  const totalPaid = useMemo(() => {
    if (!includeRounding) return totalPaidRaw;
    return Math.round(totalPaidRaw * 100) / 100;
  }, [totalPaidRaw, includeRounding]);

  const yearTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of schedule) {
      const y = yKey(d);
      map.set(y, (map.get(y) ?? 0) + 1);
    }
    const years = Array.from(map.keys()).sort();
    return years.map((y) => {
      const count = map.get(y) ?? 0;
      const total = count * rentPerPaymentRaw;
      return { year: y, payments: count, total };
    });
  }, [schedule, rentPerPaymentRaw]);

  const standardAnnualTotals = useMemo(() => {
    const rows = (
      [
        "monthly",
        "every_4_weeks",
        "biweekly",
        "weekly",
        "annual",
      ] as BillingCycle[]
    ).map((c) => {
      const paymentsPerYear = BILLING_PAYMENTS_PER_YEAR[c];
      return {
        key: c,
        label: BILLING_LABEL[c],
        paymentsPerYear,
        annualTotal: paymentsPerYear * rentPerPaymentRaw,
      };
    });
    return rows;
  }, [rentPerPaymentRaw]);

  const currentCycleStandardAnnual = useMemo(() => {
    const paymentsPerYear = BILLING_PAYMENTS_PER_YEAR[cycle] ?? 0;
    return paymentsPerYear * rentPerPaymentRaw;
  }, [cycle, rentPerPaymentRaw]);

  const relatedLinks = [
    { href: "/rent-paid-weekly-vs-monthly", text: "Weekly vs monthly rent" },
    { href: "/rent-converter", text: "Rent converter hub" },
    {
      href: "/rent-affordability-calculator",
      text: "Rent affordability calculator",
    },
    { href: "/rent-billed-every-28-days", text: "Rent billed every 28 days" },
    { href: "/rent-paid-every-4-weeks", text: "Rent paid every 4 weeks" },
  ];

  const faqData = [
    {
      q: "What does “total paid by end date” mean on this page?",
      a: "It is the number of scheduled due dates from the as-of date through the selected end date, multiplied by the rent amount entered. It illustrates timing and cadence, not lease enforcement.",
    },
    {
      q: "Why can monthly totals vary for weekly, biweekly, or 28-day rent?",
      a: "Those cycles are fixed-day intervals. Some calendar months contain more interval due dates than others, which changes the count of payments that fall inside a given month.",
    },
    {
      q: "How is monthly rent handled when the due day is 29–31?",
      a: "If the selected day does not exist in a month, the schedule estimate places the due date on that month’s last calendar day.",
    },
    {
      q: "What is the anchor date used for?",
      a: "For weekly, biweekly, and 28-day cycles, the anchor date acts as the reference point for the repeating interval so the schedule follows that cadence forward in time.",
    },
    {
      q: "Why does a 4-week (28-day) cycle often show 13 payments per year?",
      a: "A 28-day interval fits into a 365-day year about 13 times. That cadence can shift due dates across the calendar and can create an extra payment compared with 12 monthly payments.",
    },
    {
      q: "Does this adjust due dates for weekends, holidays, or grace periods?",
      a: "No. It uses calendar dates and a simplified cadence to illustrate payment timing. Lease terms and landlord policies can define different rules.",
    },
    {
      q: "Is the “standard annual total” the same as the multi-year schedule total?",
      a: "The standard annual total uses a simple payment count per year for comparison. The multi-year schedule total is a calendar-based rollup from the selected as-of date through the end date.",
    },
  ];

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
      { "@type": "ListItem", position: 2, name: pageName, item: canonicalUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="bg-white text-slate-700 scroll-smooth">
      <section className="max-w-6xl mx-auto px-6 pt-8">
        <nav className="text-sm text-slate-500 mb-4">
          <a href="/" className="hover:underline text-slate-600">
            Home
          </a>{" "}
          / <span className="text-slate-700">{pageName}</span>
        </nav>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Rent Due Dates Can Change Your Monthly Totals
        </h1>
        <p className="text-slate-600 max-w-3xl text-lg">
          This calculator estimates your upcoming rent due dates and summarizes
          how many payments land in each calendar month. It also estimates total
          rent paid by an end date and totals by year, which helps compare
          monthly rent to weekly, biweekly, and 4-week billing cycles.
        </p>
      </section>

      <section id="calculator" className="mx-auto max-w-6xl px-6 pb-6 pt-8">
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Rent due date schedule and totals
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rent per payment
              </label>
              <div className="flex gap-2">
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Currency"
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="AUD">AUD</option>
                  <option value="NZD">NZD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                This amount is treated as the payment amount for the selected
                billing cycle.
              </p>
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Billing cycle
              </label>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value as BillingCycle)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {(
                  [
                    "monthly",
                    "every_4_weeks",
                    "biweekly",
                    "weekly",
                    "annual",
                  ] as BillingCycle[]
                ).map((c) => (
                  <option key={c} value={c}>
                    {BILLING_LABEL[c]}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500">
                Weekly, biweekly, and 28-day cycles are fixed-day intervals.
                Monthly uses calendar months.
              </p>
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                As-of date
              </label>
              <input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                The next due date is the first scheduled due date on or after
                this date.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Schedule horizon
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={horizonMode}
                  onChange={(e) =>
                    setHorizonMode(e.target.value as "years" | "end_date")
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="years">Years ahead</option>
                  <option value="end_date">End date</option>
                </select>

                {horizonMode === "years" ? (
                  <select
                    value={yearsAhead}
                    onChange={(e) => setYearsAhead(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  >
                    {["1", "2", "3", "5"].map((y) => (
                      <option key={y} value={y}>
                        {y} {y === "1" ? "year" : "years"}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Monthly totals are shown for the calendar months that fall
                inside the selected horizon.
              </p>
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {cycle === "monthly" ? "Monthly due day" : "Anchor due date"}
              </label>

              {cycle === "monthly" ? (
                <input
                  inputMode="numeric"
                  value={dueDayMonthly}
                  onChange={(e) => setDueDayMonthly(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  aria-label="Monthly due day"
                />
              ) : (
                <input
                  type="date"
                  value={anchorDate}
                  onChange={(e) => setAnchorDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              )}

              <p className="mt-2 text-xs text-slate-500">
                {cycle === "monthly"
                  ? "If the selected day does not exist in a month, the estimate uses that month’s last day."
                  : "The anchor date is the reference point for weekly, biweekly, and 28-day repeats."}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-[#f7fbff] p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Next estimated due date
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {formatDate(nextDue)}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Payments in horizon
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {paymentsTotal}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="text-xs text-slate-500">
                  Total rent paid by end date
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(totalPaid, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {paymentsTotal} payments × {money(rentPerPayment, currency)}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200">
                <div className="text-sm font-semibold text-slate-800">
                  Upcoming due dates
                </div>
                <div className="text-xs text-slate-500">
                  Dates shown are estimates based on the selected cadence and
                  horizon.
                </div>
              </div>
              <ul className="divide-y divide-slate-200 max-h-[360px] overflow-auto">
                {schedule.length === 0 ? (
                  <li className="px-4 py-3 text-sm text-slate-600">
                    No due dates in the selected range.
                  </li>
                ) : (
                  schedule.map((d, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="text-sm text-slate-700">
                        Payment {idx + 1}
                      </div>
                      <div className="text-sm font-semibold text-slate-800">
                        {formatDate(d)}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Monthly totals
            </h3>
            <p className="text-slate-700 mb-4">
              This table groups the scheduled due dates into calendar months.
              Fixed-day cycles can produce months with different payment counts.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Month</th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Payments in month
                    </th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Total paid in month
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {monthRows.map((r) => {
                    const total = includeRounding
                      ? Math.round(r.total * 100) / 100
                      : r.total;
                    return (
                      <tr key={r.key}>
                        <td className="px-4 py-3 text-slate-700">{r.label}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                          {r.payments}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                          {money(total, currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Totals by calendar year
            </h3>
            <p className="text-slate-700 mb-4">
              This view shows how many payments fall inside each calendar year
              within the selected horizon.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Year</th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Payments
                    </th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {yearTotals.length === 0 ? (
                    <tr>
                      <td className="px-4 py-3 text-slate-600" colSpan={3}>
                        No payments in the selected range.
                      </td>
                    </tr>
                  ) : (
                    yearTotals.map((r) => {
                      const total = includeRounding
                        ? Math.round(r.total * 100) / 100
                        : r.total;
                      return (
                        <tr key={r.year}>
                          <td className="px-4 py-3 text-slate-700">{r.year}</td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-800">
                            {r.payments}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-800">
                            {money(total, currency)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Annual payment count table
            </h3>
            <p className="text-slate-700 mb-4">
              These standard counts help compare billing cycles. The schedule
              totals above are calendar-based within the selected horizon.
            </p>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">
                      Billing cycle
                    </th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Payments per year
                    </th>
                    <th className="text-right px-4 py-3 font-semibold">
                      Standard annual total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {standardAnnualTotals.map((r) => {
                    const annualTotal = includeRounding
                      ? Math.round(r.annualTotal * 100) / 100
                      : r.annualTotal;
                    return (
                      <tr key={r.key}>
                        <td className="px-4 py-3 text-slate-700">{r.label}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                          {r.paymentsPerYear}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                          {money(annualTotal, currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Visual comparison (numbers only)
            </h3>
            <p className="text-slate-700 mb-4">
              For the entered rent per payment, this shows the standard annual
              total implied by each cycle.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {standardAnnualTotals.map((r) => {
                const annualTotal = includeRounding
                  ? Math.round(r.annualTotal * 100) / 100
                  : r.annualTotal;
                return (
                  <div
                    key={r.key}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="text-xs text-slate-500">{r.label}</div>
                    <div className="mt-1 text-lg font-bold text-slate-800">
                      {money(annualTotal, currency)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {r.paymentsPerYear} payments/year ×{" "}
                      {money(rentPerPayment, currency)}
                    </div>
                  </div>
                );
              })}
              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">
                  Selected cycle (standard annual total)
                </div>
                <div className="mt-1 text-lg font-bold text-slate-800">
                  {money(
                    includeRounding
                      ? Math.round(currentCycleStandardAnnual * 100) / 100
                      : currentCycleStandardAnnual,
                    currency,
                  )}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Uses standard payment counts for comparison. Calendar-based
                  totals can differ over partial years.
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Who this affects most
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">
                  Rent billed every 4 weeks
                </h4>
                <p className="mt-2 text-slate-700 text-sm">
                  A 28-day cadence shifts across the calendar, which can create
                  months with different payment counts. A monthly totals view
                  helps illustrate that variation.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">
                  Weekly or biweekly rent
                </h4>
                <p className="mt-2 text-slate-700 text-sm">
                  Fixed-day intervals do not align with calendar months.
                  Grouping payments by month helps compare timing differences to
                  monthly rent.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-slate-900">
                  Monthly due days near month end
                </h4>
                <p className="mt-2 text-slate-700 text-sm">
                  Some months do not include the 29th, 30th, or 31st. The
                  schedule estimate places those due dates on the last day of
                  shorter months.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="text-2xl font-semibold mb-4 text-slate-900">
              Related pages
            </h3>
            <ul className="list-disc ml-6 text-slate-700">
              {relatedLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sky-700 hover:underline">
                    {l.text}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Disclaimer
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Disclaimer:</strong>
              <br />
              Tools on this site are provided for informational, budgeting, and
              comparison purposes only. Calculations are based on standard
              time-period assumptions (including a 365-day year and average
              month length) and simplified models. Results are estimates, not
              guarantees.
              <br />
              <br />
              This website does not provide financial, legal, or tax advice.
              Rental costs, affordability, payment schedules, and obligations
              vary by location, landlord, lease terms, and individual
              circumstances. Always review your lease agreement and consult
              qualified professionals before making financial decisions.
            </p>
          </section>

          <p className="mt-6 text-sm text-slate-500">
            Assumptions: 1 year = 365 days. Weekly uses 7-day intervals,
            biweekly uses 14-day intervals, and every 4 weeks uses 28-day
            intervals. Monthly schedules are estimated using calendar months,
            with shorter months using the last day when a selected due day does
            not exist. Actual due dates, grace periods, and lease terms vary.
          </p>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto py-16 px-6">
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

      <section className="max-w-6xl mx-auto px-6 pb-8">
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
