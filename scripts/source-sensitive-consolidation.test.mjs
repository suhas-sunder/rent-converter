import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";

import { parseIncomeMoney } from "../app/client/utils/generatedIncome.js";
import {
  calculateAustraliaMoveInCost,
  parseStrictScalar,
} from "../app/client/utils/generatedTools.js";

const redirects = {
  "/bc-rent-increase-calculator": "/rent-increase-calculator",
  "/ontario-rent-increase-calculator": "/rent-increase-calculator",
  "/quebec-rent-increase-calculator": "/rent-increase-calculator",
  "/california-rent-increase-calculator": "/rent-increase-calculator",
  "/bond-and-rent-in-advance-australia": "/rent-in-advance-australia",
  "/when-is-rent-due": "/rent-due-date-calculator",
  "/do-you-pay-rent-in-advance-or-after": "/rent-due-date-calculator",
};

const retained = [
  "/rent-increase-calculator",
  "/rent-in-advance-australia",
  "/rent-due-date-calculator",
];

const routesSource = readFileSync("app/routes.ts", "utf8");
const registrySource = readFileSync("app/client/data/routeRegistry.ts", "utf8");
const canonicalRegistrySource = registrySource.split("export const redirectAliases")[0];
const configsSource = readFileSync("app/client/data/generatedRouteConfigs.ts", "utf8");
const generatedPagesSource = readFileSync("app/client/components/generated/GeneratedPages.tsx", "utf8");
const generatedToolsSource = readFileSync("app/client/utils/generatedTools.js", "utf8");
const increaseSource = readFileSync("app/routes/rent-increase-calculator.tsx", "utf8");
const dueSource = readFileSync("app/routes/rent-due-date-calculator.tsx", "utf8");
const dueHowSource = readFileSync("app/client/components/rent-due-date-calculator/HowItWorks.tsx", "utf8");
const sitemapSource = readFileSync("public/sitemap.xml", "utf8");
const helperSource = readFileSync("app/utils/redirects.ts", "utf8");
const adSlotsSource = readFileSync("app/client/data/adSlots.ts", "utf8");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function routeModule(path) {
  return readFileSync(`app/routes/${path.slice(1)}.tsx`, "utf8");
}

function allFiles(root) {
  return readdirSync(root).flatMap((name) => {
    const path = `${root}/${name}`;
    return statSync(path).isDirectory() ? allFiles(path) : [path];
  });
}

function sitemapPaths() {
  return [...sitemapSource.matchAll(/<loc>https:\/\/www\.rentconverter\.com([^<]*)<\/loc>/g)]
    .map((match) => match[1] || "/");
}

test("seven source-sensitive routes are direct query-preserving permanent redirects", () => {
  assert.match(helperSource, /new URL\(request\.url\)/);
  assert.match(helperSource, /requestUrl\.search/);
  assert.match(helperSource, /status:\s*301/);

  const redirectSources = new Set(Object.keys(redirects));
  for (const [source, target] of Object.entries(redirects)) {
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(source.slice(1))}"`), source);
    assert.match(registrySource, new RegExp(`from: "${escapeRegex(source)}", to: "${escapeRegex(target)}"`), source);
    const moduleSource = routeModule(source);
    assert.match(moduleSource, /permanentRedirectPreservingQuery/);
    assert.match(moduleSource, new RegExp(`request, "${escapeRegex(target)}"`));
    assert.doesNotMatch(moduleSource, /export const meta|dangerouslySetInnerHTML|<h1/i);
    assert.ok(!redirectSources.has(target), `${source} points directly to HTTP-200 ${target}`);
  }
});

test("retired sources are absent from canonical discovery and active internal links", () => {
  for (const source of Object.keys(redirects)) {
    assert.doesNotMatch(canonicalRegistrySource, new RegExp(`"${escapeRegex(source)}"`), source);
    assert.doesNotMatch(configsSource, new RegExp(`"${escapeRegex(source)}"`), source);
    assert.doesNotMatch(sitemapSource, new RegExp(`<loc>[^<]*${escapeRegex(source)}</loc>`), source);
  }

  const allowed = new Set([
    "app/routes.ts",
    "app/client/data/routeRegistry.ts",
    ...Object.keys(redirects).map((path) => `app/routes/${path.slice(1)}.tsx`),
  ]);
  const activeFiles = allFiles("app").filter((path) => !allowed.has(path.replaceAll("\\", "/")));
  for (const file of activeFiles) {
    const source = readFileSync(file, "utf8");
    for (const retired of Object.keys(redirects)) {
      assert.doesNotMatch(source, new RegExp(`["']${escapeRegex(retired)}["']`), `${file}: ${retired}`);
    }
  }
});

test("three retained destinations remain canonical indexable calculators", () => {
  const canonicalDiscovery = `${canonicalRegistrySource}\n${configsSource}`;
  for (const path of retained) {
    assert.match(canonicalDiscovery, new RegExp(`"${escapeRegex(path)}"`), path);
    assert.ok(sitemapPaths().includes(path), `${path} remains in XML sitemap`);
    const source = routeModule(path);
    assert.doesNotMatch(source, /permanentRedirectPreservingQuery/);
    assert.doesNotMatch(source, /noindex/i);
  }
});

test("Australia move-in calculator uses explicit validated inputs and exact cent arithmetic", () => {
  assert.match(generatedPagesSource, /useState\(""\).*advanceWeeks|advanceWeeks, setAdvanceWeeks\] = useState\(""\)/s);
  assert.match(generatedPagesSource, /bondAmount, setBondAmount\] = useState\(""\)/);
  assert.match(generatedPagesSource, /Weeks of rent paid in advance/);
  assert.match(generatedPagesSource, /Bond amount \(AUD\)/);
  assert.match(generatedPagesSource, /parseStrictScalar\(advanceWeeks/);
  assert.match(generatedPagesSource, /parseIncomeMoney\(bondAmount, "Bond amount", \{ allowZero: true \}\)/);
  const moveInStart = generatedPagesSource.indexOf("export function MoveInCostPage");
  const moveInEnd = generatedPagesSource.indexOf("export function ProrationToolPage", moveInStart);
  const moveInRenderer = generatedPagesSource.slice(moveInStart, moveInEnd);
  assert.match(moveInRenderer, /makePageSchemas\(\{ \.\.\.config, faq: config\.faq \}\)/);
  assert.doesNotMatch(moveInRenderer, /makePageSchemas\(\{ \.\.\.config, calculator: true/);
  assert.doesNotMatch(generatedPagesSource, /setBondWeeks|Other upfront costs|movingCosts/);
  assert.match(generatedToolsSource, /calculateAustraliaMoveInCost/);

  const result = calculateAustraliaMoveInCost(50_000n, 2, 150_000n);
  assert.deepEqual(result, {
    weeklyRent: 50_000n,
    advanceWeeks: 2,
    rentInAdvance: 100_000n,
    bond: 150_000n,
    total: 250_000n,
  });
  assert.equal(result.rentInAdvance + result.bond, result.total);
  assert.equal(calculateAustraliaMoveInCost(12_345n, 1.5, 0n).total, 18_518n);

  for (const raw of ["", "abc", "2weeks", "-1"] ) {
    assert.equal(parseStrictScalar(raw, "Advance-rent weeks", { min: 0, max: 52, maxDecimalPlaces: 4 }).ok, false, raw);
  }
  for (const raw of ["", "abc", "12bond", "-1"]) {
    assert.equal(parseIncomeMoney(raw, "Bond amount", { allowZero: true }).ok, false, raw);
  }
  assert.equal(parseIncomeMoney("0", "Bond amount", { allowZero: true }).ok, true);
});

test("Australia content has no legal numeric defaults and includes all supplied official resources", () => {
  const retainedBlock = configsSource.slice(configsSource.indexOf('"/rent-in-advance-australia"'));
  assert.match(retainedBlock, /no legal default is supplied|does not supply a legal default/i);
  assert.doesNotMatch(retainedBlock, /maximum legal bond|allowed rent in advance|landlords can charge|Australian law requires|standard legal amount|legally compliant total/i);
  assert.doesNotMatch(retainedBlock, /bondWeeks|defaultBond|defaultAdvance/);
  for (const url of [
    "https://www.nsw.gov.au/housing-and-construction/renting-a-place-to-live",
    "https://www.consumer.vic.gov.au/housing/renting",
    "https://www.rta.qld.gov.au/",
    "https://www.sa.gov.au/topics/housing/renting-and-letting",
    "https://www.consumerprotection.wa.gov.au/renting-home",
    "https://www.cbos.tas.gov.au/topics/housing/renting",
    "https://www.justice.act.gov.au/renting-and-occupancy-laws",
    "https://consumeraffairs.nt.gov.au/for-consumers/residential-tenancies",
  ]) assert.match(configsSource, new RegExp(escapeRegex(url)));
});

test("generic increase page remains arithmetic-only and links to supplied official sources", () => {
  assert.match(increaseSource, /percentage or fixed amount you enter|Enter a percentage or fixed amount/);
  assert.match(increaseSource, /does not\s+decide whether an increase\s+is permitted/);
  assert.match(increaseSource, /legal limits, exemptions, notice requirements/);
  assert.doesNotMatch(configsSource, /mode:\s*"regional"|regionNote:/);
  for (const url of [
    "https://www2.gov.bc.ca/gov/content/housing-tenancy/residential-tenancies/during-a-tenancy/rent-increases",
    "https://www.ontario.ca/page/residential-rent-increases",
    "https://www.tal.gouv.qc.ca/en",
    "https://oag.ca.gov/tenants",
  ]) assert.match(increaseSource, new RegExp(escapeRegex(url)));
});

test("due-date destination uses entered agreement terms without universal timing claims", () => {
  const source = `${dueSource}\n${dueHowSource}`;
  assert.match(source, /due date or recurring cadence stated in the written rental agreement|due date or cadence stated in the rental agreement/);
  assert.match(source, /does not\s+decide when rent is\s+legally due/);
  assert.match(source, /in advance or in arrears depends on the agreement and applicable rules/);
  assert.doesNotMatch(source, /rent is always paid in advance|rent is universally due|grace period is/i);
  assert.match(dueSource, /mainEntity: faqData\.map/);
  assert.match(dueSource, /faqData\.map\(\(f, i\)/);
});

test("route, redirect, sitemap, and homepage-slot totals match the consolidated state", () => {
  const registered = (routesSource.match(/\broute\(/g) ?? []).length + (routesSource.match(/\bindex\(/g) ?? []).length;
  const redirectCount = [...registrySource.matchAll(/\{\s*from:\s*"[^"]+",\s*to:\s*"[^"]+"\s*\}/g)].length;
  const urls = sitemapPaths();

  assert.equal(registered, 172);
  assert.equal(redirectCount, 112);
  assert.equal(registered - redirectCount, 60);
  assert.equal(urls.length, 60);
  assert.equal(new Set(urls).size, 60);
  for (const name of [
    "home_top_banner",
    "home_left_sidebar",
    "home_right_sidebar",
    "home_below_utility_banner",
    "home_seo_square",
    "home_all_tools_banner",
  ]) assert.equal((adSlotsSource.match(new RegExp(name, "g")) ?? []).length, 1, name);
});
