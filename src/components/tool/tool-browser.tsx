"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { ToolCard } from "@/components/tool/tool-card";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/config/categories";
import { TOOLS, getToolsByCategory } from "@/config/tools";
import { filterTools } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/types/tool";

export interface ToolBrowserProps {
  /** Restricts the browser to one category. Omit to browse everything. */
  scope?: CategoryId;
  /** Shows category filter chips. Off inside a single category. */
  showCategoryFilter?: boolean;
  showCategoryLabels?: boolean;
  emptyHint?: string;
}

/**
 * The browser as it reads the page's ?q= parameter.
 *
 * useSearchParams makes a statically prerendered page render nothing inside
 * the nearest Suspense boundary until the client takes over, so wrap this in
 * <Suspense fallback={<ToolBrowserPanel … />}>. The fallback is what goes into
 * the HTML: every tool card as a plain link, which is how crawlers reach the
 * tools from a category page, and the same layout the client then swaps in.
 */
export function ToolBrowser(props: ToolBrowserProps) {
  const searchParams = useSearchParams();
  return <ToolBrowserPanel {...props} urlQuery={searchParams.get("q") ?? ""} />;
}

export function ToolBrowserPanel({
  scope,
  showCategoryFilter = false,
  showCategoryLabels = false,
  emptyHint = "Try a broader word such as “pdf”, “image”, “loan” or “json”.",
  urlQuery = "",
}: ToolBrowserProps & {
  /** A query from the address bar, shown until the visitor types their own. */
  urlQuery?: string;
}) {
  // The registry is read here rather than passed in: each tool carries an icon
  // component, and React components cannot be serialised across the boundary
  // from a Server Component to a Client one.
  const tools = React.useMemo(() => (scope ? getToolsByCategory(scope) : TOOLS), [scope]);

  const [typedQuery, setTypedQuery] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<CategoryId | "all">("all");
  const inputRef = React.useRef<HTMLInputElement>(null);

  /**
   * A ?q= parameter makes results linkable and backs the site-wide
   * SearchAction. It is read as derived state rather than copied into state in
   * an effect: during static prerender the parameter is not available, so an
   * effect would leave the field briefly empty after hydration. Once the
   * visitor types, their input takes over.
   */
  const query = typedQuery ?? urlQuery;
  const setQuery = setTypedQuery;

  const visible = React.useMemo(() => {
    const byCategory =
      category === "all" ? tools : tools.filter((tool) => tool.category === category);
    return filterTools(byCategory, query);
  }, [category, query, tools]);

  const categoryCounts = React.useMemo(() => {
    const counts = new Map<CategoryId, number>();
    for (const tool of tools) counts.set(tool.category, (counts.get(tool.category) ?? 0) + 1);
    return counts;
  }, [tools]);

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-fg-subtle"
          aria-hidden="true"
        />
        <label htmlFor="tool-browser-search" className="sr-only">
          Filter tools
        </label>
        <input
          ref={inputRef}
          id="tool-browser-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Filter ${tools.length} tools by name, description or keyword…`}
          className="h-11 w-full rounded-lg border border-border bg-surface pr-10 pl-10 text-sm text-fg shadow-subtle transition-colors placeholder:text-fg-subtle hover:border-border-strong focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-fg-subtle transition-colors hover:bg-bg-muted hover:text-fg"
            aria-label="Clear the filter"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {showCategoryFilter ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <FilterChip
            active={category === "all"}
            onClick={() => setCategory("all")}
            label="All"
            count={tools.length}
          />
          {CATEGORIES.map((item) => (
            <FilterChip
              key={item.id}
              active={category === item.id}
              onClick={() => setCategory(item.id)}
              label={item.name}
              count={categoryCounts.get(item.id) ?? 0}
              icon={item.icon}
            />
          ))}
        </div>
      ) : null}

      <p className="text-[0.8125rem] text-fg-muted" aria-live="polite">
        {visible.length === tools.length
          ? `${tools.length} tools`
          : `${visible.length} of ${tools.length} tools`}
      </p>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-border px-6 py-14 text-center">
          <p className="text-sm font-medium text-fg">No tools match “{query.trim()}”.</p>
          <p className="max-w-sm text-sm text-fg-muted">{emptyHint}</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              showCategory={showCategoryLabels && category === "all"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
      )}
    >
      {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
      {label}
      <span className={cn("tabular text-[0.6875rem]", active ? "opacity-80" : "text-fg-subtle")}>
        {count}
      </span>
    </button>
  );
}
