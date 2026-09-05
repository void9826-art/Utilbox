import type { PDFDocument, PDFFont, PDFPage, RGB } from "pdf-lib";

/**
 * A small text-layout engine over pdf-lib.
 *
 * pdf-lib draws text at coordinates; it has no concept of a paragraph, a line
 * break or a page overflow. This adds the parts a document needs: measured
 * word wrapping, a cursor that flows down the page, and automatic page breaks.
 *
 * Text is written as real text with embedded standard fonts, so the output is
 * selectable, searchable and small — unlike a rasterised screenshot.
 */

export const PAGE_SIZES = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  legal: [612, 1008],
} as const;

export type PageSizeId = keyof typeof PAGE_SIZES;

export interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
}

export interface LayoutOptions {
  pageSize: PageSizeId;
  landscape?: boolean;
  margin: number;
}

export interface TextStyle {
  size: number;
  font?: keyof Fonts;
  color?: RGB;
  /** Multiplier applied to the font size to get the baseline-to-baseline gap. */
  lineHeight?: number;
  /** Extra space inserted before the block. */
  spaceBefore?: number;
  spaceAfter?: number;
  align?: "left" | "right" | "center";
  /** Restricts the block to a narrower column than the full text width. */
  maxWidth?: number;
  indent?: number;
}

export class DocumentLayout {
  readonly doc: PDFDocument;
  readonly fonts: Fonts;
  readonly margin: number;
  readonly pageWidth: number;
  readonly pageHeight: number;

  page: PDFPage;
  /** Distance from the top of the page to the next baseline. */
  cursor: number;

  private readonly pages: PDFPage[] = [];

  constructor(doc: PDFDocument, fonts: Fonts, options: LayoutOptions) {
    this.doc = doc;
    this.fonts = fonts;
    this.margin = options.margin;

    const [width, height] = PAGE_SIZES[options.pageSize];
    this.pageWidth = options.landscape ? height : width;
    this.pageHeight = options.landscape ? width : height;

    this.page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    this.pages.push(this.page);
    this.cursor = this.margin;
  }

  get contentWidth(): number {
    return this.pageWidth - this.margin * 2;
  }

  get remainingHeight(): number {
    return this.pageHeight - this.margin - this.cursor;
  }

  get pageCount(): number {
    return this.pages.length;
  }

  get allPages(): PDFPage[] {
    return this.pages;
  }

  addPage(): void {
    this.page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    this.pages.push(this.page);
    this.cursor = this.margin;
  }

  /** Starts a new page when `height` will not fit in what is left. */
  ensureSpace(height: number): void {
    if (height > this.remainingHeight) this.addPage();
  }

  /** Converts the top-down cursor into pdf-lib's bottom-up y coordinate. */
  private yFor(offsetFromCursor = 0): number {
    return this.pageHeight - this.cursor - offsetFromCursor;
  }

  /**
   * Greedy word wrap measured with the real font metrics, so the break points
   * match what will actually be drawn.
   */
  wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
    const lines: string[] = [];

    for (const paragraph of text.split("\n")) {
      if (paragraph.trim() === "") {
        lines.push("");
        continue;
      }

      let current = "";
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        const candidate = current ? `${current} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
          current = candidate;
          continue;
        }

        if (current) lines.push(current);

        // A single word wider than the column has to be broken mid-word.
        if (font.widthOfTextAtSize(word, size) > maxWidth) {
          let chunk = "";
          for (const character of word) {
            if (font.widthOfTextAtSize(chunk + character, size) > maxWidth && chunk) {
              lines.push(chunk);
              chunk = character;
            } else {
              chunk += character;
            }
          }
          current = chunk;
        } else {
          current = word;
        }
      }

      if (current) lines.push(current);
    }

    return lines;
  }

  /** Draws a wrapped block of text and advances the cursor past it. */
  text(content: string, style: TextStyle): void {
    const font = this.fonts[style.font ?? "regular"];
    const lineHeight = style.size * (style.lineHeight ?? 1.35);
    const indent = style.indent ?? 0;
    const width = (style.maxWidth ?? this.contentWidth) - indent;

    this.cursor += style.spaceBefore ?? 0;

    const lines = this.wrapText(content, font, style.size, width);

    for (const line of lines) {
      // Keep at least one line height in reserve so text never sits on the edge.
      this.ensureSpace(lineHeight);

      if (line) {
        const lineWidth = font.widthOfTextAtSize(line, style.size);
        let x = this.margin + indent;
        if (style.align === "right") x = this.margin + indent + width - lineWidth;
        else if (style.align === "center") x = this.margin + indent + (width - lineWidth) / 2;

        this.page.drawText(line, {
          x,
          // drawText positions the baseline; nudge down by the ascender.
          y: this.yFor(style.size * 0.85),
          size: style.size,
          font,
          color: style.color,
        });
      }

      this.cursor += lineHeight;
    }

    this.cursor += style.spaceAfter ?? 0;
  }

  /** Measures a block without drawing it, for keep-together decisions. */
  measure(content: string, style: TextStyle): number {
    const font = this.fonts[style.font ?? "regular"];
    const lineHeight = style.size * (style.lineHeight ?? 1.35);
    const width = (style.maxWidth ?? this.contentWidth) - (style.indent ?? 0);
    const lines = this.wrapText(content, font, style.size, width);
    return lines.length * lineHeight + (style.spaceBefore ?? 0) + (style.spaceAfter ?? 0);
  }

  /** A single line drawn at an explicit x, used for label/value rows. */
  textAt(content: string, x: number, style: TextStyle): void {
    const font = this.fonts[style.font ?? "regular"];
    this.page.drawText(content, {
      x,
      y: this.yFor(style.size * 0.85),
      size: style.size,
      font,
      color: style.color,
    });
  }

  rule(color: RGB, thickness = 0.75, spaceBefore = 0, spaceAfter = 0): void {
    this.cursor += spaceBefore;
    this.ensureSpace(thickness + spaceAfter);
    this.page.drawLine({
      start: { x: this.margin, y: this.yFor() },
      end: { x: this.pageWidth - this.margin, y: this.yFor() },
      thickness,
      color,
    });
    this.cursor += thickness + spaceAfter;
  }

  rectangle(options: {
    x?: number;
    width?: number;
    height: number;
    color: RGB;
    opacity?: number;
  }): void {
    this.page.drawRectangle({
      x: options.x ?? this.margin,
      y: this.yFor(options.height),
      width: options.width ?? this.contentWidth,
      height: options.height,
      color: options.color,
      opacity: options.opacity,
    });
  }

  space(amount: number): void {
    this.cursor += amount;
  }
}

export interface TableColumn {
  header: string;
  /** Fraction of the content width, 0–1. Columns should add up to 1. */
  width: number;
  align?: "left" | "right";
}

/** Draws a simple bordered table with wrapped cells and page breaks. */
export function drawTable(
  layout: DocumentLayout,
  columns: TableColumn[],
  rows: string[][],
  options: {
    fontSize: number;
    headerColor: RGB;
    headerBackground: RGB;
    borderColor: RGB;
    textColor: RGB;
    cellPadding?: number;
  },
): void {
  const padding = options.cellPadding ?? 6;
  const widths = columns.map((column) => column.width * layout.contentWidth);
  const lineHeight = options.fontSize * 1.35;

  const drawHeader = () => {
    const headerHeight = lineHeight + padding * 2;
    layout.ensureSpace(headerHeight);
    layout.rectangle({ height: headerHeight, color: options.headerBackground });

    layout.cursor += padding;
    let x = layout.margin;
    columns.forEach((column, index) => {
      const textWidth = layout.fonts.bold.widthOfTextAtSize(column.header, options.fontSize);
      const offset = column.align === "right" ? widths[index] - textWidth - padding : padding;
      layout.textAt(column.header, x + offset, {
        size: options.fontSize,
        font: "bold",
        color: options.headerColor,
      });
      x += widths[index];
    });
    layout.cursor += lineHeight + padding;
  };

  drawHeader();

  for (const row of rows) {
    // A row's height is set by whichever cell wraps to the most lines.
    const wrapped = row.map((cell, index) =>
      layout.wrapText(cell, layout.fonts.regular, options.fontSize, widths[index] - padding * 2),
    );
    const lineCount = Math.max(1, ...wrapped.map((lines) => lines.length));
    const rowHeight = lineCount * lineHeight + padding * 2;

    if (rowHeight > layout.remainingHeight) {
      layout.addPage();
      drawHeader();
    }

    const rowTop = layout.cursor;
    layout.cursor += padding;

    for (let lineIndex = 0; lineIndex < lineCount; lineIndex += 1) {
      let x = layout.margin;
      columns.forEach((column, columnIndex) => {
        const line = wrapped[columnIndex][lineIndex];
        if (line) {
          const textWidth = layout.fonts.regular.widthOfTextAtSize(line, options.fontSize);
          const offset =
            column.align === "right" ? widths[columnIndex] - textWidth - padding : padding;
          layout.textAt(line, x + offset, {
            size: options.fontSize,
            color: options.textColor,
          });
        }
        x += widths[columnIndex];
      });
      layout.cursor += lineHeight;
    }

    layout.cursor = rowTop + rowHeight;
    layout.rule(options.borderColor, 0.5);
  }
}
