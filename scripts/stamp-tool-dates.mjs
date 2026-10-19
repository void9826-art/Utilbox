/**
 * Writes src/config/tool-dates.json: the date each tool page last really
 * changed, for the "Updated" line, the sitemap's lastmod and the schema's
 * dateModified.
 *
 * A tool's date is the newest of four sources, each read from git history:
 *   - its component, src/tools/<category>/<slug>.tsx
 *   - its entry in src/config/content/<category>.ts
 *   - its entry in src/config/content/extra/<category>.ts
 *   - its entry in the registry, src/config/tools/<category>.ts
 * Only the tool's own entry counts (git log -L on its line range), so editing
 * one tool's copy does not re-date every tool in the same file. A source with
 * uncommitted changes counts as today.
 *
 *   node scripts/stamp-tool-dates.mjs          rewrite the file
 *   node scripts/stamp-tool-dates.mjs --check  exit 1 if it is out of date
 *
 * Run it before committing a change to a tool. It needs full git history, so
 * it runs locally, never in the Vercel build (which clones shallowly).
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import { promisify } from "node:util";

const run = promisify(execFile);
const OUT = "src/config/tool-dates.json";
const CATEGORIES = ["pdf", "calculators", "image", "converters", "generators", "text", "developer"];
const today = new Date().toISOString().slice(0, 10);

// Each start pattern is written twice: as a JavaScript regex for the working
// tree, and as the POSIX basic regex git log -L expects, where "{" is literal
// and "?" is not an operator. Slugs are [a-z0-9-], so they need no escaping.

/**
 * Content files key entries by slug, quoted or not. Most are object literals
 * closing with "  },"; unit converters are built by a helper, `unitContent({`,
 * and close with "  }),".
 */
const contentStart = (slug) => ({
  js: `^  "?${slug}"?: (unitContent\\()?\\{`,
  git: `^  "*${slug}"*: [a-zA-Z(]*{`,
});
/** Registry entries start at "    slug:" and close with "  },". */
const registryStart = (slug) => ({ js: `^    slug: "${slug}",`, git: `^    slug: "${slug}",` });

const git = async (...args) => (await run("git", args, { maxBuffer: 1 << 24 })).stdout;

/** The block from the start pattern to the next line that is exactly "  }," or "  }),". */
function block(text, start) {
  const lines = text.split("\n");
  const from = lines.findIndex((line) => new RegExp(start).test(line));
  if (from === -1) return null;
  const to = lines.findIndex((line, index) => index > from && (line === "  }," || line === "  }),"));
  return lines.slice(from, to === -1 ? undefined : to + 1).join("\n");
}

async function headText(file) {
  try {
    return await git("show", `HEAD:${file}`);
  } catch {
    return null;
  }
}

/** Newest commit date for a line range, or today when it differs from HEAD. */
async function entryDate(file, start) {
  if (!fs.existsSync(file)) return null;
  const now = block(fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n"), start.js);
  if (now === null) return null;
  const then = block((await headText(file))?.replace(/\r\n/g, "\n") ?? "", start.js);
  if (then !== now) return today;
  const log = await git("log", "-L", `/${start.git}/,/^  }[)]*,/:${file}`, "--format=%cs", "-s");
  return log.split("\n").find(Boolean) ?? today;
}

/** Newest commit date for a whole file, or today when it has local changes. */
async function fileDate(file) {
  if (!fs.existsSync(file)) return null;
  const changed = (await git("status", "--porcelain", "--", file)).trim();
  if (changed) return today;
  const log = await git("log", "-1", "--format=%cs", "--", file);
  return log.trim() || today;
}

const tools = [];
for (const category of CATEGORIES) {
  const src = fs.readFileSync(`src/config/tools/${category}.ts`, "utf8");
  for (const match of src.matchAll(/^\s{4}slug: "([a-z0-9-]+)",$/gm)) tools.push({ category, slug: match[1] });
}

async function dateTool({ category, slug }) {
  const dates = await Promise.all([
    fileDate(`src/tools/${category}/${slug}.tsx`),
    entryDate(`src/config/content/${category}.ts`, contentStart(slug)),
    entryDate(`src/config/content/extra/${category}.ts`, contentStart(slug)),
    entryDate(`src/config/tools/${category}.ts`, registryStart(slug)),
  ]);
  const known = dates.filter(Boolean).sort();
  if (known.length === 0) throw new Error(`No dated source found for ${category}/${slug}`);
  return [slug, known.at(-1)];
}

// A few at a time: git log -L is slow enough to be worth overlapping, and
// enough processes at once to starve the machine is not.
const result = [];
for (let i = 0; i < tools.length; i += 8) {
  result.push(...(await Promise.all(tools.slice(i, i + 8).map(dateTool))));
}
result.sort(([a], [b]) => a.localeCompare(b));
const json = `${JSON.stringify(Object.fromEntries(result), null, 2)}\n`;

if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
  if (current !== json) {
    console.error(`${OUT} is out of date. Run: npm run stamp:dates`);
    process.exit(1);
  }
  console.log(`${OUT} is up to date (${result.length} tools).`);
} else {
  fs.writeFileSync(OUT, json);
  const counts = {};
  for (const [, date] of result) counts[date] = (counts[date] ?? 0) + 1;
  console.log(`Wrote ${OUT} for ${result.length} tools.`);
  for (const [date, n] of Object.entries(counts).sort().reverse()) console.log(`  ${date}  ${n}`);
}
