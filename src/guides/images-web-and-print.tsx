import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-01";

export const imagesWebAndPrintGuides: Guide[] = [
  {
    slug: "jpg-vs-png-vs-webp",
    topic: "Images",
    title: "JPG, PNG, WebP or AVIF: which image format should you use?",
    seoTitle: "JPG vs PNG vs WebP vs AVIF: Which Format to Use",
    description:
      "What each image format is good at, which one to choose for photos, screenshots, logos and websites, and why converting never improves a picture.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["image-converter", "png-to-webp", "jpg-to-webp", "jpg-to-avif", "svg-to-png"],
    Body: function Body() {
      return (
        <>
          <p>
            The same picture can be a 200 KB file or a 4 MB file depending on the format it is saved
            in — and it can look sharp or smeared for the same reason. Choosing the format is not a
            matter of taste. Each one was designed for a particular kind of image, and using it for
            the wrong kind costs either quality or size.
          </p>

          <h2>Lossy and lossless</h2>
          <p>
            Every format falls on one side of a basic divide. <strong>Lossless</strong> formats store
            every pixel exactly; open and save the file a hundred times and nothing changes.{" "}
            <strong>Lossy</strong> formats throw away detail the eye is unlikely to notice, mostly
            fine variation in colour, in exchange for much smaller files. Lossy compression is
            wonderful for photographs and poor for sharp edges such as text, where the discarded
            detail shows as smudges and halos.
          </p>

          <h2>The formats, one by one</h2>
          <ul>
            <li>
              <strong>JPG (JPEG)</strong> — lossy, no transparency. The universal format for
              photographs: every device, program and upload form accepts it. Poor for screenshots,
              text and logos.
            </li>
            <li>
              <strong>PNG</strong> — lossless, with full transparency. Ideal for screenshots, logos,
              diagrams and anything with text or hard edges. Large for photographs, often several
              times the size of a JPG.
            </li>
            <li>
              <strong>WebP</strong> — can be lossy or lossless, and supports transparency. Typically
              25–35% smaller than JPG at the same visible quality. Every current browser displays
              it, though some older desktop programs and email clients still do not.
            </li>
            <li>
              <strong>AVIF</strong> — a newer format based on the AV1 video codec, usually smaller
              again than WebP and particularly good with gradients. Browsers display it; creating
              it is slower, and not every browser can.
            </li>
            <li>
              <strong>SVG</strong> — not pixels at all but drawing instructions, so it stays sharp at
              any size. Best for logos and icons that were drawn in a vector program.
            </li>
            <li>
              <strong>HEIC</strong> — the format iPhones save photos in. Efficient, but many programs
              and websites cannot open it, so it is usually converted to JPG for sharing.
            </li>
          </ul>

          <h2>Which one for which job</h2>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Best choice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Photo to email or upload to a form</td>
                <td>JPG</td>
              </tr>
              <tr>
                <td>Photo on your own website</td>
                <td>WebP, or AVIF with a fallback</td>
              </tr>
              <tr>
                <td>Screenshot or diagram</td>
                <td>PNG, or lossless WebP on the web</td>
              </tr>
              <tr>
                <td>Logo with a transparent background</td>
                <td>SVG if you have it, otherwise PNG</td>
              </tr>
              <tr>
                <td>Image you will keep editing</td>
                <td>PNG, or your editor&apos;s own format</td>
              </tr>
              <tr>
                <td>Picture in an email newsletter</td>
                <td>JPG or PNG</td>
              </tr>
            </tbody>
          </table>

          <h2>Converting never adds quality</h2>
          <p>
            This is the most common misunderstanding about formats. Converting a JPG to PNG does not
            undo the JPEG compression; the blocks and smudges are already part of the pixels, and
            the PNG just stores them exactly — in a much larger file. Converting a JPG to WebP or
            AVIF compresses it a second time, which can only lose more. The rule is simple: always
            convert from the best original you have, never from a copy that has already been
            compressed.
          </p>

          <h2>Transparency</h2>
          <p>
            Only PNG, WebP, AVIF and SVG can have transparent areas. JPG cannot, so converting a
            cut-out logo to JPG fills the clear areas with a solid colour — the familiar white box
            around a logo on a coloured page. If an image needs to sit on different backgrounds,
            keep it in a format with transparency.
          </p>

          <h2>For websites: a practical workflow</h2>
          <ol>
            <li>Keep a full-quality master of every image — the camera JPG, or a PNG export from your design tool.</li>
            <li>
              Resize to the largest size the page will actually show it at, perhaps 1,600 pixels wide
              for a full-width photo.
            </li>
            <li>
              Export WebP for photographs with <Link href="/image/jpg-to-webp">JPG to WebP</Link>, and
              for graphics with <Link href="/image/png-to-webp">PNG to WebP</Link>, which keeps
              transparency.
            </li>
            <li>
              If you want the smallest files, also make AVIF versions with{" "}
              <Link href="/image/jpg-to-avif">JPG to AVIF</Link> and serve them with WebP or JPG as a
              fallback, using the HTML picture element.
            </li>
          </ol>
          <p>
            The <Link href="/image/image-converter">Image Converter</Link> handles JPG, PNG and WebP
            in one batch, with an optional maximum width so oversized photos are scaled down in the
            same pass.
          </p>

          <h2>Logos and icons</h2>
          <p>
            If a logo exists as an SVG, use the SVG wherever it is accepted. Where pixels are
            required — social media, documents, some email clients — render it to PNG at twice the
            size it will be displayed with <Link href="/image/svg-to-png">SVG to PNG</Link>, so it
            stays sharp on high-density screens.
          </p>

          <h2>What about GIF?</h2>
          <p>
            GIF is an old format limited to 256 colours. It survives because it animates everywhere,
            but for still images PNG is better in every respect, and for animation a short video or
            an animated WebP is usually far smaller.
          </p>
        </>
      );
    },
  },

  {
    slug: "what-dpi-means-for-printing",
    topic: "Images",
    title: "What DPI means — and when 300 DPI actually matters",
    seoTitle: "What DPI Means and When 300 DPI Matters",
    description:
      "DPI explained simply: why “send it at 300 DPI” is half an instruction, how many pixels a print needs, and what to do when you don't have enough.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["image-dpi-changer", "resize-image", "crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            &ldquo;Please supply images at 300 DPI.&rdquo; Print shops, publishers and application
            forms ask for it constantly, and it confuses almost everyone — because on its own, it does
            not say enough to act on.
          </p>

          <h2>What DPI actually is</h2>
          <p>
            DPI stands for dots per inch. For a digital image the more precise term is PPI, pixels per
            inch, but the two are used interchangeably. It describes how densely an image&apos;s
            pixels are laid down when it is printed: at 300 DPI, every inch of paper carries 300
            pixels across and 300 down.
          </p>
          <p>
            The important part is that DPI is not a property of the picture&apos;s quality. It is a
            number stored in the file that says how big to print it. The same 1,800-pixel-wide photo
            prints 6 inches wide at 300 DPI and 24 inches wide at 75 DPI — with exactly the same
            pixels.
          </p>

          <h2>The only formula you need</h2>
          <p>
            <strong>pixels = inches × DPI</strong>
          </p>
          <p>Or the other way round: inches = pixels ÷ DPI. At 300 DPI, common prints need:</p>
          <table>
            <thead>
              <tr>
                <th>Print size</th>
                <th>Pixels needed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>6 × 4 in (15 × 10 cm)</td>
                <td>1800 × 1200</td>
              </tr>
              <tr>
                <td>7 × 5 in</td>
                <td>2100 × 1500</td>
              </tr>
              <tr>
                <td>10 × 8 in</td>
                <td>3000 × 2400</td>
              </tr>
              <tr>
                <td>A4 (210 × 297 mm)</td>
                <td>2480 × 3508</td>
              </tr>
              <tr>
                <td>A3 (297 × 420 mm)</td>
                <td>3508 × 4961</td>
              </tr>
            </tbody>
          </table>
          <p>
            A typical 12-megapixel phone photo is 4,000 × 3,000 pixels, enough for about 13.3 × 10
            inches at 300 DPI — comfortably more than most people ever print.
          </p>

          <h2>Why &ldquo;300 DPI&rdquo; on its own is half an instruction</h2>
          <p>
            A printer who asks for 300 DPI really means: &ldquo;send enough pixels to print at this
            size at 300 DPI&rdquo;. Changing the DPI number in a file without changing its pixels only
            changes the printed size it suggests. A small web image relabelled as 300 DPI simply
            becomes a tiny print. So when you are asked for 300 DPI, also ask — or check — the
            physical size it will be printed at, then work out the pixels.
          </p>

          <h2>Does 300 matter?</h2>
          <p>
            300 DPI is the standard for things held in the hand and looked at closely: photo prints,
            brochures, books, passport photos. Below about 200, fine detail and small text begin to
            look soft at reading distance.
          </p>
          <p>
            Things seen from further away need far less. A poster read from across a room looks
            fine at 150 DPI, and large banners and billboards are printed at much lower densities
            still, because nobody stands close enough to see individual pixels. That same 12-megapixel
            photo makes a perfectly good 26.7 × 20 inch poster at 150 DPI.
          </p>

          <h2>Screens ignore DPI completely</h2>
          <p>
            On a website, a phone or in a presentation, an image is shown by its pixels. The DPI
            number stored in the file has no effect at all. A 1,200-pixel-wide image looks the same
            whether it says 72 DPI or 300 DPI. The old idea that screen images must be &ldquo;72
            DPI&rdquo; is a leftover from early Macs and has no practical meaning today.
          </p>

          <h2>Setting the DPI for a print</h2>
          <p>
            <Link href="/image/image-dpi-changer">Change Image DPI</Link> offers the two honest
            options:
          </p>
          <ul>
            <li>
              <strong>Keep pixels</strong> — change only the DPI number, leaving the picture exactly as
              it is. Use this when the image already has enough pixels for the print size and the
              printer simply wants the file to say 300.
            </li>
            <li>
              <strong>Resize pixels</strong> — enter the physical width you need, and the image is
              recalculated so it measures exactly that at the chosen DPI.
            </li>
          </ul>

          <h2>When you do not have enough pixels</h2>
          <p>
            Enlarging an image cannot invent detail that was never captured. Stretching a 600-pixel
            picture to the 2,400 pixels a print needs makes it softer, whatever the DPI label says.
            Your options, best first:
          </p>
          <ol>
            <li>Find a larger original — the camera file rather than a copy from social media or a messaging app.</li>
            <li>Print smaller, at the size the pixels you have can support.</li>
            <li>Accept a lower DPI if the print will be seen from a distance.</li>
            <li>Enlarge modestly; up to about 150% usually still looks acceptable.</li>
          </ol>

          <h2>Cropping costs pixels</h2>
          <p>
            Every crop removes pixels, so a tightly cropped detail from a photo may no longer have
            enough for a large print. Crop with <Link href="/image/crop-image">Crop Image</Link>{" "}
            first, look at the remaining pixel dimensions, and work out the print size they support
            before ordering. To reduce an over-large image for the web instead, use{" "}
            <Link href="/image/resize-image">Resize Image</Link>, which works in pixels.
          </p>

          <h2>How to check an image&apos;s DPI and size</h2>
          <p>
            On Windows, right-click the file, choose Properties and open the Details tab: it lists
            the dimensions in pixels and the horizontal and vertical resolution. On a Mac, open the
            image in Preview and choose Show Inspector from the Tools menu. Remember that the pixel
            dimensions are the figure that really matters.
          </p>
        </>
      );
    },
  },

  {
    slug: "how-to-make-a-favicon",
    topic: "Images",
    title: "How to make a favicon for your website",
    seoTitle: "How to Make a Favicon for Your Website",
    description:
      "Design a favicon that still reads at 16 pixels, create every file browsers and phones look for, and add it to your site so it actually shows up.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["favicon-generator", "svg-to-png", "image-color-palette"],
    Body: function Body() {
      return (
        <>
          <p>
            A favicon is the small icon in a browser tab, a bookmark list, a phone&apos;s home screen
            and — increasingly — next to your site in search results. It is a tiny file, but a
            missing or blurry one makes a site look unfinished.
          </p>

          <h2>The files a website needs</h2>
          <p>
            Different browsers and devices look for different files, which is why one image is not
            enough. A complete set covers:
          </p>
          <ul>
            <li>
              <strong>favicon.ico</strong> — containing 16, 32 and 48-pixel versions, for browser
              tabs and Windows. Browsers request /favicon.ico automatically, even when a page
              declares nothing.
            </li>
            <li>
              <strong>16 and 32-pixel PNGs</strong> — the versions modern browsers prefer for tabs.
            </li>
            <li>
              <strong>apple-touch-icon.png</strong>, 180 × 180 pixels — used when someone adds your
              site to an iPhone or iPad home screen.
            </li>
            <li>
              <strong>192 and 512-pixel PNGs</strong> — for Android home screens and installable web
              apps.
            </li>
            <li>
              <strong>site.webmanifest</strong> — a small file that tells Android and browsers your
              site&apos;s name and where these icons are.
            </li>
          </ul>
          <p>The <Link href="/image/favicon-generator">Favicon Generator</Link> produces all of them in one ZIP.</p>

          <h2>Design for 16 pixels</h2>
          <p>
            The hardest part of a favicon is that its most common size is 16 × 16 pixels — 256 dots in
            total. A full logo with a wordmark becomes an unreadable smudge. What works:
          </p>
          <ul>
            <li>
              <strong>One bold shape or a single letter</strong>, taken from your logo. Most
              well-known favicons are a monogram or a symbol, not the full logo.
            </li>
            <li>
              <strong>Strong contrast</strong>. Tabs can be light or dark, so a mid-grey icon on a
              transparent background can vanish in one of them. A solid background shape — a rounded
              square or a circle — guarantees contrast on both.
            </li>
            <li>
              <strong>Some padding</strong>, so the design does not touch the edges.
            </li>
            <li>
              <strong>Your brand colour</strong>. If you are not sure of the exact value, the{" "}
              <Link href="/image/image-color-palette">Color Palette Extractor</Link> reads it from
              your logo as a HEX code.
            </li>
          </ul>
          <p>
            The generator shows enlarged previews of the small sizes. Keep simplifying until the
            16-pixel version is still recognisable.
          </p>

          <h2>Make the favicon step by step</h2>
          <ol>
            <li>
              Start with a square source: a logo exported at 512 pixels or larger, an SVG, or simply
              one or two letters or an emoji typed into the generator.
            </li>
            <li>Choose the shape, padding and background, and watch the small previews.</li>
            <li>Enter your site name for the web manifest.</li>
            <li>Download the ZIP.</li>
          </ol>
          <p>
            If your logo is an SVG with fonts or linked images in it, you may get a better result by
            first rendering it to a large PNG with <Link href="/image/svg-to-png">SVG to PNG</Link>,
            checking it looks right, and using that as the source.
          </p>

          <h2>Add it to your site</h2>
          <ol>
            <li>
              Upload the files to the root of your site, so they are served from addresses such as
              example.com/favicon.ico and example.com/apple-touch-icon.png.
            </li>
            <li>
              Paste the HTML the generator gives you into the head section of every page — in a
              site template or theme this is usually one shared file.
            </li>
            <li>
              If you put the files in a folder instead of the root, change the paths in the HTML and
              in site.webmanifest to match.
            </li>
          </ol>
          <p>
            Website builders and content management systems usually have a &ldquo;site icon&rdquo;
            setting instead. Upload the 512-pixel PNG there and let the platform create the rest.
          </p>

          <h2>Why your new favicon does not show</h2>
          <p>
            Browsers cache favicons stubbornly, sometimes for days. To check the new one is really in
            place, open the icon&apos;s address directly, such as example.com/favicon.ico, or load
            your site in a private window. If the direct address shows the old icon or an error,
            the file is not where the HTML points.
          </p>

          <h2>Favicons in search results</h2>
          <p>
            Google shows a site&apos;s favicon next to its results on mobile and desktop. Its
            guidance asks for a square icon, recommends one larger than 48 × 48 pixels, and requires
            that search crawlers can fetch both the icon and the home page that declares it. A
            complete set with the 192 and 512-pixel icons covers the size, and it can take some time
            after a change for search results to pick up the new icon.
          </p>

          <h2>The Apple touch icon is different</h2>
          <p>
            iPhones and iPads add their own rounded corners to home-screen icons and show transparent
            areas as black. That is why the Apple touch icon always gets a solid background, even if
            your other icons are transparent. Leave a little padding so the rounding does not clip
            your design.
          </p>
        </>
      );
    },
  },

  {
    slug: "instagram-image-sizes",
    topic: "Images",
    title: "Instagram image sizes, and how to stop Instagram ruining your photos",
    seoTitle: "Instagram Image Sizes and How to Keep Photos Sharp",
    description:
      "The sizes Instagram uses for posts, Stories and Reels, why uploads come out soft or cropped, and how to prepare pictures so they stay sharp.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["instagram-image-resizer", "crop-image", "circle-crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            A sharp photo goes in, a slightly soft one comes out, or the top of someone&apos;s head
            is missing. Instagram resizes and re-compresses everything that does not match its own
            sizes, and that second round of processing is what softens text and turns smooth skies
            blocky. Supplying the exact size avoids most of it.
          </p>

          <h2>The sizes</h2>
          <table>
            <thead>
              <tr>
                <th>Format</th>
                <th>Shape</th>
                <th>Pixels</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Square post</td>
                <td>1:1</td>
                <td>1080 × 1080</td>
              </tr>
              <tr>
                <td>Portrait post</td>
                <td>4:5</td>
                <td>1080 × 1350</td>
              </tr>
              <tr>
                <td>Landscape post</td>
                <td>1.91:1</td>
                <td>1080 × 566</td>
              </tr>
              <tr>
                <td>Story or Reel</td>
                <td>9:16</td>
                <td>1080 × 1920</td>
              </tr>
            </tbody>
          </table>
          <p>
            Feed posts are stored 1,080 pixels wide. A picture with a different shape is cropped or
            given borders to fit the nearest allowed shape, and a much larger picture is scaled down.
          </p>

          <h2>Which shape to choose</h2>
          <p>
            Portrait, at 1080 × 1350, takes up the most room in the feed on a phone, which is why so
            many accounts use it. Square is the safe all-rounder. Landscape posts appear small in
            the feed and are best kept for pictures that genuinely need the width, such as
            panoramas.
          </p>

          <h2>Fill and crop, or fit and pad?</h2>
          <p>
            The <Link href="/image/instagram-image-resizer">Instagram Image Resizer</Link> offers two
            ways to get a picture into a shape:
          </p>
          <ul>
            <li>
              <strong>Fill and crop</strong> scales the picture until it covers the frame and trims
              the overflow. Right for most photographs.
            </li>
            <li>
              <strong>Fit and pad</strong> scales the picture until all of it fits, and fills the
              rest of the frame with a colour you choose. Right for graphics, screenshots, quotes and
              anything with text near the edge, where cropping would cut words off.
            </li>
          </ul>
          <p>
            For precise control over what stays in a cropped photo, crop it first with{" "}
            <Link href="/image/crop-image">Crop Image</Link> — pick the 1:1 or 9:16 preset, or type
            pixel values in the 4:5 proportion such as 1080 × 1350 — then resize.
          </p>

          <h2>A worked example</h2>
          <p>
            Take a landscape phone photo of 4000 × 3000 pixels and post it as a 1080 × 1350 portrait.
          </p>
          <ul>
            <li>
              <strong>Fill and crop</strong> scales the photo until it covers the frame: the height
              becomes 1350, so the width becomes 1800, and 720 pixels — 40% of the width — are trimmed
              from the sides. Fine for a single subject in the middle; not for a group photo.
            </li>
            <li>
              <strong>Fit and pad</strong> scales the photo until all of it fits: the width becomes
              1080 and the height 810, leaving 540 pixels of padding split above and below. Nothing is
              lost, at the cost of bands of colour.
            </li>
          </ul>
          <p>
            For a landscape photo where everything matters, the landscape post shape is often the
            better choice than forcing it into a portrait frame.
          </p>

          <h2>Stories and Reels: mind the edges</h2>
          <p>
            In a Story or a Reel, the top of the screen carries the profile name and progress bar, and
            the bottom carries the reply box, captions and buttons. Anything important placed there —
            a headline, a face, a price — can end up hidden. A practical rule is to keep text and key
            subjects out of roughly the top and bottom 250 pixels of the 1920-pixel frame, and to
            check the result on a phone before posting.
          </p>

          <h2>Carousels</h2>
          <p>
            In a carousel post, every picture is shown in the same shape — normally the shape of the
            first one. Prepare them all at the same size, so none is cropped unexpectedly.
          </p>

          <h2>Keep quality as high as possible</h2>
          <ul>
            <li>
              <strong>Supply the exact size.</strong> A picture that already matches Instagram&apos;s
              size is processed less.
            </li>
            <li>
              <strong>Check the app&apos;s upload quality setting.</strong> Instagram has an option to
              upload at the highest quality in its media quality settings; some apps reduce quality
              to save mobile data unless it is switched on.
            </li>
            <li>
              <strong>Use standard colours.</strong> Pictures edited in a wide colour space can shift
              when uploaded. Exporting in sRGB keeps colours predictable.
            </li>
            <li>
              <strong>Avoid tiny text.</strong> Text that is crisp on a computer screen may be hard
              to read on a phone in the feed. Larger, bolder type survives compression better.
            </li>
          </ul>

          <h2>Profile pictures</h2>
          <p>
            Instagram displays profile pictures as a small circle, cropping the corners of whatever
            square you upload. Keep the face or logo centred with space around it, so nothing
            important falls in the corners. A square image is all Instagram needs; for a round
            version to use elsewhere — on a slide, a document or a printed badge —{" "}
            <Link href="/image/circle-crop-image">Circle Crop Image</Link> cuts the circle with a
            transparent background.
          </p>

          <h2>Other platforms</h2>
          <p>
            The square and 4:5 portrait sizes work well in most feeds, and the 1080 × 1920 Story size
            matches the vertical video formats used across other apps. Each platform changes its
            layouts from time to time, so check how a post looks on a phone before relying on any
            size for important material.
          </p>
        </>
      );
    },
  },

  {
    slug: "design-for-colour-blindness",
    topic: "Images",
    title: "How to check a design works for colour-blind people",
    seoTitle: "How to Check a Design for Colour Blindness",
    description:
      "About one man in twelve sees colour differently. How to test charts, interfaces and graphics for colour blindness, and the simple fixes that work.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["color-blindness-simulator", "image-color-palette", "grayscale-image"],
    Body: function Body() {
      return (
        <>
          <p>
            A chart with a red line and a green line. A form that marks errors in red. A map where
            the safe areas are green and the closed ones red. Each works perfectly for most viewers
            and fails completely for a sizeable minority — and the person who made it usually never
            finds out.
          </p>

          <h2>How common colour blindness is</h2>
          <p>
            Colour vision deficiency affects roughly 1 in 12 men and 1 in 200 women of Northern
            European ancestry, and is common in every population. The great majority of cases are
            red-green deficiencies, which come in two forms:
          </p>
          <ul>
            <li>
              <strong>Deuteranomaly and deuteranopia</strong> — reduced or missing sensitivity to
              green. The most common form.
            </li>
            <li>
              <strong>Protanomaly and protanopia</strong> — reduced or missing sensitivity to red.
              Reds also look darker.
            </li>
          </ul>
          <p>
            Blue-yellow deficiency (tritanopia) is rare, and complete absence of colour vision
            (achromatopsia) rarer still. In a room of fifty people, a red-green chart is likely
            confusing at least one or two of them.
          </p>

          <h2>The principle: never rely on colour alone</h2>
          <p>
            Accessibility guidelines put it simply: colour must not be the only way information is
            conveyed. Colour is fine as an extra signal. The problem is when it is the only one — when
            the only difference between &ldquo;passed&rdquo; and &ldquo;failed&rdquo; is green versus
            red.
          </p>

          <h2>Test your design step by step</h2>
          <ol>
            <li>Take a screenshot of the chart, page or graphic.</li>
            <li>
              Add it to the <Link href="/image/color-blindness-simulator">Colour Blindness Simulator</Link>.
            </li>
            <li>Start with deuteranopia, then switch through the other types.</li>
            <li>
              Look for anything that becomes impossible to tell apart: two lines, two map regions, a
              status badge, a link in body text.
            </li>
          </ol>
          <p>
            A quick second test is to turn the image grey with the{" "}
            <Link href="/image/grayscale-image">Black and White Image Converter</Link>. If two
            important colours become the same grey, they differ only in hue, and anyone who cannot
            see that hue — or who prints in black and white — loses the distinction.
          </p>

          <h2>Fixes that work</h2>
          <p>Changing the palette alone rarely solves the problem. Adding a second signal almost always does:</p>
          <ul>
            <li>
              <strong>Label things directly.</strong> Put the series name at the end of each line in
              a chart instead of relying on a colour key.
            </li>
            <li>
              <strong>Use shape and pattern.</strong> Different marker shapes, dashed and solid
              lines, or hatching on bars.
            </li>
            <li>
              <strong>Add icons and text to status.</strong> A tick and a cross, or the words
              &ldquo;Passed&rdquo; and &ldquo;Failed&rdquo;, alongside the green and red.
            </li>
            <li>
              <strong>Underline links</strong> in body text, rather than marking them by colour only.
            </li>
            <li>
              <strong>Mark form errors with a message and an icon</strong>, not just a red border.
            </li>
          </ul>

          <h2>A worked example: a status dashboard</h2>
          <p>
            A dashboard shows each service as a coloured dot: green for running, amber for degraded,
            red for down. Run through the simulator as deuteranopia, the green and red dots look like
            two similar brownish yellows, and amber sits between them. A colour-blind engineer cannot
            tell at a glance which service is down.
          </p>
          <p>The fix keeps the colours but stops relying on them:</p>
          <ol>
            <li>Add a word next to each dot: Running, Degraded, Down.</li>
            <li>Give each state its own symbol: a tick, a warning triangle, a cross.</li>
            <li>Sort failing services to the top, so position carries the meaning too.</li>
          </ol>
          <p>
            Run the simulator again. The dots still merge, but nothing is lost — and the dashboard is
            easier for everyone to scan.
          </p>

          <h2>Choosing colours that separate better</h2>
          <p>
            When you do pick colours, pairs that differ in lightness as well as hue survive best.
            Blue and orange are a well-known safe pair, because they differ strongly for all common
            types. Avoid relying on red against green, or on similar-lightness pairs such as green
            and brown or blue and purple. To check the colours actually used in a design, the{" "}
            <Link href="/image/image-color-palette">Color Palette Extractor</Link> lists them with
            their HEX values.
          </p>

          <h2>Contrast is a separate check</h2>
          <p>
            Contrast matters for everyone, including people with low vision and anyone reading in
            bright sunlight. The Web Content Accessibility Guidelines ask for a contrast ratio of at
            least 4.5:1 between normal text and its background, 3:1 for large text, and 3:1 for
            important parts of graphics and interface controls. The palette extractor shows each
            colour&apos;s contrast against white and black text, which is a fast way to rule out
            colours that are too pale for text.
          </p>

          <h2>What a simulator cannot tell you</h2>
          <p>
            Simulations are approximations. Real colour vision varies from person to person, and many
            people have milder forms than the full simulations show. A simulator is very good at
            catching designs that fail; it does not replace asking people who see colour differently
            to try what you have made.
          </p>
        </>
      );
    },
  },
];
