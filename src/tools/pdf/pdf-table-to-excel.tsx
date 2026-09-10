"use client";

import * as React from "react";

import { CopyButton, ErrorMessage, ProgressIndicator } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Segmented, Slider } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { DEFAULT_CSV_OPTIONS, rowsToCsv } from "@/lib/csv";
import { downloadBytes, downloadText } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { XLSX_MIME, createXlsx } from "@/lib/ooxml";
import {
  closePdf,
  detectTable,
  extractPositionedText,
  groupIntoLines,
  joinTables,
  normaliseNumericCell,
  openPdf,
  parsePageRanges,
  trimTable,
} from "@/lib/pdf";
import { formatNumber, yieldToBrowser } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

type Lines = ReturnType<typeof groupIntoLines>;
type Layout = "joined" | "pages";

const PREVIEW_ROWS = 150;

export default function PdfTableToExcel() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<Lines[]>([]);
  const [range, setRange] = React.useState("");
  const [tolerance, setTolerance] = React.useState(8);
  const [layout, setLayout] = React.useState<Layout>("joined");
  const [dropHeaders, setDropHeaders] = React.useState(true);
  const [numbers, setNumbers] = React.useState(true);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const extract = async (source: File) => {
    setError(null);
    setPages([]);
    setProgress({ done: 0, total: 0 });
    let doc: Awaited<ReturnType<typeof openPdf>> | null = null;

    try {
      doc = await openPdf(source, source.name);
      const collected: Lines[] = [];
      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        try {
          collected.push(groupIntoLines(await extractPositionedText(page)));
        } finally {
          page.cleanup();
        }
        setProgress({ done: pageNumber, total: doc.numPages });
        if (pageNumber % 5 === 0) await yieldToBrowser();
      }
      setPages(collected);
      setFile(source);
      if (collected.every((lines) => lines.length === 0)) {
        setError("No text was found. This looks like a scanned PDF, which has no text layer to read a table from.");
      }
    } catch (caught) {
      setError(pdfErrorMessage(caught, source.name));
    } finally {
      await closePdf(doc);
      setProgress(null);
    }
  };

  const selection = React.useMemo(() => {
    if (pages.length === 0) return { pages: [] as number[], error: null as string | null };
    if (!range.trim()) return { pages: pages.map((_, index) => index + 1), error: null };
    return parsePageRanges(range, pages.length);
  }, [pages, range]);

  const tables = React.useMemo(
    () =>
      [...selection.pages]
        .sort((a, b) => a - b)
        .map((pageNumber) => ({
          pageNumber,
          rows: trimTable(detectTable(pages[pageNumber - 1], { columnTolerance: tolerance })),
        }))
        .filter((table) => table.rows.length > 0),
    [pages, selection.pages, tolerance],
  );

  const clean = React.useCallback(
    (rows: string[][]) => (numbers ? rows.map((row) => row.map(normaliseNumericCell)) : rows),
    [numbers],
  );

  const joined = React.useMemo(() => {
    const result = joinTables(
      tables.map((table) => table.rows),
      { dropRepeatedHeaders: dropHeaders },
    );
    return { rows: clean(result.rows), droppedHeaders: result.droppedHeaders };
  }, [clean, dropHeaders, tables]);

  const baseName = file ? stripExtension(file.name) : "tables";
  const csv = joined.rows.length > 0 ? rowsToCsv(joined.rows[0], joined.rows.slice(1), { ...DEFAULT_CSV_OPTIONS, includeHeader: true }) : "";
  const columns = joined.rows.reduce((max, row) => Math.max(max, row.length), 0);
  const multiColumnPages = tables.filter((table) => table.rows.some((row) => row.length > 1)).length;

  const downloadWorkbook = () => {
    try {
      const sheets =
        layout === "joined"
          ? [{ name: "Table", rows: joined.rows }]
          : tables.map((table) => ({ name: `Page ${table.pageNumber}`, rows: clean(table.rows) }));
      downloadBytes(createXlsx(sheets), `${baseName}-table.xlsx`, XLSX_MIME);
    } catch {
      setError("The spreadsheet could not be created.");
    }
  };

  const reset = () => {
    setFile(null);
    setPages([]);
    setRange("");
    setError(null);
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file && !progress ? (
          <PdfDropzone
            onFiles={(files) => {
              if (files[0]) void extract(files[0]);
            }}
            onError={setError}
          />
        ) : null}

        {progress ? (
          <ProgressIndicator
            value={progress.total > 0 ? (progress.done / progress.total) * 100 : undefined}
            label={progress.total > 0 ? `Reading page ${progress.done} of ${progress.total}…` : "Opening the document…"}
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {file && pages.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Pages the table is on"
                htmlFor="table-range"
                hint={`Leave blank to scan all ${pages.length} pages.`}
                error={selection.error}
              >
                <Input
                  id="table-range"
                  value={range}
                  placeholder={`1-${pages.length}`}
                  onChange={(event) => setRange(event.target.value)}
                />
              </Field>
              <Slider
                label="Column sensitivity"
                valueLabel={`${tolerance} pt`}
                min={2}
                max={24}
                value={tolerance}
                onChange={(event) => setTolerance(Number(event.target.value))}
              />
            </div>

            <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Workbook layout</span>
                <Segmented
                  name="table-layout"
                  ariaLabel="Workbook layout"
                  value={layout}
                  onChange={setLayout}
                  options={[
                    { value: "joined", label: "One sheet" },
                    { value: "pages", label: "Sheet per page" },
                  ]}
                  className="sm:w-72"
                />
              </div>
              <div className="space-y-2.5">
                <Checkbox
                  label="Remove repeated header rows"
                  checked={dropHeaders}
                  onChange={(event) => setDropHeaders(event.target.checked)}
                />
                <Checkbox
                  label="Store figures as numbers"
                  description="1,234.50 · $980 · (45.00) become numbers Excel can add up."
                  checked={numbers}
                  onChange={(event) => setNumbers(event.target.checked)}
                />
              </div>
            </div>

            <StatGrid className="sm:grid-cols-4">
              <Stat label="Pages with a table" value={formatNumber(multiColumnPages)} />
              <Stat label="Rows" value={formatNumber(joined.rows.length)} emphasis />
              <Stat label="Columns" value={formatNumber(columns)} />
              <Stat label="Repeated headers removed" value={formatNumber(joined.droppedHeaders)} />
            </StatGrid>

            {joined.rows.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[0.8125rem] font-medium text-fg">
                    Preview{joined.rows.length > PREVIEW_ROWS ? ` — first ${PREVIEW_ROWS} of ${joined.rows.length} rows` : ""}
                  </h2>
                  <CopyButton value={csv} label="Copy as CSV" />
                </div>
                <div
                  className="scrollbar-slim overflow-auto rounded-lg border border-border"
                  style={{ maxHeight: "26rem" }}
                  tabIndex={0}
                  role="region"
                  aria-label="Extracted table preview"
                >
                  <table className="w-full border-collapse text-[0.8125rem]">
                    <caption className="sr-only">Extracted table</caption>
                    <tbody>
                      {joined.rows.slice(0, PREVIEW_ROWS).map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={
                            rowIndex === 0
                              ? "sticky top-0 border-b border-border bg-surface-sunken font-semibold"
                              : "border-b border-border last:border-b-0"
                          }
                        >
                          {Array.from({ length: columns }, (_, columnIndex) => (
                            <td
                              key={columnIndex}
                              className="max-w-64 truncate border-r border-border px-2.5 py-1.5 text-fg-muted last:border-r-0"
                              title={row[columnIndex] ?? ""}
                            >
                              {row[columnIndex] || <span className="text-fg-subtle">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={downloadWorkbook} disabled={joined.rows.length === 0}>
                Download Excel (.xlsx)
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={csv === ""}
                onClick={() => downloadText(csv, `${baseName}-table.csv`, "text/csv;charset=utf-8")}
              >
                Download CSV
              </Button>
              <Button type="button" variant="ghost" onClick={reset}>
                Choose another PDF
              </Button>
            </div>

            {multiColumnPages === 0 ? (
              <Alert tone="warning" title="No column structure was found on these pages">
                The text does not line up into columns, so each line has been kept whole. Check the page range, or
                try a lower column sensitivity.
              </Alert>
            ) : (
              <Alert tone="info" title="Check the preview before you download">
                Columns are inferred from where text sits on the page. Cells that wrap onto two lines usually show
                up as an extra row with most columns empty.
              </Alert>
            )}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
