/**
 * Cryptographically secure randomness helpers.
 *
 * Math.random() is a fast non-cryptographic generator whose output can be
 * predicted from a handful of previous values, so it is never used here.
 * Everything draws from crypto.getRandomValues().
 */

/**
 * A uniformly distributed integer in [0, max).
 *
 * Taking a plain remainder of a random 32-bit value biases the result toward
 * the low end whenever `max` does not divide 2³² evenly. Rejection sampling
 * discards the values in that unbalanced tail instead.
 */
export function randomInt(max: number): number {
  if (max <= 0) throw new RangeError("max must be greater than zero");
  if (max === 1) return 0;

  const limit = Math.floor(0xffffffff / max) * max;
  const buffer = new Uint32Array(1);

  for (;;) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) return buffer[0] % max;
  }
}

/** An integer in [min, max], both ends included. */
export function randomIntBetween(min: number, max: number): number {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  return low + randomInt(high - low + 1);
}

export function randomChoice<T>(items: readonly T[]): T {
  return items[randomInt(items.length)];
}

/** Fisher-Yates. Sorting by a random key does not produce a uniform shuffle. */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = randomInt(index + 1);
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

/** Draws `count` distinct integers from [min, max] without replacement. */
export function sampleUnique(min: number, max: number, count: number): number[] {
  const low = Math.ceil(Math.min(min, max));
  const high = Math.floor(Math.max(min, max));
  const range = high - low + 1;

  if (count > range) {
    throw new RangeError(`Cannot draw ${count} distinct numbers from a range of ${range}.`);
  }

  // A dense range is cheaper to shuffle; a sparse draw is cheaper to reject.
  if (range <= 100_000) {
    const pool = Array.from({ length: range }, (_, index) => low + index);
    return shuffle(pool).slice(0, count);
  }

  const seen = new Set<number>();
  const output: number[] = [];
  while (output.length < count) {
    const value = randomIntBetween(low, high);
    if (!seen.has(value)) {
      seen.add(value);
      output.push(value);
    }
  }
  return output;
}

/* -------------------------------------------------------------------------- */
/* UUIDs                                                                       */
/* -------------------------------------------------------------------------- */

function bytesToUuid(bytes: Uint8Array): string {
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** RFC 9562 version 4: 122 random bits, with version and variant bits set. */
export function uuidV4(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return bytesToUuid(bytes);
}

/**
 * RFC 9562 version 7: a 48-bit millisecond timestamp followed by random bits.
 * Sorting by the identifier sorts by creation time, which keeps database
 * indexes compact instead of scattering inserts across the B-tree.
 */
export function uuidV7(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  const timestamp = Date.now();
  bytes[0] = (timestamp / 2 ** 40) & 0xff;
  bytes[1] = (timestamp / 2 ** 32) & 0xff;
  bytes[2] = (timestamp / 2 ** 24) & 0xff;
  bytes[3] = (timestamp / 2 ** 16) & 0xff;
  bytes[4] = (timestamp / 2 ** 8) & 0xff;
  bytes[5] = timestamp & 0xff;

  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToUuid(bytes);
}

export const NIL_UUID = "00000000-0000-0000-0000-000000000000";
export const MAX_UUID = "ffffffff-ffff-ffff-ffff-ffffffffffff";

/** Crockford base-32 ULID: sortable like v7, but shorter and case-insensitive. */
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function ulid(): string {
  let timestamp = Date.now();
  let time = "";
  for (let index = 0; index < 10; index += 1) {
    time = CROCKFORD[timestamp % 32] + time;
    timestamp = Math.floor(timestamp / 32);
  }

  let random = "";
  for (let index = 0; index < 16; index += 1) {
    random += CROCKFORD[randomInt(32)];
  }

  return time + random;
}
