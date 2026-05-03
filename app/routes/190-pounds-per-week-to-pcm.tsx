import { WeeklyAnswerPage } from "~/client/components/generated/GeneratedPages";
import { weeklyAnswerPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = weeklyAnswerPageConfigs["/190-pounds-per-week-to-pcm"];

export const meta = () => buildMeta(config);

export default function Route190PoundsPerWeekToPcmPage() {
  return <WeeklyAnswerPage config={config} />;
}
