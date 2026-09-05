"use client";

import { PagePicker } from "./_page-picker";

export default function DeletePdfPages() {
  return (
    <PagePicker
      mode="remove"
      actionLabel="Delete selected pages"
      rangeLabel="Pages to remove"
      rangeHint="Type a range such as 2, 5-7, or click the thumbnails of the pages you want gone."
      outputSuffix="-trimmed.pdf"
    />
  );
}
