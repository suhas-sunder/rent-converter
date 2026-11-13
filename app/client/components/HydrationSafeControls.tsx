import { useEffect, useState, type ReactNode } from "react";

/** Keep SSR examples readable without allowing edits that cannot recalculate. */
export default function HydrationSafeControls({ children, label }: { children: ReactNode; label: string }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return (
    <fieldset disabled={!hydrated} aria-label={label} className="m-0 min-w-0 border-0 p-0">
      {children}
    </fieldset>
  );
}
