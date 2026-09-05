import * as L from 'lucide-react';
import fs from 'node:fs';
const files = ['categories.ts','tools/pdf.ts','tools/calculators.ts','tools/image.ts','tools/converters.ts','tools/generators.ts','tools/text.ts','tools/developer.ts'];
let bad = [];
for (const f of files) {
  const src = fs.readFileSync('src/config/' + f, 'utf8');
  const m = src.match(/import \{([\s\S]*?)\} from "lucide-react"/);
  if (!m) { console.log('no lucide import in', f); continue; }
  const names = m[1].split(',').map(s => s.trim().split(' as ')[0].trim()).filter(Boolean);
  for (const n of names) if (!(n in L)) bad.push(f + ' -> ' + n);
}
console.log(bad.length ? 'MISSING:\n' + bad.join('\n') : 'ALL ICONS OK');
