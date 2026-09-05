"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/field";
import { Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadBlob } from "@/lib/download";
import { withExtension } from "@/lib/files";
import { FORMAT_EXTENSIONS, processImage, readDimensions, type OutputFormat } from "@/lib/image";
import { clamp, cn, formatBytes } from "@/lib/utils";

import { NumberField, parseNumber } from "../calculators/_shared";
import { IMAGE_ACCEPT, IMAGE_INPUT_ACCEPT } from "./_shared";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const RATIOS: Array<{ label: string; value: number | null }> = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
];

type Handle = "nw" | "ne" | "sw" | "se" | "move";

export default function CropImage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState("");
  const [natural, setNatural] = React.useState({ width: 0, height: 0 });
  const [crop, setCrop] = React.useState<Rect>({ x: 0, y: 0, width: 0, height: 0 });
  const [ratio, setRatio] = React.useState<number | null>(null);
  const [format, setFormat] = React.useState<OutputFormat>("image/png");
  const [result, setResult] = React.useState<{ blob: Blob; url: string; width: number; height: number } | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const stageRef = React.useRef<HTMLDivElement>(null);
  // Mirrors the crop so the pointer-down handler can read the current rect
  // without being rebuilt on every frame of a drag.
  const cropRef = React.useRef(crop);
  React.useEffect(() => {
    cropRef.current = crop;
  }, [crop]);
  const dragRef = React.useRef<{ handle: Handle; startX: number; startY: number; origin: Rect } | null>(
    null,
  );

  React.useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result) URL.revokeObjectURL(result.url);
    },
    [previewUrl, result],
  );

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;

    setError(null);
    try {
      const dimensions = await readDimensions(chosen);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result) URL.revokeObjectURL(result.url);

      setFile(chosen);
      setPreviewUrl(URL.createObjectURL(chosen));
      setNatural(dimensions);
      setResult(null);
      // Start with a centred selection covering 80% of the image.
      setCrop({
        x: Math.round(dimensions.width * 0.1),
        y: Math.round(dimensions.height * 0.1),
        width: Math.round(dimensions.width * 0.8),
        height: Math.round(dimensions.height * 0.8),
      });
    } catch {
      setError("That image could not be opened.");
    }
  };

  /**
   * Converts a pointer position into image pixel coordinates.
   *
   * The preview is a scaled copy, so the ratio between the element's rendered
   * size and the image's real size maps one to the other. Only ever called
   * from a pointer handler, never during render.
   */
  const toImageSpace = React.useCallback(
    (clientX: number, clientY: number) => {
      const bounds = stageRef.current?.getBoundingClientRect();
      if (!bounds || bounds.width === 0 || bounds.height === 0) return { x: 0, y: 0 };
      return {
        x: ((clientX - bounds.left) / bounds.width) * natural.width,
        y: ((clientY - bounds.top) / bounds.height) * natural.height,
      };
    },
    [natural.height, natural.width],
  );

  const applyRatio = React.useCallback(
    (rect: Rect, anchor: Handle): Rect => {
      if (ratio === null) return rect;

      let width = rect.width;
      let height = width / ratio;

      if (height > natural.height) {
        height = natural.height;
        width = height * ratio;
      }

      // Keep the dragged corner where the pointer is; move the opposite one.
      const x = anchor === "ne" || anchor === "se" ? rect.x : rect.x + rect.width - width;
      const y = anchor === "sw" || anchor === "se" ? rect.y : rect.y + rect.height - height;

      return {
        x: clamp(x, 0, natural.width - width),
        y: clamp(y, 0, natural.height - height),
        width,
        height,
      };
    },
    [natural.height, natural.width, ratio],
  );

  /**
   * Choosing a ratio reshapes the current selection immediately. Doing it in
   * the click handler rather than an effect means the selection never paints
   * at the wrong shape first.
   */
  const chooseRatio = (next: number | null) => {
    setRatio(next);
    if (next === null || natural.width === 0) return;

    setCrop((previous) => {
      let width = previous.width;
      let height = width / next;
      if (height > natural.height) {
        height = natural.height;
        width = height * next;
      }
      return {
        x: clamp(previous.x, 0, natural.width - width),
        y: clamp(previous.y, 0, natural.height - height),
        width,
        height,
      };
    });
  };

  /**
   * One handler for the box and all four corners. The handle is read from the
   * element's data attribute rather than captured in a closure built during
   * render, so nothing here can run outside a pointer event.
   */
  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const handle = event.currentTarget.dataset.handle as Handle | undefined;
      if (!handle) return;

      event.preventDefault();
      event.stopPropagation();
      (event.target as Element).setPointerCapture(event.pointerId);

      const point = toImageSpace(event.clientX, event.clientY);
      dragRef.current = { handle, startX: point.x, startY: point.y, origin: cropRef.current };
    },
    [toImageSpace],
  );

  const onPointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;

    const point = toImageSpace(event.clientX, event.clientY);
    const deltaX = point.x - drag.startX;
    const deltaY = point.y - drag.startY;
    const origin = drag.origin;

    if (drag.handle === "move") {
      setCrop({
        ...origin,
        x: clamp(origin.x + deltaX, 0, natural.width - origin.width),
        y: clamp(origin.y + deltaY, 0, natural.height - origin.height),
      });
      return;
    }

    const MIN = 16;
    let { x, y, width, height } = origin;

    if (drag.handle === "se") {
      width = clamp(origin.width + deltaX, MIN, natural.width - origin.x);
      height = clamp(origin.height + deltaY, MIN, natural.height - origin.y);
    } else if (drag.handle === "sw") {
      const right = origin.x + origin.width;
      x = clamp(origin.x + deltaX, 0, right - MIN);
      width = right - x;
      height = clamp(origin.height + deltaY, MIN, natural.height - origin.y);
    } else if (drag.handle === "ne") {
      const bottom = origin.y + origin.height;
      y = clamp(origin.y + deltaY, 0, bottom - MIN);
      height = bottom - y;
      width = clamp(origin.width + deltaX, MIN, natural.width - origin.x);
    } else {
      const right = origin.x + origin.width;
      const bottom = origin.y + origin.height;
      x = clamp(origin.x + deltaX, 0, right - MIN);
      y = clamp(origin.y + deltaY, 0, bottom - MIN);
      width = right - x;
      height = bottom - y;
    }

    setCrop(applyRatio({ x, y, width, height }, drag.handle));
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const setNumericCrop = (key: keyof Rect, value: string) => {
    const parsed = parseNumber(value);
    if (parsed === null) return;
    setCrop((previous) => {
      const next = { ...previous, [key]: Math.round(parsed) };
      return {
        x: clamp(next.x, 0, Math.max(0, natural.width - 1)),
        y: clamp(next.y, 0, Math.max(0, natural.height - 1)),
        width: clamp(next.width, 1, natural.width - next.x),
        height: clamp(next.height, 1, natural.height - next.y),
      };
    });
  };

  const runCrop = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);

    try {
      const output = await processImage(file, {
        format,
        quality: 0.92,
        sourceRect: {
          x: Math.round(crop.x),
          y: Math.round(crop.y),
          width: Math.round(crop.width),
          height: Math.round(crop.height),
        },
        background: format === "image/jpeg" ? "#ffffff" : undefined,
      });

      if (result) URL.revokeObjectURL(result.url);
      setResult({
        blob: output.blob,
        url: URL.createObjectURL(output.blob),
        width: output.width,
        height: output.height,
      });
    } catch {
      setError("The crop could not be applied. Try a slightly smaller selection.");
    } finally {
      setBusy(false);
    }
  };

  const percent = (value: number, total: number) => `${(value / total) * 100}%`;

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={IMAGE_ACCEPT}
            inputAccept={IMAGE_INPUT_ACCEPT}
            onFiles={(files) => void load(files)}
            onError={setError}
            hint="One image at a time, up to 50 MB. Nothing is uploaded."
          />
        ) : (
          <>
            <div
              ref={stageRef}
              className="relative mx-auto max-h-[28rem] w-fit max-w-full touch-none overflow-hidden rounded-lg border border-border bg-surface-sunken select-none"
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {/* Object URL of a user file; next/image cannot optimise it. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="The image being cropped"
                className="block max-h-[28rem] w-auto max-w-full"
                draggable={false}
              />

              {natural.width > 0 ? (
                <>
                  {/* Dim everything outside the selection. */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-black/45"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${percent(crop.x, natural.width)} ${percent(crop.y, natural.height)}, ${percent(crop.x, natural.width)} ${percent(crop.y + crop.height, natural.height)}, ${percent(crop.x + crop.width, natural.width)} ${percent(crop.y + crop.height, natural.height)}, ${percent(crop.x + crop.width, natural.width)} ${percent(crop.y, natural.height)}, ${percent(crop.x, natural.width)} ${percent(crop.y, natural.height)})`,
                    }}
                    aria-hidden="true"
                  />

                  <div
                    role="group"
                    aria-label="Crop selection"
                    className="absolute cursor-move border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
                    style={{
                      left: percent(crop.x, natural.width),
                      top: percent(crop.y, natural.height),
                      width: percent(crop.width, natural.width),
                      height: percent(crop.height, natural.height),
                    }}
                    data-handle="move"
                    onPointerDown={onPointerDown}
                  >
                    {/* Rule-of-thirds guides. */}
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                      <div className="absolute top-1/3 right-0 left-0 border-t border-white/40" />
                      <div className="absolute top-2/3 right-0 left-0 border-t border-white/40" />
                      <div className="absolute top-0 bottom-0 left-1/3 border-l border-white/40" />
                      <div className="absolute top-0 bottom-0 left-2/3 border-l border-white/40" />
                    </div>

                    {(["nw", "ne", "sw", "se"] as const).map((handle) => (
                      <span
                        key={handle}
                        data-handle={handle}
                        onPointerDown={onPointerDown}
                        className={cn(
                          "absolute size-4 rounded-full border-2 border-white bg-accent shadow",
                          handle === "nw" && "-top-2 -left-2 cursor-nwse-resize",
                          handle === "ne" && "-top-2 -right-2 cursor-nesw-resize",
                          handle === "sw" && "-bottom-2 -left-2 cursor-nesw-resize",
                          handle === "se" && "-right-2 -bottom-2 cursor-nwse-resize",
                        )}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Aspect ratio</span>
              <div className="flex flex-wrap gap-2">
                {RATIOS.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => chooseRatio(option.value)}
                    aria-pressed={ratio === option.value}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                      ratio === option.value
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <NumberField
                id="crop-x"
                label="Left"
                value={String(Math.round(crop.x))}
                onChange={(value) => setNumericCrop("x", value)}
                suffix="px"
                min={0}
                step={1}
              />
              <NumberField
                id="crop-y"
                label="Top"
                value={String(Math.round(crop.y))}
                onChange={(value) => setNumericCrop("y", value)}
                suffix="px"
                min={0}
                step={1}
              />
              <NumberField
                id="crop-width"
                label="Width"
                value={String(Math.round(crop.width))}
                onChange={(value) => setNumericCrop("width", value)}
                suffix="px"
                min={1}
                step={1}
              />
              <NumberField
                id="crop-height"
                label="Height"
                value={String(Math.round(crop.height))}
                onChange={(value) => setNumericCrop("height", value)}
                suffix="px"
                min={1}
                step={1}
              />
            </div>

            <div className="space-y-1.5 sm:max-w-sm">
              <span className="block text-[0.8125rem] font-medium text-fg">Output format</span>
              <Segmented
                name="crop-format"
                ariaLabel="Output format"
                value={format}
                onChange={setFormat}
                options={[
                  { value: "image/png", label: "PNG" },
                  { value: "image/jpeg", label: "JPG" },
                  { value: "image/webp", label: "WebP" },
                ]}
              />
            </div>

            <ErrorMessage message={error} onDismiss={() => setError(null)} />

            <StatGrid className="sm:grid-cols-3">
              <Stat label="Original" value={`${natural.width} × ${natural.height}`} />
              <Stat
                label="Crop"
                value={`${Math.round(crop.width)} × ${Math.round(crop.height)}`}
                emphasis
              />
              <Stat
                label="Area kept"
                value={`${(((crop.width * crop.height) / (natural.width * natural.height)) * 100).toFixed(0)}%`}
              />
            </StatGrid>

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={runCrop} loading={busy}>
                Crop image
              </Button>
              {result ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    downloadBlob(result.blob, withExtension(file.name, FORMAT_EXTENSIONS[format]))
                  }
                >
                  Download ({formatBytes(result.blob.size)})
                </Button>
              ) : null}
              <ResetButton
                onReset={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  if (result) URL.revokeObjectURL(result.url);
                  setFile(null);
                  setPreviewUrl("");
                  setResult(null);
                  setError(null);
                }}
              >
                Choose another image
              </ResetButton>
            </div>

            {result ? (
              <div className="space-y-2">
                <h2 className="text-[0.8125rem] font-medium text-fg">
                  Result — {result.width} × {result.height} px
                </h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="The cropped result"
                  className="max-h-80 rounded-lg border border-border"
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </ToolFrame>
  );
}
