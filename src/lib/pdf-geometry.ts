/**
 * Page geometry for tools that draw on, or resize, existing PDF pages.
 *
 * A PDF page has a visible box in its own coordinate space plus an optional
 * /Rotate value that viewers apply when displaying it. Anything placed "at the
 * bottom of the page" has to go where the *displayed* bottom ends up, and be
 * drawn turned so it reads upright once the viewer rotates the page.
 *
 * No imports: scripts/test-lib.mjs runs this under Node.
 */

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type LabelPosition =
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "top-left"
  | "top-center"
  | "top-right";

/** Paper sizes in PDF points (1/72 inch), portrait. */
export const PAPER_SIZES = {
  a4: { label: "A4", width: 595.28, height: 841.89 },
  letter: { label: "US Letter", width: 612, height: 792 },
  legal: { label: "US Legal", width: 612, height: 1008 },
  a3: { label: "A3", width: 841.89, height: 1190.55 },
  a5: { label: "A5", width: 419.53, height: 595.28 },
} as const;

export type PaperId = keyof typeof PAPER_SIZES;

export function normaliseRotation(angle: number): 0 | 90 | 180 | 270 {
  const quarter = ((Math.round(angle / 90) % 4) + 4) % 4;
  return (quarter * 90) as 0 | 90 | 180 | 270;
}

/** Names a paper size in either orientation, within 2 points. */
export function identifyPaper(width: number, height: number): PaperId | null {
  for (const id of Object.keys(PAPER_SIZES) as PaperId[]) {
    const paper = PAPER_SIZES[id];
    const portrait = Math.abs(width - paper.width) <= 2 && Math.abs(height - paper.height) <= 2;
    const landscape = Math.abs(width - paper.height) <= 2 && Math.abs(height - paper.width) <= 2;
    if (portrait || landscape) return id;
  }
  return null;
}

/** "8.5 × 11 in" for a size that is not a named paper. */
export function describeSize(width: number, height: number): string {
  const inches = (points: number) => Number((points / 72).toFixed(2));
  return `${inches(width)} × ${inches(height)} in`;
}

export interface LabelPlacement {
  /** Baseline-left of the text, in page coordinates. */
  x: number;
  y: number;
  /** Counter-clockwise degrees to draw the text at. */
  rotate: number;
}

/** Helvetica's cap height is 0.718 em; top labels sit that far below the margin. */
const CAP_HEIGHT = 0.72;

export function placeLabel(options: {
  box: Box;
  rotation: number;
  position: LabelPosition;
  textWidth: number;
  fontSize: number;
  margin: number;
}): LabelPlacement {
  const { box, position, textWidth, fontSize, margin } = options;
  const rotation = normaliseRotation(options.rotation);
  const sideways = rotation === 90 || rotation === 270;
  const displayWidth = sideways ? box.height : box.width;
  const displayHeight = sideways ? box.width : box.height;

  const [vertical, horizontal] = position.split("-") as ["top" | "bottom", "left" | "center" | "right"];

  // (u, v): baseline-left in the frame the reader sees, origin at its bottom-left.
  const u =
    horizontal === "left"
      ? margin
      : horizontal === "right"
        ? displayWidth - margin - textWidth
        : (displayWidth - textWidth) / 2;
  const v = vertical === "bottom" ? margin : displayHeight - margin - fontSize * CAP_HEIGHT;

  // Undo the viewer's clockwise rotation to get back to page coordinates.
  let x: number;
  let y: number;
  switch (rotation) {
    case 0:
      x = u;
      y = v;
      break;
    case 90:
      x = box.width - v;
      y = u;
      break;
    case 180:
      x = box.width - u;
      y = box.height - v;
      break;
    case 270:
      x = v;
      y = box.height - u;
      break;
  }

  // Drawn at the page's own rotation, the text appears upright once displayed.
  return { x: box.x + x, y: box.y + y, rotate: rotation };
}

export const LABEL_FORMATS: Record<string, { label: string; render: (page: number, total: number) => string }> = {
  number: { label: "1", render: (page) => `${page}` },
  page: { label: "Page 1", render: (page) => `Page ${page}` },
  pageOf: { label: "Page 1 of 10", render: (page, total) => `Page ${page} of ${total}` },
  slash: { label: "1 / 10", render: (page, total) => `${page} / ${total}` },
  dashed: { label: "- 1 -", render: (page) => `- ${page} -` },
};

export function formatLabel(format: string, page: number, total: number): string {
  return (LABEL_FORMATS[format] ?? LABEL_FORMATS.number).render(page, total);
}

export interface FitResult {
  width: number;
  height: number;
  scale: number;
  translateX: number;
  translateY: number;
}

/**
 * Where a page's content goes on new paper. The paper takes the page's own
 * orientation, so landscape pages stay landscape. "fit" scales by the largest
 * factor that avoids cropping; "center" keeps the content at its size.
 */
export function fitToPaper(
  box: Box,
  paper: { width: number; height: number },
  mode: "fit" | "center",
): FitResult {
  const long = Math.max(paper.width, paper.height);
  const short = Math.min(paper.width, paper.height);
  const landscape = box.width > box.height;
  const width = landscape ? long : short;
  const height = landscape ? short : long;
  const scale = mode === "fit" ? Math.min(width / box.width, height / box.height) : 1;

  return {
    width,
    height,
    scale,
    translateX: (width - box.width * scale) / 2 - box.x * scale,
    translateY: (height - box.height * scale) / 2 - box.y * scale,
  };
}
