import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-01";

export const pdfFormsAndPrintingGuides: Guide[] = [
  {
    slug: "how-to-fill-in-a-pdf-form",
    topic: "PDF",
    title: "How to fill in a PDF form — even one that isn’t fillable",
    seoTitle: "How to Fill In a PDF Form (Even a Non-Fillable One)",
    description:
      "Fill in a PDF form on a computer or phone without printing it, deal with forms that refuse to open or have no fields, and lock your answers before sending.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-flatten-form", "pdf-signature", "merge-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            Application forms, tax forms, rental agreements, school consent slips: a great many of
            them arrive as PDFs with a request to &ldquo;complete and return&rdquo;. Printing,
            filling in by hand and scanning works, but it is slow and the result is often hard to
            read. Most of the time you can fill the form in on screen instead. How depends on what
            kind of PDF you have been sent.
          </p>

          <h2>First, find out what kind of form it is</h2>
          <p>Open the PDF and click inside one of the boxes you need to fill in. One of three things happens:</p>
          <ul>
            <li>
              <strong>A cursor appears and you can type.</strong> The form has real fields. This is
              the easy case, covered next.
            </li>
            <li>
              <strong>Nothing happens.</strong> The boxes are just lines printed on the page, or the
              whole form is a scan. It is not fillable, but you can still add text on top — see
              further down.
            </li>
            <li>
              <strong>You see a message such as &ldquo;Please wait…&rdquo; or &ldquo;this document
              requires a newer viewer&rdquo;.</strong> The form was built with an older Adobe
              technology called XFA, which only Adobe&apos;s own reader can display. Open it in the
              free Adobe Acrobat Reader on a computer.
            </li>
          </ul>

          <h2>Filling in a form that has fields</h2>
          <p>
            You do not need special software. The PDF viewers built into Chrome, Edge and Firefox
            all let you type into form fields, tick boxes and choose from drop-down lists. So do
            the free Adobe Acrobat Reader and Preview on a Mac. On phones, recent versions of the
            Files app on iPhone and the PDF viewer in Google Drive on Android can fill simple forms.
          </p>
          <ol>
            <li>Open the PDF and click into the first field.</li>
            <li>
              Press Tab to move to the next field. Forms are usually set up so Tab follows the
              order of the questions.
            </li>
            <li>
              Watch for fields that check what you type, such as dates or numbers. If a field
              refuses your entry, it usually wants a particular format — try the one shown in the
              label, such as DD/MM/YYYY.
            </li>
            <li>
              Save or download the filled-in copy. In a browser, use the download or save button in
              the PDF toolbar rather than the browser&apos;s own menu, so the answers are saved into
              the file.
            </li>
            <li>Close the file and open the saved copy to check that every answer is still there.</li>
          </ol>

          <h2>Filling in a form that has no fields</h2>
          <p>When the boxes are only printed lines, you add text on top of the page instead:</p>
          <ul>
            <li>
              <strong>Adobe Acrobat Reader</strong> (free) has a Fill &amp; Sign feature that lets
              you click anywhere on a page and type.
            </li>
            <li>
              <strong>Preview on a Mac</strong> has a text tool in its Markup toolbar that does the
              same.
            </li>
            <li>
              <strong>If neither is available</strong>, printing, writing by hand and scanning is
              still a valid route. Scan in greyscale at 200–300 dots per inch so the handwriting
              stays legible.
            </li>
          </ul>
          <p>
            Whichever you use, line the text up with the boxes and zoom in to check nothing overlaps
            the printed labels. Forms that will be read by a machine are less forgiving than a
            person.
          </p>

          <h2>Lock your answers before you send</h2>
          <p>
            A filled-in form still has live fields. Anyone who receives it can click into a field
            and change an answer, and some PDF viewers display form fields badly — answers can look
            wrong or vanish entirely on the other person&apos;s screen. Flattening fixes both. It
            paints each answer onto the page as ordinary content and removes the interactive field.
          </p>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-flatten-form">Flatten PDF Form</Link> and add your
              filled-in copy.
            </li>
            <li>Check the list of fields it found, to be sure you loaded the right document.</li>
            <li>Press Flatten form and download the locked copy.</li>
          </ol>
          <p>
            Keep the editable version for yourself in case something needs to change, and send the
            flattened one. Flattening cannot be undone.
          </p>

          <h2>Signing the form</h2>
          <p>
            Sign after flattening, so nothing on the page can change once your signature is on it.{" "}
            <Link href="/pdf/pdf-signature">Sign PDF</Link> lets you draw your signature with a
            finger, stylus or mouse and place it on the signature line. For more on what a drawn
            signature does and does not prove, see{" "}
            <Link href="/guides/how-to-sign-a-pdf-without-printing">
              how to sign a PDF without printing it
            </Link>
            .
          </p>

          <h2>Sending the form with supporting documents</h2>
          <p>
            Many applications ask for the form plus copies of documents — a payslip, a proof of
            address, a certificate. If they want a single file, combine everything with{" "}
            <Link href="/pdf/merge-pdf">Merge PDF</Link>. Flatten the form first: merging carries
            pages across but not form fields, so an unflattened form can lose its answers in the
            merged file.
          </p>

          <h2>A checklist before you press send</h2>
          <ul>
            <li>Every required field is filled in, including the ones on later pages.</li>
            <li>Dates, reference numbers and your name are spelled exactly as on your documents.</li>
            <li>The saved copy shows your answers when reopened — ideally check it in a second viewer.</li>
            <li>The form is flattened and signed, in that order.</li>
            <li>The file name says what it is, such as surname-application-form.pdf.</li>
          </ul>

          <h2>A note on privacy</h2>
          <p>
            Forms are full of personal details: addresses, dates of birth, bank and passport
            numbers. Many &ldquo;fill PDF online&rdquo; websites upload the document to their
            servers to do the work. Filling the form in your own PDF viewer and flattening and
            signing it in the browser keeps those details on your device until you choose to send
            them.
          </p>
        </>
      );
    },
  },

  {
    slug: "a4-vs-letter-paper-size",
    topic: "PDF",
    title: "A4 vs US Letter: the paper sizes, and how to convert between them",
    seoTitle: "A4 vs Letter: Paper Sizes and How to Convert",
    description:
      "The exact sizes of A4, US Letter, Legal and the A series, which countries use which, why documents print badly on the other size, and how to convert a PDF.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-resize-page", "pdf-n-up", "pdf-booklet"],
    Body: function Body() {
      return (
        <>
          <p>
            Most of the world prints on A4. The United States and Canada print on US Letter. The two
            look almost identical, which is exactly why they cause trouble: a document made for one
            usually prints on the other with a margin cut off or a strip of empty space, and nobody
            notices until it comes out of the printer.
          </p>

          <h2>The sizes</h2>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Millimetres</th>
                <th>Inches</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A4</td>
                <td>210 × 297</td>
                <td>8.27 × 11.69</td>
              </tr>
              <tr>
                <td>US Letter</td>
                <td>215.9 × 279.4</td>
                <td>8.5 × 11</td>
              </tr>
              <tr>
                <td>US Legal</td>
                <td>215.9 × 355.6</td>
                <td>8.5 × 14</td>
              </tr>
              <tr>
                <td>A3</td>
                <td>297 × 420</td>
                <td>11.69 × 16.54</td>
              </tr>
              <tr>
                <td>A5</td>
                <td>148 × 210</td>
                <td>5.83 × 8.27</td>
              </tr>
            </tbody>
          </table>
          <p>
            Letter is 5.9 mm wider than A4 and 17.6 mm shorter. A4 is the narrower, taller sheet.
          </p>

          <h2>Who uses which</h2>
          <p>
            US Letter and Legal are standard in the United States and Canada, and common in parts of
            Latin America and the Philippines. Almost everywhere else uses the international A
            series, defined in the ISO 216 standard, with A4 for everyday documents. If you send
            documents across that line — a CV to a company abroad, a report to an overseas client,
            forms to a foreign government office — paper size is worth a moment&apos;s thought.
          </p>

          <h2>Why the A series is so tidy</h2>
          <p>
            Every A size has sides in the ratio 1 to the square root of 2. That ratio has a useful
            property: cut a sheet in half across its long side and both halves have the same shape
            as the original. So A3 folded in half is two A4 pages, A4 folded in half is two A5
            pages, and a photocopier can enlarge A4 to A3 or shrink it to A5 without leaving
            margins. The largest size, A0, has an area of exactly one square metre. US paper sizes
            have no such relationship, which is why enlarging Letter to its larger counterparts
            always changes the shape.
          </p>

          <h2>What goes wrong when you print on the wrong size</h2>
          <ul>
            <li>
              <strong>A4 document on Letter paper:</strong> the page is about 18 mm too tall. Printed
              at actual size, the bottom margin — often a footer or page number — is cut off.
              Printed with &ldquo;fit to page&rdquo;, the whole page shrinks to about 94% with wider
              side margins.
            </li>
            <li>
              <strong>Letter document on A4 paper:</strong> the page is about 6 mm too wide. Printed
              at actual size, the right edge can be clipped; scaled to fit, it shrinks slightly and
              gains extra space at the top and bottom.
            </li>
          </ul>
          <p>
            Neither is disastrous for a letter, but it matters for forms that will be scanned,
            labels, anything with content near the edges, and documents where page numbers must
            appear.
          </p>

          <h2>Converting a PDF to the other size</h2>
          <ol>
            <li>
              Add the file to the <Link href="/pdf/pdf-resize-page">PDF Page Size Converter</Link>.
              Its current page sizes are listed.
            </li>
            <li>Choose the target paper — A4, US Letter, US Legal, A3 or A5.</li>
            <li>
              Choose <strong>Scale to fit</strong> to shrink or enlarge the content so it fits the
              new paper without anything being cut off, or <strong>Keep content size</strong> to
              change only the paper around it.
            </li>
            <li>Convert, check the sizes read back from the saved file, and download.</li>
          </ol>
          <p>
            Scale to fit uses the largest factor that fits both dimensions. From A4 to Letter that
            is 94.1%, leaving a little extra space at the sides. From Letter to A4 it is 97.3%,
            leaving extra space at the top and bottom. The content is scaled as drawing
            instructions rather than as a picture, so text stays sharp and selectable.
          </p>

          <h2>Getting it right when you write the document</h2>
          <p>
            The cleanest fix is to set the page size before you start. In a word processor, choose
            the paper size in the page or layout settings at the beginning, not the end — changing
            it afterwards reflows every page and can move pictures and page breaks. If you do not
            know where a document will be printed, keep generous margins of at least 20 mm and
            avoid placing anything important near the bottom of the page; such a layout survives
            either paper size.
          </p>
          <p>
            Microsoft Word also has an option in its advanced print settings to scale content for A4
            or Letter paper automatically when the document and the printer disagree. It is handy,
            but it only helps when the document is printed from Word itself — a PDF you send to
            someone else carries the size it was made with.
          </p>

          <h2>Printing several pages on one sheet</h2>
          <p>
            For handouts and drafts, size differences matter less if you put two pages on each
            sheet: <Link href="/pdf/pdf-n-up">Multiple PDF Pages Per Sheet</Link> scales each page
            into a cell on the sheet and keeps the text selectable. To make a folded booklet
            instead, see{" "}
            <Link href="/guides/how-to-print-a-booklet-from-a-pdf">how to print a booklet from a PDF</Link>
            .
          </p>

          <h2>Quick answers</h2>
          <ul>
            <li>
              <strong>Is A4 bigger than Letter?</strong> It is taller but narrower. Its area is
              slightly larger: about 624 cm² against 603 cm².
            </li>
            <li>
              <strong>What is half of A4?</strong> A5, 148 × 210 mm. Half of Letter is 5.5 × 8.5
              inches, sometimes called half letter or statement.
            </li>
            <li>
              <strong>What size are most printers set to?</strong> Whatever was standard where they
              were sold. Check the paper size in the print dialog whenever a document comes from
              abroad.
            </li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "how-to-print-a-booklet-from-a-pdf",
    topic: "PDF",
    title: "How to print a booklet from a PDF on an ordinary printer",
    seoTitle: "How to Print a Booklet From a PDF",
    description:
      "Turn any PDF into a folded, stapled booklet on a home or office printer: page order, the multiple-of-four rule, duplex settings, folding and stapling.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-booklet", "pdf-resize-page", "pdf-add-page-numbers"],
    Body: function Body() {
      return (
        <>
          <p>
            A programme for an event, a zine, a short manual, a recipe collection: a folded booklet
            is easier to read and handle than a stack of loose pages, and you can make one on any
            printer that prints on both sides. The only tricky part is the page order, and that can
            be done for you.
          </p>

          <h2>How a booklet is put together</h2>
          <p>
            A simple booklet is a stack of sheets folded in half and stapled along the fold — what
            printers call saddle stitching. Each sheet carries four pages: two on the front and two
            on the back. Because the sheets nest inside each other, the pages on one sheet are not
            next to each other in the document. The outermost sheet carries the first and last
            pages; the innermost carries the middle two.
          </p>
          <p>For a 12-page booklet printed on three sheets, the order is:</p>
          <table>
            <thead>
              <tr>
                <th>Sheet</th>
                <th>Front</th>
                <th>Back</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 (outside)</td>
                <td>12 and 1</td>
                <td>2 and 11</td>
              </tr>
              <tr>
                <td>2</td>
                <td>10 and 3</td>
                <td>4 and 9</td>
              </tr>
              <tr>
                <td>3 (centre)</td>
                <td>8 and 5</td>
                <td>6 and 7</td>
              </tr>
            </tbody>
          </table>
          <p>
            This rearranging is called imposition. Getting it wrong by one page ruins the whole
            stack, which is why it is worth letting a tool do it.
          </p>

          <h2>Why the page count must be a multiple of four</h2>
          <p>
            Every sheet holds exactly four pages, so a booklet always has 4, 8, 12, 16 or more
            pages. A 10-page document needs two blank pages to make 12. The{" "}
            <Link href="/pdf/pdf-booklet">PDF Booklet Maker</Link> adds the one to three blanks
            needed at the end, where a reader expects them. If you would rather control where the
            blanks fall — say, a blank inside front cover — add blank pages to the document yourself
            before making the booklet.
          </p>

          <h2>Choose the finished size first</h2>
          <p>
            The booklet sheet is twice the width of one page, because two pages sit side by side at
            their original size. That means:
          </p>
          <ul>
            <li>
              <strong>A5 pages</strong> print two-up on <strong>A4 paper</strong> — the usual home
              and office booklet.
            </li>
            <li>
              <strong>A4 pages</strong> need <strong>A3 paper</strong>, which most home printers
              cannot take.
            </li>
            <li>
              <strong>Half-letter pages</strong> (5.5 × 8.5 inches) print two-up on{" "}
              <strong>US Letter</strong>.
            </li>
          </ul>
          <p>
            If your document is A4 and you want an A5 booklet on A4 paper, convert the pages to A5
            first with the <Link href="/pdf/pdf-resize-page">PDF Page Size Converter</Link> using
            Scale to fit. Text shrinks by about 30%, so check that the smallest print is still
            comfortable to read; a document designed at A5 from the start reads better.
          </p>

          <h2>Make the booklet step by step</h2>
          <ol>
            <li>
              Finish the content: final page order, final page count, and page numbers if you want
              them. Add page numbers before imposing, with{" "}
              <Link href="/pdf/pdf-add-page-numbers">Add Page Numbers to PDF</Link> — once the pages
              are rearranged onto sheets, numbering them is no longer possible.
            </li>
            <li>Convert the page size if needed, as above.</li>
            <li>
              Add the PDF to the <Link href="/pdf/pdf-booklet">PDF Booklet Maker</Link> and save the
              booklet file.
            </li>
            <li>
              Print one sheet as a test, double-sided, with the printer set to flip on the{" "}
              <strong>short edge</strong>.
            </li>
            <li>Fold the test sheet and check that the pages read in order and the right way up.</li>
            <li>Print the rest.</li>
          </ol>

          <h2>Short-edge or long-edge?</h2>
          <p>
            Booklet sheets are landscape, and a landscape sheet has to be flipped along its short
            edge for the back to come out the right way up. If your test sheet has every back page
            upside down, the printer flipped on the long edge. Change the duplex setting and print
            again. If your printer cannot print on both sides, print all the fronts, put the stack
            back in the paper tray, and print all the backs — test with one sheet first to learn
            which way round the paper goes.
          </p>

          <h2>Folding and stapling</h2>
          <ol>
            <li>Fold each sheet in half on its own, creasing firmly with a ruler or the back of a spoon.</li>
            <li>Stack the folded sheets in order, with sheet 1 on the outside.</li>
            <li>Fold the whole stack together and line up the edges.</li>
            <li>
              Staple along the crease, two staples placed about a quarter of the way in from each
              end.
            </li>
          </ol>
          <p>
            A long-reach stapler makes the last step easy. Without one, open an ordinary stapler
            fully, lay the open booklet face down on something soft such as a folded towel or
            cardboard, staple through from the outside along the crease, and bend the staple legs
            flat by hand.
          </p>

          <h2>Thick booklets and creep</h2>
          <p>
            When many sheets are folded together, the inner sheets stick out further than the outer
            ones at the open edge. Printers call this creep. A thin booklet barely shows it; a thick
            one has a stepped edge. Trim the open edge with a paper guillotine for a clean finish,
            and keep text away from the outer margins of the inner pages. Beyond a few dozen pages,
            two booklets — or a different binding — usually work better than one fat one.
          </p>

          <h2>Paper</h2>
          <p>
            Ordinary office paper works. Slightly heavier paper, around 100 gsm, stops print
            showing through from the back and gives a more solid feel. A thicker cover sheet looks
            good but is harder to fold neatly on a home printer; if you use one, print the outer
            sheet separately on the heavier stock.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-convert-a-pdf-table-to-excel",
    topic: "PDF",
    title: "How to get a table or bank statement out of a PDF and into Excel",
    seoTitle: "How to Convert a PDF Table to Excel or CSV",
    description:
      "Turn a table in a PDF — a bank statement, an invoice list, a price list — into a spreadsheet you can sort and add up, and check the result properly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-table-to-excel", "pdf-to-excel", "pdf-to-text"],
    Body: function Body() {
      return (
        <>
          <p>
            Copying a table out of a PDF and pasting it into a spreadsheet usually produces one long
            column of jumbled values. The table looks like a grid, but the PDF does not store it as
            one — and understanding that is the key to getting clean data out.
          </p>

          <h2>Why PDF tables are hard to extract</h2>
          <p>
            A PDF has no concept of rows, columns or cells. It stores pieces of text at exact
            positions on the page, plus lines drawn between them. A table is simply text that
            happens to line up. To rebuild it, a tool has to group text that sits on the same line
            into rows, then find the horizontal positions where most rows agree a column begins.
            That works very well on tables generated by software and less well on hand-designed
            ones with merged cells.
          </p>

          <h2>Before you start: is there a better source?</h2>
          <p>
            Check whether the data exists in a spreadsheet format already. Most online banking
            services let you download transactions as CSV or Excel, and accounting systems, shops
            and reporting tools usually export data directly. A direct export is always more
            reliable than extracting from a PDF. When the PDF is all you have, read on.
          </p>

          <h2>Check that the PDF contains text</h2>
          <p>
            Try to select a figure in the table with your mouse. If individual numbers highlight,
            the PDF contains real text and can be extracted. If nothing highlights, the page is a
            scanned image. Text recognition can read the numbers out of a scan, but the table
            structure is lost along the way, so expect to rebuild the columns by hand.
          </p>

          <h2>Which tool to use</h2>
          <ul>
            <li>
              <Link href="/pdf/pdf-table-to-excel">PDF Table Extractor</Link> — for a table that runs
              across many pages, like a bank statement. It stacks the pages into one sheet, removes
              the header row when it repeats at the top of each page, and turns figures such as
              1,234.50 or (45.00) into real numbers.
            </li>
            <li>
              <Link href="/pdf/pdf-to-excel">PDF to Excel</Link> — for documents with separate tables
              on separate pages. Each page becomes its own sheet, and you can preview the detected
              grid before downloading.
            </li>
          </ul>

          <h2>Extract a bank statement step by step</h2>
          <ol>
            <li>Add the statement to the PDF Table Extractor.</li>
            <li>
              Choose only the pages that contain the transaction table. Summary pages, adverts and
              notes add stray rows.
            </li>
            <li>Choose One sheet, so the pages are stacked into a single table.</li>
            <li>Look over the preview, then download it as an Excel file or as CSV.</li>
          </ol>
          <p>
            Bank statements are among the most private documents most people own. The extraction
            runs in your browser, and the statement is not uploaded anywhere.
          </p>

          <h2>Check the result — properly</h2>
          <p>
            An extraction can look right and still be wrong in one row out of two hundred. A few
            checks catch nearly every problem:
          </p>
          <ul>
            <li>
              <strong>Add up a column and compare it with a total on the statement.</strong> If the
              sum of money in and money out matches the statement&apos;s own totals, no amounts have
              gone missing or moved column.
            </li>
            <li>
              <strong>Check the running balance.</strong> Opening balance plus the transactions
              should equal the closing balance printed on the statement.
            </li>
            <li>
              <strong>Count the rows</strong> on one page against the PDF.
            </li>
            <li>
              <strong>Look for split rows.</strong> A long description that wraps onto a second line
              in the PDF can become a row of its own with no amount. Merge it into the row above.
            </li>
          </ul>

          <h2>Numbers, dates and codes</h2>
          <ul>
            <li>
              <strong>Brackets mean negative.</strong> Accountants write −45.00 as (45.00), and the
              Table Extractor converts it that way. Check that this matches your document.
            </li>
            <li>
              <strong>Leading zeros are kept.</strong> Account codes and reference numbers such as
              00123 are kept as text, because turning them into numbers would drop the zeros.
            </li>
            <li>
              <strong>Ambiguous decimals are left alone.</strong> A figure like 1.234,50 means one
              thousand two hundred in much of Europe and something else in the UK and US, so it is
              not guessed. Convert those cells in your spreadsheet once you know which convention
              the document uses.
            </li>
            <li>
              <strong>Dates can be misread by spreadsheets.</strong> 03/04/2026 is 3 April in most of
              the world and 4 March in the United States. If your spreadsheet&apos;s regional
              settings differ from the statement&apos;s, check a date with a day above 12 to see
              which way round it was read.
            </li>
          </ul>

          <h2>Excel file or CSV?</h2>
          <p>
            Choose the Excel file when you will work in Excel, Google Sheets, Numbers or LibreOffice.
            Choose CSV when the data is going into another program — accounting software, a budgeting
            app or a database — since almost everything can import it. If CSV columns arrive merged
            when you open the file, your spreadsheet may expect a semicolon instead of a comma, which
            is common in regions that write decimals with a comma.
          </p>

          <h2>When you only need the words</h2>
          <p>
            For a table you only want to read or quote, not calculate with,{" "}
            <Link href="/pdf/pdf-to-text">PDF to Text</Link> gives the contents line by line without
            any spreadsheet in between.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-add-page-numbers-to-a-pdf",
    topic: "PDF",
    title: "How to add page numbers to a PDF — and get them right",
    seoTitle: "How to Add Page Numbers to a PDF",
    description:
      "Number the pages of any PDF: where to put the numbers, how to skip a cover or start from a different number, and the order to do things in.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["pdf-add-page-numbers", "pdf-header-footer", "pdf-bookmarks", "merge-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            Page numbers are easy to forget until someone says &ldquo;see page 14&rdquo; and there is
            no page 14 to find. They matter most in exactly the documents that tend to be assembled
            from several files at the last minute: reports, application packs, court bundles, theses
            and manuals.
          </p>

          <h2>Do it last</h2>
          <p>
            Page numbers are printed onto the pages. If you add them and then merge in another
            document, delete a page or move one, the numbers no longer match the positions. So
            assemble the document first, in this order:
          </p>
          <ol>
            <li>Combine the files with <Link href="/pdf/merge-pdf">Merge PDF</Link>.</li>
            <li>Remove pages you do not need and put the rest in their final order.</li>
            <li>Add the page numbers.</li>
            <li>
              Add bookmarks for navigation, with the{" "}
              <Link href="/pdf/pdf-bookmarks">PDF Bookmarks Editor</Link>.
            </li>
          </ol>

          <h2>Add page numbers step by step</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-add-page-numbers">Add Page Numbers to PDF</Link> and add the
              file.
            </li>
            <li>Choose the position — a corner, or the centre of the top or bottom edge.</li>
            <li>Choose the format, such as a plain number or &ldquo;Page 1 of 10&rdquo;.</li>
            <li>Set the first number, and choose whether to skip the cover page.</li>
            <li>Press Add page numbers, check the preview, then download.</li>
          </ol>
          <p>
            The numbers are written as real text, so they stay sharp when zoomed, can be searched,
            and add only a few kilobytes. Nothing else on the page is changed.
          </p>

          <h2>Where to put them</h2>
          <ul>
            <li>
              <strong>Bottom centre</strong> is the safest choice for most documents. It suits
              single-sided and double-sided printing equally, because the number is in the same
              place whichever way the sheet is turned.
            </li>
            <li>
              <strong>Bottom right</strong> is common for single-sided reports read on screen.
            </li>
            <li>
              <strong>Top corners</strong> suit documents people flip through to find a page, such as
              reference manuals.
            </li>
          </ul>
          <p>
            Look at a page with content near the edge before choosing. The number is drawn on top of
            the page, so if a document already has a footer, put the number somewhere else or move it
            further from the edge.
          </p>

          <h2>Which format?</h2>
          <p>
            A plain number is enough for most documents. &ldquo;Page 1 of 10&rdquo; is better for
            anything that will be printed and handled as loose sheets — contracts, forms, exam papers
            — because a reader can tell at a glance whether a page is missing.
          </p>

          <h2>Covers and front matter</h2>
          <p>
            A cover page is normally left unnumbered. Choose the option to skip the first page, and
            numbering starts on page 2 with whatever first number you set — usually 1, so the first
            page after the cover is page 1.
          </p>
          <p>
            For longer front matter, such as a title page, a contents page and a summary, number only
            the range of pages that make up the main text. The &ldquo;of N&rdquo; total then counts
            only the numbered pages, so it agrees with what the reader sees.
          </p>

          <h2>Continuing from another document</h2>
          <p>
            When a document is sent in parts — volume 1 and volume 2, or an appendix sent separately
            — set the first number of the second part to carry on from the first. If part one ends on
            page 48, start part two at 49.
          </p>

          <h2>Rotated and scanned pages</h2>
          <p>
            Landscape pages and scans are often stored upright with an instruction to rotate them on
            screen. The tool reads each page&apos;s rotation, so a number placed at the bottom centre
            appears at the bottom centre of the page as you see it, reading the right way up. On
            scans with dark edges, move the number further in or change its colour so it stays
            readable.
          </p>

          <h2>More than a number</h2>
          <p>
            When you want wording around the number — a document title, a reference, a date — use{" "}
            <Link href="/pdf/pdf-header-footer">Add Header and Footer to PDF</Link> instead. Type the
            text you want and include {"{page}"} and {"{total}"} where the numbers should go, for
            example &ldquo;Annual report — page {"{page}"} of {"{total}"}&rdquo;. Use one tool or the
            other on a given document, not both, or you will end up with two numbers on each page.
          </p>

          <h2>Page numbers and the reader&apos;s page counter</h2>
          <p>
            A PDF reader counts pages from the first page of the file, whatever is printed on them.
            If your document has an unnumbered cover, the page printed &ldquo;1&rdquo; is page 2 in
            the reader&apos;s counter. That is normal, but worth remembering when you tell someone to
            go to a page — or when you type page ranges into other PDF tools, which use the
            reader&apos;s count.
          </p>
        </>
      );
    },
  },
];
