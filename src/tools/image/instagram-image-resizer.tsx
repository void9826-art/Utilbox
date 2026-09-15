"use client";

import * as React from "react";

import { Field, Input, Segmented } from "@/components/ui/field";
import type { DecodedImage } from "@/lib/image";

import { ImageTransformTool, paint } from "./_transform-tool";

/** The sizes the app actually stores, at their published aspect ratios. */
const PRESETS = [
  { value: "square", label: "Square post", width: 1080, height: 1080 },
  { value: "portrait", label: "Portrait post", width: 1080, height: 1350 },
  { value: "landscape", label: "Landscape post", width: 1080, height: 566 },
  { value: "story", label: "Story or Reel", width: 1080, height: 1920 },
];

type Fit = "cover" | "contain";

export default function InstagramImageResizer() {
  const [preset, setPreset] = React.useState("square");
  const [fit, setFit] = React.useState<Fit>("cover");
  const [background, setBackground] = React.useState("#ffffff");

  const target = PRESETS.find((entry) => entry.value === preset) ?? PRESETS[0];

  const transform = React.useCallback(
    (image: DecodedImage) =>
      paint(target.width, target.height, (context) => {
        context.fillStyle = background;
        context.fillRect(0, 0, target.width, target.height);

        // Cover fills the frame and trims the overflow; contain fits the whole
        // picture and pads the rest, which is what avoids an unwanted crop.
        const scale =
          fit === "cover"
            ? Math.max(target.width / image.width, target.height / image.height)
            : Math.min(target.width / image.width, target.height / image.height);
        const width = image.width * scale;
        const height = image.height * scale;

        context.drawImage(image.source, (target.width - width) / 2, (target.height - height) / 2, width, height);
      }),
    [background, fit, target],
  );

  return (
    <ImageTransformTool
      suffix={`-${preset}`}
      format="image/jpeg"
      quality={92}
      transform={transform}
      controls={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Size</span>
            <Segmented
              name="ig-preset"
              ariaLabel="Instagram size"
              value={preset}
              onChange={setPreset}
              options={PRESETS.map((entry) => ({
                value: entry.value,
                label: entry.label,
                title: `${entry.width} × ${entry.height}`,
              }))}
            />
            <p className="text-xs text-fg-subtle">
              {target.width} × {target.height} pixels.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Framing</span>
            <Segmented
              name="ig-fit"
              ariaLabel="How the picture fills the frame"
              value={fit}
              onChange={setFit}
              options={[
                { value: "cover", label: "Fill and crop" },
                { value: "contain", label: "Fit and pad" },
              ]}
            />
          </div>

          {fit === "contain" ? (
            <Field label="Padding colour" htmlFor="ig-background">
              <Input
                id="ig-background"
                type="color"
                value={background}
                onChange={(event) => setBackground(event.target.value)}
                className="h-10 w-20 p-1"
              />
            </Field>
          ) : null}
        </div>
      }
      note={
        <p>
          Uploading at exactly these sizes avoids the app re-compressing a mismatched picture, which is
          the usual cause of soft text and blocky gradients in a post.
        </p>
      }
    />
  );
}
