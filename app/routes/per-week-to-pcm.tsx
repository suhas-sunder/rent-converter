import { redirect } from "react-router";

export function loader() {
  return redirect("/pw-to-pcm-calculator", { status: 301 });
}

export default function PerWeekToPcmRedirect() {
  return null;
}
