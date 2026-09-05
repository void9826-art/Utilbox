import * as React from "react";

import { cn } from "@/lib/utils";

/** The card every interactive tool lives inside. */
export function ToolFrame({
  children,
  className,
  padded = true,
}: {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface shadow-raised",
        padded && "p-4 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ToolSkeleton() {
  return (
    <div
      className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-raised"
      role="status"
      aria-label="Loading the tool"
    >
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-40 rounded bg-bg-muted" />
        <div className="h-32 w-full rounded-lg bg-bg-muted" />
        <div className="flex gap-3">
          <div className="h-10 w-32 rounded-lg bg-bg-muted" />
          <div className="h-10 w-24 rounded-lg bg-bg-muted" />
        </div>
      </div>
    </div>
  );
}

/** Two-column layout used by tools with settings beside a preview. */
export function ToolColumns({
  main,
  aside,
  asideFirstOnMobile = false,
}: {
  main: React.ReactNode;
  aside: React.ReactNode;
  asideFirstOnMobile?: boolean;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className={cn("min-w-0", asideFirstOnMobile && "order-2 lg:order-1")}>{main}</div>
      <div className={cn("min-w-0 space-y-4", asideFirstOnMobile && "order-1 lg:order-2")}>{aside}</div>
    </div>
  );
}

export function SettingsGroup({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      {title ? (
        <h3 className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
          {title}
        </h3>
      ) : null}
      {children}
    </section>
  );
}
