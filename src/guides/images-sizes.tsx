import Link from "next/link";

import type { Guide } from "./index";

const PUBLISHED = "2026-10-03";

export const imagesSizesGuides: Guide[] = [
  {
    slug: "email-signature-image-size",
    topic: "Images",
    title: "What size should an email signature image be?",
    seoTitle: "Email Signature Image Size: Logo and Photo",
    description:
      "Logos and headshots in email signatures often arrive huge, blurry or blocked. The pixel sizes and file sizes that work in Gmail and Outlook, and how to make them.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["resize-image", "compress-image", "circle-crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            An email signature image is seen thousands of times, often on a phone, often next to text that is
            only 14 pixels high. A 3,000-pixel logo pasted straight from the brand folder either fills the
            screen or gets squashed into a blurry stamp. A little preparation makes it look sharp everywhere.
          </p>

          <h2>Sizes that work</h2>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Shown at</th>
                <th>Make it</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Wide logo</td>
                <td>150–250 px wide</td>
                <td>300–500 px wide</td>
              </tr>
              <tr>
                <td>Square logo or icon</td>
                <td>60–100 px</td>
                <td>120–200 px</td>
              </tr>
              <tr>
                <td>Headshot</td>
                <td>80–120 px</td>
                <td>160–240 px</td>
              </tr>
              <tr>
                <td>Banner below signature</td>
                <td>up to 600 px wide</td>
                <td>up to 1200 px wide</td>
              </tr>
            </tbody>
          </table>
          <p>
            The &ldquo;make it&rdquo; column is twice the display size. Phones and most modern laptops have
            high-density screens that use two physical pixels for every pixel of layout, so an image made at
            double size stays crisp. Going beyond double adds weight without any visible gain.
          </p>

          <h2>Keep the file small</h2>
          <p>
            Every email you send carries the signature, and every reply can carry it again. Aim for tens of
            kilobytes, not hundreds. A logo of 300 × 100 pixels should be well under 30 KB; a headshot of 200
            × 200 pixels well under 40 KB. Large signature images also make some mail programs show them as
            attachments, which looks messy in the recipient&apos;s inbox.
          </p>

          <h2>Prepare the image step by step</h2>
          <ol>
            <li>
              Resize to the &ldquo;make it&rdquo; width in <Link href="/image/resize-image">Resize Image</Link>,
              with the aspect ratio locked.
            </li>
            <li>
              For a round headshot, cut it out with <Link href="/image/circle-crop-image">Circle Crop Image</Link>
              , which leaves the corners transparent so it sits on any background.
            </li>
            <li>
              Shrink the file in <Link href="/image/compress-image">Compress Image</Link>. Photos compress best as
              JPG; logos with flat colours or transparency should stay PNG.
            </li>
            <li>Upload the image into your mail program&apos;s signature editor and set its display size there.</li>
          </ol>

          <h2>Why images go missing</h2>
          <ul>
            <li>
              <strong>Blocked by default.</strong> Some mail programs, especially in business settings, do not
              load images until the reader allows them. Put your name, title and phone number in text, never
              only inside an image.
            </li>
            <li>
              <strong>Pasted rather than hosted.</strong> Gmail signatures need the image added through its
              image button, either from a web address or Google Drive. Pasting from a document often fails.
            </li>
            <li>
              <strong>Dark mode.</strong> A logo with a white rectangle behind it looks like a sticker on a
              dark background. Use a PNG with a transparent background, and check the logo still reads on dark
              grey.
            </li>
          </ul>

          <h2>Keep it modest</h2>
          <p>
            One image is plenty: either a logo or a headshot, rarely both, and only occasionally a banner for a
            current event. Social icons are optional; if you add them, keep them to about 20 pixels displayed
            and use the same style for all of them. A signature that is taller than the message it ends looks
            like an advertisement.
          </p>
          <p>
            For the reasoning behind JPG versus PNG for logos and photos, see{" "}
            <Link href="/guides/jpg-vs-png-vs-webp">JPG vs PNG vs WebP</Link>. If your round headshot came out
            with a white square around it, the guide to{" "}
            <Link href="/guides/how-to-make-a-round-profile-picture">making a round profile picture</Link>{" "}
            explains why.
          </p>
        </>
      );
    },
  },

  {
    slug: "linkedin-banner-size",
    topic: "Images",
    title: "LinkedIn banner size: how to make a background photo that fits",
    seoTitle: "LinkedIn Banner Size: 1584 × 396 and What Gets Hidden",
    description:
      "The LinkedIn background photo is 1584 × 396 pixels, a 4:1 strip that your profile photo partly covers. How to crop one that fits and keep text in the safe area.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["crop-image", "resize-image", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            The background photo, or banner, is the widest image on a LinkedIn profile and the first thing a
            recruiter sees. It is also awkward: a very wide, very short strip, partly covered by your profile
            photo, and cropped differently on phones. Most banners that look wrong were simply made at the
            wrong shape.
          </p>

          <h2>The size to use</h2>
          <p>
            LinkedIn recommends <strong>1584 × 396 pixels</strong> for a personal profile background. That is a
            ratio of exactly 4:1: four times as wide as it is tall. Company pages use a different cover image,
            shown at 1128 × 191 pixels. Use the right one for the page you are editing.
          </p>
          <p>
            If you upload a normal photo, such as a 3:2 landscape, LinkedIn will make you crop it to the strip,
            and you lose most of the picture. Choose an image that is already wide, or crop it yourself first so
            you decide what stays.
          </p>

          <h2>Make one step by step</h2>
          <ol>
            <li>
              Open <Link href="/image/crop-image">Crop Image</Link>, choose Free, and type a crop width four
              times its height, for example 2400 × 600 on a large photo.
            </li>
            <li>Drag the crop area over the part of the photo you want to keep, and crop.</li>
            <li>
              Resize the result to 1584 pixels wide in <Link href="/image/resize-image">Resize Image</Link>, with
              the aspect ratio locked. The height comes out at 396.
            </li>
            <li>
              Run it through <Link href="/image/compress-image">Compress Image</Link> at a high quality setting.
              A JPG of a few hundred kilobytes is plenty.
            </li>
            <li>Upload it on your profile and check it on both a computer and a phone.</li>
          </ol>

          <h2>What gets covered</h2>
          <p>
            Your profile photo sits over the lower-left part of the banner. Anything important there, such as a
            logo or a line of text, disappears behind your own face. Phones also show a narrower view and can
            trim the sides. The safe approach:
          </p>
          <ul>
            <li>Keep the left third of the lower half free of detail.</li>
            <li>Put any text in the centre or right, away from the edges.</li>
            <li>Use large type: the banner is shown much smaller on a phone than on a monitor.</li>
          </ul>

          <h2>What to put on it</h2>
          <ul>
            <li>
              <strong>A calm photo</strong> related to your field: a workspace, a city skyline, a site you
              built, a product you designed. Busy pictures make the profile photo hard to see.
            </li>
            <li>
              <strong>A short line of text</strong>, if any: what you do and for whom, in a few words. Your
              headline already appears below the banner, so do not repeat it.
            </li>
            <li>
              <strong>Your company&apos;s brand banner</strong>, if your employer provides one. Ask for the
              personal-profile version, not the company page version, because the shapes differ.
            </li>
          </ul>

          <h2>Common problems</h2>
          <ul>
            <li>
              <strong>Blurry banner:</strong> the source was small and has been stretched. Start from a photo at
              least 1584 pixels wide.
            </li>
            <li>
              <strong>Text cut off on a phone:</strong> move it closer to the centre.
            </li>
            <li>
              <strong>Colours look dull:</strong> very heavy compression. Re-export at a higher quality.
            </li>
          </ul>
          <p>
            Ratios such as 4:1, 16:9 and 1:1 are explained in{" "}
            <Link href="/guides/image-aspect-ratios-explained">image aspect ratios explained</Link>. For writing
            the profile itself, see{" "}
            <Link href="/guides/how-to-format-a-linkedin-post">how to format a LinkedIn post</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "whatsapp-profile-photo-without-cropping",
    topic: "Images",
    title: "How to set a full photo as your WhatsApp profile picture without cropping",
    seoTitle: "WhatsApp Profile Photo Without Cropping",
    description:
      "WhatsApp crops every profile photo to a square and shows it as a circle. How to fit a whole portrait or group photo inside it by padding, not cutting.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["instagram-image-resizer", "circle-crop-image", "crop-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Choose a tall photo as your WhatsApp profile picture and the app makes you crop it to a square,
            cutting off heads, feet or half the group. Then it shows the square as a small circle, cutting the
            corners too. To keep the whole photo, you have to make it square yourself, by adding space around
            it rather than removing parts of it.
          </p>

          <h2>Why WhatsApp crops</h2>
          <p>
            Profile pictures on WhatsApp, as on most apps, are stored as squares and displayed as circles in
            chat lists. A portrait or landscape photo does not fit a square, so something has to give: either
            the app crops it, or you pad it with a background so that the whole picture fits.
          </p>

          <h2>Pad the photo step by step</h2>
          <ol>
            <li>
              Open the <Link href="/image/instagram-image-resizer">Instagram Image Resizer</Link>. Its square
              format, 1080 × 1080 pixels, works for any app that wants a square.
            </li>
            <li>Choose Square post and the framing option Fit and pad.</li>
            <li>
              Pick a padding colour: white, black, or a colour taken from the photo so the border looks
              intentional.
            </li>
            <li>Download the square image and set it as your profile photo. WhatsApp no longer needs to crop.</li>
          </ol>
          <p>The image is processed in your browser, so the photo is not uploaded anywhere along the way.</p>

          <h2>Remember the circle</h2>
          <p>
            Even a perfect square is shown as a circle in chat lists. The corners of the square are hidden, and
            in a padded image the photo sits in the middle, so it is mostly safe. But a very tall photo becomes a
            narrow strip in the middle of the circle, and a wide group photo becomes a thin band. At the size of
            a chat list icon, faces in that band are tiny.
          </p>
          <p>
            For a group photo, a better result is often to crop a little and pad a little: use{" "}
            <Link href="/image/crop-image">Crop Image</Link> to trim empty sky or floor first, then pad what is
            left.
          </p>

          <h2>Want the circle exactly?</h2>
          <p>
            <Link href="/image/circle-crop-image">Circle Crop Image</Link> lets you position and zoom the photo
            inside a circle and see precisely what will show. The result has transparent corners. WhatsApp will
            fill them with its own background, which is fine, and you will know in advance that no one&apos;s
            head is cut off.
          </p>

          <h2>Tips for a profile picture people recognise</h2>
          <ul>
            <li>
              <strong>Faces large.</strong> In a chat list the circle is roughly the size of a fingertip. A face
              that fills half the frame is recognisable; a full-length photo is not.
            </li>
            <li>
              <strong>Plain background.</strong> Busy backgrounds turn to noise when shrunk.
            </li>
            <li>
              <strong>Good light.</strong> A dim indoor photo gets darker and grainier after the app compresses
              it.
            </li>
          </ul>

          <h2>The same trick elsewhere</h2>
          <p>
            Telegram, Signal, Instagram and many work chat apps also show square-cropped circles, so the same
            padded image works there. For a profile picture that is round by design, with a ring around it, see{" "}
            <Link href="/guides/how-to-make-a-round-profile-picture">how to make a round profile picture</Link>.
            If you want the whole photo on an Instagram post with white borders, see{" "}
            <Link href="/guides/add-white-borders-for-instagram">adding white borders for Instagram</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "photo-and-signature-size-for-online-forms",
    topic: "Images",
    title: "How to resize your photo and signature for an online application form",
    seoTitle: "Photo and Signature Size for Online Forms (KB, px)",
    description:
      "Exam, job and visa forms ask for a photo and signature at exact pixels and between a minimum and maximum KB. How to hit both numbers without a rejected upload.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["crop-image", "resize-image", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Recruitment exams, university admissions and government services often ask for two images: a
            recent photo and a scan of your signature, each with exact dimensions and a file size between a
            minimum and a maximum. A typical notice might say: photo 200 × 230 pixels, 20–50 KB; signature 140
            × 60 pixels, 10–20 KB. Phone photos are thousands of pixels wide and several megabytes, so they are
            rejected on both counts.
          </p>
          <p>
            Always use the numbers from your own notice. The steps below work for any set of numbers.
          </p>

          <h2>Step 1: take good source images</h2>
          <ul>
            <li>
              <strong>Photo:</strong> face the camera, plain light background, even daylight, no cap or dark
              glasses unless allowed. Fill most of the frame with head and shoulders.
            </li>
            <li>
              <strong>Signature:</strong> sign with a black pen on plain white paper, larger than usual, and
              photograph it from directly above in good light, with no shadow from your phone.
            </li>
          </ul>

          <h2>Step 2: crop to the right shape</h2>
          <p>
            200 × 230 is a slightly tall rectangle; 140 × 60 is a wide strip. If you resize a photo of a
            different shape straight to those numbers, faces and signatures get stretched. Crop first:
          </p>
          <ol>
            <li>
              Open <Link href="/image/crop-image">Crop Image</Link> and choose Free.
            </li>
            <li>
              Type a crop size in the same proportion as the target, for example 1000 × 1150 for a 200 × 230
              photo, or 1400 × 600 for a 140 × 60 signature.
            </li>
            <li>Move the crop over the face or signature, leaving a small margin, and crop.</li>
          </ol>

          <h2>Step 3: resize to the exact pixels</h2>
          <p>
            In <Link href="/image/resize-image">Resize Image</Link>, choose By pixels and type the exact width
            and height. Because you cropped to the right proportion, nothing is distorted. Save as JPG, which is
            what most portals expect.
          </p>

          <h2>Step 4: land inside the KB range</h2>
          <p>
            Open <Link href="/image/compress-image">Compress Image</Link> and adjust the quality slider while
            watching the file size.
          </p>
          <ul>
            <li>Too large: lower the quality a step at a time until it is under the maximum.</li>
            <li>
              Too small, below the minimum: raise the quality. A tiny image at very high quality can still be
              under a minimum like 20 KB; in that case quality 95 or above usually lifts it into range.
            </li>
          </ul>
          <p>
            Aim for the middle of the range rather than just under the limit, so a slightly different way of
            counting KB on the portal does not reject it. All of this runs in your browser, so your photo and
            signature are not uploaded to any third-party site.
          </p>

          <h2>Why uploads are still rejected</h2>
          <ul>
            <li>
              <strong>Wrong file type:</strong> some forms accept only <code>.jpg</code> or <code>.jpeg</code>,
              not PNG or HEIC. iPhone photos are often HEIC; see{" "}
              <Link href="/guides/how-to-open-heic-photos">converting iPhone HEIC photos</Link>.
            </li>
            <li>
              <strong>Signature too faint:</strong> a blue ballpoint photographed in dim light may be rejected as
              unreadable. Use black ink and good light.
            </li>
            <li>
              <strong>Old photo:</strong> many notices require a photo taken within a recent period. Use a new
              one.
            </li>
            <li>
              <strong>Pixel dimensions slightly off:</strong> check the final file&apos;s size in your
              computer&apos;s file properties before uploading.
            </li>
          </ul>
          <p>
            For printed passport-style photos at millimetre sizes, see{" "}
            <Link href="/guides/how-to-make-a-passport-photo-at-home">making a passport photo at home</Link>.
            For general advice on hitting a size in KB, see{" "}
            <Link href="/guides/resize-a-photo-to-exact-size-and-kb">resizing a photo to exact pixels and KB</Link>
            .
          </p>
        </>
      );
    },
  },

  {
    slug: "product-photo-size-for-online-shops",
    topic: "Images",
    title: "Product photo sizes for Etsy, eBay, Amazon and Shopify",
    seoTitle: "Product Photo Size for Etsy, eBay, Amazon, Shopify",
    description:
      "Small product photos cannot be zoomed and can lower a listing's quality. The sizes the big marketplaces recommend, why square works best, and how to prepare a set.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["crop-image", "resize-image", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Shoppers cannot pick a product up, so they zoom. A listing photo that is too small cannot be zoomed,
            looks soft on a phone and makes a good product look cheap. Each marketplace publishes guidance; the
            numbers differ, but they point the same way: large, square or close to it, on a clean background.
          </p>

          <h2>What the platforms ask for</h2>
          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Guidance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Amazon</td>
                <td>
                  Main image on pure white; at least 1000 px on the longest side for zoom; product filling about
                  85% of the frame
                </td>
              </tr>
              <tr>
                <td>eBay</td>
                <td>At least 500 px on the longest side; 1600 px recommended</td>
              </tr>
              <tr>
                <td>Etsy</td>
                <td>Large images, around 2000 px wide; thumbnails are cropped from the centre</td>
              </tr>
              <tr>
                <td>Shopify</td>
                <td>2048 × 2048 px suggested for square product photos</td>
              </tr>
            </tbody>
          </table>
          <p>
            Platforms update these rules, so check the current seller help page before a big shoot. A safe
            default for all four is a square image of 2000 × 2000 pixels.
          </p>

          <h2>Why square works</h2>
          <p>
            Search results and category grids show products in square or near-square tiles. A tall photo gets
            letterboxed or cropped in the grid, and a wide one shrinks. Shooting with space around the product
            and cropping to a square keeps every listing consistent, which makes a shop look professional.
          </p>

          <h2>Prepare a set of photos</h2>
          <ol>
            <li>
              Crop each photo to a square in <Link href="/image/crop-image">Crop Image</Link> using the 1:1
              preset. Leave a small, even margin around the product.
            </li>
            <li>
              Resize to 2000 pixels in <Link href="/image/resize-image">Resize Image</Link>. Do not enlarge small
              photos; reshoot them instead, because enlarging adds blur, not detail.
            </li>
            <li>
              Compress in <Link href="/image/compress-image">Compress Image</Link> at a high quality, around 85,
              as JPG. Each file should end up a few hundred kilobytes.
            </li>
            <li>Name the files descriptively, such as <code>oak-chopping-board-front.jpg</code>.</li>
          </ol>

          <h2>A shot list that sells</h2>
          <ul>
            <li>Main image: the whole product, straight on, clean background.</li>
            <li>Detail shots: texture, stitching, ports, labels.</li>
            <li>Scale shot: the product in a hand or next to a familiar object.</li>
            <li>In use: worn, held or in a room.</li>
            <li>Packaging or what is in the box, if that helps buyers decide.</li>
          </ul>

          <h2>Background and colour</h2>
          <p>
            Marketplaces that ask for a white main image mean pure white, not light grey. A window-lit table with
            a sheet of white card behind the product gets close; the rest is lighting. Keep colours true: if
            buyers receive a product that looks different from the photo, returns follow. Avoid filters on main
            images.
          </p>

          <h2>Keep the whole shop consistent</h2>
          <p>
            Buyers judge a shop by its grid as much as by any single photo. Shoot every product in the same
            spot, at the same time of day or under the same lamps, at the same distance, and crop them all with
            the same margin. Mixed backgrounds and lighting make a shop look like a jumble sale, even when each
            photo is fine on its own.
          </p>

          <h2>Before uploading</h2>
          <ul>
            <li>Remove location data from photos taken at home; see{" "}
              <Link href="/guides/remove-location-data-from-photos">removing location data from photos</Link>.</li>
            <li>Check each photo on a phone, where most shopping happens.</li>
            <li>Keep the original full-size files for future marketplaces with different rules.</li>
          </ul>
        </>
      );
    },
  },

  {
    slug: "best-image-size-for-a-website",
    topic: "Images",
    title: "What size should images be for a website?",
    seoTitle: "What Size Should Images Be for a Website?",
    description:
      "Pixel widths for hero images, blog images and thumbnails, sensible file sizes, and how to stop large photos slowing a page down without making them blurry.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["resize-image", "compress-image", "jpg-to-webp"],
    Body: function Body() {
      return (
        <>
          <p>
            The most common reason a small website loads slowly is not the hosting or the theme. It is photos
            uploaded straight from a camera or phone: 4,000 pixels wide and several megabytes each, displayed in
            a column 800 pixels wide. Choosing the right size before uploading fixes most of it.
          </p>

          <h2>Pixel widths by use</h2>
          <table>
            <thead>
              <tr>
                <th>Use</th>
                <th>Width</th>
                <th>File size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Full-width hero</td>
                <td>1600–2000 px</td>
                <td>under 300 KB</td>
              </tr>
              <tr>
                <td>Blog or article image</td>
                <td>1200 px</td>
                <td>under 150 KB</td>
              </tr>
              <tr>
                <td>Half-width image</td>
                <td>800 px</td>
                <td>under 100 KB</td>
              </tr>
              <tr>
                <td>Thumbnail or card</td>
                <td>400–600 px</td>
                <td>under 50 KB</td>
              </tr>
              <tr>
                <td>Logo</td>
                <td>2× display size</td>
                <td>as small as possible</td>
              </tr>
            </tbody>
          </table>
          <p>
            These are starting points, not rules. The real target is the width the image is displayed at, about
            doubled for sharp screens, and no wider. A content column that is 700 pixels wide needs images of
            about 1400 pixels.
          </p>

          <h2>Find the display width</h2>
          <p>
            On a computer, right-click the image on your page and choose Inspect. The browser shows the size the
            image is drawn at. Multiply by two for high-density screens. If your theme documentation lists
            recommended image sizes, those are a reliable shortcut.
          </p>

          <h2>Prepare images step by step</h2>
          <ol>
            <li>
              Resize to the target width in <Link href="/image/resize-image">Resize Image</Link>. It has presets
              for common uses, such as a 1200-pixel blog image and a 1600-pixel hero.
            </li>
            <li>
              Compress in <Link href="/image/compress-image">Compress Image</Link>, watching the preview. Quality
              around 75–82 is usually invisible on photos.
            </li>
            <li>
              Consider WebP. <Link href="/image/jpg-to-webp">JPG to WebP</Link> typically makes photos about a
              third smaller at the same visible quality, and every current browser supports it.
            </li>
          </ol>

          <h2>Things that matter as much as size</h2>
          <ul>
            <li>
              <strong>Width and height attributes.</strong> Tell the browser the image&apos;s dimensions in the
              HTML so it reserves space. Without them, text jumps down as images load, which visitors hate and
              page-speed reports flag as layout shift.
            </li>
            <li>
              <strong>Lazy loading.</strong> Images further down the page can wait until the visitor scrolls.
              Most site builders do this automatically; in plain HTML, add <code>loading=&quot;lazy&quot;</code>{" "}
              to images below the first screen.
            </li>
            <li>
              <strong>Do not lazy-load the hero.</strong> The main image at the top should load immediately.
            </li>
            <li>
              <strong>Alt text.</strong> Describe what the image shows. It helps screen-reader users and image
              search.
            </li>
          </ul>

          <h2>Which format for which image</h2>
          <ul>
            <li>Photographs: JPG or WebP.</li>
            <li>Logos, icons and diagrams with flat colour: SVG if you have it, otherwise PNG.</li>
            <li>Screenshots with text: PNG, or WebP for a smaller file.</li>
            <li>Anything needing a transparent background: PNG or WebP, never JPG.</li>
          </ul>

          <h2>Check the result</h2>
          <p>
            Open the page on a phone using mobile data and watch it load. If an image appears noticeably later
            than the text, it is probably still too large. Browser developer tools show the size of every file
            the page downloads; anything over about 500 KB is worth a second look.
          </p>
          <p>
            For choosing between formats, see <Link href="/guides/jpg-vs-png-vs-webp">JPG vs PNG vs WebP</Link>.
            For compressing without visible loss, see{" "}
            <Link href="/guides/how-to-compress-images">how to compress images without losing quality</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "pixel-size-for-photo-prints",
    topic: "Images",
    title: "How many pixels do you need for a 4×6, 5×7 or A4 print?",
    seoTitle: "Pixels Needed for 4×6, 5×7, 8×10 and A4 Prints",
    description:
      "The pixel dimensions for sharp prints at common photo sizes, what 300 and 150 DPI mean in practice, and what to do when your photo is too small for the print.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["image-dpi-changer", "crop-image", "resize-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Before ordering prints or sending a file to a print shop, it helps to know whether the photo has
            enough pixels for the size you want. The answer comes from simple multiplication: the print size in
            inches times the print resolution in dots per inch.
          </p>

          <h2>Pixels for common print sizes</h2>
          <table>
            <thead>
              <tr>
                <th>Print size</th>
                <th>At 300 DPI</th>
                <th>At 150 DPI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4 × 6 in</td>
                <td>1200 × 1800</td>
                <td>600 × 900</td>
              </tr>
              <tr>
                <td>10 × 15 cm</td>
                <td>1181 × 1772</td>
                <td>591 × 886</td>
              </tr>
              <tr>
                <td>5 × 7 in</td>
                <td>1500 × 2100</td>
                <td>750 × 1050</td>
              </tr>
              <tr>
                <td>13 × 18 cm</td>
                <td>1535 × 2126</td>
                <td>768 × 1063</td>
              </tr>
              <tr>
                <td>A5</td>
                <td>1748 × 2480</td>
                <td>874 × 1240</td>
              </tr>
              <tr>
                <td>8 × 10 in</td>
                <td>2400 × 3000</td>
                <td>1200 × 1500</td>
              </tr>
              <tr>
                <td>A4</td>
                <td>2480 × 3508</td>
                <td>1240 × 1754</td>
              </tr>
            </tbody>
          </table>
          <p>
            300 DPI is the usual target for photos held in the hand. 150 DPI is acceptable for larger prints seen
            from further away, such as a poster on a wall. Any modern phone photo, at 3000 pixels or more on the
            long side, comfortably covers everything up to A4 at 300 DPI.
          </p>

          <h2>Check your photo</h2>
          <p>
            Look at the image&apos;s pixel dimensions in your computer&apos;s file properties, or open it in{" "}
            <Link href="/image/image-dpi-changer">Change Image DPI</Link>, which shows the pixel size and the
            print size at any density you choose. Type a printed width in millimetres and it tells you the
            resulting DPI. If that is 300 or close to it, the print will be sharp.
          </p>

          <h2>The shape matters too</h2>
          <p>
            Phone photos are usually 4:3, while 4 × 6 prints are 3:2 and 5 × 7 prints are 7:5. If the shapes
            differ, the lab either crops your photo or leaves white bars. To control which part is cut, crop it
            yourself before ordering in <Link href="/image/crop-image">Crop Image</Link>: the 3:2 preset matches
            4 × 6 and 10 × 15 cm exactly, and Free with typed dimensions handles the rest.
          </p>

          <h2>When the photo is too small</h2>
          <ul>
            <li>
              <strong>Print smaller.</strong> An image that is 1200 pixels wide is excellent at 4 × 6 and
              disappointing at A4.
            </li>
            <li>
              <strong>Accept lower DPI for big prints.</strong> 200 DPI is usually fine for 8 × 10 viewed at
              arm&apos;s length.
            </li>
            <li>
              <strong>Find the original.</strong> Photos saved from messaging apps and social networks are
              heavily reduced. Ask the sender for the original file.
            </li>
            <li>
              <strong>Do not rely on enlarging.</strong> Resizing a small image up in{" "}
              <Link href="/image/resize-image">Resize Image</Link> makes it bigger but cannot add detail; edges
              soften.
            </li>
          </ul>

          <h2>Ordering prints online</h2>
          <p>
            Most photo labs warn you when an image is too small for the size you choose, usually with a
            low-quality icon on the order page. Take that warning seriously for anything you plan to frame. Labs
            also offer &ldquo;crop to fit&rdquo; or &ldquo;fit with border&rdquo;; choose deliberately rather
            than accepting the default, or crop beforehand so there is nothing for the lab to decide.
          </p>

          <h2>The DPI number in the file</h2>
          <p>
            Some labs and forms complain that a photo is &ldquo;72 DPI&rdquo;. That figure is only a label
            stored in the file. What matters is the pixel count. Change Image DPI can rewrite the label to 300
            without touching any pixels, which satisfies picky upload forms. The fuller explanation is in{" "}
            <Link href="/guides/what-dpi-means-for-printing">what DPI means for printing</Link>.
          </p>
        </>
      );
    },
  },

  {
    slug: "add-white-borders-for-instagram",
    topic: "Images",
    title: "How to post a whole photo on Instagram with white borders",
    seoTitle: "How to Add White Borders to Fit a Photo on Instagram",
    description:
      "Instagram crops photos that are too wide or too tall. How to add white or coloured borders so the whole picture fits in a square, portrait or story frame.",
    published: PUBLISHED,
    updated: PUBLISHED,
    tools: ["instagram-image-resizer", "crop-image", "compress-image"],
    Body: function Body() {
      return (
        <>
          <p>
            Instagram accepts photos within a range of shapes, from a fairly wide landscape to a 4:5 portrait.
            Anything outside that range is cropped when you post it: a panorama loses its ends, a tall phone
            screenshot loses its top and bottom. Adding borders, usually white, makes the whole picture fit and
            gives a feed a tidy, consistent look.
          </p>

          <h2>Choose the frame</h2>
          <table>
            <thead>
              <tr>
                <th>Frame</th>
                <th>Pixels</th>
                <th>Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Square</td>
                <td>1080 × 1080</td>
                <td>Consistent grids, mixed shapes</td>
              </tr>
              <tr>
                <td>Portrait</td>
                <td>1080 × 1350</td>
                <td>Most space in the feed</td>
              </tr>
              <tr>
                <td>Landscape</td>
                <td>1080 × 566</td>
                <td>Wide scenes</td>
              </tr>
              <tr>
                <td>Story or Reel</td>
                <td>1080 × 1920</td>
                <td>Full-screen vertical</td>
              </tr>
            </tbody>
          </table>
          <p>
            Portrait takes up the most screen space as people scroll, so a landscape photo padded to a 4:5
            portrait frame is smaller but still uses the space. Square is the classic choice if you want every
            post to line up.
          </p>

          <h2>Add borders step by step</h2>
          <ol>
            <li>
              Open the <Link href="/image/instagram-image-resizer">Instagram Image Resizer</Link> and add your
              photo.
            </li>
            <li>Choose a frame: Square post, Portrait post, Landscape post or Story or Reel.</li>
            <li>Choose the framing option Fit and pad. The whole photo is fitted inside the frame.</li>
            <li>Set the padding colour. White is classic; black suits night shots; a muted tone can match a theme.</li>
            <li>Download and post. Instagram has nothing left to crop.</li>
          </ol>

          <h2>Even borders on every side</h2>
          <p>
            Fit and pad adds borders on two sides only: top and bottom for a wide photo, left and right for a
            tall one. Some people prefer a thin border on all four sides, like a print with a mount. To get that,
            crop a sliver from the photo&apos;s longer side first in <Link href="/image/crop-image">Crop Image</Link>{" "}
            so it is slightly smaller than the frame&apos;s shape in both directions, then pad. A simpler
            alternative is to accept two-sided borders, which most feeds use.
          </p>

          <h2>Why the photo looks soft after posting</h2>
          <p>
            Instagram resizes everything to 1080 pixels wide and compresses it again. Uploading exactly 1080
            pixels wide gives the app less reason to resize and usually keeps the result sharper. The resizer
            already outputs 1080-pixel images. Avoid uploading an image you have already compressed heavily: two
            rounds of compression show as smeared detail and blocky skies. The guide to{" "}
            <Link href="/guides/why-photos-look-blurry-after-upload">why photos look blurry after uploading</Link>{" "}
            covers the other causes.
          </p>

          <h2>Carousels</h2>
          <p>
            In a carousel post, every slide takes the shape of the first one. If you mix portrait and landscape
            photos, pad them all to the same frame before uploading so none of them is cropped.
          </p>

          <h2>Stories</h2>
          <p>
            Stories are tall: 9:16. A normal landscape photo on a story sits as a small band in the middle. Fit
            and pad on the Story format gives you control of the background colour; leave room at the top and
            bottom, where the app puts your name and the reply bar.
          </p>
          <p>
            The full set of sizes is in <Link href="/guides/instagram-image-sizes">Instagram image sizes</Link>.
            For borders on profile pictures elsewhere, see{" "}
            <Link href="/guides/whatsapp-profile-photo-without-cropping">
              setting a full photo as a WhatsApp profile picture
            </Link>
            .
          </p>
        </>
      );
    },
  },
];
