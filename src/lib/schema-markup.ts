/**
 * JSON-LD builders and checks for FAQPage and Product structured data.
 *
 * The checks follow schema.org and Google Search's documented requirements:
 * a product needs a name plus an offer, a rating or a review; prices are plain
 * numbers with an ISO 4217 currency; GTINs carry a mod-10 check digit.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ProductInput {
  name: string;
  description: string;
  images: string[];
  brand: string;
  sku: string;
  gtin: string;
  mpn: string;
  url: string;
  price: string;
  currency: string;
  availability: string;
  condition: string;
  priceValidUntil: string;
  ratingValue: string;
  reviewCount: string;
}

export interface SchemaIssue {
  level: "error" | "warning";
  message: string;
}

type Json = Record<string, unknown>;

/** Characters that must not appear raw inside a <script> block: built at runtime, as U+2028 and U+2029 are line terminators in source. */
const UNSAFE_IN_SCRIPT = new RegExp(`[<>&${String.fromCharCode(0x2028, 0x2029)}]`, "g");

export const AVAILABILITY_OPTIONS = [
  { value: "InStock", label: "In stock" },
  { value: "OutOfStock", label: "Out of stock" },
  { value: "PreOrder", label: "Pre-order" },
  { value: "BackOrder", label: "Back order" },
  { value: "LimitedAvailability", label: "Limited availability" },
  { value: "Discontinued", label: "Discontinued" },
];

export const CONDITION_OPTIONS = [
  { value: "NewCondition", label: "New" },
  { value: "UsedCondition", label: "Used" },
  { value: "RefurbishedCondition", label: "Refurbished" },
  { value: "DamagedCondition", label: "Damaged" },
];

const clean = (value: string | undefined) => (value ?? "").trim();

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** GTIN-8, UPC-A (12), EAN-13 and GTIN-14, verified with the GS1 mod-10 check digit. */
export function isValidGtin(value: string): boolean {
  const digits = value.replace(/[\s-]/g, "");
  if (!/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(digits)) return false;
  const body = digits.slice(0, -1);
  let sum = 0;
  for (let offset = 0; offset < body.length; offset += 1) {
    const digit = Number(body[body.length - 1 - offset]);
    sum += offset % 2 === 0 ? digit * 3 : digit;
  }
  return (10 - (sum % 10)) % 10 === Number(digits[digits.length - 1]);
}

/** "1299.99" → "1299.99"; anything with symbols or separators → null. */
export function normalisePrice(value: string): string | null {
  const trimmed = value.trim();
  return /^\d+(\.\d+)?$/.test(trimmed) ? trimmed : null;
}

export function faqSchema(entries: FaqEntry[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries
      .filter((entry) => clean(entry.question) && clean(entry.answer))
      .map((entry) => ({
        "@type": "Question",
        name: clean(entry.question),
        acceptedAnswer: { "@type": "Answer", text: clean(entry.answer) },
      })),
  };
}

export function validateFaq(entries: FaqEntry[]): SchemaIssue[] {
  const issues: SchemaIssue[] = [];
  const complete = entries.filter((entry) => clean(entry.question) && clean(entry.answer));

  if (complete.length === 0) {
    issues.push({ level: "error", message: "Add at least one question with an answer." });
  }
  entries.forEach((entry, index) => {
    const hasQuestion = Boolean(clean(entry.question));
    const hasAnswer = Boolean(clean(entry.answer));
    if (hasQuestion !== hasAnswer) {
      issues.push({
        level: "warning",
        message: `Question ${index + 1} ${hasQuestion ? "has no answer" : "has an answer but no question"}, so it is left out.`,
      });
    }
  });

  const seen = new Set<string>();
  for (const entry of complete) {
    const key = clean(entry.question).toLowerCase();
    if (seen.has(key)) {
      issues.push({ level: "warning", message: `“${clean(entry.question).slice(0, 60)}” appears more than once.` });
    }
    seen.add(key);
  }

  issues.push({
    level: "warning",
    message:
      "Every question and answer must also be visible on the page. Google shows FAQ rich results only for well-known, authoritative government and health websites; elsewhere the markup is valid but will not produce them.",
  });
  return issues;
}

export function productSchema(input: ProductInput): Json {
  const product: Json = { "@context": "https://schema.org", "@type": "Product", name: clean(input.name) };

  if (clean(input.description)) product.description = clean(input.description);
  const images = input.images.map(clean).filter(Boolean);
  if (images.length === 1) product.image = images[0];
  else if (images.length > 1) product.image = images;
  if (clean(input.sku)) product.sku = clean(input.sku);
  if (clean(input.mpn)) product.mpn = clean(input.mpn);
  if (clean(input.gtin)) product.gtin = clean(input.gtin).replace(/[\s-]/g, "");
  if (clean(input.brand)) product.brand = { "@type": "Brand", name: clean(input.brand) };

  if (clean(input.price)) {
    const offer: Json = {
      "@type": "Offer",
      price: normalisePrice(input.price) ?? clean(input.price),
      priceCurrency: clean(input.currency).toUpperCase(),
      availability: `https://schema.org/${input.availability}`,
      itemCondition: `https://schema.org/${input.condition}`,
    };
    if (clean(input.url)) offer.url = clean(input.url);
    if (clean(input.priceValidUntil)) offer.priceValidUntil = clean(input.priceValidUntil);
    product.offers = offer;
  }

  if (clean(input.ratingValue) || clean(input.reviewCount)) {
    product.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(clean(input.ratingValue)),
      reviewCount: Number(clean(input.reviewCount)),
    };
  }

  return product;
}

export function validateProduct(input: ProductInput, today = new Date()): SchemaIssue[] {
  const issues: SchemaIssue[] = [];
  const error = (message: string) => issues.push({ level: "error", message });
  const warn = (message: string) => issues.push({ level: "warning", message });

  if (!clean(input.name)) error("Add the product name — it is required.");

  const price = clean(input.price);
  const hasRating = Boolean(clean(input.ratingValue) || clean(input.reviewCount));
  if (!price && !hasRating) {
    error("Add a price or a rating. Google needs an offer, a rating or a review before it can show product details.");
  }

  if (price) {
    if (normalisePrice(price) === null) {
      error("Enter the price as a plain number such as 1299.99 — no currency symbol or thousands separator.");
    }
    if (!/^[A-Za-z]{3}$/.test(clean(input.currency))) {
      error("Enter the currency as a three-letter ISO 4217 code, such as USD, EUR or GBP.");
    }
    const until = clean(input.priceValidUntil);
    if (until) {
      const date = new Date(`${until}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(until) || Number.isNaN(date.getTime())) {
        error("The price-valid-until date must be written as YYYY-MM-DD.");
      } else if (date.getTime() < today.getTime()) {
        warn("The price-valid-until date has passed, so search engines may treat the offer as expired.");
      }
    }
  }

  if (hasRating) {
    const rating = Number(clean(input.ratingValue));
    const count = Number(clean(input.reviewCount));
    if (!clean(input.ratingValue) || !Number.isFinite(rating) || rating < 1 || rating > 5) {
      error("The rating must be a number from 1 to 5.");
    }
    if (!clean(input.reviewCount) || !Number.isInteger(count) || count < 1) {
      error("The review count must be a whole number of at least 1.");
    }
    warn(
      "Only mark up ratings from genuine customer reviews that visitors can read on this page. Ratings you write yourself break Google's review snippet guidelines.",
    );
  }

  const images = input.images.map(clean).filter(Boolean);
  if (images.length === 0) {
    warn("Add at least one image URL. Merchant listings require an image, and product results are far more visible with one.");
  }
  for (const image of images) {
    if (!isAbsoluteHttpUrl(image)) error(`“${image.slice(0, 60)}” is not a full image URL starting with https://.`);
  }
  if (clean(input.url) && !isAbsoluteHttpUrl(clean(input.url))) {
    error("The product URL must be a full address starting with https://.");
  }

  const gtin = clean(input.gtin).replace(/[\s-]/g, "");
  if (gtin && !isValidGtin(gtin)) {
    error(
      /^\d+$/.test(gtin) && [8, 12, 13, 14].includes(gtin.length)
        ? "The GTIN's check digit is wrong — look for a typo in the barcode number."
        : "A GTIN must be 8, 12, 13 or 14 digits.",
    );
  }
  if (!gtin && !clean(input.mpn) && !clean(input.sku)) {
    warn("Add a GTIN, MPN or SKU if the product has one; identifiers help search engines match it to other listings.");
  }
  if (!clean(input.brand)) warn("Add the brand if the product has one.");

  return issues;
}

/**
 * Wraps structured data in a script tag. "<", ">", "&" and the two Unicode
 * line separators are written as JSON escapes, so text such as "</script>"
 * inside an answer cannot end the tag.
 */
export function toScriptTag(schema: Json): string {
  const json = JSON.stringify(schema, null, 2).replace(UNSAFE_IN_SCRIPT, (character) => {
    return `\\u${(character.codePointAt(0) as number).toString(16).padStart(4, "0")}`;
  });
  return `<script type="application/ld+json">\n${json}\n</script>`;
}
