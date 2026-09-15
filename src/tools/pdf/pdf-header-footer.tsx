"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Segmented, Slider } from "@/components/ui/field";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

type Align = "left" | "center" | "right";

const MM_PER_POINT = 25.4 / 72;

/** Fills {page}, {total} and {date} so one line of text works on every page. */
function expand(template: string, page: number, total: number): string {
  return template
    .replace(/\{page\}/gi, String(page))
    .replace(/\{total\}/gi, String(total))
    .replace(/\{date\}/gi, new Date().toLocaleDateString());
}

export default function PdfHeaderFooter() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [header, setHeader] = React.useState("");
  const [footer, setFooter] = React.useState("Page {page} of {total}");
  const [align, setAlign] = React.useState<Align>("center");
  const [size, setSize] = React.useState(10);
  const [margin, setMargin] = React.useState(12);
  const [skipFirst, setSkipFirst] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; preview: string } | null>(null);

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
    if (!header.trim() && !footer.trim()) {
      setError("Enter a header, a footer, or both.");
      return;
    }

    setError(null);
    setWorking(true);

    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const marginPt = margin / MM_PER_POINT;
      const pages = doc.getPages();

      pages.forEach((page, index) => {
        if (skipFirst && index === 0) return;
        const { width, height } = page.getSize();

        const place = (template: string, y: number) => {
          const text = expand(template, index + 1, pages.length);
          if (!text.trim()) return;
          const textWidth = font.widthOfTextAtSize(text, size);
          const x =
            align === "left"
              ? marginPt
              : align === "right"
                ? width - marginPt - textWidth
                : (width - textWidth) / 2;
          page.drawText(text, { x, y, size, font, color: rgb(0.25, 0.25, 0.25) });
        };

        place(header, height - marginPt - size);
        place(footer, marginPt);
      });

      stampProducer(doc);
      const bytes = await doc.save();

      const check = await readPdfInfo(
        new File([bytes as BlobPart], file.name, { type: "application/pdf" }),
        { maxThumbnails: 1, thumbnailScale: 0.6 },
      );

      setResult({ bytes, preview: check.thumbnails[0] ?? "" });
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
              <Field label="Header text" htmlFor="hf-header" hint="Leave blank for no header">
                <Input
                  id="hf-header"
                  value={header}
                  placeholder="e.g. Quarterly report"
                  onChange={(event) => {
                    setHeader(event.target.value);
                    setResult(null);
                  }}
                />
              </Field>
              <Field
                label="Footer text"
                htmlFor="hf-footer"
                hint="{page}, {total} and {date} are filled in for you"
              >
                <Input
                  id="hf-footer"
                  value={footer}
                  onChange={(event) => {
                    setFooter(event.target.value);
                    setResult(null);
                  }}
                />
              </Field>
            </div>

            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Alignment</span>
              <Segmented
                name="hf-align"
                ariaLabel="Text alignment"
                value={align}
                onChange={(value) => {
                  setAlign(value);
                  setResult(null);
                }}
                options={[
                  { value: "left", label: "Left" },
                  { value: "center", label: "Centre" },
                  { value: "right", label: "Right" },
                ]}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Slider
                label="Text size"
                valueLabel={`${size} pt`}
                min={7}
                max={18}
                value={size}
                onChange={(event) => {
                  setSize(Number(event.target.value));
                  setResult(null);
                }}
              />
              <Slider
                label="Distance from the edge"
                valueLabel={`${margin} mm`}
                min={5}
                max={30}
                value={margin}
                onChange={(event) => {
                  setMargin(Number(event.target.value));
                  setResult(null);
                }}
              />
            </div>

            <Checkbox
              label="Skip the first page"
              description="Useful when the document opens with a cover or title page."
              checked={skipFirst}
              onChange={(event) => {
                setSkipFirst(event.target.checked);
                setResult(null);
              }}
            />

            {result ? (
              <ResultPanel
                title="Your PDF is ready"
                description={`${formatBytes(result.bytes.byteLength)} · added as real text, so it stays selectable and searchable`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-headed.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Do another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void apply()} loading={working}>
                  Add header and footer
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
                  {/* Rendered from the saved bytes in this page. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.preview} alt="First page of the saved PDF" className="block h-auto w-full" />
                </span>
              </figure>
            ) : null}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
