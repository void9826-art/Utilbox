"use client";

import { MAX_FILE_SIZE } from "@/lib/files";

import { FormatConverter } from "./_format-converter";

export default function WebpToPng() {
  return (
    <FormatConverter
      formats={["image/png", "image/jpeg"]}
      defaultFormat="image/png"
      accept={{ kinds: ["webp"], maxBytes: MAX_FILE_SIZE.image, label: "WebP" }}
      inputAccept="image/webp,.webp"
      hint="WebP files up to 50 MB each. Nothing is uploaded."
      actionLabel="Convert"
      zipName="converted-webp.zip"
      note={
        <p>
          PNG is lossless and keeps transparency, so it suits logos, icons and screenshots. JPG is much
          smaller for photographs but cannot store transparency — transparent areas are filled with the
          background colour. Animated WebP files keep their first frame only.
        </p>
      }
    />
  );
}
