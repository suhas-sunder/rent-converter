import { IncomeToolPage } from "~/client/components/generated/GeneratedPages";
import { incomeToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";
import HousingBudget from "~/client/components/HousingBudget";
import MoveInWorksheet from "~/client/components/MoveInWorksheet";

const config = incomeToolConfigs["/rent-budget-calculator"];

export const meta = () => buildMeta(config);

export default function RentBudgetCalculatorPage() {
  return <IncomeToolPage config={config} afterTool={<><HousingBudget /><MoveInWorksheet /></>} />;
}
