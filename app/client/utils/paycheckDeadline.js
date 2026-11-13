import {
  addCalendarDays,
  addCalendarMonths,
  compareCalendarDates,
  daysInMonth,
  differenceInCalendarDays,
  formatCalendarDate,
  parseCalendarDate,
} from "./calendarDate.js";

/** @typedef {"weekly" | "biweekly" | "semimonthly" | "monthly"} PayFrequency */
/** @typedef {{ date: string, reserveCents: bigint, balanceCents: bigint }} ReserveRow */
/** @typedef {{ ok: false, error: string } | { ok: true, rows: ReserveRow[], remainingCents: bigint, excessCents: bigint, unfundedCents: bigint }} DeadlineResult */

/**
 * Allocate one actual rent bill across the entered pay schedule, without
 * annual-average payment counts or floating-point money arithmetic.
 * Dates are calendar dates; weekends, bank holidays and deposit delays are
 * deliberately not inferred. A due-day deposit counts only when opted in.
 * @param {{ rentCents: bigint, savedCents: bigint, nextPayday: string, dueDate: string, frequency: PayFrequency, includeDueDay?: boolean, firstPayDay?: number, secondPayDay?: number }} input
 * @returns {DeadlineResult}
 */
export function calculatePaycheckDeadline(input) {
  if (input.rentCents < 0n || input.savedCents < 0n) {
    return { ok: false, error: "Rent due and money already saved cannot be negative." };
  }
  const next = parseCalendarDate(input.nextPayday, "Next payday");
  if (!next.ok) return { ok: false, error: next.error };
  const due = parseCalendarDate(input.dueDate, "Rent due date");
  if (!due.ok) return { ok: false, error: due.error };
  if (!["weekly", "biweekly", "semimonthly", "monthly"].includes(input.frequency)) {
    return { ok: false, error: "Choose a supported pay frequency." };
  }
  if (differenceInCalendarDays(next.date, due.date) > 366) {
    return { ok: false, error: "Choose a rent due date within 366 days of the next payday." };
  }

  const firstDay = input.firstPayDay ?? 1;
  const secondDay = input.secondPayDay ?? 15;
  if (input.frequency === "semimonthly") {
    if (!Number.isInteger(firstDay) || !Number.isInteger(secondDay) || firstDay < 1 || firstDay > 31 || secondDay <= firstDay || secondDay > 31) {
      return { ok: false, error: "Enter two different pay days from 1 to 31, with the earlier day first." };
    }
    const lastDay = daysInMonth(next.date.year, next.date.month);
    if (![Math.min(firstDay, lastDay), Math.min(secondDay, lastDay)].includes(next.date.day)) {
      return { ok: false, error: "Next payday must match one of the two pay days (or the last day of a shorter month)." };
    }
  }

  /** @type {import('./calendarDate.js').CalendarDate[]} */
  const paydays = [];
  /** @param {import('./calendarDate.js').CalendarDate} date */
  const withinDeadline = (date) => compareCalendarDates(date, due.date) < 0 || (input.includeDueDay === true && compareCalendarDates(date, due.date) === 0);

  if (input.frequency === "semimonthly") {
    for (let monthOffset = 0; monthOffset <= 13; monthOffset += 1) {
      const month = addCalendarMonths({ ...next.date, day: 1 }, monthOffset, 1).date;
      if (compareCalendarDates(month, due.date) > 0) break;
      // When both selected days clamp to month-end, the dates coincide. Treat
      // it as one saving opportunity; never promise two distinct deposit days.
      const monthDays = [...new Set([Math.min(firstDay, daysInMonth(month.year, month.month)), Math.min(secondDay, daysInMonth(month.year, month.month))])];
      for (const day of monthDays) {
        const candidate = { ...month, day };
        if (compareCalendarDates(candidate, next.date) >= 0 && withinDeadline(candidate)) paydays.push(candidate);
      }
    }
  } else {
    for (let index = 0; index < 54; index += 1) {
      const candidate = input.frequency === "monthly"
        ? addCalendarMonths(next.date, index, next.date.day).date
        : addCalendarDays(next.date, index * (input.frequency === "weekly" ? 7 : 14));
      if (!withinDeadline(candidate)) break;
      paydays.push(candidate);
    }
  }

  const remainingCents = input.rentCents > input.savedCents ? input.rentCents - input.savedCents : 0n;
  const excessCents = input.savedCents > input.rentCents ? input.savedCents - input.rentCents : 0n;
  const count = BigInt(paydays.length);
  const base = count ? remainingCents / count : 0n;
  const remainder = count ? remainingCents % count : 0n;
  let balanceCents = input.savedCents;
  const rows = paydays.map((date, index) => {
    const reserveCents = base + (BigInt(index) < remainder ? 1n : 0n);
    balanceCents += reserveCents;
    return { date: formatCalendarDate(date), reserveCents, balanceCents };
  });
  return { ok: true, rows, remainingCents, excessCents, unfundedCents: count ? 0n : remainingCents };
}
