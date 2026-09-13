import Image from "next/image";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * The brand mark beside the name. The mark is a transparent PNG cropped to the
 * cube itself, so it needs no plate behind it and reads on either theme.
 * Regenerate it with scripts/make-brand-assets.mjs after changing the source art.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image src="/logo-mark.png" alt="" aria-hidden="true" width={28} height={28} priority className="size-7" />
      {compact ? null : (
        <span className="text-[0.9375rem] font-semibold tracking-tight text-fg">
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}
