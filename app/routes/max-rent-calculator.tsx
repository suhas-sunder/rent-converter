import { IncomeToolPage } from "~/client/components/generated/GeneratedPages";
import { incomeToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = incomeToolConfigs["/max-rent-calculator"];

export const meta = () => buildMeta(config);

export default function MaxRentCalculatorPage() {
  return <IncomeToolPage config={config} />;
}
