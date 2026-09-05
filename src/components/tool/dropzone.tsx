"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";

import { acceptFile, FileRejectedError, type AcceptOptions } from "@/lib/files";
import { cn } from "@/lib/utils";

export interface DropzoneProps {
  accept: AcceptOptions;
  /** Comma-separated `accept` attribute, e.g. ".pdf,application/pdf". */
  inputAccept: string;
  multiple?: boolean;
  disabled?: boolean;
  hint?: React.ReactNode;
  label?: string;
  compact?: boolean;
  onFiles: (files: File[]) => void;
  onError: (message: string) => void;
  className?: string;
}

export function Dropzone({
  accept,
  inputAccept,
  multiple = false,
  disabled = false,
  hint,
  label,
  compact = false,
  onFiles,
  onError,
  className,
}: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  const dragDepth = React.useRef(0);

  const handleFiles = React.useCallback(
    async (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      if (incoming.length === 0) return;

      const candidates = multiple ? incoming : incoming.slice(0, 1);
      setChecking(true);

      const accepted: File[] = [];
      const problems: string[] = [];

      for (const file of candidates) {
        try {
          await acceptFile(file, accept);
          accepted.push(file);
        } catch (error) {
          problems.push(
            error instanceof FileRejectedError
              ? error.message
              : `"${file.name}" could not be read.`,
          );
        }
      }

      setChecking(false);

      if (problems.length > 0) {
        onError(problems.length === 1 ? problems[0] : `${problems.length} files were skipped. ${problems[0]}`);
      }
      if (accepted.length > 0) {
        onFiles(accepted);
      }
    },
    [accept, multiple, onError, onFiles],
  );

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-label={label ?? `Choose ${accept.label} files`}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (disabled) return;
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          if (disabled) return;
          void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center rounded-[var(--radius-card)] border-2 border-dashed text-center transition-colors",
          compact ? "gap-2 px-4 py-6" : "gap-3 px-6 py-10 sm:py-14",
          dragging
            ? "border-accent bg-accent-soft"
            : "border-border-strong bg-surface-sunken hover:border-accent hover:bg-accent-soft/50",
          disabled && "pointer-events-none opacity-55",
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center rounded-full border border-border bg-surface text-accent-text shadow-subtle",
            compact ? "size-9" : "size-12",
          )}
        >
          <UploadCloud className={compact ? "size-4" : "size-5"} aria-hidden="true" />
        </span>

        <span className="space-y-1">
          <span className={cn("block font-semibold text-fg", compact ? "text-sm" : "text-base")}>
            {checking
              ? "Checking files…"
              : dragging
                ? `Drop to add ${multiple ? "files" : "the file"}`
                : `Drop ${multiple ? `${accept.label} files` : `a ${accept.label} file`} here`}
          </span>
          <span className="block text-sm text-fg-muted">
            or <span className="font-medium text-accent-text underline underline-offset-2">browse your device</span>
          </span>
        </span>

        {hint ? <span className="block text-xs text-fg-subtle">{hint}</span> : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={inputAccept}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        aria-label="Choose files"
        onChange={(event) => {
          const { files } = event.target;
          if (files) void handleFiles(files);
          // Reset so picking the same file twice still fires a change event.
          event.target.value = "";
        }}
      />
    </div>
  );
}
