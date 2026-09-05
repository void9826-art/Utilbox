"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import {
  FORMAT_LABELS,
  processImage,
  readDimensions,
  type OutputFormat,
  type ProcessOptions,
} from "@/lib/image";
import { formatBytes, yieldToBrowser } from "@/lib/utils";

import {
  IMAGE_ACCEPT,
  IMAGE_INPUT_ACCEPT,
  ImageThumb,
  downloadAll,
  nextImageId,
  totalSizes,
  useImageBatch,
  type ImageEntry,
} from "./_shared";

export interface BatchToolProps {
  /** Builds the processing options for one image. */
  buildOptions: (entry: ImageEntry) => ProcessOptions;
  format: OutputFormat;
  /** Settings UI rendered between the dropzone and the action button. */
  settings?: React.ReactNode;
  actionLabel: string;
  zipName: string;
  hint?: React.ReactNode;
  accept?: typeof IMAGE_ACCEPT;
  inputAccept?: string;
  multiple?: boolean;
  /** Runs before processing; return an error message to block the run. */
  validate?: (entries: ImageEntry[]) => string | null;
  footer?: React.ReactNode;
  /** Called whenever the set of loaded images changes. */
  onEntriesChange?: (entries: ImageEntry[]) => void;
}

/**
 * The shared skeleton behind the batch image tools: load files, apply the same
 * transformation to each, show a before/after, and offer a combined download.
 */
export function BatchImageTool({
  buildOptions,
  format,
  settings,
  actionLabel,
  zipName,
  hint,
  accept = IMAGE_ACCEPT,
  inputAccept = IMAGE_INPUT_ACCEPT,
  multiple = true,
  validate,
  footer,
  onEntriesChange,
}: BatchToolProps) {
  const batch = useImageBatch();
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);

  const { entries, setEntries, setResult, clearResults, remove, clear } = batch;

  React.useEffect(() => {
    onEntriesChange?.(entries);
  }, [entries, onEntriesChange]);

  const addFiles = React.useCallback(
    async (files: File[]) => {
      setError(null);
      const added: ImageEntry[] = [];

      for (const file of files) {
        try {
          const { width, height } = await readDimensions(file);
          added.push({
            id: nextImageId(),
            file,
            previewUrl: URL.createObjectURL(file),
            width,
            height,
          });
        } catch {
          setError(`"${file.name}" could not be opened as an image.`);
        }
      }

      if (added.length > 0) {
        setEntries((previous) => (multiple ? [...previous, ...added] : added.slice(0, 1)));
      }
    },
    [multiple, setEntries],
  );

  const run = async () => {
    setError(null);

    const blocked = validate?.(entries);
    if (blocked) {
      setError(blocked);
      return;
    }

    clearResults();
    setProgress({ done: 0, total: entries.length });

    for (const [index, entry] of entries.entries()) {
      try {
        const result = await processImage(entry.file, buildOptions(entry));
        setResult(entry.id, { blob: result.blob, width: result.width, height: result.height });
      } catch (caught) {
        setError(
          caught instanceof Error && caught.message
            ? `${entry.file.name}: ${caught.message}`
            : `"${entry.file.name}" could not be processed.`,
        );
      }

      setProgress({ done: index + 1, total: entries.length });
      // Hand the main thread back so the progress bar actually paints.
      await yieldToBrowser();
    }

    setProgress(null);
  };

  const finished = entries.filter((entry) => entry.result);
  const sizes = totalSizes(entries);
  const saving =
    sizes.before > 0 && finished.length > 0
      ? ((sizes.before - sizes.after) / sizes.before) * 100
      : null;

  return (
    <ToolFrame>
      <div className="space-y-5">
        {entries.length === 0 ? (
          <Dropzone
            accept={accept}
            inputAccept={inputAccept}
            multiple={multiple}
            onFiles={(files) => void addFiles(files)}
            onError={setError}
            hint={hint ?? `Up to ${Math.round(accept.maxBytes / (1024 * 1024))} MB per image. Nothing is uploaded.`}
          />
        ) : (
          <>
            <ul className="space-y-2">
              {entries.map((entry) => (
                <ImageThumb key={entry.id} entry={entry} onRemove={remove} format={format} />
              ))}
            </ul>

            {multiple ? (
              <Dropzone
                accept={accept}
                inputAccept={inputAccept}
                multiple
                compact
                onFiles={(files) => void addFiles(files)}
                onError={setError}
                label="Add more images"
              />
            ) : null}
          </>
        )}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {entries.length > 0 ? (
          <>
            {settings}

            {progress ? (
              <ProgressIndicator
                value={(progress.done / Math.max(1, progress.total)) * 100}
                label={`Processing image ${progress.done} of ${progress.total}…`}
              />
            ) : null}

            {finished.length > 0 && !progress ? (
              <StatGrid className="sm:grid-cols-4">
                <Stat label="Images" value={String(finished.length)} />
                <Stat label="Before" value={formatBytes(sizes.before)} />
                <Stat label="After" value={formatBytes(sizes.after)} emphasis />
                <Stat
                  label={saving !== null && saving < 0 ? "Increase" : "Saved"}
                  value={saving === null ? "—" : `${Math.abs(saving).toFixed(0)}%`}
                  hint={saving !== null && saving < 0 ? "Output is larger" : undefined}
                />
              </StatGrid>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={run} loading={progress !== null}>
                {actionLabel}
              </Button>

              {finished.length > 0 && !progress ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void downloadAll(entries, format, zipName)}
                >
                  {finished.length === 1
                    ? `Download ${FORMAT_LABELS[format]}`
                    : `Download all ${finished.length} as ZIP`}
                </Button>
              ) : null}

              <ResetButton
                onReset={() => {
                  clear();
                  setError(null);
                }}
              >
                Clear all
              </ResetButton>
            </div>

            {footer}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
