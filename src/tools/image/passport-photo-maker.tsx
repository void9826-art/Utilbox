"use client";

import * as React from "react";

import { Segmented, Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import type { DecodedImage } from "@/lib/image";

import { ImageTransformTool, paint } from "./_transform-tool";

/** Published photo sizes, in millimetres, rendered at the density below. */
const SIZES = [
  { value: "uk-eu", label: "UK / EU", width: 35, height: 45 },
  { value: "us", label: "US / India", width: 51, height: 51 },
  { value: "cn", label: "China", width: 33, height: 48 },
  { value: "au", label: "Australia", width: 35, height: 45 },
];

const DPI = 300;
const MM_PER_INCH = 25.4;

export default function PassportPhotoMaker() {
  const [size, setSize] = React.useState("uk-eu");
  const [zoom, setZoom] = React.useState(100);
  const [offset, setOffset] = React.useState(0);

  const target = SIZES.find((entry) => entry.value === size) ?? SIZES[0];
  const pixelWidth = Math.round((target.width / MM_PER_INCH) * DPI);
  const pixelHeight = Math.round((target.height / MM_PER_INCH) * DPI);

  const transform = React.useCallback(
    (image: DecodedImage) =>
      paint(pixelWidth, pixelHeight, (context) => {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, pixelWidth, pixelHeight);

        // Fill the frame, then allow the head to be nudged up or down: the
        // usual rejection reason is a face sitting too low or too high.
        const scale = Math.max(pixelWidth / image.width, pixelHeight / image.height) * (zoom / 100);
        const width = image.width * scale;
        const height = image.height * scale;
        context.drawImage(
          image.source,
          (pixelWidth - width) / 2,
          (pixelHeight - height) / 2 + (offset / 100) * pixelHeight,
          width,
          height,
        );
      }),
    [offset, pixelHeight, pixelWidth, zoom],
  );

  return (
    <ImageTransformTool
      suffix={`-passport-${target.value}`}
      format="image/jpeg"
      quality={95}
      transform={transform}
      controls={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Size</span>
            <Segmented
              name="passport-size"
              ariaLabel="Photo size"
              value={size}
              onChange={setSize}
              options={SIZES.map((entry) => ({
                value: entry.value,
                label: entry.label,
                title: `${entry.width} × ${entry.height} mm`,
              }))}
            />
            <p className="text-xs text-fg-subtle">
              {target.width} × {target.height} mm — {pixelWidth} × {pixelHeight} pixels at {DPI} DPI.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Slider
              label="Zoom"
              valueLabel={`${zoom}%`}
              min={80}
              max={200}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
            <Slider
              label="Move up or down"
              valueLabel={`${offset > 0 ? "+" : ""}${offset}%`}
              min={-25}
              max={25}
              value={offset}
              onChange={(event) => setOffset(Number(event.target.value))}
            />
          </div>
        </div>
      }
      note={
        <Alert tone="warning" title="This sets the size, not the rules">
          The result is the right dimensions at print quality, which is the part software can do. It
          cannot judge the rules an office applies — a plain background, a neutral expression, no
          glasses, head height within a stated range. Check the requirements published by whoever
          receives the photo before paying to print it.
        </Alert>
      }
    />
  );
}
