/**
 * Dominant-colour extraction.
 *
 * Pixels are first binned at five bits per channel — 32,768 buckets, so even a
 * large photo collapses to a few thousand weighted points — and those points
 * are clustered with k-means in CIELAB, where straight-line distance tracks how
 * different two colours look far better than it does in RGB.
 *
 * Seeding is deterministic (the heaviest bucket first, then whichever bucket is
 * furthest from every centre so far, weighted by how common it is), so the same
 * image always produces the same palette.
 *
 * No DOM or path-alias imports: scripts/test-lib.mjs runs this under Node.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface PaletteColor extends Rgb {
  hex: string;
  /** Fraction of the image's opaque pixels nearest to this colour, 0–1. */
  share: number;
}

/** Pixels more transparent than this are ignored — they are not visible colour. */
const ALPHA_CUTOFF = 128;
const MAX_ITERATIONS = 30;

type Lab = [number, number, number];

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function toLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function rgbToLab({ r, g, b }: Rgb): Lab {
  const red = toLinear(r);
  const green = toLinear(g);
  const blue = toLinear(b);

  // sRGB to CIE XYZ (D65), each axis normalised by the reference white.
  const x = (red * 0.4124564 + green * 0.3575761 + blue * 0.1804375) / 0.95047;
  const y = red * 0.2126729 + green * 0.7151522 + blue * 0.072175;
  const z = (red * 0.0193339 + green * 0.119192 + blue * 0.9503041) / 1.08883;

  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

export function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };

  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let h: number;
  if (max === red) h = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) h = (blue - red) / delta + 2;
  else h = (red - green) / delta + 4;

  return { h: Math.round(h * 60) % 360, s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** WCAG 2 relative luminance. */
export function relativeLuminance(color: Rgb): number {
  return 0.2126 * toLinear(color.r) + 0.7152 * toLinear(color.g) + 0.0722 * toLinear(color.b);
}

/** WCAG 2 contrast ratio, from 1 (identical) to 21 (black on white). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function distanceSquared(a: Lab, b: Lab): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

interface WeightedPoint {
  lab: Lab;
  r: number;
  g: number;
  b: number;
  weight: number;
}

/**
 * @param pixels RGBA bytes, as returned by CanvasRenderingContext2D.getImageData.
 * @param count  Palette size wanted. Fewer colours come back if the image has fewer.
 */
export function extractPalette(pixels: ArrayLike<number>, count: number): PaletteColor[] {
  const bucketCount = 1 << 15;
  const weights = new Uint32Array(bucketCount);
  const sums = new Float64Array(bucketCount * 3);
  let opaque = 0;

  for (let index = 0; index + 3 < pixels.length; index += 4) {
    if (pixels[index + 3] < ALPHA_CUTOFF) continue;
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    weights[key] += 1;
    sums[key * 3] += r;
    sums[key * 3 + 1] += g;
    sums[key * 3 + 2] += b;
    opaque += 1;
  }

  if (opaque === 0) return [];

  const points: WeightedPoint[] = [];
  for (let key = 0; key < bucketCount; key += 1) {
    const weight = weights[key];
    if (weight === 0) continue;
    const r = sums[key * 3] / weight;
    const g = sums[key * 3 + 1] / weight;
    const b = sums[key * 3 + 2] / weight;
    points.push({ lab: rgbToLab({ r, g, b }), r, g, b, weight });
  }

  const wanted = Math.max(1, Math.min(Math.round(count), points.length));

  /* Deterministic farthest-point seeding, weighted by population. */
  let heaviest = points[0];
  for (const point of points) if (point.weight > heaviest.weight) heaviest = point;

  const centres: Lab[] = [[...heaviest.lab]];
  const nearest = new Float64Array(points.length).fill(Number.POSITIVE_INFINITY);

  while (centres.length < wanted) {
    const latest = centres[centres.length - 1];
    let bestIndex = -1;
    let bestScore = 0;
    for (let index = 0; index < points.length; index += 1) {
      const distance = distanceSquared(points[index].lab, latest);
      if (distance < nearest[index]) nearest[index] = distance;
      const score = nearest[index] * points[index].weight;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }
    // Every remaining point already sits on a centre.
    if (bestIndex === -1) break;
    centres.push([...points[bestIndex].lab]);
  }

  /* Lloyd iterations. */
  const assignment = new Int32Array(points.length).fill(-1);

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration += 1) {
    let changed = false;

    for (let index = 0; index < points.length; index += 1) {
      let closest = 0;
      let closestDistance = Number.POSITIVE_INFINITY;
      for (let centre = 0; centre < centres.length; centre += 1) {
        const distance = distanceSquared(points[index].lab, centres[centre]);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = centre;
        }
      }
      if (assignment[index] !== closest) {
        assignment[index] = closest;
        changed = true;
      }
    }

    if (!changed) break;

    const totals = centres.map(() => [0, 0, 0, 0]);
    for (let index = 0; index < points.length; index += 1) {
      const total = totals[assignment[index]];
      const { lab, weight } = points[index];
      total[0] += lab[0] * weight;
      total[1] += lab[1] * weight;
      total[2] += lab[2] * weight;
      total[3] += weight;
    }
    totals.forEach((total, centre) => {
      if (total[3] > 0) centres[centre] = [total[0] / total[3], total[1] / total[3], total[2] / total[3]];
    });
  }

  /* Report each cluster as the population-weighted mean of its real colours. */
  const clusters = centres.map(() => ({ r: 0, g: 0, b: 0, weight: 0 }));
  for (let index = 0; index < points.length; index += 1) {
    const cluster = clusters[assignment[index]];
    const point = points[index];
    cluster.r += point.r * point.weight;
    cluster.g += point.g * point.weight;
    cluster.b += point.b * point.weight;
    cluster.weight += point.weight;
  }

  return clusters
    .filter((cluster) => cluster.weight > 0)
    .map((cluster) => {
      const rgb = {
        r: Math.round(cluster.r / cluster.weight),
        g: Math.round(cluster.g / cluster.weight),
        b: Math.round(cluster.b / cluster.weight),
      };
      return { ...rgb, hex: rgbToHex(rgb), share: cluster.weight / opaque };
    })
    .sort((a, b) => b.share - a.share);
}
