import {
  Braces,
  Calculator,
  FileText,
  Image as ImageIcon,
  Repeat,
  Sparkles,
  Type,
} from "lucide-react";

import type { Category, CategoryId } from "@/types/tool";

export const CATEGORIES: Category[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    shortName: "PDF",
    icon: FileText,
    description: "Merge, split, rotate, compress and convert PDF files.",
    intro:
      "Everything here runs inside your browser using the same PDF engine that renders documents on screen. Your files are read into memory, changed, and handed straight back to you as a download — they are never uploaded to a server.",
    seoTitle: "Free PDF Tools — Merge, Split, Convert & Compress",
    seoDescription:
      "Merge, split, compress, rotate and convert PDF files for free. Everything runs in your browser, so your documents never leave your device.",
  },
  {
    id: "calculators",
    name: "Calculators",
    shortName: "Calculators",
    icon: Calculator,
    description: "Everyday maths for money, study, health and time.",
    intro:
      "Practical calculators for the numbers that come up in real life: loan repayments, exam grades, percentages, attendance and more. Each one shows the formula it used and explains the result, so you can check the working rather than trust a black box.",
    seoTitle: "Free Calculators — Finance, Grades, Health & Maths",
    seoDescription:
      "Free calculators for percentages, EMI, loans, mortgages, compound interest, GPA, BMI, salary and more. Every result shows the formula behind it.",
  },
  {
    id: "image",
    name: "Image Tools",
    shortName: "Image",
    icon: ImageIcon,
    description: "Compress, resize, crop and convert images.",
    intro:
      "Image editing that happens on your own machine. Photos are decoded with the browser's built-in image pipeline, redrawn on a canvas, and re-encoded — which means no upload queue, no waiting, and no copies of your pictures sitting on someone else's server.",
    seoTitle: "Free Image Tools — Compress, Resize, Crop & Convert",
    seoDescription:
      "Compress, resize, crop, rotate and convert images between JPG, PNG, WebP and HEIC. Free, fast, and processed entirely in your browser.",
  },
  {
    id: "converters",
    name: "Converters",
    shortName: "Converters",
    icon: Repeat,
    description: "Units, measurements and currency, converted instantly.",
    intro:
      "Unit converters that use exact, standards-based factors rather than rounded approximations. Type in one box and every other unit updates as you go — no convert button, no page reloads.",
    seoTitle: "Free Unit Converters — Length, Weight & Temperature",
    seoDescription:
      "Convert length, weight, temperature, speed, area, volume, time, data storage and currency. Accurate factors, instant results, no sign-up.",
  },
  {
    id: "generators",
    name: "Generators",
    shortName: "Generators",
    icon: Sparkles,
    description: "QR codes, passwords, invoices, resumes and test data.",
    intro:
      "Create the small things you need on demand: a QR code for a poster, a strong password, a printable invoice, or filler text for a mockup. Anything that needs randomness uses your browser's cryptographic random number generator.",
    seoTitle: "Free Generators — QR Codes, Passwords & Invoices",
    seoDescription:
      "Generate QR codes, barcodes, secure passwords, UUIDs, invoices, resumes, random numbers and lorem ipsum text. Free and browser-based.",
  },
  {
    id: "text",
    name: "Text Tools",
    shortName: "Text",
    icon: Type,
    description: "Count, clean, sort and reshape blocks of text.",
    intro:
      "Fast text utilities for writing, editing and tidying up messy copy. Your text stays in the page — it is never sent anywhere, which matters when you are pasting in a draft, a client brief or anything else you would rather keep to yourself.",
    seoTitle: "Free Text Tools — Word Counter & Case Converter",
    seoDescription:
      "Count words and characters, change letter case, sort lines, remove duplicates and clean up messy text. Everything runs privately in your browser.",
  },
  {
    id: "developer",
    name: "Developer Tools",
    shortName: "Developer",
    icon: Braces,
    description: "Format, validate and encode the data you work with.",
    intro:
      "The utilities you reach for a dozen times a day — a JSON formatter that tells you exactly where the syntax broke, Base64 and URL codecs, and a timestamp converter. The formatters, encoders and converters run entirely in the page, so it is safe to paste production payloads into them. The three network checkers — the SSL certificate checker, the email address validator's MX lookup and the Open Graph preview — have to reach another server, and each one says exactly what it sends.",
    seoTitle: "Free Developer Tools — JSON, Base64 & URL Encoder",
    seoDescription:
      "Format and validate JSON, convert JSON to CSV, encode and decode Base64 and URLs, beautify HTML and CSS, and convert Unix timestamps in your browser.",
  },
];

export const CATEGORY_BY_ID: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;

export const CATEGORY_IDS: CategoryId[] = CATEGORIES.map((category) => category.id);

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORY_IDS.includes(value as CategoryId);
}
