import { SalaryAnswerPage } from "~/client/components/generated/GeneratedPages";
import { salaryAnswerConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = salaryAnswerConfigs["/how-much-rent-can-i-afford-on-70k"];

export const meta = () => buildMeta(config);

export default function HowMuchRentCanIAffordOn70kPage() {
  return <SalaryAnswerPage config={config} />;
}
