import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/pcm-to-pw-calculator");
}

export default function PcmToPcwRedirect() {
  return null;
}
