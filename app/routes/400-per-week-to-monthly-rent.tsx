import { WeeklyAnswerPage } from "~/client/components/generated/GeneratedPages";
import { weeklyAnswerPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = weeklyAnswerPageConfigs["/400-per-week-to-monthly-rent"];

export const meta = () => buildMeta(config);

export default function Route400PerWeekToMonthlyRentPage() {
  return <WeeklyAnswerPage config={config} />;
}
