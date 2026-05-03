import { SalaryAnswerPage } from "~/client/components/generated/GeneratedPages";
import { salaryAnswerConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = salaryAnswerConfigs["/how-much-rent-can-i-afford-on-100k"];

export const meta = () => buildMeta(config);

export default function HowMuchRentCanIAffordOn100kPage() {
  return <SalaryAnswerPage config={config} />;
}
