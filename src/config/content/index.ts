import "server-only";

import type { ToolContent, ToolContentExtra } from "@/types/tool";

import { calculatorContent } from "./calculators";
import { converterContent } from "./converters";
import { developerContent } from "./developer";
import { calculatorExtra } from "./extra/calculators";
import { converterExtra } from "./extra/converters";
import { developerExtra } from "./extra/developer";
import { generatorExtra } from "./extra/generators";
import { imageExtra } from "./extra/image";
import { pdfExtra } from "./extra/pdf";
import { textExtra } from "./extra/text";
import { generatorContent } from "./generators";
import { imageContent } from "./image";
import { pdfContent } from "./pdf";
import { textContent } from "./text";

const BASE: Record<string, ToolContent> = {
  ...pdfContent,
  ...calculatorContent,
  ...imageContent,
  ...converterContent,
  ...generatorContent,
  ...textContent,
  ...developerContent,
};

const EXTRA: Record<string, ToolContentExtra> = {
  ...pdfExtra,
  ...calculatorExtra,
  ...imageExtra,
  ...converterExtra,
  ...generatorExtra,
  ...textExtra,
  ...developerExtra,
};

/**
 * Long-form page copy, kept apart from the tool registry so it is only ever
 * rendered on the server. None of this reaches the client bundle. Each entry
 * is merged with its extra tips and FAQs, which follow the original questions.
 */
const CONTENT: Record<string, ToolContent> = Object.fromEntries(
  Object.entries(BASE).map(([slug, content]) => {
    const extra = EXTRA[slug];
    return [slug, extra ? { ...content, tips: extra.tips, faq: [...content.faq, ...extra.faq] } : content];
  }),
);

export function getToolContent(slug: string): ToolContent | undefined {
  return CONTENT[slug];
}

export const CONTENT_SLUGS = Object.keys(CONTENT);
