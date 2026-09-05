import * as React from "react";
import Link from "next/link";
import { ChevronRight, Lock, ShieldCheck } from "lucide-react";

import { ToolCard } from "@/components/tool/tool-card";
import { Card } from "@/components/ui/surfaces";
import { CATEGORIES, CATEGORY_BY_ID } from "@/config/categories";
import { getRelatedTools } from "@/config/tools";
import type { Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { ToolFormula, ToolMeta } from "@/types/tool";

/* -------------------------------------------------------------------------- */

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[0.8125rem] text-fg-muted">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight className="size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
              ) : null}
              {isLast ? (
                <span aria-current="page" className="font-medium text-fg">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="rounded transition-colors hover:text-fg hover:underline underline-offset-2"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */

export function PrivacyBadge({ tool }: { tool: ToolMeta }) {
  const localOnly = tool.processing === "client";

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[0.6875rem] font-medium text-fg-muted"
      title={
        localOnly
          ? "This tool runs entirely in your browser. Nothing is uploaded."
          : "Your input stays in your browser. Only public reference data is fetched."
      }
    >
      {localOnly ? (
        <>
          <Lock className="size-3 text-fg-muted" aria-hidden="true" />
          {tool.requiresFile ? "Files never leave your device" : "Runs entirely in your browser"}
        </>
      ) : (
        <>
          <ShieldCheck className="size-3 text-fg-muted" aria-hidden="true" />
          Your input stays in your browser
        </>
      )}
    </span>
  );
}

export function ToolHeader({
  tool,
  intro,
}: {
  tool: ToolMeta;
  intro: string;
}) {
  const Icon = tool.icon;

  return (
    <header className="space-y-3">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent-soft-border bg-accent-soft text-accent-text">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-balance text-fg sm:text-3xl">
            {tool.name}
          </h1>
          <p className="mt-1.5 max-w-2xl text-[0.9375rem] leading-relaxed text-fg-muted">{intro}</p>
        </div>
      </div>
      <PrivacyBadge tool={tool} />
    </header>
  );
}

/* -------------------------------------------------------------------------- */

export function InfoSection({
  id,
  title,
  children,
  className,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)} aria-labelledby={id ? `${id}-heading` : undefined}>
      <h2
        id={id ? `${id}-heading` : undefined}
        className="text-lg font-semibold tracking-tight text-fg sm:text-xl"
      >
        {title}
      </h2>
      <div className="mt-3 prose-content">{children}</div>
    </section>
  );
}

export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="counter-reset-steps space-y-3 pl-0" style={{ listStyle: "none" }}>
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3">
          <span className="tabular mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-xs font-semibold text-fg-muted">
            {index + 1}
          </span>
          <span className="min-w-0 flex-1 pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function FormulaBlock({ formula }: { formula: ToolFormula }) {
  return (
    <Card className="overflow-hidden">
      <div className="scrollbar-slim overflow-x-auto border-b border-border bg-surface-sunken px-4 py-3.5">
        <code className="font-mono text-sm whitespace-nowrap text-fg">{formula.expression}</code>
      </div>
      <dl className="space-y-1.5 p-4 text-sm">
        {formula.where.map((line) => {
          const [symbol, ...rest] = line.split(" — ");
          return (
            <div key={line} className="flex gap-2">
              <dt className="min-w-16 shrink-0 font-mono text-[0.8125rem] font-medium text-fg">
                {symbol}
              </dt>
              <dd className="text-fg-muted">{rest.join(" — ")}</dd>
            </div>
          );
        })}
      </dl>
      {formula.note ? (
        <p className="border-t border-border bg-surface-sunken px-4 py-2.5 text-xs text-fg-muted">
          {formula.note}
        </p>
      ) : null}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */

export function FaqSection({ items }: { items: Array<{ question: string; answer: string }> }) {
  if (items.length === 0) return null;

  return (
    <InfoSection id="faq" title="Frequently asked questions">
      <div className="not-prose divide-y divide-border overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
        {items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-sm font-medium text-fg transition-colors hover:bg-bg-muted">
              {item.question}
              <ChevronRight
                className="size-4 shrink-0 text-fg-subtle transition-transform duration-200 group-open:rotate-90"
                aria-hidden="true"
              />
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-fg-muted">{item.answer}</div>
          </details>
        ))}
      </div>
    </InfoSection>
  );
}

/* -------------------------------------------------------------------------- */

export function RelatedTools({ tool }: { tool: ToolMeta }) {
  const related = getRelatedTools(tool);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="scroll-mt-24">
      <h2 id="related-heading" className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
        Related tools
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {related.map((item) => (
          <ToolCard key={item.slug} tool={item} showCategory={item.category !== tool.category} />
        ))}
      </div>
    </section>
  );
}

export function CategoryLinks({ currentCategory }: { currentCategory?: string }) {
  return (
    <nav aria-label="Tool categories" className="border-t border-border pt-6">
      <h2 className="text-[0.8125rem] font-semibold text-fg">Browse every category</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const active = category.id === currentCategory;
          return (
            <li key={category.id}>
              <Link
                href={`/${category.id}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                  active
                    ? "border-accent-soft-border bg-accent-soft text-accent-text"
                    : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                <category.icon className="size-3.5" aria-hidden="true" />
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function CategoryBadge({ categoryId }: { categoryId: keyof typeof CATEGORY_BY_ID }) {
  const category = CATEGORY_BY_ID[categoryId];
  return (
    <Link
      href={`/${category.id}`}
      className="inline-flex min-h-6 items-center gap-1.5 text-[0.8125rem] font-medium text-accent-text hover:underline underline-offset-2"
    >
      <category.icon className="size-3.5" aria-hidden="true" />
      {category.name}
    </Link>
  );
}
