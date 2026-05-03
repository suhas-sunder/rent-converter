import { redirect } from "react-router";

export function loader() {
  return redirect("/pcm-to-pw-calculator", { status: 301 });
}

export default function PcmToPcwRedirect() {
  return null;
}
