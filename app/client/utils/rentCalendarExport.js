import { addCalendarDays, formatCalendarDate, parseCalendarDate } from "./calendarDate.js";

/**
 * RFC 5545 TEXT escaping (section 3.3.11). Escaping newlines prevents an
 * entered value from creating another property or calendar component.
 * @param {string} text
 */
export function escapeCalendarText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

/** RFC 5545 section 3.1: 75 UTF-8 octets, folding between code points. @param {string} line */
export function foldCalendarLine(line) {
  const encoder = new TextEncoder();
  let output = "";
  let octets = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (octets + size > 75) {
      output += "\r\n ";
      octets = 1;
    }
    output += character;
    octets += size;
  }
  return output;
}

/** @typedef {{ paymentDates: string[], dueDates?: string[], leaseStart: string, leaseEnd: string, frequency: "monthly" | "weekly" | "fortnightly" | "every-4-weeks", rentCents: bigint, currency: string, generatedAt?: string }} RentCalendarInput */
/** @typedef {{ ok: true, contents: string, filename: string, eventCount: number } | { ok: false, error: string }} RentCalendarResult */

/**
 * Serialize exactly the currently calculated payment dates. No RRULE is used:
 * calendar apps therefore cannot reinterpret month-end or lease boundaries.
 * All-day DATE events do not shift with the importing calendar's time zone.
 * https://www.rfc-editor.org/rfc/rfc5545 (sections 3.1, 3.3.11, 3.6.1).
 * @param {RentCalendarInput} input
 * @returns {RentCalendarResult}
 */
export function buildRentCalendar(input) {
  const start = parseCalendarDate(input.leaseStart, "Lease start");
  const end = parseCalendarDate(input.leaseEnd, "Lease end");
  if (!start.ok || !end.ok || input.leaseStart >= input.leaseEnd) {
    return { ok: false, error: "Enter a valid lease start and end before exporting." };
  }
  if (typeof input.rentCents !== "bigint" || input.rentCents < 0n || !/^[A-Z]{3}$/.test(input.currency)) {
    return { ok: false, error: "Enter a valid rent amount and currency before exporting." };
  }
  if (!["monthly", "weekly", "fortnightly", "every-4-weeks"].includes(input.frequency)) {
    return { ok: false, error: "Choose a supported payment frequency before exporting." };
  }
  if (!Array.isArray(input.paymentDates) || input.paymentDates.length === 0 || input.paymentDates.length > 5000) {
    return { ok: false, error: "Generate a nonempty payment schedule before exporting." };
  }
  if (input.dueDates !== undefined && (!Array.isArray(input.dueDates) || input.dueDates.length !== input.paymentDates.length)) {
    return { ok: false, error: "Provide exactly one planned due date per payment period." };
  }
  const generatedAt = new Date(input.generatedAt ?? new Date().toISOString());
  if (!Number.isFinite(generatedAt.getTime()) || generatedAt.getUTCFullYear() < 1900 || generatedAt.getUTCFullYear() > 9999) {
    return { ok: false, error: "The calendar file could not be dated. Check your device clock." };
  }
  const stamp = generatedAt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const amount = `${input.currency} ${input.rentCents / 100n}.${String(input.rentCents % 100n).padStart(2, "0")}`;
  const frequencyLabel = input.frequency === "every-4-weeks" ? "Every 4 weeks (28 days)" : input.frequency === "fortnightly" ? "Fortnightly / biweekly (14 days)" : input.frequency;
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//RentConverter.com//Rent payment schedule//EN", "CALSCALE:GREGORIAN"];
  let previous = "";
  let previousDue = "";
  for (const [index, value] of input.paymentDates.entries()) {
    const date = parseCalendarDate(value, "Payment date");
    if (!date.ok || value < input.leaseStart || value >= input.leaseEnd || value <= previous) {
      return { ok: false, error: "Payment dates must be ordered, unique, and within the calculated lease period." };
    }
    previous = value;
    const eventDate = input.dueDates?.[index] ?? value;
    const parsedEvent = parseCalendarDate(eventDate, "Planned due date");
    if (!parsedEvent.ok || eventDate <= previousDue || eventDate === "9999-12-31") return { ok: false, error: "Calendar dates must be real, ordered and unique, ending no later than 9999-12-30." };
    previousDue = eventDate;
    const nextDate = formatCalendarDate(addCalendarDays(parsedEvent.date, 1));
    const dateToken = eventDate.replace(/-/g, "");
    const description = [
      `Rent payment: ${amount}.`,
      `Payment frequency: ${frequencyLabel}.`,
      `Lease start: ${input.leaseStart}. Calculated lease end: ${input.leaseEnd}.`,
      input.dueDates
        ? `Period start: ${value}. Planned due date: ${eventDate}. Due dates repeat from the user-entered agreement anchor ${input.dueDates[0]}; they are projections, not independently verified legal deadlines. Period starts exclude dates on or after ${input.leaseEnd}; due dates may fall outside that period.`
        : `This schedule excludes dates on or after ${input.leaseEnd}. Payment dates are period starts, not legal due-date determinations.`,
      "No weekend, holiday, grace-period or partial-payment adjustments. Confirm the dates and amount against your lease.",
      "Exported from RentConverter.com. This file is not a calendar subscription; future changes are not synced.",
    ].join("\n");
    lines.push(
      "BEGIN:VEVENT",
      // Same complete schedule + payment date produces the same UID on a
      // later download. No identity, account or random tracking token needed.
      `UID:rent-${input.dueDates ? `due-${input.dueDates[0]}-` : ""}${input.leaseStart}-${input.leaseEnd}-${input.frequency}-${input.currency}-${input.rentCents}-${dateToken}@rentconverter.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dateToken}`,
      `DTEND;VALUE=DATE:${nextDate.replace(/-/g, "")}`,
      `SUMMARY:${escapeCalendarText(`${input.dueDates ? "Rent due (entered schedule)" : "Rent payment period starts"}: ${amount}`)}`,
      `DESCRIPTION:${escapeCalendarText(description)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return { ok: true, contents: lines.map(foldCalendarLine).join("\r\n") + "\r\n", filename: `rent-${input.dueDates ? "due-dates" : "payments"}-${input.leaseStart}.ics`, eventCount: input.paymentDates.length };
}
