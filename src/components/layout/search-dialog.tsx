"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search, X } from "lucide-react";

import { CATEGORY_BY_ID } from "@/config/categories";
import { POPULAR_TOOLS, TOOL_COUNT, toolHref } from "@/config/tools";
import { track } from "@/lib/analytics";
import { searchTools } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { ToolMeta } from "@/types/tool";

/**
 * Command-palette search over the tool registry.
 *
 * Opens on Ctrl/Cmd+K or "/" and is fully keyboard driven: arrows move the
 * active row, Enter opens it, Escape closes and returns focus to the trigger.
 */

interface SearchContextValue {
  open: () => void;
}

const SearchContext = React.createContext<SearchContextValue | null>(null);

export function useToolSearch(): SearchContextValue {
  const context = React.useContext(SearchContext);
  if (!context) throw new Error("useToolSearch must be used inside <SearchProvider>");
  return context;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const restoreFocusTo = React.useRef<HTMLElement | null>(null);

  const open = React.useCallback(() => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    restoreFocusTo.current?.focus?.();
  }, []);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((current) => {
          if (!current) restoreFocusTo.current = document.activeElement as HTMLElement | null;
          return !current;
        });
        return;
      }

      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        restoreFocusTo.current = document.activeElement as HTMLElement | null;
        setIsOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = React.useMemo(() => ({ open }), [open]);

  return (
    <SearchContext.Provider value={value}>
      {children}
      {isOpen ? <SearchDialog onClose={close} /> : null}
    </SearchContext.Provider>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selection, setSelection] = React.useState<{ query: string; index: number }>({
    query: "",
    index: 0,
  });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();

  const results: ToolMeta[] = React.useMemo(() => {
    if (!query.trim()) return POPULAR_TOOLS.slice(0, 8);
    return searchTools(query, 10).map((result) => result.tool);
  }, [query]);

  // The highlight is stored together with the query it belongs to. Typing
  // therefore returns it to the first result as a matter of derivation, with
  // no effect firing a render after the new list has already been painted.
  const activeIndex = selection.query === query ? Math.min(selection.index, Math.max(0, results.length - 1)) : 0;
  const setActiveIndex = React.useCallback(
    (updater: (current: number) => number) =>
      setSelection((previous) => ({
        query,
        index: updater(previous.query === query ? previous.index : 0),
      })),
    [query],
  );

  React.useEffect(() => {
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Report result counts only — never the query text.
  React.useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => track({ name: "search_used", resultCount: results.length }), 600);
    return () => clearTimeout(timer);
  }, [query, results.length]);

  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const go = (tool: ToolMeta) => {
    onClose();
    router.push(toolHref(tool));
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
      return;
    }
    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex]);
      return;
    }
    if (event.key === "Tab") {
      // Only two focusable elements; keep the ring inside the dialog.
      event.preventDefault();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] pb-8"
      onKeyDown={onKeyDown}
    >
      <div
        className="absolute inset-0 bg-fg/25 backdrop-blur-[2px] dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search tools"
        className="relative flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-overlay"
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-fg-subtle" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${TOOL_COUNT} tools…`}
            className="h-13 w-full bg-transparent py-4 text-[0.9375rem] text-fg outline-none placeholder:text-fg-subtle"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-fg-subtle transition-colors hover:bg-bg-muted hover:text-fg"
            aria-label="Close search"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {results.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-fg">No tools match “{query.trim()}”.</p>
            <p className="mt-1 text-sm text-fg-muted">
              Try a broader word such as “pdf”, “image”, “loan” or “json”.
            </p>
          </div>
        ) : (
          <>
            {!query.trim() ? (
              <p className="px-4 pt-3 text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
                Popular tools
              </p>
            ) : null}
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label="Search results"
              className="scrollbar-slim min-h-0 flex-1 overflow-y-auto p-2"
            >
              {results.map((tool, index) => {
                const Icon = tool.icon;
                const active = index === activeIndex;
                return (
                  <li key={tool.slug}>
                    <button
                      type="button"
                      id={`${listId}-${index}`}
                      data-index={index}
                      role="option"
                      aria-selected={active}
                      onMouseMove={() => setActiveIndex(() => index)}
                      onClick={() => go(tool)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors",
                        active ? "bg-accent-soft" : "hover:bg-bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-md border",
                          active
                            ? "border-accent-soft-border bg-surface text-accent-text"
                            : "border-border bg-surface-sunken text-fg-muted",
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-fg">{tool.name}</span>
                        <span className="block truncate text-xs text-fg-muted">{tool.description}</span>
                      </span>
                      <span className="hidden shrink-0 text-[0.6875rem] text-fg-subtle sm:block">
                        {CATEGORY_BY_ID[tool.category].shortName}
                      </span>
                      {active ? (
                        <CornerDownLeft className="size-3.5 shrink-0 text-accent-text" aria-hidden="true" />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <div className="hidden items-center gap-4 border-t border-border bg-surface-sunken px-4 py-2 text-[0.6875rem] text-fg-subtle sm:flex">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to navigate
          </span>
          <span className="flex items-center gap-1">
            <Kbd>Enter</Kbd> to open
          </span>
          <span className="flex items-center gap-1">
            <Kbd>Esc</Kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-surface px-1 font-sans text-[0.6875rem] font-medium text-fg-muted">
      {children}
    </kbd>
  );
}
