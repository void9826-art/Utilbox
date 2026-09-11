/**
 * Guards for the API routes that make network requests on a visitor's behalf.
 *
 * A route that connects to whatever address it is given is a server-side
 * request forgery waiting to happen: point it at 169.254.169.254 or an
 * internal hostname and it will read a cloud metadata service or a private
 * dashboard. Every destination is therefore a validated public hostname whose
 * DNS answers all sit in public address space, and outgoing HTTP connections
 * resolve through {@link guardedLookup}, which repeats that check at connect
 * time so a record cannot flip to a private address between check and use.
 *
 * Server-only (it uses node:dns and node:net). No path-alias imports, so
 * scripts/test-lib.mjs can exercise it directly.
 */
import type { LookupAddress, LookupOptions } from "node:dns";
import dns from "node:dns/promises";
import net from "node:net";

export class GuardError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "GuardError";
    this.status = status;
  }
}

export const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Special-use and private-network names that never resolve to a public site. */
const RESERVED_SUFFIXES = [
  "localhost",
  "local",
  "internal",
  "intranet",
  "lan",
  "home",
  "corp",
  "private",
  "test",
  "example",
  "invalid",
  "onion",
  "arpa",
];

/** Accepts a bare domain, "domain:port" or a pasted URL. */
export function parseHostInput(input: string): { host: string; port: number | null } {
  const raw = input.trim();
  if (!raw) throw new GuardError("Enter a domain name.");
  if (raw.length > 300) throw new GuardError("That address is too long.");

  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new GuardError("That is not a valid domain name.");
  }

  return { host: assertPublicHostname(url.hostname), port: url.port ? Number(url.port) : null };
}

/** Returns the hostname lower-cased and without a trailing dot, or throws. */
export function assertPublicHostname(hostname: string): string {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (net.isIP(host.replace(/^\[|\]$/g, ""))) {
    throw new GuardError("Enter a domain name rather than an IP address.");
  }

  const labels = host.split(".");
  const wellFormed =
    host.length <= 253 &&
    labels.length >= 2 &&
    labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) &&
    !/^\d+$/.test(labels[labels.length - 1]);
  if (!wellFormed) throw new GuardError(`"${hostname}" is not a valid public domain name.`);

  if (RESERVED_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`))) {
    throw new GuardError(`"${host}" is a reserved or internal name, not a public domain.`);
  }
  return host;
}

function isPublicIPv4(address: string): boolean {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  const [a, b, c] = parts;

  if (a === 0 || a === 10 || a === 127) return false; // "this network", private, loopback
  if (a === 100 && b >= 64 && b <= 127) return false; // carrier-grade NAT
  if (a === 169 && b === 254) return false; // link-local, including cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return false; // private
  if (a === 192 && b === 168) return false; // private
  if (a === 192 && b === 0 && (c === 0 || c === 2)) return false; // IETF assignments, TEST-NET-1
  if (a === 192 && b === 88 && c === 99) return false; // 6to4 relay anycast
  if (a === 198 && (b === 18 || b === 19)) return false; // benchmarking
  if (a === 198 && b === 51 && c === 100) return false; // TEST-NET-2
  if (a === 203 && b === 0 && c === 113) return false; // TEST-NET-3
  if (a >= 224) return false; // multicast, reserved, broadcast
  return true;
}

/** Expands an IPv6 address (including an embedded IPv4 tail) to eight 16-bit groups. */
function expandIPv6(address: string): number[] | null {
  const halves = address.split("::");
  if (halves.length > 2) return null;

  const split = (part: string) => (part ? part.split(":") : []);
  const head = split(halves[0]);
  const tail = halves.length === 2 ? split(halves[1]) : [];
  const last = halves.length === 2 ? tail : head;

  const final = last[last.length - 1];
  if (final?.includes(".")) {
    const v4 = final.split(".").map(Number);
    if (v4.length !== 4 || v4.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return null;
    last.splice(last.length - 1, 1, ((v4[0] << 8) | v4[1]).toString(16), ((v4[2] << 8) | v4[3]).toString(16));
  }

  const missing = 8 - head.length - tail.length;
  if (halves.length === 1 ? head.length !== 8 : missing < 1) return null;

  const groups = [...head, ...new Array(halves.length === 2 ? missing : 0).fill("0"), ...tail].map((group) =>
    /^[0-9a-f]{1,4}$/i.test(group) ? Number.parseInt(group, 16) : Number.NaN,
  );
  return groups.length === 8 && groups.every((group) => Number.isInteger(group)) ? groups : null;
}

export function isPublicAddress(address: string): boolean {
  if (net.isIPv4(address)) return isPublicIPv4(address);
  if (!net.isIPv6(address)) return false;

  const groups = expandIPv6(address.toLowerCase().replace(/%.*$/, ""));
  if (!groups) return false;

  // IPv4-mapped (::ffff:a.b.c.d) connects to the IPv4 address, so judge that.
  if (groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff) {
    return isPublicIPv4(`${groups[6] >> 8}.${groups[6] & 255}.${groups[7] >> 8}.${groups[7] & 255}`);
  }

  const [first, second] = groups;
  if (first === 0x2001 && second === 0x0db8) return false; // documentation
  if (first === 0x2001 && second < 0x0200) return false; // Teredo and other protocol assignments
  if (first === 0x2002) return false; // 6to4, which can embed a private IPv4 address
  if (first === 0x0064 && second === 0xff9b) return false; // NAT64, likewise

  // Only global unicast (2000::/3) is public; this excludes loopback,
  // unique-local, link-local, multicast and the unspecified address.
  return (first & 0xe000) === 0x2000;
}

/** Resolves a hostname and insists every answer is a public address. */
export async function resolvePublic(host: string): Promise<LookupAddress[]> {
  let records: LookupAddress[];
  try {
    records = await dns.lookup(host, { all: true, verbatim: true });
  } catch {
    throw new GuardError(`${host} could not be found in DNS. Check the spelling.`, 422);
  }

  if (records.length === 0) throw new GuardError(`${host} has no address records.`, 422);
  if (!records.every((record) => isPublicAddress(record.address))) {
    throw new GuardError(`${host} resolves to a private or reserved address, which this tool does not connect to.`, 422);
  }
  return records;
}

/**
 * A `lookup` for node:http and node:https that refuses non-public answers,
 * so the check happens on the address the socket actually connects to.
 */
export function guardedLookup(
  hostname: string,
  options: LookupOptions,
  callback: (error: NodeJS.ErrnoException | null, address: string | LookupAddress[], family?: number) => void,
): void {
  dns.lookup(hostname, { all: true, verbatim: true }).then(
    (records) => {
      if (records.length === 0 || !records.every((record) => isPublicAddress(record.address))) {
        const blocked: NodeJS.ErrnoException = new Error(`${hostname} resolves to a private or reserved address.`);
        blocked.code = "EBLOCKED";
        callback(blocked, "", 4);
        return;
      }
      if (options.all) callback(null, records);
      else callback(null, records[0].address, records[0].family);
    },
    (error: NodeJS.ErrnoException) => callback(error, "", 4),
  );
}

const hits = new Map<string, { count: number; reset: number }>();

/**
 * Refuses cross-site callers and applies a per-address rate limit.
 *
 * The limit lives in memory, so it is per server instance rather than global —
 * enough to stop one visitor hammering the endpoint, not a substitute for a
 * platform firewall.
 */
export function checkRequest(request: Request, options: { scope: string; limit: number; windowMs: number }): void {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    throw new GuardError("This endpoint only serves this website's own tools.", 403);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  const key = `${options.scope}:${ip}`;
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.reset <= now) {
    hits.set(key, { count: 1, reset: now + options.windowMs });
  } else {
    entry.count += 1;
    if (entry.count > options.limit) {
      throw new GuardError("Too many checks in a short time. Wait a minute and try again.", 429);
    }
  }

  if (hits.size > 10_000) {
    for (const [stale, value] of hits) if (value.reset <= now) hits.delete(stale);
  }
}

export async function readJsonBody(request: Request, maxBytes = 4096): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (text.length > maxBytes) throw new GuardError("The request is too large.", 413);
  try {
    const value: unknown = JSON.parse(text);
    if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  } catch {
    // Fall through to the error below.
  }
  throw new GuardError("Send the details as a JSON object.");
}

export function jsonError(error: unknown, fallback: string): Response {
  if (error instanceof GuardError) {
    return Response.json({ error: error.message }, { status: error.status, headers: NO_STORE });
  }
  return Response.json({ error: fallback }, { status: 502, headers: NO_STORE });
}
