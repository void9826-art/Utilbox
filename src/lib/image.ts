/**
 * Canvas-based image processing.
 *
 * Everything runs on the visitor's machine: files are decoded with the
 * browser's own image pipeline, redrawn on a canvas, and re-encoded. No image
 * data is ever sent anywhere.
 */

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export const FORMAT_LABELS: Record<OutputFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

export const FORMAT_EXTENSIONS: Record<OutputFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  /** Frees the underlying bitmap or object URL. Always call when finished. */
  release: () => void;
}

/**
 * Decodes a file to something drawable.
 *
 * createImageBitmap is preferred: it decodes off the main thread and honours
 * EXIF orientation, so photos taken on a phone are not rotated on their side.
 * The <img> path is a fallback for browsers without it.
 */
export async function decodeImage(blob: Blob): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      // Fall through to the <img> path.
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("That image could not be decoded."));
      element.src = url;
    });

    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

/** Reads the pixel dimensions without keeping the decoded image in memory. */
export async function readDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  const decoded = await decodeImage(blob);
  const { width, height } = decoded;
  decoded.release();
  return { width, height };
}

export interface RenderOptions {
  width: number;
  height: number;
  /** Painted before the image; required when flattening transparency to JPEG. */
  background?: string;
  /** Radians. The canvas is not resized, so callers must size it first. */
  rotation?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  /** Crop rectangle in source pixels. */
  sourceRect?: { x: number; y: number; width: number; height: number };
}

export function renderToCanvas(image: DecodedImage, options: RenderOptions): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(options.width));
  canvas.height = Math.max(1, Math.round(options.height));

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not create a drawing surface.");

  if (options.background) {
    context.fillStyle = options.background;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Bilinear-quality downscaling; without this, shrinking looks jagged.
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const rotation = options.rotation ?? 0;
  const needsTransform = rotation !== 0 || options.flipHorizontal || options.flipVertical;

  if (needsTransform) {
    context.translate(canvas.width / 2, canvas.height / 2);
    if (rotation) context.rotate(rotation);
    context.scale(options.flipHorizontal ? -1 : 1, options.flipVertical ? -1 : 1);
    context.translate(-image.width / 2, -image.height / 2);
    context.drawImage(image.source, 0, 0, image.width, image.height);
  } else if (options.sourceRect) {
    const rect = options.sourceRect;
    context.drawImage(
      image.source,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  } else {
    context.drawImage(image.source, 0, 0, canvas.width, canvas.height);
  }

  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("The image could not be encoded."));
      },
      format,
      // PNG is lossless, so a quality argument is meaningless there.
      format === "image/png" ? undefined : quality,
    );
  });
}

export interface ProcessOptions {
  format: OutputFormat;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  background?: string;
  rotation?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  sourceRect?: { x: number; y: number; width: number; height: number };
  /** Permits enlarging past the source dimensions. */
  allowUpscale?: boolean;
}

export interface ProcessResult {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

/**
 * Fits within a bounding box while preserving the aspect ratio.
 *
 * By default the scale is capped at 1, so "fit to 1920px" leaves a smaller
 * image alone rather than blowing it up. The resize tool opts out, because
 * there enlarging is what the visitor explicitly asked for.
 */
export function fitWithin(
  width: number,
  height: number,
  maxWidth?: number,
  maxHeight?: number,
  allowUpscale = false,
): { width: number; height: number } {
  if (!maxWidth && !maxHeight) return { width, height };

  const scale = Math.min(
    maxWidth ? maxWidth / width : Number.POSITIVE_INFINITY,
    maxHeight ? maxHeight / height : Number.POSITIVE_INFINITY,
    allowUpscale ? Number.POSITIVE_INFINITY : 1,
  );

  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export async function processImage(blob: Blob, options: ProcessOptions): Promise<ProcessResult> {
  const decoded = await decodeImage(blob);

  try {
    const rect = options.sourceRect ?? {
      x: 0,
      y: 0,
      width: decoded.width,
      height: decoded.height,
    };

    let targetWidth = rect.width;
    let targetHeight = rect.height;

    const rotation = options.rotation ?? 0;
    const quarterTurned = Math.abs(Math.round(rotation / (Math.PI / 2))) % 2 === 1;

    if (rotation !== 0) {
      // A rotated rectangle needs a larger box to contain its corners.
      const cos = Math.abs(Math.cos(rotation));
      const sin = Math.abs(Math.sin(rotation));
      if (quarterTurned && Math.abs(rotation % (Math.PI / 2)) < 1e-9) {
        targetWidth = rect.height;
        targetHeight = rect.width;
      } else {
        targetWidth = Math.round(rect.width * cos + rect.height * sin);
        targetHeight = Math.round(rect.width * sin + rect.height * cos);
      }
    }

    const fitted = fitWithin(
      targetWidth,
      targetHeight,
      options.maxWidth,
      options.maxHeight,
      options.allowUpscale,
    );

    // JPEG has no alpha channel, so transparency must be flattened first or it
    // renders as black rather than as the expected white.
    const background =
      options.background ?? (options.format === "image/jpeg" ? "#ffffff" : undefined);

    const canvas =
      rotation !== 0 || options.flipHorizontal || options.flipVertical
        ? renderToCanvas(decoded, {
            width: fitted.width,
            height: fitted.height,
            background,
            rotation,
            flipHorizontal: options.flipHorizontal,
            flipVertical: options.flipVertical,
          })
        : renderToCanvas(decoded, {
            width: fitted.width,
            height: fitted.height,
            background,
            sourceRect: rect,
          });

    const output = await canvasToBlob(canvas, options.format, options.quality);

    return {
      blob: output,
      width: canvas.width,
      height: canvas.height,
      originalWidth: decoded.width,
      originalHeight: decoded.height,
    };
  } finally {
    decoded.release();
  }
}

/** Decodes HEIC/HEIF, which browsers cannot open natively. */
export async function decodeHeic(file: File, quality: number): Promise<Blob> {
  // libheif is several megabytes, so it is only fetched when a HEIC is dropped.
  const { heicTo } = await import("heic-to");
  return heicTo({ blob: file, type: "image/jpeg", quality });
}

export function formatDimensions(width: number, height: number): string {
  return `${width.toLocaleString()} × ${height.toLocaleString()}`;
}
