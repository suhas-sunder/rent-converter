// app/routes/rent-converter.tsx
import { permanentRedirectPreservingQuery } from "~/utils/redirects";

export function loader({ request }: { request: Request }) {
  return permanentRedirectPreservingQuery(request, "/");
}

// Keep a component export so the module shape stays consistent.
// It will never render because the loader always redirects.
export default function RentConverterRedirect() {
  return null;
}
