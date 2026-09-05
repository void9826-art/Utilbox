"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented, Slider } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { MAX_FILE_SIZE, stripExtension, type AcceptOptions } from "@/lib/files";
import type { PageSizeId } from "@/lib/pdf-document";
import { formatBytes, formatNumber } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";

const DOCX_ACCEPT: AcceptOptions = {
  kinds: ["docx"],
  maxBytes: MAX_FILE_SIZE.document,
  label: "Word (.docx)",
};

interface Block {
  kind: "heading1" | "heading2" | "heading3" | "paragraph" | "listItem";
  text: string;
}

/**
 * Converts the HTML that mammoth produces into a flat list of blocks.
 * Parsing happens through DOMParser, which does not execute scripts or load
 * resources — the markup is only ever read as a tree.
 */
function htmlToBlocks(html: string): Block[] {
  const document_ = new DOMParser().parseFromString(html, "text/html");
  const blocks: Block[] = [];

  const walk = (node: Element) => {
    for (const child of Array.from(node.children)) {
      const tag = child.tagName.toLowerCase();
      const text = (child.textContent ?? "").replace(/\s+/g, " ").trim();

      if (tag === "ul" || tag === "ol") {
        walk(child);
        continue;
      }
      if (tag === "li") {
        if (text) blocks.push({ kind: "listItem", text });
        continue;
      }
      if (tag === "h1" && text) {
        blocks.push({ kind: "heading1", text });
        continue;
      }
      if (tag === "h2" && text) {
        blocks.push({ kind: "heading2", text });
        continue;
      }
      if ((tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") && text) {
        blocks.push({ kind: "heading3", text });
        continue;
      }
      if (tag === "table") {
        // Tables are not laid out; each row becomes a tab-separated line so no
        // content is silently lost.
        for (const row of Array.from(child.querySelectorAll("tr"))) {
          const cells = Array.from(row.querySelectorAll("td, th")).map((cell) =>
            (cell.textContent ?? "").replace(/\s+/g, " ").trim(),
          );
          if (cells.some(Boolean)) blocks.push({ kind: "paragraph", text: cells.join("   ") });
        }
        continue;
      }
      if (text) {
        blocks.push({ kind: "paragraph", text });
      }
    }
  };

  walk(document_.body);
  return blocks;
}

export default function WordToPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [blocks, setBlocks] = React.useState<Block[]>([]);
  const [pageSize, setPageSize] = React.useState<PageSizeId>("a4");
  const [margin, setMargin] = React.useState(20);
  const [fontFamily, setFontFamily] = React.useState<"sans" | "serif">("serif");
  const [reading, setReading] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; pages: number } | null>(null);

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;

    setError(null);
    setResult(null);
    setBlocks([]);
    setWarnings([]);
    setReading(true);

    try {
      // mammoth is ~200 KB, so it loads only when a document is dropped.
      const mammoth = await import("mammoth");
      const { value, messages } = await mammoth.convertToHtml({
        arrayBuffer: await chosen.arrayBuffer(),
      });

      const parsed = htmlToBlocks(value);
      setFile(chosen);
      setBlocks(parsed);

      const notes = messages
        .filter((message) => message.type === "warning")
        .map((message) => message.message)
        .slice(0, 3);
      setWarnings(notes);

      if (parsed.length === 0) {
        setError("No text was found in that document. It may be empty, or contain only images.");
      }
    } catch {
      setError(
        "That document could not be read. Make sure it is a .docx file — the older binary .doc format is not supported.",
      );
    } finally {
      setReading(false);
    }
  };

  const build = async () => {
    if (!file || blocks.length === 0) return;

    setWorking(true);
    setError(null);

    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const { DocumentLayout } = await import("@/lib/pdf-document");

      const doc = await PDFDocument.create();
      doc.setTitle(stripExtension(file.name));
      doc.setCreator("Utilbox");
      doc.setProducer("Utilbox");

      const serif = fontFamily === "serif";
      const fonts = {
        regular: await doc.embedFont(serif ? StandardFonts.TimesRoman : StandardFonts.Helvetica),
        bold: await doc.embedFont(serif ? StandardFonts.TimesRomanBold : StandardFonts.HelveticaBold),
        italic: await doc.embedFont(
          serif ? StandardFonts.TimesRomanItalic : StandardFonts.HelveticaOblique,
        ),
        boldItalic: await doc.embedFont(
          serif ? StandardFonts.TimesRomanBoldItalic : StandardFonts.HelveticaBoldOblique,
        ),
      };

      // 1 mm = 72/25.4 points.
      const layout = new DocumentLayout(doc, fonts, {
        pageSize,
        margin: margin * (72 / 25.4),
      });

      const ink = rgb(0.08, 0.09, 0.11);

      for (const block of blocks) {
        switch (block.kind) {
          case "heading1":
            layout.text(block.text, {
              size: 20,
              font: "bold",
              color: ink,
              spaceBefore: 14,
              spaceAfter: 6,
            });
            break;
          case "heading2":
            layout.text(block.text, {
              size: 15,
              font: "bold",
              color: ink,
              spaceBefore: 12,
              spaceAfter: 4,
            });
            break;
          case "heading3":
            layout.text(block.text, {
              size: 12.5,
              font: "bold",
              color: ink,
              spaceBefore: 10,
              spaceAfter: 3,
            });
            break;
          case "listItem":
            layout.text(`•  ${block.text}`, {
              size: 11,
              color: ink,
              lineHeight: 1.45,
              indent: 14,
              spaceAfter: 3,
            });
            break;
          default:
            layout.text(block.text, {
              size: 11,
              color: ink,
              lineHeight: 1.5,
              spaceAfter: 7,
            });
        }
      }

      setResult({ bytes: await doc.save(), pages: layout.pageCount });
    } catch {
      setError("The PDF could not be created. Please try again.");
    } finally {
      setWorking(false);
    }
  };

  const headings = blocks.filter((block) => block.kind.startsWith("heading")).length;
  const words = blocks.reduce(
    (sum, block) => sum + (block.text.trim() ? block.text.trim().split(/\s+/).length : 0),
    0,
  );

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={DOCX_ACCEPT}
            inputAccept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onFiles={(files) => void load(files)}
            onError={setError}
            hint="Word .docx files up to 25 MB. The conversion happens here, not on a server."
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {reading ? <ProgressIndicator label="Reading the document…" /> : null}

        {file && blocks.length > 0 ? (
          <>
            <StatGrid className="sm:grid-cols-3">
              <Stat label="Blocks read" value={formatNumber(blocks.length)} />
              <Stat label="Headings" value={formatNumber(headings)} />
              <Stat label="Words" value={formatNumber(words)} emphasis />
            </StatGrid>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Page size"
                id="word-page-size"
                value={pageSize}
                onChange={(value) => {
                  setPageSize(value as PageSizeId);
                  setResult(null);
                }}
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
                <option value="legal">US Legal (8.5 × 14 in)</option>
              </SelectField>

              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Typeface</span>
                <Segmented
                  name="word-font"
                  ariaLabel="Typeface"
                  value={fontFamily}
                  onChange={(value) => {
                    setFontFamily(value);
                    setResult(null);
                  }}
                  options={[
                    { value: "serif", label: "Serif" },
                    { value: "sans", label: "Sans-serif" },
                  ]}
                />
              </div>
            </div>

            <Slider
              label="Margin"
              valueLabel={`${margin} mm`}
              min={10}
              max={40}
              value={margin}
              onChange={(event) => {
                setMargin(Number(event.target.value));
                setResult(null);
              }}
              className="sm:max-w-md"
            />

            <div className="space-y-2">
              <h2 className="text-[0.8125rem] font-medium text-fg">Preview</h2>
              <div className="scrollbar-slim max-h-72 space-y-2 overflow-y-auto rounded-lg border border-border bg-surface-sunken p-4">
                {blocks.slice(0, 60).map((block, index) => (
                  <p
                    key={index}
                    className={
                      block.kind === "heading1"
                        ? "text-lg font-semibold text-fg"
                        : block.kind === "heading2"
                          ? "text-base font-semibold text-fg"
                          : block.kind === "heading3"
                            ? "text-sm font-semibold text-fg"
                            : block.kind === "listItem"
                              ? "pl-4 text-sm text-fg-muted"
                              : "text-sm leading-relaxed text-fg-muted"
                    }
                  >
                    {block.kind === "listItem" ? `• ${block.text}` : block.text}
                  </p>
                ))}
                {blocks.length > 60 ? (
                  <p className="text-xs text-fg-subtle">…and {blocks.length - 60} more blocks</p>
                ) : null}
              </div>
            </div>

            {result ? (
              <ResultPanel
                title="Your PDF is ready"
                description={`${result.pages} page${result.pages === 1 ? "" : "s"} · ${formatBytes(result.bytes.byteLength)} · text is selectable and searchable`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(
                        result.bytes,
                        `${stripExtension(file.name)}.pdf`,
                        "application/pdf",
                      )
                    }
                  >
                    Download PDF
                  </Button>
                }
                onReset={() => {
                  setFile(null);
                  setBlocks([]);
                  setResult(null);
                }}
                resetLabel="Convert another document"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={build} loading={working}>
                  Create PDF
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setBlocks([]);
                  }}
                >
                  Choose another document
                </Button>
              </div>
            )}

            {warnings.length > 0 ? (
              <Alert tone="warning" title="The document contains features that were not carried across">
                <ul className="list-disc space-y-0.5 pl-4">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </Alert>
            ) : null}

            <Alert tone="info" title="Layout is rebuilt, not copied">
              Headings, paragraphs and lists are laid out fresh with a standard PDF font, which keeps the
              file small and makes it render identically everywhere. Images, exact fonts, columns and
              table borders are not reproduced — printing to PDF from Word gives a closer visual match
              when those matter.
            </Alert>
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
