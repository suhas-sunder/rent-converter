import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";
import {
  createAnalyticsController,
  readAnalyticsConsent,
  writeAnalyticsConsent,
} from "~/client/utils/analyticsConsent.js";

type AnalyticsChoice = "accepted" | "rejected" | null;

const analyticsController = createAnalyticsController(
  async () => import("posthog-js"),
  {
    token: "phc_2lrYCRtF5n8ZsXwU5jqGy7642SOu7aXFwV72mQ2VMTa",
    config: {
      api_host: "https://us.i.posthog.com",
      defaults: "2025-11-30",
      autocapture: false,
      capture_pageview: "history_change",
      capture_pageleave: false,
      request_batching: false,
      capture_exceptions: false,
      capture_performance: false,
      disable_session_recording: true,
      disable_surveys: true,
      disable_web_experiments: true,
      disable_product_tours: true,
      disable_external_dependency_loading: true,
      advanced_disable_flags: true,
      person_profiles: "never",
      persistence: "localStorage",
      cross_subdomain_cookie: false,
      cookie_persisted_properties: [],
      opt_out_capturing_persistence_type: "localStorage",
      opt_out_persistence_by_default: true,
      respect_dnt: true,
    },
  },
);

type AnalyticsConsentContextValue = {
  choice: AnalyticsChoice;
  hydrated: boolean;
  isOpen: boolean;
  showDetails: boolean;
  storageMessage: string;
  acceptAnalytics: () => void;
  rejectAnalytics: () => void;
  openPreferences: () => void;
  toggleDetails: () => void;
};

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue>({
  choice: null,
  hydrated: false,
  isOpen: false,
  showDetails: false,
  storageMessage: "",
  acceptAnalytics: () => undefined,
  rejectAnalytics: () => undefined,
  openPreferences: () => undefined,
  toggleDetails: () => undefined,
});

export function useAnalyticsConsent() {
  return useContext(AnalyticsConsentContext);
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  const [choice, setChoice] = useState<AnalyticsChoice>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");

  useEffect(() => {
    const savedChoice = readAnalyticsConsent();
    setChoice(savedChoice);
    setIsOpen(savedChoice === null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (choice === "accepted") {
      void analyticsController.enable();
    } else {
      analyticsController.disable();
    }
  }, [choice, hydrated]);

  const acceptAnalytics = useCallback(() => {
    if (!writeAnalyticsConsent("accepted")) {
      analyticsController.disable();
      setStorageMessage(
        "Analytics remains off because this browser could not save your preference.",
      );
      setChoice(null);
      setIsOpen(true);
      return;
    }

    setStorageMessage("");
    setChoice("accepted");
    setIsOpen(false);
  }, []);

  const rejectAnalytics = useCallback(() => {
    const saved = writeAnalyticsConsent("rejected");
    analyticsController.disable();
    setChoice("rejected");
    setStorageMessage(
      saved
        ? ""
        : "Analytics is off for this visit, but this browser could not save the preference.",
    );
    setIsOpen(false);
  }, []);

  const openPreferences = useCallback(() => {
    setStorageMessage("");
    setShowDetails(true);
    setIsOpen(true);
  }, []);

  const toggleDetails = useCallback(() => {
    setShowDetails((current) => !current);
  }, []);

  const value = useMemo(
    () => ({
      choice,
      hydrated,
      isOpen,
      showDetails,
      storageMessage,
      acceptAnalytics,
      rejectAnalytics,
      openPreferences,
      toggleDetails,
    }),
    [
      choice,
      hydrated,
      isOpen,
      showDetails,
      storageMessage,
      acceptAnalytics,
      rejectAnalytics,
      openPreferences,
      toggleDetails,
    ],
  );

  return (
    <AnalyticsConsentContext.Provider value={value}>
      {children}
    </AnalyticsConsentContext.Provider>
  );
}

export function AnalyticsConsentPanel() {
  const {
    choice,
    hydrated,
    isOpen,
    showDetails,
    storageMessage,
    acceptAnalytics,
    rejectAnalytics,
    toggleDetails,
  } = useAnalyticsConsent();

  if (!hydrated || !isOpen) return null;

  const status =
    choice === "accepted"
      ? "Analytics is currently accepted."
      : choice === "rejected"
        ? "Optional analytics is currently rejected."
        : "No analytics preference has been saved. Analytics is off.";

  return (
    <section
      role="region"
      aria-labelledby="analytics-preferences-title"
      className="bg-sky-950 px-4 py-5 text-white print:hidden"
      data-nosnippet
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <h2
              id="analytics-preferences-title"
              className="text-xl font-bold text-sky-100"
            >
              Analytics preferences
            </h2>
            <p className="mt-2 text-sm leading-6 text-sky-50">
              Optional PostHog analytics helps measure page traffic. It stays off
              unless you accept, and rejecting it does not affect any calculator.
            </p>
            <p className="sr-only" aria-live="polite">
              {status}
            </p>
            {storageMessage ? (
              <p className="mt-2 text-sm font-semibold text-amber-200" role="status">
                {storageMessage}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
            <button
              type="button"
              onClick={acceptAnalytics}
              className="cursor-pointer rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-sky-950 transition hover:bg-sky-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-950"
            >
              Accept analytics
            </button>
            <button
              type="button"
              onClick={rejectAnalytics}
              className="cursor-pointer rounded-xl border border-sky-200 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-950"
            >
              Reject optional analytics
            </button>
            <button
              type="button"
              onClick={toggleDetails}
              aria-expanded={showDetails}
              aria-controls="analytics-preference-details"
              className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold text-sky-100 underline underline-offset-4 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-sky-950"
            >
              {showDetails ? "Hide details" : "Manage preferences"}
            </button>
          </div>
        </div>

        {showDetails ? (
          <div
            id="analytics-preference-details"
            className="mt-5 rounded-2xl border border-sky-800 bg-sky-900/70 p-4 text-sm leading-6 text-sky-50"
          >
            <p>{status}</p>
            <p className="mt-2">
              Calculator values use separate browser storage. Changing analytics
              preferences does not delete saved calculator values. Read the{" "}
              <Link
                to="/cookies"
                className="cursor-pointer rounded font-semibold text-white underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                cookie and storage page
              </Link>{" "}
              or the{" "}
              <Link
                to="/privacy-policy"
                className="cursor-pointer rounded font-semibold text-white underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                privacy policy
              </Link>
              .
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
