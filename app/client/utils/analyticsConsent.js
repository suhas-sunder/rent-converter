export const ANALYTICS_CONSENT_VERSION = 1;
export const ANALYTICS_CONSENT_STORAGE_KEY = "rc_analytics_consent_v1";

/** @typedef {"accepted" | "rejected"} AnalyticsConsentChoice */

/**
 * @typedef {{
 *   getItem: (key: string) => string | null,
 *   setItem: (key: string, value: string) => void,
 * }} ConsentStorage
 */

/**
 * @typedef {{
 *   init: (token: string, config: Record<string, unknown>) => unknown,
 *   has_opted_out_capturing?: () => boolean,
 *   opt_in_capturing?: (options?: { captureEventName?: string | false }) => void,
 *   opt_out_capturing?: () => void,
 *   reset?: (resetDeviceId?: boolean) => void,
 *   stopSessionRecording?: () => void,
 * }} AnalyticsClient
 */

/** @param {string | null | undefined} raw */
export function parseAnalyticsConsent(raw) {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (
      parsed?.version === ANALYTICS_CONSENT_VERSION &&
      (parsed.analytics === "accepted" || parsed.analytics === "rejected")
    ) {
      return /** @type {AnalyticsConsentChoice} */ (parsed.analytics);
    }
  } catch {
    // Invalid or stale consent is treated as no choice, so analytics stays off.
  }

  return null;
}

/** @returns {ConsentStorage | null} */
function browserStorage() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** @param {ConsentStorage | null | undefined} [storage] */
export function readAnalyticsConsent(storage = browserStorage()) {
  if (!storage) return null;

  try {
    return parseAnalyticsConsent(storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

/**
 * @param {AnalyticsConsentChoice} choice
 * @param {ConsentStorage | null | undefined} [storage]
 */
export function writeAnalyticsConsent(choice, storage = browserStorage()) {
  if (!storage || (choice !== "accepted" && choice !== "rejected")) return false;

  try {
    storage.setItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
      JSON.stringify({ version: ANALYTICS_CONSENT_VERSION, analytics: choice }),
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a small consent-aware analytics lifecycle. The client module is not
 * loaded until enable() is called, and concurrent enable calls share one init.
 *
 * @param {() => Promise<{ default?: AnalyticsClient, posthog?: AnalyticsClient }>} loadClient
 * @param {{ token: string, config: Record<string, unknown> }} options
 */
export function createAnalyticsController(loadClient, options) {
  /** @type {AnalyticsClient | null} */
  let client = null;
  /** @type {Promise<AnalyticsClient | null> | null} */
  let initialization = null;
  let allowed = false;

  const disableClient = (/** @type {AnalyticsClient} */ currentClient) => {
    const optOut = () => {
      try {
        currentClient.opt_out_capturing?.();
      } catch {
        // The application-level consent state still prevents future enable calls.
      }
    };

    // Stop capture first so cleanup cannot create or enqueue another event.
    optOut();
    try {
      currentClient.stopSessionRecording?.();
    } catch {
      // Analytics failures must never affect the application.
    }
    try {
      currentClient.reset?.(true);
    } catch {
      // Continue to the final explicit opt-out even if reset is unavailable.
    }
    // PostHog reset clears its consent state, so restore the opt-out afterward.
    optOut();
  };

  return {
    async enable() {
      allowed = true;

      if (client) {
        try {
          if (client.has_opted_out_capturing?.()) {
            client.opt_in_capturing?.({ captureEventName: false });
          }
        } catch {
          return null;
        }
        return client;
      }

      if (initialization) return initialization;

      initialization = (async () => {
        /** @type {AnalyticsClient | null} */
        let candidate = null;
        try {
          const module = await loadClient();
          if (!allowed) return null;
          candidate = module.default ?? module.posthog ?? null;
          if (!candidate) return null;
          candidate.init(options.token, options.config);
          if (!allowed) {
            disableClient(candidate);
            return null;
          }
          if (candidate.has_opted_out_capturing?.()) {
            candidate.opt_in_capturing?.({ captureEventName: false });
          }
          client = candidate;
          return client;
        } catch {
          if (candidate) disableClient(candidate);
          return null;
        } finally {
          if (!client) initialization = null;
        }
      })();

      return initialization;
    },

    disable() {
      allowed = false;
      if (client) disableClient(client);
    },

    isInitialized() {
      return client !== null;
    },
  };
}
