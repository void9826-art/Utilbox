"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadBlob, downloadZip } from "@/lib/download";
import { MAX_FILE_SIZE, withExtension, type AcceptOptions } from "@/lib/files";
import { FORMAT_EXTENSIONS, formatDimensions, type OutputFormat } from "@/lib/image";
import { cn, formatBytes } from "@/lib/utils";

export const IMAGE_ACCEPT: AcceptOptions = {
  kinds: ["jpeg", "png", "webp", "gif", "bmp"],
  maxBytes: MAX_FILE_SIZE.image,
  label: "image",
};

export const IMAGE_INPUT_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/bmp,.jpg,.jpeg,.png,.webp,.gif,.bmp";

export interface ImageEntry {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  /** Populated once the tool has produced an output for this image. */
  result?: { blob: Blob; url: string; width: number; height: number };
}

let sequence = 0;
export function nextImageId(): string {
  sequence += 1;
  return `image-${sequence}`;
}

/**
 * Owns the object URLs for a batch of images and revokes them on unmount,
 * which is the difference between a tool you can use all day and one that
 * slowly eats a gigabyte of memory.
 */
export function useImageBatch() {
  const [entries, setEntries] = React.useState<ImageEntry[]>([]);
  const entriesRef = React.useRef<ImageEntry[]>([]);

  React.useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  React.useEffect(
    () => () => {
      for (const entry of entriesRef.current) {
        URL.revokeObjectURL(entry.previewUrl);
        if (entry.result) URL.revokeObjectURL(entry.result.url);
      }
    },
    [],
  );

  const remove = React.useCallback((id: string) => {
    setEntries((previous) => {
      const target = previous.find((entry) => entry.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.result) URL.revokeObjectURL(target.result.url);
      }
      return previous.filter((entry) => entry.id !== id);
    });
  }, []);

  const clear = React.useCallback(() => {
    setEntries((previous) => {
      for (const entry of previous) {
        URL.revokeObjectURL(entry.previewUrl);
        if (entry.result) URL.revokeObjectURL(entry.result.url);
      }
      return [];
    });
  }, []);

  /** Replaces a previous result, revoking the URL it held. */
  const setResult = React.useCallback(
    (id: string, result: { blob: Blob; width: number; height: number }) => {
      setEntries((previous) =>
        previous.map((entry) => {
          if (entry.id !== id) return entry;
          if (entry.result) URL.revokeObjectURL(entry.result.url);
          return { ...entry, result: { ...result, url: URL.createObjectURL(result.blob) } };
        }),
      );
    },
    [],
  );

  const clearResults = React.useCallback(() => {
    setEntries((previous) =>
      previous.map((entry) => {
        if (entry.result) URL.revokeObjectURL(entry.result.url);
        return { ...entry, result: undefined };
      }),
    );
  }, []);

  return { entries, setEntries, remove, clear, setResult, clearResults };
}

export function ImageThumb({
  entry,
  onRemove,
  format,
  showComparison = true,
}: {
  entry: ImageEntry;
  onRemove?: (id: string) => void;
  format?: OutputFormat;
  showComparison?: boolean;
}) {
  const saving =
    entry.result && entry.file.size > 0
      ? ((entry.file.size - entry.result.blob.size) / entry.file.size) * 100
      : null;

  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5">
      {/* Object URLs of user files cannot be optimised by next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={entry.result?.url ?? entry.previewUrl}
        alt=""
        className="size-14 shrink-0 rounded border border-border bg-surface-sunken object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg" title={entry.file.name}>
          {entry.file.name}
        </p>
        <p className="tabular text-xs text-fg-subtle">
          {formatDimensions(entry.width, entry.height)} · {formatBytes(entry.file.size)}
        </p>

        {entry.result && showComparison ? (
          <p className="tabular mt-0.5 text-xs">
            <span className="text-fg-muted">
              → {formatDimensions(entry.result.width, entry.result.height)} ·{" "}
              {formatBytes(entry.result.blob.size)}
            </span>
            {saving !== null ? (
              <span
                className={cn(
                  "ml-1.5 font-medium",
                  saving > 0 ? "text-fg" : saving < 0 ? "text-fg underline decoration-dotted" : "text-fg-muted",
                )}
              >
                {saving > 0 ? `−${saving.toFixed(0)}%` : saving < 0 ? `+${Math.abs(saving).toFixed(0)}%` : "no change"}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {entry.result ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() =>
              downloadBlob(
                entry.result!.blob,
                withExtension(entry.file.name, format ? FORMAT_EXTENSIONS[format] : "png"),
              )
            }
          >
            Save
          </Button>
        ) : null}
        {onRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${entry.file.name}`}
            onClick={() => onRemove(entry.id)}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    </li>
  );
}

/** Bundles every finished image into a single ZIP download. */
export async function downloadAll(
  entries: ImageEntry[],
  format: OutputFormat,
  zipName: string,
): Promise<void> {
  const done = entries.filter((entry) => entry.result);
  if (done.length === 0) return;

  if (done.length === 1) {
    downloadBlob(
      done[0].result!.blob,
      withExtension(done[0].file.name, FORMAT_EXTENSIONS[format]),
    );
    return;
  }

  const files = await Promise.all(
    done.map(async (entry) => ({
      name: withExtension(entry.file.name, FORMAT_EXTENSIONS[format]),
      data: new Uint8Array(await entry.result!.blob.arrayBuffer()),
    })),
  );

  await downloadZip(files, zipName);
}

/**
 * Totals across the images that have actually been processed.
 *
 * Entries still waiting are excluded from both sides: counting their original
 * size against an output they do not have yet would report a saving far larger
 * than anything that happened.
 */
export function totalSizes(entries: ImageEntry[]): { before: number; after: number } {
  return entries
    .filter((entry) => entry.result)
    .reduce(
      (totals, entry) => ({
        before: totals.before + entry.file.size,
        after: totals.after + entry.result!.blob.size,
      }),
      { before: 0, after: 0 },
    );
}
