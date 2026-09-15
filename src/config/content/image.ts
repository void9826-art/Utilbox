import type { ToolContent } from "@/types/tool";

const LOCAL_NOTE =
  "Images are decoded by the browser, redrawn on a canvas and re-encoded on your own machine. Nothing is uploaded, so there is no waiting on a queue and no copy of your photos anywhere else.";

export const imageContent: Record<string, ToolContent> = {
  "webp-to-png": {
    seoTitle: "WebP to PNG Converter — Free, Keeps Transparency",
    seoDescription:
      "Convert WebP images to PNG with transparency preserved, or to JPG for smaller files. Batch conversion in your browser, with no upload and no watermark.",
    intro:
      "Turn WebP images into PNG files that keep their transparency, or into JPGs for the smallest size. Convert a whole batch at once.",
    howToUse: [
      "Add one or more WebP images.",
      "Choose PNG to keep transparency, or JPG for smaller photo files.",
      "Press Convert.",
      "Download the files one at a time or together as a ZIP.",
    ],
    howItWorks: [
      "Your browser decodes each WebP to raw pixels, draws them onto a canvas and encodes them again in the format you picked. PNG is lossless, so the PNG holds exactly the pixels the WebP decoded to — including its alpha channel, which is why transparent backgrounds stay transparent.",
      "A lossy WebP has already discarded some detail when it was first saved, and converting cannot bring that back. What PNG does guarantee is that nothing further is lost, however many times the file is edited and saved again.",
      "Expect the PNG to be larger than the WebP — often several times larger for photographs — because storing photographic detail losslessly takes space. For photos where transparency does not matter, JPG gives a much smaller file.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Will the PNG keep the transparent background?",
        answer:
          "Yes. PNG supports full alpha transparency, so transparent and semi-transparent pixels come through unchanged. JPG does not, so if you choose JPG the transparent areas are filled with the background colour you pick.",
      },
      {
        question: "Why is the PNG bigger than the WebP?",
        answer:
          "WebP uses more modern compression, and lossy WebP throws detail away to save space. PNG stores every pixel exactly, which for a photograph usually means a much larger file.",
      },
      {
        question: "Can I convert animated WebP files?",
        answer: "Only the first frame is converted. The animation is not carried over.",
      },
      {
        question: "How many files can I convert at once?",
        answer:
          "There is no fixed limit on the number of files, and each can be up to 50 MB. Very large batches use more memory, so on a phone it is kinder to work in smaller groups.",
      },
    ],
  },

  "avif-to-jpg": {
    seoTitle: "AVIF to JPG Converter — Free Online, No Upload",
    seoDescription:
      "Convert AVIF images to JPG or PNG so older apps, email clients and editors can open them. Batch conversion that runs in your browser — nothing is uploaded.",
    intro:
      "Convert AVIF images to JPG or PNG for apps that cannot open AVIF yet. Add a batch and download them all together.",
    howToUse: [
      "Add one or more .avif files.",
      "Choose JPG for photos or PNG for images with transparency.",
      "Press Convert.",
      "Download the files individually or as a ZIP.",
    ],
    howItWorks: [
      "AVIF is an image format built on the AV1 video codec. It compresses far better than JPG, which is why many websites now serve it — and why images saved from those sites often arrive as .avif files that older software refuses to open.",
      "Current versions of Chrome, Edge, Firefox and Safari can decode AVIF themselves, so this tool uses your browser's own decoder: each file is decoded to pixels, drawn on a canvas and encoded as JPG or PNG. A browser too old to decode AVIF will report the file as unreadable, and updating it fixes that.",
      "A JPG is usually larger than the AVIF it came from at a similar visual quality; that is the price of compatibility. Choose PNG when the image has transparency or sharp text you want to keep lossless.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Which browsers can convert AVIF here?",
        answer:
          "Any browser that can display AVIF: current Chrome, Edge and Firefox, and Safari 16 or later. Older browsers cannot decode the format, and the tool will say the file could not be opened.",
      },
      {
        question: "Is the JPG lower quality than the AVIF?",
        answer:
          "JPG re-encodes the image, so a little detail is lost at any quality below 100. At the default setting the difference is hard to see. Choose PNG for a lossless copy of what the AVIF decoded to.",
      },
      {
        question: "What happens to transparency?",
        answer:
          "JPG cannot store it, so transparent areas are filled with the background colour you choose. PNG keeps transparency exactly.",
      },
      {
        question: "Does it convert animated AVIF?",
        answer: "Only the first frame is converted.",
      },
    ],
  },

  "image-color-palette": {
    seoTitle: "Extract Colors From Image Online — Palette Finder",
    seoDescription:
      "Extract the dominant colors from any image online. Get HEX, RGB and HSL codes, each color's share of the picture, and CSS or JSON to copy — no upload.",
    intro:
      "Upload a photo, logo or screenshot and get its main colours as HEX, RGB and HSL codes. Click anywhere on the image to sample a single point.",
    howToUse: [
      "Add an image.",
      "Choose how many colours you want in the palette.",
      "Copy any colour code, or copy the whole palette as CSS variables, a Tailwind theme or JSON.",
      "Click a point on the image to read the colour at that spot.",
    ],
    howItWorks: [
      "The image is scaled down and read pixel by pixel in your browser. Similar pixels are grouped into buckets — 32,768 of them, five bits per colour channel — so a photo with millions of pixels becomes a few thousand weighted colours that can be analysed instantly.",
      "Those colours are clustered with k-means in CIELAB colour space. Distance in CIELAB matches how different two colours look to the eye far more closely than distance in RGB, so the palette favours colours that are visibly distinct rather than several near-identical shades of one background.",
      "The starting points are chosen deterministically — the most common colour first, then whichever colour is furthest from those already chosen — so the same image always gives the same palette. A colour's share is the proportion of the image's opaque pixels closest to it; transparent pixels are ignored.",
      "Each colour also shows whether white or black text reads better on top of it, with the WCAG contrast ratio, which helps when turning a palette into a design.",
    ],
    faq: [
      {
        question: "Why is a small but striking colour missing from the palette?",
        answer:
          "The palette is weighted by how much of the image each colour covers, so a tiny accent can be absorbed into a larger neighbouring cluster. Increase the number of colours, or click the spot on the image to sample it directly.",
      },
      {
        question: "Are the colours exact?",
        answer:
          "Palette colours are the average of their cluster, so they are representative rather than copied from one pixel. The click-to-sample colour is read from a single pixel of the scaled-down copy of your image.",
      },
      {
        question: "What does the contrast ratio mean?",
        answer:
          "It is the WCAG 2 contrast between the colour and white or black text. 4.5:1 is the minimum for normal body text at level AA; 3:1 is enough for large text.",
      },
      {
        question: "Is my image uploaded?",
        answer: "No. The pixels are read and clustered on your own device.",
      },
    ],
  },

  "exif-remover": {
    seoTitle: "Remove EXIF Data From Photo Online — EXIF Viewer",
    seoDescription:
      "See and remove EXIF data from photos online — GPS location, camera details and dates. Works on JPG, PNG and WebP without re-compressing, and nothing is uploaded.",
    intro:
      "See what a photo reveals about where and how it was taken, then remove that metadata before you share it. The image itself is not re-compressed.",
    howToUse: [
      "Add one or more JPG, PNG or WebP photos.",
      "Review the metadata found in each photo — location, device details and dates are flagged at the top.",
      "Choose whether to keep the colour profile and, for JPGs, the rotation setting.",
      "Press Remove metadata, then download the cleaned photos.",
    ],
    howItWorks: [
      "Photos carry more than pixels. A camera or phone writes EXIF data into the file — usually the date and time and the device make and model, often lens and exposure settings, sometimes a serial number and, if location services were on, GPS coordinates precise enough to identify a home. Editing apps add XMP and IPTC blocks with software names, authors and edit history.",
      "This tool reads that metadata, then removes it by cutting the metadata blocks out of the file's structure: EXIF, XMP, IPTC and comment segments in a JPEG; EXIF, text and timestamp chunks in a PNG; EXIF and XMP chunks in a WebP. The compressed image data is copied byte for byte, so there is no re-encoding and no loss of quality.",
      "Two things are kept by default because removing them changes how the photo looks. The ICC colour profile tells software how to display the colours. And phones often store a picture sideways with an EXIF instruction to rotate it; deleting that would show the photo on its side, so for JPGs a new, minimal EXIF block containing only the rotation value is written back. Both can be switched off.",
      "After cleaning, each file is read again with the same metadata parser and the tool reports what, if anything, is still present — so the result is checked rather than assumed. Extra images some phones append after the main photo, such as depth maps, are also dropped from JPGs.",
    ],
    faq: [
      {
        question: "Don't social networks remove EXIF data anyway?",
        answer:
          "Many large platforms strip location from public uploads, but email attachments, messaging apps sending original-quality files, cloud share links and many websites pass the file on untouched. Removing it yourself means you do not have to rely on each service.",
      },
      {
        question: "Will removing EXIF reduce image quality?",
        answer:
          "No. The image data is not decoded or re-compressed; only the metadata blocks are cut out, so the pixels are identical.",
      },
      {
        question: "Why is the rotation kept?",
        answer:
          "Phones often save photos sideways and rely on an EXIF flag to display them upright. Keeping just that one value stops the cleaned photo appearing rotated, and it reveals nothing about you.",
      },
      {
        question: "Can it clean HEIC or RAW files?",
        answer:
          "Not at the moment. Convert HEIC photos to JPG first with the HEIC to JPG converter, then check the JPG here.",
      },
    ],
  },

  "favicon-generator": {
    seoTitle: "Favicon Generator — ICO, PNG and Apple Touch Icons",
    seoDescription:
      "Free favicon generator: create favicon.ico, PNG icons, an Apple touch icon, Android icons and a web manifest from an image or a letter, right in your browser.",
    intro:
      "Create every favicon file a website needs from one image, or from a letter or emoji, and download them as a ready-to-use ZIP with the HTML to paste in.",
    howToUse: [
      "Upload a square logo or icon, or switch to Letter or emoji and type one or two characters.",
      "Adjust the shape, padding and background until the small previews read clearly.",
      "Enter your site name for the web manifest.",
      "Download the ZIP, upload the files to your site's root folder, and paste the HTML into the head of your pages.",
    ],
    howItWorks: [
      "Browsers, phones and operating systems each look for a different icon file. The ZIP contains favicon.ico with 16, 32 and 48-pixel images for browser tabs and Windows; 16 and 32-pixel PNGs; a 180-pixel apple-touch-icon.png for iPhone and iPad home screens; 192 and 512-pixel PNGs for Android and installable web apps; and a site.webmanifest that points to them.",
      "Each icon is drawn once at 512 pixels and then scaled down in halving steps, which keeps small sizes smoother than a single jump from a large image. The .ico file stores each size as an embedded PNG — a variant Windows has supported since Vista and every current browser reads — so transparency survives intact.",
      "The Apple touch icon always gets a solid background, because iOS shows transparent areas as black and applies its own rounded corners. The other icons use the shape and transparency you choose.",
      "Detail disappears at 16 pixels. The enlarged previews show exactly what a browser tab will display, so simplify the design until the 16-pixel version is still recognisable.",
    ],
    faq: [
      {
        question: "Do I still need favicon.ico?",
        answer:
          "Browsers request /favicon.ico automatically even when no icon is declared, and some tools and feed readers only look there. Shipping it alongside the PNG files covers every case.",
      },
      {
        question: "Where do I put the files?",
        answer:
          "Upload them to the root of your site so they are served from addresses like example.com/favicon.ico, then paste the HTML into the head of your pages. If the files live in a subfolder, change the paths in the HTML and the manifest to match.",
      },
      {
        question: "Why doesn't my new favicon show up?",
        answer:
          "Browsers cache favicons aggressively. Open the icon's address directly, hard-refresh the page, or check in a private window.",
      },
      {
        question: "Can I use an SVG?",
        answer:
          "Yes. SVG uploads are rasterised at each size. An SVG without width and height attributes needs a viewBox so its proportions are known.",
      },
    ],
  },

  "compress-image": {
    seoTitle: "Compress Image Online — Reduce Photo Size Free",
    seoDescription:
      "Shrink JPG, PNG and WebP images with a quality slider and a live before-and-after preview. Free, unlimited, and processed in your browser.",
    intro:
      "Make images smaller without a visible drop in quality. Drag the quality slider and watch the file size change before you download.",
    howToUse: [
      "Add one or more images.",
      "Drag the quality slider — the estimated output size updates as you move it.",
      "Compare the original and compressed previews side by side.",
      "Download the images individually, or all of them as a ZIP.",
    ],
    howItWorks: [
      "Each image is decoded, drawn onto a canvas, and re-encoded at the quality you choose. Lossy encoders such as JPEG and WebP discard the detail human vision is least sensitive to — mostly fine colour variation — which is why an image can lose 70% of its file size while looking essentially unchanged.",
      "Quality between 75 and 85 is the practical sweet spot for photographs. Below about 60, JPEG artefacts start appearing around hard edges and in flat areas of colour. Screenshots and graphics with sharp lines behave differently: they compress badly as JPEG and are better left as PNG or converted to WebP.",
      "Optionally the image can be resized at the same time, which usually saves far more than quality alone. A 4000-pixel photo displayed at 1200 pixels wide is carrying more than ten times the data it needs.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "How much smaller will my image get?",
        answer:
          "Typically 50–80% for photographs at quality 80. The exact figure depends on the image — a detailed landscape compresses less than a portrait with a smooth background. The tool shows the real saving before you download.",
      },
      {
        question: "Will compression ruin the quality?",
        answer:
          "At quality 80 the difference is very hard to see at normal viewing sizes. The before-and-after preview lets you judge for yourself at full zoom.",
      },
      {
        question: "Can I compress PNG images?",
        answer:
          "PNG is lossless, so quality settings do not apply. The most effective way to shrink a PNG is to resize it, or convert it to WebP, both of which this tool can do.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "Images up to 50 MB each are accepted. Very large images use a lot of memory during processing, so on a phone you may want to work through them in smaller batches.",
      },
    ],
  },

  "resize-image": {
    seoTitle: "Resize Image Online — Change Dimensions Free",
    seoDescription:
      "Resize images by pixel dimensions or percentage with the aspect ratio locked. Includes presets for common social and web sizes.",
    intro:
      "Change an image's dimensions by pixels or percentage. The aspect ratio stays locked unless you unlock it, so nothing gets stretched.",
    howToUse: [
      "Add an image — its current dimensions appear immediately.",
      "Type a new width or height, or drag the percentage slider.",
      "Leave the lock on to keep the proportions, or turn it off to set both freely.",
      "Download the resized image.",
    ],
    howItWorks: [
      "The image is drawn onto a canvas at the target size using the browser's built-in high-quality resampling, which averages neighbouring pixels rather than simply dropping them. That is what keeps a downsized photo smooth instead of jagged.",
      "Making an image smaller is lossless in appearance — there is more information than you need, so removing some is safe. Making one larger cannot invent detail that was never captured, so enlarging past about 150% starts to look soft. When you scale up, the tool warns you.",
      "With the aspect lock on, changing one dimension recalculates the other from the original ratio, so circles stay circular and faces are not squashed.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Will resizing distort my image?",
        answer:
          "Not with the aspect ratio locked, which is the default. Unlocking it lets you set width and height independently, which will stretch the picture.",
      },
      {
        question: "Can I make an image bigger without losing quality?",
        answer:
          "Not really. Enlarging interpolates between existing pixels; it cannot recover detail the camera never recorded. Up to about 150% looks acceptable, beyond that it softens.",
      },
      {
        question: "What size should I use for the web?",
        answer:
          "1200–1600 pixels wide covers most full-width web images. Thumbnails rarely need more than 400. Matching the display size is the single biggest saving you can make.",
      },
      {
        question: "Does resizing also reduce file size?",
        answer:
          "Yes, considerably — file size scales roughly with pixel count, so halving both dimensions cuts the data to about a quarter.",
      },
    ],
  },

  "jpg-to-png": {
    seoTitle: "JPG to PNG Converter — Free Online, No Upload",
    seoDescription:
      "Convert JPG and JPEG images to lossless PNG format in your browser. Batch conversion, no watermark, no sign-up.",
    intro: "Convert JPG photos to PNG — a lossless format that survives repeated editing without degrading.",
    howToUse: [
      "Add one or more JPG files.",
      "Press Convert.",
      "Download the PNG files individually or as a ZIP.",
    ],
    howItWorks: [
      "The JPEG is decoded to raw pixels and re-encoded as PNG, which stores those pixels losslessly. Nothing more is lost in the conversion — but nothing that JPEG already discarded comes back either. Compression artefacts baked into the original stay in the PNG.",
      "The practical reason to convert is editing. Every time a JPEG is saved it is re-compressed, so repeated edits accumulate damage. PNG can be opened and saved indefinitely with no further loss, which makes it the better working format.",
      "Expect the PNG to be substantially larger — often three to five times the JPEG — because lossless storage of photographic detail simply takes more space.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Why is my PNG so much bigger than the JPG?",
        answer:
          "PNG stores every pixel exactly, while JPEG throws away detail to save space. For photographs, that difference is usually three to five times the file size.",
      },
      {
        question: "Does converting improve the quality?",
        answer:
          "No. Conversion preserves what is there; it cannot restore detail JPEG already discarded. It does prevent further loss from future edits.",
      },
      {
        question: "Will the PNG have transparency?",
        answer:
          "No. JPEG cannot store transparency, so there is none to carry over. The PNG will be fully opaque.",
      },
    ],
  },

  "png-to-jpg": {
    seoTitle: "PNG to JPG Converter — Free With Background Colour",
    seoDescription:
      "Convert PNG images to JPG, choosing a background colour to replace transparency and a quality level. Runs entirely in your browser.",
    intro:
      "Convert PNG images to JPG for smaller files. Pick the background colour that replaces any transparency.",
    howToUse: [
      "Add one or more PNG images.",
      "Choose the background colour used where the PNG is transparent — white is the usual choice.",
      "Set the JPEG quality.",
      "Download the results.",
    ],
    howItWorks: [
      "JPEG has no alpha channel, so transparency has to be resolved before encoding. The canvas is filled with your chosen colour and the PNG is drawn on top, which flattens transparent regions onto that background rather than leaving them black — which is what happens if the fill step is skipped.",
      "For photographic content the size saving is large: a PNG photo converted at quality 85 typically lands at a fifth of the original. For flat graphics, logos and screenshots the saving is smaller and the artefacts more visible, so PNG is often the better format to keep.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "What happens to transparent areas?",
        answer:
          "They are filled with the background colour you choose, because JPEG cannot store transparency. White is the default and suits most cases.",
      },
      {
        question: "How much smaller will the JPG be?",
        answer:
          "For photographs, often 70–85% smaller. For flat graphics and screenshots the saving is much less, and PNG may be the better choice.",
      },
      {
        question: "Should I convert screenshots to JPG?",
        answer:
          "Usually not. JPEG blurs the sharp edges of text and interface elements. Keep screenshots as PNG, or use WebP for a smaller lossless file.",
      },
    ],
  },

  "webp-to-jpg": {
    seoTitle: "WebP to JPG Converter — Open WebP Files Anywhere",
    seoDescription:
      "Convert WebP images to JPG so any application can open them. Free, batch-capable, and processed entirely in your browser.",
    intro:
      "Convert WebP images to JPG so older software and printers can open them. Works on both lossy and lossless WebP.",
    howToUse: [
      "Add your WebP files.",
      "Set the JPEG quality and the background colour for transparent areas.",
      "Press Convert and download.",
    ],
    howItWorks: [
      "Browsers can decode WebP natively, so the image is decoded, composited onto a background where it is transparent, and re-encoded as JPEG.",
      "This is a lossy-to-lossy conversion: WebP already discarded some detail, and JPEG discards a little more. At quality 85 the second loss is not visible in normal viewing, but converting back and forth repeatedly will accumulate.",
      "WebP is a genuinely better format for the web — smaller at the same visible quality — so the reason to convert is usually compatibility with a specific application rather than a technical improvement.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Why can I not open WebP files?",
        answer:
          "WebP is well supported in browsers but still missing from some desktop editors, older photo viewers and print services. Converting to JPG sidesteps the problem.",
      },
      {
        question: "Will the JPG be bigger than the WebP?",
        answer:
          "Usually yes, by 25–35%, because WebP compresses more efficiently at the same visible quality.",
      },
      {
        question: "Can I convert animated WebP files?",
        answer:
          "Only the first frame. JPEG has no animation support, so an animated WebP becomes a single still image.",
      },
    ],
  },

  "heic-to-jpg": {
    seoTitle: "HEIC to JPG Converter Online — Batch, No Upload",
    seoDescription:
      "Free HEIC to JPG converter online. Convert iPhone photos in batches with no limit on how many files you add — it runs in your browser, so nothing is uploaded.",
    intro:
      "Convert iPhone HEIC photos to JPG online. Add as many photos as you like, convert them in one batch, and download them together as a ZIP.",
    howToUse: [
      "Add your .heic or .heif files — several at once is fine.",
      "Choose the output quality.",
      "Press Convert and wait while each photo is decoded.",
      "Download the JPGs individually or as a ZIP.",
    ],
    howItWorks: [
      "HEIC stores images using HEVC compression inside a HEIF container. It is genuinely efficient — roughly half the size of an equivalent JPEG — but most browsers cannot decode it natively because of patent licensing around HEVC.",
      "This tool loads a WebAssembly build of libheif, the reference decoder, directly into the page. Your photo is decoded to raw pixels in the browser tab and re-encoded as JPEG on the spot. That means the decoder is a few megabytes to download on first use, but nothing about your photos leaves the machine.",
      "Because HEIC is already lossy, re-encoding as JPEG loses a little more. At quality 90 the difference is not visible; the resulting file will typically be larger than the HEIC despite the quality loss, which is simply the price of JPEG's older compression.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Why will Windows not open my iPhone photos?",
        answer:
          "Windows needs a paid HEVC codec extension to display HEIC files. Converting to JPG avoids that entirely.",
      },
      {
        question: "How do I stop my iPhone creating HEIC files?",
        answer:
          'On the phone, go to Settings → Camera → Formats and choose "Most Compatible". New photos will be JPEGs, though existing HEIC files stay as they are.',
      },
      {
        question: "Does converting lose quality?",
        answer:
          "A small amount, since both formats are lossy. At quality 90 it is not visible at normal viewing sizes.",
      },
      {
        question: "Why does the first conversion take longer?",
        answer:
          "The HEIC decoder has to be downloaded once, then it is cached. Later conversions in the same session are much faster.",
      },
    ],
  },

  "image-to-text": {
    seoTitle: "Image to Text (OCR) — Extract Text From Pictures Free",
    seoDescription:
      "Read the words out of a screenshot, photo or scan with real OCR running in your browser. Supports multiple languages and copies straight to your clipboard.",
    intro:
      "Read the text out of a screenshot, photo or scanned page using real optical character recognition — running on your own device.",
    howToUse: [
      "Add an image containing text.",
      "Choose the language of the text, which improves accuracy considerably.",
      "Press Extract text and watch the progress — the first run downloads the language data.",
      "Review the result, then copy it or download it as a .txt file.",
    ],
    howItWorks: [
      "This uses Tesseract, the long-established open-source OCR engine, compiled to WebAssembly and run inside a Web Worker in your browser. The engine finds text regions, segments them into lines and characters, and matches character shapes against a trained model for the language you selected.",
      "Accuracy depends almost entirely on the input. A flat, well-lit screenshot of printed text is usually near-perfect. A photograph taken at an angle, in poor light, or of handwriting will be much less reliable — Tesseract is trained on printed type, not handwriting.",
      "Choosing the right language matters more than people expect, because the model uses a dictionary to resolve ambiguous shapes. Running English text through the German model will produce noticeably worse output.",
      "The language data is a few megabytes and is downloaded once, then cached for later runs. Recognition itself happens entirely on your device — the image is never sent anywhere.",
    ],
    faq: [
      {
        question: "How accurate is the text recognition?",
        answer:
          "On clear printed text — screenshots, PDFs rendered as images, flat scans — accuracy is typically well above 95%. Angled photographs, low light, unusual fonts and handwriting all reduce it sharply.",
      },
      {
        question: "Can it read handwriting?",
        answer:
          "Not reliably. The engine is trained on printed type. Neat block capitals sometimes work; ordinary cursive rarely does.",
      },
      {
        question: "Which languages are supported?",
        answer:
          "A range including English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, Korean, Arabic and Hindi. Each downloads its own trained model on first use.",
      },
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. The OCR engine runs inside your browser tab. Only the language model is downloaded, and that is the same public file for everyone.",
      },
      {
        question: "How can I get better results?",
        answer:
          "Use the highest-resolution image you have, make sure the text is horizontal and in focus, crop away irrelevant background, and pick the correct language.",
      },
    ],
  },

  "image-to-pdf": {
    seoTitle: "Image to PDF — Combine Photos into One PDF Free",
    seoDescription:
      "Turn JPG, PNG and WebP images into a single PDF document with control over page size, orientation and margins.",
    intro:
      "Combine any mix of images into one PDF. Set the page size, reorder the pages, and download.",
    howToUse: [
      "Add your images in any supported format.",
      "Reorder them with the arrows.",
      "Choose page size, orientation and margins.",
      "Press Create PDF and download.",
    ],
    howItWorks: [
      "JPEG images are embedded directly with no re-encoding, so their quality is untouched. PNG and WebP images are converted to a PDF-compatible encoding first, since PDF supports a fixed set of image formats.",
      "Each image is scaled to fit within the page margins while keeping its aspect ratio, then centred. Choosing to match the page to the image instead gives every page the exact proportions of its picture, which suits receipts and screenshots.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Which image formats can I use?",
        answer: "JPG, PNG, WebP, GIF and BMP. They can be mixed freely in the same document.",
      },
      {
        question: "Can I put several images on one page?",
        answer:
          "No — this tool places one image per page. It keeps each picture as large and as legible as possible.",
      },
      {
        question: "How do I change the order?",
        answer: "Use the arrows next to each file. Pages are built in exactly the order shown.",
      },
    ],
  },

  "crop-image": {
    seoTitle: "Crop Image Online — Free Cropper With Aspect Ratios",
    seoDescription:
      "Crop photos by dragging a selection or snapping to a preset aspect ratio, with exact pixel controls. Free and processed in your browser.",
    intro:
      "Crop an image by dragging a selection box, or snap to a preset ratio for a profile picture, post or banner.",
    howToUse: [
      "Add an image.",
      "Drag on the preview to set the crop area, then drag the handles to fine-tune it.",
      "Pick a preset aspect ratio if you need an exact shape, or type pixel values directly.",
      "Press Crop and download the result.",
    ],
    howItWorks: [
      "The preview is a scaled version of your image, so the selection you draw is mapped back onto the full-resolution original before cropping. The output is therefore cut from the real pixels, not from the smaller preview — a 4000-pixel photo cropped to half its width gives a 2000-pixel result, not a preview-sized one.",
      "Locking an aspect ratio constrains the selection as you drag, which is the reliable way to hit an exact 1:1 or 16:9 shape. Pixel fields let you type precise values when a platform demands a specific size.",
      "Cropping is lossless in itself; the pixels you keep are unchanged. Any quality change comes only from the format you export to.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Does cropping reduce quality?",
        answer:
          "No. The pixels you keep are copied exactly. Only the export format affects quality, and PNG export is lossless.",
      },
      {
        question: "What aspect ratio should I use for a profile picture?",
        answer:
          "1:1 (square) for almost every platform. Banners are usually 16:9 or 3:1 — the presets cover the common ones.",
      },
      {
        question: "Can I crop to an exact pixel size?",
        answer:
          "Yes. Type the width and height you need into the pixel fields and position the selection by dragging.",
      },
    ],
  },

  "rotate-image": {
    seoTitle: "Rotate and Flip Image Online — Free, No Upload",
    seoDescription:
      "Rotate images in 90-degree steps or by any angle, and flip them horizontally or vertically. Free and processed in your browser.",
    intro:
      "Rotate an image in 90° steps or by a free angle, and flip it horizontally or vertically.",
    howToUse: [
      "Add an image.",
      "Use the rotate buttons for quarter turns, or drag the angle slider for anything in between.",
      "Flip horizontally or vertically if you need a mirror image.",
      "Download the result.",
    ],
    howItWorks: [
      "Quarter turns and flips are exact: the canvas is transformed and the pixels are moved without resampling, so the result is pixel-identical to the original, just reoriented.",
      "Free-angle rotation is different. The image no longer aligns with the pixel grid, so it has to be resampled, and the canvas is enlarged to fit the rotated corners. The new corner areas are filled with the background colour you choose. A slight softening is unavoidable at arbitrary angles.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Does rotating lose quality?",
        answer:
          "Not for 90°, 180° or 270° turns, or for flips — those are exact. Arbitrary angles require resampling and soften the image very slightly.",
      },
      {
        question: "Why did my image get bigger after rotating by 30 degrees?",
        answer:
          "A rotated rectangle needs a larger bounding box to fit its corners. The extra area is filled with your chosen background colour.",
      },
      {
        question: "What is the difference between rotating and flipping?",
        answer:
          "Rotating turns the image around its centre. Flipping mirrors it, so text reads backwards — useful for transfers and reflections.",
      },
    ],
  },

  "image-converter": {
    seoTitle: "Image Converter — JPG, PNG and WebP in Batch",
    seoDescription:
      "Convert between JPG, PNG and WebP in one batch, with quality control and optional resizing. Free and entirely browser-based.",
    intro:
      "Convert a batch of images between JPG, PNG and WebP, optionally resizing and compressing them at the same time.",
    howToUse: [
      "Add your images — formats can be mixed.",
      "Choose the output format and quality.",
      "Optionally cap the maximum width or height.",
      "Convert, then download individually or as a ZIP.",
    ],
    howItWorks: [
      "Every image is decoded to raw pixels, optionally scaled, and re-encoded in the target format. Because everything passes through a common pixel representation, any input format the browser can read can become any output format it can write.",
      "The three formats suit different jobs. JPEG is the smallest for photographs and is universally supported. PNG is lossless and keeps transparency, which makes it right for logos, screenshots and anything with hard edges. WebP does both jobs better than either — typically 25–35% smaller than JPEG at the same visible quality, with transparency support — and is now supported everywhere except some older desktop software.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Which format should I choose?",
        answer:
          "WebP for the web, if compatibility allows. JPEG for photographs that must open anywhere. PNG for graphics, screenshots and anything needing transparency.",
      },
      {
        question: "Can I convert several images at once?",
        answer:
          "Yes. Add as many as you like, convert them in one pass, and download them together as a ZIP.",
      },
      {
        question: "Does converting to PNG improve a JPEG?",
        answer:
          "No. It prevents further loss on future edits, but it cannot restore detail the JPEG already discarded — and the file will be considerably larger.",
      },
    ],
  },
  "png-to-webp": {
    seoTitle: "PNG to WebP Converter — Free, Keeps Alpha",
    seoDescription:
      "Convert PNG images to WebP online for free. Transparency is preserved, files usually shrink by half or more, and nothing is uploaded.",
    intro:
      "Turn PNGs into WebP files that keep their transparency but weigh a fraction as much — the usual first step in making a page load faster.",
    howToUse: [
      "Add one PNG or a whole batch.",
      "Set the quality; 80 to 90 is right for most pictures.",
      "Convert, then compare the before and after sizes shown for each file.",
      "Download them one at a time or together as a ZIP.",
    ],
    howItWorks: [
      "PNG stores every pixel exactly, which is why screenshots and logos look perfect and why the files are large. WebP can do the same losslessly, and can also throw away detail the eye is poor at noticing. Both modes keep the alpha channel, so a transparent logo stays transparent.",
      "Quality below about 80 begins to show on the things PNG is usually chosen for — hard edges, flat colour and small text — as a faint halo. Photographs tolerate far more compression than screenshots do, so the right setting depends on what the picture contains.",
      "Every current browser displays WebP, and has done for years, so the old reason for sticking with PNG has gone. Keep the PNG as your master copy and publish the WebP.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Does transparency survive?",
        answer: "Yes. WebP has a full alpha channel, so transparent areas stay transparent.",
      },
      {
        question: "Which quality should I choose?",
        answer:
          "Around 90 for logos, screenshots and anything with text; 75 to 85 is plenty for photographs.",
      },
      {
        question: "Can every browser show WebP?",
        answer: "Yes — Chrome, Edge, Firefox and Safari have all supported it for several years.",
      },
      {
        question: "Is anything uploaded?",
        answer: "No. The conversion runs in your browser, so the pictures never leave your device.",
      },
    ],
  },
  "jpg-to-webp": {
    seoTitle: "JPG to WebP Converter — Free, Smaller Photos",
    seoDescription:
      "Convert JPG photos to WebP online for free. Typically 25-35% smaller at the same visual quality, converted in your browser with nothing uploaded.",
    intro:
      "Re-encode photographs as WebP, which reaches the same visual quality as JPG in noticeably fewer bytes.",
    howToUse: [
      "Add one JPG or a batch of them.",
      "Choose a quality — 80 suits most photographs.",
      "Convert and check the saving reported for each file.",
      "Download individually or as a ZIP.",
    ],
    howItWorks: [
      "WebP uses a more modern compression method than JPG, which is why it lands 25-35% smaller at a matched visual quality. On a page of photographs that is the difference between a fast load and a slow one, especially on a phone connection.",
      "Converting is re-encoding, not recovery: any detail the original JPG already discarded is gone for good, and compressing twice always costs a little more. Convert from the largest original you still have rather than from a copy that has been through several rounds.",
      "JPG has no transparency, so nothing is lost on that front. Photographs with fine grain or heavy texture compress least well in any format — those are the ones worth checking at full size before publishing.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Will the photo look worse?",
        answer:
          "At quality 80 and above the difference is very hard to see, and the file is much smaller. Compare at full size if the picture matters.",
      },
      {
        question: "Does it strip EXIF data?",
        answer:
          "Re-encoding through the browser does not carry camera metadata across, so location and camera details do not travel with the WebP.",
      },
      {
        question: "Should I keep the JPG?",
        answer: "Yes. Keep the original as your master and publish the WebP.",
      },
      {
        question: "Is there a file limit?",
        answer: "Files up to 50 MB each, and as many as your browser has memory for.",
      },
    ],
  },
  "jpg-to-avif": {
    seoTitle: "JPG to AVIF Converter — Smallest Photo Format",
    seoDescription:
      "Convert JPG to AVIF in your browser. AVIF beats JPG and WebP at the same visual quality; the tool checks your browser can encode it before starting.",
    intro:
      "Encode a photograph as AVIF, the most efficient image format browsers widely support — often half the size of the same JPG.",
    howToUse: [
      "Add a JPG.",
      "Pick a quality; AVIF holds up well far lower than JPG does, so 50 to 60 is a sensible start.",
      "Convert — encoding takes a moment longer than other formats.",
      "Compare the saving shown, then download.",
    ],
    howItWorks: [
      "AVIF comes from the AV1 video codec, which is why it compresses so much better than formats designed decades earlier. It handles gradients and flat colour particularly well, where JPG tends to show banding and blocking.",
      "Encoding is the catch. It is computationally heavy, and not every browser can do it: Chrome and Edge on a desktop can, while Firefox and Safari can display AVIF but not write it. This tool tests that ability before offering anything, and says so plainly rather than producing a broken file.",
      "Because AVIF tolerates lower quality settings gracefully, the same visual result often needs a much lower number than JPG would. Start at 50, look at the picture, and raise it only if you can see the difference.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Why does it say my browser cannot encode AVIF?",
        answer:
          "Displaying AVIF and creating it are different abilities. Firefox and Safari can show it but not write it; Chrome or Edge on a desktop can do both.",
      },
      {
        question: "Why is it slower than the other converters?",
        answer: "AVIF encoding does far more work per pixel. The trade is a much smaller file.",
      },
      {
        question: "Can I use AVIF on my website today?",
        answer:
          "Yes, every current browser displays it. Offering a WebP or JPG fallback is still polite for very old software.",
      },
      {
        question: "Is quality 50 really enough?",
        answer:
          "For most photographs, yes — AVIF at 50 often looks like JPG at 75. Judge it on your own picture at full size.",
      },
    ],
  },
  "svg-to-png": {
    seoTitle: "SVG to PNG Converter — Any Size, Free",
    seoDescription:
      "Convert SVG to PNG online at any resolution. The vector is drawn at the size you ask for, so the result is sharp rather than scaled up.",
    intro:
      "Turn a vector drawing into a PNG at whatever pixel size you need, for places that will not accept an SVG.",
    howToUse: [
      "Add the SVG file.",
      "Set the output width — the height follows the drawing's proportions.",
      "Choose whether the background stays transparent or becomes white.",
      "Render and download the PNG.",
    ],
    howItWorks: [
      "An SVG has no pixels at all; it is a set of drawing instructions. That is why it can be exported at any size without ever going blurry, and why the width you choose here matters: the drawing is rasterised at that exact size rather than blown up from a small bitmap.",
      "Transparency is kept by default, which is what you want for a logo going onto a coloured background. Turning it off puts the drawing on white, which suits documents and slide decks that show transparency as a checkerboard.",
      "One limitation is worth knowing. The drawing is rendered by the browser in isolation, so an SVG that pulls in an external image, an external font or a stylesheet will be missing those pieces. Embed them in the file first if the result looks wrong.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "What size should I export?",
        answer:
          "Twice the size it will be displayed at, so it stays sharp on high-density screens. 1024 px wide covers most uses.",
      },
      {
        question: "Why is my text missing or in the wrong font?",
        answer:
          "The SVG refers to a font your browser does not have. Convert the text to outlines in your drawing program first.",
      },
      {
        question: "Can I get a transparent PNG?",
        answer: "Yes, that is the default. Untick the option to place the drawing on white instead.",
      },
      {
        question: "Does it handle animated SVG?",
        answer: "The first frame is drawn. A PNG cannot hold animation.",
      },
    ],
  },
  "circle-crop-image": {
    seoTitle: "Circle Crop Image — Round Profile Pictures",
    seoDescription:
      "Crop any photo into a circle online, with a transparent background and an optional white ring. Nothing is uploaded.",
    intro:
      "Cut a picture into a circle for a profile photo or an avatar, with the corners left properly transparent.",
    howToUse: [
      "Add the photo.",
      "Zoom in if the subject needs to fill more of the frame.",
      "Add a white ring if the circle will sit on a dark background.",
      "Download the PNG.",
    ],
    howItWorks: [
      "The circle is cut from the largest square the picture allows, centred, so a wide photo crops to its middle rather than being squashed into shape. Zooming scales the source inside that square, which is how you bring a face forward without changing the output size.",
      "The result is always a PNG. That is deliberate: JPG has no transparency, so the corners outside the circle would be filled with a colour and the effect would be lost the moment the picture sat on a different background.",
      "Most sites that display round avatars actually store a square image and round it with a mask. Cropping the circle yourself is what makes it look right in the places that do not, such as documents, slide decks and printed material.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Why is the file a PNG?",
        answer:
          "Only PNG keeps the transparent corners. A JPG would fill them with white and the circle would show as a square on any coloured background.",
      },
      {
        question: "Can I crop an oval instead?",
        answer:
          "The crop is a true circle taken from a centred square. Crop the picture to the proportions you want first if you need an oval.",
      },
      {
        question: "Will it find the face for me?",
        answer:
          "No — the crop is centred and you adjust it with the zoom. Nothing is analysed or sent anywhere.",
      },
      {
        question: "What size is the result?",
        answer: "The shorter side of the original, so no detail is invented or thrown away.",
      },
    ],
  },
  "passport-photo-maker": {
    seoTitle: "Passport Photo Size Online — UK, US, EU, AU",
    seoDescription:
      "Size a portrait to passport dimensions online: 35x45mm for the UK and EU, 2x2 inches for the US and India, plus China and Australia, at 300 DPI.",
    intro:
      "Crop a portrait to the exact dimensions an application asks for, at print quality, without uploading a photograph of your face to anyone.",
    howToUse: [
      "Add a portrait taken against a plain background.",
      "Choose the country or size you need.",
      "Use the zoom and the up-and-down control to place the head correctly.",
      "Download the JPG and take it to any print shop.",
    ],
    howItWorks: [
      "Each preset is the published size in millimetres, rendered at 300 dots per inch — the density print shops expect. A 35 × 45 mm photo therefore comes out at 413 × 531 pixels, which is what makes it print at the right physical size rather than merely looking right on screen.",
      "The picture is scaled to fill the frame and then centred, with a control to nudge it up or down. Head placement is the most common reason an application is rejected, and it is the part a crop can actually fix.",
      "What software cannot do is judge the rest of the rules: background colour, expression, glasses, head coverings, how much of the frame the head must occupy, and how recent the photograph must be. Those vary by country and change from time to time, so read the requirements published by whoever is receiving it.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Will this photo definitely be accepted?",
        answer:
          "It will be the right size at the right density. Acceptance also depends on background, expression, lighting and head proportion, which you have to get right when taking the picture.",
      },
      {
        question: "Why 300 DPI?",
        answer:
          "It is the density print shops work at. Below it, a printed photo looks soft and can be rejected on quality.",
      },
      {
        question: "Is my photo uploaded anywhere?",
        answer: "No. It is cropped in your browser and never sent to a server.",
      },
      {
        question: "Can I print several on one sheet?",
        answer:
          "Download the photo, then use the Multiple PDF Pages Per Sheet tool, or ask the print shop — most will place several on a 6 × 4 print.",
      },
    ],
  },
  "instagram-image-resizer": {
    seoTitle: "Instagram Image Size Resizer — Free Online",
    seoDescription:
      "Resize pictures to Instagram sizes: square, portrait, landscape and Story or Reel. Fill and crop, or fit and pad with a colour you choose.",
    intro:
      "Prepare a picture at exactly the size Instagram stores, so the app has no reason to re-compress or crop it for you.",
    howToUse: [
      "Add the picture.",
      "Choose the format — square, portrait, landscape, or Story and Reel.",
      "Pick fill and crop, or fit and pad if nothing may be cut off.",
      "Download the JPG and upload that.",
    ],
    howItWorks: [
      "Instagram stores posts at 1080 pixels wide, at one of a few fixed proportions. Uploading something that does not match means the app scales and re-compresses it on the way in, and that second pass is what turns crisp text soft and clean gradients blocky.",
      "Fill and crop scales the picture until it covers the frame and trims the overflow, which suits photographs. Fit and pad scales it until the whole picture fits and fills the rest with a colour, which is what you want for a graphic, a screenshot or anything with text near the edge.",
      "Portrait posts at 1080 × 1350 take up the most room in the feed, which is why so many accounts prefer them. Stories and Reels are 1080 × 1920, and the top and bottom of that frame are covered by the interface — keep anything important away from those edges.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Why not let Instagram resize it?",
        answer:
          "It will, but it re-compresses at the same time. Supplying the exact size avoids that extra pass and keeps text sharp.",
      },
      {
        question: "Which format gets the most space in the feed?",
        answer: "Portrait, at 1080 × 1350. It is taller on screen than a square post.",
      },
      {
        question: "My picture is cut off — what do I do?",
        answer: "Switch from fill and crop to fit and pad, and choose a padding colour that suits the picture.",
      },
      {
        question: "Does this work for other platforms?",
        answer:
          "The square and portrait sizes suit most feeds, and the Story size matches other vertical video formats too.",
      },
    ],
  },
  "youtube-thumbnail-downloader": {
    seoTitle: "YouTube Thumbnail Downloader — Full Resolution",
    seoDescription:
      "Download the thumbnail of any YouTube video in every size it was stored at. Paste a link, a Shorts URL or the video id — no account needed.",
    intro:
      "Grab the thumbnail image of any YouTube video, at the largest size that video actually has.",
    howToUse: [
      "Paste a YouTube link, a youtu.be short link, a Shorts URL, or the 11-character video id.",
      "The sizes that exist for that video appear as previews.",
      "Press Download under the one you want.",
      "Sizes a video does not have are simply not shown.",
    ],
    howItWorks: [
      "YouTube generates a set of thumbnail images for every upload and serves them as ordinary public files, named by video id and size. This tool works out the id from whichever URL shape you paste and points at those files directly — there is no API key, no login and nothing scraped from the page.",
      "Four sizes are offered, from 1280 × 720 down to 320 × 180. Not every video has the largest: uploads from before high-definition thumbnails, and some lower resolution videos, stop at 480 × 360. A size that does not exist is detected when its preview fails to load and is dropped from the list rather than offered as a broken download.",
      "The id itself is always 11 characters of letters, digits, hyphens and underscores, which is why a bare id works as well as a full link.",
      "A thumbnail is the creator's work. Using one for reference, a review, a link preview or research is ordinary use; passing it off as your own is not.",
    ],
    faq: [
      {
        question: "Why is the maximum size missing for my video?",
        answer:
          "That video has no 1280 × 720 thumbnail — usually an older or lower resolution upload. The largest it does have is shown.",
      },
      {
        question: "Does this need an API key or a login?",
        answer: "No. Thumbnails are public files served by YouTube for every video.",
      },
      {
        question: "Do Shorts work?",
        answer: "Yes. Shorts, embeds, live links and youtu.be links all carry the same video id.",
      },
      {
        question: "Can I use the thumbnail however I like?",
        answer:
          "It belongs to whoever made the video. Reference, review and commentary are normal uses; republishing it as your own is not.",
      },
    ],
  },
  "image-watermark": {
    seoTitle: "Add Watermark to Image — Free, Nothing Uploaded",
    seoDescription:
      "Add a text watermark to a photo online. Corner, centred or tiled, with adjustable size, colour and opacity, applied in your browser.",
    intro:
      "Stamp your name or a copyright line across a picture before you post it, without handing the original to a website first.",
    howToUse: [
      "Add the picture.",
      "Type the wording — a name, a site address or a copyright line.",
      "Choose a position, then set the size and opacity.",
      "Download the marked picture; the original is untouched.",
    ],
    howItWorks: [
      "The text is drawn into the picture itself at a size proportional to its width, so the same settings look right on a small web photo and a full-resolution camera file. A soft shadow sits behind the text, which is what keeps white lettering readable over a pale sky.",
      "Position is a trade-off rather than a preference. A corner mark is unobtrusive and trivially cropped off. A tiled mark across the whole frame is far harder to remove and equally hard to look past. Centred sits between the two.",
      "Be clear about what this achieves: a watermark discourages casual reuse and identifies the source when a picture travels. It is not protection, because anyone with an editor and patience can paint it out.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Can the watermark be removed?",
        answer:
          "By someone determined, yes. Tiling it across the picture makes that much more work than a single corner mark.",
      },
      {
        question: "Can I use my logo instead of text?",
        answer: "This version places text. A logo overlay is a sensible future addition.",
      },
      {
        question: "Does it change the original file?",
        answer: "No. A new picture is produced and the file on your device is untouched.",
      },
      {
        question: "Which colour works best?",
        answer:
          "White with the built-in shadow reads on most photographs. Black suits pale, high-key pictures better.",
      },
    ],
  },
  "blur-faces-in-photo": {
    seoTitle: "Blur Faces in a Photo — Free, Stays Private",
    seoDescription:
      "Blur faces, number plates or anything private in a photo online. The blur is applied to the picture itself, and nothing is uploaded.",
    intro:
      "Blur out faces, number plates or a name badge before sharing a photo — on your own device, which is rather the point.",
    howToUse: [
      "Add the photo.",
      "Drag a box across each face or detail that must be hidden.",
      "Adjust the blur strength until nothing is recognisable.",
      "Apply and download the result.",
    ],
    howItWorks: [
      "Each marked area is redrawn from the original pixels through a blur filter, and that blurred result becomes part of the saved picture. The detail inside it is destroyed rather than covered, so there is nothing underneath for anyone to recover by moving a shape aside.",
      "That distinction matters more than it sounds. Pasting a black rectangle over a face in a document editor leaves the face in the file, which is how a number of people have accidentally published exactly what they meant to hide.",
      "Strength is worth checking rather than guessing. A light blur on a small face can still be readable when the picture is enlarged; if you can make out the feature at full size, increase the strength and apply again.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Can the blur be undone?",
        answer:
          "Not from the saved picture. The pixels in the marked areas are replaced, so the detail is not present in the file.",
      },
      {
        question: "Does it find faces automatically?",
        answer:
          "No. You mark the areas yourself, which means nothing is analysed and no face data is created or sent anywhere.",
      },
      {
        question: "How strong should the blur be?",
        answer:
          "Strong enough that you cannot recognise the feature when viewing the result at full size. When in doubt, go further.",
      },
      {
        question: "Does this remove location data too?",
        answer:
          "Re-saving drops camera metadata, but use the EXIF Remover if stripping location is the main goal.",
      },
    ],
  },
  "image-dpi-changer": {
    seoTitle: "Change Image DPI — 300 DPI for Printing",
    seoDescription:
      "Change an image to 300 DPI or any density online. Keep the pixels as they are, or resample so the picture prints at an exact width.",
    intro:
      "Set the print density of a picture, or resize it so that it measures exactly what a printer asked for.",
    howToUse: [
      "Add the picture.",
      "Choose Keep pixels to leave the image alone, or Resize pixels to hit a physical width.",
      "Set the density — 300 DPI is what print shops usually ask for.",
      "Download the result.",
    ],
    howItWorks: [
      "DPI describes how densely pixels are laid down on paper, not how good a picture is. The same 1200-pixel-wide photo prints four inches across at 300 DPI and sixteen inches across at 75 DPI, using identical pixels. This is why being told to send something at 300 DPI, with no size attached, is an incomplete instruction.",
      "Keep pixels leaves the picture exactly as it is, which is the honest answer when the image already has enough detail for the size it will be printed. Resize pixels recalculates the image so that it measures the width you enter at the density you chose.",
      "Enlarging cannot invent detail. Going from a 600-pixel-wide picture to something that needs 2400 pixels will look soft however the numbers are labelled, so start from the largest original you have.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Does raising DPI improve quality?",
        answer:
          "Not by itself. It changes the printed size the file asks for. Quality comes from having enough pixels for that size.",
      },
      {
        question: "How many pixels do I need for a 6 × 4 print?",
        answer: "At 300 DPI, 1800 × 1200 pixels.",
      },
      {
        question: "Which option should I choose?",
        answer:
          "Keep pixels if your picture is already large enough. Resize pixels when a printer has specified a physical size.",
      },
      {
        question: "Why is my enlarged picture soft?",
        answer:
          "Resampling upwards stretches existing detail; it cannot create more. Use a bigger original wherever possible.",
      },
    ],
  },
  "grayscale-image": {
    seoTitle: "Convert Image to Black and White — Free Online",
    seoDescription:
      "Convert a picture to grayscale online with three methods: natural luminance, a flat average, or high contrast for scanned documents.",
    intro:
      "Turn a colour picture black and white, with a choice of how the colours are weighed on the way.",
    howToUse: [
      "Add the picture.",
      "Pick a conversion — Natural suits photographs, High contrast suits scanned text.",
      "Compare the result against the original above it.",
      "Download the PNG.",
    ],
    howItWorks: [
      "Natural uses the Rec. 709 luminance weighting: roughly 21% red, 72% green and 7% blue. Those proportions reflect how sensitive the eye is to each colour, so a red and a blue that look equally bright stay equally bright as greys instead of collapsing into the same tone.",
      "Flat is the plain average of the three channels. It is the naive method, and it tends to make reds look darker and greens lighter than they appeared — occasionally that is the effect you want, which is why it is offered.",
      "High contrast applies the natural weighting and then pushes values away from mid-grey, deepening blacks and lifting whites. That is what makes photographed or scanned text easier to read, at the cost of losing subtle detail in a photograph.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "Which method should I use?",
        answer: "Natural for photographs, High contrast for documents and screenshots of text.",
      },
      {
        question: "Does it reduce the file size?",
        answer:
          "Only a little. The picture still has three colour channels, just with equal values. Converting to a true greyscale format elsewhere saves more.",
      },
      {
        question: "Can I undo it later?",
        answer: "Not from the result — colour information is discarded. Keep the original.",
      },
      {
        question: "Why does my red logo look so dark?",
        answer:
          "The eye is far less sensitive to red than green, so a pure red converts to a dark grey. Flat mode lightens it, at the cost of accuracy.",
      },
    ],
  },
  "color-blindness-simulator": {
    seoTitle: "Colour Blindness Simulator — Check Any Image",
    seoDescription:
      "See how an image looks to people with protanopia, deuteranopia, tritanopia or no colour vision. Runs in your browser, nothing uploaded.",
    intro:
      "See a design, chart or screenshot the way people with each main type of colour vision deficiency see it — and find out whether it still makes sense.",
    howToUse: [
      "Add a screenshot of the design, chart or interface.",
      "Switch between the four types.",
      "Look for anything that becomes indistinguishable — a red and green line, a status badge, a link.",
      "Download the simulation if you need it for a report or a ticket.",
    ],
    howItWorks: [
      "Each simulation applies a matrix that redistributes the red, green and blue channels to approximate what reaches the brain when one type of cone is missing. Deuteranopia and protanopia both affect the red-green axis and together account for the large majority of cases, at roughly 1% of men each. Tritanopia affects blue and yellow and is rare. Achromatopsia, no colour vision at all, is rarer still.",
      "The purpose is a decision, not a picture. If a chart's two lines merge, or a green tick and a red cross become the same grey, the design is carrying meaning in colour alone — which is exactly what accessibility guidance warns against.",
      "The fix is almost never a different palette. Add a text label, a different shape, a pattern or a position so the information survives without colour. That helps in greyscale printing and bright sunlight too.",
      LOCAL_NOTE,
    ],
    faq: [
      {
        question: "How accurate is the simulation?",
        answer:
          "It is a well-established approximation, good enough to catch designs that fail. Real perception varies between individuals and includes partial forms this does not model.",
      },
      {
        question: "Which type should I check first?",
        answer:
          "Deuteranopia — the green-deficient form is the most common, and red-green confusion catches the most designs.",
      },
      {
        question: "Two colours look identical — what now?",
        answer:
          "Add something that is not colour: a label, a shape, a pattern or a difference in position. Changing the palette alone rarely fixes it.",
      },
      {
        question: "Does this replace testing with real people?",
        answer: "No. It catches obvious failures early; people catch the rest.",
      },
    ],
  },
};
