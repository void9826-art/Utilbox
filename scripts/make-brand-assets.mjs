/**
 * Regenerates every brand asset from the source lockup in /brand.
 *
 * The source is a 2048px square: the cube sitting above the UTILBOXES
 * wordmark, drawn in black on an off-white ground. Icons want the cube alone —
 * at 16px a lockup with the word in it is an unreadable smear — so the cube is
 * found and cropped here rather than by hand-measured numbers, which go stale
 * the moment the art is redrawn.
 *
 * Everything is written as black ink on transparency. The header renders it
 * through a CSS mask so it takes the foreground colour and inverts with the
 * theme; a baked-in black cube would vanish against the dark theme.
 *
 * Run with: node --experimental-strip-types scripts/make-brand-assets.mjs
 * (the .ico writer is the same src/lib/ico.ts the favicon generator tool uses).
 */
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

import { encodeIco } from "../src/lib/ico.ts";

/** iOS composites home-screen icons onto black, so the ink needs a ground. */
const APPLE_BACKGROUND = "#ffffff";
/** Breathing room around the cube, as a fraction of its longest side. */
const PADDING = 0.08;
/** A pixel this much darker than the ground counts as ink rather than paper. */
const INK_MARGIN = 24;
/** Blank rows needed to call it the gap between the cube and the wordmark. */
const GAP_ROWS = 24;

const root = path.join(import.meta.dirname, "..");
const source = path.join(root, "brand", "logo-lockup.jpg");

const { data: grey, info } = await sharp(source)
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height } = info;

/** The paper colour, read from the corners so a tinted ground still works. */
const ground = Math.round(
  (grey[0] + grey[width - 1] + grey[(height - 1) * width] + grey[height * width - 1]) / 4,
);
const threshold = ground - INK_MARGIN;
const isInk = (x, y) => grey[y * width + x] < threshold;

/**
 * Splits the art into horizontal bands of ink.
 *
 * The lockup is two stacked shapes with clear air between them, so the first
 * band is the cube and the second is the wordmark. Reading the bands rather
 * than assuming their positions means re-cropping is free if the art changes.
 */
function inkBands() {
  const bands = [];
  let start = -1;
  let blank = 0;

  for (let y = 0; y < height; y += 1) {
    let inked = false;
    for (let x = 0; x < width; x += 1) {
      if (isInk(x, y)) {
        inked = true;
        break;
      }
    }

    if (inked) {
      if (start < 0) start = y;
      blank = 0;
    } else if (start >= 0) {
      blank += 1;
      if (blank >= GAP_ROWS) {
        bands.push({ top: start, bottom: y - blank });
        start = -1;
      }
    }
  }

  if (start >= 0) bands.push({ top: start, bottom: height - 1 });
  return bands;
}

const bands = inkBands();
if (bands.length < 2) {
  throw new Error(
    `Expected the cube and the wordmark as separate bands in ${source}, found ${bands.length}.`,
  );
}

/** The cube's own bounding box: the first band, narrowed to its ink columns. */
const [{ top, bottom }] = bands;
let left = width;
let right = 0;
for (let y = top; y <= bottom; y += 1) {
  for (let x = 0; x < width; x += 1) {
    if (isInk(x, y)) {
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }
}

/** Squared and padded, so the cube keeps its proportions at every icon size. */
const side = Math.round(Math.max(right - left + 1, bottom - top + 1) * (1 + PADDING * 2));
const crop = {
  left: Math.round((left + right + 1) / 2 - side / 2),
  top: Math.round((top + bottom + 1) / 2 - side / 2),
  width: side,
  height: side,
};

if (crop.left < 0 || crop.top < 0 || crop.left + side > width || crop.top + side > height) {
  throw new Error(`The padded cube crop falls outside ${source}; the art needs a wider margin.`);
}

/**
 * Turns the cropped paper-and-ink into black ink on transparency.
 *
 * Alpha is taken from how far each pixel sits below the ground rather than
 * from a hard threshold, which is what keeps the antialiased edges of the
 * cube smooth at 16px instead of ragged.
 */
async function inkOnTransparency() {
  const { data, info: cropped } = await sharp(source)
    .extract(crop)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const scale = 255 / Math.max(threshold, 1);
  const rgba = Buffer.alloc(cropped.width * cropped.height * 4);
  for (let index = 0; index < data.length; index += 1) {
    const alpha = Math.round((threshold - data[index]) * scale);
    rgba[index * 4 + 3] = Math.min(255, Math.max(0, alpha));
  }

  return { data: rgba, width: cropped.width, height: cropped.height, channels: 4 };
}

const mark = await inkOnTransparency();
const cube = () =>
  sharp(mark.data, { raw: { width: mark.width, height: mark.height, channels: mark.channels } });

const written = [];
const write = async (relative, buffer) => {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buffer);
  written.push(`${relative} (${Math.round(buffer.byteLength / 1024)} KB)`);
};

/** The art is flat black, so a palette encode is lossless here and far smaller. */
const square = (size) => cube().resize(size, size).png({ palette: true, effort: 10 }).toBuffer();

/** Sizes at or below this get the contrast curve below. */
const TINY = 32;
/** How hard the curve pushes a part-covered pixel towards solid ink. */
const CRISP_GAIN = 2;
/** Coverage below this is treated as paper, which keeps the counters open. */
const CRISP_LIFT = 50;

/**
 * A favicon-sized render with its edges hardened.
 *
 * The cube is drawn in thin strokes around open counters. Averaged down to
 * 16px those strokes land on half-covered pixels and the whole mark greys out
 * into an illegible blob, so the alpha ramp is stretched: nearly-covered
 * pixels go solid and barely-covered ones drop out. Larger sizes have the
 * resolution to carry the detail themselves and are left exactly as drawn.
 */
async function crisp(size) {
  if (size > TINY) return square(size);

  const { data } = await cube().resize(size, size).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let index = 3; index < data.length; index += 4) {
    data[index] = Math.min(255, Math.max(0, Math.round((data[index] - CRISP_LIFT) * CRISP_GAIN)));
  }

  return sharp(data, { raw: { width: size, height: size, channels: 4 } })
    .png({ palette: true, effort: 10 })
    .toBuffer();
}

// Browser tab, PWA manifest, the Organization logo in structured data, and the
// mask the header draws the mark through.
await write("src/app/icon.png", await square(512));
await write("public/logo-mark.png", await square(256));

// iOS home screens ignore transparency and composite on black, so flatten.
await write(
  "src/app/apple-icon.png",
  await cube()
    .resize(180, 180)
    .flatten({ background: APPLE_BACKGROUND })
    .png({ palette: true, effort: 10 })
    .toBuffer(),
);

// Legacy .ico for browsers and crawlers that still ask for /favicon.ico.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(async (size) => ({ size, png: await crisp(size) })));
await write("src/app/favicon.ico", Buffer.from(encodeIco(images)));

console.log(
  `Ground ${ground}; cube found at ${left},${top} (${right - left + 1}x${bottom - top + 1}), cropped to ${side}px.`,
);
console.log(`Brand assets written:\n  ${written.join("\n  ")}`);
