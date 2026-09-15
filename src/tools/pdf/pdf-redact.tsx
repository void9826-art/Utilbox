"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Select } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { closePdf, openPdf, renderPage } from "@/lib/pdf";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes, yieldToBrowser } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

/** A redaction box, stored as fractions of the page so it survives rescaling. */
interface Box {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

let sequence = 0;

export default function PdfRedact() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [page, setPage] = React.useState(1);
  const [boxes, setBoxes] = React.useState<Box[]>([]);
  const [drag, setDrag] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; pages: number } | null>(null);

  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const origin = React.useRef<{ x: number; y: number } | null>(null);
  /**
   * The rectangle being dragged, kept alongside the state copy.
   *
   * A quick drag can deliver its move and up events in a single tick, before
   * React has re-rendered, so reading the state here would see the previous
   * value and silently drop the box. The ref is always current.
   */
  const latest = React.useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setResult(null);
    setBoxes([]);
    setLoading(true);
    try {
      const loaded = await readPdfInfo(chosen, { thumbnailScale: 0.9 });
      setFile(chosen);
      setInfo(loaded);
      setPage(1);
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      setLoading(false);
    }
  };

  const positionOf = (event: React.PointerEvent<HTMLDivElement>) => {
    const surface = surfaceRef.current;
    if (!surface) return { x: 0, y: 0 };
    const box = surface.getBoundingClientRect();
    return {
      x: Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1),
      y: Math.min(Math.max((event.clientY - box.top) / box.height, 0), 1),
    };
  };

  const startBox = (event: React.PointerEvent<HTMLDivElement>) => {
    // Capture keeps the drag alive past the edge of the preview. Not every
    // pointer can be captured, and failing to do so must not block marking.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* marking still works without capture */
    }
    const point = positionOf(event);
    origin.current = point;
    latest.current = { x: point.x, y: point.y, width: 0, height: 0 };
    setDrag(latest.current);
    setResult(null);
  };

  const growBox = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!origin.current) return;
    const point = positionOf(event);
    latest.current = {
      x: Math.min(origin.current.x, point.x),
      y: Math.min(origin.current.y, point.y),
      width: Math.abs(point.x - origin.current.x),
      height: Math.abs(point.y - origin.current.y),
    };
    setDrag(latest.current);
  };

  const finishBox = () => {
    const rectangle = latest.current;
    if (rectangle && rectangle.width > 0.01 && rectangle.height > 0.01) {
      sequence += 1;
      setBoxes((previous) => [...previous, { id: `box-${sequence}`, page, ...rectangle }]);
    }
    origin.current = null;
    latest.current = null;
    setDrag(null);
  };

  const apply = async () => {
    if (!file || !info || boxes.length === 0) return;
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
      const source = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const output = await PDFDocument.create();
      const redactedPages = new Set(boxes.map((box) => box.page));

      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        if (!redactedPages.has(pageNumber)) {
          const [copied] = await output.copyPages(source, [pageNumber - 1]);
          output.addPage(copied);
        } else {
          const current = await doc.getPage(pageNumber);
          try {
            // Painting over the rendered page and replacing the original with
            // that image is what makes this a redaction: the covered text is no
            // longer anywhere in the file, so it cannot be copied back out.
            const rendered = await renderPage(current, 2);
            const context = rendered.canvas.getContext("2d");
            if (!context) throw new Error("Your browser could not create a drawing surface.");

            context.fillStyle = "#000000";
            for (const box of boxes.filter((entry) => entry.page === pageNumber)) {
              context.fillRect(
                box.x * rendered.canvas.width,
                box.y * rendered.canvas.height,
                box.width * rendered.canvas.width,
                box.height * rendered.canvas.height,
              );
            }

            const blob = await new Promise<Blob | null>((resolve) =>
              rendered.canvas.toBlob(resolve, "image/jpeg", 0.9),
            );
            if (!blob) throw new Error("The page could not be encoded.");

            const embedded = await output.embedJpg(new Uint8Array(await blob.arrayBuffer()));
            const viewport = current.getViewport({ scale: 1 });
            const target = output.addPage([viewport.width, viewport.height]);
            target.drawImage(embedded, { x: 0, y: 0, width: viewport.width, height: viewport.height });
          } finally {
            current.cleanup();
          }
        }

        setProgress({ done: pageNumber, total: doc.numPages });
        await yieldToBrowser();
      }

      stampProducer(output);
      setResult({ bytes: await output.save(), pages: redactedPages.size });
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
    setBoxes([]);
    setResult(null);
  };

  const preview = info?.thumbnails[page - 1];
  const pageBoxes = boxes.filter((box) => box.page === page);

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
                {info.pageCount} page{info.pageCount === 1 ? "" : "s"} · {boxes.length} area
                {boxes.length === 1 ? "" : "s"} marked
              </span>
            </p>

            <Alert tone="info" title="What redaction does here">
              Each redacted page is replaced by a flattened picture of itself with the marked areas painted
              out, so the hidden words are gone from the file rather than merely covered. Those pages stop
              being selectable text. Pages you do not mark are copied across untouched.
            </Alert>

            <Field label="Page" htmlFor="redact-page">
              <Select id="redact-page" value={String(page)} onChange={(event) => setPage(Number(event.target.value))}>
                {Array.from({ length: info.pageCount }, (_, index) => index + 1).map((pageNumber) => {
                  const marked = boxes.filter((box) => box.page === pageNumber).length;
                  return (
                    <option key={pageNumber} value={pageNumber}>
                      Page {pageNumber}
                      {marked > 0 ? ` — ${marked} area${marked === 1 ? "" : "s"}` : ""}
                    </option>
                  );
                })}
              </Select>
            </Field>

            {preview ? (
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">
                  Drag across anything that must be removed
                </span>
                <div
                  ref={surfaceRef}
                  onPointerDown={startBox}
                  onPointerMove={growBox}
                  onPointerUp={finishBox}
                  onPointerCancel={finishBox}
                  className="relative block w-full max-w-lg cursor-crosshair touch-none overflow-hidden rounded border border-border bg-white"
                >
                  {/* A data URL rendered in this page; next/image cannot optimise it. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt={`Page ${page}`} className="pointer-events-none block h-auto w-full" />
                  {pageBoxes.map((box) => (
                    <span
                      key={box.id}
                      className="pointer-events-none absolute bg-black"
                      style={{
                        left: `${box.x * 100}%`,
                        top: `${box.y * 100}%`,
                        width: `${box.width * 100}%`,
                        height: `${box.height * 100}%`,
                      }}
                    />
                  ))}
                  {drag ? (
                    <span
                      className="pointer-events-none absolute border-2 border-accent bg-black/60"
                      style={{
                        left: `${drag.x * 100}%`,
                        top: `${drag.y * 100}%`,
                        width: `${drag.width * 100}%`,
                        height: `${drag.height * 100}%`,
                      }}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}

            {pageBoxes.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {pageBoxes.map((box, index) => (
                  <li key={box.id}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setBoxes((previous) => previous.filter((entry) => entry.id !== box.id));
                        setResult(null);
                      }}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Remove area {index + 1}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}

            {progress ? (
              <ProgressIndicator
                value={(progress.done / progress.total) * 100}
                label={`Writing page ${progress.done} of ${progress.total}…`}
              />
            ) : null}

            {result ? (
              <ResultPanel
                title="Your redacted PDF is ready"
                description={`${formatBytes(result.bytes.byteLength)} · ${result.pages} page${result.pages === 1 ? "" : "s"} flattened, the rest copied unchanged`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-redacted.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Redact another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => void apply()}
                  loading={Boolean(progress)}
                  disabled={boxes.length === 0}
                >
                  Apply redactions
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
