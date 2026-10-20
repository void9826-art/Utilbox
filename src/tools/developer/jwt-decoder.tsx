"use client";

import * as React from "react";

import { CodeEditor } from "@/components/tool/code-editor";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { Alert, DataRow } from "@/components/ui/surfaces";
import { CLAIM_NAMES, decodeJwt, relativeTime } from "@/lib/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "long" }).format(date);
}

export default function JwtDecoder() {
  const [input, setInput] = React.useState("");
  // The clock is read once per decode so "expired" does not flicker while typing.
  const result = React.useMemo(() => (input.trim() ? decodeJwt(input, new Date()) : null), [input]);

  const payloadRecord =
    result?.ok && typeof result.token.payload === "object" && result.token.payload !== null && !Array.isArray(result.token.payload)
      ? (result.token.payload as Record<string, unknown>)
      : null;
  const registered = payloadRecord
    ? Object.keys(CLAIM_NAMES).filter((claim) => claim in payloadRecord && !["exp", "nbf", "iat"].includes(claim))
    : [];

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Field
          label="JSON Web Token"
          htmlFor="jwt-input"
          hint="A “Bearer ” prefix and line breaks are ignored."
          action={
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput(SAMPLE)}>
              Load sample
            </Button>
          }
        >
          <Textarea
            id="jwt-input"
            value={input}
            rows={5}
            spellCheck={false}
            autoComplete="off"
            placeholder="eyJhbGciOi…"
            onChange={(event) => setInput(event.target.value)}
            className="font-mono text-[0.8125rem] break-all"
          />
        </Field>

        <Alert tone="info" title="Decoded, not verified">
          Anyone can read a JWT&apos;s header and payload. This tool does not check the signature, so it cannot tell you
          whether the token is genuine or has been altered. Your server must verify it with the secret or public key.
        </Alert>

        {result && !result.ok ? (
          <Alert tone="danger" title="This token could not be decoded">
            {result.message}
          </Alert>
        ) : null}

        {result?.ok ? (
          <div className="space-y-5" aria-live="polite">
            {result.token.expired !== null || result.token.notYetValid ? (
              <Alert
                tone={result.token.expired || result.token.notYetValid ? "warning" : "success"}
                title={
                  result.token.expired
                    ? "Expired"
                    : result.token.notYetValid
                      ? "Not valid yet"
                      : "Not expired"
                }
              >
                Compared with this device&apos;s clock. A wrong clock, or a server that allows a little leeway, can
                change the answer.
              </Alert>
            ) : null}

            {result.token.times.length > 0 || registered.length > 0 ? (
              <section aria-labelledby="jwt-claims-heading" className="rounded-lg border border-border px-4 py-2">
                <h2 id="jwt-claims-heading" className="pt-1 text-[0.8125rem] font-semibold text-fg">
                  Claims explained
                </h2>
                <dl>
                  {result.token.times.map((time) => (
                    <DataRow
                      key={time.claim}
                      label={`${time.label} (${time.claim})`}
                      value={`${formatDate(time.date)} · ${relativeTime(time.date)}`}
                    />
                  ))}
                  {registered.map((claim) => (
                    <DataRow
                      key={claim}
                      label={`${CLAIM_NAMES[claim]} (${claim})`}
                      value={<span className="break-all">{JSON.stringify(payloadRecord?.[claim])}</span>}
                    />
                  ))}
                  {result.token.algorithm ? (
                    <DataRow label="Signing algorithm (alg)" value={result.token.algorithm} />
                  ) : null}
                </dl>
              </section>
            ) : null}

            {result.token.algorithm?.toLowerCase() === "none" ? (
              <Alert tone="warning" title="Unsigned token">
                The algorithm is “none”, so this token carries no signature at all. Servers should reject it.
              </Alert>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-2">
              <CodeEditor
                id="jwt-header"
                label="Header"
                value={JSON.stringify(result.token.header, null, 2)}
                readOnly
                rows={8}
                showStats={false}
              />
              <CodeEditor
                id="jwt-payload"
                label="Payload"
                value={JSON.stringify(result.token.payload, null, 2)}
                readOnly
                rows={8}
                showStats={false}
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-[0.8125rem] font-medium text-fg">Signature (still encoded)</p>
              <p className="rounded-lg border border-border bg-surface-sunken px-3 py-2 font-mono text-[0.75rem] break-all text-fg-muted">
                {result.token.signature || "(empty)"}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </ToolFrame>
  );
}
