import { IncreaseToolPage } from "~/client/components/generated/GeneratedPages";
import { increaseToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = increaseToolConfigs["/rent-increase-formula"];

export const meta = () => buildMeta(config);

export default function RentIncreaseFormulaPage() {
  return <IncreaseToolPage config={config} />;
}
