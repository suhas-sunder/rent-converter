import { WeeklyAnswerPage } from "~/client/components/generated/GeneratedPages";
import { weeklyAnswerPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = weeklyAnswerPageConfigs["/350-per-week-to-monthly-rent"];

export const meta = () => buildMeta(config);

export default function Route350PerWeekToMonthlyRentPage() {
  return <WeeklyAnswerPage config={config} />;
}
