"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

export default function PdfReorderPages() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  /** Original page numbers, in the order they will be written out. */
  const [order, setOrder] = React.useState<number[]>([]);
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
      setOrder(Array.from({ length: loaded.pageCount }, (_, index) => index + 1));
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      setLoading(false);
    }
  };

  const move = (position: number, delta: number) => {
    setOrder((previous) => {
      const target = position + delta;
      if (target < 0 || target >= previous.length) return previous;
      const next = [...previous];
      [next[position], next[target]] = [next[target], next[position]];
      return next;
    });
    setResult(null);
  };

  const save = async () => {
    if (!file || !info) return;
    setError(null);
    setWorking(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const source = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const output = await PDFDocument.create();

      // Pages are copied rather than rebuilt, so annotations, links and the
      // page size travel with each one.
      const copied = await output.copyPages(
        source,
        order.map((pageNumber) => pageNumber - 1),
      );
      copied.forEach((page) => output.addPage(page));

      stampProducer(output);
      setResult({ bytes: await output.save() });
    } catch (caught) {
      setError(pdfErrorMessage(caught, file.name));
    } finally {
      setWorking(false);
    }
  };

  const reset = () => {
    setFile(null);
    setInfo(null);
    setOrder([]);
    setResult(null);
  };

  const unchanged = order.every((pageNumber, index) => pageNumber === index + 1);

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
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setOrder((previous) => [...previous].reverse());
                    setResult(null);
                  }}
                >
                  Reverse order
                </Button>
                {!unchanged ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOrder(Array.from({ length: info.pageCount }, (_, index) => index + 1));
                      setResult(null);
                    }}
                  >
                    Reset
                  </Button>
                ) : null}
              </div>
            </div>

            <p className="text-xs text-fg-subtle">
              Each tile shows its position in the new document, with the original page number underneath.
              Use the arrows to move a page.
            </p>

            <ul className="scrollbar-slim grid max-h-[30rem] grid-cols-2 gap-2 overflow-y-auto rounded-lg border border-border bg-bg-muted p-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {order.map((pageNumber, position) => (
                <li
                  key={`${pageNumber}-${position}`}
                  className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-1.5"
                >
                  <span className="relative block overflow-hidden rounded border border-border bg-white">
                    {info.thumbnails[pageNumber - 1] ? (
                      // A data URL rendered in this page; next/image cannot optimise it.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={info.thumbnails[pageNumber - 1]} alt="" className="block h-auto w-full" />
                    ) : (
                      <span className="flex aspect-[1/1.414] items-center justify-center text-xs text-neutral-400">
                        {pageNumber}
                      </span>
                    )}
                    <span className="absolute top-1 left-1 rounded bg-fg/80 px-1.5 py-0.5 text-[0.625rem] font-medium text-bg">
                      {position + 1}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Move page ${pageNumber} earlier`}
                      disabled={position === 0 || working}
                      onClick={() => move(position, -1)}
                    >
                      <ChevronLeft className="size-4" aria-hidden="true" />
                    </Button>
                    <span className="tabular text-xs text-fg-muted">was {pageNumber}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Move page ${pageNumber} later`}
                      disabled={position === order.length - 1 || working}
                      onClick={() => move(position, 1)}
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>

            {result ? (
              <ResultPanel
                title="Your reordered PDF is ready"
                description={`${formatBytes(result.bytes.byteLength)} · ${order.length} pages in the new order`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-reordered.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Reorder another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void save()} loading={working} disabled={unchanged}>
                  Save new order
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
