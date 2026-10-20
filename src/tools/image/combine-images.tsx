"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, X } from "lucide-react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator, ResultPanel } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Segmented, Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBlob } from "@/lib/download";
import { FORMAT_EXTENSIONS, canvasToBlob, decodeImage, formatDimensions, type DecodedImage, type OutputFormat } from "@/lib/image";
import { DEFAULT_COMBINE, combineLayout, type CombineDirection } from "@/lib/image-layout";
import { formatBytes } from "@/lib/utils";

import { IMAGE_ACCEPT, IMAGE_INPUT_ACCEPT } from "./_shared";

interface Item {
  id: number;
  name: string;
  image: DecodedImage;
  thumb: string;
}

const MAX_IMAGES = 20;

export default function CombineImages() {
  const [items, setItems] = React.useState<Item[]>([]);
  const itemsRef = React.useRef<Item[]>([]);
  const nextId = React.useRef(1);
  const [direction, setDirection] = React.useState<CombineDirection>("horizontal");
  const [columns, setColumns] = React.useState(2);
  const [gap, setGap] = React.useState(0);
  const [margin, setMargin] = React.useState(false);
  const [background, setBackground] = React.useState("#ffffff");
  const [format, setFormat] = React.useState<OutputFormat>("image/jpeg");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ blob: Blob; url: string; width: number; height: number; scale: number } | null>(null);

  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Free every decoded bitmap and thumbnail URL when the tool is closed.
  React.useEffect(
    () => () => {
      for (const item of itemsRef.current) {
        item.image.release();
        URL.revokeObjectURL(item.thumb);
      }
    },
    [],
  );
  React.useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  const add = async (files: File[]) => {
    setError(null);
    const room = MAX_IMAGES - itemsRef.current.length;
    if (room <= 0) {
      setError(`Up to ${MAX_IMAGES} pictures can be combined at once.`);
      return;
    }
    setBusy(true);
    const added: Item[] = [];
    for (const file of files.slice(0, room)) {
      try {
        const image = await decodeImage(file);
        added.push({ id: nextId.current++, name: file.name, image, thumb: URL.createObjectURL(file) });
      } catch {
        setError(`${file.name} could not be read.`);
      }
    }
    if (files.length > room) setError(`Only the first ${room} pictures were added; the limit is ${MAX_IMAGES}.`);
    setItems((current) => [...current, ...added]);
    setBusy(false);
  };

  const remove = (id: number) =>
    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        target.image.release();
        URL.revokeObjectURL(target.thumb);
      }
      return current.filter((item) => item.id !== id);
    });

  const move = (index: number, offset: number) =>
    setItems((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(index + offset, 0, item);
      return next;
    });

  const transparent = format === "image/png" && background === "transparent";

  React.useEffect(() => {
    // A stale result is hidden by the render condition, so nothing to clear here.
    if (items.length < 2) return;
    let cancelled = false;
    const run = async () => {
      // Gap and margin are relative to the picture size, so they look the same
      // whether the photos are 800 or 4,000 pixels wide.
      const reference = Math.min(...items.map((item) => Math.min(item.image.width, item.image.height)));
      const gapPixels = Math.round((reference * gap) / 100);
      const layout = combineLayout(
        items.map((item) => ({ width: item.image.width, height: item.image.height })),
        { ...DEFAULT_COMBINE, direction, columns, gap: gapPixels, margin: margin ? gapPixels : 0 },
      );
      const canvas = document.createElement("canvas");
      canvas.width = layout.width;
      canvas.height = layout.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      if (!transparent) {
        context.fillStyle = background === "transparent" ? "#ffffff" : background;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.imageSmoothingQuality = "high";
      items.forEach((item, index) => {
        const rect = layout.rects[index];
        context.drawImage(item.image.source, rect.x, rect.y, rect.width, rect.height);
      });
      const blob = await canvasToBlob(canvas, format, 0.9);
      if (cancelled) return;
      setResult((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { blob, url: URL.createObjectURL(blob), width: layout.width, height: layout.height, scale: layout.scale };
      });
    };
    run().catch(() => {
      if (!cancelled) setError("The pictures could not be combined. Try fewer or smaller pictures.");
    });
    return () => {
      cancelled = true;
    };
  }, [background, columns, direction, format, gap, items, margin, transparent]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Dropzone
          accept={IMAGE_ACCEPT}
          inputAccept={IMAGE_INPUT_ACCEPT}
          multiple
          compact={items.length > 0}
          label={items.length > 0 ? "Add more pictures" : undefined}
          hint={`Two or more pictures, up to ${MAX_IMAGES}. Nothing is uploaded — they are combined on your device.`}
          onFiles={(files) => void add(files)}
          onError={setError}
        />
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
        {busy ? <ProgressIndicator label="Reading the pictures…" /> : null}

        {items.length > 0 ? (
          <>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Pictures in order">
              {items.map((item, index) => (
                <li key={item.id} className="space-y-1.5 rounded-lg border border-border p-2">
                  {/* An object URL made in this page; next/image cannot optimise it. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumb} alt="" className="h-20 w-full rounded object-cover" />
                  <p className="truncate text-xs text-fg-muted" title={item.name}>
                    {index + 1}. {item.name}
                  </p>
                  <div className="flex justify-between gap-1">
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Move ${item.name} earlier`} disabled={index === 0} onClick={() => move(index, -1)}>
                      <ArrowUp className="size-4" aria-hidden="true" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Move ${item.name} later`} disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                      <ArrowDown className="size-4" aria-hidden="true" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove ${item.name}`} onClick={() => remove(item.id)}>
                      <X className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ))}
            </ol>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Layout</span>
                <Segmented
                  name="combine-direction"
                  ariaLabel="Layout"
                  value={direction}
                  onChange={setDirection}
                  options={[
                    { value: "horizontal", label: "Side by side" },
                    { value: "vertical", label: "Stacked" },
                    { value: "grid", label: "Grid" },
                  ]}
                />
              </div>
              {direction === "grid" ? (
                <Slider
                  label="Columns"
                  valueLabel={String(columns)}
                  min={1}
                  max={Math.max(2, Math.min(6, items.length))}
                  value={columns}
                  onChange={(event) => setColumns(Number(event.target.value))}
                />
              ) : null}
              <Slider
                label="Space between pictures"
                valueLabel={gap === 0 ? "None" : `${gap}%`}
                min={0}
                max={10}
                step={0.5}
                value={gap}
                onChange={(event) => setGap(Number(event.target.value))}
              />
              <div className="space-y-2.5">
                <Checkbox
                  label="Add the same space around the edge"
                  checked={margin}
                  disabled={gap === 0}
                  onChange={(event) => setMargin(event.target.checked)}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="combine-background" className="text-[0.8125rem] font-medium text-fg">
                    Background
                  </label>
                  <input
                    id="combine-background"
                    type="color"
                    value={background === "transparent" ? "#ffffff" : background}
                    disabled={transparent}
                    onChange={(event) => setBackground(event.target.value)}
                    className="h-8 w-12 cursor-pointer rounded-md border border-border-strong bg-surface p-0.5 disabled:opacity-40"
                  />
                  {format === "image/png" ? (
                    <Checkbox
                      label="Transparent"
                      checked={transparent}
                      onChange={(event) => setBackground(event.target.checked ? "transparent" : "#ffffff")}
                    />
                  ) : null}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Save as</span>
                <Segmented
                  name="combine-format"
                  ariaLabel="Output format"
                  value={format}
                  onChange={(value) => {
                    setFormat(value);
                    if (value !== "image/png" && background === "transparent") setBackground("#ffffff");
                  }}
                  options={[
                    { value: "image/jpeg", label: "JPG" },
                    { value: "image/png", label: "PNG" },
                    { value: "image/webp", label: "WebP" },
                  ]}
                />
              </div>
            </div>

            {items.length === 1 ? <Alert tone="info">Add at least one more picture to combine them.</Alert> : null}

            {result && items.length > 1 ? (
              <>
                {result.scale < 1 ? (
                  <Alert tone="info" title="Scaled down to fit">
                    The combined picture was reduced to {Math.round(result.scale * 100)}% so it stays within the size
                    browsers can draw (about 16 million pixels).
                  </Alert>
                ) : null}
                <figure className="space-y-1.5">
                  <figcaption className="text-xs text-fg-subtle">
                    Result — {formatDimensions(result.width, result.height)} · {formatBytes(result.blob.size)}
                  </figcaption>
                  <span className="block overflow-hidden rounded-lg border border-border bg-bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={result.url} alt="The combined picture" className="mx-auto block max-h-96 w-auto max-w-full" />
                  </span>
                </figure>
                <ResultPanel
                  title="Your combined picture is ready"
                  description={`${formatDimensions(result.width, result.height)} · ${formatBytes(result.blob.size)}`}
                  actions={
                    <Button type="button" onClick={() => downloadBlob(result.blob, `combined.${FORMAT_EXTENSIONS[format]}`)}>
                      Download
                    </Button>
                  }
                  onReset={() => {
                    for (const item of items) {
                      item.image.release();
                      URL.revokeObjectURL(item.thumb);
                    }
                    setItems([]);
                  }}
                  resetLabel="Start again"
                />
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
