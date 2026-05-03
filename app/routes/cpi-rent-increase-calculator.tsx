import { IncreaseToolPage } from "~/client/components/generated/GeneratedPages";
import { increaseToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = increaseToolConfigs["/cpi-rent-increase-calculator"];

export const meta = () => buildMeta(config);

export default function CpiRentIncreaseCalculatorPage() {
  return <IncreaseToolPage config={config} />;
}
