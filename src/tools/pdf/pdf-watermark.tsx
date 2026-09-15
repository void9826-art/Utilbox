"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input, Segmented, Slider } from "@/components/ui/field";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { parsePageRanges } from "@/lib/pdf";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

type Placement = "diagonal" | "tile" | "center" | "bottom";

const PLACEMENTS: Array<{ value: Placement; label: string }> = [
  { value: "diagonal", label: "Diagonal" },
  { value: "tile", label: "Tiled" },
  { value: "center", label: "Centred" },
  { value: "bottom", label: "Footer" },
];

const COLOURS: Array<{ value: string; label: string; rgb: [number, number, number] }> = [
  { value: "grey", label: "Grey", rgb: [0.5, 0.5, 0.5] },
  { value: "red", label: "Red", rgb: [0.8, 0.15, 0.15] },
  { value: "blue", label: "Blue", rgb: [0.15, 0.3, 0.75] },
  { value: "black", label: "Black", rgb: [0, 0, 0] },
];

export default function PdfWatermark() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [text, setText] = React.useState("CONFIDENTIAL");
  const [placement, setPlacement] = React.useState<Placement>("diagonal");
  const [opacity, setOpacity] = React.useState(20);
  const [size, setSize] = React.useState(48);
  const [colour, setColour] = React.useState("grey");
  const [range, setRange] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    bytes: Uint8Array;
    pages: number;
    preview: string;
  } | null>(null);

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

  const apply = async () => {
    if (!file || !info) return;
    if (!text.trim()) {
      setError("Enter the text you want stamped across the pages.");
      return;
    }

    const parsed = parsePageRanges(range, info.pageCount);
    if (parsed.error) {
      setError(parsed.error);
      return;
    }
    const targets = new Set(
      parsed.pages.length > 0 ? parsed.pages : Array.from({ length: info.pageCount }, (_, index) => index + 1),
    );

    setError(null);
    setWorking(true);

    try {
      const { PDFDocument, StandardFonts, degrees, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const tone = COLOURS.find((entry) => entry.value === colour)?.rgb ?? [0.5, 0.5, 0.5];
      const paint = rgb(tone[0], tone[1], tone[2]);
      const alpha = opacity / 100;

      doc.getPages().forEach((page, index) => {
        if (!targets.has(index + 1)) return;
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, size);

        if (placement === "tile") {
          // A grid of small marks is far harder to crop away than a single one.
          const stepX = textWidth + size * 2;
          const stepY = size * 4;
          for (let y = size; y < height + stepY; y += stepY) {
            for (let x = -textWidth; x < width + stepX; x += stepX) {
              page.drawText(text, { x, y, size, font, color: paint, opacity: alpha, rotate: degrees(30) });
            }
          }
          return;
        }

        if (placement === "diagonal") {
          // Match the page's own diagonal, then step back along that line by
          // half the text width so the mark ends up centred on the page.
          const angle = (Math.atan2(height, width) * 180) / Math.PI;
          const radians = (angle * Math.PI) / 180;
          page.drawText(text, {
            x: width / 2 - (textWidth / 2) * Math.cos(radians),
            y: height / 2 - (textWidth / 2) * Math.sin(radians),
            size,
            font,
            color: paint,
            opacity: alpha,
            rotate: degrees(angle),
          });
          return;
        }

        if (placement === "center") {
          page.drawText(text, {
            x: (width - textWidth) / 2,
            y: (height - size) / 2,
            size,
            font,
            color: paint,
            opacity: alpha,
          });
          return;
        }

        page.drawText(text, {
          x: (width - textWidth) / 2,
          y: size * 0.75,
          size,
          font,
          color: paint,
          opacity: alpha,
        });
      });

      stampProducer(doc);
      const bytes = await doc.save();

      // The preview is rendered from the saved bytes, so what is shown on
      // screen is what the download contains.
      const check = await readPdfInfo(
        new File([bytes as BlobPart], file.name, { type: "application/pdf" }),
        { maxThumbnails: 1, thumbnailScale: 0.6 },
      );

      setResult({ bytes, pages: targets.size, preview: check.thumbnails[0] ?? "" });
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
    setRange("");
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

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Watermark text" htmlFor="watermark-text">
                <Input
                  id="watermark-text"
                  value={text}
                  maxLength={60}
                  onChange={(event) => {
                    setText(event.target.value);
                    setResult(null);
                  }}
                />
              </Field>
              <Field label="Pages" htmlFor="watermark-range" hint="Leave blank for every page, or use 1-3, 7">
                <Input
                  id="watermark-range"
                  value={range}
                  placeholder="all pages"
                  onChange={(event) => {
                    setRange(event.target.value);
                    setResult(null);
                  }}
                />
              </Field>
            </div>

            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Placement</span>
              <Segmented
                name="watermark-placement"
                ariaLabel="Watermark placement"
                value={placement}
                onChange={(value) => {
                  setPlacement(value);
                  setResult(null);
                }}
                options={PLACEMENTS}
              />
            </div>

            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Colour</span>
              <Segmented
                name="watermark-colour"
                ariaLabel="Watermark colour"
                value={colour}
                onChange={(value) => {
                  setColour(value);
                  setResult(null);
                }}
                options={COLOURS.map(({ value, label }) => ({ value, label }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Slider
                label="Opacity"
                valueLabel={`${opacity}%`}
                min={5}
                max={80}
                step={5}
                value={opacity}
                onChange={(event) => {
                  setOpacity(Number(event.target.value));
                  setResult(null);
                }}
              />
              <Slider
                label="Text size"
                valueLabel={`${size} pt`}
                min={12}
                max={120}
                step={4}
                value={size}
                onChange={(event) => {
                  setSize(Number(event.target.value));
                  setResult(null);
                }}
              />
            </div>

            {result ? (
              <ResultPanel
                title="Your watermarked PDF is ready"
                description={`${formatBytes(result.bytes.byteLength)} · ${result.pages} page${result.pages === 1 ? "" : "s"} stamped · the original text stays selectable underneath`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-watermarked.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Watermark another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void apply()} loading={working}>
                  Add watermark
                </Button>
                <Button type="button" variant="ghost" onClick={reset}>
                  Choose another PDF
                </Button>
              </div>
            )}

            {result?.preview ? (
              <figure className="space-y-1.5">
                <figcaption className="text-xs text-fg-subtle">First page of the saved file</figcaption>
                <span className="block max-w-56 overflow-hidden rounded border border-border bg-white">
                  {/* Rendered from the saved bytes in this page, so it cannot be an optimised asset. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.preview} alt="First page of the watermarked PDF" className="block h-auto w-full" />
                </span>
              </figure>
            ) : null}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
