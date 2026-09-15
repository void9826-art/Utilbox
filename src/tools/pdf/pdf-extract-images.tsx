"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/surfaces";
import { downloadBytes, downloadZip } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { closePdf, loadPdfJs, openPdf } from "@/lib/pdf";
import { formatBytes, yieldToBrowser } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

interface ExtractedImage {
  name: string;
  width: number;
  height: number;
  pages: number[];
  bytes: Uint8Array;
  url: string;
}

/** The shapes pdf.js hands back for an image, across its versions. */
interface PdfImageObject {
  width?: number;
  height?: number;
  kind?: number;
  data?: Uint8Array | Uint8ClampedArray;
  bitmap?: CanvasImageSource;
}

const GRAYSCALE_1BPP = 1;
const RGB_24BPP = 2;

/** Paints a pdf.js image object onto a canvas, whichever form it arrives in. */
function toCanvas(image: PdfImageObject): HTMLCanvasElement | null {
  const width = image.width ?? 0;
  const height = image.height ?? 0;
  if (width < 1 || height < 1) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;

  if (image.bitmap) {
    context.drawImage(image.bitmap, 0, 0);
    return canvas;
  }

  if (!image.data) return null;
  const source = image.data;
  const target = context.createImageData(width, height);

  if (image.kind === RGB_24BPP) {
    for (let pixel = 0, read = 0; pixel < target.data.length; pixel += 4, read += 3) {
      target.data[pixel] = source[read];
      target.data[pixel + 1] = source[read + 1];
      target.data[pixel + 2] = source[read + 2];
      target.data[pixel + 3] = 255;
    }
  } else if (image.kind === GRAYSCALE_1BPP) {
    // One bit per pixel, packed eight to a byte and padded to whole bytes per row.
    const rowBytes = (width + 7) >> 3;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const bit = (source[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1;
        const value = bit ? 255 : 0;
        const pixel = (y * width + x) * 4;
        target.data[pixel] = value;
        target.data[pixel + 1] = value;
        target.data[pixel + 2] = value;
        target.data[pixel + 3] = 255;
      }
    }
  } else {
    // RGBA, the remaining kind, copies straight across.
    target.data.set(source.subarray(0, target.data.length));
  }

  context.putImageData(target, 0, 0);
  return canvas;
}

export default function PdfExtractImages() {
  const [file, setFile] = React.useState<File | null>(null);
  const [images, setImages] = React.useState<ExtractedImage[] | null>(null);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(
    () => () => {
      images?.forEach((image) => URL.revokeObjectURL(image.url));
    },
    [images],
  );

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setImages(null);
    setFile(chosen);

    const pdfjs = await loadPdfJs();
    const doc = await openPdf(chosen, chosen.name).catch((caught: unknown) => {
      setError(pdfErrorMessage(caught, chosen.name));
      return null;
    });
    if (!doc) return;

    setProgress({ done: 0, total: doc.numPages });
    const found = new Map<string, ExtractedImage>();

    try {
      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        try {
          const operators = await page.getOperatorList();
          for (let index = 0; index < operators.fnArray.length; index += 1) {
            if (operators.fnArray[index] !== pdfjs.OPS.paintImageXObject) continue;
            const name = String(operators.argsArray[index]?.[0] ?? "");
            if (!name) continue;

            const existing = found.get(name);
            if (existing) {
              if (!existing.pages.includes(pageNumber)) existing.pages.push(pageNumber);
              continue;
            }

            // The object may still be decoding, so wait for it rather than
            // reading a half-built entry.
            const object = await new Promise<PdfImageObject | null>((resolve) => {
              try {
                page.objs.get(name, (value: PdfImageObject) => resolve(value));
              } catch {
                resolve(null);
              }
            });
            if (!object) continue;

            const canvas = toCanvas(object);
            if (!canvas) continue;

            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
            if (!blob) continue;

            const bytes = new Uint8Array(await blob.arrayBuffer());
            found.set(name, {
              name,
              width: canvas.width,
              height: canvas.height,
              pages: [pageNumber],
              bytes,
              url: URL.createObjectURL(blob),
            });
          }
        } finally {
          page.cleanup();
        }

        setProgress({ done: pageNumber, total: doc.numPages });
        await yieldToBrowser();
      }

      setImages([...found.values()]);
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      await closePdf(doc);
      setProgress(null);
    }
  };

  const reset = () => {
    setFile(null);
    setImages(null);
    setError(null);
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {progress ? (
          <ProgressIndicator
            value={(progress.done / progress.total) * 100}
            label={`Scanning page ${progress.done} of ${progress.total}…`}
          />
        ) : null}

        {file && images ? (
          images.length === 0 ? (
            <>
              <Alert tone="warning" title="No embedded images found">
                Every picture on these pages is drawn with shapes and text, or is stored inline inside the
                page instructions rather than as a separate object. To get pictures out of a file like
                this, render the pages with the PDF to JPG tool instead.
              </Alert>
              <Button type="button" variant="ghost" onClick={reset}>
                Choose another PDF
              </Button>
            </>
          ) : (
            <>
              <ResultPanel
                title={`${images.length} image${images.length === 1 ? "" : "s"} found`}
                description="Pulled out at their stored size and quality, rather than as screenshots of the pages."
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      void downloadZip(
                        images.map((image, index) => ({
                          name: `${stripExtension(file.name)}-image-${index + 1}.png`,
                          data: image.bytes,
                        })),
                        `${stripExtension(file.name)}-images.zip`,
                      )
                    }
                  >
                    Download all as ZIP
                  </Button>
                }
                onReset={reset}
                resetLabel="Choose another PDF"
              />

              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {images.map((image, index) => (
                  <li key={image.name} className="space-y-2 rounded-lg border border-border bg-surface p-2">
                    <span className="block overflow-hidden rounded border border-border bg-bg-muted">
                      {/* An object URL created in this page; next/image cannot optimise it. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.url} alt="" className="block h-28 w-full object-contain" />
                    </span>
                    <span className="block text-xs text-fg-muted">
                      {image.width} × {image.height} · {formatBytes(image.bytes.byteLength)}
                      <span className="block text-fg-subtle">
                        page{image.pages.length === 1 ? "" : "s"} {image.pages.join(", ")}
                      </span>
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        downloadBytes(
                          image.bytes,
                          `${stripExtension(file.name)}-image-${index + 1}.png`,
                          "image/png",
                        )
                      }
                    >
                      Download
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          )
        ) : null}
      </div>
    </ToolFrame>
  );
}
