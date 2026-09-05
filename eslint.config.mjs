import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored pdf.js runtime assets, copied verbatim by scripts/copy-pdf-worker.mjs.
    // They are third-party minified builds and are not ours to lint.
    "public/pdfjs/**",
    // Sample documents written by the OOXML test.
    "scripts/.out/**",
  ]),
]);

export default eslintConfig;
