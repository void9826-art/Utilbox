"use client";

import * as React from "react";

import { Checkbox, Slider } from "@/components/ui/field";
import type { DecodedImage } from "@/lib/image";

import { ImageTransformTool, paint } from "./_transform-tool";

export default function CircleCropImage() {
  const [zoom, setZoom] = React.useState(100);
  const [ring, setRing] = React.useState(false);

  const transform = React.useCallback(
    (image: DecodedImage) => {
      // The circle is cut from the largest square the picture allows, so a
      // rectangular photo crops to its middle rather than being squashed.
      const side = Math.min(image.width, image.height);
      const drawn = side * (zoom / 100);

      return paint(side, side, (context) => {
        context.save();
        context.beginPath();
        context.arc(side / 2, side / 2, side / 2, 0, Math.PI * 2);
        context.closePath();
        context.clip();
        context.drawImage(
          image.source,
          (image.width - drawn) / 2,
          (image.height - drawn) / 2,
          drawn,
          drawn,
          0,
          0,
          side,
          side,
        );
        context.restore();

        if (ring) {
          context.strokeStyle = "#ffffff";
          context.lineWidth = Math.max(2, side * 0.02);
          context.beginPath();
          context.arc(side / 2, side / 2, side / 2 - context.lineWidth / 2, 0, Math.PI * 2);
          context.stroke();
        }
      });
    },
    [ring, zoom],
  );

  return (
    <ImageTransformTool
      suffix="-circle"
      format="image/png"
      transform={transform}
      controls={
        <div className="space-y-4">
          <Slider
            label="Zoom"
            valueLabel={`${zoom}%`}
            min={40}
            max={100}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
          <Checkbox
            label="Add a white ring"
            description="Helps the circle read as deliberate on a dark background."
            checked={ring}
            onChange={(event) => setRing(event.target.checked)}
          />
        </div>
      }
      note={
        <p>
          The result is saved as PNG so the corners outside the circle stay transparent. Saving as JPG
          would fill them with a colour, which is why that option is not offered here.
        </p>
      }
    />
  );
}
