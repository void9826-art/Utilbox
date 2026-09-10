/**
 * Writes Windows .ico files.
 *
 * Every entry is stored as a complete PNG, which Windows has read since Vista
 * and every current browser accepts. It keeps full 8-bit alpha, and it avoids
 * the legacy bitmap-plus-AND-mask variant, whose bottom-up row order and mask
 * padding are easy to get subtly wrong.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

export interface IcoImage {
  /** Square edge length in pixels, 1–256. */
  size: number;
  png: Uint8Array;
}

export interface IcoEntry {
  width: number;
  height: number;
  byteLength: number;
  offset: number;
  isPng: boolean;
}

const HEADER_BYTES = 6;
const ENTRY_BYTES = 16;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export function encodeIco(images: IcoImage[]): Uint8Array {
  if (images.length === 0) throw new Error("An icon file needs at least one image.");

  const directoryBytes = HEADER_BYTES + images.length * ENTRY_BYTES;
  const total = images.reduce((sum, image) => sum + image.png.byteLength, directoryBytes);
  const bytes = new Uint8Array(total);
  const view = new DataView(bytes.buffer);

  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // 1 = icon (2 would be a cursor)
  view.setUint16(4, images.length, true);

  let offset = directoryBytes;
  images.forEach((image, index) => {
    if (!Number.isInteger(image.size) || image.size < 1 || image.size > 256) {
      throw new Error(`Icon images must be 1–256 pixels, not ${image.size}.`);
    }

    const entry = HEADER_BYTES + index * ENTRY_BYTES;
    // The directory stores dimensions in one byte, so 256 is written as 0.
    bytes[entry] = image.size === 256 ? 0 : image.size;
    bytes[entry + 1] = image.size === 256 ? 0 : image.size;
    bytes[entry + 2] = 0; // no palette
    bytes[entry + 3] = 0; // reserved
    view.setUint16(entry + 4, 1, true); // colour planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, image.png.byteLength, true);
    view.setUint32(entry + 12, offset, true);

    bytes.set(image.png, offset);
    offset += image.png.byteLength;
  });

  return bytes;
}

/** Reads an .ico directory back. Used to verify what encodeIco wrote. */
export function readIcoDirectory(bytes: Uint8Array): IcoEntry[] {
  if (bytes.byteLength < HEADER_BYTES) throw new Error("Too short to be an icon file.");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (view.getUint16(0, true) !== 0 || view.getUint16(2, true) !== 1) {
    throw new Error("Not an icon file.");
  }

  const count = view.getUint16(4, true);
  const entries: IcoEntry[] = [];

  for (let index = 0; index < count; index += 1) {
    const entry = HEADER_BYTES + index * ENTRY_BYTES;
    if (entry + ENTRY_BYTES > bytes.byteLength) throw new Error("The icon directory is truncated.");

    const byteLength = view.getUint32(entry + 8, true);
    const offset = view.getUint32(entry + 12, true);
    if (offset + byteLength > bytes.byteLength) throw new Error("An icon image runs past the end of the file.");

    entries.push({
      width: bytes[entry] === 0 ? 256 : bytes[entry],
      height: bytes[entry + 1] === 0 ? 256 : bytes[entry + 1],
      byteLength,
      offset,
      isPng: PNG_SIGNATURE.every((value, position) => bytes[offset + position] === value),
    });
  }

  return entries;
}
