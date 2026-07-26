import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const text = (path) => readFileSync(path, "utf8");

const routesFile = text("app/routes.ts");
const registry = text("app/client/data/routeRegistry.ts");
const sitemap = text("public/sitemap.xml");
const generatedConfigs = text("app/client/data/generatedRouteConfigs.ts");
const adSlots = text("app/client/data/adSlots.ts");
const home = text("app/routes/home.tsx");
const allTools = text("app/client/components/navigation/AllRentalToolsLinks.tsx");

const scopedRoutes = [
  "/",
  "/weekly-to-monthly-rent-converter",
  "/monthly-to-weekly-rent-converter",
  "/pw-to-pcm-calculator",
  "/pcm-to-pw-calculator",
  "/rent-paid-every-4-weeks-calculator",
  "/rent-per-paycheck-calculator",
  "/how-much-rent-can-i-afford-calculator",
  "/salary-to-rent-calculator",
  "/lease-date-calculator",
  "/rent-due-date-calculator",
  "/rent-schedule-calculator",
];

const customFiles = {
  "/": "app/routes/home.tsx",
  "/weekly-to-monthly-rent-converter": "app/routes/weekly-to-monthly-rent-converter.tsx",
  "/monthly-to-weekly-rent-converter": "app/routes/monthly-to-weekly-rent-converter.tsx",
  "/rent-paid-every-4-weeks-calculator": "app/routes/rent-paid-every-4-weeks-calculator.tsx",
  "/rent-per-paycheck-calculator": "app/routes/rent-per-paycheck-calculator.tsx",
  "/how-much-rent-can-i-afford-calculator": "app/routes/how-much-rent-can-i-afford-calculator.tsx",
  "/rent-due-date-calculator": "app/routes/rent-due-date-calculator.tsx",
};

const generatedConfigGroups = [
  "conversionPageConfigs",
  "incomeToolConfigs",
  "dateToolConfigs",
];

const requiredAdSlots = [
  "home_top_banner",
  "home_left_sidebar",
  "home_right_sidebar",
  "home_below_utility_banner",
  "home_seo_square",
  "home_all_tools_banner",
];

function routePaths() {
  return [
    "/",
    ...[...routesFile.matchAll(/route\("([^"]+)"/g)].map((match) => `/${match[1]}`),
  ];
}

function sitemapPaths() {
  return [...sitemap.matchAll(/<loc>https:\/\/www\.rentconverter\.com([^<]*)<\/loc>/g)].map(
    (match) => match[1] || "/",
  );
}

function generatedBlock(path) {
  for (const group of generatedConfigGroups) {
    const groupStart = generatedConfigs.indexOf(`export const ${group}`);
    if (groupStart === -1) continue;
    const pathStart = generatedConfigs.indexOf(`"${path}":`, groupStart);
    if (pathStart === -1) continue;
    const tail = generatedConfigs.slice(pathStart + 1);
    const nextMatch = tail.match(/\r?\n  "\//);
    const nextConfigIndex = nextMatch?.index === undefined ? -1 : pathStart + 1 + nextMatch.index;
    const groupEnd = generatedConfigs.indexOf("\n};", pathStart);
    const end = nextConfigIndex === -1 || nextConfigIndex > groupEnd ? groupEnd : nextConfigIndex;
    return generatedConfigs.slice(pathStart, end);
  }
  return "";
}

function routeSource(path) {
  if (customFiles[path]) return text(customFiles[path]);
  const block = generatedBlock(path);
  assert.notEqual(block, "", `${path} has a generated config block`);
  return block;
}

function firstStringAfter(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*"([^"]+)"`));
  return match?.[1] ?? "";
}

function customTitle(source) {
  return source.match(/const title = "([^"]+)"/)?.[1] ?? source.match(/title:\s*"([^"]+)"/)?.[1] ?? "";
}

function customDescription(source) {
  return source.match(/const description =\s*"([^"]+)"/)?.[1] ?? source.match(/name: "description",\s*content:\s*"([^"]+)"/)?.[1] ?? "";
}

function metadata(path) {
  const source = routeSource(path);
  if (customFiles[path]) {
    return {
      title: customTitle(source),
      description: customDescription(source),
    };
  }
  return {
    title: firstStringAfter(source, "title"),
    description: firstStringAfter(source, "description"),
  };
}

test("scoped core pages remain registered HTTP 200 routes with stable route counts", () => {
  const paths = routePaths();
  const redirects = [...registry.matchAll(/\{ from: "([^"]+)", to: "([^"]+)" \}/g)];
  const sitemapUrls = sitemapPaths();

  for (const path of scopedRoutes) {
    assert.ok(paths.includes(path), `${path} is registered`);
    assert.ok(!redirects.some((match) => match[1] === path), `${path} is not a redirect source`);
    assert.ok(sitemapUrls.includes(path), `${path} remains in XML sitemap`);
  }

  assert.equal(paths.length, 60);
  assert.equal(redirects.length, 112);
  assert.equal(paths.length + redirects.length, 172);
  assert.equal(sitemapUrls.length, 60);
  assert.equal(new Set(sitemapUrls).size, 60);
});

test("scoped core pages have unique, route-specific metadata", () => {
  const titleByPath = new Map();
  const descriptionByPath = new Map();

  for (const path of scopedRoutes) {
    const meta = metadata(path);
    assert.ok(meta.title, `${path} has a title`);
    assert.ok(meta.description, `${path} has a description`);
    assert.doesNotMatch(`${meta.title}\n${meta.description}`, /rent-after-increase|2x-rent|3x-rent|roommate-rent-split|lease-start-and-end-date|180-per-week-to-monthly-rent/i);
    titleByPath.set(path, meta.title);
    descriptionByPath.set(path, meta.description);
  }

  assert.equal(new Set(titleByPath.values()).size, scopedRoutes.length, "scoped titles are unique");
  assert.equal(new Set(descriptionByPath.values()).size, scopedRoutes.length, "scoped descriptions are unique");
  assert.notEqual(titleByPath.get("/"), titleByPath.get("/weekly-to-monthly-rent-converter"));
  assert.notEqual(titleByPath.get("/weekly-to-monthly-rent-converter"), titleByPath.get("/pw-to-pcm-calculator"));
  assert.notEqual(titleByPath.get("/how-much-rent-can-i-afford-calculator"), titleByPath.get("/salary-to-rent-calculator"));
  assert.notEqual(titleByPath.get("/rent-due-date-calculator"), titleByPath.get("/rent-schedule-calculator"));
});

test("scoped introductions, formulas, and examples stay distinct", () => {
  const weeklyHow = text("app/client/components/weekly-to-monthly-rent-converter/HowItWorks.tsx");
  const weeklyPage = text("app/routes/weekly-to-monthly-rent-converter.tsx");
  const monthlyPage = text("app/routes/monthly-to-weekly-rent-converter.tsx");
  const pwBlock = generatedBlock("/pw-to-pcm-calculator");
  const pcmBlock = generatedBlock("/pcm-to-pw-calculator");
  const affordability = text("app/routes/how-much-rent-can-i-afford-calculator.tsx");
  const salaryBlock = generatedBlock("/salary-to-rent-calculator");
  const leaseBlock = generatedBlock("/lease-date-calculator");
  const duePage = text("app/routes/rent-due-date-calculator.tsx");
  const scheduleBlock = generatedBlock("/rent-schedule-calculator");

  assert.match(weeklyPage, /weekly rent x 365\s+\/ 7 \/ 12/);
  assert.match(weeklyHow, /\$180 per week x 365 \/ 7 \/ 12 is about \$782\.14 per calendar month/);
  assert.match(monthlyPage, /monthly rent x 12 x 7 \/ 365/);
  assert.match(pwBlock, /PW x 365 \/ 7 \/ 12/);
  assert.match(pcmBlock, /PCM x 12 x 7 \/ 365/);
  assert.match(affordability, /not a personal\s+affordability decision/);
  assert.match(salaryBlock, /Annual Income Rent Targets/);
  assert.match(leaseBlock, /lease start date and a whole-number term in calendar months/);
  assert.match(leaseBlock, /12-month lease/);
  assert.match(duePage, /Enter the due date or cadence stated in the rental agreement/);
  assert.match(scheduleBlock, /Generate each rent payment date inside a lease term/);
});

test("scoped related journeys use canonical retained destinations", () => {
  const redirectSources = new Set(
    [...registry.matchAll(/\{ from: "([^"]+)", to: "([^"]+)" \}/g)].map((match) => match[1]),
  );
  const checkedSources = [
    ...Object.values(customFiles).map(text),
    text("app/client/components/weekly-to-monthly-rent-converter/HowItWorks.tsx"),
    text("app/client/components/weekly-to-monthly-rent-converter/ToolFit.tsx"),
    text("app/client/components/monthly-to-weekly-rent-converter/HowItWorks.tsx"),
    text("app/client/components/monthly-to-weekly-rent-converter/ToolFit.tsx"),
    text("app/client/components/rent-paid-every-4-weeks-calculator/HowItWorks.tsx"),
    text("app/client/components/rent-paid-every-4-weeks-calculator/ToolFit.tsx"),
    text("app/client/components/how-much-rent-can-i-afford-calculator/HowItWorks.tsx"),
    text("app/client/components/how-much-rent-can-i-afford-calculator/ToolFit.tsx"),
    text("app/client/components/rent-due-date-calculator/HowItWorks.tsx"),
    text("app/client/components/rent-due-date-calculator/ToolFit.tsx"),
    generatedBlock("/pw-to-pcm-calculator"),
    generatedBlock("/pcm-to-pw-calculator"),
    generatedBlock("/salary-to-rent-calculator"),
    generatedBlock("/lease-date-calculator"),
    generatedBlock("/rent-schedule-calculator"),
  ].join("\n");

  const activeLinks = [
    ...checkedSources.matchAll(/\b(?:to|href):?\s*=\{?"(\/[^"#?]+)"/g),
    ...checkedSources.matchAll(/link\("(\/[^"#?]+)"/g),
  ].map((match) => match[1]);

  for (const link of activeLinks) {
    assert.ok(!redirectSources.has(link), `${link} is not a redirect source`);
  }

  assert.match(checkedSources, /\/methodology/);
  assert.match(checkedSources, /\/rent-schedule-calculator/);
  assert.match(checkedSources, /\/lease-date-calculator/);
});

test("FAQ schema remains generated from visible FAQ arrays and unsupported claims stay out", () => {
  const combined = scopedRoutes.map(routeSource).join("\n");

  assert.doesNotMatch(combined, /expert reviewed|reviewed by|dateReviewed|dateModified|guarantee(?:s|d)? approval|legally permitted|live market data|exchange-rate conversion/i);
  assert.match(combined, /not a personal\s+affordability decision/);
  assert.match(combined, /does not calculate payroll deductions, tax withholding, paycheck dates, or legal affordability/);
  assert.match(combined, /FAQPage/);
  assert.match(combined, /mainEntity: faqData\.map/);
});

test("homepage ad slots remain unchanged in name and count", () => {
  for (const slot of requiredAdSlots) {
    assert.equal((adSlots.match(new RegExp(`^  ${slot}:`, "gm")) ?? []).length, 1);
  }

  for (const slot of requiredAdSlots.filter((slot) => slot !== "home_all_tools_banner")) {
    assert.equal((home.match(new RegExp(`<AdPlaceholder slot="${slot}"`, "g")) ?? []).length, 1);
  }

  assert.equal((allTools.match(/<AdPlaceholder slot="home_all_tools_banner"/g) ?? []).length, 1);
  assert.doesNotMatch(`${adSlots}\n${home}\n${allTools}`, /adsbygoogle|googlesyndication|doubleclick|publisherId|slotId/i);
});
