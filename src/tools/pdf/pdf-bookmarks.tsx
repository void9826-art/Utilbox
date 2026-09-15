"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { closePdf, openPdf } from "@/lib/pdf";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

interface Bookmark {
  id: string;
  title: string;
  page: number;
}

let sequence = 0;
const nextId = () => {
  sequence += 1;
  return `bookmark-${sequence}`;
};

export default function PdfBookmarks() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);
  const [existing, setExisting] = React.useState(0);
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

    const doc = await openPdf(chosen, chosen.name).catch((caught: unknown) => {
      setError(pdfErrorMessage(caught, chosen.name));
      return null;
    });
    if (!doc) {
      setLoading(false);
      return;
    }

    try {
      const outline = await doc.getOutline();
      const found: Bookmark[] = [];

      for (const item of outline ?? []) {
        let page = 1;
        try {
          // A destination is either a named string or an explicit array; both
          // resolve to a page reference the document turns into an index.
          const destination =
            typeof item.dest === "string" ? await doc.getDestination(item.dest) : item.dest;
          if (Array.isArray(destination) && destination[0]) {
            page =
              (await doc.getPageIndex(destination[0] as Parameters<typeof doc.getPageIndex>[0])) + 1;
          }
        } catch {
          page = 1;
        }
        found.push({ id: nextId(), title: item.title, page });
      }

      setFile(chosen);
      setPageCount(doc.numPages);
      setExisting(found.length);
      setBookmarks(found.length > 0 ? found : [{ id: nextId(), title: "", page: 1 }]);
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      await closePdf(doc);
      setLoading(false);
    }
  };

  const update = (id: string, patch: Partial<Bookmark>) => {
    setBookmarks((previous) => previous.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
    setResult(null);
  };

  const save = async () => {
    if (!file) return;
    const entries = bookmarks.filter((entry) => entry.title.trim().length > 0);
    if (entries.length === 0) {
      setError("Give at least one bookmark a title.");
      return;
    }

    setError(null);
    setWorking(true);

    try {
      const { PDFDocument, PDFHexString, PDFName, PDFNumber } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const context = doc.context;
      const pages = doc.getPages();

      // Outline entries form a doubly linked list under one parent, so the
      // references are reserved first and filled in once neighbours are known.
      const outlinesRef = context.nextRef();
      const itemRefs = entries.map(() => context.nextRef());

      entries.forEach((entry, index) => {
        const target = pages[Math.min(Math.max(entry.page, 1), pages.length) - 1];
        const dictionary = context.obj({
          Title: PDFHexString.fromText(entry.title.trim()),
          Parent: outlinesRef,
          Dest: context.obj([target.ref, PDFName.of("Fit")]),
          ...(index > 0 ? { Prev: itemRefs[index - 1] } : {}),
          ...(index < entries.length - 1 ? { Next: itemRefs[index + 1] } : {}),
        });
        context.assign(itemRefs[index], dictionary);
      });

      context.assign(
        outlinesRef,
        context.obj({
          Type: PDFName.of("Outlines"),
          First: itemRefs[0],
          Last: itemRefs[itemRefs.length - 1],
          Count: PDFNumber.of(entries.length),
        }),
      );
      doc.catalog.set(PDFName.of("Outlines"), outlinesRef);

      stampProducer(doc);
      setResult({ bytes: await doc.save() });
    } catch (caught) {
      setError(pdfErrorMessage(caught, file.name));
    } finally {
      setWorking(false);
    }
  };

  const reset = () => {
    setFile(null);
    setBookmarks([]);
    setResult(null);
    setExisting(0);
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        {loading ? <ProgressIndicator label="Reading the existing outline…" /> : null}

        {file ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">
                {pageCount} page{pageCount === 1 ? "" : "s"} ·{" "}
                {existing > 0
                  ? `${existing} existing bookmark${existing === 1 ? "" : "s"}`
                  : "no bookmarks yet"}
              </span>
            </p>

            <ul className="space-y-3">
              {bookmarks.map((entry, index) => (
                <li
                  key={entry.id}
                  className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface p-3"
                >
                  <Field
                    label={`Bookmark ${index + 1}`}
                    htmlFor={`${entry.id}-title`}
                    className="min-w-48 flex-1"
                  >
                    <Input
                      id={`${entry.id}-title`}
                      value={entry.title}
                      placeholder="e.g. Chapter 2 — Methods"
                      onChange={(event) => update(entry.id, { title: event.target.value })}
                    />
                  </Field>
                  <Field label="Goes to" htmlFor={`${entry.id}-page`} className="w-32">
                    <Select
                      id={`${entry.id}-page`}
                      value={String(entry.page)}
                      onChange={(event) => update(entry.id, { page: Number(event.target.value) })}
                    >
                      {Array.from({ length: pageCount }, (_, position) => position + 1).map((pageNumber) => (
                        <option key={pageNumber} value={pageNumber}>
                          Page {pageNumber}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Remove bookmark ${index + 1}`}
                    disabled={bookmarks.length === 1}
                    onClick={() => {
                      setBookmarks((previous) => previous.filter((item) => item.id !== entry.id));
                      setResult(null);
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setBookmarks((previous) => [
                  ...previous,
                  { id: nextId(), title: "", page: Math.min(previous.length + 1, pageCount) },
                ]);
                setResult(null);
              }}
            >
              <Plus className="size-4" aria-hidden="true" />
              Add bookmark
            </Button>

            {existing > 0 ? (
              <p className="text-xs text-fg-subtle">
                Saving replaces the existing outline with the list above.
              </p>
            ) : null}

            {result ? (
              <ResultPanel
                title="Your PDF now has bookmarks"
                description={`${formatBytes(result.bytes.byteLength)} · open the sidebar in any PDF reader to use them`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-bookmarked.pdf`,
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
                <Button type="button" onClick={() => void save()} loading={working}>
                  Save bookmarks
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
