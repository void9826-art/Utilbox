import Link from "next/link";
import { Lock } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { CATEGORIES } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { POPULAR_TOOLS, TOOL_COUNT, toolHref } from "@/config/tools";

const RESOURCE_LINKS = [
  { href: "/tools", label: "All tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-bg-muted print-hidden">
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              {TOOL_COUNT} free utilities for the small digital jobs that come up every day. No
              account, no upload queue, no watermarks.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-fg-subtle">
              <Lock className="size-3 text-fg-subtle" aria-hidden="true" />
              Most tools run entirely in your browser
            </p>
          </div>

          <FooterColumn title="Tools">
            {CATEGORIES.map((category) => (
              <FooterLink key={category.id} href={`/${category.id}`}>
                {category.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Popular">
            {POPULAR_TOOLS.slice(0, 8).map((tool) => (
              <FooterLink key={tool.slug} href={toolHref(tool)}>
                {tool.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <div className="space-y-8">
            <FooterColumn title="Resources">
              {RESOURCE_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterColumn>

            <FooterColumn title="Legal">
              {LEGAL_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </FooterColumn>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-fg-subtle">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-[0.8125rem] text-fg-subtle">
            Built for speed, privacy and accessibility.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[0.8125rem] font-semibold text-fg">{title}</h2>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex min-h-6 items-center text-[0.8125rem] text-fg-muted transition-colors hover:text-fg hover:underline underline-offset-2"
      >
        {children}
      </Link>
    </li>
  );
}
