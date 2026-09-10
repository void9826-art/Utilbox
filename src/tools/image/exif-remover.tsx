"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Dropzone } from "@/components/tool/dropzone";
import { ErrorMessage, ProgressIndicator, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/field";
import { Alert, Badge, DataRow } from "@/components/ui/surfaces";
import { downloadBytes, downloadZip } from "@/lib/download";
import { MAX_FILE_SIZE, sniffFileKind, stripExtension, type AcceptOptions } from "@/lib/files";
import { stripMetadata, type StrippableKind } from "@/lib/metadata-strip";
import { formatBytes } from "@/lib/utils";

const ACCEPT: AcceptOptions = { kinds: ["jpeg", "png", "webp"], maxBytes: MAX_FILE_SIZE.image, label: "photo" };
const INPUT_ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

const EXTENSION: Record<StrippableKind, string> = { jpeg: "jpg", png: "png", webp: "webp" };
const MIME: Record<StrippableKind, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

/** What to read. ICC, JFIF and IHDR describe the image, not the person, so they are left out. */
const PARSE_OPTIONS = {
  tiff: true,
  xmp: true,
  iptc: true,
  icc: false,
  jfif: false,
  ihdr: false,
  mergeOutput: true,
};

const GROUPS: Array<{ title: string; flag: string | null; match: (key: string) => boolean }> = [
  {
    title: "Location",
    flag: "GPS location",
    match: (key) => key === "latitude" || key === "longitude" || key.startsWith("GPS"),
  },
  {
    title: "Device and owner",
    flag: "Device details",
    match: (key) => /^(Make|Model|LensMake|LensModel|LensInfo|HostComputer)$|serial|owner/i.test(key),
  },
  {
    title: "Dates",
    flag: "Dates",
    match: (key) => /date|offsettime|subsectime/i.test(key),
  },
  {
    title: "Author and software",
    flag: null,
    match: (key) => /^(artist|copyright|creator|rights|author|xpauthor|by-line|software|creatortool|processingsoftware|history)/i.test(key),
  },
];

type Tags = Record<string, unknown>;

interface Entry {
  id: string;
  file: File;
  kind: StrippableKind;
  tags: Tags;
  result?: { bytes: Uint8Array; removed: string[]; remaining: string[]; orientationKept: boolean };
}

let sequence = 0;

async function readTags(data: Blob | Uint8Array): Promise<Tags> {
  const { parse } = await import("exifr");
  try {
    const output: unknown = await parse(data, PARSE_OPTIONS);
    return output && typeof output === "object" ? (output as Tags) : {};
  } catch {
    return {};
  }
}

function formatValue(value: unknown): string {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? "—" : value.toLocaleString();
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
  if (typeof value === "string") return value.length > 160 ? `${value.slice(0, 160)}…` : value;
  if (value instanceof Uint8Array || value instanceof ArrayBuffer) return `${value.byteLength} bytes of binary data`;
  if (Array.isArray(value)) return value.length > 12 ? `${value.length} values` : value.map(formatValue).join(", ");
  if (value && typeof value === "object") {
    try {
      const json = JSON.stringify(value);
      return json.length > 160 ? `${json.slice(0, 160)}…` : json;
    } catch {
      return "(structured data)";
    }
  }
  return String(value);
}

function groupTags(tags: Tags) {
  const keys = Object.keys(tags);
  const used = new Set<string>();
  const groups = GROUPS.map((group) => {
    const matched = keys.filter((key) => !used.has(key) && group.match(key));
    matched.forEach((key) => used.add(key));
    return { ...group, keys: matched };
  });
  groups.push({ title: "Everything else", flag: null, match: () => true, keys: keys.filter((key) => !used.has(key)) });
  return groups.filter((group) => group.keys.length > 0);
}

function EntryRow({ entry, onRemove }: { entry: Entry; onRemove: (id: string) => void }) {
  const groups = groupTags(entry.tags);
  const total = Object.keys(entry.tags).length;
  const flags = groups.map((group) => group.flag).filter((flag): flag is string => Boolean(flag));
  const outputName = `${stripExtension(entry.file.name)}-no-metadata.${EXTENSION[entry.kind]}`;

  return (
    <li className="space-y-2 rounded-lg border border-border bg-surface p-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-fg" title={entry.file.name}>
            {entry.file.name}
          </p>
          <p className="tabular text-xs text-fg-subtle">
            {formatBytes(entry.file.size)} · {total === 0 ? "no readable metadata" : `${total} metadata fields`}
          </p>
          {flags.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {flags.map((flag) => (
                <Badge key={flag} tone={flag === "GPS location" ? "danger" : "warning"}>
                  Contains: {flag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
        {entry.result ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => downloadBytes(entry.result!.bytes, outputName, MIME[entry.kind])}
          >
            Save
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${entry.file.name}`}
          onClick={() => onRemove(entry.id)}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {total > 0 ? (
        <details className="group rounded-md border border-border bg-surface-sunken">
          <summary className="cursor-pointer px-3 py-2 text-[0.8125rem] font-medium text-fg">
            Show the {total} fields found
          </summary>
          <div className="space-y-3 px-3 pb-3">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
                  {group.title}
                </h3>
                <dl>
                  {group.keys.map((key) => (
                    <DataRow key={key} label={key} value={formatValue(entry.tags[key])} />
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </details>
      ) : null}

      {entry.result ? (
        <div className="rounded-md border border-success-border bg-success-soft px-3 py-2 text-[0.8125rem] text-fg">
          <p>
            <strong className="font-semibold">Removed:</strong>{" "}
            {entry.result.removed.length > 0 ? entry.result.removed.join(", ") : "nothing — the file had no metadata blocks"}{" "}
            · {formatBytes(entry.result.bytes.byteLength)}
          </p>
          <p className="mt-0.5">
            <strong className="font-semibold">Checked:</strong>{" "}
            {entry.result.remaining.length === 0
              ? `no readable metadata left${entry.result.orientationKept ? " (only the rotation flag was kept)" : ""}.`
              : `still present — ${entry.result.remaining.slice(0, 8).join(", ")}.`}
          </p>
        </div>
      ) : null}
    </li>
  );
}

export default function ExifRemover() {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [keepColorProfile, setKeepColorProfile] = React.useState(true);
  const [keepOrientation, setKeepOrientation] = React.useState(true);
  const [reading, setReading] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const addFiles = async (files: File[]) => {
    setError(null);
    setReading(true);
    const added: Entry[] = [];
    for (const file of files) {
      const kind = await sniffFileKind(file);
      if (kind !== "jpeg" && kind !== "png" && kind !== "webp") continue;
      sequence += 1;
      added.push({ id: `exif-${sequence}`, file, kind, tags: await readTags(file) });
    }
    setEntries((previous) => [...previous, ...added]);
    setReading(false);
  };

  const clean = async () => {
    setError(null);
    setProgress({ done: 0, total: entries.length });
    const updated: Entry[] = [];

    for (const [index, entry] of entries.entries()) {
      try {
        const bytes = new Uint8Array(await entry.file.arrayBuffer());
        const stripped = stripMetadata(bytes, entry.kind, { keepColorProfile, keepOrientation });
        const after = await readTags(stripped.bytes);
        const remaining = Object.keys(after).filter((key) => key !== "Orientation");
        updated.push({
          ...entry,
          result: {
            bytes: stripped.bytes,
            removed: stripped.removed,
            remaining,
            orientationKept: "Orientation" in after,
          },
        });
      } catch (caught) {
        updated.push({ ...entry, result: undefined });
        setError(
          `"${entry.file.name}" could not be cleaned: ${caught instanceof Error ? caught.message : "its structure is damaged"}.`,
        );
      }
      setProgress({ done: index + 1, total: entries.length });
    }

    setEntries(updated);
    setProgress(null);
  };

  const finished = entries.filter((entry) => entry.result);

  const downloadAll = async () => {
    if (finished.length === 1) {
      const [entry] = finished;
      downloadBytes(
        entry.result!.bytes,
        `${stripExtension(entry.file.name)}-no-metadata.${EXTENSION[entry.kind]}`,
        MIME[entry.kind],
      );
      return;
    }
    await downloadZip(
      finished.map((entry) => ({
        name: `${stripExtension(entry.file.name)}-no-metadata.${EXTENSION[entry.kind]}`,
        data: entry.result!.bytes,
      })),
      "photos-without-metadata.zip",
    );
  };

  const withLocation = entries.filter((entry) => "latitude" in entry.tags).length;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Dropzone
          accept={ACCEPT}
          inputAccept={INPUT_ACCEPT}
          multiple
          compact={entries.length > 0}
          label={entries.length > 0 ? "Add more photos" : undefined}
          onFiles={(files) => void addFiles(files)}
          onError={setError}
          hint={entries.length > 0 ? undefined : "JPG, PNG or WebP photos up to 50 MB each. Nothing is uploaded."}
        />

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {reading ? <ProgressIndicator label="Reading metadata…" /> : null}

        {entries.length > 0 ? (
          <>
            {withLocation > 0 ? (
              <Alert tone="warning" title={`${withLocation} of ${entries.length} photos contain GPS coordinates`}>
                Anyone who receives the original file can read where it was taken.
              </Alert>
            ) : null}

            <ul className="space-y-2">
              {entries.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onRemove={(id) => setEntries((previous) => previous.filter((item) => item.id !== id))}
                />
              ))}
            </ul>

            <div className="space-y-2.5">
              <Checkbox
                label="Keep the colour profile"
                description="Describes how colours should be displayed. Contains nothing about you."
                checked={keepColorProfile}
                onChange={(event) => setKeepColorProfile(event.target.checked)}
              />
              <Checkbox
                label="Keep the rotation (JPG)"
                description="Stops photos taken sideways on a phone from appearing rotated."
                checked={keepOrientation}
                onChange={(event) => setKeepOrientation(event.target.checked)}
              />
            </div>

            {progress ? (
              <ProgressIndicator
                value={(progress.done / Math.max(1, progress.total)) * 100}
                label={`Cleaning photo ${progress.done} of ${progress.total}…`}
              />
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={() => void clean()} loading={progress !== null}>
                Remove metadata from {entries.length} photo{entries.length === 1 ? "" : "s"}
              </Button>
              {finished.length > 0 && !progress ? (
                <Button type="button" variant="secondary" onClick={() => void downloadAll()}>
                  {finished.length === 1 ? "Download" : `Download all ${finished.length} as ZIP`}
                </Button>
              ) : null}
              <ResetButton
                onReset={() => {
                  setEntries([]);
                  setError(null);
                }}
              >
                Clear all
              </ResetButton>
            </div>
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
