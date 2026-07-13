import type { Route } from "./+types/pw-rent-calculator";
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: Route.LoaderArgs) {
  return permanentRedirectPreservingQuery(request, "/pcm-to-pw-calculator");
}

export default function PwRentCalculatorRedirect() {
  return null;
}
