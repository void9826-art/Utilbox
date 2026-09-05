import Link from "next/link";
import type { Metadata } from "next";

import { ToolGrid } from "@/components/tool/tool-card";
import { CATEGORIES } from "@/config/categories";
import { POPULAR_TOOLS, TOOL_COUNT } from "@/config/tools";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-[0.8125rem] font-semibold tracking-wider text-accent-text uppercase">
          404
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
          That page does not exist
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">
          The address may be mistyped, or the tool may have been renamed. All {TOOL_COUNT} tools are
          listed on one page, and the search box in the header (or the{" "}
          <kbd className="rounded border border-border bg-surface px-1 font-sans text-xs">/</kbd> key)
          will find any of them.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/tools"
            className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
          >
            Browse all tools
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg border border-border-strong bg-surface px-4 text-sm font-medium text-fg transition-colors hover:bg-bg-muted"
          >
            Go to the homepage
          </Link>
        </div>
      </div>

      <nav aria-label="Tool categories" className="mt-10">
        <h2 className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
          Categories
        </h2>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={`/${category.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[0.8125rem] font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
              >
                <category.icon className="size-3.5" aria-hidden="true" />
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="mt-10" aria-labelledby="popular-404">
        <h2 id="popular-404" className="text-lg font-semibold tracking-tight text-fg">
          Popular tools
        </h2>
        <ToolGrid tools={POPULAR_TOOLS.slice(0, 9)} showCategory className="mt-4" />
      </section>
    </div>
  );
}
