/**
 * Tests for the src/lib modules that had none: utils, random, currencies,
 * image geometry, rates (with fetch mocked), pdf-meta and search.
 *
 * search and pdf-meta import through the "@/" alias, so this file runs with
 * scripts/lib/register-ts-alias.mjs (see the "test" script in package.json).
 */
import { cn, clamp, formatBytes, formatDecimal, formatLongDate, formatNumber } from "../src/lib/utils.ts";
import { randomInt, randomIntBetween, randomChoice, shuffle, sampleUnique, uuidV4, uuidV7, ulid, NIL_UUID, MAX_UUID } from "../src/lib/random.ts";
import { CURRENCY_INFO, currencyLabel } from "../src/lib/currencies.ts";
import { fitWithin, formatDimensions, FORMAT_EXTENSIONS, FORMAT_LABELS } from "../src/lib/image.ts";
import { fetchRates, activeProvider, RateProviderError } from "../src/lib/rates.ts";
import { stampProducer } from "../src/lib/pdf-meta.ts";
import { searchTools, filterTools } from "../src/lib/search.ts";
import { TOOLS } from "../src/config/tools/index.ts";
import { siteConfig } from "../src/config/site.ts";

let fails = 0;
const check = (name, cond, detail = "") => { if (!cond) { console.log(`FAIL ${name} ${detail}`); fails++; } };
const throws = (fn) => { try { fn(); return false; } catch { return true; } };
const rejects = async (promise) => { try { await promise; return null; } catch (error) { return error; } };

/* ---- utils ---- */
check("cn joins and skips falsy", cn("a", false, null, undefined, "", ["b", ["c", false]], 0) === "a b c 0", cn("a", false, null, undefined, "", ["b", ["c", false]], 0));
check("cn empty", cn() === "" && cn(false, [null]) === "");
check("clamp inside", clamp(5, 0, 10) === 5);
check("clamp low/high", clamp(-1, 0, 10) === 0 && clamp(11, 0, 10) === 10);
check("formatBytes bytes", formatBytes(0) === "0 B" && formatBytes(1023) === "1023 B");
check("formatBytes KB", formatBytes(1024) === "1.00 KB" && formatBytes(1536) === "1.50 KB", formatBytes(1536));
check("formatBytes MB digits", formatBytes(15.5 * 1024 * 1024) === "15.5 MB" && formatBytes(150 * 1024 * 1024) === "150 MB", formatBytes(15.5 * 1024 * 1024));
check("formatBytes caps at TB", formatBytes(5 * 1024 ** 5) === "5120 TB", formatBytes(5 * 1024 ** 5));
check("formatBytes fixed digits", formatBytes(2048, 0) === "2 KB");
check("formatBytes invalid", formatBytes(-1) === "—" && formatBytes(NaN) === "—" && formatBytes(Infinity) === "—");
check("formatNumber invalid", formatNumber(NaN) === "—" && formatNumber(Infinity) === "—");
check("formatNumber finite", /^1.?234.?5$/.test(formatNumber(1234.5)), formatNumber(1234.5));
check("formatDecimal trims zeros", formatDecimal(1.5) === "1.5" && formatDecimal(2) === "2");
check("formatDecimal float noise", formatDecimal(0.1 + 0.2) === "0.3", formatDecimal(0.1 + 0.2));
check("formatDecimal zero and negative", formatDecimal(0) === "0" && formatDecimal(-0.25) === "-0.25");
check("formatDecimal no grouping", formatDecimal(1234567) === "1234567");
check("formatDecimal tiny uses exponent", formatDecimal(1.5e-9) === "1.5e-9", formatDecimal(1.5e-9));
check("formatDecimal huge uses exponent", formatDecimal(2e20) === "2e+20", formatDecimal(2e20));
check("formatDecimal invalid", formatDecimal(NaN) === "" && formatDecimal(-Infinity) === "");
check("formatLongDate", formatLongDate("2026-10-01") === "1 October 2026", formatLongDate("2026-10-01"));
check("formatLongDate leap day", formatLongDate("2024-02-29") === "29 February 2024");

/* ---- random ---- */
check("randomInt rejects 0", throws(() => randomInt(0)) && throws(() => randomInt(-3)));
check("randomInt(1) is 0", randomInt(1) === 0);
{
  // 60,000 draws over 6 faces: each should land within ±5% of 10,000.
  const counts = new Array(6).fill(0);
  for (let i = 0; i < 60_000; i++) counts[randomInt(6)]++;
  check("randomInt roughly uniform", counts.every((c) => c > 9_500 && c < 10_500), counts.join(","));
  let inRange = true;
  const seen = new Set();
  for (let i = 0; i < 2_000; i++) { const v = randomIntBetween(10, 1); seen.add(v); if (v < 1 || v > 10 || !Number.isInteger(v)) inRange = false; }
  check("randomIntBetween inclusive, order-free", inRange && seen.has(1) && seen.has(10) && seen.size === 10);
  check("randomIntBetween fractional bounds", (() => { for (let i = 0; i < 500; i++) { const v = randomIntBetween(0.5, 2.5); if (v < 1 || v > 2) return false; } return true; })());
  check("randomChoice", ["a", "b"].includes(randomChoice(["a", "b"])));
  const items = [1, 2, 3, 4, 5, 6, 7, 8];
  const shuffled = shuffle(items);
  check("shuffle is a permutation", shuffled.length === 8 && [...shuffled].sort((a, b) => a - b).join() === items.join());
  check("shuffle does not mutate", items.join() === "1,2,3,4,5,6,7,8");
  // Position of element 0 after shuffling 4 items should be uniform.
  const firsts = [0, 0, 0, 0];
  for (let i = 0; i < 40_000; i++) firsts[shuffle([0, 1, 2, 3]).indexOf(0)]++;
  check("shuffle uniform", firsts.every((c) => c > 9_500 && c < 10_500), firsts.join(","));
  const lotto = sampleUnique(1, 49, 6);
  check("sampleUnique distinct in range", new Set(lotto).size === 6 && lotto.every((n) => n >= 1 && n <= 49));
  check("sampleUnique whole range", sampleUnique(1, 5, 5).sort().join() === "1,2,3,4,5");
  const sparse = sampleUnique(1, 1e9, 50);
  check("sampleUnique sparse path", new Set(sparse).size === 50 && sparse.every((n) => n >= 1 && n <= 1e9 && Number.isInteger(n)));
  check("sampleUnique too many", throws(() => sampleUnique(1, 3, 4)));
  check("sampleUnique zero", sampleUnique(1, 3, 0).length === 0);
}
{
  const v4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  const v7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  check("uuidV4 format", Array.from({ length: 50 }, uuidV4).every((id) => v4.test(id)));
  const before = Date.now();
  const id7 = uuidV7();
  const after = Date.now();
  check("uuidV7 format", v7.test(id7), id7);
  const ms = parseInt(id7.replace(/-/g, "").slice(0, 12), 16);
  check("uuidV7 embeds the time", ms >= before && ms <= after, `${ms} not in ${before}..${after}`);
  const a = uuidV7();
  const later = Date.now() + 2;
  while (Date.now() < later) { /* wait for the next millisecond */ }
  check("uuidV7 sorts by time", a < uuidV7());
  check("nil/max", NIL_UUID === "00000000-0000-0000-0000-000000000000" && MAX_UUID === "ffffffff-ffff-ffff-ffff-ffffffffffff");
  const u = ulid();
  check("ulid format", /^[0-9A-HJKMNP-TV-Z]{26}$/.test(u), u);
  const decode = (s) => [...s.slice(0, 10)].reduce((n, c) => n * 32 + "0123456789ABCDEFGHJKMNPQRSTVWXYZ".indexOf(c), 0);
  const t = decode(ulid());
  check("ulid embeds the time", Math.abs(t - Date.now()) < 1000, String(t));
}

/* ---- currencies ---- */
check("currency label", currencyLabel("GBP") === "GBP — Pound Sterling");
check("unknown currency label", currencyLabel("XYZ") === "XYZ");
check("currency codes are ISO-shaped", Object.keys(CURRENCY_INFO).every((code) => /^[A-Z]{3}$/.test(code)));
check("currency codes Intl-valid", Object.keys(CURRENCY_INFO).every((code) => { try { new Intl.NumberFormat("en", { style: "currency", currency: code }); return true; } catch { return false; } }));

/* ---- image geometry ---- */
const fw = (...args) => JSON.stringify(fitWithin(...args));
check("fit no box", fw(4000, 3000) === '{"width":4000,"height":3000}');
check("fit by width", fw(4000, 3000, 1920) === '{"width":1920,"height":1440}');
check("fit by height", fw(4000, 3000, undefined, 1000) === '{"width":1333,"height":1000}');
check("fit by both (tighter wins)", fw(4000, 3000, 1920, 1080) === '{"width":1440,"height":1080}');
check("fit no upscale by default", fw(800, 600, 1920, 1080) === '{"width":800,"height":600}');
check("fit upscale when asked", fw(800, 600, 1600, undefined, true) === '{"width":1600,"height":1200}');
check("fit never below 1px", fw(10000, 1, 100) === '{"width":100,"height":1}');
check("formatDimensions", /^1.?920 × 1.?080$/.test(formatDimensions(1920, 1080)), formatDimensions(1920, 1080));
check("format tables match", Object.keys(FORMAT_LABELS).every((k) => FORMAT_EXTENSIONS[k]));

/* ---- rates (fetch mocked; no network) ---- */
{
  const realFetch = globalThis.fetch;
  const env = { ...process.env };
  let lastUrl = "";
  const respond = (status, body) => { globalThis.fetch = async (url) => { lastUrl = String(url); return new Response(JSON.stringify(body), { status }); }; };
  try {
    delete process.env.EXCHANGE_RATE_PROVIDER;
    delete process.env.EXCHANGE_RATE_API_KEY;
    check("default provider is the ECB feed", activeProvider().id === "frankfurter");
    respond(200, { base: "EUR", date: "2026-10-19", rates: { USD: 1.08, GBP: 0.86 } });
    const snapshot = await fetchRates("EUR");
    check("rates include the base at 1", snapshot.rates.EUR === 1 && snapshot.rates.USD === 1.08 && snapshot.date === "2026-10-19");
    check("rates request escapes base", lastUrl.endsWith("base=EUR"));
    respond(503, {});
    const down = await rejects(fetchRates("EUR"));
    check("rates HTTP error is explained", down instanceof RateProviderError && /status 503/.test(down.message), String(down));
    respond(200, { base: "EUR", rates: {} });
    check("rates empty is an error", (await rejects(fetchRates("EUR"))) instanceof RateProviderError);
    process.env.EXCHANGE_RATE_API_KEY = "test-key";
    check("a key switches provider", activeProvider().id === "openexchangerates");
    process.env.EXCHANGE_RATE_PROVIDER = "frankfurter";
    check("explicit provider wins", activeProvider().id === "frankfurter");
    process.env.EXCHANGE_RATE_PROVIDER = "nonsense";
    check("unknown provider falls back", activeProvider().id === "openexchangerates");
    respond(200, { base: "USD", timestamp: 1_790_000_000, rates: { USD: 1, EUR: 0.9 } });
    const oxr = await fetchRates("USD");
    check("oxr date from timestamp", oxr.date === new Date(1_790_000_000_000).toISOString().slice(0, 10) && oxr.rates.EUR === 0.9);
    delete process.env.EXCHANGE_RATE_API_KEY;
    process.env.EXCHANGE_RATE_PROVIDER = "openexchangerates";
    check("oxr without a key is explained", /API key/.test((await rejects(fetchRates("USD")))?.message ?? ""));
  } finally {
    globalThis.fetch = realFetch;
    process.env = env;
  }
}

/* ---- pdf-meta ---- */
{
  const set = {};
  stampProducer({ setCreator: (v) => (set.creator = v), setProducer: (v) => (set.producer = v) });
  check("pdf producer stamped from config", set.creator === siteConfig.name && set.producer === siteConfig.name);
}

/* ---- search ---- */
{
  const slugs = (q, n) => searchTools(q, n).map((r) => r.tool.slug);
  check("search empty", searchTools("").length === 0 && searchTools("  !! ").length === 0);
  check("search exact name first", slugs("merge pdf")[0] === "merge-pdf", slugs("merge pdf").join());
  check("search case and punctuation", slugs("MERGE-PDF!")[0] === "merge-pdf");
  check("search prefix of a word", slugs("compr", 20).includes("compress-pdf") && slugs("compr", 20).includes("compress-image"));
  check("search all terms must match", slugs("pdf word", 50).every((s) => s.includes("pdf") || s.includes("word")) && slugs("pdf word").includes("pdf-to-word"), slugs("pdf word").join());
  check("search gibberish", searchTools("zzqxv").length === 0);
  check("search limit", searchTools("pdf", 3).length === 3);
  const sig = (q) => searchTools(q, 5).map((r) => `${r.tool.slug}:${r.score}`).join();
  check("search accents folded", sig("mérge pdf") === sig("merge pdf"), sig("mérge pdf"));
  check("search scores descending", searchTools("image", 50).every((r, i, a) => i === 0 || a[i - 1].score >= r.score));
  const pdfTools = TOOLS.filter((t) => t.category === "pdf");
  check("filterTools empty query keeps all", filterTools(pdfTools, " ").length === pdfTools.length);
  const filtered = filterTools(pdfTools, "merge");
  check("filterTools narrows within the list", filtered.length >= 1 && filtered.every((t) => t.category === "pdf") && filtered.some((t) => t.slug === "merge-pdf"));
  check("filterTools no match", filterTools(pdfTools, "zzqxv").length === 0);
}

console.log(fails === 0 ? "UTILS, RANDOM, RATES, IMAGE AND SEARCH TESTS OK" : `${fails} FAILURES`);
if (fails > 0) process.exitCode = 1;
