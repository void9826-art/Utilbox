"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Select, Slider } from "@/components/ui/field";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

/** Where the signature sits, as a fraction of the page. */
interface Spot {
  x: number;
  y: number;
}

export default function PdfSignature() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [page, setPage] = React.useState(1);
  const [spot, setSpot] = React.useState<Spot>({ x: 0.6, y: 0.82 });
  const [width, setWidth] = React.useState(30);
  const [hasInk, setHasInk] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array } | null>(null);

  const padRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawing = React.useRef(false);

  const padContext = () => {
    const canvas = padRef.current;
    if (!canvas) return null;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111111";
    return context;
  };

  const pointAt = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = padRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const box = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - box.left) / box.width) * canvas.width,
      y: ((event.clientY - box.top) / box.height) * canvas.height,
    };
  };

  const startStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const context = padContext();
    if (!context) return;
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointAt(event);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const continueStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const context = padContext();
    if (!context) return;
    const point = pointAt(event);
    context.lineTo(point.x, point.y);
    context.stroke();
    setHasInk(true);
    setResult(null);
  };

  const endStroke = () => {
    drawing.current = false;
  };

  const clearPad = () => {
    const canvas = padRef.current;
    const context = padContext();
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
    setResult(null);
  };

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const loaded = await readPdfInfo(chosen, { thumbnailScale: 0.5 });
      setFile(chosen);
      setInfo(loaded);
      setPage(loaded.pageCount);
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      setLoading(false);
    }
  };

  const sign = async () => {
    const canvas = padRef.current;
    if (!file || !info || !canvas) return;
    if (!hasInk) {
      setError("Draw your signature in the box first.");
      return;
    }

    setError(null);
    setWorking(true);

    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("The signature could not be saved.");

      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      // A PNG keeps the transparent background, so the page shows through
      // around the strokes instead of a white block sitting over the text.
      const image = await doc.embedPng(new Uint8Array(await blob.arrayBuffer()));

      const target = doc.getPages()[page - 1];
      const size = target.getSize();
      const drawWidth = (width / 100) * size.width;
      const drawHeight = (drawWidth / image.width) * image.height;

      target.drawImage(image, {
        x: spot.x * size.width - drawWidth / 2,
        // The click position is measured from the top and PDF coordinates from
        // the bottom, so the vertical fraction is flipped here.
        y: (1 - spot.y) * size.height - drawHeight / 2,
        width: drawWidth,
        height: drawHeight,
      });

      stampProducer(doc);
      setResult({ bytes: await doc.save() });
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

  const preview = info?.thumbnails[page - 1];

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        {loading ? <ProgressIndicator label="Rendering page previews…" /> : null}

        {file && info ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">
                {info.pageCount} page{info.pageCount === 1 ? "" : "s"}
              </span>
            </p>

            <div className="space-y-2">
              <span className="block text-[0.8125rem] font-medium text-fg">Draw your signature</span>
              <canvas
                ref={padRef}
                width={600}
                height={200}
                onPointerDown={startStroke}
                onPointerMove={continueStroke}
                onPointerUp={endStroke}
                onPointerLeave={endStroke}
                className="h-40 w-full max-w-lg touch-none rounded-lg border-2 border-dashed border-border bg-white"
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={clearPad} disabled={!hasInk}>
                  Clear
                </Button>
                <span className="text-xs text-fg-subtle">
                  Use a mouse, a finger or a stylus. Nothing about the signature leaves your device.
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Page to sign" htmlFor="sign-page">
                <Select
                  id="sign-page"
                  value={String(page)}
                  onChange={(event) => {
                    setPage(Number(event.target.value));
                    setResult(null);
                  }}
                >
                  {Array.from({ length: info.pageCount }, (_, index) => index + 1).map((pageNumber) => (
                    <option key={pageNumber} value={pageNumber}>
                      Page {pageNumber}
                      {pageNumber === info.pageCount ? " (last)" : ""}
                    </option>
                  ))}
                </Select>
              </Field>
              <Slider
                label="Signature width"
                valueLabel={`${width}% of the page`}
                min={10}
                max={60}
                value={width}
                onChange={(event) => {
                  setWidth(Number(event.target.value));
                  setResult(null);
                }}
              />
            </div>

            {preview ? (
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">
                  Click where the signature should go
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    const box = event.currentTarget.getBoundingClientRect();
                    setSpot({
                      x: (event.clientX - box.left) / box.width,
                      y: (event.clientY - box.top) / box.height,
                    });
                    setResult(null);
                  }}
                  className="relative block w-full max-w-sm overflow-hidden rounded border border-border bg-white"
                  aria-label={`Set the signature position on page ${page}`}
                >
                  {/* A data URL rendered in this page; next/image cannot optimise it. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="block h-auto w-full" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-accent/30"
                    style={{ left: `${spot.x * 100}%`, top: `${spot.y * 100}%` }}
                  />
                </button>
              </div>
            ) : null}

            {result ? (
              <ResultPanel
                title="Your signed PDF is ready"
                description={`${formatBytes(result.bytes.byteLength)} · signature placed on page ${page}`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-signed.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Sign another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void sign()} loading={working} disabled={!hasInk}>
                  Place signature
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
