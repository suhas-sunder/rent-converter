import { ConversionCalculatorPage } from "~/client/components/generated/GeneratedPages";
import { conversionPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = conversionPageConfigs["/weekly-to-monthly-rent-sydney"];

export const meta = () => buildMeta(config);

export default function WeeklyToMonthlyRentSydneyPage() {
  return <ConversionCalculatorPage config={config} />;
}
