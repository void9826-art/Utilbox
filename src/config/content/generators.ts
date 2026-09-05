import type { ToolContent } from "@/types/tool";

export const generatorContent: Record<string, ToolContent> = {
  "qr-code-generator": {
    seoTitle: "QR Code Generator — Free, No Watermark, No Expiry",
    seoDescription:
      "Create QR codes for links, text, email, phone, SMS and Wi-Fi. Download as PNG or SVG, with no watermark, no account and no expiry.",
    intro:
      "Create a QR code for a link, message, contact detail or Wi-Fi network. Download it as a PNG or a scalable SVG.",
    howToUse: [
      "Choose what the code should contain — a URL, plain text, an email, a phone number, an SMS or Wi-Fi details.",
      "Fill in the fields; the code redraws as you type.",
      "Adjust the size, colours and error-correction level if you need to.",
      "Download as PNG for general use, or SVG for print.",
    ],
    howItWorks: [
      "Your content is encoded directly into the QR pattern, which is why these codes never expire and do not depend on this site staying online. A scanner reads the pattern and gets your text back, with no redirect in between. Codes from services that offer 'dynamic' tracking work differently — they encode a short link that can stop working.",
      "Error correction is the reason a QR code still scans with a logo over it or a coffee stain across a corner. Redundant data is woven through the pattern at one of four levels: L recovers about 7% damage, M 15%, Q 25% and H 30%. Higher levels need more modules, making the pattern denser for the same content.",
      "Choose L for a clean screen display, M for general printing, and H when the code will be printed small, on a curved surface, or partly covered.",
      "Contrast matters more than colour. Keep the pattern dark on a light background — inverted codes fail on many scanners — and always leave the quiet zone, the clear margin around the edge, intact.",
    ],
    example: {
      scenario: "A Wi-Fi code for guests",
      steps: [
        'Choose the Wi-Fi type.',
        "Enter the network name, the password and the security type (usually WPA).",
        "Download as PNG and print it for the wall.",
      ],
      result: "Guests point a camera at it and join without typing the password.",
    },
    faq: [
      {
        question: "Do these QR codes expire?",
        answer:
          "No. The content is encoded in the pattern itself, so the code works forever and does not depend on this site. There is no tracking redirect.",
      },
      {
        question: "PNG or SVG?",
        answer:
          "PNG for screens, documents and most printing. SVG is a vector, so it stays perfectly sharp at any size — use it for posters, signage and anything large.",
      },
      {
        question: "Why will my QR code not scan?",
        answer:
          "The usual causes are too little contrast, an inverted colour scheme, no clear margin around the edge, or the code being printed too small for the amount of data. Raising the error-correction level and simplifying the content both help.",
      },
      {
        question: "Can I put a logo in the middle?",
        answer:
          "Yes, if you set error correction to H and keep the logo under about 20% of the width. Test it with several phones before printing.",
      },
      {
        question: "How much text can a QR code hold?",
        answer:
          "Up to about 4,300 alphanumeric characters in theory, but a code that dense is hard to scan. Keep it under a couple of hundred characters for anything practical.",
      },
    ],
  },

  "barcode-generator": {
    seoTitle: "Barcode Generator — CODE128, EAN-13, UPC-A Free",
    seoDescription:
      "Generate retail and logistics barcodes including CODE128, EAN-13, UPC-A, CODE39 and ITF-14. Download as PNG or SVG.",
    intro:
      "Generate standard retail and logistics barcodes. Check digits are calculated for you, and you can download PNG or SVG.",
    howToUse: [
      "Pick the barcode format you need.",
      "Type the value — the tool tells you immediately if it is not valid for that format.",
      "Adjust bar width, height and whether the text is shown underneath.",
      "Download as PNG or SVG.",
    ],
    howItWorks: [
      "Each format encodes characters as a pattern of bars and spaces of varying widths, and each has its own rules about what it can hold. CODE128 takes any ASCII text and is the workhorse for shipping and internal labels. EAN-13 and UPC-A are the fixed-length retail formats you see on products, and both require a check digit.",
      "The check digit is calculated for you. It comes from a weighted sum of the other digits, and it lets a scanner detect a misread rather than silently returning the wrong product. Type twelve digits for an EAN-13 and the thirteenth is added automatically; type all thirteen and the tool verifies it.",
      "For real retail use, the number itself has to be allocated to you by GS1 — a barcode you invent will scan, but it will not identify your product in any retailer's system. For internal stock control, warehouse labels and asset tags, any value you like is fine.",
    ],
    faq: [
      {
        question: "Which barcode format should I use?",
        answer:
          "CODE128 for internal labels, shipping and anything alphanumeric. EAN-13 for retail products outside North America, UPC-A inside it. ITF-14 for outer cartons.",
      },
      {
        question: "What is a check digit?",
        answer:
          "A final digit computed from the others so scanners can catch misreads. This tool calculates it automatically and validates one if you supply it.",
      },
      {
        question: "Can I use these barcodes on products I sell in shops?",
        answer:
          "Only with a number allocated to you by GS1. The barcode will scan regardless, but retail systems identify products by the number, and unregistered numbers are not recognised.",
      },
      {
        question: "Why is my value rejected?",
        answer:
          "Each format has strict rules — EAN-13 needs exactly 12 or 13 digits, UPC-A needs 11 or 12, and CODE39 accepts only a limited character set. The message under the field explains what is expected.",
      },
    ],
  },

  "password-generator": {
    seoTitle: "Password Generator — Strong Random Passwords Free",
    seoDescription:
      "Generate strong random passwords and passphrases using your browser's cryptographic random number generator. Nothing is transmitted or stored.",
    intro:
      "Generate strong random passwords or memorable passphrases. Everything is produced on your device using cryptographic randomness.",
    howToUse: [
      "Choose between a random password and a word-based passphrase.",
      "Set the length and which character types to include.",
      "Turn on the ambiguous-character filter if you will be typing the password by hand.",
      "Copy the result, or generate a batch if you need several.",
    ],
    howItWorks: [
      "Randomness comes from crypto.getRandomValues(), the browser's cryptographically secure generator, which is seeded by the operating system's entropy pool. This matters: Math.random() is fast but predictable enough that an attacker who sees a few outputs can work out the rest, which makes it unsuitable for anything secret.",
      "Characters are selected using rejection sampling rather than a simple modulo, because modulo introduces a slight bias toward the start of the character set. Rejection sampling discards values that would skew the distribution, so every character is genuinely equally likely.",
      "The strength figure shown is entropy in bits — log₂ of the number of possible passwords of that length and character set. It measures how many guesses an attacker needs on average, and it is the honest way to compare two passwords. A 16-character password from the full set is about 105 bits, which is beyond brute force by any realistic margin.",
      "Passphrases trade length for memorability. Four random words from a large list give roughly 52 bits — weaker than a long random string but far stronger than anything a person invents, and much easier to type on a phone.",
      "Nothing generated here is transmitted, logged or stored. Closing the tab is the end of it.",
    ],
    faq: [
      {
        question: "How long should my password be?",
        answer:
          "At least 16 characters for anything important. Length contributes more to strength than complexity does — a long password from a smaller character set beats a short one with symbols.",
      },
      {
        question: "Is this password generator safe to use?",
        answer:
          "The generation happens entirely in your browser using cryptographic randomness. Nothing is sent over the network and nothing is stored. That said, for accounts that matter, a dedicated password manager is the better tool because it also handles storage.",
      },
      {
        question: "What does entropy mean?",
        answer:
          "The number of bits of true randomness in the password. Each extra bit doubles the guessing effort. Under 50 bits is weak, 70–80 is solid, and above 100 is well beyond brute force.",
      },
      {
        question: "Should I use a passphrase instead?",
        answer:
          "For passwords you have to type often, or recite aloud, yes. Four or five random words are easy to remember and far stronger than a typical invented password.",
      },
      {
        question: "What are ambiguous characters?",
        answer:
          "Pairs that look alike in many fonts: 0 and O, 1, l and I. Excluding them makes a password safer to read off a screen or a printout, at a small cost in entropy.",
      },
    ],
  },

  "random-number-generator": {
    seoTitle: "Random Number Generator — Pick Numbers in a Range",
    seoDescription:
      "Generate random numbers in any range, with or without duplicates. Uses cryptographic randomness, with optional sorting and instant copying.",
    intro:
      "Generate random whole numbers in any range — one at a time, or a whole set with duplicates ruled out.",
    howToUse: [
      "Set the lowest and highest numbers in your range.",
      "Choose how many numbers you want.",
      "Turn off duplicates if each number must be unique, as for a lottery draw.",
      "Generate, then copy the results.",
    ],
    howItWorks: [
      "Numbers come from crypto.getRandomValues(), the same cryptographic source used for passwords, rather than Math.random(). For a raffle or a decision that matters, that difference is worth having.",
      "Getting a uniform distribution from random bytes takes a little care. Simply taking the remainder of a random number leaves the lower part of the range very slightly more likely — imperceptible for small ranges, but a real bias. Rejection sampling avoids it by discarding values that fall outside a clean multiple of the range.",
      "With duplicates disabled, the tool draws without replacement, which is what a lottery or a prize draw actually does. It also checks that the range is large enough to supply the count you asked for.",
    ],
    faq: [
      {
        question: "Is this truly random?",
        answer:
          "It uses the browser's cryptographically secure generator, seeded from operating system entropy. It is not quantum randomness, but it is unpredictable by any practical means.",
      },
      {
        question: "Can I stop numbers repeating?",
        answer:
          "Yes. Turn off duplicates and the numbers are drawn without replacement, exactly as in a lottery draw.",
      },
      {
        question: "Can I use this for a prize draw?",
        answer:
          "The randomness is sound. For anything with legal or contractual weight, keep a record of the entrant list and the result, since the draw itself leaves no audit trail.",
      },
      {
        question: "Are the endpoints included?",
        answer: "Yes. Both the minimum and the maximum can be drawn.",
      },
    ],
  },

  "invoice-generator": {
    seoTitle: "Free Invoice Generator — Create PDF Invoices Online",
    seoDescription:
      "Build a professional invoice with line items, tax and discounts, then download it as a real PDF. No account, no watermark, no upload.",
    intro:
      "Build a professional invoice with line items, tax and totals, then download it as a proper PDF with selectable text.",
    howToUse: [
      "Fill in your details and your client's details.",
      "Add a line for each item with its quantity and unit price.",
      "Set the tax rate, any discount, and the currency.",
      "Check the live preview, then download the PDF or print it.",
    ],
    howItWorks: [
      "The preview you see is the document you get. Line totals, subtotal, discount, tax and the final amount are recalculated as you type, using whole-cent arithmetic so the figures add up exactly rather than drifting by a penny.",
      "The PDF is built as a real vector document with embedded standard fonts, not a screenshot of the page. That means the text is selectable and searchable, the file is small, and it prints crisply at any size — which matters when a client's accounting system tries to read it.",
      "Everything stays in the browser. Client names, addresses and amounts are never transmitted, which is the main reason to prefer a local tool for invoicing over one that asks you to sign in.",
    ],
    faq: [
      {
        question: "Is there a watermark or a limit?",
        answer: "No watermark, no invoice limit and no account. The PDF is yours.",
      },
      {
        question: "Are my client's details sent anywhere?",
        answer:
          "No. Everything you type stays in the browser tab and the PDF is generated locally.",
      },
      {
        question: "Can I add my logo?",
        answer:
          "Yes. Upload an image and it is embedded into the PDF header.",
      },
      {
        question: "Is the invoice legally compliant?",
        answer:
          "The layout covers what most jurisdictions require — parties, dates, an invoice number, itemised charges and tax. Specific requirements vary, so check what your country expects, particularly around tax registration numbers.",
      },
      {
        question: "Will my invoice be saved for next time?",
        answer:
          "No. Nothing is stored, so keep the PDF you download. That is the trade-off for nothing leaving your device.",
      },
    ],
  },

  "resume-generator": {
    seoTitle: "Free Resume Builder — Create and Download a CV as PDF",
    seoDescription:
      "Build a clean, ATS-friendly one-page resume and download it as a real PDF. No sign-up, no watermark, and nothing is uploaded.",
    intro:
      "Fill in your details and get a clean, single-column CV as a PDF that applicant tracking systems can actually read.",
    howToUse: [
      "Enter your contact details and a short professional summary.",
      "Add your work experience, education and skills.",
      "Reorder or remove any section you do not need.",
      "Check the preview, then download the PDF.",
    ],
    howItWorks: [
      "The layout is deliberately plain, and that is a feature. Most applications pass through an applicant tracking system that extracts text before a human sees it, and those systems struggle with multi-column layouts, text in tables, icons standing in for labels, and text embedded in graphics. A single column with conventional headings parses cleanly every time.",
      "The PDF is generated as real text with embedded fonts rather than as an image, so the text can be selected, searched and extracted — which is exactly what an ATS needs to do.",
      "Everything stays on your device. Your employment history, contact details and dates are never transmitted.",
    ],
    faq: [
      {
        question: "Will this resume pass applicant tracking systems?",
        answer:
          "The format is built for it: one column, standard headings, real selectable text and no graphics carrying information. That covers the common reasons resumes get mangled.",
      },
      {
        question: "How long should a resume be?",
        answer:
          "One page for most people, two if you have more than about ten years of relevant experience. The preview shows page breaks so you can see where you stand.",
      },
      {
        question: "Can I add a photo?",
        answer:
          "The template deliberately omits one. Photos are expected in parts of Europe and Asia but discouraged in the UK and North America, where they raise bias concerns and can confuse automated parsing.",
      },
      {
        question: "Is my personal information uploaded?",
        answer:
          "No. Everything you type stays in the browser and the PDF is built locally.",
      },
    ],
  },

  "lorem-ipsum-generator": {
    seoTitle: "Lorem Ipsum Generator — Placeholder Text for Mockups",
    seoDescription:
      "Generate lorem ipsum placeholder text by paragraph, sentence, word or list item. Choose classic Latin or plain English filler.",
    intro:
      "Generate placeholder text for a design mockup — by paragraph, sentence, word or list item.",
    howToUse: [
      "Choose what to generate: paragraphs, sentences, words or list items.",
      "Set how many you want.",
      "Pick classic Latin or plain English filler.",
      "Copy the text, or download it as a file.",
    ],
    howItWorks: [
      "The classic text is a scrambled passage from Cicero's De Finibus Bonorum et Malorum, written in 45 BC and used by typesetters since the 1500s. Sentences are assembled by drawing from that vocabulary with varied lengths, so paragraphs look like real prose without being readable.",
      "Meaningless text is the point. Readable copy pulls attention to the words, so people review the writing instead of the layout. Latin-looking filler keeps the eye on typography, spacing and rhythm — while still having the right distribution of word and sentence lengths to make line breaks realistic.",
      "The English option is there for the cases where Latin gets in the way, such as showing a client a draft where nonsense words would be distracting.",
    ],
    faq: [
      {
        question: "What does lorem ipsum actually mean?",
        answer:
          "Nothing coherent. It is a scrambled fragment of a Latin philosophical text from 45 BC, deliberately corrupted so it cannot be read as prose.",
      },
      {
        question: "Why use placeholder text at all?",
        answer:
          "Because readable text distracts from layout. With filler, reviewers judge spacing, hierarchy and typography rather than the copy.",
      },
      {
        question: "Should it start with 'Lorem ipsum dolor sit amet'?",
        answer:
          "It is the traditional opening and most designers expect it, which is why it is the default. You can turn it off if you want a fully random start.",
      },
    ],
  },

  "uuid-generator": {
    seoTitle: "UUID Generator — v4 and v7 UUIDs, Bulk Generation",
    seoDescription:
      "Generate cryptographically random version 4 UUIDs and time-ordered version 7 UUIDs. Bulk output, multiple formats, copy or download.",
    intro:
      "Generate valid UUIDs — random version 4, or time-ordered version 7 for database keys. Produce one or thousands.",
    howToUse: [
      "Choose the UUID version you need.",
      "Set how many to generate.",
      "Pick a format: standard hyphenated, uppercase, braced, or no hyphens.",
      "Copy the list, or download it as a text file.",
    ],
    howItWorks: [
      "A UUID is a 128-bit identifier that can be created independently anywhere without coordination, and still be unique in practice. Version 4 fills 122 of those bits with cryptographic randomness — enough that generating a billion a second for a century still leaves the chance of a collision negligible.",
      "Version 7 solves a real problem with version 4. Random UUIDs arrive at a database in random order, which scatters writes across a B-tree index and fragments it badly. Version 7 puts a 48-bit millisecond timestamp at the front, so identifiers generated later sort later. Inserts land at the end of the index, and range queries by time become possible.",
      "The trade-off is that version 7 leaks approximately when the identifier was created. For an internal primary key that is usually fine; for a public unguessable token, version 4 is the safer choice.",
      "Both versions set the version and variant bits correctly, so the output validates against RFC 9562.",
    ],
    example: {
      scenario: "Reading the structure of a UUID",
      steps: [
        "0189d5f2-1e4c-7a3b-9c2d-4e5f6a7b8c9d",
        "The 13th character is the version — 7 here.",
        "The 17th character encodes the variant, always 8, 9, a or b.",
      ],
      result: "A valid RFC 9562 version 7 UUID whose first 48 bits are a timestamp.",
    },
    faq: [
      {
        question: "Should I use UUID v4 or v7?",
        answer:
          "v7 for database primary keys, because it sorts by creation time and keeps indexes compact. v4 for public tokens and anything where the creation time should not be inferable.",
      },
      {
        question: "Can two UUIDs ever be the same?",
        answer:
          "In theory yes, in practice no. With 122 random bits you would need to generate around 2.7 × 10¹⁸ of them before a collision became likely.",
      },
      {
        question: "Do I need to worry about the format?",
        answer:
          "The hyphenated lowercase form is the standard and works everywhere. Braced and uppercase variants exist mainly for older Microsoft tooling.",
      },
      {
        question: "How many can I generate at once?",
        answer:
          "Up to ten thousand in one go, which is enough to seed a test database.",
      },
    ],
  },
};
