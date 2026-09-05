"use client";

import * as React from "react";

import { Dropzone } from "@/components/tool/dropzone";
import { MAX_FILE_SIZE, type AcceptOptions } from "@/lib/files";
import { PdfError, closePdf, describePdfError, openPdf, renderPage } from "@/lib/pdf";
import { cn } from "@/lib/utils";

export const PDF_ACCEPT: AcceptOptions = {
  kinds: ["pdf"],
  maxBytes: MAX_FILE_SIZE.pdf,
  label: "PDF",
};

export const PDF_INPUT_ACCEPT = "application/pdf,.pdf";

export function PdfDropzone({
  onFiles,
  onError,
  multiple = false,
  compact = false,
  label,
}: {
  onFiles: (files: File[]) => void;
  onError: (message: string) => void;
  multiple?: boolean;
  compact?: boolean;
  label?: string;
}) {
  return (
    <Dropzone
      accept={PDF_ACCEPT}
      inputAccept={PDF_INPUT_ACCEPT}
      multiple={multiple}
      compact={compact}
      label={label}
      onFiles={onFiles}
      onError={onError}
      hint={compact ? undefined : "PDF files up to 100 MB. Nothing is uploaded — the work happens here."}
    />
  );
}

export interface PdfInfo {
  pageCount: number;
  /** Data URLs of rendered page thumbnails, in page order. */
  thumbnails: string[];
  /** Page sizes in PDF points, for showing dimensions. */
  sizes: Array<{ width: number; height: number }>;
}

/**
 * Opens a PDF and renders small previews of its pages.
 *
 * Thumbnails are produced at a low scale and converted to JPEG data URLs, so a
 * 200-page document costs a few megabytes of memory rather than hundreds.
 */
export async function readPdfInfo(
  file: File,
  options: { thumbnailScale?: number; maxThumbnails?: number } = {},
): Promise<PdfInfo> {
  const { thumbnailScale = 0.35, maxThumbnails = 200 } = options;
  const doc = await openPdf(file, file.name);

  try {
    const pageCount = doc.numPages;
    const thumbnails: string[] = [];
    const sizes: Array<{ width: number; height: number }> = [];

    const limit = Math.min(pageCount, maxThumbnails);

    for (let pageNumber = 1; pageNumber <= limit; pageNumber += 1) {
      const page = await doc.getPage(pageNumber);
      try {
        const viewport = page.getViewport({ scale: 1 });
        sizes.push({ width: viewport.width, height: viewport.height });

        const rendered = await renderPage(page, thumbnailScale);
        thumbnails.push(rendered.canvas.toDataURL("image/jpeg", 0.6));
      } finally {
        page.cleanup();
      }
    }

    return { pageCount, thumbnails, sizes };
  } finally {
    await closePdf(doc);
  }
}

export interface PageTileProps {
  pageNumber: number;
  thumbnail?: string;
  selected: boolean;
  onToggle: () => void;
  /** Extra badge in the corner, e.g. the current rotation. */
  badge?: React.ReactNode;
  disabled?: boolean;
  selectedLabel?: string;
}

/** A selectable page thumbnail, used by the page-picking tools. */
export function PageTile({
  pageNumber,
  thumbnail,
  selected,
  onToggle,
  badge,
  disabled,
  selectedLabel = "selected",
}: PageTileProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`Page ${pageNumber}${selected ? `, ${selectedLabel}` : ""}`}
      className={cn(
        "group relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-1.5 transition-colors",
        selected
          ? "border-accent bg-accent-soft"
          : "border-transparent bg-surface-sunken hover:border-border-strong",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span className="relative block w-full overflow-hidden rounded border border-border bg-white">
        {thumbnail ? (
          // A data URL rendered in this page; next/image cannot optimise it.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="" className="block h-auto w-full" />
        ) : (
          <span className="flex aspect-[1/1.414] items-center justify-center text-xs text-neutral-400">
            Page {pageNumber}
          </span>
        )}
        {badge ? (
          <span className="absolute top-1 right-1 rounded bg-fg/80 px-1.5 py-0.5 text-[0.625rem] font-medium text-bg">
            {badge}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          "tabular text-xs font-medium",
          selected ? "text-accent-text" : "text-fg-muted",
        )}
      >
        {pageNumber}
      </span>
    </button>
  );
}

export function PageGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="scrollbar-slim grid max-h-[30rem] grid-cols-3 gap-2 overflow-y-auto rounded-lg border border-border bg-bg-muted p-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {children}
    </div>
  );
}

/** Copies a page's content into a new document, preserving size and rotation. */
export function pdfErrorMessage(error: unknown, fileName?: string): string {
  return error instanceof PdfError ? error.message : describePdfError(error, fileName);
}
