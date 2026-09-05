import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CATEGORY_BY_ID } from "@/config/categories";
import { toolHref } from "@/config/tools";
import { cn } from "@/lib/utils";
import type { ToolMeta } from "@/types/tool";

export interface ToolCardProps {
  tool: ToolMeta;
  /** Show which category the tool belongs to. Off inside category pages. */
  showCategory?: boolean;
  className?: string;
}

export function ToolCard({ tool, showCategory = false, className }: ToolCardProps) {
  const Icon = tool.icon;
  const category = CATEGORY_BY_ID[tool.category];

  return (
    <Link
      href={toolHref(tool)}
      className={cn(
        "group relative flex items-start gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-3.5 transition-[border-color,box-shadow,transform] duration-150",
        "hover:-translate-y-px hover:border-border-strong hover:shadow-raised",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-sunken text-fg-muted transition-colors group-hover:border-accent-soft-border group-hover:bg-accent-soft group-hover:text-accent-text">
        <Icon className="size-[1.125rem]" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-fg">{tool.name}</span>
          <ArrowRight
            className="size-3.5 shrink-0 -translate-x-1 text-accent-text opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-fg-muted">
          {tool.description}
        </span>
        {showCategory ? (
          <span className="mt-1.5 block text-[0.6875rem] font-medium tracking-wide text-fg-subtle uppercase">
            {category.name}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export function ToolGrid({
  tools,
  showCategory,
  className,
}: {
  tools: ToolMeta[];
  showCategory?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}
      role="list"
    >
      {tools.map((tool) => (
        <div key={tool.slug} role="listitem" className="contents">
          <ToolCard tool={tool} showCategory={showCategory} />
        </div>
      ))}
    </div>
  );
}
