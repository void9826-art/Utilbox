/**
 * Line-level difference between two pieces of text.
 *
 * A longest-common-subsequence table gives the smallest set of insertions and
 * deletions that turns one side into the other, which is what a reader expects
 * from a comparison. The table is quadratic, so very long inputs fall back to a
 * coarser comparison rather than locking up the tab.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

export type DiffType = "equal" | "insert" | "delete";

export interface DiffLine {
  type: DiffType;
  text: string;
}

export interface DiffSummary {
  added: number;
  removed: number;
  unchanged: number;
  changed: boolean;
}

/** Above this, the table would cost more memory than the answer is worth. */
const MAX_LINES = 4000;

export function splitLines(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function commonPrefix(before: string[], after: string[]): number {
  let index = 0;
  while (index < before.length && index < after.length && before[index] === after[index]) index += 1;
  return index;
}

export function diffLines(before: string[], after: string[]): DiffLine[] {
  if (before.length > MAX_LINES || after.length > MAX_LINES) {
    // Far too long to align line by line; report the ends that differ rather
    // than pretending to a precision this cannot deliver.
    const shared = commonPrefix(before, after);
    const result: DiffLine[] = before.slice(0, shared).map((text) => ({ type: "equal" as const, text }));
    before.slice(shared).forEach((text) => result.push({ type: "delete", text }));
    after.slice(shared).forEach((text) => result.push({ type: "insert", text }));
    return result;
  }

  const rows = before.length;
  const columns = after.length;
  // table[i][j] is the length of the longest common subsequence of the
  // remaining lines, filled from the end backwards.
  const table = new Int32Array((rows + 1) * (columns + 1));
  const at = (row: number, column: number) => row * (columns + 1) + column;

  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let column = columns - 1; column >= 0; column -= 1) {
      table[at(row, column)] =
        before[row] === after[column]
          ? table[at(row + 1, column + 1)] + 1
          : Math.max(table[at(row + 1, column)], table[at(row, column + 1)]);
    }
  }

  const result: DiffLine[] = [];
  let row = 0;
  let column = 0;
  while (row < rows && column < columns) {
    if (before[row] === after[column]) {
      result.push({ type: "equal", text: before[row] });
      row += 1;
      column += 1;
    } else if (table[at(row + 1, column)] >= table[at(row, column + 1)]) {
      result.push({ type: "delete", text: before[row] });
      row += 1;
    } else {
      result.push({ type: "insert", text: after[column] });
      column += 1;
    }
  }
  while (row < rows) {
    result.push({ type: "delete", text: before[row] });
    row += 1;
  }
  while (column < columns) {
    result.push({ type: "insert", text: after[column] });
    column += 1;
  }

  return result;
}

export function summariseDiff(lines: DiffLine[]): DiffSummary {
  let added = 0;
  let removed = 0;
  let unchanged = 0;
  for (const line of lines) {
    if (line.type === "insert") added += 1;
    else if (line.type === "delete") removed += 1;
    else unchanged += 1;
  }
  return { added, removed, unchanged, changed: added > 0 || removed > 0 };
}
