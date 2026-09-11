"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

import { CopyButton, ErrorMessage, ProgressIndicator } from "@/components/tool/feedback";
import { ToolFrame } from "@/components/tool/tool-frame";
import { Button } from "@/components/ui/button";
import { Field, Input, Segmented, Textarea } from "@/components/ui/field";
import { DataRow } from "@/components/ui/surfaces";

import { SelectField } from "../calculators/_shared";

type Mode = "check" | "write";

interface Tags {
  title: string | null;
  description: string | null;
  canonical: string | null;
  og: {
    title: string | null;
    description: string | null;
    image: string | null;
    imageAlt: string | null;
    url: string | null;
    type: string | null;
    siteName: string | null;
  };
  twitter: { card: string | null; title: string | null; description: string | null; image: string | null; site: string | null };
}

interface Report extends Tags {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  contentType: string;
  redirects: string[];
  isHtml: boolean;
  meta: Array<{ key: string; value: string }>;
}

interface Card {
  title: string;
  description: string;
  image: string | null;
  domain: string;
  siteName: string;
  large: boolean;
}

interface Finding {
  level: "error" | "warning" | "ok";
  message: string;
}

function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function hostOf(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function cardFrom(tags: Tags, pageUrl: string): Card {
  return {
    title: tags.og.title ?? tags.twitter.title ?? tags.title ?? pageUrl,
    description: tags.og.description ?? tags.twitter.description ?? tags.description ?? "",
    image: safeHttpUrl(tags.og.image ?? tags.twitter.image),
    domain: hostOf(tags.og.url ?? pageUrl),
    siteName: tags.og.siteName ?? hostOf(pageUrl),
    large: (tags.twitter.card ?? "summary_large_image") === "summary_large_image",
  };
}

function audit(tags: Tags, status: number | null, image: { width: number; height: number } | null | "failed"): Finding[] {
  const findings: Finding[] = [];
  if (status !== null && status >= 400) {
    findings.push({ level: "error", message: `The page returned HTTP ${status}. Platforms will not read tags from an error page.` });
  }
  if (!tags.og.title) findings.push({ level: "error", message: "og:title is missing. Platforms fall back to the page <title>." });
  else if (tags.og.title.length > 70) {
    findings.push({ level: "warning", message: `og:title is ${tags.og.title.length} characters. Most platforms cut titles off after roughly 60–70.` });
  }
  if (!tags.og.description) findings.push({ level: "warning", message: "og:description is missing." });
  else if (tags.og.description.length > 200) {
    findings.push({ level: "warning", message: `og:description is ${tags.og.description.length} characters; long descriptions are truncated.` });
  }
  if (!tags.og.image) {
    findings.push({ level: "error", message: "og:image is missing, so most platforms show a text-only link with no picture." });
  } else {
    if (tags.og.image.startsWith("http:")) {
      findings.push({ level: "warning", message: "og:image uses http://. Some platforms only load preview images over https." });
    }
    if (image === "failed") {
      findings.push({ level: "error", message: "The og:image could not be loaded in your browser. Check the address and that the server allows it." });
    } else if (image) {
      if (image.width < 200 || image.height < 200) {
        findings.push({ level: "error", message: `The image is ${image.width} × ${image.height}. Facebook requires at least 200 × 200.` });
      } else if (image.width < 1200 || image.height < 630) {
        findings.push({ level: "warning", message: `The image is ${image.width} × ${image.height}. 1200 × 630 is recommended for sharp large previews.` });
      } else {
        findings.push({ level: "ok", message: `The image is ${image.width} × ${image.height} — large enough for full-width previews.` });
      }
    }
    if (!tags.og.imageAlt) findings.push({ level: "warning", message: "og:image:alt is missing, so screen-reader users get no description of the image." });
  }
  if (!tags.twitter.card) {
    findings.push({ level: "warning", message: "twitter:card is missing. X decides the card size from it; set summary_large_image for a large picture." });
  }
  if (!tags.og.url) findings.push({ level: "warning", message: "og:url is missing, so shares keep whatever address was pasted, tracking parameters included." });
  if (findings.every((finding) => finding.level === "ok")) {
    findings.push({ level: "ok", message: "The core Open Graph and Twitter tags are all present." });
  }
  return findings;
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function PreviewImage({ src, className }: { src: string | null; className: string }) {
  if (!src) {
    return <div className={`${className} flex items-center justify-center bg-bg-muted text-xs text-fg-subtle`}>No image</div>;
  }
  // A third-party image address; next/image cannot proxy arbitrary hosts.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" referrerPolicy="no-referrer" className={`${className} bg-bg-muted object-cover`} />;
}

function Previews({ card }: { card: Card }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <figure className="space-y-1.5">
        <figcaption className="text-xs font-medium text-fg-muted">Facebook and LinkedIn style</figcaption>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <PreviewImage src={card.image} className="aspect-[1.91/1] w-full" />
          <div className="space-y-0.5 border-t border-border bg-surface-sunken px-3 py-2">
            <p className="text-[0.6875rem] tracking-wide text-fg-muted uppercase">{card.domain}</p>
            <p className="line-clamp-2 text-sm font-semibold text-fg">{card.title}</p>
            <p className="line-clamp-1 text-xs text-fg-muted">{card.description}</p>
          </div>
        </div>
      </figure>

      <figure className="space-y-1.5">
        <figcaption className="text-xs font-medium text-fg-muted">
          X style ({card.large ? "large image card" : "summary card"})
        </figcaption>
        {card.large ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="relative">
              <PreviewImage src={card.image} className="aspect-[1.91/1] w-full" />
              <span className="absolute bottom-2 left-2 max-w-[85%] truncate rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                {card.title}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex overflow-hidden rounded-2xl border border-border bg-surface">
            <PreviewImage src={card.image} className="size-28 shrink-0" />
            <div className="min-w-0 space-y-0.5 border-l border-border px-3 py-2">
              <p className="text-xs text-fg-muted">{card.domain}</p>
              <p className="line-clamp-2 text-sm text-fg">{card.title}</p>
              <p className="line-clamp-2 text-xs text-fg-muted">{card.description}</p>
            </div>
          </div>
        )}
        {card.large ? <p className="text-xs text-fg-muted">From {card.domain}</p> : null}
      </figure>

      <figure className="space-y-1.5 lg:col-span-2">
        <figcaption className="text-xs font-medium text-fg-muted">Chat app style (Slack, Discord)</figcaption>
        <div className="max-w-xl space-y-1 border-l-4 border-border-strong py-1 pl-3">
          <p className="text-xs font-semibold text-fg-muted">{card.siteName}</p>
          <p className="text-sm font-semibold text-fg underline underline-offset-2">{card.title}</p>
          <p className="line-clamp-3 text-sm text-fg-muted">{card.description}</p>
          {card.image ? <PreviewImage src={card.image} className="mt-1 max-h-48 w-full max-w-sm rounded" /> : null}
        </div>
      </figure>
      <p className="text-xs text-fg-subtle lg:col-span-2">
        Approximate layouts. Each platform crops, truncates and caches previews in its own way.
      </p>
    </div>
  );
}

function FindingList({ findings }: { findings: Finding[] }) {
  return (
    <ul className="space-y-1.5">
      {findings.map((finding) => {
        const Icon = finding.level === "ok" ? CheckCircle2 : finding.level === "warning" ? AlertTriangle : XCircle;
        return (
          <li key={finding.message} className="flex items-start gap-2 text-[0.8125rem] text-fg">
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold">
                {finding.level === "ok" ? "Good: " : finding.level === "warning" ? "Warning: " : "Problem: "}
              </strong>
              {finding.message}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function useImageSize(src: string | null) {
  const [size, setSize] = React.useState<{ src: string; value: { width: number; height: number } | "failed" } | null>(null);
  React.useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const image = new Image();
    image.referrerPolicy = "no-referrer";
    image.onload = () => {
      if (!cancelled) setSize({ src, value: { width: image.naturalWidth, height: image.naturalHeight } });
    };
    image.onerror = () => {
      if (!cancelled) setSize({ src, value: "failed" });
    };
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);
  return size && size.src === src ? size.value : null;
}

const EMPTY_TAGS = { title: "", description: "", url: "", image: "", imageAlt: "", siteName: "", type: "website", card: "summary_large_image", site: "" };

export default function OgPreview() {
  const [mode, setMode] = React.useState<Mode>("check");
  const [url, setUrl] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [report, setReport] = React.useState<Report | null>(null);
  const [draft, setDraft] = React.useState(EMPTY_TAGS);

  const check = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!url.trim()) {
      setError("Enter the address of a page to preview.");
      return;
    }
    setBusy(true);
    setError(null);
    setReport(null);
    try {
      const response = await fetch("/api/og", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await response.json().catch(() => null)) as (Report & { error?: string }) | null;
      if (!response.ok || !data || data.error) throw new Error(data?.error ?? "The page could not be previewed.");
      if (!data.isHtml) throw new Error(`That address is not a web page (it returned ${data.contentType || "no content type"}).`);
      setReport(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The page could not be previewed.");
    } finally {
      setBusy(false);
    }
  };

  const draftTags: Tags = {
    title: draft.title || null,
    description: draft.description || null,
    canonical: null,
    og: {
      title: draft.title || null,
      description: draft.description || null,
      image: safeHttpUrl(draft.image),
      imageAlt: draft.imageAlt || null,
      url: safeHttpUrl(draft.url),
      type: draft.type,
      siteName: draft.siteName || null,
    },
    twitter: { card: draft.card, title: null, description: null, image: null, site: draft.site || null },
  };

  const activeTags = mode === "check" ? report : draftTags;
  const activeUrl = mode === "check" ? (report?.finalUrl ?? "") : draft.url || "https://example.com";
  const imageSize = useImageSize(activeTags ? safeHttpUrl(activeTags.og.image) : null);
  const card = activeTags ? cardFrom(activeTags, activeUrl) : null;

  const snippet = [
    draft.title && `<meta property="og:title" content="${escapeAttribute(draft.title)}">`,
    draft.description && `<meta property="og:description" content="${escapeAttribute(draft.description)}">`,
    draft.url && `<meta property="og:url" content="${escapeAttribute(draft.url)}">`,
    draft.image && `<meta property="og:image" content="${escapeAttribute(draft.image)}">`,
    draft.imageAlt && `<meta property="og:image:alt" content="${escapeAttribute(draft.imageAlt)}">`,
    draft.siteName && `<meta property="og:site_name" content="${escapeAttribute(draft.siteName)}">`,
    `<meta property="og:type" content="${escapeAttribute(draft.type)}">`,
    `<meta name="twitter:card" content="${escapeAttribute(draft.card)}">`,
    draft.site && `<meta name="twitter:site" content="${escapeAttribute(draft.site)}">`,
    draft.description && `<meta name="description" content="${escapeAttribute(draft.description)}">`,
  ]
    .filter(Boolean)
    .join("\n");

  const setField = (key: keyof typeof EMPTY_TAGS, value: string) => setDraft((previous) => ({ ...previous, [key]: value }));

  return (
    <ToolFrame>
      <div className="space-y-5">
        <Segmented
          name="og-mode"
          ariaLabel="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "check", label: "Check a page" },
            { value: "write", label: "Write tags" },
          ]}
          className="sm:max-w-sm"
        />

        {mode === "check" ? (
          <form onSubmit={(event) => void check(event)} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <Field label="Page address" htmlFor="og-url" hint="The address is fetched by this site's server; nothing is stored.">
              <Input
                id="og-url"
                value={url}
                placeholder="https://example.com/blog/post"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => setUrl(event.target.value)}
              />
            </Field>
            <Button type="submit" loading={busy}>
              Preview
            </Button>
          </form>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" htmlFor="og-draft-title" hint={`${draft.title.length} characters`}>
              <Input id="og-draft-title" value={draft.title} onChange={(event) => setField("title", event.target.value)} />
            </Field>
            <Field label="Site name" htmlFor="og-draft-site-name">
              <Input id="og-draft-site-name" value={draft.siteName} onChange={(event) => setField("siteName", event.target.value)} />
            </Field>
            <Field label="Description" htmlFor="og-draft-description" hint={`${draft.description.length} characters`} className="sm:col-span-2">
              <Textarea
                id="og-draft-description"
                rows={2}
                value={draft.description}
                onChange={(event) => setField("description", event.target.value)}
                className="min-h-0"
              />
            </Field>
            <Field label="Page URL" htmlFor="og-draft-url">
              <Input id="og-draft-url" value={draft.url} placeholder="https://" onChange={(event) => setField("url", event.target.value)} />
            </Field>
            <Field label="Image URL" htmlFor="og-draft-image" hint="1200 × 630 pixels is the safe size.">
              <Input id="og-draft-image" value={draft.image} placeholder="https://" onChange={(event) => setField("image", event.target.value)} />
            </Field>
            <Field label="Image description (alt text)" htmlFor="og-draft-alt">
              <Input id="og-draft-alt" value={draft.imageAlt} onChange={(event) => setField("imageAlt", event.target.value)} />
            </Field>
            <Field label="X account (optional)" htmlFor="og-draft-handle">
              <Input id="og-draft-handle" value={draft.site} placeholder="@yourbrand" onChange={(event) => setField("site", event.target.value)} />
            </Field>
            <SelectField label="Content type" id="og-draft-type" value={draft.type} onChange={(value) => setField("type", value)}>
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="product">product</option>
              <option value="profile">profile</option>
            </SelectField>
            <SelectField label="X card size" id="og-draft-card" value={draft.card} onChange={(value) => setField("card", value)}>
              <option value="summary_large_image">Large image</option>
              <option value="summary">Small summary</option>
            </SelectField>
          </div>
        )}

        {busy ? <ProgressIndicator label="Fetching the page…" /> : null}
        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {mode === "check" && report ? (
          <p className="text-[0.8125rem] text-fg-muted">
            Read <span className="font-mono break-all text-fg">{report.finalUrl}</span> (HTTP {report.status}
            {report.redirects.length > 0 ? `, after ${report.redirects.length} redirect${report.redirects.length === 1 ? "" : "s"}` : ""}).
          </p>
        ) : null}

        {activeTags && card && (mode === "write" || report) ? (
          <div className="space-y-5" aria-live="polite">
            <FindingList findings={audit(activeTags, mode === "check" ? (report?.status ?? null) : null, imageSize)} />
            <Previews card={card} />

            {mode === "write" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="og-snippet" className="text-[0.8125rem] font-medium text-fg">
                    Tags for your page&apos;s &lt;head&gt;
                  </label>
                  <CopyButton value={snippet} />
                </div>
                <Textarea id="og-snippet" readOnly rows={10} value={snippet} className="bg-surface-sunken font-mono text-[0.75rem]" />
              </div>
            ) : report && report.meta.length > 0 ? (
              <details className="rounded-lg border border-border bg-surface-sunken">
                <summary className="cursor-pointer px-3.5 py-2.5 text-[0.8125rem] font-medium text-fg">
                  All {report.meta.length} meta tags found
                </summary>
                <dl className="px-3.5 pb-3">
                  {report.meta.map((entry, index) => (
                    <DataRow key={`${entry.key}-${index}`} label={entry.key} value={<span className="break-all">{entry.value}</span>} />
                  ))}
                </dl>
              </details>
            ) : null}
          </div>
        ) : null}
      </div>
    </ToolFrame>
  );
}
