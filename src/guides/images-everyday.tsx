import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-01";

export const imagesEverydayGuides: Guide[] = [
  {
    slug: "how-to-blur-faces-and-number-plates",
    topic: "Images",
    title: "How to blur faces and number plates in a photo properly",
    seoTitle: "How to Blur Faces and Number Plates in Photos",
    description:
      "Hide faces, number plates, house numbers and screens in a photo so they cannot be recovered, check the result, and catch the details people usually miss.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["blur-faces-in-photo", "exif-remover", "crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            A photo of a street, a school event, a car accident or an office party almost always
            includes someone who did not ask to be in it. Before it goes online, the people and details
            that do not belong there should be hidden — and hidden in a way that cannot be undone.
          </p>

          <h2>What to hide</h2>
          <ul>
            <li>Faces of people who have not agreed to be shown, especially children.</li>
            <li>Vehicle number plates.</li>
            <li>House numbers, street signs and anything else that pins down an address.</li>
            <li>Name badges, ID cards and uniforms with names.</li>
            <li>Screens and documents in the background — monitors, phones, letters on a desk.</li>
          </ul>

          <h2>Blur a photo step by step</h2>
          <ol>
            <li>
              Open <Link href="/image/blur-faces-in-photo">Blur Faces in a Photo</Link> and add the
              picture.
            </li>
            <li>Drag a box across each face, plate or detail that must be hidden.</li>
            <li>Raise the blur strength until nothing in the boxes is recognisable.</li>
            <li>Apply, then download the result.</li>
          </ol>
          <p>
            You mark the areas yourself; nothing in the photo is analysed and no face data is created.
            The photo never leaves your device, which is rather the point when it shows people who
            want privacy.
          </p>

          <h2>Why blurring here is permanent</h2>
          <p>
            Each marked area is redrawn from the original pixels through a blur, and the blurred
            result becomes part of the saved picture. The detail inside it is destroyed, not covered.
          </p>
          <p>
            That is different from drawing a black rectangle over a photo inside a document, a slide
            or a PDF editor. There the shape usually sits on top of the untouched picture, and anyone
            who moves the shape — or extracts the image — sees everything. If a photo will be placed in
            a document, blur it first and insert the blurred file.
          </p>

          <h2>How strong is strong enough?</h2>
          <p>
            A light blur is not always safe. Faces can still be recognised by someone who knows the
            person, and a weakly blurred number plate or line of text can sometimes be guessed,
            because there are only so many possible combinations. Use a strong blur, then check the
            result at full size: if you can make out any feature, apply it again more strongly. When
            in doubt, go further.
          </p>

          <h2>The details people miss</h2>
          <ul>
            <li>
              <strong>Reflections</strong> in windows, mirrors, car paintwork and sunglasses.
            </li>
            <li>
              <strong>Partial faces</strong> at the edge of the frame or behind other people.
            </li>
            <li>
              <strong>Hair, ears and clothing.</strong> A blurred face above a distinctive jacket is
              still recognisable to anyone who knows the person — extend the box.
            </li>
            <li>
              <strong>Text on screens</strong> that is small in a thumbnail but readable at full size.
            </li>
          </ul>

          <h2>Sometimes cropping is better</h2>
          <p>
            If the person or detail is near the edge, cutting it out entirely with{" "}
            <Link href="/image/crop-image">Crop Image</Link> leaves a cleaner picture than a blurred
            patch. Blur what you cannot crop.
          </p>

          <h2>Remove the hidden data too</h2>
          <p>
            A photo can carry the exact GPS location where it was taken, inside the file. Blurring a
            house number achieves little if the file states the address&apos;s coordinates. Run the
            final picture through the <Link href="/image/exif-remover">EXIF Viewer and Remover</Link>{" "}
            before posting — see{" "}
            <Link href="/guides/remove-location-data-from-photos">
              how to remove location data from photos
            </Link>
            .
          </p>

          <h2>Ask when you can</h2>
          <p>
            Blurring is the fallback. For photos of identifiable people — colleagues, other
            people&apos;s children, customers — the best practice is to ask before posting, and many
            schools, workplaces and events have their own rules. The law on publishing images of people
            varies between countries; blurring is a sensible precaution, not a substitute for following
            the rules that apply to you.
          </p>
        </>
      );
    },
  },

  {
    slug: "resize-a-photo-to-exact-size-and-kb",
    topic: "Images",
    title: "How to resize a photo to exact pixels and a file size limit in KB",
    seoTitle: "How to Resize a Photo to Exact Pixels and KB",
    description:
      "Forms often demand a photo of exact pixels under a set number of KB. Crop, resize and compress in the right order to meet both limits without blurring.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["crop-image", "resize-image", "compress-image", "passport-photo-maker"],
    Body: function Body() {
      return (
        <>
          <p>
            Exam registrations, job portals, government applications and membership forms often ask
            for something like &ldquo;a photo of 200 × 230 pixels, under 50 KB&rdquo; or &ldquo;a
            signature image of 140 × 60 pixels, 10–20 KB&rdquo;. A phone photo is thousands of pixels
            wide and several megabytes, so it is rejected. Meeting both limits takes three steps, in a
            particular order.
          </p>

          <h2>Pixels and kilobytes are different limits</h2>
          <ul>
            <li>
              <strong>Dimensions</strong> — width × height in pixels — describe the shape and detail of
              the image.
            </li>
            <li>
              <strong>File size</strong> — in KB or MB — is how much storage the file takes. It depends
              on the dimensions, but also on the format and the compression quality.
            </li>
          </ul>
          <p>
            You control dimensions by cropping and resizing, and file size mainly by compression. Do
            them in that order.
          </p>

          <h2>Step 1: crop to the right shape</h2>
          <p>
            Work out the shape the form wants. 200 × 230 pixels is slightly taller than wide; a square
            is 1:1. Resizing a photo of a different shape to those dimensions would stretch the face, so
            crop first.
          </p>
          <p>
            In <Link href="/image/crop-image">Crop Image</Link>, type the target width and height
            directly into the pixel fields, or a larger size in the same proportion, and drag the
            selection over the part of the photo you want. Cropping keeps the full-resolution pixels,
            so nothing is lost yet.
          </p>

          <h2>Step 2: resize to the exact dimensions</h2>
          <p>
            Open the cropped image in <Link href="/image/resize-image">Resize Image</Link> and enter
            the exact width; with the aspect ratio locked, the height follows. Because you cropped to
            the right shape first, it lands on the required height too. Making an image smaller keeps
            it sharp; avoid making it larger than the original.
          </p>

          <h2>Step 3: compress to the KB limit</h2>
          <p>
            Add the resized image to <Link href="/image/compress-image">Compress Image</Link>. Drag the
            quality slider and watch the estimated size. Stop as soon as it is under the limit — there
            is no reward for going far below it, only a worse-looking picture. A small image such as
            200 × 230 pixels usually reaches a few tens of kilobytes at a moderate quality setting.
          </p>
          <p>
            If you reach a quality of about 60 and the file is still too big, check the dimensions
            again: an image that is larger than required is the usual cause.
          </p>

          <h2>When there is a minimum size as well</h2>
          <p>
            Some forms set a range, such as 20–50 KB, to stop people uploading tiny, blurry images. If
            your file is below the minimum, raise the quality. Do not enlarge the image to gain
            kilobytes; it only makes it softer.
          </p>

          <h2>Format</h2>
          <p>
            Most forms ask for JPG, and some reject anything else. Photos should be JPG. A scanned
            signature on white paper is also usually requested as JPG; if the form allows PNG, that
            keeps the strokes crisp.
          </p>

          <h2>DPI usually does not matter</h2>
          <p>
            For an upload, only the pixels and file size count. A form that also mentions DPI is
            usually describing a print size — the photo may be printed on an admit card or ID — and
            the dimensions it gives already take that into account. If it specifically asks for a DPI
            value, see <Link href="/guides/what-dpi-means-for-printing">what DPI means</Link>.
          </p>

          <h2>Passport and visa photos</h2>
          <p>
            For official photos with fixed physical sizes, such as 35 × 45 mm or 2 × 2 inches, the{" "}
            <Link href="/image/passport-photo-maker">Passport Photo Maker</Link> crops to the exact
            proportions at print quality. If the application is online, check its pixel and KB limits
            separately and compress the result as above.
          </p>

          <h2>Before you upload</h2>
          <ul>
            <li>Check the final file&apos;s dimensions and size in your computer&apos;s file properties.</li>
            <li>Look at it at 100% — the face should be clear and evenly lit.</li>
            <li>Keep the original photo, so you can redo it if the requirements change.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "how-to-open-webp-and-avif-images",
    topic: "Images",
    title: "Why images download as WebP or AVIF — and how to open or convert them",
    seoTitle: "How to Open WebP and AVIF Images (and Convert Them)",
    description:
      "Pictures saved from websites often arrive as .webp or .avif files older programs refuse. What these formats are, what opens them, and how to convert them.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["webp-to-jpg", "webp-to-png", "avif-to-jpg", "image-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            You right-click a picture on a website, save it, and get a file ending in .webp or .avif.
            Your photo editor will not open it, the upload form rejects it, and the print shop has never
            heard of it. Nothing is wrong with the picture — it is just in a newer format.
          </p>

          <h2>Why websites use these formats</h2>
          <p>
            WebP and AVIF compress images much better than JPG. A WebP is typically 25–35% smaller than
            a JPG of the same visible quality, and AVIF is often smaller still. Smaller images mean
            faster pages, so many websites convert their pictures automatically. When you save an image,
            your browser keeps the format the website sent.
          </p>

          <h2>What can open them</h2>
          <ul>
            <li>
              <strong>Any current web browser</strong> — Chrome, Edge, Firefox and Safari display both
              formats. Dragging the file into a browser window is a quick way to view it.
            </li>
            <li>
              <strong>Recent operating systems</strong> open WebP in their built-in photo apps. AVIF
              support is newer; on Windows it may need the free AV1 Video Extension from the Microsoft
              Store.
            </li>
            <li>
              <strong>Image editors</strong> vary. Recent versions of most major editors open WebP;
              older software and many print and upload services still do not.
            </li>
          </ul>
          <p>When a program refuses the file, converting it is the reliable fix.</p>

          <h2>Convert WebP to JPG or PNG</h2>
          <ol>
            <li>
              For photographs, use <Link href="/image/webp-to-jpg">WebP to JPG</Link>. Set the quality
              to 85 or above, and choose a background colour for any transparent areas, since JPG
              cannot store transparency.
            </li>
            <li>
              For logos, screenshots and images with transparent backgrounds, use{" "}
              <Link href="/image/webp-to-png">WebP to PNG</Link>, which keeps transparency and loses
              nothing further.
            </li>
            <li>Convert one file or a batch, then download them individually or as a ZIP.</li>
          </ol>

          <h2>Convert AVIF to JPG or PNG</h2>
          <p>
            <Link href="/image/avif-to-jpg">AVIF to JPG</Link> uses your browser&apos;s own AVIF
            decoder, so it works in any browser that can display AVIF — current Chrome, Edge and
            Firefox, and Safari 16 or later. Choose JPG for photos or PNG for images with transparency
            or sharp text. If your browser reports that the file cannot be opened, updating the
            browser usually fixes it.
          </p>

          <h2>What happens to quality</h2>
          <p>
            Converting from WebP or AVIF to JPG is a second round of lossy compression, so a little
            more detail is lost. At quality 85 or above the difference is not visible in normal
            viewing. Converting to PNG loses nothing further, but cannot restore detail the WebP or
            AVIF already discarded, and the file will be larger. Expect the JPG to be bigger than the
            WebP or AVIF it came from; that is the cost of compatibility, not a sign of better
            quality.
          </p>

          <h2>Animated images</h2>
          <p>
            Both formats can hold animations. JPG and PNG cannot, so only the first frame is converted.
            To keep the animation, view or share the original file instead.
          </p>

          <h2>Converting many images at once</h2>
          <p>
            The <Link href="/image/image-converter">Image Converter</Link> converts a mixed batch to JPG,
            PNG or WebP in one pass, with an optional maximum width to scale down large images at the
            same time.
          </p>

          <h2>Should you avoid WebP?</h2>
          <p>
            No — on websites it is the better format, and if you run a site you should probably be
            serving it. Convert only the copies that need to go somewhere that cannot read it. For more
            on choosing formats, see{" "}
            <Link href="/guides/jpg-vs-png-vs-webp">JPG, PNG, WebP or AVIF: which to use</Link>. And
            remember that a picture saved from a website belongs to whoever made it; converting it does
            not change who owns it.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-pick-colours-from-an-image",
    topic: "Images",
    title: "How to pick colours from an image and build a palette",
    seoTitle: "How to Pick Colours From an Image for a Palette",
    description:
      "Extract the main colours from a photo or logo as HEX, RGB and HSL codes, build a usable palette from them, and check which ones work for text.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["image-color-palette", "color-blindness-simulator", "favicon-generator"],
    Body: function Body() {
      return (
        <>
          <p>
            A photo you love, a client&apos;s logo, a screenshot of a design you admire: each contains
            a set of colours you might want to reuse. Picking them by eye is guesswork. Extracting them
            gives you exact codes you can paste into a design tool, a website stylesheet or a slide
            template.
          </p>

          <h2>Extract a palette step by step</h2>
          <ol>
            <li>
              Add the image to the <Link href="/image/image-color-palette">Color Palette Extractor</Link>.
            </li>
            <li>Choose how many colours you want — five to eight suits most palettes.</li>
            <li>Copy individual colours as HEX, RGB or HSL, or copy the whole palette as CSS variables, a Tailwind theme or JSON.</li>
            <li>Click anywhere on the image to read the colour at that exact spot.</li>
          </ol>
          <p>The image is analysed in your browser; it is not uploaded.</p>

          <h2>How the colours are chosen</h2>
          <p>
            The extractor groups similar pixels together and finds the most representative colour of
            each group. It measures similarity in a colour space designed around human vision, so the
            palette favours colours that look different to you, rather than five slightly different
            shades of the same background. The same image always produces the same palette, and each
            colour shows the share of the image it covers.
          </p>
          <p>
            Two consequences are worth knowing. A small but striking accent colour can be absorbed
            into a larger neighbour, so increase the number of colours or click to sample it directly.
            And palette colours are averages of their group, not copies of a single pixel.
          </p>

          <h2>HEX, RGB and HSL</h2>
          <ul>
            <li>
              <strong>HEX</strong>, such as #1F6FEB, is the most common format in web design and
              design tools.
            </li>
            <li>
              <strong>RGB</strong>, such as rgb(31, 111, 235), gives the red, green and blue amounts
              from 0 to 255.
            </li>
            <li>
              <strong>HSL</strong> describes hue, saturation and lightness. It is the easiest to
              adjust by hand: keep the hue and change the lightness to make tints and shades of the
              same colour.
            </li>
          </ul>

          <h2>From colours to a usable palette</h2>
          <p>Raw extracted colours rarely make a palette on their own. A practical structure:</p>
          <ul>
            <li>
              <strong>One main colour</strong> — the most characteristic, used for buttons, links and
              highlights.
            </li>
            <li>
              <strong>One or two accents</strong> — used sparingly for emphasis.
            </li>
            <li>
              <strong>Neutrals</strong> — a near-white, a near-black and a grey or two for backgrounds,
              text and borders. These often come from the image too, slightly adjusted.
            </li>
          </ul>
          <p>
            If a colour is close to what you want but slightly off, adjust its lightness in HSL rather
            than picking a new hue; the palette stays coherent.
          </p>

          <h2>Check which colours work for text</h2>
          <p>
            Each colour shows whether white or black text reads better on top of it, with its contrast
            ratio. Accessibility guidelines ask for at least 4.5:1 for normal text and 3:1 for large
            text. Many attractive mid-tone colours fail both, which is fine for decoration but not for
            backgrounds behind words. Check the palette for colour blindness too, with the{" "}
            <Link href="/image/color-blindness-simulator">Colour Blindness Simulator</Link>, if colours
            will carry meaning — see{" "}
            <Link href="/guides/design-for-colour-blindness">how to check a design for colour blindness</Link>
            .
          </p>

          <h2>Photos are not exact brand colours</h2>
          <p>
            Lighting, camera processing and compression all shift colours in a photograph. Picking a
            colour from a photo of a shop sign gives you a lit, compressed version of the brand colour,
            not the official value. For a company&apos;s exact colours, ask for its brand guidelines,
            or sample from a clean vector logo rather than a photo.
          </p>

          <h2>Putting the palette to work</h2>
          <p>
            Paste the CSS variables into a stylesheet, the Tailwind theme into a project configuration,
            or the HEX codes into your design tool&apos;s swatches. The main colour also makes a good
            background for a site icon in the{" "}
            <Link href="/image/favicon-generator">Favicon Generator</Link>.
          </p>
        </>
      );
    },
  },
];
