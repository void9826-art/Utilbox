"use client";

import { PdfToImage } from "./_pdf-to-image";

export default function PdfToJpg() {
  return <PdfToImage format="image/jpeg" extension="jpg" formatName="JPG" />;
}
