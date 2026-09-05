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
