"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/field";
import { Alert, DataRow } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone } from "./_shared";

interface Fields {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
  language: string;
  created: string;
  modified: string;
}

interface Loaded {
  fields: Fields;
  hasXmp: boolean;
  pageCount: number;
  version: string;
}

const EMPTY: Fields = {
  title: "",
  author: "",
  subject: "",
  keywords: "",
  creator: "",
  producer: "",
  language: "",
  created: "",
  modified: "",
};

const TEXT_FIELDS: Array<{ key: keyof Fields; label: string; hint?: string }> = [
  { key: "title", label: "Title", hint: "Many viewers show this in the window bar instead of the file name." },
  { key: "author", label: "Author" },
  { key: "subject", label: "Subject" },
  { key: "creator", label: "Creator application" },
  { key: "producer", label: "PDF producer" },
  { key: "language", label: "Language", hint: "A language tag such as en-GB or fr." },
];

const INFO_KEYS: Record<string, string> = {
  title: "Title",
  author: "Author",
  subject: "Subject",
  keywords: "Keywords",
  creator: "Creator",
  producer: "Producer",
  created: "CreationDate",
  modified: "ModDate",
};

/** datetime-local wants "YYYY-MM-DDTHH:mm" in local time. */
function toLocalInput(date: Date | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInput(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function readMetadata(bytes: ArrayBuffer | Uint8Array): Promise<Loaded> {
  const { PDFDocument, PDFHexString, PDFName, PDFString } = await import("pdf-lib");
  // updateMetadata: false, or pdf-lib rewrites the producer and dates while reading.
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const lang = doc.catalog.lookup(PDFName.of("Lang"));
  const header = new TextDecoder("latin1").decode(new Uint8Array(bytes).subarray(0, 16));

  return {
    fields: {
      title: doc.getTitle() ?? "",
      author: doc.getAuthor() ?? "",
      subject: doc.getSubject() ?? "",
      keywords: doc.getKeywords() ?? "",
      creator: doc.getCreator() ?? "",
      producer: doc.getProducer() ?? "",
      language: lang instanceof PDFString || lang instanceof PDFHexString ? lang.decodeText() : "",
      created: toLocalInput(doc.getCreationDate()),
      modified: toLocalInput(doc.getModificationDate()),
    },
    hasXmp: doc.catalog.has(PDFName.of("Metadata")),
    pageCount: doc.getPageCount(),
    version: header.match(/%PDF-(\d\.\d)/)?.[1] ?? "unknown",
  };
}

function describeError(error: unknown, name: string): string {
  const message = error instanceof Error ? error.message : "";
  if (/encrypt/i.test(message)) {
    return `"${name}" is encrypted, which locks its metadata. Remove the password in a PDF reader first.`;
  }
  return `"${name}" could not be read. It may be damaged or not a valid PDF.`;
}

export default function PdfMetadataEditor() {
  const [file, setFile] = React.useState<File | null>(null);
  const [loaded, setLoaded] = React.useState<Loaded | null>(null);
  const [fields, setFields] = React.useState<Fields>(EMPTY);
  const [removeXmp, setRemoveXmp] = React.useState(true);
  const [stampModified, setStampModified] = React.useState(true);
  const [busy, setBusy] = React.useState<"reading" | "saving" | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; readBack: Loaded } | null>(null);

  const update = (key: keyof Fields, value: string) => {
    setFields((previous) => ({ ...previous, [key]: value }));
    setResult(null);
  };

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setResult(null);
    setBusy("reading");
    try {
      const metadata = await readMetadata(await chosen.arrayBuffer());
      setFile(chosen);
      setLoaded(metadata);
      setFields(metadata.fields);
    } catch (caught) {
      setError(describeError(caught, chosen.name));
    } finally {
      setBusy(null);
    }
  };

  const save = async () => {
    if (!file) return;
    setError(null);
    setBusy("saving");
    try {
      const { PDFDict, PDFDocument, PDFName } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });

      const text = (value: string) => value.trim();
      const setters: Record<string, (value: string) => void> = {
        title: (value) => doc.setTitle(value),
        author: (value) => doc.setAuthor(value),
        subject: (value) => doc.setSubject(value),
        // One element, so pdf-lib keeps the separators exactly as typed.
        keywords: (value) => doc.setKeywords([value]),
        creator: (value) => doc.setCreator(value),
        producer: (value) => doc.setProducer(value),
      };

      const clear: string[] = [];
      for (const [key, setter] of Object.entries(setters)) {
        const value = text(fields[key as keyof Fields]);
        if (value) setter(value);
        else clear.push(INFO_KEYS[key]);
      }

      const created = fromLocalInput(fields.created);
      if (created) doc.setCreationDate(created);
      else clear.push("CreationDate");

      const modified = stampModified ? new Date() : fromLocalInput(fields.modified);
      if (modified) doc.setModificationDate(modified);
      else clear.push("ModDate");

      if (text(fields.language)) doc.setLanguage(text(fields.language));
      else doc.catalog.delete(PDFName.of("Lang"));

      // Empty fields are removed from the file rather than stored as blanks.
      const info = doc.context.lookup(doc.context.trailerInfo.Info);
      if (info instanceof PDFDict) {
        for (const key of clear) info.delete(PDFName.of(key));
      }

      if (removeXmp) doc.catalog.delete(PDFName.of("Metadata"));

      const bytes = await doc.save();
      setResult({ bytes, readBack: await readMetadata(bytes) });
    } catch (caught) {
      setError(describeError(caught, file.name));
    } finally {
      setBusy(null);
    }
  };

  const reset = () => {
    setFile(null);
    setLoaded(null);
    setFields(EMPTY);
    setResult(null);
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}
        {busy === "reading" ? <ProgressIndicator label="Reading the document properties…" /> : null}
        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {file && loaded ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">
                PDF {loaded.version} · {loaded.pageCount} page{loaded.pageCount === 1 ? "" : "s"}
                {loaded.hasXmp ? " · has an XMP metadata stream" : ""}
              </span>
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {TEXT_FIELDS.map((field) => (
                <Field key={field.key} label={field.label} htmlFor={`meta-${field.key}`} hint={field.hint}>
                  <Input
                    id={`meta-${field.key}`}
                    value={fields[field.key]}
                    onChange={(event) => update(field.key, event.target.value)}
                  />
                </Field>
              ))}
              <Field label="Keywords" htmlFor="meta-keywords" hint="Separate with commas." className="sm:col-span-2">
                <Textarea
                  id="meta-keywords"
                  rows={2}
                  value={fields.keywords}
                  onChange={(event) => update("keywords", event.target.value)}
                  className="min-h-0"
                />
              </Field>
              <Field label="Created" htmlFor="meta-created">
                <Input
                  id="meta-created"
                  type="datetime-local"
                  value={fields.created}
                  onChange={(event) => update("created", event.target.value)}
                />
              </Field>
              <Field label="Last modified" htmlFor="meta-modified">
                <Input
                  id="meta-modified"
                  type="datetime-local"
                  value={fields.modified}
                  disabled={stampModified}
                  onChange={(event) => update("modified", event.target.value)}
                />
              </Field>
            </div>

            <div className="space-y-2.5">
              <Checkbox
                label="Set “last modified” to the time you save"
                checked={stampModified}
                onChange={(event) => {
                  setStampModified(event.target.checked);
                  setResult(null);
                }}
              />
              <Checkbox
                label="Remove the XMP metadata stream"
                description={
                  loaded.hasXmp
                    ? "This file has one. Some readers prefer it, so an old copy could contradict the fields above."
                    : "This file does not have one."
                }
                checked={removeXmp}
                onChange={(event) => {
                  setRemoveXmp(event.target.checked);
                  setResult(null);
                }}
              />
            </div>

            {result ? (
              <ResultPanel
                title="Your PDF has been saved"
                description={`${formatBytes(result.bytes.byteLength)} · properties below were read back from the saved file`}
                actions={
                  <Button
                    type="button"
                    onClick={() => downloadBytes(result.bytes, `${stripExtension(file.name)}.pdf`, "application/pdf")}
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Edit another PDF"
              >
                <dl className="rounded-md border border-border bg-surface px-3">
                  {(Object.keys(EMPTY) as Array<keyof Fields>).map((key) => (
                    <DataRow
                      key={key}
                      label={key === "created" ? "Created" : key === "modified" ? "Last modified" : key[0].toUpperCase() + key.slice(1)}
                      value={result.readBack.fields[key] ? result.readBack.fields[key].replace("T", " ") : "— (not set)"}
                    />
                  ))}
                  <DataRow label="XMP stream" value={result.readBack.hasXmp ? "present" : "none"} />
                </dl>
              </ResultPanel>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void save()} loading={busy === "saving"}>
                  Save PDF
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setFields(EMPTY);
                    setStampModified(false);
                    setRemoveXmp(true);
                    setResult(null);
                  }}
                >
                  Clear all
                </Button>
                <Button type="button" variant="ghost" onClick={reset}>
                  Choose another PDF
                </Button>
              </div>
            )}

            <Alert tone="info">
              Only the document properties change. Comments, form data, bookmarks and the text on the pages are left
              exactly as they are.
            </Alert>
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
