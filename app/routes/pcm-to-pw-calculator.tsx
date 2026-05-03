import { ConversionCalculatorPage } from "~/client/components/generated/GeneratedPages";
import { conversionPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = conversionPageConfigs["/pcm-to-pw-calculator"];

export const meta = () => buildMeta(config);

export default function PcmToPwCalculatorPage() {
  return <ConversionCalculatorPage config={config} />;
}
