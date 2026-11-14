import { addCalendarDays, addCalendarMonths, formatCalendarDate, parseCalendarDate } from "./calendarDate.js";

/**
 * Generate one due-date projection per existing payment period. An agreement
 * anchor is supplied by the user; dates are never inferred from period starts.
 * @param {{ firstDueDate: string, count: number, frequency: "monthly" | "weekly" | "fortnightly" | "every-4-weeks" }} input
 */
export function projectContractualDates(input) {
  const anchor = parseCalendarDate(input.firstDueDate, "First due date from your agreement");
  if (!anchor.ok) return { ok: false, error: anchor.error };
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 5000) return { ok: false, error: "Generate a valid payment-period schedule first." };
  if (!["monthly", "weekly", "fortnightly", "every-4-weeks"].includes(input.frequency)) return { ok: false, error: "Choose a supported payment frequency." };
  const step = input.frequency === "weekly" ? 7 : input.frequency === "fortnightly" ? 14 : 28;
  const dates = Array.from({ length: input.count }, (_, index) => formatCalendarDate(input.frequency === "monthly"
    ? addCalendarMonths(anchor.date, index, anchor.date.day).date
    : addCalendarDays(anchor.date, index * step)));
  if (dates.some(date => !parseCalendarDate(date).ok || date === "9999-12-31")) return { ok: false, error: "Choose dates no later than 9999-12-30 so each all-day calendar event can end on the following day." };
  return { ok: true, dates };
}
