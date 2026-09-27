import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-09-27";

export const imageGuides: Guide[] = [
  {
    slug: "remove-location-data-from-photos",
    topic: "Images",
    title: "How to remove location and camera data from photos before sharing",
    seoTitle: "How to Remove Location Data From Photos",
    description:
      "Photos can carry GPS coordinates, dates and device details. See what yours reveal and strip that metadata without re-compressing the image.",
    published: PUBLISHED,
    updated: PUBLISHED,
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

          <h2>Doesn&apos;t social media remove it?</h2>
          <p>
            Many large platforms strip location data from public posts. But plenty of routes pass the
            original file on untouched: email attachments, messaging apps set to send full-quality
            files, cloud share links, forums and marketplace listings. Cleaning the photo yourself
            means you do not have to rely on each service getting it right.
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

          <h2>Why rotation and colour are kept</h2>
          <p>
            Phones often save a picture sideways and include one instruction telling viewers to turn
            it upright. Delete that and your photo appears on its side, so the tool writes back that
            single value — it reveals nothing about you. The colour profile only tells software how
            to display the colours correctly. You can switch both off if you want a completely bare
            file.
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
    updated: PUBLISHED,
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
          </ul>

          <h2>How much smaller will it get?</h2>
          <p>
            Typically 50–80% for photographs at quality 80. A detailed landscape compresses less than
            a portrait against a plain background. The compressor shows the real before-and-after
            size, so you can decide with numbers rather than guesses — and the images are processed
            on your own device, not uploaded.
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
    updated: PUBLISHED,
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

          <h2>Stop your iPhone making HEIC files</h2>
          <p>
            On the iPhone, go to <strong>Settings → Camera → Formats</strong> and choose{" "}
            <strong>Most Compatible</strong>. New photos will be saved as JPGs. Photos you have
            already taken stay as HEIC, so convert those as above.
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
    updated: PUBLISHED,
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

          <h2>How to get clean results</h2>
          <p>Accuracy depends almost entirely on the picture you give it:</p>
          <ul>
            <li>
              <strong>Use the sharpest version you have.</strong> A screenshot beats a photo of a
              screen; a flat scan beats a photo of a page.
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
          </ul>
          <p>
            On clear printed text — screenshots, rendered documents, flat scans — accuracy is
            typically above 95%. Still, proofread numbers, names and anything you will rely on.
          </p>

          <h2>What OCR struggles with</h2>
          <p>
            Handwriting. The engine is trained on printed type, so neat block capitals sometimes
            work and ordinary joined-up writing rarely does. Unusual decorative fonts and text set
            at an angle are also hit and miss.
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
    updated: PUBLISHED,
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

          <h2>Print it</h2>
          <p>
            Take the JPG to a print shop or photo kiosk. Most will place several copies on one
            standard 6 × 4 inch print for the price of a single photo — just ask. If you print at
            home, use photo paper and print at actual size (100%), never &ldquo;fit to page&rdquo;:
            any scaling changes the physical size, and size is the one thing that must be exact.
          </p>

          <h2>Uploading instead of printing?</h2>
          <p>
            Online applications often set a file size limit as well as pixel dimensions. If the photo
            is too large, reduce it with <Link href="/image/compress-image">Compress Image</Link> and
            check it still meets the pixel size the form asks for.
          </p>
        </>
      );
    },
  },
];
