"use client";

import { MAX_FILE_SIZE } from "@/lib/files";

import { FormatConverter } from "./_format-converter";

export default function AvifToJpg() {
  return (
    <FormatConverter
      formats={["image/jpeg", "image/png"]}
      defaultFormat="image/jpeg"
      accept={{ kinds: ["avif"], maxBytes: MAX_FILE_SIZE.image, label: "AVIF" }}
      inputAccept="image/avif,.avif"
      hint="AVIF files up to 50 MB each. Nothing is uploaded."
      actionLabel="Convert"
      zipName="converted-avif.zip"
      note={
        <p>
          Your browser&apos;s own AVIF decoder does the work, so this needs a browser that can display
          AVIF — current Chrome, Edge and Firefox, or Safari 16 and later. If a file is reported as
          unreadable on an older browser, updating it fixes that. Only the first frame of an animated
          AVIF is converted.
        </p>
      }
    />
  );
}
