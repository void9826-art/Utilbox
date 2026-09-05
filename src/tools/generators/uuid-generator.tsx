"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Segmented, Slider } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { downloadText } from "@/lib/download";
import { MAX_UUID, NIL_UUID, ulid, uuidV4, uuidV7 } from "@/lib/random";
import { formatNumber } from "@/lib/utils";

type Version = "v4" | "v7" | "ulid" | "nil";

const VERSION_HELP: Record<Version, string> = {
  v4: "122 random bits. Unguessable, but arrives at a database in random order.",
  v7: "A millisecond timestamp followed by random bits, so identifiers sort by creation time.",
  ulid: "Sortable like v7, but shorter and written in case-insensitive Crockford base 32.",
  nil: "The all-zero and all-one special values from the specification.",
};

type Format = "standard" | "uppercase" | "braced" | "compact" | "urn";

function applyFormat(value: string, format: Format): string {
  switch (format) {
    case "standard":
      return value;
    case "uppercase":
      return value.toUpperCase();
    case "braced":
      return `{${value}}`;
    case "compact":
      return value.replace(/-/g, "");
    case "urn":
      return `urn:uuid:${value}`;
  }
}

export default function UuidGenerator() {
  const [version, setVersion] = React.useState<Version>("v4");
  const [format, setFormat] = React.useState<Format>("standard");
  const [count, setCount] = React.useState(5);
  const [values, setValues] = React.useState<string[]>([]);

  const generate = React.useCallback(() => {
    if (version === "nil") {
      setValues([NIL_UUID, MAX_UUID]);
      return;
    }
    const make = version === "v4" ? uuidV4 : version === "v7" ? uuidV7 : ulid;
    setValues(Array.from({ length: count }, make));
  }, [count, version]);

  // Values are produced after mount so server and client markup agree.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- UUIDs generated during render would differ between the server HTML and the client
    generate();
  }, [generate]);

  const formatted = React.useMemo(
    () => values.map((value) => (version === "ulid" ? value : applyFormat(value, format))),
    [format, values, version],
  );

  const joined = formatted.join("\n");

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Version</span>
            <Segmented
              name="uuid-version"
              ariaLabel="UUID version"
              value={version}
              onChange={setVersion}
              options={[
                { value: "v4", label: "v4" },
                { value: "v7", label: "v7" },
                { value: "ulid", label: "ULID" },
                { value: "nil", label: "Nil / Max" },
              ]}
            />
            <p className="text-xs text-fg-subtle">{VERSION_HELP[version]}</p>
          </div>

          {version !== "ulid" && version !== "nil" ? (
            <div className="space-y-1.5">
              <span className="block text-[0.8125rem] font-medium text-fg">Format</span>
              <Segmented
                name="uuid-format"
                ariaLabel="Output format"
                value={format}
                onChange={setFormat}
                options={[
                  { value: "standard", label: "Standard" },
                  { value: "uppercase", label: "UPPER" },
                  { value: "compact", label: "No dashes" },
                  { value: "braced", label: "{Braced}" },
                ]}
              />
              <p className="text-xs text-fg-subtle">
                Lowercase with hyphens is the standard form and works everywhere.
              </p>
            </div>
          ) : null}
        </div>

        {version !== "nil" ? (
          <Slider
            label="How many to generate"
            valueLabel={formatNumber(count)}
            min={1}
            max={1000}
            step={1}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
          />
        ) : null}

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[0.8125rem] font-medium text-fg">
              {version === "nil" ? "Special values" : `${formatNumber(formatted.length)} generated`}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {version !== "nil" ? (
                <Button type="button" variant="secondary" size="sm" onClick={generate}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Generate again
                </Button>
              ) : null}
              <CopyButton value={joined} label="Copy all" />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={!joined}
                onClick={() => downloadText(joined, "uuids.txt")}
              >
                Download
              </Button>
            </div>
          </div>

          {formatted.length === 0 ? (
            <div className="flex min-h-20 items-center justify-center rounded-lg border border-dashed border-border text-sm text-fg-muted">
              Generating…
            </div>
          ) : (
            <ul className="scrollbar-slim max-h-96 divide-y divide-border overflow-y-auto rounded-lg border border-border">
              {formatted.map((value, index) => (
                <li key={`${index}-${value}`} className="flex items-center gap-2 px-3 py-1.5">
                  <span className="tabular w-8 shrink-0 text-right text-[0.6875rem] text-fg-subtle">
                    {index + 1}
                  </span>
                  <code className="min-w-0 flex-1 font-mono text-[0.8125rem] break-all text-fg select-all">
                    {value}
                  </code>
                  <CopyButton value={value} iconOnly variant="ghost" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {version === "v7" ? (
          <Alert tone="info" title="Version 7 encodes its creation time">
            The first 48 bits are a millisecond timestamp, which is what makes these sort chronologically
            and keeps database indexes compact. It also means anyone holding the identifier can read
            roughly when it was created — use v4 for public tokens where that matters.
          </Alert>
        ) : null}

        {version === "v4" ? (
          <Alert tone="info" title="Collisions are not a practical concern">
            With 122 random bits you would need to generate around 2.7 × 10¹⁸ identifiers before a
            collision became likely.
          </Alert>
        ) : null}
      </div>
    </ToolFrame>
  );
}
