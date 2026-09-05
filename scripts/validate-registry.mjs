import fs from 'node:fs';

function slugsFrom(file) {
  const src = fs.readFileSync(file, 'utf8');
  return [...src.matchAll(/^\s{4}slug: "([a-z0-9-]+)",$/gm)].map(m => m[1]);
}
function contentKeys(file) {
  const src = fs.readFileSync(file, 'utf8');
  return [...src.matchAll(/^\s{2}"([a-z0-9-]+)": (?:\{|unitContent\(\{)$/gm)].map(m => m[1]);
}

const cats = ['pdf','calculators','image','converters','generators','text','developer'];
let allSlugs = [], allContent = [], problems = [];

for (const c of cats) {
  const s = slugsFrom(`src/config/tools/${c}.ts`);
  const k = contentKeys(`src/config/content/${c}.ts`);
  allSlugs.push(...s.map(x => [c, x]));
  allContent.push(...k);
  for (const slug of s) if (!k.includes(slug)) problems.push(`MISSING CONTENT: ${c}/${slug}`);
  for (const key of k) if (!s.includes(key)) problems.push(`ORPHAN CONTENT: ${c}/${key}`);
}

const slugSet = new Set(allSlugs.map(([, s]) => s));
if (slugSet.size !== allSlugs.length) problems.push('DUPLICATE SLUGS present');

// related links must resolve
for (const c of cats) {
  const src = fs.readFileSync(`src/config/tools/${c}.ts`, 'utf8');
  for (const m of src.matchAll(/related: \[([^\]]+)\]/g)) {
    for (const r of m[1].split(',').map(x => x.trim().replace(/"/g, '')).filter(Boolean)) {
      if (!slugSet.has(r)) problems.push(`BROKEN RELATED LINK: ${c} -> ${r}`);
    }
  }
}

console.log(`tools: ${allSlugs.length}, content entries: ${allContent.length}`);
const counts = {};
for (const [c] of allSlugs) counts[c] = (counts[c] || 0) + 1;
console.log(JSON.stringify(counts));
console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'REGISTRY OK');
