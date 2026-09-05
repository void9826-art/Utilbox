"use client";

import * as React from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Alert, Badge, Stat, StatGrid } from "@/components/ui/surfaces";
import { Base64Error, decodeToBytes, decodeToText, sniffMediaType } from "@/lib/base64";
import { downloadBytes } from "@/lib/download";
import { formatBytes } from "@/lib/utils";

export default function Base64Decoder() {
  const [input, setInput] = React.useState("");

  const result = React.useMemo(() => {
    if (!input.trim()) return null;

    try {
      const { bytes, mediaType } = decodeToBytes(input);
      const { text, isText } = decodeToText(bytes);
      const sniffed = sniffMediaType(bytes);

      return {
        ok: true as const,
        bytes,
        text,
        isText,
        mediaType: mediaType ?? sniffed?.mime ?? null,
        extension: sniffed?.extension ?? (isText ? "txt" : "bin"),
      };
    } catch (error) {
      return {
        ok: false as const,
        message:
          error instanceof Base64Error
            ? error.message
            : "That input could not be decoded as Base64.",
      };
    }
  }, [input]);

  return (
    <ToolFrame>
      <div className="space-y-4">
        <CodeEditor
          id="base64-decoder-input"
          label="Base64 input"
          value={input}
          onChange={setInput}
          rows={8}
          placeholder="Paste Base64 here. URL-safe input, missing padding and data URIs are all handled."
        />

        {result && !result.ok ? <ErrorMessage message={result.message} /> : null}

        {result?.ok ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="success">Decoded successfully</Badge>
              {result.isText ? (
                <Badge tone="accent">Valid UTF-8 text</Badge>
              ) : (
                <Badge tone="warning">Binary data</Badge>
              )}
              {result.mediaType ? <Badge>{result.mediaType}</Badge> : null}
            </div>

            <StatGrid className="sm:grid-cols-3">
              <Stat label="Decoded size" value={formatBytes(result.bytes.length)} emphasis />
              <Stat label="Encoded size" value={formatBytes(new Blob([input]).size)} />
              <Stat label="Content" value={result.isText ? "Text" : "Binary"} />
            </StatGrid>

            {result.isText ? (
              <CodeEditor
                id="base64-decoder-output"
                label="Decoded text"
                value={result.text}
                readOnly
                rows={8}
                downloadName="decoded.txt"
              />
            ) : (
              <Alert tone="info" title="This decodes to binary data, not text">
                <p>
                  The bytes are not valid UTF-8, so they are almost certainly a file rather than a message.
                  {result.mediaType ? ` It looks like ${result.mediaType}.` : ""}
                </p>
                <Button
                  type="button"
                  className="mt-3"
                  onClick={() =>
                    downloadBytes(
                      result.bytes,
                      `decoded.${result.extension}`,
                      result.mediaType ?? "application/octet-stream",
                    )
                  }
                >
                  Download the file
                </Button>
              </Alert>
            )}

            {result.isText ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  downloadBytes(
                    result.bytes,
                    `decoded.${result.extension}`,
                    result.mediaType ?? "text/plain",
                  )
                }
              >
                Download as a file
              </Button>
            ) : null}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
