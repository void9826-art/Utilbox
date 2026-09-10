"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { CopyButton, ErrorMessage, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Segmented, Slider, Textarea } from "@/components/ui/field";
import { downloadZip } from "@/lib/download";
import { MAX_FILE_SIZE, type AcceptOptions } from "@/lib/files";
import { encodeIco } from "@/lib/ico";
import { canvasToBlob, decodeImage, type DecodedImage } from "@/lib/image";

const ACCEPT: AcceptOptions = {
  kinds: ["png", "jpeg", "webp", "gif", "bmp", "svg", "avif"],
  maxBytes: MAX_FILE_SIZE.image,
  label: "image",
};
const INPUT_ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml,image/avif,.png,.jpg,.jpeg,.webp,.gif,.bmp,.svg,.avif";

type Mode = "image" | "text";
type Shape = "square" | "rounded" | "circle";

interface Design {
  mode: Mode;
  shape: Shape;
  padding: number;
  transparent: boolean;
  background: string;
  text: string;
  textColor: string;
}

/** Every icon is drawn once at this size and scaled down from it. */
const MASTER_SIZE = 512;
const ICO_SIZES = [16, 32, 48];
const PNG_FILES: Array<{ name: string; size: number; opaque?: boolean }> = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180, opaque: true },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
];

const HEAD_SNIPPET = `<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

function tracePath(context: CanvasRenderingContext2D, size: number, shape: Shape) {
  context.beginPath();
  if (shape === "circle") context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  else if (shape === "rounded") context.roundRect(0, 0, size, size, size * 0.22);
  else context.rect(0, 0, size, size);
}

/**
 * Draws the icon at the master size. The Apple touch icon is always opaque and
 * square: iOS paints transparency black and rounds the corners itself.
 */
function drawMaster(design: Design, image: DecodedImage | null, opaque: boolean): HTMLCanvasElement {
  const size = MASTER_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not create a drawing surface.");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const filled = opaque || design.mode === "text" || !design.transparent;
  const shape: Shape = opaque ? "square" : design.shape;

  if (filled) {
    context.fillStyle = design.background;
    tracePath(context, size, shape);
    context.fill();
  }

  const inset = Math.round(size * (design.padding / 100));
  const inner = size - inset * 2;

  context.save();
  if (shape !== "square") {
    tracePath(context, size, shape);
    context.clip();
  }

  if (design.mode === "image" && image) {
    const scale = Math.min(inner / image.width, inner / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    context.drawImage(image.source, (size - width) / 2, (size - height) / 2, width, height);
  } else if (design.mode === "text") {
    const label = design.text.trim() || "?";
    const font = (px: number) => `700 ${px}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "alphabetic";
    context.font = font(inner);
    const probe = context.measureText(label);
    const glyphWidth = probe.actualBoundingBoxLeft + probe.actualBoundingBoxRight;
    const glyphHeight = probe.actualBoundingBoxAscent + probe.actualBoundingBoxDescent;
    const fontSize = inner * Math.min(inner / Math.max(1, glyphWidth), inner / Math.max(1, glyphHeight), 1);
    context.font = font(fontSize);
    const metrics = context.measureText(label);
    // Centre the visible glyphs, not the advance box, so letters sit optically centred.
    const x = size / 2 + (metrics.actualBoundingBoxLeft - metrics.actualBoundingBoxRight) / 2;
    const y = size / 2 + (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    context.fillStyle = design.textColor;
    context.fillText(label, x, y);
  }
  context.restore();

  return canvas;
}

/** Halves repeatedly before the final step; one big jump to 16 px aliases badly. */
function scaleTo(source: HTMLCanvasElement, size: number): HTMLCanvasElement {
  let current = source;
  while (current.width / 2 >= size && current.width / 2 >= 1) {
    const next = document.createElement("canvas");
    next.width = Math.round(current.width / 2);
    next.height = Math.round(current.height / 2);
    const context = next.getContext("2d");
    if (!context) break;
    context.imageSmoothingQuality = "high";
    context.drawImage(current, 0, 0, next.width, next.height);
    current = next;
  }
  if (current.width === size) return current;

  const final = document.createElement("canvas");
  final.width = size;
  final.height = size;
  const context = final.getContext("2d");
  if (!context) return current;
  context.imageSmoothingQuality = "high";
  context.drawImage(current, 0, 0, size, size);
  return final;
}

async function pngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await canvasToBlob(canvas, "image/png", 1);
  return new Uint8Array(await blob.arrayBuffer());
}

/** SVGs without width and height report no size; their viewBox supplies the proportions. */
async function decodeForIcon(file: File): Promise<DecodedImage> {
  const decoded = await decodeImage(file);
  if (decoded.width > 0 && decoded.height > 0) return decoded;

  const text = await file.slice(0, 65536).text();
  const viewBox = text.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  const width = viewBox ? Number(viewBox[1]) : 0;
  const height = viewBox ? Number(viewBox[2]) : 0;
  if (width > 0 && height > 0) return { ...decoded, width, height };

  decoded.release();
  throw new Error("The image has no size.");
}

export default function FaviconGenerator() {
  const [mode, setMode] = React.useState<Mode>("image");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const imageRef = React.useRef<DecodedImage | null>(null);
  const [imageVersion, setImageVersion] = React.useState(0);

  const [shape, setShape] = React.useState<Shape>("rounded");
  const [padding, setPadding] = React.useState(6);
  const [transparent, setTransparent] = React.useState(true);
  const [background, setBackground] = React.useState("#212121");
  const [text, setText] = React.useState("U");
  const [textColor, setTextColor] = React.useState("#ffffff");
  const [siteName, setSiteName] = React.useState("My Website");
  const [themeColor, setThemeColor] = React.useState("#ffffff");

  const [previews, setPreviews] = React.useState<Array<{ size: number; url: string }>>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => () => imageRef.current?.release(), []);

  const design = React.useMemo<Design>(
    () => ({ mode, shape, padding, transparent, background, text, textColor }),
    [background, mode, padding, shape, text, textColor, transparent],
  );

  const ready = mode === "text" || imageVersion > 0;

  React.useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      if (cancelled) return;
      if (!ready) {
        setPreviews([]);
        return;
      }
      try {
        const master = drawMaster(design, imageRef.current, false);
        const touch = drawMaster(design, imageRef.current, true);
        setPreviews([
          ...ICO_SIZES.map((size) => ({ size, url: scaleTo(master, size).toDataURL("image/png") })),
          { size: 180, url: scaleTo(touch, 180).toDataURL("image/png") },
        ]);
      } catch {
        setError("The icon could not be drawn in this browser.");
      }
    }, 60);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [design, imageVersion, ready]);

  const manifest = React.useMemo(
    () =>
      JSON.stringify(
        {
          name: siteName,
          short_name: siteName.slice(0, 12),
          icons: [
            { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
          ],
          theme_color: themeColor,
          background_color: themeColor,
          display: "standalone",
        },
        null,
        2,
      ),
    [siteName, themeColor],
  );

  const load = async (files: File[]) => {
    const chosen = files[0];
    if (!chosen) return;
    try {
      const decoded = await decodeForIcon(chosen);
      imageRef.current?.release();
      imageRef.current = decoded;
      setFileName(chosen.name);
      setImageVersion((version) => version + 1);
      setError(null);
    } catch {
      setError(`"${chosen.name}" could not be opened. An SVG needs a width and height or a viewBox.`);
    }
  };

  const download = async () => {
    setBusy(true);
    setError(null);
    try {
      const master = drawMaster(design, imageRef.current, false);
      const touch = drawMaster(design, imageRef.current, true);
      const encoder = new TextEncoder();

      const files = [];
      for (const output of PNG_FILES) {
        files.push({ name: output.name, data: await pngBytes(scaleTo(output.opaque ? touch : master, output.size)) });
      }
      const icoImages = [];
      for (const size of ICO_SIZES) icoImages.push({ size, png: await pngBytes(scaleTo(master, size)) });
      files.push({ name: "favicon.ico", data: encodeIco(icoImages) });
      files.push({ name: "site.webmanifest", data: encoder.encode(manifest) });
      files.push({ name: "head-snippet.html", data: encoder.encode(`${HEAD_SNIPPET}\n`) });

      await downloadZip(files, "favicon-package.zip");
    } catch {
      setError("The icon files could not be created. Try a different image.");
    } finally {
      setBusy(false);
    }
  };

  const tabIcon = previews.find((preview) => preview.size === 32)?.url;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="favicon-mode"
          ariaLabel="Icon source"
          value={mode}
          onChange={setMode}
          options={[
            { value: "image", label: "Upload an image" },
            { value: "text", label: "Letter or emoji" },
          ]}
          className="sm:max-w-sm"
        />

        {mode === "image" && !fileName ? (
          <Dropzone
            accept={ACCEPT}
            inputAccept={INPUT_ACCEPT}
            onFiles={(files) => void load(files)}
            onError={setError}
            hint="A square logo works best. PNG, SVG, JPG, WebP or AVIF. Nothing is uploaded."
          />
        ) : null}

        {mode === "image" && fileName ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="min-w-0 truncate font-medium text-fg">{fileName}</span>
            <ResetButton
              onReset={() => {
                imageRef.current?.release();
                imageRef.current = null;
                setFileName(null);
                setImageVersion(0);
              }}
            >
              Choose another image
            </ResetButton>
          </div>
        ) : null}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {ready ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              {mode === "text" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Letter or emoji" htmlFor="favicon-text" hint="Emoji use your device's emoji font.">
                    <Input id="favicon-text" value={text} maxLength={4} onChange={(event) => setText(event.target.value)} />
                  </Field>
                  <Field label="Text colour" htmlFor="favicon-text-colour">
                    <Input
                      id="favicon-text-colour"
                      type="color"
                      value={textColor}
                      onChange={(event) => setTextColor(event.target.value)}
                      className="h-10 cursor-pointer p-1"
                    />
                  </Field>
                </div>
              ) : null}

              <div className="space-y-1.5">
                <span className="block text-[0.8125rem] font-medium text-fg">Shape</span>
                <Segmented
                  name="favicon-shape"
                  ariaLabel="Icon shape"
                  value={shape}
                  onChange={setShape}
                  options={[
                    { value: "square", label: "Square" },
                    { value: "rounded", label: "Rounded" },
                    { value: "circle", label: "Circle" },
                  ]}
                />
              </div>

              <Slider
                label="Padding"
                valueLabel={`${padding}%`}
                min={0}
                max={30}
                value={padding}
                onChange={(event) => setPadding(Number(event.target.value))}
              />

              {mode === "image" ? (
                <Checkbox
                  label="Transparent background"
                  description="The Apple touch icon always gets the background colour, as iOS requires."
                  checked={transparent}
                  onChange={(event) => setTransparent(event.target.checked)}
                />
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Background colour" htmlFor="favicon-background">
                  <Input
                    id="favicon-background"
                    type="color"
                    value={background}
                    onChange={(event) => setBackground(event.target.value)}
                    className="h-10 cursor-pointer p-1"
                  />
                </Field>
                <Field label="Theme colour" htmlFor="favicon-theme" hint="Used in the web manifest.">
                  <Input
                    id="favicon-theme"
                    type="color"
                    value={themeColor}
                    onChange={(event) => setThemeColor(event.target.value)}
                    className="h-10 cursor-pointer p-1"
                  />
                </Field>
              </div>

              <Field label="Site name" htmlFor="favicon-site-name" hint="Shown when the site is installed as an app.">
                <Input id="favicon-site-name" value={siteName} onChange={(event) => setSiteName(event.target.value)} />
              </Field>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[0.8125rem] font-medium text-fg">Preview</p>
                <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-border bg-surface-sunken px-3 py-2">
                  {tabIcon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tabIcon} alt="" width={16} height={16} className="size-4" />
                  ) : null}
                  <span className="truncate text-xs text-fg">{siteName || "Your site"}</span>
                </div>
                <div className="flex flex-wrap items-end gap-4 rounded-b-lg border border-border bg-surface p-3">
                  {previews.map((preview) => (
                    <figure key={preview.size} className="space-y-1 text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview.url}
                        alt={`Icon at ${preview.size} pixels`}
                        width={preview.size <= 48 ? preview.size * 3 : 90}
                        height={preview.size <= 48 ? preview.size * 3 : 90}
                        style={{ imageRendering: preview.size <= 48 ? "pixelated" : "auto" }}
                        className="rounded border border-border bg-[repeating-conic-gradient(#e0e0e0_0_25%,#fff_0_50%)] bg-[length:12px_12px]"
                      />
                      <figcaption className="tabular text-[0.6875rem] text-fg-muted">
                        {preview.size === 180 ? "180 (Apple)" : `${preview.size} px`}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <p className="text-xs text-fg-subtle">Small sizes are enlarged three times so each pixel is visible.</p>
              </div>

              <Button type="button" onClick={() => void download()} loading={busy}>
                Download favicon package (.zip)
              </Button>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="favicon-snippet" className="text-[0.8125rem] font-medium text-fg">
                    HTML for your &lt;head&gt;
                  </label>
                  <CopyButton value={HEAD_SNIPPET} />
                </div>
                <Textarea
                  id="favicon-snippet"
                  readOnly
                  value={HEAD_SNIPPET}
                  rows={5}
                  className="bg-surface-sunken font-mono text-[0.75rem]"
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </ToolFrame>
  );
}
