import { ConversionCalculatorPage } from "~/client/components/generated/GeneratedPages";
import { conversionPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = conversionPageConfigs["/fortnightly-to-monthly-rent-australia"];

export const meta = () => buildMeta(config);

export default function FortnightlyToMonthlyRentAustraliaPage() {
  return <ConversionCalculatorPage config={config} />;
}
