import "server-only";

import type { ToolContent } from "@/types/tool";

import { calculatorContent } from "./calculators";
import { converterContent } from "./converters";
import { developerContent } from "./developer";
import { generatorContent } from "./generators";
import { imageContent } from "./image";
import { pdfContent } from "./pdf";
import { textContent } from "./text";

/**
 * Long-form page copy, kept apart from the tool registry so it is only ever
 * rendered on the server. None of this reaches the client bundle.
 */
const CONTENT: Record<string, ToolContent> = {
  ...pdfContent,
  ...calculatorContent,
  ...imageContent,
  ...converterContent,
  ...generatorContent,
  ...textContent,
  ...developerContent,
};

export function getToolContent(slug: string): ToolContent | undefined {
  return CONTENT[slug];
}

export const CONTENT_SLUGS = Object.keys(CONTENT);
