import { InfoPage } from "~/client/components/generated/GeneratedPages";
import { infoPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = infoPageConfigs["/is-rent-due-on-the-first"];

export const meta = () => buildMeta(config);

export default function IsRentDueOnTheFirstPage() {
  return <InfoPage config={config} />;
}
