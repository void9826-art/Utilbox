"use client";

import * as React from "react";

import { CopyButton, ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { DEFAULT_CSV_OPTIONS, rowsToCsv } from "@/lib/csv";
import { downloadBytes, downloadText } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { XLSX_MIME, createXlsx, type Sheet } from "@/lib/ooxml";
import {
  closePdf,
  detectTable,
  extractPositionedText,
  groupIntoLines,
  openPdf,
  trimTable,
} from "@/lib/pdf";
import { cn, formatBytes, formatNumber, yieldToBrowser } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

interface PageTable {
  pageNumber: number;
  rows: string[][];
  columns: number;
}

export default function PdfToExcel() {
  const [file, setFile] = React.useState<File | null>(null);
  const [tables, setTables] = React.useState<PageTable[]>([]);
  const [tolerance, setTolerance] = React.useState(8);
  const [activePage, setActivePage] = React.useState(0);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; sheets: number } | null>(null);

  /** Kept so the tolerance can be re-applied without re-reading the PDF. */
  const rawPages = React.useRef<Array<Array<{ y: number; items: ReturnType<typeof groupIntoLines>[number]["items"] }>>>(
    [],
  );

  const rebuild = React.useCallback((columnTolerance: number) => {
    const built: PageTable[] = rawPages.current.map((lines, index) => {
      const rows = trimTable(detectTable(lines, { columnTolerance }));
      return {
        pageNumber: index + 1,
        rows,
        columns: rows.length > 0 ? Math.max(...rows.map((row) => row.length)) : 0,
      };
    });

    setTables(built.filter((table) => table.rows.length > 0));
    setResult(null);
  }, []);

  const extract = async (source: File) => {
    setError(null);
    setTables([]);
    setResult(null);
    setActivePage(0);
    setProgress({ done: 0, total: 0 });
    rawPages.current = [];

    let doc: Awaited<ReturnType<typeof openPdf>> | null = null;

    try {
      doc = await openPdf(source, source.name);
      const total = doc.numPages;
      setProgress({ done: 0, total });

      for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        try {
          const items = await extractPositionedText(page);
          rawPages.current.push(groupIntoLines(items));
        } finally {
          page.cleanup();
        }

        setProgress({ done: pageNumber, total });
        if (pageNumber % 5 === 0) await yieldToBrowser();
      }

      rebuild(tolerance);

      if (rawPages.current.every((lines) => lines.length === 0)) {
        setError(
          "No text was found. This PDF is a scan, so there is no text layer to read a table from. OCR can recover the words, but not the table structure.",
        );
      }
    } catch (caught) {
      setError(pdfErrorMessage(caught, source.name));
    } finally {
      await closePdf(doc);
      setProgress(null);
    }
  };

  const buildWorkbook = () => {
    if (!file || tables.length === 0) return;

    const sheets: Sheet[] = tables.map((table) => ({
      name: `Page ${table.pageNumber}`,
      rows: table.rows,
    }));

    try {
      setResult({ bytes: createXlsx(sheets), sheets: sheets.length });
    } catch {
      setError("The spreadsheet could not be created.");
    }
  };

  const active = tables[activePage];
  const totalRows = tables.reduce((sum, table) => sum + table.rows.length, 0);
  const detectedTables = tables.filter((table) => table.columns > 1).length;

  const csvForActive = active
    ? rowsToCsv(active.rows[0] ?? [], active.rows.slice(1), {
        ...DEFAULT_CSV_OPTIONS,
        includeHeader: true,
      })
    : "";

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <PdfDropzone
            onFiles={(files) => {
              const chosen = files[0];
              if (!chosen) return;
              setFile(chosen);
              void extract(chosen);
            }}
            onError={setError}
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {progress ? (
          <ProgressIndicator
            value={progress.total > 0 ? (progress.done / progress.total) * 100 : undefined}
            label={
              progress.total > 0
                ? `Analysing page ${progress.done} of ${progress.total}…`
                : "Opening the document…"
            }
          />
        ) : null}

        {file && tables.length > 0 ? (
          <>
            <StatGrid className="sm:grid-cols-4">
              <Stat label="Pages with content" value={formatNumber(tables.length)} />
              <Stat label="Tables detected" value={formatNumber(detectedTables)} emphasis />
              <Stat label="Total rows" value={formatNumber(totalRows)} />
              <Stat
                label="Columns on this page"
                value={active ? formatNumber(active.columns) : "—"}
              />
            </StatGrid>

            <Slider
              label="Column sensitivity"
              valueLabel={`${tolerance} pt`}
              min={2}
              max={24}
              value={tolerance}
              onChange={(event) => {
                const next = Number(event.target.value);
                setTolerance(next);
                rebuild(next);
              }}
              className="sm:max-w-md"
            />
            <p className="-mt-2 text-xs text-fg-subtle">
              Lower values split columns more eagerly; higher values merge columns that sit close
              together. Adjust until the preview matches the original.
            </p>

            {tables.length > 1 ? (
              <div className="flex flex-wrap gap-1.5">
                {tables.map((table, index) => (
                  <button
                    key={table.pageNumber}
                    type="button"
                    onClick={() => setActivePage(index)}
                    aria-pressed={index === activePage}
                    className={cn(
                      "tabular rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
                      index === activePage
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
                    )}
                  >
                    Page {table.pageNumber}
                    <span className="ml-1 opacity-70">({table.rows.length})</span>
                  </button>
                ))}
              </div>
            ) : null}

            {active ? (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-[0.8125rem] font-medium text-fg">
                    Page {active.pageNumber} — {active.rows.length} rows × {active.columns} columns
                  </h2>
                  <div className="flex gap-1.5">
                    <CopyButton value={csvForActive} label="Copy as CSV" />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        downloadText(
                          csvForActive,
                          `${stripExtension(file.name)}-page-${active.pageNumber}.csv`,
                          "text/csv;charset=utf-8",
                        )
                      }
                    >
                      Download CSV
                    </Button>
                  </div>
                </div>

                <div
                  className="scrollbar-slim overflow-auto rounded-lg border border-border"
                  style={{ maxHeight: "24rem" }}
                  tabIndex={0}
                  role="region"
                  aria-label={`Detected table on page ${active.pageNumber}`}
                >
                  <table className="w-full border-collapse text-[0.8125rem]">
                    <caption className="sr-only">
                      Table detected on page {active.pageNumber}
                    </caption>
                    <tbody>
                      {active.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={cn(
                            "border-b border-border last:border-b-0",
                            rowIndex === 0 && "sticky top-0 bg-surface-sunken font-semibold",
                          )}
                        >
                          {Array.from({ length: active.columns }, (_, columnIndex) => (
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

            {result ? (
              <ResultPanel
                title="Your spreadsheet is ready"
                description={`${result.sheets} sheet${result.sheets === 1 ? "" : "s"}, one per page · ${formatBytes(result.bytes.byteLength)}`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(result.bytes, `${stripExtension(file.name)}.xlsx`, XLSX_MIME)
                    }
                  >
                    Download .xlsx
                  </Button>
                }
                onReset={() => {
                  setFile(null);
                  setTables([]);
                  setResult(null);
                }}
                resetLabel="Convert another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={buildWorkbook}>
                  Create Excel workbook
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setTables([]);
                  }}
                >
                  Choose another PDF
                </Button>
              </div>
            )}

            {detectedTables === 0 ? (
              <Alert tone="warning" title="No column structure was found">
                The text on these pages does not line up into columns, so each line has been placed in a
                single column rather than guessed at. This is what happens with ordinary prose — the tool
                works on tables exported from spreadsheets and reporting systems.
              </Alert>
            ) : (
              <Alert tone="info" title="Check the preview before you download">
                Columns are inferred from where text sits on the page, because a PDF stores no table
                structure. Merged cells and wrapped multi-line cells are where it most often gets this
                wrong.
              </Alert>
            )}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
