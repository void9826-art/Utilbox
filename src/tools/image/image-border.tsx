"use client";

import * as React from "react";

import { Checkbox, Segmented, Slider } from "@/components/ui/field";
import type { DecodedImage, OutputFormat } from "@/lib/image";
import { borderLayout } from "@/lib/image-layout";

import { ImageTransformTool, paint } from "./_transform-tool";

/** Rounded-rectangle path, drawn by hand so older browsers without roundRect work too. */
function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

const SWATCHES = ["#ffffff", "#000000", "#f4efe6", "#1f2937", "#e11d48", "#2563eb"];

export default function ImageBorder() {
  const [border, setBorder] = React.useState(5);
  const [colour, setColour] = React.useState("#ffffff");
  const [transparentBorder, setTransparentBorder] = React.useState(false);
  const [imageRadius, setImageRadius] = React.useState(0);
  const [outerRadius, setOuterRadius] = React.useState(0);
  const [format, setFormat] = React.useState<OutputFormat>("image/png");

  // Transparent corners or a transparent border only survive in PNG.
  const needsPng = transparentBorder || outerRadius > 0 || (border === 0 && imageRadius > 0);
  const output: OutputFormat = needsPng ? "image/png" : format;

  const transform = React.useCallback(
    (image: DecodedImage) => {
      const layout = borderLayout(image.width, image.height, {
        borderPercent: border,
        imageRadiusPercent: imageRadius,
        outerRadiusPercent: outerRadius,
      });
      return paint(layout.width, layout.height, (context) => {
        if (layout.outerRadius > 0) {
          roundedRect(context, 0, 0, layout.width, layout.height, layout.outerRadius);
          context.clip();
        }
        if (!transparentBorder) {
          context.fillStyle = colour;
          context.fillRect(0, 0, layout.width, layout.height);
        }
        context.save();
        if (layout.imageRadius > 0) {
          roundedRect(context, layout.image.x, layout.image.y, layout.image.width, layout.image.height, layout.imageRadius);
          context.clip();
        }
        context.drawImage(image.source, layout.image.x, layout.image.y, layout.image.width, layout.image.height);
        context.restore();
      });
    },
    [border, colour, imageRadius, outerRadius, transparentBorder],
  );

  return (
    <ImageTransformTool
      suffix="-border"
      format={output}
      quality={92}
      transform={transform}
      controls={
        <div className="space-y-4">
          <Slider
            label="Border width"
            valueLabel={`${border}% of the shorter side`}
            min={0}
            max={30}
            step={0.5}
            value={border}
            onChange={(event) => setBorder(Number(event.target.value))}
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="border-colour" className="text-[0.8125rem] font-medium text-fg">
                Border colour
              </label>
              <input
                id="border-colour"
                type="color"
                value={colour}
                disabled={transparentBorder}
                onChange={(event) => setColour(event.target.value)}
                className="h-8 w-12 cursor-pointer rounded-md border border-border-strong bg-surface p-0.5 disabled:opacity-40"
              />
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Quick colours">
                {SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    aria-label={`Use ${swatch}`}
                    aria-pressed={colour === swatch}
                    disabled={transparentBorder}
                    onClick={() => setColour(swatch)}
                    className="size-7 rounded-full border border-border-strong aria-pressed:ring-2 aria-pressed:ring-accent disabled:opacity-40"
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </div>
            </div>
            <Checkbox
              label="Transparent border (padding only)"
              description="Adds empty space around the picture instead of a colour. Saved as PNG."
              checked={transparentBorder}
              onChange={(event) => setTransparentBorder(event.target.checked)}
            />
          </div>
          <Slider
            label="Round the picture's corners"
            valueLabel={`${imageRadius}%`}
            min={0}
            max={50}
            value={imageRadius}
            onChange={(event) => setImageRadius(Number(event.target.value))}
          />
          <Slider
            label="Round the outer corners"
            valueLabel={`${outerRadius}%`}
            min={0}
            max={50}
            value={outerRadius}
            onChange={(event) => setOuterRadius(Number(event.target.value))}
          />
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Save as</span>
            <Segmented
              name="border-format"
              ariaLabel="Output format"
              value={output}
              onChange={setFormat}
              options={[
                { value: "image/png", label: "PNG" },
                { value: "image/jpeg", label: "JPG", title: needsPng ? "Transparent areas need PNG" : undefined },
              ]}
            />
            {needsPng ? (
              <p className="text-xs text-fg-subtle">PNG is used because the result has transparent areas.</p>
            ) : null}
          </div>
        </div>
      }
      note={
        <p>
          The picture keeps its full resolution; the border is added around it, so the result is larger than the
          original by twice the border width in each direction.
        </p>
      }
    />
  );
}
