import Link from "next/link";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/tool/sections";
import { GUIDES, GUIDE_TOPICS, guideHref } from "@/guides";
import { breadcrumbSchema, buildMetadata, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Guides — How to Do It Properly",
  description:
    "Plain-language guides to everyday jobs with PDFs, photos, numbers and passwords: what goes wrong, how to do it properly, and how to check the result.",
  path: "/guides",
});

const CRUMBS = [
  { name: "Home", href: "/" },
  { name: "Guides", href: "/guides" },
];

export default function GuidesPage() {
  const guides = [...GUIDES].sort((a, b) => b.published.localeCompare(a.published));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema(CRUMBS)) }}
      />

      <div className="container-page py-6 sm:py-8">
        <Breadcrumbs crumbs={CRUMBS} />

        <header className="mt-5 max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-tight text-balance text-fg sm:text-3xl">Guides</h1>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">
            How to do everyday jobs with PDFs, photos, numbers and passwords properly — what usually
            goes wrong, the steps that avoid it, and how to check the result.
          </p>
        </header>

        {GUIDE_TOPICS.map((topic) => {
          const inTopic = guides.filter((guide) => guide.topic === topic);
          if (inTopic.length === 0) return null;
          const headingId = `topic-${topic.toLowerCase().replace(/[^a-z]+/g, "-")}`;
          return (
            <section key={topic} className="mt-10 max-w-3xl" aria-labelledby={headingId}>
              <h2 id={headingId} className="text-lg font-semibold tracking-tight text-fg">
                {topic}
              </h2>
              <ul className="mt-4 grid gap-3">
                {inTopic.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={guideHref(guide)}
                      className="block rounded-[var(--radius-card)] border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                    >
                      <span className="block text-[0.9375rem] font-semibold text-fg">{guide.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-fg-muted">
                        {guide.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
