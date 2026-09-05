import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Text-first wordmark with a small geometric glyph. Deliberately simple so
 * swapping in a real brand mark later is a one-file change.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-[7px] bg-fg text-bg"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" strokeWidth="2.25" stroke="currentColor">
          <path d="M4 7h16M4 12h10M4 17h6" strokeLinecap="round" />
          <circle cx="18.5" cy="15.5" r="3.5" />
        </svg>
      </span>
      {compact ? null : (
        <span className="text-[0.9375rem] font-semibold tracking-tight text-fg">
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}
