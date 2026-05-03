import { IncomeToolPage } from "~/client/components/generated/GeneratedPages";
import { incomeToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = incomeToolConfigs["/salary-to-rent-calculator"];

export const meta = () => buildMeta(config);

export default function SalaryToRentCalculatorPage() {
  return <IncomeToolPage config={config} />;
}
