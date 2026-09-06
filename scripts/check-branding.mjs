/**
 * Fails if the brand name is written into the source anywhere but configuration.
 *
 * The name used to be hardcoded in eighteen places — most of them the
 * setCreator/setProducer pair on generated PDFs, where a stale name would be
 * stamped into every file a visitor downloaded and never noticed. Everything
 * now reads siteConfig.name; this keeps it that way.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "src";
const CONFIG = path.join("src", "config", "site.ts");

/** The default in site.ts is the only place the literal legitimately appears. */
const DEFAULT_NAME = (() => {
  const source = fs.readFileSync(CONFIG, "utf8");
  const match = source.match(/env\("NEXT_PUBLIC_SITE_NAME",\s*"([^"]+)"\)/);
  if (!match) {
    console.error(`Could not read the default site name out of ${CONFIG}.`);
    process.exit(1);
  }
  return match[1];
})();

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.tsx?$/.test(entry.name)) yield full;
  }
}

const offences = [];

for (const file of walk(ROOT)) {
  if (path.resolve(file) === path.resolve(CONFIG)) continue;

  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (line.includes(DEFAULT_NAME)) {
      offences.push(`${file}:${index + 1}  ${line.trim().slice(0, 90)}`);
    }
  });
}

if (offences.length > 0) {
  console.error(`"${DEFAULT_NAME}" is hardcoded outside ${CONFIG}:\n`);
  for (const offence of offences) console.error(`  ${offence}`);
  console.error(`\nUse siteConfig.name so a rename reaches every surface.`);
  process.exit(1);
}

console.log(`BRANDING OK — "${DEFAULT_NAME}" appears only in ${CONFIG}`);
