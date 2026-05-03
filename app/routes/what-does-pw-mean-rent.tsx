import { InfoPage } from "~/client/components/generated/GeneratedPages";
import { infoPageConfigs } from "~/client/data/generatedRouteConfigs";
import { buildMeta } from "~/client/utils/seo";

const config = infoPageConfigs["/what-does-pw-mean-rent"];

export const meta = () => buildMeta(config);

export default function WhatDoesPwMeanRentPage() {
  return <InfoPage config={config} />;
}
