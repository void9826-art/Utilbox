"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Kbd, useToolSearch } from "@/components/layout/search-dialog";
import { TOOL_COUNT } from "@/config/tools";

/**
 * The homepage search field. It is a button rather than an input: tapping it
 * opens the same command palette as Cmd+K, so there is one search experience
 * rather than two that behave differently.
 */
export function HeroSearch() {
  const search = useToolSearch();

  return (
    <button
      type="button"
      onClick={search.open}
      className="group flex h-13 w-full max-w-xl items-center gap-3 rounded-xl border border-border bg-surface px-4 text-left shadow-raised transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-overlay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <Search className="size-5 shrink-0 text-fg-subtle" aria-hidden="true" />
      <span className="flex-1 truncate text-[0.9375rem] text-fg-subtle">
        Search {TOOL_COUNT} tools — try “pdf”, “loan” or “json”
      </span>
      <span className="hidden shrink-0 items-center gap-1 sm:flex">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}
