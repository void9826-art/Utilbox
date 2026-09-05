/**
 * Crawls every URL in the sitemap against a running server and checks the
 * things a search engine actually looks at: a unique title, a unique
 * description, a self-referencing canonical, exactly one H1, Open Graph tags,
 * well-formed structured data, and no link pointing at a 404.
 *
 * Run with the production server up:  node scripts/audit-seo.mjs
 */
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";

const problems = [];
const fail = (url, rule, detail = "") => problems.push({ url, rule, detail });

const get = async (path) => {
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return { status: res.status, html: await res.text() };
};

const one = (html, re) => html.match(re)?.[1]?.trim() ?? null;
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));

/* --- the URL set, taken from the app's own sitemap ------------------- */
const sitemapXml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const locs = all(sitemapXml, /<loc>([^<]+)<\/loc>/g);
if (locs.length === 0) throw new Error("sitemap.xml produced no URLs");

const paths = locs.map((loc) => new URL(loc).pathname);
const origin = new URL(locs[0]).origin;

const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();
const internalLinks = new Set();

console.log(`Crawling ${paths.length} sitemap URLs at ${BASE}\n`);

for (const path of paths) {
  const { status, html } = await get(path);
  if (status !== 200) {
    fail(path, "not 200", String(status));
    continue;
  }

  /* --- title --- */
  const title = one(html, /<title>([^<]*)<\/title>/);
  if (!title) fail(path, "no <title>");
  else {
    // Measure what a person sees, not the source: "&amp;" is one character in
    // a search result but five in the markup.
    const shown = decode(title);
    if (shown.length > 65) fail(path, "title over 65 chars", `${shown.length}: ${shown}`);
    if (titles.has(title)) fail(path, "duplicate title", `also ${titles.get(title)}`);
    else titles.set(title, path);
  }

  /* --- description --- */
  const desc = one(html, /<meta name="description" content="([^"]*)"/);
  if (!desc) fail(path, "no meta description");
  else {
    const plain = decode(desc);
    if (plain.length < 70) fail(path, "description under 70 chars", `${plain.length}`);
    if (plain.length > 165) fail(path, "description over 165 chars", `${plain.length}`);
    if (descriptions.has(plain)) fail(path, "duplicate description", `also ${descriptions.get(plain)}`);
    else descriptions.set(plain, path);
  }

  /* --- canonical must be self-referencing --- */
  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
  if (!canonical) fail(path, "no canonical");
  else {
    const canonicalPath = new URL(canonical, origin).pathname;
    if (canonicalPath.replace(/\/$/, "") !== path.replace(/\/$/, "")) {
      fail(path, "canonical points elsewhere", canonical);
    }
    if (canonicals.has(canonical)) fail(path, "duplicate canonical", `also ${canonicals.get(canonical)}`);
    else canonicals.set(canonical, path);
  }

  /* --- indexability --- */
  const robots = one(html, /<meta name="robots" content="([^"]*)"/);
  if (robots && /noindex/.test(robots)) fail(path, "noindex on an indexable page", robots);

  /* --- headings --- */
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
  if (h1s.length !== 1) fail(path, "h1 count is not 1", String(h1s.length));

  // Heading order, over the whole served document. The browser audit only sees
  // one page at a time; this sees all 87, and catches a tool that opens with an
  // h3 under the page h1.
  let previous = 0;
  for (const [, level, inner] of html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g)) {
    const depth = Number(level);
    if (previous && depth > previous + 1) {
      const label = decode(inner.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().slice(0, 40);
      fail(path, "heading level skipped", `h${depth} after h${previous}: ${label}`);
    }
    previous = depth;
  }

  /* --- Open Graph and Twitter --- */
  for (const property of ["og:title", "og:description", "og:url", "og:type", "og:image"]) {
    if (!new RegExp(`property="${property}"`).test(html)) fail(path, `missing ${property}`);
  }
  if (!/name="twitter:card"/.test(html)) fail(path, "missing twitter:card");

  /* --- structured data --- */
  const blocks = all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  if (blocks.length === 0) fail(path, "no JSON-LD");
  const types = [];
  for (const block of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(block);
    } catch (error) {
      fail(path, "JSON-LD does not parse", String(error).slice(0, 80));
      continue;
    }
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!node["@context"]) fail(path, "JSON-LD node has no @context");
      if (!node["@type"]) fail(path, "JSON-LD node has no @type");
      types.push(node["@type"]);
    }
  }
  if (path.split("/").filter(Boolean).length === 2 && !types.includes("BreadcrumbList")) {
    fail(path, "tool page has no BreadcrumbList", types.join(", "));
  }

  /* --- collect internal links --- */
  for (const href of all(html, /<a[^>]+href="([^"]+)"/g)) {
    if (href.startsWith("/") && !href.startsWith("//")) internalLinks.add(href.split("#")[0]);
  }
}

/* --- every internal link must resolve -------------------------------- */
console.log(`Checking ${internalLinks.size} distinct internal link targets\n`);
const known = new Set(paths);
for (const href of internalLinks) {
  if (known.has(href) || href === "") continue;
  const res = await fetch(`${BASE}${href}`, { method: "GET", redirect: "manual" });
  if (res.status >= 400) fail(href, "internal link is broken", String(res.status));
}

/* --- orphans: every sitemap URL must be linked from somewhere --------- */
for (const path of paths) {
  if (path === "/") continue;
  if (!internalLinks.has(path)) fail(path, "orphan — in the sitemap but linked from nowhere");
}

/* --- robots.txt ------------------------------------------------------- */
const robotsTxt = await (await fetch(`${BASE}/robots.txt`)).text();
if (!/Sitemap:/i.test(robotsTxt)) fail("/robots.txt", "does not point at the sitemap");
if (/^Disallow: \/$/m.test(robotsTxt)) fail("/robots.txt", "disallows the whole site");

/* --- report ----------------------------------------------------------- */
if (problems.length === 0) {
  console.log(`SEO AUDIT CLEAN — ${paths.length} pages, ${internalLinks.size} link targets`);
} else {
  for (const p of problems) console.log(`FAIL  ${p.url}  ${p.rule}  ${p.detail}`);
  console.log(`\n${problems.length} SEO PROBLEMS`);
  process.exit(1);
}
