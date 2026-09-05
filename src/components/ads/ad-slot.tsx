"use client";

import * as React from "react";

import { adsConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Advertising container.
 *
 * The layout reserves the slot's height up front so a late-loading ad cannot
 * push the tool around, and every slot is labelled. Nothing here overlaps or
 * imitates a tool control: ad areas sit between sections, never beside an
 * action button.
 *
 * When no publisher id is configured the slot renders a dashed outline in
 * development and disappears entirely in production, rather than leaving a
 * permanent empty gap on a live page.
 */

const PLACEMENTS = {
  leaderboard: {
    slotKey: "leaderboard" as const,
    minHeight: "min-h-[100px] sm:min-h-[90px]",
    format: "horizontal",
  },
  inContent: {
    slotKey: "inContent" as const,
    minHeight: "min-h-[250px]",
    format: "rectangle",
  },
  footer: {
    slotKey: "footer" as const,
    minHeight: "min-h-[100px] sm:min-h-[90px]",
    format: "horizontal",
  },
} as const;

export type AdPlacement = keyof typeof PLACEMENTS;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
  /** Overrides the default "Advertisement" label. */
  label?: string;
}

export function AdSlot({ placement, className, label = "Advertisement" }: AdSlotProps) {
  const config = PLACEMENTS[placement];
  const slotId = adsConfig.slots[config.slotKey];
  const active = adsConfig.enabled && slotId.length > 0;
  const pushed = React.useRef(false);

  React.useEffect(() => {
    if (!active || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // A blocked or failed ad must never break the tool on the page.
    }
  }, [active]);

  if (!active) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex w-full items-center justify-center rounded-[var(--radius-card)] border border-dashed border-border text-[0.6875rem] tracking-widest text-fg-subtle uppercase",
          config.minHeight,
          className,
        )}
      >
        {label} · {placement}
      </div>
    );
  }

  return (
    <aside
      aria-label={label}
      className={cn("w-full overflow-hidden", config.minHeight, className)}
    >
      <p className="mb-1 text-center text-[0.625rem] tracking-widest text-fg-subtle uppercase">
        {label}
      </p>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={adsConfig.publisherId}
        data-ad-slot={slotId}
        data-ad-format={config.format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
