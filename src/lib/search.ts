import { CATEGORY_BY_ID } from "@/config/categories";
import { TOOLS } from "@/config/tools";
import type { ToolMeta } from "@/types/tool";

interface IndexedTool {
  tool: ToolMeta;
  name: string;
  words: string[];
  keywords: string[];
  description: string;
  category: string;
}

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const INDEX: IndexedTool[] = TOOLS.map((tool) => ({
  tool,
  name: normalise(tool.name),
  words: normalise(tool.name).split(" "),
  keywords: tool.keywords.map(normalise),
  description: normalise(tool.description),
  category: normalise(CATEGORY_BY_ID[tool.category].name),
}));

function scoreTerm(entry: IndexedTool, term: string): number {
  if (entry.name === term) return 120;
  if (entry.name.startsWith(term)) return 90;

  // A whole word in the title beginning with the term, e.g. "comp" -> "compress".
  if (entry.words.some((word) => word.startsWith(term))) return 70;
  if (entry.name.includes(term)) return 55;

  for (const keyword of entry.keywords) {
    if (keyword === term) return 60;
    if (keyword.startsWith(term)) return 45;
    if (keyword.includes(term)) return 32;
  }

  if (entry.description.includes(term)) return 22;
  if (entry.category.includes(term)) return 14;

  return 0;
}

export interface SearchResult {
  tool: ToolMeta;
  score: number;
}

/**
 * Ranks tools against a free-text query. Every term must match something, so
 * "pdf word" narrows rather than widens.
 */
export function searchTools(query: string, limit = 8): SearchResult[] {
  const cleaned = normalise(query);
  if (!cleaned) return [];

  const terms = cleaned.split(" ").filter(Boolean);
  const results: SearchResult[] = [];

  for (const entry of INDEX) {
    let total = 0;
    let matchedAll = true;

    for (const term of terms) {
      const score = scoreTerm(entry, term);
      if (score === 0) {
        matchedAll = false;
        break;
      }
      total += score;
    }

    if (!matchedAll) continue;
    if (entry.tool.popular) total += 6;
    results.push({ tool: entry.tool, score: total });
  }

  results.sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));
  return results.slice(0, limit);
}

/** Filters a fixed list, used by the category and all-tools pages. */
export function filterTools(tools: ToolMeta[], query: string): ToolMeta[] {
  const cleaned = normalise(query);
  if (!cleaned) return tools;

  const allowed = new Set(searchTools(cleaned, TOOLS.length).map((result) => result.tool.slug));
  return tools.filter((tool) => allowed.has(tool.slug));
}
