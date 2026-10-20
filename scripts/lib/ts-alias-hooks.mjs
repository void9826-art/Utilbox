// Node resolve hooks for the tests: maps "@/x" to src/x and lets extensionless
// relative imports find their .ts file, as the Next.js bundler does.
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = fileURLToPath(new URL("../../src/", import.meta.url));

function withExtension(path) {
  for (const candidate of [path, `${path}.ts`, `${path}/index.ts`]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const file = withExtension(SRC + specifier.slice(2));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    const file = withExtension(fileURLToPath(new URL(specifier, context.parentURL)));
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

// The bundler imports JSON (e.g. tool-dates.json) without `with { type: "json" }`.
export async function load(url, context, nextLoad) {
  if (url.endsWith(".json")) {
    return nextLoad(url, { ...context, importAttributes: { ...context.importAttributes, type: "json" } });
  }
  return nextLoad(url, context);
}
