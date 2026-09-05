/**
 * Structural formatters for HTML and CSS.
 *
 * Both work by tokenising rather than by regex substitution, because the
 * places where naive formatters break — a brace inside a string, a semicolon
 * inside a url(), a closing tag inside a script block — are exactly the places
 * where the surrounding state matters.
 */

/** Elements that never have a closing tag, so they must not change indent depth. */
const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

/** Elements whose contents are another language, or whitespace-significant. */
const RAW_TEXT_ELEMENTS = new Set(["script", "style", "pre", "textarea"]);

/**
 * An element whose only child is text this short is kept on one line, so
 * <p>Hi</p> does not become three lines. Longer content is broken out.
 */
const INLINE_TEXT_LIMIT = 80;

interface HtmlToken {
  type: "open" | "close" | "selfClosing" | "text" | "comment" | "doctype" | "raw";
  value: string;
  tagName?: string;
}

function tokeniseHtml(source: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];
  let index = 0;

  while (index < source.length) {
    const nextTag = source.indexOf("<", index);

    if (nextTag === -1) {
      const text = source.slice(index);
      if (text.trim()) tokens.push({ type: "text", value: text.trim() });
      break;
    }

    if (nextTag > index) {
      const text = source.slice(index, nextTag);
      if (text.trim()) tokens.push({ type: "text", value: text.trim() });
    }

    if (source.startsWith("<!--", nextTag)) {
      const end = source.indexOf("-->", nextTag);
      const stop = end === -1 ? source.length : end + 3;
      tokens.push({ type: "comment", value: source.slice(nextTag, stop) });
      index = stop;
      continue;
    }

    if (source.startsWith("<!", nextTag)) {
      const end = source.indexOf(">", nextTag);
      const stop = end === -1 ? source.length : end + 1;
      tokens.push({ type: "doctype", value: source.slice(nextTag, stop) });
      index = stop;
      continue;
    }

    const tagEnd = findTagEnd(source, nextTag);
    const tagText = source.slice(nextTag, tagEnd);
    const nameMatch = tagText.match(/^<\/?\s*([a-zA-Z][a-zA-Z0-9:-]*)/);
    const tagName = nameMatch ? nameMatch[1].toLowerCase() : "";

    if (tagText.startsWith("</")) {
      tokens.push({ type: "close", value: tagText, tagName });
      index = tagEnd;
      continue;
    }

    const selfClosing = tagText.endsWith("/>") || VOID_ELEMENTS.has(tagName);
    tokens.push({ type: selfClosing ? "selfClosing" : "open", value: tagText, tagName });
    index = tagEnd;

    // Raw-text elements are copied through untouched, all the way to their
    // closing tag, so their contents are never reindented.
    if (!selfClosing && RAW_TEXT_ELEMENTS.has(tagName)) {
      const closeTag = `</${tagName}`;
      const closeIndex = source.toLowerCase().indexOf(closeTag, index);
      if (closeIndex === -1) {
        tokens.push({ type: "raw", value: source.slice(index) });
        index = source.length;
      } else {
        const inner = source.slice(index, closeIndex);
        if (inner.trim()) tokens.push({ type: "raw", value: inner });
        index = closeIndex;
      }
    }
  }

  return tokens;
}

/** Finds the ">" that closes a tag, ignoring any inside quoted attributes. */
function findTagEnd(source: string, start: number): number {
  let index = start + 1;
  let quote: string | null = null;

  while (index < source.length) {
    const char = source[index];
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === ">") {
      return index + 1;
    }
    index += 1;
  }
  return source.length;
}

export function formatHtml(source: string, indentSize = 2): string {
  const tokens = tokeniseHtml(source);
  const indent = " ".repeat(indentSize);
  const lines: string[] = [];
  let depth = 0;

  const push = (text: string) => lines.push(indent.repeat(Math.max(0, depth)) + text);

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    switch (token.type) {
      case "doctype":
      case "comment":
        push(token.value);
        break;

      case "raw": {
        // Preserve the block's own relative indentation.
        const rawLines = token.value.replace(/^\n+|\s+$/g, "").split("\n");
        const commonIndent = Math.min(
          ...rawLines
            .filter((line) => line.trim())
            .map((line) => line.length - line.trimStart().length),
        );
        for (const line of rawLines) {
          push(line.slice(Number.isFinite(commonIndent) ? commonIndent : 0));
        }
        break;
      }

      case "text":
        for (const line of token.value.split("\n")) {
          if (line.trim()) push(line.trim());
        }
        break;

      case "selfClosing":
        push(token.value);
        break;

      case "open": {
        // <span>text</span> stays on one line rather than becoming three.
        const next = tokens[i + 1];
        const afterNext = tokens[i + 2];
        if (
          next?.type === "text" &&
          afterNext?.type === "close" &&
          afterNext.tagName === token.tagName &&
          !next.value.includes("\n") &&
          next.value.length <= INLINE_TEXT_LIMIT
        ) {
          push(`${token.value}${next.value}${afterNext.value}`);
          i += 2;
          break;
        }
        push(token.value);
        depth += 1;
        break;
      }

      case "close":
        depth -= 1;
        push(token.value);
        break;
    }
  }

  return lines.join("\n");
}

export function minifyHtml(source: string): string {
  const tokens = tokeniseHtml(source);
  const parts: string[] = [];

  for (const token of tokens) {
    if (token.type === "comment") continue;
    if (token.type === "raw") {
      parts.push(token.value.replace(/\s+/g, " ").trim());
      continue;
    }
    if (token.type === "text") {
      parts.push(token.value.replace(/\s+/g, " "));
      continue;
    }
    parts.push(token.value.replace(/\s+/g, " ").replace(/\s+>/, ">"));
  }

  return parts.join("");
}

/* -------------------------------------------------------------------------- */
/* CSS                                                                        */
/* -------------------------------------------------------------------------- */

interface CssScanState {
  inString: string | null;
  inComment: boolean;
  inUrl: boolean;
}

/**
 * Walks a stylesheet character by character, tracking whether the cursor is
 * inside a string, a comment or a url(), so braces and semicolons in those
 * positions do not affect the structure.
 */
function scanCss(source: string, onToken: (chunk: string, kind: "block-open" | "block-close" | "statement" | "comment") => void): void {
  const state: CssScanState = { inString: null, inComment: false, inUrl: false };
  let buffer = "";

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (state.inComment) {
      buffer += char;
      if (char === "*" && next === "/") {
        buffer += next;
        index += 1;
        onToken(buffer.trim(), "comment");
        buffer = "";
        state.inComment = false;
      }
      continue;
    }

    if (state.inString) {
      buffer += char;
      if (char === "\\") {
        buffer += next ?? "";
        index += 1;
        continue;
      }
      if (char === state.inString) state.inString = null;
      continue;
    }

    if (char === "/" && next === "*") {
      if (buffer.trim()) {
        onToken(buffer.trim(), "statement");
        buffer = "";
      }
      state.inComment = true;
      buffer = "/*";
      index += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      state.inString = char;
      buffer += char;
      continue;
    }

    if (!state.inUrl && /url\($/i.test(buffer + char)) {
      state.inUrl = true;
      buffer += char;
      continue;
    }

    if (state.inUrl) {
      buffer += char;
      if (char === ")") state.inUrl = false;
      continue;
    }

    if (char === "{") {
      onToken(buffer.trim(), "block-open");
      buffer = "";
      continue;
    }

    if (char === "}") {
      if (buffer.trim()) {
        onToken(buffer.trim(), "statement");
        buffer = "";
      }
      onToken("", "block-close");
      continue;
    }

    if (char === ";") {
      onToken(buffer.trim(), "statement");
      buffer = "";
      continue;
    }

    buffer += char;
  }

  if (buffer.trim()) onToken(buffer.trim(), "statement");
}

export function formatCss(source: string, indentSize = 2, selectorPerLine = true): string {
  const indent = " ".repeat(indentSize);
  const lines: string[] = [];
  let depth = 0;

  scanCss(source, (chunk, kind) => {
    const prefix = indent.repeat(Math.max(0, depth));

    switch (kind) {
      case "comment":
        if (chunk) lines.push(prefix + chunk);
        break;

      case "block-open": {
        const selector = chunk.replace(/\s+/g, " ").trim();
        const rendered =
          selectorPerLine && selector.includes(",")
            ? selector
                .split(",")
                .map((part) => prefix + part.trim())
                .join(",\n")
            : prefix + selector;
        lines.push(`${rendered} {`);
        depth += 1;
        break;
      }

      case "block-close":
        depth -= 1;
        lines.push(indent.repeat(Math.max(0, depth)) + "}");
        break;

      case "statement": {
        const declaration = chunk.replace(/\s+/g, " ").trim();
        if (!declaration) break;
        // Normalise the space after the property colon, but leave colons that
        // are part of a value (data URIs, pseudo-selectors) alone.
        lines.push(prefix + declaration.replace(/^([-\w]+)\s*:\s*/, "$1: ") + ";");
        break;
      }
    }
  });

  // A blank line between top-level rules makes long stylesheets scannable.
  return lines
    .map((line, index) =>
      index > 0 && line.endsWith("{") && !line.startsWith(" ") && lines[index - 1] === "}"
        ? `\n${line}`
        : line,
    )
    .join("\n");
}

export function minifyCss(source: string): string {
  const parts: string[] = [];

  scanCss(source, (chunk, kind) => {
    switch (kind) {
      case "comment":
        break;
      case "block-open":
        parts.push(`${chunk.replace(/\s*,\s*/g, ",").replace(/\s+/g, " ").trim()}{`);
        break;
      case "block-close": {
        // Drop the semicolon before a closing brace; it is always optional.
        if (parts[parts.length - 1]?.endsWith(";")) {
          parts[parts.length - 1] = parts[parts.length - 1].slice(0, -1);
        }
        parts.push("}");
        break;
      }
      case "statement": {
        const declaration = chunk.replace(/\s+/g, " ").trim();
        if (declaration) parts.push(`${declaration.replace(/\s*:\s*/, ":")};`);
        break;
      }
    }
  });

  return parts.join("");
}
