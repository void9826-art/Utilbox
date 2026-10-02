import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-02";

export const imagesQuickFixesGuides: Guide[] = [
  {
    slug: "how-to-watermark-photos",
    topic: "Images",
    title: "How to watermark your photos before sharing them online",
    seoTitle: "How to Watermark Your Photos Before Sharing",
    description:
      "Add your name or website to photos to discourage reuse and show where they came from: placement, opacity, size, and what a watermark can and cannot do.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["image-watermark", "exif-remover", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Photographers, artists, sellers and estate agents watermark images for the same reason: a
            picture shared online travels, and a name or web address on it shows where it came from. A
            good watermark does that without spoiling the picture.
          </p>

          <h2>What to write</h2>
          <ul>
            <li>Your name or business name.</li>
            <li>Your website or social handle, so people who like the picture can find you.</li>
            <li>A copyright line such as &ldquo;© 2026 Your Name&rdquo;.</li>
            <li>For listings and proofs, a word such as SAMPLE or PROOF.</li>
          </ul>
          <p>Short wording reads best; a full sentence across a photo is distracting.</p>

          <h2>Watermark a photo step by step</h2>
          <ol>
            <li>
              Add the picture to <Link href="/image/image-watermark">Add Watermark to Image</Link>.
            </li>
            <li>Type the wording.</li>
            <li>Choose a position — a corner, the centre, or tiled across the whole picture.</li>
            <li>Set the size and opacity, then download the marked copy. Your original file is untouched.</li>
          </ol>
          <p>
            The text is sized in proportion to the picture&apos;s width, so the same settings look right on
            a small web image and a full-size camera file. A soft shadow behind the text keeps white
            lettering readable over pale skies and walls. The photo is marked in your browser and is not
            uploaded.
          </p>

          <h2>Choosing a position</h2>
          <ul>
            <li>
              <strong>Corner:</strong> unobtrusive and professional, but anyone can crop it off in seconds.
              Good for portfolios where the aim is credit rather than protection.
            </li>
            <li>
              <strong>Centre:</strong> harder to remove, more visible.
            </li>
            <li>
              <strong>Tiled:</strong> repeated across the whole picture. Far harder to crop or paint out,
              and also hardest to look past — right for proofs and samples you do not want used as they
              are.
            </li>
          </ul>

          <h2>Opacity and colour</h2>
          <p>
            Keep the mark faint enough that the picture is still enjoyable. White with the built-in shadow
            works on most photographs; black suits very pale, bright images. Check the result at the size
            people will see it — a mark that looks bold on a large screen can vanish on a phone.
          </p>

          <h2>What a watermark cannot do</h2>
          <p>
            A watermark discourages casual reuse and identifies the source. It is not protection: with an
            editor and some patience, anyone determined can paint it out, especially a corner mark. If an
            image must not be used without permission, a visible tiled mark plus a lower-resolution copy is
            a stronger deterrent than any single mark.
          </p>

          <h2>Share a smaller copy</h2>
          <p>
            A full-resolution original is the most valuable version of your photo. Online, share a smaller
            copy — 1,600 to 2,000 pixels on the long side is plenty for screens — made with{" "}
            <Link href="/image/compress-image">Compress Image</Link>. It loads faster and is much less
            useful to anyone who wants to print it without asking.
          </p>

          <h2>Check the hidden data too</h2>
          <p>
            Photos can carry the camera&apos;s location, date and serial number. Before posting, check and
            strip that with the <Link href="/image/exif-remover">EXIF Viewer and Remover</Link>. Many
            photographers like to keep their copyright details in the file while removing the location; the
            tool shows exactly what each photo holds so you can decide.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-make-a-round-profile-picture",
    topic: "Images",
    title: "How to make a round profile picture with a transparent background",
    seoTitle: "How to Make a Round Profile Picture",
    description:
      "Crop a photo into a clean circle for documents, slides and email signatures, keep the corners transparent, and frame the face so it looks right small.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["circle-crop-image", "crop-image", "png-to-webp"],
    Body: function Body() {
      return (
        <>
          <p>
            Most social networks and chat apps show profile pictures as circles, but they do it themselves:
            you upload a square and they round it. A genuinely round picture is needed elsewhere — in a CV,
            a slide, an email signature, a team page or a printed badge, where nothing rounds it for you.
          </p>

          <h2>Do you need a circle at all?</h2>
          <p>
            For a social media profile, upload a square photo with the face centred; the platform applies
            the circle. Cutting the circle yourself only matters where the picture will be placed as-is.
          </p>

          <h2>Make a round picture step by step</h2>
          <ol>
            <li>
              Add the photo to <Link href="/image/circle-crop-image">Circle Crop Image</Link>.
            </li>
            <li>Zoom in until the face fills most of the circle.</li>
            <li>Add a white ring if the picture will sit on a dark background.</li>
            <li>Download the PNG.</li>
          </ol>
          <p>
            The circle is cut from the largest square the photo allows, centred. The result is always a
            PNG, because only a format with transparency keeps the corners outside the circle clear — a JPG
            would fill them with white and the circle would show as a square on any coloured background.
            The photo is processed in your browser.
          </p>

          <h2>Framing a face for a small circle</h2>
          <ul>
            <li>
              <strong>Fill the circle.</strong> Profile pictures are often shown at 40–100 pixels across.
              A face that takes up a third of the circle becomes unrecognisable that small.
            </li>
            <li>
              <strong>Head and top of the shoulders</strong> is the usual framing, with a little space above
              the hair.
            </li>
            <li>
              <strong>Centre the face.</strong> The circle is taken from the middle of the photo, so if the
              face is off to one side, crop the photo first with <Link href="/image/crop-image">Crop
              Image</Link> to put it in the centre.
            </li>
            <li>
              <strong>Plain background.</strong> A busy background competes with the face at small sizes.
            </li>
          </ul>

          <h2>Choosing the photo</h2>
          <p>
            Use the sharpest, best-lit photo you have, taken in daylight facing a window. A photo cropped
            from a group shot is usually too small and soft; a dedicated photo taken from about a metre
            away works far better. For professional use, a neutral background and a natural expression
            age well.
          </p>

          <h2>The ring</h2>
          <p>
            A white ring separates the picture from a dark page or slide. On a white page it is invisible,
            so leave it off there.
          </p>

          <h2>Size</h2>
          <p>
            The result is as large as the shorter side of your original, so nothing is invented or thrown
            away. For a website, a smaller file loads faster: reduce the pixel size with{" "}
            <Link href="/image/resize-image">Resize Image</Link>, or convert it with{" "}
            <Link href="/image/png-to-webp">PNG to WebP</Link>, which keeps the transparent corners.
          </p>

          <h2>Using it in documents and slides</h2>
          <p>
            Insert the PNG as a picture. Because the corners are transparent, it sits cleanly on any
            background colour without a white box, and it looks the same in every program you open it in.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-convert-svg-to-png",
    topic: "Images",
    title: "How to convert an SVG to a PNG at the right size",
    seoTitle: "How to Convert SVG to PNG at the Right Size",
    description:
      "Turn an SVG logo or icon into a sharp PNG for places that only accept pixel images, choose the export size, and fix missing fonts and images.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["svg-to-png", "favicon-generator", "png-to-webp"],
    Body: function Body() {
      return (
        <>
          <p>
            SVG is the ideal format for logos and icons: it scales to any size without blurring. But many
            places only accept pixel images — social media, many document editors, email signatures,
            upload forms. Converting to PNG solves that, as long as you choose the size carefully.
          </p>

          <h2>What makes SVG different</h2>
          <p>
            An SVG contains no pixels. It is a set of drawing instructions: a circle here, a curve there,
            this colour. A program draws it fresh at whatever size it is displayed, which is why it never
            goes blurry. A PNG, by contrast, is a fixed grid of pixels. Converting means drawing the SVG
            once, at a size you choose, and keeping the result.
          </p>

          <h2>Convert step by step</h2>
          <ol>
            <li>
              Add the SVG to <Link href="/image/svg-to-png">SVG to PNG</Link>.
            </li>
            <li>Set the output width. The height follows the drawing&apos;s proportions.</li>
            <li>Keep the background transparent, or switch it to white.</li>
            <li>Render and download the PNG.</li>
          </ol>
          <p>The drawing is rendered in your browser at exactly the size you set.</p>

          <h2>What size to export</h2>
          <p>
            Because a PNG cannot be enlarged without going soft, export at the largest size you will need.
            A good rule is twice the size it will be displayed at, so it stays sharp on high-density
            screens such as phones and modern laptops.
          </p>
          <ul>
            <li>A logo shown 200 pixels wide on a website: export at 400.</li>
            <li>A logo for slides and documents: around 1,000–2,000 pixels wide.</li>
            <li>An icon: export at the size requested, or the largest of several sizes.</li>
          </ul>
          <p>When unsure, 1,024 pixels wide covers most uses.</p>

          <h2>Transparent or white?</h2>
          <p>
            Keep transparency for logos that will sit on coloured backgrounds. Choose white for documents
            and presentations that show transparency as a grey checkerboard, and for any destination that
            may turn transparent areas black.
          </p>

          <h2>When the result looks wrong</h2>
          <ul>
            <li>
              <strong>Text in the wrong font, or missing.</strong> The SVG refers to a font that is not
              available. In your drawing program, convert text to outlines (paths) and export the SVG again.
            </li>
            <li>
              <strong>Missing pictures.</strong> The SVG links to an external image file that is not
              included. Embed the image in the SVG before exporting it.
            </li>
            <li>
              <strong>Missing styles.</strong> An SVG styled by an external stylesheet loses those styles
              when drawn on its own. Export with styles inline.
            </li>
            <li>
              <strong>Animation.</strong> Only the first frame is drawn; a PNG cannot hold animation.
            </li>
          </ul>

          <h2>Smaller files for the web</h2>
          <p>
            A PNG of a simple logo is usually small. For larger graphics on a website,{" "}
            <Link href="/image/png-to-webp">PNG to WebP</Link> keeps the transparency at a fraction of the
            size. But on your own website, consider using the SVG directly — it is often smaller still and
            perfectly sharp.
          </p>

          <h2>Website icons</h2>
          <p>
            If the SVG is your logo and you need a browser-tab icon, the{" "}
            <Link href="/image/favicon-generator">Favicon Generator</Link> accepts SVG directly and produces
            every size browsers and phones look for. See{" "}
            <Link href="/guides/how-to-make-a-favicon">how to make a favicon</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "photo-to-black-and-white",
    topic: "Images",
    title: "How to turn a photo black and white — the three methods compared",
    seoTitle: "How to Turn a Photo Black and White Properly",
    description:
      "Convert a colour photo to black and white, see why the method changes the result, and when high contrast makes photographed text easier to read.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["grayscale-image", "color-blindness-simulator", "pdf-grayscale"],
    Body: function Body() {
      return (
        <>
          <p>
            Turning a colour picture grey sounds like one operation, but there are several ways to decide
            how grey each colour becomes, and they give visibly different results. A red dress can come out
            almost black or a pleasant mid-grey depending on the method.
          </p>

          <h2>Three ways to convert</h2>
          <p>
            The <Link href="/image/grayscale-image">Black and White Image Converter</Link> offers three:
          </p>
          <ul>
            <li>
              <strong>Natural</strong> weights the colour channels the way the eye judges brightness —
              roughly 21% red, 72% green and 7% blue, the Rec. 709 standard. Colours that look equally
              bright stay equally bright in grey. This is the right choice for most photographs.
            </li>
            <li>
              <strong>Flat</strong> takes a plain average of red, green and blue. It is the naive method:
              reds tend to look darker and greens lighter than they appeared. Occasionally that is the
              effect you want.
            </li>
            <li>
              <strong>High contrast</strong> applies the natural weighting, then pushes tones away from
              mid-grey, deepening blacks and brightening whites. It makes photographed or scanned text
              much easier to read, at the cost of subtle detail in a photograph.
            </li>
          </ul>

          <h2>Convert step by step</h2>
          <ol>
            <li>Add the picture.</li>
            <li>Pick a method — Natural for photos, High contrast for documents.</li>
            <li>Compare the result with the original shown above it.</li>
            <li>Download the PNG.</li>
          </ol>
          <p>The conversion runs in your browser; the picture is not uploaded.</p>

          <h2>Why reds go dark</h2>
          <p>
            The eye is much less sensitive to red than to green, so a pure red has little brightness and
            becomes a dark grey under the natural method. That is accurate to how bright it looks, but it
            can surprise you with red logos, lipstick or traffic signs. Flat mode lightens red, at the cost
            of accuracy elsewhere.
          </p>

          <h2>Black and white for documents</h2>
          <p>
            For a photo of a printed page, a receipt or a whiteboard, High contrast turns a grey,
            shadowy image into dark text on a clean background. It is a quick improvement before sending a
            photographed document, or before reading the text out with OCR. For whole PDF documents, use{" "}
            <Link href="/pdf/pdf-grayscale">Convert PDF to Grayscale</Link> instead.
          </p>

          <h2>Black and white for design checks</h2>
          <p>
            Converting a design to grey is a fast test of whether it relies on colour alone: if two
            important elements become the same grey, people who cannot see that colour difference — or who
            print in black and white — lose the distinction. For a fuller check, the{" "}
            <Link href="/image/color-blindness-simulator">Colour Blindness Simulator</Link> shows the main
            types of colour vision deficiency.
          </p>

          <h2>Things to know</h2>
          <ul>
            <li>
              <strong>Keep the original.</strong> Colour information is discarded and cannot be recovered
              from the grey version.
            </li>
            <li>
              <strong>File size barely changes.</strong> The result still has three colour channels with
              equal values. To share a photo, convert the PNG to JPG for a smaller file.
            </li>
            <li>
              <strong>Greyscale is not pure black and white.</strong> It keeps every shade of grey. A
              two-tone image, with only black and white, is a different effect.
            </li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "fix-sideways-photos",
    topic: "Images",
    title: "Why photos appear sideways — and how to fix them for good",
    seoTitle: "Why Photos Appear Sideways and How to Fix Them",
    description:
      "A photo upright on your phone shows sideways on a website or computer. Here is why orientation data causes it, and how to rotate the picture permanently.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["rotate-image", "exif-remover", "crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            The photo looks perfect on your phone. You upload it to a website, attach it to an email or
            open it on a computer — and it is lying on its side. Nothing is wrong with the picture. It is
            being shown by a program that ignores one small piece of information inside the file.
          </p>

          <h2>Why it happens</h2>
          <p>
            A phone&apos;s camera sensor always captures the image the same way round, whichever way you
            hold the phone. Rather than turning the pixels, many cameras save the picture as captured and
            add a note to the file&apos;s EXIF data saying &ldquo;rotate this 90 degrees to display&rdquo;.
            Programs that read the note show the photo upright. Programs that ignore it — some websites,
            older software, some upload systems — show the raw pixels, on their side.
          </p>

          <h2>The permanent fix: rotate the pixels</h2>
          <ol>
            <li>
              Add the photo to <Link href="/image/rotate-image">Rotate Image</Link>. It appears the way
              your browser displays it.
            </li>
            <li>If it is not upright, use the quarter-turn buttons until it is.</li>
            <li>Download the result.</li>
          </ol>
          <p>
            The saved picture has its pixels stored the right way up, so every program shows it correctly,
            whether or not it reads orientation notes. Quarter turns and flips are exact: no pixels are
            resampled and nothing is lost.
          </p>

          <h2>Straightening a tilted horizon</h2>
          <p>
            For a photo that is a few degrees off — a sloping horizon, a leaning building — drag the angle
            slider a little at a time until a line you know should be level looks level. Rotating by an
            arbitrary angle leaves empty corners, filled with the background colour you choose; crop them
            away afterwards with <Link href="/image/crop-image">Crop Image</Link>. This kind of rotation
            does resample the image, so expect a very slight softening.
          </p>

          <h2>Mirror images</h2>
          <p>
            Front cameras often save selfies mirrored, so writing in the background reads backwards. Flip
            the picture horizontally to correct it. Flipping is different from rotating: it mirrors the
            image rather than turning it.
          </p>

          <h2>Removing location data without breaking orientation</h2>
          <p>
            The orientation note lives in the same EXIF data as the photo&apos;s location and camera
            details. A careless metadata remover deletes the note too, and the cleaned photo turns
            sideways. The <Link href="/image/exif-remover">EXIF Viewer and Remover</Link> keeps just the
            orientation value by default while removing everything else, so cleaned photos stay upright.
          </p>

          <h2>Preventing it</h2>
          <ul>
            <li>Rotating the photo in your phone&apos;s gallery app and saving usually fixes the pixels for that photo.</li>
            <li>Sending photos through apps that re-process them often fixes orientation along the way.</li>
            <li>For photos going to a website or a system you know is fussy, rotating them first is the reliable route.</li>
          </ul>

          <h2>If you run a website</h2>
          <p>
            Modern browsers honour the orientation note when displaying images, but image processing on
            the server may not. If uploads from phones appear sideways on your site, the fix is to apply
            the orientation when processing uploads, then store the image upright.
          </p>
        </>
      );
    },
  },

  {
    slug: "png-to-jpg-transparent-background",
    topic: "Images",
    title: "PNG to JPG: what happens to a transparent background",
    seoTitle: "PNG to JPG: What Happens to Transparency",
    description:
      "Converting a transparent PNG to JPG fills the clear areas with a colour. Here is how to choose it, when to convert at all, and how much smaller the file gets.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["png-to-jpg", "png-to-webp", "jpg-to-png"],
    Body: function Body() {
      return (
        <>
          <p>
            PNG files can have transparent areas — the clear background around a logo or a cut-out product
            photo. JPG files cannot. So when you convert a transparent PNG to JPG, something has to fill
            those areas, and if you do not choose, a converter may choose black.
          </p>

          <h2>Why JPG has no transparency</h2>
          <p>
            JPG stores only colour for each pixel. PNG can also store an alpha channel — how see-through
            each pixel is. When the alpha channel is dropped, every transparent pixel needs a solid colour.
            A careful converter blends the picture onto a background colour you choose; a careless one
            leaves the underlying values, which usually show as black.
          </p>

          <h2>Convert step by step</h2>
          <ol>
            <li>
              Add the PNG files to <Link href="/image/png-to-jpg">PNG to JPG</Link>.
            </li>
            <li>
              Choose the background colour for transparent areas. White suits most uses; match it to the
              page or slide the image will sit on.
            </li>
            <li>Set the quality — around 85 is a good default.</li>
            <li>Download the JPGs.</li>
          </ol>
          <p>
            Semi-transparent edges — the soft outline of a logo or a shadow — are blended with the colour
            you choose, so they stay smooth instead of turning jagged. The files are converted in your
            browser.
          </p>

          <h2>Watch the edges</h2>
          <p>
            A logo with soft, anti-aliased edges is blended with the background colour you choose. If that
            colour differs from the page the JPG ends up on — white chosen, but the slide is grey — a faint
            light fringe appears around the logo. Match the background colour to the destination, and zoom in
            on the edges of the result before using it. If the image will appear on several different
            backgrounds, that is the sign to keep a transparent format instead.
          </p>

          <h2>When converting is worth it</h2>
          <ul>
            <li>
              <strong>Photographs saved as PNG.</strong> Converting to JPG typically cuts the size by
              70–85%, with no visible difference.
            </li>
            <li>
              <strong>Upload forms that only accept JPG.</strong>
            </li>
            <li>
              <strong>Product photos</strong> going onto a white page, where a white background is wanted
              anyway.
            </li>
          </ul>

          <h2>When to keep the PNG</h2>
          <ul>
            <li>
              <strong>Logos and graphics that must sit on different backgrounds.</strong> Once flattened,
              the background colour is part of the picture.
            </li>
            <li>
              <strong>Screenshots and images with text.</strong> JPG compression smudges sharp edges and
              often saves little on flat graphics.
            </li>
            <li>
              <strong>Images you will edit again.</strong> Every JPG save loses a little more detail.
            </li>
          </ul>

          <h2>The best of both: WebP</h2>
          <p>
            For a website, <Link href="/image/png-to-webp">PNG to WebP</Link> often gives a file as small as
            a JPG while keeping the transparency. Every current browser displays WebP. JPG remains the safe
            choice for email, documents and upload forms.
          </p>

          <h2>Going the other way</h2>
          <p>
            <Link href="/image/jpg-to-png">JPG to PNG</Link> does not create transparency — the background
            stays solid — and it does not restore detail the JPG discarded. It is useful when you will edit
            an image repeatedly, or when something insists on PNG. Removing a background to make it
            transparent is a separate job for an image editor.
          </p>

          <h2>Keep the original</h2>
          <p>
            Keep the transparent PNG as your master copy and make JPGs from it as needed. A flattened JPG
            cannot be turned back into a transparent image.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-download-a-youtube-thumbnail",
    topic: "Images",
    title: "How to save a YouTube video's thumbnail at full resolution",
    seoTitle: "How to Save a YouTube Thumbnail at Full Size",
    description:
      "Get the thumbnail image for any YouTube video or Short at the largest size available, understand the sizes, and use thumbnails responsibly.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["youtube-thumbnail-downloader", "crop-image", "image-converter"],
    Body: function Body() {
      return (
        <>
          <p>
            Every YouTube video has a thumbnail — the picture shown before you press play. Creators want
            copies of their own for portfolios and other platforms; reviewers and teachers want them for
            reference and slides. YouTube does not offer a download button, but the images are public files
            that can be saved directly.
          </p>

          <h2>Save a thumbnail step by step</h2>
          <ol>
            <li>Copy the video&apos;s address from the browser or the app&apos;s Share button.</li>
            <li>
              Paste it into the <Link href="/image/youtube-thumbnail-downloader">YouTube Thumbnail Grabber</Link>.
              A full link, a youtu.be short link, a Shorts link or just the 11-character video ID all work.
            </li>
            <li>The sizes that exist for that video appear as previews.</li>
            <li>Press Download under the one you want.</li>
          </ol>
          <p>
            YouTube serves thumbnails as ordinary public image files named by video ID, so no API key or
            login is involved. The tool works out the ID from what you paste and requests the images from
            YouTube&apos;s image server; only the video ID is involved.
          </p>

          <h2>Finding the video ID</h2>
          <p>
            Every YouTube video has an 11-character ID made of letters, digits, hyphens and underscores. It
            appears in every form of link:
          </p>
          <ul>
            <li>
              after <code>watch?v=</code> in a normal link, up to any &amp;;
            </li>
            <li>
              after <code>youtu.be/</code> in a short link;
            </li>
            <li>
              after <code>/shorts/</code> for a Short.
            </li>
          </ul>
          <p>
            Extra parts such as a start time or playlist are ignored, so you can paste the address exactly as
            you copied it.
          </p>

          <h2>The sizes</h2>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Shape</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1280 × 720</td>
                <td>Widescreen 16:9</td>
              </tr>
              <tr>
                <td>640 × 480</td>
                <td>4:3, with bars</td>
              </tr>
              <tr>
                <td>480 × 360</td>
                <td>4:3, with bars</td>
              </tr>
              <tr>
                <td>320 × 180</td>
                <td>Widescreen 16:9</td>
              </tr>
            </tbody>
          </table>
          <p>
            Not every video has the largest size: older uploads and some lower-resolution videos stop at
            480 × 360. Sizes that do not exist are left out rather than offered as broken downloads.
          </p>

          <h2>Black bars</h2>
          <p>
            The 640 × 480 and 480 × 360 versions have a 4:3 shape, so a widescreen thumbnail inside them
            gets black bars above and below. Take the 1280 × 720 version when it exists. If only a 4:3 size
            is available, trim the bars with <Link href="/image/crop-image">Crop Image</Link> using the
            16:9 preset.
          </p>

          <h2>Converting the file</h2>
          <p>
            Thumbnails download as JPG, which opens everywhere. To change format or shrink a batch for a
            website, use the <Link href="/image/image-converter">Image Converter</Link>.
          </p>

          <h2>Using thumbnails responsibly</h2>
          <p>
            A thumbnail belongs to whoever made the video. Using one for reference, in a review or
            commentary, in teaching material, or as a link preview pointing to the video is ordinary use.
            Republishing it as your own artwork, or using it to promote something unrelated, is not. When
            you show someone else&apos;s thumbnail, credit the channel and link to the video. For your own
            videos, saving your thumbnails is a handy way to reuse them on other platforms or in a
            portfolio.
          </p>

          <h2>Designing your own thumbnails</h2>
          <p>
            If you are studying thumbnails to improve your own, look at them at the size viewers do — a
            few centimetres across on a phone. Large faces, few words and strong contrast are what remain
            readable at that size. Upload your own at 1280 × 720, the size YouTube recommends.
          </p>
        </>
      );
    },
  },

  {
    slug: "image-aspect-ratios-explained",
    topic: "Images",
    title: "Image aspect ratios explained: 16:9, 4:3, 3:2, 1:1 and 9:16",
    seoTitle: "Image Aspect Ratios Explained: 16:9, 4:3, 1:1",
    description:
      "What aspect ratios mean, which one each screen, camera and platform uses, and how to crop a picture to a ratio without stretching it.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["crop-image", "resize-image", "instagram-image-resizer"],
    Body: function Body() {
      return (
        <>
          <p>
            An aspect ratio is the shape of a picture: its width compared with its height. 16:9 means 16
            units wide for every 9 tall, whatever the actual size. Getting the shape right before resizing
            is what stops pictures being stretched, squashed or awkwardly cropped by the place you upload
            them.
          </p>

          <h2>The common ratios</h2>
          <table>
            <thead>
              <tr>
                <th>Ratio</th>
                <th>Used for</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>16:9</td>
                <td>TV, monitors, YouTube, presentations</td>
                <td>1920 × 1080</td>
              </tr>
              <tr>
                <td>9:16</td>
                <td>Stories, Reels, Shorts, phone screens</td>
                <td>1080 × 1920</td>
              </tr>
              <tr>
                <td>4:3</td>
                <td>Many phone cameras, older screens, tablets</td>
                <td>4000 × 3000</td>
              </tr>
              <tr>
                <td>3:2</td>
                <td>Most system cameras, 6 × 4 photo prints</td>
                <td>6000 × 4000</td>
              </tr>
              <tr>
                <td>1:1</td>
                <td>Profile pictures, square posts</td>
                <td>1080 × 1080</td>
              </tr>
              <tr>
                <td>4:5</td>
                <td>Portrait feed posts</td>
                <td>1080 × 1350</td>
              </tr>
            </tbody>
          </table>

          <h2>Working out a ratio</h2>
          <p>
            Divide the width and height by their largest common factor. 1920 × 1080 divides by 120 to give
            16 × 9. For sizes that do not simplify neatly, divide width by height: 1.78 is 16:9, 1.5 is
            3:2, 1.33 is 4:3 and 1 is square.
          </p>

          <h2>Why stretching happens</h2>
          <p>
            Resizing a 4:3 photo to 1920 × 1080 without cropping forces it into a different shape, so
            everything is stretched sideways — faces look wide, circles become ovals. The fix is always the
            same: crop to the new shape first, then resize.
          </p>

          <h2>Crop to a ratio step by step</h2>
          <ol>
            <li>
              Add the picture to <Link href="/image/crop-image">Crop Image</Link>.
            </li>
            <li>
              Choose a preset — 1:1, 4:3, 3:2, 16:9 or 9:16 — or type exact pixel values for any other
              shape.
            </li>
            <li>Drag the selection over the part of the picture to keep.</li>
            <li>Crop and download, then resize if you need specific dimensions.</li>
          </ol>
          <p>
            The crop is cut from the full-resolution original, so nothing is lost but the area outside the
            selection. Then use <Link href="/image/resize-image">Resize Image</Link> with the aspect lock on
            to reach the exact pixel size.
          </p>

          <h2>Crop or pad?</h2>
          <p>
            Cropping removes part of the picture to fit the shape. When nothing can be lost — a screenshot,
            a poster, a graphic with text near the edges — the alternative is padding: fit the whole picture
            inside the frame and fill the leftover space with a colour. The{" "}
            <Link href="/image/instagram-image-resizer">Instagram Image Resizer</Link> offers both for
            social media sizes.
          </p>

          <h2>Converting between common shapes</h2>
          <ul>
            <li>
              <strong>4:3 phone photo to 16:9:</strong> you lose about a quarter of the height, a strip
              from the top and bottom.
            </li>
            <li>
              <strong>16:9 to 1:1:</strong> you lose almost half the width, so keep the subject central.
            </li>
            <li>
              <strong>3:2 camera photo to a 6 × 4 print:</strong> no crop needed — 6 × 4 is 3:2.
            </li>
            <li>
              <strong>3:2 to a 10 × 8 print:</strong> 10 × 8 is 5:4, so a noticeable strip comes off the
              long side. Print shops crop it for you unless you do it first.
            </li>
          </ul>

          <h2>Shoot with the end in mind</h2>
          <p>
            If you know a photo is for a vertical Story, shoot it vertically. Cropping a 16:9 landscape
            photo to 9:16 throws away about two-thirds of it — and most of its detail.
          </p>
        </>
      );
    },
  },
];
