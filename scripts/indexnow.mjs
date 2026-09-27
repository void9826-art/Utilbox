/**
 * Tells IndexNow search engines (Bing, Yandex, Seznam, Naver and others) which
 * pages changed, so they re-crawl them within hours instead of on their own
 * schedule. Google does not take part in IndexNow.
 *
 *   node scripts/indexnow.mjs --changed-since <commit>   pages changed since that commit
 *   node scripts/indexnow.mjs --all                      every page in the live sitemap
 *   node scripts/indexnow.mjs <url> [<url>…]             exactly these pages
 *   add --dry-run to print the list without submitting it
 *
 * Run it after a deployment is live, never during the build: a crawler that
 * arrives before the new version is served would index the old one. The
 * GitHub workflow in .github/workflows/indexnow.yml does this automatically.
 *
 * The key file in public/ is what proves this site sent the request. IndexNow
 * keys are public by design — the engines fetch the file to check it.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const SITE = (process.env.INDEXNOW_SITE_URL ?? "https://www.utilboxes.xyz").replace(/\/+$/, "");
const ENDPOINT = "https://api.indexnow.org/indexnow";
/** The protocol's own ceiling for one request. */
const MAX_URLS = 10_000;

const CATEGORIES = ["pdf", "calculators", "image", "converters", "generators", "text", "developer"];
const STATIC_PAGES = ["about", "contact", "privacy", "terms", "cookies"];

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

function fail(message) {
  console.error(`IndexNow: ${message}`);
  process.exit(1);
}

function git(...gitArgs) {
  return execFileSync("git", gitArgs, { encoding: "utf8" });
}

/* --- the key --------------------------------------------------------------- */
const keyFiles = fs.readdirSync("public").filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));
if (keyFiles.length !== 1) fail(`expected exactly one key file in public/, found ${keyFiles.length}.`);
const key = keyFiles[0].slice(0, -4);
const keyLocation = `${SITE}/${keyFiles[0]}`;

/* --- which paths changed --------------------------------------------------- */

/** Slugs in a registry or content file, in order, with the line each starts on. */
function slugStarts(file, pattern) {
  const lines = git("show", `HEAD:${file}`).split("\n");
  const starts = [];
  lines.forEach((line, index) => {
    const match = line.match(pattern);
    if (match) starts.push({ line: index + 1, slug: match[1] });
  });
  return starts;
}

/** New-file line numbers touched by the diff, including where lines were only removed. */
function changedLines(from, file) {
  const diff = git("diff", "-U0", `${from}`, "HEAD", "--", file);
  const lines = [];
  for (const match of diff.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(match[1]);
    const count = match[2] === undefined ? 1 : Number(match[2]);
    // A pure deletion reports a count of 0 at the line before the gap.
    if (count === 0) lines.push(Math.max(start, 1));
    for (let offset = 0; offset < count; offset += 1) lines.push(start + offset);
  }
  return lines;
}

/**
 * The slug whose entry contains each changed line. A change above the first
 * entry — a shared helper such as unitContent — touches every entry, so it
 * reports all of them.
 */
function slugsTouched(from, file, pattern) {
  const starts = slugStarts(file, pattern);
  const touched = new Set();
  for (const line of changedLines(from, file)) {
    const owner = starts.filter((start) => start.line <= line).at(-1);
    if (!owner) return starts.map((start) => start.slug);
    touched.add(owner.slug);
  }
  return [...touched];
}

function pathsChangedSince(from) {
  try {
    git("cat-file", "-e", `${from}^{commit}`);
  } catch {
    fail(`commit ${from} is not in this checkout.`);
  }

  const files = git("diff", "--name-only", from, "HEAD").split("\n").filter(Boolean);
  const paths = new Set();
  let everything = false;

  for (const file of files) {
    const content = file.match(/^src\/config\/content\/([a-z]+)\.ts$/);
    const registry = file.match(/^src\/config\/tools\/([a-z]+)\.ts$/);
    const staticPage = file.match(/^src\/app\/([a-z]+)\/page\.tsx$/);

    if (content && CATEGORIES.includes(content[1])) {
      for (const slug of slugsTouched(from, file, /^ {2}"([a-z0-9-]+)": /)) paths.add(`/${content[1]}/${slug}`);
    } else if (registry && CATEGORIES.includes(registry[1])) {
      // Names and descriptions also appear on cards: the category, the index and the homepage.
      for (const slug of slugsTouched(from, file, /^ {4}slug: "([a-z0-9-]+)",/)) paths.add(`/${registry[1]}/${slug}`);
      paths.add(`/${registry[1]}`).add("/tools").add("/");
    } else if (file === "src/config/categories.ts" || file === "src/app/[category]/page.tsx") {
      for (const category of CATEGORIES) paths.add(`/${category}`);
      paths.add("/tools").add("/");
    } else if (file === "src/app/page.tsx") {
      paths.add("/");
    } else if (staticPage && [...STATIC_PAGES, "tools"].includes(staticPage[1])) {
      paths.add(`/${staticPage[1]}`);
    } else if (
      file === "src/app/[category]/[slug]/page.tsx" ||
      file === "src/app/layout.tsx" ||
      file === "src/lib/seo.ts" ||
      file === "src/config/site.ts" ||
      file.startsWith("src/components/")
    ) {
      // Shared templates: every page's HTML changed.
      everything = true;
    }
    // Tool logic (src/tools, src/lib), styles, scripts and docs change behaviour,
    // not the text a crawler reads, so they are not worth a re-crawl.
  }

  return { everything, paths: [...paths] };
}

/* --- build the list -------------------------------------------------------- */
const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const live = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
if (live.size === 0) fail(`${SITE}/sitemap.xml returned no URLs — is the site up?`);

let urls;
const sinceIndex = args.indexOf("--changed-since");
if (sinceIndex !== -1) {
  const from = args[sinceIndex + 1];
  if (!from || from.startsWith("--")) fail("--changed-since needs a commit.");
  const { everything, paths } = pathsChangedSince(from);
  urls = everything ? [...live] : paths.map((path) => (path === "/" ? `${SITE}/` : `${SITE}${path}`));
} else if (args.includes("--all")) {
  urls = [...live];
} else {
  urls = args.filter((arg) => !arg.startsWith("--"));
}

// Only pages the sitemap lists: that rules out typos, removed tools and other hosts.
const skipped = urls.filter((url) => !live.has(url));
urls = [...new Set(urls.filter((url) => live.has(url)))].slice(0, MAX_URLS);
for (const url of skipped) console.warn(`IndexNow: skipping ${url} — not in the live sitemap.`);

if (urls.length === 0) {
  console.log("IndexNow: no page changes to submit.");
  process.exit(0);
}

console.log(`IndexNow: ${urls.length} URL${urls.length === 1 ? "" : "s"}`);
for (const url of urls) console.log(`  ${url}`);
if (dryRun) {
  console.log("Dry run — nothing submitted.");
  process.exit(0);
}

/* --- submit ---------------------------------------------------------------- */
// The engines fetch this file to verify the request, so check it is live first.
const served = await fetch(keyLocation).then((response) => (response.ok ? response.text() : ""));
if (served.trim() !== key) fail(`${keyLocation} does not serve the key yet — deploy it first.`);

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation, urlList: urls }),
});

// 200 means accepted; 202 means accepted while the key is still being checked.
if (response.status === 200 || response.status === 202) {
  console.log(`IndexNow: submitted (HTTP ${response.status}).`);
} else {
  fail(`submission refused, HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
}
