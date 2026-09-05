"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { Segmented } from "@/components/ui/field";

import { TextInput, TextOutput, splitGraphemes } from "./_shared";

type Mode = "characters" | "words" | "lines" | "wordsInLine";

const DESCRIPTIONS: Record<Mode, string> = {
  characters: "Every character in reverse order. Emoji and accented letters stay intact.",
  words: "The words appear in reverse order, each word left readable.",
  lines: "The lines appear in reverse order, each line left untouched.",
  wordsInLine: "Within each line the word order flips, but the lines stay put.",
};

export default function TextReverser() {
  const [text, setText] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("characters");

  const output = React.useMemo(() => {
    if (!text) return "";

    switch (mode) {
      case "characters":
        // Reversing UTF-16 units would split emoji and detach combining accents,
        // so the text is segmented into graphemes first.
        return splitGraphemes(text).reverse().join("");
      case "words":
        return text.split(/(\s+)/).reverse().join("");
      case "lines":
        return text.split(/\r\n|\r|\n/).reverse().join("\n");
      case "wordsInLine":
        return text
          .split(/\r\n|\r|\n/)
          .map((line) => line.split(/(\s+)/).reverse().join(""))
          .join("\n");
    }
  }, [mode, text]);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <TextInput
          id="reverser-input"
          value={text}
          onChange={setText}
          rows={7}
          placeholder="Paste the text you want to reverse…"
        />

        <div className="space-y-1.5">
          <span className="block text-[0.8125rem] font-medium text-fg">What to reverse</span>
          <Segmented
            name="reverser-mode"
            ariaLabel="Reversal mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "characters", label: "Characters" },
              { value: "words", label: "Word order" },
              { value: "lines", label: "Line order" },
              { value: "wordsInLine", label: "Words per line" },
            ]}
          />
          <p className="text-xs text-fg-subtle">{DESCRIPTIONS[mode]}</p>
        </div>

        <TextOutput
          id="reverser-output"
          value={output}
          rows={7}
          downloadName="reversed-text.txt"
          emptyMessage="Enter some text above to reverse it."
        />

        {output ? (
          <p className="text-xs text-fg-subtle">
            Running the result back through the same mode returns your original text exactly.
          </p>
        ) : null}
      </div>
    </ToolFrame>
  );
}
