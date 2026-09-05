"use client";

import * as React from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { formatNumber } from "@/lib/utils";

type Mode = "component" | "full" | "form";

const MODE_HELP: Record<Mode, string> = {
  component:
    "Escapes everything, including : / ? & = #. Use this for a value going inside a query parameter.",
  full: "Leaves the characters that give a URL its structure ( : / ? & = # ) intact. Use this for a whole URL.",
  form: "Like component encoding, but a space becomes + rather than %20 — the legacy form-submission style.",
};

const SAMPLE = "https://example.com/search?q=coffee & tea&lang=en";

export default function UrlEncoder() {
  const [input, setInput] = React.useState("");
  const [mode, setMode] = React.useState<Mode>("component");

  // The error is part of the computed result rather than separate state, so
  // there is no way for the two to disagree about the current input.
  const { output, error } = React.useMemo((): { output: string; error: string | null } => {
    if (!input) return { output: "", error: null };

    try {
      switch (mode) {
        case "component":
          return { output: encodeURIComponent(input), error: null };
        case "full":
          return { output: encodeURI(input), error: null };
        case "form":
          return { output: encodeURIComponent(input).replace(/%20/g, "+"), error: null };
      }
    } catch {
      // Thrown only by a lone surrogate, which has no valid UTF-8 encoding.
      return {
        output: "",
        error:
          "That text contains an unpaired surrogate character, which has no valid UTF-8 representation.",
      };
    }
  }, [input, mode]);

  const escapeCount = React.useMemo(() => (output.match(/%[0-9A-Fa-f]{2}/g) ?? []).length, [output]);

  return (
    <ToolFrame>
      <div className="space-y-4">
        <CodeEditor
          id="url-encoder-input"
          label="Text or URL to encode"
          value={input}
          onChange={setInput}
          rows={6}
          placeholder="Paste a URL or a single parameter value…"
          actions={
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput(SAMPLE)}>
              Load sample
            </Button>
          }
        />

        <div className="space-y-1.5">
          <span className="block text-[0.8125rem] font-medium text-fg">Encoding mode</span>
          <Segmented
            name="url-encoder-mode"
            ariaLabel="Encoding mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "component", label: "Component" },
              { value: "full", label: "Whole URL" },
              { value: "form", label: "Form (+)" },
            ]}
          />
          <p className="text-xs text-fg-subtle">{MODE_HELP[mode]}</p>
        </div>

        <ErrorMessage message={error} />

        {output ? (
          <StatGrid className="sm:grid-cols-3">
            <Stat label="Characters in" value={formatNumber(input.length)} />
            <Stat label="Characters out" value={formatNumber(output.length)} emphasis />
            <Stat label="Escape sequences" value={formatNumber(escapeCount)} />
          </StatGrid>
        ) : null}

        <CodeEditor
          id="url-encoder-output"
          label="Encoded result"
          value={output}
          readOnly
          rows={6}
          downloadName="encoded-url.txt"
          placeholder="The encoded result will appear here."
        />

        {input && mode === "full" && /[?&=]/.test(input) ? (
          <Alert tone="info" title="Encoding a value rather than a whole URL?">
            Whole-URL mode deliberately leaves <code className="font-mono">? & =</code> alone. If this text
            is going to be embedded inside a query parameter, switch to Component mode — otherwise the
            server will read those characters as URL structure.
          </Alert>
        ) : null}
      </div>
    </ToolFrame>
  );
}
