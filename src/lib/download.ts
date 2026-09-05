import { safeFileName } from "./files";

/**
 * Triggers a browser download for an in-memory blob and releases the object URL
 * on the next tick, so repeated downloads do not leak memory.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeFileName(filename, "download");
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(text: string, filename: string, mime = "text/plain;charset=utf-8"): void {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

export function downloadBytes(bytes: Uint8Array, filename: string, mime: string): void {
  // Copy into a fresh buffer: some producers hand back views onto a larger pool.
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  downloadBlob(new Blob([copy], { type: mime }), filename);
}

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

/** Bundles several results into one .zip so batch tools need a single click. */
export async function downloadZip(entries: ZipEntry[], filename: string): Promise<void> {
  const { zipSync } = await import("fflate");

  const files: Record<string, Uint8Array> = {};
  const used = new Set<string>();

  for (const entry of entries) {
    let name = safeFileName(entry.name, "file");
    let suffix = 1;
    while (used.has(name)) {
      const dot = name.lastIndexOf(".");
      const stem = dot > 0 ? name.slice(0, dot) : name;
      const ext = dot > 0 ? name.slice(dot) : "";
      name = `${stem} (${suffix})${ext}`;
      suffix += 1;
    }
    used.add(name);
    files[name] = entry.data;
  }

  const zipped = zipSync(files, { level: 6 });
  downloadBytes(zipped, filename, "application/zip");
}

/**
 * Copies to the clipboard, falling back to a hidden textarea where the async
 * Clipboard API is unavailable or blocked.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
