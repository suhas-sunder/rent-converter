import { ProrationToolPage } from "~/client/components/generated/GeneratedPages";
import { prorationToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = prorationToolConfigs["/prorated-rent-calculator-australia"];

export const meta = () => buildMeta(config);

export default function ProratedRentCalculatorAustraliaPage() {
  return <ProrationToolPage config={config} />;
}
