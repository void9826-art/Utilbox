"use client";

import * as React from "react";

import { CopyButton, ErrorMessage, ProgressIndicator, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Textarea } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadText } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { closePdf, extractPageText, openPdf } from "@/lib/pdf";
import { formatNumber, yieldToBrowser } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

export default function PdfToText() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<string[]>([]);
  const [pageMarkers, setPageMarkers] = React.useState(true);
  const [joinLines, setJoinLines] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const extract = async (source: File) => {
    setError(null);
    setPages([]);
    setProgress({ done: 0, total: 0 });

    let doc: Awaited<ReturnType<typeof openPdf>> | null = null;

    try {
      doc = await openPdf(source, source.name);
      const total = doc.numPages;
      setProgress({ done: 0, total });

      const extracted: string[] = [];

      for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        try {
          extracted.push(await extractPageText(page));
        } finally {
          page.cleanup();
        }

        setProgress({ done: pageNumber, total });
        if (pageNumber % 5 === 0) await yieldToBrowser();
      }

      setPages(extracted);

      if (extracted.every((text) => text.trim() === "")) {
        setError(
          "No text was found. This PDF is almost certainly a scan — an image of a page with no text layer. Use the Image to Text (OCR) tool instead.",
        );
      }
    } catch (caught) {
      setError(pdfErrorMessage(caught, source.name));
    } finally {
      await closePdf(doc);
      setProgress(null);
    }
  };

  const output = React.useMemo(() => {
    if (pages.length === 0) return "";

    return pages
      .map((text, index) => {
        // PDFs break lines to fit the page, not to end a sentence, so joining
        // them back into paragraphs is usually what a reader wants.
        const body = joinLines
          ? text
              .split(/\n\s*\n/)
              .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
              .filter(Boolean)
              .join("\n\n")
          : text;

        return pageMarkers ? `--- Page ${index + 1} ---\n${body}` : body;
      })
      .join("\n\n");
  }, [joinLines, pageMarkers, pages]);

  const words = output.trim() ? output.trim().split(/\s+/).length : 0;
  const pagesWithText = pages.filter((text) => text.trim()).length;

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

        {file && pages.length > 0 ? (
          <>
            <StatGrid className="sm:grid-cols-4">
              <Stat label="Pages" value={formatNumber(pages.length)} />
              <Stat label="Pages with text" value={formatNumber(pagesWithText)} />
              <Stat label="Words" value={formatNumber(words)} emphasis />
              <Stat label="Characters" value={formatNumber(output.length)} />
            </StatGrid>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <Checkbox
                label="Mark where each page starts"
                checked={pageMarkers}
                onChange={(event) => setPageMarkers(event.target.checked)}
              />
              <Checkbox
                label="Join lines into paragraphs"
                description="Better for pasting elsewhere; turn it off for poetry, code or addresses."
                checked={joinLines}
                onChange={(event) => setJoinLines(event.target.checked)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="pdf-text-output" className="text-[0.8125rem] font-medium text-fg">
                  Extracted text
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <CopyButton value={output} />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!output}
                    onClick={() => downloadText(output, `${stripExtension(file.name)}.txt`)}
                  >
                    Download .txt
                  </Button>
                  <ResetButton
                    onReset={() => {
                      setFile(null);
                      setPages([]);
                      setError(null);
                    }}
                  >
                    Another PDF
                  </ResetButton>
                </div>
              </div>

              <Textarea
                id="pdf-text-output"
                value={output}
                readOnly
                rows={18}
                className="scrollbar-slim bg-surface-sunken font-mono text-[0.8125rem]"
              />
            </div>

            {pagesWithText < pages.length ? (
              <Alert tone="info" title="Some pages contained no text">
                {pages.length - pagesWithText} of {pages.length} pages produced nothing. Those pages are
                probably scanned images — run them through the OCR tool if you need their words.
              </Alert>
            ) : null}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
