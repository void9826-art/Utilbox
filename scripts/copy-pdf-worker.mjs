/**
 * Copies the pdf.js worker and its support assets into /public.
 *
 * pdf.js needs three things beyond the worker: CMaps for CJK text, the
 * standard font data for PDFs that reference a base-14 font without embedding
 * it, and WebAssembly modules for JBIG2/JPEG2000 images. Serving them from our
 * own origin means no visitor's browser is sent to a third party, and pages
 * that use them render correctly instead of silently losing glyphs.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const packageRoot = path.dirname(require.resolve("pdfjs-dist/package.json"));
const targetRoot = path.join("public", "pdfjs");

fs.mkdirSync(targetRoot, { recursive: true });

// The legacy build carries polyfills for recent built-ins such as
// Map.prototype.getOrInsertComputed, which the modern build calls directly
// and which browsers released before 2026 do not have. It is served under its
// own name so a stale cached copy of the modern worker is never paired with
// the legacy library.
const worker = path.join(packageRoot, "legacy", "build", "pdf.worker.min.mjs");
if (!fs.existsSync(worker)) {
  console.error(`pdf.js worker not found at ${worker}`);
  process.exit(1);
}
fs.copyFileSync(worker, path.join(targetRoot, "pdf.worker.legacy.min.mjs"));

/** Copies a directory, skipping licence files that are not needed at runtime. */
function copyDirectory(name, filter = () => true) {
  const source = path.join(packageRoot, name);
  if (!fs.existsSync(source)) return 0;

  const destination = path.join(targetRoot, name);
  fs.mkdirSync(destination, { recursive: true });

  let count = 0;
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (!entry.isFile() || !filter(entry.name)) continue;
    fs.copyFileSync(path.join(source, entry.name), path.join(destination, entry.name));
    count += 1;
  }
  return count;
}

const notALicence = (name) => !name.startsWith("LICENSE");

const cmaps = copyDirectory("cmaps", notALicence);
const fonts = copyDirectory("standard_fonts", notALicence);
const wasm = copyDirectory("wasm", notALicence);

const { version } = require("pdfjs-dist/package.json");
fs.writeFileSync(path.join(targetRoot, "version.txt"), `${version}\n`, "utf8");

console.log(
  `Copied pdf.js ${version}: worker, ${cmaps} cmaps, ${fonts} standard fonts, ${wasm} wasm modules.`,
);
