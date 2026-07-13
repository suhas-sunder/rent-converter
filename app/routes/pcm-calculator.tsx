import type { Route } from "./+types/pcm-calculator";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/pw-to-pcm-calculator");
}

export default function PcmCalculatorRedirect() {
  return null;
}
