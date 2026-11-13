import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Match the bundler's TypeScript dependency without requiring a Node TS loader.
const dataUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const math = ts.transpileModule(readFileSync("app/client/utils/rentMath.ts", "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const source = readFileSync("app/client/utils/listingComparison.js", "utf8").replace('"./rentMath"', JSON.stringify(dataUrl(math)));
const { compareListings, parseListingMoney, parseSavedListings, serializeListings, listingComparisonCsv, nextListingId } = await import(dataUrl(source));
const draft = (id, name, rent, frequency, extras = "0") => ({ id, name, rent, frequency, extras });

test("different advertised periods and extras change the cheapest actual listing", () => {
  const result = compareListings([draft("a", "Weekly place", "500", "weekly", "100"), draft("b", "Monthly place", "2200", "monthly")]);
  assert.equal(result.ok, true);
  assert.equal(result.rows[0].monthlyCents, 227262n);
  assert.equal(result.rows[0].annualCents, 2727143n);
  assert.equal(result.rows[0].monthlyDifferenceCents, 7262n);
  assert.equal(result.rows[1].monthlyDifferenceCents, 0n);
  assert.deepEqual(result.cheapestIds, ["b"]);
});

test("all frequencies use one 365-day basis with exact intermediate precision", () => {
  for (const [rent, frequency] of [["500", "weekly"], ["1000", "fortnightly"], ["2000", "four_weekly"], ["26071.428571", "annual"]]) {
    const r = compareListings([draft("a", "A", rent, frequency), draft("b", "B", "2500", "monthly")]);
    assert.equal(r.rows[0].monthlyCents, 217262n);
  }
  const precise = compareListings([draft("a", "A", "0.123456", "weekly", "0.000001"), draft("b", "B", "1", "monthly")]);
  assert.equal(precise.rows[0].annualCents, 644n);
  assert.equal(parseListingMoney("0.123456", "Rent").units, 123456n);
});

test("invalid and ambiguous inputs never create zero-price winners", () => {
  for (const value of ["", "-1", "1e3", "12abc", "100/2", "(100)", "1,2.50", "1000000001", "0.1234567"]) {
    assert.equal(parseListingMoney(value, "Rent").ok, false, value);
    assert.equal(compareListings([draft("a", "A", value, "weekly"), draft("b", "B", "10", "monthly")]).ok, false);
  }
  for (const [value, units] of [[".5", 500000n], ["12.", 12000000n], ["$1,250.50", 1250500000n], ["1.250,50", 1250500000n], ["1 250.50", 1250500000n], ["0", 0n]]) assert.equal(parseListingMoney(value, "Rent").units, units);
});

test("ties, close differences and large values remain cent-consistent", () => {
  const tied = compareListings([draft("a", "A", "1000", "fortnightly"), draft("b", "B", "500", "weekly")]);
  assert.deepEqual(tied.cheapestIds, ["a", "b"]);
  const near = compareListings([draft("a", "A", "1.004", "monthly"), draft("b", "B", "1.006", "monthly")]);
  assert.equal(near.rows[1].monthlyDifferenceCents, 1n);
  const large = compareListings([draft("a", "A", "1000000000", "weekly"), draft("b", "B", "1000000000", "annual")]);
  assert.equal(large.rows[0].annualCents, 5214285714286n);
});

test("saved snapshots are versioned, bounded and revalidated without trusting storage", () => {
  const listings = [draft("a", "A", "500", "weekly"), draft("b", "B", "2200", "monthly")];
  const saved = serializeListings(listings, "GBP");
  assert.deepEqual(parseSavedListings(saved), { version: 1, currency: "GBP", listings });
  for (const raw of [null, "bad json", JSON.stringify({ version: 2, currency: "GBP", listings }), JSON.stringify({ version: 1, currency: "FAKE", listings }), JSON.stringify({ version: 1, currency: "USD", listings: [...listings, ...listings] }), JSON.stringify({ version: 1, currency: "USD", listings: [draft("a", "A", "1e3", "weekly")] }), JSON.stringify({ version: 1, currency: "USD", listings: [draft("a", "A", "1", "bad")] })]) assert.equal(parseSavedListings(raw), null);
});

test("CSV is quoted, formula-safe and matches displayed monetary totals", () => {
  const result = compareListings([draft("a", '=HYPERLINK("bad")', "500", "weekly", "100"), draft("b", "B, room", "2200", "monthly")]);
  const csv = listingComparisonCsv(result, "USD");
  assert.ok(csv.includes('"2272.62"'));
  assert.ok(csv.includes('"27271.43"'));
  assert.ok(csv.includes('"\'=HYPERLINK(""bad"")"'));
  assert.ok(csv.includes('"B, room"'));
  assert.ok(csv.includes("365-day"));
});

test("three-way comparison, editing cardinality, names and currency validation", () => {
  const listings = [draft("a", "A", "500", "weekly"), draft("b", "B", "2200", "monthly"), draft("c", "C", "2000", "four_weekly")];
  assert.deepEqual(compareListings(listings).cheapestIds, ["a", "c"]);
  assert.equal(compareListings([listings[0]]).ok, false);
  assert.equal(compareListings([...listings, draft("d", "D", "1", "monthly")]).ok, false);
  assert.equal(compareListings([listings[0], draft("b", "a", "1", "monthly")]).ok, false);
  assert.equal(compareListings([listings[0], draft("b", "", "1", "monthly")]).ok, false);
  for (const currency of ["USD", "CAD", "EUR", "GBP", "AUD", "NZD", "JPY", "CNY", "HKD", "SGD", "INR", "KRW", "CHF", "SEK", "NOK", "DKK", "MXN", "BRL"]) {
    assert.equal(parseSavedListings(serializeListings(listings, currency)).currency, currency);
    assert.ok(listingComparisonCsv(compareListings(listings), currency).includes(currency));
  }
  assert.throws(() => serializeListings(listings, "NOT_REAL"));
});

test("saved adversarial IDs cannot cause collisions or unsafe numeric suffixes", () => {
  const listings = [draft("listing-9999999999999999999999999999999", "A", "500", "weekly"), draft("listing-1", "B", "2000", "monthly")];
  const saved = parseSavedListings(serializeListings(listings, "USD"));
  assert.equal(nextListingId(saved.listings), "listing-2");
  const withThird = [...saved.listings, draft(nextListingId(saved.listings), "C", "2100", "monthly")];
  assert.equal(new Set(withThird.map((row) => row.id)).size, 3);
  const afterRemove = withThird.filter((row) => row.id !== "listing-1");
  assert.equal(nextListingId(afterRemove), "listing-1");
  assert.equal(parseSavedListings(JSON.stringify({ version: 1, currency: "USD", listings: [listings[0], { ...listings[1], id: listings[0].id }] })), null);
  assert.equal(parseSavedListings(JSON.stringify({ version: 1, currency: "USD", listings: [listings[0], { ...listings[1], id: "x".repeat(41) }] })), null);
});

test("prerendered comparison locks inputs and explains its fixed example without JavaScript", async () => {
  const component = ts.transpileModule(readFileSync("app/client/components/home/ListingComparison.tsx", "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
    .replaceAll('"react"', JSON.stringify(import.meta.resolve("react")))
    .replaceAll('"react/jsx-runtime"', JSON.stringify(import.meta.resolve("react/jsx-runtime")))
    .replaceAll('"~/client/utils/rentMath"', JSON.stringify(dataUrl(math)))
    .replaceAll('"~/client/utils/listingComparison.js"', JSON.stringify(dataUrl(source)));
  const { default: ListingComparison } = await import(dataUrl(component));
  const html = renderToStaticMarkup(createElement(ListingComparison));
  assert.match(html, /<noscript>.*JavaScript is required.*fixed example/s);
  assert.match(html, /<fieldset disabled=""[^>]*>.*Rental listing comparison/s);
  assert.match(html, /role="region" aria-label="Listing comparison results"/);
  assert.match(html, /aria-live="polite" aria-atomic="true"/);
  assert.ok(html.includes("$2,272.62"));
});
