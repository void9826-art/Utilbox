/**
 * Removes metadata from JPEG, PNG and WebP files without re-encoding them.
 *
 * Each format is a sequence of labelled blocks — segments in a JPEG, chunks in
 * a PNG or WebP — and the metadata lives in blocks of its own. Cutting those
 * blocks out and copying everything else byte for byte leaves the compressed
 * image data untouched, so there is no generation loss. Re-drawing through a
 * canvas would also drop the metadata, but it would re-compress the photo.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

export type StrippableKind = "jpeg" | "png" | "webp";

export interface StripOptions {
  /** ICC profiles describe colour, not the photographer, and removing one can shift colours. */
  keepColorProfile: boolean;
  /**
   * JPEG only. Phones often store photos sideways with an EXIF rotation flag;
   * dropping it would show the photo on its side, so a minimal EXIF block
   * holding just that flag is written back.
   */
  keepOrientation: boolean;
}

export interface StripResult {
  bytes: Uint8Array;
  /** Human-readable names of what was removed, de-duplicated. */
  removed: string[];
  /** The EXIF orientation found (1–8), or null. */
  orientation: number | null;
}

export class MetadataFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MetadataFormatError";
  }
}

export function stripMetadata(bytes: Uint8Array, kind: StrippableKind, options: StripOptions): StripResult {
  switch (kind) {
    case "jpeg":
      return stripJpeg(bytes, options);
    case "png":
      return stripPng(bytes, options);
    case "webp":
      return stripWebp(bytes, options);
  }
}

function ascii(bytes: Uint8Array, offset: number, length: number): string {
  let out = "";
  for (let index = offset; index < offset + length && index < bytes.length; index += 1) {
    out += String.fromCharCode(bytes[index]);
  }
  return out;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.byteLength;
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* JPEG                                                                        */
/* -------------------------------------------------------------------------- */

/** Reads the Orientation tag (0x0112) from IFD0 of a TIFF structure. */
export function readTiffOrientation(tiff: Uint8Array): number | null {
  if (tiff.byteLength < 8) return null;
  const little = tiff[0] === 0x49 && tiff[1] === 0x49;
  const big = tiff[0] === 0x4d && tiff[1] === 0x4d;
  if (!little && !big) return null;

  const view = new DataView(tiff.buffer, tiff.byteOffset, tiff.byteLength);
  const ifd = view.getUint32(4, little);
  if (ifd + 2 > tiff.byteLength) return null;

  const count = view.getUint16(ifd, little);
  for (let index = 0; index < count; index += 1) {
    const entry = ifd + 2 + index * 12;
    if (entry + 12 > tiff.byteLength) break;
    if (view.getUint16(entry, little) === 0x0112) {
      const value = view.getUint16(entry + 8, little);
      return value >= 1 && value <= 8 ? value : null;
    }
  }
  return null;
}

/** An APP1 segment containing an EXIF block with the Orientation tag and nothing else. */
export function orientationSegment(orientation: number): Uint8Array {
  return Uint8Array.of(
    0xff, 0xe1, 0x00, 0x22, // APP1, length 34
    0x45, 0x78, 0x69, 0x66, 0x00, 0x00, // "Exif\0\0"
    0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08, // big-endian TIFF header, IFD0 at 8
    0x00, 0x01, // one entry
    0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, // Orientation, SHORT, count 1
    0x00, orientation, 0x00, 0x00, // value, padded
    0x00, 0x00, 0x00, 0x00, // no next IFD
  );
}

function stripJpeg(bytes: Uint8Array, options: StripOptions): StripResult {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new MetadataFormatError("This is not a valid JPEG file");

  const kept: Uint8Array[] = [bytes.subarray(0, 2)];
  const removed = new Set<string>();
  let orientation: number | null = null;
  let insertAt = 1;
  let offset = 2;
  let sawEnd = false;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) throw new MetadataFormatError("The JPEG structure is damaged");
    // Any number of 0xFF fill bytes may precede a marker.
    while (offset + 1 < bytes.length && bytes[offset + 1] === 0xff) offset += 1;
    if (offset + 1 >= bytes.length) break;

    const marker = bytes[offset + 1];
    offset += 2;

    if (marker === 0xd9) {
      kept.push(Uint8Array.of(0xff, 0xd9));
      sawEnd = true;
      break;
    }
    if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      kept.push(Uint8Array.of(0xff, marker));
      continue;
    }

    if (offset + 2 > bytes.length) throw new MetadataFormatError("The JPEG file is truncated");
    const length = (bytes[offset] << 8) | bytes[offset + 1];
    const segmentStart = offset - 2;
    const segmentEnd = offset + length;
    if (length < 2 || segmentEnd > bytes.length) throw new MetadataFormatError("The JPEG file is truncated");
    const payload = offset + 2;

    let keep = true;
    if (marker === 0xe1) {
      keep = false;
      if (ascii(bytes, payload, 6) === "Exif\0\0") {
        orientation = readTiffOrientation(bytes.subarray(payload + 6, segmentEnd)) ?? orientation;
        removed.add("EXIF (camera, dates, GPS)");
      } else if (ascii(bytes, payload, 28).startsWith("http://ns.adobe.com/")) {
        removed.add("XMP");
      } else {
        removed.add("APP1 metadata");
      }
    } else if (marker === 0xe2) {
      if (ascii(bytes, payload, 12) === "ICC_PROFILE\0") {
        keep = options.keepColorProfile;
        if (!keep) removed.add("ICC colour profile");
      } else {
        keep = false;
        removed.add(ascii(bytes, payload, 3) === "MPF" ? "Multi-picture index" : "APP2 metadata");
      }
    } else if (marker === 0xed) {
      keep = false;
      removed.add("IPTC / Photoshop");
    } else if (marker === 0xfe) {
      keep = false;
      removed.add("Comment");
    } else if (marker >= 0xe3 && marker <= 0xef && marker !== 0xee) {
      // APP14 (0xEE, "Adobe") is kept: it says how to interpret the colour channels.
      keep = false;
      removed.add(`APP${marker - 0xe0} metadata`);
    }

    if (keep) {
      kept.push(bytes.subarray(segmentStart, segmentEnd));
      // A replacement EXIF block belongs after the JFIF header when there is one.
      if (marker === 0xe0 && kept.length === 2) insertAt = 2;
    }

    offset = segmentEnd;

    if (marker === 0xda) {
      // Entropy-coded scan data follows, up to the next real marker. Inside it,
      // 0xFF is always followed by a stuffed 0x00 or a restart marker.
      let scan = offset;
      while (scan + 1 < bytes.length) {
        if (bytes[scan] === 0xff) {
          const next = bytes[scan + 1];
          if (next === 0x00 || (next >= 0xd0 && next <= 0xd7)) {
            scan += 2;
            continue;
          }
          if (next === 0xff) {
            scan += 1;
            continue;
          }
          break;
        }
        scan += 1;
      }
      if (scan + 1 >= bytes.length) scan = bytes.length;
      kept.push(bytes.subarray(offset, scan));
      offset = scan;
    }
  }

  if (sawEnd && offset < bytes.length) {
    removed.add("Extra data after the image (previews, depth maps)");
  }

  if (options.keepOrientation && orientation !== null && orientation !== 1) {
    kept.splice(insertAt, 0, orientationSegment(orientation));
  }

  return { bytes: concat(kept), removed: [...removed], orientation };
}

/* -------------------------------------------------------------------------- */
/* PNG                                                                         */
/* -------------------------------------------------------------------------- */

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const PNG_METADATA_CHUNKS: Record<string, string> = {
  eXIf: "EXIF (camera, dates, GPS)",
  tEXt: "Text metadata",
  zTXt: "Compressed text metadata",
  iTXt: "International text / XMP",
  tIME: "Last-modified time",
};

function stripPng(bytes: Uint8Array, options: StripOptions): StripResult {
  if (!PNG_SIGNATURE.every((value, index) => bytes[index] === value)) {
    throw new MetadataFormatError("This is not a valid PNG file");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const kept: Uint8Array[] = [bytes.subarray(0, 8)];
  const removed = new Set<string>();
  let offset = 8;

  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = ascii(bytes, offset + 4, 4);
    const end = offset + 12 + length;
    if (end > bytes.length) throw new MetadataFormatError("The PNG file is truncated");

    const label = PNG_METADATA_CHUNKS[type];
    if (label) {
      removed.add(label);
    } else if (type === "iCCP" && !options.keepColorProfile) {
      removed.add("ICC colour profile");
    } else {
      // Chunks are copied whole, so their CRCs remain valid.
      kept.push(bytes.subarray(offset, end));
    }

    offset = end;
    if (type === "IEND") break;
  }

  return { bytes: concat(kept), removed: [...removed], orientation: null };
}

/* -------------------------------------------------------------------------- */
/* WebP                                                                        */
/* -------------------------------------------------------------------------- */

const VP8X_ICC = 0x20;
const VP8X_EXIF = 0x08;
const VP8X_XMP = 0x04;

function stripWebp(bytes: Uint8Array, options: StripOptions): StripResult {
  if (ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WEBP") {
    throw new MetadataFormatError("This is not a valid WebP file");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const chunks: Uint8Array[] = [];
  const removed = new Set<string>();
  let clearFlags = 0;
  let offset = 12;

  while (offset + 8 <= bytes.length) {
    const fourcc = ascii(bytes, offset, 4);
    const size = view.getUint32(offset + 4, true);
    // Chunk payloads are padded to an even length.
    const end = Math.min(bytes.length, offset + 8 + size + (size % 2));
    if (offset + 8 + size > bytes.length) throw new MetadataFormatError("The WebP file is truncated");

    if (fourcc === "EXIF") {
      removed.add("EXIF (camera, dates, GPS)");
      clearFlags |= VP8X_EXIF;
    } else if (fourcc === "XMP ") {
      removed.add("XMP");
      clearFlags |= VP8X_XMP;
    } else if (fourcc === "ICCP" && !options.keepColorProfile) {
      removed.add("ICC colour profile");
      clearFlags |= VP8X_ICC;
    } else {
      chunks.push(bytes.slice(offset, end));
    }

    offset = end;
  }

  // The extended header advertises which optional chunks exist; it must agree.
  for (const chunk of chunks) {
    if (ascii(chunk, 0, 4) === "VP8X" && chunk.length > 8) chunk[8] &= ~clearFlags & 0xff;
  }

  const body = concat(chunks);
  const out = new Uint8Array(12 + body.byteLength);
  out.set(bytes.subarray(0, 12));
  new DataView(out.buffer).setUint32(4, out.byteLength - 8, true);
  out.set(body, 12);

  return { bytes: out, removed: [...removed], orientation: null };
}
