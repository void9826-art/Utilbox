"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { CopyButton, ErrorMessage, ProgressIndicator, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { Alert, Badge, Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadText } from "@/lib/download";
import { formatNumber } from "@/lib/utils";

import { SelectField } from "../calculators/_shared";
import { IMAGE_ACCEPT, IMAGE_INPUT_ACCEPT } from "./_shared";

/** Tesseract language codes, with the scripts they cover. */
const LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "spa", label: "Spanish" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "ita", label: "Italian" },
  { code: "por", label: "Portuguese" },
  { code: "nld", label: "Dutch" },
  { code: "pol", label: "Polish" },
  { code: "rus", label: "Russian" },
  { code: "ukr", label: "Ukrainian" },
  { code: "tur", label: "Turkish" },
  { code: "ara", label: "Arabic" },
  { code: "hin", label: "Hindi" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
  { code: "chi_tra", label: "Chinese (Traditional)" },
  { code: "jpn", label: "Japanese" },
  { code: "kor", label: "Korean" },
  { code: "vie", label: "Vietnamese" },
  { code: "tha", label: "Thai" },
  { code: "ind", label: "Indonesian" },
];

interface OcrResult {
  text: string;
  confidence: number;
  words: number;
}

export default function ImageToText() {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState("");
  const [language, setLanguage] = React.useState("eng");
  const [result, setResult] = React.useState<OcrResult | null>(null);
  const [progress, setProgress] = React.useState<{ value: number; label: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const load = (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(chosen);
    setPreviewUrl(URL.createObjectURL(chosen));
    setResult(null);
    setError(null);
  };

  const run = async () => {
    if (!file) return;

    setError(null);
    setResult(null);
    setProgress({ value: 0, label: "Loading the recognition engine…" });

    let worker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | null = null;

    try {
      // Tesseract and its language model are several megabytes, so they are
      // fetched only when someone actually runs OCR. Recognition itself
      // happens in a worker on this device — the image is never uploaded.
      const { createWorker } = await import("tesseract.js");

      worker = await createWorker(language, 1, {
        logger: (message: { status: string; progress: number }) => {
          const labels: Record<string, string> = {
            "loading tesseract core": "Loading the recognition engine…",
            "loading language traineddata": "Downloading the language model…",
            initializing: "Preparing…",
            "initializing api": "Preparing…",
            recognizing: "Reading the text…",
          };
          setProgress({
            value: message.progress * 100,
            label: labels[message.status] ?? "Working…",
          });
        },
      });

      const { data } = await worker.recognize(file);
      const text = data.text.trim();

      setResult({
        text,
        confidence: data.confidence,
        words: text ? text.split(/\s+/).length : 0,
      });

      if (!text) {
        setError(
          "No text was found in that image. Check that the words are in focus, roughly horizontal, and that the right language is selected.",
        );
      }
    } catch {
      setError(
        "The text could not be recognised. The language model may have failed to download — check your connection and try again.",
      );
    } finally {
      await worker?.terminate();
      setProgress(null);
    }
  };

  const confidenceTone =
    result === null ? "neutral" : result.confidence >= 85 ? "success" : result.confidence >= 65 ? "warning" : "danger";

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={IMAGE_ACCEPT}
            inputAccept={IMAGE_INPUT_ACCEPT}
            onFiles={load}
            onError={setError}
            hint="A screenshot, scan or photo containing text. Nothing is uploaded."
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <h2 className="text-[0.8125rem] font-medium text-fg">Source image</h2>
              {/* Object URL of a user file; next/image cannot optimise it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt=""
                className="max-h-96 w-full rounded-lg border border-border bg-surface-sunken object-contain"
              />
              <p className="truncate text-xs text-fg-subtle" title={file.name}>
                {file.name}
              </p>
            </div>

            <div className="space-y-3">
              <SelectField
                label="Language of the text"
                id="ocr-language"
                value={language}
                onChange={setLanguage}
                hint="Choosing correctly matters — the engine uses a dictionary to resolve ambiguous letters."
              >
                {LANGUAGES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </SelectField>

              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={run} loading={progress !== null}>
                  Extract text
                </Button>
                <ResetButton
                  onReset={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setFile(null);
                    setPreviewUrl("");
                    setResult(null);
                    setError(null);
                  }}
                >
                  Choose another image
                </ResetButton>
              </div>

              {progress ? <ProgressIndicator value={progress.value} label={progress.label} /> : null}
            </div>
          </div>
        )}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {result && result.text ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={confidenceTone}>
                {result.confidence.toFixed(0)}% confidence
              </Badge>
              {result.confidence < 65 ? (
                <span className="text-xs text-fg-muted">
                  Low confidence — check the result carefully against the image.
                </span>
              ) : null}
            </div>

            <StatGrid className="sm:grid-cols-3">
              <Stat label="Words found" value={formatNumber(result.words)} emphasis />
              <Stat label="Characters" value={formatNumber(result.text.length)} />
              <Stat label="Lines" value={formatNumber(result.text.split("\n").length)} />
            </StatGrid>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="ocr-output" className="text-[0.8125rem] font-medium text-fg">
                  Extracted text
                </label>
                <div className="flex gap-1.5">
                  <CopyButton value={result.text} />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => downloadText(result.text, "extracted-text.txt")}
                  >
                    Download
                  </Button>
                </div>
              </div>
              <Textarea
                id="ocr-output"
                value={result.text}
                readOnly
                rows={12}
                className="scrollbar-slim bg-surface-sunken font-mono text-[0.8125rem]"
              />
            </div>
          </div>
        ) : null}

        <Alert tone="info" title="How to get the best results">
          Use the highest-resolution image you have, keep the text horizontal and in focus, crop away
          irrelevant background, and select the correct language. The engine is trained on printed type,
          so handwriting is rarely recognised reliably.
        </Alert>
      </div>
    </ToolFrame>
  );
}
