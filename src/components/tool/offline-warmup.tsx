"use client";

import * as React from "react";

import type { CategoryId } from "@/types/tool";

type Warmup = () => Promise<unknown>;

/*
 * Many tools load their engine only when you press the button — pdf-lib for
 * most PDF tools, pdf.js and its worker for anything that reads a PDF. Offline,
 * that first load would fail. Once the page is idle, these fetch the engine in
 * the background so the service worker caches it, and the tool keeps working
 * if the connection drops before you add a file.
 *
 * Tools that need the network by design are deliberately absent: OCR and voice
 * transcription download language models from other sites, and the live
 * lookups (exchange rates, SSL, Open Graph, MX) exist to reach the internet.
 */
const PDF_LIB: Warmup = () => import("pdf-lib");
const PDF_JS: Warmup = () =>
  import("@/lib/pdf").then((module) => module.loadPdfJs()).then(() => fetch("/pdfjs/pdf.worker.min.mjs"));
const PDF_LAYOUT: Warmup = () => import("@/lib/pdf-document");
const ZIP: Warmup = () => import("@/lib/download");

const BY_CATEGORY: Partial<Record<CategoryId, Warmup[]>> = {
  pdf: [PDF_LIB, PDF_JS, ZIP],
  image: [ZIP],
};

const BY_SLUG: Record<string, Warmup[]> = {
  "word-to-pdf": [() => import("mammoth"), PDF_LAYOUT],
  "jpg-to-pdf": [PDF_LIB],
  "image-to-pdf": [PDF_LIB],
  "heic-to-jpg": [() => import("heic-to")],
  "exif-remover": [() => import("exifr")],
  "invoice-generator": [PDF_LIB, PDF_LAYOUT],
  "resume-generator": [PDF_LIB, PDF_LAYOUT],
  "qr-code-generator": [() => import("qrcode")],
  "qr-code-wifi-vcard": [() => import("qrcode")],
  "barcode-generator": [() => import("jsbarcode")],
  "checksum-verifier": [() => import("hash-wasm")],
  "resume-ats-checker": [PDF_JS, () => import("mammoth")],
};

const idle = (callback: () => void): void => {
  if ("requestIdleCallback" in window) window.requestIdleCallback(callback, { timeout: 4000 });
  else setTimeout(callback, 1500);
};

/** Waits until this page's requests actually pass through the service worker. */
async function whenControlled(): Promise<boolean> {
  await navigator.serviceWorker.ready;
  if (navigator.serviceWorker.controller) return true;
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), 5000);
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {
        clearTimeout(timer);
        resolve(true);
      },
      { once: true },
    );
  });
}

export function OfflineWarmup({ category, slug }: { category: CategoryId; slug: string }) {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const warmups = [...(BY_CATEGORY[category] ?? []), ...(BY_SLUG[slug] ?? [])];
    if (warmups.length === 0) return;

    let cancelled = false;
    idle(() => {
      void (async () => {
        if (!(await whenControlled()) || cancelled) return;
        for (const warmup of warmups) {
          if (cancelled) return;
          // A failed warm-up just means that piece loads on first use, as before.
          await warmup().catch(() => {});
        }
      })();
    });

    return () => {
      cancelled = true;
    };
  }, [category, slug]);

  return null;
}
