/**
 * Resume checks against a job description.
 *
 * No real applicant tracking system publishes a score, so this does two
 * honest things instead: it measures how many of the job ad's significant
 * terms appear in the resume, and it runs format checks for the problems that
 * most often stop a resume being parsed or found.
 *
 * No DOM imports: scripts/test-lib.mjs runs this under Node.
 */

const STOPWORDS = new Set(
  (
    "a about above across after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its itself just me more most my no nor not now of off on once only or other our ours out over own same she should so some such than that the their them then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours etc eg ie per via within without " +
    "ability able apply applicant applicants candidate candidates role position job company team teams work working experience experienced years year strong excellent good great including include includes required requirements require preferred plus must responsibilities responsible opportunity opportunities join looking seeking ideal knowledge skills skill understanding demonstrated proven new using use day days environment equal employer benefits salary based well help support ensure across other others make across related relevant key"
  ).split(/\s+/),
);

/** U+FFFD and the Private Use Area, where icon fonts put their glyphs: built at runtime to keep the source ASCII. */
const REPLACEMENT_CHARACTER = String.fromCharCode(0xfffd);
const isPrivateUse = (character: string) => {
  const code = character.charCodeAt(0);
  return code >= 0xe000 && code <= 0xf8ff;
};

const ACTION_VERBS = new Set(
  "achieved analysed analyzed automated built coached created cut delivered designed developed drove established expanded generated grew implemented improved increased introduced launched led managed mentored negotiated optimised optimized organised organized owned planned produced reduced redesigned resolved saved scaled shipped simplified streamlined supervised trained transformed won wrote".split(
    " ",
  ),
);

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9][a-z0-9+#.\-/]*[a-z0-9+#]|[a-z0-9]/g) ?? []).map((token) =>
    token.replace(/[.\-/]+$/, ""),
  );
}

/** A deliberately light stemmer: enough to match "manage", "managed" and "managing". */
export function stem(word: string): string {
  if (word.length <= 4 || /[^a-z]/.test(word)) return word;
  return word.replace(/ies$/, "y").replace(/(ing|ed|es|s)$/, "");
}

const isNoise = (token: string) => token.length < 2 || STOPWORDS.has(token) || /^\d+$/.test(token);

export interface Keyword {
  term: string;
  count: number;
}

export function extractKeywords(job: string, limit = 30): Keyword[] {
  const tokens = tokenize(job);
  const singles = new Map<string, Keyword>();
  const pairs = new Map<string, Keyword>();

  tokens.forEach((token, index) => {
    if (isNoise(token)) return;
    const key = stem(token);
    const single = singles.get(key) ?? { term: token, count: 0 };
    single.count += 1;
    singles.set(key, single);

    const next = tokens[index + 1];
    if (next && !isNoise(next)) {
      const pairKey = `${key} ${stem(next)}`;
      const pair = pairs.get(pairKey) ?? { term: `${token} ${next}`, count: 0 };
      pair.count += 1;
      pairs.set(pairKey, pair);
    }
  });

  const byCount = (a: Keyword, b: Keyword) => b.count - a.count || a.term.localeCompare(b.term);
  const phrases = [...pairs.values()].filter((entry) => entry.count >= 2).sort(byCount);
  const words = [...singles.values()].filter((entry) => entry.term.length >= 3 || /[+#]/.test(entry.term)).sort(byCount);
  return [...phrases, ...words].slice(0, limit);
}

export interface KeywordMatch extends Keyword {
  found: boolean;
}

export function matchKeywords(resume: string, keywords: Keyword[]): KeywordMatch[] {
  const haystack = ` ${tokenize(resume).map(stem).join(" ")} `;
  return keywords.map((keyword) => ({
    ...keyword,
    found: haystack.includes(` ${keyword.term.split(" ").map(stem).join(" ")} `),
  }));
}

export interface AtsCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  weight: number;
}

export interface AtsReport {
  score: number;
  keywordScore: number | null;
  formatScore: number;
  keywords: KeywordMatch[];
  checks: AtsCheck[];
  wordCount: number;
}

const HEADINGS: Array<{ name: string; pattern: RegExp }> = [
  { name: "Experience", pattern: /^(professional |work |employment |relevant )?(experience|history)\b/i },
  { name: "Education", pattern: /^(education|academic background|qualifications)\b/i },
  { name: "Skills", pattern: /^(technical |core |key )?(skills|competencies)\b/i },
];

export function analyseResume(resume: string, job: string, options: { multiColumn?: boolean } = {}): AtsReport {
  const lines = resume.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const words = resume.trim() ? resume.trim().split(/\s+/).length : 0;
  const checks: AtsCheck[] = [];
  const add = (id: string, label: string, passed: boolean, detail: string, weight: number) =>
    checks.push({ id, label, passed, detail, weight });

  add(
    "readable",
    "Text can be read from the file",
    words >= 150,
    words >= 150
      ? `${words} words were extracted, so a tracking system can read it.`
      : "Very little text came out. If this is a scan or an image, save or export the resume as a text-based PDF or Word file.",
    20,
  );

  const email = /[\w.+-]+@[\w-]+(\.[\w-]+)+/.test(resume);
  add("email", "Email address", email, email ? "Found." : "No email address found. Put it at the top, as plain text.", 8);

  const phoneMatch = resume.match(/\+?\d[\d\s().-]{7,}\d/g) ?? [];
  const phone = phoneMatch.some((candidate) => candidate.replace(/\D/g, "").length >= 9 && !/^(19|20)\d{2}\s*[-–]\s*(19|20)\d{2}$/.test(candidate.trim()));
  add("phone", "Phone number", phone, phone ? "Found." : "No phone number found.", 5);

  const missingHeadings = HEADINGS.filter((heading) => !lines.some((line) => line.length <= 40 && heading.pattern.test(line))).map(
    (heading) => heading.name,
  );
  add(
    "headings",
    "Standard section headings",
    missingHeadings.length === 0,
    missingHeadings.length === 0
      ? "Experience, Education and Skills headings were found."
      : `No clear ${missingHeadings.join(", ")} heading. Tracking systems look for these standard names to split a resume into sections.`,
    12,
  );

  const lengthOk = words >= 300 && words <= 1100;
  add(
    "length",
    "Length",
    lengthOk,
    words < 300
      ? `${words} words is short. Most resumes that make it past screening give more detail about results.`
      : words > 1100
        ? `${words} words is long. Aim for one to two pages focused on the most relevant roles.`
        : `${words} words — about one to two pages.`,
    5,
  );

  const yearMatches = resume.match(/\b(19|20)\d{2}\b/g) ?? [];
  add(
    "dates",
    "Dates for each role",
    yearMatches.length >= 2,
    yearMatches.length >= 2 ? "Dates were found." : "Few or no years found. List start and end dates, such as 2021–2024, for each role.",
    5,
  );

  const quantified = lines.filter((line) => /(\d+(\.\d+)?\s?%|[$£€₹]\s?\d|\b\d{2,}\b)/.test(line.replace(/\b(19|20)\d{2}\b/g, ""))).length;
  add(
    "results",
    "Measurable results",
    quantified >= 3,
    quantified >= 3
      ? `${quantified} lines include numbers.`
      : "Few lines include numbers. Figures such as “cut costs by 18%” or “managed 12 people” make achievements concrete.",
    5,
  );

  const verbLines = lines.filter((line) => ACTION_VERBS.has(line.replace(/^[•\-*▪◦·–]\s*/, "").split(/\s+/)[0]?.toLowerCase() ?? "")).length;
  add(
    "verbs",
    "Bullet points start with action verbs",
    verbLines >= 3,
    verbLines >= 3 ? `${verbLines} lines start with verbs such as led or built.` : "Start achievement bullets with verbs such as led, built or improved.",
    3,
  );

  if (options.multiColumn !== undefined) {
    add(
      "layout",
      "Single-column layout",
      !options.multiColumn,
      options.multiColumn
        ? "The PDF looks like it has two or more columns. Some tracking systems read across the columns and scramble the text; a single column is safer."
        : "The text reads in a single column.",
      8,
    );
  }

  const garbled = [...resume].filter((character) => character === REPLACEMENT_CHARACTER || isPrivateUse(character)).length;
  add(
    "characters",
    "No unreadable characters",
    garbled <= Math.max(3, resume.length * 0.002),
    garbled <= Math.max(3, resume.length * 0.002)
      ? "No broken characters found."
      : `${garbled} characters could not be read — often icon fonts or unusual symbols. Replace them with plain text.`,
    4,
  );

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const formatScore = Math.round((checks.filter((check) => check.passed).reduce((sum, check) => sum + check.weight, 0) / totalWeight) * 100);

  const keywords = job.trim() ? matchKeywords(resume, extractKeywords(job)) : [];
  const keywordWeight = keywords.reduce((sum, keyword) => sum + keyword.count, 0);
  const keywordScore =
    keywords.length > 0
      ? Math.round((keywords.filter((keyword) => keyword.found).reduce((sum, keyword) => sum + keyword.count, 0) / keywordWeight) * 100)
      : null;

  const score = keywordScore === null ? formatScore : Math.round(keywordScore * 0.6 + formatScore * 0.4);
  return { score, keywordScore, formatScore, keywords, checks, wordCount: words };
}
