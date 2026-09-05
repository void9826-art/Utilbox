"use client";

import { PagePicker } from "./_page-picker";

export default function ExtractPdfPages() {
  return (
    <PagePicker
      mode="keep"
      actionLabel="Extract selected pages"
      rangeLabel="Pages to extract"
      rangeHint="Type a range, or click the thumbnails. The order you type is the order you get, so 5, 1, 3 reorders as well as extracts."
      outputSuffix="-extracted.pdf"
      allowSeparateFiles
    />
  );
}
