/**
 * CSV parsing and conversion to JSON.
 *
 * The parser follows RFC 4180 — quoted fields may contain the delimiter, line
 * breaks and doubled quotes — and is forgiving about what real exports do:
 * a byte-order mark, CRLF or LF line endings, a missing final newline and
 * rows of uneven length.
 */

export interface CsvParseResult {
  rows: string[][];
  /** Set when a quoted field is never closed; the rows are still returned. */
  unterminatedQuote: boolean;
}

const CANDIDATE_DELIMITERS = [",", ";", "\t", "|"];

/**
 * Picks the delimiter that splits the first few lines into the most columns,
 * consistently. Quoted text is ignored so commas inside addresses do not count.
 */
export function detectDelimiter(text: string): string {
  const sample = text.replace(/^﻿/, "").slice(0, 20_000);
  let best = ",";
  let bestScore = 0;

  for (const delimiter of CANDIDATE_DELIMITERS) {
    const { rows } = parseCsv(sample, delimiter);
    const counts = rows
      .slice(0, 10)
      .filter((row) => row.length > 1 || row[0] !== "")
      .map((row) => row.length);
    if (counts.length === 0) continue;
    const first = counts[0];
    if (first < 2) continue;
    const consistent = counts.filter((count) => count === first).length / counts.length;
    const score = first * consistent;
    if (score > bestScore) {
      bestScore = score;
      best = delimiter;
    }
  }
  return best;
}

export function parseCsv(text: string, delimiter: string): CsvParseResult {
  const input = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let fieldStarted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (inQuotes) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"' && !fieldStarted) {
      inQuotes = true;
      fieldStarted = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
      fieldStarted = false;
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      fieldStarted = false;
    } else {
      field += char;
      fieldStarted = true;
    }
  }

  // A final line without a trailing newline still counts.
  if (fieldStarted || field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return { rows, unterminatedQuote: inQuotes };
}

export interface CsvToJsonOptions {
  /** Use the first row as keys; otherwise every row becomes an array. */
  header: boolean;
  /** Turn 12, 3.5, true, false and empty cells into numbers, booleans and null. */
  inferTypes: boolean;
  /** Turn dotted headers such as user.name into nested objects. */
  nest: boolean;
  /** Leave out rows where every cell is empty. */
  skipEmptyRows: boolean;
}

export const DEFAULT_CSV_TO_JSON: CsvToJsonOptions = {
  header: true,
  inferTypes: true,
  nest: false,
  skipEmptyRows: true,
};

/**
 * Numbers are only converted when converting cannot lose information: a value
 * with a leading zero (00042, a postcode or ID) or more digits than a double can
 * hold exactly stays a string.
 */
export function inferValue(raw: string): string | number | boolean | null {
  const value = raw.trim();
  if (value === "") return null;
  if (value === "true" || value === "TRUE" || value === "True") return true;
  if (value === "false" || value === "FALSE" || value === "False") return false;
  if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(value)) {
    const digits = value.replace(/^-/, "").replace(/[.eE].*$/, "");
    if (digits.length > 15) return raw;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return raw;
}

/** Makes header names unique and non-empty, so no column overwrites another. */
export function uniqueHeaders(headers: string[]): string[] {
  const seen = new Map<string, number>();
  return headers.map((header, index) => {
    const base = header.trim() || `column${index + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}_${count + 1}`;
  });
}

function setPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".").filter(Boolean);
  if (parts.length === 0) return;
  let node: Record<string, unknown> = target;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    const existing = node[key];
    if (typeof existing !== "object" || existing === null || Array.isArray(existing)) {
      node[key] = {};
    }
    node = node[key] as Record<string, unknown>;
  }
  node[parts[parts.length - 1]] = value;
}

export interface CsvToJsonResult {
  records: unknown[];
  headers: string[];
  /** Rows with more or fewer cells than the header row. */
  raggedRows: number;
}

export function csvRowsToJson(rows: string[][], options: CsvToJsonOptions): CsvToJsonResult {
  const isEmpty = (row: string[]) => row.every((cell) => cell.trim() === "");
  const kept = options.skipEmptyRows ? rows.filter((row) => !isEmpty(row)) : rows;
  const convert = (cell: string | undefined) =>
    options.inferTypes ? inferValue(cell ?? "") : (cell ?? "");

  if (!options.header) {
    return { records: kept.map((row) => row.map(convert)), headers: [], raggedRows: 0 };
  }

  if (kept.length === 0) return { records: [], headers: [], raggedRows: 0 };

  const width = Math.max(...kept.map((row) => row.length));
  const headerRow = [...kept[0]];
  // Extra cells beyond the header still get a column rather than vanishing.
  while (headerRow.length < width) headerRow.push("");
  const headers = uniqueHeaders(headerRow);

  let raggedRows = 0;
  const records = kept.slice(1).map((row) => {
    if (row.length !== kept[0].length) raggedRows += 1;
    const record: Record<string, unknown> = {};
    headers.forEach((header, index) => {
      const value = convert(row[index]);
      if (options.nest && header.includes(".")) setPath(record, header, value);
      else record[header] = value;
    });
    return record;
  });

  return { records, headers, raggedRows };
}
