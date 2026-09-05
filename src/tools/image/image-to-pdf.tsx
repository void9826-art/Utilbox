"use client";

import { IMAGE_ACCEPT, IMAGE_INPUT_ACCEPT } from "./_shared";
import { ImagesToPdf } from "./_images-to-pdf";

export default function ImageToPdf() {
  return (
    <ImagesToPdf
      accept={IMAGE_ACCEPT}
      inputAccept={IMAGE_INPUT_ACCEPT}
      hint="JPG, PNG, WebP, GIF or BMP — up to 50 MB each. Nothing is uploaded."
      fileNoun="image"
    />
  );
}
