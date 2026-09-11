"use client";

import * as React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { ErrorMessage } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { Alert, Stat, StatGrid } from "@/components/ui/surfaces";
import { checkEmail, type EmailCheck } from "@/lib/email";
import { cn } from "@/lib/utils";

const MAX_ADDRESSES = 500;
const MAX_MX_DOMAINS = 20;

type MxStatus = "mx" | "implicit" | "null-mx" | "none" | "no-domain";
type MxState =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done"; status: MxStatus; mx: Array<{ exchange: string; priority: number }>; addresses: string[] };

function describeMx(result: MxState): { ok: boolean | null; text: string } {
  if (result.state === "loading") return { ok: null, text: "Looking up mail servers…" };
  if (result.state === "error") return { ok: null, text: result.message };
  switch (result.status) {
    case "mx":
      return {
        ok: true,
        text: `Accepts mail: ${result.mx
          .slice(0, 3)
          .map((record) => `${record.exchange} (priority ${record.priority})`)
          .join(", ")}${result.mx.length > 3 ? ` and ${result.mx.length - 3} more` : ""}`,
      };
    case "implicit":
      return { ok: true, text: `No MX record, so mail goes to the domain's own address (${result.addresses[0]}). This works, but is unusual.` };
    case "null-mx":
      return { ok: false, text: "This domain publishes a “null MX” record: it declares that it accepts no email at all." };
    case "none":
      return { ok: false, text: "The domain exists but has no mail servers and no address, so mail cannot be delivered." };
    case "no-domain":
      return { ok: false, text: "This domain does not exist." };
  }
}

function Verdict({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  const Icon = ok ? CheckCircle2 : XCircle;
  return (
    <span className={cn("inline-flex items-center gap-1 text-[0.8125rem] font-semibold", ok ? "text-fg" : "text-fg underline decoration-2")}>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function EmailSyntaxChecker() {
  const [text, setText] = React.useState("jane.doe@example.com\nsam@gmial.com\njohn..smith@company.org");
  const [mx, setMx] = React.useState<Record<string, MxState>>({});
  const [error, setError] = React.useState<string | null>(null);

  const lines = React.useMemo(
    () => text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
    [text],
  );
  const checks = React.useMemo<EmailCheck[]>(() => lines.slice(0, MAX_ADDRESSES).map(checkEmail), [lines]);

  const valid = checks.filter((check) => check.valid).length;
  const domains = [...new Set(checks.map((check) => check.asciiDomain).filter((domain): domain is string => Boolean(domain)))];

  const lookup = async () => {
    setError(null);
    const targets = domains.slice(0, MAX_MX_DOMAINS);
    if (targets.length === 0) {
      setError("There are no validly formatted addresses to look up.");
      return;
    }
    setMx((previous) => ({ ...previous, ...Object.fromEntries(targets.map((domain) => [domain, { state: "loading" } as MxState])) }));

    // Four at a time: quick, without flooding the lookup service.
    for (let index = 0; index < targets.length; index += 4) {
      await Promise.all(
        targets.slice(index, index + 4).map(async (domain) => {
          let result: MxState;
          try {
            const response = await fetch("/api/mx", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ domain }),
            });
            const data = await response.json().catch(() => null);
            result =
              response.ok && data && !data.error
                ? { state: "done", status: data.status, mx: data.mx ?? [], addresses: data.addresses ?? [] }
                : { state: "error", message: data?.error ?? "The lookup failed." };
          } catch {
            result = { state: "error", message: "The lookup failed. Check your connection." };
          }
          setMx((previous) => ({ ...previous, [domain]: result }));
        }),
      );
    }
  };

  const applySuggestion = (check: EmailCheck) => {
    if (!check.suggestion) return;
    setText((previous) =>
      previous
        .split(/\r?\n/)
        .map((line) => (line.trim() === check.input.trim() ? check.suggestion! : line))
        .join("\n"),
    );
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email-input" className="text-[0.8125rem] font-medium text-fg">
            Email addresses — one per line
          </label>
          <Textarea
            id="email-input"
            value={text}
            rows={6}
            spellCheck={false}
            autoComplete="off"
            onChange={(event) => setText(event.target.value)}
            className="font-mono text-[0.8125rem]"
          />
          <p className="text-xs text-fg-subtle">
            The format check runs as you type, in your browser. Up to {MAX_ADDRESSES} addresses.
          </p>
        </div>

        {lines.length > MAX_ADDRESSES ? (
          <Alert tone="warning">Only the first {MAX_ADDRESSES} addresses are checked.</Alert>
        ) : null}

        {checks.length > 0 ? (
          <>
            <StatGrid className="sm:grid-cols-3">
              <Stat label="Addresses" value={String(checks.length)} />
              <Stat label="Valid format" value={String(valid)} emphasis />
              <Stat label="Invalid" value={String(checks.length - valid)} />
            </StatGrid>

            <ul className="space-y-2" aria-live="polite">
              {checks.map((check, index) => {
                const domainResult = check.asciiDomain ? mx[check.asciiDomain] : undefined;
                const mxText = domainResult ? describeMx(domainResult) : null;
                return (
                  <li key={`${check.input}-${index}`} className="space-y-1 rounded-lg border border-border bg-surface p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="min-w-0 font-mono text-[0.8125rem] break-all text-fg">{check.address}</span>
                      <Verdict ok={check.valid}>{check.valid ? "Valid format" : "Invalid format"}</Verdict>
                    </div>
                    {check.problems.length > 0 ? (
                      <ul className="list-disc space-y-0.5 pl-5 text-[0.8125rem] text-fg">
                        {check.problems.map((problem) => (
                          <li key={problem}>{problem}</li>
                        ))}
                      </ul>
                    ) : null}
                    {check.warnings.length > 0 ? (
                      <ul className="space-y-0.5 text-xs text-fg-muted">
                        {check.warnings.map((warning) => (
                          <li key={warning}>Note: {warning}</li>
                        ))}
                      </ul>
                    ) : null}
                    {check.suggestion ? (
                      <p className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-fg">
                        Did you mean <span className="font-mono">{check.suggestion}</span>?
                        <Button type="button" variant="secondary" size="sm" onClick={() => applySuggestion(check)}>
                          Use this
                        </Button>
                      </p>
                    ) : null}
                    {mxText ? (
                      <p className="text-[0.8125rem] text-fg-muted">
                        <strong className="font-semibold text-fg">
                          {mxText.ok === true ? "Mail servers found. " : mxText.ok === false ? "No mail delivery. " : ""}
                        </strong>
                        {mxText.text}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            <div className="space-y-2">
              <Button type="button" variant="secondary" onClick={() => void lookup()} disabled={domains.length === 0}>
                Check mail servers (MX) for {Math.min(domains.length, MAX_MX_DOMAINS)} domain
                {Math.min(domains.length, MAX_MX_DOMAINS) === 1 ? "" : "s"}
              </Button>
              <p className="text-xs text-fg-subtle">
                Only the domain names — the part after the @ — are sent to this site&apos;s server for a DNS lookup.
                {domains.length > MAX_MX_DOMAINS ? ` The first ${MAX_MX_DOMAINS} domains are checked.` : ""}
              </p>
            </div>
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          </>
        ) : null}
      </div>
    </ToolFrame>
  );
}
