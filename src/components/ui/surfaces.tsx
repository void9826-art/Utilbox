import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface shadow-subtle",
        className,
      )}
      {...props}
    />
  );
}

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface-sunken p-4",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The palette is monochrome, so a badge's tone is carried by how filled it is
 * rather than by hue: neutral is an outline, danger is fully inverted.
 */
const BADGE_TONES = {
  neutral: "bg-bg-muted text-fg-muted border-border",
  accent: "bg-accent-soft text-accent-text border-accent-soft-border",
  success: "bg-success-soft text-fg border-success-border",
  warning: "bg-warning-soft text-fg border-warning-border font-semibold",
  danger: "bg-fg text-bg border-fg font-semibold",
} as const;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof BADGE_TONES;
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium tracking-wide",
        BADGE_TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

/**
 * Without hue to lean on, an alert's urgency is expressed three ways at once:
 * a distinct icon, a heavier left rule, and a darker fill. Danger inverts
 * entirely, so it cannot be mistaken for the calmer states.
 */
const ALERT_TONES = {
  info: {
    wrap: "border-border bg-surface-sunken text-fg border-l-[3px] border-l-border-strong",
    icon: Info,
    iconClass: "text-fg-muted",
    body: "text-fg-muted",
  },
  success: {
    wrap: "border-border bg-success-soft text-fg border-l-[3px] border-l-success-border",
    icon: CheckCircle2,
    iconClass: "text-fg",
    body: "text-fg-muted",
  },
  warning: {
    wrap: "border-border bg-warning-soft text-fg border-l-4 border-l-warning-border",
    icon: AlertTriangle,
    iconClass: "text-fg",
    body: "text-fg-muted",
  },
  danger: {
    wrap: "border-fg bg-fg text-bg border-l-4",
    icon: XCircle,
    iconClass: "text-bg",
    body: "text-bg/85",
  },
} as const;

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: keyof typeof ALERT_TONES;
  title?: React.ReactNode;
}

export function Alert({ className, tone = "info", title, children, ...props }: AlertProps) {
  const config = ALERT_TONES[tone];
  const Icon = config.icon;

  return (
    <div
      className={cn("flex gap-3 rounded-lg border p-3.5 text-sm", config.wrap, className)}
      role={tone === "danger" ? "alert" : "status"}
      {...props}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", config.iconClass)} aria-hidden="true" />
      <div className="min-w-0 flex-1 space-y-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? (
          <div className={cn(config.body, "[&_a]:underline [&_a]:underline-offset-2")}>{children}</div>
        ) : null}
      </div>
    </div>
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-bg-muted", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

/** A labelled statistic. Used for file sizes, counts and calculator outputs. */
export interface StatProps {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  emphasis?: boolean;
  className?: string;
}

export function Stat({ label, value, hint, emphasis, className }: StatProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3.5",
        emphasis ? "border-accent-soft-border bg-accent-soft" : "border-border bg-surface",
        className,
      )}
    >
      <dt className="text-xs font-medium tracking-wide text-fg-muted uppercase">{label}</dt>
      <dd
        className={cn(
          "tabular mt-1 font-semibold break-words",
          emphasis ? "text-xl text-accent-text sm:text-2xl" : "text-lg text-fg",
        )}
      >
        {value}
      </dd>
      {hint ? <p className="mt-0.5 text-xs text-fg-subtle">{hint}</p> : null}
    </div>
  );
}

export function StatGrid({ className, ...props }: React.HTMLAttributes<HTMLDListElement>) {
  return (
    <dl
      className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}
      {...props}
    />
  );
}

/** Key/value row used inside result panels and "how it was worked out" lists. */
export function DataRow({
  label,
  value,
  strong,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-border py-2 last:border-0",
        strong && "font-semibold text-fg",
      )}
    >
      <dt className={cn("text-sm", strong ? "text-fg" : "text-fg-muted")}>{label}</dt>
      <dd className={cn("tabular text-right text-sm", strong ? "text-fg" : "text-fg")}>{value}</dd>
    </div>
  );
}
