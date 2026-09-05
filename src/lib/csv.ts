/**
 * CSV serialisation following RFC 4180.
 *
 * The two things that break real-world CSV exports are handled explicitly:
 * values containing the delimiter or a line break must be quoted, and values
 * that start with a formula character are re-typed as text so spreadsheet
 * software does not execute them.
 */

export interface CsvOptions {
  delimiter: string;
  /** Prefix values starting with = + - @ so Excel treats them as text. */
  escapeFormulas: boolean;
  /** Windows line endings, which some older spreadsheet software expects. */
  crlf: boolean;
  includeHeader: boolean;
}

export const DEFAULT_CSV_OPTIONS: CsvOptions = {
  delimiter: ",",
  escapeFormulas: true,
  crlf: false,
  includeHeader: true,
};

const FORMULA_START = /^[=+\-@\t\r]/;

export function escapeCsvValue(value: string, options: CsvOptions): string {
  let output = value;

  if (options.escapeFormulas && FORMULA_START.test(output)) {
    output = `'${output}`;
  }

  const needsQuotes =
    output.includes(options.delimiter) ||
    output.includes('"') ||
    output.includes("\n") ||
    output.includes("\r") ||
    output !== output.trim();

  return needsQuotes ? `"${output.replace(/"/g, '""')}"` : output;
}

export function rowsToCsv(
  headers: string[],
  rows: string[][],
  options: CsvOptions = DEFAULT_CSV_OPTIONS,
): string {
  const newline = options.crlf ? "\r\n" : "\n";
  const lines: string[] = [];

  if (options.includeHeader) {
    lines.push(headers.map((header) => escapeCsvValue(header, options)).join(options.delimiter));
  }
  for (const row of rows) {
    lines.push(row.map((cell) => escapeCsvValue(cell, options)).join(options.delimiter));
  }

  return lines.join(newline);
}

export type ArrayHandling = "index" | "join" | "jsonString";

export interface FlattenOptions {
  arrays: ArrayHandling;
  /** Separator used when arrays are joined into a single cell. */
  arrayJoiner: string;
  maxDepth: number;
}

/**
 * Turns a nested object into dotted paths: { user: { name } } -> "user.name".
 */
export function flattenRecord(
  input: unknown,
  options: FlattenOptions,
  prefix = "",
  depth = 0,
  output: Record<string, string> = {},
): Record<string, string> {
  if (input === null || input === undefined) {
    if (prefix) output[prefix] = "";
    return output;
  }

  if (Array.isArray(input)) {
    if (options.arrays === "jsonString" || depth >= options.maxDepth) {
      output[prefix] = JSON.stringify(input);
      return output;
    }
    if (options.arrays === "join") {
      output[prefix] = input
        .map((item) =>
          item !== null && typeof item === "object" ? JSON.stringify(item) : String(item ?? ""),
        )
        .join(options.arrayJoiner);
      return output;
    }
    input.forEach((item, index) => {
      flattenRecord(item, options, prefix ? `${prefix}.${index}` : String(index), depth + 1, output);
    });
    return output;
  }

  if (typeof input === "object") {
    if (depth >= options.maxDepth) {
      output[prefix] = JSON.stringify(input);
      return output;
    }
    const entries = Object.entries(input as Record<string, unknown>);
    if (entries.length === 0 && prefix) {
      output[prefix] = "";
      return output;
    }
    for (const [key, value] of entries) {
      flattenRecord(value, options, prefix ? `${prefix}.${key}` : key, depth + 1, output);
    }
    return output;
  }

  output[prefix || "value"] = String(input);
  return output;
}

export interface JsonToCsvResult {
  headers: string[];
  rows: string[][];
  recordCount: number;
  /** Fields that only appear in some records — worth surfacing to the user. */
  sparseColumns: string[];
}

/**
 * Finds the array of records inside the parsed JSON and flattens it.
 * Accepts a bare array, or an object whose first array-valued property holds
 * the records — which covers the common `{ "data": [...] }` API shape.
 */
export function jsonToRows(value: unknown, options: FlattenOptions): JsonToCsvResult {
  let records: unknown[];

  if (Array.isArray(value)) {
    records = value;
  } else if (value !== null && typeof value === "object") {
    const arrayProperty = Object.values(value as Record<string, unknown>).find((item) =>
      Array.isArray(item),
    );
    records = Array.isArray(arrayProperty) ? arrayProperty : [value];
  } else {
    records = [value];
  }

  const flattened = records.map((record) => flattenRecord(record, options));

  // Scan every record so uneven data does not lose columns.
  const headerOrder: string[] = [];
  const seen = new Set<string>();
  const appearances = new Map<string, number>();

  for (const record of flattened) {
    for (const key of Object.keys(record)) {
      if (!seen.has(key)) {
        seen.add(key);
        headerOrder.push(key);
      }
      appearances.set(key, (appearances.get(key) ?? 0) + 1);
    }
  }

  const rows = flattened.map((record) => headerOrder.map((header) => record[header] ?? ""));
  const sparseColumns = headerOrder.filter(
    (header) => (appearances.get(header) ?? 0) < flattened.length,
  );

  return { headers: headerOrder, rows, recordCount: flattened.length, sparseColumns };
}
