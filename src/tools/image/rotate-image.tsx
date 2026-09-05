"use client";

import * as React from "react";
import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, Input, Segmented, Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import type { OutputFormat, ProcessOptions } from "@/lib/image";

import { BatchImageTool } from "./_batch-tool";

export default function RotateImage() {
  const [quarterTurns, setQuarterTurns] = React.useState(0);
  const [fineAngle, setFineAngle] = React.useState(0);
  const [flipHorizontal, setFlipHorizontal] = React.useState(false);
  const [flipVertical, setFlipVertical] = React.useState(false);
  const [format, setFormat] = React.useState<OutputFormat>("image/png");
  const [background, setBackground] = React.useState("#ffffff");

  const totalDegrees = ((quarterTurns * 90 + fineAngle) % 360 + 360) % 360;
  const isExactTurn = totalDegrees % 90 === 0;

  const buildOptions = React.useCallback(
    (): ProcessOptions => ({
      format,
      quality: 0.92,
      rotation: (totalDegrees * Math.PI) / 180,
      flipHorizontal,
      flipVertical,
      background: format === "image/jpeg" || !isExactTurn ? background : undefined,
    }),
    [background, flipHorizontal, flipVertical, format, isExactTurn, totalDegrees],
  );

  return (
    <BatchImageTool
      format={format}
      buildOptions={buildOptions}
      actionLabel="Apply and save"
      zipName="rotated-images.zip"
      settings={
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Rotate and flip</span>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setQuarterTurns((previous) => previous - 1)}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Left 90°
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setQuarterTurns((previous) => previous + 1)}
              >
                <RotateCw className="size-4" aria-hidden="true" />
                Right 90°
              </Button>
              <Button
                type="button"
                variant={flipHorizontal ? "primary" : "secondary"}
                aria-pressed={flipHorizontal}
                onClick={() => setFlipHorizontal((previous) => !previous)}
              >
                <FlipHorizontal className="size-4" aria-hidden="true" />
                Flip across
              </Button>
              <Button
                type="button"
                variant={flipVertical ? "primary" : "secondary"}
                aria-pressed={flipVertical}
                onClick={() => setFlipVertical((previous) => !previous)}
              >
                <FlipVertical className="size-4" aria-hidden="true" />
                Flip down
              </Button>
            </div>
            <p className="tabular text-xs text-fg-subtle" aria-live="polite">
              Current rotation: {totalDegrees}°
              {flipHorizontal ? ", flipped horizontally" : ""}
              {flipVertical ? ", flipped vertically" : ""}
            </p>
          </div>

          <Slider
            label="Fine angle"
            valueLabel={`${fineAngle}°`}
            min={-45}
            max={45}
            value={fineAngle}
            onChange={(event) => setFineAngle(Number(event.target.value))}
            className="sm:max-w-md"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Output format</span>
              <Segmented
                name="rotate-format"
                ariaLabel="Output format"
                value={format}
                onChange={setFormat}
                options={[
                  { value: "image/png", label: "PNG" },
                  { value: "image/jpeg", label: "JPG" },
                  { value: "image/webp", label: "WebP" },
                ]}
              />
            </div>

            {!isExactTurn || format === "image/jpeg" ? (
              <Field
                label="Corner fill colour"
                htmlFor="rotate-background"
                hint="Fills the area exposed by an off-square rotation."
                className="sm:max-w-48"
              >
                <Input
                  id="rotate-background"
                  type="color"
                  value={background}
                  onChange={(event) => setBackground(event.target.value)}
                  className="h-10 cursor-pointer p-1"
                />
              </Field>
            ) : null}
          </div>
        </div>
      }
      footer={
        isExactTurn && !fineAngle ? (
          <Alert tone="success" title="This rotation is exactly lossless">
            Quarter turns and flips move pixels without resampling, so the result is pixel-identical to
            your original — just reoriented.
          </Alert>
        ) : (
          <Alert tone="info" title="Off-square rotation resamples the image">
            At an arbitrary angle the pixels no longer line up with the grid, so they have to be
            interpolated. The result softens very slightly and the canvas grows to fit the rotated
            corners.
          </Alert>
        )
      }
    />
  );
}
