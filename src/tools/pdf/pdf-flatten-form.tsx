"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Alert, DataRow } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

interface FormSummary {
  fields: Array<{ name: string; type: string }>;
}

export default function PdfFlattenForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [summary, setSummary] = React.useState<FormSummary | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array } | null>(null);

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setResult(null);
    setSummary(null);
    setLoading(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await chosen.arrayBuffer(), { updateMetadata: false });
      const form = doc.getForm();
      const fields = form.getFields().map((field) => ({
        name: field.getName(),
        type: field.constructor.name.replace(/^PDF/, "").replace(/Field$/, ""),
      }));
      setFile(chosen);
      setSummary({ fields });
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      setLoading(false);
    }
  };

  const flatten = async () => {
    if (!file) return;
    setError(null);
    setWorking(true);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      const form = doc.getForm();
      // Flattening paints each field's current appearance onto the page and
      // removes the interactive widget, so the values can no longer be edited.
      form.flatten();
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
    setSummary(null);
    setResult(null);
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        {loading ? <ProgressIndicator label="Looking for form fields…" /> : null}

        {file && summary ? (
          <>
            <p className="text-sm font-medium text-fg">{file.name}</p>

            {summary.fields.length === 0 ? (
              <Alert tone="warning" title="No form fields found">
                This PDF has no interactive fields, so there is nothing to flatten. It may already have
                been flattened, or the boxes on it may be printed lines rather than real fields.
              </Alert>
            ) : (
              <>
                <p className="text-sm text-fg">
                  {summary.fields.length} field{summary.fields.length === 1 ? "" : "s"} found. Flattening
                  keeps what is filled in and makes it uneditable.
                </p>
                <dl className="scrollbar-slim max-h-64 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                  {summary.fields.slice(0, 60).map((field) => (
                    <DataRow key={field.name} label={field.name} value={field.type} />
                  ))}
                </dl>
                {summary.fields.length > 60 ? (
                  <p className="text-xs text-fg-subtle">
                    Showing the first 60 of {summary.fields.length} fields. All of them are flattened.
                  </p>
                ) : null}
              </>
            )}

            {result ? (
              <ResultPanel
                title="Your flattened PDF is ready"
                description={`${formatBytes(result.bytes.byteLength)} · the filled-in values are now part of the page`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-flattened.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Flatten another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={() => void flatten()}
                  loading={working}
                  disabled={summary.fields.length === 0}
                >
                  Flatten form
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
