import { Resolver } from "node:dns/promises";

import { GuardError, NO_STORE, checkRequest, jsonError, parseHostInput, readJsonBody } from "@/lib/net-guard";

/**
 * Looks up where a domain receives email.
 *
 * Browsers have no DNS API, so this runs on the server. It only sends DNS
 * queries — it never connects to the mail servers it finds — and nothing is
 * stored.
 */

type Status = "mx" | "implicit" | "null-mx" | "none" | "no-domain";

interface MailReport {
  domain: string;
  status: Status;
  mx: Array<{ exchange: string; priority: number }>;
  addresses: string[];
}

function errorCode(error: unknown): string | undefined {
  return (error as NodeJS.ErrnoException | undefined)?.code;
}

async function lookupMail(resolver: Resolver, domain: string): Promise<MailReport> {
  try {
    const records = (await resolver.resolveMx(domain)).sort((a, b) => a.priority - b.priority);
    // RFC 7505: a single MX with an empty exchange means "this domain accepts no email".
    if (records.length === 1 && (records[0].exchange === "" || records[0].exchange === ".")) {
      return { domain, status: "null-mx", mx: [], addresses: [] };
    }
    return { domain, status: "mx", mx: records, addresses: [] };
  } catch (error) {
    if (errorCode(error) === "ENOTFOUND") return { domain, status: "no-domain", mx: [], addresses: [] };
    if (errorCode(error) !== "ENODATA") {
      throw new GuardError(`DNS did not answer for ${domain}. Try again in a moment.`, 504);
    }
  }

  // No MX records: RFC 5321 section 5.1 says mail falls back to the domain's own address.
  const v4 = await resolver.resolve4(domain).catch((): string[] => []);
  const v6 = await resolver.resolve6(domain).catch((): string[] => []);
  const addresses = [...v4, ...v6].slice(0, 6);
  return { domain, status: addresses.length > 0 ? "implicit" : "none", mx: [], addresses };
}

export async function POST(request: Request) {
  try {
    checkRequest(request, { scope: "mx", limit: 60, windowMs: 60_000 });
    const body = await readJsonBody(request);
    const { host } = parseHostInput(String(body.domain ?? ""));
    const resolver = new Resolver({ timeout: 4000, tries: 2 });
    return Response.json(await lookupMail(resolver, host), { headers: NO_STORE });
  } catch (error) {
    return jsonError(error, "The mail servers could not be looked up.");
  }
}
