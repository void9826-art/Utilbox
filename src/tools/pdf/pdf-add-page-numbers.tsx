"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Slider } from "@/components/ui/field";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { closePdf, openPdf, parsePageRanges, renderPage } from "@/lib/pdf";
import { formatLabel, LABEL_FORMATS, placeLabel, type LabelPosition } from "@/lib/pdf-geometry";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { NumberField, SelectField } from "../calculators/_shared";
import { PdfDropzone, pdfErrorMessage } from "./_shared";

const POSITIONS: Array<{ value: LabelPosition; label: string }> = [
  { value: "bottom-center", label: "Bottom centre" },
  { value: "bottom-right", label: "Bottom right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "top-center", label: "Top centre" },
  { value: "top-right", label: "Top right" },
  { value: "top-left", label: "Top left" },
];

function hexToRgb(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

async function renderPreview(bytes: Uint8Array, pageNumber: number): Promise<string> {
  const doc = await openPdf(new Blob([new Uint8Array(bytes)]));
  try {
    const page = await doc.getPage(pageNumber);
    try {
      return (await renderPage(page, 0.7)).canvas.toDataURL("image/jpeg", 0.85);
    } finally {
      page.cleanup();
    }
  } finally {
    await closePdf(doc);
  }
}

export default function PdfAddPageNumbers() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [position, setPosition] = React.useState<LabelPosition>("bottom-center");
  const [format, setFormat] = React.useState("pageOf");
  const [startAt, setStartAt] = React.useState("1");
  const [fontSize, setFontSize] = React.useState(11);
  const [margin, setMargin] = React.useState(28);
  const [colour, setColour] = React.useState("#212121");
  const [skipFirst, setSkipFirst] = React.useState(false);
  const [range, setRange] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    bytes: Uint8Array;
    numbered: number;
    firstPage: number;
    preview: string;
  } | null>(null);

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setResult(null);
    setLoading(true);
    let doc: Awaited<ReturnType<typeof openPdf>> | null = null;
    try {
      doc = await openPdf(chosen, chosen.name);
      setPageCount(doc.numPages);
      setFile(chosen);
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      await closePdf(doc);
      setLoading(false);
    }
  };

  const start = Number(startAt);
  const startError =
    startAt.trim() === "" || !Number.isInteger(start) || start < 0 ? "Enter a whole number, 0 or more." : null;

  const apply = async () => {
    if (!file || startError) return;
    setError(null);
    setResult(null);

    const chosen = range.trim()
      ? parsePageRanges(range, pageCount)
      : { pages: Array.from({ length: pageCount }, (_, index) => index + 1), error: null };
    if (chosen.error) {
      setError(chosen.error);
      return;
    }
    const targets = [...chosen.pages].sort((a, b) => a - b).filter((page) => !(skipFirst && page === 1));
    if (targets.length === 0) {
      setError("No pages are left to number with these settings.");
      return;
    }

    setWorking(true);
    try {
      const { PDFDocument, StandardFonts, degrees, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const total = start + targets.length - 1;
      const [red, green, blue] = hexToRgb(colour);

      targets.forEach((pageNumber, index) => {
        const page = pages[pageNumber - 1];
        const label = formatLabel(format, start + index, total);
        const placement = placeLabel({
          box: page.getCropBox(),
          rotation: page.getRotation().angle,
          position,
          textWidth: font.widthOfTextAtSize(label, fontSize),
          fontSize,
          margin,
        });
        page.drawText(label, {
          x: placement.x,
          y: placement.y,
          size: fontSize,
          font,
          color: rgb(red, green, blue),
          rotate: degrees(placement.rotate),
        });
      });

      stampProducer(doc);
      const bytes = await doc.save();
      setResult({ bytes, numbered: targets.length, firstPage: targets[0], preview: await renderPreview(bytes, targets[0]) });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      setError(
        /encrypt/i.test(message)
          ? `"${file.name}" is encrypted. Remove its password in a PDF reader first, then try again.`
          : pdfErrorMessage(caught, file.name),
      );
    } finally {
      setWorking(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setPageCount(0);
    setRange("");
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}
        {loading ? <ProgressIndicator label="Opening the document…" /> : null}
        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {file ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">
                {pageCount} page{pageCount === 1 ? "" : "s"}
              </span>
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SelectField
                label="Position"
                id="numbers-position"
                value={position}
                onChange={(value) => {
                  setPosition(value as LabelPosition);
                  setResult(null);
                }}
              >
                {POSITIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Format"
                id="numbers-format"
                value={format}
                onChange={(value) => {
                  setFormat(value);
                  setResult(null);
                }}
              >
                {Object.entries(LABEL_FORMATS).map(([id, option]) => (
                  <option key={id} value={id}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
              <NumberField
                id="numbers-start"
                label="First number"
                value={startAt}
                onChange={(value) => {
                  setStartAt(value);
                  setResult(null);
                }}
                min={0}
                step={1}
                inputMode="numeric"
                error={startError}
              />
              <Field
                label="Pages to number"
                htmlFor="numbers-range"
                hint={`Leave blank for all ${pageCount}, or enter a range such as 3-${Math.max(3, pageCount)}.`}
              >
                <Input
                  id="numbers-range"
                  value={range}
                  placeholder="All pages"
                  onChange={(event) => {
                    setRange(event.target.value);
                    setResult(null);
                  }}
                />
              </Field>
              <Field label="Colour" htmlFor="numbers-colour">
                <Input
                  id="numbers-colour"
                  type="color"
                  value={colour}
                  onChange={(event) => {
                    setColour(event.target.value);
                    setResult(null);
                  }}
                  className="h-10 cursor-pointer p-1"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Slider
                label="Text size"
                valueLabel={`${fontSize} pt`}
                min={7}
                max={24}
                value={fontSize}
                onChange={(event) => {
                  setFontSize(Number(event.target.value));
                  setResult(null);
                }}
              />
              <Slider
                label="Distance from edge"
                valueLabel={`${margin} pt (${((margin / 72) * 25.4).toFixed(0)} mm)`}
                min={10}
                max={72}
                value={margin}
                onChange={(event) => {
                  setMargin(Number(event.target.value));
                  setResult(null);
                }}
              />
            </div>

            <Checkbox
              label="Don't number the first page"
              description="For a cover or title page. Numbering starts on page 2."
              checked={skipFirst}
              onChange={(event) => {
                setSkipFirst(event.target.checked);
                setResult(null);
              }}
            />

            {result ? (
              <ResultPanel
                title="Your numbered PDF is ready"
                description={`${result.numbered} page${result.numbered === 1 ? "" : "s"} numbered · ${formatBytes(result.bytes.byteLength)}`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(result.bytes, `${stripExtension(file.name)}-numbered.pdf`, "application/pdf")
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Number another PDF"
              >
                <figure className="space-y-1.5">
                  {/* A data URL rendered from the output file; next/image cannot optimise it. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.preview}
                    alt={`Page ${result.firstPage} of the numbered PDF`}
                    className="max-h-96 w-auto rounded border border-border bg-white"
                  />
                  <figcaption className="text-xs text-fg-muted">
                    Page {result.firstPage}, rendered from the saved file.
                  </figcaption>
                </figure>
              </ResultPanel>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void apply()} loading={working} disabled={Boolean(startError)}>
                  Add page numbers
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
