import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SITE_ORIGIN = "https://www.rentconverter.com";
const localOrigin = process.env.AUDIT_ORIGIN ?? "http://127.0.0.1:3011";
const outputPath = process.env.PAGE_QUALITY_REPORT ?? "SEO_PAGE_QUALITY_AUDIT.md";
const jsonOutputPath = process.env.PAGE_QUALITY_JSON ?? ".codex-qa/page-quality-audit.json";

const genericPathWords = new Set([
  "calculator",
  "converter",
  "rent",
  "monthly",
  "weekly",
  "annual",
  "biweekly",
  "daily",
  "hourly",
  "page",
  "the",
  "and",
  "for",
  "with",
  "from",
  "into",
  "your",
]);

function decodeHtml(value = "") {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizePath(path) {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "") || "/";
}

function escapeCell(value = "") {
  return String(value).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function localUrl(path) {
  return `${localOrigin}${path === "/" ? "" : path}`;
}

function htmlLocToPath(loc) {
  const url = new URL(loc);
  return normalizePath(url.pathname);
}

function readSitemapPaths() {
  const xml = fs.readFileSync("public/sitemap.xml", "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    htmlLocToPath(match[1]),
  );
}

function readRouteMap() {
  const routes = fs.readFileSync("app/routes.ts", "utf8");
  const entries = new Map();
  if (/index\("routes\/home\.tsx"\)/.test(routes)) {
    entries.set("/", "app/routes/home.tsx");
  }
  for (const match of routes.matchAll(/route\("([^"]+)",\s*"([^"]+)"\)/g)) {
    entries.set(normalizePath(`/${match[1]}`), `app/${match[2]}`);
  }
  return entries;
}

function classifyRoute(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return "unknown";
  const source = fs.readFileSync(filePath, "utf8");
  if (/redirect\(|redirectTo|throw redirect/.test(source)) return "redirect";
  if (/Generated|generatedRouteConfigs|createGenerated/.test(source)) return "generated";
  if (/IntentLandingPage/.test(source)) return "intent-landing";
  return "custom";
}

function extractAttr(tag = "", name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"));
  return match ? decodeHtml(match[1]) : "";
}

function stripTags(html = "") {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function extractMainHtml(html) {
  const match = html.match(/<main\b[\s\S]*?<\/main>/i);
  return match ? match[0] : html;
}

function words(text = "") {
  return text.match(/[A-Za-z0-9$%]+(?:['-][A-Za-z0-9$%]+)?/g) ?? [];
}

function extractHeadings(mainHtml) {
  return [...mainHtml.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(
    (match) => ({
      level: Number(match[1]),
      text: stripTags(match[2]),
    }),
  );
}

function extractJsonLd(html) {
  const schemas = [];
  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const parsed = JSON.parse(decodeHtml(match[1].trim()));
      if (Array.isArray(parsed)) schemas.push(...parsed);
      else if (parsed) schemas.push(parsed);
    } catch {
      schemas.push({ "@type": "InvalidJsonLd" });
    }
  }
  return schemas;
}

function schemaTypes(schemas) {
  return schemas.flatMap((schema) => {
    const type = schema?.["@type"];
    return Array.isArray(type) ? type : type ? [type] : [];
  });
}

function extractInternalLinks(html) {
  return [
    ...new Set(
      [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)]
        .map((match) => match[1])
        .filter((href) => href.startsWith("/") && !href.startsWith("//"))
        .map((href) => normalizePath(href.split("#")[0].split("?")[0]))
        .filter(Boolean),
    ),
  ];
}

function routeTokens(path, title, h1) {
  return [
    ...new Set(
      `${path} ${title} ${h1}`
        .toLowerCase()
        .replace(/[^a-z0-9$]+/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 2 && !genericPathWords.has(token)),
    ),
  ];
}

function firstTextSpecificity(path, title, h1, firstWords) {
  const tokenSet = new Set(firstWords.toLowerCase().split(/\s+/));
  const tokens = routeTokens(path, title, h1);
  const hits = tokens.filter((token) => tokenSet.has(token)).length;
  if (tokens.length === 0) return "unknown";
  if (hits >= Math.min(2, tokens.length)) return "specific";
  return "generic-risk";
}

function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((item) => setB.has(item)).length;
  const union = new Set([...setA, ...setB]).size;
  return union ? intersection / union : 0;
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

export function assessPage(page) {
  const failures = [];
  const reviewSignals = [];
  const isSupport = ["/about", "/contact", "/privacy-policy", "/cookies", "/terms-of-service", "/sitemap", "/methodology"].includes(page.path);
  const isHome = page.path === "/";

  if (page.status !== 200) failures.push(`HTTP ${page.status}, expected 200`);
  if (page.redirected) failures.push("sitemap URL redirects instead of serving its canonical page");
  if (!page.title || !page.description || !page.canonical || !page.h1) {
    failures.push("missing core metadata or H1");
  }
  if (page.canonical && page.canonical !== page.url) failures.push("canonical does not match the intended URL");
  if (page.h1Count !== 1) failures.push(`expected one H1, found ${page.h1Count}`);
  if (/noindex/i.test(page.robots ?? "")) failures.push("noindexed page appears in XML sitemap");
  if (page.schemaTypes.includes("InvalidJsonLd")) failures.push("invalid JSON-LD");
  if (page.title && page.h1 && !page.title.toLowerCase().includes(page.h1.toLowerCase().slice(0, 18)) && !page.h1.toLowerCase().includes(page.title.toLowerCase().split("|")[0].slice(0, 18))) {
    reviewSignals.push("title/H1 alignment should be checked");
  }
  if (!isSupport && !page.hasHowWorks) reviewSignals.push("methodology wording not detected; inspect actual explanation");
  if (!isSupport && !page.hasWorkedExample) reviewSignals.push("example wording not detected; verify whether an example would help the task");
  if (!isSupport && !page.hasLimitations) reviewSignals.push("assumptions/limitations wording not detected");
  if (page.fullDirectoryCount > 0 && !isHome) failures.push("full all-tools directory appears outside home");
  if (!isHome && page.internalLinkCount > 28) reviewSignals.push(`possibly directory-like internal link count (${page.internalLinkCount})`);
  if (!isSupport && page.first250Specificity === "generic-risk") reviewSignals.push("few route-specific tokens in first 250 words; inspect intent rather than adding keywords");
  if (/ontario|california|quebec|bc-|australia|melbourne|sydney/.test(page.path) && !/rules vary|official|lease|reviewed|authority|check/i.test(page.text)) {
    reviewSignals.push("regional caveat wording not detected; verify claims against dated primary sources");
  }
  if (page.nearestSimilarPath && page.nearestSimilarity >= 0.78 && !isSupport) {
    reviewSignals.push(`similar first-250 text to ${page.nearestSimilarPath} (${page.nearestSimilarity.toFixed(2)}); compare tasks before any consolidation`);
  }

  return {
    structuralStatus: failures.length ? "FAIL" : "NO DETECTED FAILURE",
    failures,
    reviewSignals,
    humanValueStatus: "NOT ASSESSED",
  };
}

async function crawlPage(path, routeMap) {
  const response = await fetch(localUrl(path), { signal: AbortSignal.timeout(30_000) });
  const html = await response.text();
  const mainHtml = extractMainHtml(html);
  const mainText = stripTags(mainHtml);
  const pageWords = words(mainText);
  const headings = extractHeadings(mainHtml);
  const title = stripTags(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const descriptionTag = html.match(/<meta\b[^>]*name=["']description["'][^>]*>/i)?.[0] ?? "";
  const canonicalTag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] ?? "";
  const h1 = headings.find((heading) => heading.level === 1)?.text ?? "";
  const textLower = mainText.toLowerCase();
  const schemas = extractJsonLd(html);
  const types = schemaTypes(schemas);
  const first250 = pageWords.slice(0, 250).join(" ");
  const file = routeMap.get(path) ?? "";

  return {
    path,
    url: `${SITE_ORIGIN}${path === "/" ? "" : path}`,
    status: response.status,
    redirected: response.redirected,
    file,
    source: classifyRoute(file),
    title,
    description: extractAttr(descriptionTag, "content"),
    canonical: extractAttr(canonicalTag, "href"),
    h1,
    h1Count: headings.filter((heading) => heading.level === 1).length,
    robots: extractAttr(html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/i)?.[0] ?? "", "content"),
    responseRobots: response.headers.get("x-robots-tag") ?? "",
    ogUrl: extractAttr(html.match(/<meta\b[^>]*property=["']og:url["'][^>]*>/i)?.[0] ?? "", "content"),
    visibleWordCount: pageWords.length,
    headings,
    headingText: headings.map((heading) => `H${heading.level}: ${heading.text}`),
    faqCount: (mainText.match(/Frequently Asked Questions/gi) ?? []).length,
    internalLinkCount: extractInternalLinks(html).length,
    hasHowWorks: includesAny(textLower, [
      /how this (calculator|answer|page|result) works/i,
      /how this .* is calculated/i,
      /how it works/i,
      /formula/i,
      /methodology/i,
    ]),
    hasWorkedExample: includesAny(textLower, [
      /worked example/i,
      /example/i,
      /for example/i,
      /scenario/i,
    ]),
    hasLimitations: includesAny(textLower, [
      /what this result does not include/i,
      /what this .* does not include/i,
      /does not include/i,
      /limitations/i,
      /assumptions/i,
      /not legal/i,
      /not financial/i,
      /lease controls/i,
      /rules vary/i,
      /check your lease/i,
    ]),
    schemaTypes: types,    schemaUrls: schemas.flatMap((schema) => [schema, ...(schema["@graph"] ?? [])]).filter((schema) => ["WebPage", "WebApplication", "Article"].includes(schema["@type"])).map((schema) => ({ type: schema["@type"], url: schema.url ?? schema.mainEntityOfPage ?? "" })),    internalLinks: extractInternalLinks(html),
    fullDirectoryCount: (html.match(/id=["']all-tools["']/gi) ?? []).length,
    first250,
    first250Specificity: firstTextSpecificity(path, title, h1, first250),
    text: mainText,
  };
}

function writeReport(pages) {
  const failed = pages.filter((page) => page.failures.length);
  const lines = [
    "# Page structure and human-review evidence",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Origin crawled: ${localOrigin}`,
    `Sitemap pages crawled: ${pages.length}`,
    "",
    `Structural failures: ${failed.length} pages. Human-value assessments: 0 completed by this crawler.`,
    "",
    "This crawler cannot establish usefulness, originality, correctness of calculations, accessibility, search recovery, or AdSense eligibility. Word and FAQ counts are descriptive inventory only; neither a minimum word count nor a low similarity score qualifies a page for release. A clean structural report is not human acceptance.",
    "",
    "## Required human evidence before acceptance",
    "",
    "For every candidate record the user task, nearest competing page and functional difference, before/after browser task results, input errors and keyboard behavior, five viewport screenshots, JavaScript-disabled fallback, print/export, independent numerical examples, and dated primary sources for regional claims. Record reviewer, exact tested SHA, immutable preview, remaining issues and owner decision. Missing evidence means NOT ASSESSED, never pass.",
    "",
    "## Structural failures",
    "",
    "| URL | Failures |",
    "| --- | --- |",
    ...failed.map((page) => `| ${page.path} | ${escapeCell(page.failures.join("; "))} |`),
    ...(failed.length ? [] : ["| — | No detected structural failures; human acceptance remains pending. |"]),
    "",
    "## Editorial inspection signals (not automatic defects)",
    "",
    "Signals identify where a person should inspect task fit. Do not add filler, keywords, FAQs or citations merely to silence them. Similar wording is not proof that two tools solve the same task.",
    "",
    "| URL | Inspect | Nearest text match |",
    "| --- | --- | --- |",
    ...pages.filter((page) => page.reviewSignals.length).map((page) => `| ${page.path} | ${escapeCell(page.reviewSignals.join("; "))} | ${page.nearestSimilarPath} |`),
    "",
    "## Full page inventory",
    "",
    "| URL | HTTP | Structure | Human value | Title | Description | Canonical | H1 | Robots | Schema | Source | Words (descriptive only) | Links |",
    "| --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: |",
    ...pages.map((page) => `| ${page.path} | ${page.status} | ${page.structuralStatus} | ${page.humanValueStatus} | ${escapeCell(page.title)} | ${escapeCell(page.description)} | ${page.canonical} | ${escapeCell(page.h1)} | ${escapeCell(page.robots || "default index/follow")} | ${escapeCell([...new Set(page.schemaTypes)].join(", "))} | ${page.source} | ${page.visibleWordCount} | ${page.internalLinkCount} |`),
    "",
  ];
  fs.mkdirSync(dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${lines.join("\n")}\n`);
}

async function main() {
  const routeMap = readRouteMap();
  const paths = readSitemapPaths();
  const pages = [];
  for (const path of paths) {
    pages.push(await crawlPage(path, routeMap));
  }

  for (const page of pages) {
    const pageTokens = words(page.first250.toLowerCase()).filter((word) => word.length > 3);
    let nearest = { path: "", score: 0 };
    for (const other of pages) {
      if (other.path === page.path) continue;
      const otherTokens = words(other.first250.toLowerCase()).filter((word) => word.length > 3);
      const score = jaccard(pageTokens, otherTokens);
      if (score > nearest.score) nearest = { path: other.path, score };
    }
    page.nearestSimilarPath = nearest.path;
    page.nearestSimilarity = nearest.score;
  }

  for (const page of pages) {
    Object.assign(page, assessPage(page));
    delete page.text;
  }

  writeReport(pages);
  fs.mkdirSync(dirname(jsonOutputPath), { recursive: true });
  fs.writeFileSync(jsonOutputPath, `${JSON.stringify(pages, null, 2)}\n`);

  const failed = pages.filter((page) => page.failures.length).length;
  console.log(`Crawled ${pages.length} pages. Structural failures: ${failed}. Human value: NOT ASSESSED. Report: ${outputPath}`);
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
