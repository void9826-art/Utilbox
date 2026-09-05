"use client";

import { MAX_FILE_SIZE } from "@/lib/files";

import { FormatConverter } from "./_format-converter";

export default function WebpToJpg() {
  return (
    <FormatConverter
      targetFormat={"image/jpeg"}
      accept={{ kinds: ["webp"], maxBytes: MAX_FILE_SIZE.image, label: "WebP" }}
      inputAccept={"image/webp,.webp"}
      hint={"WebP files up to 50 MB. Nothing is uploaded."}
      actionLabel={"Convert to JPG"}
      zipName={"jpg-images.zip"}
      note={
        <p>
          The JPG will usually be 25–35% larger than the WebP, because WebP compresses more efficiently at the same visible quality. Converting is worth it only when something you use cannot open WebP. Animated WebP files keep their first frame only.
        </p>
      }
    />
  );
}
