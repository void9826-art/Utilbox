"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { CopyButton, ErrorMessage, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented, Slider, Textarea } from "@/components/ui/field";
import { MAX_FILE_SIZE, type AcceptOptions } from "@/lib/files";
import { decodeImage } from "@/lib/image";
import {
  contrastRatio,
  extractPalette,
  rgbToHex,
  rgbToHsl,
  type PaletteColor,
  type Rgb,
} from "@/lib/palette";

const ACCEPT: AcceptOptions = {
  kinds: ["jpeg", "png", "webp", "gif", "bmp", "avif"],
  maxBytes: MAX_FILE_SIZE.image,
  label: "image",
};
const INPUT_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif";

/** The longest edge the image is scaled to before its pixels are read. */
const ANALYSIS_EDGE = 320;

type ExportFormat = "css" | "tailwind" | "json";

interface Pixels {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

function exportPalette(palette: PaletteColor[], format: ExportFormat): string {
  if (palette.length === 0) return "";
  switch (format) {
    case "css":
      return `:root {\n${palette.map((color, index) => `  --palette-${index + 1}: ${color.hex};`).join("\n")}\n}`;
    case "tailwind":
      return `@theme {\n${palette.map((color, index) => `  --color-palette-${index + 1}: ${color.hex};`).join("\n")}\n}`;
    case "json":
      return JSON.stringify(
        palette.map((color) => ({
          hex: color.hex,
          rgb: [color.r, color.g, color.b],
          share: Number(color.share.toFixed(4)),
        })),
        null,
        2,
      );
  }
}

function Swatch({ color, share }: { color: Rgb; share?: number }) {
  const hex = rgbToHex(color).toUpperCase();
  const hsl = rgbToHsl(color);
  const onWhite = contrastRatio(color, WHITE);
  const onBlack = contrastRatio(color, BLACK);
  const whiteText = onWhite >= onBlack;
  const ratio = Math.max(onWhite, onBlack);
  const verdict = ratio >= 4.5 ? "passes AA" : ratio >= 3 ? "large text only" : "fails AA";

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-2.5">
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border text-sm font-semibold"
        style={{ backgroundColor: hex, color: whiteText ? "#ffffff" : "#000000" }}
      >
        Aa
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-semibold text-fg">{hex}</p>
        <p className="tabular text-xs text-fg-muted">
          rgb({color.r}, {color.g}, {color.b}) · hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
        </p>
        <p className="text-xs text-fg-subtle">
          {whiteText ? "White" : "Black"} text {ratio.toFixed(1)}:1 — {verdict}
        </p>
      </div>
      {share !== undefined ? (
        <span className="tabular text-sm font-medium text-fg">{(share * 100).toFixed(1)}%</span>
      ) : null}
      <CopyButton value={hex} label="Copy" />
    </li>
  );
}

export default function ImageColorPalette() {
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState("");
  const [pixels, setPixels] = React.useState<Pixels | null>(null);
  const [count, setCount] = React.useState(6);
  const [format, setFormat] = React.useState<ExportFormat>("css");
  const [picked, setPicked] = React.useState<Rgb | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    setError(null);

    try {
      const decoded = await decodeImage(chosen);
      try {
        const scale = Math.min(1, ANALYSIS_EDGE / Math.max(decoded.width, decoded.height));
        const width = Math.max(1, Math.round(decoded.width * scale));
        const height = Math.max(1, Math.round(decoded.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("No drawing surface");
        context.imageSmoothingQuality = "high";
        context.drawImage(decoded.source, 0, 0, width, height);
        setPixels({ data: context.getImageData(0, 0, width, height).data, width, height });
      } finally {
        decoded.release();
      }

      setPreviewUrl(URL.createObjectURL(chosen));
      setFile(chosen);
      setPicked(null);
    } catch {
      setError(`"${chosen.name}" could not be read as an image.`);
    }
  };

  const palette = React.useMemo(() => (pixels ? extractPalette(pixels.data, count) : []), [pixels, count]);
  const exported = React.useMemo(() => exportPalette(palette, format), [palette, format]);

  const pick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!pixels) return;
    const image = event.currentTarget.querySelector("img");
    if (!image) return;
    const rect = image.getBoundingClientRect();
    // A keyboard activation has no pointer position, so it samples the centre.
    const fractionX = event.detail === 0 ? 0.5 : (event.clientX - rect.left) / rect.width;
    const fractionY = event.detail === 0 ? 0.5 : (event.clientY - rect.top) / rect.height;
    const x = Math.min(pixels.width - 1, Math.max(0, Math.floor(fractionX * pixels.width)));
    const y = Math.min(pixels.height - 1, Math.max(0, Math.floor(fractionY * pixels.height)));
    const index = (y * pixels.width + x) * 4;
    setPicked({ r: pixels.data[index], g: pixels.data[index + 1], b: pixels.data[index + 2] });
  };

  const reset = () => {
    setFile(null);
    setPixels(null);
    setPreviewUrl("");
    setPicked(null);
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={ACCEPT}
            inputAccept={INPUT_ACCEPT}
            onFiles={(files) => void load(files)}
            onError={setError}
            hint="JPG, PNG, WebP, GIF, BMP or AVIF up to 50 MB. Nothing is uploaded."
          />
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {file && pixels ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="space-y-3">
              <button
                type="button"
                onClick={pick}
                aria-label="Sample a colour: click a point on the image, or press Enter to sample its centre"
                className="block w-full cursor-crosshair overflow-hidden rounded-lg border border-border bg-surface-sunken"
              >
                {/* A blob URL of the visitor's own file; next/image cannot optimise it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt={`Preview of ${file.name}`} className="mx-auto block max-h-80 w-auto" />
              </button>
              <p className="text-xs text-fg-subtle">Click anywhere on the image to read the colour at that point.</p>

              {picked ? (
                <div className="space-y-1.5">
                  <p className="text-[0.8125rem] font-medium text-fg">Sampled colour</p>
                  <ul>
                    <Swatch color={picked} />
                  </ul>
                </div>
              ) : null}

              <ResetButton onReset={reset}>Choose another image</ResetButton>
            </div>

            <div className="space-y-4">
              <Slider
                label="Number of colours"
                valueLabel={String(count)}
                min={2}
                max={12}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
              />

              {palette.length > 0 ? (
                <>
                  <div className="flex h-6 overflow-hidden rounded-md border border-border" aria-hidden="true">
                    {palette.map((color) => (
                      <span key={color.hex} style={{ backgroundColor: color.hex, width: `${color.share * 100}%` }} />
                    ))}
                  </div>

                  <ul className="space-y-2" aria-label="Palette, most common colour first">
                    {palette.map((color) => (
                      <Swatch key={color.hex} color={color} share={color.share} />
                    ))}
                  </ul>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Segmented
                        name="palette-format"
                        ariaLabel="Export format"
                        value={format}
                        onChange={setFormat}
                        options={[
                          { value: "css", label: "CSS" },
                          { value: "tailwind", label: "Tailwind" },
                          { value: "json", label: "JSON" },
                        ]}
                        className="sm:max-w-xs"
                      />
                      <CopyButton value={exported} label="Copy palette" />
                    </div>
                    <Textarea
                      aria-label="Palette code"
                      value={exported}
                      readOnly
                      rows={Math.min(14, exported.split("\n").length + 1)}
                      className="bg-surface-sunken font-mono text-[0.8125rem]"
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-fg-muted">
                  This image has no opaque pixels, so there are no visible colours to extract.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </ToolFrame>
  );
}
