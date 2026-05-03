import { ConversionCalculatorPage } from "~/client/components/generated/GeneratedPages";
import { conversionPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = conversionPageConfigs["/weekly-to-fortnightly-rent-australia"];

export const meta = () => buildMeta(config);

export default function WeeklyToFortnightlyRentAustraliaPage() {
  return <ConversionCalculatorPage config={config} />;
}
