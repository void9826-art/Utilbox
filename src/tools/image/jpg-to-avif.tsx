"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBlob } from "@/lib/download";
import { MAX_FILE_SIZE, stripExtension, type AcceptOptions } from "@/lib/files";
import { decodeImage, formatDimensions } from "@/lib/image";
import { formatBytes } from "@/lib/utils";

const ACCEPT: AcceptOptions = { kinds: ["jpeg"], maxBytes: MAX_FILE_SIZE.image, label: "JPG" };

/** True when this browser can actually encode AVIF, not merely display it. */
async function canEncodeAvif(): Promise<boolean> {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/avif"));
  return blob?.type === "image/avif";
}

export default function JpgToAvif() {
  const [supported, setSupported] = React.useState<boolean | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [quality, setQuality] = React.useState(60);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ blob: Blob; width: number; height: number } | null>(null);

  React.useEffect(() => {
    void canEncodeAvif().then(setSupported);
  }, []);

  const convert = async (chosen: File, chosenQuality: number) => {
    setBusy(true);
    setError(null);
    try {
      const image = await decodeImage(chosen);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("no canvas");
        context.drawImage(image.source, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/avif", chosenQuality / 100),
        );
        if (!blob || blob.type !== "image/avif") throw new Error("not avif");
        setResult({ blob, width: image.width, height: image.height });
      } finally {
        image.release();
      }
    } catch {
      setError("That picture could not be converted. It may be damaged, or too large for this browser to encode.");
    } finally {
      setBusy(false);
    }
  };

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setFile(chosen);
    setResult(null);
    await convert(chosen, quality);
  };

  if (supported === false) {
    return (
      <ToolFrame>
        <Alert tone="warning" title="This browser cannot create AVIF files">
          AVIF encoding is not available here, so this tool would produce nothing. Chrome and Edge on a
          desktop can do it today; Firefox and Safari can display AVIF but not write it. The WebP
          converter works everywhere and gets most of the same saving.
        </Alert>
      </ToolFrame>
    );
  }

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={ACCEPT}
            inputAccept="image/jpeg,.jpg,.jpeg"
            hint="JPG files up to 50 MB. Nothing is uploaded — the work happens on your device."
            onFiles={(files) => void load(files)}
            onError={setError}
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        {busy ? <ProgressIndicator label="Encoding AVIF — this is slower than JPG…" /> : null}

        {file ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">{formatBytes(file.size)}</span>
            </p>

            <Slider
              label="Quality"
              valueLabel={`${quality}%`}
              min={30}
              max={95}
              step={5}
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
            />

            <Button type="button" onClick={() => void convert(file, quality)} loading={busy}>
              Convert at this quality
            </Button>

            {result ? (
              <ResultPanel
                title="Your AVIF is ready"
                description={`${formatDimensions(result.width, result.height)} · ${formatBytes(result.blob.size)} · ${Math.max(0, Math.round((1 - result.blob.size / file.size) * 100))}% smaller than the JPG`}
                actions={
                  <Button type="button" onClick={() => downloadBlob(result.blob, `${stripExtension(file.name)}.avif`)}>
                    Download AVIF
                  </Button>
                }
                onReset={() => {
                  setFile(null);
                  setResult(null);
                }}
                resetLabel="Convert another picture"
              />
            ) : null}

            <p className="text-sm text-fg-muted">
              AVIF usually beats both JPG and WebP at the same visual quality, often by a wide margin on
              photographs. It is slower to encode, which is why this takes a moment, and every current
              browser can display it even where it cannot create it.
            </p>
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
