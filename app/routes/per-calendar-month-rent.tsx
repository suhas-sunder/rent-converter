import { InfoPage } from "~/client/components/generated/GeneratedPages";
import { infoPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = infoPageConfigs["/per-calendar-month-rent"];

export const meta = () => buildMeta(config);

export default function PerCalendarMonthRentPage() {
  return <InfoPage config={config} />;
}
