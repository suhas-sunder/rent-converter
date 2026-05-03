import { IncomeToolPage } from "~/client/components/generated/GeneratedPages";
import { incomeToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = incomeToolConfigs["/3x-rent-calculator"];

export const meta = () => buildMeta(config);

export default function Route3xRentCalculatorPage() {
  return <IncomeToolPage config={config} />;
}
