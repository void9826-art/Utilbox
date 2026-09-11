/**
 * robots.txt parsing, URL testing and generation, following RFC 9309 — the
 * standard Google, Bing and other major crawlers implement:
 *
 *  - A crawler obeys every group whose User-agent matches its product token
 *    (case-insensitively), merged; only when none match does it use "*".
 *  - Of the rules that match a URL, the one with the longest path wins; on a
 *    tie, Allow wins.
 *  - "*" matches any run of characters and a trailing "$" anchors the end.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

export interface RobotsRule {
  allow: boolean;
  path: string;
  line: number;
}

export interface RobotsGroup {
  agents: string[];
  rules: RobotsRule[];
  crawlDelay: number | null;
  line: number;
}

export interface RobotsWarning {
  line: number;
  message: string;
}

export interface ParsedRobots {
  groups: RobotsGroup[];
  sitemaps: string[];
  warnings: RobotsWarning[];
}

/** Google stops reading a robots.txt file after this many bytes. */
export const ROBOTS_MAX_BYTES = 500 * 1024;

/** Crawlers that collect content for AI products, with what each token controls. */
export const AI_CRAWLERS: Array<{ token: string; owner: string; purpose: string }> = [
  { token: "GPTBot", owner: "OpenAI", purpose: "collects content for training models" },
  { token: "OAI-SearchBot", owner: "OpenAI", purpose: "indexes pages for ChatGPT search results" },
  { token: "ClaudeBot", owner: "Anthropic", purpose: "collects content for training models" },
  { token: "CCBot", owner: "Common Crawl", purpose: "builds an open web archive that many AI models are trained on" },
  { token: "Google-Extended", owner: "Google", purpose: "controls use in Gemini training; it does not affect Google Search" },
  { token: "Applebot-Extended", owner: "Apple", purpose: "controls use in Apple's AI training; it does not affect Siri or Spotlight" },
  { token: "meta-externalagent", owner: "Meta", purpose: "collects content for training models" },
  { token: "PerplexityBot", owner: "Perplexity", purpose: "indexes pages for Perplexity answers" },
  { token: "Bytespider", owner: "ByteDance", purpose: "collects content for training models" },
];

export function parseRobots(text: string): ParsedRobots {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  const warnings: RobotsWarning[] = [];

  if (new TextEncoder().encode(text).length > ROBOTS_MAX_BYTES) {
    warnings.push({ line: 0, message: "The file is larger than 500 KiB. Google ignores everything after that point." });
  }

  let current: RobotsGroup | null = null;
  let previousWasAgent = false;

  text.split(/\r\n|\r|\n/).forEach((rawLine, index) => {
    const line = index + 1;
    const content = rawLine.replace(/#.*$/, "").trim();
    if (!content) return;

    const colon = content.indexOf(":");
    if (colon === -1) {
      warnings.push({ line, message: `“${content.slice(0, 40)}” is not a directive (expected “Name: value”) and is ignored.` });
      return;
    }

    const name = content.slice(0, colon).trim();
    const key = name.toLowerCase().replace(/[\s_]+/g, "-");
    const value = content.slice(colon + 1).trim();

    switch (key) {
      case "user-agent":
      case "useragent": {
        if (key !== "user-agent") warnings.push({ line, message: `“${name}” should be written “User-agent”.` });
        if (!current || !previousWasAgent) {
          current = { agents: [], rules: [], crawlDelay: null, line };
          groups.push(current);
        }
        if (value) current.agents.push(value);
        else warnings.push({ line, message: "User-agent has no value, so this line does nothing." });
        previousWasAgent = true;
        return;
      }

      case "allow":
      case "disallow":
      case "dissallow":
      case "disalow": {
        previousWasAgent = false;
        if (key === "dissallow" || key === "disalow") {
          warnings.push({ line, message: `“${name}” is misspelled — it should be “Disallow”. Crawlers ignore misspelled rules.` });
          return;
        }
        if (!current) {
          warnings.push({ line, message: "This rule comes before any User-agent line, so no crawler applies it." });
          return;
        }
        // An empty Disallow means "nothing is disallowed"; it is a rule, but matches nothing.
        if (value === "") return;
        if (!value.startsWith("/") && !value.startsWith("*")) {
          warnings.push({ line, message: `Paths should start with “/”. “${value}” will not match the URLs you probably intend.` });
        }
        current.rules.push({ allow: key === "allow", path: value, line });
        return;
      }

      case "sitemap":
      case "site-map": {
        try {
          const url = new URL(value);
          if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("scheme");
          sitemaps.push(value);
        } catch {
          warnings.push({ line, message: "Sitemap must be a full URL, including https://." });
        }
        return;
      }

      case "crawl-delay": {
        previousWasAgent = false;
        const delay = Number(value);
        if (!current) {
          warnings.push({ line, message: "Crawl-delay comes before any User-agent line and is ignored." });
        } else if (!Number.isFinite(delay) || delay < 0) {
          warnings.push({ line, message: "Crawl-delay must be a number of seconds." });
        } else {
          current.crawlDelay = delay;
          warnings.push({ line, message: "Crawl-delay is ignored by Google. Bing and Yandex respect it." });
        }
        return;
      }

      case "noindex":
      case "nofollow":
        warnings.push({
          line,
          message: `${name} is not a robots.txt rule. Google stopped supporting it in 2019 — use a robots meta tag or an X-Robots-Tag header instead.`,
        });
        return;

      case "host":
        warnings.push({ line, message: "Host was a Yandex-only directive and is no longer used." });
        return;

      default:
        warnings.push({ line, message: `Unknown directive “${name}” is ignored.` });
    }
  });

  return { groups, sitemaps, warnings };
}

/** The product token a User-agent value or crawler name contains: "Googlebot/2.1" → "googlebot". */
export function productToken(value: string): string {
  return (value.trim().match(/^[A-Za-z_-]+/)?.[0] ?? "").toLowerCase();
}

/** Upper-cases percent escapes and percent-encodes non-ASCII, so equivalent paths compare equal. */
export function normalisePath(value: string): string {
  return value
    .replace(/[^\x00-\x7f]/gu, (character) => encodeURIComponent(character))
    .replace(/%[0-9a-f]{2}/gi, (escape) => escape.toUpperCase());
}

/**
 * Wildcard match without regular expressions, so a hostile pattern such as
 * "*a*a*a…" cannot trigger catastrophic backtracking. O(pattern × path).
 */
export function matchesPattern(pattern: string, path: string): boolean {
  let body = pattern;
  const anchored = body.endsWith("$");
  if (anchored) body = body.slice(0, -1);
  // Without "$", a rule matches any path that starts with it.
  if (!anchored) body += "*";

  let p = 0;
  let s = 0;
  let star = -1;
  let resume = 0;

  while (s < path.length) {
    if (p < body.length && body[p] !== "*" && body[p] === path[s]) {
      p += 1;
      s += 1;
    } else if (p < body.length && body[p] === "*") {
      star = p;
      resume = s;
      p += 1;
    } else if (star !== -1) {
      p = star + 1;
      resume += 1;
      s = resume;
    } else {
      return false;
    }
  }
  while (p < body.length && body[p] === "*") p += 1;
  return p === body.length;
}

export interface RobotsVerdict {
  allowed: boolean;
  path: string;
  /** User-agent values of the groups that were applied. */
  agents: string[];
  usedWildcardGroup: boolean;
  rule: RobotsRule | null;
}

function toPath(target: string): string {
  const trimmed = target.trim();
  try {
    const url = new URL(trimmed);
    return normalisePath(`${url.pathname}${url.search}`);
  } catch {
    return normalisePath(trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
  }
}

export function evaluateUrl(parsed: ParsedRobots, crawler: string, target: string): RobotsVerdict {
  const path = toPath(target);
  const token = productToken(crawler);

  let groups = token
    ? parsed.groups.filter((group) => group.agents.some((agent) => agent.trim() !== "*" && productToken(agent) === token))
    : [];
  const usedWildcardGroup = groups.length === 0;
  if (usedWildcardGroup) groups = parsed.groups.filter((group) => group.agents.some((agent) => agent.trim() === "*"));

  const agents = [...new Set(groups.flatMap((group) => group.agents))];

  // The robots.txt file itself is always fetchable.
  if (path === "/robots.txt") return { allowed: true, path, agents, usedWildcardGroup, rule: null };

  let best: RobotsRule | null = null;
  let bestLength = -1;
  for (const rule of groups.flatMap((group) => group.rules)) {
    const pattern = normalisePath(rule.path);
    if (!matchesPattern(pattern, path)) continue;
    const winsTie = pattern.length === bestLength && rule.allow && best !== null && !best.allow;
    if (pattern.length > bestLength || winsTie) {
      best = rule;
      bestLength = pattern.length;
    }
  }

  return { allowed: best ? best.allow : true, path, agents, usedWildcardGroup, rule: best };
}

export interface RobotsGroupInput {
  agents: string[];
  allow: string[];
  disallow: string[];
  crawlDelay?: number | null;
}

/** Removes line breaks so an entered value cannot inject extra directives. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function buildRobots(groups: RobotsGroupInput[], sitemaps: string[]): string {
  const blocks = groups
    .map((group) => ({
      agents: group.agents.map(oneLine).filter(Boolean),
      allow: group.allow.map(oneLine).filter(Boolean),
      disallow: group.disallow.map(oneLine).filter(Boolean),
      crawlDelay: group.crawlDelay,
    }))
    .filter((group) => group.agents.length > 0)
    .map((group) => {
      const lines = group.agents.map((agent) => `User-agent: ${agent}`);
      lines.push(...group.allow.map((path) => `Allow: ${path}`));
      lines.push(...group.disallow.map((path) => `Disallow: ${path}`));
      // A group needs at least one rule, or its User-agent lines merge into the next group.
      if (group.allow.length === 0 && group.disallow.length === 0) lines.push("Disallow:");
      if (group.crawlDelay) lines.push(`Crawl-delay: ${group.crawlDelay}`);
      return lines.join("\n");
    });

  const sitemapLines = sitemaps.map(oneLine).filter(Boolean).map((url) => `Sitemap: ${url}`);
  if (sitemapLines.length > 0) blocks.push(sitemapLines.join("\n"));

  return blocks.length > 0 ? `${blocks.join("\n\n")}\n` : "";
}
