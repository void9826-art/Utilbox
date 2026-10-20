/**
 * URL slugs: lower-case words joined by hyphens, with accents removed so the
 * address stays readable and plain ASCII.
 */

/** Letters that Unicode normalisation does not split into a base letter and an accent. */
const SPECIAL_LETTERS: Record<string, string> = {
  ß: "ss",
  ẞ: "SS",
  æ: "ae",
  Æ: "Ae",
  œ: "oe",
  Œ: "Oe",
  ø: "o",
  Ø: "O",
  đ: "d",
  Đ: "D",
  ð: "d",
  Ð: "D",
  þ: "th",
  Þ: "Th",
  ł: "l",
  Ł: "L",
  ı: "i",
  "&": " and ",
  "@": " at ",
};

/** Short words commonly dropped from slugs. Only removed when asked. */
export const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from", "how", "in", "into",
  "is", "it", "of", "on", "or", "that", "the", "this", "to", "was", "what", "when", "where",
  "which", "who", "why", "will", "with",
]);

export interface SlugOptions {
  separator: "-" | "_";
  lowercase: boolean;
  removeStopWords: boolean;
  /** 0 means no limit. Cut at a word boundary, never mid-word. */
  maxLength: number;
}

export const DEFAULT_SLUG_OPTIONS: SlugOptions = {
  separator: "-",
  lowercase: true,
  removeStopWords: false,
  maxLength: 0,
};

export function transliterate(text: string): string {
  return [...text]
    .map((char) => SPECIAL_LETTERS[char] ?? char)
    .join("")
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "");
}

export function slugify(text: string, options: SlugOptions = DEFAULT_SLUG_OPTIONS): string {
  // Apostrophes join rather than split: "don't" → dont, not don-t.
  const plain = transliterate(text).replace(/['’‘`]/g, "");
  let words = plain.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (options.lowercase) words = words.map((word) => word.toLowerCase());
  if (options.removeStopWords) {
    const kept = words.filter((word) => !STOP_WORDS.has(word.toLowerCase()));
    // Never strip a title down to nothing.
    if (kept.length > 0) words = kept;
  }

  if (options.maxLength > 0) {
    const limited: string[] = [];
    let length = 0;
    for (const word of words) {
      const added = (limited.length > 0 ? 1 : 0) + word.length;
      if (length + added > options.maxLength) break;
      limited.push(word);
      length += added;
    }
    // A single word longer than the limit is cut rather than dropped.
    words = limited.length > 0 ? limited : words.slice(0, 1).map((word) => word.slice(0, options.maxLength));
  }

  return words.join(options.separator);
}
