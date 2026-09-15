"use client";

import { MAX_FILE_SIZE } from "@/lib/files";

import { FormatConverter } from "./_format-converter";

export default function PngToWebp() {
  return (
    <FormatConverter
      targetFormat="image/webp"
      accept={{ kinds: ["png"], maxBytes: MAX_FILE_SIZE.image, label: "PNG" }}
      inputAccept="image/png,.png"
      hint="PNG files up to 50 MB each. Nothing is uploaded."
      actionLabel="Convert to WebP"
      zipName="converted-webp.zip"
      note={
        <p>
          WebP keeps the transparency PNG has while usually landing at a quarter to a half of the size,
          which is why it suits logos and screenshots on a website. Quality below about 80 starts to
          show on hard edges and text, so raise it if the picture contains either.
        </p>
      }
    />
  );
}
