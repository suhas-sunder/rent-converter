import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";

import {
  calculateSalaryComparison,
  parseIncomeMoney,
} from "../app/client/utils/generatedIncome.js";
import { validSavedCurrency } from "../app/client/utils/savedState.js";

const destination = "/salary-to-rent-calculator";
const redirects = [
  "/how-much-rent-can-i-afford-on-50k",
  "/how-much-rent-can-i-afford-on-60k",
  "/how-much-rent-can-i-afford-on-65k",
  "/how-much-rent-can-i-afford-on-70k",
  "/how-much-rent-can-i-afford-on-80k",
  "/how-much-rent-can-i-afford-on-100k",
  "/rent-calculator-by-salary",
  "/rent-calculator-by-income",
  "/max-rent-calculator",
  "/30-percent-rent-rule-calculator",
  "/40-percent-rent-rule-calculator",
];

const neighboringRoutes = [
  "/how-much-rent-can-i-afford-calculator",
  "/income-required-for-rent-calculator",
  "/rent-as-percentage-of-income-calculator",
  "/rent-after-tax-income-calculator",
  "/rent-vs-take-home-pay-calculator",
  "/hourly-pay-to-rent-calculator",
  "/rent-budget-calculator",
];

const routesSource = readFileSync("app/routes.ts", "utf8");
const registrySource = readFileSync("app/client/data/routeRegistry.ts", "utf8");
const canonicalRegistrySource = registrySource.split("export const redirectAliases")[0];
const configsSource = readFileSync("app/client/data/generatedRouteConfigs.ts", "utf8");
const generatedPagesSource = readFileSync("app/client/components/generated/GeneratedPages.tsx", "utf8");
const survivorRouteSource = readFileSync("app/routes/salary-to-rent-calculator.tsx", "utf8");
const sitemapSource = readFileSync("public/sitemap.xml", "utf8");
const redirectHelperSource = readFileSync("app/utils/redirects.ts", "utf8");

function escapeRegex(value) {
  return value.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");
}

function routeModule(path) {
  return readFileSync(`app/routes/${path.slice(1)}.tsx`, "utf8");
}

function allSourceFiles(root) {
  return readdirSync(root).flatMap((name) => {
    const path = `${root}/${name}`;
    return statSync(path).isDirectory() ? allSourceFiles(path) : [path];
  });
}

function money(raw, label = "Annual gross salary", options) {
  const parsed = parseIncomeMoney(raw, label, options);
  assert.equal(parsed.ok, true, parsed.ok ? undefined : parsed.error);
  return parsed.cents;
}

test("eleven salary and fixed-reference routes remain registered as direct query-preserving 301 redirects", () => {
  assert.equal(redirects.length, 11);
  assert.match(redirectHelperSource, /new URL\(request\.url\)/);
  assert.match(redirectHelperSource, /requestUrl\.search/);
  assert.match(redirectHelperSource, /status:\s*301/);

  const sources = new Set(redirects);
  for (const source of redirects) {
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(source.slice(1))}"`), source);
    const moduleSource = routeModule(source);
    assert.match(moduleSource, /permanentRedirectPreservingQuery/);
    assert.match(
      moduleSource,
      new RegExp(`permanentRedirectPreservingQuery\\(request,\\s*"${escapeRegex(destination)}"\\)`),
      source,
    );
    assert.doesNotMatch(moduleSource, /export const meta|buildMeta|IncomeToolPage|SalaryAnswerPage|FAQ|schema|canonical|<h1/i, source);
    assert.equal(sources.has(destination), false, `${source} must not chain`);
    assert.notEqual(source, destination, `${source} must not loop`);
  }
});

test("registry and discovery data remove every retired canonical salary destination", () => {
  const discoverySources = [
    canonicalRegistrySource,
    configsSource,
    generatedPagesSource,
    readFileSync("app/routes/home.tsx", "utf8"),
    readFileSync("app/client/components/navigation/NavBar.tsx", "utf8"),
    readFileSync("app/client/components/navigation/AllRentalToolsLinks.tsx", "utf8"),
    readFileSync("app/routes/sitemap.tsx", "utf8"),
  ];

  for (const source of redirects) {
    const mapping = new RegExp(
      `\\{\\s*from:\\s*"${escapeRegex(source)}",\\s*to:\\s*"${escapeRegex(destination)}"\\s*\\}`,
      "g",
    );
    assert.equal(registrySource.match(mapping)?.length, 1, source);
    discoverySources.forEach((content) =>
      assert.doesNotMatch(content, new RegExp(`"${escapeRegex(source)}"`), source),
    );
    assert.doesNotMatch(sitemapSource, new RegExp(`<loc>[^<]*${escapeRegex(source)}</loc>`), source);
  }
});

test("no active application link points to a retired salary or fixed-reference route", () => {
  const intentional = new Set([
    "app/routes.ts",
    "app/client/data/routeRegistry.ts",
    ...redirects.map((source) => `app/routes/${source.slice(1)}.tsx`),
  ]);
  const activeFiles = allSourceFiles("app").filter(
    (path) => /\.(?:ts|tsx)$/.test(path) && !intentional.has(path),
  );

  for (const path of activeFiles) {
    const source = readFileSync(path, "utf8");
    for (const retired of redirects) {
      assert.doesNotMatch(source, new RegExp(escapeRegex(retired)), `${path}: ${retired}`);
    }
  }
});

test("salary survivor and materially distinct neighboring routes remain canonical HTTP-200 destinations", () => {
  const canonicalDiscoverySource = `${canonicalRegistrySource}\n${configsSource}`;
  for (const path of [destination, ...neighboringRoutes]) {
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(path.slice(1))}"`), path);
    assert.match(canonicalDiscoverySource, new RegExp(`"${escapeRegex(path)}"`), path);
    assert.doesNotMatch(routeModule(path), /permanentRedirectPreservingQuery/, path);
  }
  assert.match(survivorRouteSource, /incomeToolConfigs\["\/salary-to-rent-calculator"\]/);
});

test("survivor preserves 30%, 40%, 3x, planned-rent, and strict salary calculations", () => {
  const result = calculateSalaryComparison(
    money("60000"),
    money("1500", "Planned monthly rent", { allowZero: true }),
  );
  assert.deepEqual(result, {
    monthlyGrossIncome: 500_000n,
    monthlyRentAt30: 150_000n,
    monthlyRentAt40: 200_000n,
    monthlyRentAt3x: 166_667n,
    plannedRentPercent: 30,
  });
  for (const raw of ["", "abc", "12abc", "1e2", "-1", "0"]) {
    assert.equal(parseIncomeMoney(raw, "Annual gross salary").ok, false, raw);
  }

  const examples = new Map([
    ["50000", [125_000n, 166_667n, 138_889n]],
    ["60000", [150_000n, 200_000n, 166_667n]],
    ["80000", [200_000n, 266_667n, 222_222n]],
    ["100000", [250_000n, 333_333n, 277_778n]],
  ]);
  for (const [salary, expected] of examples) {
    const calculated = calculateSalaryComparison(
      money(salary),
      money("0", "Planned monthly rent", { allowZero: true }),
    );
    assert.deepEqual(
      [calculated.monthlyRentAt30, calculated.monthlyRentAt40, calculated.monthlyRentAt3x],
      expected,
      salary,
    );
  }
});

test("survivor uses hydration-safe validated saved state without retired keys", () => {
  assert.match(generatedPagesSource, /useHydrationSafeSavedState\(/);
  assert.match(generatedPagesSource, /rc_salary_to_rent_annual_salary/);
  assert.match(generatedPagesSource, /rc_salary_to_rent_planned_rent/);
  assert.match(generatedPagesSource, /rc_salary_to_rent_currency/);
  assert.match(generatedPagesSource, /validSavedMoney[\s\S]*?allowZero:\s*false/);
  assert.match(generatedPagesSource, /validSavedMoney[\s\S]*?allowZero:\s*true/);
  assert.match(generatedPagesSource, /validSavedCurrency/);
  assert.doesNotMatch(generatedPagesSource, /rc_rent_calculator_by_salary|rc_rent_calculator_by_income|rc_max_rent/);
  assert.equal(validSavedCurrency("USD"), "USD");
  assert.equal(validSavedCurrency("ZZZ"), undefined);
});

test("retired configs and generated renderer branches are removed while hourly and budget modes remain", () => {
  for (const path of redirects) {
    assert.doesNotMatch(configsSource, new RegExp(`"${escapeRegex(path)}"`), path);
  }
  assert.doesNotMatch(configsSource, /salaryAnswerConfigs|SalaryAnswerConfig/);
  assert.doesNotMatch(generatedPagesSource, /SalaryAnswerPage|SalaryAnswerConfig|FixedRuleIncomeTool|IncomeReferenceTool/);
  assert.doesNotMatch(generatedPagesSource, /"rent-rule"|"max-rent"/);
  assert.match(generatedPagesSource, /function SalaryIncomeTool/);
  assert.match(generatedPagesSource, /function HourlyIncomeTool/);
  assert.match(generatedPagesSource, /function BudgetIncomeTool/);
  assert.match(generatedPagesSource, /export function IncomeToolPage/);
});

test("retained salary content states formulas, examples, and fixed-percentage limitations", () => {
  for (const wording of [
    "Monthly gross income = annual salary ÷ 12",
    "30% monthly reference = annual salary × 0.30 ÷ 12",
    "40% monthly reference = annual salary × 0.40 ÷ 12",
    "3x income reference = annual salary ÷ 3 ÷ 12",
    "Planned rent percentage = planned monthly rent ÷ monthly gross income × 100",
    "$50,000 salary",
    "$60,000 salary",
    "$80,000 salary",
    "$100,000 salary",
    "not a universal rule",
    "is not a recommendation",
    "do not determine affordability, financial suitability, or application approval",
  ]) assert.match(configsSource, new RegExp(escapeRegex(wording)), wording);
});

test("visible FAQ and FAQ schema use the same survivor configuration", () => {
  assert.match(generatedPagesSource, /makePageSchemas\(\{ \.\.\.config, calculator: true, faq: config\.faq \}\)/);
  assert.match(generatedPagesSource, /<Faq items=\{config\.faq\} \/>/);
  assert.match(configsSource, /"\/salary-to-rent-calculator": incomeConfig\([\s\S]*?faq:\s*\[/);
  assert.match(configsSource, /path:\s*"\/salary-to-rent-calculator"/);
});

test("final counts reflect eleven canonical salary routes becoming redirects", () => {
  const registered =
    (routesSource.match(/\broute\(/g) ?? []).length +
    (routesSource.match(/\bindex\(/g) ?? []).length;
  const redirectCount = [...registrySource.matchAll(/\{\s*from:\s*"[^"]+",\s*to:\s*"[^"]+"\s*\}/g)].length;
  const sitemapUrls = [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  assert.equal(registered, 172);
  assert.equal(redirectCount, 112);
  assert.equal(registered - redirectCount, 60);
  assert.equal(sitemapUrls.length, 60);
  assert.equal(new Set(sitemapUrls).size, 60);
  sitemapUrls.forEach((url) => assert.match(url, /^https:\/\/www\.rentconverter\.com(?:\/|$)/));
});
