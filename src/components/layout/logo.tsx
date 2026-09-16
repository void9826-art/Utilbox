import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The brand mark beside the name. The cube is painted through a CSS mask (see
 * .logo-mark in globals.css) so it inherits the text colour and inverts with
 * the theme — the source art is black, and an <img> of it would be all but
 * invisible against the dark background.
 *
 * Regenerate the mask with scripts/make-brand-assets.mjs after changing the
 * source art in /brand.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-fg", className)}>
      <span aria-hidden="true" className="logo-mark size-7 shrink-0" />
      {compact ? null : (
        <span className="text-[0.9375rem] font-semibold tracking-tight text-fg">
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}
