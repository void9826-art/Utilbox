"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { downloadBlob } from "@/lib/download";
import { stripExtension, type AcceptOptions } from "@/lib/files";
import {
  FORMAT_EXTENSIONS,
  canvasToBlob,
  decodeImage,
  formatDimensions,
  type DecodedImage,
  type OutputFormat,
} from "@/lib/image";
import { formatBytes } from "@/lib/utils";

import { IMAGE_ACCEPT, IMAGE_INPUT_ACCEPT } from "./_shared";

export interface ImageTransformToolProps {
  accept?: AcceptOptions;
  inputAccept?: string;
  hint?: React.ReactNode;
  /** The tool's own option controls, shown once a picture is loaded. */
  controls?: React.ReactNode;
  /**
   * Draws the result. Wrap it in useCallback with the options as dependencies:
   * the preview is redrawn whenever this function changes, which is what makes
   * the controls feel live.
   */
  transform: (image: DecodedImage) => HTMLCanvasElement | null;
  format?: OutputFormat;
  quality?: number;
  /** Appended to the original file name, e.g. "-circle". */
  suffix: string;
  note?: React.ReactNode;
  actionLabel?: string;
}

/**
 * The shared body of the single-picture tools.
 *
 * Every one of them is the same shape — take one image, redraw it, hand it
 * back — so they share the loading, live preview and download handling and
 * differ only in their controls and their drawing step.
 */
export function ImageTransformTool({
  accept = IMAGE_ACCEPT,
  inputAccept = IMAGE_INPUT_ACCEPT,
  hint = "Images up to 50 MB. Nothing is uploaded — the work happens on your device.",
  controls,
  transform,
  format = "image/png",
  quality = 92,
  suffix,
  note,
  actionLabel = "Download",
}: ImageTransformToolProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [image, setImage] = React.useState<DecodedImage | null>(null);
  const [preview, setPreview] = React.useState<{ url: string; blob: Blob; width: number; height: number } | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // The decoded bitmap and the preview URL both hold memory until released.
  React.useEffect(() => () => image?.release(), [image]);
  React.useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview.url);
    },
    [preview],
  );

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    setBusy(true);
    try {
      const decoded = await decodeImage(chosen);
      setFile(chosen);
      setImage((previous) => {
        previous?.release();
        return decoded;
      });
    } catch {
      setError("That image could not be read. It may be damaged or in a format this browser cannot open.");
    } finally {
      setBusy(false);
    }
  };

  React.useEffect(() => {
    if (!image) return;
    let cancelled = false;

    const run = async () => {
      try {
        const canvas = transform(image);
        if (!canvas || canvas.width < 1 || canvas.height < 1) return;
        const blob = await canvasToBlob(canvas, format, quality / 100);
        if (cancelled) return;
        setPreview((previous) => {
          if (previous) URL.revokeObjectURL(previous.url);
          return { url: URL.createObjectURL(blob), blob, width: canvas.width, height: canvas.height };
        });
      } catch {
        if (!cancelled) setError("The image could not be redrawn. Try a smaller picture.");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [image, transform, format, quality]);

  const reset = () => {
    setFile(null);
    setImage((previous) => {
      previous?.release();
      return null;
    });
    setPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous.url);
      return null;
    });
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={accept}
            inputAccept={inputAccept}
            hint={hint}
            onFiles={(files) => void load(files)}
            onError={setError}
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        {busy ? <ProgressIndicator label="Reading the image…" /> : null}

        {file && image ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">
                {formatDimensions(image.width, image.height)} · {formatBytes(file.size)}
              </span>
            </p>

            {controls}

            {preview ? (
              <>
                <figure className="space-y-1.5">
                  <figcaption className="text-xs text-fg-subtle">
                    Result — {formatDimensions(preview.width, preview.height)} · {formatBytes(preview.blob.size)}
                  </figcaption>
                  <span className="block overflow-hidden rounded-lg border border-border bg-bg-muted">
                    {/* An object URL made in this page; next/image cannot optimise it. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview.url} alt="The edited picture" className="mx-auto block max-h-96 w-auto" />
                  </span>
                </figure>

                <ResultPanel
                  title="Your picture is ready"
                  description={`${formatDimensions(preview.width, preview.height)} · ${formatBytes(preview.blob.size)}`}
                  actions={
                    <Button
                      type="button"
                      onClick={() =>
                        downloadBlob(preview.blob, `${stripExtension(file.name)}${suffix}.${FORMAT_EXTENSIONS[format]}`)
                      }
                    >
                      {actionLabel}
                    </Button>
                  }
                  onReset={reset}
                  resetLabel="Choose another picture"
                />
              </>
            ) : null}

            {note ? <div className="text-sm text-fg-muted">{note}</div> : null}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}

/** Creates a canvas of the given size and runs `draw` against its context. */
export function paint(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void,
): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");
  if (!context) return null;
  draw(context);
  return canvas;
}
