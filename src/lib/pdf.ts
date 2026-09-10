/**
 * PDF reading helpers built on pdf.js.
 *
 * pdf.js is the engine browsers use to display PDFs, so pages render exactly
 * as they would on screen. It is loaded on demand and its worker is served
 * from this origin rather than a CDN.
 */

import type { PDFDocumentProxy, PDFPageProxy, TextItem } from "pdfjs-dist/types/src/display/api";

type PdfJsModule = typeof import("pdfjs-dist");

let modulePromise: Promise<PdfJsModule> | null = null;

export function loadPdfJs(): Promise<PdfJsModule> {
  if (!modulePromise) {
    modulePromise = import("pdfjs-dist").then((module) => {
      module.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      return module;
    });
  }
  return modulePromise;
}

export class PdfError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfError";
  }
}

/** Turns pdf.js failures into something a visitor can act on. */
export function describePdfError(error: unknown, fileName?: string): string {
  const name = fileName ? `"${fileName}"` : "That file";
  const message = error instanceof Error ? error.message : "";

  if (/password/i.test(message)) {
    return `${name} is password protected. Remove the password in a PDF reader first, then try again.`;
  }
  if (/invalid|corrupt|structure|xref/i.test(message)) {
    return `${name} could not be read — the file appears to be damaged or is not a valid PDF.`;
  }
  if (/worker/i.test(message)) {
    return "The PDF engine failed to start. Reload the page and try again.";
  }
  return `${name} could not be processed. Please try another PDF.`;
}

export async function openPdf(file: Blob, fileName?: string): Promise<PDFDocumentProxy> {
  const pdfjs = await loadPdfJs();

  try {
    // pdf.js takes ownership of the buffer, so a copy is passed in.
    const data = new Uint8Array(await file.arrayBuffer());
    return await pdfjs.getDocument({
      data,
      // All support assets are served from this origin, never a CDN.
      cMapUrl: "/pdfjs/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "/pdfjs/standard_fonts/",
      wasmUrl: "/pdfjs/wasm/",
    }).promise;
  } catch (error) {
    throw new PdfError(describePdfError(error, fileName));
  }
}

/**
 * Releases a document and shuts down its worker.
 *
 * The teardown lives on the loading task rather than the document proxy, and
 * skipping it leaves a worker thread running per file opened.
 */
export async function closePdf(doc: PDFDocumentProxy | null | undefined): Promise<void> {
  if (!doc) return;
  try {
    await doc.loadingTask.destroy();
  } catch {
    // A document that already failed to load has nothing left to release.
  }
}

export interface RenderedPage {
  pageNumber: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

/** Renders one page at a scale, using the same pipeline as a PDF viewer. */
export async function renderPage(page: PDFPageProxy, scale: number): Promise<RenderedPage> {
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));

  const context = canvas.getContext("2d");
  if (!context) throw new PdfError("Your browser could not create a drawing surface.");

  // Pages are transparent where nothing is drawn; a white base matches print.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvas, canvasContext: context, viewport }).promise;

  return {
    pageNumber: page.pageNumber,
    canvas,
    width: canvas.width,
    height: canvas.height,
  };
}

export interface PositionedText {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Extracts text fragments with their positions, in the document's own order. */
export async function extractPositionedText(page: PDFPageProxy): Promise<PositionedText[]> {
  const content = await page.getTextContent();
  const items: PositionedText[] = [];

  for (const raw of content.items) {
    const item = raw as TextItem;
    if (!("str" in item) || !item.str) continue;

    // transform is [a, b, c, d, e, f]; e and f are the x and y translation.
    const [, , , , x, y] = item.transform;
    items.push({
      text: item.str,
      x,
      y,
      width: item.width ?? 0,
      height: item.height ?? 0,
    });
  }

  return items;
}

/**
 * Groups text fragments into visual lines.
 *
 * A PDF stores glyph runs, not lines, so lines are reconstructed by clustering
 * fragments whose baselines are within a tolerance of each other, then sorting
 * each cluster left to right.
 */
export function groupIntoLines(
  items: PositionedText[],
  tolerance = 3,
): Array<{ y: number; items: PositionedText[] }> {
  const lines: Array<{ y: number; items: PositionedText[] }> = [];

  for (const item of items) {
    const existing = lines.find((line) => Math.abs(line.y - item.y) <= tolerance);
    if (existing) {
      existing.items.push(item);
      // Keep the line's y as a running average so drift does not accumulate.
      existing.y = (existing.y * (existing.items.length - 1) + item.y) / existing.items.length;
    } else {
      lines.push({ y: item.y, items: [item] });
    }
  }

  // PDF y grows upward, so descending y is top-to-bottom reading order.
  lines.sort((a, b) => b.y - a.y);
  for (const line of lines) line.items.sort((a, b) => a.x - b.x);

  return lines;
}

/** Joins a line's fragments, inserting a space where there is a visible gap. */
export function lineToText(items: PositionedText[]): string {
  let text = "";
  let previousEnd: number | null = null;

  for (const item of items) {
    if (previousEnd !== null) {
      const gap = item.x - previousEnd;
      // A gap wider than a fraction of the glyph height is a real space.
      const threshold = Math.max(1, item.height * 0.25);
      if (gap > threshold && !text.endsWith(" ") && !item.text.startsWith(" ")) {
        text += " ";
      }
    }
    text += item.text;
    previousEnd = item.x + item.width;
  }

  return text.trim();
}

export async function extractPageText(page: PDFPageProxy): Promise<string> {
  const items = await extractPositionedText(page);
  return groupIntoLines(items)
    .map((line) => lineToText(line.items))
    .join("\n");
}

/* -------------------------------------------------------------------------- */
/* Page ranges                                                                */
/* -------------------------------------------------------------------------- */

export interface PageRangeResult {
  pages: number[];
  error: string | null;
}

/**
 * Parses print-dialog page notation: "1-5, 8, 12-20".
 * Returns 1-based page numbers, de-duplicated, in the order they were written.
 */
export function parsePageRanges(input: string, pageCount: number): PageRangeResult {
  const trimmed = input.trim();
  if (!trimmed) return { pages: [], error: "Enter at least one page or range." };

  const pages: number[] = [];
  const seen = new Set<number>();

  for (const part of trimmed.split(",")) {
    const chunk = part.trim();
    if (!chunk) continue;

    const range = chunk.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    const single = chunk.match(/^(\d+)$/);

    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);

      if (start < 1 || end < 1) {
        return { pages: [], error: "Page numbers start at 1." };
      }
      if (start > pageCount || end > pageCount) {
        return {
          pages: [],
          error: `This document has ${pageCount} page${pageCount === 1 ? "" : "s"}, so "${chunk}" is out of range.`,
        };
      }

      const step = start <= end ? 1 : -1;
      for (let page = start; step > 0 ? page <= end : page >= end; page += step) {
        if (!seen.has(page)) {
          seen.add(page);
          pages.push(page);
        }
      }
      continue;
    }

    if (single) {
      const page = Number(single[1]);
      if (page < 1 || page > pageCount) {
        return {
          pages: [],
          error: `This document has ${pageCount} page${pageCount === 1 ? "" : "s"}, so page ${page} does not exist.`,
        };
      }
      if (!seen.has(page)) {
        seen.add(page);
        pages.push(page);
      }
      continue;
    }

    return {
      pages: [],
      error: `"${chunk}" is not a valid page or range. Use a format such as 1-5, 8, 12-20.`,
    };
  }

  if (pages.length === 0) return { pages: [], error: "No pages were selected." };
  return { pages, error: null };
}

/** Renders "1, 2, 3, 7, 8" as "1-3, 7-8" for a compact summary. */
export function summarisePages(pages: number[]): string {
  if (pages.length === 0) return "none";

  const sorted = [...pages].sort((a, b) => a - b);
  const parts: string[] = [];
  let start = sorted[0];
  let previous = sorted[0];

  for (let index = 1; index <= sorted.length; index += 1) {
    const current = sorted[index];
    if (current !== previous + 1) {
      parts.push(start === previous ? String(start) : `${start}-${previous}`);
      start = current;
    }
    previous = current;
  }

  return parts.join(", ");
}

/* -------------------------------------------------------------------------- */
/* Table reconstruction                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Recovers a grid from positioned text.
 *
 * A PDF has no notion of a table — what it has is text at coordinates that
 * happens to line up. Column boundaries are therefore inferred: every
 * fragment's left edge is collected, close edges are clustered together, and
 * clusters that most rows agree on become the columns.
 */
export function detectTable(
  lines: Array<{ y: number; items: PositionedText[] }>,
  options: { columnTolerance?: number; minRowAgreement?: number } = {},
): string[][] {
  const { columnTolerance = 8, minRowAgreement = 0.35 } = options;

  if (lines.length === 0) return [];

  // Cluster the left edges of every fragment across the whole page.
  const edges: Array<{ x: number; count: number }> = [];

  for (const line of lines) {
    for (const item of line.items) {
      const existing = edges.find((edge) => Math.abs(edge.x - item.x) <= columnTolerance);
      if (existing) {
        existing.x = (existing.x * existing.count + item.x) / (existing.count + 1);
        existing.count += 1;
      } else {
        edges.push({ x: item.x, count: 1 });
      }
    }
  }

  // Keep only the edges that enough rows share; the rest are stray fragments.
  const threshold = Math.max(2, Math.floor(lines.length * minRowAgreement));
  const columns = edges
    .filter((edge) => edge.count >= threshold)
    .sort((a, b) => a.x - b.x)
    .map((edge) => edge.x);

  // Without at least two agreed columns there is no table, only lines of text.
  if (columns.length < 2) {
    return lines.map((line) => [lineToText(line.items)]);
  }

  return lines.map((line) => {
    const cells: string[][] = columns.map(() => []);

    for (const item of line.items) {
      // Assign each fragment to the rightmost column that starts at or before
      // it, which is what a reader does by eye.
      let columnIndex = 0;
      for (let index = 0; index < columns.length; index += 1) {
        if (item.x >= columns[index] - columnTolerance) columnIndex = index;
        else break;
      }
      cells[columnIndex].push(item.text);
    }

    return cells.map((parts) => parts.join(" ").replace(/\s+/g, " ").trim());
  });
}

/** Drops rows and columns that are entirely empty. */
export function trimTable(rows: string[][]): string[][] {
  const nonEmptyRows = rows.filter((row) => row.some((cell) => cell.trim() !== ""));
  if (nonEmptyRows.length === 0) return [];

  const columnCount = Math.max(...nonEmptyRows.map((row) => row.length));
  const keep: number[] = [];

  for (let column = 0; column < columnCount; column += 1) {
    if (nonEmptyRows.some((row) => (row[column] ?? "").trim() !== "")) keep.push(column);
  }

  return nonEmptyRows.map((row) => keep.map((column) => row[column] ?? ""));
}

/**
 * Stacks the tables from several pages into one, the way a long report splits
 * a single table across pages. Rows are padded to the widest table, and when a
 * later page opens with the same header row as the first, that repeat is
 * dropped so the result can be sorted and filtered as one table.
 */
export function joinTables(
  tables: string[][][],
  options: { dropRepeatedHeaders: boolean },
): { rows: string[][]; droppedHeaders: number } {
  const columns = tables.reduce(
    (widest, table) => table.reduce((max, row) => Math.max(max, row.length), widest),
    0,
  );
  const normalise = (row: string[]) => row.map((cell) => cell.trim().toLowerCase()).join(" ");

  const rows: string[][] = [];
  let header: string | null = null;
  let droppedHeaders = 0;

  for (const table of tables) {
    table.forEach((raw, index) => {
      const row = Array.from({ length: columns }, (_, column) => raw[column] ?? "");
      const key = normalise(row);
      if (header === null) {
        header = key;
      } else if (options.dropRepeatedHeaders && index === 0 && key === header) {
        droppedHeaders += 1;
        return;
      }
      rows.push(row);
    });
  }

  return { rows, droppedHeaders };
}

/**
 * Rewrites a formatted figure as a plain number string a spreadsheet stores as
 * a number: "1,234.50" → "1234.50", "$980" → "980", "(45.00)" → "-45.00".
 * Anything else — including codes with leading zeros and European "1.234,50" —
 * comes back unchanged, because guessing wrong would corrupt the value.
 */
export function normaliseNumericCell(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^(\()?([-+−]?)\s*[$€£¥₹]?\s*(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(\))?$/);
  if (!match) return value;

  const [, open, sign, integer, fraction = "", close] = match;
  if (Boolean(open) !== Boolean(close)) return value;

  const digits = integer.replace(/,/g, "");
  if (/^0\d/.test(digits)) return value;

  const negative = Boolean(open) || sign === "-" || sign === "−";
  return `${negative ? "-" : ""}${digits}${fraction}`;
}
