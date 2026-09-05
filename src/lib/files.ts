/**
 * File intake helpers.
 *
 * Everything a user drops in is treated as untrusted: extensions are ignored in
 * favour of magic-number sniffing, names are rewritten before they are used for
 * a download, and every tool declares an explicit size ceiling.
 */

export const MAX_FILE_SIZE = {
  pdf: 100 * 1024 * 1024,
  image: 50 * 1024 * 1024,
  document: 25 * 1024 * 1024,
} as const;

export type FileKind = "pdf" | "jpeg" | "png" | "webp" | "gif" | "bmp" | "heic" | "docx" | "unknown";

const SIGNATURES: Array<{ kind: FileKind; offset: number; bytes: number[] }> = [
  { kind: "pdf", offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { kind: "jpeg", offset: 0, bytes: [0xff, 0xd8, 0xff] },
  { kind: "png", offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { kind: "gif", offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] },
  { kind: "bmp", offset: 0, bytes: [0x42, 0x4d] },
];

function matches(view: Uint8Array, offset: number, bytes: number[]): boolean {
  if (view.length < offset + bytes.length) return false;
  return bytes.every((byte, index) => view[offset + index] === byte);
}

function readAscii(view: Uint8Array, offset: number, length: number): string {
  let out = "";
  for (let i = offset; i < offset + length && i < view.length; i += 1) {
    out += String.fromCharCode(view[i]);
  }
  return out;
}

/**
 * Reads the first bytes of a file and reports what it actually is. A `.jpg`
 * that is really a PDF will be reported as a PDF.
 */
export async function sniffFileKind(file: File): Promise<FileKind> {
  const header = new Uint8Array(await file.slice(0, 64).arrayBuffer());

  for (const signature of SIGNATURES) {
    if (matches(header, signature.offset, signature.bytes)) return signature.kind;
  }

  // RIFF....WEBP
  if (readAscii(header, 0, 4) === "RIFF" && readAscii(header, 8, 4) === "WEBP") return "webp";

  // ISO base media file with an HEIC/HEIF brand.
  if (readAscii(header, 4, 4) === "ftyp") {
    const brand = readAscii(header, 8, 4);
    if (["heic", "heix", "hevc", "hevx", "heim", "heis", "mif1", "msf1"].includes(brand)) {
      return "heic";
    }
  }

  // DOCX is a ZIP container; the ZIP magic alone is not enough to be sure.
  if (matches(header, 0, [0x50, 0x4b, 0x03, 0x04])) {
    return file.name.toLowerCase().endsWith(".docx") ? "docx" : "unknown";
  }

  return "unknown";
}

export class FileRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileRejectedError";
  }
}

export interface AcceptOptions {
  kinds: FileKind[];
  maxBytes: number;
  /** Human-readable label used in error messages, e.g. "PDF". */
  label: string;
}

/**
 * Validates one file and throws a message that is safe to show a visitor.
 */
export async function acceptFile(file: File, options: AcceptOptions): Promise<FileKind> {
  if (file.size === 0) {
    throw new FileRejectedError(`"${file.name}" is empty.`);
  }
  if (file.size > options.maxBytes) {
    const limitMb = Math.round(options.maxBytes / (1024 * 1024));
    throw new FileRejectedError(
      `"${file.name}" is larger than the ${limitMb} MB limit for this tool.`,
    );
  }

  const kind = await sniffFileKind(file);
  if (!options.kinds.includes(kind)) {
    throw new FileRejectedError(
      `"${file.name}" does not look like a valid ${options.label} file.`,
    );
  }

  return kind;
}

const FORBIDDEN_NAME_CHARS = new Set(['<', '>', ':', '"', '|', '?', '*', '/', '\\']);

/** Strips path separators, control characters and reserved Windows names. */
export function safeFileName(name: string, fallback = "file"): string {
  const withoutPath = name.slice(Math.max(name.lastIndexOf("/"), name.lastIndexOf("\\")) + 1);

  let base = "";
  for (const char of withoutPath) {
    const code = char.codePointAt(0) ?? 0;
    // Drop C0/C1 control characters and the characters Windows forbids.
    if (code < 0x20 || (code >= 0x7f && code <= 0x9f)) continue;
    if (FORBIDDEN_NAME_CHARS.has(char)) continue;
    base += char;
  }

  const cleaned = base.replace(/\s+/g, " ").trim().replace(/^\.+/, "").replace(/\.+$/, "").slice(0, 120);
  if (!cleaned) return fallback;

  const reserved = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i;
  return reserved.test(cleaned) ? `_${cleaned}` : cleaned;
}

export function stripExtension(name: string): string {
  return safeFileName(name).replace(/\.[^.]+$/, "") || "file";
}

export function withExtension(name: string, extension: string): string {
  return `${stripExtension(name)}.${extension.replace(/^\./, "")}`;
}

