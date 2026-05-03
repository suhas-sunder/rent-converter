import { IncomeToolPage } from "~/client/components/generated/GeneratedPages";
import { incomeToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = incomeToolConfigs["/30-percent-rent-rule-calculator"];

export const meta = () => buildMeta(config);

export default function Route30PercentRentRuleCalculatorPage() {
  return <IncomeToolPage config={config} />;
}
