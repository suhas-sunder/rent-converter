import { ConversionCalculatorPage } from "~/client/components/generated/GeneratedPages";
import { conversionPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = conversionPageConfigs["/pw-rent-calculator"];

export const meta = () => buildMeta(config);

export default function PwRentCalculatorPage() {
  return <ConversionCalculatorPage config={config} />;
}
