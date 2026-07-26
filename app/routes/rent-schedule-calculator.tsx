import { DateToolPage } from "~/client/components/generated/GeneratedPages";
import { dateToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = dateToolConfigs["/rent-schedule-calculator"];

export const meta = () => buildMeta(config);

export default function RentScheduleCalculatorPage() {
  return <DateToolPage config={config} />;
}
