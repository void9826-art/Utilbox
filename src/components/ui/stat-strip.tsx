import { cn } from "@/lib/utils";

export interface StatStripItem {
  label: string;
  value: string;
  hint?: string;
}

/**
 * A row of headline figures.
 *
 * Adapted from the supplied analytics card. That sample shipped invented
 * traffic numbers and a fake sparkline; every figure here is passed in by the
 * page from the tool registry, so what is shown is a count of things that
 * actually exist. Nothing is presented as traffic or popularity data.
 */
export function StatStrip({ items, className }: { items: StatStripItem[]; className?: string }) {
  return (
    <dl className={cn("grid gap-3 sm:grid-cols-3", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[var(--radius-card)] border border-border bg-surface p-4 transition-colors hover:border-border-strong"
        >
          <dt className="text-xs font-medium tracking-wide text-fg-subtle uppercase">{item.label}</dt>
          <dd className="tabular mt-1 text-2xl font-semibold text-fg">{item.value}</dd>
          {item.hint ? <p className="mt-1 text-[0.8125rem] text-fg-muted">{item.hint}</p> : null}
        </div>
      ))}
    </dl>
  );
}
