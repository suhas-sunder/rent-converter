import { ConversionCalculatorPage } from "~/client/components/generated/GeneratedPages";
import { conversionPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = conversionPageConfigs["/4-weekly-to-monthly-rent-uk"];

export const meta = () => buildMeta(config);

export default function Route4WeeklyToMonthlyRentUkPage() {
  return <ConversionCalculatorPage config={config} />;
}
