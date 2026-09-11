"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import { CopyButton } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { Alert } from "@/components/ui/surfaces";
import { DEFAULT_CSV_OPTIONS, escapeCsvValue } from "@/lib/csv";
import { downloadBlob, downloadText } from "@/lib/download";

const PARAMS = [
  { key: "utm_source", label: "Source", required: true, hint: "Where the visit comes from — google, newsletter, linkedin", placeholder: "newsletter" },
  { key: "utm_medium", label: "Medium", required: true, hint: "The channel — email, cpc, social", placeholder: "email" },
  { key: "utm_campaign", label: "Campaign", required: true, hint: "The campaign name — spring-sale", placeholder: "spring-sale" },
  { key: "utm_id", label: "Campaign ID", required: false, hint: "Optional. Used to join cost data in Google Analytics.", placeholder: "" },
  { key: "utm_term", label: "Term", required: false, hint: "Optional. The paid search keyword.", placeholder: "" },
  { key: "utm_content", label: "Content", required: false, hint: "Optional. Tells links in one message apart — header-button.", placeholder: "" },
] as const;

type ParamKey = (typeof PARAMS)[number]["key"];
type Values = Record<ParamKey, string>;

const EMPTY: Values = { utm_source: "", utm_medium: "", utm_campaign: "", utm_id: "", utm_term: "", utm_content: "" };
const SOURCE_PRESETS = ["google", "facebook", "instagram", "linkedin", "x", "tiktok", "youtube", "newsletter", "bing", "reddit"];
const MEDIUM_PRESETS = ["email", "cpc", "social", "paid-social", "display", "affiliate", "referral", "sms", "qr"];

const HISTORY_KEY = "utm-builder-history";
const HISTORY_EVENT = "utm-builder-history-change";
const HISTORY_LIMIT = 50;

interface HistoryEntry {
  url: string;
  createdAt: string;
}

/** Adds, replaces or removes each UTM parameter, keeping other query values and any #anchor. */
export function buildTaggedUrl(base: string, values: Partial<Values>): { url: string | null; error: string | null } {
  const trimmed = base.trim();
  if (!trimmed) return { url: null, error: null };
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return { url: null, error: "That is not a valid web address." };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { url: null, error: "Use a web address starting with https:// or http://." };
  }
  for (const { key } of PARAMS) {
    const value = values[key]?.trim();
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  return { url: url.toString(), error: null };
}

function tidy(value: string, lowercase: boolean, hyphenate: boolean): string {
  let result = value.trim();
  if (hyphenate) result = result.replace(/\s+/g, "-");
  if (lowercase) result = result.toLowerCase();
  return result;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(HISTORY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(HISTORY_EVENT, callback);
  };
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(HISTORY_KEY);
  } catch {
    return null;
  }
}

function parseHistory(raw: string | null): HistoryEntry[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((entry): entry is HistoryEntry => typeof entry?.url === "string" && typeof entry?.createdAt === "string")
      : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: HistoryEntry[]): boolean {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  } finally {
    window.dispatchEvent(new Event(HISTORY_EVENT));
  }
}

export default function UtmBuilder() {
  const [base, setBase] = React.useState("https://example.com/landing-page");
  const [values, setValues] = React.useState<Values>({ ...EMPTY, utm_source: "newsletter", utm_medium: "email", utm_campaign: "spring-sale" });
  const [lowercase, setLowercase] = React.useState(true);
  const [hyphenate, setHyphenate] = React.useState(true);
  const [storageFailed, setStorageFailed] = React.useState(false);
  const [qr, setQr] = React.useState<{ url: string; png: string } | null>(null);

  const raw = React.useSyncExternalStore(subscribe, readRaw, () => null);
  const history = React.useMemo(() => parseHistory(raw), [raw]);

  const tidied = React.useMemo(
    () => Object.fromEntries(PARAMS.map(({ key }) => [key, tidy(values[key], lowercase, hyphenate)])) as Values,
    [hyphenate, lowercase, values],
  );
  const built = buildTaggedUrl(base, tidied);
  const deferredUrl = React.useDeferredValue(built.url);

  React.useEffect(() => {
    if (!deferredUrl) return;
    let cancelled = false;
    import("qrcode")
      .then(({ default: QRCode }) => QRCode.toDataURL(deferredUrl, { errorCorrectionLevel: "M", margin: 2, width: 1024 }))
      .then((png) => {
        if (!cancelled) setQr({ url: deferredUrl, png });
      })
      .catch(() => {
        if (!cancelled) setQr(null);
      });
    return () => {
      cancelled = true;
    };
  }, [deferredUrl]);

  const warnings: string[] = [];
  const missing = PARAMS.filter((param) => param.required && !tidied[param.key]).map((param) => param.label.toLowerCase());
  if (missing.length > 0) {
    warnings.push(`Add ${missing.join(", ")}. Reports rely on source, medium and campaign; a missing one shows as “(not set)”.`);
  }
  if (!lowercase && PARAMS.some(({ key }) => /[A-Z]/.test(tidied[key]))) {
    warnings.push("Some values contain capital letters. Analytics treats Email and email as different values, splitting your data.");
  }
  if (!hyphenate && PARAMS.some(({ key }) => /\s/.test(tidied[key]))) {
    warnings.push("Some values contain spaces, which appear as + or %20 in the link. Hyphens are easier to read and type.");
  }
  if (/[?&]utm_/i.test(base)) {
    warnings.push("The page address already had UTM tags; the values above replace them.");
  }

  const save = () => {
    if (!built.url) return;
    const entries = [{ url: built.url, createdAt: new Date().toISOString() }, ...history.filter((entry) => entry.url !== built.url)];
    setStorageFailed(!writeHistory(entries.slice(0, HISTORY_LIMIT)));
  };

  const load = (url: string) => {
    try {
      const parsed = new URL(url);
      const next = { ...EMPTY };
      for (const { key } of PARAMS) {
        next[key] = parsed.searchParams.get(key) ?? "";
        parsed.searchParams.delete(key);
      }
      setValues(next);
      setBase(parsed.toString());
    } catch {
      // Saved entries are always valid URLs; nothing to do for a corrupted one.
    }
  };

  const exportCsv = () => {
    const header = ["created", "url", ...PARAMS.map((param) => param.key)];
    const rows = history.map((entry) => {
      const parsed = new URL(entry.url);
      return [entry.createdAt, entry.url, ...PARAMS.map(({ key }) => parsed.searchParams.get(key) ?? "")];
    });
    const csv = [header, ...rows].map((row) => row.map((cell) => escapeCsvValue(cell, DEFAULT_CSV_OPTIONS)).join(",")).join("\r\n");
    downloadText(`${csv}\r\n`, "utm-links.csv", "text/csv;charset=utf-8");
  };

  const downloadQr = async () => {
    if (!qr) return;
    const blob = await (await fetch(qr.png)).blob();
    downloadBlob(blob, "utm-link-qr.png");
  };

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Field label="Page address" htmlFor="utm-base" error={built.error}>
          <Input id="utm-base" value={base} inputMode="url" spellCheck={false} onChange={(event) => setBase(event.target.value)} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PARAMS.map((param) => (
            <Field
              key={param.key}
              label={`${param.label}${param.required ? "" : " (optional)"}`}
              htmlFor={`utm-${param.key}`}
              hint={param.hint}
            >
              <Input
                id={`utm-${param.key}`}
                value={values[param.key]}
                placeholder={param.placeholder}
                spellCheck={false}
                list={param.key === "utm_source" ? "utm-sources" : param.key === "utm_medium" ? "utm-mediums" : undefined}
                onChange={(event) => setValues((previous) => ({ ...previous, [param.key]: event.target.value }))}
              />
            </Field>
          ))}
          <datalist id="utm-sources">
            {SOURCE_PRESETS.map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>
          <datalist id="utm-mediums">
            {MEDIUM_PRESETS.map((value) => (
              <option key={value} value={value} />
            ))}
          </datalist>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Checkbox label="Make values lower-case" checked={lowercase} onChange={(event) => setLowercase(event.target.checked)} />
          <Checkbox label="Replace spaces with hyphens" checked={hyphenate} onChange={(event) => setHyphenate(event.target.checked)} />
        </div>

        {warnings.length > 0 ? (
          <Alert tone="warning" title="Check before you share">
            <ul className="list-disc space-y-0.5 pl-4">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </Alert>
        ) : null}

        {built.url ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="space-y-2" aria-live="polite">
              <p className="text-[0.8125rem] font-medium text-fg">Tagged link</p>
              <p className="rounded-lg border border-accent-soft-border bg-accent-soft px-3.5 py-3 font-mono text-[0.8125rem] break-all text-fg">
                {built.url}
              </p>
              <div className="flex flex-wrap gap-2">
                <CopyButton value={built.url} label="Copy link" />
                <Button type="button" variant="secondary" size="sm" onClick={save}>
                  Save to history
                </Button>
              </div>
              {storageFailed ? (
                <p className="text-xs text-fg">This browser is blocking local storage, so the history cannot be saved.</p>
              ) : null}
            </div>

            {qr && qr.url === built.url ? (
              <figure className="space-y-2">
                {/* A data URL generated in the browser; next/image cannot optimise it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr.png} alt="QR code for the tagged link" className="size-40 rounded border border-border bg-white" />
                <Button type="button" variant="secondary" size="sm" onClick={() => void downloadQr()}>
                  Download QR code
                </Button>
              </figure>
            ) : null}
          </div>
        ) : null}

        <section className="space-y-2" aria-labelledby="utm-history-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="utm-history-heading" className="text-[0.8125rem] font-semibold text-fg">
              Saved links ({history.length})
            </h2>
            <div className="flex gap-1.5">
              <Button type="button" variant="secondary" size="sm" disabled={history.length === 0} onClick={exportCsv}>
                Export CSV
              </Button>
              <Button type="button" variant="ghost" size="sm" disabled={history.length === 0} onClick={() => writeHistory([])}>
                Clear all
              </Button>
            </div>
          </div>
          {history.length === 0 ? (
            <p className="text-xs text-fg-subtle">Links you save are kept in this browser only, never on a server.</p>
          ) : (
            <ul className="space-y-1.5">
              {history.map((entry) => (
                <li key={entry.url} className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-2.5">
                  <span className="min-w-0 flex-1 font-mono text-xs break-all text-fg">{entry.url}</span>
                  <span className="tabular text-xs text-fg-subtle">{new Date(entry.createdAt).toLocaleDateString()}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => load(entry.url)}>
                    Edit
                  </Button>
                  <CopyButton value={entry.url} iconOnly />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete this saved link"
                    onClick={() => writeHistory(history.filter((item) => item.url !== entry.url))}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
