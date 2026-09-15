"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { ErrorMessage, ProgressIndicator } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadText } from "@/lib/download";
import { closePdf, extractPageText, openPdf } from "@/lib/pdf";
import { diffLines, splitLines, summariseDiff, type DiffLine } from "@/lib/text-diff";
import { yieldToBrowser } from "@/lib/utils";

import { PdfDropzone, pdfErrorMessage } from "./_shared";

interface PageComparison {
  page: number;
  lines: DiffLine[];
  added: number;
  removed: number;
}

async function readPages(file: File): Promise<string[]> {
  const doc = await openPdf(file, file.name);
  try {
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
      const page = await doc.getPage(pageNumber);
      try {
        pages.push(await extractPageText(page));
      } finally {
        page.cleanup();
      }
      await yieldToBrowser();
    }
    return pages;
  } finally {
    await closePdf(doc);
  }
}

export default function PdfCompare() {
  const [left, setLeft] = React.useState<File | null>(null);
  const [right, setRight] = React.useState<File | null>(null);
  const [working, setWorking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [comparisons, setComparisons] = React.useState<PageComparison[] | null>(null);
  const [counts, setCounts] = React.useState<{ left: number; right: number } | null>(null);

  const compare = async () => {
    if (!left || !right) return;
    setError(null);
    setWorking(true);
    setComparisons(null);

    try {
      const [beforePages, afterPages] = await Promise.all([readPages(left), readPages(right)]);
      setCounts({ left: beforePages.length, right: afterPages.length });

      const pageCount = Math.max(beforePages.length, afterPages.length);
      const result: PageComparison[] = [];

      for (let index = 0; index < pageCount; index += 1) {
        const lines = diffLines(splitLines(beforePages[index] ?? ""), splitLines(afterPages[index] ?? ""));
        const summary = summariseDiff(lines);
        if (summary.changed) {
          result.push({ page: index + 1, lines, added: summary.added, removed: summary.removed });
        }
        await yieldToBrowser();
      }

      setComparisons(result);
    } catch (caught) {
      setError(pdfErrorMessage(caught, left.name));
    } finally {
      setWorking(false);
    }
  };

  const report = () => {
    if (!comparisons) return;
    const lines: string[] = [`Comparison of ${left?.name} and ${right?.name}`, ""];
    for (const page of comparisons) {
      lines.push(`Page ${page.page}: ${page.added} added, ${page.removed} removed`);
      for (const line of page.lines) {
        if (line.type === "insert") lines.push(`  + ${line.text}`);
        else if (line.type === "delete") lines.push(`  - ${line.text}`);
      }
      lines.push("");
    }
    downloadText(lines.join("\n"), "pdf-comparison.txt");
  };

  const totalAdded = comparisons?.reduce((sum, page) => sum + page.added, 0) ?? 0;
  const totalRemoved = comparisons?.reduce((sum, page) => sum + page.removed, 0) ?? 0;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Original</span>
            {left ? (
              <p className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg">{left.name}</p>
            ) : (
              <PdfDropzone
                compact
                label="Add the original"
                onFiles={(files) => setLeft(files[0] ?? null)}
                onError={setError}
              />
            )}
          </div>
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Revised</span>
            {right ? (
              <p className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg">{right.name}</p>
            ) : (
              <PdfDropzone
                compact
                label="Add the revised copy"
                onFiles={(files) => setRight(files[0] ?? null)}
                onError={setError}
              />
            )}
          </div>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {working ? <ProgressIndicator label="Reading both documents…" /> : null}

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => void compare()} loading={working} disabled={!left || !right}>
            Compare
          </Button>
          {left || right ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setLeft(null);
                setRight(null);
                setComparisons(null);
                setCounts(null);
              }}
            >
              Start again
            </Button>
          ) : null}
        </div>

        {comparisons ? (
          <>
            <StatGrid className="sm:grid-cols-3">
              <Stat label="Pages with changes" value={String(comparisons.length)} emphasis />
              <Stat label="Lines added" value={String(totalAdded)} />
              <Stat label="Lines removed" value={String(totalRemoved)} />
            </StatGrid>

            {counts && counts.left !== counts.right ? (
              <Alert tone="warning" title="The documents have different page counts">
                The original has {counts.left} page{counts.left === 1 ? "" : "s"} and the revised copy has{" "}
                {counts.right}. Pages are compared in order, so everything after an inserted page looks
                changed.
              </Alert>
            ) : null}

            {comparisons.length === 0 ? (
              <Alert tone="success" title="No text differences found">
                Both documents contain the same text. Images, fonts and layout are not compared — only the
                words.
              </Alert>
            ) : (
              <>
                <Button type="button" variant="secondary" size="sm" onClick={report}>
                  Download the comparison as text
                </Button>

                <div className="space-y-4">
                  {comparisons.map((page) => (
                    <section key={page.page} className="rounded-lg border border-border">
                      <h3 className="border-b border-border bg-surface-sunken px-3.5 py-2 text-sm font-semibold text-fg">
                        Page {page.page}
                        <span className="ml-2 font-normal text-fg-muted">
                          {page.added} added · {page.removed} removed
                        </span>
                      </h3>
                      <ul className="scrollbar-slim max-h-72 divide-y divide-border overflow-y-auto">
                        {page.lines
                          .filter((line) => line.type !== "equal")
                          .map((line, index) => (
                            <li
                              key={`${line.type}-${index}`}
                              className="flex items-start gap-2 px-3.5 py-1.5 text-[0.8125rem]"
                            >
                              {line.type === "insert" ? (
                                <Plus className="mt-0.5 size-3.5 shrink-0 text-fg" aria-hidden="true" />
                              ) : (
                                <Minus className="mt-0.5 size-3.5 shrink-0 text-fg" aria-hidden="true" />
                              )}
                              <span className="sr-only">{line.type === "insert" ? "Added:" : "Removed:"}</span>
                              <span
                                className={
                                  line.type === "insert" ? "bg-success-soft text-fg" : "text-fg-muted line-through"
                                }
                              >
                                {line.text}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
