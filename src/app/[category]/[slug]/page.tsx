import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AdSlot } from "@/components/ads/ad-slot";
import {
  Breadcrumbs,
  CategoryLinks,
  FaqSection,
  FormulaBlock,
  InfoSection,
  RelatedTools,
  StepList,
  ToolHeader,
} from "@/components/tool/sections";
import { ShareRow } from "@/components/tool/share-row";
import { Alert } from "@/components/ui/surfaces";
import { getToolContent } from "@/config/content";
import { isCategoryId } from "@/config/categories";
import { absoluteUrl, siteConfig } from "@/config/site";
import { TOOLS, getTool, toolHref } from "@/config/tools";
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  howToTitle,
  jsonLdScript,
  toolBreadcrumbs,
  toolSchema,
} from "@/lib/seo";
import { ToolMount } from "@/tools";

interface RouteParams {
  category: string;
  slug: string;
}

export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return TOOLS.map((tool) => ({ category: tool.category, slug: tool.slug }));
}

function resolve(params: RouteParams) {
  if (!isCategoryId(params.category)) return null;
  const tool = getTool(params.slug);
  if (!tool || tool.category !== params.category) return null;
  const content = getToolContent(tool.slug);
  if (!content) return null;
  return { tool, content };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const resolved = resolve(await params);
  if (!resolved) return {};

  const { tool, content } = resolved;
  return buildMetadata({
    title: content.seoTitle,
    description: content.seoDescription,
    path: toolHref(tool),
  });
}

export default async function ToolPage({ params }: { params: Promise<RouteParams> }) {
  const resolved = resolve(await params);
  if (!resolved) notFound();

  const { tool, content } = resolved;
  const crumbs = toolBreadcrumbs(tool);

  const schemas = [
    breadcrumbSchema(crumbs),
    toolSchema(tool, content),
    faqSchema(content),
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

        <div className="mt-5 space-y-6">
          <ToolHeader tool={tool} intro={content.intro} />

          {/* The tool sits above the fold — no reading required before use. */}
          <ToolMount slug={tool.slug} />

          {content.disclaimer ? (
            <Alert tone="warning" title="Please note">
              {content.disclaimer}
            </Alert>
          ) : null}

          {/* Set apart from the tool by a rule and extra space: an ad block
              sitting flush under the action buttons invites a mis-click, which
              is bad for the visitor and against AdSense policy. */}
          <AdSlot placement="inContent" className="print-hidden mt-4 border-t border-border pt-6" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
          <div className="min-w-0 space-y-10">
            <InfoSection id="how-to-use" title={howToTitle(tool.name)}>
              <StepList steps={content.howToUse} />
            </InfoSection>

            <InfoSection id="how-it-works" title="How it works">
              {content.howItWorks.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </InfoSection>

            {content.formula ? (
              <InfoSection id="formula" title="The formula">
                <div className="not-prose">
                  <FormulaBlock formula={content.formula} />
                </div>
              </InfoSection>
            ) : null}

            {content.example ? (
              <InfoSection id="example" title="Worked example">
                <p className="font-medium text-fg">{content.example.scenario}</p>
                <ol className="list-decimal space-y-1 pl-5">
                  {content.example.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="rounded-lg border border-accent-soft-border bg-accent-soft px-3.5 py-2.5 text-fg">
                  <strong className="font-semibold">Result:</strong> {content.example.result}
                </p>
              </InfoSection>
            ) : null}

            <FaqSection items={content.faq} />

            <div className="not-prose print-hidden">
              <ShareRow title={`${tool.name} — ${siteConfig.name}`} url={absoluteUrl(toolHref(tool))} />
            </div>

            <RelatedTools tool={tool} />

            <CategoryLinks currentCategory={tool.category} />
          </div>

          <aside className="hidden lg:block print-hidden">
            <div className="sticky top-24 space-y-4">
              <nav aria-label="On this page">
                <h2 className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
                  On this page
                </h2>
                <ul className="mt-2.5 space-y-1.5 text-[0.8125rem]">
                  <TocLink href="#how-to-use">How to use</TocLink>
                  <TocLink href="#how-it-works">How it works</TocLink>
                  {content.formula ? <TocLink href="#formula">The formula</TocLink> : null}
                  {content.example ? <TocLink href="#example">Worked example</TocLink> : null}
                  <TocLink href="#faq">FAQ</TocLink>
                  <TocLink href="#related-heading">Related tools</TocLink>
                </ul>
              </nav>
              <AdSlot placement="inContent" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function TocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} className="text-fg-muted transition-colors hover:text-accent-text">
        {children}
      </a>
    </li>
  );
}
