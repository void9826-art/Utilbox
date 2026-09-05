"use client";

import { MAX_FILE_SIZE } from "@/lib/files";

import { FormatConverter } from "./_format-converter";

export default function JpgToPng() {
  return (
    <FormatConverter
      targetFormat={"image/png"}
      accept={{ kinds: ["jpeg"], maxBytes: MAX_FILE_SIZE.image, label: "JPG" }}
      inputAccept={"image/jpeg,.jpg,.jpeg"}
      hint={"JPG files up to 50 MB. Nothing is uploaded."}
      actionLabel={"Convert to PNG"}
      zipName={"png-images.zip"}
      note={
        <p>
          Expect the PNG to be three to five times larger than the JPG. That is the cost of lossless storage — nothing further is discarded, but the compression artefacts already baked into the JPG remain.
        </p>
      }
    />
  );
}
