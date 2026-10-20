/**
 * Runs regular expressions off the main thread.
 *
 * Some patterns, such as (a+)+$ against a long run of a's, backtrack for
 * minutes. In a worker the page stays responsive, and the page can terminate
 * the worker after a time limit and tell the visitor why.
 */

import { compileRegex, findAndReplace, findMatches, type FindReplaceOptions } from "@/lib/regex";

export type RegexRequest =
  | { id: number; kind: "test"; pattern: string; flags: string; text: string; replacement: string | null }
  | { id: number; kind: "replace"; find: string; replacement: string; text: string; options: FindReplaceOptions };

self.onmessage = (event: MessageEvent<RegexRequest>) => {
  const request = event.data;
  if (request.kind === "replace") {
    const result = findAndReplace(request.text, request.find, request.replacement, request.options);
    self.postMessage({ id: request.id, kind: "replace", result });
    return;
  }
  const compiled = compileRegex(request.pattern, request.flags);
  if (!compiled.ok) {
    self.postMessage({ id: request.id, kind: "test", error: compiled.message });
    return;
  }
  const { matches, truncated } = findMatches(compiled.regex, request.text);
  const replaced = request.replacement === null ? null : request.text.replace(compiled.regex, request.replacement);
  self.postMessage({ id: request.id, kind: "test", matches, truncated, replaced });
};
