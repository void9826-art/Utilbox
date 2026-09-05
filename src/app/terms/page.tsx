import Link from "next/link";
import type { Metadata } from "next";

import { StaticPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms under which you may use ${siteConfig.name}'s free online tools, including what we promise, what we do not, and where liability ends.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms of Service"
      intro={`The terms on which ${siteConfig.name} is provided. Using the site means you accept them.`}
      updated="2026-09-05"
      breadcrumb={{ name: "Terms of Service", href: "/terms" }}
    >
      <h2>What this site is</h2>
      <p>
        {siteConfig.name} provides a collection of free online utilities. There is no account, no
        subscription and no payment. The service is provided as-is, and you may use it for personal or
        commercial purposes.
      </p>

      <h2>Your responsibilities</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the site for anything unlawful, or to process material you have no right to process;</li>
        <li>
          attempt to disrupt the site, or to access parts of it you have not been given access to;
        </li>
        <li>
          scrape or automate the site at a volume that degrades it for other people, or resell access to
          it as though it were your own service;
        </li>
        <li>
          rely on any output for a decision with legal, financial, medical or safety consequences
          without checking it independently.
        </li>
      </ul>
      <p>
        You are responsible for the files and text you process, and for holding the rights to them.
        Because most tools run entirely in your browser, we never see that material and cannot moderate
        it.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided without warranty of any kind, express or implied, including any implied
        warranty of merchantability or fitness for a particular purpose. We aim for correctness and test
        the calculations, but we do not guarantee that a tool is free of defects, that it will always be
        available, or that its output is suitable for your purpose.
      </p>
      <p>
        <strong>Keep your originals.</strong> File tools create new files rather than modifying yours,
        but you should always retain the original of anything important.
      </p>

      <h2>Not professional advice</h2>
      <p>
        The financial calculators are arithmetic illustrations, not financial advice. Lenders apply their
        own fees, rounding and day-count conventions, and a real quote will differ. The BMI calculator is
        a general screening measure, not a medical assessment. The tax calculator performs percentage
        arithmetic and does not account for thresholds, exemptions or reduced rates. Consult a qualified
        professional for decisions that matter.
      </p>

      <h2>Exchange rates and reference data</h2>
      <p>
        Exchange rates come from published daily reference rates and are approximate. They exclude the
        margin and fees any bank or provider will apply, and must not be relied on for trading or
        accounting.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {siteConfig.legalEntity} is not liable for any indirect
        or consequential loss, loss of data, loss of profit or business interruption arising from your
        use of this site. Nothing in these terms excludes liability that cannot lawfully be excluded.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The site&apos;s design, code and written content belong to {siteConfig.legalEntity}. Anything you
        create with the tools — a merged PDF, a generated invoice, a converted image — belongs entirely
        to you. We claim no rights over it, and no watermark is applied.
      </p>

      <h2>Third-party components</h2>
      <p>
        The site is built on open-source software, including pdf.js, pdf-lib and Tesseract, each used
        under its own licence. Those components carry their own terms and their own absence of warranty.
      </p>

      <h2>Availability and changes</h2>
      <p>
        We may change, suspend or withdraw any part of the site at any time without notice. Tools may be
        added or removed. If these terms change, the date at the top of this page changes with them.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws applicable at the operator&apos;s place of business. Nothing
        here affects your statutory consumer rights.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
        See also our <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>
    </StaticPage>
  );
}
