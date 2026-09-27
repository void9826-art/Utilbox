import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/tool/sections";
import { ToolGrid } from "@/components/tool/tool-card";
import { getTool } from "@/config/tools";
import { GUIDES, getGuide, guideHref } from "@/guides";
import { articleSchema, breadcrumbSchema, buildMetadata, jsonLdScript } from "@/lib/seo";
import type { ToolMeta } from "@/types/tool";

interface RouteParams {
  slug: string;
}

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};

  const metadata = buildMetadata({
    title: guide.seoTitle,
    description: guide.description,
    path: guideHref(guide),
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: guide.published,
      modifiedTime: guide.updated,
    },
  };
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function GuidePage({ params }: { params: Promise<RouteParams> }) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Guides", href: "/guides" },
    { name: guide.title, href: guideHref(guide) },
  ];
  const tools = guide.tools.map(getTool).filter((tool): tool is ToolMeta => Boolean(tool));
  const { Body } = guide;

  const schemas = [
    breadcrumbSchema(crumbs),
    articleSchema({
      headline: guide.title,
      description: guide.description,
      path: guideHref(guide),
      published: guide.published,
      updated: guide.updated,
    }),
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}
        />
      ))}

      <div className="container-page py-6 sm:py-8">
        <Breadcrumbs crumbs={crumbs} />

        <article>
          <header className="mt-5 max-w-3xl">
            <h1 className="text-2xl font-semibold tracking-tight text-balance text-fg sm:text-3xl">
              {guide.title}
            </h1>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">{guide.description}</p>
            <p className="mt-3 text-xs text-fg-subtle">
              {guide.updated === guide.published ? "Published " : "Updated "}
              <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
            </p>
          </header>

          <div className="prose-content container-prose mt-8">
            <Body />
          </div>
        </article>

        {tools.length > 0 ? (
          <section className="mt-12 border-t border-border pt-8" aria-labelledby="guide-tools-heading">
            <h2 id="guide-tools-heading" className="text-lg font-semibold tracking-tight text-fg">
              Tools used in this guide
            </h2>
            <ToolGrid tools={tools} showCategory className="mt-4" />
          </section>
        ) : null}

        <p className="mt-10 text-sm">
          <Link href="/guides" className="font-medium text-accent-text hover:underline underline-offset-2">
            All guides
          </Link>
        </p>
      </div>
    </>
  );
}
