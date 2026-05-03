import { ConversionCalculatorPage } from "~/client/components/generated/GeneratedPages";
import { conversionPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = conversionPageConfigs["/weekly-to-monthly-rent-formula-uk"];

export const meta = () => buildMeta(config);

export default function WeeklyToMonthlyRentFormulaUkPage() {
  return <ConversionCalculatorPage config={config} />;
}
