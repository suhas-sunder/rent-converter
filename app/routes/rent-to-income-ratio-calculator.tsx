import { IncomeToolPage } from "~/client/components/generated/GeneratedPages";
import { incomeToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = incomeToolConfigs["/rent-to-income-ratio-calculator"];

export const meta = () => buildMeta(config);

export default function RentToIncomeRatioCalculatorPage() {
  return <IncomeToolPage config={config} />;
}
