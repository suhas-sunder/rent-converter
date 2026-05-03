import { DateToolPage } from "~/client/components/generated/GeneratedPages";
import { dateToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = dateToolConfigs["/12-month-lease-date-calculator"];

export const meta = () => buildMeta(config);

export default function Route12MonthLeaseDateCalculatorPage() {
  return <DateToolPage config={config} />;
}
