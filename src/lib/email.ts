/**
 * Email address syntax checking, with explanations a person can act on.
 *
 * The full RFC 5322 grammar permits addresses no real mail service accepts —
 * comments, quoted strings with spaces, IP-address domains — so this checks
 * the practical subset from RFC 5321 and RFC 3696, and reports the
 * legal-but-unusual forms as warnings instead of silently passing or failing
 * them.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

export interface EmailCheck {
  input: string;
  address: string;
  valid: boolean;
  problems: string[];
  warnings: string[];
  local: string;
  domain: string;
  /** Lower-cased, with international names in punycode. Null unless valid. */
  asciiDomain: string | null;
  /** A likely intended address when the domain looks like a typo of a big provider. */
  suggestion: string | null;
}

/** RFC 5322 atext: the characters allowed in an unquoted local part, besides dots. */
const ATEXT_CHAR = /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]/;

const POPULAR_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "yandex.com",
  "btinternet.com",
  "comcast.net",
  "verizon.net",
  "rediffmail.com",
];

const ROLE_ACCOUNTS = new Set([
  "admin",
  "administrator",
  "info",
  "support",
  "sales",
  "contact",
  "noreply",
  "no-reply",
  "postmaster",
  "webmaster",
  "hostmaster",
  "abuse",
  "billing",
  "help",
  "office",
  "hello",
]);

/**
 * Edit distance counting a swap of two neighbouring letters as one edit
 * (optimal string alignment). Plain Levenshtein scores "gmial" → "gmail" as
 * two edits, which would hide the single most common typo.
 */
export function editDistance(a: string, b: string): number {
  let beforePrevious: number[] = [];
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        current[j] = Math.min(current[j], beforePrevious[j - 2] + 1);
      }
    }
    beforePrevious = previous;
    previous = current;
  }
  return previous[b.length];
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

function quote(characters: string[]): string {
  return characters.map((character) => `“${character}”`).join(" ");
}

function checkLocal(local: string, problems: string[], warnings: string[]): void {
  if (local.startsWith('"') && local.endsWith('"') && local.length >= 2) {
    if (/^"(?:[^"\\\r\n]|\\[\x20-\x7e])*"$/.test(local)) {
      warnings.push(
        "It uses quotation marks before the @. That is technically valid, but most websites and mail services reject it.",
      );
    } else {
      problems.push("The quoted part before the @ contains a character that must be escaped.");
    }
    return;
  }

  if (local.includes("@")) {
    problems.push("It has more than one @ sign. Only one is allowed.");
  }
  if (/\s/.test(local)) problems.push("It contains a space before the @.");
  if (local.startsWith(".")) problems.push("The part before the @ cannot start with a dot.");
  if (local.endsWith(".")) problems.push("The part before the @ cannot end with a dot.");
  if (local.includes("..")) problems.push("It has two dots in a row before the @.");

  const disallowed = [
    ...new Set([...local].filter((character) => character.charCodeAt(0) < 128 && !/[.@\s]/.test(character) && !ATEXT_CHAR.test(character))),
  ];
  if (disallowed.length > 0) {
    problems.push(`It contains a character that is not allowed before the @: ${quote(disallowed)}.`);
  }
  if ([...local].some((character) => character.charCodeAt(0) > 127)) {
    warnings.push(
      "It has letters outside the English alphabet before the @. International addresses are valid (RFC 6531), but many systems still reject them.",
    );
  }
}

function checkDomain(domain: string, problems: string[], warnings: string[]): string | null {
  if (/^\[.*\]$/.test(domain)) {
    const literal = domain.slice(1, -1);
    const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(literal) && literal.split(".").every((part) => Number(part) <= 255);
    if (ipv4 || /^IPv6:[0-9a-f:.]+$/i.test(literal)) {
      warnings.push("The part after the @ is an IP address in brackets. That is valid, but almost no real mailbox uses one.");
      return null;
    }
    problems.push("The IP address after the @ is not valid.");
    return null;
  }

  if (/\s/.test(domain)) problems.push("It contains a space after the @.");
  if (domain.startsWith(".") || domain.endsWith(".")) problems.push("The domain cannot start or end with a dot.");
  if (domain.includes("..")) problems.push("The domain has two dots in a row.");
  if (!domain.includes(".")) problems.push("The domain has no dot — it needs an ending such as .com.");

  let ascii = domain.toLowerCase();
  if (/[^\x00-\x7f]/.test(domain)) {
    try {
      ascii = new URL(`http://${domain}`).hostname;
      warnings.push("The domain uses international characters. That is valid, but some older systems cannot deliver to it.");
    } catch {
      problems.push("The domain contains characters that cannot appear in a domain name.");
      return null;
    }
  }

  const invalid = [...new Set(ascii.replace(/[a-z0-9.\-\s]/g, "").split("").filter(Boolean))];
  if (invalid.length > 0) problems.push(`The domain contains a character that is not allowed: ${quote(invalid)}.`);

  const labels = ascii.split(".").filter(Boolean);
  if (labels.some((label) => label.startsWith("-") || label.endsWith("-"))) {
    problems.push("Part of the domain starts or ends with a hyphen.");
  }
  if (labels.some((label) => label.length > 63)) problems.push("Part of the domain is longer than 63 characters.");
  if (ascii.length > 253) problems.push("The domain is longer than 253 characters.");

  const ending = labels[labels.length - 1];
  if (ending && labels.length > 1 && (/^\d+$/.test(ending) || ending.length < 2)) {
    problems.push(`“.${ending}” is not a valid domain ending.`);
  }
  return ascii;
}

function suggestDomain(domain: string): string | null {
  const repaired = domain.replace(/\.(con|cmo|ocm|comm|vom|xom)$/, ".com").replace(/\.(nte|ent|met)$/, ".net");
  if (POPULAR_DOMAINS.includes(repaired)) return repaired === domain ? null : repaired;

  // Only fuzzy-match against longer names; short ones sit too close to real domains.
  const candidates = POPULAR_DOMAINS.filter((candidate) => candidate.length >= 8)
    .map((candidate) => ({ candidate, distance: editDistance(repaired, candidate) }))
    .filter(({ candidate, distance }) => distance > 0 && distance <= (candidate.length >= 11 ? 2 : 1))
    .sort((a, b) => a.distance - b.distance);
  return candidates[0]?.candidate ?? null;
}

export function checkEmail(input: string): EmailCheck {
  const address = input.trim().replace(/^mailto:/i, "");
  const problems: string[] = [];
  const warnings: string[] = [];

  const finish = (local: string, domain: string, asciiDomain: string | null, suggestion: string | null): EmailCheck => ({
    input,
    address,
    valid: problems.length === 0,
    problems,
    warnings,
    local,
    domain,
    asciiDomain: problems.length === 0 ? asciiDomain : null,
    suggestion,
  });

  if (!address) {
    problems.push("The address is empty.");
    return finish("", "", null, null);
  }

  const at = address.lastIndexOf("@");
  if (at === -1) {
    problems.push("It has no @ sign.");
    return finish(address, "", null, null);
  }

  const local = address.slice(0, at);
  const domain = address.slice(at + 1);

  if (!local) problems.push("There is nothing before the @.");
  else checkLocal(local, problems, warnings);

  let asciiDomain: string | null = null;
  if (!domain) problems.push("There is nothing after the @.");
  else asciiDomain = checkDomain(domain, problems, warnings);

  if (local && byteLength(local) > 64) {
    problems.push(`The part before the @ is ${byteLength(local)} characters long; the limit is 64.`);
  }
  if (byteLength(address) > 254) {
    problems.push(`The address is ${byteLength(address)} characters long; the limit is 254.`);
  }

  if (local && ROLE_ACCOUNTS.has(local.toLowerCase())) {
    warnings.push("This is a role address such as info@ or support@, which usually reaches a team rather than one person.");
  }

  const suggested = asciiDomain && problems.length === 0 ? suggestDomain(asciiDomain) : null;
  return finish(local, domain, asciiDomain, suggested ? `${local}@${suggested}` : null);
}
