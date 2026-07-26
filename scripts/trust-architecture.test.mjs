import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const text = (path) => readFileSync(path, "utf8");
const routes = text("app/routes.ts");
const registry = text("app/client/data/routeRegistry.ts");
const sitemap = text("public/sitemap.xml");
const footer = text("app/client/components/navigation/Footer.tsx");
const about = text("app/routes/about.tsx");
const methodology = text("app/routes/methodology.tsx");
const generatedPages = text("app/client/components/generated/GeneratedPages.tsx");
const guideConfigs = text("app/client/data/generatedRouteConfigs.ts");
const byline = text("app/client/components/content/AuthorAttribution.tsx");

function routePaths() {
  return [
    "/",
    ...[...routes.matchAll(/route\("([^"]+)"/g)].map((match) => `/${match[1]}`),
  ];
}

function sitemapPaths() {
  return [...sitemap.matchAll(/<loc>https:\/\/www\.rentconverter\.com([^<]*)<\/loc>/g)].map(
    (match) => match[1] || "/",
  );
}

test("methodology is a registered, indexable canonical route with sitemap and footer discovery", () => {
  const paths = routePaths();
  const urls = sitemapPaths();
  const redirects = [...registry.matchAll(/\{ from: "([^"]+)", to: "([^"]+)" \}/g)];

  assert.equal(paths.length, 60);
  assert.equal(redirects.length, 112);
  assert.equal(paths.length + redirects.length, 172);
  assert.equal(urls.length, 60);
  assert.equal(new Set(urls).size, 60);
  assert.ok(paths.includes("/methodology"));
  assert.ok(urls.includes("/methodology"));
  assert.match(registry, /item\("\/methodology", "Calculation methodology"/);
  assert.match(footer, /\{ label: "Methodology", to: "\/methodology" \}/);
  assert.match(about, /to="\/methodology"/);
  assert.match(methodology, /path: "\/methodology"/);
  assert.match(methodology, /<h1/);
  assert.match(methodology, /weekly to monthly = weekly amount × 365 ÷ 7 ÷ 12/);
  assert.match(methodology, /monthly to weekly = monthly amount × 12 × 7 ÷ 365/);
});

test("About uses the supplied profile image and approved creator facts only", () => {
  assert.ok(existsSync("app/client/assets/images/suhas.jpg"));
  assert.match(about, /import profileImage from "~\/client\/assets\/images\/suhas\.jpg"/);
  assert.match(about, /alt="Suhas Sunder, creator of RentConverter"/);
  assert.match(about, /width=\{360\}/);
  assert.match(about, /height=\{360\}/);
  assert.match(about, /Creator and maintainer of RentConverter/);
  assert.match(about, /Software engineer/);
  assert.match(about, /React, TypeScript, Node\.js/);
  assert.doesNotMatch(about, /Ontario Tech|alumniOf|sameAs|degree|graduat|award|certif|advisor|accountant|lawyer|property manager/i);
  assert.doesNotMatch(about, /[A-Z]:\\|PROJECTS-and-WORK|work-projects/i);
});

test("About emits one restrained ProfilePage with the approved Person identity", () => {
  assert.equal((about.match(/"@type": "ProfilePage"/g) ?? []).length, 1);
  assert.match(about, /mainEntity:/);
  assert.match(about, /name: "Suhas Sunder"/);
  assert.match(about, /jobTitle: "Software Engineer"/);
  assert.match(about, /image: imageUrl/);
  assert.match(about, /url: PAGE_URL/);
  assert.doesNotMatch(about, /"@type": "(?:WebApplication|FAQPage|AboutPage|Organization)"/);
});

test("only the retained editorial guides receive the reusable author attribution and Article schema", () => {
  for (const path of ["/what-does-pcm-mean-rent", "/what-does-pw-mean-rent"]) {
    assert.match(
      guideConfigs,
      new RegExp(`"${path}":\\s*\\{[\\s\\S]*?authorAttribution: true`),
      `${path} config includes author attribution`,
    );
  }
  assert.match(generatedPages, /<AuthorAttribution \/>/);
  assert.match(generatedPages, /"@type": "Article"/);
  assert.match(byline, /<aside/);
  assert.match(byline, /Written and maintained by Suhas Sunder/);
  assert.match(byline, /to="\/about"/);
  assert.match(byline, /to="\/methodology"/);
  assert.doesNotMatch(byline, /<img|expert reviewed|reviewed by/i);
});

test("trust pages keep legal, financial, and tenancy limitations explicit", () => {
  assert.match(about, /does not provide legal, financial, tax, or\s+accounting advice/i);
  assert.match(about, /tenancy-law or lease interpretation/i);
  assert.match(methodology, /do not establish legal permission/i);
  assert.match(methodology, /current primary-source review/i);
  assert.match(methodology, /not an account and does not synchronize/i);
});
