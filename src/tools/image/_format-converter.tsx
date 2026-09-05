"use client";

import * as React from "react";

import { Field, Input, Segmented, Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import type { OutputFormat, ProcessOptions } from "@/lib/image";
import type { AcceptOptions } from "@/lib/files";

import { BatchImageTool } from "./_batch-tool";

export interface FormatConverterProps {
  /** Fixed output format, or undefined to let the visitor choose. */
  targetFormat?: OutputFormat;
  accept?: AcceptOptions;
  inputAccept?: string;
  hint?: React.ReactNode;
  note?: React.ReactNode;
  actionLabel: string;
  zipName: string;
  defaultQuality?: number;
}

/**
 * The shared body of the straight format-conversion tools. Each of them is the
 * same operation with a different fixed output format, so they share this and
 * differ only in their copy.
 */
export function FormatConverter({
  targetFormat,
  accept,
  inputAccept,
  hint,
  note,
  actionLabel,
  zipName,
  defaultQuality = 88,
}: FormatConverterProps) {
  const [chosenFormat, setChosenFormat] = React.useState<OutputFormat>(targetFormat ?? "image/jpeg");
  const [quality, setQuality] = React.useState(defaultQuality);
  const [background, setBackground] = React.useState("#ffffff");

  const format = targetFormat ?? chosenFormat;
  const lossy = format !== "image/png";
  // Only JPEG has no alpha channel, so only it needs a background colour.
  const flattens = format === "image/jpeg";

  const buildOptions = React.useCallback(
    (): ProcessOptions => ({
      format,
      quality: quality / 100,
      background: flattens ? background : undefined,
    }),
    [background, flattens, format, quality],
  );

  return (
    <BatchImageTool
      format={format}
      buildOptions={buildOptions}
      actionLabel={actionLabel}
      zipName={zipName}
      accept={accept}
      inputAccept={inputAccept}
      hint={hint}
      settings={
        <div className="space-y-4">
          {!targetFormat ? (
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Convert to</span>
              <Segmented
                name="convert-format"
                ariaLabel="Output format"
                value={chosenFormat}
                onChange={setChosenFormat}
                options={[
                  { value: "image/jpeg", label: "JPG" },
                  { value: "image/png", label: "PNG" },
                  { value: "image/webp", label: "WebP" },
                ]}
                className="sm:max-w-sm"
              />
            </div>
          ) : null}

          {lossy ? (
            <Slider
              label="Quality"
              valueLabel={`${quality}%`}
              min={30}
              max={100}
              value={quality}
              onChange={(event) => setQuality(Number(event.target.value))}
              className="sm:max-w-md"
            />
          ) : null}

          {flattens ? (
            <Field
              label="Background for transparent areas"
              htmlFor="convert-background"
              hint="JPG has no transparency, so transparent pixels are painted this colour."
              className="sm:max-w-48"
            >
              <Input
                id="convert-background"
                type="color"
                value={background}
                onChange={(event) => setBackground(event.target.value)}
                className="h-10 cursor-pointer p-1"
              />
            </Field>
          ) : null}
        </div>
      }
      footer={note ? <Alert tone="info">{note}</Alert> : null}
    />
  );
}
