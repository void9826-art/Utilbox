"use client";

import * as React from "react";

import { Checkbox, Segmented, Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import type { OutputFormat, ProcessOptions } from "@/lib/image";

import { NumberField, parseNumber } from "../calculators/_shared";
import { BatchImageTool } from "./_batch-tool";

const QUALITY_NOTES: Array<{ max: number; note: string }> = [
  { max: 40, note: "Heavy compression — visible blocking around edges." },
  { max: 65, note: "Noticeable softening in fine detail." },
  { max: 85, note: "The practical sweet spot: large saving, no visible loss." },
  { max: 95, note: "Near-original quality, with a much smaller saving." },
  { max: 100, note: "Almost lossless, and barely smaller than the original." },
];

type Mode = "quality" | "target";

/** The limits application forms, portals and email most often ask for. */
const TARGET_PRESETS_KB = [20, 50, 100, 200, 500, 1024];

const presetLabel = (kb: number) => (kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`);

export default function CompressImage() {
  const [format, setFormat] = React.useState<OutputFormat>("image/jpeg");
  const [mode, setMode] = React.useState<Mode>("quality");
  const [quality, setQuality] = React.useState(80);
  const [targetKb, setTargetKb] = React.useState("100");
  const [limitSize, setLimitSize] = React.useState(false);
  const [maxWidth, setMaxWidth] = React.useState("1920");

  const note = QUALITY_NOTES.find((entry) => quality <= entry.max)?.note ?? "";
  // PNG has no quality setting, so a byte target cannot be searched for.
  const targeting = mode === "target" && format !== "image/png";
  const target = parseNumber(targetKb);
  const targetInvalid = targeting && (target === null || target < 5);

  const buildOptions = React.useCallback(
    (): ProcessOptions => ({
      format,
      quality: quality / 100,
      maxWidth: limitSize ? (parseNumber(maxWidth) ?? undefined) : undefined,
      background: format === "image/jpeg" ? "#ffffff" : undefined,
      // 1 KB is 1,024 bytes here, which is how upload forms measure their limits.
      targetBytes: targeting && target ? Math.floor(target * 1024) : undefined,
    }),
    [format, limitSize, maxWidth, quality, target, targeting],
  );

  return (
    <BatchImageTool
      format={format}
      buildOptions={buildOptions}
      actionLabel="Compress images"
      zipName="compressed-images.zip"
      validate={() => (targetInvalid ? "Enter a target size of at least 5 KB." : null)}
      settings={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Output format</span>
            <Segmented
              name="compress-format"
              ariaLabel="Output format"
              value={format}
              onChange={setFormat}
              options={[
                { value: "image/jpeg", label: "JPG" },
                { value: "image/webp", label: "WebP" },
                { value: "image/png", label: "PNG" },
              ]}
              className="sm:max-w-sm"
            />
            <p className="text-xs text-fg-subtle">
              {format === "image/webp"
                ? "WebP is typically 25–35% smaller than JPG at the same visible quality."
                : format === "image/png"
                  ? "PNG is lossless, so the quality slider has no effect. Resizing is the way to shrink a PNG."
                  : "JPG is the most widely supported format and the best choice for photographs."}
            </p>
          </div>

          {format !== "image/png" ? (
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Compress by</span>
              <Segmented
                name="compress-mode"
                ariaLabel="Compress by"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "quality", label: "Quality" },
                  { value: "target", label: "Target file size" },
                ]}
                className="sm:max-w-sm"
              />
            </div>
          ) : null}

          {format !== "image/png" && mode === "quality" ? (
            <div className="space-y-1">
              <Slider
                label="Quality"
                valueLabel={`${quality}%`}
                min={10}
                max={100}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
              />
              <p className="text-xs text-fg-subtle" aria-live="polite">
                {note}
              </p>
            </div>
          ) : null}

          {targeting ? (
            <div className="space-y-2">
              <NumberField
                id="compress-target"
                label="Maximum file size"
                value={targetKb}
                onChange={setTargetKb}
                suffix="KB"
                min={5}
                max={51200}
                step={1}
                className="sm:max-w-48"
                error={targetInvalid ? "Enter at least 5 KB." : undefined}
                hint="Each image gets the highest quality that fits. If quality alone is not enough, it is scaled down too."
              />
              <div className="flex flex-wrap gap-2" role="group" aria-label="Common size limits">
                {TARGET_PRESETS_KB.map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => setTargetKb(String(kb))}
                    aria-pressed={targetKb === String(kb)}
                    className="rounded-full border border-border px-3 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-accent-soft-border hover:text-fg aria-pressed:border-accent-soft-border aria-pressed:bg-accent-soft aria-pressed:text-accent-text"
                  >
                    {presetLabel(kb)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Checkbox
              label="Also limit the width"
              description="Resizing usually saves far more than quality alone."
              checked={limitSize}
              onChange={(event) => setLimitSize(event.target.checked)}
            />
            {limitSize ? (
              <NumberField
                id="compress-max-width"
                label="Maximum width"
                value={maxWidth}
                onChange={setMaxWidth}
                suffix="px"
                min={16}
                max={10000}
                step={1}
                className="sm:max-w-48"
                hint="Images narrower than this are left alone."
              />
            ) : null}
          </div>
        </div>
      }
      footer={
        format === "image/png" ? (
          <Alert tone="info" title="PNG cannot be compressed by quality">
            PNG stores every pixel exactly, so there is no quality to trade away. To make a PNG smaller,
            either limit its width above or convert it to WebP, which is lossless too but far more
            efficient. Choose JPG or WebP to compress to a target file size.
          </Alert>
        ) : null
      }
    />
  );
}
