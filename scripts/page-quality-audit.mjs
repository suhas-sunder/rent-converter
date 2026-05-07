import fs from "node:fs";

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

function scorePage(page) {
  const reasons = [];
  const isSupport = ["/about", "/contact", "/privacy-policy", "/cookies", "/terms-of-service", "/sitemap"].includes(page.path);
  const isHome = page.path === "/";

  if (!page.title || !page.description || !page.canonical || !page.h1) {
    reasons.push("missing core metadata or H1");
  }
  if (page.title && page.h1 && !page.title.toLowerCase().includes(page.h1.toLowerCase().slice(0, 18)) && !page.h1.toLowerCase().includes(page.title.toLowerCase().split("|")[0].slice(0, 18))) {
    reasons.push("title/H1 alignment should be checked");
  }
  if (!isSupport && !isHome && page.visibleWordCount < 550) {
    reasons.push(`low visible word count (${page.visibleWordCount})`);
  }
  if (!isSupport && !page.hasHowWorks) reasons.push("missing clear how-this-works/methodology section");
  if (!isSupport && !page.hasWorkedExample) reasons.push("missing worked example signal");
  if (!isSupport && !page.hasLimitations) reasons.push("missing assumptions/limitations signal");
  if (page.fullDirectoryCount > 0 && !isHome) reasons.push("full all-tools directory appears outside home");
  if (!isHome && page.internalLinkCount > 28) reasons.push(`possibly directory-like internal link count (${page.internalLinkCount})`);
  if (!isSupport && page.first250Specificity === "generic-risk") reasons.push("first 250 visible words look generic");
  if (/ontario|california|quebec|bc-|australia|melbourne|sydney/.test(page.path) && !/rules vary|official|lease|reviewed|authority|check/i.test(page.text)) {
    reasons.push("regional caveat not visible");
  }
  if (page.nearestSimilarPath && page.nearestSimilarity >= 0.78 && !isSupport) {
    reasons.push(`high first-250 similarity to ${page.nearestSimilarPath} (${page.nearestSimilarity.toFixed(2)})`);
  }

  const risk = reasons.length >= 4 || reasons.some((reason) => reason.startsWith("full all-tools") || reason.startsWith("missing core"))
    ? "High"
    : reasons.length >= 2
      ? "Medium"
      : "Low";

  return { risk, reasons };
}

async function crawlPage(path, routeMap) {
  const response = await fetch(localUrl(path));
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
    file,
    source: classifyRoute(file),
    title,
    description: extractAttr(descriptionTag, "content"),
    canonical: extractAttr(canonicalTag, "href"),
    h1,
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
    schemaTypes: types,
    fullDirectoryCount: (html.match(/id=["']all-tools["']/gi) ?? []).length,
    first250,
    first250Specificity: firstTextSpecificity(path, title, h1, first250),
    text: mainText,
  };
}

function writeReport(pages) {
  const counts = pages.reduce(
    (acc, page) => {
      acc[page.risk] += 1;
      acc[page.source] = (acc[page.source] ?? 0) + 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 },
  );

  const lines = [];
  lines.push("# SEO Page Quality Audit");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Origin crawled: ${localOrigin}`);
  lines.push(`Pages crawled: ${pages.length}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- High risk: ${counts.High}`);
  lines.push(`- Medium risk: ${counts.Medium}`);
  lines.push(`- Low risk: ${counts.Low}`);
  lines.push(`- Custom/manual routes: ${counts.custom ?? 0}`);
  lines.push(`- Generated routes: ${counts.generated ?? 0}`);
  lines.push(`- Intent landing routes: ${counts["intent-landing"] ?? 0}`);
  lines.push("");

  for (const risk of ["High", "Medium"]) {
    const group = pages.filter((page) => page.risk === risk);
    lines.push(`## ${risk} Risk Pages`);
    lines.push("");
    if (!group.length) {
      lines.push("None.");
      lines.push("");
      continue;
    }
    lines.push("| URL | Source | Words | Links | Reasons |");
    lines.push("| --- | --- | ---: | ---: | --- |");
    for (const page of group) {
      lines.push(
        `| ${page.path} | ${page.source} | ${page.visibleWordCount} | ${page.internalLinkCount} | ${escapeCell(page.reasons.join("; "))} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Full Page Inventory");
  lines.push("");
  lines.push("| URL | Risk | Source | Title | Description | Canonical | H1 | Words | Headings | FAQ | Links | How works | Example | Limitations | Related links | Schema | Directory | First 250 |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | ---: | --- | ---: | ---: | --- | --- | --- | --- | --- | ---: | --- |");
  for (const page of pages) {
    const relatedQuality = page.fullDirectoryCount > 0
      ? "directory"
      : page.internalLinkCount > 28 && page.path !== "/"
        ? "broad"
        : "focused";
    lines.push(
      `| ${page.path} | ${page.risk} | ${page.source} | ${escapeCell(page.title)} | ${escapeCell(page.description)} | ${escapeCell(page.canonical)} | ${escapeCell(page.h1)} | ${page.visibleWordCount} | ${escapeCell(page.headingText.slice(0, 12).join("; "))} | ${page.faqCount} | ${page.internalLinkCount} | ${page.hasHowWorks ? "yes" : "no"} | ${page.hasWorkedExample ? "yes" : "no"} | ${page.hasLimitations ? "yes" : "no"} | ${relatedQuality} | ${escapeCell([...new Set(page.schemaTypes)].join(", "))} | ${page.fullDirectoryCount} | ${page.first250Specificity} |`,
    );
  }
  lines.push("");

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
    const score = scorePage(page);
    page.risk = score.risk;
    page.reasons = score.reasons;
    delete page.text;
  }

  writeReport(pages);
  fs.mkdirSync(".codex-qa", { recursive: true });
  fs.writeFileSync(jsonOutputPath, `${JSON.stringify(pages, null, 2)}\n`);

  const high = pages.filter((page) => page.risk === "High").length;
  const medium = pages.filter((page) => page.risk === "Medium").length;
  console.log(`Crawled ${pages.length} pages. High risk: ${high}. Medium risk: ${medium}. Report: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
