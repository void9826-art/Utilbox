import type { ComponentType } from "react";

import { redactPdfProperly } from "./redact-pdf-properly";

/**
 * Long-form guides. Each one explains a real task and links to the tools that
 * do it, so the articles and the tool pages point at each other.
 */
export interface Guide {
  slug: string;
  /** The H1 on the page. */
  title: string;
  /** Page title before the layout's brand suffix; scripts/check-titles.mjs checks the length. */
  seoTitle: string;
  description: string;
  /** Real dates, YYYY-MM-DD. `updated` changes only when the text does. */
  published: string;
  updated: string;
  /** Tool slugs the guide uses, shown as cards and linked back from those tools. */
  tools: string[];
  Body: ComponentType;
}

export const GUIDES: Guide[] = [redactPdfProperly];

const bySlug = new Map(GUIDES.map((guide) => [guide.slug, guide]));

export function getGuide(slug: string): Guide | undefined {
  return bySlug.get(slug);
}

export function guideHref(guide: Pick<Guide, "slug">): string {
  return `/guides/${guide.slug}`;
}

/** Guides that use a tool, for the link on that tool's page. */
export function guidesForTool(toolSlug: string): Guide[] {
  return GUIDES.filter((guide) => guide.tools.includes(toolSlug));
}
