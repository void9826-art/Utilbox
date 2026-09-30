import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-09-27";
const UPDATED = "2026-09-30";

export const imageGuides: Guide[] = [
  {
    slug: "remove-location-data-from-photos",
    topic: "Images",
    title: "How to remove location and camera data from photos before sharing",
    seoTitle: "How to Remove Location Data From Photos",
    description:
      "Photos can carry GPS coordinates, dates and device details. See what yours reveal and strip that metadata without re-compressing the image.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["exif-remover", "heic-to-jpg", "blur-faces-in-photo", "crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            A photo is more than its pixels. Phones and cameras write hidden details into every
            picture, and when you send the original file those details travel with it. Most of the
            time that is harmless. Sometimes — a photo taken at home, sent to a stranger on a
            marketplace — it is not.
          </p>

          <h2>What a photo can reveal</h2>
          <p>This hidden information is called EXIF metadata. Depending on the device, it can include:</p>
          <ul>
            <li>
              <strong>GPS coordinates</strong>, if location services were on — often precise enough
              to identify a house;
            </li>
            <li>the date and time the photo was taken;</li>
            <li>the phone or camera make and model, and sometimes its serial number;</li>
            <li>lens and exposure settings, and the names of editing apps used afterwards.</li>
          </ul>
          <p>
            EXIF is the block the camera writes. Editing apps add two more, called XMP and IPTC,
            which can hold the software used, an author name, captions and an edit history. One
            detail surprises people: a JPEG&apos;s EXIF block often contains a small preview
            thumbnail, and some editors do not update it. A photo cropped to hide something can
            still carry a thumbnail of the uncropped original.
          </p>

          <h2>See it for yourself first</h2>
          <p>
            Before cleaning anything, look at what your own photos hold. On an iPhone, open a photo
            and swipe up: if it was tagged, you get a map. Google Photos on Android does the same.
            On Windows, right-click the file and choose Properties, then Details. On a Mac, open the
            photo in Preview and choose Show Inspector from the Tools menu. If a pin appears on a
            map over your own street, you have seen the problem exactly as a stranger would.
          </p>

          <h2>Doesn&apos;t social media remove it?</h2>
          <p>
            Many large platforms strip location data from public posts. But plenty of routes pass the
            original file on untouched: email attachments, messaging apps set to send full-quality
            files, cloud share links, forums and marketplace listings. Cleaning the photo yourself
            means you do not have to rely on each service getting it right.
          </p>
          <p>
            Messaging apps are the easiest place to be caught out. A picture sent the ordinary way
            is usually re-compressed, which tends to drop the metadata. The same picture sent as a
            &ldquo;document&rdquo; or &ldquo;file&rdquo; — which people do precisely to keep the
            quality — goes out as the untouched original, location included.
          </p>

          <h2>Check and remove it step by step</h2>
          <ol>
            <li>
              Open the <Link href="/image/exif-remover">EXIF Viewer and Remover</Link> and add one or
              more JPG, PNG or WebP photos.
            </li>
            <li>
              Look at what was found. Location, device details and dates are flagged at the top, so
              you can see exactly what the photo was carrying.
            </li>
            <li>
              Leave the colour profile and rotation options on unless you have a reason not to (more
              on that below).
            </li>
            <li>Press Remove metadata and download the cleaned photos.</li>
          </ol>
          <p>
            The metadata blocks are cut out of the file while the image data is copied byte for
            byte, so there is no re-compression and no loss of quality. Each cleaned file is then
            read again to confirm what, if anything, is left. The photos never leave your device
            while this happens.
          </p>
          <p>
            Removing the EXIF block takes the embedded thumbnail with it, and extra images that some
            phones append after the main photo — depth maps, for example — are dropped from JPGs as
            well.
          </p>

          <h2>Why rotation and colour are kept</h2>
          <p>
            Phones often save a picture sideways and include one instruction telling viewers to turn
            it upright. Delete that and your photo appears on its side, so the tool writes back that
            single value — it reveals nothing about you. The colour profile only tells software how
            to display the colours correctly. You can switch both off if you want a completely bare
            file.
          </p>

          <h2>Stop recording location in the first place</h2>
          <p>If you never want photos tagged, turn it off at the source:</p>
          <ul>
            <li>
              <strong>iPhone:</strong> Settings → Privacy &amp; Security → Location Services →
              Camera, and choose Never. New photos will have no coordinates.
            </li>
            <li>
              <strong>Android:</strong> open the camera app&apos;s own settings and switch off the
              location option. Its name varies by manufacturer — location tags, save location or
              geotagging.
            </li>
            <li>
              <strong>When sharing from an iPhone:</strong> tap Options at the top of the share
              sheet and switch off Location for that one share, leaving your library untouched.
            </li>
          </ul>
          <p>
            Turning it off only affects new pictures. Everything already in your library keeps the
            data it was saved with, so older photos still need cleaning before they go to someone
            you do not know.
          </p>

          <h2>iPhone photos</h2>
          <p>
            Photos in Apple&apos;s HEIC format need converting first: run them through{" "}
            <Link href="/image/heic-to-jpg">HEIC to JPG</Link>, then clean the JPGs. See{" "}
            <Link href="/guides/how-to-open-heic-photos">how to open HEIC photos</Link> for more on
            the format.
          </p>

          <h2>What metadata removal cannot hide</h2>
          <p>
            Metadata is only the hidden part. The picture itself can give away just as much: a street
            sign through the window, a house number, a school logo, a face in the background. Crop
            those out with <Link href="/image/crop-image">Crop Image</Link>, or use{" "}
            <Link href="/image/blur-faces-in-photo">Blur Faces in a Photo</Link> for people who did
            not ask to be in it.
          </p>
          <p>
            Two more limits are worth knowing. Videos carry location and device details too, and
            this tool handles still images only — check your phone&apos;s share options before
            sending a clip. And a file name such as a date and time stamp, or the name of the place
            you typed when saving it, travels with the photo whatever you remove from inside it.
          </p>

          <h2>When to bother</h2>
          <p>
            You do not need to clean every holiday picture you send to your family. It is worth the
            thirty seconds when the photo was taken at home, at a child&apos;s school or at your
            workplace, and is going somewhere public or to someone you have not met: a marketplace
            listing, a forum post, a dating profile, a review, or an email to a stranger.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-compress-images",
    topic: "Images",
    title: "How to compress images without visible quality loss",
    seoTitle: "How to Compress Images Without Losing Quality",
    description:
      "Make photos much smaller without a visible difference: which quality setting to use, when to resize instead, and which format fits which image.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["compress-image", "resize-image", "png-to-webp", "image-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            A photo straight from a phone is often 3–5 MB. That is too big for many upload forms,
            slow on a website and wasteful in an email. The good news is that most of that size is
            detail your eyes cannot see at normal viewing sizes.
          </p>

          <h2>How lossy compression works</h2>
          <p>
            JPEG and WebP are lossy formats: when they save an image they throw away the detail human
            vision is least sensitive to, mostly subtle variation in colour. That is why a photo can
            lose 70% of its file size and look essentially the same.
          </p>
          <p>
            PNG is the opposite. It is lossless: every pixel is stored exactly, which is why it is
            the right choice for screenshots and logos and why its files are large. There is no
            quality setting to turn down on a PNG, which matters later in this guide.
          </p>

          <h2>Compress an image step by step</h2>
          <ol>
            <li>
              Add one or more images to <Link href="/image/compress-image">Compress Image</Link>.
            </li>
            <li>Drag the quality slider — the estimated size updates as you move it.</li>
            <li>Compare the original and compressed previews side by side, zoomed in.</li>
            <li>Download each image, or all of them at once as a ZIP.</li>
          </ol>
          <p>
            A quality of <strong>75–85</strong> is the sweet spot for photographs. Below about 60,
            blocky artefacts start to appear around sharp edges and in smooth areas like sky.
          </p>

          <h2>Resize first — it saves the most</h2>
          <p>
            Pixel dimensions matter more than quality. A 4,000-pixel-wide photo shown 1,200 pixels
            wide on a website carries more than ten times the data it needs. If you know where the
            image will be used, set the width in <Link href="/image/resize-image">Resize Image</Link>{" "}
            (or in the compressor&apos;s resize option) before worrying about quality.
          </p>
          <p>Some sensible widths to aim for:</p>
          <ul>
            <li>
              <strong>A full-width picture on a web page:</strong> 1,200–1,600 pixels.
            </li>
            <li>
              <strong>A thumbnail or product tile:</strong> rarely more than 400 pixels.
            </li>
            <li>
              <strong>A photo in an email or a document:</strong> about 1,200–1,600 pixels is plenty
              for reading on a screen.
            </li>
            <li>
              <strong>A print:</strong> work from the paper size instead — about 300 pixels for
              every inch, so 1,800 × 1,200 pixels for a 6 × 4 inch print.
            </li>
          </ul>

          <h2>A worked example</h2>
          <p>
            Take a 12-megapixel phone photo: 4,000 × 3,000 pixels and about 4 MB. You want to put it
            on a web page where it will be shown 1,600 pixels wide.
          </p>
          <ol>
            <li>
              <strong>Resize to 1,600 pixels wide.</strong> The height follows to 1,200. The picture
              now has 1.92 million pixels instead of 12 million — 16% of the original. File size
              scales roughly with pixel count, so most of the saving is already made.
            </li>
            <li>
              <strong>Set quality to about 80.</strong> This removes detail the eye does not notice.
              A photograph of this size typically lands at a few hundred kilobytes.
            </li>
            <li>
              <strong>Compare at full zoom.</strong> Look at hair, text on signs and the edges of
              objects against sky. If it looks the same, you are done.
            </li>
          </ol>
          <p>
            The result is usually more than ten times smaller than the original and indistinguishable
            on the page.
          </p>

          <h2>Pick the right format</h2>
          <ul>
            <li>
              <strong>Photos:</strong> JPEG or WebP. WebP is usually smaller at the same quality.
            </li>
            <li>
              <strong>Screenshots, logos, text and sharp lines:</strong> PNG, or WebP. JPEG smears
              sharp edges and often makes screenshots bigger, not smaller.
            </li>
            <li>
              <strong>PNG files that are too big:</strong> quality settings do not apply to PNG,
              because it is lossless. Resize it, or convert it with{" "}
              <Link href="/image/png-to-webp">PNG to WebP</Link>.
            </li>
            <li>
              <strong>Anything with a transparent background:</strong> PNG or WebP. JPEG has no
              transparency, so converting a cut-out logo to JPEG fills the clear areas with a solid
              colour.
            </li>
          </ul>
          <p>
            WebP is displayed by every current browser, so for a website it is the safe default.
            JPEG is still the format to choose when a file must open anywhere — an old program, a
            printer kiosk, an upload form that lists only JPG and PNG. The{" "}
            <Link href="/image/image-converter">Image Converter</Link> switches a whole batch between
            the three formats in one pass.
          </p>

          <h2>How to get under a specific limit</h2>
          <p>
            Upload forms often say something like &ldquo;maximum 200 KB&rdquo; or &ldquo;no larger
            than 2 MB&rdquo;. Work towards the number in this order:
          </p>
          <ol>
            <li>Resize to the largest dimensions the form actually needs, if it states any.</li>
            <li>Lower the quality in steps of five, watching the estimated size, until it is under the limit.</li>
            <li>
              If you reach about 60 and are still over, stop lowering quality and resize smaller
              instead. A smaller sharp image looks better than a larger blocky one.
            </li>
          </ol>

          <h2>How to spot over-compression</h2>
          <p>Zoom in to 100% and look for three things:</p>
          <ul>
            <li>
              <strong>Blocks</strong> — faint squares in smooth areas such as sky, skin or a plain
              wall.
            </li>
            <li>
              <strong>Halos</strong> — a smudgy fringe around text and other hard edges.
            </li>
            <li>
              <strong>Banding</strong> — a gradient, like a sunset, breaking into visible stripes.
            </li>
          </ul>
          <p>If you can see any of them at the size the image will be viewed, raise the quality a step.</p>

          <h2>Keep your originals</h2>
          <p>
            Lossy compression is one-way, and it adds up. Every time a JPEG is opened, edited and
            saved again, a little more detail is thrown away. Keep the original photo somewhere safe,
            make compressed copies from it for each use, and never compress a copy that has already
            been compressed.
          </p>

          <h2>How much smaller will it get?</h2>
          <p>
            Typically 50–80% for photographs at quality 80. A detailed landscape compresses less than
            a portrait against a plain background. The compressor shows the real before-and-after
            size, so you can decide with numbers rather than guesses — and the images are processed
            on your own device, not uploaded. Images up to 50 MB each are accepted; on a phone, work
            through very large ones in smaller batches.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-open-heic-photos",
    topic: "Images",
    title: "How to open and convert iPhone HEIC photos",
    seoTitle: "How to Open and Convert iPhone HEIC Photos",
    description:
      "Why iPhone photos arrive as .heic files that Windows and websites reject, how to convert them to JPG, and how to make your iPhone save JPGs instead.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["heic-to-jpg", "compress-image", "exif-remover", "image-to-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            You copy photos off an iPhone and Windows shows blank icons, or an upload form refuses
            the file. The culprit is the <strong>.heic</strong> extension.
          </p>

          <h2>What HEIC is</h2>
          <p>
            HEIC is the format iPhones use by default. It is genuinely good — a HEIC photo is roughly
            half the size of an equivalent JPEG — but it relies on a video compression standard with
            patent licensing attached, so many browsers and older programs cannot open it. Windows
            needs a paid codec extension to display HEIC files at all.
          </p>
          <p>Three similar names get used interchangeably, which does not help:</p>
          <ul>
            <li>
              <strong>HEIF</strong> (High Efficiency Image File Format) is the container — the kind
              of file.
            </li>
            <li>
              <strong>HEVC</strong>, also called H.265, is the compression used inside it. It was
              designed for video, and it is the part with the patents.
            </li>
            <li>
              <strong>HEIC</strong> is Apple&apos;s name for a HEIF file compressed with HEVC. Files
              end in .heic, or occasionally .heif.
            </li>
          </ul>

          <h2>Convert HEIC to JPG</h2>
          <ol>
            <li>
              Open <Link href="/image/heic-to-jpg">HEIC to JPG</Link> and add your .heic or .heif
              files — as many as you like.
            </li>
            <li>Choose the output quality. 90 is a good default.</li>
            <li>Press Convert and wait while each photo is decoded.</li>
            <li>Download the JPGs individually or as a ZIP.</li>
          </ol>
          <p>
            The first conversion takes a little longer because the HEIC decoder (a few megabytes) has
            to load; after that it is cached. The photos are decoded on your own device and are not
            uploaded.
          </p>

          <h2>Does converting lose quality?</h2>
          <p>
            A little, in theory, because both formats are lossy. At quality 90 the difference is not
            visible at normal viewing sizes. Do not be surprised that the JPG is larger than the HEIC
            — that is simply JPEG&apos;s older compression. If you need the files smaller, run them
            through <Link href="/image/compress-image">Compress Image</Link> afterwards.
          </p>
          <p>
            Keep the HEIC originals if you have room. They are the best version of the photo you
            will ever have, and a JPG made from a HEIC is a copy of a copy.
          </p>

          <h2>What a JPG cannot carry over</h2>
          <p>HEIC can hold things that JPEG simply has no place for:</p>
          <ul>
            <li>
              <strong>Live Photos.</strong> A Live Photo is a still image plus a short video clip
              stored alongside it. Converting gives you the still; the motion is a separate video
              file.
            </li>
            <li>
              <strong>Wide colour and HDR.</strong> iPhone photos can store a wider range of colour
              and extra highlight detail for HDR screens. A converted JPG may look slightly less
              vivid on such a screen; on an ordinary screen there is no visible difference.
            </li>
            <li>
              <strong>Depth information</strong> from Portrait mode, which lets the Photos app
              change the background blur later. A JPG keeps the blur as it looked, not the ability
              to change it.
            </li>
          </ul>
          <p>For sending a photo to someone or uploading it to a form, none of this matters.</p>

          <h2>Opening HEIC without converting</h2>
          <ul>
            <li>
              <strong>Mac:</strong> nothing to do. Preview and Photos have opened HEIC files since
              macOS High Sierra.
            </li>
            <li>
              <strong>Windows 10 and 11:</strong> the Photos app needs two add-ons from the
              Microsoft Store, HEIF Image Extensions and HEVC Video Extensions. The second one is
              the paid codec. If you only have a handful of photos, converting them is quicker.
            </li>
            <li>
              <strong>Android:</strong> recent versions open HEIC in the gallery and in Google
              Photos.
            </li>
            <li>
              <strong>Websites and upload forms:</strong> most still expect JPG or PNG, which is the
              usual reason to convert.
            </li>
          </ul>

          <h2>Let the iPhone convert for you</h2>
          <p>
            Two settings cover most everyday cases without any conversion tool. First, under{" "}
            <strong>Settings → Photos</strong>, scroll to &ldquo;Transfer to Mac or PC&rdquo; and
            choose <strong>Automatic</strong>: photos copied over a cable are then handed to the
            computer in a compatible format. Second, when you share photos by email or through many
            apps, the iPhone often converts them to JPG on the way out. HEIC files tend to escape
            when photos are copied some other way — through a cloud drive, a file manager or a
            backup — which is when you need a converter.
          </p>

          <h2>Stop your iPhone making HEIC files</h2>
          <p>
            On the iPhone, go to <strong>Settings → Camera → Formats</strong> and choose{" "}
            <strong>Most Compatible</strong>. New photos will be saved as JPGs. Photos you have
            already taken stay as HEIC, so convert those as above.
          </p>
          <p>
            There is a cost. JPGs take roughly twice the storage, which adds up over thousands of
            photos, and the same switch changes the video format too — some of the highest-quality
            video modes are only available with High Efficiency selected. If storage is tight or you
            shoot a lot of video, leaving the camera on High Efficiency and converting the few
            photos you need to share is the better trade.
          </p>

          <h2>Before you share them</h2>
          <p>
            iPhone photos often include the location where they were taken. After converting, you
            can check and strip that with the{" "}
            <Link href="/image/exif-remover">EXIF Viewer and Remover</Link> — see{" "}
            <Link href="/guides/remove-location-data-from-photos">
              how to remove location data from photos
            </Link>
            . To send several photos as one document, <Link href="/image/image-to-pdf">Image to PDF</Link>{" "}
            puts them into a single PDF.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-copy-text-from-an-image",
    topic: "Images",
    title: "How to copy text from an image or screenshot",
    seoTitle: "How to Copy Text From an Image or Screenshot",
    description:
      "Get editable text out of a screenshot, photo or scanned page with OCR — and the simple things that make the difference between clean and garbled results.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["image-to-text", "crop-image", "rotate-image", "pdf-to-png"],
    Body: function Body() {
      return (
        <>
          <p>
            Text in a screenshot, a photo of a notice or a scanned letter is just a picture of
            letters — you cannot select it. Optical character recognition (OCR) reads the shapes and
            turns them back into text you can copy and edit.
          </p>

          <h2>Copy text from an image step by step</h2>
          <ol>
            <li>
              Open <Link href="/image/image-to-text">Image to Text (OCR)</Link> and add the image.
            </li>
            <li>
              Choose the language of the text. This matters more than people expect: the engine uses
              a dictionary for that language to settle ambiguous shapes.
            </li>
            <li>
              Press Extract text. The first run downloads the language data, then it is cached.
            </li>
            <li>Check the result, then copy it or download it as a text file.</li>
          </ol>
          <p>The recognition runs on your own device, so the image is not uploaded anywhere.</p>

          <h2>How OCR reads a picture</h2>
          <p>
            It helps to know what the engine is doing, because every tip below follows from it. It
            first looks for blocks that seem to contain text, then cuts each block into lines, and
            each line into individual character shapes. Each shape is compared with a model trained
            on printed type in the language you chose, and a dictionary helps decide between
            look-alikes. Anything that makes the lines hard to find, or the shapes hard to separate,
            costs accuracy — which is why a clean, straight, close-up image matters so much.
          </p>

          <h2>How to get clean results</h2>
          <p>Accuracy depends almost entirely on the picture you give it:</p>
          <ul>
            <li>
              <strong>Use the sharpest version you have.</strong> A screenshot beats a photo of a
              screen; a flat scan beats a photo of a page.
            </li>
            <li>
              <strong>Make the letters big enough.</strong> Tiny text is the most common cause of
              gibberish. As a rule of thumb, capital letters should be at least 20–30 pixels tall.
              If the text is small on screen, zoom in before you take the screenshot — enlarging a
              small image afterwards does not bring back detail.
            </li>
            <li>
              <strong>Straighten it.</strong> Text should be horizontal — fix sideways images with{" "}
              <Link href="/image/rotate-image">Rotate Image</Link>.
            </li>
            <li>
              <strong>Crop away the clutter.</strong> Backgrounds, logos and photos confuse the
              engine. Trim to just the text with <Link href="/image/crop-image">Crop Image</Link>.
            </li>
            <li>
              <strong>Light it evenly.</strong> Shadows across a page and glare on glossy paper both
              cost accuracy.
            </li>
            <li>
              <strong>Prefer dark text on a light background.</strong> High contrast reads best.
              Pale grey text, coloured backgrounds and text laid over a photograph all reduce it.
            </li>
          </ul>
          <p>
            On clear printed text — screenshots, rendered documents, flat scans — accuracy is
            typically above 95%. Still, proofread numbers, names and anything you will rely on.
          </p>

          <h2>Photographing a page properly</h2>
          <p>When a photo is the only option, a few seconds of care make a large difference:</p>
          <ul>
            <li>Lay the page flat and hold the phone directly above it, parallel to the paper.</li>
            <li>Fill the frame with the text rather than the table around it.</li>
            <li>Stand so your own shadow does not fall across the page; daylight from a window is ideal.</li>
            <li>Tap the screen to focus on the text, hold still, and take two shots to be safe.</li>
            <li>Turn the flash off on glossy paper — it leaves a white patch where the text used to be.</li>
          </ul>

          <h2>Columns, tables and mixed layouts</h2>
          <p>
            OCR returns text line by line, so layout is where it gets confused. A two-column page
            may come out with the columns interleaved, reading straight across the gap. Crop each
            column into its own image and run them one at a time. Tables lose their grid in the
            same way: you get the words and figures, but not which cell they were in, so expect to
            rebuild the columns by hand in a spreadsheet.
          </p>

          <h2>What to proofread</h2>
          <p>Errors cluster in predictable places. Check these first:</p>
          <ul>
            <li>
              <strong>Look-alike characters:</strong> 0 and O; 1, l and I; 5 and S; and the pair
              &ldquo;rn&rdquo; read as &ldquo;m&rdquo;.
            </li>
            <li>
              <strong>Numbers</strong> — account numbers, prices, dates and phone numbers, where a
              single wrong digit matters and a dictionary cannot help.
            </li>
            <li>
              <strong>Names, email addresses and web addresses</strong>, for the same reason.
            </li>
            <li>
              <strong>Punctuation and symbols</strong> — full stops lost, commas read as full
              stops, currency signs swapped.
            </li>
          </ul>

          <h2>Tidying the extracted text</h2>
          <p>
            The result keeps the line breaks of the original image, so a paragraph arrives as a
            stack of short lines. Paste it into <Link href="/text/text-cleaner">Text Cleaner</Link>{" "}
            and switch on the option that joins broken lines: single breaks are merged into flowing
            paragraphs, and blank lines between paragraphs are kept.
          </p>

          <h2>What OCR struggles with</h2>
          <p>
            Handwriting. The engine is trained on printed type, so neat block capitals sometimes
            work and ordinary joined-up writing rarely does. Unusual decorative fonts and text set
            at an angle are also hit and miss.
          </p>

          <h2>Languages</h2>
          <p>
            Pick the language the text is actually written in, not the language of your phone or
            browser. The supported set includes English, Spanish, French, German, Italian,
            Portuguese, Dutch, Russian, Chinese, Japanese, Korean, Arabic and Hindi, and each one
            downloads its own trained model the first time you use it. For a document that mixes two
            languages, choose the one that makes up most of the text and proofread the rest.
          </p>

          <h2>When your device can already do it</h2>
          <p>
            For grabbing a line or two, check what is built in: recent iPhones and Macs let you
            select text directly in a photo, Google Lens does the same on Android, and the Windows
            11 Snipping Tool can copy text from a capture. They are the fastest route for a phone
            number or a Wi-Fi password. A dedicated OCR page is more useful when you are on a
            computer without those features, need a particular language, or want the result as a
            text file.
          </p>

          <h2>Scanned PDFs</h2>
          <p>
            A scanned PDF is a set of page images with no text inside. Convert its pages to images
            with <Link href="/pdf/pdf-to-png">PDF to PNG</Link>, then run each page through OCR. See{" "}
            <Link href="/guides/how-to-convert-pdf-to-word">how to convert a PDF to Word</Link> for
            PDFs that do contain real text.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-make-a-passport-photo-at-home",
    topic: "Images",
    title: "How to make a passport photo at home",
    seoTitle: "How to Make a Passport Photo at Home",
    description:
      "Take a passport or visa photo with your phone, crop it to the exact size at print quality, and avoid the mistakes that get applications rejected.",
    published: PUBLISHED,
    updated: UPDATED,
    tools: ["passport-photo-maker", "compress-image", "exif-remover"],
    Body: function Body() {
      return (
        <>
          <p>
            A booth or studio charges for something you can do with a phone and a plain wall. The
            crop and size are the easy part; the photograph itself is where most rejections come
            from, so start there.
          </p>

          <h2>Always check your country&apos;s rules first</h2>
          <p>
            Every country publishes its own requirements, and they change from time to time: photo
            size, background colour, how much of the frame the head must fill, whether glasses are
            allowed, and how recent the photo must be. Read the official rules from the office
            receiving your application before you start. Nothing below replaces them.
          </p>
          <p>
            To show how much they differ, here are two sets of published rules at the time of
            writing. Treat them as illustrations and confirm them on the official site:
          </p>
          <ul>
            <li>
              <strong>United States:</strong> 2 × 2 inches (51 × 51 mm), with the head measuring 1
              to 1⅜ inches from chin to the top of the head, a white or off-white background, taken
              within the last six months, and no glasses.
            </li>
            <li>
              <strong>United Kingdom:</strong> 35 mm wide by 45 mm high for printed photos, with the
              head 29–34 mm from chin to crown, a plain cream or light grey background, and taken
              within the last month.
            </li>
          </ul>
          <p>
            Same purpose, different size, different background and a different rule about how recent
            the photo must be — which is why a photo that was fine for one application can be
            refused for another.
          </p>

          <h2>Take the photo</h2>
          <ul>
            <li>
              <strong>Background:</strong> stand in front of a plain, light, even wall with no
              pattern or shadows.
            </li>
            <li>
              <strong>Light:</strong> face a window in daylight so your face is evenly lit. Avoid
              overhead lights that cast shadows under the eyes, and avoid the phone flash.
            </li>
            <li>
              <strong>Camera:</strong> have someone else take it from about 1–1.5 metres away, at
              eye level. Selfies distort faces at arm&apos;s length.
            </li>
            <li>
              <strong>You:</strong> look straight at the camera with a neutral expression, mouth
              closed, hair away from the face, shoulders square.
            </li>
            <li>Take several shots and pick the sharpest.</li>
          </ul>
          <p>
            Two details prevent the most common faults. Stand half a metre or so in front of the
            wall rather than against it, so your shadow falls on the floor and not behind your head.
            And leave plenty of space around your head and shoulders in the shot — you can always
            crop in, but you cannot add background that was never photographed.
          </p>

          <h2>Why photos get rejected</h2>
          <p>Passport offices publish their reasons, and the same ones come up again and again:</p>
          <ul>
            <li>a shadow on the face or on the background behind the head;</li>
            <li>the head too large or too small in the frame, or cut off at the top;</li>
            <li>a smile, an open mouth, or eyes not looking at the camera;</li>
            <li>glare on glasses, or glasses worn where they are not allowed;</li>
            <li>hair across the eyes, or a hat or head covering worn for non-religious reasons;</li>
            <li>a patterned, dark or uneven background;</li>
            <li>a blurred, grainy or over-bright picture;</li>
            <li>a photo that is too old, or that has been edited.</li>
          </ul>
          <p>
            The last point deserves emphasis. Do not apply filters, smooth skin, remove blemishes or
            replace the background with software. Authorities reject altered photos, and some check
            for it. If the background is wrong, take the picture again against a better wall.
          </p>

          <h2>Crop it to the exact size</h2>
          <ol>
            <li>
              Open the <Link href="/image/passport-photo-maker">Passport Photo Maker</Link> and add
              your photo.
            </li>
            <li>
              Choose the size. Presets include 35 × 45 mm (used in the UK, the EU and Australia),
              51 × 51 mm (2 × 2 inches, used in the US and India) and 33 × 48 mm (China).
            </li>
            <li>Use the zoom and the up-and-down control to place your head as your rules require.</li>
            <li>Download the JPG.</li>
          </ol>
          <p>
            The photo is produced at 300 dots per inch, the density print shops work at, so it prints
            at the right physical size — a 35 × 45 mm photo comes out at 413 × 531 pixels. The
            cropping happens in your browser, so the photo of your face is never uploaded.
          </p>
          <p>
            Head size is set as a measurement on the finished print, so use the zoom to get it
            right. On a 35 × 45 mm photo that needs a 29–34 mm head, the head should fill roughly
            two-thirds to three-quarters of the height of the frame, with a clear gap above the
            hair.
          </p>

          <h2>Print it</h2>
          <p>
            Take the JPG to a print shop or photo kiosk. Most will place several copies on one
            standard 6 × 4 inch print for the price of a single photo — just ask. If you print at
            home, use photo paper and print at actual size (100%), never &ldquo;fit to page&rdquo;:
            any scaling changes the physical size, and size is the one thing that must be exact.
          </p>
          <p>
            Before you cut anything, check it with a ruler. Measure the width and height of one
            printed photo, and the distance from chin to the top of the head. If any of them is out,
            the print was scaled — fix the print settings rather than the photo. Cut with a paper
            trimmer or a craft knife and a steel rule; scissors rarely give a straight edge.
          </p>

          <h2>Babies and young children</h2>
          <p>
            Most countries relax some rules for infants, but the background and lighting rules still
            apply. The easiest method is to lay the baby on a plain white or light sheet and take
            the photo from directly above, with daylight coming from the side. Nobody else may
            appear in the picture — no supporting hands, no toys, no dummy. Expect to take a lot of
            shots, and check your country&apos;s guidance on whether a baby&apos;s eyes must be
            open.
          </p>

          <h2>Uploading instead of printing?</h2>
          <p>
            Online applications set their own rules for digital photos: pixel dimensions, a maximum
            file size, and usually JPEG format. These are separate from the printed size, so read
            them as carefully as the print rules. If the photo is too large, reduce it with{" "}
            <Link href="/image/compress-image">Compress Image</Link> and check it still meets the
            pixel size the form asks for. Some application sites also run an automatic check when
            you upload and tell you straight away if the photo fails, which is a useful free test
            before you pay for prints.
          </p>
        </>
      );
    },
  },
];
