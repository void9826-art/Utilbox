import type { ComponentType } from "react";

import { codesAndTextGuides } from "./codes-and-text";
import { codesLongTailGuides } from "./codes-long-tail";
import { conversionsAndMoneyGuides } from "./conversions-and-money";
import { healthHomeUnitsGuides } from "./health-home-units";
import { imageGuides } from "./images";
import { imagesEverydayGuides } from "./images-everyday";
import { imagesFixesGuides } from "./images-fixes";
import { imagesQuickFixesGuides } from "./images-quick-fixes";
import { imagesSizesGuides } from "./images-sizes";
import { imagesWebAndPrintGuides } from "./images-web-and-print";
import { moneyAndEverydayGuides } from "./money-and-everyday-sums";
import { moneyHealthHomeGuides } from "./money-health-home";
import { numberGuides } from "./numbers";
import { pdfGuides } from "./pdf";
import { pdfFormsAndPrintingGuides } from "./pdf-forms-and-printing";
import { pdfLongTailGuides } from "./pdf-long-tail";
import { pdfPagesAndPrintingGuides } from "./pdf-pages-and-printing";
import { pdfPrivacyAndReadingGuides } from "./pdf-privacy-and-reading";
import { percentagesAndLoansGuides } from "./percentages-and-loans";
import { redactPdfProperly } from "./redact-pdf-properly";
import { savingsPaySchoolGuides } from "./savings-pay-school";
import { textAndDeveloperGuides } from "./text-and-developer";
import { textLongTailGuides } from "./text-long-tail";
import { textTidyingGuides } from "./text-tidying";
import { webAndTextGuides } from "./web-and-text";
import { webBasicsGuides } from "./web-basics";
import { webDataAndTimeGuides } from "./web-data-and-time";
import { webSitesAndSecurityGuides } from "./web-sites-and-security";
import { workAndDocumentsGuides } from "./work-and-documents";
import { workLongTailGuides } from "./work-long-tail";

/** Headings on the guides index, in display order. */
export const GUIDE_TOPICS = [
  "PDF",
  "Images",
  "Calculations",
  "Codes, passwords & text",
  "Work & documents",
  "Web & developer",
] as const;

/**
 * Long-form guides. Each one explains a real task and links to the tools that
 * do it, so the articles and the tool pages point at each other.
 */
export interface Guide {
  slug: string;
  topic: (typeof GUIDE_TOPICS)[number];
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

export const GUIDES: Guide[] = [
  redactPdfProperly,
  ...pdfGuides,
  ...imageGuides,
  ...numberGuides,
  ...codesAndTextGuides,
  ...pdfFormsAndPrintingGuides,
  ...imagesWebAndPrintGuides,
  ...moneyAndEverydayGuides,
  ...webAndTextGuides,
  ...pdfPrivacyAndReadingGuides,
  ...imagesEverydayGuides,
  ...moneyHealthHomeGuides,
  ...textAndDeveloperGuides,
  ...pdfPagesAndPrintingGuides,
  ...imagesQuickFixesGuides,
  ...conversionsAndMoneyGuides,
  ...textTidyingGuides,
  ...workAndDocumentsGuides,
  ...webBasicsGuides,
  ...pdfLongTailGuides,
  ...imagesSizesGuides,
  ...imagesFixesGuides,
  ...percentagesAndLoansGuides,
  ...savingsPaySchoolGuides,
  ...healthHomeUnitsGuides,
  ...textLongTailGuides,
  ...codesLongTailGuides,
  ...workLongTailGuides,
  ...webDataAndTimeGuides,
  ...webSitesAndSecurityGuides,
];

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
