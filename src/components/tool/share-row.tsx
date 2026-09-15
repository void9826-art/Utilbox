"use client";

import { Link2, Mail } from "lucide-react";

import { useToast } from "@/components/ui/toast";
import { copyToClipboard } from "@/lib/download";
import { cn } from "@/lib/utils";

/**
 * The "share this tool" row.
 *
 * Adapted from the supplied social icon row. That sample hard-coded each
 * network's brand colour on hover, which reads as decoration rather than
 * meaning; hover here uses the site's own tokens, and every control carries a
 * real label, so the row works without colour and without a mouse.
 */
export function ShareRow({ title, url, className }: { title: string; url: string; className?: string }) {
  const { notify } = useToast();

  const targets = [
    { name: "X", href: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    {
      name: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
  ];

  const iconClass =
    "flex size-9 items-center justify-center rounded-full border border-border bg-surface text-fg-muted transition-colors hover:border-border-strong hover:bg-accent-soft hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-[0.8125rem] font-medium text-fg-muted">Share this tool</span>

      {targets.map((target) => (
        <a
          key={target.name}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${target.name}`}
          className={cn(iconClass, "text-[0.6875rem] font-semibold")}
        >
          <span aria-hidden="true">{target.name.slice(0, 2)}</span>
          <span className="sr-only">Share on {target.name}</span>
        </a>
      ))}

      <a
        href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
        title="Share by email"
        className={iconClass}
      >
        <Mail className="size-4" aria-hidden="true" />
        <span className="sr-only">Share by email</span>
      </a>

      <button
        type="button"
        title="Copy link"
        className={iconClass}
        onClick={async () => {
          const ok = await copyToClipboard(url);
          notify(
            ok
              ? { tone: "success", title: "Link copied", description: url }
              : {
                  tone: "error",
                  title: "The link could not be copied",
                  description: "Copy it from the address bar instead.",
                },
          );
        }}
      >
        <Link2 className="size-4" aria-hidden="true" />
        <span className="sr-only">Copy link to this tool</span>
      </button>
    </div>
  );
}
