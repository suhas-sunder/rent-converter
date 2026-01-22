// app/routes/rent-converter.tsx
import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "react-router";

export const loader: LoaderFunction = async () => {
  // Permanent redirect to the canonical hub (home page)
  throw redirect("/", { status: 301 });
};

// Keep a component export so the module shape stays consistent.
// It will never render because the loader always redirects.
export default function RentConverterRedirect() {
  return null;
}
