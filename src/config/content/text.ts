import type { ToolContent } from "@/types/tool";

const PRIVACY_NOTE =
  "Your text is processed by JavaScript running in this page and is never sent over the network. That matters when you are pasting a draft, a client brief, meeting notes or anything else you would rather not hand to a server.";

export const textContent: Record<string, ToolContent> = {
  "linkedin-formatter": {
    seoTitle: "LinkedIn Post Formatter — Bold, Italic, Line Breaks",
    seoDescription:
      "Format LinkedIn posts with bold and italic text, bullet points and clean line breaks. Preview where “see more” falls and copy the post — nothing is uploaded.",
    intro:
      "Write a LinkedIn post with bold and italic words, bullets and spacing that survives posting, and see roughly where the feed cuts it off with “…see more”.",
    howToUse: [
      "Write or paste your post.",
      "Select a word or phrase and press Bold, Italic or another style.",
      "Select some lines and press a bullet style to turn them into a list.",
      "Check the preview and the character count, then press Copy post and paste it into LinkedIn.",
    ],
    howItWorks: [
      "LinkedIn posts are plain text: there is no bold or italic button. What looks like bold in other people's posts is made of different characters — Unicode's mathematical letters include complete bold, italic and monospace alphabets. This tool swaps each letter and digit you select for its styled twin, so the styling travels with the text when you paste it.",
      "Those characters have costs. Screen readers may spell styled words out letter by letter or skip them, they do not match searches for the ordinary word, and each one is stored as two text units rather than one. Use them for a word or a short phrase, not whole paragraphs. Select styled text and press Plain to turn it back.",
      "Line breaks are ordinary newlines and paste into LinkedIn unchanged. If runs of empty lines are collapsed after you post, turn on Protect blank lines, which puts an invisible character on each blank line so it is no longer empty.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "How do I make text bold on LinkedIn?",
        answer:
          "LinkedIn has no formatting controls, so select the words here, press Bold, and paste the result into your post. The bold is built from special Unicode letters, so it shows up wherever the post is displayed.",
      },
      {
        question: "What is the character limit for a LinkedIn post?",
        answer:
          "Posts can be up to 3,000 characters. Styled letters are stored as two text units each, so if a heavily styled post is rejected as too long, trim it until the larger of the two counts shown here is under 3,000.",
      },
      {
        question: "Where does LinkedIn cut a post off with “see more”?",
        answer:
          "In the feed a post is shortened after its first few lines — roughly the first 200 characters, and sooner if you use short lines. The exact point differs between the app and the website, so the preview marks an approximate cut. Put your hook in the first two lines.",
      },
      {
        question: "Is styled text bad for accessibility?",
        answer:
          "It can be. Screen readers handle mathematical letters inconsistently, and some read each letter separately. Keep styling to a few words and never write a whole post in it.",
      },
    ],
  },

  "word-counter": {
    seoTitle: "Word Counter — Live Word and Character Count",
    seoDescription:
      "Count words, characters, sentences and paragraphs as you type, with reading time and keyword density. Nothing is uploaded.",
    intro:
      "Count words, characters, sentences and paragraphs as you type, with reading time and the most frequent words.",
    howToUse: [
      "Type or paste your text into the box.",
      "The counts update on every keystroke.",
      "Open the keyword panel to see which words you lean on most.",
      "Set a target word count and the progress bar tracks it.",
    ],
    howItWorks: [
      "Words are counted by splitting on whitespace after trimming, which matches how word processors count and handles hyphenated and apostrophed words as single words. Sentences are found by looking for terminal punctuation followed by a space or end of text, and paragraphs by blank lines.",
      "Sentence detection is approximate by nature — abbreviations like 'Dr.' and 'e.g.' end in full stops without ending a sentence, and no simple rule catches every case. The count is reliable enough for pacing and readability checks, not for anything requiring exactness.",
      "Reading time uses 238 words per minute, the average from research into adult silent reading of non-technical prose. Speaking time uses 130 words per minute, a comfortable presentation pace.",
      PRIVACY_NOTE,
    ],
    example: {
      scenario: "Checking an essay against a 1,500-word limit",
      steps: [
        "Paste the essay into the box.",
        "Set the target to 1,500 words.",
        "Watch the progress indicator as you edit.",
      ],
      result: "A live count with the words remaining, plus an estimated reading time.",
    },
    faq: [
      {
        question: "Does this count the same as Microsoft Word?",
        answer:
          "For ordinary prose, yes. Both split on whitespace. Small differences can appear around unusual punctuation, footnote markers and text in tables.",
      },
      {
        question: "How is reading time calculated?",
        answer:
          "At 238 words per minute, the researched average for adult silent reading. Technical material reads slower, so treat it as a guide.",
      },
      {
        question: "Is my text uploaded anywhere?",
        answer:
          "No. Everything is counted by JavaScript in this page. You can disconnect from the network and it still works.",
      },
      {
        question: "What counts as a sentence?",
        answer:
          "A run of text ending in a full stop, question mark or exclamation mark. Abbreviations can cause a slight over-count, which is unavoidable without full language analysis.",
      },
    ],
  },

  "character-counter": {
    seoTitle: "Character Counter — With Twitter, SMS and Meta Limits",
    seoDescription:
      "Count characters with and without spaces, and check your text against Twitter, SMS, meta description and other common limits.",
    intro:
      "Count characters with and without spaces, and see at a glance whether your text fits common platform limits.",
    howToUse: [
      "Paste or type your text.",
      "Read the counts — with spaces, without spaces, and bytes.",
      "Check the limit indicators for the platforms you care about.",
      "Trim until the bars turn green.",
    ],
    howItWorks: [
      "Two different counts appear because platforms disagree about what a character is. JavaScript counts UTF-16 code units, which means most emoji count as two and some — flags, family groupings, skin-tone variants — count as more. The grapheme count instead counts what a reader sees as one character. A single 👨‍👩‍👧‍👦 is 11 code units but one grapheme.",
      "The byte count is different again, and it is the one that matters for SMS and for database columns. UTF-8 uses one byte for ASCII, two or three for accented and non-Latin scripts, and four for most emoji.",
      "SMS has its own rule worth knowing: a message using only the GSM 7-bit alphabet fits 160 characters, but a single character outside it — a curly quote, an em dash, an emoji — switches the whole message to UCS-2 and drops the limit to 70. The tool flags this, because it is a common and expensive surprise.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Why does my emoji count as two characters?",
        answer:
          "Most platforms count UTF-16 code units, and emoji outside the basic range take two. Composite emoji like family groupings take many more. The grapheme count shows what a reader actually sees.",
      },
      {
        question: "How many characters fit in an SMS?",
        answer:
          "160 if every character is in the GSM 7-bit alphabet. One character outside it drops the limit to 70 for the whole message.",
      },
      {
        question: "What is the ideal meta description length?",
        answer:
          "Around 150–160 characters. Google truncates by pixel width rather than character count, so shorter is safer for descriptions with wide characters.",
      },
    ],
  },

  "case-converter": {
    seoTitle: "Case Converter — Upper, Lower, Title & camelCase",
    seoDescription:
      "Convert text between uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case and kebab-case instantly.",
    intro:
      "Convert text between twelve letter cases — from plain uppercase to camelCase and kebab-case for code.",
    howToUse: [
      "Paste your text.",
      "Click the case you want; the result appears immediately.",
      "Keep clicking to try others — the original is preserved so nothing is lost.",
      "Copy the result or download it.",
    ],
    howItWorks: [
      "The prose cases are straightforward, except title case. Proper title case does not capitalise every word: short articles, conjunctions and prepositions stay lowercase unless they are the first or last word. The tool follows that convention using a standard list of minor words, so you get 'The Rise and Fall of the House' rather than 'The Rise And Fall Of The House'.",
      "The programming cases first split the input into words, handling spaces, hyphens, underscores and existing camelCase boundaries, then rejoin them in the target style. That means camelCase input converts cleanly to snake_case and back without losing word boundaries.",
      "Sentence case capitalises after each sentence-ending punctuation mark and lowercases the rest, which is the fastest way to fix text that arrived in all capitals.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "What is the difference between title case and capitalised case?",
        answer:
          "Title case follows publishing convention and leaves minor words like 'and', 'of' and 'the' lowercase unless they start or end the title. Capitalised case capitalises every word.",
      },
      {
        question: "What is the difference between camelCase and PascalCase?",
        answer:
          "PascalCase capitalises the first letter (MyVariableName); camelCase does not (myVariableName). Both remove the spaces.",
      },
      {
        question: "Can I convert code identifiers between styles?",
        answer:
          "Yes. Word boundaries are detected from existing capitals, underscores and hyphens, so snake_case converts cleanly to camelCase and back.",
      },
    ],
  },

  "remove-duplicate-lines": {
    seoTitle: "Remove Duplicate Lines — Deduplicate Any List Free",
    seoDescription:
      "Strip repeated lines from a list, with options for case sensitivity, whitespace trimming and keeping only the duplicates instead.",
    intro:
      "Remove repeated lines from a list and see exactly how many were taken out.",
    howToUse: [
      "Paste your list, one item per line.",
      "Decide whether case and surrounding whitespace should matter.",
      'Choose to keep unique lines, or invert it to keep only the duplicates.',
      "Copy the cleaned list.",
    ],
    howItWorks: [
      "Lines are compared using a hash set, which keeps the work proportional to the number of lines rather than to their square — so a hundred thousand lines deduplicate as fast as a hundred.",
      "The comparison options matter more than they look. With case sensitivity off, 'Apple' and 'apple' are treated as the same line and the first occurrence is kept. With whitespace trimming on, lines that differ only by trailing spaces — extremely common in data pasted from spreadsheets — collapse together.",
      "Order is always preserved: the first occurrence of each line stays where it was. Inverting the mode shows only the lines that appeared more than once, which is a fast way to find accidental repeats in a list you expected to be unique.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Does it keep the original order?",
        answer: "Yes. The first occurrence of each line stays in place; later copies are removed.",
      },
      {
        question: "Can I find the duplicates instead of removing them?",
        answer:
          "Yes. Invert the mode and you get only the lines that appeared more than once, with their counts.",
      },
      {
        question: "How many lines can it handle?",
        answer:
          "Hundreds of thousands without trouble. The work scales linearly, so large lists stay fast.",
      },
    ],
  },

  "sort-lines": {
    seoTitle: "Sort Lines — Alphabetical, Numeric, Natural Order",
    seoDescription:
      "Sort lines alphabetically, numerically, by length or randomly, with natural sorting that puts item2 before item10.",
    intro:
      "Sort lines alphabetically, numerically, by length, or shuffle them at random.",
    howToUse: [
      "Paste your lines.",
      "Choose a sort method and direction.",
      "Turn on natural sorting if your lines contain numbers.",
      "Copy the sorted result.",
    ],
    howItWorks: [
      "Alphabetical sorting uses your browser's locale-aware comparison, which orders accented characters the way the language expects — so 'é' sorts next to 'e' rather than after 'z', which is what a plain byte comparison would do.",
      "Natural sorting is the option most people actually want when their lines contain numbers. A plain alphabetical sort puts item10 before item2, because it compares character by character and '1' comes before '2'. Natural sorting reads runs of digits as numbers, giving item2, item10, item100 — the order a human would use.",
      "The random option uses a Fisher-Yates shuffle driven by cryptographic randomness, which produces a genuinely uniform permutation. Sorting by a random key, the common shortcut, does not.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Why does item10 come before item2?",
        answer:
          "Because plain alphabetical sorting compares character by character, and '1' precedes '2'. Turn on natural sorting to read the digits as numbers.",
      },
      {
        question: "How are accented characters handled?",
        answer:
          "Using locale-aware comparison, so 'é' sorts alongside 'e' rather than after 'z'.",
      },
      {
        question: "Can I sort numbers properly?",
        answer:
          "Yes. Numeric mode parses each line as a number and sorts by value, so 9 comes before 10.",
      },
    ],
  },

  "text-reverser": {
    seoTitle: "Text Reverser — Reverse Characters, Words or Lines",
    seoDescription:
      "Reverse text by character, word or line. Handles emoji and accented characters correctly by reversing graphemes, not code units.",
    intro:
      "Reverse text at three levels — the characters, the word order, or the order of the lines.",
    howToUse: [
      "Paste your text.",
      "Choose what to reverse: characters, words, or lines.",
      "The result appears immediately.",
      "Copy it, or feed it back in to reverse again.",
    ],
    howItWorks: [
      "Reversing characters is less trivial than it looks. Splitting a string on its code units and reversing breaks anything outside the basic range: emoji come out as broken fragments, and combining accents attach to the wrong letter. This tool segments the text into graphemes — what a reader perceives as one character — before reversing, so 'café 👍' reverses correctly rather than turning into mojibake.",
      "Word reversal splits on whitespace and reverses the order while leaving each word intact. Line reversal flips the order of the lines. Both preserve the content of what they move.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Does it handle emoji correctly?",
        answer:
          "Yes. Text is segmented into graphemes before reversing, so emoji, flags and accented characters survive intact.",
      },
      {
        question: "Can I reverse the words but not the letters?",
        answer:
          'Yes. Choose "Reverse word order" and each word stays readable while their sequence flips.',
      },
      {
        question: "Is reversing reversible?",
        answer:
          "Yes. Running the output back through the same mode returns the original text exactly.",
      },
    ],
  },

  "text-cleaner": {
    seoTitle: "Text Cleaner — Remove Extra Spaces and Fix Formatting",
    seoDescription:
      "Clean up messy text: collapse spaces, fix line breaks, straighten smart quotes, strip invisible characters and remove HTML tags.",
    intro:
      "Tidy up text pasted from a PDF, an email or a web page — extra spaces, broken line breaks, smart quotes and invisible characters.",
    howToUse: [
      "Paste your messy text.",
      "Switch on the fixes you need; each one is independent.",
      "Watch the preview update as you toggle them.",
      "Copy the cleaned result.",
    ],
    howItWorks: [
      "Text copied from a PDF or an email arrives with problems that are invisible until they cause trouble. Non-breaking spaces look identical to ordinary spaces but break search and word wrap. Zero-width characters have no appearance at all yet corrupt string comparisons. Smart quotes and em dashes break code and some data imports.",
      "Line breaks are the most common problem with PDF text. A PDF breaks lines to fit the page, not to end paragraphs, so pasted text arrives with a break after every visual line. The line-joining option merges those back into flowing paragraphs while keeping genuine paragraph breaks — it treats a blank line as a real break and a single break as an artefact.",
      "HTML stripping removes tags and decodes entities, turning copied web markup back into plain text. It operates on the text as data and never renders it, so pasting hostile markup here cannot do anything.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Why does my PDF text have a line break after every line?",
        answer:
          'PDFs break lines to fit the page rather than to mark paragraphs. Turn on "Join broken lines" and genuine paragraph breaks are kept while the rest are merged.',
      },
      {
        question: "What are invisible characters and why remove them?",
        answer:
          "Zero-width spaces, joiners and byte-order marks carry no appearance but break searching, sorting and comparison. They arrive from web pages and word processors without warning.",
      },
      {
        question: "What are smart quotes?",
        answer:
          "Curly typographic quotes and apostrophes that word processors substitute automatically. They look better in prose but break code, CSV files and some data imports.",
      },
      {
        question: "Is it safe to paste HTML here?",
        answer:
          "Yes. The text is only ever treated as data — it is never inserted into the page as markup, so nothing in it can execute.",
      },
    ],
  },
};
