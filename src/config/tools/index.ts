import { CATEGORIES } from "@/config/categories";
import type { CategoryId, ToolMeta } from "@/types/tool";

import { calculatorTools } from "./calculators";
import { converterTools } from "./converters";
import { developerTools } from "./developer";
import { generatorTools } from "./generators";
import { imageTools } from "./image";
import { pdfTools } from "./pdf";
import { textTools } from "./text";

/**
 * The registry. Adding a tool here (plus a content entry and a component)
 * is enough to give it a page, a card, a sitemap entry and search coverage.
 */
export const TOOLS: ToolMeta[] = [
  ...pdfTools,
  ...calculatorTools,
  ...imageTools,
  ...converterTools,
  ...generatorTools,
  ...textTools,
  ...developerTools,
];

const bySlug = new Map(TOOLS.map((tool) => [tool.slug, tool]));

export function getTool(slug: string): ToolMeta | undefined {
  return bySlug.get(slug);
}

export function getToolsByCategory(category: CategoryId): ToolMeta[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getRelatedTools(tool: ToolMeta, limit = 4): ToolMeta[] {
  const explicit = tool.related
    .map((slug) => bySlug.get(slug))
    .filter((candidate): candidate is ToolMeta => Boolean(candidate) && candidate!.slug !== tool.slug);

  if (explicit.length >= limit) return explicit.slice(0, limit);

  // Top up from the same category so the block is never half-empty.
  const seen = new Set([tool.slug, ...explicit.map((candidate) => candidate.slug)]);
  const fillers = getToolsByCategory(tool.category).filter((candidate) => !seen.has(candidate.slug));

  return [...explicit, ...fillers].slice(0, limit);
}

export function toolHref(tool: Pick<ToolMeta, "category" | "slug">): string {
  return `/${tool.category}/${tool.slug}`;
}

export const POPULAR_TOOLS: ToolMeta[] = TOOLS.filter((tool) => tool.popular);

/** Newest first, by the real ship date recorded in the registry. */
export const RECENTLY_ADDED_TOOLS: ToolMeta[] = [...TOOLS].sort((a, b) =>
  b.addedOn.localeCompare(a.addedOn),
);

export const TOOL_COUNT = TOOLS.length;

/** Rounded down to the nearest ten for marketing copy — never rounded up. */
export const TOOL_COUNT_ROUNDED = Math.floor(TOOL_COUNT / 10) * 10;

export const TOOLS_BY_CATEGORY = CATEGORIES.map((category) => ({
  category,
  tools: getToolsByCategory(category.id),
}));
