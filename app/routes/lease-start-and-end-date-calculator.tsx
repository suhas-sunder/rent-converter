import { DateToolPage } from "~/client/components/generated/GeneratedPages";
import { dateToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = dateToolConfigs["/lease-start-and-end-date-calculator"];

export const meta = () => buildMeta(config);

export default function LeaseStartAndEndDateCalculatorPage() {
  return <DateToolPage config={config} />;
}
