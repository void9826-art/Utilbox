"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, FileIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatBytes } from "@/lib/utils";

export interface FileListItem {
  id: string;
  file: File;
  /** Optional per-row detail, e.g. "12 pages" or "1920 × 1080". */
  meta?: React.ReactNode;
  thumbnail?: string;
}

export interface FileListProps {
  items: FileListItem[];
  onRemove?: (id: string) => void;
  onMove?: (id: string, direction: -1 | 1) => void;
  /** Shown above the list, e.g. "3 files · 4.2 MB". */
  summary?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function FileList({ items, onRemove, onMove, summary, disabled, className }: FileListProps) {
  if (items.length === 0) return null;

  const totalBytes = items.reduce((sum, item) => sum + item.file.size, 0);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[0.8125rem] font-semibold text-fg">
          {summary ?? `${items.length} file${items.length === 1 ? "" : "s"} selected`}
        </h3>
        <span className="tabular text-xs text-fg-subtle">{formatBytes(totalBytes)} total</span>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center gap-3 p-2.5 sm:p-3">
            {item.thumbnail ? (
              // Object URLs of user files: next/image cannot optimise these.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnail}
                alt=""
                className="size-10 shrink-0 rounded border border-border bg-surface-sunken object-cover"
              />
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center rounded border border-border bg-surface-sunken text-fg-subtle">
                <FileIcon className="size-4" aria-hidden="true" />
              </span>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg" title={item.file.name}>
                {item.file.name}
              </p>
              <p className="tabular text-xs text-fg-subtle">
                {formatBytes(item.file.size)}
                {item.meta ? <span className="mx-1.5 text-border-strong">·</span> : null}
                {item.meta}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              {onMove ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={disabled || index === 0}
                    onClick={() => onMove(item.id, -1)}
                    aria-label={`Move ${item.file.name} up`}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={disabled || index === items.length - 1}
                    onClick={() => onMove(item.id, 1)}
                    aria-label={`Move ${item.file.name} down`}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </Button>
                </>
              ) : null}

              {onRemove ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  onClick={() => onRemove(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
