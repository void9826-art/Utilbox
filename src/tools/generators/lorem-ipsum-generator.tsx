"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Segmented, Slider } from "@/components/ui/field";
import { downloadText } from "@/lib/download";
import { randomIntBetween } from "@/lib/random";

/** The traditional scrambled fragment of Cicero's De Finibus (45 BC). */
const LATIN =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum at vero eos accusamus iusto odio dignissimos ducimus blanditiis praesentium voluptatum deleniti atque corrupti quos dolores quas molestias excepturi occaecati cupiditate provident similique culpa officia deserunt mollitia animi laborum dolorum fuga harum quidem rerum facilis expedita distinctio nam libero tempore cum soluta nobis eligendi optio cumque nihil impedit quo minus maxime placeat facere possimus omnis voluptas assumenda repellendus temporibus autem quibusdam aut officiis debitis necessitatibus saepe eveniet voluptates repudiandae recusandae itaque earum hic tenetur sapiente delectus reiciendis voluptatibus maiores alias perferendis doloribus asperiores repellat".split(
    " ",
  );

const ENGLISH =
  "the quick design system makes every page feel considered a good interface tells you where you are what you can do and what will happen next people rarely read they scan so hierarchy matters more than decoration white space is not wasted space it is what lets the eye find the thing that matters type carries most of the weight in any layout a clear scale removes the need for colour to do that work small details compound a well judged corner radius consistent spacing and a focus ring that actually shows up are worth more than any single flourish good products feel quiet they stay out of the way until you need them and then they are exactly where you expect".split(
    " ",
  );

type Unit = "paragraphs" | "sentences" | "words" | "list";

function sentence(words: string[], minWords: number, maxWords: number): string {
  const length = randomIntBetween(minWords, maxWords);
  const picked = Array.from({ length }, () => words[randomIntBetween(0, words.length - 1)]);
  const text = picked.join(" ");
  return text[0].toUpperCase() + text.slice(1) + ".";
}

function paragraph(words: string[]): string {
  const sentences = randomIntBetween(3, 6);
  return Array.from({ length: sentences }, () => sentence(words, 6, 18)).join(" ");
}

function generate(
  unit: Unit,
  count: number,
  words: string[],
  startClassic: boolean,
  wrapInTags: boolean,
): string {
  const CLASSIC_OPENING = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

  switch (unit) {
    case "paragraphs": {
      const blocks = Array.from({ length: count }, (_, index) => {
        const body = paragraph(words);
        return index === 0 && startClassic ? `${CLASSIC_OPENING} ${body}` : body;
      });
      return wrapInTags
        ? blocks.map((block) => `<p>${block}</p>`).join("\n")
        : blocks.join("\n\n");
    }

    case "sentences": {
      const items = Array.from({ length: count }, (_, index) =>
        index === 0 && startClassic ? CLASSIC_OPENING : sentence(words, 6, 18),
      );
      return items.join(" ");
    }

    case "words": {
      const picked = Array.from(
        { length: count },
        () => words[randomIntBetween(0, words.length - 1)],
      );
      if (startClassic) picked.splice(0, Math.min(5, picked.length), "lorem", "ipsum", "dolor", "sit", "amet");
      const text = picked.join(" ");
      return text[0].toUpperCase() + text.slice(1) + ".";
    }

    case "list": {
      const items = Array.from({ length: count }, () => {
        const length = randomIntBetween(3, 8);
        const picked = Array.from({ length }, () => words[randomIntBetween(0, words.length - 1)]);
        const text = picked.join(" ");
        return text[0].toUpperCase() + text.slice(1);
      });
      return wrapInTags
        ? `<ul>\n${items.map((item) => `  <li>${item}</li>`).join("\n")}\n</ul>`
        : items.map((item) => `• ${item}`).join("\n");
    }
  }
}

const MAXIMUMS: Record<Unit, number> = {
  paragraphs: 30,
  sentences: 50,
  words: 500,
  list: 30,
};

export default function LoremIpsumGenerator() {
  const [unit, setUnit] = React.useState<Unit>("paragraphs");
  const [count, setCount] = React.useState(3);
  const [language, setLanguage] = React.useState<"latin" | "english">("latin");
  const [startClassic, setStartClassic] = React.useState(true);
  const [wrapInTags, setWrapInTags] = React.useState(false);
  const [output, setOutput] = React.useState("");

  const words = language === "latin" ? LATIN : ENGLISH;

  const run = React.useCallback(() => {
    setOutput(generate(unit, Math.min(count, MAXIMUMS[unit]), words, startClassic && language === "latin", wrapInTags));
  }, [count, language, startClassic, unit, words, wrapInTags]);

  // Generated after mount so the markup is stable between server and client.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the text is randomly generated, so it must be produced after mount to match the server-rendered HTML
    run();
  }, [run]);

  const wordCount = output ? output.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length : 0;

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Generate</span>
            <Segmented
              name="lorem-unit"
              ariaLabel="What to generate"
              value={unit}
              onChange={(value) => {
                setUnit(value);
                setCount((previous) => Math.min(previous, MAXIMUMS[value]));
              }}
              options={[
                { value: "paragraphs", label: "Paragraphs" },
                { value: "sentences", label: "Sentences" },
                { value: "words", label: "Words" },
                { value: "list", label: "List items" },
              ]}
            />
          </div>

          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Text</span>
            <Segmented
              name="lorem-language"
              ariaLabel="Filler language"
              value={language}
              onChange={setLanguage}
              options={[
                { value: "latin", label: "Classic Latin" },
                { value: "english", label: "Plain English" },
              ]}
            />
          </div>
        </div>

        <Slider
          label={`How many ${unit === "list" ? "list items" : unit}`}
          valueLabel={String(count)}
          min={1}
          max={MAXIMUMS[unit]}
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
        />

        <div className="grid gap-2.5 sm:grid-cols-2">
          {language === "latin" ? (
            <Checkbox
              label="Start with “Lorem ipsum dolor sit amet”"
              description="The opening designers expect to see."
              checked={startClassic}
              onChange={(event) => setStartClassic(event.target.checked)}
            />
          ) : null}
          {unit === "paragraphs" || unit === "list" ? (
            <Checkbox
              label="Wrap in HTML tags"
              description={unit === "list" ? "Produces a <ul> block" : "Produces <p> elements"}
              checked={wrapInTags}
              onChange={(event) => setWrapInTags(event.target.checked)}
            />
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[0.8125rem] font-medium text-fg">
              Result{wordCount > 0 ? ` — ${wordCount} words` : ""}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              <Button type="button" variant="secondary" size="sm" onClick={run}>
                <RefreshCw className="size-4" aria-hidden="true" />
                Regenerate
              </Button>
              <CopyButton value={output} />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={!output}
                onClick={() => downloadText(output, wrapInTags ? "lorem-ipsum.html" : "lorem-ipsum.txt")}
              >
                Download
              </Button>
            </div>
          </div>

          <div className="scrollbar-slim max-h-96 overflow-y-auto rounded-lg border border-border bg-surface-sunken p-4">
            <pre className="font-sans text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-fg">
              {output || "Generating…"}
            </pre>
          </div>
        </div>
      </div>
    </ToolFrame>
  );
}
