"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { Dropzone } from "@/components/tool/dropzone";
import { CopyButton, ErrorMessage, ProgressIndicator, ResetButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import type { AcceptOptions } from "@/lib/files";
import { cn, formatBytes, yieldToBrowser } from "@/lib/utils";

type Algorithm = "md5" | "sha1" | "sha256" | "sha512";

const ALGORITHMS: Array<{ id: Algorithm; label: string; hexLength: number; note?: string }> = [
  { id: "md5", label: "MD5", hexLength: 32, note: "Detects corruption, not tampering" },
  { id: "sha1", label: "SHA-1", hexLength: 40, note: "Detects corruption, not tampering" },
  { id: "sha256", label: "SHA-256", hexLength: 64 },
  { id: "sha512", label: "SHA-512", hexLength: 128 },
];

/** Reads raw bytes only, so any file type is fine and nothing is sniffed. */
const ACCEPT: AcceptOptions = { kinds: "any", maxBytes: Number.MAX_SAFE_INTEGER, label: "file" };

/**
 * Accepts a bare hash, "hash  filename" (sha256sum) and "SHA256 (file) = hash" (BSD).
 * Returns null for anything that is not hexadecimal of a known length.
 */
export function parseExpectedHash(input: string): { hex: string; algorithm: Algorithm } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const bsd = trimmed.match(/=\s*([0-9a-f]+)\s*$/i);
  const token = (bsd ? bsd[1] : trimmed.split(/\s+/)[0]).replace(/^\*/, "").toLowerCase();
  if (!/^[0-9a-f]+$/.test(token)) return null;
  const algorithm = ALGORITHMS.find((entry) => entry.hexLength === token.length);
  return algorithm ? { hex: token, algorithm: algorithm.id } : null;
}

export default function ChecksumVerifier() {
  const [file, setFile] = React.useState<File | null>(null);
  const [selected, setSelected] = React.useState<Record<Algorithm, boolean>>({
    md5: true,
    sha1: false,
    sha256: true,
    sha512: false,
  });
  const [expected, setExpected] = React.useState("");
  const [results, setResults] = React.useState<Partial<Record<Algorithm, string>>>({});
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const cancelled = React.useRef(false);

  const parsed = parseExpectedHash(expected);
  const expectedError =
    expected.trim() && !parsed
      ? "That is not a recognised checksum. Expect 32, 40, 64 or 128 hexadecimal characters."
      : null;

  const run = async () => {
    if (!file) return;
    setError(null);
    setResults({});
    cancelled.current = false;

    // A pasted checksum decides one algorithm even if its box was left unticked.
    const active = ALGORITHMS.map((entry) => entry.id).filter(
      (id) => selected[id] || parsed?.algorithm === id,
    );
    if (active.length === 0) {
      setError("Choose at least one algorithm.");
      return;
    }

    setProgress({ done: 0, total: file.size });
    try {
      const hashWasm = await import("hash-wasm");
      const creators = {
        md5: hashWasm.createMD5,
        sha1: hashWasm.createSHA1,
        sha256: hashWasm.createSHA256,
        sha512: hashWasm.createSHA512,
      };
      const hashers = await Promise.all(active.map(async (id) => ({ id, hasher: await creators[id]() })));
      for (const { hasher } of hashers) hasher.init();

      // Streamed in chunks, so memory stays flat however large the file is.
      const reader = file.stream().getReader();
      let done = 0;
      let lastPaint = 0;
      for (;;) {
        if (cancelled.current) {
          await reader.cancel();
          setProgress(null);
          return;
        }
        const { value, done: finished } = await reader.read();
        if (finished) break;
        for (const { hasher } of hashers) hasher.update(value);
        done += value.byteLength;
        if (performance.now() - lastPaint > 120) {
          lastPaint = performance.now();
          setProgress({ done, total: file.size });
          await yieldToBrowser();
        }
      }

      setResults(Object.fromEntries(hashers.map(({ id, hasher }) => [id, hasher.digest("hex") as string])));
    } catch {
      setError("The file could not be read. It may have been moved or deleted since you chose it.");
    } finally {
      setProgress(null);
    }
  };

  const comparison = parsed && results[parsed.algorithm] ? results[parsed.algorithm] === parsed.hex : null;
  const algorithmLabel = parsed ? ALGORITHMS.find((entry) => entry.id === parsed.algorithm)?.label : "";

  return (
    <ToolFrame>
      <div className="space-y-5">
        {!file ? (
          <Dropzone
            accept={ACCEPT}
            inputAccept="*/*"
            onFiles={(files) => {
              setFile(files[0] ?? null);
              setResults({});
            }}
            onError={setError}
            hint="Any file, any size. It is read on your device and never uploaded."
          />
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="min-w-0 truncate font-medium text-fg">{file.name}</span>
            <span className="tabular text-fg-muted">{formatBytes(file.size)}</span>
            <ResetButton
              onReset={() => {
                cancelled.current = true;
                setFile(null);
                setResults({});
              }}
            >
              Choose another file
            </ResetButton>
          </div>
        )}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        <Field
          label="Published checksum (optional)"
          htmlFor="checksum-expected"
          hint={parsed ? `Recognised as ${algorithmLabel}.` : "Paste it from the download page. The algorithm is detected from its length."}
          error={expectedError}
        >
          <Input
            id="checksum-expected"
            value={expected}
            spellCheck={false}
            autoComplete="off"
            placeholder="e.g. 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
            onChange={(event) => setExpected(event.target.value)}
            className="font-mono text-[0.8125rem]"
          />
        </Field>

        <fieldset className="space-y-2">
          <legend className="text-[0.8125rem] font-medium text-fg">Algorithms</legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {ALGORITHMS.map((entry) => (
              <Checkbox
                key={entry.id}
                label={entry.label}
                description={entry.note}
                checked={selected[entry.id] || parsed?.algorithm === entry.id}
                disabled={parsed?.algorithm === entry.id}
                onChange={(event) => setSelected((previous) => ({ ...previous, [entry.id]: event.target.checked }))}
              />
            ))}
          </div>
        </fieldset>

        {progress ? (
          <div className="space-y-2">
            <ProgressIndicator
              value={progress.total > 0 ? (progress.done / progress.total) * 100 : undefined}
              label={`Hashing ${formatBytes(progress.done)} of ${formatBytes(progress.total)}…`}
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => (cancelled.current = true)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button type="button" onClick={() => void run()} disabled={!file || Boolean(expectedError)}>
            Calculate checksums
          </Button>
        )}

        {comparison !== null ? (
          <div
            role="status"
            className={cn(
              "flex items-start gap-3 rounded-lg p-4",
              comparison ? "border border-success-border bg-success-soft text-fg" : "border-2 border-fg bg-fg text-bg",
            )}
          >
            {comparison ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            ) : (
              <XCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            )}
            <div>
              <p className="font-semibold">
                {comparison ? `Match — the ${algorithmLabel} checksums are identical` : `No match — the ${algorithmLabel} checksums differ`}
              </p>
              <p className="text-sm opacity-90">
                {comparison
                  ? "Your file is byte-for-byte the same as the one the checksum was published for."
                  : "The file is not the one the checksum describes. Download it again, and check you copied the checksum for the right file and version."}
              </p>
            </div>
          </div>
        ) : null}

        {Object.keys(results).length > 0 ? (
          <dl className="space-y-2" aria-live="polite">
            {ALGORITHMS.filter((entry) => results[entry.id]).map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-xs font-medium tracking-wide text-fg-muted uppercase">{entry.label}</dt>
                  <CopyButton value={results[entry.id] ?? ""} />
                </div>
                <dd className="mt-1 font-mono text-[0.8125rem] break-all text-fg">{results[entry.id]}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </ToolFrame>
  );
}
