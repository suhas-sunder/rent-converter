import { useEffect, useState } from "react";
import { buildRentCalendar } from "~/client/utils/rentCalendarExport.js";
import type { RentCalendarInput } from "~/client/utils/rentCalendarExport.js";

export default function RentScheduleExport({ schedule }: { schedule: RentCalendarInput | null }) {
  const [hydrated, setHydrated] = useState(false);
  const [feedback, setFeedback] = useState<{ signature: string; message: string } | null>(null);
  useEffect(() => { setHydrated(true); }, []);
  const signature = schedule ? [schedule.leaseStart, schedule.leaseEnd, schedule.frequency, schedule.currency, String(schedule.rentCents), ...schedule.paymentDates, ...(schedule.dueDates ?? [])].join("|") : "";

  function download() {
    if (!schedule) return;
    const result = buildRentCalendar(schedule);
    if (!result.ok) {
      setFeedback({ signature, message: result.error });
      return;
    }
    let url: string | undefined;
    try {
      const blob = new Blob([result.contents], { type: "text/calendar;charset=utf-8" });
      url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setFeedback({ signature, message: `Calendar file prepared with ${result.eventCount} payment${result.eventCount === 1 ? "" : "s"}. Open the downloaded .ics file in your calendar app to review and import it.` });
    } catch {
      setFeedback({ signature, message: "This browser could not prepare the calendar download. Try another browser, or print the schedule instead." });
    } finally {
      if (url) {
        const downloadUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 10_000);
      }
    }
  }

  return (
    <div className="rc-no-print mt-4 rounded-2xl bg-slate-50 p-4" data-nosnippet>
      <button type="button" onClick={download} disabled={!hydrated || !schedule} aria-describedby="rent-calendar-export-help" className="cursor-pointer rounded-xl bg-sky-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600">
        Download calendar (.ics)
      </button>
      <p id="rent-calendar-export-help" className="mt-2 text-sm text-slate-700">{schedule?.dueDates ? "Download the displayed planned due dates as all-day events titled ‘Rent due (entered schedule)’. These repeat from your agreement anchor and require checking against your actual payment terms." : "Download the displayed payment-period starts as all-day events. These are calculated period starts, not confirmed contractual payment deadlines."} The file is created in your browser; nothing is sent to a calendar service. Import it yourself and check the dates against your lease. No reminders or payment instructions are added.</p>
      <p className="mt-2 text-xs text-slate-700">This is a one-time file, not a synced calendar. Importing again after changing the schedule may create duplicates; remove the old imported events before replacing them.</p>
      <noscript><p className="mt-2 text-sm text-slate-700">Enable JavaScript to generate and download the payment schedule.</p></noscript>
      {feedback?.signature === signature && <p role="status" className="mt-2 text-sm font-semibold text-sky-900">{feedback.message}</p>}
    </div>
  );
}
