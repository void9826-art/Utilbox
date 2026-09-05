"use client";

import * as React from "react";
import { Link2, Link2Off } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Segmented, Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import type { OutputFormat, ProcessOptions } from "@/lib/image";
import { cn } from "@/lib/utils";

import { NumberField, parseNumber } from "../calculators/_shared";
import { BatchImageTool } from "./_batch-tool";
import type { ImageEntry } from "./_shared";

const PRESETS = [
  { label: "Full HD — 1920px", width: 1920 },
  { label: "Web hero — 1600px", width: 1600 },
  { label: "Blog image — 1200px", width: 1200 },
  { label: "Thumbnail — 400px", width: 400 },
  { label: "Avatar — 200px", width: 200 },
];

export default function ResizeImage() {
  const [mode, setMode] = React.useState<"pixels" | "percent">("pixels");
  const [width, setWidth] = React.useState("1200");
  const [height, setHeight] = React.useState("");
  const [percent, setPercent] = React.useState(50);
  const [lockAspect, setLockAspect] = React.useState(true);
  const [format, setFormat] = React.useState<OutputFormat>("image/jpeg");
  const [entries, setEntries] = React.useState<ImageEntry[]>([]);

  const first = entries[0];
  const widthValue = parseNumber(width);
  const heightValue = parseNumber(height);

  // With the aspect lock on, editing one dimension recomputes the other from
  // the first image's real ratio rather than guessing.
  const linkedHeight = React.useMemo(() => {
    if (!first || !lockAspect || widthValue === null) return null;
    return Math.round((widthValue / first.width) * first.height);
  }, [first, lockAspect, widthValue]);

  const upscaling = React.useMemo(() => {
    if (!first) return false;
    if (mode === "percent") return percent > 100;
    return widthValue !== null && widthValue > first.width;
  }, [first, mode, percent, widthValue]);

  const buildOptions = React.useCallback(
    (entry: ImageEntry): ProcessOptions => {
      if (mode === "percent") {
        const scale = percent / 100;
        return {
          format,
          quality: 0.9,
          // Upscaling is opted into here because enlarging is exactly what a
          // scale above 100% is asking for.
          sourceRect: { x: 0, y: 0, width: entry.width, height: entry.height },
          maxWidth: Math.max(1, Math.round(entry.width * scale)),
          maxHeight: Math.max(1, Math.round(entry.height * scale)),
          allowUpscale: true,
          background: format === "image/jpeg" ? "#ffffff" : undefined,
        };
      }

      const targetWidth = widthValue ?? entry.width;
      const targetHeight = lockAspect
        ? Math.round((targetWidth / entry.width) * entry.height)
        : (heightValue ?? entry.height);

      return {
        format,
        quality: 0.92,
        sourceRect: { x: 0, y: 0, width: entry.width, height: entry.height },
        maxWidth: targetWidth,
        maxHeight: lockAspect ? undefined : targetHeight,
        allowUpscale: true,
        background: format === "image/jpeg" ? "#ffffff" : undefined,
      };
    },
    [format, heightValue, lockAspect, mode, percent, widthValue],
  );

  return (
    <BatchImageTool
      format={format}
      buildOptions={buildOptions}
      onEntriesChange={setEntries}
      actionLabel="Resize images"
      zipName="resized-images.zip"
      validate={() => {
        if (mode === "pixels" && (widthValue === null || widthValue < 1)) {
          return "Enter a target width of at least 1 pixel.";
        }
        if (mode === "pixels" && !lockAspect && (heightValue === null || heightValue < 1)) {
          return "With the aspect ratio unlocked, both a width and a height are needed.";
        }
        return null;
      }}
      settings={
        <div className="space-y-4">
          <Segmented
            name="resize-mode"
            ariaLabel="Resize mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "pixels", label: "By pixels" },
              { value: "percent", label: "By percentage" },
            ]}
            className="sm:max-w-xs"
          />

          {mode === "pixels" ? (
            <>
              <div className="flex items-end gap-2">
                <NumberField
                  id="resize-width"
                  label="Width"
                  value={width}
                  onChange={setWidth}
                  suffix="px"
                  min={1}
                  max={20000}
                  step={1}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant={lockAspect ? "primary" : "secondary"}
                  size="icon"
                  onClick={() => setLockAspect((previous) => !previous)}
                  aria-pressed={lockAspect}
                  aria-label={lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                  title={lockAspect ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                  className="mb-[1px]"
                >
                  {lockAspect ? (
                    <Link2 className="size-4" aria-hidden="true" />
                  ) : (
                    <Link2Off className="size-4" aria-hidden="true" />
                  )}
                </Button>
                <NumberField
                  id="resize-height"
                  label="Height"
                  value={lockAspect ? (linkedHeight !== null ? String(linkedHeight) : "") : height}
                  onChange={setHeight}
                  suffix="px"
                  min={1}
                  max={20000}
                  step={1}
                  className="flex-1"
                  hint={lockAspect ? "Calculated from the first image" : undefined}
                />
              </div>

              <div>
                <span className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
                  Common widths
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.width}
                      type="button"
                      onClick={() => setWidth(String(preset.width))}
                      aria-pressed={widthValue === preset.width}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                        widthValue === preset.width
                          ? "border-accent-soft-border bg-accent-soft text-accent-text"
                          : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Slider
              label="Scale"
              valueLabel={`${percent}%`}
              min={5}
              max={200}
              step={5}
              value={percent}
              onChange={(event) => setPercent(Number(event.target.value))}
            />
          )}

          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Output format</span>
            <Segmented
              name="resize-format"
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

          {first ? (
            <p className="text-xs text-fg-subtle">
              First image is {first.width} × {first.height} px.
            </p>
          ) : null}
        </div>
      }
      footer={
        upscaling ? (
          <Alert tone="warning" title="This will enlarge the image">
            Scaling up interpolates between existing pixels; it cannot recover detail that was never
            captured. Beyond about 150% the result starts to look soft.
          </Alert>
        ) : null
      }
    />
  );
}
