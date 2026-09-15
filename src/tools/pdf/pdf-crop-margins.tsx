"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Slider } from "@/components/ui/field";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { parsePageRanges } from "@/lib/pdf";
import { describeSize } from "@/lib/pdf-geometry";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

const MM_PER_POINT = 25.4 / 72;

export default function PdfCropMargins() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [uniform, setUniform] = React.useState(true);
  const [top, setTop] = React.useState(10);
  const [right, setRight] = React.useState(10);
  const [bottom, setBottom] = React.useState(10);
  const [left, setLeft] = React.useState(10);
  const [range, setRange] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; pages: number; size: string } | null>(null);

  const setAll = (value: number) => {
    setTop(value);
    setRight(value);
    setBottom(value);
    setLeft(value);
    setResult(null);
  };

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const loaded = await readPdfInfo(chosen, { maxThumbnails: 1, thumbnailScale: 0.8 });
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

    // A blank box means every page. The parser reports blank input as an error,
    // which is right where a range is required and wrong here, so it is only
    // consulted when something was actually typed.
    const everyPage = Array.from({ length: info.pageCount }, (_, index) => index + 1);
    const parsed = range.trim() ? parsePageRanges(range, info.pageCount) : { pages: everyPage, error: null };
    if (parsed.error) {
      setError(parsed.error);
      return;
    }
    const targets = new Set(parsed.pages);

    setError(null);
    setWorking(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });

      let tooSmall = false;
      let describedSize = "";

      doc.getPages().forEach((page, index) => {
        if (!targets.has(index + 1)) return;
        const box = page.getMediaBox();
        const cropLeft = left / MM_PER_POINT;
        const cropRight = right / MM_PER_POINT;
        const cropTop = top / MM_PER_POINT;
        const cropBottom = bottom / MM_PER_POINT;
        const width = box.width - cropLeft - cropRight;
        const height = box.height - cropTop - cropBottom;

        if (width <= 1 || height <= 1) {
          tooSmall = true;
          return;
        }

        // Cropping sets the visible window rather than deleting content, which
        // is how every PDF reader and printer expects a crop to be expressed.
        page.setCropBox(box.x + cropLeft, box.y + cropBottom, width, height);
        if (!describedSize) describedSize = describeSize(width, height);
      });

      if (tooSmall) {
        setError("Those margins are larger than the page. Reduce them and try again.");
        setWorking(false);
        return;
      }

      stampProducer(doc);
      setResult({ bytes: await doc.save(), pages: targets.size, size: describedSize });
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

  const firstSize = info?.sizes[0];
  const overlay = firstSize
    ? {
        top: `${(top / MM_PER_POINT / firstSize.height) * 100}%`,
        right: `${(right / MM_PER_POINT / firstSize.width) * 100}%`,
        bottom: `${(bottom / MM_PER_POINT / firstSize.height) * 100}%`,
        left: `${(left / MM_PER_POINT / firstSize.width) * 100}%`,
      }
    : null;

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
                {firstSize ? ` · ${describeSize(firstSize.width, firstSize.height)}` : ""}
              </span>
            </p>

            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
              <div className="space-y-4">
                <Checkbox
                  label="Same margin on every side"
                  checked={uniform}
                  onChange={(event) => {
                    setUniform(event.target.checked);
                    if (event.target.checked) setAll(top);
                  }}
                />

                {uniform ? (
                  <Slider
                    label="Margin to remove"
                    valueLabel={`${top} mm`}
                    min={0}
                    max={50}
                    step={1}
                    value={top}
                    onChange={(event) => setAll(Number(event.target.value))}
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Slider
                      label="Top"
                      valueLabel={`${top} mm`}
                      min={0}
                      max={50}
                      value={top}
                      onChange={(event) => {
                        setTop(Number(event.target.value));
                        setResult(null);
                      }}
                    />
                    <Slider
                      label="Bottom"
                      valueLabel={`${bottom} mm`}
                      min={0}
                      max={50}
                      value={bottom}
                      onChange={(event) => {
                        setBottom(Number(event.target.value));
                        setResult(null);
                      }}
                    />
                    <Slider
                      label="Left"
                      valueLabel={`${left} mm`}
                      min={0}
                      max={50}
                      value={left}
                      onChange={(event) => {
                        setLeft(Number(event.target.value));
                        setResult(null);
                      }}
                    />
                    <Slider
                      label="Right"
                      valueLabel={`${right} mm`}
                      min={0}
                      max={50}
                      value={right}
                      onChange={(event) => {
                        setRight(Number(event.target.value));
                        setResult(null);
                      }}
                    />
                  </div>
                )}

                <Field label="Pages" htmlFor="crop-range" hint="Leave blank for every page, or use 1-3, 7">
                  <Input
                    id="crop-range"
                    value={range}
                    placeholder="all pages"
                    onChange={(event) => {
                      setRange(event.target.value);
                      setResult(null);
                    }}
                  />
                </Field>
              </div>

              {info.thumbnails[0] ? (
                <figure className="space-y-1.5">
                  <figcaption className="text-xs text-fg-subtle">
                    The dashed outline is what will be kept.
                  </figcaption>
                  <span className="relative block overflow-hidden rounded border border-border bg-white">
                    {/* A data URL rendered in this page; next/image cannot optimise it. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={info.thumbnails[0]} alt="First page of the PDF" className="block h-auto w-full" />
                    {overlay ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute border-2 border-dashed border-accent"
                        style={overlay}
                      />
                    ) : null}
                  </span>
                </figure>
              ) : null}
            </div>

            {result ? (
              <ResultPanel
                title="Your cropped PDF is ready"
                description={`${formatBytes(result.bytes.byteLength)} · ${result.pages} page${result.pages === 1 ? "" : "s"} cropped${result.size ? ` to ${result.size}` : ""}`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-cropped.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Crop another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void apply()} loading={working}>
                  Crop margins
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
