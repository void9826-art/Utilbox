"use client";

import * as React from "react";
import Link from "next/link";
import Script from "next/script";

import { Button } from "@/components/ui/button";

type Choice = "granted" | "denied";

const STORAGE_KEY = "utilbox-consent";
const OPEN_EVENT = "utilbox:cookie-settings";

function readChoice(): Choice | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

function saveChoice(choice: Choice): void {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Private browsing can block storage; the choice still applies to this page view.
  }
}

/** Expires the _ga and _ga_<id> cookies left behind by an earlier "Accept". */
function clearAnalyticsCookies(): void {
  const host = window.location.hostname;
  const domains = ["", `; domain=${host}`, `; domain=.${host.replace(/^www\./, "")}`];
  for (const entry of document.cookie.split(";")) {
    const name = entry.split("=")[0]?.trim() ?? "";
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

/**
 * Asks before Google Analytics runs. gtag.js is not requested at all until the
 * visitor accepts, so a rejection sends nothing to Google. Consent mode starts
 * at denied and is only raised by that click.
 */
export function CookieConsent({ measurementId }: { measurementId: string }) {
  const [choice, setChoice] = React.useState<Choice | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const stored = readChoice();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage does not exist on the server, so the saved choice can only be read after mount
    setChoice(stored);
    setOpen(stored === null);
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  const decide = (next: Choice) => {
    saveChoice(next);
    setOpen(false);
    if (choice === "granted" && next === "denied") {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      clearAnalyticsCookies();
      // gtag.js cannot be unloaded from a running page, so start a clean one.
      window.location.reload();
      return;
    }
    setChoice(next);
  };

  return (
    <>
      {choice === "granted" ? (
        <>
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied'});gtag('consent','update',{analytics_storage:'granted'});gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
          </Script>
          <Script
            id="ga-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          />
        </>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-text"
          className="fixed inset-x-0 bottom-0 z-40 p-4 print-hidden sm:p-6"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-overlay)] sm:flex-row sm:items-center sm:gap-6 sm:p-5">
            <div className="text-sm leading-relaxed text-fg-muted">
              <h2 id="cookie-consent-title" className="font-semibold text-fg">
                Analytics cookies
              </h2>
              <p id="cookie-consent-text" className="mt-1">
                May we use Google Analytics to count visits and see which tools are used? It never sees
                your files or anything you type. Read the{" "}
                <Link href="/cookies" className="text-accent-text underline underline-offset-2 hover:no-underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" className="flex-1 sm:w-24 sm:flex-none" onClick={() => decide("denied")}>
                Reject
              </Button>
              <Button variant="secondary" className="flex-1 sm:w-24 sm:flex-none" onClick={() => decide("granted")}>
                Accept
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Footer control that reopens the banner so a choice can be changed later. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      Cookie settings
    </button>
  );
}
