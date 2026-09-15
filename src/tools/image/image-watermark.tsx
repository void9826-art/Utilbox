"use client";

import * as React from "react";

import { Field, Input, Segmented, Slider } from "@/components/ui/field";
import type { DecodedImage } from "@/lib/image";

import { ImageTransformTool, paint } from "./_transform-tool";

type Position = "center" | "tile" | "bottom-right" | "bottom-left";

export default function ImageWatermark() {
  const [text, setText] = React.useState("© Your Name");
  const [position, setPosition] = React.useState<Position>("bottom-right");
  const [opacity, setOpacity] = React.useState(45);
  const [size, setSize] = React.useState(5);
  const [colour, setColour] = React.useState("#ffffff");

  const transform = React.useCallback(
    (image: DecodedImage) =>
      paint(image.width, image.height, (context) => {
        context.drawImage(image.source, 0, 0, image.width, image.height);
        if (!text.trim()) return;

        // The text is sized as a share of the picture, so the mark looks the
        // same whether the photo is 800 or 6000 pixels across.
        const fontSize = Math.max(10, (size / 100) * image.width);
        context.font = `600 ${fontSize}px system-ui, sans-serif`;
        context.fillStyle = colour;
        context.globalAlpha = opacity / 100;
        context.textBaseline = "alphabetic";
        // A soft shadow keeps white text readable over a pale photograph.
        context.shadowColor = "rgba(0,0,0,0.45)";
        context.shadowBlur = fontSize * 0.12;

        const metrics = context.measureText(text);
        const margin = fontSize * 0.6;

        if (position === "tile") {
          const stepX = metrics.width + fontSize * 2;
          const stepY = fontSize * 3.5;
          context.save();
          context.rotate(-Math.PI / 12);
          for (let y = -image.height; y < image.height * 2; y += stepY) {
            for (let x = -image.width; x < image.width * 2; x += stepX) {
              context.fillText(text, x, y);
            }
          }
          context.restore();
          return;
        }

        const x =
          position === "center"
            ? (image.width - metrics.width) / 2
            : position === "bottom-left"
              ? margin
              : image.width - metrics.width - margin;
        const y = position === "center" ? image.height / 2 + fontSize / 3 : image.height - margin;
        context.fillText(text, x, y);
      }),
    [colour, opacity, position, size, text],
  );

  return (
    <ImageTransformTool
      suffix="-watermarked"
      format="image/jpeg"
      quality={92}
      transform={transform}
      controls={
        <div className="space-y-4">
          <Field label="Watermark text" htmlFor="iw-text">
            <Input id="iw-text" value={text} maxLength={60} onChange={(event) => setText(event.target.value)} />
          </Field>

          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Position</span>
            <Segmented
              name="iw-position"
              ariaLabel="Watermark position"
              value={position}
              onChange={setPosition}
              options={[
                { value: "bottom-right", label: "Corner" },
                { value: "bottom-left", label: "Left" },
                { value: "center", label: "Centre" },
                { value: "tile", label: "Tiled" },
              ]}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Slider
              label="Opacity"
              valueLabel={`${opacity}%`}
              min={10}
              max={100}
              step={5}
              value={opacity}
              onChange={(event) => setOpacity(Number(event.target.value))}
            />
            <Slider
              label="Text size"
              valueLabel={`${size}% of the width`}
              min={2}
              max={15}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
            />
          </div>

          <Field label="Colour" htmlFor="iw-colour">
            <Input
              id="iw-colour"
              type="color"
              value={colour}
              onChange={(event) => setColour(event.target.value)}
              className="h-10 w-20 p-1"
            />
          </Field>
        </div>
      }
      note={
        <p>
          A watermark marks ownership; it does not enforce it. Anyone determined enough can crop or
          paint it out, which is why a tiled mark across the middle is harder to remove than one tucked
          into a corner — at the cost of being harder to look past.
        </p>
      }
    />
  );
}
