import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";

const redirects = {
  "/rent-after-increase-calculator": "/rent-increase-calculator",
  "/annual-rent-increase-calculator": "/rent-increase-calculator",
  "/monthly-rent-increase-calculator": "/rent-increase-calculator",
  "/rent-increase-formula": "/rent-increase-calculator",
  "/cpi-rent-increase-calculator": "/rent-increase-calculator",
  "/rent-escalation-calculator": "/compound-rent-increase-calculator",
};

const retargetedAlias = {
  "/rent-after-increase": "/rent-increase-calculator",
};

const retained = [
  "/rent-increase-calculator",
  "/rent-increase-percentage-calculator",
  "/compound-rent-increase-calculator",
];

const regional = [
  "/bc-rent-increase-calculator",
  "/ontario-rent-increase-calculator",
  "/quebec-rent-increase-calculator",
  "/california-rent-increase-calculator",
];

const routesSource = readFileSync("app/routes.ts", "utf8");
const registrySource = readFileSync("app/client/data/routeRegistry.ts", "utf8");
const canonicalRegistrySource = registrySource.split(
  "export const redirectAliases",
)[0];
const sitemapSource = readFileSync("public/sitemap.xml", "utf8");
const configsSource = readFileSync(
  "app/client/data/generatedRouteConfigs.ts",
  "utf8",
);
const generatedPagesSource = readFileSync(
  "app/client/components/generated/GeneratedPages.tsx",
  "utf8",
);
const homeSource = readFileSync("app/routes/home.tsx", "utf8");
const navSource = readFileSync(
  "app/client/components/navigation/NavBar.tsx",
  "utf8",
);
const directorySource = readFileSync(
  "app/client/components/navigation/AllRentalToolsLinks.tsx",
  "utf8",
);
const htmlSitemapSource = readFileSync("app/routes/sitemap.tsx", "utf8");
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

test("six non-regional clones remain registered as direct query-preserving 301 redirects", () => {
  assert.equal(Object.keys(redirects).length, 6);
  const redirectSources = new Set([
    ...Object.keys(redirects),
    ...Object.keys(retargetedAlias),
  ]);

  assert.match(redirectHelperSource, /new URL\(request\.url\)/);
  assert.match(redirectHelperSource, /requestUrl\.search/);
  assert.match(redirectHelperSource, /status:\s*301/);

  for (const [source, target] of Object.entries(redirects)) {
    const slug = source.slice(1);
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(slug)}"`), source);
    const moduleSource = routeModule(source);
    assert.match(moduleSource, /permanentRedirectPreservingQuery/);
    assert.match(
      moduleSource,
      new RegExp(
        `permanentRedirectPreservingQuery\\(request,\\s*"${escapeRegex(target)}"\\)`,
      ),
      source,
    );
    assert.doesNotMatch(
      moduleSource,
      /export const meta|buildMeta|IncreaseToolPage|FAQ|schema|canonical|<h1/i,
      source,
    );
    assert.equal(redirectSources.has(target), false, `${source} must not chain`);
    assert.notEqual(source, target, `${source} must not loop`);
  }
});

test("rent-after-increase alias points directly to the surviving forward calculator", () => {
  for (const [source, target] of Object.entries(retargetedAlias)) {
    const moduleSource = routeModule(source);
    assert.match(moduleSource, /permanentRedirectPreservingQuery/);
    assert.match(
      moduleSource,
      new RegExp(
        `permanentRedirectPreservingQuery\\(request,\\s*"${escapeRegex(target)}"\\)`,
      ),
    );
    assert.match(
      registrySource,
      new RegExp(
        `\\{\\s*from:\\s*"${escapeRegex(source)}",\\s*to:\\s*"${escapeRegex(target)}"\\s*\\}`,
      ),
    );
  }
});

test("registry and discovery data exclude all retired canonical destinations", () => {
  const discoverySources = [
    canonicalRegistrySource,
    configsSource,
    generatedPagesSource,
    homeSource,
    navSource,
    directorySource,
    htmlSitemapSource,
  ];

  for (const [source, target] of Object.entries(redirects)) {
    const registryMatches = registrySource.match(
      new RegExp(
        `\\{\\s*from:\\s*"${escapeRegex(source)}",\\s*to:\\s*"${escapeRegex(target)}"\\s*\\}`,
        "g",
      ),
    );
    assert.equal(registryMatches?.length, 1, source);
    discoverySources.forEach((content) =>
      assert.doesNotMatch(content, new RegExp(`"${escapeRegex(source)}"`), source),
    );
    assert.doesNotMatch(
      sitemapSource,
      new RegExp(`<loc>[^<]*${escapeRegex(source)}</loc>`),
      source,
    );
  }
});

test("no active app link points to a retired route or alias", () => {
  const intentional = new Set([
    "app/routes.ts",
    "app/client/data/routeRegistry.ts",
    ...Object.keys(redirects).map((source) => `app/routes/${source.slice(1)}.tsx`),
    ...Object.keys(retargetedAlias).map((source) => `app/routes/${source.slice(1)}.tsx`),
  ]);
  const activeFiles = allSourceFiles("app").filter(
    (path) => /\.(?:ts|tsx)$/.test(path) && !intentional.has(path),
  );

  for (const path of activeFiles) {
    const source = readFileSync(path, "utf8");
    for (const retired of [
      ...Object.keys(redirects),
      ...Object.keys(retargetedAlias),
    ]) {
      assert.doesNotMatch(source, new RegExp(escapeRegex(retired)), `${path}: ${retired}`);
    }
  }
});

test("retained and regional calculators remain canonical HTTP-200 routes", () => {
  const canonicalDiscoverySource = `${canonicalRegistrySource}\n${configsSource}`;
  for (const path of [...retained, ...regional]) {
    assert.match(routesSource, new RegExp(`route\\("${escapeRegex(path.slice(1))}"`), path);
    assert.match(canonicalDiscoverySource, new RegExp(`"${escapeRegex(path)}"`), path);
    assert.doesNotMatch(routeModule(path), /permanentRedirectPreservingQuery/, path);
  }

  for (const path of retained.filter((path) => path !== "/compound-rent-increase-calculator")) {
    const source = routeModule(path);
    assert.match(
      source,
      new RegExp(`https:\\/\\/www\\.rentconverter\\.com${escapeRegex(path)}`),
      path,
    );
  }
  assert.match(
    configsSource,
    /path: "\/compound-rent-increase-calculator"/,
  );
  assert.match(
    routeModule("/compound-rent-increase-calculator"),
    /increaseToolConfigs\["\/compound-rent-increase-calculator"\]/,
  );
});

test("retained content covers forward, reverse, CPI-scenario, and compound scope", () => {
  const forward = readFileSync(
    "app/client/components/rent-increase-calculator/HowItWorks.tsx",
    "utf8",
  );
  const reverse = readFileSync(
    "app/client/components/rent-increase-percentage-calculator/HowItWorks.tsx",
    "utf8",
  );

  assert.match(forward, /current rent × percentage ÷ 100/);
  assert.match(forward, /New rent = current rent \+ fixed increase/);
  assert.match(forward, /does not retrieve official CPI data/);
  assert.match(forward, /supplied by you/);
  assert.match(forward, /arithmetic only/);
  assert.match(forward, /no jurisdictional cap is applied automatically/);
  assert.match(forward, /Verify any applicable CPI figure or legal rule separately/);
  assert.match(forward, /\$1,538 with a 7\.5% increase/);
  assert.match(forward, /\$800 rent with a \$70 increase/);

  assert.match(reverse, /starting rent and new rent/);
  assert.match(reverse, /\(new rent − old rent\) ÷ old rent × 100/);
  assert.match(reverse, /zero starting rent has no meaningful percentage/i);
  assert.match(reverse, /does not determine whether that change is legally permitted/);

  assert.match(configsSource, /annual percentage escalation/);
  assert.match(configsSource, /prior year’s rent/);
  assert.match(configsSource, /starting rent, final rent, and total increase/);
  assert.match(configsSource, /fixed-dollar, irregular, or custom annual schedules/);
  assert.match(configsSource, /calculate cumulative rent paid/);
});

test("retired generated modes, configs, and custom support components are removed", () => {
  for (const path of Object.keys(redirects).filter((path) => path !== "/rent-after-increase-calculator")) {
    assert.doesNotMatch(configsSource, new RegExp(`"${escapeRegex(path)}"`), path);
  }
  assert.doesNotMatch(generatedPagesSource, /FormulaIncreaseTool/);
  assert.doesNotMatch(generatedPagesSource, /"simple" \| "compound"|"cpi"|"escalation"|"formula"/);
  assert.equal(
    existsSync("app/client/components/rent-after-increase-calculator/HowItWorks.tsx"),
    false,
  );
  assert.equal(
    existsSync("app/client/components/rent-after-increase-calculator/ToolFit.tsx"),
    false,
  );
});

test("visible FAQs and FAQ schema remain sourced from the same retained arrays", () => {
  for (const path of [
    "/rent-increase-calculator",
    "/rent-increase-percentage-calculator",
  ]) {
    const source = routeModule(path);
    assert.equal((source.match(/"@type": "FAQPage"/g) ?? []).length, 1);
    assert.match(source, /mainEntity: faqData\.map/);
    assert.match(source, /faqData\.map\(\(f, i\)/);
  }
  assert.match(
    generatedPagesSource,
    /makePageSchemas\(\{ \.\.\.config, calculator: true, faq: config\.faq \}\)/,
  );
  assert.match(generatedPagesSource, /<Faq items=\{config\.faq\} \/>/);
});

test("final route and XML sitemap counts reflect six canonical-to-redirect changes", () => {
  const registered =
    (routesSource.match(/\broute\(/g) ?? []).length +
    (routesSource.match(/\bindex\(/g) ?? []).length;
  const redirectCount = [
    ...registrySource.matchAll(
      /\{\s*from:\s*"[^"]+",\s*to:\s*"[^"]+"\s*\}/g,
    ),
  ].length;
  const sitemapUrls = [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );

  assert.equal(registered, 171);
  assert.equal(redirectCount, 105);
  assert.equal(registered - redirectCount, 66);
  assert.equal(sitemapUrls.length, 66);
  assert.equal(new Set(sitemapUrls).size, 66);
  sitemapUrls.forEach((url) =>
    assert.match(url, /^https:\/\/www\.rentconverter\.com(?:\/|$)/),
  );
});
