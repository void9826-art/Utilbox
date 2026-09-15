"use client";

import * as React from "react";

import { Segmented } from "@/components/ui/field";
import type { DecodedImage } from "@/lib/image";

import { ImageTransformTool, paint } from "./_transform-tool";

type Mode = "luminance" | "average" | "high-contrast";

export default function GrayscaleImage() {
  const [mode, setMode] = React.useState<Mode>("luminance");

  const transform = React.useCallback(
    (image: DecodedImage) =>
      paint(image.width, image.height, (context) => {
        context.drawImage(image.source, 0, 0, image.width, image.height);
        const data = context.getImageData(0, 0, image.width, image.height);
        const pixels = data.data;

        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          let grey =
            mode === "average"
              ? (red + green + blue) / 3
              : // Rec. 709 weighting: how bright the eye judges each channel.
                0.2126 * red + 0.7152 * green + 0.0722 * blue;

          if (mode === "high-contrast") {
            // Push values away from mid-grey, which is what scanned text wants.
            grey = grey < 128 ? grey * 0.6 : 255 - (255 - grey) * 0.6;
          }

          pixels[index] = grey;
          pixels[index + 1] = grey;
          pixels[index + 2] = grey;
        }

        context.putImageData(data, 0, 0);
      }),
    [mode],
  );

  return (
    <ImageTransformTool
      suffix="-bw"
      format="image/png"
      transform={transform}
      controls={
        <div className="space-y-1.5">
          <span className="block text-[0.8125rem] font-medium text-fg">Conversion</span>
          <Segmented
            name="grayscale-mode"
            ariaLabel="Conversion method"
            value={mode}
            onChange={setMode}
            options={[
              { value: "luminance", label: "Natural", title: "Rec. 709 luminance weighting" },
              { value: "average", label: "Flat", title: "Plain average of the three channels" },
              { value: "high-contrast", label: "High contrast", title: "Deepens blacks and lifts whites" },
            ]}
          />
          <p className="text-xs text-fg-subtle">
            Natural matches how the eye weighs colour, so a red and a blue of similar brightness stay
            distinct. Flat is the plain average, which tends to muddy reds.
          </p>
        </div>
      }
    />
  );
}
