import { InfoPage } from "~/client/components/generated/GeneratedPages";
import { infoPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = infoPageConfigs["/pcm-vs-pw-rent"];

export const meta = () => buildMeta(config);

export default function PcmVsPwRentPage() {
  return <InfoPage config={config} />;
}
