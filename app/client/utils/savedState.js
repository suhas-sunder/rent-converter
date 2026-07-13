import { useEffect, useRef, useState } from "react";
import { parseIncomeMoney } from "./generatedIncome.js";
import { parsePercentage, parseStrictScalar, parseWholeNumberInRange } from "./generatedTools.js";

const SAVED_CURRENCIES = ["USD", "CAD", "EUR", "GBP", "AUD", "NZD", "JPY", "CNY", "HKD", "SGD", "INR", "KRW", "CHF", "SEK", "NOK", "DKK", "MXN", "BRL"];

/** @typedef {"not-mounted" | "checking" | "saved-state-applied" | "no-valid-saved-state" | "storage-unavailable"} SavedStateStatus */

export function createSavedStateController() {
  /** @type {SavedStateStatus} */
  let status = "not-mounted";
  let restoreAttempted = false;

  return {
    getStatus: () => status,
    canWrite: () => status === "saved-state-applied" || status === "no-valid-saved-state" || status === "storage-unavailable",
    /** @param {Storage | null | undefined} storage @param {(storage: Storage) => boolean} restore */
    restore(storage, restore) {
      if (restoreAttempted) return { status, applied: status === "saved-state-applied" };
      restoreAttempted = true;
      status = "checking";
      if (!storage) {
        status = "storage-unavailable";
        return { status, applied: false };
      }
      try {
        const applied = Boolean(restore(storage));
        status = applied ? "saved-state-applied" : "no-valid-saved-state";
        return { status, applied };
      } catch {
        status = "storage-unavailable";
        return { status, applied: false };
      }
    },
    /** @param {Storage | null | undefined} storage @param {(storage: Storage) => void} persist */
    write(storage, persist) {
      if (!this.canWrite() || !storage) return false;
      try {
        persist(storage);
        return true;
      } catch {
        return false;
      }
    },
  };
}

/**
 * Hydration-safe saved-state lifecycle. The caller owns route-specific validation
 * and state updates; this hook owns read-once and restore-before-write ordering.
 *
 * @param {{ restore: (storage: Storage) => boolean, persist: (storage: Storage) => void, dependencies: unknown[] }} options
 */
export function useHydrationSafeSavedState(options) {
  const controllerRef = useRef(/** @type {ReturnType<typeof createSavedStateController> | null} */ (null));
  if (controllerRef.current === null) controllerRef.current = createSavedStateController();
  const controller = controllerRef.current;
  const restoreRef = useRef(options.restore);
  const persistRef = useRef(options.persist);
  const restoredRenderPendingRef = useRef(false);
  restoreRef.current = options.restore;
  persistRef.current = options.persist;
  const [status, setStatus] = useState("not-mounted");

  useEffect(() => {
    let storage = null;
    try {
      storage = window.localStorage;
    } catch {
      storage = null;
    }
    const result = controller.restore(storage, restoreRef.current);
    restoredRenderPendingRef.current = result.applied;
    setStatus(result.status);
  }, []);

  useEffect(() => {
    if (!controller.canWrite()) return;
    // When restoration queued state updates, wait for the render carrying those
    // values. Otherwise this mount commit would persist the SSR defaults over
    // the saved values before React applies the restored state.
    if (restoredRenderPendingRef.current) {
      restoredRenderPendingRef.current = false;
      return;
    }
    let storage = null;
    try {
      storage = window.localStorage;
    } catch {
      storage = null;
    }
    controller.write(storage, persistRef.current);
  }, [status, ...options.dependencies]);

  return {
    status,
    restorationComplete: status === "saved-state-applied" || status === "no-valid-saved-state" || status === "storage-unavailable",
    savedStateApplied: status === "saved-state-applied",
  };
}

/**
 * @param {string | null} raw
 * @param {string | { allowZero?: boolean }} [labelOrOptions]
 * @param {{ allowZero?: boolean }} [legacyOptions]
 */
export function validSavedMoney(raw, labelOrOptions = "Saved amount", legacyOptions = {}) {
  if (raw === null) return undefined;
  const label = typeof labelOrOptions === "string" ? labelOrOptions : "Saved amount";
  const options = typeof labelOrOptions === "string" ? legacyOptions : labelOrOptions;
  const parsed = parseIncomeMoney(raw, label, { allowZero: options.allowZero ?? true });
  return parsed.ok ? parsed.normalized : undefined;
}

/** @template {string} T @param {string | null} raw @param {readonly T[]} allowed */
export function validSavedEnum(raw, allowed) {
  return raw !== null && allowed.includes(/** @type {T} */ (raw)) ? /** @type {T} */ (raw) : undefined;
}

/** @param {string | null} raw */
export function validSavedCurrency(raw) {
  return raw !== null && SAVED_CURRENCIES.includes(raw) ? raw : undefined;
}

/** @param {string | null} raw @param {number | { min: number, max: number }} minOrOptions @param {number} [legacyMax] */
export function validSavedWholeNumber(raw, minOrOptions, legacyMax) {
  if (raw === null) return undefined;
  const min = typeof minOrOptions === "number" ? minOrOptions : minOrOptions.min;
  const max = typeof minOrOptions === "number" ? legacyMax : minOrOptions.max;
  if (max === undefined) return undefined;
  const parsed = parseWholeNumberInRange(raw, "Value", min, max);
  return parsed.ok ? String(parsed.value) : undefined;
}

/** @param {string | null} raw */
export function validSavedPercentage(raw) {
  if (raw === null) return undefined;
  const parsed = parsePercentage(raw);
  return parsed.ok ? String(parsed.value) : undefined;
}

/** @param {string | null} raw @param {number | { min: number, max: number }} minOrOptions @param {number} [legacyMax] */
export function validSavedDecimal(raw, minOrOptions, legacyMax) {
  if (raw === null) return undefined;
  const min = typeof minOrOptions === "number" ? minOrOptions : minOrOptions.min;
  const max = typeof minOrOptions === "number" ? legacyMax : minOrOptions.max;
  if (max === undefined) return undefined;
  const parsed = parseStrictScalar(raw, "Value", { min, max, maxDecimalPlaces: 4 });
  return parsed.ok ? String(parsed.value) : undefined;
}

/** @param {string | null} raw */
export function validSavedBoolean(raw) {
  if (raw === null) return undefined;
  try {
    const value = JSON.parse(raw);
    return typeof value === "boolean" ? value : undefined;
  } catch {
    return undefined;
  }
}
