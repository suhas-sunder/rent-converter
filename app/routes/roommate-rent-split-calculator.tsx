import { SplitToolPage } from "~/client/components/generated/GeneratedPages";
import { splitToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = splitToolConfigs["/roommate-rent-split-calculator"];

export const meta = () => buildMeta(config);

export default function RoommateRentSplitCalculatorPage() {
  return <SplitToolPage config={config} />;
}
