"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { canvasToBlob } from "@/lib/image";
import { closePdf, openPdf, renderPage } from "@/lib/pdf";
import { formatBytes, yieldToBrowser } from "@/lib/utils";
import { stampProducer } from "@/lib/pdf-meta";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

const LEVELS = [
  { value: "light", label: "Light", scale: 2, quality: 0.82, note: "Best detail, smallest saving." },
  { value: "balanced", label: "Balanced", scale: 1.5, quality: 0.7, note: "Halves most scans while staying comfortably readable." },
  { value: "strong", label: "Strong", scale: 1.1, quality: 0.55, note: "Smallest file, for email attachments." },
] as const;

type Level = (typeof LEVELS)[number]["value"];

export default function CompressPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [level, setLevel] = React.useState<Level>("balanced");
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    bytes: Uint8Array;
    originalSize: number;
    pages: number;
  } | null>(null);

  const config = LEVELS.find((option) => option.value === level) ?? LEVELS[1];

  const compress = async () => {
    if (!file) return;

    setError(null);
    setResult(null);
    setProgress({ done: 0, total: 0 });

    let source: Awaited<ReturnType<typeof openPdf>> | null = null;

    try {
      const { PDFDocument } = await import("pdf-lib");

      source = await openPdf(file, file.name);
      const total = source.numPages;
      setProgress({ done: 0, total });

      const output = await PDFDocument.create();
      stampProducer(output);

      for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
        const page = await source.getPage(pageNumber);

        try {
          // Each page is rendered at a reduced scale and re-encoded as JPEG.
          // That is what makes scans much smaller — and it is also why the
          // text layer does not survive, which the copy is explicit about.
          const rendered = await renderPage(page, config.scale);
          const jpeg = await canvasToBlob(rendered.canvas, "image/jpeg", config.quality);
          const embedded = await output.embedJpg(await jpeg.arrayBuffer());

          // Keep the page at its original PDF dimensions so print size is right.
          const viewport = page.getViewport({ scale: 1 });
          const newPage = output.addPage([viewport.width, viewport.height]);
          newPage.drawImage(embedded, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });
        } finally {
          page.cleanup();
        }

        setProgress({ done: pageNumber, total });
        await yieldToBrowser();
      }

      const bytes = await output.save();
      setResult({ bytes, originalSize: file.size, pages: total });
    } catch (caught) {
      setError(pdfErrorMessage(caught, file.name));
    } finally {
      await closePdf(source);
      setProgress(null);
    }
  };

  const saving = result ? ((result.originalSize - result.bytes.byteLength) / result.originalSize) * 100 : null;
  const grew = saving !== null && saving <= 0;

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <PdfDropzone
            onFiles={(files) => {
              setFile(files[0] ?? null);
              setResult(null);
              setError(null);
            }}
            onError={setError}
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {file ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">{formatBytes(file.size)}</span>
            </p>

            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Compression level</span>
              <Segmented
                name="compress-level"
                ariaLabel="Compression level"
                value={level}
                onChange={setLevel}
                options={LEVELS.map((option) => ({ value: option.value, label: option.label }))}
              />
              <p className="text-xs text-fg-subtle">{config.note}</p>
            </div>

            {progress ? (
              <ProgressIndicator
                value={progress.total > 0 ? (progress.done / progress.total) * 100 : undefined}
                label={
                  progress.total > 0
                    ? `Compressing page ${progress.done} of ${progress.total}…`
                    : "Opening the document…"
                }
              />
            ) : null}

            {result ? (
              <>
                <StatGrid className="sm:grid-cols-4">
                  <Stat label="Original" value={formatBytes(result.originalSize)} />
                  <Stat label="Compressed" value={formatBytes(result.bytes.byteLength)} emphasis />
                  <Stat
                    label={grew ? "Increase" : "Saved"}
                    value={saving === null ? "—" : `${Math.abs(saving).toFixed(0)}%`}
                  />
                  <Stat label="Pages" value={String(result.pages)} />
                </StatGrid>

                {grew ? (
                  <Alert tone="warning" title="The compressed file is larger than the original">
                    That happens with text-only PDFs: turning crisp vector text into page images adds data
                    rather than removing it. Your original is the better file here — download it unchanged
                    from wherever you got it, or try the Light level.
                  </Alert>
                ) : (
                  <ResultPanel
                    title="Your compressed PDF is ready"
                    description={`${formatBytes(result.originalSize)} → ${formatBytes(result.bytes.byteLength)}, a saving of ${saving?.toFixed(0)}%.`}
                    actions={
                      <Button
                        type="button"
                        onClick={() =>
                          downloadBytes(
                            result.bytes,
                            `${stripExtension(file.name)}-compressed.pdf`,
                            "application/pdf",
                          )
                        }
                      >
                        Download PDF
                      </Button>
                    }
                    onReset={() => {
                      setFile(null);
                      setResult(null);
                    }}
                    resetLabel="Compress another PDF"
                  />
                )}
              </>
            ) : null}

            {!result ? (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={compress} loading={progress !== null}>
                  Compress PDF
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                  }}
                >
                  Choose another PDF
                </Button>
              </div>
            ) : (
              <Button type="button" variant="secondary" onClick={compress} loading={progress !== null}>
                Try a different level
              </Button>
            )}

            <Alert tone="info" title="Compression removes the text layer">
              Pages become images, so the result cannot be searched or have its text selected. If that
              matters, keep the original and reduce the page count with Extract or Delete pages instead.
            </Alert>
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
