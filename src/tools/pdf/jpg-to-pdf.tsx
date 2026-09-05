"use client";

import { MAX_FILE_SIZE } from "@/lib/files";

import { ImagesToPdf } from "../image/_images-to-pdf";

export default function JpgToPdf() {
  return (
    <ImagesToPdf
      accept={{ kinds: ["jpeg", "png"], maxBytes: MAX_FILE_SIZE.image, label: "JPG" }}
      inputAccept="image/jpeg,image/png,.jpg,.jpeg,.png"
      hint="JPG or PNG photos, up to 50 MB each. JPGs are embedded without re-encoding."
      fileNoun="photo"
    />
  );
}
