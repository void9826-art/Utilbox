/**
 * Minimal Office Open XML writers for .docx and .xlsx.
 *
 * Both formats are ZIP containers holding XML parts. Writing the small, valid
 * subset needed here avoids pulling in a large document library for what is,
 * in the end, a handful of well-specified XML files.
 */

import { zipSync, strToU8 } from "fflate";

/** XML text escaping. Control characters are invalid in XML 1.0 and are dropped. */
function escapeXml(value: string): string {
  let output = "";
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    if (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) continue;

    switch (character) {
      case "&":
        output += "&amp;";
        break;
      case "<":
        output += "&lt;";
        break;
      case ">":
        output += "&gt;";
        break;
      case '"':
        output += "&quot;";
        break;
      case "'":
        output += "&apos;";
        break;
      default:
        output += character;
    }
  }
  return output;
}

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

/* -------------------------------------------------------------------------- */
/* .docx                                                                       */
/* -------------------------------------------------------------------------- */

export interface DocxParagraph {
  text: string;
  style?: "Title" | "Heading1" | "Heading2" | "Normal";
  bold?: boolean;
  /** Inserts a page break before this paragraph. */
  pageBreakBefore?: boolean;
}

const DOCX_CONTENT_TYPES = `${XML_DECLARATION}
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

const DOCX_ROOT_RELS = `${XML_DECLARATION}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOCX_DOCUMENT_RELS = `${XML_DECLARATION}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

/** Sizes are in half-points, so w:sz 48 is a 24pt heading. */
const DOCX_STYLES = `${XML_DECLARATION}
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:spacing w:after="160" w:line="259" w:lineRule="auto"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="240"/></w:pPr><w:rPr><w:b/><w:sz w:val="48"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:outlineLvl w:val="0"/><w:spacing w:before="240" w:after="120"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:outlineLvl w:val="1"/><w:spacing w:before="200" w:after="100"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/></w:rPr></w:style>
</w:styles>`;

function docxParagraph(paragraph: DocxParagraph): string {
  const properties: string[] = [];
  if (paragraph.style && paragraph.style !== "Normal") {
    properties.push(`<w:pStyle w:val="${paragraph.style}"/>`);
  }
  if (paragraph.pageBreakBefore) properties.push("<w:pageBreakBefore/>");

  const runProperties = paragraph.bold ? "<w:rPr><w:b/></w:rPr>" : "";
  const propertyBlock = properties.length > 0 ? `<w:pPr>${properties.join("")}</w:pPr>` : "";

  if (!paragraph.text) return `<w:p>${propertyBlock}</w:p>`;

  // A single paragraph may contain hard line breaks; each becomes a <w:br/>.
  const runs = paragraph.text
    .split("\n")
    .map(
      (line, index) =>
        `${index > 0 ? "<w:br/>" : ""}<w:t xml:space="preserve">${escapeXml(line)}</w:t>`,
    )
    .join("");

  return `<w:p>${propertyBlock}<w:r>${runProperties}${runs}</w:r></w:p>`;
}

export function createDocx(paragraphs: DocxParagraph[]): Uint8Array {
  const body = paragraphs.map(docxParagraph).join("");

  const document = `${XML_DECLARATION}
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body>
</w:document>`;

  return zipSync(
    {
      "[Content_Types].xml": strToU8(DOCX_CONTENT_TYPES),
      "_rels/.rels": strToU8(DOCX_ROOT_RELS),
      "word/document.xml": strToU8(document),
      "word/styles.xml": strToU8(DOCX_STYLES),
      "word/_rels/document.xml.rels": strToU8(DOCX_DOCUMENT_RELS),
    },
    { level: 6 },
  );
}

/* -------------------------------------------------------------------------- */
/* .xlsx                                                                       */
/* -------------------------------------------------------------------------- */

export interface Sheet {
  name: string;
  rows: string[][];
}

/** 0 -> A, 25 -> Z, 26 -> AA. */
export function columnLetter(index: number): string {
  let letter = "";
  let value = index;
  while (value >= 0) {
    letter = String.fromCharCode((value % 26) + 65) + letter;
    value = Math.floor(value / 26) - 1;
  }
  return letter;
}

/** Excel sheet names cannot exceed 31 characters or contain : \ / ? * [ ]. */
function safeSheetName(name: string, fallback: string): string {
  const cleaned = name.replace(/[:\\/?*[\]]/g, " ").trim().slice(0, 31);
  return cleaned || fallback;
}

/** True for values Excel should store as numbers rather than text. */
function isNumeric(value: string): boolean {
  if (value.trim() === "") return false;
  // Leading zeros are significant in codes and reference numbers, so those
  // stay as text rather than silently losing the zero.
  if (/^0\d/.test(value.trim())) return false;
  return /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(value.trim());
}

function sheetXml(rows: string[][]): string {
  const body = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) => {
          const reference = `${columnLetter(columnIndex)}${rowIndex + 1}`;
          if (value === "") return "";

          if (isNumeric(value)) {
            return `<c r="${reference}"><v>${escapeXml(value.trim())}</v></c>`;
          }
          // Inline strings avoid needing a shared-strings part entirely.
          return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
        })
        .join("");

      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");

  return `${XML_DECLARATION}
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

export function createXlsx(sheets: Sheet[]): Uint8Array {
  const usable = sheets.length > 0 ? sheets : [{ name: "Sheet1", rows: [[""]] }];

  const names = new Set<string>();
  const resolved = usable.map((sheet, index) => {
    let name = safeSheetName(sheet.name, `Sheet${index + 1}`);
    let suffix = 2;
    while (names.has(name.toLowerCase())) {
      name = `${safeSheetName(sheet.name, `Sheet${index + 1}`).slice(0, 28)}(${suffix})`;
      suffix += 1;
    }
    names.add(name.toLowerCase());
    return { ...sheet, name };
  });

  const contentTypes = `${XML_DECLARATION}
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
${resolved
  .map(
    (_, index) =>
      `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
  )
  .join("\n")}
</Types>`;

  const rootRels = `${XML_DECLARATION}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

  const workbook = `${XML_DECLARATION}
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>${resolved
    .map(
      (sheet, index) =>
        `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`,
    )
    .join("")}</sheets>
</workbook>`;

  const workbookRels = `${XML_DECLARATION}
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${resolved
  .map(
    (_, index) =>
      `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`,
  )
  .join("\n")}
</Relationships>`;

  const files: Record<string, Uint8Array> = {
    "[Content_Types].xml": strToU8(contentTypes),
    "_rels/.rels": strToU8(rootRels),
    "xl/workbook.xml": strToU8(workbook),
    "xl/_rels/workbook.xml.rels": strToU8(workbookRels),
  };

  resolved.forEach((sheet, index) => {
    files[`xl/worksheets/sheet${index + 1}.xml`] = strToU8(sheetXml(sheet.rows));
  });

  return zipSync(files, { level: 6 });
}

export const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
export const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
