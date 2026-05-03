import { InfoPage } from "~/client/components/generated/GeneratedPages";
import { infoPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = infoPageConfigs["/is-rent-paid-for-the-current-month-or-next-month"];

export const meta = () => buildMeta(config);

export default function IsRentPaidForTheCurrentMonthOrNextMonthPage() {
  return <InfoPage config={config} />;
}
