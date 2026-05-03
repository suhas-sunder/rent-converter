import { IncomeToolPage } from "~/client/components/generated/GeneratedPages";
import { incomeToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = incomeToolConfigs["/rent-calculator-by-salary"];

export const meta = () => buildMeta(config);

export default function RentCalculatorBySalaryPage() {
  return <IncomeToolPage config={config} />;
}
