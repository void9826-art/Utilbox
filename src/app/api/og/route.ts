import http from "node:http";
import https from "node:https";
import zlib from "node:zlib";

import { siteConfig } from "@/config/site";
import {
  GuardError,
  NO_STORE,
  assertPublicHostname,
  checkRequest,
  guardedLookup,
  jsonError,
  readJsonBody,
} from "@/lib/net-guard";

/**
 * Fetches a public web page and reads its link-preview tags.
 *
 * Browsers block reading another site's HTML (CORS), so the page is fetched
 * here. Only public http(s) addresses on the standard ports are allowed, every
 * redirect is re-validated, connections resolve through a lookup that refuses
 * private addresses, and at most the document head is read. Nothing is stored.
 */

const MAX_REDIRECTS = 5;
const TIMEOUT_MS = 8000;
const MAX_BYTES = 1_500_000;

function validateUrl(value: string, base?: URL): URL {
  let url: URL;
  try {
    const trimmed = value.trim();
    url = base ? new URL(trimmed, base) : new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    throw new GuardError("That is not a valid web address.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new GuardError("Only http and https addresses can be previewed.");
  }
  if (url.username || url.password) throw new GuardError("Addresses containing a username or password are not supported.");
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new GuardError("Only pages on the standard web ports (80 and 443) can be previewed.");
  }
  assertPublicHostname(url.hostname);
  url.hash = "";
  return url;
}

function send(url: URL, signal: AbortSignal): Promise<http.IncomingMessage> {
  return new Promise((resolve, reject) => {
    const client = url.protocol === "https:" ? https : http;
    const request = client.request(
      url,
      {
        method: "GET",
        lookup: guardedLookup,
        signal,
        headers: {
          "User-Agent": `Mozilla/5.0 (compatible; ${siteConfig.name}-LinkPreview/1.0; +${siteConfig.url})`,
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "en;q=0.9, *;q=0.5",
        },
      },
      resolve,
    );
    request.on("error", reject);
    request.end();
  });
}

/** Reads until </head> or the size cap, decompressing as it goes. */
async function readHead(response: http.IncomingMessage): Promise<Buffer> {
  const encoding = String(response.headers["content-encoding"] ?? "").toLowerCase();
  const decoder =
    encoding === "gzip" || encoding === "x-gzip"
      ? zlib.createGunzip()
      : encoding === "deflate"
        ? zlib.createInflate()
        : encoding === "br"
          ? zlib.createBrotliDecompress()
          : null;
  const stream: NodeJS.ReadableStream = decoder ? response.pipe(decoder) : response;
  decoder?.on("error", () => undefined);

  const chunks: Buffer[] = [];
  let total = 0;
  try {
    for await (const chunk of stream as AsyncIterable<Buffer>) {
      chunks.push(chunk);
      total += chunk.length;
      if (total >= MAX_BYTES) break;
      const tail = Buffer.concat(chunks.slice(-2)).toString("latin1");
      if (/<\/head>/i.test(tail)) break;
    }
  } catch {
    if (chunks.length === 0) throw new GuardError("The page's response could not be decoded.", 502);
  } finally {
    response.destroy();
  }
  return Buffer.concat(chunks);
}

function describeFetchError(error: unknown, url: URL): GuardError {
  if (error instanceof GuardError) return error;
  const failure = error as NodeJS.ErrnoException;
  if (failure?.name === "AbortError") return new GuardError(`${url.hostname} did not respond within 8 seconds.`, 504);
  switch (failure?.code) {
    case "EBLOCKED":
      return new GuardError(`${url.hostname} resolves to a private or reserved address, which this tool does not fetch.`, 422);
    case "ENOTFOUND":
      return new GuardError(`${url.hostname} could not be found. Check the address.`, 422);
    case "ECONNREFUSED":
      return new GuardError(`${url.hostname} refused the connection.`, 502);
    default:
      if (/CERT|SSL|TLS/i.test(failure?.code ?? "")) {
        return new GuardError(`${url.hostname} has an HTTPS certificate problem (${failure.code}), so crawlers will not read it either.`, 502);
      }
      return new GuardError(`${url.hostname} could not be fetched.`, 502);
  }
}

async function fetchPage(start: URL) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const redirects: string[] = [];
  let url = start;

  try {
    for (let hop = 0; ; hop += 1) {
      let response: http.IncomingMessage;
      try {
        response = await send(url, controller.signal);
      } catch (error) {
        throw describeFetchError(error, url);
      }

      const status = response.statusCode ?? 0;
      const location = response.headers.location;
      if (status >= 300 && status < 400 && location) {
        response.destroy();
        if (hop >= MAX_REDIRECTS) throw new GuardError("The page redirected too many times.", 502);
        url = validateUrl(location, url);
        redirects.push(url.toString());
        continue;
      }

      const contentType = String(response.headers["content-type"] ?? "");
      if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
        response.destroy();
        return { url, status, contentType, redirects, html: "" };
      }

      let buffer: Buffer;
      try {
        buffer = await readHead(response);
      } catch (error) {
        throw describeFetchError(error, url);
      }
      const declared =
        contentType.match(/charset=["']?([\w-]+)/i)?.[1] ??
        buffer.subarray(0, 4096).toString("latin1").match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ??
        "utf-8";
      let html: string;
      try {
        html = new TextDecoder(declared).decode(buffer);
      } catch {
        html = new TextDecoder("utf-8").decode(buffer);
      }
      return { url, status, contentType, redirects, html };
    }
  } finally {
    clearTimeout(timer);
  }
}

const NAMED_ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity: string) => {
    const key = entity.toLowerCase();
    if (key.startsWith("#")) {
      const codePoint = key[1] === "x" ? Number.parseInt(key.slice(2), 16) : Number.parseInt(key.slice(1), 10);
      return Number.isFinite(codePoint) && codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    }
    return NAMED_ENTITIES[key] ?? match;
  });
}

function attributes(tag: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const match of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return result;
}

function parseHead(html: string, base: URL) {
  const head = html.split(/<\/head>/i)[0]
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, "");

  const meta: Array<{ key: string; value: string }> = [];
  for (const match of head.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    const key = (attrs.property ?? attrs.name ?? attrs.itemprop ?? "").trim().toLowerCase();
    if (key && attrs.content !== undefined) meta.push({ key, value: attrs.content.trim() });
  }

  const get = (...keys: string[]) => {
    for (const key of keys) {
      const value = meta.find((entry) => entry.key === key)?.value;
      if (value) return value;
    }
    return null;
  };
  // Only absolute http(s) URLs are returned, so nothing like javascript: reaches the page.
  const absolute = (value: string | null | undefined) => {
    if (!value) return null;
    try {
      const url = new URL(value, base);
      return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
    } catch {
      return null;
    }
  };
  const number = (value: string | null) => (value && /^\d+$/.test(value) ? Number(value) : null);

  const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((match) => attributes(match[0]));
  const relIs = (link: Record<string, string>, name: string) => (link.rel ?? "").toLowerCase().split(/\s+/).includes(name);
  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];

  return {
    title: title ? decodeEntities(title.replace(/\s+/g, " ").trim()) || null : null,
    description: get("description"),
    canonical: absolute(links.find((link) => relIs(link, "canonical"))?.href),
    icon: absolute(links.find((link) => relIs(link, "icon"))?.href ?? "/favicon.ico"),
    lang: html.match(/<html\b[^>]*\blang=["']?([\w-]+)/i)?.[1] ?? null,
    og: {
      title: get("og:title"),
      description: get("og:description"),
      image: absolute(get("og:image", "og:image:url", "og:image:secure_url")),
      imageAlt: get("og:image:alt"),
      imageWidth: number(get("og:image:width")),
      imageHeight: number(get("og:image:height")),
      url: absolute(get("og:url")),
      type: get("og:type"),
      siteName: get("og:site_name"),
      locale: get("og:locale"),
    },
    twitter: {
      card: get("twitter:card"),
      title: get("twitter:title"),
      description: get("twitter:description"),
      image: absolute(get("twitter:image", "twitter:image:src")),
      imageAlt: get("twitter:image:alt"),
      site: get("twitter:site"),
      creator: get("twitter:creator"),
    },
    meta: meta.slice(0, 80),
  };
}

export async function POST(request: Request) {
  try {
    checkRequest(request, { scope: "og", limit: 20, windowMs: 60_000 });
    const body = await readJsonBody(request);
    const start = validateUrl(String(body.url ?? "").slice(0, 2000));
    const page = await fetchPage(start);

    return Response.json(
      {
        requestedUrl: start.toString(),
        finalUrl: page.url.toString(),
        status: page.status,
        contentType: page.contentType,
        redirects: page.redirects,
        isHtml: page.html !== "",
        ...parseHead(page.html, page.url),
      },
      { headers: NO_STORE },
    );
  } catch (error) {
    return jsonError(error, "The page could not be previewed.");
  }
}
