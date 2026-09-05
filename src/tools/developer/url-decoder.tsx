"use client";

import * as React from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { CopyButton, ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { formatNumber } from "@/lib/utils";

interface ParsedUrl {
  protocol: string;
  host: string;
  pathname: string;
  hash: string;
  parameters: Array<{ key: string; value: string }>;
}

function tryParseUrl(text: string): ParsedUrl | null {
  const trimmed = text.trim();
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return null;

  try {
    const url = new URL(trimmed);
    return {
      protocol: url.protocol.replace(":", ""),
      host: url.host,
      pathname: decodeURIComponent(url.pathname),
      hash: url.hash ? decodeURIComponent(url.hash.slice(1)) : "",
      parameters: [...url.searchParams.entries()].map(([key, value]) => ({ key, value })),
    };
  } catch {
    return null;
  }
}

export default function UrlDecoder() {
  const [input, setInput] = React.useState("");
  const [repeat, setRepeat] = React.useState(true);
  const [plusAsSpace, setPlusAsSpace] = React.useState(false);

  const result = React.useMemo(() => {
    if (!input.trim()) return null;

    let working = plusAsSpace ? input.replace(/\+/g, " ") : input;
    let passes = 0;

    try {
      // Each pass removes one layer of encoding; %25 is an encoded percent sign
      // and is the giveaway that a string was encoded more than once.
      for (let i = 0; i < (repeat ? 5 : 1); i += 1) {
        const decoded = decodeURIComponent(working);
        if (decoded === working) break;
        working = decoded;
        passes += 1;
      }
      return { ok: true as const, text: working, passes, url: tryParseUrl(working) };
    } catch {
      return {
        ok: false as const,
        message:
          "That text contains an invalid percent-escape. A % must be followed by two hexadecimal digits.",
      };
    }
  }, [input, plusAsSpace, repeat]);

  return (
    <ToolFrame>
      <div className="space-y-4">
        <CodeEditor
          id="url-decoder-input"
          label="Encoded URL or text"
          value={input}
          onChange={setInput}
          rows={6}
          placeholder="Paste a percent-encoded URL or string…"
        />

        <div className="grid gap-2.5 sm:grid-cols-2">
          <Checkbox
            label="Decode repeatedly"
            description="Unwraps strings that were encoded more than once."
            checked={repeat}
            onChange={(event) => setRepeat(event.target.checked)}
          />
          <Checkbox
            label="Treat + as a space"
            description="Correct for form-encoded query strings, wrong for paths."
            checked={plusAsSpace}
            onChange={(event) => setPlusAsSpace(event.target.checked)}
          />
        </div>

        {result && !result.ok ? <ErrorMessage message={result.message} /> : null}

        {result?.ok ? (
          <>
            <StatGrid className="sm:grid-cols-3">
              <Stat label="Characters in" value={formatNumber(input.length)} />
              <Stat label="Characters out" value={formatNumber(result.text.length)} emphasis />
              <Stat
                label="Decoding passes"
                value={formatNumber(result.passes)}
                hint={result.passes > 1 ? "It was encoded more than once" : undefined}
              />
            </StatGrid>

            {result.passes > 1 ? (
              <Alert tone="info" title="This string was encoded more than once">
                {result.passes} passes were needed. That usually means the URL travelled through a redirect
                that re-encoded it.
              </Alert>
            ) : null}

            <CodeEditor
              id="url-decoder-output"
              label="Decoded result"
              value={result.text}
              readOnly
              rows={6}
              downloadName="decoded-url.txt"
            />

            {result.url ? (
              <section className="space-y-2">
                <h2 className="text-[0.8125rem] font-medium text-fg">Broken down</h2>
                <dl className="overflow-hidden rounded-lg border border-border">
                  <UrlPart label="Protocol" value={result.url.protocol} />
                  <UrlPart label="Host" value={result.url.host} />
                  <UrlPart label="Path" value={result.url.pathname} />
                  {result.url.hash ? <UrlPart label="Fragment" value={result.url.hash} /> : null}
                </dl>

                {result.url.parameters.length > 0 ? (
                  <div
                    className="scrollbar-slim overflow-auto rounded-lg border border-border"
                    style={{ maxHeight: "20rem" }}
                    tabIndex={0}
                    role="region"
                    aria-label="Query parameters"
                  >
                    <table className="w-full border-collapse text-[0.8125rem]">
                      <caption className="sr-only">Query parameters</caption>
                      <thead className="sticky top-0 bg-surface-sunken">
                        <tr>
                          <th
                            scope="col"
                            className="border-b border-border px-3 py-2 text-left font-semibold text-fg"
                          >
                            Parameter
                          </th>
                          <th
                            scope="col"
                            className="border-b border-border px-3 py-2 text-left font-semibold text-fg"
                          >
                            Value
                          </th>
                          <th className="w-10 border-b border-border">
                            <span className="sr-only">Copy</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.url.parameters.map((parameter, index) => (
                          <tr key={`${parameter.key}-${index}`} className="even:bg-bg-muted/60">
                            <td className="border-b border-border px-3 py-1.5 font-mono font-medium text-fg">
                              {parameter.key}
                            </td>
                            <td className="max-w-md border-b border-border px-3 py-1.5 break-all text-fg-muted">
                              {parameter.value || <span className="text-fg-subtle">(empty)</span>}
                            </td>
                            <td className="border-b border-border px-2 py-1">
                              <CopyButton value={parameter.value} iconOnly variant="ghost" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}

function UrlPart({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-border px-3 py-2 last:border-b-0">
      <dt className="w-20 shrink-0 text-[0.8125rem] text-fg-muted">{label}</dt>
      <dd className="min-w-0 flex-1 font-mono text-[0.8125rem] break-all text-fg">{value || "—"}</dd>
    </div>
  );
}
