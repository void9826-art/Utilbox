/**
 * "Bold" and "italic" text for plain-text fields such as LinkedIn posts.
 *
 * There is no formatting in those fields; the effect comes from Unicode's
 * Mathematical Alphanumeric Symbols block, which contains complete styled
 * alphabets. Each ASCII letter or digit is swapped for its styled twin, and
 * the reverse map turns styled text back into plain letters.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

export type LetterStyle = "bold" | "italic" | "boldItalic" | "monospace" | "boldSerif";
export type TextStyle = LetterStyle | "underline" | "strike" | "plain";

/** First code point of each styled alphabet. Sans-serif styles have no italic gaps. */
const ALPHABETS: Record<LetterStyle, { upper: number; lower: number; digit: number | null }> = {
  bold: { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec },
  italic: { upper: 0x1d608, lower: 0x1d622, digit: null },
  boldItalic: { upper: 0x1d63c, lower: 0x1d656, digit: null },
  monospace: { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 },
  boldSerif: { upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce },
};

const UNDERLINE = "̲";
const STRIKE = "̶";
/** Braille pattern blank: renders as empty space but is not whitespace. */
export const BLANK_LINE_FILLER = "⠀";

const toAscii = new Map<number, string>();
for (const alphabet of Object.values(ALPHABETS)) {
  for (let index = 0; index < 26; index += 1) {
    toAscii.set(alphabet.upper + index, String.fromCharCode(65 + index));
    toAscii.set(alphabet.lower + index, String.fromCharCode(97 + index));
  }
  if (alphabet.digit !== null) {
    for (let index = 0; index < 10; index += 1) toAscii.set(alphabet.digit + index, String.fromCharCode(48 + index));
  }
}

export function toPlain(text: string): string {
  let out = "";
  for (const character of text) {
    if (character === UNDERLINE || character === STRIKE) continue;
    out += toAscii.get(character.codePointAt(0) as number) ?? character;
  }
  return out;
}

/** Styles replace one another: the text is made plain first, then restyled. */
export function applyStyle(text: string, style: TextStyle): string {
  const plain = toPlain(text);
  if (style === "plain") return plain;

  if (style === "underline" || style === "strike") {
    const mark = style === "underline" ? UNDERLINE : STRIKE;
    return [...plain].map((character) => (/\s/.test(character) ? character : character + mark)).join("");
  }

  const alphabet = ALPHABETS[style];
  return [...plain]
    .map((character) => {
      const code = character.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(alphabet.upper + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(alphabet.lower + code - 97);
      if (code >= 48 && code <= 57 && alphabet.digit !== null) return String.fromCodePoint(alphabet.digit + code - 48);
      return character;
    })
    .join("");
}

const BULLET_PREFIX = /^\s*(?:[•▪◦→➤✅-]|\d+\.)\s+/u;

/** Prefixes every non-empty line; "1." numbers them. Existing bullets are replaced. */
export function bulletLines(text: string, marker: string): string {
  let number = 0;
  return text
    .split("\n")
    .map((line) => {
      if (!line.trim()) return line;
      number += 1;
      const body = line.replace(BULLET_PREFIX, "");
      return marker === "1." ? `${number}. ${body}` : `${marker} ${body}`;
    })
    .join("\n");
}

export function protectBlankLines(text: string): string {
  return text
    .split("\n")
    .map((line) => (line.trim() === "" ? BLANK_LINE_FILLER : line))
    .join("\n");
}

export function countStyledLetters(text: string): number {
  let count = 0;
  for (const character of text) {
    const code = character.codePointAt(0) as number;
    if (code >= 0x1d400 && code <= 0x1d7ff) count += 1;
  }
  return count;
}
