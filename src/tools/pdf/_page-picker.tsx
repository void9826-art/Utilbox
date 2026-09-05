"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { withExtension } from "@/lib/files";
import { parsePageRanges, summarisePages } from "@/lib/pdf";
import { formatBytes } from "@/lib/utils";

import { PageGrid, PageTile, PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

export interface PagePickerProps {
  /** "keep" builds a document from the selection; "remove" builds from the rest. */
  mode: "keep" | "remove";
  actionLabel: string;
  rangeLabel: string;
  rangeHint: string;
  outputSuffix: string;
  /** Offers splitting the selection into one file per page. */
  allowSeparateFiles?: boolean;
  note?: React.ReactNode;
}

/**
 * Shared implementation behind "Extract PDF Pages" and "Delete PDF Pages" —
 * the same selection UI, differing only in which side of the selection is kept.
 */
export function PagePicker({
  mode,
  actionLabel,
  rangeLabel,
  rangeHint,
  outputSuffix,
  allowSeparateFiles = false,
  note,
}: PagePickerProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());
  const [rangeText, setRangeText] = React.useState("");
  const [rangeError, setRangeError] = React.useState<string | null>(null);
  const [separateFiles, setSeparateFiles] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<
    { kind: "single"; bytes: Uint8Array; pages: number } | { kind: "zip"; count: number } | null
  >(null);

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
      setSelected(new Set());
      setRangeText("");
      setRangeError(null);
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      setLoading(false);
    }
  };

  const toggle = (page: number) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
    setRangeText("");
    setRangeError(null);
    setResult(null);
  };

  const applyRange = (text: string) => {
    setRangeText(text);
    setResult(null);

    if (!text.trim()) {
      setRangeError(null);
      return;
    }
    if (!info) return;

    const parsed = parsePageRanges(text, info.pageCount);
    setRangeError(parsed.error);
    if (!parsed.error) setSelected(new Set(parsed.pages));
  };

  // Selection order matters for extraction, so a typed range wins over the
  // set's natural ordering when one was supplied.
  const orderedSelection = React.useMemo(() => {
    if (!info) return [];
    if (rangeText.trim() && !rangeError) {
      return parsePageRanges(rangeText, info.pageCount).pages;
    }
    return [...selected].sort((a, b) => a - b);
  }, [info, rangeError, rangeText, selected]);

  const resultingPages = React.useMemo(() => {
    if (!info) return [];
    if (mode === "keep") return orderedSelection;
    return Array.from({ length: info.pageCount }, (_, index) => index + 1).filter(
      (page) => !selected.has(page),
    );
  }, [info, mode, orderedSelection, selected]);

  const run = async () => {
    if (!file || !info) return;

    if (resultingPages.length === 0) {
      setError(
        mode === "keep"
          ? "Select at least one page to extract."
          : "A PDF must keep at least one page. Deselect a page and try again.",
      );
      return;
    }

    setError(null);
    setWorking(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const source = await PDFDocument.load(await file.arrayBuffer());

      if (separateFiles && allowSeparateFiles) {
        const { downloadZip } = await import("@/lib/download");
        const files: Array<{ name: string; data: Uint8Array }> = [];

        for (const pageNumber of resultingPages) {
          const output = await PDFDocument.create();
          const [page] = await output.copyPages(source, [pageNumber - 1]);
          output.addPage(page);
          files.push({
            name: `${withExtension(file.name, "").slice(0, -1)}-page-${pageNumber}.pdf`,
            data: await output.save(),
          });
        }

        await downloadZip(files, `${withExtension(file.name, "").slice(0, -1)}-pages.zip`);
        setResult({ kind: "zip", count: files.length });
      } else {
        const output = await PDFDocument.create();
        output.setCreator("Utilbox");
        output.setProducer("Utilbox");

        const pages = await output.copyPages(
          source,
          resultingPages.map((page) => page - 1),
        );
        for (const page of pages) output.addPage(page);

        setResult({
          kind: "single",
          bytes: await output.save(),
          pages: output.getPageCount(),
        });
      }
    } catch (caught) {
      setError(pdfErrorMessage(caught, file.name));
    } finally {
      setWorking(false);
    }
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <PdfDropzone onFiles={(files) => void load(files)} onError={setError} />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {loading ? <ProgressIndicator label="Reading the document…" /> : null}

        {file && info ? (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-fg">
                {file.name}
                <span className="ml-2 font-normal text-fg-muted">
                  {info.pageCount} page{info.pageCount === 1 ? "" : "s"} ·{" "}
                  {formatBytes(file.size)}
                </span>
              </p>
              <div className="flex gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelected(new Set(Array.from({ length: info.pageCount }, (_, i) => i + 1)));
                    setRangeText("");
                    setResult(null);
                  }}
                >
                  Select all
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelected(new Set());
                    setRangeText("");
                    setResult(null);
                  }}
                >
                  Select none
                </Button>
              </div>
            </div>

            <Field
              label={rangeLabel}
              htmlFor="page-range"
              hint={rangeHint}
              error={rangeError}
              className="sm:max-w-md"
            >
              <Input
                id="page-range"
                value={rangeText}
                placeholder="1-3, 5, 8-10"
                onChange={(event) => applyRange(event.target.value)}
                className="tabular font-mono"
              />
            </Field>

            <PageGrid>
              {Array.from({ length: info.pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <PageTile
                  key={pageNumber}
                  pageNumber={pageNumber}
                  thumbnail={info.thumbnails[pageNumber - 1]}
                  selected={selected.has(pageNumber)}
                  onToggle={() => toggle(pageNumber)}
                  disabled={working}
                  selectedLabel={mode === "keep" ? "will be kept" : "will be removed"}
                />
              ))}
            </PageGrid>

            {info.pageCount > info.thumbnails.length ? (
              <p className="text-xs text-fg-subtle">
                Previews are shown for the first {info.thumbnails.length} pages. Pages beyond that can
                still be selected using the range box.
              </p>
            ) : null}

            <div className="rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm">
              <p className="text-fg">
                {mode === "keep" ? (
                  <>
                    <strong className="font-semibold">
                      {orderedSelection.length} page{orderedSelection.length === 1 ? "" : "s"}
                    </strong>{" "}
                    will be extracted
                    {orderedSelection.length > 0 ? `: ${summarisePages(orderedSelection)}` : ""}
                  </>
                ) : (
                  <>
                    <strong className="font-semibold">
                      {selected.size} page{selected.size === 1 ? "" : "s"}
                    </strong>{" "}
                    will be removed, leaving{" "}
                    <strong className="font-semibold">
                      {resultingPages.length} page{resultingPages.length === 1 ? "" : "s"}
                    </strong>
                    {resultingPages.length > 0 ? ` (${summarisePages(resultingPages)})` : ""}
                  </>
                )}
              </p>
            </div>

            {allowSeparateFiles && orderedSelection.length > 1 ? (
              <label className="flex items-center gap-2.5 text-sm text-fg">
                <input
                  type="checkbox"
                  checked={separateFiles}
                  onChange={(event) => setSeparateFiles(event.target.checked)}
                  className="size-4 cursor-pointer rounded border-border-strong accent-[var(--accent)]"
                />
                Save each page as its own PDF, delivered in a ZIP
              </label>
            ) : null}

            {note}

            {result ? (
              <ResultPanel
                title={
                  result.kind === "zip"
                    ? `${result.count} PDFs are ready`
                    : "Your PDF is ready"
                }
                description={
                  result.kind === "single"
                    ? `${result.pages} page${result.pages === 1 ? "" : "s"} · ${formatBytes(result.bytes.byteLength)}`
                    : "The ZIP has been downloaded."
                }
                actions={
                  result.kind === "single" ? (
                    <Button
                      type="button"
                      onClick={() =>
                        downloadBytes(
                          result.bytes,
                          withExtension(file.name, "").slice(0, -1) + outputSuffix,
                          "application/pdf",
                        )
                      }
                    >
                      Download PDF
                    </Button>
                  ) : null
                }
                onReset={() => {
                  setFile(null);
                  setInfo(null);
                  setResult(null);
                  setSelected(new Set());
                }}
                resetLabel="Choose another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={run}
                  loading={working}
                  disabled={resultingPages.length === 0}
                >
                  {actionLabel}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setInfo(null);
                    setSelected(new Set());
                    setResult(null);
                  }}
                >
                  Choose another PDF
                </Button>
              </div>
            )}
          </>
        ) : null}

        {file && info && mode === "remove" && selected.size === info.pageCount ? (
          <Alert tone="warning" title="Every page is selected">
            A PDF has to contain at least one page. Deselect the pages you want to keep.
          </Alert>
        ) : null}
      </div>
    </ToolFrame>
  );
}
