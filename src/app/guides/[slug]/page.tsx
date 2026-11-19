import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/tool/sections";
import { ToolGrid } from "@/components/tool/tool-card";
import { getRelatedTools, getTool, toolHref } from "@/config/tools";
import { GUIDES, getGuide, guideHref, type Guide } from "@/guides";
import { articleSchema, breadcrumbSchema, buildMetadata, jsonLdScript } from "@/lib/seo";
import { formatLongDate } from "@/lib/utils";
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

/**
 * One row of tools a reader is likely to need next: the hand-picked "related"
 * tools of the ones the guide uses, taken in turn so each guide tool
 * contributes, without repeating anything already shown above.
 */
function followOnTools(tools: ToolMeta[], limit = 3): ToolMeta[] {
  const seen = new Set(tools.map((tool) => tool.slug));
  const queues = tools.map((tool) => getRelatedTools(tool, 6));
  const picked: ToolMeta[] = [];
  for (let round = 0; picked.length < limit && queues.some((queue) => round < queue.length); round += 1) {
    for (const queue of queues) {
      const candidate = queue[round];
      if (picked.length < limit && candidate && !seen.has(candidate.slug)) {
        seen.add(candidate.slug);
        picked.push(candidate);
      }
    }
  }
  return picked;
}

/**
 * Other guides a reader of this one is likely to want: those that use the same tools first, then the same topic.
 * Guides used to link only to tools, so most were reachable from no other guide.
 */
function relatedGuides(guide: Guide, limit = 4): Guide[] {
  const others = GUIDES.filter((candidate) => candidate.slug !== guide.slug);
  const sharedTools = (candidate: Guide) => candidate.tools.filter((slug) => guide.tools.includes(slug)).length;
  const byTools = others.filter((candidate) => sharedTools(candidate) > 0).sort((a, b) => sharedTools(b) - sharedTools(a));
  const byTopic = others.filter((candidate) => candidate.topic === guide.topic && !byTools.includes(candidate));
  return [...byTools, ...byTopic].slice(0, limit);
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
  const nextTools = followOnTools(tools);
  const moreGuides = relatedGuides(guide);
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
              <time dateTime={guide.updated}>{formatLongDate(guide.updated)}</time>
            </p>
            {/* The tools are what most readers came for, so they are one click
                away before the article starts, not only in the cards at the end. */}
            {tools.length > 0 ? (
              <p className="mt-4 text-sm text-fg-muted">
                {tools.length === 1 ? "Tool for this job: " : "Tools for this job: "}
                {tools.map((tool, index) => (
                  <span key={tool.slug}>
                    {index > 0 ? " · " : null}
                    <Link
                      href={toolHref(tool)}
                      className="font-medium text-accent-text hover:underline underline-offset-2"
                    >
                      {tool.name}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
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

        {nextTools.length > 0 ? (
          <section className="mt-10" aria-labelledby="guide-more-tools-heading">
            <h2 id="guide-more-tools-heading" className="text-lg font-semibold tracking-tight text-fg">
              More tools for this job
            </h2>
            <ToolGrid tools={nextTools} showCategory className="mt-4" />
          </section>
        ) : null}

        {moreGuides.length > 0 ? (
          <section className="mt-10" aria-labelledby="guide-related-heading">
            <h2 id="guide-related-heading" className="text-lg font-semibold tracking-tight text-fg">
              Related guides
            </h2>
            <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
              {moreGuides.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={guideHref(related)}
                    className="flex min-h-11 items-center text-sm font-medium text-accent-text underline-offset-2 hover:underline"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
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
