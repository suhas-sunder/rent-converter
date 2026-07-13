import type { Route } from "./+types/rent-pcm-calculator";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/pw-to-pcm-calculator");
}

export default function RentPcmCalculatorRedirect() {
  return null;
}
