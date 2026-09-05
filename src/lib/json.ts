/**
 * JSON parsing with usable error reporting.
 *
 * The native parser is strict and correct, but it reports a character offset
 * and an engine-specific message. Both are translated here into a line, a
 * column, and a sentence that names the likely cause.
 */

export interface JsonParseFailure {
  ok: false;
  message: string;
  line: number | null;
  column: number | null;
  offset: number | null;
}

export interface JsonParseSuccess {
  ok: true;
  value: unknown;
}

export type JsonParseResult = JsonParseSuccess | JsonParseFailure;

function positionFromOffset(text: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lastNewline = -1;

  for (let index = 0; index < offset && index < text.length; index += 1) {
    if (text[index] === "\n") {
      line += 1;
      lastNewline = index;
    }
  }

  return { line, column: offset - lastNewline };
}

/** Recognises the failure patterns people actually hit, in order of likelihood. */
function explain(text: string, offset: number | null, rawMessage: string): string {
  if (offset !== null) {
    const before = text.slice(Math.max(0, offset - 40), offset);
    const at = text[offset] ?? "";

    if (/,\s*$/.test(before) && (at === "}" || at === "]")) {
      return `A trailing comma before "${at}". JSON does not allow a comma after the last item.`;
    }
    if (at === "'") {
      return "Strings must use double quotes in JSON. Single quotes are not allowed.";
    }
    if (at === "/" && (text[offset + 1] === "/" || text[offset + 1] === "*")) {
      return "Comments are not part of the JSON specification and must be removed.";
    }
    if (/[A-Za-z_$]/.test(at) && /[{,]\s*$/.test(before)) {
      return "Object keys must be wrapped in double quotes.";
    }
    if (at === "" ) {
      return "The document ends unexpectedly — a bracket or brace is probably left open.";
    }
  }

  const lower = rawMessage.toLowerCase();
  if (lower.includes("unexpected end")) {
    return "The document ends before it is complete. Check for an unclosed bracket, brace or quote.";
  }
  if (lower.includes("nan") || lower.includes("infinity")) {
    return "NaN and Infinity are not valid JSON values.";
  }
  if (lower.includes("undefined")) {
    return "undefined is not a valid JSON value. Use null instead.";
  }
  if (lower.includes("control character")) {
    return "A raw line break or tab appears inside a string. Escape it as \\n or \\t.";
  }

  return rawMessage;
}

export function parseJson(text: string): JsonParseResult {
  if (!text.trim()) {
    return { ok: false, message: "There is nothing to parse.", line: null, column: null, offset: null };
  }

  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "The input is not valid JSON.";

    // Engines report the offset differently; both known forms are handled.
    const positionMatch =
      rawMessage.match(/position (\d+)/i) ?? rawMessage.match(/at position (\d+)/i);
    const lineColumnMatch = rawMessage.match(/line (\d+) column (\d+)/i);

    if (positionMatch) {
      const offset = Number(positionMatch[1]);
      const { line, column } = positionFromOffset(text, offset);
      return { ok: false, message: explain(text, offset, rawMessage), line, column, offset };
    }

    if (lineColumnMatch) {
      return {
        ok: false,
        message: explain(text, null, rawMessage),
        line: Number(lineColumnMatch[1]),
        column: Number(lineColumnMatch[2]),
        offset: null,
      };
    }

    return { ok: false, message: explain(text, null, rawMessage), line: null, column: null, offset: null };
  }
}

/**
 * Re-serialises with keys sorted, so two versions of the same document can be
 * diffed meaningfully.
 */
export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return Object.fromEntries(entries.map(([key, item]) => [key, sortKeysDeep(item)]));
  }
  return value;
}

export interface JsonStats {
  depth: number;
  objects: number;
  arrays: number;
  keys: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
  largestArray: number;
  duplicateKeyPaths: string[];
}

export function analyseJson(value: unknown, source: string): JsonStats {
  const stats: JsonStats = {
    depth: 0,
    objects: 0,
    arrays: 0,
    keys: 0,
    strings: 0,
    numbers: 0,
    booleans: 0,
    nulls: 0,
    largestArray: 0,
    duplicateKeyPaths: findDuplicateKeys(source),
  };

  const walk = (node: unknown, depth: number) => {
    stats.depth = Math.max(stats.depth, depth);

    if (Array.isArray(node)) {
      stats.arrays += 1;
      stats.largestArray = Math.max(stats.largestArray, node.length);
      for (const item of node) walk(item, depth + 1);
      return;
    }
    if (node !== null && typeof node === "object") {
      stats.objects += 1;
      const entries = Object.entries(node as Record<string, unknown>);
      stats.keys += entries.length;
      for (const [, item] of entries) walk(item, depth + 1);
      return;
    }
    if (typeof node === "string") stats.strings += 1;
    else if (typeof node === "number") stats.numbers += 1;
    else if (typeof node === "boolean") stats.booleans += 1;
    else if (node === null) stats.nulls += 1;
  };

  walk(value, 1);
  return stats;
}

/**
 * JSON.parse silently keeps only the last of any duplicated key, so the source
 * text has to be re-scanned to find them. This is a lightweight scan that
 * tracks object depth rather than a full parse.
 */
function findDuplicateKeys(source: string): string[] {
  const duplicates = new Set<string>();
  // One key set per open object. Objects nested inside arrays get their own.
  const scopes: Array<Set<string>> = [];

  let index = 0;
  let inString = false;
  let escaped = false;
  let current = "";

  while (index < source.length) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        current += char;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
        // A string is a key only when the next non-space character is a colon.
        let lookahead = index + 1;
        while (lookahead < source.length && /\s/.test(source[lookahead])) lookahead += 1;
        if (source[lookahead] === ":" && scopes.length > 0) {
          const scope = scopes[scopes.length - 1];
          if (scope.has(current)) duplicates.add(current);
          else scope.add(current);
        }
      } else {
        current += char;
      }
      index += 1;
      continue;
    }

    if (char === '"') {
      inString = true;
      current = "";
    } else if (char === "{") {
      scopes.push(new Set());
    } else if (char === "}") {
      scopes.pop();
    }

    index += 1;
  }

  return [...duplicates].slice(0, 20);
}
