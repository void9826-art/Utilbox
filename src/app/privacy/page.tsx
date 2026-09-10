import Link from "next/link";
import type { Metadata } from "next";

import { StaticPage } from "@/components/layout/legal-page";
import { adsConfig, analyticsConfig, siteConfig } from "@/config/site";
import { TOOLS } from "@/config/tools";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your data. Most tools run entirely in your browser, so files and text are never uploaded.`,
  path: "/privacy",
});

const UPDATED = "2026-09-10";

export default function PrivacyPage() {
  const localTools = TOOLS.filter((tool) => tool.processing === "client").length;
  const lookupTools = TOOLS.filter((tool) => tool.processing === "client-with-lookup");
  const serverTools = TOOLS.filter((tool) => tool.processing === "server-lookup");

  return (
    <StaticPage
      title="Privacy Policy"
      intro="What happens to your data when you use these tools — written plainly, because the answer is short."
      updated={UPDATED}
      breadcrumb={{ name: "Privacy Policy", href: "/privacy" }}
    >
      <h2>The short version</h2>
      <p>
        {localTools} of the {TOOLS.length} tools on this site process everything inside your own
        browser. The files you open, the text you paste and the numbers you type are never transmitted
        to us or to anyone else. We could not read them if we wanted to, because they never arrive.
      </p>

      <h2>How the tools work</h2>
      <p>
        When you drop a PDF onto the merge tool, your browser reads the file into memory, rearranges it
        there, and hands the result straight back to you as a download. No upload takes place. You can
        verify this yourself: open your browser&apos;s developer tools, switch to the Network tab, and
        watch that no request carries your document. Most of these tools also keep working with your
        network disconnected.
      </p>
      <p>
        The same applies to image tools, text tools, developer tools, calculators and generators. Some
        of them download a library on first use — the OCR language model, for example, the HEIC
        decoder, or the speech-recognition model used by the voice-to-text tool. Those are the same
        public files for every visitor and contain nothing about you. Some of them are served from
        public code CDNs or from Hugging Face rather than from us, so those hosts see your IP
        address and nothing else, in the same way any website you visit does. Nothing you typed,
        chose or opened is part of that request.
      </p>

      <h2>The exceptions</h2>
      <p>
        {lookupTools.length + serverTools.length === 0
          ? "Every tool currently runs entirely in your browser."
          : "These tools contact a server, and it is worth being precise about what they send:"}
      </p>
      {lookupTools.length + serverTools.length > 0 ? (
        <ul>
          {lookupTools.map((tool) => (
            <li key={tool.slug}>
              <Link href={`/${tool.category}/${tool.slug}`}>{tool.name}</Link> — fetches published
              reference exchange rates. The request contains only a three-letter currency code such as{" "}
              <code>USD</code>. The amount you type is converted in your browser and is never sent.
            </li>
          ))}
          {serverTools.map((tool) => (
            <li key={tool.slug}>
              <Link href={`/${tool.category}/${tool.slug}`}>{tool.name}</Link> — sends the domain name
              or web address you type, and nothing else, to this site&apos;s own server. The server makes
              the connection or lookup a browser is not permitted to make and returns the result. We do
              not save what was checked; the address is sent in the request body, so standard hosting
              logs record that a check ran but not what it was for. Where the check fetches another
              website, that website sees our server&apos;s address, not yours.
            </li>
          ))}
        </ul>
      ) : null}

      <h2>What we do collect</h2>
      <p>
        Like any website, our hosting provider records standard server logs when your browser requests a
        page: the page address, a timestamp, your IP address, and your browser&apos;s user agent. These
        are used to keep the service running and to investigate faults.
      </p>
      <p>
        {analyticsConfig.enabled
          ? "We also use Google Analytics to understand which tools are used, with IP anonymisation enabled. It records page views and coarse events such as “a tool was run” or “a download happened”. It never receives your file names, file contents, extracted text, or anything you typed into a tool."
          : "Analytics is not currently enabled on this site. If that changes, this policy will be updated first, and any analytics will record only page views and coarse events — never your file names, file contents, or anything you typed into a tool."}
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        We set no tracking cookies. Your light or dark theme preference is kept in your browser&apos;s
        local storage, which stays on your device and is never sent anywhere. See the{" "}
        <Link href="/cookies">Cookie Policy</Link> for the full detail.
      </p>

      <h2>Advertising</h2>
      <p>
        {adsConfig.enabled
          ? "This site displays advertisements through Google AdSense. Google may use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalised advertising through Google's Ads Settings. Advertising is never placed inside a tool's controls, and no data you enter into a tool is shared with advertisers."
          : "Advertising is not currently enabled on this site. If it is added, it will be Google AdSense, this policy will be updated first, and ads will never be placed inside a tool's controls or given access to anything you enter into a tool."}
      </p>

      <h2>Data we do not have</h2>
      <p>
        There are no user accounts, so we hold no names, email addresses or passwords. There is no
        upload storage, so we hold no documents or images. Nothing you process here is retained after
        you close the tab.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the UK GDPR, the EU GDPR and similar laws you have rights of access, rectification and
        erasure over personal data held about you. In practice we hold almost none — server logs and, if
        enabled, anonymised analytics. To make a request, or to ask anything about this policy, contact{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>

      <h2>Children</h2>
      <p>
        This site is not directed at children under 13 and we do not knowingly collect personal
        information from them.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, the date at the top of this page changes with it. Material changes will
        be noted here rather than made quietly.
      </p>

      <h2>Who operates this site</h2>
      <p>
        This site is operated by {siteConfig.legalEntity}.
        {siteConfig.postalAddress ? ` Registered address: ${siteConfig.postalAddress}.` : ""} Contact:{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </StaticPage>
  );
}
