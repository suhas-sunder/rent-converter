import { IncreaseToolPage } from "~/client/components/generated/GeneratedPages";
import { increaseToolConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = increaseToolConfigs["/rent-escalation-calculator"];

export const meta = () => buildMeta(config);

export default function RentEscalationCalculatorPage() {
  return <IncreaseToolPage config={config} />;
}
