"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

/**
 * Saddle-stitch page order.
 *
 * Sheets are folded together and stapled through the spine, so the outermost
 * sheet carries the last page beside the first. Each sheet holds four pages:
 * two on the front, two on the back.
 */
function bookletOrder(total: number): number[] {
  const order: number[] = [];
  let left = total;
  let right = 1;
  while (right < left) {
    order.push(left, right, right + 1, left - 1);
    right += 2;
    left -= 2;
  }
  return order;
}

export default function PdfBooklet() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; sheets: number; padded: number } | null>(null);

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

  const build = async () => {
    if (!file || !info) return;
    setError(null);
    setWorking(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const source = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const output = await PDFDocument.create();

      const sourcePages = source.getPages();
      const realCount = sourcePages.length;
      // A booklet needs a multiple of four; the shortfall becomes blank pages
      // at the end, which is where a reader expects them.
      const padded = (4 - (realCount % 4)) % 4;
      const total = realCount + padded;

      const first = sourcePages[0].getSize();
      const embedded = await output.embedPages(sourcePages);

      const order = bookletOrder(total);
      const sheetWidth = first.width * 2;
      const sheetHeight = first.height;

      for (let index = 0; index < order.length; index += 2) {
        const page = output.addPage([sheetWidth, sheetHeight]);
        [order[index], order[index + 1]].forEach((pageNumber, half) => {
          if (pageNumber > realCount) return; // a padded blank
          const original = embedded[pageNumber - 1];
          const scale = Math.min(first.width / original.width, sheetHeight / original.height);
          page.drawPage(original, {
            x: half * first.width + (first.width - original.width * scale) / 2,
            y: (sheetHeight - original.height * scale) / 2,
            xScale: scale,
            yScale: scale,
          });
        });
      }

      stampProducer(output);
      setResult({ bytes: await output.save(), sheets: order.length / 2, padded });
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

  const sheetEstimate = info ? Math.ceil(info.pageCount / 4) : 0;

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
                {info.pageCount} page{info.pageCount === 1 ? "" : "s"} → {sheetEstimate} sheet
                {sheetEstimate === 1 ? "" : "s"} of paper
              </span>
            </p>

            <Alert tone="info" title="How to print the result">
              Print double-sided, flipping on the <strong>short edge</strong>. Fold the stack in half and
              staple through the spine; the pages then read in order.
            </Alert>

            {result ? (
              <ResultPanel
                title="Your booklet is ready"
                description={`${formatBytes(result.bytes.byteLength)} · ${result.sheets} sheet${result.sheets === 1 ? "" : "s"}${result.padded > 0 ? ` · ${result.padded} blank page${result.padded === 1 ? "" : "s"} added to reach a multiple of four` : ""}`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-booklet.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Make another booklet"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void build()} loading={working}>
                  Make booklet
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
