import type { ToolContent } from "@/types/tool";

const LOCAL_NOTE =
  "The file is read into your browser's memory, changed there, and handed straight back to you. Nothing is uploaded, so there is no queue and no copy sitting on a server afterwards.";

export const pdfContent: Record<string, ToolContent> = {
  "merge-pdf": {
    seoTitle: "Merge PDF Files Online — Free, No Upload",
    seoDescription:
      "Combine multiple PDFs into a single document in the order you choose. Free, unlimited, and processed entirely in your browser so files never leave your device.",
    intro:
      "Combine several PDFs into one document. Reorder them before you merge, and download the result in a couple of seconds.",
    howToUse: [
      "Drop your PDF files onto the upload area, or click it to browse your device.",
      "Drag the arrows beside each file to put them in the order you want them merged.",
      "Add more files at any point — they are appended to the end of the list.",
      "Press Merge PDFs, then download the combined document.",
    ],
    howItWorks: [
      "Merging does not re-render or re-compress anything. Each source document is parsed, its page objects are copied across with their fonts and images intact, and they are written into a new PDF in the order you set. Text stays selectable and image quality is unchanged.",
      LOCAL_NOTE,
      "Because the whole job happens in memory, the practical limit is your device's available RAM rather than an upload cap. Very large scanned documents on an older phone are the one case where you may want to merge in two smaller batches.",
    ],
    example: {
      scenario: "Sending a single application pack instead of four separate attachments",
      steps: [
        "Add cover-letter.pdf, cv.pdf, references.pdf and portfolio.pdf.",
        "Move cover-letter.pdf to the top so it opens first.",
        "Merge and download application-pack.pdf.",
      ],
      result: "One 12-page PDF with the pages in exactly the order you arranged them.",
    },
    faq: [
      {
        question: "Is there a limit on how many PDFs I can merge?",
        answer:
          "There is no fixed limit. Everything runs on your own machine, so the ceiling is how much memory your browser has available. Merging dozens of ordinary text PDFs is fine; a hundred large scanned documents at once may be slow on a phone.",
      },
      {
        question: "Will merging reduce the quality of my PDFs?",
        answer:
          "No. Pages are copied across as-is rather than re-rendered, so text, vector graphics and embedded images come through untouched.",
      },
      {
        question: "Are my files uploaded anywhere?",
        answer:
          "No. The merge happens inside the browser tab. You can confirm this by opening your browser's network tools — no request carries your document.",
      },
      {
        question: "Can I merge password-protected PDFs?",
        answer:
          "Only if the password has already been removed. Encrypted PDFs cannot be read without the password, so the tool will report that the file could not be processed.",
      },
      {
        question: "Does the merged file keep bookmarks and form fields?",
        answer:
          "Page content, text and images are preserved. Document-level features such as bookmarks, form fields and annotations are not carried across, because they are attached to the original document structure rather than to individual pages.",
      },
    ],
  },

  "split-pdf": {
    seoTitle: "Split PDF Online — Extract Page Ranges for Free",
    seoDescription:
      "Split a PDF into separate documents by page range, or turn every page into its own file. Free, no watermark, and processed in your browser.",
    intro:
      "Break one PDF into several. Split at fixed intervals, cut out specific page ranges, or save every page as its own file.",
    howToUse: [
      "Add the PDF you want to split.",
      "Choose a mode: split into ranges you type, split every N pages, or one file per page.",
      "Check the summary — it tells you exactly how many files you will get and which pages are in each.",
      "Press Split and download the results as a ZIP, or grab individual files.",
    ],
    howItWorks: [
      "The document is parsed once and its page tree is read. For each output file a fresh PDF is created and the requested pages are copied into it, keeping their original size, rotation and content.",
      "Page ranges accept the notation you would type into a print dialog: 1-3 for a run of pages, 5 for a single page, and commas to separate them. Ranges outside the document are flagged before anything is generated.",
      LOCAL_NOTE,
    ],
    example: {
      scenario: "Pulling the three chapters out of a 40-page report",
      steps: [
        "Add report.pdf.",
        'Choose "Custom ranges" and enter 1-12, 13-28, 29-40.',
        "Split and download the ZIP.",
      ],
      result: "Three PDFs of 12, 16 and 12 pages, named after the ranges they contain.",
    },
    faq: [
      {
        question: "How do I write page ranges?",
        answer:
          "Use the same syntax as a print dialog: 1-5 for a range, 8 for a single page, and commas between them — for example 1-5, 8, 12-20. Spaces are ignored.",
      },
      {
        question: "Can I get every page as a separate file?",
        answer:
          'Yes. Choose "One file per page" and each page becomes its own PDF, numbered in order, delivered together in a ZIP.',
      },
      {
        question: "Do the split files keep the original quality?",
        answer:
          "Yes. Pages are copied rather than re-rendered, so nothing is re-compressed and text stays selectable.",
      },
      {
        question: "Is the original file changed?",
        answer:
          "No. The file on your device is only read. The new documents are built separately and downloaded as new files.",
      },
    ],
  },

  "compress-pdf": {
    seoTitle: "Compress PDF Online — Reduce PDF File Size Free",
    seoDescription:
      "Make a PDF smaller by re-encoding the images inside it. Choose a quality level, see the size saving before you download, and keep your file on your device.",
    intro:
      "Reduce the size of a PDF by re-encoding the images it contains. Pick a quality level and see the saving before you commit.",
    howToUse: [
      "Add the PDF you want to shrink.",
      "Choose a compression level — Light keeps the most detail, Strong makes the smallest file.",
      "Press Compress and wait while each page is processed.",
      "Compare the before and after sizes, then download if you are happy with the result.",
    ],
    howItWorks: [
      "Most of the weight in a large PDF is photographic content. Each page is rendered at a resolution matched to the level you pick, re-encoded as a JPEG at the matching quality, and written into a new document. Choosing Light keeps a high render scale and quality; Strong lowers both.",
      "This is a raster approach, which means it is very effective on scans and image-heavy brochures — often 60–90% smaller — and much less effective on documents that are mostly text. Text-only PDFs are already tightly compressed, and rasterising them can even make the file bigger, so the tool tells you when the output is not smaller and lets you keep the original.",
      "One trade-off is worth knowing about: because pages become images, text in the compressed file is no longer selectable or searchable. If you need to keep the text layer, use Split or Extract pages to drop the pages you do not need instead.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "How much smaller will my PDF get?",
        answer:
          "Scanned documents and photo-heavy files usually drop by 60–90%. Text-only PDFs may barely change, because their text is already stored efficiently. The tool shows the exact before and after sizes before you download.",
      },
      {
        question: "Why is my compressed file larger than the original?",
        answer:
          "That happens with text-only PDFs. Converting crisp vector text into a page image adds data rather than removing it. When this occurs the tool warns you and offers the original file instead.",
      },
      {
        question: "Can I still select the text afterwards?",
        answer:
          "No. Compression works by turning each page into an image, so the text layer is lost. If searchable text matters, keep the original and reduce the page count instead.",
      },
      {
        question: "Which level should I pick?",
        answer:
          "Start with Balanced. It halves most scans while keeping documents comfortably readable on screen. Use Strong for email attachments where size matters more than fine detail, and Light when the document will be printed.",
      },
    ],
  },

  "pdf-to-word": {
    seoTitle: "PDF to Word Converter — Free PDF to DOCX Online",
    seoDescription:
      "Extract the text from a PDF into an editable Word (.docx) document. Free, no email required, and the conversion runs entirely in your browser.",
    intro:
      "Pull the text out of a PDF and download it as an editable Word document you can open in Word, Google Docs or LibreOffice.",
    howToUse: [
      "Add the PDF you want to convert.",
      "Wait while each page is read — a progress bar shows how far along it is.",
      "Review the extracted text in the preview.",
      "Download the .docx file and open it in your word processor.",
    ],
    howItWorks: [
      "A PDF stores text as positioned glyphs rather than as paragraphs, so conversion means reconstructing the reading order. Each page's text items are read with their coordinates, grouped into lines by their vertical position, and joined into paragraphs where the spacing suggests a break. The result is written as a real Office Open XML document with page breaks between pages.",
      "What you get is clean, editable body text with the page structure preserved. What you do not get is a pixel-perfect clone: multi-column layouts, tables, floating images and precise fonts are part of the PDF's visual layer, not its text layer, and rebuilding them reliably is not possible from text positions alone. For a text-heavy report or letter the output is very close to the original; for a magazine layout it will read as plain paragraphs.",
      "If your PDF is a scan — a photograph of a page, with no text layer at all — nothing can be extracted. The tool detects this and points you to the OCR tool instead, which reads the words out of the image.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Will the Word file look exactly like the PDF?",
        answer:
          "No, and no converter can promise that honestly. You get the text, in reading order, with page breaks. Columns, tables and exact fonts are part of the PDF's visual layout and are not reconstructed.",
      },
      {
        question: "My PDF is a scan and nothing came out. Why?",
        answer:
          "A scanned PDF contains an image of the page with no text layer, so there is nothing to extract. Use the Image to Text (OCR) tool, which recognises the words in the picture.",
      },
      {
        question: "Which formats can open the result?",
        answer:
          "It is a standard .docx file. Microsoft Word, Google Docs, LibreOffice Writer, Apple Pages and most mobile office apps all open it.",
      },
      {
        question: "Do I need to sign up or give an email address?",
        answer: "No. There is no account, no email step and no watermark.",
      },
    ],
  },

  "word-to-pdf": {
    seoTitle: "Word to PDF Converter — Free DOCX to PDF Online",
    seoDescription:
      "Convert a Word .docx document into a clean PDF. Free, no sign-up, and the file is converted in your browser rather than uploaded.",
    intro:
      "Turn a Word document into a PDF that looks the same on every device. Headings, lists and basic formatting are carried across.",
    howToUse: [
      "Add a .docx file. (The older .doc format is not supported — resave it as .docx first.)",
      "Choose a page size and margin width.",
      "Press Convert and check the preview.",
      "Download your PDF.",
    ],
    howItWorks: [
      "The document is unpacked and its body is read as structured content: headings, paragraphs, bold and italic runs, bullet and numbered lists. That structure is then laid out onto PDF pages with a standard serif or sans-serif font, wrapping text to your chosen margins and starting a new page whenever the current one fills up.",
      "Because layout is rebuilt rather than copied, the result is a tidy, readable document rather than a byte-perfect replica of Word's rendering. Text stays selectable and searchable, and the file is small. Complex features — embedded images, tables, text boxes, columns and custom fonts — are not reproduced.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Why is my .doc file rejected?",
        answer:
          "The legacy .doc format is a binary format from the 1990s that browsers cannot read. Open it in Word or LibreOffice and save as .docx, then convert.",
      },
      {
        question: "Will my images come through?",
        answer:
          "No. This converter rebuilds the text structure of the document. For documents where images matter, printing to PDF from Word gives a closer result.",
      },
      {
        question: "Are my fonts preserved?",
        answer:
          "Text is set in a standard PDF font rather than your original typeface, which keeps the file small and guarantees it renders identically everywhere.",
      },
      {
        question: "Is the PDF searchable?",
        answer: "Yes. The text is written as real text, so it can be selected, copied and searched.",
      },
    ],
  },

  "pdf-to-jpg": {
    seoTitle: "PDF to JPG — Convert PDF Pages to Images Free",
    seoDescription:
      "Turn every page of a PDF into a JPG image. Choose the resolution, preview the pages, and download them individually or as a ZIP.",
    intro:
      "Render each page of a PDF as a JPG image. Useful for slide decks, social posts, or anywhere a picture is easier to share than a document.",
    howToUse: [
      "Add your PDF.",
      "Pick a resolution — higher looks better but produces bigger files.",
      "Press Convert and watch the page thumbnails appear.",
      "Download a single page, or take all of them as a ZIP.",
    ],
    howItWorks: [
      "Each page is drawn onto a canvas at the scale you choose using the same rendering engine browsers use to display PDFs, then encoded as a JPEG. Because it is a true render rather than a screenshot, vector text stays sharp at high resolutions.",
      "The resolution setting maps to a rendering scale. Screen (1×) suits web use, Print (2×) roughly matches 150 DPI on an A4 page, and High (3×) is close to 220 DPI for detailed work. Higher settings use more memory, so long documents at High may be slow on a phone.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "What resolution should I choose?",
        answer:
          "Screen for anything shown on a display, Print if the image will be printed or zoomed into, High only when you need fine detail such as a map or a technical drawing.",
      },
      {
        question: "Can I convert just one page?",
        answer:
          "Yes. Every page appears as a thumbnail with its own download button, so you can take only the pages you need.",
      },
      {
        question: "Why does the JPG have a white background?",
        answer:
          "JPEG has no transparency, so any transparent regions are painted white. If you need transparency, use the PDF to PNG tool instead.",
      },
      {
        question: "Is there a page limit?",
        answer:
          "No fixed limit, but pages are rendered one at a time and held in memory. Very long documents at High resolution may run out of memory on mobile devices.",
      },
    ],
  },

  "jpg-to-pdf": {
    seoTitle: "JPG to PDF — Combine Images into a PDF Free",
    seoDescription:
      "Turn photos into a single PDF, one image per page. Set page size, orientation and margins, reorder pages, and keep everything on your device.",
    intro:
      "Turn a set of photos into one PDF, one image per page. Reorder them, choose a page size, and download.",
    howToUse: [
      "Add your JPG or PNG images — you can select several at once.",
      "Reorder them with the arrows until the sequence is right.",
      "Choose page size, orientation and how much margin you want.",
      "Press Create PDF and download.",
    ],
    howItWorks: [
      "Each image is embedded into the PDF in its original encoding wherever possible, so a JPEG stays a JPEG and is not re-compressed. The page is then sized according to your settings and the image is scaled to fit inside the margins while keeping its aspect ratio, so nothing is stretched or cropped.",
      'Choosing "Match image" for page size makes every page exactly the size of its image, which is the right choice for scanned receipts or screenshots. A fixed size such as A4 or Letter is better when the PDF will be printed.',
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Does it reduce my photo quality?",
        answer:
          "No. JPEG images are embedded exactly as they are, with no re-encoding, so the pixels in the PDF are the pixels in your original file.",
      },
      {
        question: "Can I mix JPG and PNG files?",
        answer:
          "Yes. Both formats can be added in the same batch and each is embedded in the format best suited to it.",
      },
      {
        question: "How do I change the page order?",
        answer:
          "Use the up and down arrows next to each file in the list. The PDF is built in exactly the order shown.",
      },
      {
        question: "Why is my PDF quite large?",
        answer:
          "Because the images are stored at full quality. Run them through the Compress Image tool first if you need a smaller PDF.",
      },
    ],
  },

  "pdf-to-png": {
    seoTitle: "PDF to PNG — Convert PDF Pages to PNG Images Free",
    seoDescription:
      "Export PDF pages as lossless PNG images with optional transparency. Choose the resolution and download pages individually or as a ZIP.",
    intro:
      "Export PDF pages as PNG images. Lossless, sharp at any resolution, and able to keep a transparent background.",
    howToUse: [
      "Add your PDF.",
      "Choose a resolution and decide whether you want a white or transparent background.",
      "Press Convert.",
      "Download individual pages or all of them as a ZIP.",
    ],
    howItWorks: [
      "Pages are rendered onto a canvas and encoded as PNG, which stores pixels losslessly. That makes PNG the better choice when a page contains line art, diagrams, screenshots or crisp text, where JPEG compression would blur edges.",
      "Leaving the background transparent skips the usual white fill, so anything the PDF does not draw stays clear. This is useful for logos and diagrams you want to place on a coloured background. Note that most PDFs paint a white page rectangle themselves, in which case the result will still look white.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Should I use PNG or JPG?",
        answer:
          "PNG for text, diagrams, screenshots and anything with hard edges. JPG for photographic pages, where it produces much smaller files at similar visible quality.",
      },
      {
        question: "Why is my transparent PNG still white?",
        answer:
          "Many PDFs explicitly draw a white background rectangle as part of the page. Transparency only shows through where the document itself draws nothing.",
      },
      {
        question: "Are PNG files bigger than JPGs?",
        answer:
          "Usually yes, often several times bigger, because nothing is discarded. That is the trade-off for lossless quality.",
      },
    ],
  },

  "pdf-to-excel": {
    seoTitle: "PDF to Excel — Extract Tables to XLSX Free",
    seoDescription:
      "Recover tabular data from a PDF into an .xlsx spreadsheet. Column positions are detected automatically and you can preview the grid before downloading.",
    intro:
      "Recover tables from a PDF into a spreadsheet. Columns are detected from the layout of the page, and you can check the grid before downloading.",
    howToUse: [
      "Add a PDF that contains tabular data.",
      "Choose which pages to read, or leave it on all pages.",
      "Review the detected grid — each page becomes its own sheet.",
      "Download the .xlsx file, or copy the data as CSV.",
    ],
    howItWorks: [
      "PDFs have no concept of a table. What they store is text fragments with x and y coordinates, and a table is simply text that happens to line up. The tool reconstructs the grid from that geometry: fragments are grouped into rows by their vertical position, then the horizontal gaps across all rows are analysed to find the column boundaries that most rows agree on.",
      "This works well on the kind of table that produces a PDF from a spreadsheet or a reporting tool — bank statements, invoices, price lists, exported reports. It works less well on tables with merged cells, wrapped multi-line cells or heavy visual styling, where the geometry is ambiguous. The preview is there so you can see what was detected before you commit.",
      "Pages with no detectable columns are still exported, with each line of text in a single column, so nothing is silently dropped.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Why are some columns merged together?",
        answer:
          "Columns are found by looking for consistent horizontal gaps. When two columns sit very close together, or one column's values are wide enough to close the gap, they can be read as one. Widening the source table before exporting the PDF usually fixes it.",
      },
      {
        question: "Does it work on scanned PDFs?",
        answer:
          "No. A scan has no text layer, only an image. Run the page through the Image to Text tool first to recognise the words, though the table structure will not survive that route.",
      },
      {
        question: "What file do I get?",
        answer:
          "A standard .xlsx workbook with one sheet per page, which opens in Excel, Google Sheets, LibreOffice Calc and Numbers. You can also copy the data as CSV.",
      },
      {
        question: "Are formulas preserved?",
        answer:
          "No. A PDF only ever contains the results of formulas, never the formulas themselves, so what you get is values.",
      },
    ],
  },

  "pdf-to-text": {
    seoTitle: "PDF to Text — Extract Text From PDF Free Online",
    seoDescription:
      "Copy all the text out of a PDF as plain text, page by page. Free, instant, and processed in your browser with no upload.",
    intro:
      "Extract everything a PDF says as plain text. Copy it, or download it as a .txt file.",
    howToUse: [
      "Add your PDF.",
      "Wait a moment while each page is read.",
      "Choose whether to keep page-break markers and original line breaks.",
      "Copy the text, or download it as a .txt file.",
    ],
    howItWorks: [
      "Each page's text fragments are read along with their positions, grouped into lines, and joined in reading order. Two options change how the output is assembled: page markers insert a labelled divider between pages, and line-break handling decides whether the PDF's visual line endings are kept or whether lines are joined back into flowing paragraphs.",
      'Joining lines into paragraphs is the better choice when you want to paste the text somewhere else, because PDFs break lines to fit the page, not to mark the end of a sentence. Keeping the original breaks is better for poetry, code listings and address blocks.',
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Nothing was extracted from my PDF. What now?",
        answer:
          "Your PDF is almost certainly a scan — an image of a page with no text layer. Use the Image to Text (OCR) tool, which recognises words in pictures.",
      },
      {
        question: "Why is the text in a strange order?",
        answer:
          "Text is read in the order the document stores it, arranged by position. Multi-column layouts sometimes interleave, because the PDF has no marker saying where one column ends.",
      },
      {
        question: "Can I extract text from just a few pages?",
        answer:
          "The whole document is extracted at once, but the output is grouped by page, so you can copy the section you need.",
      },
    ],
  },

  "rotate-pdf": {
    seoTitle: "Rotate PDF Online — Fix Page Orientation Free",
    seoDescription:
      "Rotate PDF pages 90, 180 or 270 degrees and save the change permanently. Rotate every page or just the ones that need it.",
    intro:
      "Turn sideways or upside-down pages the right way up, and save the change permanently rather than just for one viewing.",
    howToUse: [
      "Add the PDF you want to fix.",
      "Rotate every page at once, or click individual thumbnails to rotate just those.",
      "Check the previews — they show exactly how the saved file will look.",
      "Press Save and download the corrected PDF.",
    ],
    howItWorks: [
      "Every page in a PDF carries a rotation value of 0, 90, 180 or 270 degrees that viewers apply when drawing it. Rotating adds your change to that existing value and normalises it back into range, then writes the updated page dictionary into a new file. The page content itself is untouched, so nothing is re-rendered and quality is unaffected.",
      "This is different from rotating the view in a PDF reader, which usually forgets the change when you close the file. Here the rotation is stored in the document, so it opens correctly everywhere, including when printed.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Will the rotation stick when I email the file?",
        answer:
          "Yes. The rotation is written into the document itself, so every viewer and printer honours it.",
      },
      {
        question: "Can I rotate only some pages?",
        answer:
          "Yes. Each page has its own thumbnail with rotate controls, and there is a button to rotate everything at once.",
      },
      {
        question: "Does rotating reduce quality?",
        answer:
          "No. Only a rotation flag changes. Page content is copied across byte for byte.",
      },
    ],
  },

  "delete-pdf-pages": {
    seoTitle: "Delete Pages From PDF — Remove PDF Pages Free",
    seoDescription:
      "Remove unwanted pages from a PDF and download the rest. Select pages visually or by range, entirely in your browser.",
    intro:
      "Remove the pages you do not want and keep everything else. Select them from thumbnails or type a range.",
    howToUse: [
      "Add your PDF.",
      "Click the pages you want to remove, or type a range such as 2, 5-7.",
      "The summary tells you how many pages will remain.",
      "Press Delete pages and download the trimmed document.",
    ],
    howItWorks: [
      "A new document is created containing only the pages you kept, copied across with their original content and rotation. The source file is only ever read.",
      "Because at least one page has to survive, selecting every page is blocked with a clear message rather than producing an empty file.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Can I delete every page?",
        answer:
          "No — a PDF must contain at least one page. If you want to keep only a handful of pages, the Extract PDF Pages tool is a more direct way to do it.",
      },
      {
        question: "Is the original file modified?",
        answer:
          "No. The file on your device is untouched. A new PDF is built and downloaded separately.",
      },
      {
        question: "Do page numbers printed on the page update?",
        answer:
          "No. Numbers printed onto the page are part of its content, not metadata, so they stay as they were. Only the actual page order changes.",
      },
    ],
  },

  "extract-pdf-pages": {
    seoTitle: "Extract Pages From PDF — Save Selected Pages Free",
    seoDescription:
      "Pull selected pages out of a PDF into a new document. Choose pages visually or by range, and keep everything on your device.",
    intro:
      "Pull the pages you need into a brand new PDF. Choose them from thumbnails or by typing a range.",
    howToUse: [
      "Add your PDF.",
      "Select the pages you want to keep, by clicking thumbnails or typing a range such as 1, 4-6.",
      "Decide whether you want them all in one file or as separate files.",
      "Press Extract and download.",
    ],
    howItWorks: [
      "Selected pages are copied into a new document in the order you chose them, which means extraction doubles as reordering: enter 5, 1, 3 and that is the order you get.",
      "Pages keep their original size, rotation and content — nothing is re-rendered, so quality is identical to the source.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "What is the difference between extracting and splitting?",
        answer:
          "Splitting divides the whole document into several files with every page accounted for. Extracting pulls out just the pages you name and ignores the rest.",
      },
      {
        question: "Can I change the page order while extracting?",
        answer:
          "Yes. Pages are added in the order you list them, so typing 5, 1, 3 produces a document in exactly that sequence.",
      },
      {
        question: "Can I get each page as its own file?",
        answer:
          "Yes. Switch the output option to separate files and the pages arrive as individual PDFs in a ZIP.",
      },
    ],
  },
};
