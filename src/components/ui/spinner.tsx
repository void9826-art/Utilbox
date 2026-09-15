import { cn } from "@/lib/utils";

export interface SpinnerProps {
  /** Announced to screen readers, and shown beside the ring. */
  label?: string;
  className?: string;
}

/**
 * The indeterminate activity indicator.
 *
 * Adapted from the supplied loader. That sample drew a fixed black ring,
 * which disappears against the dark theme, so the ring here comes from the
 * border token. Under prefers-reduced-motion the spin is dropped and the ring
 * stands still, which is why the label carries the meaning, not the movement.
 */
export function Spinner({ label = "Working", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-[0.8125rem] text-fg-muted", className)}
    >
      <span
        aria-hidden="true"
        className="size-4 shrink-0 animate-spin rounded-full border-2 border-border border-l-transparent motion-reduce:animate-none"
      />
      <span>{label}</span>
    </span>
  );
}
