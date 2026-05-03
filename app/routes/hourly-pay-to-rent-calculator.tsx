import { IncomeToolPage } from "~/client/components/generated/GeneratedPages";
import { incomeToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = incomeToolConfigs["/hourly-pay-to-rent-calculator"];

export const meta = () => buildMeta(config);

export default function HourlyPayToRentCalculatorPage() {
  return <IncomeToolPage config={config} />;
}
