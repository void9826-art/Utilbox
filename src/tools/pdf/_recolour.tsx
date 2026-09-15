"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { closePdf, openPdf, renderPage } from "@/lib/pdf";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes, yieldToBrowser } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

export type RecolourMode = "grayscale" | "invert";

const RESOLUTIONS = [
  { value: "1.5", label: "Screen", dpi: 108 },
  { value: "2", label: "Standard", dpi: 144 },
  { value: "3", label: "Print", dpi: 216 },
];

/**
 * Re-colours a rendered page by rewriting its pixels.
 *
 * Pixels are changed one by one rather than with a canvas filter: filter
 * support still varies between browsers, and a wrong result here would stay
 * invisible until someone printed the file.
 */
function recolour(source: HTMLCanvasElement, mode: RecolourMode): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const context = canvas.getContext("2d");
  if (!context) return source;

  context.drawImage(source, 0, 0);
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = image.data;

  for (let index = 0; index < pixels.length; index += 4) {
    if (mode === "invert") {
      pixels[index] = 255 - pixels[index];
      pixels[index + 1] = 255 - pixels[index + 1];
      pixels[index + 2] = 255 - pixels[index + 2];
    } else {
      // Rec. 709 luminance: matches how the eye weighs the channels, so greys
      // keep the contrast the original colours had.
      const grey = 0.2126 * pixels[index] + 0.7152 * pixels[index + 1] + 0.0722 * pixels[index + 2];
      pixels[index] = grey;
      pixels[index + 1] = grey;
      pixels[index + 2] = grey;
    }
  }

  context.putImageData(image, 0, 0);
  return canvas;
}

export function RecolourPdf({ mode }: { mode: RecolourMode }) {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [scale, setScale] = React.useState("2");
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; pages: number } | null>(null);

  const noun = mode === "grayscale" ? "grayscale" : "inverted";

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

  const convert = async () => {
    if (!file || !info) return;
    setError(null);
    setProgress({ done: 0, total: info.pageCount });

    const doc = await openPdf(file, file.name).catch((caught: unknown) => {
      setError(pdfErrorMessage(caught, file.name));
      return null;
    });
    if (!doc) {
      setProgress(null);
      return;
    }

    try {
      const { PDFDocument } = await import("pdf-lib");
      const output = await PDFDocument.create();

      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        try {
          const rendered = await renderPage(page, Number(scale));
          const recoloured = recolour(rendered.canvas, mode);
          const blob = await new Promise<Blob | null>((resolve) =>
            recoloured.toBlob(resolve, "image/jpeg", 0.85),
          );
          if (!blob) throw new Error("The page could not be encoded.");

          const embedded = await output.embedJpg(new Uint8Array(await blob.arrayBuffer()));
          const viewport = page.getViewport({ scale: 1 });
          // The new page keeps the original size in points, so paper size and
          // margins are unchanged even though the content is now an image.
          const target = output.addPage([viewport.width, viewport.height]);
          target.drawImage(embedded, { x: 0, y: 0, width: viewport.width, height: viewport.height });
        } finally {
          page.cleanup();
        }

        setProgress({ done: pageNumber, total: doc.numPages });
        await yieldToBrowser();
      }

      stampProducer(output);
      setResult({ bytes: await output.save(), pages: doc.numPages });
    } catch (caught) {
      setError(pdfErrorMessage(caught, file.name));
    } finally {
      await closePdf(doc);
      setProgress(null);
    }
  };

  const reset = () => {
    setFile(null);
    setInfo(null);
    setResult(null);
  };

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
                {info.pageCount} page{info.pageCount === 1 ? "" : "s"}
              </span>
            </p>

            <Alert tone="warning" title="Pages become images">
              Every page is re-rendered and its pixels rewritten, so text in the saved file is no longer
              selectable or searchable. Keep the original if you need that.
            </Alert>

            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Resolution</span>
              <Segmented
                name="recolour-scale"
                ariaLabel="Render resolution"
                value={scale}
                onChange={(value) => {
                  setScale(value);
                  setResult(null);
                }}
                options={RESOLUTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                  title: `About ${option.dpi} DPI`,
                }))}
              />
              <p className="text-xs text-fg-subtle">
                Higher resolution looks better on paper and makes a larger file.
              </p>
            </div>

            {progress ? (
              <ProgressIndicator
                value={(progress.done / progress.total) * 100}
                label={`Converting page ${progress.done} of ${progress.total}…`}
              />
            ) : null}

            {result ? (
              <ResultPanel
                title={`Your ${noun} PDF is ready`}
                description={`${formatBytes(result.bytes.byteLength)} · ${result.pages} page${result.pages === 1 ? "" : "s"} · original page size kept`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-${mode === "grayscale" ? "grayscale" : "inverted"}.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Convert another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void convert()} loading={Boolean(progress)}>
                  {mode === "grayscale" ? "Convert to grayscale" : "Invert colours"}
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
