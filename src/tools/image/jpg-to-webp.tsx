"use client";

import { MAX_FILE_SIZE } from "@/lib/files";

import { FormatConverter } from "./_format-converter";

export default function JpgToWebp() {
  return (
    <FormatConverter
      targetFormat="image/webp"
      accept={{ kinds: ["jpeg"], maxBytes: MAX_FILE_SIZE.image, label: "JPG" }}
      inputAccept="image/jpeg,.jpg,.jpeg"
      hint="JPG files up to 50 MB each. Nothing is uploaded."
      actionLabel="Convert to WebP"
      zipName="converted-webp.zip"
      note={
        <p>
          At the same visual quality WebP is typically 25-35% smaller than JPG, which is worth having on
          a page with many photographs. Converting is re-encoding, so quality already lost to JPG
          compression does not come back — convert from the original where you still have it.
        </p>
      }
    />
  );
}
