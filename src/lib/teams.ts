/**
 * Helpers for the list randomizer. Shuffling itself uses the cryptographic
 * Fisher-Yates in random.ts; these functions only arrange an already
 * shuffled list, so they can be tested deterministically.
 */

/** Non-empty, trimmed lines; optionally without repeats (first occurrence kept). */
export function parseEntries(text: string, removeDuplicates: boolean): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!removeDuplicates) return lines;
  const seen = new Set<string>();
  return lines.filter((line) => {
    const key = line.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Deals a shuffled list into `groups` teams like cards, so team sizes never
 * differ by more than one.
 */
export function dealIntoGroups<T>(shuffled: T[], groups: number): T[][] {
  const count = Math.max(1, Math.min(Math.floor(groups), shuffled.length || 1));
  const teams: T[][] = Array.from({ length: count }, () => []);
  shuffled.forEach((item, index) => teams[index % count].push(item));
  return teams;
}

/** Splits into teams of a given size; the last team may be smaller. */
export function chunkBySize<T>(shuffled: T[], size: number): T[][] {
  const step = Math.max(1, Math.floor(size));
  const teams: T[][] = [];
  for (let index = 0; index < shuffled.length; index += step) teams.push(shuffled.slice(index, index + step));
  return teams;
}
