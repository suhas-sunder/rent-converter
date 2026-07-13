import type { Route } from "./+types/pcm-rent-calculator";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/pw-to-pcm-calculator");
}

export default function PcmRentCalculatorRedirect() {
  return null;
}
