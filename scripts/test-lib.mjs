import { parseJson, analyseJson, sortKeysDeep } from "../src/lib/json.ts";
import { amortise, compoundGrowth, roundMoney } from "../src/lib/money.ts";
import { convertUnits, convertTemperature, LENGTH_UNITS, WEIGHT_UNITS, VOLUME_UNITS, DATA_UNITS } from "../src/lib/units.ts";
import { safeFileName } from "../src/lib/files.ts";

let fails = 0;
const check = (name, cond, detail = "") => { if (!cond) { console.log(`FAIL ${name} ${detail}`); fails++; } };
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

/* ---- JSON ---- */
const good = parseJson('{"a":1,"b":[1,2,{"c":true}]}');
check("json valid", good.ok);
const bad = parseJson('{"a":1,}');
check("json trailing comma detected", !bad.ok && bad.line === 1, JSON.stringify(bad));
check("json trailing comma message", !bad.ok && /trailing comma/i.test(bad.message), bad.message);
const multiline = parseJson('{\n  "a": 1,\n  "b": 2\n  "c": 3\n}');
check("json multiline line number", !multiline.ok && multiline.line === 4, JSON.stringify(multiline));
const singleQuote = parseJson("{'a':1}");
check("json single quote message", !singleQuote.ok && /double quotes/i.test(singleQuote.message), singleQuote.message);

const dupSource = '{"a":1,"a":2,"b":{"c":1,"c":2},"d":[{"e":1},{"e":2}]}';
const dupParsed = parseJson(dupSource);
const stats = analyseJson(dupParsed.value, dupSource);
check("dup keys found", stats.duplicateKeyPaths.includes("a") && stats.duplicateKeyPaths.includes("c"), JSON.stringify(stats.duplicateKeyPaths));
check("no false dup across array items", !stats.duplicateKeyPaths.includes("e"), JSON.stringify(stats.duplicateKeyPaths));
check("depth", stats.depth === 4, String(stats.depth));

check("sortKeys", JSON.stringify(sortKeysDeep({ b: 1, a: { d: 1, c: 2 } })) === '{"a":{"c":2,"d":1},"b":1}');

/* ---- money ---- */
const loan = amortise(500000, 0.09 / 12, 60);
check("emi payment", near(loan.payment, 10379.12, 0.5), String(loan.payment));
check("emi rows", loan.rows.length === 60, String(loan.rows.length));
check("emi final balance zero", loan.rows[59].balance === 0, String(loan.rows[59].balance));
const sumPrincipal = loan.rows.reduce((s, r) => s + r.principal, 0);
check("emi principal sums to loan", near(sumPrincipal, 500000, 0.01), String(sumPrincipal));
const sumPaid = loan.rows.reduce((s, r) => s + r.payment, 0);
check("emi totals agree", near(sumPaid, loan.totalPaid, 0.01), `${sumPaid} vs ${loan.totalPaid}`);

const zero = amortise(1200, 0, 12);
check("zero-rate payment", near(zero.payment, 100), String(zero.payment));
check("zero-rate no interest", near(zero.totalInterest, 0), String(zero.totalInterest));

const g = compoundGrowth({ principal: 5000, annualRate: 0.07, years: 10, compoundsPerYear: 12, contribution: 200, contributionsPerYear: 12, contributeAtStart: false });
check("growth contributed", near(g.totalContributed, 24000, 0.01), String(g.totalContributed));
check("growth balance plausible", g.finalBalance > 43000 && g.finalBalance < 46000, String(g.finalBalance));
check("growth parts add up", near(5000 + g.totalContributed + g.totalInterest, g.finalBalance, 0.02), String(g.finalBalance));
check("growth rows", g.rows.length === 10, String(g.rows.length));

const plain = compoundGrowth({ principal: 1000, annualRate: 0.1, years: 2, compoundsPerYear: 1 });
check("simple compound", near(plain.finalBalance, 1210, 0.01), String(plain.finalBalance));

check("roundMoney half up", roundMoney(2.005) === 2.01, String(roundMoney(2.005)));
check("roundMoney negative", roundMoney(-2.005) === -2.01, String(roundMoney(-2.005)));

/* ---- units ---- */
check("inch to cm", near(convertUnits(LENGTH_UNITS, 1, "in", "cm"), 2.54));
check("mile to km", near(convertUnits(LENGTH_UNITS, 1, "mi", "km"), 1.609344));
check("lb to kg", near(convertUnits(WEIGHT_UNITS, 1, "lb", "kg"), 0.45359237));
check("stone to lb", near(convertUnits(WEIGHT_UNITS, 1, "st", "lb"), 14, 1e-9));
check("us gal != uk gal", !near(convertUnits(VOLUME_UNITS, 1, "gal_us", "l"), convertUnits(VOLUME_UNITS, 1, "gal_uk", "l")));
check("us gal litres", near(convertUnits(VOLUME_UNITS, 1, "gal_us", "l"), 3.785411784));
check("1TB in GiB", near(convertUnits(DATA_UNITS, 1, "TB", "GiB"), 931.3225746154785, 1e-6), String(convertUnits(DATA_UNITS, 1, "TB", "GiB")));
check("round trip", near(convertUnits(LENGTH_UNITS, convertUnits(LENGTH_UNITS, 5, "m", "ft"), "ft", "m"), 5, 1e-9));

check("C to F", near(convertTemperature(180, "c", "f"), 356));
check("F to C", near(convertTemperature(-40, "f", "c"), -40));
check("C to K", near(convertTemperature(0, "c", "k"), 273.15));
check("K to R", near(convertTemperature(0, "k", "r"), 0));

/* ---- files ---- */
check("safeFileName strips path", safeFileName("../../etc/passwd") === "passwd", safeFileName("../../etc/passwd"));
const BS = String.fromCharCode(92);
const windowsPath = `C:${BS}Windows${BS}evil.txt`;
check("safeFileName strips backslash path", safeFileName(windowsPath) === "evil.txt", safeFileName(windowsPath));
check("safeFileName keeps digits", safeFileName("report 2026.pdf") === "report 2026.pdf", safeFileName("report 2026.pdf"));
check("safeFileName reserved", safeFileName("CON.txt") === "_CON.txt", safeFileName("CON.txt"));
check("safeFileName fallback", safeFileName("///") === "file", safeFileName("///"));
check("safeFileName removes illegal", safeFileName('a<b>c:d"e|f?g*h.txt') === "abcdefgh.txt", safeFileName('a<b>c:d"e|f?g*h.txt'));

console.log(fails === 0 ? "LIB TESTS OK" : `${fails} LIB FAILURES`);

/* ---- formatters + csv (appended) ---- */
import { formatHtml, minifyHtml, formatCss, minifyCss } from "../src/lib/formatters.ts";
import { jsonToRows, escapeCsvValue, DEFAULT_CSV_OPTIONS } from "../src/lib/csv.ts";
import { encodeText, decodeToBytes, decodeToText, normaliseBase64 } from "../src/lib/base64.ts";

let f2 = 0;
const chk = (n, c, d = "") => { if (!c) { console.log(`FAIL ${n} ${d}`); f2++; } };

const htmlIn = '<div><p>Hi</p><br><script>if(a<b){x()}</script></div>';
const htmlOut = formatHtml(htmlIn);
chk("html indents", htmlOut.includes("\n  <p>Hi</p>"), JSON.stringify(htmlOut));
chk("html void no indent", !htmlOut.includes("\n    <br>"), JSON.stringify(htmlOut));
chk("html script preserved", htmlOut.includes("if(a<b){x()}"), JSON.stringify(htmlOut));
chk("html minify drops comments", !minifyHtml("<p>a</p><!-- c -->").includes("c"));

const cssOut = formatCss('.a,.b{color:red;background:url("x;y.png")}@media(min-width:1px){.c{top:0}}');
chk("css braces", (cssOut.match(/\{/g) || []).length === 3, cssOut);
chk("css url intact", cssOut.includes('url("x;y.png")'), cssOut);
chk("css nested indent", /\n {2}\.c \{/.test(cssOut) || cssOut.includes("  .c {"), JSON.stringify(cssOut));
const cssMin = minifyCss('/* c */ .a { color : red ; }');
chk("css minify", cssMin === ".a{color:red}", cssMin);

const t = jsonToRows([{ a: 1, b: { c: 2 } }, { a: 3, d: [1, 2] }], { arrays: "index", arrayJoiner: ",", maxDepth: 10 });
chk("csv headers union", t.headers.join("|") === "a|b.c|d.0|d.1", t.headers.join("|"));
chk("csv sparse detected", t.sparseColumns.length === 3, JSON.stringify(t.sparseColumns));
chk("csv quotes delimiter", escapeCsvValue("a,b", DEFAULT_CSV_OPTIONS) === '"a,b"');
chk("csv doubles quotes", escapeCsvValue('say "hi"', DEFAULT_CSV_OPTIONS) === '"say ""hi"""');
chk("csv formula escaped", escapeCsvValue("=SUM(A1)", DEFAULT_CSV_OPTIONS) === "'=SUM(A1)");
chk("csv join mode", jsonToRows([{ t: [1, 2] }], { arrays: "join", arrayJoiner: " | ", maxDepth: 10 }).rows[0][0] === "1 | 2");

const enc = encodeText("café 日本語 👍");
chk("b64 unicode round trip", decodeToText(decodeToBytes(enc).bytes).text === "café 日本語 👍");
chk("b64 urlsafe", !encodeText("??>>??", true).includes("/"));
chk("b64 accepts missing padding", normaliseBase64("YWJjZA").base64 === "YWJjZA==");
chk("b64 data uri", normaliseBase64("data:image/png;base64,iVBORw0KGgo=").mediaType === "image/png");
let threw = false;
try { normaliseBase64("!!!!"); } catch { threw = true; }
chk("b64 rejects junk", threw);

console.log(f2 === 0 ? "FORMATTER/CSV/BASE64 TESTS OK" : `${f2} FAILURES`);

/* ---- pdf page ranges (appended) ---- */
import { parsePageRanges, summarisePages } from "../src/lib/pdf.ts";
let f3 = 0;
const ck = (n, c, d = "") => { if (!c) { console.log(`FAIL ${n} ${d}`); f3++; } };

ck("range simple", parsePageRanges("1-3", 10).pages.join(",") === "1,2,3");
ck("range mixed", parsePageRanges("1-3, 5, 8-9", 10).pages.join(",") === "1,2,3,5,8,9");
ck("range dedupe", parsePageRanges("1-3, 2, 3", 10).pages.join(",") === "1,2,3");
ck("range order preserved", parsePageRanges("5, 1, 3", 10).pages.join(",") === "5,1,3");
ck("range descending", parsePageRanges("5-3", 10).pages.join(",") === "5,4,3");
ck("range spaces", parsePageRanges("  1 - 3 ,  7 ", 10).pages.join(",") === "1,2,3,7");
ck("range out of bounds", parsePageRanges("1-20", 10).error !== null);
ck("range zero", parsePageRanges("0-3", 10).error !== null);
ck("range junk", parsePageRanges("abc", 10).error !== null);
ck("range empty", parsePageRanges("", 10).error !== null);
ck("summarise contiguous", summarisePages([1,2,3,7,8]) === "1-3, 7-8", summarisePages([1,2,3,7,8]));
ck("summarise single", summarisePages([4]) === "4");
ck("summarise unsorted", summarisePages([3,1,2]) === "1-3");

console.log(f3 === 0 ? "PDF RANGE TESTS OK" : `${f3} FAILURES`);

/* ---- table detection (appended) ---- */
import { detectTable, trimTable, groupIntoLines, lineToText } from "../src/lib/pdf.ts";
let f4 = 0;
const ct = (n, c, d = "") => { if (!c) { console.log(`FAIL ${n} ${d}`); f4++; } };

// Three columns at x = 50, 200, 350 across four rows.
const items = [];
const rows = [["Name","Qty","Price"],["Widget","2","9.99"],["Gadget","10","24.50"],["Bolt","100","0.15"]];
rows.forEach((row, r) => {
  row.forEach((text, c) => {
    items.push({ text, x: 50 + c * 150, y: 700 - r * 20, width: text.length * 6, height: 10 });
  });
});

const lines = groupIntoLines(items);
ct("lines grouped", lines.length === 4, String(lines.length));
ct("reading order top down", lineToText(lines[0].items).startsWith("Name"), lineToText(lines[0].items));

const table = trimTable(detectTable(lines));
ct("table rows", table.length === 4, String(table.length));
ct("table cols", table[0].length === 3, JSON.stringify(table[0]));
ct("table header", table[0].join("|") === "Name|Qty|Price", table[0].join("|"));
ct("table data", table[2].join("|") === "Gadget|10|24.50", table[2].join("|"));

// Plain prose has no consistent column structure and must not become a grid.
const prose = [];
["The quick brown fox", "jumps over the lazy", "dog near the river"].forEach((line, r) => {
  line.split(" ").forEach((word, i) => {
    prose.push({ text: word, x: 40 + i * 47 + r * 11, y: 500 - r * 18, width: word.length * 6, height: 10 });
  });
});
const proseTable = detectTable(groupIntoLines(prose));
ct("prose stays single column", proseTable.every((r) => r.length === 1), JSON.stringify(proseTable));

ct("trim removes empty rows", trimTable([["a","b"],["",""],["c","d"]]).length === 2);
ct("trim removes empty cols", trimTable([["a","","b"],["c","","d"]])[0].length === 2);

console.log(f4 === 0 ? "TABLE DETECTION TESTS OK" : `${f4} FAILURES`);

/* ---- palette, ico, metadata stripping, file sniffing (appended) ---- */
import { extractPalette, contrastRatio, rgbToHex } from "../src/lib/palette.ts";
import { encodeIco, readIcoDirectory } from "../src/lib/ico.ts";
import { stripMetadata, readTiffOrientation } from "../src/lib/metadata-strip.ts";
import { sniffFileKind } from "../src/lib/files.ts";
let f5 = 0;
const cm = (n, c, d = "") => { if (!c) { console.log(`FAIL ${n} ${d}`); f5++; } };
const asciiBytes = (s) => [...s].map((ch) => ch.charCodeAt(0));
const asText = (bytes) => Array.from(bytes, (b) => String.fromCharCode(b)).join("");

/* palette */
const px = [];
for (let i = 0; i < 60; i++) px.push(220, 20, 30, 255);
for (let i = 0; i < 40; i++) px.push(20, 40, 200, 255);
for (let i = 0; i < 25; i++) px.push(0, 255, 0, 0); // fully transparent: ignored
const pal = extractPalette(px, 4);
cm("palette finds two colours", pal.length === 2, JSON.stringify(pal));
cm("palette most common first", pal[0].hex === "#dc141e" && Math.abs(pal[0].share - 0.6) < 1e-9, JSON.stringify(pal[0]));
cm("palette ignores transparent", Math.abs(pal[0].share + pal[1].share - 1) < 1e-9);
cm("palette deterministic", JSON.stringify(extractPalette(px, 4)) === JSON.stringify(pal));
cm("palette empty image", extractPalette([0, 0, 0, 0], 5).length === 0);
cm("contrast black on white", Math.abs(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }) - 21) < 1e-9);
cm("rgbToHex pads", rgbToHex({ r: 255, g: 8, b: 0 }) === "#ff0800");

/* ico */
const fakePng = (n) => Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, ...new Array(n).fill(7)]);
const ico = encodeIco([{ size: 16, png: fakePng(10) }, { size: 256, png: fakePng(20) }]);
const dir = readIcoDirectory(ico);
cm("ico entry count", dir.length === 2);
cm("ico 256 stored as zero", ico[6 + 16] === 0 && dir[1].width === 256, JSON.stringify(dir));
cm("ico offsets", dir[0].offset === 38 && dir[1].offset === 56, JSON.stringify(dir));
cm("ico embedded png detected", dir.every((entry) => entry.isPng));
cm("ico total length", ico.length === 38 + 18 + 28, String(ico.length));

/* jpeg: JFIF, EXIF (orientation 6, Make "Cam"), ICC, comment, scan with stuffing, trailer */
const u16 = (n) => [n >> 8, n & 255];
const seg = (marker, payload) => [0xff, marker, ...u16(payload.length + 2), ...payload];
const tiff = [0x49, 0x49, 0x2a, 0x00, 8, 0, 0, 0, 2, 0,
  0x12, 0x01, 3, 0, 1, 0, 0, 0, 6, 0, 0, 0,
  0x0f, 0x01, 2, 0, 4, 0, 0, 0, ...asciiBytes("Cam"), 0,
  0, 0, 0, 0];
const scan = [0x12, 0xff, 0x00, 0x34, 0xff, 0xd0, 0x56];
const jpeg = Uint8Array.from([0xff, 0xd8,
  ...seg(0xe0, [...asciiBytes("JFIF"), 0, 1, 1, 0, 0, 1, 0, 1, 0, 0]),
  ...seg(0xe1, [...asciiBytes("Exif"), 0, 0, ...tiff]),
  ...seg(0xe2, [...asciiBytes("ICC_PROFILE"), 0, 1, 1, 9, 9]),
  ...seg(0xfe, asciiBytes("secret comment")),
  ...seg(0xdb, [0, ...new Array(64).fill(1)]),
  ...seg(0xda, [1, 1, 0, 0, 63, 0]),
  ...scan, 0xff, 0xd9, ...asciiBytes("TRAILER")]);
const cleaned = stripMetadata(jpeg, "jpeg", { keepColorProfile: true, keepOrientation: true });
const jt = asText(cleaned.bytes);
cm("jpeg orientation read", cleaned.orientation === 6, String(cleaned.orientation));
cm("jpeg comment removed", !jt.includes("secret"));
cm("jpeg exif tags removed", !jt.includes("Cam"));
cm("jpeg icc kept", jt.includes("ICC_PROFILE"));
cm("jpeg trailer dropped", !jt.includes("TRAILER"));
cm("jpeg scan byte-identical", jt.includes(asText([...scan, 0xff, 0xd9])));
cm("jpeg orientation segment after JFIF", cleaned.bytes[20] === 0xff && cleaned.bytes[21] === 0xe1);
cm("jpeg orientation segment readable", readTiffOrientation(cleaned.bytes.subarray(30, 56)) === 6);
const bare = stripMetadata(jpeg, "jpeg", { keepColorProfile: false, keepOrientation: false });
const bt = asText(bare.bytes);
cm("jpeg icc removed on request", !bt.includes("ICC_PROFILE"));
cm("jpeg no exif block without orientation", !bt.includes("Exif"));
let rejected = false;
try { stripMetadata(Uint8Array.of(1, 2, 3), "jpeg", { keepColorProfile: true, keepOrientation: true }); } catch { rejected = true; }
cm("jpeg rejects non-jpeg", rejected);

/* png */
const u32 = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const chunk = (type, data) => [...u32(data.length), ...asciiBytes(type), ...data, 0, 0, 0, 0];
const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ...chunk("IHDR", new Array(13).fill(0)), ...chunk("tEXt", asciiBytes("Author\0Jane")),
  ...chunk("iCCP", [1, 2, 3]), ...chunk("eXIf", [1, 2]), ...chunk("IDAT", [9, 9, 9]), ...chunk("IEND", [])]);
const pt = asText(stripMetadata(png, "png", { keepColorProfile: true, keepOrientation: true }).bytes);
cm("png text removed", !pt.includes("Jane") && !pt.includes("tEXt"));
cm("png exif removed", !pt.includes("eXIf"));
cm("png keeps image chunks", pt.includes("IHDR") && pt.includes("iCCP") && pt.includes("IDAT") && pt.endsWith("IEND\0\0\0\0"));

/* webp */
const u32le = (n) => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
const wchunk = (fourcc, data) => [...asciiBytes(fourcc), ...u32le(data.length), ...data, ...(data.length % 2 ? [0] : [])];
const wbody = [...asciiBytes("WEBP"), ...wchunk("VP8X", [0x2c, 0, 0, 0, 0, 0, 0, 0, 0, 0]), ...wchunk("ICCP", [1, 2, 3]),
  ...wchunk("VP8 ", [5, 5, 5, 5]), ...wchunk("EXIF", asciiBytes("GPSDATA")), ...wchunk("XMP ", asciiBytes("<x/>"))];
const webp = Uint8Array.from([...asciiBytes("RIFF"), ...u32le(wbody.length), ...wbody]);
const wout = stripMetadata(webp, "webp", { keepColorProfile: true, keepOrientation: true }).bytes;
const wt = asText(wout);
cm("webp exif and xmp removed", !wt.includes("GPSDATA") && !wt.includes("XMP "));
cm("webp riff size rewritten", new DataView(wout.buffer).getUint32(4, true) === wout.length - 8);
cm("webp vp8x flags cleared", wout[20] === 0x20, String(wout[20]));
cm("webp image chunk kept", wt.includes("VP8 "));

/* sniffing */
const ftypBox = (major, compat) => Uint8Array.from([...u32(16 + 4 * compat.length), ...asciiBytes("ftyp"),
  ...asciiBytes(major), 0, 0, 0, 0, ...compat.flatMap(asciiBytes)]);
cm("sniff avif named only in compatible brands", (await sniffFileKind(new File([ftypBox("mif1", ["mif1", "avif", "miaf"])], "a"))) === "avif");
cm("sniff heic", (await sniffFileKind(new File([ftypBox("heic", ["mif1", "heic"])], "a"))) === "heic");
cm("sniff m4a", (await sniffFileKind(new File([ftypBox("M4A ", ["M4A ", "isom"])], "a"))) === "audio");
cm("sniff ogg", (await sniffFileKind(new File([Uint8Array.from([...asciiBytes("OggS"), 0, 2])], "a"))) === "audio");
cm("sniff svg behind prolog", (await sniffFileKind(new File(['<?xml version="1.0"?>\n<!-- c -->\n<svg xmlns="http://www.w3.org/2000/svg"></svg>'], "a"))) === "svg");
cm("sniff html is not svg", (await sniffFileKind(new File(["<html><body>hi</body></html>"], "a"))) === "unknown");
cm("sniff jpeg unchanged", (await sniffFileKind(new File([Uint8Array.of(0xff, 0xd8, 0xff, 0xe0)], "a"))) === "jpeg");

console.log(f5 === 0 ? "IMAGE LIB TESTS OK" : `${f5} FAILURES`);
if (fails + f2 + f3 + f4 + f5 > 0) process.exitCode = 1;

/* ---- pdf page geometry, table joining (appended) ---- */
import { placeLabel, fitToPaper, identifyPaper, normaliseRotation, formatLabel, PAPER_SIZES } from "../src/lib/pdf-geometry.ts";
import { joinTables, normaliseNumericCell } from "../src/lib/pdf.ts";
let f6 = 0;
const cg = (n, c, d = "") => { if (!c) { console.log(`FAIL ${n} ${d}`); f6++; } };

const a4 = { x: 0, y: 0, width: 595.28, height: 841.89 };
const p0 = placeLabel({ box: a4, rotation: 0, position: "bottom-center", textWidth: 40, fontSize: 10, margin: 20 });
cg("label unrotated bottom centre", near(p0.x, (595.28 - 40) / 2) && near(p0.y, 20) && p0.rotate === 0, JSON.stringify(p0));
// Rotated 90° the reader sees a landscape page whose bottom edge is the page's right-hand side.
const p90 = placeLabel({ box: a4, rotation: 90, position: "bottom-center", textWidth: 40, fontSize: 10, margin: 20 });
cg("label rotated 90", near(p90.x, 595.28 - 20) && near(p90.y, (841.89 - 40) / 2) && p90.rotate === 90, JSON.stringify(p90));
const p270 = placeLabel({ box: a4, rotation: 270, position: "top-left", textWidth: 40, fontSize: 10, margin: 20 });
cg("label rotated 270", near(p270.x, 568.08) && near(p270.y, 821.89) && p270.rotate === 270, JSON.stringify(p270));
const p180 = placeLabel({ box: { x: 10, y: 20, width: 600, height: 800 }, rotation: -180, position: "bottom-right", textWidth: 50, fontSize: 10, margin: 30 });
cg("label rotated 180 with offset box", near(p180.x, 90) && near(p180.y, 790) && p180.rotate === 180, JSON.stringify(p180));
cg("normalise rotation", normaliseRotation(-90) === 270 && normaliseRotation(450) === 90);
cg("format page of", formatLabel("pageOf", 3, 12) === "Page 3 of 12");
cg("identify letter landscape", identifyPaper(792, 612) === "letter");
cg("identify unknown size", identifyPaper(500, 500) === null);

const toLetter = fitToPaper(a4, PAPER_SIZES.letter, "fit");
cg("A4 to Letter", near(toLetter.scale, 792 / 841.89, 1e-9) && toLetter.width === 612 && toLetter.height === 792, JSON.stringify(toLetter));
const toA4 = fitToPaper({ x: 0, y: 0, width: 612, height: 792 }, PAPER_SIZES.a4, "fit");
cg("Letter to A4 is 97.3%", Number((toA4.scale * 100).toFixed(1)) === 97.3, String(toA4.scale));
cg("Letter to A4 centred", near(toA4.translateY, (841.89 - 792 * toA4.scale) / 2) && near(toA4.translateX, 0), JSON.stringify(toA4));
const wide = fitToPaper({ x: 0, y: 0, width: 842, height: 595 }, PAPER_SIZES.letter, "fit");
cg("landscape stays landscape", wide.width === 792 && wide.height === 612);
const shifted = fitToPaper({ x: 50, y: 50, width: 612, height: 792 }, PAPER_SIZES.letter, "center");
cg("crop box offset removed", near(shifted.translateX, -50) && near(shifted.translateY, -50) && shifted.scale === 1);

const joinedT = joinTables([[["Item", "Qty"], ["A", "1"]], [["Item", "Qty"], ["B", "2", "x"]]], { dropRepeatedHeaders: true });
cg("join drops repeated header", joinedT.droppedHeaders === 1 && joinedT.rows.length === 3, JSON.stringify(joinedT));
cg("join pads to widest", joinedT.rows.every((row) => row.length === 3));
cg("join keeps headers when asked", joinTables([[["H"], ["a"]], [["H"], ["b"]]], { dropRepeatedHeaders: false }).rows.length === 4);
cg("numeric thousands", normaliseNumericCell("1,234.50") === "1234.50");
cg("numeric currency", normaliseNumericCell("$980") === "980");
cg("numeric brackets negative", normaliseNumericCell("(45.00)") === "-45.00");
cg("numeric leading zero kept", normaliseNumericCell("00123") === "00123");
cg("numeric european untouched", normaliseNumericCell("1.234,50") === "1.234,50");
cg("numeric text untouched", normaliseNumericCell("Widget") === "Widget");
cg("numeric unbalanced bracket untouched", normaliseNumericCell("(45") === "(45");
cg("numeric bad grouping untouched", normaliseNumericCell("12,34") === "12,34");

console.log(f6 === 0 ? "PDF GEOMETRY TESTS OK" : `${f6} FAILURES`);
if (f6 > 0) process.exitCode = 1;
