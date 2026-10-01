import type { ToolContentExtra } from "@/types/tool";

export const imageExtra: Record<string, ToolContentExtra> = {
  "compress-image": {
    tips: [
      "Resize before you compress. A photo shown 1,200 pixels wide does not need to be 4,000 pixels wide, and cutting the pixel count saves far more than lowering quality.",
      "Start at quality 80 for photographs and move in steps of five. Below about 60, blocks and halos start to show around edges and in smooth areas like sky.",
      "Judge the result zoomed in, not as a thumbnail. Look at hair, text and the edges of objects against plain backgrounds.",
      "Keep your originals and always compress from them. Compressing an already compressed copy adds more damage each time.",
    ],
    faq: [
      {
        question: "What quality should I use for images on a website?",
        answer:
          "Between 75 and 85 for photographs, at the width the image will actually be shown. Screenshots and graphics with text look better as PNG or WebP.",
      },
      {
        question: "Does compressing remove a photo's location data?",
        answer:
          "Re-encoding in the browser does not carry camera metadata across. If removing location is the main goal, check the result with the EXIF Viewer and Remover.",
      },
      {
        question: "Can I compress many images at once?",
        answer: "Yes. Add a batch, compress them together and download them as a ZIP.",
      },
    ],
  },

  "resize-image": {
    tips: [
      "Keep the aspect ratio locked unless you really want the picture stretched.",
      "Shrinking is safe; enlarging is not. Beyond about 150% an enlarged image starts to look soft, because no tool can add detail the camera never captured.",
      "Resize before compressing. Halving both dimensions cuts the amount of data to about a quarter.",
      "For printing to an exact physical size, use Change Image DPI, which works in inches or centimetres rather than pixels alone.",
    ],
    faq: [
      {
        question: "Can I resize by percentage instead of pixels?",
        answer: "Yes. Drag the percentage slider and the width and height update together.",
      },
      {
        question: "A form wants exactly 600 × 600 pixels. How do I get that from a rectangular photo?",
        answer:
          "Crop it to a square first with Crop Image, then resize the square to 600 × 600. Resizing a rectangle to a square without cropping would stretch it.",
      },
      {
        question: "Does resizing change the DPI?",
        answer:
          "DPI only matters for printing. Screens show pixels, so for on-screen use the pixel size is all that counts. To set a print size, use Change Image DPI.",
      },
    ],
  },

  "jpg-to-png": {
    tips: [
      "Convert to PNG when you are going to edit an image several times. PNG can be saved again and again without adding damage.",
      "Keep sharing JPGs as JPGs. For a photo that is only being sent or posted, PNG just makes the file several times bigger.",
      "Converting does not make a background transparent. The PNG is fully opaque, exactly like the JPG it came from.",
      "If a site or app insists on PNG, this is the quickest way to satisfy it without changing how the picture looks.",
    ],
    faq: [
      {
        question: "When is it worth converting a JPG to PNG?",
        answer:
          "When you will edit and save the image repeatedly, or when a program or upload form only accepts PNG. Otherwise the JPG is the better file to keep.",
      },
      {
        question: "Can I convert several JPGs at once?",
        answer: "Yes. Add them together and download the PNGs one by one or as a ZIP.",
      },
      {
        question: "Are my photos uploaded?",
        answer: "No. Each image is decoded and re-encoded in your browser.",
      },
    ],
  },

  "png-to-jpg": {
    tips: [
      "Choose a background colour that matches where the image will sit. A logo going onto a grey page looks best flattened onto that grey rather than white.",
      "Quality 80–90 suits most photographs. Go higher only if you can see a difference.",
      "Keep screenshots, logos and diagrams as PNG. JPEG blurs sharp edges and saves little on flat graphics.",
      "Keep the PNG as your master copy, especially if it has transparency you may need later.",
    ],
    faq: [
      {
        question: "What JPEG quality should I choose?",
        answer:
          "Around 85 is a good default for photographs: much smaller than the PNG and very hard to tell apart.",
      },
      {
        question: "Why did my transparent PNG used to turn black when converted elsewhere?",
        answer:
          "JPEG has no transparency, so a converter has to fill those areas with something. Some fill them with black by default. Here they are filled with the colour you choose.",
      },
      {
        question: "Is anything uploaded?",
        answer: "No. The images are converted in your browser.",
      },
    ],
  },

  "webp-to-jpg": {
    tips: [
      "Convert only when an app or service refuses WebP. For the web, WebP is the better format.",
      "Use quality 85 or above; this is a second lossy step, so do not push it lower than you need.",
      "Pick a background colour if the WebP has transparent areas — JPEG cannot keep them.",
      "If the image has sharp text or needs transparency, use WebP to PNG instead.",
    ],
    faq: [
      {
        question: "Why do pictures I save from websites end up as WebP?",
        answer:
          "Many sites serve WebP because it loads faster than JPG at the same quality. Your browser shows it fine, but some desktop programs still cannot open it.",
      },
      {
        question: "Should I convert to PNG instead?",
        answer:
          "Choose PNG when the image has transparency, sharp text or will be edited repeatedly. Choose JPG for ordinary photos where a smaller file matters.",
      },
      {
        question: "Can I convert several WebP files at once?",
        answer: "Yes. Add them together, convert, and download them individually or as a ZIP.",
      },
    ],
  },

  "heic-to-jpg": {
    tips: [
      "Quality 90 gives JPGs that look the same as the HEIC originals at normal viewing sizes.",
      "Keep the HEIC files if you have room; a JPG made from a HEIC is a copy of a copy.",
      "iPhone photos often carry their location. Check and strip it with the EXIF Viewer and Remover before sharing the JPGs publicly.",
      "To stop the problem at the source when copying to a computer, set the iPhone's Settings → Photos → Transfer to Mac or PC option to Automatic.",
    ],
    faq: [
      {
        question: "Why is the JPG bigger than the HEIC?",
        answer:
          "HEIC compresses roughly twice as efficiently as JPEG, so the same photo takes more space as a JPG. Run the JPGs through Compress Image if size matters.",
      },
      {
        question: "Can I convert Live Photos?",
        answer:
          "A Live Photo is a still image plus a short video. Converting the HEIC gives you the still; the motion part is a separate video file.",
      },
      {
        question: "Is there a limit on how many photos I can convert?",
        answer: "No fixed limit on the number of files. Very large batches use more memory, so on a phone work in groups.",
      },
    ],
  },

  "image-to-text": {
    tips: [
      "Make the letters big enough: capitals around 20–30 pixels tall or more. Zoom in before taking a screenshot rather than enlarging a small one afterwards.",
      "Crop each column of a two-column page into its own image; OCR reads straight across the gap otherwise.",
      "Proofread look-alike characters — 0 and O, 1 and l, 5 and S — and every number you will rely on.",
      "Paste the result into Text Cleaner and join broken lines to turn the line-by-line output back into paragraphs.",
    ],
    faq: [
      {
        question: "Can it read the text in a scanned PDF?",
        answer:
          "Turn the PDF's pages into images with PDF to PNG first, then run each page image through this tool.",
      },
      {
        question: "Why are the cells of a table jumbled?",
        answer:
          "OCR returns text line by line and does not know where table cells begin and end. You get the words and figures, but the grid has to be rebuilt by hand.",
      },
      {
        question: "How long does recognition take?",
        answer:
          "Usually a few seconds for a screenshot on a recent device. The first run also downloads the language data, and large or detailed images take longer.",
      },
    ],
  },

  "image-to-pdf": {
    tips: [
      "Crop and straighten each picture first; the PDF can only be as tidy as the images in it.",
      "Match the page to the image for receipts and screenshots; choose a standard size like A4 when the PDF will be printed.",
      "Compress large photos before adding them if the PDF has to be emailed or uploaded.",
      "Check the order in the list before creating the PDF — pages are built exactly in that sequence.",
    ],
    faq: [
      {
        question: "Will my JPEG photos lose quality?",
        answer:
          "No. JPEG images are embedded as they are, without re-encoding. PNG and WebP images are converted to an encoding PDF supports.",
      },
      {
        question: "Can each page be the same size as its picture?",
        answer: "Yes. Choose to match the page to the image and every page takes the exact proportions of its picture.",
      },
      {
        question: "Can I add iPhone HEIC photos?",
        answer: "Convert them with HEIC to JPG first, then add the JPGs here.",
      },
    ],
  },

  "crop-image": {
    tips: [
      "Crop before you share, to remove what does not belong in the picture — a house number, a screen, a stranger in the background.",
      "Lock an aspect ratio when a platform asks for a shape, such as 1:1 for profile pictures or 16:9 for banners.",
      "Crop first and resize second. Cropping keeps full-resolution pixels; resizing then brings the result to the size you need.",
      "Leave a little space around a subject rather than cropping tight to the edges; it looks more natural and survives later cropping by other apps.",
    ],
    faq: [
      {
        question: "Is the crop taken from the full-resolution image?",
        answer:
          "Yes. The preview is scaled down, but your selection is mapped onto the original, so the output keeps its full detail.",
      },
      {
        question: "Does cropping remove location data from the photo?",
        answer:
          "Cropping changes the visible picture. To be sure hidden data such as location is gone, check the result with the EXIF Viewer and Remover.",
      },
      {
        question: "Can I crop on my phone?",
        answer: "Yes. Drag on the preview with your finger and use the handles to fine-tune the area.",
      },
    ],
  },

  "rotate-image": {
    tips: [
      "Use quarter turns for sideways photos; they are exact and lose nothing.",
      "To straighten a slightly tilted horizon, rotate by a degree or two with the slider, then crop away the filled corners.",
      "Flip horizontally to un-mirror a selfie or text that reads backwards.",
      "Choose a background colour that matches the photo for free-angle rotations, so the corners are less noticeable before cropping.",
    ],
    faq: [
      {
        question: "Why does a photo look sideways in one app but not another?",
        answer:
          "Phones often save photos sideways with a note telling viewers to turn them upright. Some programs ignore that note. Rotating here and saving stores the pixels the right way up, so every app shows it correctly.",
      },
      {
        question: "How do I straighten a crooked photo?",
        answer:
          "Drag the angle slider a little at a time until a horizon or wall edge looks level, then crop off the corners with Crop Image.",
      },
      {
        question: "Is my photo uploaded?",
        answer: "No. It is rotated in your browser.",
      },
    ],
  },

  "webp-to-png": {
    tips: [
      "Choose PNG when the image has a transparent background or sharp text, or when you will edit it further.",
      "Choose JPG for ordinary photographs where a smaller file matters more than transparency.",
      "For use on a website, keep the WebP if you can — it is the smaller, faster file.",
      "Convert from the largest version of the WebP you have; conversion cannot add back detail.",
    ],
    faq: [
      {
        question: "When should I pick JPG instead of PNG?",
        answer:
          "For photographs without transparency. A JPG is far smaller than a PNG of the same photo and looks the same at normal sizes.",
      },
      {
        question: "Can every program open the PNG?",
        answer: "Yes. PNG is supported by practically every image viewer, editor and upload form.",
      },
      {
        question: "Is anything uploaded?",
        answer: "No. Your browser decodes and re-encodes the images on your device.",
      },
    ],
  },

  "avif-to-jpg": {
    tips: [
      "If a file will not open, update your browser; older versions cannot decode AVIF at all.",
      "Choose PNG when the image has transparency or sharp text you want kept exactly.",
      "Keep the AVIF original. It is the smaller, better-compressed file.",
      "Convert only the files a program actually refuses — there is no quality gain in converting.",
    ],
    faq: [
      {
        question: "Why do images I download arrive as .avif?",
        answer:
          "Many websites serve AVIF because it is much smaller than JPG at the same quality. Browsers display it, but older photo viewers and editors cannot open it.",
      },
      {
        question: "Can I convert several AVIF files at once?",
        answer: "Yes. Add them together and download the results individually or as a ZIP.",
      },
      {
        question: "Is anything uploaded?",
        answer: "No. Your browser's own AVIF decoder does the work on your device.",
      },
    ],
  },

  "image-color-palette": {
    tips: [
      "Raise the number of colours if a small accent colour is missing; it may have been absorbed into a larger neighbour.",
      "Click directly on the image to sample one exact spot.",
      "Use the contrast figures before choosing a colour as a text background: 4.5:1 is the minimum for body text.",
      "Copy the palette as CSS variables, a Tailwind theme or JSON to drop it straight into a project.",
    ],
    faq: [
      {
        question: "How many colours should I extract?",
        answer:
          "Five to eight is typical for a design palette. Use more if the image has several important but small colours.",
      },
      {
        question: "Does the same image always give the same palette?",
        answer:
          "Yes. The starting points are chosen in a fixed way, so the result does not change from one run to the next.",
      },
      {
        question: "Which colour formats can I copy?",
        answer: "HEX, RGB and HSL for each colour, and the whole palette as CSS variables, a Tailwind theme or JSON.",
      },
    ],
  },

  "exif-remover": {
    tips: [
      "Check photos before posting them on marketplaces, forums or dating sites — especially pictures taken at home.",
      "Sending a photo “as a document” in a messaging app sends the untouched original, location included. Clean it first.",
      "Turn off location tagging in your camera settings if you never want it recorded.",
      "Metadata is only half of it: crop out house numbers, street signs and anything else in the picture that gives a place away.",
    ],
    faq: [
      {
        question: "What does EXIF stand for?",
        answer:
          "Exchangeable Image File Format — the standard way cameras and phones store details such as the date, settings and location inside a photo.",
      },
      {
        question: "Can I clean many photos at once?",
        answer: "Yes. Add several JPG, PNG or WebP files and download the cleaned copies together.",
      },
      {
        question: "How do I check the metadata is really gone?",
        answer:
          "Each cleaned file is read again and the tool reports what is left. You can also check in your computer's file properties: on Windows, Properties then Details; on a Mac, Preview's inspector.",
      },
    ],
  },

  "favicon-generator": {
    tips: [
      "Design for 16 pixels. If the tiny preview is not recognisable, simplify: one bold shape or a single letter.",
      "Use a square source image; anything else has to be padded or cropped.",
      "Add padding so the icon does not touch the edges, especially for the rounded and circular shapes.",
      "Test in a private browser window after uploading, because browsers cache favicons for a long time.",
    ],
    faq: [
      {
        question: "Which sizes are included?",
        answer:
          "favicon.ico with 16, 32 and 48-pixel images, 16 and 32-pixel PNGs, a 180-pixel Apple touch icon, 192 and 512-pixel icons for Android and installable web apps, and a web manifest.",
      },
      {
        question: "Do I need the site.webmanifest file?",
        answer:
          "It tells Android and browsers that install web apps which icons and name to use. It is small and harmless, so include it.",
      },
      {
        question: "Can I make a favicon from a letter or an emoji?",
        answer: "Yes. Switch to Letter or emoji, type one or two characters and pick the colours and shape.",
      },
    ],
  },

  "png-to-webp": {
    tips: [
      "Use quality around 90 for logos, screenshots and anything with text; 75–85 is enough for photographs.",
      "Compare edges at full size. Faint halos around text are the first sign the quality is too low.",
      "Keep the PNG as your master and publish the WebP.",
      "For email newsletters, stick with PNG or JPG; not every email program displays WebP.",
    ],
    faq: [
      {
        question: "How much smaller will my files be?",
        answer:
          "Often half the size or less, depending on the picture. The before and after sizes are shown for every file.",
      },
      {
        question: "Can I convert a whole folder of PNGs?",
        answer: "Add as many files as you like in one batch and download them together as a ZIP.",
      },
      {
        question: "Should I use WebP images in emails?",
        answer:
          "Not yet. Some email programs, particularly older desktop ones, do not display WebP. Use PNG or JPG for email.",
      },
    ],
  },

  "image-converter": {
    tips: [
      "Set a maximum width while converting to shrink oversized photos in the same pass.",
      "Choose WebP for websites, JPG for photos that must open anywhere, and PNG for graphics and transparency.",
      "Converting to PNG does not undo JPEG compression; it only stops further loss.",
      "Keep your originals and convert copies.",
    ],
    faq: [
      {
        question: "Can I resize images while converting them?",
        answer: "Yes. Set a maximum width or height and larger images are scaled down to fit.",
      },
      {
        question: "Does it convert HEIC or AVIF files?",
        answer:
          "It accepts any format your browser can open. Current browsers open AVIF, but most cannot decode iPhone HEIC photos, so use HEIC to JPG for those.",
      },
      {
        question: "Are my images uploaded?",
        answer: "No. Every image is converted in your browser.",
      },
    ],
  },

  "jpg-to-webp": {
    tips: [
      "Start at quality 80 and compare at full size; raise it only if you see a difference.",
      "Convert from your original JPGs rather than from copies that have already been compressed.",
      "Check heavily textured photos — grass, gravel, fabric — which compress least well in any format.",
      "Keep the JPGs as masters and publish the WebP files.",
    ],
    faq: [
      {
        question: "How much smaller is WebP than JPG?",
        answer: "Typically 25–35% smaller at the same visible quality.",
      },
      {
        question: "Do all browsers show WebP?",
        answer: "Yes. Every current browser displays WebP images.",
      },
      {
        question: "Can I convert WebP back to JPG later?",
        answer:
          "Yes, with WebP to JPG. It is a second lossy step, so convert from the original JPG instead if you still have it.",
      },
    ],
  },

  "jpg-to-avif": {
    tips: [
      "Start at quality 50. AVIF holds up at much lower settings than JPG.",
      "Use Chrome or Edge on a desktop computer; other browsers can display AVIF but cannot create it.",
      "Compare at full size, paying attention to fine texture, which AVIF can smooth over.",
      "On a website, keep a JPG or WebP version as a fallback for very old software.",
    ],
    faq: [
      {
        question: "Should I use AVIF or WebP?",
        answer:
          "AVIF is usually smaller at the same quality. WebP encodes faster and is supported by more older software. Many sites serve AVIF with WebP or JPG as a fallback.",
      },
      {
        question: "Does AVIF support transparency?",
        answer: "The format does, but a JPG has none to carry over, so the result is fully opaque.",
      },
      {
        question: "Is my photo uploaded?",
        answer: "No. It is encoded by your browser on your device.",
      },
    ],
  },

  "svg-to-png": {
    tips: [
      "Export at twice the size the image will be displayed at, so it stays sharp on high-density screens.",
      "Convert text to outlines in your drawing program first if a special font matters.",
      "Embed any linked images in the SVG before converting; external files are not loaded.",
      "Keep the transparent background for logos; switch to white for documents and slides.",
    ],
    faq: [
      {
        question: "Why convert an SVG to PNG at all?",
        answer:
          "Many places accept only pixel images: social media, some document editors, email and many upload forms. A PNG works everywhere.",
      },
      {
        question: "Will the PNG stay sharp if I enlarge it later?",
        answer: "No. A PNG has a fixed number of pixels. Export it at the largest size you will need.",
      },
      {
        question: "Is my SVG uploaded?",
        answer: "No. Your browser renders it and saves the PNG on your device.",
      },
    ],
  },

  "circle-crop-image": {
    tips: [
      "Use a photo where the face is roughly in the middle; the crop is taken from a centred square.",
      "Zoom in until the face fills most of the circle — small faces get lost at avatar sizes.",
      "Add a white ring when the circle will sit on a dark background.",
      "Keep the PNG; saving it as JPG would fill the transparent corners and bring the square back.",
    ],
    faq: [
      {
        question: "Do I need a circle crop for social media profile pictures?",
        answer:
          "Usually not. Most platforms take a square image and display it as a circle themselves. A circle crop helps in documents, slides and print, where nothing rounds it for you.",
      },
      {
        question: "Can I add a border?",
        answer: "A white ring can be added around the circle, which helps it stand out on dark backgrounds.",
      },
      {
        question: "Is my photo uploaded?",
        answer: "No. The crop happens in your browser.",
      },
    ],
  },

  "instagram-image-resizer": {
    tips: [
      "Use portrait (1080 × 1350) for feed posts you want noticed; it takes up the most screen space.",
      "Use fit and pad for graphics and screenshots so no text is cut off.",
      "In Stories and Reels, keep text and faces away from the top and bottom, which the app's buttons cover.",
      "In a carousel, give every image the same shape; Instagram uses one shape for the whole set.",
    ],
    faq: [
      {
        question: "What sizes does Instagram use?",
        answer:
          "Posts are 1080 pixels wide: 1080 × 1080 square, 1080 × 1350 portrait, and landscape at a 1.91:1 ratio. Stories and Reels are 1080 × 1920.",
      },
      {
        question: "Why is the download a JPG?",
        answer:
          "Instagram stores pictures as JPEG anyway. Supplying a JPG at the exact size keeps its own re-compression to a minimum.",
      },
      {
        question: "Is my picture uploaded?",
        answer: "No. It is resized in your browser; you upload it to Instagram yourself.",
      },
    ],
  },

  "youtube-thumbnail-downloader": {
    tips: [
      "Paste any form of link — a full URL, a youtu.be link, a Shorts URL or just the 11-character id.",
      "Take the largest size offered; you can always shrink it later, but not enlarge it.",
      "Use thumbnails for reference, review and research, and credit the channel when you show one.",
      "If only smaller sizes appear, the video simply has no high-definition thumbnail.",
    ],
    faq: [
      {
        question: "Which sizes are available?",
        answer:
          "Up to four: 1280 × 720, 640 × 480, 480 × 360 and 320 × 180. Only the sizes that exist for the video are shown.",
      },
      {
        question: "Why do some sizes have black bars?",
        answer:
          "The 640 × 480 and 480 × 360 versions have a 4:3 shape, so a widescreen video's thumbnail is letterboxed. The 1280 × 720 and 320 × 180 versions are widescreen.",
      },
      {
        question: "What does this tool send over the network?",
        answer:
          "Only the video id, as part of the image addresses requested from YouTube's thumbnail server. Nothing is sent to this site.",
      },
    ],
  },

  "image-watermark": {
    tips: [
      "Tile the watermark when the goal is to discourage reuse; a corner mark is cropped off in seconds.",
      "Keep the opacity low enough that the photo is still enjoyable to look at.",
      "Put a single mark over a busy part of the picture rather than a plain corner, where it is easiest to remove.",
      "Keep an unmarked original for your own archive and for printing.",
    ],
    faq: [
      {
        question: "What wording should I use?",
        answer:
          "Your name or business name, your website address, or a copyright line such as © 2026 Your Name. Short wording reads best.",
      },
      {
        question: "Does the text scale with the picture?",
        answer:
          "Yes. Its size is set in proportion to the picture's width, so the same settings look right on a small web image and a full-size camera file.",
      },
      {
        question: "Is my photo uploaded?",
        answer: "No. The watermark is drawn in your browser.",
      },
    ],
  },

  "blur-faces-in-photo": {
    tips: [
      "Cover the whole head and hair, not just the face; hairstyles and ears are recognisable too.",
      "Check the result at full size. If you can still make out the feature, increase the strength and apply again.",
      "Look for faces and number plates in reflections, windows and screens in the background.",
      "Remove location data as well before posting, with the EXIF Viewer and Remover.",
    ],
    faq: [
      {
        question: "Is blurring as safe as a black box?",
        answer:
          "In a saved picture, yes — both replace the pixels. Blur keeps the photo looking natural. What is not safe is a box drawn on top in a document editor, where the picture underneath is still there.",
      },
      {
        question: "Can I blur text, such as a name badge or a screen?",
        answer: "Yes. Drag a box over any area — text, a number plate, a badge — and it is blurred the same way.",
      },
      {
        question: "Is my photo uploaded?",
        answer: "No. The blur is applied in your browser.",
      },
    ],
  },

  "passport-photo-maker": {
    tips: [
      "Read the official rules for your application before taking the photo: size, background colour, head size and how recent it must be.",
      "Stand half a metre in front of a plain light wall and face a window, so there are no shadows on your face or behind your head.",
      "Have someone else take the picture from about 1–1.5 metres away; selfies distort faces.",
      "Do not use filters, smoothing or background replacement. Edited photos are rejected.",
    ],
    faq: [
      {
        question: "Which sizes are included?",
        answer:
          "35 × 45 mm (UK, EU and Australia), 51 × 51 mm or 2 × 2 inches (US and India), and 33 × 48 mm (China).",
      },
      {
        question: "Can I use it for a visa or an ID card?",
        answer:
          "Yes, if one of the sizes matches what the application asks for. Check the background, head-size and recency rules for that document too.",
      },
      {
        question: "How do I check the printed size?",
        answer:
          "Measure one printed photo with a ruler. If it is the wrong size, the print was scaled — print at 100% or actual size rather than fit to page.",
      },
    ],
  },

  "image-dpi-changer": {
    tips: [
      "Work out the pixels you need: inches × DPI. A 6 × 4 inch print at 300 DPI needs 1800 × 1200 pixels.",
      "300 DPI suits photographs viewed close up; posters seen from a distance look fine at 150.",
      "If your image already has enough pixels for the print size, choose Keep pixels and change nothing else.",
      "Start from the largest original you have; enlarging a small picture cannot add detail.",
    ],
    faq: [
      {
        question: "How many pixels does an A4 print need at 300 DPI?",
        answer: "About 2480 × 3508 pixels, since A4 is about 8.27 × 11.69 inches.",
      },
      {
        question: "Does DPI matter for images on a screen?",
        answer:
          "No. Screens show an image by its pixels, so the DPI number has no effect on how it looks on a website or phone.",
      },
      {
        question: "Is my picture uploaded?",
        answer: "No. The change is made in your browser.",
      },
    ],
  },

  "grayscale-image": {
    tips: [
      "Use Natural for photographs; it keeps colours that looked equally bright at the same grey.",
      "Use High contrast for photos or scans of documents to make the text stand out.",
      "Check red elements, which become dark greys; Flat mode lightens them if needed.",
      "Keep the colour original. Colour cannot be recovered from the grey version.",
    ],
    faq: [
      {
        question: "Why is the result a PNG?",
        answer:
          "PNG saves the converted picture without further loss. For a photograph you want to share, convert the PNG to JPG afterwards for a smaller file.",
      },
      {
        question: "Is grayscale the same as black and white?",
        answer:
          "Not quite. Greyscale keeps every shade of grey between black and white. A pure black-and-white image uses only two tones.",
      },
      {
        question: "Is my picture uploaded?",
        answer: "No. The conversion runs in your browser.",
      },
    ],
  },

  "color-blindness-simulator": {
    tips: [
      "Test charts, maps, status badges and anything else where colour carries meaning.",
      "Start with deuteranopia, the most common type.",
      "Never rely on colour alone: add labels, icons, patterns or position.",
      "Check links in body text. If they are distinguished only by colour, add an underline.",
    ],
    faq: [
      {
        question: "How common is colour blindness?",
        answer:
          "Red-green colour vision deficiency affects roughly 1 in 12 men and 1 in 200 women of Northern European ancestry. Other types are much rarer.",
      },
      {
        question: "What are the four types simulated?",
        answer:
          "Protanopia and deuteranopia (red-green), tritanopia (blue-yellow) and achromatopsia (no colour vision).",
      },
      {
        question: "Is my screenshot uploaded?",
        answer: "No. The simulation is calculated in your browser.",
      },
    ],
  },
};
