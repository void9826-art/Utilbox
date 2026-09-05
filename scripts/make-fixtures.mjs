/**
 * Builds small real files used to exercise the file tools in a browser.
 * Written to scripts/.out/ and base64-dumped so they can be injected into a
 * file input during testing.
 */
import fs from "node:fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

fs.mkdirSync("scripts/.out", { recursive: true });

async function makePdf(title, pageTexts) {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  for (const [index, text] of pageTexts.entries()) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(title, { x: 60, y: 760, size: 22, font: bold, color: rgb(0.1, 0.1, 0.15) });
    page.drawText(`Page ${index + 1}`, { x: 60, y: 730, size: 11, font, color: rgb(0.4, 0.4, 0.45) });
    page.drawText(text, { x: 60, y: 690, size: 12, font, color: rgb(0.1, 0.1, 0.15) });

    // A simple three-column table so PDF-to-Excel has something to detect.
    const rows = [
      ["Item", "Qty", "Price"],
      ["Widget", "2", "9.99"],
      ["Gadget", "10", "24.50"],
      ["Bolt", "100", "0.15"],
    ];
    rows.forEach((row, rowIndex) => {
      const y = 620 - rowIndex * 22;
      row.forEach((cell, columnIndex) => {
        page.drawText(cell, {
          x: 60 + columnIndex * 150,
          y,
          size: 11,
          font: rowIndex === 0 ? bold : font,
          color: rgb(0.15, 0.15, 0.2),
        });
      });
    });
  }

  return doc.save();
}

const first = await makePdf("Utilbox Test Alpha", [
  "The first document, used to check merging keeps page order.",
  "Alpha page two.",
]);
const second = await makePdf("Utilbox Test Beta", ["The second document, appended after alpha."]);

fs.writeFileSync("scripts/.out/alpha.pdf", first);
fs.writeFileSync("scripts/.out/beta.pdf", second);

/* A small PNG built by hand: a 64x64 gradient, uncompressed via zlib store. */
import zlib from "node:zlib";

function makePng(size = 240) {
  const raw = Buffer.alloc((size * 3 + 1) * size);
  let offset = 0;
  for (let y = 0; y < size; y += 1) {
    raw[offset] = 0; // filter: none
    offset += 1;
    for (let x = 0; x < size; x += 1) {
      raw[offset] = Math.round((x / size) * 255);
      raw[offset + 1] = Math.round((y / size) * 255);
      raw[offset + 2] = 160;
      offset += 3;
    }
  }

  const chunk = (type, data) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body) >>> 0);
    return Buffer.concat([length, body, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

let crcTable = null;
function crc32(buffer) {
  if (!crcTable) {
    crcTable = [];
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c;
    }
  }
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return crc ^ 0xffffffff;
}

const png = makePng();
fs.writeFileSync("scripts/.out/gradient.png", png);

/**
 * A scan-like PDF: one full-page image and no text layer. Compress PDF only
 * shrinks documents of this shape, so without it the tool's success path
 * cannot be exercised at all — a text-only fixture always gets bigger.
 */
async function makeScanPdf(imageBytes) {
  const doc = await PDFDocument.create();
  doc.setTitle("Utilbox Test Scan");
  const image = await doc.embedPng(imageBytes);
  for (let index = 0; index < 2; index += 1) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawImage(image, { x: 0, y: 0, width: 595.28, height: 841.89 });
  }
  return doc.save();
}

const scan = await makeScanPdf(png);
fs.writeFileSync("scripts/.out/scan.pdf", scan);

const manifest = {
  alpha: fs.readFileSync("scripts/.out/alpha.pdf").toString("base64"),
  beta: fs.readFileSync("scripts/.out/beta.pdf").toString("base64"),
  scan: Buffer.from(scan).toString("base64"),
  png: png.toString("base64"),
};
fs.writeFileSync("scripts/.out/fixtures.json", JSON.stringify(manifest));
fs.writeFileSync("scripts/.out/pdf-fixtures.json", JSON.stringify(manifest));

console.log(
  `alpha.pdf ${first.byteLength}B (2 pages), beta.pdf ${second.byteLength}B (1 page), ` +
    `scan.pdf ${scan.byteLength}B (2 image pages), gradient.png ${png.length}B`,
);
