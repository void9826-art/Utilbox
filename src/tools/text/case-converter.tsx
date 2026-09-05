"use client";

import * as React from "react";

import { ToolFrame } from "@/components/tool/tool-frame";
import { cn } from "@/lib/utils";

import { TextInput, TextOutput } from "./_shared";

/** Words kept lowercase in title case unless they open or close the title. */
const MINOR_WORDS = new Set(
  "a an and as at but by en for if in nor of on or per so the to v vs via with from into onto over under".split(
    " ",
  ),
);

/** Splits any casing convention into its constituent words. */
function toWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s_\-.]+/)
    .filter(Boolean);
}

const CONVERTERS = {
  upper: { label: "UPPERCASE", convert: (text: string) => text.toUpperCase() },
  lower: { label: "lowercase", convert: (text: string) => text.toLowerCase() },
  title: {
    label: "Title Case",
    convert: (text: string) =>
      text
        .toLowerCase()
        .split(/(\s+)/)
        .map((token, index, tokens) => {
          if (!token.trim()) return token;
          const isFirst = index === 0;
          const isLast = index === tokens.length - 1 || !tokens.slice(index + 1).some((t) => t.trim());
          if (!isFirst && !isLast && MINOR_WORDS.has(token)) return token;
          return token[0].toUpperCase() + token.slice(1);
        })
        .join(""),
  },
  sentence: {
    label: "Sentence case",
    convert: (text: string) =>
      text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w|\n\s*\w)/g, (match) => match.toUpperCase()),
  },
  capitalised: {
    label: "Capitalise Every Word",
    convert: (text: string) =>
      text.toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase()),
  },
  alternating: {
    label: "aLtErNaTiNg",
    convert: (text: string) => {
      let letterIndex = 0;
      return [...text]
        .map((character) => {
          if (!/\p{L}/u.test(character)) return character;
          const result = letterIndex % 2 === 0 ? character.toLowerCase() : character.toUpperCase();
          letterIndex += 1;
          return result;
        })
        .join("");
    },
  },
  inverse: {
    label: "iNVERSE cASE",
    convert: (text: string) =>
      [...text]
        .map((character) =>
          character === character.toUpperCase() ? character.toLowerCase() : character.toUpperCase(),
        )
        .join(""),
  },
  camel: {
    label: "camelCase",
    convert: (text: string) =>
      toWords(text)
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word[0].toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(""),
  },
  pascal: {
    label: "PascalCase",
    convert: (text: string) =>
      toWords(text)
        .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(""),
  },
  snake: {
    label: "snake_case",
    convert: (text: string) => toWords(text).map((word) => word.toLowerCase()).join("_"),
  },
  constant: {
    label: "CONSTANT_CASE",
    convert: (text: string) => toWords(text).map((word) => word.toUpperCase()).join("_"),
  },
  kebab: {
    label: "kebab-case",
    convert: (text: string) => toWords(text).map((word) => word.toLowerCase()).join("-"),
  },
} as const;

type ConverterId = keyof typeof CONVERTERS;

const GROUPS: Array<{ title: string; ids: ConverterId[] }> = [
  { title: "Prose", ids: ["upper", "lower", "title", "sentence", "capitalised"] },
  { title: "Playful", ids: ["alternating", "inverse"] },
  { title: "Code", ids: ["camel", "pascal", "snake", "constant", "kebab"] },
];

export default function CaseConverter() {
  const [text, setText] = React.useState("");
  const [active, setActive] = React.useState<ConverterId>("title");

  const output = React.useMemo(
    () => (text ? CONVERTERS[active].convert(text) : ""),
    [active, text],
  );

  return (
    <ToolFrame>
      <div className="space-y-5">
        <TextInput
          id="case-converter-input"
          value={text}
          onChange={setText}
          rows={7}
          placeholder="Paste the text you want to convert…"
        />

        <div className="space-y-3">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <span className="text-[0.6875rem] font-semibold tracking-wider text-fg-subtle uppercase">
                {group.title}
              </span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {group.ids.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActive(id)}
                    aria-pressed={active === id}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                      active === id
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
                    )}
                  >
                    {CONVERTERS[id].label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <TextOutput
          id="case-converter-output"
          value={output}
          label={`Result — ${CONVERTERS[active].label}`}
          rows={7}
          downloadName="converted-text.txt"
          emptyMessage="Enter some text above and choose a case."
        />
      </div>
    </ToolFrame>
  );
}
