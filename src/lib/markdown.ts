/**
 * A small Markdown to HTML converter covering CommonMark's everyday syntax and
 * the GitHub additions people expect: headings, paragraphs, emphasis, links,
 * images, code spans and fenced code, block quotes, nested and task lists,
 * tables, strikethrough, horizontal rules and bare links.
 *
 * Safety first: every piece of text is HTML-escaped and raw HTML in the input
 * is shown as text, never passed through. Link and image addresses are only
 * kept for http, https, mailto and tel, or relative paths — a javascript: link
 * becomes #. That makes the output safe to preview in the page.
 */

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Allows web, mail and phone links and relative paths; anything else becomes #. */
export function safeUrl(raw: string): string {
  const url = raw.trim();
  const scheme = url.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (scheme && !["http", "https", "mailto", "tel"].includes(scheme[1].toLowerCase())) return "#";
  return url;
}

/* -------------------------------------------------------------------------- */
/* Inline                                                                     */
/* -------------------------------------------------------------------------- */

const PLACEHOLDER = "\u0000";

export function renderInline(source: string): string {
  const stash: string[] = [];
  const keep = (html: string) => `${PLACEHOLDER}${stash.push(html) - 1}${PLACEHOLDER}`;

  let text = source;
  // Backslash escapes and code spans are taken out first so nothing inside
  // them is treated as formatting.
  text = text.replace(/\\([\\`*_{}[\]()#+\-.!|~<>])/g, (_, char: string) => keep(escapeHtml(char)));
  text = text.replace(/(`+)([\s\S]*?[^`])\1(?!`)/g, (_, _ticks: string, code: string) => {
    const trimmed = /^ .* $/.test(code) && code.trim() ? code.slice(1, -1) : code;
    return keep(`<code>${escapeHtml(trimmed)}</code>`);
  });
  // Autolinks in angle brackets, before the brackets are escaped.
  text = text.replace(/<((?:https?:\/\/|mailto:)[^\s<>]+)>/g, (_, url: string) =>
    keep(`<a href="${escapeHtml(safeUrl(url))}">${escapeHtml(url)}</a>`),
  );

  text = escapeHtml(text);

  // Addresses may contain balanced brackets, as Wikipedia links do.
  const linkTarget = String.raw`\(\s*((?:[^\s()]|\([^\s()]*\))+?)(?:\s+&quot;(.*?)&quot;)?\s*\)`;
  text = text.replace(new RegExp(String.raw`!\[([^\]]*)\]` + linkTarget, "g"), (_, alt: string, url: string, title?: string) =>
    keep(
      `<img src="${safeUrl(url)}" alt="${alt}"${title ? ` title="${title}"` : ""} loading="lazy">`,
    ),
  );
  text = text.replace(new RegExp(String.raw`\[([^\]]+)\]` + linkTarget, "g"), (_, label: string, url: string, title?: string) =>
    keep(`<a href="${safeUrl(url)}"${title ? ` title="${title}"` : ""}>${label}</a>`),
  );
  // Bare web addresses, as GitHub links them.
  text = text.replace(/(^|[\s(])(https?:\/\/[^\s<]+[^\s<.,:;"')\]!?])/g, (_, before: string, url: string) =>
    `${before}${keep(`<a href="${url}">${url}</a>`)}`,
  );

  text = text
    .replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, "<strong>$2</strong>")
    .replace(/~~(?=\S)([\s\S]*?\S)~~/g, "<del>$1</del>")
    .replace(/(^|[^*\w])\*(?=\S)([^*]*?\S)\*(?!\*)/g, "$1<em>$2</em>")
    // Underscores inside words (snake_case) are not emphasis.
    .replace(/(^|[^_\p{L}\p{N}])_(?=\S)([^_]*?\S)_(?![_\p{L}\p{N}])/gu, "$1<em>$2</em>");

  // Hard line breaks: two trailing spaces or a backslash before the newline.
  text = text.replace(/(?: {2,}|\\)\n/g, "<br>\n");

  return text.replace(new RegExp(`${PLACEHOLDER}(\\d+)${PLACEHOLDER}`, "g"), (_, index: string) => stash[Number(index)]);
}

/* -------------------------------------------------------------------------- */
/* Blocks                                                                     */
/* -------------------------------------------------------------------------- */

const LIST_ITEM = /^( *)([-*+]|\d{1,9}[.)])( +|$)(.*)$/;
const HR = /^ {0,3}([-*_])(?: *\1){2,} *$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})\s*([\w+#.-]*)/;
const HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/;
const TABLE_SEPARATOR = /^ *\|? *:?-+:? *(\| *:?-+:? *)*\|? *$/;

function splitRow(line: string): string[] {
  let row = line.trim();
  if (row.startsWith("|")) row = row.slice(1);
  if (row.endsWith("|") && !row.endsWith("\\|")) row = row.slice(0, -1);
  return row.split(/(?<!\\)\|/).map((cell) => cell.trim());
}

function indentOf(line: string): number {
  return line.length - line.trimStart().length;
}

function renderList(lines: string[]): string {
  const first = lines[0].match(LIST_ITEM);
  if (!first) return "";
  const ordered = /\d/.test(first[2]);
  const start = ordered ? parseInt(first[2], 10) : 1;
  const baseIndent = first[1].length;

  const items: string[][] = [];
  for (const line of lines) {
    const match = line.match(LIST_ITEM);
    if (match && match[1].length <= baseIndent + 1 && /\d/.test(match[2]) === ordered) {
      items.push([match[4]]);
    } else if (items.length > 0) {
      // Continuation or nested content: strip the item's indentation.
      const contentIndent = baseIndent + (first[2].length + 1);
      items[items.length - 1].push(indentOf(line) >= contentIndent ? line.slice(contentIndent) : line.trimStart());
    }
  }

  const tight = !lines.some((line, index) => line.trim() === "" && index < lines.length - 1);
  const body = items
    .map((itemLines) => {
      let firstLine = itemLines[0];
      let checkbox = "";
      const task = firstLine.match(/^\[([ xX])\] (.*)$/);
      if (task) {
        checkbox = `<input type="checkbox" disabled${task[1] === " " ? "" : " checked"}> `;
        firstLine = task[2];
      }
      const inner = renderBlocks([firstLine, ...itemLines.slice(1)].join("\n"));
      const content = tight ? inner.replace(/^<p>([\s\S]*?)<\/p>/, "$1") : inner;
      return `<li${task ? ' class="task-list-item"' : ""}>${checkbox}${content}</li>`;
    })
    .join("\n");

  return ordered
    ? `<ol${start !== 1 ? ` start="${start}"` : ""}>\n${body}\n</ol>`
    : `<ul>\n${body}\n</ul>`;
}

export function renderBlocks(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
  const out: string[] = [];
  let index = 0;

  const isBlank = (line: string | undefined) => line === undefined || line.trim() === "";

  while (index < lines.length) {
    const line = lines[index];

    if (isBlank(line)) {
      index += 1;
      continue;
    }

    // Fenced code
    const fence = line.match(FENCE);
    if (fence) {
      const marker = fence[1];
      const language = fence[2];
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trimStart().startsWith(marker)) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      const cls = language ? ` class="language-${escapeHtml(language)}"` : "";
      out.push(`<pre><code${cls}>${escapeHtml(code.join("\n"))}${code.length ? "\n" : ""}</code></pre>`);
      continue;
    }

    // Indented code
    if (/^ {4,}\S/.test(line)) {
      const code: string[] = [];
      while (index < lines.length && (/^ {4}/.test(lines[index]) || (isBlank(lines[index]) && /^ {4}/.test(lines[index + 1] ?? "")))) {
        code.push(lines[index].slice(4));
        index += 1;
      }
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}\n</code></pre>`);
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${renderInline((heading[2] ?? "").trim())}</h${level}>`);
      index += 1;
      continue;
    }

    if (HR.test(line)) {
      out.push("<hr>");
      index += 1;
      continue;
    }

    // Block quote
    if (/^ {0,3}>/.test(line)) {
      const quoted: string[] = [];
      while (index < lines.length && !isBlank(lines[index]) && (/^ {0,3}>/.test(lines[index]) || quoted.length > 0)) {
        if (!/^ {0,3}>/.test(lines[index]) && (HR.test(lines[index]) || HEADING.test(lines[index]))) break;
        quoted.push(lines[index].replace(/^ {0,3}> ?/, ""));
        index += 1;
      }
      out.push(`<blockquote>\n${renderBlocks(quoted.join("\n"))}\n</blockquote>`);
      continue;
    }

    // Lists
    if (LIST_ITEM.test(line) && indentOf(line) <= 3) {
      const block: string[] = [];
      while (index < lines.length) {
        const current = lines[index];
        if (isBlank(current)) {
          // A blank line continues the list only if more list content follows.
          const next = lines[index + 1];
          const nextItem = next?.match(LIST_ITEM);
          const sameKind = nextItem && /\d/.test(nextItem[2]) === /\d/.test(line.match(LIST_ITEM)?.[2] ?? "");
          if (next !== undefined && ((nextItem && sameKind) || (!nextItem && indentOf(next) >= 2))) {
            block.push(current);
            index += 1;
            continue;
          }
          break;
        }
        if (block.length > 0 && !LIST_ITEM.test(current) && indentOf(current) === 0 && isBlank(lines[index - 1])) break;
        if (block.length > 0 && (HR.test(current) || HEADING.test(current)) && indentOf(current) === 0) break;
        block.push(current);
        index += 1;
      }
      out.push(renderList(block));
      continue;
    }

    // Tables
    if (line.includes("|") && TABLE_SEPARATOR.test(lines[index + 1] ?? "") && (lines[index + 1] ?? "").includes("-")) {
      const headers = splitRow(line);
      const aligns = splitRow(lines[index + 1]).map((cell) =>
        cell.startsWith(":") && cell.endsWith(":") ? "center" : cell.endsWith(":") ? "right" : cell.startsWith(":") ? "left" : null,
      );
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && !isBlank(lines[index]) && lines[index].includes("|")) {
        rows.push(splitRow(lines[index]));
        index += 1;
      }
      const cell = (tag: string, text: string, column: number) =>
        `<${tag}${aligns[column] ? ` style="text-align:${aligns[column]}"` : ""}>${renderInline(text.replace(/\\\|/g, "|"))}</${tag}>`;
      out.push(
        `<table>\n<thead>\n<tr>${headers.map((text, column) => cell("th", text, column)).join("")}</tr>\n</thead>\n` +
          (rows.length
            ? `<tbody>\n${rows.map((row) => `<tr>${headers.map((_, column) => cell("td", row[column] ?? "", column)).join("")}</tr>`).join("\n")}\n</tbody>\n`
            : "") +
          "</table>",
      );
      continue;
    }

    // Paragraph, possibly turned into a setext heading by an underline.
    const paragraph: string[] = [];
    while (index < lines.length && !isBlank(lines[index])) {
      const current = lines[index];
      if (paragraph.length > 0) {
        if (/^ {0,3}=+ *$/.test(current) || /^ {0,3}-+ *$/.test(current)) {
          const level = current.trim().startsWith("=") ? 1 : 2;
          out.push(`<h${level}>${renderInline(paragraph.join("\n").trim())}</h${level}>`);
          paragraph.length = 0;
          index += 1;
          break;
        }
        if (FENCE.test(current) || HEADING.test(current) || /^ {0,3}>/.test(current) || HR.test(current)) break;
        if (LIST_ITEM.test(current) && indentOf(current) <= 3) break;
      }
      paragraph.push(current.replace(/^ {0,3}/, ""));
      index += 1;
    }
    if (paragraph.length > 0) out.push(`<p>${renderInline(paragraph.join("\n").trimEnd())}</p>`);
  }

  return out.join("\n");
}

export function markdownToHtml(markdown: string): string {
  const html = renderBlocks(markdown);
  return html ? `${html}\n` : "";
}

/** Wraps converted HTML in a minimal standalone page for download. */
export function htmlDocument(body: string, title: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body>
${body}</body>
</html>
`;
}
