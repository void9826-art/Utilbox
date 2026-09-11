import tls, { type DetailedPeerCertificate, type PeerCertificate } from "node:tls";

import {
  GuardError,
  NO_STORE,
  checkRequest,
  jsonError,
  parseHostInput,
  readJsonBody,
  resolvePublic,
} from "@/lib/net-guard";

/**
 * Opens a TLS connection to a domain and reports its certificate.
 *
 * A browser cannot do this: page scripts never see certificate details and
 * cannot open raw sockets. The name is resolved and checked against the public
 * address space, then the connection is made to that exact address with SNI
 * set to the name, so DNS cannot steer it somewhere private afterwards.
 * Nothing is stored; the response is not cached.
 */

const PORTS = [443, 8443, 465, 993, 995, 636, 853, 5061];
const TIMEOUT_MS = 8000;
const DAY_MS = 86_400_000;

interface CertificateSummary {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  fingerprint256: string;
}

function isoDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function entityName(entity: unknown): string {
  if (!entity || typeof entity !== "object") return "(unnamed)";
  const record = entity as Record<string, string | string[] | undefined>;
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const commonName = first(record.CN);
  const organisation = first(record.O);
  return [commonName, organisation && organisation !== commonName ? organisation : null].filter(Boolean).join(" — ") || "(unnamed)";
}

function summarise(cert: PeerCertificate): CertificateSummary {
  return {
    subject: entityName(cert.subject),
    issuer: entityName(cert.issuer),
    validFrom: isoDate(cert.valid_from),
    validTo: isoDate(cert.valid_to),
    serialNumber: cert.serialNumber,
    fingerprint256: cert.fingerprint256,
  };
}

function chainOf(leaf: DetailedPeerCertificate): CertificateSummary[] {
  const chain: CertificateSummary[] = [];
  const seen = new Set<string>();
  let current: DetailedPeerCertificate | undefined = leaf;
  // A self-signed root is its own issuer, so stop at the first repeat.
  while (current?.fingerprint256 && !seen.has(current.fingerprint256) && chain.length < 8) {
    seen.add(current.fingerprint256);
    chain.push(summarise(current));
    current = current.issuerCertificate;
  }
  return chain;
}

function trustErrorCode(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof Error) return (value as NodeJS.ErrnoException).code ?? value.message;
  return String(value);
}

function describeSocketError(error: NodeJS.ErrnoException, host: string, port: number): string {
  switch (error.code) {
    case "ECONNREFUSED":
      return `${host} refused the connection on port ${port}.`;
    case "ECONNRESET":
      return `${host} closed the connection during the TLS handshake.`;
    case "ETIMEDOUT":
      return `${host} did not answer on port ${port}.`;
    case "EHOSTUNREACH":
    case "ENETUNREACH":
      return `${host} could not be reached from the checking server.`;
    default:
      if (/wrong version number|unsupported protocol|packet length too long|unexpected eof/i.test(error.message)) {
        return `${host} did not respond with TLS on port ${port}. That service may not use encryption on this port.`;
      }
      return `The TLS connection to ${host} failed (${error.code ?? "unknown error"}).`;
  }
}

function inspect(host: string, address: string, port: number): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const socket = tls.connect({ host: address, port, servername: host, rejectUnauthorized: false });

    const finish = (action: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      action();
    };

    const timer = setTimeout(
      () =>
        finish(() => {
          socket.destroy();
          reject(new GuardError(`${host} did not complete a TLS handshake on port ${port} within 8 seconds.`, 504));
        }),
      TIMEOUT_MS,
    );

    socket.once("secureConnect", () =>
      finish(() => {
        const cert = socket.getPeerCertificate(true);
        if (!cert?.fingerprint256) {
          socket.destroy();
          reject(new GuardError(`${host} did not present a certificate.`, 502));
          return;
        }

        const now = Date.now();
        const validTo = new Date(cert.valid_to).getTime();
        const validFrom = new Date(cert.valid_from).getTime();
        const identity = tls.checkServerIdentity(host, cert);

        resolve({
          host,
          port,
          checkedAt: new Date(now).toISOString(),
          protocol: socket.getProtocol(),
          cipher: socket.getCipher()?.name ?? null,
          certificate: {
            ...summarise(cert),
            altNames: (cert.subjectaltname ?? "")
              .split(/,\s*/)
              .filter((entry) => entry.startsWith("DNS:"))
              .map((entry) => entry.slice(4)),
            daysRemaining: Math.floor((validTo - now) / DAY_MS),
            expired: validTo < now,
            notYetValid: validFrom > now,
            keyBits: cert.bits ?? null,
            keyCurve: cert.asn1Curve ?? null,
          },
          chain: chainOf(cert),
          trusted: socket.authorized,
          trustError: trustErrorCode(socket.authorizationError),
          hostnameMatches: identity === undefined,
          hostnameError: identity?.message ?? null,
        });
        socket.end();
      }),
    );

    socket.once("error", (error: NodeJS.ErrnoException) =>
      finish(() => {
        socket.destroy();
        reject(new GuardError(describeSocketError(error, host, port), 502));
      }),
    );
  });
}

export async function POST(request: Request) {
  try {
    checkRequest(request, { scope: "ssl", limit: 20, windowMs: 60_000 });
    const body = await readJsonBody(request);
    const { host, port: pastedPort } = parseHostInput(String(body.host ?? ""));
    const port = pastedPort ?? Number(body.port ?? 443);
    if (!PORTS.includes(port)) {
      throw new GuardError(`Port ${port} is not supported. Use one of ${PORTS.join(", ")}.`);
    }

    const [target] = await resolvePublic(host);
    return Response.json(await inspect(host, target.address, port), { headers: NO_STORE });
  } catch (error) {
    return jsonError(error, "The certificate could not be checked.");
  }
}
