import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const text = (path) => readFileSync(path, "utf8");
const slots = text("app/client/data/adSlots.ts");
const placeholder = text("app/client/components/advertising/AdPlaceholder.tsx");
const home = text("app/routes/home.tsx");
const allTools = text("app/client/components/navigation/AllRentalToolsLinks.tsx");
const nav = text("app/client/components/navigation/NavBar.tsx");
const registry = text("app/client/data/routeRegistry.ts");
const sitemap = text("public/sitemap.xml");

const requiredSlots = [
  "home_top_banner",
  "home_left_sidebar",
  "home_right_sidebar",
  "home_below_utility_banner",
  "home_seo_square",
  "home_all_tools_banner",
];

test("homepage advertising slots are centralized, static, and provider-agnostic", () => {
  for (const slot of requiredSlots) {
    assert.equal(
      (slots.match(new RegExp(`^  ${slot}:`, "gm")) ?? []).length,
      1,
      `${slot} is configured exactly once`,
    );
  }

  assert.equal(
    (allTools.match(/<AdPlaceholder slot="home_all_tools_banner"/g) ?? []).length,
    1,
    "All Tools banner renders once in the homepage-only All Tools component",
  );

  assert.match(slots, /desktop: \{ width:/);
  assert.match(slots, /mobile:/);
  assert.match(slots, /visibility:/);
  assert.match(slots, /print: "hidden"/);
  assert.match(placeholder, /data-nosnippet/);
  assert.match(placeholder, /print:hidden/);
  assert.match(placeholder, /Advertisement/);
  assert.doesNotMatch(placeholder, /<(?:a|button)\b/i);
  assert.doesNotMatch(`${slots}\n${placeholder}`, /adsbygoogle|doubleclick|googlesyndication|publisherId|slotId|document\.cookie|localStorage|fetch\(/i);
});

test("all six homepage slots use the requested stable placement order", () => {
  for (const slot of requiredSlots.filter((slot) => slot !== "home_all_tools_banner")) {
    assert.equal(
      (home.match(new RegExp(`<AdPlaceholder slot="${slot}"`, "g")) ?? []).length,
      1,
      `${slot} renders once on the homepage`,
    );
  }

  assert.equal(
    (allTools.match(/<AdPlaceholder slot="home_all_tools_banner"/g) ?? []).length,
    1,
    "All Tools banner renders once in the homepage-only All Tools component",
  );

  const top = home.indexOf('slot="home_top_banner"');
  const converter = home.indexOf('id="converter"');
  const left = home.indexOf('slot="home_left_sidebar"');
  const right = home.indexOf('slot="home_right_sidebar"');
  const below = home.indexOf('slot="home_below_utility_banner"');
  const howItWorks = home.indexOf("<HowItWorks />");
  const square = home.indexOf('slot="home_seo_square"');
  const faq = home.indexOf('id="faq"');
  const allToolsSlot = allTools.indexOf('slot="home_all_tools_banner"');
  const toolGroups = allTools.indexOf("toolDirectorySections.map");

  assert.ok(top < converter, "top banner precedes the primary utility");
  assert.ok(left > converter && right > converter, "sidebar DOM follows the utility while grid columns flank it visually");
  assert.ok(below > converter && below < howItWorks, "below-utility banner follows the complete utility");
  assert.ok(square > howItWorks && square < faq, "square slot is in informational content before FAQs");
  assert.ok(allToolsSlot > toolGroups, "All Tools banner follows the tool groups");
  assert.match(home, /data-home-utility-layout/);
  assert.match(home, /min-\[1280px\]:grid-cols-\[160px_minmax\(0,1fr\)_160px\]/);
  assert.match(home, /hidden min-\[1280px\]:col-start-1/);
  assert.match(home, /hidden min-\[1280px\]:col-start-3/);
  assert.doesNotMatch(home, /<form[\s\S]*?<AdPlaceholder/s);
});

test("homepage discovery uses canonical routes without duplicate directory entries", () => {
  assert.match(registry, /const compactNavSections/);
  assert.match(registry, /title: "Rent conversion"/);
  assert.match(registry, /title: "Sharing and dates"/);
  assert.match(registry, /title: "Australia"/);
  assert.match(registry, /title: "Rent converters",[\s\S]*?links: frequencyConverters/);
  assert.match(registry, /title: "PW and PCM glossary",[\s\S]*?links: pwPcmSection/);
  assert.match(registry, /alreadyListed/);
  assert.match(nav, /"\/rent-increase-calculator"/);
  assert.match(nav, /"\/rent-split-calculator"/);
  assert.match(nav, /lg:hidden/);
  assert.match(nav, /hidden items-center gap-1 text-sm lg:flex/);

  const redirectPaths = [...registry.matchAll(/\{ from: "([^"]+)", to: "([^"]+)" \}/g)].map(
    (match) => match[1],
  );
  const directoryPaths = [...registry.matchAll(/item\("(\/[^"]+)"/g)].map((match) => match[1]);
  for (const path of redirectPaths) {
    assert.ok(!directoryPaths.includes(path), `${path} is not promoted as a canonical directory item`);
  }

  const sitemapUrls = [...sitemap.matchAll(/<loc>https:\/\/www\.rentconverter\.com([^<]*)<\/loc>/g)].map(
    (match) => match[1] || "/",
  );
  assert.equal(sitemapUrls.length, 60);
  assert.equal(new Set(sitemapUrls).size, 60);
});
