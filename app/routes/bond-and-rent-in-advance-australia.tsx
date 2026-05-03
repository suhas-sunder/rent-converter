import { MoveInCostPage } from "~/client/components/generated/GeneratedPages";
import { moveInCostConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = moveInCostConfigs["/bond-and-rent-in-advance-australia"];

export const meta = () => buildMeta(config);

export default function BondAndRentInAdvanceAustraliaPage() {
  return <MoveInCostPage config={config} />;
}
