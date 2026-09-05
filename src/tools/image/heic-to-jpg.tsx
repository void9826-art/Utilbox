"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented, Slider } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadBlob, downloadZip } from "@/lib/download";
import { MAX_FILE_SIZE, withExtension, type AcceptOptions } from "@/lib/files";
import {
  FORMAT_EXTENSIONS,
  decodeHeic,
  processImage,
  readDimensions,
  type OutputFormat,
} from "@/lib/image";
import { formatBytes, yieldToBrowser } from "@/lib/utils";

import { ImageThumb, nextImageId, totalSizes, useImageBatch } from "./_shared";

const HEIC_ACCEPT: AcceptOptions = {
  kinds: ["heic"],
  maxBytes: MAX_FILE_SIZE.image,
  label: "HEIC",
};

export default function HeicToJpg() {
  const batch = useImageBatch();
  const { entries, setEntries, setResult, clearResults, remove, clear } = batch;

  const [format, setFormat] = React.useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = React.useState(90);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<{ done: number; total: number; stage: string } | null>(
    null,
  );
  const [decoderLoaded, setDecoderLoaded] = React.useState(false);

  const addFiles = React.useCallback(
    (files: File[]) => {
      setError(null);
      // HEIC cannot be decoded for a preview until conversion runs, so the
      // dimensions stay at zero until then rather than showing a wrong guess.
      setEntries((previous) => [
        ...previous,
        ...files.map((file) => ({
          id: nextImageId(),
          file,
          previewUrl: "",
          width: 0,
          height: 0,
        })),
      ]);
    },
    [setEntries],
  );

  const run = async () => {
    setError(null);
    clearResults();
    setProgress({ done: 0, total: entries.length, stage: "Loading the HEIC decoder…" });

    for (const [index, entry] of entries.entries()) {
      setProgress({
        done: index,
        total: entries.length,
        stage: `Decoding ${entry.file.name}…`,
      });

      try {
        // libheif is several megabytes; it downloads once and is then cached.
        const jpegBlob = await decodeHeic(entry.file, quality / 100);
        setDecoderLoaded(true);

        // Re-encode through the canvas so the chosen format and quality apply.
        const dimensions = await readDimensions(jpegBlob);
        const result =
          format === "image/jpeg" && quality === 90
            ? { blob: jpegBlob, width: dimensions.width, height: dimensions.height }
            : await processImage(jpegBlob, { format, quality: quality / 100 });

        setResult(entry.id, {
          blob: result.blob,
          width: result.width,
          height: result.height,
        });
      } catch {
        setError(
          `"${entry.file.name}" could not be decoded. It may not be a HEIC image, or it may use an unsupported variant.`,
        );
      }

      setProgress({ done: index + 1, total: entries.length, stage: "Converting…" });
      await yieldToBrowser();
    }

    setProgress(null);
  };

  const finished = entries.filter((entry) => entry.result);
  const sizes = totalSizes(entries);

  const downloadEverything = async () => {
    if (finished.length === 1) {
      downloadBlob(
        finished[0].result!.blob,
        withExtension(finished[0].file.name, FORMAT_EXTENSIONS[format]),
      );
      return;
    }
    const files = await Promise.all(
      finished.map(async (entry) => ({
        name: withExtension(entry.file.name, FORMAT_EXTENSIONS[format]),
        data: new Uint8Array(await entry.result!.blob.arrayBuffer()),
      })),
    );
    await downloadZip(files, "converted-photos.zip");
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {entries.length === 0 ? (
          <Dropzone
            accept={HEIC_ACCEPT}
            inputAccept=".heic,.heif,image/heic,image/heif"
            multiple
            onFiles={addFiles}
            onError={setError}
            hint="HEIC or HEIF photos, up to 50 MB each. Nothing is uploaded."
          />
        ) : (
          <>
            <ul className="space-y-2">
              {entries.map((entry) => (
                <ImageThumb
                  key={entry.id}
                  entry={entry}
                  onRemove={remove}
                  format={format}
                  showComparison={Boolean(entry.result)}
                />
              ))}
            </ul>
            <Dropzone
              accept={HEIC_ACCEPT}
              inputAccept=".heic,.heif,image/heic,image/heif"
              multiple
              compact
              onFiles={addFiles}
              onError={setError}
              label="Add more photos"
            />
          </>
        )}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {entries.length > 0 ? (
          <>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Convert to</span>
                <Segmented
                  name="heic-format"
                  ariaLabel="Output format"
                  value={format}
                  onChange={setFormat}
                  options={[
                    { value: "image/jpeg", label: "JPG" },
                    { value: "image/png", label: "PNG" },
                    { value: "image/webp", label: "WebP" },
                  ]}
                  className="sm:max-w-sm"
                />
              </div>

              {format !== "image/png" ? (
                <Slider
                  label="Quality"
                  valueLabel={`${quality}%`}
                  min={40}
                  max={100}
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  className="sm:max-w-md"
                />
              ) : null}
            </div>

            {progress ? (
              <ProgressIndicator
                value={(progress.done / Math.max(1, progress.total)) * 100}
                label={progress.stage}
              />
            ) : null}

            {finished.length > 0 && !progress ? (
              <StatGrid className="sm:grid-cols-3">
                <Stat label="Converted" value={String(finished.length)} />
                <Stat label="HEIC total" value={formatBytes(sizes.before)} />
                <Stat label="Output total" value={formatBytes(sizes.after)} emphasis />
              </StatGrid>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={run} loading={progress !== null}>
                Convert {entries.length} photo{entries.length === 1 ? "" : "s"}
              </Button>
              {finished.length > 0 && !progress ? (
                <Button type="button" variant="secondary" onClick={() => void downloadEverything()}>
                  {finished.length === 1 ? "Download" : `Download all ${finished.length} as ZIP`}
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
          </>
        ) : null}

        <Alert tone="info" title="The decoder loads once, then it is cached">
          HEIC uses HEVC compression, which browsers cannot decode natively because of patent licensing.
          A WebAssembly build of libheif is downloaded on the first conversion — a few megabytes — and
          then reused. {decoderLoaded ? "It is loaded now, so further conversions are fast." : ""} Your
          photos are decoded on your own device and never uploaded.
        </Alert>
      </div>
    </ToolFrame>
  );
}
