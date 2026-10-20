import type { ToolContent } from "@/types/tool";

const PRIVACY_NOTE =
  "Your text is processed by JavaScript running in this page and is never sent over the network. That matters when you are pasting a draft, a client brief, meeting notes or anything else you would rather not hand to a server.";

export const textContent: Record<string, ToolContent> = {
  "voice-to-text": {
    seoTitle: "Voice Message to Text Converter — Free, Private",
    seoDescription:
      "Turn voice messages and short audio clips into text with Whisper speech recognition that runs in your browser. Works with voice notes, MP3, M4A and WAV.",
    intro:
      "Add a voice note or recording — MP3, M4A, WAV, OGG or WebM — choose the language or leave it on automatic, and press Transcribe. Whisper speech recognition runs on your device: only the model downloads, about 40 or 80 MB once, and the audio is never uploaded. Clips can be up to 10 minutes long.",
    howToUse: [
      "Add an audio file — a WhatsApp or Telegram voice note, a phone recording, or an MP3, M4A, WAV, OGG or WebM clip.",
      "Choose the language, or leave it on automatic, and pick the faster or more accurate model.",
      "Press Transcribe. The first time, the model downloads; after that it is cached.",
      "Copy the text or download it — with timestamps and subtitles if you turned them on.",
    ],
    howItWorks: [
      "Transcription uses Whisper, OpenAI's open-source speech recognition model, converted to run in the browser with Transformers.js and ONNX Runtime Web. Your browser first decodes the audio file and resamples it to 16 kHz mono, the format Whisper expects; the model then turns 30-second windows of sound into text, overlapping them slightly so words at the edges are not lost.",
      "The model files are the only thing downloaded — about 40 MB for the faster model and about 80 MB for the more accurate one — fetched once from Hugging Face and then cached by the browser. The audio itself stays on your device and is not sent to this site, OpenAI or anyone else, which matters for private voice messages.",
      "Recognition runs on your own processor in a background thread, so a one-minute clip can take a few seconds on a recent laptop and a minute or more on an older phone. Clips up to 10 minutes are accepted.",
      "Whisper is accurate on clear speech but can mishear names and specialist terms, struggles when people talk over each other, and occasionally invents words during long silences. Read the transcript before relying on it.",
    ],
    faq: [
      {
        question: "Can I record straight from my microphone?",
        answer:
          "Not at the moment. The tool transcribes audio files, which covers voice notes saved from messaging apps and recordings from your phone's voice memo app.",
      },
      {
        question: "Which audio formats work?",
        answer:
          "Anything your browser can decode: MP3, M4A and AAC, WAV, OGG and Opus voice notes, WebM and FLAC. If a file will not decode in one browser, try another, such as Chrome or Firefox, or convert it to MP3.",
      },
      {
        question: "How do I save a WhatsApp voice message as a file?",
        answer:
          "On a phone, press and hold the voice message, choose Share, and save it to your files. On WhatsApp for desktop or the web, open the message menu and choose Download.",
      },
      {
        question: "Is the audio really kept private?",
        answer:
          "Yes. Only the model is downloaded; the recording is decoded and transcribed on your device. You can confirm in your browser's developer tools that no request carries the audio.",
      },
    ],
  },

  "resume-ats-checker": {
    seoTitle: "Resume ATS Checker Free — Keyword Match and Format",
    seoDescription:
      "Check your resume against a job description: see which keywords are missing, whether an applicant tracking system can read the file, and what to fix.",
    intro:
      "Upload your resume as a PDF, DOCX or TXT file, or paste its text, add the job description and press Check resume. You see which keywords from the ad are missing and which formatting problems — two columns, missing dates, icon fonts — trip up applicant tracking systems. Treat the score as a checklist. Nothing is uploaded.",
    howToUse: [
      "Upload your resume as a PDF, DOCX or TXT file, or paste its text.",
      "Paste the job description you are applying for.",
      "Press Check resume.",
      "Work through the missing keywords and failed checks, update your resume, and check again.",
    ],
    howItWorks: [
      "An applicant tracking system (ATS) converts your resume to plain text so recruiters can filter and search it, often using words from the job ad. This tool starts with the same step: it reads the text out of your PDF or Word file. If little or no text comes out, the file is probably a scan or an image — and a tracking system will not be able to read it either.",
      "It then picks out the terms that matter in the job description — skills, tools and repeated phrases, ignoring filler words — and looks for each one in your resume, allowing for simple variations such as plurals and verb endings. Terms the ad repeats count for more.",
      "The format checks look for what commonly breaks parsing or screening: missing contact details, non-standard section headings, two-column PDF layouts that can scramble the reading order, a resume that is very short or very long, missing dates, few measurable results, and characters from icon fonts that cannot be read as text.",
      "There is no universal ATS score — every system works differently, and many recruiters read resumes themselves. Treat the score as a checklist for tailoring your resume to a role, never as a prediction of whether you will be shortlisted.",
    ],
    faq: [
      {
        question: "What is a good ATS score?",
        answer:
          "No official score exists. Here, a keyword match above about 70% with no failed format checks means your resume clearly reflects the job ad. Never add keywords you cannot back up — a person reads it next.",
      },
      {
        question: "Is PDF or Word better for applicant tracking systems?",
        answer:
          "Both work when the file contains real text in a simple, single-column layout. Use the format the application asks for; if it does not say, a text-based PDF keeps your layout intact.",
      },
      {
        question: "Should I copy the job description into my resume?",
        answer:
          "No. Use the employer's wording for skills you genuinely have, in the context of what you did with them. Keyword stuffing is easy for recruiters to spot.",
      },
      {
        question: "Is my resume uploaded?",
        answer: "No. The file is read and checked in your browser, and nothing is sent to a server.",
      },
    ],
  },

  "linkedin-formatter": {
    seoTitle: "LinkedIn Post Formatter — Bold, Italic, Line Breaks",
    seoDescription:
      "Format LinkedIn posts with bold and italic text, bullet points and clean line breaks. Preview where “see more” falls and copy the post — nothing is uploaded.",
    intro:
      "Write or paste your post, select words and press Bold or Italic, turn lines into bullets, and copy the result into LinkedIn, which has no formatting buttons. Styling uses Unicode letters, so keep it to a few words, because screen readers can struggle with them. The preview marks roughly where “…see more” cuts in. Nothing is uploaded.",
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
      "Paste or type your text to count words, characters, sentences and paragraphs as you go, with reading time at 238 words per minute and the words you use most. Set a target word count and a progress bar tracks it. Counts match Microsoft Word for ordinary prose, and your text is never uploaded.",
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
      "Paste your text to count characters with and without spaces, plus bytes, and see whether it fits limits such as SMS, Twitter and meta descriptions. Emoji can count as several characters, so a grapheme count shows what a reader actually sees. One emoji or curly quote drops an SMS limit from 160 to 70. Nothing is uploaded.",
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
        question: "How many characters are in a text message (SMS)?",
        answer:
          "160 if every character is in the GSM 7-bit alphabet. One character outside it — an emoji or a curly quote — drops the limit to 70 for the whole message. Longer texts are split into parts of 153 characters (or 67), because each part spends a few characters on joining information.",
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
      "Paste your text and click a case to convert it: uppercase, lowercase, title case, sentence case, or code styles such as camelCase, PascalCase, snake_case and kebab-case. Title case leaves minor words like 'and' and 'of' lowercase, as publishers do. Your original is kept, so you can try each case in turn. Nothing is uploaded.",
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
      "Paste a list with one item per line to remove repeated lines and see how many were taken out. The first occurrence of each line stays in place, so the order is kept. Choose whether case and trailing spaces matter, or invert it to list only the duplicates. Large lists stay fast, and nothing is uploaded.",
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
      "Paste your lines and sort them alphabetically, numerically, by length or at random, in either direction. Natural sorting puts item2 before item10, and accented letters sort where the language expects. Random order uses a cryptographic Fisher-Yates shuffle, so every order is equally likely. Your text is never uploaded.",
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
      "Paste text and choose what to reverse: the characters, the word order or the order of the lines. Characters are reversed as whole graphemes, so emoji, flags and accented letters survive intact rather than breaking apart. Running the output through the same mode again returns the original exactly. Your text is never uploaded.",
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
      "Paste text from a PDF, email or web page and switch on the fixes you need: collapse extra spaces, join broken PDF line breaks while keeping real paragraphs, straighten smart quotes, strip invisible characters or remove HTML tags. The preview updates as you toggle each one. Your text is never uploaded.",
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

  "text-compare": {
    seoTitle: "Text Compare — Find Differences Between Two Texts",
    seoDescription:
      "Compare two versions of a text and see exactly which lines were added or removed. Ignore spacing or capitals if you like. Free, and nothing is uploaded.",
    intro:
      "Paste the original and the changed version to see exactly which lines were added or removed, marked with a plus or a minus. You can ignore spacing and blank lines, or capital letters, and copy the differences as a report. The comparison runs in your browser, so your text is never uploaded.",
    howToUse: [
      "Paste the earlier version into Original text.",
      "Paste the newer version into Changed text.",
      "Choose whether spacing and capital letters should count as differences.",
      "Read the added and removed lines, or copy the report.",
    ],
    howItWorks: [
      "The two texts are split into lines and lined up with a longest-common-subsequence comparison — the method version-control tools use. It finds the smallest set of additions and removals that turns one version into the other, so a paragraph inserted near the top does not make every later line look changed.",
      "Ignoring spacing trims each line and drops blank lines before comparing, which stops a re-indented copy from looking entirely different. Ignoring capitals compares lower-cased copies while still showing the original wording.",
      "The comparison is by line. A line with one edited word appears as one line removed and one line added, which keeps a long report easy to scan. Texts of more than 4,000 lines are compared more coarsely, from the point where they start to differ, so the page stays responsive.",
      PRIVACY_NOTE,
    ],
    faq: [
      {
        question: "Does it show which words changed inside a line?",
        answer:
          "No. It compares whole lines, so a line with an edited word shows as the old line removed and the new line added, next to each other in the list.",
      },
      {
        question: "Can I compare Word documents or PDFs?",
        answer:
          "Paste their text here. For two PDF files, Compare Two PDFs reads each page and compares the text for you.",
      },
      {
        question: "Why does everything look changed?",
        answer:
          "Usually because the lines were re-wrapped or re-indented. Keep the spacing option switched on; if the line breaks themselves moved, the texts genuinely differ line by line.",
      },
      {
        question: "Is my text uploaded?",
        answer: "No. Both texts stay in your browser tab and the comparison runs there.",
      },
    ],
  },

  "find-and-replace": {
    seoTitle: "Find and Replace Text Online — Regex Supported",
    seoDescription:
      "Find and replace words or patterns in any text, with match case, whole words and regular expressions. Shows how many replacements were made. Private.",
    intro:
      "Paste your text, type what to find and what to replace it with, and the result updates with a count of the replacements made. Tick match case or whole words only so “cat” leaves “concat” alone, or switch on regular expressions for patterns and $1 groups. Leave the replacement empty to delete matches. Nothing is uploaded.",
    howToUse: [
      "Paste or load the text.",
      "Type the word or phrase to find, and what to replace it with.",
      "Tick Match case, Whole words only or Use regular expressions as needed.",
      "Check the replacement count, then copy or download the result.",
    ],
    howItWorks: [
      "In plain mode the search text is matched literally — dots, brackets and dollar signs mean themselves — and the replacement is inserted exactly as typed. Every occurrence is replaced in one pass, so replacing “a” with “aa” cannot loop.",
      "Whole words only means the match may not have a letter, digit or underscore directly before or after it, in any alphabet, so “cat” matches in “the cat sat” but not in “concat” or “cats”.",
      "With regular expressions on, the find box takes JavaScript regex syntax and the replacement understands $1, $2 and $<name> for groups and $& for the whole match. ^ and $ match at the start and end of each line unless you untick that option.",
      "Searching runs in a background worker and is stopped after 1.5 seconds, so a regular expression that backtracks badly cannot freeze the page.",
      PRIVACY_NOTE,
    ],
    example: {
      scenario: "Replace “colour” with “color”, whole words only, case-insensitive",
      steps: [
        "Text: Colour charts and watercolour paints",
        "“Colour” matches; “watercolour” does not, because a letter comes before it",
        "Result: color charts and watercolour paints",
      ],
      result: "1 replacement. With Whole words off, both would change.",
    },
    faq: [
      {
        question: "How do I delete every occurrence of a word?",
        answer:
          "Type the word in Find and leave Replace with empty. Every match is removed.",
      },
      {
        question: "Why was my replacement inserted in lower case?",
        answer:
          "The replacement is inserted exactly as you typed it, whatever the case of the text it replaces. Use Match case and run separate replacements if you need to keep capitals.",
      },
      {
        question: "How do I replace line breaks?",
        answer:
          "Turn on regular expressions and find \\n, for example replacing \\n+ with a space to join lines.",
      },
      {
        question: "Is there a size limit?",
        answer:
          "No fixed limit; it is limited only by your browser's memory. Very large texts with complex regular expressions may hit the 1.5-second safety stop.",
      },
    ],
  },

  "slug-generator": {
    seoTitle: "Slug Generator — Turn Titles Into Clean URL Slugs",
    seoDescription:
      "Convert titles into SEO-friendly URL slugs: lower case, hyphens, accents removed and an optional length limit. Several titles at once. Runs in your browser.",
    intro:
      "Type a title to get a clean URL slug such as creme-brulee-10-easy-recipes: lower case, words joined by hyphens, accents removed and punctuation dropped. Choose underscores instead, set a maximum length cut at a whole word, or remove short words like “the” and “of”. Paste several titles to make one slug per line.",
    howToUse: [
      "Type or paste a title, or several titles one per line.",
      "Choose hyphens or underscores, and whether to keep lower case.",
      "Optionally set a maximum length and remove short common words.",
      "Copy a slug, or copy them all.",
    ],
    howItWorks: [
      "Accented letters are reduced to their base letter using Unicode normalisation, so é becomes e and ü becomes u. Letters that do not decompose are spelled out: ß becomes ss, æ becomes ae, ø becomes o and ł becomes l. & becomes and, and @ becomes at.",
      "Apostrophes are removed so “don't” becomes dont rather than don-t. Every other run of spaces and punctuation becomes a single separator, and separators are never left at the start or end.",
      "A maximum length cuts the slug at the last whole word that fits, so it never ends in half a word. Removing short words drops common words such as a, the, of and for — but never all of them, so a title made only of short words still produces a slug.",
      "Hyphens are the usual choice for web addresses: Google's own guidance recommends hyphens rather than underscores to separate words in URLs. Underscores suit file names and some systems' identifiers.",
      "Scripts without a Latin form, such as Chinese or Arabic, are not transliterated and are removed, so check slugs made from such titles.",
      PRIVACY_NOTE,
    ],
    example: {
      scenario: "Crème Brûlée: 10 Easy Recipes for Beginners (2026)",
      steps: [
        "Accents removed: Creme Brulee",
        "Punctuation and brackets become separators",
        "Lower-cased and joined with hyphens",
      ],
      result: "creme-brulee-10-easy-recipes-for-beginners-2026",
    },
    faq: [
      {
        question: "Should a slug use hyphens or underscores?",
        answer:
          "Hyphens for web pages. Search engines treat hyphens as word separators, and Google recommends them over underscores in URLs.",
      },
      {
        question: "How long should a URL slug be?",
        answer:
          "There is no fixed rule. Short slugs of three to six meaningful words are easier to read and share; set a maximum length to keep them tidy.",
      },
      {
        question: "Should I change the slug of a published page?",
        answer:
          "Only if you must. Changing it breaks existing links unless you add a permanent (301) redirect from the old address.",
      },
      {
        question: "Does it handle accents and other languages?",
        answer:
          "Accented Latin letters are converted to plain ones (é to e, ß to ss). Scripts without a Latin equivalent are removed, so write those slugs by hand or use a transliteration.",
      },
    ],
  },
};
