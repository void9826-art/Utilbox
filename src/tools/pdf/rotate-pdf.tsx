"use client";

import * as React from "react";
import { RotateCcw, RotateCw } from "lucide-react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { formatBytes } from "@/lib/utils";

import { PageGrid, PageTile, PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

export default function RotatePdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  /** Extra rotation per page, in degrees, added to whatever the page already has. */
  const [rotations, setRotations] = React.useState<Record<number, number>>({});
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array } | null>(null);

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const loaded = await readPdfInfo(chosen);
      setFile(chosen);
      setInfo(loaded);
      setRotations({});
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      setLoading(false);
    }
  };

  const rotatePage = (pageNumber: number, delta: number) => {
    setRotations((previous) => {
      const next = (((previous[pageNumber] ?? 0) + delta) % 360 + 360) % 360;
      const updated = { ...previous };
      if (next === 0) delete updated[pageNumber];
      else updated[pageNumber] = next;
      return updated;
    });
    setResult(null);
  };

  const rotateAll = (delta: number) => {
    if (!info) return;
    setRotations((previous) => {
      const updated: Record<number, number> = {};
      for (let page = 1; page <= info.pageCount; page += 1) {
        const next = (((previous[page] ?? 0) + delta) % 360 + 360) % 360;
        if (next !== 0) updated[page] = next;
      }
      return updated;
    });
    setResult(null);
  };

  const apply = async () => {
    if (!file || !info) return;

    setError(null);
    setWorking(true);

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());

      doc.getPages().forEach((page, index) => {
        const extra = rotations[index + 1] ?? 0;
        if (extra === 0) return;
        // Rotation is a page property, so the change is stored in the document
        // rather than being a view-only adjustment that a reader forgets.
        const current = page.getRotation().angle;
        page.setRotation(degrees((((current + extra) % 360) + 360) % 360));
      });

      setResult({ bytes: await doc.save() });
    } catch (caught) {
      setError(pdfErrorMessage(caught, file.name));
    } finally {
      setWorking(false);
    }
  };

  const changedCount = Object.keys(rotations).length;

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {loading ? <ProgressIndicator label="Rendering page previews…" /> : null}

        {file && info ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-fg">
                {file.name}
                <span className="ml-2 font-normal text-fg-muted">
                  {info.pageCount} page{info.pageCount === 1 ? "" : "s"}
                </span>
              </p>
              <div className="flex gap-1.5">
                <Button type="button" variant="secondary" size="sm" onClick={() => rotateAll(-90)}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  All left
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => rotateAll(90)}>
                  <RotateCw className="size-4" aria-hidden="true" />
                  All right
                </Button>
                {changedCount > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRotations({});
                      setResult(null);
                    }}
                  >
                    Reset
                  </Button>
                ) : null}
              </div>
            </div>

            <p className="text-xs text-fg-subtle">
              Click a page to turn it 90° clockwise. The preview shows exactly how the saved file will
              look.
            </p>

            <PageGrid>
              {Array.from({ length: info.thumbnails.length }, (_, index) => index + 1).map(
                (pageNumber) => {
                  const rotation = rotations[pageNumber] ?? 0;
                  return (
                    <div key={pageNumber} className="relative">
                      <div
                        style={{ transform: `rotate(${rotation}deg)` }}
                        className="transition-transform duration-200"
                      >
                        <PageTile
                          pageNumber={pageNumber}
                          thumbnail={info.thumbnails[pageNumber - 1]}
                          selected={rotation !== 0}
                          onToggle={() => rotatePage(pageNumber, 90)}
                          badge={rotation !== 0 ? `${rotation}°` : undefined}
                          disabled={working}
                          selectedLabel={`rotated ${rotation} degrees`}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </PageGrid>

            {info.pageCount > info.thumbnails.length ? (
              <p className="text-xs text-fg-subtle">
                Previews are shown for the first {info.thumbnails.length} pages. Use the “All left” and
                “All right” buttons to rotate the whole document.
              </p>
            ) : null}

            <div className="rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm text-fg">
              {changedCount === 0
                ? "No pages rotated yet."
                : `${changedCount} page${changedCount === 1 ? "" : "s"} will be rotated.`}
            </div>

            {result ? (
              <ResultPanel
                title="Your rotated PDF is ready"
                description={`${formatBytes(result.bytes.byteLength)} · page content untouched, only the rotation changed`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-rotated.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={() => {
                  setFile(null);
                  setInfo(null);
                  setResult(null);
                  setRotations({});
                }}
                resetLabel="Rotate another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={apply} loading={working} disabled={changedCount === 0}>
                  Save rotated PDF
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setInfo(null);
                    setRotations({});
                  }}
                >
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
