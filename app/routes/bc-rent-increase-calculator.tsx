import { IncreaseToolPage } from "~/client/components/generated/GeneratedPages";
import { increaseToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = increaseToolConfigs["/bc-rent-increase-calculator"];

export const meta = () => buildMeta(config);

export default function BcRentIncreaseCalculatorPage() {
  return <IncreaseToolPage config={config} />;
}
