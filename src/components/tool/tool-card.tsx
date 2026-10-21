import Link from "next/link";

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
      className={cn("group tool-card", className)}
    >
      <span className="tool-card-icon">
        <Icon className="size-[1.125rem]" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-fg">{tool.name}</span>
          <span className="tool-card-arrow" aria-hidden="true" />
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
