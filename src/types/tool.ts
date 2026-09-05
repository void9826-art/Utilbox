import type { LucideIcon } from "lucide-react";

export type CategoryId =
  | "pdf"
  | "calculators"
  | "image"
  | "converters"
  | "generators"
  | "text"
  | "developer";

/**
 * Where a tool does its work. This drives the privacy badge shown on the page,
 * so it must describe what the code actually does.
 */
export type ProcessingMode =
  /** Everything happens in the visitor's browser. Nothing is uploaded. */
  | "client"
  /** Runs in the browser but fetches non-personal reference data (e.g. FX rates). */
  | "client-with-lookup";

export interface ToolMeta {
  slug: string;
  name: string;
  category: CategoryId;
  /** One line, used on cards and in search results. */
  description: string;
  keywords: string[];
  icon: LucideIcon;
  /** Slugs of tools shown in the "Related tools" block. */
  related: string[];
  requiresFile: boolean;
  processing: ProcessingMode;
  /** Surfaced on the homepage "Popular tools" grid. */
  popular?: boolean;
  /** Real date the tool shipped; powers the "Recently added" section. */
  addedOn: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolFormula {
  expression: string;
  /** "symbol — meaning" definitions rendered under the formula. */
  where: string[];
  note?: string;
}

export interface ToolExample {
  scenario: string;
  steps: string[];
  result: string;
}

/**
 * Long-form page content. Lives apart from {@link ToolMeta} because it is only
 * ever rendered on the server — keeping it out of the client search bundle.
 */
export interface ToolContent {
  seoTitle: string;
  seoDescription: string;
  /** Rendered directly under the H1 heading, above the tool. Keep it short. */
  intro: string;
  howToUse: string[];
  howItWorks: string[];
  formula?: ToolFormula;
  example?: ToolExample;
  faq: FaqItem[];
  /** Shown in a muted note under the tool. Used by financial/health tools. */
  disclaimer?: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  /** Short label for compact navigation. */
  shortName: string;
  description: string;
  /** Longer paragraph for the category landing page. */
  intro: string;
  icon: LucideIcon;
  seoTitle: string;
  seoDescription: string;
}

export type Tool = ToolMeta & { content: ToolContent };
