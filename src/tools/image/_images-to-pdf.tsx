"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { FileList, type FileListItem } from "@/components/tool/file-list";
import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented, Slider } from "@/components/ui/field";
import { downloadBytes } from "@/lib/download";
import type { AcceptOptions } from "@/lib/files";
import { canvasToBlob, decodeImage, renderToCanvas } from "@/lib/image";
import { PAGE_SIZES, type PageSizeId } from "@/lib/pdf-document";
import { formatBytes, yieldToBrowser } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";
import { nextImageId } from "./_shared";

interface Entry {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

const PAGE_OPTIONS: Array<{ value: PageSizeId | "fit"; label: string }> = [
  { value: "fit", label: "Match each image" },
  { value: "a4", label: "A4 (210 × 297 mm)" },
  { value: "letter", label: "US Letter (8.5 × 11 in)" },
  { value: "legal", label: "US Legal (8.5 × 14 in)" },
];

export interface ImagesToPdfProps {
  accept: AcceptOptions;
  inputAccept: string;
  hint: string;
  fileNoun: string;
}

/**
 * Shared implementation behind "JPG to PDF" and "Image to PDF".
 *
 * JPEG sources are embedded byte-for-byte with no re-encoding, so photo
 * quality is untouched. Other formats are converted to PNG first, because PDF
 * only accepts a fixed set of image encodings.
 */
export function ImagesToPdf({ accept, inputAccept, hint, fileNoun }: ImagesToPdfProps) {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [pageSize, setPageSize] = React.useState<PageSizeId | "fit">("fit");
  const [orientation, setOrientation] = React.useState<"auto" | "portrait" | "landscape">("auto");
  const [marginMm, setMarginMm] = React.useState(10);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; pages: number } | null>(null);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const entriesRef = React.useRef<Entry[]>([]);
  React.useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);
  React.useEffect(
    () => () => {
      for (const entry of entriesRef.current) URL.revokeObjectURL(entry.previewUrl);
    },
    [],
  );

  const addFiles = async (files: File[]) => {
    setError(null);
    setResult(null);
    const added: Entry[] = [];

    for (const file of files) {
      try {
        const decoded = await decodeImage(file);
        added.push({
          id: nextImageId(),
          file,
          previewUrl: URL.createObjectURL(file),
          width: decoded.width,
          height: decoded.height,
        });
        decoded.release();
      } catch {
        setError(`"${file.name}" could not be opened as an image.`);
      }
    }

    if (added.length > 0) setEntries((previous) => [...previous, ...added]);
  };

  const move = (id: string, direction: -1 | 1) => {
    setEntries((previous) => {
      const index = previous.findIndex((entry) => entry.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= previous.length) return previous;
      const next = [...previous];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  };

  const remove = (id: string) => {
    setEntries((previous) => {
      const target = previous.find((entry) => entry.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return previous.filter((entry) => entry.id !== id);
    });
    setResult(null);
  };

  const build = async () => {
    if (entries.length === 0) return;

    setError(null);
    setResult(null);
    setProgress({ done: 0, total: entries.length });

    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      doc.setCreator("Utilbox");
      doc.setProducer("Utilbox");

      // 1 mm = 72/25.4 PDF points.
      const margin = marginMm * (72 / 25.4);

      for (const [index, entry] of entries.entries()) {
        const isJpeg = entry.file.type === "image/jpeg";
        let embedded;

        if (isJpeg) {
          // Embedded as-is: no decode, no re-encode, no quality loss.
          embedded = await doc.embedJpg(await entry.file.arrayBuffer());
        } else {
          const decoded = await decodeImage(entry.file);
          try {
            const canvas = renderToCanvas(decoded, {
              width: decoded.width,
              height: decoded.height,
            });
            const png = await canvasToBlob(canvas, "image/png", 1);
            embedded = await doc.embedPng(await png.arrayBuffer());
          } finally {
            decoded.release();
          }
        }

        const imageIsLandscape = embedded.width > embedded.height;

        if (pageSize === "fit") {
          const page = doc.addPage([embedded.width + margin * 2, embedded.height + margin * 2]);
          page.drawImage(embedded, {
            x: margin,
            y: margin,
            width: embedded.width,
            height: embedded.height,
          });
        } else {
          const [shortSide, longSide] = PAGE_SIZES[pageSize];
          const landscape =
            orientation === "landscape" || (orientation === "auto" && imageIsLandscape);
          const pageWidth = landscape ? longSide : shortSide;
          const pageHeight = landscape ? shortSide : longSide;

          const page = doc.addPage([pageWidth, pageHeight]);
          const available = { width: pageWidth - margin * 2, height: pageHeight - margin * 2 };

          // Fit inside the margins without distorting the aspect ratio.
          const scale = Math.min(
            available.width / embedded.width,
            available.height / embedded.height,
          );
          const drawWidth = embedded.width * scale;
          const drawHeight = embedded.height * scale;

          page.drawImage(embedded, {
            x: (pageWidth - drawWidth) / 2,
            y: (pageHeight - drawHeight) / 2,
            width: drawWidth,
            height: drawHeight,
          });
        }

        setProgress({ done: index + 1, total: entries.length });
        await yieldToBrowser();
      }

      setResult({ bytes: await doc.save(), pages: entries.length });
    } catch {
      setError("The PDF could not be created. One of the images may be corrupted.");
    } finally {
      setProgress(null);
    }
  };

  const items: FileListItem[] = entries.map((entry) => ({
    id: entry.id,
    file: entry.file,
    thumbnail: entry.previewUrl,
    meta: `${entry.width} × ${entry.height}`,
  }));

  return (
    <ToolFrame>
      <div className="space-y-5">
        {entries.length === 0 ? (
          <Dropzone
            accept={accept}
            inputAccept={inputAccept}
            multiple
            onFiles={(files) => void addFiles(files)}
            onError={setError}
            hint={hint}
          />
        ) : (
          <>
            <FileList
              items={items}
              onRemove={remove}
              onMove={move}
              summary={`${entries.length} ${fileNoun}${entries.length === 1 ? "" : "s"} — one per page, in this order`}
              disabled={progress !== null}
            />
            <Dropzone
              accept={accept}
              inputAccept={inputAccept}
              multiple
              compact
              onFiles={(files) => void addFiles(files)}
              onError={setError}
              label="Add more images"
            />
          </>
        )}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {entries.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Page size"
                id="pdf-page-size"
                value={pageSize}
                onChange={(value) => setPageSize(value as PageSizeId | "fit")}
                hint={
                  pageSize === "fit"
                    ? "Each page is exactly the size of its image — right for receipts and screenshots."
                    : "A fixed size is better when the PDF will be printed."
                }
              >
                {PAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectField>

              {pageSize !== "fit" ? (
                <div className="space-y-1.5">
                  <span className="block text-[0.8125rem] font-medium text-fg">Orientation</span>
                  <Segmented
                    name="pdf-orientation"
                    ariaLabel="Page orientation"
                    value={orientation}
                    onChange={setOrientation}
                    options={[
                      { value: "auto", label: "Match image" },
                      { value: "portrait", label: "Portrait" },
                      { value: "landscape", label: "Landscape" },
                    ]}
                  />
                </div>
              ) : null}
            </div>

            <Slider
              label="Margin"
              valueLabel={`${marginMm} mm`}
              min={0}
              max={40}
              value={marginMm}
              onChange={(event) => setMarginMm(Number(event.target.value))}
              className="sm:max-w-md"
            />

            {progress ? (
              <ProgressIndicator
                value={(progress.done / Math.max(1, progress.total)) * 100}
                label={`Adding page ${progress.done} of ${progress.total}…`}
              />
            ) : null}

            {result ? (
              <ResultPanel
                title="Your PDF is ready"
                description={`${result.pages} page${result.pages === 1 ? "" : "s"} · ${formatBytes(result.bytes.byteLength)}`}
                actions={
                  <Button
                    type="button"
                    onClick={() => downloadBytes(result.bytes, "images.pdf", "application/pdf")}
                  >
                    Download PDF
                  </Button>
                }
                onReset={() => {
                  for (const entry of entries) URL.revokeObjectURL(entry.previewUrl);
                  setEntries([]);
                  setResult(null);
                }}
                resetLabel="Start over"
              />
            ) : (
              <Button type="button" onClick={build} loading={progress !== null}>
                Create PDF
              </Button>
            )}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
