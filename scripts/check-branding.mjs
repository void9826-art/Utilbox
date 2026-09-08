/**
 * Two checks on identity.
 *
 * 1. Fails if the brand name is written into the source anywhere but
 *    configuration. It used to be hardcoded in eighteen places — most of them
 *    the setCreator/setProducer pair on generated PDFs, where a stale name
 *    would be stamped into every file a visitor downloaded and never noticed.
 *
 * 2. Warns, without failing, when the legal and contact details are still the
 *    shipped placeholders. It cannot fail: those come from environment
 *    variables that are set on the host, not locally, so a hard error would
 *    fire on every developer machine. It is a warning that keeps appearing
 *    until the live site stops saying hello@example.com — which is the single
 *    most common reason an AdSense review is rejected.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = "src";
const CONFIG = path.join("src", "config", "site.ts");
const configSource = fs.readFileSync(CONFIG, "utf8");

/** The default in site.ts is the only place the literal legitimately appears. */
const readDefault = (key) => {
  const match = configSource.match(new RegExp(`env\\("${key}",\\s*"([^"]*)"\\)`));
  return match ? match[1] : null;
};

const DEFAULT_NAME = readDefault("NEXT_PUBLIC_SITE_NAME");
if (!DEFAULT_NAME) {
  console.error(`Could not read the default site name out of ${CONFIG}.`);
  process.exit(1);
}

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.tsx?$/.test(entry.name)) yield full;
  }
}

/* --- 1. the brand name belongs to configuration alone ------------------- */

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

/* --- 2. placeholder identity is a launch blocker, not a code error ------- */

const PLACEHOLDERS = [
  {
    key: "NEXT_PUBLIC_CONTACT_EMAIL",
    placeholder: "hello@example.com",
    shown: "/privacy, /terms, /contact and /about",
    why: "AdSense requires a contact method that actually reaches you",
  },
  {
    key: "NEXT_PUBLIC_LEGAL_ENTITY",
    placeholder: `the operator of ${DEFAULT_NAME}`,
    shown: "/privacy and /terms",
    why: "a reviewer wants to see who is behind the site",
  },
];

const unset = PLACEHOLDERS.filter((entry) => {
  const configured = process.env[entry.key]?.trim();
  return !configured || configured === entry.placeholder;
});

console.log(`BRANDING OK — "${DEFAULT_NAME}" appears only in ${CONFIG}`);

if (unset.length > 0) {
  console.log(`\n  Still shipping placeholder identity details:`);
  for (const entry of unset) {
    console.log(`    ${entry.key} = "${entry.placeholder}"`);
    console.log(`      appears on ${entry.shown} — ${entry.why}`);
  }
  console.log(`    Set these on the host; they stay out of the public repo.`);
}
