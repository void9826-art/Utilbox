/**
 * Geometry for the border and combine-images tools, kept free of the canvas
 * so it can be tested directly.
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/* -------------------------------------------------------------------------- */
/* Borders                                                                    */
/* -------------------------------------------------------------------------- */

export interface BorderOptions {
  /** Border thickness as a percentage of the image's shorter side. */
  borderPercent: number;
  /** Corner radius of the image itself, as a percentage of its shorter side (0–50). */
  imageRadiusPercent: number;
  /** Corner radius of the outer edge, as a percentage of the result's shorter side (0–50). */
  outerRadiusPercent: number;
}

export interface BorderLayout {
  width: number;
  height: number;
  border: number;
  image: Rect;
  imageRadius: number;
  outerRadius: number;
}

/**
 * The border is sized from the shorter side so it looks equally thick on
 * portrait and landscape pictures, and is the same width on every edge.
 */
export function borderLayout(imageWidth: number, imageHeight: number, options: BorderOptions): BorderLayout {
  const shorter = Math.min(imageWidth, imageHeight);
  const border = Math.round((shorter * Math.max(0, options.borderPercent)) / 100);
  const width = imageWidth + border * 2;
  const height = imageHeight + border * 2;
  const clampRadius = (percent: number, side: number) => Math.round((side * Math.min(50, Math.max(0, percent))) / 100);
  return {
    width,
    height,
    border,
    image: { x: border, y: border, width: imageWidth, height: imageHeight },
    imageRadius: clampRadius(options.imageRadiusPercent, shorter),
    outerRadius: clampRadius(options.outerRadiusPercent, Math.min(width, height)),
  };
}

/* -------------------------------------------------------------------------- */
/* Combining images                                                           */
/* -------------------------------------------------------------------------- */

export type CombineDirection = "horizontal" | "vertical" | "grid";

export interface CombineOptions {
  direction: CombineDirection;
  /** Columns for the grid layout. */
  columns: number;
  /** Space between images and around the edge, in output pixels. */
  gap: number;
  /** Outer margin, in output pixels. */
  margin: number;
  /**
   * Horizontal rows share a height and vertical stacks share a width, so
   * nothing is distorted; grid cells are sized to the largest picture and
   * each picture is fitted inside its cell.
   */
  maxSide: number;
  maxArea: number;
}

export const DEFAULT_COMBINE: CombineOptions = {
  direction: "horizontal",
  columns: 2,
  gap: 0,
  margin: 0,
  // Safari limits canvases to about 16.7 million pixels; staying under that
  // keeps the tool working in every current browser.
  maxSide: 16_000,
  maxArea: 16_000_000,
};

export interface CombineLayout {
  width: number;
  height: number;
  rects: Rect[];
  /** Below 1 when the result was scaled down to fit the browser's canvas limit. */
  scale: number;
}

export function combineLayout(sizes: Array<{ width: number; height: number }>, options: CombineOptions): CombineLayout {
  if (sizes.length === 0) return { width: 0, height: 0, rects: [], scale: 1 };
  const gap = Math.max(0, options.gap);
  const margin = Math.max(0, options.margin);
  let rects: Rect[] = [];
  let width = 0;
  let height = 0;

  if (options.direction === "horizontal") {
    // Every picture is scaled to the tallest one's height, so none is enlarged
    // beyond what the tallest needs and none is squashed.
    const rowHeight = Math.max(...sizes.map((size) => size.height));
    let x = margin;
    rects = sizes.map((size) => {
      const w = (size.width * rowHeight) / size.height;
      const rect = { x, y: margin, width: w, height: rowHeight };
      x += w + gap;
      return rect;
    });
    width = x - gap + margin;
    height = rowHeight + margin * 2;
  } else if (options.direction === "vertical") {
    const columnWidth = Math.max(...sizes.map((size) => size.width));
    let y = margin;
    rects = sizes.map((size) => {
      const h = (size.height * columnWidth) / size.width;
      const rect = { x: margin, y, width: columnWidth, height: h };
      y += h + gap;
      return rect;
    });
    width = columnWidth + margin * 2;
    height = y - gap + margin;
  } else {
    const columns = Math.max(1, Math.min(Math.round(options.columns), sizes.length));
    const rows = Math.ceil(sizes.length / columns);
    const cellWidth = Math.max(...sizes.map((size) => size.width));
    const cellHeight = Math.max(...sizes.map((size) => size.height));
    rects = sizes.map((size, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const fit = Math.min(cellWidth / size.width, cellHeight / size.height);
      const w = size.width * fit;
      const h = size.height * fit;
      return {
        x: margin + column * (cellWidth + gap) + (cellWidth - w) / 2,
        y: margin + row * (cellHeight + gap) + (cellHeight - h) / 2,
        width: w,
        height: h,
      };
    });
    width = margin * 2 + columns * cellWidth + (columns - 1) * gap;
    height = margin * 2 + rows * cellHeight + (rows - 1) * gap;
  }

  const scale = Math.min(1, options.maxSide / Math.max(width, height), Math.sqrt(options.maxArea / (width * height)));
  const round = (value: number) => Math.round(value * scale);
  return {
    width: Math.max(1, round(width)),
    height: Math.max(1, round(height)),
    rects: rects.map((rect) => ({ x: round(rect.x), y: round(rect.y), width: round(rect.width), height: round(rect.height) })),
    scale,
  };
}
