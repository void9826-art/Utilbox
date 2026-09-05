"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Segmented, Slider } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadBlob, downloadZip } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { canvasToBlob } from "@/lib/image";
import { closePdf, openPdf, renderPage } from "@/lib/pdf";
import { formatBytes, yieldToBrowser } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

interface PageImage {
  pageNumber: number;
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

/**
 * Render scales chosen so the labels mean something concrete: a PDF point is
 * 1/72 inch, so scale 1 is 72 DPI, scale 2 is 144 DPI, and so on.
 */
const SCALES = [
  { value: "1", label: "Screen", dpi: 72 },
  { value: "2", label: "Print", dpi: 144 },
  { value: "3", label: "High", dpi: 216 },
  { value: "4", label: "Maximum", dpi: 288 },
];

export interface PdfToImageProps {
  format: "image/jpeg" | "image/png";
  extension: "jpg" | "png";
  formatName: string;
  /** PNG can keep the page transparent where nothing is drawn. */
  allowTransparency?: boolean;
}

export function PdfToImage({ format, extension, formatName, allowTransparency }: PdfToImageProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [scale, setScale] = React.useState("2");
  const [quality, setQuality] = React.useState(88);
  const [transparent, setTransparent] = React.useState(false);
  const [images, setImages] = React.useState<PageImage[]>([]);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const imagesRef = React.useRef<PageImage[]>([]);
  React.useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  React.useEffect(
    () => () => {
      for (const image of imagesRef.current) URL.revokeObjectURL(image.url);
    },
    [],
  );

  const releaseImages = () => {
    for (const image of imagesRef.current) URL.revokeObjectURL(image.url);
    setImages([]);
  };

  const convert = async (source: File) => {
    setError(null);
    releaseImages();
    setProgress({ done: 0, total: 0 });

    let doc: Awaited<ReturnType<typeof openPdf>> | null = null;

    try {
      doc = await openPdf(source, source.name);
      const total = doc.numPages;
      setProgress({ done: 0, total });

      const produced: PageImage[] = [];

      for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);

        try {
          const rendered = await renderPage(page, Number(scale));

          // PNG can keep the untouched areas clear; JPEG has no alpha channel.
          if (allowTransparency && transparent) {
            const context = rendered.canvas.getContext("2d");
            if (context) {
              // Re-render without the white base by clearing and redrawing.
              context.clearRect(0, 0, rendered.canvas.width, rendered.canvas.height);
              const viewport = page.getViewport({ scale: Number(scale) });
              await page.render({
                canvas: rendered.canvas,
                canvasContext: context,
                viewport,
              }).promise;
            }
          }

          const blob = await canvasToBlob(rendered.canvas, format, quality / 100);
          produced.push({
            pageNumber,
            blob,
            url: URL.createObjectURL(blob),
            width: rendered.width,
            height: rendered.height,
          });
        } finally {
          page.cleanup();
        }

        setProgress({ done: pageNumber, total });
        setImages([...produced]);
        // Let the browser paint each thumbnail as it appears.
        await yieldToBrowser();
      }
    } catch (caught) {
      setError(pdfErrorMessage(caught, source.name));
    } finally {
      await closePdf(doc);
      setProgress(null);
    }
  };

  const load = (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setFile(chosen);
    void convert(chosen);
  };

  const downloadEverything = async () => {
    if (!file || images.length === 0) return;
    const stem = stripExtension(file.name);

    if (images.length === 1) {
      downloadBlob(images[0].blob, `${stem}.${extension}`);
      return;
    }

    const files = await Promise.all(
      images.map(async (image) => ({
        name: `${stem}-page-${String(image.pageNumber).padStart(3, "0")}.${extension}`,
        data: new Uint8Array(await image.blob.arrayBuffer()),
      })),
    );
    await downloadZip(files, `${stem}-${extension}.zip`);
  };

  const totalBytes = images.reduce((sum, image) => sum + image.blob.size, 0);
  const selectedScale = SCALES.find((option) => option.value === scale);

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={load} onError={setError} /> : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {file ? (
          <>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Resolution</span>
                <Segmented
                  name="pdf-image-scale"
                  ariaLabel="Render resolution"
                  value={scale}
                  onChange={setScale}
                  options={SCALES.map((option) => ({
                    value: option.value,
                    label: option.label,
                    title: `About ${option.dpi} DPI`,
                  }))}
                />
                <p className="text-xs text-fg-subtle">
                  About {selectedScale?.dpi} DPI. Higher settings look sharper but use more memory, which
                  matters on long documents.
                </p>
              </div>

              {format === "image/jpeg" ? (
                <Slider
                  label="JPG quality"
                  valueLabel={`${quality}%`}
                  min={50}
                  max={100}
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  className="sm:max-w-md"
                />
              ) : null}

              {allowTransparency ? (
                <Checkbox
                  label="Keep the background transparent"
                  description="Only shows through where the PDF itself draws nothing — many PDFs paint a white page."
                  checked={transparent}
                  onChange={(event) => setTransparent(event.target.checked)}
                />
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => void convert(file)}
                  loading={progress !== null}
                  variant={images.length > 0 ? "secondary" : "primary"}
                >
                  {images.length > 0 ? "Re-render with these settings" : "Convert"}
                </Button>
                {images.length > 0 && !progress ? (
                  <Button type="button" onClick={() => void downloadEverything()}>
                    {images.length === 1
                      ? `Download ${formatName}`
                      : `Download all ${images.length} as ZIP`}
                  </Button>
                ) : null}
                <ResetButton
                  onReset={() => {
                    releaseImages();
                    setFile(null);
                    setError(null);
                  }}
                >
                  Choose another PDF
                </ResetButton>
              </div>
            </div>

            {progress ? (
              <ProgressIndicator
                value={progress.total > 0 ? (progress.done / progress.total) * 100 : undefined}
                label={
                  progress.total > 0
                    ? `Rendering page ${progress.done} of ${progress.total}…`
                    : "Opening the document…"
                }
              />
            ) : null}

            {images.length > 0 ? (
              <>
                <StatGrid className="sm:grid-cols-3">
                  <Stat label="Pages rendered" value={String(images.length)} emphasis />
                  <Stat
                    label="Page size"
                    value={`${images[0].width} × ${images[0].height}`}
                    hint="pixels"
                  />
                  <Stat label="Total size" value={formatBytes(totalBytes)} />
                </StatGrid>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {images.map((image) => (
                    <figure key={image.pageNumber} className="space-y-1.5">
                      <div className="overflow-hidden rounded-lg border border-border bg-white">
                        {/* Object URL rendered in this page; not optimisable. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={`Page ${image.pageNumber}`}
                          className="block h-auto w-full"
                          loading="lazy"
                        />
                      </div>
                      <figcaption className="flex items-center justify-between gap-2">
                        <span className="tabular text-xs text-fg-muted">
                          Page {image.pageNumber} · {formatBytes(image.blob.size)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            downloadBlob(
                              image.blob,
                              `${stripExtension(file.name)}-page-${image.pageNumber}.${extension}`,
                            )
                          }
                        >
                          Save
                        </Button>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
