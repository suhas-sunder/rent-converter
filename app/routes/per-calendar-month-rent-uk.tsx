import { InfoPage } from "~/client/components/generated/GeneratedPages";
import { infoPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = infoPageConfigs["/per-calendar-month-rent-uk"];

export const meta = () => buildMeta(config);

export default function PerCalendarMonthRentUkPage() {
  return <InfoPage config={config} />;
}
