import type { MetadataRoute } from "next";

import { CATEGORIES } from "@/config/categories";
import { absoluteUrl } from "@/config/site";
import { TOOLS, getToolsByCategory, newestUpdate, toolHref, toolUpdated } from "@/config/tools";
import { GUIDES, guideHref } from "@/guides";

/**
 * Generated from the registry, so a new tool appears here automatically —
 * there is no list of URLs to keep in step by hand.
 */
// No changeFrequency or priority: Google and Bing both ignore them; lastModified is the signal they use.
export default function sitemap(): MetadataRoute.Sitemap {
  const newestTool = TOOLS.reduce(
    (latest, tool) => (tool.addedOn > latest ? tool.addedOn : latest),
    TOOLS[0]?.addedOn ?? "2026-09-05",
  );
  const lastModified = new Date(`${newestTool}T00:00:00Z`);
  const day = (date: string) => new Date(`${date}T00:00:00Z`);
  const toolsChanged = day(newestUpdate(TOOLS));

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: toolsChanged },
    { url: absoluteUrl("/tools"), lastModified: toolsChanged },
    { url: absoluteUrl("/about"), lastModified },
    { url: absoluteUrl("/contact"), lastModified },
    { url: absoluteUrl("/privacy"), lastModified },
    { url: absoluteUrl("/terms"), lastModified },
    { url: absoluteUrl("/cookies"), lastModified },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: absoluteUrl(`/${category.id}`),
    lastModified: day(newestUpdate(getToolsByCategory(category.id))),
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: absoluteUrl(toolHref(tool)),
    // When the page last changed, not when the tool first shipped.
    lastModified: day(toolUpdated(tool)),
  }));

  // Dated by when each guide's text last changed, not by the deploy.
  const newestGuide = GUIDES.reduce((latest, guide) => (guide.updated > latest ? guide.updated : latest), "");
  const guidePages: MetadataRoute.Sitemap = [
    ...(newestGuide
      ? [{ url: absoluteUrl("/guides"), lastModified: new Date(`${newestGuide}T00:00:00Z`) }]
      : []),
    ...GUIDES.map((guide) => ({
      url: absoluteUrl(guideHref(guide)),
      lastModified: new Date(`${guide.updated}T00:00:00Z`),
    })),
  ];

  return [...staticPages, ...categoryPages, ...toolPages, ...guidePages];
}
