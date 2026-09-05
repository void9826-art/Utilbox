"use client";

import * as React from "react";
import { Upload } from "lucide-react";

import { CodeEditor } from "@/components/tool/code-editor";
import { ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Segmented } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { applyVariant, bytesToBase64, encodeText } from "@/lib/base64";
import { MAX_FILE_SIZE } from "@/lib/files";
import { formatBytes } from "@/lib/utils";

export default function Base64Encoder() {
  const [mode, setMode] = React.useState<"text" | "file">("text");
  const [text, setText] = React.useState("");
  const [urlSafe, setUrlSafe] = React.useState(false);
  const [padded, setPadded] = React.useState(true);
  const [asDataUri, setAsDataUri] = React.useState(false);
  const [fileResult, setFileResult] = React.useState<{
    name: string;
    size: number;
    mime: string;
    base64: string;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const output = React.useMemo(() => {
    if (mode === "text") {
      if (!text) return "";
      return encodeText(text, urlSafe, padded);
    }
    if (!fileResult) return "";
    const encoded = applyVariant(fileResult.base64, urlSafe, padded);
    return asDataUri ? `data:${fileResult.mime};base64,${encoded}` : encoded;
  }, [asDataUri, fileResult, mode, padded, text, urlSafe]);

  const inputBytes =
    mode === "text" ? new TextEncoder().encode(text).length : (fileResult?.size ?? 0);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_FILE_SIZE.document) {
      setError(`"${file.name}" is larger than the 25 MB limit for this tool.`);
      return;
    }
    const bytes = new Uint8Array(await file.arrayBuffer());
    setFileResult({
      name: file.name,
      size: file.size,
      mime: file.type || "application/octet-stream",
      base64: bytesToBase64(bytes),
    });
  };

  return (
    <ToolFrame>
      <div className="space-y-4">
        <Segmented
          name="base64-mode"
          ariaLabel="What to encode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "text", label: "Encode text" },
            { value: "file", label: "Encode a file" },
          ]}
          className="sm:max-w-sm"
        />

        {mode === "text" ? (
          <CodeEditor
            id="base64-input"
            label="Text to encode"
            value={text}
            onChange={setText}
            rows={8}
            placeholder="Type or paste any text, including emoji and non-Latin scripts."
          />
        ) : (
          <div className="space-y-3">
            <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" aria-hidden="true" />
              Choose a file
            </Button>
            <input
              ref={fileRef}
              type="file"
              className="sr-only"
              tabIndex={-1}
              aria-label="Choose a file to encode"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void handleFile(file);
              }}
            />
            {fileResult ? (
              <div className="rounded-lg border border-border bg-surface-sunken px-3.5 py-2.5 text-sm">
                <p className="font-medium text-fg">{fileResult.name}</p>
                <p className="tabular text-xs text-fg-muted">
                  {formatBytes(fileResult.size)} · {fileResult.mime}
                </p>
              </div>
            ) : (
              <p className="text-sm text-fg-muted">
                Files up to 25 MB. The file is read in your browser and never uploaded.
              </p>
            )}
          </div>
        )}

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        <div className="grid gap-2.5 sm:grid-cols-3">
          <Checkbox
            label="URL-safe alphabet"
            description="Uses - and _ instead of + and /"
            checked={urlSafe}
            onChange={(event) => setUrlSafe(event.target.checked)}
          />
          <Checkbox
            label="Include padding"
            description="Trailing = characters"
            checked={padded}
            onChange={(event) => setPadded(event.target.checked)}
          />
          {mode === "file" ? (
            <Checkbox
              label="Produce a data URI"
              description="Ready to paste into HTML or CSS"
              checked={asDataUri}
              onChange={(event) => setAsDataUri(event.target.checked)}
            />
          ) : null}
        </div>

        {output ? (
          <StatGrid className="sm:grid-cols-3">
            <Stat label="Input size" value={formatBytes(inputBytes)} />
            <Stat label="Encoded size" value={formatBytes(new Blob([output]).size)} emphasis />
            <Stat
              label="Overhead"
              value={inputBytes > 0 ? `+${(((output.length - inputBytes) / inputBytes) * 100).toFixed(0)}%` : "—"}
              hint="Base64 always grows by about a third"
            />
          </StatGrid>
        ) : null}

        <CodeEditor
          id="base64-output"
          label="Base64 output"
          value={output}
          readOnly
          rows={8}
          downloadName="encoded.txt"
          placeholder="The encoded result will appear here."
        />

        <Alert tone="info" title="Base64 is not encryption">
          It is a reversible encoding with no key and no secret. Anyone who has the string can decode it
          instantly, so never use it to protect anything sensitive.
        </Alert>
      </div>
    </ToolFrame>
  );
}
