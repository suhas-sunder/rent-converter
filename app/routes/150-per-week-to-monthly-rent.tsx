import { WeeklyAnswerPage } from "~/client/components/generated/GeneratedPages";
import { weeklyAnswerPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = weeklyAnswerPageConfigs["/150-per-week-to-monthly-rent"];

export const meta = () => buildMeta(config);

export default function Route150PerWeekToMonthlyRentPage() {
  return <WeeklyAnswerPage config={config} />;
}
