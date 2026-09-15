"use client";

import * as React from "react";

import { Segmented } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import type { DecodedImage } from "@/lib/image";

import { ImageTransformTool, paint } from "./_transform-tool";

type Kind = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

/**
 * Simulation matrices.
 *
 * Each row says how much of the original red, green and blue reaches the
 * simulated channel when one type of cone is missing.
 */
const MATRICES: Record<Kind, number[]> = {
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
};

const LABELS: Record<Kind, string> = {
  protanopia: "Protanopia — no working red cones, around 1% of men",
  deuteranopia: "Deuteranopia — no working green cones, around 1% of men",
  tritanopia: "Tritanopia — no working blue cones, rare and not sex-linked",
  achromatopsia: "Achromatopsia — no colour vision at all, very rare",
};

export default function ColorBlindnessSimulator() {
  const [kind, setKind] = React.useState<Kind>("deuteranopia");

  const transform = React.useCallback(
    (image: DecodedImage) =>
      paint(image.width, image.height, (context) => {
        context.drawImage(image.source, 0, 0, image.width, image.height);
        const data = context.getImageData(0, 0, image.width, image.height);
        const pixels = data.data;
        const matrix = MATRICES[kind];

        for (let index = 0; index < pixels.length; index += 4) {
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          pixels[index] = Math.min(255, matrix[0] * red + matrix[1] * green + matrix[2] * blue);
          pixels[index + 1] = Math.min(255, matrix[3] * red + matrix[4] * green + matrix[5] * blue);
          pixels[index + 2] = Math.min(255, matrix[6] * red + matrix[7] * green + matrix[8] * blue);
        }

        context.putImageData(data, 0, 0);
      }),
    [kind],
  );

  return (
    <ImageTransformTool
      suffix={`-${kind}`}
      format="image/png"
      transform={transform}
      controls={
        <div className="space-y-2">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Type to simulate</span>
            <Segmented
              name="cvd-kind"
              ariaLabel="Type of colour vision deficiency"
              value={kind}
              onChange={setKind}
              options={[
                { value: "protanopia", label: "Protan" },
                { value: "deuteranopia", label: "Deutan" },
                { value: "tritanopia", label: "Tritan" },
                { value: "achromatopsia", label: "Mono" },
              ]}
            />
          </div>
          <p className="text-sm text-fg-muted">{LABELS[kind]}</p>
        </div>
      }
      note={
        <Alert tone="info" title="What this is for">
          If two colours in a chart or a status badge become indistinguishable here, the design relies on
          colour alone. Add a label, a shape or a pattern rather than changing the palette and hoping.
        </Alert>
      }
    />
  );
}
