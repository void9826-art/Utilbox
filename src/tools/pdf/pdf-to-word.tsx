"use client";

import * as React from "react";

import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Textarea } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadBytes } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { DOCX_MIME, createDocx, type DocxParagraph } from "@/lib/ooxml";
import { closePdf, extractPositionedText, groupIntoLines, lineToText, openPdf } from "@/lib/pdf";
import { formatBytes, formatNumber, yieldToBrowser } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

interface PageContent {
  lines: Array<{ text: string; height: number }>;
}

export default function PdfToWord() {
  const [file, setFile] = React.useState<File | null>(null);
  const [content, setContent] = React.useState<PageContent[]>([]);
  const [detectHeadings, setDetectHeadings] = React.useState(true);
  const [pageBreaks, setPageBreaks] = React.useState(true);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ bytes: Uint8Array; paragraphs: number } | null>(null);

  const extract = async (source: File) => {
    setError(null);
    setContent([]);
    setResult(null);
    setProgress({ done: 0, total: 0 });

    let doc: Awaited<ReturnType<typeof openPdf>> | null = null;

    try {
      doc = await openPdf(source, source.name);
      const total = doc.numPages;
      setProgress({ done: 0, total });

      const pages: PageContent[] = [];

      for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);

        try {
          const items = await extractPositionedText(page);
          const grouped = groupIntoLines(items);

          pages.push({
            lines: grouped
              .map((line) => ({
                text: lineToText(line.items),
                // The tallest glyph on the line is what makes a heading obvious.
                height: Math.max(...line.items.map((item) => item.height), 0),
              }))
              .filter((line) => line.text.trim() !== ""),
          });
        } finally {
          page.cleanup();
        }

        setProgress({ done: pageNumber, total });
        if (pageNumber % 5 === 0) await yieldToBrowser();
      }

      setContent(pages);

      if (pages.every((page) => page.lines.length === 0)) {
        setError(
          "No text was found. This PDF is a scan — an image of a page with no text layer to extract. Use the Image to Text (OCR) tool instead.",
        );
      }
    } catch (caught) {
      setError(pdfErrorMessage(caught, source.name));
    } finally {
      await closePdf(doc);
      setProgress(null);
    }
  };

  /**
   * Turns extracted lines into paragraphs. Lines noticeably taller than the
   * document's body text become headings; consecutive body lines are joined
   * because a PDF breaks lines to fit the page, not to end a paragraph.
   */
  const paragraphs = React.useMemo((): DocxParagraph[] => {
    if (content.length === 0) return [];

    const allHeights = content.flatMap((page) => page.lines.map((line) => line.height)).filter(Boolean);
    if (allHeights.length === 0) return [];

    const sorted = [...allHeights].sort((a, b) => a - b);
    const bodyHeight = sorted[Math.floor(sorted.length / 2)];

    const output: DocxParagraph[] = [];

    content.forEach((page, pageIndex) => {
      let buffer = "";
      let firstOnPage = true;

      const flush = () => {
        if (!buffer.trim()) return;
        output.push({
          text: buffer.trim(),
          style: "Normal",
          pageBreakBefore: pageBreaks && pageIndex > 0 && firstOnPage,
        });
        firstOnPage = false;
        buffer = "";
      };

      for (const line of page.lines) {
        const isHeading =
          detectHeadings && bodyHeight > 0 && line.height >= bodyHeight * 1.25 && line.text.length < 120;

        if (isHeading) {
          flush();
          output.push({
            text: line.text,
            style: line.height >= bodyHeight * 1.6 ? "Heading1" : "Heading2",
            pageBreakBefore: pageBreaks && pageIndex > 0 && firstOnPage,
          });
          firstOnPage = false;
          continue;
        }

        // A line ending in sentence punctuation is treated as a real break.
        buffer = buffer ? `${buffer} ${line.text}` : line.text;
        if (/[.!?:;]["')\]]?$/.test(line.text.trim())) flush();
      }

      flush();
    });

    return output;
  }, [content, detectHeadings, pageBreaks]);

  const build = () => {
    if (!file || paragraphs.length === 0) return;
    try {
      const bytes = createDocx(paragraphs);
      setResult({ bytes, paragraphs: paragraphs.length });
    } catch {
      setError("The Word document could not be created.");
    }
  };

  const previewText = paragraphs
    .slice(0, 40)
    .map((paragraph) => (paragraph.style?.startsWith("Heading") ? `# ${paragraph.text}` : paragraph.text))
    .join("\n\n");

  const headings = paragraphs.filter((paragraph) => paragraph.style?.startsWith("Heading")).length;
  const words = paragraphs.reduce(
    (sum, paragraph) => sum + (paragraph.text.trim() ? paragraph.text.trim().split(/\s+/).length : 0),
    0,
  );

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <PdfDropzone
            onFiles={(files) => {
              const chosen = files[0];
              if (!chosen) return;
              setFile(chosen);
              void extract(chosen);
            }}
            onError={setError}
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {progress ? (
          <ProgressIndicator
            value={progress.total > 0 ? (progress.done / progress.total) * 100 : undefined}
            label={
              progress.total > 0
                ? `Reading page ${progress.done} of ${progress.total}…`
                : "Opening the document…"
            }
          />
        ) : null}

        {file && paragraphs.length > 0 ? (
          <>
            <StatGrid className="sm:grid-cols-4">
              <Stat label="Pages read" value={formatNumber(content.length)} />
              <Stat label="Paragraphs" value={formatNumber(paragraphs.length)} emphasis />
              <Stat label="Headings found" value={formatNumber(headings)} />
              <Stat label="Words" value={formatNumber(words)} />
            </StatGrid>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Checkbox
                label="Detect headings from text size"
                description="Lines noticeably larger than the body text become Word headings."
                checked={detectHeadings}
                onChange={(event) => {
                  setDetectHeadings(event.target.checked);
                  setResult(null);
                }}
              />
              <Checkbox
                label="Keep page breaks"
                checked={pageBreaks}
                onChange={(event) => {
                  setPageBreaks(event.target.checked);
                  setResult(null);
                }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="docx-preview" className="text-[0.8125rem] font-medium text-fg">
                Preview {paragraphs.length > 40 ? "— first 40 paragraphs" : ""}
              </label>
              <Textarea
                id="docx-preview"
                value={previewText}
                readOnly
                rows={12}
                className="scrollbar-slim bg-surface-sunken text-[0.8125rem]"
              />
            </div>

            {result ? (
              <ResultPanel
                title="Your Word document is ready"
                description={`${formatNumber(result.paragraphs)} paragraphs · ${formatBytes(result.bytes.byteLength)}`}
                actions={
                  <Button
                    type="button"
                    onClick={() =>
                      downloadBytes(result.bytes, `${stripExtension(file.name)}.docx`, DOCX_MIME)
                    }
                  >
                    Download .docx
                  </Button>
                }
                onReset={() => {
                  setFile(null);
                  setContent([]);
                  setResult(null);
                }}
                resetLabel="Convert another PDF"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={build}>
                  Create Word document
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    setContent([]);
                  }}
                >
                  Choose another PDF
                </Button>
              </div>
            )}

            <Alert tone="info" title="What comes across, and what does not">
              You get the text in reading order, with page breaks and detected headings. Multi-column
              layouts, tables, images and exact fonts belong to the PDF&apos;s visual layer and cannot be
              rebuilt from text positions — for a text-heavy report the result is close, for a magazine
              layout it will read as plain paragraphs.
            </Alert>
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
