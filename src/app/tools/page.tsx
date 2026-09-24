import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs } from "@/components/tool/sections";
import { ToolBrowser, ToolBrowserPanel } from "@/components/tool/tool-browser";
import { CATEGORIES } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { TOOLS, TOOLS_BY_CATEGORY, TOOL_COUNT, toolHref } from "@/config/tools";
import { breadcrumbSchema, buildMetadata, collectionSchema, jsonLdScript } from "@/lib/seo";

const DESCRIPTION = `Browse all ${TOOL_COUNT} free tools: PDF utilities, calculators, image tools, unit converters, generators, text and developer tools. No sign-up, and no file uploads.`;

export const metadata: Metadata = buildMetadata({
  title: `All ${TOOL_COUNT} Free Online Tools`,
  description: DESCRIPTION,
  path: "/tools",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
];

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema(CRUMBS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            collectionSchema(`All ${siteConfig.name} tools`, DESCRIPTION, "/tools", TOOLS),
          ),
        }}
      />

      <div className="container-page py-6 sm:py-8">
        <Breadcrumbs crumbs={CRUMBS} />

        <header className="mt-5 max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-balance text-fg sm:text-3xl">
            All {TOOL_COUNT} tools
          </h1>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">
            Everything in one list. Filter by name, keyword or category — or press{" "}
            <kbd className="rounded border border-border bg-surface px-1 font-sans text-xs">/</kbd> anywhere
            on the site to search.
          </p>
        </header>

        <div className="mt-8">
          {/* The fallback is the prerendered HTML. An empty one left a blank
              gap that filled in after hydration and pushed the index down. */}
          <Suspense fallback={<ToolBrowserPanel showCategoryFilter showCategoryLabels />}>
            <ToolBrowser showCategoryFilter showCategoryLabels />
          </Suspense>
        </div>

        <div className="mt-12">
          <AdSlot placement="footer" />
        </div>

        {/* A plain, crawlable index of every tool, grouped by category. */}
        <section className="mt-12 border-t border-border pt-8" aria-labelledby="index-heading">
          <h2 id="index-heading" className="text-lg font-semibold tracking-tight text-fg">
            Full index
          </h2>
          <div className="mt-5 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS_BY_CATEGORY.map(({ category, tools }) => (
              <div key={category.id}>
                <h3 className="flex items-center gap-2 text-[0.8125rem] font-semibold text-fg">
                  <category.icon className="size-3.5 text-fg-subtle" aria-hidden="true" />
                  <Link
                    href={`/${category.id}`}
                    className="inline-flex min-h-6 items-center hover:text-accent-text hover:underline underline-offset-2"
                  >
                    {category.name}
                  </Link>
                </h3>
                <ul className="mt-2 space-y-1">
                  {tools.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={toolHref(tool)}
                        className="inline-flex min-h-6 items-center text-[0.8125rem] text-fg-muted transition-colors hover:text-fg hover:underline underline-offset-2"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <nav aria-label="Categories" className="mt-10 border-t border-border pt-6">
          <ul className="flex flex-wrap gap-2">
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
      </div>
    </>
  );
}
