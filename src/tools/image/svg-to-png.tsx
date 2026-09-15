"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { downloadBlob } from "@/lib/download";
import { MAX_FILE_SIZE, stripExtension, type AcceptOptions } from "@/lib/files";
import { formatDimensions } from "@/lib/image";
import { formatBytes } from "@/lib/utils";

const ACCEPT: AcceptOptions = { kinds: ["svg"], maxBytes: MAX_FILE_SIZE.image, label: "SVG" };

/**
 * Draws an SVG at a chosen pixel width.
 *
 * An SVG has no inherent pixel size, so the target width is applied when it is
 * drawn. That is what keeps the result sharp: the vector is rasterised at the
 * size asked for rather than being scaled up from a small bitmap.
 */
function rasterise(
  text: string,
  width: number,
  transparent: boolean,
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
    const image = new Image();

    image.onload = () => {
      const ratio = image.height > 0 && image.width > 0 ? image.height / image.width : 1;
      const targetWidth = Math.max(1, Math.round(width));
      const targetHeight = Math.max(1, Math.round(targetWidth * ratio));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("no canvas"));
        return;
      }

      if (!transparent) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, targetWidth, targetHeight);
      }
      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (blob) resolve({ blob, width: targetWidth, height: targetHeight });
        else reject(new Error("encode failed"));
      }, "image/png");
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That SVG could not be drawn."));
    };

    image.src = url;
  });
}

export default function SvgToPng() {
  const [file, setFile] = React.useState<File | null>(null);
  const [text, setText] = React.useState("");
  const [width, setWidth] = React.useState(1024);
  const [transparent, setTransparent] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ blob: Blob; width: number; height: number; url: string } | null>(null);

  React.useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result.url);
    },
    [result],
  );

  const render = async (source: string, targetWidth: number, keepTransparent: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const output = await rasterise(source, targetWidth, keepTransparent);
      setResult((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { ...output, url: URL.createObjectURL(output.blob) };
      });
    } catch {
      setError("That SVG could not be drawn. Files that pull in external images or fonts cannot be rendered here.");
    } finally {
      setBusy(false);
    }
  };

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    const source = await chosen.text();
    setFile(chosen);
    setText(source);
    await render(source, width, transparent);
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={ACCEPT}
            inputAccept="image/svg+xml,.svg"
            hint="SVG files up to 50 MB. Nothing is uploaded — the drawing happens on your device."
            onFiles={(files) => void load(files)}
            onError={setError}
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        {busy ? <ProgressIndicator label="Drawing the SVG…" /> : null}

        {file ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">{formatBytes(file.size)}</span>
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Output width in pixels"
                htmlFor="svg-width"
                hint="The height follows the drawing's proportions"
              >
                <Input
                  id="svg-width"
                  type="number"
                  min={16}
                  max={8000}
                  value={width}
                  onChange={(event) => setWidth(Math.max(16, Math.min(8000, Number(event.target.value) || 16)))}
                />
              </Field>
              <div className="flex items-end">
                <Checkbox
                  label="Keep the background transparent"
                  description="Untick to place the drawing on white."
                  checked={transparent}
                  onChange={(event) => setTransparent(event.target.checked)}
                />
              </div>
            </div>

            <Button type="button" onClick={() => void render(text, width, transparent)} loading={busy}>
              Render at this size
            </Button>

            {result ? (
              <>
                <figure className="space-y-1.5">
                  <figcaption className="text-xs text-fg-subtle">
                    {formatDimensions(result.width, result.height)} · {formatBytes(result.blob.size)}
                  </figcaption>
                  <span className="block overflow-hidden rounded-lg border border-border bg-bg-muted">
                    {/* An object URL made in this page; next/image cannot optimise it. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={result.url} alt="The rendered picture" className="mx-auto block max-h-96 w-auto" />
                  </span>
                </figure>

                <ResultPanel
                  title="Your PNG is ready"
                  description={`${formatDimensions(result.width, result.height)} · ${formatBytes(result.blob.size)}`}
                  actions={
                    <Button type="button" onClick={() => downloadBlob(result.blob, `${stripExtension(file.name)}.png`)}>
                      Download PNG
                    </Button>
                  }
                  onReset={() => {
                    setFile(null);
                    setResult(null);
                  }}
                  resetLabel="Convert another SVG"
                />
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
