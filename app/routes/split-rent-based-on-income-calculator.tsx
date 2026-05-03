import { SplitToolPage } from "~/client/components/generated/GeneratedPages";
import { splitToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = splitToolConfigs["/split-rent-based-on-income-calculator"];

export const meta = () => buildMeta(config);

export default function SplitRentBasedOnIncomeCalculatorPage() {
  return <SplitToolPage config={config} />;
}
