"use client";

import * as React from "react";

import { Field, Input, Segmented } from "@/components/ui/field";
import type { DecodedImage } from "@/lib/image";

import { ImageTransformTool, paint } from "./_transform-tool";

const COMMON = [72, 150, 300, 600];

export default function ImageDpiChanger() {
  const [dpi, setDpi] = React.useState(300);
  const [mode, setMode] = React.useState<"keep" | "resample">("keep");
  const [widthMm, setWidthMm] = React.useState(0);

  const transform = React.useCallback(
    (image: DecodedImage) => {
      if (mode === "keep") {
        return paint(image.width, image.height, (context) => {
          context.drawImage(image.source, 0, 0, image.width, image.height);
        });
      }

      // Resampling changes the pixel count so the picture measures the given
      // width when printed at the chosen density.
      const inches = widthMm > 0 ? widthMm / 25.4 : image.width / 300;
      const targetWidth = Math.max(1, Math.round(inches * dpi));
      const targetHeight = Math.max(1, Math.round((targetWidth / image.width) * image.height));
      return paint(targetWidth, targetHeight, (context) => {
        context.imageSmoothingQuality = "high";
        context.drawImage(image.source, 0, 0, targetWidth, targetHeight);
      });
    },
    [dpi, mode, widthMm],
  );

  return (
    <ImageTransformTool
      suffix={`-${dpi}dpi`}
      format="image/png"
      transform={transform}
      controls={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">What to change</span>
            <Segmented
              name="dpi-mode"
              ariaLabel="What to change"
              value={mode}
              onChange={setMode}
              options={[
                { value: "keep", label: "Keep pixels" },
                { value: "resample", label: "Resize pixels" },
              ]}
            />
            <p className="text-xs text-fg-subtle">
              Keep pixels leaves the picture exactly as it is. Resize pixels recalculates it so that it
              measures the width below when printed at the chosen density.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Density (DPI)" htmlFor="dpi-value">
              <Input
                id="dpi-value"
                type="number"
                min={36}
                max={1200}
                value={dpi}
                onChange={(event) => setDpi(Math.max(36, Math.min(1200, Number(event.target.value) || 72)))}
              />
            </Field>
            {mode === "resample" ? (
              <Field label="Printed width (mm)" htmlFor="dpi-width" hint="Leave 0 to keep the current proportions">
                <Input
                  id="dpi-width"
                  type="number"
                  min={0}
                  max={2000}
                  value={widthMm}
                  onChange={(event) => setWidthMm(Math.max(0, Number(event.target.value) || 0))}
                />
              </Field>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {COMMON.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDpi(value)}
                className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-fg hover:border-border-strong"
              >
                {value} DPI
              </button>
            ))}
          </div>
        </div>
      }
      note={
        <p>
          DPI is a note about printed size, not picture quality. A 1200-pixel-wide photo prints 4 inches
          across at 300 DPI and 16 inches across at 75 DPI — the same pixels either way. Choose Resize
          pixels only when a printer has asked for a specific physical size.
        </p>
      }
    />
  );
}
