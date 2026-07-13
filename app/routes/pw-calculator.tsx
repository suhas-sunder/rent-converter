import type { Route } from "./+types/pw-calculator";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/pcm-to-pw-calculator");
}

export default function PwCalculatorRedirect() {
  return null;
}
