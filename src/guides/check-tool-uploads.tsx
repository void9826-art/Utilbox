import Link from "next/link";

import { siteConfig } from "@/config/site";

import type { Guide } from "./index";

function Body() {
  return (
    <>
      <p>
        Plenty of free tools promise that your files never leave your computer. Some of them mean it;
        others upload the file, process it on a server and delete it later. You do not have to take
        anyone’s word for it. Two checks, each a couple of minutes, show what a page actually sends —
        and they work on any site, this one included.
      </p>

      <h2>Check 1: watch the network</h2>
      <p>
        Every browser can show the requests a page makes. If a file is uploaded, it appears there as a
        request roughly the size of the file.
      </p>
      <ol>
        <li>
          Open the tool, then open the developer tools: <kbd>F12</kbd> on Windows and Linux, or{" "}
          <kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd> on a Mac. Choose the <strong>Network</strong> tab.
        </li>
        <li>Press the clear button (a circle with a line through it) so the list is empty.</li>
        <li>Add your file and run the tool as normal.</li>
        <li>
          Look at the new requests. Sort by <strong>Size</strong>, and check any with the method{" "}
          <strong>POST</strong> or <strong>PUT</strong>.
        </li>
      </ol>
      <p>
        A tool that works in the browser shows nothing the size of your file going out. You may still
        see small requests: analytics pings, adverts, or the page fetching code it needs. What matters
        is the direction and the size. A 4 MB PDF being sent somewhere shows up as a request of about 4
        MB, usually a POST, and is hard to miss.
      </p>

      <h2>Check 2: turn off the connection</h2>
      <p>
        The simpler test needs no developer tools. If a tool really runs on your device, it does not
        need the internet once the page has loaded.
      </p>
      <ol>
        <li>Open the tool and wait a few seconds for the page to finish loading.</li>
        <li>Switch off Wi-Fi, or put the device in flight mode.</li>
        <li>Add your file and run the tool.</li>
      </ol>
      <p>
        If it still produces a result, the work happened on your device. If it fails with a network
        error, it needed a server — which is fine for some jobs, but it means your file, or something
        about it, was going to be sent.
      </p>
      <p>
        On this site, most tools pass this test once the page has loaded, because the page saves what
        it needs as soon as you open it. Try it with{" "}
        <Link href="/pdf/merge-pdf">Merge PDF</Link>,{" "}
        <Link href="/image/compress-image">Compress Image</Link> or the{" "}
        <Link href="/text/word-counter">Word Counter</Link>.
      </p>

      <h2>When a tool needs the internet, and why that can be fine</h2>
      <p>
        Some jobs cannot be done offline, and an honest tool says so. On {siteConfig.name} these are
        the exceptions:
      </p>
      <ul>
        <li>
          <strong>Live lookups.</strong> The <Link href="/developer/ssl-expiry-checker">SSL checker</Link>
          , the <Link href="/developer/og-preview">Open Graph preview</Link> and the optional mail-server
          check in the <Link href="/developer/email-syntax-checker">email validator</Link> send only a
          domain name or address to this site’s server, because a browser is not allowed to make those
          checks itself. No file is involved.
        </li>
        <li>
          <strong>Reference data.</strong> The{" "}
          <Link href="/converters/currency-converter">currency converter</Link> downloads the day’s
          exchange rates; the amount you type stays on your device.
        </li>
        <li>
          <strong>Language models.</strong> <Link href="/image/image-to-text">Image to Text</Link> and{" "}
          <Link href="/text/voice-to-text">Voice to Text</Link> download a recognition model the first
          time. The model comes to you; your image or recording does not go anywhere.
        </li>
      </ul>
      <p>
        The difference that matters is what travels and in which direction. Downloading code or a model
        is not the same as uploading your document.
      </p>

      <h2>What the checks cannot tell you</h2>
      <ul>
        <li>
          They show what happened during your test, not what a site might do later. Repeat them if a
          tool changes.
        </li>
        <li>
          A browser extension can read pages and files independently of the site. Test sensitive work
          in a window with extensions disabled, or in a private window.
        </li>
        <li>
          Passing both checks means the file was not uploaded. It does not say anything about how well
          the tool did the job, so still check the result.
        </li>
      </ul>

      <h2>A quick checklist</h2>
      <ul>
        <li>Network tab open and cleared before adding the file.</li>
        <li>No request close to your file’s size, and no unexplained POST.</li>
        <li>Tool still works with Wi-Fi off after the page has loaded.</li>
        <li>Any network use explained by the tool’s own page.</li>
      </ul>
    </>
  );
}

export const checkToolUploads: Guide = {
  slug: "check-a-tool-does-not-upload-files",
  topic: "Web & developer",
  title: "How to check an online tool really doesn’t upload your files",
  seoTitle: "How to Check an Online Tool Doesn't Upload Files",
  description:
    "Two quick tests show whether a web tool uploads your files: watch the browser's Network tab, and run the tool with Wi-Fi off. Works on any site.",
  published: "2026-10-19",
  updated: "2026-10-19",
  tools: ["merge-pdf", "compress-image", "word-counter"],
  Body,
};
