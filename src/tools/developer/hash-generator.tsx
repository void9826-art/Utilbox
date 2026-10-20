"use client";

import * as React from "react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Checkbox, Field, Input, Segmented, Textarea } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { HASH_ALGORITHMS, hashText, hmacText, type HashAlgorithm, type HashEncoding } from "@/lib/hash";

type Results = Partial<Record<HashAlgorithm, string>>;

export default function HashGenerator() {
  const [text, setText] = React.useState("");
  const [encoding, setEncoding] = React.useState<HashEncoding>("hex");
  const [uppercase, setUppercase] = React.useState(false);
  const [useHmac, setUseHmac] = React.useState(false);
  const [key, setKey] = React.useState("");
  const [results, setResults] = React.useState<Results>({});
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const entries = await Promise.all(
          HASH_ALGORITHMS.map(async (algorithm) => {
            if (useHmac && algorithm === "MD5") return [algorithm, ""] as const;
            const value = useHmac
              ? await hmacText(text, key, algorithm as Exclude<HashAlgorithm, "MD5">, encoding)
              : await hashText(text, algorithm, encoding);
            return [algorithm, value] as const;
          }),
        );
        if (!cancelled) {
          setResults(Object.fromEntries(entries));
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Your browser could not calculate the hash. Web Crypto needs a secure (https) page.");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [encoding, key, text, useHmac]);

  const show = (value: string) => (uppercase && encoding === "hex" ? value.toUpperCase() : value);

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Field label="Text to hash" htmlFor="hash-text" hint="Hashed as UTF-8, exactly as typed — including spaces and line breaks.">
          <Textarea
            id="hash-text"
            value={text}
            rows={6}
            spellCheck={false}
            placeholder="Type or paste text…"
            onChange={(event) => setText(event.target.value)}
            className="font-mono text-[0.8125rem]"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <span className="block text-[0.8125rem] font-medium text-fg">Output</span>
            <Segmented
              name="hash-encoding"
              ariaLabel="Output encoding"
              value={encoding}
              onChange={setEncoding}
              options={[
                { value: "hex", label: "Hex" },
                { value: "base64", label: "Base64" },
              ]}
            />
          </div>
          <div className="space-y-2.5 sm:pt-6">
            <Checkbox
              label="Upper-case hex"
              checked={uppercase}
              disabled={encoding !== "hex"}
              onChange={(event) => setUppercase(event.target.checked)}
            />
            <Checkbox
              label="HMAC with a secret key"
              description="Keyed hash used to sign API requests and webhooks."
              checked={useHmac}
              onChange={(event) => setUseHmac(event.target.checked)}
            />
          </div>
        </div>

        {useHmac ? (
          <Field label="Secret key" htmlFor="hash-key" hint="Used as UTF-8 text. It stays in this page.">
            <Input
              id="hash-key"
              value={key}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setKey(event.target.value)}
              className="font-mono"
            />
          </Field>
        ) : null}

        {error ? <Alert tone="danger">{error}</Alert> : null}

        <section aria-labelledby="hash-results-heading" className="space-y-2">
          <h2 id="hash-results-heading" className="text-[0.8125rem] font-medium text-fg">
            {useHmac ? "HMAC results" : "Hashes"}
            {text === "" ? <span className="font-normal text-fg-subtle"> — of an empty string</span> : null}
          </h2>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {HASH_ALGORITHMS.map((algorithm) => {
              const value = results[algorithm] ?? "";
              const unavailable = useHmac && algorithm === "MD5";
              return (
                <li key={algorithm} className="flex flex-col gap-2 px-3.5 py-2.5 sm:flex-row sm:items-center">
                  <span className="shrink-0 text-[0.8125rem] sm:w-28 font-semibold text-fg">
                    {useHmac ? `HMAC-${algorithm}` : algorithm}
                  </span>
                  <code className="min-w-0 flex-1 font-mono text-[0.75rem] break-all text-fg-muted">
                    {unavailable ? "Not offered — use a SHA-2 algorithm for HMAC." : show(value)}
                  </code>
                  {!unavailable ? (
                    <CopyButton value={show(value)} iconOnly label={`Copy ${algorithm}`} variant="ghost" />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <p className="text-xs text-fg-subtle">
          MD5 and SHA-1 are broken for security purposes. Use them only to match existing checksums; choose SHA-256 or
          stronger for anything new, and never use a plain hash to store passwords.
        </p>
      </div>
    </ToolFrame>
  );
}
