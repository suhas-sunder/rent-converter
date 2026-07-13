const MIN_YEAR = 1900;
const MAX_YEAR = 9999;
const DAY_MS = 86_400_000;

/** @typedef {{ year: number, month: number, day: number }} CalendarDate */
/** @typedef {{ ok: true, date: CalendarDate } | { ok: false, kind: "empty" | "format" | "nonexistent" | "range", error: string }} CalendarDateParseResult */
/** @typedef {{ ok: true, value: number } | { ok: false, kind: "empty" | "format" | "range", error: string }} IntegerParseResult */

/** @param {number} year */
export function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/** @param {number} year @param {number} month */
export function daysInMonth(year, month) {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

/** @param {CalendarDate} date */
export function isCalendarDate(date) {
  return Number.isInteger(date.year)
    && Number.isInteger(date.month)
    && Number.isInteger(date.day)
    && date.year >= MIN_YEAR
    && date.year <= MAX_YEAR
    && date.month >= 1
    && date.month <= 12
    && date.day >= 1
    && date.day <= daysInMonth(date.year, date.month);
}

/** @param {string} raw @param {string} [label] @returns {CalendarDateParseResult} */
export function parseCalendarDate(raw, label = "Date") {
  const value = String(raw ?? "").trim();
  if (!value) return { ok: false, kind: "empty", error: `${label} is required.` };
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return { ok: false, kind: "format", error: `Enter ${label.toLowerCase()} in YYYY-MM-DD format.` };
  }
  const date = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  if (date.year < MIN_YEAR || date.year > MAX_YEAR) {
    return { ok: false, kind: "range", error: `${label} must be between ${MIN_YEAR}-01-01 and ${MAX_YEAR}-12-31.` };
  }
  if (date.month < 1 || date.month > 12 || date.day < 1 || date.day > daysInMonth(date.year, date.month)) {
    return { ok: false, kind: "nonexistent", error: `${label} is not a real calendar date.` };
  }
  return { ok: true, date };
}

/** @param {string} raw @param {string} [label] @param {number} [min] @param {number} [max] @returns {IntegerParseResult} */
export function parseWholeNumber(raw, label = "Value", min = 1, max = 120) {
  const value = String(raw ?? "").trim();
  if (!value) return { ok: false, kind: "empty", error: `${label} is required.` };
  if (!/^\d+$/.test(value)) {
    return { ok: false, kind: "format", error: `${label} must be a whole number.` };
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    return { ok: false, kind: "range", error: `${label} must be between ${min} and ${max}.` };
  }
  return { ok: true, value: parsed };
}

/** @param {CalendarDate} date */
export function formatCalendarDate(date) {
  return `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

/** @param {CalendarDate} date @param {string | string[]} [locale] */
export function formatCalendarDateForDisplay(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(date.year, date.month - 1, date.day, 12)));
}

/** @param {CalendarDate} date @param {string | string[]} [locale] */
export function formatCalendarMonthForDisplay(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(date.year, date.month - 1, 1, 12)));
}

/** @param {Date} [now] */
export function currentCalendarDateString(now = new Date()) {
  return formatCalendarDate({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}

/** @param {CalendarDate} left @param {CalendarDate} right */
export function compareCalendarDates(left, right) {
  return left.year - right.year || left.month - right.month || left.day - right.day;
}

/** @param {CalendarDate} date */
function toEpochDay(date) {
  return Math.floor(Date.UTC(date.year, date.month - 1, date.day) / DAY_MS);
}

/** @param {number} epochDay @returns {CalendarDate} */
function fromEpochDay(epochDay) {
  const value = new Date(epochDay * DAY_MS);
  return { year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, day: value.getUTCDate() };
}

/** @param {CalendarDate} date @param {number} days */
export function addCalendarDays(date, days) {
  if (!Number.isInteger(days)) throw new TypeError("Calendar-day increments must be whole numbers.");
  return fromEpochDay(toEpochDay(date) + days);
}

/** @param {CalendarDate} date */
export function subtractCalendarDay(date) {
  return addCalendarDays(date, -1);
}

/** @param {CalendarDate} start @param {CalendarDate} end */
export function differenceInCalendarDays(start, end) {
  return toEpochDay(end) - toEpochDay(start);
}

/** @param {CalendarDate} date @param {number} months @param {number} [anchorDay] */
export function addCalendarMonths(date, months, anchorDay = date.day) {
  if (!Number.isInteger(months)) throw new TypeError("Calendar-month increments must be whole numbers.");
  const totalMonths = date.year * 12 + (date.month - 1) + months;
  const year = Math.floor(totalMonths / 12);
  const month = ((totalMonths % 12) + 12) % 12 + 1;
  const lastDay = daysInMonth(year, month);
  const day = Math.min(anchorDay, lastDay);
  return { date: { year, month, day }, clamped: anchorDay > lastDay };
}

/** @param {CalendarDate} date */
export function calendarWeekday(date) {
  return new Date(Date.UTC(date.year, date.month - 1, date.day, 12)).getUTCDay();
}

/** @param {CalendarDate} start @param {number} months */
export function calculateLeaseEnd(start, months) {
  const target = addCalendarMonths(start, months, start.day);
  return {
    date: target.clamped ? target.date : subtractCalendarDay(target.date),
    clamped: target.clamped,
  };
}

/** @param {CalendarDate} anchor @param {CalendarDate} boundary @param {"monthly" | "weekly" | "fortnightly" | "biweekly" | "every-4-weeks"} frequency */
export function generateRecurrenceDates(anchor, boundary, frequency) {
  /** @type {CalendarDate[]} */
  const dates = [];
  const interval = frequency === "weekly" ? 7 : frequency === "fortnightly" || frequency === "biweekly" ? 14 : frequency === "every-4-weeks" ? 28 : 0;
  for (let index = 0; index < 5000; index += 1) {
    const candidate = frequency === "monthly"
      ? addCalendarMonths(anchor, index, anchor.day).date
      : addCalendarDays(anchor, index * interval);
    if (compareCalendarDates(candidate, boundary) >= 0) break;
    dates.push(candidate);
  }
  return dates;
}

/** @param {CalendarDate} start @param {number} months @param {"monthly" | "weekly" | "fortnightly" | "biweekly" | "every-4-weeks"} frequency */
export function generateLeasePaymentSchedule(start, months, frequency) {
  const leaseEnd = calculateLeaseEnd(start, months);
  return {
    leaseEnd,
    payments: generateRecurrenceDates(start, leaseEnd.date, frequency),
  };
}

/** @param {CalendarDate} asOf @param {number} dueDay */
export function nextMonthlyDueDate(asOf, dueDay) {
  for (let offset = 0; offset < 2; offset += 1) {
    const month = addCalendarMonths({ ...asOf, day: 1 }, offset, 1).date;
    const candidate = { ...month, day: Math.min(dueDay, daysInMonth(month.year, month.month)) };
    if (compareCalendarDates(candidate, asOf) >= 0) return candidate;
  }
  throw new Error("Unable to calculate the next monthly due date.");
}

/**
 * @param {{ cycle: "monthly" | "weekly" | "biweekly" | "every_4_weeks" | "annual", asOf: CalendarDate, boundary: CalendarDate, anchor?: CalendarDate, dueDay?: number }} input
 */
export function generateRentDueDates(input) {
  const { cycle, asOf, boundary } = input;
  /** @type {CalendarDate[]} */
  const dates = [];
  if (compareCalendarDates(boundary, asOf) <= 0) return dates;

  if (cycle === "monthly") {
    const dueDay = input.dueDay ?? 1;
    let candidate = nextMonthlyDueDate(asOf, dueDay);
    for (let index = 0; index < 2000 && compareCalendarDates(candidate, boundary) < 0; index += 1) {
      dates.push(candidate);
      const nextMonth = addCalendarMonths({ ...candidate, day: 1 }, 1, 1).date;
      candidate = { ...nextMonth, day: Math.min(dueDay, daysInMonth(nextMonth.year, nextMonth.month)) };
    }
    return dates;
  }

  const anchor = input.anchor ?? asOf;
  if (cycle === "annual") {
    let yearOffset = Math.max(0, asOf.year - anchor.year);
    let candidate = addCalendarMonths(anchor, yearOffset * 12, anchor.day).date;
    while (compareCalendarDates(candidate, asOf) < 0) {
      yearOffset += 1;
      candidate = addCalendarMonths(anchor, yearOffset * 12, anchor.day).date;
    }
    for (let index = yearOffset; index < yearOffset + 1000 && compareCalendarDates(candidate, boundary) < 0; index += 1) {
      dates.push(candidate);
      candidate = addCalendarMonths(anchor, (index + 1) * 12, anchor.day).date;
    }
    return dates;
  }

  const interval = cycle === "weekly" ? 7 : cycle === "biweekly" ? 14 : 28;
  const elapsed = differenceInCalendarDays(anchor, asOf);
  const steps = elapsed <= 0 ? 0 : Math.ceil(elapsed / interval);
  let candidate = addCalendarDays(anchor, steps * interval);
  for (let index = 0; index < 5000 && compareCalendarDates(candidate, boundary) < 0; index += 1) {
    dates.push(candidate);
    candidate = addCalendarDays(candidate, interval);
  }
  return dates;
}

