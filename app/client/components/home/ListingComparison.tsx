import { useEffect, useMemo, useState } from "react";
import { formatMoney, SUPPORTED_CURRENCIES } from "~/client/utils/rentMath";
import type { Currency } from "~/client/utils/rentMath";
import {
  compareListings, LISTING_FREQUENCIES, LISTING_FREQUENCY_LABELS,
  LISTING_STORAGE_KEY, listingComparisonCsv, parseListingMoney,
  parseSavedListings, serializeListings, nextListingId,
} from "~/client/utils/listingComparison.js";
import type { ListingDraft, ListingFrequency } from "~/client/utils/listingComparison.js";

const control = "w-full min-w-0 cursor-pointer rounded-xl bg-slate-100 px-3 py-3 text-base text-slate-950 outline-none transition hover:bg-sky-50 focus:bg-white focus:ring-2 focus:ring-sky-400";
const button = "cursor-pointer rounded-xl bg-sky-100 px-4 py-2.5 text-sm font-semibold text-sky-900 transition hover:bg-sky-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50";

/** A separate comparison workspace; changing these listings never changes the converter above. */
export default function ListingComparison() {
  const [listings, setListings] = useState<ListingDraft[]>([
    { id: "listing-1", name: "Weekly listing", rent: "500", frequency: "weekly", extras: "100" },
    { id: "listing-2", name: "Monthly listing", rent: "2200", frequency: "monthly", extras: "0" },
  ]);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [hasSaved, setHasSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState("");
  const result = useMemo(() => compareListings(listings), [listings]);
  const money = (value: bigint) => formatMoney(value, currency);

  useEffect(() => {
    setHydrated(true);
    try { setHasSaved(parseSavedListings(window.localStorage.getItem(LISTING_STORAGE_KEY)) !== null); }
    catch { /* Saving is optional; calculations remain available. */ }
  }, []);

  function update(id: string, patch: Partial<ListingDraft>) {
    setListings((current) => current.map((listing) => listing.id === id ? { ...listing, ...patch } : listing));
    setStatus("");
  }

  function addListing() {
    setListings((current) => {
      if (current.length >= 3) return current;
      const id = nextListingId(current);
      return [...current, { id, name: `Listing ${id.slice("listing-".length)}`, rent: "", frequency: "monthly", extras: "0" }];
    });
    setStatus("");
  }

  function save() {
    try {
      window.localStorage.setItem(LISTING_STORAGE_KEY, serializeListings(listings, currency));
      setHasSaved(true);
      setStatus("Comparison saved in this browser. Save again after making changes to update it.");
    } catch { setStatus("Could not save. Check the inputs and whether this browser allows local storage. You can still download the comparison."); }
  }

  function load() {
    try {
      const saved = parseSavedListings(window.localStorage.getItem(LISTING_STORAGE_KEY));
      if (!saved) { setHasSaved(false); setStatus("No valid saved comparison was found. Your current entries are unchanged."); return; }
      setListings(saved.listings);
      setCurrency(saved.currency);
      setStatus("Saved comparison loaded, including its currency. Current unsaved entries were replaced.");
    } catch { setStatus("This browser could not read the saved comparison. Your current entries are unchanged."); }
  }

  function forget() {
    try {
      window.localStorage.removeItem(LISTING_STORAGE_KEY);
      setHasSaved(false);
      setStatus("Saved comparison removed from this browser. The entries on screen remain available.");
    } catch { setStatus("This browser could not remove the saved comparison. Check its storage permissions."); }
  }

  function download() {
    const csv = listingComparisonCsv(result, currency);
    if (!csv) return;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rent-listing-comparison.csv";
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Comparison CSV downloaded with the current inputs, totals and assumptions.");
  }

  return (
    <section aria-labelledby="listing-comparison-heading" className="mx-auto mt-8 min-w-0 max-w-6xl rounded-2xl bg-white px-5 py-6 text-slate-700 [overflow-wrap:anywhere] sm:px-8 print:break-before-page">
      <noscript><p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">JavaScript is required to edit and compare listings. The figures below are a fixed example: 500 per week plus 100 monthly extras costs 2,272.62 per month, compared with 2,200 per month with no extras. Enable JavaScript to enter your own listings, save or export.</p></noscript>
      <fieldset disabled={!hydrated} className="min-w-0">
      <legend className="sr-only">Rental listing comparison</legend>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h2 id="listing-comparison-heading" className="text-2xl font-bold tracking-tight text-sky-900">Compare rental listings</h2>
          <p className="mt-2 text-sm leading-relaxed">Compare up to three places on the same monthly and annual basis, including recurring bills. Replace the example listings with your own amounts.</p>
        </div>
        <div className="sm:w-36">
          <label htmlFor="listing-currency" className="mb-1 block text-sm font-semibold text-slate-800">All listings use</label>
          <select id="listing-currency" value={currency} onChange={(event) => { setCurrency(event.target.value as Currency); setStatus(""); }} className={control}>
            {SUPPORTED_CURRENCIES.map((code) => <option key={code} value={code}>{code}</option>)}
          </select>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-700">Currency labels apply to every listing; no exchange-rate conversion is performed. Monthly extras can include utilities, parking, insurance or recurring fees.</p>

      <div className={`mt-5 grid gap-4 ${listings.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {listings.map((listing, index) => {
          const rent = parseListingMoney(listing.rent, "Rent");
          const extras = parseListingMoney(listing.extras, "Monthly extras");
          return (
            <fieldset key={listing.id} className="min-w-0 rounded-2xl bg-sky-50 p-4">
              <legend className="px-1 font-semibold text-sky-900">Listing {index + 1}</legend>
              <label htmlFor={`${listing.id}-name`} className="mb-1 block text-sm font-semibold">Listing name</label>
              <input id={`${listing.id}-name`} value={listing.name} maxLength={60} onChange={(event) => update(listing.id, { name: event.target.value })} className={control} autoComplete="off" />
              <label htmlFor={`${listing.id}-rent`} className="mb-1 mt-3 block text-sm font-semibold">Advertised rent ({currency})</label>
              <input id={`${listing.id}-rent`} value={listing.rent} onChange={(event) => update(listing.id, { rent: event.target.value })} inputMode="decimal" className={control} aria-invalid={!rent.ok} aria-describedby={!rent.ok ? `${listing.id}-rent-error` : undefined} />
              {!rent.ok && <p id={`${listing.id}-rent-error`} className="mt-1 text-sm text-red-800">{rent.error}</p>}
              <label htmlFor={`${listing.id}-period`} className="mb-1 mt-3 block text-sm font-semibold">Rent period</label>
              <select id={`${listing.id}-period`} value={listing.frequency} onChange={(event) => update(listing.id, { frequency: event.target.value as ListingFrequency })} className={control}>
                {LISTING_FREQUENCIES.map((frequency) => <option key={frequency} value={frequency}>{LISTING_FREQUENCY_LABELS[frequency]}</option>)}
              </select>
              <label htmlFor={`${listing.id}-extras`} className="mb-1 mt-3 block text-sm font-semibold">Monthly extras ({currency})</label>
              <input id={`${listing.id}-extras`} value={listing.extras} onChange={(event) => update(listing.id, { extras: event.target.value })} inputMode="decimal" className={control} aria-invalid={!extras.ok} aria-describedby={`${listing.id}-extras-help${!extras.ok ? ` ${listing.id}-extras-error` : ""}`} />
              <p id={`${listing.id}-extras-help`} className="mt-1 text-xs">Enter 0 if none. Add only costs not included in the advertised rent.</p>
              {!extras.ok && <p id={`${listing.id}-extras-error`} className="mt-1 text-sm text-red-800">{extras.error}</p>}
              {listings.length > 1 && <button type="button" onClick={() => { setListings((current) => current.filter((row) => row.id !== listing.id)); setStatus(`${listing.name || "Listing"} removed from this comparison. Saved entries are unchanged until you save again.`); }} className={`${button} mt-3 print:hidden`} aria-label={`Remove ${listing.name || `listing ${index + 1}`}`}>Remove listing</button>}
            </fieldset>
          );
        })}
      </div>
      {listings.length < 3 && <button type="button" onClick={addListing} className={`${button} mt-4 print:hidden`}>Add a listing</button>}

      {!result.ok ? <div role="alert" className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-950"><p className="font-semibold">Check these entries before comparing:</p><ul className="mt-1 list-inside list-disc">{result.errors.map((error, index) => <li key={index}>{error}</li>)}</ul></div> : (
        <div role="region" aria-label="Listing comparison results" className="mt-6 rounded-2xl bg-sky-50 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-sky-900">Total recurring housing cost · {currency}</h3>
          <p className="mt-1 text-sm">Lowest estimated cost: {result.rows.filter((row) => result.cheapestIds.includes(row.id)).map((row) => row.name).join(" and ")}{result.cheapestIds.length > 1 ? " (tie)" : ""}. Compare location and included services separately.</p>
          <div className={`mt-4 grid gap-3 ${listings.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {result.rows.map((row) => (
              <div key={row.id} className="min-w-0 rounded-xl bg-white p-4">
                <h4 className="break-words font-semibold text-sky-900">{row.name}</h4>
                <p className="mt-2 break-words text-2xl font-bold tabular-nums text-emerald-800">{money(row.monthlyCents)}<span className="block text-sm font-normal text-slate-700">monthly total</span></p>
                <dl className="mt-3 space-y-2 text-sm">
                  <div><dt>Monthly rent equivalent</dt><dd className="font-semibold tabular-nums">{money(row.monthlyRentCents)}</dd></div>
                  <div><dt>Monthly extras</dt><dd className="font-semibold tabular-nums">{money(row.monthlyExtrasCents)}</dd></div>
                  <div><dt>Annual total</dt><dd className="font-semibold tabular-nums">{money(row.annualCents)}</dd></div>
                  <div className="rounded-lg bg-emerald-50 p-2"><dt>More than the lowest cost</dt><dd className="font-semibold tabular-nums">{money(row.monthlyDifferenceCents)}/month<br />{money(row.annualDifferenceCents)}/year</dd></div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="mt-4 text-sm leading-relaxed">Weekly, 14-day and 28-day rents use a 365-day daily-rate equivalent; monthly rents use 12 months. These are cost comparisons, not actual payment schedules. Deposits and one-off move-in costs are excluded. Precision is retained internally; money and differences between displayed totals are rounded to cents, so displayed parts can differ from totals by a cent.</p>
      <div className="mt-4 flex flex-wrap gap-2 print:hidden" data-nosnippet>
        <button type="button" disabled={!result.ok} onClick={download} className={button}>Download comparison CSV</button>
        <button type="button" disabled={!result.ok} onClick={save} className={button}>Save in this browser</button>
        {hasSaved && <><button type="button" onClick={load} className={button}>Load saved comparison</button><button type="button" onClick={forget} className={button}>Delete saved comparison</button></>}
      </div>
      <p className="mt-3 text-xs leading-relaxed">Listings stay on this device. Nothing is saved until you choose “Save in this browser”; changes are not saved automatically. Saving replaces the previous comparison on this browser. Avoid entering private addresses or personal details on shared devices. Use the page’s Print / Save PDF control to print this comparison.</p>
      <p role="status" aria-live="polite" className="mt-2 text-sm text-sky-900 print:hidden">{status}</p>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{hydrated && result.ok ? result.rows.map((row) => `${row.name}: ${money(row.monthlyCents)} per month${result.cheapestIds.includes(row.id) ? ", lowest estimated cost" : ""}.`).join(" ") : ""}</p>
      </fieldset>
    </section>
  );
}
