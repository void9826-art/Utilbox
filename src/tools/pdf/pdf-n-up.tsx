"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Segmented, Select, Slider } from "@/components/ui/field";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { PAPER_SIZES, type PaperId } from "@/lib/pdf-geometry";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

/** Columns and rows for each supported sheet layout. */
const LAYOUTS: Record<string, { columns: number; rows: number; label: string }> = {
  "2": { columns: 2, rows: 1, label: "2 per sheet" },
  "4": { columns: 2, rows: 2, label: "4 per sheet" },
  "6": { columns: 3, rows: 2, label: "6 per sheet" },
  "9": { columns: 3, rows: 3, label: "9 per sheet" },
  "16": { columns: 4, rows: 4, label: "16 per sheet" },
};

const MM_PER_POINT = 25.4 / 72;

export default function PdfNUp() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [perSheet, setPerSheet] = React.useState("4");
  const [paper, setPaper] = React.useState<PaperId>("a4");
  const [orientation, setOrientation] = React.useState<"auto" | "portrait" | "landscape">("auto");
  const [margin, setMargin] = React.useState(10);
  const [gap, setGap] = React.useState(4);
  const [border, setBorder] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; sheets: number } | null>(null);

  const layout = LAYOUTS[perSheet] ?? LAYOUTS["4"];

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const loaded = await readPdfInfo(chosen, { maxThumbnails: 1 });
      setFile(chosen);
      setInfo(loaded);
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      setLoading(false);
    }
  };

  const build = async () => {
    if (!file || !info) return;
    setError(null);
    setWorking(true);

    try {
      const { PDFDocument, rgb } = await import("pdf-lib");
      const source = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const output = await PDFDocument.create();

      const pageCount = source.getPageCount();
      const embedded = await output.embedPages(source.getPages());

      const size = PAPER_SIZES[paper];
      // Landscape suits wide grids; the automatic choice follows the grid shape.
      const wide = orientation === "landscape" || (orientation === "auto" && layout.columns > layout.rows);
      const sheetWidth = wide ? size.height : size.width;
      const sheetHeight = wide ? size.width : size.height;

      const marginPt = margin / MM_PER_POINT;
      const gapPt = gap / MM_PER_POINT;
      const cellWidth = (sheetWidth - marginPt * 2 - gapPt * (layout.columns - 1)) / layout.columns;
      const cellHeight = (sheetHeight - marginPt * 2 - gapPt * (layout.rows - 1)) / layout.rows;

      if (cellWidth <= 0 || cellHeight <= 0) {
        setError("Those margins leave no room for the pages. Reduce the margin or the gap.");
        setWorking(false);
        return;
      }

      const perSheetCount = layout.columns * layout.rows;
      const sheets = Math.ceil(pageCount / perSheetCount);

      for (let sheet = 0; sheet < sheets; sheet += 1) {
        const page = output.addPage([sheetWidth, sheetHeight]);
        for (let cell = 0; cell < perSheetCount; cell += 1) {
          const index = sheet * perSheetCount + cell;
          if (index >= pageCount) break;

          const column = cell % layout.columns;
          const row = Math.floor(cell / layout.columns);
          const cellX = marginPt + column * (cellWidth + gapPt);
          // PDF coordinates start at the bottom, but reading order starts at the
          // top, so rows are filled from the top of the sheet downwards.
          const cellY = sheetHeight - marginPt - (row + 1) * cellHeight - row * gapPt;

          const original = embedded[index];
          const scale = Math.min(cellWidth / original.width, cellHeight / original.height);
          const drawWidth = original.width * scale;
          const drawHeight = original.height * scale;

          page.drawPage(original, {
            x: cellX + (cellWidth - drawWidth) / 2,
            y: cellY + (cellHeight - drawHeight) / 2,
            xScale: scale,
            yScale: scale,
          });

          if (border) {
            page.drawRectangle({
              x: cellX,
              y: cellY,
              width: cellWidth,
              height: cellHeight,
              borderColor: rgb(0.8, 0.8, 0.8),
              borderWidth: 0.5,
            });
          }
        }
      }

      stampProducer(output);
      setResult({ bytes: await output.save(), sheets });
    } catch (caught) {
      setError(pdfErrorMessage(caught, file.name));
    } finally {
      setWorking(false);
    }
  };

  const reset = () => {
    setFile(null);
    setInfo(null);
    setResult(null);
  };

  const sheetEstimate = info ? Math.ceil(info.pageCount / (layout.columns * layout.rows)) : 0;

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        {loading ? <ProgressIndicator label="Reading the PDF…" /> : null}

        {file && info ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">
                {info.pageCount} page{info.pageCount === 1 ? "" : "s"} → {sheetEstimate} sheet
                {sheetEstimate === 1 ? "" : "s"}
              </span>
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Pages per sheet" htmlFor="nup-per-sheet">
                <Select
                  id="nup-per-sheet"
                  value={perSheet}
                  onChange={(event) => {
                    setPerSheet(event.target.value);
                    setResult(null);
                  }}
                >
                  {Object.entries(LAYOUTS).map(([value, entry]) => (
                    <option key={value} value={value}>
                      {entry.label} ({entry.columns} × {entry.rows})
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Sheet size" htmlFor="nup-paper">
                <Select
                  id="nup-paper"
                  value={paper}
                  onChange={(event) => {
                    setPaper(event.target.value as PaperId);
                    setResult(null);
                  }}
                >
                  {Object.keys(PAPER_SIZES).map((id) => (
                    <option key={id} value={id}>
                      {id.toUpperCase()}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Orientation</span>
              <Segmented
                name="nup-orientation"
                ariaLabel="Sheet orientation"
                value={orientation}
                onChange={(value) => {
                  setOrientation(value);
                  setResult(null);
                }}
                options={[
                  { value: "auto", label: "Automatic" },
                  { value: "portrait", label: "Portrait" },
                  { value: "landscape", label: "Landscape" },
                ]}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Slider
                label="Margin"
                valueLabel={`${margin} mm`}
                min={0}
                max={25}
                step={1}
                value={margin}
                onChange={(event) => {
                  setMargin(Number(event.target.value));
                  setResult(null);
                }}
              />
              <Slider
                label="Gap between pages"
                valueLabel={`${gap} mm`}
                min={0}
                max={20}
                step={1}
                value={gap}
                onChange={(event) => {
                  setGap(Number(event.target.value));
                  setResult(null);
                }}
              />
            </div>

            <Checkbox
              label="Draw a light outline around each page"
              description="Helps when the pages are being cut apart afterwards."
              checked={border}
              onChange={(event) => {
                setBorder(event.target.checked);
                setResult(null);
              }}
            />

            {result ? (
              <ResultPanel
                title="Your combined PDF is ready"
                description={`${formatBytes(result.bytes.byteLength)} · ${info.pageCount} pages on ${result.sheets} sheet${result.sheets === 1 ? "" : "s"} · text stays sharp because pages are placed, not photographed`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-${perSheet}-up.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Combine another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void build()} loading={working}>
                  Combine pages
                </Button>
                <Button type="button" variant="ghost" onClick={reset}>
                  Choose another PDF
                </Button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
