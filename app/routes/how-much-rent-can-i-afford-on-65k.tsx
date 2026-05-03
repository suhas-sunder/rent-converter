import { SalaryAnswerPage } from "~/client/components/generated/GeneratedPages";
import { salaryAnswerConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = salaryAnswerConfigs["/how-much-rent-can-i-afford-on-65k"];

export const meta = () => buildMeta(config);

export default function HowMuchRentCanIAffordOn65kPage() {
  return <SalaryAnswerPage config={config} />;
}
