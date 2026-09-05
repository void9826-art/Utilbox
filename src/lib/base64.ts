/**
 * Base64 helpers that handle Unicode correctly.
 *
 * btoa/atob work on bytes, not characters, so passing them a string containing
 * anything above U+00FF throws. Text is converted to and from UTF-8 explicitly.
 */

export function bytesToBase64(bytes: Uint8Array): string {
  // Chunked to stay well under the argument limit on large inputs.
  const CHUNK = 0x8000;
  let binary = "";
  for (let index = 0; index < bytes.length; index += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(index, index + CHUNK));
  }
  return btoa(binary);
}

export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function encodeText(text: string, urlSafe = false, padded = true): string {
  const base64 = bytesToBase64(new TextEncoder().encode(text));
  return applyVariant(base64, urlSafe, padded);
}

export function applyVariant(base64: string, urlSafe: boolean, padded: boolean): string {
  let output = base64;
  if (urlSafe) output = output.replace(/\+/g, "-").replace(/\//g, "_");
  if (!padded) output = output.replace(/=+$/, "");
  return output;
}

export class Base64Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Base64Error";
  }
}

/** Accepts either alphabet, missing padding, whitespace, and data URIs. */
export function normaliseBase64(input: string): { base64: string; mediaType: string | null } {
  let working = input.trim();
  let mediaType: string | null = null;

  const dataUri = working.match(/^data:([^;,]*)(;base64)?,/i);
  if (dataUri) {
    mediaType = dataUri[1] || null;
    working = working.slice(dataUri[0].length);
  }

  working = working.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");

  if (!/^[A-Za-z0-9+/]*=*$/.test(working)) {
    throw new Base64Error(
      "That is not valid Base64 — it contains characters outside the Base64 alphabet.",
    );
  }

  const remainder = working.length % 4;
  if (remainder === 1) {
    throw new Base64Error("That Base64 string is truncated — its length cannot be correct.");
  }
  if (remainder > 0) working += "=".repeat(4 - remainder);

  return { base64: working, mediaType };
}

export function decodeToBytes(input: string): { bytes: Uint8Array; mediaType: string | null } {
  const { base64, mediaType } = normaliseBase64(input);
  try {
    return { bytes: base64ToBytes(base64), mediaType };
  } catch {
    throw new Base64Error("That Base64 string could not be decoded. It may be incomplete.");
  }
}

/** Decodes as UTF-8, reporting whether the bytes actually were valid text. */
export function decodeToText(bytes: Uint8Array): { text: string; isText: boolean } {
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return { text, isText: true };
  } catch {
    return { text: new TextDecoder("utf-8").decode(bytes), isText: false };
  }
}

/** Identifies common binary formats from their leading bytes. */
export function sniffMediaType(bytes: Uint8Array): { mime: string; extension: string } | null {
  const starts = (...signature: number[]) =>
    signature.every((byte, index) => bytes[index] === byte);

  if (starts(0x89, 0x50, 0x4e, 0x47)) return { mime: "image/png", extension: "png" };
  if (starts(0xff, 0xd8, 0xff)) return { mime: "image/jpeg", extension: "jpg" };
  if (starts(0x47, 0x49, 0x46, 0x38)) return { mime: "image/gif", extension: "gif" };
  if (starts(0x25, 0x50, 0x44, 0x46)) return { mime: "application/pdf", extension: "pdf" };
  if (starts(0x50, 0x4b, 0x03, 0x04)) return { mime: "application/zip", extension: "zip" };
  if (starts(0x1f, 0x8b)) return { mime: "application/gzip", extension: "gz" };
  if (starts(0x42, 0x4d)) return { mime: "image/bmp", extension: "bmp" };
  if (starts(0x00, 0x00, 0x01, 0x00)) return { mime: "image/x-icon", extension: "ico" };

  const ascii = (offset: number, text: string) =>
    [...text].every((char, index) => bytes[offset + index] === char.charCodeAt(0));

  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return { mime: "image/webp", extension: "webp" };
  if (ascii(0, "OggS")) return { mime: "audio/ogg", extension: "ogg" };
  if (ascii(4, "ftyp")) return { mime: "video/mp4", extension: "mp4" };

  return null;
}
