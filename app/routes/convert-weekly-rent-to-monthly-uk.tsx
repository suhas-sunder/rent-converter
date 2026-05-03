import { ConversionCalculatorPage } from "~/client/components/generated/GeneratedPages";
import { conversionPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = conversionPageConfigs["/convert-weekly-rent-to-monthly-uk"];

export const meta = () => buildMeta(config);

export default function ConvertWeeklyRentToMonthlyUkPage() {
  return <ConversionCalculatorPage config={config} />;
}
