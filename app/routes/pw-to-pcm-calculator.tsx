import { ConversionCalculatorPage } from "~/client/components/generated/GeneratedPages";
import { conversionPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = conversionPageConfigs["/pw-to-pcm-calculator"];

export const meta = () => buildMeta(config);

export default function PwToPcmCalculatorPage() {
  return <ConversionCalculatorPage config={config} />;
}
