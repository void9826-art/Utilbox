"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBlob } from "@/lib/download";
import { stripExtension } from "@/lib/files";
import { canvasToBlob, decodeImage, formatDimensions, type DecodedImage } from "@/lib/image";
import { formatBytes } from "@/lib/utils";

import { IMAGE_ACCEPT, IMAGE_INPUT_ACCEPT } from "./_shared";

/** A blur area, stored as fractions of the picture so it survives rescaling. */
interface Area {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

let sequence = 0;

export default function BlurFacesInPhoto() {
  const [file, setFile] = React.useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = React.useState<string | null>(null);
  const [image, setImage] = React.useState<DecodedImage | null>(null);
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [drag, setDrag] = React.useState<Area | null>(null);
  const [strength, setStrength] = React.useState(24);
  const [preview, setPreview] = React.useState<{ url: string; blob: Blob } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  const origin = React.useRef<{ x: number; y: number } | null>(null);
  /** The rectangle being dragged; a quick drag can finish before a re-render. */
  const latest = React.useRef<Area | null>(null);

  React.useEffect(() => () => image?.release(), [image]);
  React.useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview.url);
    },
    [preview],
  );
  React.useEffect(
    () => () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    },
    [sourceUrl],
  );

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);
    try {
      const decoded = await decodeImage(chosen);
      setFile(chosen);
      setAreas([]);
      setPreview(null);
      setSourceUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(chosen);
      });
      setImage((previous) => {
        previous?.release();
        return decoded;
      });
    } catch {
      setError("That image could not be read.");
    }
  };

  const positionOf = (event: React.PointerEvent<HTMLDivElement>) => {
    const surface = surfaceRef.current;
    if (!surface) return { x: 0, y: 0 };
    const box = surface.getBoundingClientRect();
    return {
      x: Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1),
      y: Math.min(Math.max((event.clientY - box.top) / box.height, 0), 1),
    };
  };

  const startArea = (event: React.PointerEvent<HTMLDivElement>) => {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* marking works without capture too */
    }
    const point = positionOf(event);
    origin.current = point;
    sequence += 1;
    latest.current = { id: `area-${sequence}`, x: point.x, y: point.y, width: 0, height: 0 };
    setDrag(latest.current);
    setPreview(null);
  };

  const growArea = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!origin.current || !latest.current) return;
    const point = positionOf(event);
    latest.current = {
      id: latest.current.id,
      x: Math.min(origin.current.x, point.x),
      y: Math.min(origin.current.y, point.y),
      width: Math.abs(point.x - origin.current.x),
      height: Math.abs(point.y - origin.current.y),
    };
    setDrag(latest.current);
  };

  const finishArea = () => {
    const rectangle = latest.current;
    if (rectangle && rectangle.width > 0.01 && rectangle.height > 0.01) {
      setAreas((previous) => [...previous, rectangle]);
    }
    origin.current = null;
    latest.current = null;
    setDrag(null);
  };

  const apply = async () => {
    if (!file || !image || areas.length === 0) return;
    setError(null);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("no canvas");

      context.drawImage(image.source, 0, 0, image.width, image.height);

      // Each area is redrawn through a blur filter from the original pixels, so
      // the detail inside it is destroyed rather than hidden behind an overlay.
      for (const area of areas) {
        context.save();
        context.beginPath();
        context.rect(area.x * image.width, area.y * image.height, area.width * image.width, area.height * image.height);
        context.clip();
        context.filter = `blur(${strength}px)`;
        context.drawImage(image.source, 0, 0, image.width, image.height);
        context.restore();
      }

      const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      setPreview((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { url: URL.createObjectURL(blob), blob };
      });
    } catch {
      setError("The picture could not be redrawn. Try a smaller image.");
    }
  };

  const reset = () => {
    setFile(null);
    setAreas([]);
    setPreview(null);
    setImage((previous) => {
      previous?.release();
      return null;
    });
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={IMAGE_ACCEPT}
            inputAccept={IMAGE_INPUT_ACCEPT}
            hint="Images up to 50 MB. Nothing is uploaded, which is the whole point for a photo you are about to share."
            onFiles={(files) => void load(files)}
            onError={setError}
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {file && image ? (
          <>
            <p className="text-sm font-medium text-fg">
              {file.name}
              <span className="ml-2 font-normal text-fg-muted">
                {formatDimensions(image.width, image.height)} · {areas.length} area
                {areas.length === 1 ? "" : "s"} marked
              </span>
            </p>

            <Alert tone="info" title="Drag across each face">
              The blur is applied to the picture itself, so the detail underneath is gone from the saved
              file rather than covered by a shape someone could move aside.
            </Alert>

            <div
              ref={surfaceRef}
              onPointerDown={startArea}
              onPointerMove={growArea}
              onPointerUp={finishArea}
              onPointerCancel={finishArea}
              className="relative block w-full max-w-2xl cursor-crosshair touch-none overflow-hidden rounded-lg border border-border bg-bg-muted"
            >
              {/* An object URL made in this page; next/image cannot optimise it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview ? preview.url : (sourceUrl ?? "")}
                alt="The photo being edited"
                className="pointer-events-none block h-auto w-full"
              />
              {[...areas, ...(drag ? [drag] : [])].map((area) => (
                <span
                  key={area.id}
                  className="pointer-events-none absolute border-2 border-accent bg-accent/25"
                  style={{
                    left: `${area.x * 100}%`,
                    top: `${area.y * 100}%`,
                    width: `${area.width * 100}%`,
                    height: `${area.height * 100}%`,
                  }}
                />
              ))}
            </div>

            <Slider
              label="Blur strength"
              valueLabel={`${strength} px`}
              min={6}
              max={60}
              step={2}
              value={strength}
              onChange={(event) => {
                setStrength(Number(event.target.value));
                setPreview(null);
              }}
            />

            {areas.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {areas.map((area, index) => (
                  <li key={area.id}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setAreas((previous) => previous.filter((entry) => entry.id !== area.id));
                        setPreview(null);
                      }}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Remove area {index + 1}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : null}

            {preview ? (
              <ResultPanel
                title="Your picture is ready"
                description={`${formatBytes(preview.blob.size)} · ${areas.length} area${areas.length === 1 ? "" : "s"} blurred into the image`}
                actions={
                  <Button
                    type="button"
                    onClick={() => downloadBlob(preview.blob, `${stripExtension(file.name)}-blurred.jpg`)}
                  >
                    Download picture
                  </Button>
                }
                onReset={reset}
                resetLabel="Choose another picture"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={() => void apply()} disabled={areas.length === 0}>
                  Apply blur
                </Button>
                <Button type="button" variant="ghost" onClick={reset}>
                  Choose another picture
                </Button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
