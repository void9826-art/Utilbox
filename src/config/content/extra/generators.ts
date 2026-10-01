import type { ToolContentExtra } from "@/types/tool";

export const generatorExtra: Record<string, ToolContentExtra> = {
  "qr-code-generator": {
    tips: [
      "Point the code at an address you control and can keep stable, such as yoursite.com/menu, so it keeps working when the content changes.",
      "Keep the content short. A short link makes a coarser pattern that scans from further away and survives a poor print.",
      "Print dark modules on a light background and leave the clear margin around the code untouched.",
      "Test the printed code with two or three different phones before printing a full run.",
    ],
    faq: [
      {
        question: "Can I count how many people scan my QR code?",
        answer:
          "Not with the code itself, because it contains no tracking redirect. Point it at a link tagged with the UTM Link Builder and your website analytics will count the visits.",
      },
      {
        question: "How big should I print a QR code?",
        answer:
          "About 2 cm across is a sensible minimum for a short link held in the hand. A common rule of thumb is that a code scans from about ten times its own width, so posters need much larger codes.",
      },
      {
        question: "Can a QR code open a PDF or a menu?",
        answer:
          "Yes, if the PDF or menu is online. Upload it somewhere you control and put its web address in the code.",
      },
    ],
  },

  "barcode-generator": {
    tips: [
      "For products sold in shops, get the number from GS1 in your country before generating the barcode.",
      "Download SVG for printing so the bars stay sharp at any size.",
      "Print black bars on a white background; red bars cannot be read by most scanners.",
      "Scan a test print with a real scanner or a barcode app before printing labels in bulk.",
    ],
    faq: [
      {
        question: "What size should a printed retail barcode be?",
        answer:
          "The standard EAN-13 symbol, including its margins, is 37.29 mm wide and 25.93 mm high. GS1's rules allow printing between 80% and 200% of that size.",
      },
      {
        question: "Can I make a barcode for a book's ISBN?",
        answer:
          "Yes. A 13-digit ISBN starting 978 or 979 is printed as an EAN-13 barcode. Choose EAN-13 and enter the ISBN without hyphens.",
      },
      {
        question: "Why won't my phone's camera scan the barcode?",
        answer:
          "Most built-in camera apps read QR codes but not product barcodes. Use a barcode scanner app, and make sure the print has good contrast and clear margins either side.",
      },
    ],
  },

  "password-generator": {
    tips: [
      "Use a different password for every site; one leak then only affects one account.",
      "Paste the password straight into a password manager rather than writing it somewhere temporary.",
      "Choose 16 characters or more for anything important.",
      "Turn on two-factor authentication as well, starting with your email account.",
    ],
    faq: [
      {
        question: "How long would a password take to crack?",
        answer:
          "For random passwords using all character types, against an attacker making 10 billion guesses a second: about a week to try every 8-character password, and about 1.5 million years for 12 characters.",
      },
      {
        question: "Can I generate several passwords at once?",
        answer: "Yes. Generate a batch and copy the ones you need.",
      },
      {
        question: "Should I change my passwords regularly?",
        answer:
          "Current guidance from standards bodies is to change a password when there is reason to think it was exposed, not on a fixed schedule. A long, unique password can stay as it is.",
      },
    ],
  },

  "random-number-generator": {
    tips: [
      "Turn off duplicates for raffles and draws, so no number can win twice.",
      "Number your entries before drawing, and publish the range you will use, so the draw is easy to check.",
      "Record the screen during a public draw if people will want to see that it was fair.",
      "For shuffling a list of names, Sort Lines can put the lines in a random order.",
    ],
    faq: [
      {
        question: "How do I pick a random winner from a list of names?",
        answer:
          "Number the names from 1 upwards, then draw one number in that range. The name with that number wins.",
      },
      {
        question: "Can I use it as a dice roller?",
        answer: "Yes. Set the range from 1 to 6, allow repeats, and generate as many rolls as you need.",
      },
      {
        question: "Can it pick lottery numbers?",
        answer:
          "It can draw, for example, six different numbers from 1 to 49. Every combination is equally likely, so no generator can improve your chances.",
      },
    ],
  },

  "invoice-generator": {
    tips: [
      "Give every invoice a unique number, and keep them in sequence.",
      "State the payment terms and the due date clearly; “due within 14 days” gets paid sooner than no date at all.",
      "Include your tax registration number if you are registered, and check the local rules on what an invoice must show.",
      "Download the PDF and keep your own copy of every invoice you send.",
    ],
    faq: [
      {
        question: "What should an invoice include?",
        answer:
          "Typically your name and address, the client's, a unique invoice number, the date, a description of each item with quantity and price, any tax, the total due, and how and when to pay. Requirements vary by country.",
      },
      {
        question: "How should I number my invoices?",
        answer:
          "Use a simple sequence that never repeats, such as 2026-001, 2026-002. Many tax authorities expect invoice numbers to be unique and consecutive.",
      },
      {
        question: "Can I add tax and a discount?",
        answer: "Yes. Set a tax rate and any discount, and the totals are recalculated exactly as you type.",
      },
    ],
  },

  "resume-generator": {
    tips: [
      "Tailor the summary and skills to each job you apply for.",
      "Describe results, not duties: numbers such as time saved, sales grown or people managed stand out.",
      "Keep conventional section headings like Experience, Education and Skills so tracking systems recognise them.",
      "Check the finished resume against the job advert with the Resume ATS Checker.",
    ],
    faq: [
      {
        question: "Which sections should a resume have?",
        answer:
          "Contact details, a short summary, work experience, education and skills cover most jobs. Add certifications, projects or languages when they are relevant to the role.",
      },
      {
        question: "Should I list references?",
        answer:
          "Usually not. Employers ask for references when they need them, and the space is better used for experience.",
      },
      {
        question: "How do I check the resume against a job advert?",
        answer:
          "Paste the advert and your resume into the Resume ATS Checker, which lists missing keywords and formatting problems.",
      },
    ],
  },

  "lorem-ipsum-generator": {
    tips: [
      "Generate roughly the amount of text the real content will have, so the layout is tested realistically.",
      "Use the plain English option when showing a draft to someone who may be distracted by Latin.",
      "Test edge cases too: a very long headline, a one-word paragraph, a long list.",
      "Search your pages for “lorem” before publishing to catch any placeholder left behind.",
    ],
    faq: [
      {
        question: "Can I generate a list instead of paragraphs?",
        answer: "Yes. Choose list items and set how many you want.",
      },
      {
        question: "Is it bad to leave lorem ipsum on a live website?",
        answer:
          "Yes. Placeholder text tells visitors and search engines that the page is unfinished. Replace it with real content before publishing.",
      },
      {
        question: "Can I download the text?",
        answer: "Yes. Copy it, or download it as a file.",
      },
    ],
  },

  "uuid-generator": {
    tips: [
      "Use version 7 for database primary keys; it keeps inserts in order and indexes compact.",
      "Use version 4 for anything that must not reveal when it was created, such as public tokens.",
      "Store UUIDs in a native UUID column where your database has one; it takes less space than text.",
      "Use lower case in the standard hyphenated form unless a system needs something else.",
    ],
    faq: [
      {
        question: "What is a GUID?",
        answer:
          "Microsoft's name for a UUID. They are the same 128-bit identifiers, sometimes written in braces or in upper case.",
      },
      {
        question: "What is the NIL UUID?",
        answer:
          "The UUID made entirely of zeros, 00000000-0000-0000-0000-000000000000. It is used as an explicit “no value”.",
      },
      {
        question: "Are version 4 UUIDs safe to use as secret tokens?",
        answer:
          "They are generated with cryptographic randomness and are practically impossible to guess. Do not use version 7 for this, because part of it is a timestamp.",
      },
    ],
  },

  "robots-txt-generator": {
    tips: [
      "Test your important pages with the URL tester before uploading the file.",
      "Do not block the CSS and JavaScript files your pages need; search engines use them to render the page.",
      "Add your sitemap address to the file so crawlers can find it.",
      "To keep a page out of search results, use a noindex tag and let it be crawled; blocking it in robots.txt stops crawlers seeing the noindex.",
    ],
    faq: [
      {
        question: "What does an empty Disallow line mean?",
        answer: "It allows everything. “Disallow:” with nothing after it blocks no paths for that crawler.",
      },
      {
        question: "Are robots.txt rules case-sensitive?",
        answer:
          "The paths are. Disallow: /Private does not block /private. The name of the file itself must be robots.txt in lower case.",
      },
      {
        question: "How do I block every crawler from my whole site?",
        answer:
          "Use User-agent: * followed by Disallow: /. Be careful: this also stops search engines crawling the site, so it suits staging and private sites only.",
      },
    ],
  },

  "schema-generator": {
    tips: [
      "Only mark up what visitors can see on the page — the same questions, answers, price and rating.",
      "Use ratings only from genuine customer reviews shown on the page.",
      "Test the finished code with Google's Rich Results Test before publishing.",
      "Update the markup when prices or availability change, so it never contradicts the page.",
    ],
    faq: [
      {
        question: "Does structured data improve rankings?",
        answer:
          "Not directly. It helps search engines understand the page and can make it eligible for rich results, such as product prices and ratings, which can make a listing more noticeable.",
      },
      {
        question: "What is a GTIN?",
        answer:
          "A Global Trade Item Number: the product number behind a retail barcode. It has 8, 12, 13 or 14 digits, and the last one is a check digit.",
      },
      {
        question: "What happens if my markup has an error?",
        answer:
          "The page still works for visitors, but search engines may ignore the markup, so the page is not eligible for rich results until the error is fixed.",
      },
    ],
  },

  "utm-builder": {
    tips: [
      "Agree on a naming scheme — lower case, hyphens, the same source names every time — and keep to it.",
      "Use utm_content to tell apart two links in the same campaign, such as a poster and a flyer.",
      "For printed material, download the QR code rather than expecting people to type a long tagged link.",
      "Never tag links between pages of your own site; it overwrites where visitors really came from.",
    ],
    faq: [
      {
        question: "What is the difference between source and medium?",
        answer:
          "Source is where the visitor came from, such as newsletter or facebook. Medium is the type of channel, such as email, social or cpc for paid ads.",
      },
      {
        question: "Do UTM tags hurt SEO?",
        answer:
          "They are meant for links you share elsewhere, not for links inside your own site. Pages should declare their plain address as the canonical URL, so tagged versions are treated as the same page.",
      },
      {
        question: "Can I turn a tagged link into a QR code?",
        answer: "Yes. Download a QR code for any link you build, ready for posters and flyers.",
      },
    ],
  },

  "qr-code-wifi-vcard": {
    tips: [
      "Enter the network name and password exactly as the router shows them, including capital letters.",
      "Put guests on a separate guest network, since anyone who scans the code can read the password.",
      "Laminate a printed card or place it behind glass so it stays clean enough to scan.",
      "Scan the printed card with your own phone before putting it on display.",
    ],
    faq: [
      {
        question: "Is a Wi-Fi QR code safe to display?",
        answer:
          "It is as safe as writing the password on the wall: anyone who scans it can read it. Display it only where you would share the password, ideally for a guest network.",
      },
      {
        question: "What does a contact (vCard) code do?",
        answer:
          "It holds your contact details in the standard vCard format. Scanning it offers to add you to the phone's contacts, with no typing.",
      },
      {
        question: "Does the event code work with calendar apps?",
        answer:
          "It holds a standard iCalendar event, with times converted to UTC so they appear correctly in any time zone. Most phones offer to add it to their calendar app.",
      },
    ],
  },
};
