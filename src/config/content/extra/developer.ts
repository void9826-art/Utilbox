import type { ToolContentExtra } from "@/types/tool";

export const developerExtra: Record<string, ToolContentExtra> = {
  "ssl-expiry-checker": {
    tips: [
      "Check both the bare domain and www, and any subdomains that serve traffic; they can use different certificates.",
      "Set a reminder well before the expiry date even if renewal is automated, so a silent failure is caught in time.",
      "Fix chain errors even when your own browser shows a padlock; phones, API clients and payment providers are stricter.",
      "Automate renewal; certificate lifetimes are getting shorter every year.",
    ],
    faq: [
      {
        question: "What is an intermediate certificate?",
        answer:
          "A certificate that links your site's certificate to a root authority that devices trust. Your server has to send it; when it is missing, some clients cannot build the chain and refuse the connection.",
      },
      {
        question: "Do the bare domain and www need checking separately?",
        answer:
          "Yes. They can be served by different certificates or even different servers, so one can expire while the other is fine.",
      },
      {
        question: "How long do certificates last now?",
        answer:
          "Under CA/Browser Forum rules, public certificates issued from March 2026 can last at most 200 days, falling in stages to 47 days by 2029.",
      },
    ],
  },

  "email-syntax-checker": {
    tips: [
      "Accept the suggested fix for obvious typos in common domains before you save a list.",
      "Treat a valid format as necessary, not sufficient; only a confirmation email proves an address works.",
      "Use the mail server check to catch domains that cannot receive email at all.",
      "Clean a list before importing it into a mailing tool, so bounces do not hurt your sending reputation.",
    ],
    faq: [
      {
        question: "What is an MX record?",
        answer:
          "A DNS record that says which servers receive email for a domain. A domain with none listed may still accept mail at its own address, and one with a “null MX” has declared that it accepts none.",
      },
      {
        question: "How long can an email address be?",
        answer: "Up to 254 characters in total, with no more than 64 before the @.",
      },
      {
        question: "Is the address I check sent anywhere?",
        answer:
          "The format check runs in your browser. The optional mail server lookup sends only the domain name to this site's server, never the full address.",
      },
    ],
  },

  "password-strength-checker": {
    tips: [
      "Test a password with the same structure as yours rather than the real one, if you prefer.",
      "Aim for a score of 4, and treat anything below 3 as weak.",
      "Read the patterns found; they explain exactly what to change.",
      "Remember a strong score does not mean a password is safe if you reuse it or it has leaked.",
    ],
    faq: [
      {
        question: "What do the scores from 0 to 4 mean?",
        answer:
          "They summarise how many guesses an attacker would need. 0 and 1 are trivially guessable, 2 is weak, 3 is reasonable, and 4 is strong.",
      },
      {
        question: "Why are there four different crack times?",
        answer:
          "Attacks differ in speed: an online attack limited to 100 guesses an hour, an online attack at 10 a second, an offline attack on a slow password hash at 10,000 a second, and an offline attack on a fast hash at 10 billion a second.",
      },
      {
        question: "What is zxcvbn?",
        answer:
          "An open-source password strength estimator originally developed at Dropbox. It looks for the patterns people really use instead of just counting character types.",
      },
    ],
  },

  "og-preview": {
    tips: [
      "Use an og:image of 1200 × 630 pixels for a sharp, full-width preview.",
      "Give image addresses in full, starting with https://, not as relative paths.",
      "Keep og:title short enough to show in full on small screens.",
      "After fixing tags, ask each platform to fetch the page again; previews are cached.",
    ],
    faq: [
      {
        question: "Which Open Graph tags are essential?",
        answer:
          "og:title, og:description, og:image and og:url. Add og:type, and twitter:card for X, for complete control of the preview.",
      },
      {
        question: "Why does my preview show the wrong title?",
        answer:
          "Without an og:title, platforms guess from the page title or headings. If the tag is there, the platform may be showing a cached copy.",
      },
      {
        question: "Is the page address I enter saved?",
        answer:
          "No. This site's server fetches the page head to read the tags and sends them back to your browser; nothing is stored.",
      },
    ],
  },

  "checksum-verifier": {
    tips: [
      "Compare SHA-256 or SHA-512 when the publisher offers them.",
      "Take the published checksum from the official site over HTTPS, not from the same mirror the file came from.",
      "On a mismatch, download the file again before assuming it was tampered with; interrupted downloads are the usual cause.",
      "Paste whole lines copied from a checksum file; the common formats are recognised.",
    ],
    faq: [
      {
        question: "How do I check a checksum without a website?",
        answer:
          "On Windows, run Get-FileHash file -Algorithm SHA256 in PowerShell. On macOS or Linux, run shasum -a 256 file or sha256sum file in a terminal.",
      },
      {
        question: "Can two different files have the same SHA-256?",
        answer:
          "In theory, yes; in practice nobody has ever found two. That is why a matching SHA-256 is treated as proof the file is identical.",
      },
      {
        question: "Is my file uploaded?",
        answer: "No. It is read in chunks and hashed in your browser.",
      },
    ],
  },

  "json-formatter": {
    tips: [
      "Sort keys before comparing two versions of a document; otherwise the diff is full of reordering.",
      "Minify JSON for production payloads and keep the formatted version for reading and editing.",
      "Drop a .json file in directly instead of copying a large file into the clipboard.",
      "Use the line and column in an error message to jump straight to the problem in your editor.",
    ],
    faq: [
      {
        question: "What is the difference between formatting and minifying?",
        answer:
          "Formatting adds line breaks and indentation for people to read. Minifying removes all unnecessary whitespace to make the data as small as possible. The data itself is identical.",
      },
      {
        question: "Why did my keys change order?",
        answer: "Only if you turned on key sorting. Otherwise keys are kept in the order they were written.",
      },
      {
        question: "Can I format a JSON file instead of pasted text?",
        answer: "Yes. Drop the .json file onto the input.",
      },
    ],
  },

  "json-validator": {
    tips: [
      "Look for trailing commas first; they are the most common error.",
      "Use double quotes for keys and strings; single quotes are not valid JSON.",
      "Remove comments, or use a format designed for them, before parsing as JSON.",
      "Read the structure summary for duplicate keys, which JSON allows but most parsers resolve silently.",
    ],
    faq: [
      {
        question: "Is JSON the same as a JavaScript object?",
        answer:
          "No. JSON is stricter: keys must be double-quoted, strings use double quotes, and trailing commas, comments, undefined and functions are not allowed.",
      },
      {
        question: "My configuration file has comments. Why does it fail?",
        answer:
          "Standard JSON has no comments. Some tools accept variants such as JSONC or JSON5 that do, but a strict parser rejects them.",
      },
      {
        question: "Is my JSON sent anywhere?",
        answer: "No. Validation runs in the page, and nothing is sent over the network.",
      },
    ],
  },

  "json-to-csv": {
    tips: [
      "Feed it an array of objects; each object becomes a row.",
      "Choose whether arrays become indexed columns or a single joined cell, depending on how you will use the data.",
      "Keep the formula protection on when the CSV is going into a spreadsheet.",
      "Open a sample in your spreadsheet before converting a large export, to check the delimiter suits your region.",
    ],
    faq: [
      {
        question: "What JSON shape does it accept?",
        answer: "An array of objects, or an object that contains one, such as an API response with a results array.",
      },
      {
        question: "Will Excel open the CSV correctly?",
        answer:
          "Yes, as long as the delimiter matches your system's settings. In many European regions spreadsheets expect a semicolon rather than a comma, so choose that delimiter if columns arrive merged.",
      },
      {
        question: "Is my data uploaded?",
        answer: "No. The conversion runs in your browser.",
      },
    ],
  },

  "base64-encoder": {
    tips: [
      "Never use Base64 to hide secrets; anyone can decode it instantly.",
      "Embed only small images as data URIs; large ones bloat HTML and CSS and cannot be cached separately.",
      "Choose URL-safe encoding for values that go into URLs, cookies or tokens.",
      "Expect the output to be about a third larger than the input.",
    ],
    faq: [
      {
        question: "How do I put an image directly into HTML or CSS?",
        answer:
          "Encode the image file with the data URI option. The result can go in an img src attribute or a CSS url() value.",
      },
      {
        question: "Why do accented characters fail in other encoders?",
        answer:
          "The browser's basic btoa() function only accepts single bytes. Text here is converted to UTF-8 first, so accented letters and emoji encode correctly.",
      },
      {
        question: "Is my file uploaded?",
        answer: "No. Text and files are encoded in your browser.",
      },
    ],
  },

  "base64-decoder": {
    tips: [
      "Paste a whole data URI if you have one; the prefix is handled for you.",
      "If decoding fails, check that the string was not cut short when it was copied.",
      "Use the download button for binary data; the file type is detected from its first bytes.",
      "Treat a decoded file like any other download and only open it if you trust where it came from.",
    ],
    faq: [
      {
        question: "Can I read the contents of a JWT?",
        answer:
          "Yes. A JWT is three Base64url parts separated by dots. Paste the middle part to read the payload. Decoding does not verify the signature, so it tells you what the token says, not whether it is genuine.",
      },
      {
        question: "Does URL-safe Base64 decode here?",
        answer: "Yes. URL-safe characters are converted back and missing padding is restored automatically.",
      },
      {
        question: "Is my data uploaded?",
        answer: "No. Decoding happens in your browser.",
      },
    ],
  },

  "url-encoder": {
    tips: [
      "Use component mode for a single query parameter value; full-URL mode would leave & and = unescaped.",
      "Encode values once. Encoding an already encoded string turns % into %25 and breaks it.",
      "Use component mode when passing a whole URL as a parameter, such as a redirect address.",
      "Use %20 for spaces when unsure; it is valid everywhere.",
    ],
    faq: [
      {
        question: "Which characters need encoding?",
        answer:
          "Spaces, non-ASCII characters such as é, and characters with a special meaning in URLs — like &, =, ?, # and / — when they appear inside a value rather than as part of the URL's structure.",
      },
      {
        question: "How do I put a URL inside another URL?",
        answer:
          "Encode the inner URL in component mode, then add it as the parameter value. Its slashes, colons and ampersands are all escaped so they are not read as part of the outer URL.",
      },
      {
        question: "Is anything sent to a server?",
        answer: "No. Encoding runs in the page.",
      },
    ],
  },

  "url-decoder": {
    tips: [
      "Look for %25 in the input; it means the string was encoded more than once. Use repeat decoding.",
      "Use the parameter table to read long tracking links one value at a time.",
      "Check where a link really points before clicking it — decoding reveals redirect targets hidden in parameters.",
      "Decoded text is shown as text only, so pasting a suspicious link here is safe.",
    ],
    faq: [
      {
        question: "What does %2F mean?",
        answer: "An encoded forward slash, /. Every percent sign is followed by two hexadecimal digits for one byte.",
      },
      {
        question: "How do I remove tracking parameters from a link?",
        answer:
          "Decode it, look at the parameter table, and rebuild the link without parameters such as utm_source or fbclid. Check that the link still works afterwards.",
      },
      {
        question: "Is the URL sent anywhere?",
        answer: "No. It is decoded in your browser.",
      },
    ],
  },

  "html-formatter": {
    tips: [
      "Format for reading and editing; minify only the copy you ship.",
      "Pick an indentation width that matches your project's other files.",
      "Content inside pre, textarea, script and style is left exactly as it is, by design.",
      "Keep the formatted source under version control rather than the minified output.",
    ],
    faq: [
      {
        question: "Does it fix broken HTML?",
        answer:
          "No. It re-indents the markup it is given; it does not add missing closing tags or check validity. Use a validator for that.",
      },
      {
        question: "Are comments kept?",
        answer: "When formatting, yes. Minifying removes them.",
      },
      {
        question: "Is my HTML uploaded?",
        answer: "No. It is processed as text in your browser.",
      },
    ],
  },

  "css-formatter": {
    tips: [
      "Put each selector on its own line for long selector lists; it makes diffs easier to read.",
      "Keep the formatted stylesheet as your source and minify only for production.",
      "Minifying here never rewrites values or merges rules, so it cannot change how the styles behave.",
      "Format a stylesheet copied from browser developer tools to make it readable again.",
    ],
    faq: [
      {
        question: "Can minifying change how my styles work?",
        answer:
          "It should not. Only comments and unnecessary whitespace are removed, and the last semicolon in each block is dropped; values and rules are left as they are.",
      },
      {
        question: "Can I choose the indentation?",
        answer: "Yes. Choose the indentation and whether selectors in a list go on separate lines.",
      },
      {
        question: "Is my stylesheet uploaded?",
        answer: "No. It is formatted in your browser.",
      },
    ],
  },

  "timestamp-converter": {
    tips: [
      "Count the digits: ten means seconds, thirteen means milliseconds.",
      "Store times in UTC and convert to local time only for display.",
      "Compare the UTC and local readings when a date looks one day out.",
      "Use ISO 8601 format, such as 2026-10-01T09:30:00Z, when writing dates in logs and APIs.",
    ],
    faq: [
      {
        question: "How do I get the current Unix timestamp in code?",
        answer:
          "In JavaScript, Math.floor(Date.now() / 1000). In Python, int(time.time()). On Linux or macOS, date +%s in a terminal.",
      },
      {
        question: "What is ISO 8601?",
        answer:
          "The international standard for writing dates and times, such as 2026-10-01T09:30:00Z, where Z means UTC. It sorts correctly as text and is unambiguous.",
      },
      {
        question: "Do Unix timestamps count leap seconds?",
        answer: "No. Unix time ignores leap seconds, so every day is treated as exactly 86,400 seconds.",
      },
    ],
  },
};
