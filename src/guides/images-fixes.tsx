import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const imagesFixesGuides: Guide[] = [
  {
    slug: "screenshots-to-pdf",
    topic: "Images",
    title: "How to turn screenshots into a PDF",
    seoTitle: "How to Turn Screenshots Into a PDF",
    description:
      "Combine screenshots of receipts, chats, bookings or web pages into one tidy PDF, in the right order and at a readable size, without uploading them anywhere.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["image-to-pdf", "crop-image", "compress-pdf"],
    Body: function Body() {
      return (
        <>
          <p>
            Screenshots pile up as evidence: an order confirmation, a conversation with a landlord, an error
            message for IT, a booking reference. Sending fifteen separate image files is clumsy, and they arrive
            in random order. A single PDF keeps them together, in sequence, and opens on any device.
          </p>

          <h2>Tidy the screenshots first</h2>
          <ul>
            <li>
              <strong>Crop away clutter.</strong> Status bars, other browser tabs and notification banners add
              nothing and may reveal private details. Trim them in <Link href="/image/crop-image">Crop Image</Link>
              .
            </li>
            <li>
              <strong>Hide what the recipient should not see.</strong> Account numbers, other people&apos;s
              names, addresses. See{" "}
              <Link href="/guides/hide-personal-info-in-a-screenshot">hiding personal information in a screenshot</Link>
              .
            </li>
            <li>
              <strong>Name them in order</strong>, or note the order you want, because file names from phones
              are often just timestamps.
            </li>
          </ul>

          <h2>Make the PDF step by step</h2>
          <ol>
            <li>
              Open <Link href="/image/image-to-pdf">Image to PDF</Link> and add the screenshots. PNG, JPG and WebP
              can be mixed.
            </li>
            <li>Put them in order. For a chat, oldest first; for a support ticket, the error first.</li>
            <li>
              Choose the page size. For phone screenshots, &ldquo;Match image&rdquo; gives each page the
              screenshot&apos;s own tall shape, which reads well on screen. Choose A4 or Letter portrait if the
              PDF will be printed or attached to a formal complaint.
            </li>
            <li>Add a small margin if you want white space around each screenshot.</li>
            <li>Create and download. The images never leave your browser.</li>
          </ol>

          <h2>Readable when printed</h2>
          <p>
            A tall phone screenshot fitted onto an A4 page becomes a narrow column with small text. For a printed
            record, either crop each screenshot to the part that matters, so it can be shown larger, or split a
            very long scrolling screenshot into two or three pieces before building the PDF. Desktop screenshots,
            which are wide, read better on landscape pages.
          </p>

          <h2>Keep the file a sensible size</h2>
          <p>
            Screenshots saved as PNG can be surprisingly large, especially from high-resolution phones. If the
            finished PDF is too big to email or upload, run it through{" "}
            <Link href="/pdf/compress-pdf">Compress PDF</Link>. Check afterwards that small text in the
            screenshots is still sharp; if not, use the Light level.
          </p>

          <h2>Doing it all on a phone</h2>
          <p>
            Most screenshots are taken on a phone, and you do not need a computer to combine them. Open Image to
            PDF in your phone&apos;s browser, tap to add images, and pick the screenshots from your gallery or
            photos app. The PDF downloads to the phone, ready to attach to an email or upload to a claim form.
            Very long batches are easier on a computer, but a dozen screenshots are no trouble on a phone.
          </p>

          <h2>Screenshots as evidence</h2>
          <p>
            If the PDF supports a complaint, a dispute or an insurance claim, a few habits make it more
            convincing:
          </p>
          <ul>
            <li>Include the date and time in each screenshot where the app shows it.</li>
            <li>Show the sender&apos;s name or the web address, not just the message.</li>
            <li>Keep the originals unedited, apart from blurring private details, and say which details you blurred.</li>
            <li>Add page numbers if you will refer to specific pages; see{" "}
              <Link href="/guides/how-to-add-page-numbers-to-a-pdf">adding page numbers to a PDF</Link>.</li>
          </ul>
          <p>
            For photos of paper documents rather than screenshots, the guide to{" "}
            <Link href="/guides/photos-of-documents-to-pdf">turning photos of documents into one PDF</Link>{" "}
            covers straightening and cropping pages.
          </p>
        </>
      );
    },
  },

  {
    slug: "flip-a-mirrored-selfie",
    topic: "Images",
    title: "Why selfies are mirrored, and how to flip them back",
    seoTitle: "Why Selfies Are Mirrored and How to Flip Them",
    description:
      "Front cameras show a mirror image, and text in selfies can come out backwards. Why it happens, how to flip a photo, and the phone setting that stops it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["rotate-image", "crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            You take a selfie in front of a shop sign and the lettering is backwards. Or the photo looks oddly
            unfamiliar: your parting is on the wrong side. Both come from the same thing: the difference between
            what a mirror shows and what a camera sees.
          </p>

          <h2>Why it happens</h2>
          <p>
            When you use the front camera, the preview on screen is mirrored, like a bathroom mirror, because that
            is how people expect to see themselves. Whether the saved photo is also mirrored depends on the phone
            and its settings. Some save exactly what the preview showed, so text is reversed. Others save the
            unmirrored view, which is how other people see you, and that can look &ldquo;wrong&rdquo; to you
            because you know your face from mirrors.
          </p>
          <p>
            Neither is a fault. But if a photo contains writing, a logo or a recognisable place, the unmirrored
            version is the correct one.
          </p>

          <h2>Flip a photo step by step</h2>
          <ol>
            <li>
              Open <Link href="/image/rotate-image">Rotate Image</Link> and add the selfie.
            </li>
            <li>Use flip horizontal. Text that was backwards now reads normally.</li>
            <li>Check the result and download. The photo stays in your browser throughout.</li>
          </ol>
          <p>
            Flipping is exact: no pixels are blurred, only their positions are swapped. If you also need to
            straighten or trim the photo, do it after flipping, so the crop is placed on the final image.
          </p>

          <h2>Stop it happening</h2>
          <ul>
            <li>
              <strong>iPhone:</strong> Settings → Camera → Mirror Front Camera. When it is on, saved selfies match
              the mirrored preview; when it is off, they are saved unmirrored.
            </li>
            <li>
              <strong>Android:</strong> the option lives in the camera app&apos;s own settings and its name
              varies by maker, for example &ldquo;Save selfies as previewed&rdquo; or &ldquo;Mirror front
              camera&rdquo;.
            </li>
            <li>
              <strong>Video calls:</strong> most apps mirror your own preview only. The other person sees you the
              right way round, so a sign behind you reads correctly for them even if it looks reversed to you.
            </li>
          </ul>

          <h2>When to flip, and when not to</h2>
          <ul>
            <li>
              <strong>Flip</strong> photos with text, numbers, logos or landmarks, and anything used as a record,
              such as a photo of a document held up to the front camera.
            </li>
            <li>
              <strong>Your choice</strong> for portraits. Many people prefer the mirrored version of their own face
              and the unmirrored version of friends&apos; faces. Choose whichever looks right to you.
            </li>
            <li>
              <strong>Do not flip</strong> ID photos or passport photos. They must show your face as it is.
            </li>
          </ul>

          <h2>Flipping versus rotating</h2>
          <p>
            Flipping makes a mirror image: left becomes right. Rotating turns the picture around its centre:
            upside down is a 180-degree rotation, not a flip. A photo that is sideways needs rotating; see{" "}
            <Link href="/guides/fix-sideways-photos">why photos appear sideways</Link>. A photo that reads
            backwards needs flipping.
          </p>
          <p>
            If the flipped selfie is going to be a profile picture, crop it to a square afterwards in{" "}
            <Link href="/image/crop-image">Crop Image</Link>, or see{" "}
            <Link href="/guides/how-to-make-a-round-profile-picture">how to make a round profile picture</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "straighten-a-crooked-photo",
    topic: "Images",
    title: "How to straighten a crooked photo",
    seoTitle: "How to Straighten a Crooked Photo (Tilted Horizon)",
    description:
      "A sloping horizon or a leaning building makes a good photo look careless. How to rotate by a fraction of a degree, then crop the corners so nothing looks tilted.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["rotate-image", "crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            A sea horizon that slopes by two degrees is enough to make a holiday photo feel off, even if the
            viewer cannot say why. Photos of documents, shelves and buildings show tilt even more clearly. The fix
            is a small rotation followed by a crop, and it takes under a minute.
          </p>

          <h2>Find a line that should be level</h2>
          <p>
            Before rotating, choose a reference: the horizon, the edge of a table, a window frame, a shelf, the
            top edge of a document. For buildings, vertical lines such as door frames are usually a better guide
            than horizontal ones. Your eye compares the line against the edges of the frame, so that is what you
            are correcting.
          </p>

          <h2>Straighten step by step</h2>
          <ol>
            <li>
              Open <Link href="/image/rotate-image">Rotate Image</Link> and add the photo.
            </li>
            <li>
              Use the fine angle control to rotate by small steps, anywhere between −45 and +45 degrees. Most
              crooked photos need between half a degree and three degrees.
            </li>
            <li>
              Watch your reference line against the edge of the preview. When it runs parallel, stop.
            </li>
            <li>
              Choose a corner fill colour. Rotating by an angle leaves four triangular gaps at the corners, which
              the tool fills with that colour.
            </li>
            <li>Download, then crop away the corner gaps.</li>
          </ol>

          <h2>Crop away the corners</h2>
          <p>
            Open the straightened photo in <Link href="/image/crop-image">Crop Image</Link> and draw a crop just
            inside the filled corners. Choose an aspect ratio preset such as 3:2 or 4:3 if you want to keep the
            original shape. The larger the rotation, the more you lose from the edges: a one-degree rotation costs
            very little, ten degrees costs a lot.
          </p>

          <h2>Quality: rotation versus flipping</h2>
          <p>
            Rotating by exactly 90 or 180 degrees, or flipping, only moves pixels, so it is lossless. Rotating by
            any other angle has to calculate new pixels in between the old ones, which softens fine detail very
            slightly. The tool tells you which case applies. On a normal photo the softening is invisible, but it
            is a reason to straighten once from the original rather than nudging an already-rotated copy several
            times.
          </p>

          <h2>When straightening is not enough</h2>
          <ul>
            <li>
              <strong>Buildings that lean inwards</strong> because the camera was tilted upwards need perspective
              correction, not rotation. Rotating one side straight makes the other lean more.
            </li>
            <li>
              <strong>Documents photographed at an angle</strong> are trapezoids, not tilted rectangles.
              Rotation helps a little; photographing from directly above helps much more.
            </li>
            <li>
              <strong>Wide-angle phone lenses</strong> curve straight lines near the edges. Use the centre line as
              your reference.
            </li>
          </ul>

          <h2>Prevent it next time</h2>
          <p>
            Most phone cameras can show a grid on the viewfinder; turn it on in the camera settings and line the
            horizon up with a grid line. Some also show a level indicator when the phone is held flat for
            overhead shots, which is useful for photographing documents and food.
          </p>
          <p>
            If the photo is sideways rather than slightly tilted, that is a different problem; see{" "}
            <Link href="/guides/fix-sideways-photos">why photos appear sideways and how to fix them</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "find-when-a-photo-was-taken",
    topic: "Images",
    title: "How to find out when and where a photo was taken",
    seoTitle: "How to Find When and Where a Photo Was Taken",
    description:
      "Photos often carry the date, time, camera and even GPS location inside the file. How to read that EXIF data, why it is sometimes missing, and when not to trust it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["exif-remover"],
    Body: function Body() {
      return (
        <>
          <p>
            You are sorting old photos and want to know which year one is from. Or you need to prove when a photo
            of damage was taken for an insurance claim. Or you are curious which phone took a picture. All of
            this is often stored in the image file itself, in a hidden block of information called EXIF
            metadata.
          </p>

          <h2>What a photo can contain</h2>
          <ul>
            <li>
              <strong>Dates:</strong> when the photo was taken, when it was digitised, and when it was last
              modified, often to the second, sometimes with a time-zone offset.
            </li>
            <li>
              <strong>Device:</strong> the camera or phone maker and model, the lens, and sometimes a serial
              number.
            </li>
            <li>
              <strong>Location:</strong> GPS latitude and longitude, if location was switched on for the camera.
            </li>
            <li>
              <strong>Settings:</strong> exposure, aperture, ISO, focal length, flash.
            </li>
            <li>
              <strong>Software:</strong> the editing program that last saved it.
            </li>
          </ul>

          <h2>Read it step by step</h2>
          <ol>
            <li>
              Open the <Link href="/image/exif-remover">EXIF Viewer and Remover</Link> and add the photo. It is
              read in your browser, not uploaded.
            </li>
            <li>
              Look at the Dates group for the date taken, the Device and owner group for the camera, and the
              Location group for GPS coordinates.
            </li>
            <li>
              To see a location on a map, copy the latitude and longitude into a map app&apos;s search box.
            </li>
          </ol>

          <h2>Date taken versus file date</h2>
          <p>
            Your computer also shows a &ldquo;date modified&rdquo; and &ldquo;date created&rdquo; for every
            file. Those describe the file, not the photo: copying a photo to a new computer or downloading it
            from email can reset them to today. The EXIF &ldquo;date taken&rdquo; travels inside the file and
            normally stays the same through copying. When the two disagree, the EXIF date is usually the one to
            believe.
          </p>

          <h2>Why the data is often missing</h2>
          <ul>
            <li>
              <strong>Messaging apps and social networks</strong> usually strip metadata from photos when you
              send or post them, partly to protect privacy. A photo saved from a chat or a social post often has
              no date or location at all.
            </li>
            <li>
              <strong>Screenshots</strong> carry little or no camera information.
            </li>
            <li>
              <strong>Edited or exported photos</strong> may keep some fields and drop others, depending on the
              program.
            </li>
            <li>
              <strong>Location switched off</strong> means no GPS, even though the date is there.
            </li>
          </ul>
          <p>
            If you need the metadata, ask for the original file, sent as a document or through a file-sharing
            link rather than as a photo message.
          </p>

          <h2>How far to trust it</h2>
          <p>
            EXIF data is easy to edit. A camera with the wrong clock records the wrong date, and travel across
            time zones can shift times by hours. Treat it as good evidence, not proof. For anything important,
            back it up with other details: what is visible in the photo, the weather, the sequence of other photos
            taken around the same time.
          </p>

          <h2>The privacy side</h2>
          <p>
            The same data that helps you date a photo tells strangers where you live if you post a picture taken
            at home with location on. Before sharing originals publicly, remove it: the same tool strips GPS,
            device and date details while keeping the picture. The full walkthrough is in{" "}
            <Link href="/guides/remove-location-data-from-photos">how to remove location data from photos</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "print-multiple-photos-on-one-page",
    topic: "Images",
    title: "How to print several photos on one page",
    seoTitle: "How to Print Multiple Photos on One Page",
    description:
      "Print 2, 4, 6 or 9 photos on a single sheet for contact sheets, wallet photos, mood boards and school projects, with even spacing and nothing cut off.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["image-to-pdf", "pdf-n-up", "crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Printing one photo per sheet wastes paper when you only need small prints: a contact sheet to choose
            favourites, photos for a school project, a set of small portraits for relatives, a mood board for a
            client. Arranging them by hand in a word processor is fiddly. Two tools do it neatly: one turns the
            photos into PDF pages, the other places several pages on each sheet.
          </p>

          <h2>Step 1: make the photos the same shape</h2>
          <p>
            Photos of different shapes leave uneven gaps on the sheet. If you want a tidy grid, crop them to the
            same aspect ratio first in <Link href="/image/crop-image">Crop Image</Link>: 3:2 for classic prints,
            4:3 for most phone photos, 1:1 for squares. For a contact sheet of a whole shoot, skip this step;
            uneven shapes do not matter there.
          </p>

          <h2>Step 2: turn the photos into a PDF</h2>
          <ol>
            <li>
              Open <Link href="/image/image-to-pdf">Image to PDF</Link> and add all the photos.
            </li>
            <li>Put them in the order you want them on the sheet.</li>
            <li>Choose &ldquo;Match image&rdquo; for page size, so each page is exactly the shape of its photo.</li>
            <li>Set the margin to none, and create the PDF.</li>
          </ol>

          <h2>Step 3: put several on each sheet</h2>
          <ol>
            <li>
              Open <Link href="/pdf/pdf-n-up">Multiple PDF Pages Per Sheet</Link> and add the PDF from step 2.
            </li>
            <li>Choose how many per sheet: 2, 4, 6, 9 or 16.</li>
            <li>Choose the sheet size (A4 or Letter) and orientation, or leave orientation on Automatic.</li>
            <li>
              Set the gap between pages, and tick the light outline if you will cut the photos apart; the lines
              show where to cut.
            </li>
            <li>Download and print at actual size, on photo paper if you have it.</li>
          </ol>

          <h2>How many per sheet</h2>
          <table>
            <thead>
              <tr>
                <th>Per sheet</th>
                <th>Good for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2</td>
                <td>Two medium prints, side by side</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Postcard-sized prints, school projects</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Small prints for albums and cards</td>
              </tr>
              <tr>
                <td>9</td>
                <td>Wallet-sized portraits, mood boards</td>
              </tr>
              <tr>
                <td>16</td>
                <td>Contact sheets for picking favourites</td>
              </tr>
            </tbody>
          </table>

          <h2>Printing tips</h2>
          <ul>
            <li>
              <strong>Choose the right paper type</strong> in the print dialog. Printing on photo paper with a
              plain-paper setting gives smeared, dull colours.
            </li>
            <li>
              <strong>Print one test sheet</strong> on plain paper first to check the layout.
            </li>
            <li>
              <strong>Do not use &ldquo;Fit to page&rdquo; twice.</strong> The sheet is already laid out; print it
              at actual size so the cutting lines stay where they should.
            </li>
            <li>
              <strong>Same photo many times?</strong> Add it to Image to PDF several times, for example nine
              copies of a portrait for wallet photos.
            </li>
          </ul>

          <h2>Exact print sizes</h2>
          <p>
            The grid fits photos to the space available, so the final size depends on the sheet and the number
            per sheet. If you need an exact size, such as 35 × 45 mm passport photos, use a tool built for that:
            see <Link href="/guides/how-to-make-a-passport-photo-at-home">making a passport photo at home</Link>.
            For which pixel sizes print sharply, see{" "}
            <Link href="/guides/pixel-size-for-photo-prints">pixels needed for common print sizes</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "why-photos-look-blurry-after-upload",
    topic: "Images",
    title: "Why photos look blurry after uploading, and how to keep them sharp",
    seoTitle: "Why Photos Look Blurry After Uploading",
    description:
      "Sharp on your phone, soft on WhatsApp, Instagram or Facebook. How apps resize and recompress photos, and the sizes and settings that keep them looking crisp.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["resize-image", "compress-image", "instagram-image-resizer"],
    Body: function Body() {
      return (
        <>
          <p>
            The photo looks perfect in your gallery. You post it and it looks smeared, blocky in the sky, or
            fuzzy around text. Nothing is wrong with your camera. Almost every app and website resizes and
            recompresses uploads to save storage and data, and some ways of preparing a photo survive that much
            better than others.
          </p>

          <h2>What the apps do</h2>
          <ul>
            <li>
              <strong>Resize:</strong> a 4,000-pixel photo is scaled down to the app&apos;s maximum width. Each
              network has its own limit; Instagram, for example, works at 1,080 pixels wide for feed posts.
            </li>
            <li>
              <strong>Recompress:</strong> the resized image is saved again as a JPG or similar at the app&apos;s
              chosen quality, often fairly low to keep files small.
            </li>
            <li>
              <strong>Crop:</strong> photos outside the allowed shapes are cut to fit.
            </li>
          </ul>
          <p>
            Each step loses some detail. A photo that has already been compressed hard before uploading loses
            more, because the app is compressing the artefacts as well as the picture.
          </p>

          <h2>How to keep photos sharp</h2>
          <ol>
            <li>
              <strong>Start from the original</strong>, not a copy saved from a chat or a previous post.
            </li>
            <li>
              <strong>Upload at the size the app uses.</strong> For Instagram, the{" "}
              <Link href="/image/instagram-image-resizer">Instagram Image Resizer</Link> outputs exactly 1,080
              pixels wide in the right shape, so the app does not need to resize or crop it again.
            </li>
            <li>
              <strong>Use high quality when you resize.</strong> If you make a smaller version with{" "}
              <Link href="/image/resize-image">Resize Image</Link>, save it with little compression. Let the app
              do the only heavy compression.
            </li>
            <li>
              <strong>Do not compress twice.</strong> If you need a small file for email, make it separately from
              the copy you post. <Link href="/image/compress-image">Compress Image</Link> shows a before-and-after
              preview, so you can see the cost of each quality level.
            </li>
          </ol>

          <h2>Messaging apps</h2>
          <p>
            Chat apps compress photos more than social networks, because they assume photos are for viewing on a
            phone. To send a photo at full quality:
          </p>
          <ul>
            <li>WhatsApp: use the HD option when sending, or send the photo as a document, which keeps it untouched.</li>
            <li>Other messengers: look for &ldquo;send as file&rdquo; or &ldquo;original quality&rdquo;.</li>
            <li>For printing or archiving, use a file-sharing link or email rather than a chat.</li>
          </ul>

          <h2>Why some photos suffer more</h2>
          <ul>
            <li>
              <strong>Fine detail</strong> such as grass, hair, gravel and fabric patterns is the hardest thing to
              compress and smears first.
            </li>
            <li>
              <strong>Smooth gradients</strong> such as skies and studio backdrops show banding and blocks.
            </li>
            <li>
              <strong>Small text</strong>, for example in a poster or a screenshot, blurs badly when scaled down.
              Make text larger in the design rather than relying on the app to keep it sharp.
            </li>
            <li>
              <strong>Night photos</strong> already contain noise, which compression turns into blotches.
            </li>
          </ul>

          <h2>It might be the photo</h2>
          <p>
            Sometimes the original is soft too and only looks sharp because the gallery shows it small. Zoom to
            100% before blaming the app. Motion blur, missed focus and a smudged lens all look like compression
            once the photo is enlarged. For screenshots of documents, PNG survives better than JPG; see{" "}
            <Link href="/guides/jpg-vs-png-vs-webp">JPG vs PNG vs WebP</Link>.
          </p>
          <p>
            For Instagram specifically, see <Link href="/guides/instagram-image-sizes">Instagram image sizes</Link>{" "}
            and <Link href="/guides/add-white-borders-for-instagram">adding white borders to fit a photo</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "hide-personal-info-in-a-screenshot",
    topic: "Images",
    title: "How to hide personal information in a screenshot before sharing it",
    seoTitle: "How to Hide Personal Info in a Screenshot",
    description:
      "Names, account numbers and email addresses slip into screenshots. How to blur or crop them properly, why light blurring can fail, and what else to check.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["blur-faces-in-photo", "crop-image", "exif-remover"],
    Body: function Body() {
      return (
        <>
          <p>
            A screenshot is often the quickest way to show a problem: a bank error, a delivery update, a funny
            message. It is also the quickest way to share a phone number, an email address, an order number or a
            friend&apos;s name with everyone who sees the post. Hiding them takes a minute, but it has to be done
            properly.
          </p>

          <h2>Option 1: crop it out</h2>
          <p>
            The safest way to hide something is to remove it entirely. If the private detail is near an edge,
            such as a name in a header or an account number at the bottom, cut it off with{" "}
            <Link href="/image/crop-image">Crop Image</Link>. Cropped pixels are gone from the saved file; nothing
            is left to recover.
          </p>

          <h2>Option 2: blur it heavily</h2>
          <ol>
            <li>
              Open <Link href="/image/blur-faces-in-photo">Blur Faces in a Photo</Link>. Despite the name, it
              blurs any area you choose, including text.
            </li>
            <li>Drag a box over each detail you want hidden: names, numbers, addresses, profile pictures.</li>
            <li>Turn the blur strength up until the text is a smooth smear with no letter shapes visible.</li>
            <li>Download. The blur is baked into the pixels, not a layer on top that can be removed.</li>
          </ol>
          <p>The screenshot is processed in your browser and is not uploaded.</p>

          <h2>Why light blurring is not enough</h2>
          <p>
            A light blur or coarse pixelation over short text can sometimes be guessed back. If the font and the
            kind of text are known, such as a card number or a short code, a computer can try likely values,
            blur them the same way, and compare. Heavy blur over a box larger than the text defeats that. If in
            doubt, crop instead, or blur so strongly that even you could not tell how many characters were
            there.
          </p>

          <h2>What people forget to hide</h2>
          <ul>
            <li>
              <strong>Notification banners</strong> at the top of the screen, showing someone else&apos;s message.
            </li>
            <li>
              <strong>Other browser tabs</strong> and the address bar, which can contain account or order numbers
              in the URL.
            </li>
            <li>
              <strong>Profile pictures and names</strong> of other people in a chat.
            </li>
            <li>
              <strong>Barcodes and QR codes</strong> on tickets and boarding passes. They can contain booking
              references and full names even when the visible text is hidden.
            </li>
            <li>
              <strong>Partial numbers.</strong> The last four digits of a card plus a name and a date can be
              enough for social engineering.
            </li>
            <li>
              <strong>Reflections</strong> in photos of screens.
            </li>
          </ul>

          <h2>Black boxes in PDFs are different</h2>
          <p>
            Drawing a black rectangle over text in a PDF often hides nothing: the text is still underneath and can
            be copied out. For PDFs, use a real redaction tool; see{" "}
            <Link href="/guides/how-to-redact-a-pdf">how to redact a PDF properly</Link>. In a screenshot or photo,
            by contrast, an edit that changes the pixels does remove the information, as long as you share the
            edited file and not the original.
          </p>

          <h2>Check the file, not just the picture</h2>
          <p>
            Photos of screens taken with a phone camera can carry the phone&apos;s location and model in their
            metadata. Screenshots usually carry little, but if you are sharing a camera photo, strip it with the{" "}
            <Link href="/image/exif-remover">EXIF Viewer and Remover</Link>. For faces and number plates in
            ordinary photos, see{" "}
            <Link href="/guides/how-to-blur-faces-and-number-plates">blurring faces and number plates</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "does-converting-jpg-to-png-improve-quality",
    topic: "Images",
    title: "Does converting a JPG to PNG improve quality?",
    seoTitle: "Does Converting JPG to PNG Improve Quality?",
    description:
      "No, and the file usually gets several times bigger. What converting really does, when PNG is still the right choice, and how to get better quality instead.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["jpg-to-png", "image-converter", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            PNG is &ldquo;lossless&rdquo; and JPG is &ldquo;lossy&rdquo;, so it seems natural that converting a
            JPG to PNG would make it better. It does not. It keeps the image exactly as it is, including every
            flaw the JPG compression already introduced, and usually makes the file much larger.
          </p>

          <h2>What lossless really means</h2>
          <p>
            Lossless means that saving as PNG does not lose anything further. It does not mean PNG can restore
            what was lost earlier. When a photo was first saved as JPG, some fine detail was thrown away and small
            artefacts appeared: blocky patches in smooth areas, faint halos around sharp edges. Converting to PNG
            records those pixels faithfully. The artefacts are preserved, not repaired.
          </p>

          <h2>What happens to the file size</h2>
          <p>
            JPG is designed for photographs and compresses them very efficiently. PNG is designed for graphics
            with flat colours and compresses photos poorly. A photo converted from JPG to PNG is often several
            times larger, with no visible difference. That is the opposite of what most people want.
          </p>

          <h2>When converting to PNG does make sense</h2>
          <ul>
            <li>
              <strong>You are going to edit the image repeatedly.</strong> Every time a JPG is opened, edited and
              saved as JPG again, it loses a little more. Converting once to PNG with{" "}
              <Link href="/image/jpg-to-png">JPG to PNG</Link> and editing the PNG stops that further loss. Make
              the final JPG at the end.
            </li>
            <li>
              <strong>A form or program only accepts PNG.</strong> Then convert, and accept the larger file.
            </li>
            <li>
              <strong>You need transparency later.</strong> JPG cannot store a transparent background. PNG can,
              although converting does not create the transparency by itself; you still have to remove the
              background in an editor.
            </li>
            <li>
              <strong>Graphics that were wrongly saved as JPG.</strong> A logo or screenshot saved as JPG has
              fuzzy edges. Converting will not sharpen them, but it stops them getting worse in future edits.
            </li>
          </ul>

          <h2>How to actually get better quality</h2>
          <ul>
            <li>
              <strong>Find the original.</strong> The camera file, the original export from the designer, or the
              full-resolution photo from the sender.
            </li>
            <li>
              <strong>Save JPGs at higher quality</strong> next time. In{" "}
              <Link href="/image/compress-image">Compress Image</Link>, quality in the 80s is visually close to
              the original for most photos; the low 60s and below show artefacts.
            </li>
            <li>
              <strong>For graphics, start in PNG or SVG</strong> and only make a JPG if a photo-like file is
              required.
            </li>
          </ul>

          <h2>The same goes for other conversions</h2>
          <p>
            Converting a small image to a larger size does not add detail, and converting a WebP or AVIF to JPG
            does not improve it either. Conversions change the container, not the content. Use them for
            compatibility, which is what the <Link href="/image/image-converter">Image Converter</Link> is for:
            getting a file into the format a program or website accepts.
          </p>
          <p>
            For choosing formats from the start, see <Link href="/guides/jpg-vs-png-vs-webp">JPG vs PNG vs WebP</Link>.
            For the opposite conversion, and what happens to transparency, see{" "}
            <Link href="/guides/png-to-jpg-transparent-background">PNG to JPG and transparency</Link>.
          </p>
        </>
      );
    },
  },
];
