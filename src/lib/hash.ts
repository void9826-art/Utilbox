/**
 * Hashes and HMACs of text.
 *
 * The SHA family uses the browser's Web Crypto API. MD5 is not part of Web
 * Crypto, so it comes from hash-wasm, which the checksum tool already loads.
 * Text is always hashed as UTF-8 bytes, which is what every other tool and
 * language does by default, so results match `sha256sum` and friends.
 */

export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export const HASH_ALGORITHMS: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export type HashEncoding = "hex" | "base64";

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function encode(bytes: Uint8Array, encoding: HashEncoding): string {
  return encoding === "hex" ? toHex(bytes) : bytesToBase64(bytes);
}

/** Copies into a fresh ArrayBuffer, which Web Crypto's typings insist on. */
function buffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.slice().buffer as ArrayBuffer;
}

export async function hashText(
  text: string,
  algorithm: HashAlgorithm,
  encoding: HashEncoding = "hex",
): Promise<string> {
  const data = new TextEncoder().encode(text);
  if (algorithm === "MD5") {
    const { md5 } = await import("hash-wasm");
    return encode(hexToBytes(await md5(data)), encoding);
  }
  const digest = await crypto.subtle.digest(algorithm, buffer(data));
  return encode(new Uint8Array(digest), encoding);
}

/** HMAC with a text key. Supported for the SHA family, as in Web Crypto. */
export async function hmacText(
  text: string,
  key: string,
  algorithm: Exclude<HashAlgorithm, "MD5">,
  encoding: HashEncoding = "hex",
): Promise<string> {
  const keyBytes = new TextEncoder().encode(key);
  // An empty key is legal in HMAC but Web Crypto refuses a zero-length key;
  // HMAC pads keys with zeros, so a single zero byte gives the same result.
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    buffer(keyBytes.length > 0 ? keyBytes : new Uint8Array(1)),
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, buffer(new TextEncoder().encode(text)));
  return encode(new Uint8Array(signature), encoding);
}
