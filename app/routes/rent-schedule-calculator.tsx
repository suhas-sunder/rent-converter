import { DateToolPage } from "~/client/components/generated/GeneratedPages";
import { dateToolConfigs } from "~/client/data/generatedRouteConfigs";
import { useLoaderData } from "react-router";
import { currentCalendarDateString } from "~/client/utils/calendarDate.js";
import { buildMeta } from "~/client/utils/seo";

const config = dateToolConfigs["/rent-schedule-calculator"];

export const meta = () => buildMeta(config);

export function loader() {
  return { initialDate: currentCalendarDateString() };
}

export default function RentScheduleCalculatorPage() {
  const { initialDate } = useLoaderData<typeof loader>();
  return <DateToolPage config={config} initialDate={initialDate} />;
}
