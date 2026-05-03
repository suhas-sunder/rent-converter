import { SplitToolPage } from "~/client/components/generated/GeneratedPages";
import { splitToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = splitToolConfigs["/rent-split-percentage-calculator"];

export const meta = () => buildMeta(config);

export default function RentSplitPercentageCalculatorPage() {
  return <SplitToolPage config={config} />;
}
