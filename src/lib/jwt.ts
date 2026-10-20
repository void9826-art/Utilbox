/**
 * Decodes a JSON Web Token without verifying it.
 *
 * Decoding only reads the header and payload, which are Base64URL-encoded JSON
 * and readable by anyone. Verifying needs the issuer's secret or public key,
 * so it is deliberately not attempted: a decoded token proves nothing about
 * who issued it or whether it has been altered.
 */

/**
 * Base64URL to UTF-8 text. Kept local rather than imported so this module has
 * no dependencies and can be tested directly with Node.
 */
function base64UrlToText(part: string): string {
  if (!/^[A-Za-z0-9_\-+/]*={0,2}$/.test(part)) throw new Error("not base64");
  let base64 = part.replace(/-/g, "+").replace(/_/g, "/").replace(/=+$/, "");
  if (base64.length % 4 === 1) throw new Error("bad length");
  base64 += "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export interface JwtTime {
  claim: "exp" | "nbf" | "iat";
  label: string;
  seconds: number;
  date: Date;
}

export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: unknown;
  /** The signature exactly as it appears in the token, still encoded. */
  signature: string;
  algorithm: string | null;
  times: JwtTime[];
  /** true or false when the payload has an exp claim, null otherwise. */
  expired: boolean | null;
  /** true when the token has an nbf claim that is still in the future. */
  notYetValid: boolean;
}

export type JwtResult = { ok: true; token: DecodedJwt } | { ok: false; message: string };

const TIME_LABELS: Record<JwtTime["claim"], string> = {
  exp: "Expires",
  nbf: "Not valid before",
  iat: "Issued at",
};

/** Plain-language names for the registered claims in RFC 7519. */
export const CLAIM_NAMES: Record<string, string> = {
  iss: "Issuer",
  sub: "Subject",
  aud: "Audience",
  exp: "Expiration time",
  nbf: "Not before",
  iat: "Issued at",
  jti: "Token ID",
};

function decodePart(part: string, name: string): unknown {
  let text: string;
  try {
    text = base64UrlToText(part);
  } catch {
    throw new Error(`The ${name} is not valid Base64URL, so the token is damaged or incomplete.`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`The ${name} decodes, but it is not JSON. This may not be a JWT.`);
  }
}

export function decodeJwt(input: string, now: Date = new Date()): JwtResult {
  const token = input.trim().replace(/^Bearer\s+/i, "").replace(/\s+/g, "");
  if (!token) return { ok: false, message: "Paste a token to decode it." };

  const parts = token.split(".");
  if (parts.length === 5) {
    return {
      ok: false,
      message:
        "This token has five parts, so it is an encrypted JWE. Its contents can only be read with the recipient's key.",
    };
  }
  if (parts.length !== 3) {
    return {
      ok: false,
      message: `A JWT has three parts separated by dots; this has ${parts.length}. Check that the whole token was copied.`,
    };
  }

  try {
    const header = decodePart(parts[0], "header");
    if (typeof header !== "object" || header === null || Array.isArray(header)) {
      return { ok: false, message: "The header should be a JSON object." };
    }
    const payload = decodePart(parts[1], "payload");

    const times: JwtTime[] = [];
    if (typeof payload === "object" && payload !== null && !Array.isArray(payload)) {
      const record = payload as Record<string, unknown>;
      for (const claim of ["iat", "nbf", "exp"] as const) {
        const value = record[claim];
        if (typeof value === "number" && Number.isFinite(value)) {
          times.push({ claim, label: TIME_LABELS[claim], seconds: value, date: new Date(value * 1000) });
        }
      }
    }

    const exp = times.find((time) => time.claim === "exp");
    const nbf = times.find((time) => time.claim === "nbf");
    const headerRecord = header as Record<string, unknown>;

    return {
      ok: true,
      token: {
        header: headerRecord,
        payload,
        signature: parts[2],
        algorithm: typeof headerRecord.alg === "string" ? headerRecord.alg : null,
        times,
        expired: exp ? exp.date.getTime() <= now.getTime() : null,
        notYetValid: nbf ? nbf.date.getTime() > now.getTime() : false,
      },
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "The token could not be decoded." };
  }
}

/** "in 3 hours", "5 days ago" — rounded to the largest sensible unit. */
export function relativeTime(date: Date, now: Date = new Date()): string {
  const diff = (date.getTime() - now.getTime()) / 1000;
  const abs = Math.abs(diff);
  const units: Array<[number, string]> = [
    [86400 * 365, "year"],
    [86400 * 30, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [size, name] of units) {
    if (abs >= size) {
      const count = Math.floor(abs / size);
      const label = `${count} ${name}${count === 1 ? "" : "s"}`;
      return diff >= 0 ? `in ${label}` : `${label} ago`;
    }
  }
  return diff >= 0 ? "in under a minute" : "under a minute ago";
}
