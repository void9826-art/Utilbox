import Link from "next/link";
import type { Metadata } from "next";

import { StaticPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/config/site";
import { TOOLS, TOOLS_BY_CATEGORY, TOOL_COUNT } from "@/config/tools";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `About ${siteConfig.name}`,
  description: `Why ${siteConfig.name} exists, how the tools work, and what happens to your files.`,
  path: "/about",
});

export default function AboutPage() {
  const localTools = TOOLS.filter((tool) => tool.processing === "client").length;

  return (
    <StaticPage
      title={`About ${siteConfig.name}`}
      intro="One place for the small digital jobs that come up every day."
      breadcrumb={{ name: "About", href: "/about" }}
    >
      <h2>Why this exists</h2>
      <p>
        A surprising amount of everyday work consists of tasks too small to justify installing anything:
        removing two pages from a PDF, shrinking a photo that is a megabyte too large to attach, working
        out what a loan repayment would actually be, checking why a JSON file will not parse. Each one
        is a two-minute job that somehow takes fifteen.
      </p>
      <p>
        The existing answer is a scattering of single-purpose sites, most of which want an email
        address, apply a watermark, cap you at three files a day, or upload your document to a server
        you know nothing about. {siteConfig.name} collects {TOOL_COUNT} of those jobs into one place,
        with one consistent interface, and no such conditions.
      </p>

      <h2>How the tools work</h2>
      <p>
        {localTools} of the {TOOL_COUNT} tools run entirely inside your browser. Your file is read into
        memory on your own machine, changed there, and handed straight back to you as a download.
        Nothing is uploaded.
      </p>
      <p>
        That is a real architectural decision rather than a slogan, and it has consequences you can
        feel: there is no queue, because there is no server to queue for. There is no file size cap
        imposed from outside — the limit is your device&apos;s memory. There is nothing left on a disk
        somewhere after you close the tab. And you can verify all of it: open your browser&apos;s
        network inspector and watch that no request carries your document.
      </p>
      <p>
        The one exception is the currency converter, which fetches published daily reference rates. Even
        there, the request carries only a three-letter currency code — the amount you typed is converted
        locally. Every tool page states plainly which category it falls into.
      </p>

      <h2>What we try to get right</h2>
      <ul>
        <li>
          <strong>Show the working.</strong> Calculators display the formula they used and the
          substituted numbers. Converters name the exact factors. You should be able to check a result
          rather than trust it.
        </li>
        <li>
          <strong>Say what does not survive.</strong> Converting a PDF to Word gives you the text, not
          the layout. Compressing a PDF removes its text layer. Those trade-offs are stated on the page,
          not discovered afterwards.
        </li>
        <li>
          <strong>Use exact values.</strong> An inch is exactly 25.4 mm and a pound exactly 0.45359237
          kg — the converters use the defined values, not rounded approximations, so conversions
          round-trip cleanly.
        </li>
        <li>
          <strong>Get the money arithmetic right.</strong> Amortisation schedules are built from whole
          cents, so a 30-year mortgage table still adds up to the loan at the end instead of drifting.
        </li>
        <li>
          <strong>Work without a mouse.</strong> Every control is reachable by keyboard, focus is always
          visible, and the site is built to WCAG 2.2 AA where practical.
        </li>
      </ul>

      <h2>What is here</h2>
      <ul>
        {TOOLS_BY_CATEGORY.map(({ category, tools }) => (
          <li key={category.id}>
            <Link href={`/${category.id}`}>{category.name}</Link> — {tools.length} tools.{" "}
            {category.description}
          </li>
        ))}
      </ul>

      <h2>How it is paid for</h2>
      <p>
        The site is free and has no paid tier. It is supported by advertising, placed between sections
        of a page rather than inside the tools themselves. Ads never sit beside a download button where
        they could be mistaken for one, and they have no access to anything you enter into a tool. If an
        advert fails to load, every tool still works exactly as before.
      </p>

      <h2>Built with</h2>
      <p>
        Next.js and TypeScript, with the heavy lifting done by open-source libraries: pdf.js for reading
        PDFs, pdf-lib for writing them, Tesseract for optical character recognition, and libheif for
        Apple&apos;s HEIC format. Each loads only on the tool page that needs it, so opening the word
        counter does not download a PDF engine.
      </p>

      <h2>Get in touch</h2>
      <p>
        Found a bug, or got a result you think is wrong? That is worth reporting — email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> or use the{" "}
        <Link href="/contact">contact page</Link>. Suggestions for tools that should exist are welcome
        too.
      </p>
    </StaticPage>
  );
}
