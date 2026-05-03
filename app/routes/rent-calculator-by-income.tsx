import { IncomeToolPage } from "~/client/components/generated/GeneratedPages";
import { incomeToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = incomeToolConfigs["/rent-calculator-by-income"];

export const meta = () => buildMeta(config);

export default function RentCalculatorByIncomePage() {
  return <IncomeToolPage config={config} />;
}
