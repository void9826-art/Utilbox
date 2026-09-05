"use client";

import { PdfToImage } from "./_pdf-to-image";

export default function PdfToPng() {
  return <PdfToImage format="image/png" extension="png" formatName="PNG" allowTransparency />;
}
