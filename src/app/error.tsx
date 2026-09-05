"use client";

import * as React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary.
 *
 * The visitor sees a plain explanation and a way forward; the technical detail
 * goes to the console in development only, never onto the page.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[route error]", error);
    }
  }, [error]);

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="max-w-2xl">
        <p className="text-[0.8125rem] font-semibold tracking-wider text-danger uppercase">
          Something went wrong
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
          This page ran into a problem
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-fg-muted">
          Nothing you were working on was sent anywhere — the tools run in your browser, so whatever
          you had open stayed on your device. Trying again usually clears it.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Link
            href="/tools"
            className="inline-flex h-10 items-center rounded-lg border border-border-strong bg-surface px-4 text-sm font-medium text-fg transition-colors hover:bg-bg-muted"
          >
            Browse all tools
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-8 text-xs text-fg-subtle">
            If you report this, quoting reference{" "}
            <code className="rounded border border-border bg-surface-sunken px-1 font-mono">
              {error.digest}
            </code>{" "}
            helps us find it in the logs.
          </p>
        ) : null}
      </div>
    </div>
  );
}
