"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import {
  PAPER_SIZES,
  describeSize,
  fitToPaper,
  identifyPaper,
  normaliseRotation,
  type PaperId,
} from "@/lib/pdf-geometry";
import { stampProducer } from "@/lib/pdf-meta";
import { formatBytes } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";
import { PdfDropzone } from "./_shared";

type Mode = "fit" | "center";

interface SizeGroup {
  label: string;
  count: number;
}

type PdfDocumentType = Awaited<ReturnType<typeof import("pdf-lib").PDFDocument.load>>;

/** Groups pages by their displayed size, so "210 × 297 mm" and its landscape twin read the same. */
function summarise(doc: PdfDocumentType): SizeGroup[] {
  const groups = new Map<string, number>();
  for (const page of doc.getPages()) {
    const box = page.getCropBox();
    const sideways = normaliseRotation(page.getRotation().angle) % 180 !== 0;
    const width = sideways ? box.height : box.width;
    const height = sideways ? box.width : box.height;
    const paper = identifyPaper(width, height);
    const orientation = width > height ? "landscape" : "portrait";
    const label = paper ? `${PAPER_SIZES[paper].label} ${orientation}` : describeSize(width, height);
    groups.set(label, (groups.get(label) ?? 0) + 1);
  }
  return [...groups.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

function describeGroups(groups: SizeGroup[]): string {
  return groups.map((group) => `${group.count} × ${group.label}`).join(", ");
}

export default function PdfResizePage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [before, setBefore] = React.useState<SizeGroup[]>([]);
  const [paper, setPaper] = React.useState<PaperId>("letter");
  const [mode, setMode] = React.useState<Mode>("fit");
  const [busy, setBusy] = React.useState<"reading" | "saving" | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    bytes: Uint8Array;
    changed: number;
    skipped: number;
    scales: number[];
    after: SizeGroup[];
  } | null>(null);

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setResult(null);
    setBusy("reading");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await chosen.arrayBuffer(), { updateMetadata: false });
      const groups = summarise(doc);
      setBefore(groups);
      setFile(chosen);
      // Suggest the other common paper: A4 documents to Letter, everything else to A4.
      setPaper(groups[0]?.label.startsWith("A4") ? "letter" : "a4");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      setError(
        /encrypt/i.test(message)
          ? `"${chosen.name}" is encrypted. Remove its password in a PDF reader first.`
          : `"${chosen.name}" could not be read. It may be damaged or not a valid PDF.`,
      );
    } finally {
      setBusy(null);
    }
  };

  const convert = async () => {
    if (!file) return;
    setError(null);
    setBusy("saving");
    try {
      const { PDFArray, PDFDict, PDFDocument, PDFName } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), { updateMetadata: false });
      let changed = 0;
      let skipped = 0;
      const scales: number[] = [];

      for (const page of doc.getPages()) {
        const box = page.getCropBox();
        const fit = fitToPaper(box, PAPER_SIZES[paper], mode);
        const alreadyThere =
          Math.abs(box.width - fit.width) < 1 &&
          Math.abs(box.height - fit.height) < 1 &&
          Math.abs(box.x) < 0.5 &&
          Math.abs(box.y) < 0.5;
        if (alreadyThere) {
          skipped += 1;
          continue;
        }

        // Scale first, then translate: pdf-lib wraps the content in each call,
        // so the later call is applied last.
        if (fit.scale !== 1) page.scaleContent(fit.scale, fit.scale);
        page.translateContent(fit.translateX, fit.translateY);

        // Clickable areas are stored separately from the drawing, so move them too.
        const annotations = page.node.Annots();
        if (annotations) {
          for (let index = 0; index < annotations.size(); index += 1) {
            const annotation = annotations.lookup(index);
            if (!(annotation instanceof PDFDict)) continue;
            const rect = annotation.lookup(PDFName.of("Rect"));
            if (!(rect instanceof PDFArray)) continue;
            const { x, y, width, height } = rect.asRectangle();
            annotation.set(
              PDFName.of("Rect"),
              doc.context.obj([
                x * fit.scale + fit.translateX,
                y * fit.scale + fit.translateY,
                (x + width) * fit.scale + fit.translateX,
                (y + height) * fit.scale + fit.translateY,
              ]),
            );
          }
        }

        page.setMediaBox(0, 0, fit.width, fit.height);
        page.setCropBox(0, 0, fit.width, fit.height);
        for (const key of ["BleedBox", "TrimBox", "ArtBox"]) page.node.delete(PDFName.of(key));

        scales.push(fit.scale);
        changed += 1;
      }

      stampProducer(doc);
      const bytes = await doc.save();
      const reopened = await PDFDocument.load(bytes, { updateMetadata: false });
      setResult({ bytes, changed, skipped, scales, after: summarise(reopened) });
    } catch {
      setError(`"${file.name}" could not be converted. It may use features this tool cannot rewrite.`);
    } finally {
      setBusy(null);
    }
  };

  const reset = () => {
    setFile(null);
    setBefore([]);
    setResult(null);
  };

  const scaleSummary = (scales: number[]) => {
    if (scales.length === 0) return "";
    const low = Math.min(...scales);
    const high = Math.max(...scales);
    const pct = (value: number) => `${(value * 100).toFixed(1)}%`;
    return low === high ? `content scaled to ${pct(low)}` : `content scaled to ${pct(low)}–${pct(high)}`;
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? <PdfDropzone onFiles={(files) => void load(files)} onError={setError} /> : null}
        {busy === "reading" ? <ProgressIndicator label="Reading page sizes…" /> : null}
        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {file ? (
          <>
            <div className="rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm">
              <p className="font-medium text-fg">{file.name}</p>
              <p className="text-fg-muted">Current pages: {describeGroups(before)}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="New paper size"
                id="resize-paper"
                value={paper}
                onChange={(value) => {
                  setPaper(value as PaperId);
                  setResult(null);
                }}
              >
                {(Object.keys(PAPER_SIZES) as PaperId[]).map((id) => (
                  <option key={id} value={id}>
                    {PAPER_SIZES[id].label} — {describeSize(PAPER_SIZES[id].width, PAPER_SIZES[id].height)}
                  </option>
                ))}
              </SelectField>
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Content</span>
                <Segmented
                  name="resize-mode"
                  ariaLabel="How to place the content"
                  value={mode}
                  onChange={(value) => {
                    setMode(value);
                    setResult(null);
                  }}
                  options={[
                    { value: "fit", label: "Scale to fit" },
                    { value: "center", label: "Keep content size" },
                  ]}
                />
              </div>
            </div>

            {mode === "center" ? (
              <Alert tone="warning">
                Content keeps its size and is centred. If the new paper is smaller in either direction, the edges of
                the page are cut off.
              </Alert>
            ) : null}

            {result ? (
              <ResultPanel
                title="Your resized PDF is ready"
                description={`${result.changed} page${result.changed === 1 ? "" : "s"} changed${result.skipped ? `, ${result.skipped} already the right size` : ""}${result.scales.length ? ` · ${scaleSummary(result.scales)}` : ""} · ${formatBytes(result.bytes.byteLength)}`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}-${PAPER_SIZES[paper].label.replace(/\s+/g, "-").toLowerCase()}.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={reset}
                resetLabel="Resize another PDF"
              >
                <p className="text-sm text-fg">Pages in the saved file: {describeGroups(result.after)}</p>
              </ResultPanel>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void convert()} loading={busy === "saving"}>
                  Convert to {PAPER_SIZES[paper].label}
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
