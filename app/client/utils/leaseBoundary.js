import { compareCalendarDates, daysInMonth, differenceInCalendarDays, formatCalendarDate, parseCalendarDate } from "./calendarDate.js";

/**
 * Compare an explicitly supplied last occupied day with a calculated end.
 * Both occupied endpoints count. Proration is only the final calendar month,
 * using its actual day count, not an assertion about a lease's billing rules.
 * @param {{ start: string, calculatedEnd: string, lastDay: string, monthlyRentCents: bigint }} input
 */
export function checkLeaseBoundary(input) {
  const start = parseCalendarDate(input.start, "Lease start");
  const calculated = parseCalendarDate(input.calculatedEnd, "Calculated end");
  const last = parseCalendarDate(input.lastDay, "Last occupied day");
  if (!start.ok) return { ok: false, error: start.error };
  if (!calculated.ok) return { ok: false, error: calculated.error };
  if (!last.ok) return { ok: false, error: last.error };
  if (compareCalendarDates(last.date, start.date) < 0) return { ok: false, error: "The last occupied day cannot be before the lease start." };
  if (typeof input.monthlyRentCents !== "bigint" || input.monthlyRentCents < 0n) return { ok: false, error: "Enter a non-negative monthly rent." };
  const firstOfLastMonth = { ...last.date, day: 1 };
  const chargedStart = compareCalendarDates(start.date, firstOfLastMonth) > 0 ? start.date : firstOfLastMonth;
  const chargedDays = differenceInCalendarDays(chargedStart, last.date) + 1;
  const monthDays = daysInMonth(last.date.year, last.date.month);
  const numerator = input.monthlyRentCents * BigInt(chargedDays);
  const denominator = BigInt(monthDays);
  return {
    ok: true,
    occupiedDays: differenceInCalendarDays(start.date, last.date) + 1,
    differenceDays: differenceInCalendarDays(calculated.date, last.date),
    chargedStart: formatCalendarDate(chargedStart),
    chargedEnd: formatCalendarDate(last.date),
    chargedDays,
    monthDays,
    finalMonthCents: (numerator * 2n + denominator) / (denominator * 2n),
  };
}
