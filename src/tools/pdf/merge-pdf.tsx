"use client";

import * as React from "react";

import { FileList, type FileListItem } from "@/components/tool/file-list";
import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { downloadBytes } from "@/lib/download";
import { closePdf, openPdf } from "@/lib/pdf";
import { formatBytes, yieldToBrowser } from "@/lib/utils";
import { stampProducer } from "@/lib/pdf-meta";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

interface Entry {
  id: string;
  file: File;
  pageCount: number;
}

let sequence = 0;

export default function MergePdf() {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; pages: number } | null>(null);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [reading, setReading] = React.useState(false);

  const addFiles = async (files: File[]) => {
    setError(null);
    setResult(null);
    setReading(true);

    const added: Entry[] = [];

    for (const file of files) {
      try {
        // Opened once up front so the page count can be shown before merging.
        const doc = await openPdf(file, file.name);
        sequence += 1;
        added.push({ id: `pdf-${sequence}`, file, pageCount: doc.numPages });
        await closePdf(doc);
      } catch (caught) {
        setError(pdfErrorMessage(caught, file.name));
      }
    }

    if (added.length > 0) setEntries((previous) => [...previous, ...added]);
    setReading(false);
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

  const merge = async () => {
    if (entries.length < 2) {
      setError("Add at least two PDFs to merge.");
      return;
    }

    setError(null);
    setResult(null);
    setProgress({ done: 0, total: entries.length });

    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      stampProducer(merged);

      for (const [index, entry] of entries.entries()) {
        try {
          const source = await PDFDocument.load(await entry.file.arrayBuffer(), {
            ignoreEncryption: false,
          });
          // Pages are copied with their fonts and images intact — nothing is
          // re-rendered, so quality and selectable text are preserved.
          const pages = await merged.copyPages(source, source.getPageIndices());
          for (const page of pages) merged.addPage(page);
        } catch (caught) {
          throw new Error(pdfErrorMessage(caught, entry.file.name));
        }

        setProgress({ done: index + 1, total: entries.length });
        await yieldToBrowser();
      }

      setResult({ bytes: await merged.save(), pages: merged.getPageCount() });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The PDFs could not be merged.");
    } finally {
      setProgress(null);
    }
  };

  const items: FileListItem[] = entries.map((entry) => ({
    id: entry.id,
    file: entry.file,
    meta: `${entry.pageCount} page${entry.pageCount === 1 ? "" : "s"}`,
  }));

  const totalPages = entries.reduce((sum, entry) => sum + entry.pageCount, 0);

  return (
    <ToolFrame>
      <div className="space-y-5">
        {entries.length === 0 ? (
          <PdfDropzone multiple onFiles={(files) => void addFiles(files)} onError={setError} />
        ) : (
          <>
            <FileList
              items={items}
              onRemove={(id) => {
                setEntries((previous) => previous.filter((entry) => entry.id !== id));
                setResult(null);
              }}
              onMove={move}
              summary={`${entries.length} PDF${entries.length === 1 ? "" : "s"} · ${totalPages} pages, merged in this order`}
              disabled={progress !== null}
            />
            <PdfDropzone
              multiple
              compact
              onFiles={(files) => void addFiles(files)}
              onError={setError}
              label="Add more PDFs"
            />
          </>
        )}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {reading ? <ProgressIndicator label="Reading your files…" /> : null}

        {progress ? (
          <ProgressIndicator
            value={(progress.done / Math.max(1, progress.total)) * 100}
            label={`Merging file ${progress.done} of ${progress.total}…`}
          />
        ) : null}

        {result ? (
          <ResultPanel
            title="Your merged PDF is ready"
            description={`${result.pages} pages · ${formatBytes(result.bytes.byteLength)}`}
            actions={
              <Button
                type="button"
                onClick={() => downloadBytes(result.bytes, "merged.pdf", "application/pdf")}
              >
                Download PDF
              </Button>
            }
            onReset={() => {
              setEntries([]);
              setResult(null);
              setError(null);
            }}
            resetLabel="Merge another set"
          />
        ) : entries.length > 0 ? (
          <Button
            type="button"
            onClick={merge}
            loading={progress !== null}
            disabled={entries.length < 2 || reading}
          >
            {entries.length < 2 ? "Add another PDF to merge" : `Merge ${entries.length} PDFs`}
          </Button>
        ) : null}
      </div>
    </ToolFrame>
  );
}
