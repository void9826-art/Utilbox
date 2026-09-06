import { siteConfig } from "@/config/site";

/**
 * Just the two provenance fields, typed structurally rather than against
 * pdf-lib's PDFDocument.
 *
 * Every PDF tool imports pdf-lib inside the handler that needs it, so the 350 KB
 * library never reaches someone who only opened the page. Typing this against
 * pdf-lib would put the import back at the top of eight files and undo that, so
 * the shape is declared here instead and nothing is imported at all.
 */
interface PdfProvenance {
  setCreator(value: string): void;
  setProducer(value: string): void;
}

/**
 * Stamps the site as the origin of a generated PDF.
 *
 * Eight tools produce PDFs and each set the same two fields by hand, writing
 * the brand name out sixteen times. Reading it from configuration means a
 * rename cannot leave the old name buried in the metadata of files people have
 * already downloaded.
 */
export function stampProducer(doc: PdfProvenance): void {
  doc.setCreator(siteConfig.name);
  doc.setProducer(siteConfig.name);
}
