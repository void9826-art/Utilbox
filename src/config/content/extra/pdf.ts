import type { ToolContentExtra } from "@/types/tool";

export const pdfExtra: Record<string, ToolContentExtra> = {
  "pdf-add-page-numbers": {
    tips: [
      "Number the pages as the last step. If you merge, delete or reorder pages afterwards, the numbers printed on them will no longer match their positions.",
      "For a report with front matter, skip the cover and set the first number so the main text starts where you want it, or number only the range of pages that needs it.",
      "Check a page that has content close to the bottom edge. The number is drawn on top of the page, so if it collides with an existing footer, choose another corner or move it further from the edge.",
      "Use the “Page 1 of 10” style for anything that will be printed and handled as loose sheets — a reader can tell at once whether a page is missing.",
    ],
    faq: [
      {
        question: "Will the numbers be the right way up on landscape or rotated pages?",
        answer:
          "Yes. Each page's rotation and visible area are read first, so the number lands in the position you chose as the page appears on screen, reading the right way up.",
      },
      {
        question: "Can I number only part of a document?",
        answer:
          "Yes. Number a range of pages, and the “of N” total counts only the pages that are numbered, so “Page 1 of 8” means eight numbered pages.",
      },
      {
        question: "Are the page numbers searchable text?",
        answer:
          "Yes. They are written as real text in the standard Helvetica font, so they stay sharp at any zoom and add only a few kilobytes to the file.",
      },
    ],
  },

  "pdf-table-to-excel": {
    tips: [
      "Select only the pages that hold the table. Cover pages, notes and totals printed below the table turn into stray rows.",
      "Compare the first few rows with the PDF before you start working with the data, paying attention to where each column begins.",
      "Account codes and other values with leading zeros are kept as text so the zeros survive. Convert them to numbers in your spreadsheet only if you need to calculate with them.",
      "Bracketed amounts such as (45.00) become negative numbers, which is the accounting convention. Check that this matches what the document means before you add up a column.",
    ],
    faq: [
      {
        question: "Can I get a CSV file instead of an Excel workbook?",
        answer: "Yes. The table can be saved as an Excel sheet or as CSV, whichever your next step needs.",
      },
      {
        question: "Will a header that repeats on every page appear many times?",
        answer:
          "Not when you choose One sheet. When a page starts with the same header row as the first page, that repeat is removed, so the result is one continuous table.",
      },
      {
        question: "Why is a figure like 1.234,50 left as text?",
        answer:
          "Because it is ambiguous. In some countries the comma marks decimals and in others thousands, so the tool does not guess. Convert those cells in your spreadsheet using the format you know the document uses.",
      },
    ],
  },

  "pdf-metadata-editor": {
    tips: [
      "Check the properties before a PDF leaves your organisation. The author field often holds a full name or a computer username, and the title can be an old working title nobody meant to publish.",
      "Give PDFs you publish a clear title. Many viewers show it in the window bar instead of the file name.",
      "Leave “Remove the XMP metadata stream” ticked when you change the title, so different programs do not show different titles.",
      "Edit the metadata as the last step. Other PDF tools often rewrite the producer field and the modified date when they save, which can undo your changes.",
    ],
    faq: [
      {
        question: "What are the creator and producer fields?",
        answer:
          "The creator is the application the document was written in, such as a word processor. The producer is the software that turned it into a PDF. Both are set automatically and can reveal which programs you use.",
      },
      {
        question: "Can I change the creation and modification dates?",
        answer:
          "Yes. The dates are editable fields like the others, and clearing them removes them from the file instead of saving blank values.",
      },
      {
        question: "Do search engines read PDF metadata?",
        answer:
          "They can. For a PDF published on a website, the title property is one of the things a search engine may use when it lists the file, alongside the text of the document itself.",
      },
    ],
  },

  "pdf-resize-page": {
    tips: [
      "Convert a document to the local paper size before sending it to be printed abroad, rather than relying on each printer's own “fit to page” setting, which varies from machine to machine.",
      "Use Scale to fit when content runs close to the edges. Keep content size is only safe when the pages already have generous margins.",
      "Flatten or remove comments first if they matter. Links and form fields move with the content, but highlights and freehand drawings may no longer line up.",
      "Check the list of page sizes read back from the saved file before you send it on.",
    ],
    faq: [
      {
        question: "What are the dimensions of A4 and US Letter?",
        answer:
          "A4 is 210 × 297 mm (about 8.27 × 11.69 inches). US Letter is 8.5 × 11 inches (215.9 × 279.4 mm). Letter is slightly wider and A4 slightly taller.",
      },
      {
        question: "Which paper sizes can I convert to?",
        answer: "A4, US Letter, US Legal, A3 and A5.",
      },
      {
        question: "Can I enlarge pages, for example from A5 to A4?",
        answer:
          "Yes. Scale to fit uses whatever factor fits the new paper, so smaller pages are scaled up. Text and line drawings stay sharp because they are scaled as drawing instructions; photographs inside the page are enlarged with them and may look softer.",
      },
    ],
  },

  "merge-pdf": {
    tips: [
      "Turn sideways pages upright and delete blank pages before you merge. A problem page is much easier to fix in its own small file.",
      "Name the files with numbers in front — 01-cover, 02-cv, 03-references — so the order is easy to check at a glance.",
      "Flatten any filled-in forms first. Form fields are not carried into the merged file, but flattened answers are part of the page and are.",
      "Open the result and check that its page count equals the sum of the originals before you send it.",
    ],
    faq: [
      {
        question: "Can I merge PDFs on my phone?",
        answer:
          "Yes. The merge runs in the phone's browser like it does on a computer. Very large scanned documents use a lot of memory, so on an older phone merge them in two batches.",
      },
      {
        question: "How do I merge only some pages from each file?",
        answer:
          "Take the pages you want out of each document first with Extract PDF Pages, then merge the smaller files.",
      },
      {
        question: "Can I combine photos and PDFs into one file?",
        answer:
          "Turn the photos into a PDF first with JPG to PDF, then merge that file with the others.",
      },
    ],
  },

  "split-pdf": {
    tips: [
      "Page ranges count by position in the file, not by the number printed in the footer. Go by your reader's page counter, such as “7 of 40”.",
      "For a stack of identical scanned forms, use “every N pages” instead of typing ranges — ten three-page forms split cleanly with N set to 3.",
      "Read the summary before you press Split. It lists which pages go into each file, so a mistyped range is caught before anything is created.",
      "When you send the parts to someone, keep the numbering in the file names — part 1 of 3, part 2 of 3 — so they know when they have them all.",
    ],
    faq: [
      {
        question: "Can I split a PDF by file size?",
        answer:
          "Not directly. Split by number of pages and check the sizes of the parts; if one is still too large, split that part again.",
      },
      {
        question: "When should I use Extract PDF Pages instead?",
        answer:
          "When you want only a few pages and do not care about the rest. Splitting accounts for every page; extracting takes just the ones you name.",
      },
      {
        question: "Can I split a scanned PDF?",
        answer:
          "Yes. Pages are copied whatever they contain, so a scanned page comes across exactly as it was.",
      },
    ],
  },

  "compress-pdf": {
    tips: [
      "Try selecting a sentence in the PDF first. If the words highlight, the file is mostly text and compression will barely help; if nothing highlights, it is a scan and will usually shrink a lot.",
      "For email, aim for about 18 MB or less. Attachments grow by about a third when they are sent, so a file just under 25 MB can still be refused.",
      "Delete pages nobody needs before you compress. Fewer pages means less to shrink and a smaller result.",
      "Keep the original file. Compression is one-way, so send the compressed copy and keep the full-quality version.",
    ],
    faq: [
      {
        question: "Can I compress a PDF to an exact size, such as 1 MB?",
        answer:
          "There is no target-size setting. Try Balanced, then Strong, and check the size each produces. If the file is still too large, remove pages or split it into parts.",
      },
      {
        question: "Will a compressed PDF still print well?",
        answer:
          "With Light, yes, for most documents. Strong lowers the resolution enough that small print and fine lines can look soft on paper, so keep it for documents read on screen.",
      },
      {
        question: "Does compression keep links, form fields and bookmarks?",
        answer:
          "No. Each page is rebuilt as a picture in a new document, so interactive parts of the original do not survive. Keep the original if you need them.",
      },
    ],
  },

  "pdf-to-word": {
    tips: [
      "Check that the PDF contains real text before converting: if you cannot select a sentence in it, it is a scan and needs OCR instead.",
      "Delete running headers, footers and page numbers after converting. They are ordinary text on each page, so they arrive as stray lines at every page break.",
      "Re-apply heading styles in your word processor. Headings come across as plain paragraphs, and styling them restores a working outline.",
      "If only some pages come out empty, those pages are scanned. Run just those pages through OCR rather than the whole document.",
    ],
    faq: [
      {
        question: "Are the pictures included in the Word file?",
        answer:
          "No. The converter extracts the text. To reuse the pictures, pull them out with Extract Images From PDF and place them in the document yourself.",
      },
      {
        question: "Can I convert a password-protected PDF?",
        answer:
          "Only after the password has been removed, in the program that protected it. An encrypted PDF cannot be read without it.",
      },
      {
        question: "Is there a page limit?",
        answer:
          "There is no fixed limit. Every page is read in turn on your own device, so long documents simply take longer, and a progress bar shows how far it has got.",
      },
    ],
  },

  "word-to-pdf": {
    tips: [
      "If the document contains images, tables or text boxes, export it to PDF from your word processor instead. This converter rebuilds the text and leaves those out.",
      "Use your word processor's heading styles rather than bold body text for headings. Real headings come across as headings.",
      "Pick the page size the reader will print on — A4 in most of the world, Letter in the United States and Canada.",
      "Keep the .docx as your editable master and send the PDF.",
    ],
    faq: [
      {
        question: "Do bold, italic and lists come across?",
        answer:
          "Yes. Headings, paragraphs, bold and italic text, and bulleted and numbered lists are carried into the PDF.",
      },
      {
        question: "Why does the PDF look different from my Word document?",
        answer:
          "The layout is rebuilt rather than copied, using a standard font and your chosen margins. The result is tidy and readable, but it is not a pixel-perfect copy of how Word draws the page.",
      },
      {
        question: "How do I convert a Google Doc?",
        answer:
          "In Google Docs choose File → Download → Microsoft Word (.docx), then add that file here. Google Docs can also download a PDF directly from the same menu.",
      },
    ],
  },

  "pdf-to-jpg": {
    tips: [
      "Use Screen for anything that will only be viewed on a display; it keeps files small. Choose Print or High only when the image will be printed or zoomed into.",
      "For pages that are mostly text, diagrams or screenshots, PDF to PNG gives sharper edges than JPG.",
      "Download only the pages you need from the thumbnails instead of the whole ZIP.",
      "If you want a single photo from inside the PDF rather than the whole page, Extract Images From PDF pulls it out at its own resolution.",
    ],
    faq: [
      {
        question: "Can I turn the JPG back into a PDF?",
        answer: "Yes. JPG to PDF puts one image on each page of a new PDF.",
      },
      {
        question: "Will the text in the JPG be selectable?",
        answer:
          "No. A JPG is a picture of the page. To get the words, use PDF to Text on the original PDF.",
      },
      {
        question: "Are my PDF pages uploaded?",
        answer: "No. Each page is rendered in your browser and the images are created on your device.",
      },
    ],
  },

  "jpg-to-pdf": {
    tips: [
      "Choose “Match image” for receipts and screenshots, so each page is exactly the size of its picture. Choose A4 or Letter when the PDF will be printed.",
      "Crop and straighten photos first with Crop Image and Rotate Image — a tidy page starts with a tidy photo.",
      "If the PDF must be small, shrink the photos with Compress Image before adding them. JPEGs are embedded exactly as they are, so their size carries straight into the PDF.",
      "Photograph documents flat, from directly above, in even daylight. The PDF can only be as readable as the photos in it.",
    ],
    faq: [
      {
        question: "Can I add iPhone HEIC photos?",
        answer: "Convert them to JPG first with HEIC to JPG, then add the JPGs here.",
      },
      {
        question: "Does each image get its own page?",
        answer:
          "Yes, one image per page, scaled to fit inside the margins without being stretched or cropped.",
      },
      {
        question: "Can I leave a border around each photo?",
        answer: "Yes. Set the margin before you create the PDF; it applies to every page.",
      },
    ],
  },

  "pdf-to-png": {
    tips: [
      "Use PNG for pages you will place in a slide, a document or a design, where crisp text and lines matter.",
      "Pick a higher resolution if the image will be printed or enlarged; the extra pixels are what keep small text sharp.",
      "Turn on the transparent background only for logos and diagrams, and expect most documents to stay white — many PDFs paint their own white page.",
      "If the PNGs are too large for a website, convert them with PNG to WebP, which keeps the sharp edges at a fraction of the size.",
    ],
    faq: [
      {
        question: "Can I convert only some pages?",
        answer: "Yes. Download the individual pages you need, or take every page together as a ZIP.",
      },
      {
        question: "Is the conversion lossless?",
        answer:
          "PNG stores every pixel exactly, so nothing is lost when the image is saved. The amount of detail depends on the resolution you choose for rendering the page.",
      },
      {
        question: "Are my files uploaded?",
        answer: "No. Pages are rendered and saved as PNG in your browser.",
      },
    ],
  },

  "pdf-to-excel": {
    tips: [
      "It works best on PDFs that were exported from software — bank statements, invoices, price lists and reports. Hand-designed tables with merged cells are harder.",
      "Check the detected grid in the preview before you download. It shows exactly where the columns were placed.",
      "Choose only the pages that contain tables, so headings and paragraphs on other pages do not end up in the workbook.",
      "If one table runs across many pages and you want it as a single sheet, use the PDF Table Extractor instead.",
    ],
    faq: [
      {
        question: "Why is one row of the table split into two?",
        answer:
          "When a cell's text wraps onto a second line in the PDF, that line can be read as a row of its own. Merge the two rows in your spreadsheet, or widen the column in the source document before exporting the PDF.",
      },
      {
        question: "Is my bank statement uploaded?",
        answer: "No. The table is read and the workbook built in your browser. Nothing is sent to a server.",
      },
      {
        question: "What happens to headers repeated on every page?",
        answer:
          "Each page becomes its own sheet here, so each keeps its header. The PDF Table Extractor can stack the pages into one sheet and drop the repeats.",
      },
    ],
  },

  "pdf-to-text": {
    tips: [
      "Turn on line joining when you are pasting the text into an email or a document; PDFs break lines to fit the page, not to end sentences.",
      "Keep the original line breaks for poetry, code listings and address blocks, where they matter.",
      "Use page markers when you will need to quote page numbers later.",
      "With a two-column layout, check the order of the paragraphs — the PDF has no marker for where one column ends.",
    ],
    faq: [
      {
        question: "Does the text keep its formatting?",
        answer:
          "No. The result is plain text: no bold, fonts or layout. For an editable document with paragraphs, use PDF to Word.",
      },
      {
        question: "What happens to tables?",
        answer:
          "Their contents come out as lines of text. To keep the rows and columns, use PDF to Excel.",
      },
      {
        question: "Is there a size limit?",
        answer:
          "No fixed limit. The pages are read on your own device, so a very long document simply takes a little longer.",
      },
    ],
  },

  "rotate-pdf": {
    tips: [
      "Fix rotation before merging or sending a file. Nobody wants to tilt their head halfway through a document.",
      "Rotate only the pages that are wrong by clicking their thumbnails; the rotate-all button is for scans that are sideways throughout.",
      "Rotating the view in a PDF reader is usually forgotten when you close the file. Saving here writes the rotation into the document.",
      "A page scanned upside down needs a 180° turn — two quarter turns.",
    ],
    faq: [
      {
        question: "Can I rotate a page by less than 90 degrees?",
        answer:
          "No. A PDF stores page rotation in quarter turns only — 0, 90, 180 or 270 degrees. A slightly crooked scan has to be straightened when it is scanned again.",
      },
      {
        question: "Does rotating change the page size?",
        answer:
          "The page itself stays the same. Turned by 90 or 270 degrees, a portrait page is simply displayed and printed as landscape.",
      },
      {
        question: "Is my file uploaded?",
        answer: "No. The rotation is applied in your browser and the new file is created on your device.",
      },
    ],
  },

  "delete-pdf-pages": {
    tips: [
      "If you are keeping only a few pages, Extract PDF Pages is quicker: name the pages you want instead of the ones you do not.",
      "Double-sided scanning of single-sided paper leaves a blank after every page. Remove them here before sharing the scan.",
      "Look at the thumbnails before deleting — the page counter in a reader is easier to trust than memory.",
      "If the document needs page numbers, add them after deleting, so the numbering has no gaps.",
    ],
    faq: [
      {
        question: "Can I undo a deletion?",
        answer:
          "Your original file is never changed, so you can always start again from it. Keep it until you have checked the new copy.",
      },
      {
        question: "Does deleting pages make the file smaller?",
        answer:
          "Usually, yes. The new file contains only the pages you kept, so removing scanned or image-heavy pages makes a clear difference.",
      },
      {
        question: "Can I delete pages on my phone?",
        answer: "Yes. It works in a mobile browser the same way as on a computer, and nothing is uploaded.",
      },
    ],
  },

  "extract-pdf-pages": {
    tips: [
      "List the pages in the order you want them. Typing 5, 1, 3 gives a new document in exactly that order.",
      "Use thumbnails to pick pages visually when you are not sure of the numbers.",
      "Choose separate files when each page is going to a different person, such as one payslip or certificate each.",
      "Remember that ranges count positions in the file, not numbers printed on the pages.",
    ],
    faq: [
      {
        question: "Can I extract pages from several PDFs at once?",
        answer:
          "Extract from one document at a time, then combine the results with Merge PDF if you need them together.",
      },
      {
        question: "Is the original file changed?",
        answer: "No. It is only read. The extracted pages are written into a new file that you download.",
      },
      {
        question: "Can I extract a range and single pages together?",
        answer: "Yes. Combine them with commas, for example 1-3, 7, 10-12.",
      },
    ],
  },

  "pdf-watermark": {
    tips: [
      "Use tiled placement when the watermark is meant to discourage reuse. A single diagonal mark is easy to crop out of a screenshot; a repeated pattern is not.",
      "Keep the opacity low enough that the document underneath is still comfortable to read.",
      "Short wording works best: DRAFT, CONFIDENTIAL, COPY, or a name and date.",
      "A watermark labels a document; it does not hide anything. To remove text for good, use Redact PDF.",
    ],
    faq: [
      {
        question: "Can I use a logo as the watermark?",
        answer: "Not here. The watermark is text, drawn in the standard Helvetica Bold font.",
      },
      {
        question: "Does the watermark print?",
        answer:
          "Yes. The transparency is a real PDF setting, so it prints exactly as it looks on screen.",
      },
      {
        question: "Will the watermark make the file bigger?",
        answer: "Barely. It is added as text rather than as a picture, so it adds very little.",
      },
    ],
  },

  "pdf-reorder-pages": {
    tips: [
      "Use Reverse order for a scan that came out back to front; it fixes the whole document in one press.",
      "Each thumbnail shows two numbers: the large one is its new position, the small one is where it came from.",
      "Nothing is written until you save, so shuffle freely and press Reset to start over.",
      "Remove unwanted pages first with Delete PDF Pages, then put the rest in order here.",
    ],
    faq: [
      {
        question: "Can I move pages from one PDF into another?",
        answer: "Merge the two files first with Merge PDF, then rearrange the pages of the combined file here.",
      },
      {
        question: "Can I drag pages into place?",
        answer: "Use the arrows under each page to move it earlier or later in the document.",
      },
      {
        question: "Is my document uploaded?",
        answer: "No. The pages are reordered in your browser and the new file is created on your device.",
      },
    ],
  },

  "pdf-extract-images": {
    tips: [
      "If nothing is found, the pages are probably drawn from shapes and text. Render them as pictures with PDF to JPG instead.",
      "A scanned document usually gives one large image per page at full scan resolution — useful for re-cropping a scan.",
      "A logo used on every page is stored once in the file and listed once, with all the pages it appears on.",
      "Extracted pictures are saved as lossless PNG files. For photographs, convert them to JPG or WebP afterwards if you need smaller files.",
    ],
    faq: [
      {
        question: "Why is an extracted photo larger than I expected?",
        answer:
          "Pictures are saved as PNG, which stores every pixel exactly. A photograph that was stored compressed inside the PDF can take more space as a PNG. Convert it to JPG or WebP to shrink it.",
      },
      {
        question: "Can I take every picture at once?",
        answer: "Yes. Every page is scanned, and you can download all the pictures together as a ZIP.",
      },
      {
        question: "Can I reuse pictures I extract?",
        answer:
          "Extracting a picture does not change who owns it. Photos and graphics in a document are usually someone's copyright, so check you have permission before reusing them.",
      },
    ],
  },

  "pdf-booklet": {
    tips: [
      "Print one sheet as a test first and fold it. If page 2 is upside down, change the duplex setting to flip on the short edge.",
      "The booklet sheet is twice the width of your page. To make an A5 booklet on A4 paper, convert the pages to A5 with the PDF Page Size Converter first.",
      "Plan for blanks: the page count must be a multiple of four, so one to three blank pages are added at the end when needed.",
      "Fold each sheet separately, stack them in order, then fold the whole stack and staple along the crease.",
    ],
    faq: [
      {
        question: "What paper size do I print the booklet on?",
        answer:
          "Each sheet holds two pages side by side at their original size, so it is twice as wide as one page. A5 pages print on A4 paper; A4 pages need A3.",
      },
      {
        question: "Do I need a special stapler?",
        answer:
          "A long-reach stapler makes it easy to staple along the middle fold. Without one, open the stapler fully and staple from the outside onto something soft, then bend the staple legs flat.",
      },
      {
        question: "Why do the inner pages stick out after folding?",
        answer:
          "Thick booklets push the inner sheets outwards at the fold, an effect printers call creep. Trim the open edge with a guillotine, or split a very long document into two booklets.",
      },
    ],
  },

  "pdf-n-up": {
    tips: [
      "Use 2-up for handouts of slides or for reading drafts with half the paper; 4-up and above suit overviews rather than reading.",
      "Let the sheet turn landscape automatically when the grid is wider than it is tall — a 2-up layout needs it.",
      "Turn on the light outline if you will cut the sheets apart; it is a cutting guide.",
      "Leave a margin of at least 5 mm so a printer that cannot print to the edge does not trim the outer pages.",
    ],
    faq: [
      {
        question: "Which layouts are available?",
        answer: "2, 4, 6, 9 or 16 pages on each sheet.",
      },
      {
        question: "Will small text still be readable?",
        answer:
          "At 2-up most documents read comfortably. At 4-up each page is about half its original width, so small print gets hard to read; 9 and 16 are best for thumbnails and overviews.",
      },
      {
        question: "Is this the same as a booklet?",
        answer:
          "No. Pages here run in reading order across each sheet. The PDF Booklet Maker reorders pages so a folded stack reads correctly.",
      },
    ],
  },

  "pdf-crop-margins": {
    tips: [
      "Crop academic papers before reading them on a tablet or e-reader — removing a wide border makes the text noticeably larger on the same screen.",
      "Watch the dashed outline on the first page; everything inside it is kept.",
      "Untick the equal-margins box when a document has a wider binding margin on one side.",
      "Cropping hides content rather than deleting it. To remove something for good, use Redact PDF.",
    ],
    faq: [
      {
        question: "Can a crop be undone later?",
        answer:
          "Yes. The content outside the crop is still in the file, so anyone with a PDF editor can restore the full page. Keep your original as well.",
      },
      {
        question: "How much should I crop for reading on a tablet?",
        answer:
          "Start with the margin you can see on the page — often around 15–25 mm on an A4 document — and check the outline to make sure no text is cut.",
      },
      {
        question: "What happens when I print a cropped PDF?",
        answer:
          "Most printers honour the crop, so only the visible area prints. Depending on your print settings it may be enlarged to fill the paper.",
      },
    ],
  },

  "pdf-header-footer": {
    tips: [
      "Use Page {page} of {total} in the footer of anything that will be printed, so a missing page is obvious.",
      "Put a reference number, client name or “Draft” in the header of documents that circulate in several versions.",
      "Tick Skip the first page when the document opens with a cover.",
      "If the text collides with content at the edge, increase the distance from the edge rather than shrinking the text.",
    ],
    faq: [
      {
        question: "Can I add a header and a footer at the same time?",
        answer: "Yes. Fill in either or both, each with its own wording and alignment.",
      },
      {
        question: "Is the header text searchable?",
        answer: "Yes. It is written as real text, so it can be selected, copied and searched.",
      },
      {
        question: "What date format does {date} use?",
        answer:
          "Your computer's regional format, so it reads the way dates are normally written where you are.",
      },
    ],
  },

  "pdf-grayscale": {
    tips: [
      "Use Standard for ordinary documents and Print for small type, fine lines or anything going to a print shop.",
      "Check charts and coloured highlights in the result. Two colours with the same brightness become the same grey.",
      "Keep the colour original; the grey version cannot be turned back into colour.",
      "If you only need a mono printout once, the black-and-white option in your print dialog is quicker.",
    ],
    faq: [
      {
        question: "Why do two colours in my chart look the same in grey?",
        answer:
          "Conversion keeps each colour's brightness, not its hue. A red and a green of similar brightness become nearly the same grey, so add labels or patterns if the chart must work in black and white.",
      },
      {
        question: "Does the page size change?",
        answer: "No. Each page is written back at its original size, so margins and proportions stay the same.",
      },
      {
        question: "Is my document uploaded?",
        answer: "No. The pages are rendered and converted in your browser.",
      },
    ],
  },

  "pdf-invert-colors": {
    tips: [
      "Use it on text documents, papers and slide decks with plain backgrounds. Photographs come out looking like film negatives.",
      "Keep the original. The inverted copy is for reading, and its text can no longer be selected.",
      "Do not print the inverted version — a page that is mostly black uses a great deal of ink or toner.",
      "If you only read on one device, its reader's night mode may be enough. Inverting the file is for when you want the dark version everywhere.",
    ],
    faq: [
      {
        question: "Can I turn an inverted PDF back to normal?",
        answer:
          "Inverting twice restores the colours, but the pages remain pictures, so the text stays unselectable. Going back to the original file is better.",
      },
      {
        question: "Does it change the page size?",
        answer: "No. Only the colours change; each page keeps its size.",
      },
      {
        question: "Is my file uploaded?",
        answer: "No. Every page is inverted in your browser.",
      },
    ],
  },

  "pdf-flatten-form": {
    tips: [
      "Keep the editable original for yourself and send the flattened copy.",
      "Check the list of fields before flattening; it confirms you loaded the right document.",
      "Flatten before signing, so nothing can change after your signature is on the page.",
      "Flatten before merging. Merging does not carry form fields across, but flattened answers are part of the page and survive.",
    ],
    faq: [
      {
        question: "Why do my answers disappear in some PDF viewers?",
        answer:
          "Some viewers draw form fields badly or not at all. Flattening paints the answers onto the page, so every viewer shows the same thing.",
      },
      {
        question: "Should I flatten before or after signing?",
        answer: "Before. Fill in the form, flatten it, then add your signature to the flattened copy.",
      },
      {
        question: "Can I flatten a form on my phone?",
        answer: "Yes. It runs in a mobile browser, and the form is not uploaded.",
      },
    ],
  },

  "pdf-signature": {
    tips: [
      "Sign on a phone or tablet screen if you can; a finger or stylus gives a more natural line than a mouse.",
      "Draw the signature large across the box. A big drawing scaled down looks smooth; a small one scaled up looks shaky.",
      "Set the width to match the space the form leaves for the signature, and click on the signature line itself rather than above it.",
      "Keep an unsigned copy, and send the signed file only to the people who need it.",
    ],
    faq: [
      {
        question: "Can I type my name instead of drawing a signature?",
        answer:
          "This tool captures a drawn signature only. If the other party accepts a typed name, type it into the form's own field instead.",
      },
      {
        question: "How do I add the date next to my signature?",
        answer:
          "Type it into the form's date field if it has one. Otherwise, write the date in the drawing box and place it in a second pass, the same way as the signature.",
      },
      {
        question: "Why is my signature not exactly where I clicked?",
        answer:
          "Where you click is where the signature is placed on the full-size page. If it is slightly off, load the original again and place it once more rather than sending it crooked.",
      },
    ],
  },

  "pdf-redact": {
    tips: [
      "Find every occurrence before you start: search the original with Ctrl+F, or run it through PDF to Text, so a name repeated in a footer or appendix is not missed.",
      "Flatten fillable forms first so typed answers are redacted with the rest of the page.",
      "Test the result: search the redacted copy for the words you removed and try selecting text on a redacted page. Nothing should be found.",
      "Clear the author and title with the PDF Metadata Editor, and give the file a neutral name before sending it.",
    ],
    faq: [
      {
        question: "Is a black box drawn in another app good enough?",
        answer:
          "Usually not. In most editors a drawn box is a separate object above the text, and the words underneath can still be selected and copied. Redaction must remove the text itself.",
      },
      {
        question: "Will redaction make my file bigger?",
        answer:
          "Often, a little. Each marked page becomes a picture, which takes more space than text. Pages you did not mark are unchanged.",
      },
      {
        question: "How do I check that the redaction worked?",
        answer:
          "Open the new file, search for each word you removed, and try to select text on the redacted pages. Running it through PDF to Text catches anything a viewer does not show.",
      },
    ],
  },

  "pdf-compare": {
    tips: [
      "Compare text-based PDFs. A scan has no text to compare, so run it through OCR first if you must.",
      "Use it before signing a revised contract to see exactly which wording changed between versions.",
      "If the page counts differ, everything after an inserted page will legitimately appear changed — start reading from the first difference.",
      "Layout, fonts and pictures are not compared, so a reformatted document with the same wording shows no differences.",
    ],
    faq: [
      {
        question: "Can I compare two Word documents?",
        answer:
          "Save or export both as PDF first, then compare the PDFs. Word's own compare feature is another option for .docx files.",
      },
      {
        question: "How are moved paragraphs shown?",
        answer:
          "As a removal in one place and an addition in another, because the comparison works with additions and deletions.",
      },
      {
        question: "How are changes marked?",
        answer:
          "Additions and removals are marked with symbols and a strike-through as well as a background colour, so the report reads clearly without relying on colour.",
      },
    ],
  },

  "pdf-bookmarks": {
    tips: [
      "Add bookmarks as the last step, after the pages are in their final order.",
      "Keep titles short — a sidebar is narrow, and long titles are cut off.",
      "One bookmark per chapter or section is usually enough; a bookmark on every page makes the list harder to use.",
      "Open the saved file and click each entry to check it lands on the right page.",
    ],
    faq: [
      {
        question: "Do browsers show PDF bookmarks?",
        answer:
          "Yes. The PDF viewers built into the major browsers show the outline in a sidebar, usually opened from a menu or a button at the top left.",
      },
      {
        question: "Can a bookmark jump to a point partway down a page?",
        answer: "No. Each bookmark opens its page fitted to the reader's window.",
      },
      {
        question: "Are bookmarks the same as a table of contents?",
        answer:
          "No. Bookmarks live in the reader's sidebar. A table of contents is a page inside the document; the two work well together.",
      },
    ],
  },
};
