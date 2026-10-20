/**
 * Regular-expression helpers shared by the regex tester and find-and-replace.
 *
 * Everything here uses the browser's own JavaScript RegExp engine, so results
 * are exactly what the same pattern does in JavaScript code. The functions are
 * pure; the tools call them from a Web Worker so a pattern that backtracks
 * catastrophically can be stopped without freezing the page.
 */

export const REGEX_FLAGS = ["g", "i", "m", "s", "u", "y", "d"] as const;

export interface RegexMatch {
  index: number;
  end: number;
  text: string;
  /** Numbered capture groups, 1-based in meaning; undefined if a group did not take part. */
  groups: Array<string | undefined>;
  named: Record<string, string | undefined>;
}

export type CompileResult = { ok: true; regex: RegExp } | { ok: false; message: string };

export function compileRegex(pattern: string, flags: string): CompileResult {
  const unknown = [...flags].filter((flag) => !(REGEX_FLAGS as readonly string[]).includes(flag));
  if (unknown.length > 0) return { ok: false, message: `Unknown flag “${unknown.join("")}”. Use g, i, m, s, u, y or d.` };
  if (new Set(flags).size !== flags.length) return { ok: false, message: "A flag is repeated." };
  try {
    return { ok: true, regex: new RegExp(pattern, flags) };
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    // "Invalid regular expression: /(/: Unterminated group" → "Unterminated group"
    const reason = raw.replace(/^Invalid regular expression: \/[\s\S]*\/[a-z]*: /, "");
    return { ok: false, message: reason.charAt(0).toUpperCase() + reason.slice(1) };
  }
}

/**
 * All matches when the regex has the g flag, otherwise only the first — the
 * same thing JavaScript's match() returns. Capped so a pattern that matches
 * every position of a large text does not build a huge result.
 */
export function findMatches(regex: RegExp, text: string, limit = 1000): { matches: RegexMatch[]; truncated: boolean } {
  const toMatch = (match: RegExpExecArray): RegexMatch => ({
    index: match.index,
    end: match.index + match[0].length,
    text: match[0],
    groups: match.slice(1),
    named: match.groups ? { ...match.groups } : {},
  });

  if (!regex.global) {
    const single = new RegExp(regex.source, regex.flags.replace("y", "") + (regex.sticky ? "y" : ""));
    const match = single.exec(text);
    return { matches: match ? [toMatch(match)] : [], truncated: false };
  }

  const matches: RegexMatch[] = [];
  // matchAll advances past empty matches itself, so patterns like a* cannot loop.
  for (const match of text.matchAll(new RegExp(regex.source, regex.flags))) {
    if (matches.length >= limit) return { matches, truncated: true };
    matches.push(toMatch(match));
  }
  return { matches, truncated: false };
}

export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Escapes $ so a replacement is inserted literally rather than as $1 or $&. */
export function literalReplacement(text: string): string {
  return text.replace(/\$/g, "$$$$");
}

export interface FindReplaceOptions {
  useRegex: boolean;
  caseSensitive: boolean;
  wholeWord: boolean;
  /** In regex mode, ^ and $ match at every line rather than the whole text. */
  multiline: boolean;
}

export type FindReplaceResult =
  | { ok: true; output: string; count: number }
  | { ok: false; message: string };

export function buildFindRegex(find: string, options: FindReplaceOptions): CompileResult {
  let source = options.useRegex ? find : escapeRegExp(find);
  if (options.wholeWord) source = `(?<![\\p{L}\\p{N}_])(?:${source})(?![\\p{L}\\p{N}_])`;
  // The u flag is only needed for the \p{…} classes in the whole-word check;
  // adding it otherwise would reject patterns like \- that are valid without it.
  const flags = `g${options.caseSensitive ? "" : "i"}${options.useRegex && options.multiline ? "m" : ""}${options.wholeWord ? "u" : ""}`;
  return compileRegex(source, flags);
}

export function findAndReplace(text: string, find: string, replacement: string, options: FindReplaceOptions): FindReplaceResult {
  if (find === "") return { ok: true, output: text, count: 0 };
  const compiled = buildFindRegex(find, options);
  if (!compiled.ok) return compiled;
  const insert = options.useRegex ? replacement : literalReplacement(replacement);
  const count = [...text.matchAll(compiled.regex)].length;
  const output = text.replace(compiled.regex, insert);
  return { ok: true, output, count };
}

/** Expands a replacement template for one match, as String.replace would. */
export function previewReplacement(regex: RegExp, text: string, replacement: string): string {
  return text.replace(regex, replacement);
}
