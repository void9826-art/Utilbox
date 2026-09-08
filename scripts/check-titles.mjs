/**
 * Checks every page title against the length a search result will show.
 *
 * Titles are assembled by the template in layout.tsx as `${seoTitle} | ${shortName}`,
 * so the brand name is part of all 87 of them. Renaming the site from "Utilbox"
 * to "Utilboxes" added two characters to every title at once and pushed three
 * of them over — which the SEO audit only catches after a build and a deploy.
 * This catches it before either.
 *
 * The headroom figure is what a future rename can spend: the shortest margin
 * across all titles is how many characters longer the brand can get before
 * something breaks.
 */
import fs from "node:fs";
import path from "node:path";

const LIMIT = 65;

/** The configured short name, or the default compiled into site.ts. */
const shortName = (() => {
  if (process.env.NEXT_PUBLIC_SITE_SHORT_NAME?.trim()) {
    return process.env.NEXT_PUBLIC_SITE_SHORT_NAME.trim();
  }
  const source = fs.readFileSync(path.join("src", "config", "site.ts"), "utf8");
  // The short name falls back to the site name rather than repeating it, so
  // the default is an identifier here, not a string literal.
  const literal = source.match(/env\("NEXT_PUBLIC_SITE_SHORT_NAME",\s*"([^"]+)"\)/);
  if (literal) return literal[1];
  const derived = source.match(/env\("NEXT_PUBLIC_SITE_NAME",\s*"([^"]+)"\)/);
  if (derived) return derived[1];
  console.error("Could not read the default short name out of src/config/site.ts.");
  process.exit(1);
})();

const suffix = ` | ${shortName}`;
const titles = [];

for (const dir of ["src/config", "src/config/tools", "src/config/content"]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".ts")) continue;
    const file = path.join(dir, entry.name);
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/seoTitle:\s*"((?:[^"\\]|\\.)*)"/g)) {
      titles.push({ file, title: match[1] });
    }
  }
}

if (titles.length === 0) {
  console.error("No seoTitle entries found — has the registry moved?");
  process.exit(1);
}

const measured = titles.map((entry) => ({
  ...entry,
  length: entry.title.length + suffix.length,
}));

const over = measured.filter((entry) => entry.length > LIMIT).sort((a, b) => b.length - a.length);

if (over.length > 0) {
  console.error(`Titles over ${LIMIT} characters with " | ${shortName}" appended:\n`);
  for (const entry of over) {
    console.error(`  ${entry.length}  ${entry.title}${suffix}`);
    console.error(`       ${entry.file}`);
  }
  console.error(`\nShorten the seoTitle, or the short name in src/config/site.ts.`);
  process.exit(1);
}

const tightest = measured.reduce((worst, entry) => (entry.length > worst.length ? entry : worst));
console.log(
  `TITLES OK — ${measured.length} checked, longest ${tightest.length}/${LIMIT}, ` +
    `${LIMIT - tightest.length} characters of headroom for a longer brand name`,
);
