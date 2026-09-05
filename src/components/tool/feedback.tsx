"use client";

import * as React from "react";
import { Check, Copy, Download, RotateCcw } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/download";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Progress                                                                    */
/* -------------------------------------------------------------------------- */

export interface ProgressIndicatorProps {
  /** 0–100. Omit when the work has no measurable progress. */
  value?: number;
  label: string;
  className?: string;
}

export function ProgressIndicator({ value, label, className }: ProgressIndicatorProps) {
  const determinate = typeof value === "number" && Number.isFinite(value);
  const percent = determinate ? Math.min(100, Math.max(0, value)) : 0;

  return (
    <div className={cn("space-y-2", className)} role="status" aria-live="polite">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-fg">{label}</p>
        {determinate ? (
          <p className="tabular text-sm text-fg-muted">{Math.round(percent)}%</p>
        ) : null}
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
        role="progressbar"
        aria-label={label}
        {...(determinate
          ? { "aria-valuenow": Math.round(percent), "aria-valuemin": 0, "aria-valuemax": 100 }
          : {})}
      >
        <div
          className={cn(
            "h-full rounded-full bg-accent transition-[width] duration-200",
            !determinate && "w-1/3 animate-[indeterminate_1.4s_ease-in-out_infinite]",
          )}
          style={determinate ? { width: `${percent}%` } : undefined}
        />
      </div>
      <style>{`@keyframes indeterminate{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Errors                                                                      */
/* -------------------------------------------------------------------------- */

export function ErrorMessage({
  message,
  onDismiss,
  className,
}: {
  message: string | null;
  onDismiss?: () => void;
  className?: string;
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-lg border-2 border-danger-border bg-danger-soft p-3.5 text-sm",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-fg text-[10px] font-bold text-bg"
      >
        !
      </span>
      <p className="min-w-0 flex-1 font-medium text-fg">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs font-medium text-fg-muted underline underline-offset-2 hover:text-fg"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

export interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  value: string;
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  iconOnly = false,
  variant = "secondary",
  size,
  disabled,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size ?? (iconOnly ? "icon-sm" : "sm")}
        disabled={disabled || value.length === 0}
        aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
        onClick={async () => {
          const ok = await copyToClipboard(value);
          if (!ok) return;
          setCopied(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1800);
        }}
        {...props}
      >
        {copied ? (
          <Check className="size-4 shrink-0 text-fg" aria-hidden="true" />
        ) : (
          <Copy className="size-4 shrink-0" aria-hidden="true" />
        )}
        {iconOnly ? null : copied ? copiedLabel : label}
      </Button>
      {/* Announce the copy for screen readers without moving focus. */}
      <span aria-live="polite" className="sr-only">
        {copied ? `${copiedLabel} to clipboard` : ""}
      </span>
    </>
  );
}

export interface DownloadButtonProps extends Omit<ButtonProps, "onClick"> {
  onDownload: () => void | Promise<void>;
  children: React.ReactNode;
}

export function DownloadButton({ onDownload, children, ...props }: DownloadButtonProps) {
  const [busy, setBusy] = React.useState(false);

  return (
    <Button
      type="button"
      loading={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await onDownload();
        } finally {
          setBusy(false);
        }
      }}
      {...props}
    >
      {busy ? null : <Download className="size-4 shrink-0" aria-hidden="true" />}
      {children}
    </Button>
  );
}

export function ResetButton({
  onReset,
  children = "Start over",
  ...props
}: Omit<ButtonProps, "onClick"> & { onReset: () => void }) {
  return (
    <Button type="button" variant="ghost" size="sm" onClick={onReset} {...props}>
      <RotateCcw className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* Result                                                                      */
/* -------------------------------------------------------------------------- */

export interface ResultPanelProps {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions: React.ReactNode;
  onReset?: () => void;
  resetLabel?: string;
  className?: string;
}

/** The "your file is ready" card every file tool ends on. */
export function ResultPanel({
  title,
  description,
  children,
  actions,
  onReset,
  resetLabel,
  className,
}: ResultPanelProps) {
  return (
    <section
      aria-live="polite"
      className={cn(
        "rounded-[var(--radius-card)] border border-success-border bg-success-soft p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-fg text-bg">
          <Check className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-fg">{title}</h3>
          {description ? <p className="mt-0.5 text-sm text-fg-muted">{description}</p> : null}
        </div>
      </div>

      {children ? <div className="mt-4">{children}</div> : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {actions}
        {onReset ? <ResetButton onReset={onReset}>{resetLabel ?? "Process another file"}</ResetButton> : null}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                 */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-border px-6 py-10 text-center",
        className,
      )}
    >
      {Icon ? <Icon className="size-6 text-fg-subtle" aria-hidden="true" /> : null}
      <p className="text-sm font-medium text-fg">{title}</p>
      {description ? <p className="max-w-sm text-sm text-fg-muted">{description}</p> : null}
    </div>
  );
}
