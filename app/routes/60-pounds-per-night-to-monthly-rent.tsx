import { WeeklyAnswerPage } from "~/client/components/generated/GeneratedPages";
import { weeklyAnswerPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = weeklyAnswerPageConfigs["/60-pounds-per-night-to-monthly-rent"];

export const meta = () => buildMeta(config);

export default function Route60PoundsPerNightToMonthlyRentPage() {
  return <WeeklyAnswerPage config={config} />;
}
