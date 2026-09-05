"use client";

import { FormatConverter } from "./_format-converter";

export default function ImageConverter() {
  return (
    <FormatConverter
      actionLabel="Convert images"
      zipName="converted-images.zip"
      note={
        <p>
          WebP is the best choice for the web — usually 25–35% smaller than JPG at the same visible
          quality, with transparency support. Use JPG when the file must open in older software, and PNG
          for screenshots, diagrams and anything with hard edges.
        </p>
      }
    />
  );
}
