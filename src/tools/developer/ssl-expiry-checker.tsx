"use client";

import * as React from "react";

import { CopyButton, ErrorMessage, ProgressIndicator } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert, Badge, DataRow, Stat, StatGrid } from "@/components/ui/surfaces";
import { downloadText } from "@/lib/download";

import { SelectField } from "../calculators/_shared";

interface CertificateSummary {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  fingerprint256: string;
}

interface Report {
  host: string;
  port: number;
  checkedAt: string;
  protocol: string | null;
  cipher: string | null;
  certificate: CertificateSummary & {
    altNames: string[];
    daysRemaining: number;
    expired: boolean;
    notYetValid: boolean;
    keyBits: number | null;
    keyCurve: string | null;
  };
  chain: CertificateSummary[];
  trusted: boolean;
  trustError: string | null;
  hostnameMatches: boolean;
  hostnameError: string | null;
}

const PORTS = [
  { value: "443", label: "443 — HTTPS" },
  { value: "8443", label: "8443 — alternative HTTPS" },
  { value: "465", label: "465 — SMTP over TLS" },
  { value: "993", label: "993 — IMAP over TLS" },
  { value: "995", label: "995 — POP3 over TLS" },
  { value: "636", label: "636 — LDAPS" },
  { value: "853", label: "853 — DNS over TLS" },
  { value: "5061", label: "5061 — SIP over TLS" },
];

const MISSING_INTERMEDIATE =
  "The server is not sending its intermediate certificate. Desktop browsers often fetch it themselves, but many apps, APIs and older devices will refuse the connection. Configure the server to send the full chain.";

const TRUST_ERRORS: Record<string, string> = {
  CERT_HAS_EXPIRED: "A certificate in the chain has expired.",
  CERT_NOT_YET_VALID: "The certificate's start date is in the future.",
  UNABLE_TO_VERIFY_LEAF_SIGNATURE: MISSING_INTERMEDIATE,
  UNABLE_TO_GET_ISSUER_CERT_LOCALLY: MISSING_INTERMEDIATE,
  UNABLE_TO_GET_ISSUER_CERT: MISSING_INTERMEDIATE,
  DEPTH_ZERO_SELF_SIGNED_CERT: "The certificate is self-signed, so browsers will show a security warning.",
  SELF_SIGNED_CERT_IN_CHAIN: "The chain ends in a self-signed certificate that is not a publicly trusted root.",
  CERT_REVOKED: "The certificate has been revoked.",
  CERT_SIGNATURE_FAILURE: "A signature in the certificate chain does not verify.",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short", timeZone: "UTC" }) + " UTC";
}

function reminderCalendar(report: Report): string {
  const expiry = new Date(report.certificate.validTo);
  const reminder = new Date(expiry.getTime() - 14 * 86_400_000);
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const day = (date: Date) => stamp(date).slice(0, 8);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SSL expiry reminder//EN",
    "BEGIN:VEVENT",
    `UID:ssl-${report.host}-${day(expiry)}@reminder`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART;VALUE=DATE:${day(reminder)}`,
    `DTEND;VALUE=DATE:${day(new Date(reminder.getTime() + 86_400_000))}`,
    `SUMMARY:Renew the SSL certificate for ${report.host}`,
    `DESCRIPTION:The certificate for ${report.host} expires on ${expiry.toUTCString()}.`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function verdict(report: Report): { tone: "success" | "warning" | "danger"; title: string } {
  const { certificate } = report;
  if (certificate.expired) {
    const ago = Math.abs(certificate.daysRemaining);
    return { tone: "danger", title: `Expired ${ago === 0 ? "today" : `${ago} day${ago === 1 ? "" : "s"} ago`}` };
  }
  if (certificate.notYetValid) return { tone: "danger", title: "Not valid yet" };
  if (certificate.daysRemaining <= 14) return { tone: "danger", title: `Expires in ${certificate.daysRemaining} days — renew now` };
  if (certificate.daysRemaining <= 30) return { tone: "warning", title: `Expires in ${certificate.daysRemaining} days` };
  return { tone: "success", title: `Valid for ${certificate.daysRemaining} more days` };
}

export default function SslExpiryChecker() {
  const [domain, setDomain] = React.useState("");
  const [port, setPort] = React.useState("443");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [report, setReport] = React.useState<Report | null>(null);

  const check = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!domain.trim()) {
      setError("Enter a domain name, such as example.com.");
      return;
    }
    setBusy(true);
    setError(null);
    setReport(null);
    try {
      const response = await fetch("/api/ssl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host: domain, port: Number(port) }),
      });
      const data = (await response.json().catch(() => null)) as (Report & { error?: string }) | null;
      if (!response.ok || !data || data.error) throw new Error(data?.error ?? "The check failed. Try again.");
      setReport(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The check failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const status = report ? verdict(report) : null;
  const summaryText = report
    ? `${report.host}:${report.port} — ${status?.title}. Expires ${formatDate(report.certificate.validTo)}. Issuer: ${report.certificate.issuer}. Checked ${formatDate(report.checkedAt)}.`
    : "";

  return (
    <ToolFrame>
      <div className="space-y-5">
        <form onSubmit={(event) => void check(event)} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_14rem_auto] sm:items-end">
          <Field label="Domain" htmlFor="ssl-domain">
            <Input
              id="ssl-domain"
              value={domain}
              placeholder="example.com"
              autoComplete="off"
              spellCheck={false}
              inputMode="url"
              onChange={(event) => setDomain(event.target.value)}
            />
          </Field>
          <SelectField label="Port" id="ssl-port" value={port} onChange={setPort}>
            {PORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <Button type="submit" loading={busy}>
            Check certificate
          </Button>
        </form>

        {busy ? <ProgressIndicator label="Connecting and reading the certificate…" /> : null}
        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {report && status ? (
          <div className="space-y-4" aria-live="polite">
            <Alert tone={status.tone} title={`${report.host}: ${status.title}`}>
              Expires {formatDate(report.certificate.validTo)}.
            </Alert>

            <StatGrid className="sm:grid-cols-4">
              <Stat label="Days remaining" value={String(report.certificate.daysRemaining)} emphasis />
              <Stat label="Trusted chain" value={report.trusted ? "Yes" : "No"} />
              <Stat label="Name matches" value={report.hostnameMatches ? "Yes" : "No"} />
              <Stat label="Protocol" value={report.protocol ?? "—"} />
            </StatGrid>

            {!report.trusted && report.trustError ? (
              <Alert tone="danger" title={`Chain problem: ${report.trustError}`}>
                {TRUST_ERRORS[report.trustError] ?? "The certificate chain could not be verified against publicly trusted roots."}
              </Alert>
            ) : null}
            {!report.hostnameMatches ? (
              <Alert tone="danger" title="The certificate does not cover this name">
                {report.hostnameError ?? `The certificate is not issued for ${report.host}.`}
              </Alert>
            ) : null}

            <dl className="rounded-lg border border-border bg-surface px-3.5">
              <DataRow label="Issued to" value={report.certificate.subject} />
              <DataRow label="Issued by" value={report.certificate.issuer} />
              <DataRow label="Valid from" value={formatDate(report.certificate.validFrom)} />
              <DataRow label="Valid until" value={formatDate(report.certificate.validTo)} strong />
              <DataRow
                label="Key"
                value={
                  report.certificate.keyCurve
                    ? `Elliptic curve (${report.certificate.keyCurve})`
                    : report.certificate.keyBits
                      ? `RSA ${report.certificate.keyBits}-bit`
                      : "—"
                }
              />
              <DataRow label="Cipher" value={report.cipher ?? "—"} />
              <DataRow label="Serial number" value={<span className="font-mono text-xs break-all">{report.certificate.serialNumber}</span>} />
            </dl>

            {report.certificate.altNames.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[0.8125rem] font-medium text-fg">
                  Names covered ({report.certificate.altNames.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {report.certificate.altNames.slice(0, 60).map((name) => (
                    <Badge key={name}>{name}</Badge>
                  ))}
                </div>
              </div>
            ) : null}

            {report.chain.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[0.8125rem] font-medium text-fg">Certificate chain</p>
                <ol className="space-y-2">
                  {report.chain.map((cert, index) => (
                    <li key={cert.fingerprint256} className="rounded-lg border border-border bg-surface-sunken p-3 text-[0.8125rem]">
                      <p className="font-medium text-fg">
                        {index === 0 ? "Site certificate" : index === report.chain.length - 1 ? "Root" : "Intermediate"}:{" "}
                        {cert.subject}
                      </p>
                      <p className="text-fg-muted">Issued by {cert.issuer} · valid until {formatDate(cert.validTo)}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <CopyButton value={summaryText} label="Copy summary" />
              {report.certificate.daysRemaining > 14 ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => downloadText(reminderCalendar(report), `renew-${report.host}.ics`, "text/calendar;charset=utf-8")}
                >
                  Add a renewal reminder to your calendar
                </Button>
              ) : null}
            </div>
            <p className="text-xs text-fg-subtle">Checked {formatDate(report.checkedAt)} from this site&apos;s server.</p>
          </div>
        ) : null}
      </div>
    </ToolFrame>
  );
}
