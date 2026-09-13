/**
 * Regenerates every brand asset from the two source files in /brand.
 *
 * The sources are large (a 1254px mark with a soft glow, a 1536px lockup on
 * the brand navy), so nothing ships them directly. The mark is cropped to the
 * cube itself first: the glow is most of the source height, and at 16px a
 * fitted cube reads while a glow-padded one is a smudge.
 *
 * Run with: node --experimental-strip-types scripts/make-brand-assets.mjs
 * (the .ico writer is the same src/lib/ico.ts the favicon generator tool uses).
 */
import fs from "node:fs";
import path from "node:path";

import sharp from "sharp";

import { encodeIco } from "../src/lib/ico.ts";

/** Brand navy, sampled from the lockup background. Apple icons get no alpha. */
const NAVY = "#010616";
/** The cube inside brand/logo-mark.png, squared and padded a little. */
const CROP = { left: 222, top: 216, width: 800, height: 800 };

const root = path.join(import.meta.dirname, "..");
const source = path.join(root, "brand", "logo-mark.png");

/**
 * Clears the soft dark glow the source art sits in.
 *
 * Left in, it renders as a grey vignette on the light theme. Thresholding it
 * away is not enough: the counter of the U is the same dark navy as the glow.
 * The cube is a convex hexagon, so every row of it is one unbroken span
 * between its first and last bright pixel. Clearing only what lies outside
 * that span drops the glow and keeps the U.
 */
async function cleanedCube() {
  const { data, info } = await sharp(source).extract(CROP).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  // The dimmest cube face sits around 80 and the glow around 15.
  const isCube = (index) => 0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2] >= 45;

  for (let y = 0; y < height; y += 1) {
    let first = -1;
    let last = -1;
    for (let x = 0; x < width; x += 1) {
      if (isCube((y * width + x) * channels)) {
        if (first < 0) first = x;
        last = x;
      }
    }
    for (let x = 0; x < width; x += 1) {
      if (first < 0 || x < first || x > last) data[(y * width + x) * channels + 3] = 0;
    }
  }

  return { data, width, height, channels };
}

const mark = await cleanedCube();
const cube = () => sharp(mark.data, { raw: { width: mark.width, height: mark.height, channels: mark.channels } });

const written = [];
const write = async (relative, buffer) => {
  const target = path.join(root, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buffer);
  written.push(`${relative} (${Math.round(buffer.byteLength / 1024)} KB)`);
};

/** Palette PNGs: the art is flat gradients, so 256 colours is lossless to the eye
 * and roughly a tenth of the bytes of a full-colour encode. */
const square = (size) => cube().resize(size, size).png({ palette: true, quality: 90, effort: 10 }).toBuffer();

// Browser tab, PWA manifest and the Organization logo in structured data.
await write("src/app/icon.png", await square(512));
await write("public/logo-mark.png", await square(256));

// iOS home screens ignore transparency and composite on black, so flatten.
await write(
  "src/app/apple-icon.png",
  await cube().resize(180, 180).flatten({ background: NAVY }).png({ palette: true, quality: 90, effort: 10 }).toBuffer(),
);

// Legacy .ico for browsers and crawlers that still ask for /favicon.ico.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(async (size) => ({ size, png: await square(size) })));
await write("src/app/favicon.ico", Buffer.from(encodeIco(images)));

console.log(`Brand assets written:\n  ${written.join("\n  ")}`);
