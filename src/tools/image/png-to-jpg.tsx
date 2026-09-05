"use client";

import { MAX_FILE_SIZE } from "@/lib/files";

import { FormatConverter } from "./_format-converter";

export default function PngToJpg() {
  return (
    <FormatConverter
      targetFormat={"image/jpeg"}
      accept={{ kinds: ["png"], maxBytes: MAX_FILE_SIZE.image, label: "PNG" }}
      inputAccept={"image/png,.png"}
      hint={"PNG files up to 50 MB. Nothing is uploaded."}
      actionLabel={"Convert to JPG"}
      zipName={"jpg-images.zip"}
      note={
        <p>
          Photographs typically drop to about a fifth of their PNG size. Screenshots and flat graphics compress much less well as JPG and usually look better left as PNG.
        </p>
      }
    />
  );
}
