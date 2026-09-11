"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { Alert, Badge, Stat, StatGrid } from "@/components/ui/surfaces";
import { analyseResume, type AtsReport } from "@/lib/ats";
import { sniffFileKind, type AcceptOptions } from "@/lib/files";
import { closePdf, extractPositionedText, groupIntoLines, lineToText, openPdf } from "@/lib/pdf";

const ACCEPT: AcceptOptions = { kinds: "any", maxBytes: 10 * 1024 * 1024, label: "resume" };

/**
 * A line with a wide horizontal gap between two runs of text, on many lines of
 * a page, is the signature of a two-column layout.
 */
function looksMultiColumn(lines: ReturnType<typeof groupIntoLines>, pageWidth: number): boolean {
  if (lines.length < 8) return false;
  const split = lines.filter((line) =>
    line.items.some((item, index) => {
      const next = line.items[index + 1];
      return next ? next.x - (item.x + item.width) > pageWidth * 0.12 : false;
    }),
  ).length;
  return split / lines.length > 0.35;
}

async function readResume(file: File): Promise<{ text: string; multiColumn?: boolean }> {
  const kind = await sniffFileKind(file);
  if (kind === "pdf") {
    const doc = await openPdf(file, file.name);
    try {
      const pages: string[] = [];
      let multiColumnPages = 0;
      for (let pageNumber = 1; pageNumber <= Math.min(doc.numPages, 10); pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        try {
          const lines = groupIntoLines(await extractPositionedText(page));
          if (looksMultiColumn(lines, page.getViewport({ scale: 1 }).width)) multiColumnPages += 1;
          pages.push(lines.map((line) => lineToText(line.items)).join("\n"));
        } finally {
          page.cleanup();
        }
      }
      return { text: pages.join("\n\n"), multiColumn: multiColumnPages > 0 };
    } finally {
      await closePdf(doc);
    }
  }
  if (kind === "docx") {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return { text: value };
  }
  if (/\.(txt|md|text)$/i.test(file.name)) return { text: await file.text() };
  throw new Error("unsupported");
}

export default function ResumeAtsChecker() {
  const [resume, setResume] = React.useState("");
  const [job, setJob] = React.useState("");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [multiColumn, setMultiColumn] = React.useState<boolean | undefined>(undefined);
  const [reading, setReading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [report, setReport] = React.useState<AtsReport | null>(null);

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setReport(null);
    setReading(true);
    try {
      const result = await readResume(chosen);
      setResume(result.text);
      setMultiColumn(result.multiColumn);
      setFileName(chosen.name);
      if (result.text.trim().split(/\s+/).length < 50) {
        setError("Almost no text could be read from that file. It may be a scanned image — tracking systems would struggle with it too.");
      }
    } catch {
      setError(`"${chosen.name}" could not be read. Upload a PDF, a Word .docx file or a .txt file, or paste the text instead.`);
    } finally {
      setReading(false);
    }
  };

  const check = () => {
    if (!resume.trim()) {
      setError("Add your resume first — upload the file or paste its text.");
      return;
    }
    setError(null);
    setReport(analyseResume(resume, job, { multiColumn }));
  };

  const found = report?.keywords.filter((keyword) => keyword.found) ?? [];
  const missing = report?.keywords.filter((keyword) => !keyword.found) ?? [];

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-2">
            <Dropzone
              accept={ACCEPT}
              inputAccept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              compact
              onFiles={(files) => void load(files)}
              onError={setError}
              label="Upload your resume"
              hint="PDF, DOCX or TXT. Read in your browser, never uploaded."
            />
            {reading ? <ProgressIndicator label="Reading your resume…" /> : null}
            <label htmlFor="ats-resume" className="block text-[0.8125rem] font-medium text-fg">
              Resume text{fileName ? ` — from ${fileName}` : ""}
            </label>
            <Textarea
              id="ats-resume"
              rows={12}
              value={resume}
              placeholder="Or paste your resume here"
              onChange={(event) => {
                setResume(event.target.value);
                setMultiColumn(undefined);
                setFileName(null);
                setReport(null);
              }}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ats-job" className="block text-[0.8125rem] font-medium text-fg">
              Job description
            </label>
            <Textarea
              id="ats-job"
              rows={17}
              value={job}
              placeholder="Paste the full job ad, including requirements and responsibilities"
              onChange={(event) => {
                setJob(event.target.value);
                setReport(null);
              }}
            />
          </div>
        </div>

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        <Button type="button" onClick={check} disabled={reading}>
          Check resume
        </Button>

        {report ? (
          <div className="space-y-5" aria-live="polite">
            <StatGrid className="sm:grid-cols-3">
              <Stat label="Overall match" value={`${report.score}%`} emphasis hint="A checklist score, not a real ATS result" />
              <Stat label="Keyword match" value={report.keywordScore === null ? "Add a job ad" : `${report.keywordScore}%`} />
              <Stat label="Format checks" value={`${report.formatScore}%`} />
            </StatGrid>

            {report.keywords.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <section className="space-y-2" aria-labelledby="ats-missing">
                  <h2 id="ats-missing" className="text-[0.8125rem] font-semibold text-fg">
                    Missing from your resume ({missing.length})
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {missing.length === 0 ? <p className="text-sm text-fg-muted">None — every key term appears.</p> : null}
                    {missing.map((keyword) => (
                      <Badge key={keyword.term} tone="warning">
                        {keyword.term}
                        {keyword.count > 1 ? ` ×${keyword.count}` : ""}
                      </Badge>
                    ))}
                  </div>
                </section>
                <section className="space-y-2" aria-labelledby="ats-found">
                  <h2 id="ats-found" className="text-[0.8125rem] font-semibold text-fg">
                    Found in your resume ({found.length})
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {found.map((keyword) => (
                      <Badge key={keyword.term} tone="success">
                        {keyword.term}
                      </Badge>
                    ))}
                  </div>
                </section>
              </div>
            ) : null}

            <section className="space-y-2" aria-labelledby="ats-checks">
              <h2 id="ats-checks" className="text-[0.8125rem] font-semibold text-fg">
                Format checks
              </h2>
              <ul className="space-y-2">
                {report.checks.map((item) => {
                  const Icon = item.passed ? CheckCircle2 : XCircle;
                  return (
                    <li key={item.id} className="flex items-start gap-2.5 rounded-lg border border-border bg-surface p-3 text-[0.8125rem]">
                      <Icon className="mt-0.5 size-4 shrink-0 text-fg" aria-hidden="true" />
                      <div>
                        <p className="font-semibold text-fg">
                          {item.passed ? "Pass: " : "Fix: "}
                          {item.label}
                        </p>
                        <p className="text-fg-muted">{item.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <Alert tone="info" title="What the score means">
              Every tracking system works differently and none publishes a score. Use this to tailor your resume to the
              role — include the missing terms only where they truly describe your experience.
            </Alert>
          </div>
        ) : null}
      </div>
    </ToolFrame>
  );
}
