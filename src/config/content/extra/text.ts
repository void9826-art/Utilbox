import type { ToolContentExtra } from "@/types/tool";

export const textExtra: Record<string, ToolContentExtra> = {
  "voice-to-text": {
    tips: [
      "Clear recordings transcribe best: one speaker at a time, close to the microphone, with little background noise.",
      "Choose the language when you know it; automatic detection can be thrown by a short clip.",
      "Use the more accurate model for names, numbers and specialist terms, and the faster one for quick notes.",
      "Read the transcript before relying on it, especially names and figures.",
    ],
    faq: [
      {
        question: "How long can a recording be?",
        answer: "Up to 10 minutes. Longer recordings can be split into shorter clips with an audio editor first.",
      },
      {
        question: "Which languages does it understand?",
        answer:
          "The Whisper model recognises many languages. Choose one from the list, or leave it on automatic to let the model decide.",
      },
      {
        question: "Can it create subtitles?",
        answer:
          "Yes. Turn on timestamps and subtitles before transcribing, and download them along with the text.",
      },
    ],
  },

  "resume-ats-checker": {
    tips: [
      "Paste the whole job advert, including the requirements and responsibilities, not just the title.",
      "Add missing keywords only where they are true, in the context of what you actually did.",
      "Keep the layout to a single column with standard headings such as Experience and Education.",
      "Run the check again after editing to confirm the problems are fixed.",
    ],
    faq: [
      {
        question: "What is an applicant tracking system?",
        answer:
          "Software employers use to collect applications. It turns each resume into plain text so recruiters can search and filter it, often by words from the job advert.",
      },
      {
        question: "Why does my PDF resume show almost no text?",
        answer:
          "The PDF is probably an image — a scan or a design exported as a picture. A tracking system cannot read it either. Export a text-based PDF from your word processor instead.",
      },
      {
        question: "Should I send the same resume to every job?",
        answer:
          "Keep one master version, then adjust the summary, skills and the order of your achievements for each advert.",
      },
    ],
  },

  "linkedin-formatter": {
    tips: [
      "Put the hook in the first two lines; the feed cuts the rest off behind “…see more”.",
      "Style a word or a short phrase, not whole sentences — styled letters are harder for screen readers and do not match searches.",
      "Keep paragraphs to one or two lines on mobile, separated by blank lines.",
      "Check the preview and the character count before copying the post.",
    ],
    faq: [
      {
        question: "Can I use hashtags and emoji?",
        answer:
          "Yes. They are ordinary characters and paste into LinkedIn as they are. Emoji count towards the character limit like any other character.",
      },
      {
        question: "Will the bold text show on phones?",
        answer:
          "Styled letters are standard Unicode characters, so they show on current phones and computers. Very old devices may lack the characters and show empty boxes.",
      },
      {
        question: "How do I turn styled text back to normal?",
        answer: "Select it and press Plain.",
      },
    ],
  },

  "word-counter": {
    tips: [
      "Set a target word count to see how much you have left as you edit.",
      "Open the keyword panel to spot words you are overusing.",
      "Use the speaking time to plan a speech or a presentation.",
      "Check whether your limit includes titles, footnotes and references before trimming.",
    ],
    faq: [
      {
        question: "How many words is a five-minute speech?",
        answer: "About 650 words at a comfortable 130 words a minute.",
      },
      {
        question: "How many pages is 1,000 words?",
        answer:
          "Roughly two pages single-spaced or four double-spaced, in a 12-point font with standard margins. Headings and paragraph breaks change it.",
      },
      {
        question: "Do hyphenated words count as one word?",
        answer: "Yes. Words are split on spaces, so “well-known” counts as one, as it does in word processors.",
      },
    ],
  },

  "character-counter": {
    tips: [
      "Check which count a platform uses; emoji and accented letters can count differently.",
      "Keep search result descriptions to around 150–160 characters.",
      "For text messages, watch the SMS line: one curly quote or emoji can cut the limit from 160 to 70.",
      "Remember spaces and line breaks count as characters on most platforms.",
    ],
    faq: [
      {
        question: "Do spaces count as characters?",
        answer:
          "On most platforms, yes. The counter shows the total with and without spaces so you can match whichever rule applies.",
      },
      {
        question: "How many characters fit in a post on X?",
        answer: "280 for a standard account.",
      },
      {
        question: "What is a grapheme?",
        answer:
          "What a reader sees as a single character. A family emoji is built from several code points but displays as one grapheme.",
      },
    ],
  },

  "case-converter": {
    tips: [
      "Use sentence case to fix text that arrived in all capitals.",
      "Check names and brands after converting to sentence or lower case; they need their capitals put back.",
      "Use kebab-case for web addresses and CSS class names, and snake_case for many database columns.",
      "Title case rules differ between style guides; follow the one your publication uses.",
    ],
    faq: [
      {
        question: "Which case should I use for headings?",
        answer:
          "Either sentence case or title case, depending on the style you follow. Sentence case is easier to read and is common on websites; title case is traditional in books and newspapers.",
      },
      {
        question: "What are kebab-case and snake_case used for?",
        answer:
          "kebab-case joins words with hyphens and suits web addresses and CSS. snake_case joins them with underscores and is common in Python and database column names.",
      },
      {
        question: "Does sentence case keep proper nouns capitalised?",
        answer:
          "No. It capitalises the start of each sentence and lower-cases the rest, so names need fixing by hand afterwards.",
      },
    ],
  },

  "remove-duplicate-lines": {
    tips: [
      "Turn on whitespace trimming for lists pasted from spreadsheets, where trailing spaces are common.",
      "Turn off case sensitivity for email addresses and names, so different capitalisation still counts as a duplicate.",
      "Invert the mode to see only the repeated lines when you are checking a list that should be unique.",
      "Sort the result afterwards with Sort Lines if you want it in alphabetical order.",
    ],
    faq: [
      {
        question: "How do I remove duplicate email addresses?",
        answer:
          "Paste one address per line, turn off case sensitivity and turn on whitespace trimming, so “Ann@Example.com ” and “ann@example.com” count as the same.",
      },
      {
        question: "Can I do this in a spreadsheet instead?",
        answer:
          "Spreadsheets have a remove-duplicates command for columns. This is quicker for a list you have just copied, and it shows how many lines it removed.",
      },
      {
        question: "Is my list uploaded?",
        answer: "No. The duplicates are removed by the page in your browser.",
      },
    ],
  },

  "sort-lines": {
    tips: [
      "Turn on natural sorting when lines contain numbers, so item2 comes before item10.",
      "Use numeric mode for lists of plain numbers.",
      "Remove duplicates first with Remove Duplicate Lines if the list may contain repeats.",
      "Use random order to shuffle names for a draw or a seating plan.",
    ],
    faq: [
      {
        question: "Can I sort in reverse order?",
        answer: "Yes. Choose the descending direction for Z to A, or highest number first.",
      },
      {
        question: "Can I shuffle a list randomly?",
        answer:
          "Yes. The random option gives every possible order an equal chance, using your browser's cryptographic random numbers.",
      },
      {
        question: "Can I sort by line length?",
        answer: "Yes. Choose length to order lines from shortest to longest, or the other way round.",
      },
    ],
  },

  "text-reverser": {
    tips: [
      "Reverse characters to check palindromes or make puzzles.",
      "Reverse the order of lines to flip a log or a list so the newest entries come first.",
      "Reverse words to read a sentence backwards while keeping each word readable.",
      "Run the result through again in the same mode to get the original back.",
    ],
    faq: [
      {
        question: "What is reversing text useful for?",
        answer:
          "Checking palindromes, writing puzzles and games, flipping the order of lists and logs, and the occasional bit of fun.",
      },
      {
        question: "Is reversed text the same as mirror writing?",
        answer:
          "No. Reversing changes the order of the characters; each letter still faces the normal way. Mirror writing flips the shapes of the letters.",
      },
      {
        question: "Is my text uploaded?",
        answer: "No. It is reversed by the page in your browser.",
      },
    ],
  },

  "text-cleaner": {
    tips: [
      "Turn on line joining for text copied out of a PDF, so each paragraph flows again.",
      "Straighten smart quotes before pasting text into code, a CSV file or a data import.",
      "Remove invisible characters when two pieces of text that look identical will not match.",
      "Switch on only the fixes you need and check the preview after each one.",
    ],
    faq: [
      {
        question: "How do I remove extra spaces?",
        answer: "Turn on the option that collapses spaces, and runs of spaces become single spaces.",
      },
      {
        question: "Can I turn HTML into plain text?",
        answer: "Yes. Strip HTML removes the tags and turns entities such as &amp; back into ordinary characters.",
      },
      {
        question: "Is my text uploaded?",
        answer: "No. Every fix runs in the page, and the text never leaves your browser.",
      },
    ],
  },
};
