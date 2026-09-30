import type { ComponentType } from "react";
import Link from "next/link";

import type { CategoryId } from "@/types/tool";

/**
 * Long-form copy for each category page, shown under the tool list: which tool
 * fits which job, and the limits worth knowing before you start. Kept out of
 * categories.ts because that file is imported by client components.
 */
export interface CategoryGuide {
  title: string;
  Body: ComponentType;
}

export const CATEGORY_GUIDES: Record<CategoryId, CategoryGuide> = {
  pdf: {
    title: "Choosing the right PDF tool",
    Body: function Body() {
      return (
        <>
          <p>
            The tools above fall into a few groups. Knowing which group a job belongs to tells you
            what to expect from the result — in particular, whether the text in your document stays
            selectable.
          </p>

          <h3>Reorganising pages</h3>
          <p>
            <Link href="/pdf/merge-pdf">Merge PDF</Link>, <Link href="/pdf/split-pdf">Split PDF</Link>,{" "}
            <Link href="/pdf/extract-pdf-pages">Extract PDF Pages</Link>,{" "}
            <Link href="/pdf/delete-pdf-pages">Delete PDF Pages</Link>,{" "}
            <Link href="/pdf/pdf-reorder-pages">Rearrange PDF Pages</Link> and{" "}
            <Link href="/pdf/rotate-pdf">Rotate PDF</Link> all work by copying pages from one
            document to another. Nothing is re-drawn or re-compressed, so text stays selectable and
            images keep their quality. These are the safe tools: you cannot lose quality with them.
          </p>

          <h3>Getting content out</h3>
          <p>
            <Link href="/pdf/pdf-to-word">PDF to Word</Link> and{" "}
            <Link href="/pdf/pdf-to-text">PDF to Text</Link> extract the words in reading order.{" "}
            <Link href="/pdf/pdf-to-excel">PDF to Excel</Link> rebuilds tables from the positions of
            the text, and the <Link href="/pdf/pdf-table-to-excel">PDF Table Extractor</Link> joins
            a table that runs over many pages into one sheet.{" "}
            <Link href="/pdf/pdf-to-jpg">PDF to JPG</Link> and{" "}
            <Link href="/pdf/pdf-to-png">PDF to PNG</Link> save each page as a picture, and{" "}
            <Link href="/pdf/pdf-extract-images">Extract Images From PDF</Link> pulls out the
            pictures embedded in it. All of the text-based tools need a PDF that contains real text.
            A scan is a photograph of a page, so there is nothing to extract until it has been
            through <Link href="/image/image-to-text">Image to Text (OCR)</Link>.
          </p>

          <h3>Tools that turn pages into pictures</h3>
          <p>
            <Link href="/pdf/compress-pdf">Compress PDF</Link>,{" "}
            <Link href="/pdf/pdf-grayscale">Convert PDF to Grayscale</Link>,{" "}
            <Link href="/pdf/pdf-invert-colors">Invert PDF Colours</Link> and{" "}
            <Link href="/pdf/pdf-redact">Redact PDF</Link> re-draw the pages they change as images.
            That is how compression shrinks a scan and how redaction makes sure the hidden words are
            really gone. The trade-off is the same in each case: text on those pages can no longer
            be selected or searched. Keep your original file, and use these tools on the copy you
            send.
          </p>

          <h3>Preparing a document for print</h3>
          <p>
            The <Link href="/pdf/pdf-resize-page">PDF Page Size Converter</Link> scales pages between
            A4, Letter and other sizes. <Link href="/pdf/pdf-n-up">Multiple PDF Pages Per Sheet</Link>{" "}
            puts up to 16 pages on one sheet to save paper, and the{" "}
            <Link href="/pdf/pdf-booklet">PDF Booklet Maker</Link> arranges pages so a folded stack
            reads in order. <Link href="/pdf/pdf-crop-margins">Crop PDF Margins</Link> trims white
            borders, which also makes papers easier to read on a small screen.
          </p>

          <h3>Finishing and sending</h3>
          <p>
            Add <Link href="/pdf/pdf-add-page-numbers">page numbers</Link>, a{" "}
            <Link href="/pdf/pdf-header-footer">header or footer</Link>, a{" "}
            <Link href="/pdf/pdf-watermark">watermark</Link> or{" "}
            <Link href="/pdf/pdf-bookmarks">bookmarks</Link>; clear the author and title with the{" "}
            <Link href="/pdf/pdf-metadata-editor">PDF Metadata Editor</Link>; lock a filled-in form
            with <Link href="/pdf/pdf-flatten-form">Flatten PDF Form</Link>; and add a drawn
            signature with <Link href="/pdf/pdf-signature">Sign PDF</Link>.{" "}
            <Link href="/pdf/pdf-compare">Compare Two PDFs</Link> shows which lines of text changed
            between two versions.
          </p>

          <h3>Limits worth knowing</h3>
          <ul>
            <li>
              A password-protected PDF has to be unlocked, in the program that protected it, before
              any of these tools can read it.
            </li>
            <li>
              Everything happens in your device&apos;s memory, so there is no upload limit, but a
              very large scanned document can be slow on an older phone.
            </li>
            <li>
              A watermark is a label, not a lock, and a drawn signature is not a certificate-based
              digital signature. Each tool page says plainly what it does and does not do.
            </li>
          </ul>
        </>
      );
    },
  },

  image: {
    title: "Choosing the right image tool",
    Body: function Body() {
      return (
        <>
          <p>
            Most image jobs come down to one of four things: making a file smaller, changing its
            format, changing its shape, or removing something from it before you share it.
          </p>

          <h3>Making an image smaller</h3>
          <p>
            Start with size in pixels, then quality. <Link href="/image/resize-image">Resize Image</Link>{" "}
            saves the most, because a photo shown 1,200 pixels wide does not need to be 4,000 pixels
            wide. <Link href="/image/compress-image">Compress Image</Link> then lowers the quality
            with a live preview so you can stop before the difference shows. For websites,
            converting with <Link href="/image/png-to-webp">PNG to WebP</Link>,{" "}
            <Link href="/image/jpg-to-webp">JPG to WebP</Link> or{" "}
            <Link href="/image/jpg-to-avif">JPG to AVIF</Link> gives smaller files again at the same
            visible quality.
          </p>

          <h3>Changing format</h3>
          <p>As a rule of thumb:</p>
          <ul>
            <li>
              <strong>JPG</strong> for photographs that must open anywhere.
            </li>
            <li>
              <strong>PNG</strong> for screenshots, logos and anything with sharp edges or a
              transparent background.
            </li>
            <li>
              <strong>WebP</strong> for the web, where it does both jobs in a smaller file.
            </li>
          </ul>
          <p>
            The <Link href="/image/image-converter">Image Converter</Link> handles JPG, PNG and WebP
            in one batch. For formats that some programs refuse, use{" "}
            <Link href="/image/heic-to-jpg">HEIC to JPG</Link> for iPhone photos,{" "}
            <Link href="/image/webp-to-jpg">WebP to JPG</Link>,{" "}
            <Link href="/image/webp-to-png">WebP to PNG</Link> or{" "}
            <Link href="/image/avif-to-jpg">AVIF to JPG</Link>.{" "}
            <Link href="/image/svg-to-png">SVG to PNG</Link> turns a vector drawing into a picture
            at whatever size you choose. Converting a JPG to PNG does not improve it: the detail the
            JPG discarded is gone, and the file only gets larger.
          </p>

          <h3>Changing shape and size for a purpose</h3>
          <p>
            <Link href="/image/crop-image">Crop Image</Link> and{" "}
            <Link href="/image/rotate-image">Rotate Image</Link> cover the basics. For a specific
            destination there is the{" "}
            <Link href="/image/instagram-image-resizer">Instagram Image Resizer</Link>, the{" "}
            <Link href="/image/passport-photo-maker">Passport Photo Maker</Link>,{" "}
            <Link href="/image/circle-crop-image">Circle Crop Image</Link> for profile pictures and
            the <Link href="/image/favicon-generator">Favicon Generator</Link> for website icons. If
            a printer has asked for 300 DPI, <Link href="/image/image-dpi-changer">Change Image DPI</Link>{" "}
            explains what that instruction really means and sets it.
          </p>

          <h3>Before you share a photo</h3>
          <p>
            The <Link href="/image/exif-remover">EXIF Viewer and Remover</Link> shows the location,
            date and device details hidden in a photo and strips them without re-compressing it.{" "}
            <Link href="/image/blur-faces-in-photo">Blur Faces in a Photo</Link> destroys the detail
            in the areas you mark rather than covering it, and{" "}
            <Link href="/image/image-watermark">Add Watermark to Image</Link> stamps your name
            across a picture.
          </p>

          <h3>Reading and checking images</h3>
          <p>
            <Link href="/image/image-to-text">Image to Text (OCR)</Link> reads the words out of a
            screenshot or scan. The <Link href="/image/image-color-palette">Color Palette Extractor</Link>{" "}
            lists the dominant colours in a picture, and the{" "}
            <Link href="/image/color-blindness-simulator">Colour Blindness Simulator</Link> shows how
            a design looks to people with the main types of colour vision deficiency.
          </p>

          <h3>Limits worth knowing</h3>
          <ul>
            <li>
              Lossy compression cannot be undone. Keep the original and make each smaller copy from
              it.
            </li>
            <li>
              Enlarging an image cannot add detail that was never captured; beyond about 150% it
              starts to look soft.
            </li>
            <li>
              HEIC conversion and OCR each download a decoder or language file the first time you
              use them. Your images are still processed on your device.
            </li>
            <li>
              The <Link href="/image/youtube-thumbnail-downloader">YouTube Thumbnail Grabber</Link>{" "}
              is the one tool here that needs the network: it fetches the thumbnail from
              YouTube&apos;s image server.
            </li>
          </ul>
        </>
      );
    },
  },

  calculators: {
    title: "What these calculators cover",
    Body: function Body() {
      return (
        <>
          <p>
            The calculators here explain how each result was reached — most show the formula and a
            worked example — so you can follow the arithmetic instead of taking a number on trust.
            They group into money, study and everyday sums.
          </p>

          <h3>Money</h3>
          <p>
            For borrowing, the <Link href="/calculators/emi-calculator">EMI Calculator</Link> gives
            the monthly instalment and a month-by-month schedule, the{" "}
            <Link href="/calculators/loan-calculator">Loan Calculator</Link> compares weekly,
            fortnightly and monthly repayments, and the{" "}
            <Link href="/calculators/mortgage-calculator">Mortgage Calculator</Link> adds property
            tax and insurance to the monthly figure. The{" "}
            <Link href="/calculators/compound-interest-calculator">Compound Interest Calculator</Link>{" "}
            projects savings with regular contributions.
          </p>
          <p>
            For pay, the <Link href="/calculators/salary-calculator">Salary Calculator</Link>{" "}
            converts between hourly, weekly, monthly and yearly figures before tax, and the{" "}
            <Link href="/calculators/take-home-pay-calculator">Take-Home Pay Calculator</Link>{" "}
            estimates pay after tax for the UK, Canada, Australia and India, listing every
            deduction. For prices, the{" "}
            <Link href="/calculators/discount-calculator">Discount Calculator</Link> handles stacked
            and reverse discounts and the <Link href="/calculators/tax-calculator">Tax Calculator</Link>{" "}
            adds or removes sales tax, VAT or GST. The{" "}
            <Link href="/calculators/subscription-cost-tracker">Subscription Cost Tracker</Link> and{" "}
            <Link href="/calculators/ev-charging-cost-calculator">EV Charging Cost Calculator</Link>{" "}
            turn scattered charges into a figure you can compare.
          </p>

          <h3>Study</h3>
          <p>
            The <Link href="/calculators/percentage-calculator">Percentage Calculator</Link> answers
            the four common percentage questions. The{" "}
            <Link href="/calculators/grade-calculator">Grade Calculator</Link> turns marks into a
            percentage and a letter grade and works out what you need on a final exam. The{" "}
            <Link href="/calculators/gpa-calculator">GPA Calculator</Link> and{" "}
            <Link href="/calculators/cgpa-calculator">CGPA Calculator</Link> weight grades by
            credits, and the{" "}
            <Link href="/calculators/attendance-calculator">Attendance Calculator</Link> tells you
            how many classes you can miss, or must attend, to stay above a requirement.
          </p>

          <h3>Health and everyday sums</h3>
          <p>
            The <Link href="/calculators/bmi-calculator">BMI Calculator</Link> gives body mass index
            with the healthy weight range for your height. The{" "}
            <Link href="/calculators/age-calculator">Age Calculator</Link> counts real calendar days,
            including leap years, and the{" "}
            <Link href="/calculators/pet-age-calculator">Pet Age Calculator</Link> converts a
            dog&apos;s or cat&apos;s age to human years. The{" "}
            <Link href="/calculators/paint-coverage-calculator">Paint and Wallpaper Calculator</Link>{" "}
            works out how much paint or wallpaper a room needs, and the{" "}
            <Link href="/calculators/scientific-calculator">Scientific Calculator</Link> handles
            trigonometry, logarithms and powers with a history of what you entered.
          </p>

          <h3>How to read the results</h3>
          <ul>
            <li>
              <strong>Loan and mortgage figures are estimates, not quotes.</strong> Lenders add fees
              and insurance and use their own rounding, so confirm the numbers with the lender
              before committing. Nothing here is financial advice.
            </li>
            <li>
              <strong>Tax rules change every year.</strong> The take-home pay calculator states the
              tax year it uses for each country. It is a guide to what to expect, not a substitute
              for a payslip or a tax adviser.
            </li>
            <li>
              <strong>Grade boundaries and GPA scales belong to your institution.</strong> The
              percentage is the reliable figure; the letter depends on whose table you use.
            </li>
            <li>
              <strong>BMI is a screening measure, not a diagnosis.</strong> Speak to a healthcare
              professional about your own situation.
            </li>
          </ul>
          <p>
            All of these run in your browser. The figures you type — salaries, loan amounts, weight
            — are not sent anywhere.
          </p>
        </>
      );
    },
  },

  converters: {
    title: "How these converters work, and where conversions go wrong",
    Body: function Body() {
      return (
        <>
          <p>
            Unit conversion looks like simple multiplication, and most of the time it is. The
            mistakes come from units that share a name but not a size, and from quantities that
            cannot be converted exactly at all. The converters above are built to make those cases
            visible.
          </p>

          <h3>Exact by definition</h3>
          <p>
            The everyday imperial units are not separate measurements. Since an international
            agreement in 1959, the inch has been defined as exactly 25.4 millimetres and the pound
            as exactly 0.45359237 kilograms, so the{" "}
            <Link href="/converters/length-converter">Length Converter</Link>,{" "}
            <Link href="/converters/weight-converter">Weight Converter</Link>,{" "}
            <Link href="/converters/area-converter">Area Converter</Link> and{" "}
            <Link href="/converters/speed-converter">Speed Converter</Link> give exact answers, not
            approximations. The unit converters take your value to a single base unit and back out
            again, work at full precision, and round only what is displayed — so converting a number
            there and back returns what you started with.
          </p>

          <h3>Same name, different size</h3>
          <ul>
            <li>
              <strong>Gallons, pints and cups.</strong> A US gallon is 3.785 litres and an imperial
              gallon is 4.546 — about 20% more. The{" "}
              <Link href="/converters/volume-converter">Volume Converter</Link> lists US and imperial
              units separately so a recipe or a fuel figure is not converted with the wrong one.
            </li>
            <li>
              <strong>Tons.</strong> A metric tonne is 1,000 kg, a US short ton is 2,000 lb and a UK
              long ton is 2,240 lb. All three appear in the weight converter under their own names.
            </li>
            <li>
              <strong>Gigabytes.</strong> Drive makers count in steps of 1,000 and operating systems
              often count in steps of 1,024, which is why a 1 TB drive shows as 931 GB. The{" "}
              <Link href="/converters/data-storage-converter">Data Storage Converter</Link> keeps the
              decimal and binary units apart.
            </li>
          </ul>

          <h3>Conversions that need more than a factor</h3>
          <p>
            Temperature scales have different zero points as well as different step sizes, so the{" "}
            <Link href="/converters/temperature-converter">Temperature Converter</Link> shifts as
            well as scales. Months and years have no fixed length, so the{" "}
            <Link href="/converters/time-converter">Time Converter</Link> uses the calendar average —
            365.2425 days to a year and about 30.44 to a month — and says so. For the gap between
            two real dates, use the <Link href="/calculators/age-calculator">Age Calculator</Link>{" "}
            instead.
          </p>

          <h3>Estimates and reference data</h3>
          <p>Four tools here go beyond fixed factors, and each is clear about how far to trust it:</p>
          <ul>
            <li>
              The <Link href="/converters/currency-converter">Currency Converter</Link> uses the
              European Central Bank&apos;s daily reference rates and shows the date of the rate.
              These are mid-market rates; a bank or card provider adds its own margin and fees. It
              is the one tool in this group that needs the network, and only the currency codes are
              looked up — the amount you type stays in your browser.
            </li>
            <li>
              The <Link href="/converters/shoe-size-converter">Shoe Size Converter</Link> uses the
              relationships the US, UK, EU and Japanese systems are built on. Individual brands can
              differ by up to a full size, so compare your foot length with the maker&apos;s chart.
            </li>
            <li>
              The <Link href="/converters/engine-cc-to-hp">Engine CC to HP Converter</Link> converts
              displacement exactly, but horsepower cannot be calculated from engine size — it gives
              a realistic range for each type of engine instead.
            </li>
            <li>
              The <Link href="/converters/timezone-meeting-planner">Time Zone Meeting Planner</Link>{" "}
              works out local times for the date you choose, so daylight saving changes and
              half-hour time zones are handled correctly.
            </li>
          </ul>
        </>
      );
    },
  },

  generators: {
    title: "What you can make here",
    Body: function Body() {
      return (
        <>
          <p>
            A generator creates something new from a few settings: a code, a random value, a
            document or a block of markup. Everything above is produced in your browser, so the
            details you type — a Wi-Fi password, a client&apos;s address, your employment history —
            are not sent to a server.
          </p>

          <h3>Codes to print or scan</h3>
          <p>
            The <Link href="/generators/qr-code-generator">QR Code Generator</Link> makes codes for
            links, text, email, phone numbers, SMS and Wi-Fi, and the{" "}
            <Link href="/generators/qr-code-wifi-vcard">Wi-Fi and vCard QR Code Generator</Link> adds
            contact cards, menus and calendar events with a printable card layout. These are static
            codes: the content is stored in the pattern itself, so there is no redirect, no account
            and no expiry. The other side of that is that a printed code cannot be edited — a new
            address or password needs a new code.
          </p>
          <p>
            The <Link href="/generators/barcode-generator">Barcode Generator</Link> produces UPC-A,
            EAN-13, EAN-8, ITF-14, Code 128, Code 39 and Codabar, and calculates the check digit for
            you. For products sold in shops, the number itself must be allocated to you by GS1; for
            stock control and asset labels, any value will do. The{" "}
            <Link href="/generators/utm-builder">UTM Link Builder</Link> tags a link so your
            analytics can tell which poster, email or post sent each visitor.
          </p>

          <h3>Random values you can trust</h3>
          <p>
            The <Link href="/generators/password-generator">Password Generator</Link>,{" "}
            <Link href="/generators/random-number-generator">Random Number Generator</Link> and{" "}
            <Link href="/generators/uuid-generator">UUID Generator</Link> all draw from your
            browser&apos;s cryptographic random number generator rather than the ordinary one. The
            password and number generators also use a method that keeps every outcome equally
            likely, which matters for a password and matters for a raffle too. The UUID generator
            offers random version 4 identifiers and time-ordered version 7, which suits database
            keys.
          </p>

          <h3>Documents</h3>
          <p>
            The <Link href="/generators/invoice-generator">Invoice Generator</Link> adds up line
            items, tax and discounts and exports a PDF with real, selectable text. The{" "}
            <Link href="/generators/resume-generator">Resume Generator</Link> produces a plain
            single-column CV on purpose, because that is the layout applicant tracking systems read
            reliably. The <Link href="/generators/lorem-ipsum-generator">Lorem Ipsum Generator</Link>{" "}
            supplies placeholder text for mockups, in classic Latin or plain English.
          </p>

          <h3>Files for your website</h3>
          <p>
            The <Link href="/generators/robots-txt-generator">Robots.txt Generator and Tester</Link>{" "}
            builds the file and tests which addresses each crawler may fetch. The{" "}
            <Link href="/generators/schema-generator">Schema Markup Generator</Link> writes FAQ and
            Product structured data and checks it against Google&apos;s published rules.
          </p>

          <h3>Limits worth knowing</h3>
          <ul>
            <li>
              A robots.txt file is a request that reputable crawlers honour, not a lock, and it
              controls crawling rather than whether a page appears in search.
            </li>
            <li>
              Structured data must describe what visitors can actually see on the page. Marking up
              ratings or answers that are not there is against Google&apos;s guidelines.
            </li>
            <li>
              Anyone who scans a printed Wi-Fi code can read the password, so display it only where
              you would share the password itself.
            </li>
            <li>
              A generated password is only as safe as where you keep it. Put it straight into a
              password manager.
            </li>
          </ul>
        </>
      );
    },
  },

  text: {
    title: "Which text tool to reach for",
    Body: function Body() {
      return (
        <>
          <p>
            These tools all take text you paste in and hand it back counted, cleaned or reshaped.
            The text is processed by the page itself and is never sent over the network, which
            matters when it is a draft, a client brief or a CV.
          </p>

          <h3>Counting</h3>
          <p>
            The <Link href="/text/word-counter">Word Counter</Link> gives live counts of words,
            characters, sentences and paragraphs, with reading time and your most frequent words. It
            counts words the way a word processor does, so it agrees with Microsoft Word on ordinary
            prose. The <Link href="/text/character-counter">Character Counter</Link> checks a text
            against the limits that matter in practice: a post on X, a search result description, an
            SMS.
          </p>
          <p>
            Counting characters is less obvious than it sounds. Platforms disagree about what a
            character is: an emoji can count as one, two or many, and a single curly quote can cut
            the length of a text message from 160 characters to 70. The character counter shows the
            different counts side by side so you can see which one a platform is using.
          </p>

          <h3>Cleaning up</h3>
          <p>
            Text copied from a PDF, an email or a web page arrives with problems you cannot see: a
            line break after every line, non-breaking spaces, invisible zero-width characters and
            curly quotes that break code and spreadsheets.{" "}
            <Link href="/text/text-cleaner">Text Cleaner</Link> fixes each of those with its own
            switch, so you change only what you mean to.
          </p>
          <p>
            For lists, <Link href="/text/remove-duplicate-lines">Remove Duplicate Lines</Link> keeps
            the first copy of each line in its original position and tells you how many it removed,
            and <Link href="/text/sort-lines">Sort Lines</Link> orders them alphabetically,
            numerically, by length or at random. Turn on natural sorting when the lines contain
            numbers, so that item2 comes before item10.
          </p>

          <h3>Reshaping</h3>
          <p>
            The <Link href="/text/case-converter">Case Converter</Link> switches between twelve
            letter cases, from sentence case and proper title case to camelCase and snake_case for
            code. The <Link href="/text/text-reverser">Text Reverser</Link> reverses characters,
            words or lines, and handles emoji and accented letters without breaking them.
          </p>

          <h3>Writing for a platform</h3>
          <p>
            The <Link href="/text/linkedin-formatter">LinkedIn Post Formatter</Link> adds bold,
            italic and bullets to a post. LinkedIn has no formatting of its own, so the styling is
            made from special Unicode letters — which screen readers handle poorly, so use it for a
            few words rather than whole paragraphs. The{" "}
            <Link href="/text/resume-ats-checker">Resume ATS Checker</Link> compares your CV with a
            job advert and lists the missing keywords and the formatting problems an applicant
            tracking system is likely to trip over. There is no universal ATS score, so treat it as
            a checklist rather than a prediction.
          </p>

          <h3>From speech to text</h3>
          <p>
            The <Link href="/text/voice-to-text">Voice to Text Converter</Link> transcribes voice
            notes and short recordings of up to ten minutes. The speech recognition model is
            downloaded once and then runs on your own device, so the audio is not uploaded. It is
            accurate on clear speech and can mishear names and specialist terms, so read the
            transcript before relying on it.
          </p>
        </>
      );
    },
  },

  developer: {
    title: "What runs in your browser, and what does not",
    Body: function Body() {
      return (
        <>
          <p>
            Developers paste sensitive things into tools like these: API responses, tokens, customer
            records. So the first thing to know about each tool is where the data goes. Twelve of
            the tools above run entirely in the page. Three have to contact another server, and they
            say so.
          </p>

          <h3>Formatting and validating</h3>
          <p>
            The <Link href="/developer/json-formatter">JSON Formatter</Link> pretty-prints or
            minifies and reports a syntax error with its exact line and column, and the{" "}
            <Link href="/developer/json-validator">JSON Validator</Link> explains the error in plain
            words with a likely cause. <Link href="/developer/json-to-csv">JSON to CSV</Link>{" "}
            flattens nested objects into dotted column names and builds the column list from every
            record, so uneven data does not lose fields. The{" "}
            <Link href="/developer/html-formatter">HTML Formatter</Link> and{" "}
            <Link href="/developer/css-formatter">CSS Formatter</Link> indent or minify markup and
            stylesheets.
          </p>

          <h3>Encoding and decoding</h3>
          <p>
            The <Link href="/developer/base64-encoder">Base64 Encoder</Link> and{" "}
            <Link href="/developer/base64-decoder">Base64 Decoder</Link> handle text and files,
            including URL-safe output and data URIs. Base64 is an encoding, not encryption: anyone
            can reverse it, so it hides nothing. The{" "}
            <Link href="/developer/url-encoder">URL Encoder</Link> and{" "}
            <Link href="/developer/url-decoder">URL Decoder</Link> percent-encode a whole address or
            a single parameter value — a distinction that matters, because the two need different
            characters escaped. The{" "}
            <Link href="/developer/timestamp-converter">Timestamp Converter</Link> shows a Unix
            timestamp in UTC and your local time together, since the gap between them is where date
            bugs come from.
          </p>

          <h3>Verifying</h3>
          <p>
            The <Link href="/developer/checksum-verifier">File Checksum Verifier</Link> calculates
            MD5, SHA-1, SHA-256 or SHA-512 for a download and compares it with the published hash.
            It reads the file in chunks on your device, so even a disk image is never uploaded.
            Prefer SHA-256 where the publisher offers it; MD5 and SHA-1 catch accidental corruption
            but not deliberate tampering. The{" "}
            <Link href="/developer/password-strength-checker">Password Strength Checker</Link>{" "}
            estimates how quickly a password could be guessed, on your device.
          </p>

          <h3>The three network checkers</h3>
          <p>
            A web page is not allowed to read another site&apos;s certificate, mail records or HTML,
            so these three are carried out by this site&apos;s server:
          </p>
          <ul>
            <li>
              The <Link href="/developer/ssl-expiry-checker">SSL Certificate Checker</Link> connects
              to the domain you enter and reads its certificate and chain.
            </li>
            <li>
              The <Link href="/developer/email-syntax-checker">Email Address Validator</Link> checks
              the format in your browser; its mail server lookup sends only the domain name, never
              the full address.
            </li>
            <li>
              The <Link href="/developer/og-preview">Open Graph Preview</Link> fetches the head of
              the page you enter to read its sharing tags.
            </li>
          </ul>
          <p>
            The certificate checker and the preview fetcher accept only public internet addresses,
            and each page states exactly what is sent. One limit applies to the email validator in
            particular: no tool can prove a mailbox exists without sending it a message, so the
            check stops at format and domain.
          </p>
        </>
      );
    },
  },
};
