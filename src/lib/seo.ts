import type { Metadata } from "next";

import { CATEGORY_BY_ID } from "@/config/categories";
import { absoluteUrl, siteConfig } from "@/config/site";
import { toolHref } from "@/config/tools";
import type { ToolContent, ToolMeta } from "@/types/tool";

interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  /** Set for pages that should stay out of the index (e.g. search results). */
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  noindex,
}: PageMetaOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(`/opengraph-image`);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      ...(siteConfig.twitterHandle ? { creator: siteConfig.twitterHandle } : {}),
    },
  };
}

export interface Crumb {
  name: string;
  href: string;
}

export function toolBreadcrumbs(tool: ToolMeta): Crumb[] {
  const category = CATEGORY_BY_ID[tool.category];
  return [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: category.name, href: `/${category.id}` },
    { name: tool.name, href: toolHref(tool) },
  ];
}

type JsonLd = Record<string, unknown>;

export function breadcrumbSchema(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };
}

/**
 * WebApplication describes what these pages actually are: a browser utility.
 * `offers` records that they are free, which is true and verifiable on-page.
 */
export function toolSchema(tool: ToolMeta, content: ToolContent): JsonLd {
  const category = CATEGORY_BY_ID[tool.category];
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} — ${siteConfig.name}`,
    url: absoluteUrl(toolHref(tool)),
    description: content.seoDescription,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: category.name,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern browser.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    inLanguage: "en",
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };
}

/**
 * "How to use the Word Counter" reads correctly; "How to use the Merge PDF"
 * does not. The article only belongs in front of a name that ends in the noun
 * for an instrument — twenty of the seventy-three names are verb phrases.
 */
const INSTRUMENT_NOUNS = new Set([
  "calculator",
  "converter",
  "generator",
  "formatter",
  "validator",
  "counter",
  "editor",
  "picker",
  "cleaner",
  "reverser",
  "encoder",
  "decoder",
  "lookup",
  "tool",
  "tools",
  "checker",
  "builder",
  "planner",
  "tracker",
  "extractor",
  "remover",
  "verifier",
  "tester",
  "viewer",
]);

export function howToTitle(name: string): string {
  const lastWord = name.split(/\s+/).at(-1)?.toLowerCase() ?? "";
  return INSTRUMENT_NOUNS.has(lastWord) ? `How to use the ${name}` : `How to use ${name}`;
}

/**
 * HowTo is only emitted for tools whose instructions are genuinely a sequence
 * of physical steps a person performs — which is every file/entry tool here.
 */
export function howToSchema(tool: ToolMeta, content: ToolContent): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howToTitle(tool.name),
    description: content.intro,
    totalTime: "PT1M",
    supply: [],
    tool: [{ "@type": "HowToTool", name: "A web browser" }],
    step: content.howToUse.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Step ${index + 1}`,
      text: step,
      url: `${absoluteUrl(toolHref(tool))}#how-to-use`,
    })),
  };
}

export function faqSchema(content: ToolContent): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Stable node id so the website and the organisation are one linked graph. */
const ORGANISATION_ID = `${siteConfig.url}#organization`;

/**
 * Describes the brand itself, separately from the website.
 *
 * Several older tool sites have near-identical names, so a search engine has
 * little to go on when deciding whether this is a distinct brand or a
 * misspelling of one of them. A logo, a canonical URL and links to profiles
 * the brand controls are the evidence it looks for.
 */
export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANISATION_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/logo-mark.png"),
    image: absoluteUrl("/logo-mark.png"),
    description: siteConfig.description,
    ...(siteConfig.socialProfiles.length > 0 ? { sameAs: siteConfig.socialProfiles } : {}),
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": ORGANISATION_ID },
    description: siteConfig.description,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/tools?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function collectionSchema(name: string, description: string, path: string, tools: ToolMeta[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        url: absoluteUrl(toolHref(tool)),
      })),
    },
  };
}

/**
 * Serialises structured data for a <script type="application/ld+json"> block.
 *
 * JSON.stringify alone is not enough: a "</script>" anywhere in the data would
 * close the tag early and drop the rest of the document into the page as
 * markup. None of the copy contains one today — this makes sure that stays
 * true no matter what is written into the registry later.
 */
export function jsonLdScript(schema: JsonLd | JsonLd[]): string {
  // The replacements produce JSON escape sequences, which a JSON-LD parser
  // reads back as the original characters — the markup is neutralised
  // without changing the data. U+2028 and U+2029 are legal inside a JSON
  // string but are line terminators to a JavaScript parser, so they go too.
  return JSON.stringify(schema).replace(/[<>&\u2028\u2029]/g, (character) => {
    const code = character.codePointAt(0) as number;
    return `\\u${code.toString(16).padStart(4, "0")}`;
  });
}
