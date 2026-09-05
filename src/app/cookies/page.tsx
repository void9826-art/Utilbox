import Link from "next/link";
import type { Metadata } from "next";

import { StaticPage } from "@/components/layout/legal-page";
import { adsConfig, analyticsConfig, siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: `What ${siteConfig.name} stores in your browser, and why. No tracking cookies are set.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <StaticPage
      title="Cookie Policy"
      intro="What this site stores in your browser, and what it is for."
      updated="2026-09-05"
      breadcrumb={{ name: "Cookie Policy", href: "/cookies" }}
    >
      <h2>Cookies we set</h2>
      <p>
        None. {siteConfig.name} sets no cookies of its own — not for sessions, not for preferences, not
        for tracking. There is no account system, so there is nothing to keep you signed in to.
      </p>

      <h2>What we do store</h2>
      <p>
        One item, in your browser&apos;s local storage rather than a cookie:
      </p>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Purpose</th>
            <th>Where it lives</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>utilbox-theme</code>
            </td>
            <td>Remembers whether you chose light, dark or system appearance.</td>
            <td>Your device only. It is never sent in a request.</td>
          </tr>
        </tbody>
      </table>
      <p>
        Local storage differs from a cookie in an important way: cookies are attached to every request
        your browser makes to the server, while local storage stays on your machine. Your theme choice
        therefore never reaches us.
      </p>
      <p>
        Clearing your browser&apos;s site data removes it. The site then falls back to following your
        operating system&apos;s appearance setting.
      </p>

      <h2>Third-party cookies</h2>
      <p>
        {analyticsConfig.enabled
          ? "Google Analytics is enabled and sets its own cookies to measure page views. IP anonymisation is switched on. It never receives file names, file contents or anything you type into a tool."
          : "Analytics is not currently enabled, so no analytics cookies are set."}
      </p>
      <p>
        {adsConfig.enabled
          ? "Google AdSense is enabled and may set cookies to serve and measure advertising. You can control personalised advertising through Google's Ads Settings, and browser-level cookie controls apply as normal."
          : "Advertising is not currently enabled, so no advertising cookies are set. If AdSense is added, this page will be updated first."}
      </p>

      <h2>Libraries loaded on demand</h2>
      <p>
        Some tools download a supporting library the first time you use them — the OCR language model,
        the HEIC decoder, the PDF engine. These are served from this site and cached by your browser
        exactly like an image would be. They set no cookies and contain nothing specific to you.
      </p>

      <h2>Managing what is stored</h2>
      <p>
        Every browser lets you view and clear cookies and site data, usually under Settings → Privacy.
        Blocking storage for this site has one visible effect: your theme choice will not be remembered
        between visits. Every tool continues to work.
      </p>

      <h2>More detail</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> covers how the tools handle your files and text.
        Questions: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </StaticPage>
  );
}
