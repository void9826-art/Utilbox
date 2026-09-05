"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input, Segmented } from "@/components/ui/field";
import { downloadZip } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { parsePageRanges, summarisePages } from "@/lib/pdf";
import { formatBytes, yieldToBrowser } from "@/lib/utils";

import { NumberField, parseNumber } from "../calculators/_shared";
import { PdfDropzone, pdfErrorMessage, readPdfInfo, type PdfInfo } from "./_shared";

type Mode = "ranges" | "every" | "each";

interface OutputPlan {
  label: string;
  pages: number[];
}

export default function SplitPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [info, setInfo] = React.useState<PdfInfo | null>(null);
  const [mode, setMode] = React.useState<Mode>("ranges");
  const [rangeText, setRangeText] = React.useState("1-3, 4-6");
  const [everyN, setEveryN] = React.useState("1");
  const [loading, setLoading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState<number | null>(null);

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;

    setError(null);
    setDone(null);
    setLoading(true);

    try {
      // Thumbnails are not needed here, so rendering is skipped for speed.
      const loaded = await readPdfInfo(chosen, { maxThumbnails: 0 });
      setFile(chosen);
      setInfo(loaded);
    } catch (caught) {
      setError(pdfErrorMessage(caught, chosen.name));
    } finally {
      setLoading(false);
    }
  };

  /** Works out exactly which files will be produced, before anything runs. */
  const plan = React.useMemo((): { outputs: OutputPlan[]; error: string | null } => {
    if (!info) return { outputs: [], error: null };

    if (mode === "each") {
      return {
        outputs: Array.from({ length: info.pageCount }, (_, index) => ({
          label: `Page ${index + 1}`,
          pages: [index + 1],
        })),
        error: null,
      };
    }

    if (mode === "every") {
      const size = parseNumber(everyN);
      if (size === null || size < 1 || !Number.isInteger(size)) {
        return { outputs: [], error: "Enter a whole number of pages per file, at least 1." };
      }

      const outputs: OutputPlan[] = [];
      for (let start = 1; start <= info.pageCount; start += size) {
        const end = Math.min(start + size - 1, info.pageCount);
        const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);
        outputs.push({ label: start === end ? `Page ${start}` : `Pages ${start}-${end}`, pages });
      }
      return { outputs, error: null };
    }

    // Custom ranges: each comma-separated chunk becomes its own file.
    const chunks = rangeText.split(",").map((chunk) => chunk.trim()).filter(Boolean);
    if (chunks.length === 0) {
      return { outputs: [], error: "Enter at least one page range." };
    }

    const outputs: OutputPlan[] = [];
    for (const chunk of chunks) {
      const parsed = parsePageRanges(chunk, info.pageCount);
      if (parsed.error) return { outputs: [], error: parsed.error };
      outputs.push({ label: summarisePages(parsed.pages), pages: parsed.pages });
    }
    return { outputs, error: null };
  }, [everyN, info, mode, rangeText]);

  const split = async () => {
    if (!file || !info || plan.outputs.length === 0) return;

    setError(null);
    setDone(null);
    setWorking(true);
    setProgress({ done: 0, total: plan.outputs.length });

    try {
      const { PDFDocument } = await import("pdf-lib");
      const source = await PDFDocument.load(await file.arrayBuffer());
      const stem = stripExtension(file.name);

      const files: Array<{ name: string; data: Uint8Array }> = [];

      for (const [index, output] of plan.outputs.entries()) {
        const doc = await PDFDocument.create();
        doc.setCreator("Utilbox");
        doc.setProducer("Utilbox");

        const pages = await doc.copyPages(
          source,
          output.pages.map((page) => page - 1),
        );
        for (const page of pages) doc.addPage(page);

        files.push({
          name: `${stem}-${output.label.replace(/\s+/g, "-").toLowerCase()}.pdf`,
          data: await doc.save(),
        });

        setProgress({ done: index + 1, total: plan.outputs.length });
        await yieldToBrowser();
      }

      await downloadZip(files, `${stem}-split.zip`);
      setDone(files.length);
    } catch (caught) {
      setError(pdfErrorMessage(caught, file.name));
    } finally {
      setWorking(false);
      setProgress(null);
    }
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {loading ? <ProgressIndicator label="Reading the document…" /> : null}

        {file && info ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">
                {info.pageCount} page{info.pageCount === 1 ? "" : "s"} · {formatBytes(file.size)}
              </span>
            </p>

            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">How should it be split?</span>
              <Segmented
                name="split-mode"
                ariaLabel="Split mode"
                value={mode}
                onChange={(value) => {
                  setMode(value);
                  setDone(null);
                }}
                options={[
                  { value: "ranges", label: "Custom ranges" },
                  { value: "every", label: "Every N pages" },
                  { value: "each", label: "One file per page" },
                ]}
              />
            </div>

            {mode === "ranges" ? (
              <Field
                label="Ranges — one file per comma-separated group"
                htmlFor="split-ranges"
                hint="For example 1-12, 13-28, 29-40 produces three files."
                error={plan.error}
                className="sm:max-w-lg"
              >
                <Input
                  id="split-ranges"
                  value={rangeText}
                  onChange={(event) => {
                    setRangeText(event.target.value);
                    setDone(null);
                  }}
                  className="tabular font-mono"
                />
              </Field>
            ) : null}

            {mode === "every" ? (
              <NumberField
                id="split-every"
                label="Pages per file"
                value={everyN}
                onChange={(value) => {
                  setEveryN(value);
                  setDone(null);
                }}
                min={1}
                max={info.pageCount}
                step={1}
                inputMode="numeric"
                className="sm:max-w-48"
                error={plan.error}
              />
            ) : null}

            {plan.outputs.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-fg">
                  This produces{" "}
                  <strong className="font-semibold">
                    {plan.outputs.length} file{plan.outputs.length === 1 ? "" : "s"}
                  </strong>
                  .
                </p>
                <ul className="scrollbar-slim max-h-48 divide-y divide-border overflow-y-auto rounded-lg border border-border text-[0.8125rem]">
                  {plan.outputs.slice(0, 60).map((output, index) => (
                    <li key={index} className="flex justify-between gap-3 px-3 py-1.5">
                      <span className="text-fg">File {index + 1}</span>
                      <span className="tabular text-fg-muted">
                        {output.label} · {output.pages.length} page
                        {output.pages.length === 1 ? "" : "s"}
                      </span>
                    </li>
                  ))}
                  {plan.outputs.length > 60 ? (
                    <li className="px-3 py-1.5 text-fg-subtle">
                      …and {plan.outputs.length - 60} more
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {progress ? (
              <ProgressIndicator
                value={(progress.done / Math.max(1, progress.total)) * 100}
                label={`Building file ${progress.done} of ${progress.total}…`}
              />
            ) : null}

            {done !== null ? (
              <ResultPanel
                title={`${done} PDF${done === 1 ? "" : "s"} downloaded`}
                description="Your ZIP has been saved. Every page kept its original quality."
                actions={
                  <Button type="button" onClick={() => void split()}>
                    Download again
                  </Button>
                }
                onReset={() => {
                  setFile(null);
                  setInfo(null);
                  setDone(null);
                }}
                resetLabel="Split another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={split}
                  loading={working}
                  disabled={plan.outputs.length === 0 || plan.error !== null}
                >
                  Split into {plan.outputs.length || 0} file
                  {plan.outputs.length === 1 ? "" : "s"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setInfo(null);
                    setDone(null);
                  }}
                >
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
