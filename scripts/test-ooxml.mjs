/**
 * Verifies the generated .docx and .xlsx are structurally valid: the ZIP
 * unpacks, every required part is present, and the XML parses.
 */
import { createDocx, createXlsx, columnLetter } from "../src/lib/ooxml.ts";
import { unzipSync, strFromU8 } from "fflate";
import fs from "node:fs";

let failures = 0;
const check = (name, condition, detail = "") => {
  if (!condition) {
    console.log(`FAIL ${name} ${detail}`);
    failures += 1;
  }
};

/** A deliberately strict well-formedness check: tags must nest and balance. */
function isWellFormedXml(xml) {
  const stack = [];
  const tagPattern = /<[?!]?\/?([A-Za-z_][\w.:-]*)([^>]*?)(\/?)>/g;
  let match;

  while ((match = tagPattern.exec(xml)) !== null) {
    const whole = match[0];
    if (whole.startsWith("<?") || whole.startsWith("<!")) continue;

    const name = match[1];
    const selfClosing = match[3] === "/";

    if (whole.startsWith("</")) {
      if (stack.pop() !== name) return `mismatched closing tag ${name}`;
    } else if (!selfClosing) {
      stack.push(name);
    }
  }

  return stack.length === 0 ? null : `unclosed tags: ${stack.join(", ")}`;
}

/* ---------------- docx ---------------- */

const docx = createDocx([
  { text: "Report title", style: "Title" },
  { text: "Section with <angle> & \"quotes\" and 'apostrophes'", style: "Heading1" },
  { text: "A normal paragraph.\nWith a hard line break." },
  { text: "", style: "Normal" },
  { text: "Page two starts here", pageBreakBefore: true },
  { text: "Unicode: café 日本語 emoji 👍" },
]);

const docxFiles = unzipSync(docx);
const requiredDocx = [
  "[Content_Types].xml",
  "_rels/.rels",
  "word/document.xml",
  "word/styles.xml",
  "word/_rels/document.xml.rels",
];

for (const part of requiredDocx) {
  check(`docx has ${part}`, part in docxFiles);
}

for (const [name, data] of Object.entries(docxFiles)) {
  const problem = isWellFormedXml(strFromU8(data));
  check(`docx ${name} well-formed`, problem === null, problem ?? "");
}

const documentXml = strFromU8(docxFiles["word/document.xml"]);
check("docx escapes ampersand", documentXml.includes("&amp;"), "");
check("docx escapes angle brackets", documentXml.includes("&lt;angle&gt;"), "");
check("docx has no raw unescaped quote in text", !/<w:t[^>]*>[^<]*"[^<]*<\/w:t>/.test(documentXml));
check("docx line break emitted", documentXml.includes("<w:br/>"));
check("docx page break emitted", documentXml.includes("<w:pageBreakBefore/>"));
check("docx keeps unicode", documentXml.includes("日本語"));
check("docx paragraph count", (documentXml.match(/<w:p>/g) || []).length === 6);

/* ---------------- xlsx ---------------- */

const xlsx = createXlsx([
  { name: "Page 1", rows: [["Name", "Amount", "Code"], ["Ada, L", "1234.5", "007"], ["", "-3", "x<y&z"]] },
  { name: "Invalid:/\\?*[]Name that is far too long to be legal", rows: [["only"]] },
  { name: "Page 1", rows: [["duplicate name"]] },
]);

const xlsxFiles = unzipSync(xlsx);
const requiredXlsx = [
  "[Content_Types].xml",
  "_rels/.rels",
  "xl/workbook.xml",
  "xl/_rels/workbook.xml.rels",
  "xl/worksheets/sheet1.xml",
  "xl/worksheets/sheet2.xml",
  "xl/worksheets/sheet3.xml",
];

for (const part of requiredXlsx) {
  check(`xlsx has ${part}`, part in xlsxFiles);
}

for (const [name, data] of Object.entries(xlsxFiles)) {
  const problem = isWellFormedXml(strFromU8(data));
  check(`xlsx ${name} well-formed`, problem === null, problem ?? "");
}

const sheet1 = strFromU8(xlsxFiles["xl/worksheets/sheet1.xml"]);
check("xlsx numeric cell", sheet1.includes("<v>1234.5</v>"), "");
check("xlsx negative numeric", sheet1.includes("<v>-3</v>"), "");
check("xlsx leading zero kept as text", sheet1.includes(">007<"), "");
check("xlsx escapes in cells", sheet1.includes("x&lt;y&amp;z"), "");
check("xlsx skips empty cell", !sheet1.includes('r="A3"'), "");
check("xlsx cell references", sheet1.includes('r="B2"'), "");

const workbookXml = strFromU8(xlsxFiles["xl/workbook.xml"]);
check("xlsx sheet name truncated to 31", !/name="[^"]{32,}"/.test(workbookXml), workbookXml);
check("xlsx illegal chars removed", !/name="[^"]*[:\\/?*[\]]/.test(workbookXml), workbookXml);
check("xlsx duplicate name resolved", (workbookXml.match(/name="Page 1"/g) || []).length === 1, workbookXml);

check("columnLetter A", columnLetter(0) === "A");
check("columnLetter Z", columnLetter(25) === "Z");
check("columnLetter AA", columnLetter(26) === "AA");
check("columnLetter AB", columnLetter(27) === "AB");

// Write real files so they can be opened by an office suite if desired.
fs.mkdirSync("scripts/.out", { recursive: true });
fs.writeFileSync("scripts/.out/test.docx", docx);
fs.writeFileSync("scripts/.out/test.xlsx", xlsx);

console.log(
  failures === 0
    ? `OOXML TESTS OK (docx ${docx.byteLength} bytes, xlsx ${xlsx.byteLength} bytes, samples in scripts/.out/)`
    : `${failures} OOXML FAILURES`,
);
