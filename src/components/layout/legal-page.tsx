import * as React from "react";

import { Breadcrumbs } from "@/components/tool/sections";

/** Shared shell for the static information and legal pages. */
export function StaticPage({
  title,
  intro,
  updated,
  breadcrumb,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  breadcrumb: { name: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-6 sm:py-8">
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, breadcrumb]} />

      <header className="mt-5 max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-balance text-fg sm:text-3xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">{intro}</p>
        ) : null}
        {updated ? (
          <p className="mt-3 text-xs text-fg-subtle">
            Last updated{" "}
            {new Date(`${updated}T00:00:00`).toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        ) : null}
      </header>

      <div className="prose-content container-prose mt-8">{children}</div>
    </div>
  );
}
