"use client";

import * as React from "react";

import { ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadBlob } from "@/lib/download";

/** The sizes YouTube stores for every video, largest first. */
const SIZES = [
  { file: "maxresdefault", label: "Maximum", dimensions: "1280 × 720" },
  { file: "sddefault", label: "Standard", dimensions: "640 × 480" },
  { file: "hqdefault", label: "High", dimensions: "480 × 360" },
  { file: "mqdefault", label: "Medium", dimensions: "320 × 180" },
];

/**
 * Pulls the video id out of any of the URL shapes YouTube uses.
 *
 * An id is always 11 characters of the URL-safe alphabet, which is what makes
 * a bare id worth accepting too.
 */
export function videoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (!/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(url.hostname)) return null;

    if (url.hostname.endsWith("youtu.be")) {
      const candidate = url.pathname.slice(1);
      return /^[\w-]{11}$/.test(candidate) ? candidate : null;
    }

    const parameter = url.searchParams.get("v");
    if (parameter && /^[\w-]{11}$/.test(parameter)) return parameter;

    // /embed/ID, /shorts/ID and /live/ID all carry the id as the last segment.
    const segments = url.pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";
    return /^[\w-]{11}$/.test(last) ? last : null;
  } catch {
    return null;
  }
}

export default function YoutubeThumbnailDownloader() {
  const [input, setInput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [missing, setMissing] = React.useState<Record<string, boolean>>({});

  const id = videoId(input);

  const save = async (name: string) => {
    if (!id) return;
    try {
      const response = await fetch(`https://i.ytimg.com/vi/${id}/${name}.jpg`);
      if (!response.ok) throw new Error("not found");
      downloadBlob(await response.blob(), `${id}-${name}.jpg`);
    } catch {
      setError("That size could not be downloaded. Try one of the smaller sizes, which every video has.");
    }
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Field
          label="YouTube link or video id"
          htmlFor="yt-input"
          hint="Ordinary links, youtu.be links, Shorts and embeds all work"
        >
          <Input
            id="yt-input"
            value={input}
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            onChange={(event) => {
              setInput(event.target.value);
              setError(null);
              setMissing({});
            }}
          />
        </Field>

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {input.trim() && !id ? (
          <Alert tone="warning">
            That does not look like a YouTube link. Paste the address from the browser bar, or the
            11-character video id on its own.
          </Alert>
        ) : null}

        {id ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {SIZES.filter((size) => !missing[size.file]).map((size) => (
              <li key={size.file} className="space-y-2 rounded-lg border border-border bg-surface p-3">
                <span className="block overflow-hidden rounded border border-border bg-bg-muted">
                  {/* A third-party image URL; next/image would proxy it needlessly. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${id}/${size.file}.jpg`}
                    alt={`${size.label} thumbnail`}
                    className="block h-auto w-full"
                    onError={() => setMissing((previous) => ({ ...previous, [size.file]: true }))}
                  />
                </span>
                <p className="text-sm font-medium text-fg">
                  {size.label}
                  <span className="ml-2 font-normal text-fg-muted">{size.dimensions}</span>
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => void save(size.file)}
                >
                  Download
                </Button>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="text-sm text-fg-muted">
          Thumbnails are public files YouTube serves for every video, so no account or API key is
          involved and nothing is scraped. Not every video has the maximum size — older and lower
          resolution uploads stop at 480 × 360, and any size a video lacks is simply not listed.
        </p>

        <Alert tone="info" title="Whose picture it is">
          A thumbnail belongs to whoever made the video. Downloading one for reference, a review or a
          link preview is ordinary use; republishing it as your own is not.
        </Alert>
      </div>
    </ToolFrame>
  );
}
