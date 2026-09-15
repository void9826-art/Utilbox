"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A container whose border lights up nearest the pointer.
 *
 * Adapted from the supplied border-glow component, with its purple and pink
 * sample colours replaced by the brand tint. The effect is gated three ways:
 * it is skipped when the visitor prefers reduced motion, it never starts on a
 * device without a fine pointer, and it is purely decorative, so nothing
 * inside depends on it being visible.
 */
export function GlowFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !still.matches);
    update();
    fine.addEventListener("change", update);
    still.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      still.removeEventListener("change", update);
    };
  }, []);

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    // Percentages rather than pixels, so the highlight lands in the same place
    // whatever size the container happens to be.
    ref.current.style.setProperty("--glow-x", `${((event.clientX - box.left) / box.width) * 100}%`);
    ref.current.style.setProperty("--glow-y", `${((event.clientY - box.top) / box.height) * 100}%`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={track}
      className={cn("glow-frame relative rounded-[var(--radius-card)]", enabled && "glow-frame-live", className)}
    >
      {children}
    </div>
  );
}
