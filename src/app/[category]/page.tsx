import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs, CategoryLinks } from "@/components/tool/sections";
import { ToolBrowser, ToolBrowserPanel } from "@/components/tool/tool-browser";
import { ToolGrid } from "@/components/tool/tool-card";
import { CATEGORIES, CATEGORY_BY_ID, isCategoryId } from "@/config/categories";
import { getToolsByCategory } from "@/config/tools";
import { breadcrumbSchema, buildMetadata, collectionSchema, jsonLdScript } from "@/lib/seo";
import type { CategoryId } from "@/types/tool";

interface RouteParams {
  category: string;
}

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isCategoryId(category)) return {};

  const config = CATEGORY_BY_ID[category];

  return buildMetadata({
    title: config.seoTitle,
    description: config.seoDescription,
    path: `/${category}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<RouteParams> }) {
  const { category } = await params;
  if (!isCategoryId(category)) notFound();

  const config = CATEGORY_BY_ID[category as CategoryId];
  const tools = getToolsByCategory(category as CategoryId);
  const popular = tools.filter((tool) => tool.popular);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: config.name, href: `/${category}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema(crumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            collectionSchema(config.name, config.seoDescription, `/${category}`, tools),
          ),
        }}
      />

      <div className="container-page py-6 sm:py-8">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mt-5 flex items-start gap-3.5">
          <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent-soft-border bg-accent-soft text-accent-text">
            <config.icon className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-balance text-fg sm:text-3xl">
              {config.name}
            </h1>
            <p className="mt-1.5 max-w-2xl text-[0.9375rem] leading-relaxed text-fg-muted">
              {config.description}
            </p>
          </div>
        </header>

        <div className="mt-6 max-w-3xl">
          <p className="prose-content">{config.intro}</p>
        </div>

        {popular.length > 0 ? (
          <section className="mt-10" aria-labelledby="category-popular">
            <h2 id="category-popular" className="text-lg font-semibold tracking-tight text-fg">
              Most used
            </h2>
            <ToolGrid tools={popular} className="mt-4" />
          </section>
        ) : null}

        <section className="mt-10" aria-labelledby="category-all">
          {/* Lower-casing the name gave "All pdf tools"; the name is a label, so it keeps its case. */}
          <h2 id="category-all" className="text-lg font-semibold tracking-tight text-fg">
            All {tools.length} {config.name}
          </h2>
          <div className="mt-4">
            {/* The fallback is the prerendered HTML: every tool in the category
                as a crawlable link, in the layout the client then takes over. */}
            <Suspense fallback={<ToolBrowserPanel scope={category as CategoryId} />}>
              <ToolBrowser scope={category as CategoryId} />
            </Suspense>
          </div>
        </section>

        <div className="mt-10">
          <AdSlot placement="footer" />
        </div>

        <div className="mt-10">
          <CategoryLinks currentCategory={category} />
        </div>
      </div>
    </>
  );
}
