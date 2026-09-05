import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, Lightbulb, Mail, Scale } from "lucide-react";

import { StaticPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `How to reach ${siteConfig.name} about a bug, a wrong result, a tool suggestion or a legal question.`,
  path: "/contact",
});

const REASONS = [
  {
    icon: AlertTriangle,
    title: "Something is broken",
    body: "A tool fails, a download does not start, or a page looks wrong. Tell us which tool, which browser, and what you did — that is usually enough to reproduce it.",
    subject: "Bug report",
  },
  {
    icon: Scale,
    title: "A result looks wrong",
    body: "This is the most useful kind of message we get. Include the inputs you used and the answer you expected, and we will check the arithmetic.",
    subject: "Incorrect result",
  },
  {
    icon: Lightbulb,
    title: "A tool should exist",
    body: "Tell us what you were trying to do and what you ended up doing instead. Suggestions grounded in a real task are the ones that get built.",
    subject: "Tool suggestion",
  },
  {
    icon: Mail,
    title: "Privacy, legal or press",
    body: "Data requests, licensing questions and anything else that needs a considered answer.",
    subject: "General enquiry",
  },
];

export default function ContactPage() {
  return (
    <StaticPage
      title="Contact"
      intro="There is no contact form — email reaches a person faster, and it means we are not collecting your details through a database we would rather not keep."
      breadcrumb={{ name: "Contact", href: "/contact" }}
    >
      <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
        {REASONS.map((reason) => (
          <a
            key={reason.title}
            href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(reason.subject)}`}
            className="group rounded-[var(--radius-card)] border border-border bg-surface p-5 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-raised"
          >
            <span className="flex size-9 items-center justify-center rounded-lg border border-accent-soft-border bg-accent-soft text-accent-text">
              <reason.icon className="size-[1.125rem]" aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-[0.9375rem] font-semibold text-fg">{reason.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{reason.body}</p>
            <span className="mt-3 inline-block text-[0.8125rem] font-medium text-accent-text group-hover:underline underline-offset-2">
              Email us →
            </span>
          </a>
        ))}
      </div>

      <h2>Email</h2>
      <p>
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
      <p>
        We read everything. We cannot promise a reply to every message, but bug reports and reports of
        wrong results always get one.
      </p>

      <h2>What not to send</h2>
      <p>
        Please do not attach the file you were working on. The tools run in your browser and we never
        receive your documents — sending one by email would put it somewhere it does not need to be. A
        description of the problem, or a screenshot with anything sensitive removed, is more useful and
        keeps your data yours.
      </p>

      <h2>Before you write</h2>
      <ul>
        <li>
          Each tool page has a <strong>How it works</strong> section and an FAQ that covers the common
          surprises — particularly what a conversion does and does not preserve.
        </li>
        <li>
          The <Link href="/privacy">Privacy Policy</Link> answers most questions about data handling.
        </li>
        <li>
          A tool that will not open your file is often hitting a password-protected or damaged document;
          the error message on the page usually says which.
        </li>
      </ul>

      <h2>Who operates this site</h2>
      <p>
        {siteConfig.legalEntity}.
        {siteConfig.postalAddress ? ` Registered address: ${siteConfig.postalAddress}.` : ""}
      </p>
    </StaticPage>
  );
}
