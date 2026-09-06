"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";

import { Kbd, useToolSearch } from "@/components/layout/search-dialog";
import { ThemeToggle } from "@/components/layout/theme";
import { Logo } from "@/components/layout/logo";
import { CATEGORIES } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { TOOL_COUNT, TOOLS_BY_CATEGORY, toolHref } from "@/config/tools";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const search = useToolSearch();
  // Each menu records the route it was opened on. Navigating therefore closes
  // it as a matter of derivation rather than through an effect that fires
  // after the new page has already painted with the menu still open.
  const [menuOpenedAt, setMenuOpenedAt] = React.useState<string | null>(null);
  const [mobileOpenedAt, setMobileOpenedAt] = React.useState<string | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mobileToggleRef = React.useRef<HTMLButtonElement>(null);

  const menuOpen = menuOpenedAt === pathname;
  const mobileOpen = mobileOpenedAt === pathname;

  const setMenuOpen = React.useCallback(
    (open: boolean) => setMenuOpenedAt(open ? pathname : null),
    [pathname],
  );
  const setMobileOpen = React.useCallback(
    (open: boolean) => setMobileOpenedAt(open ? pathname : null),
    [pathname],
  );

  React.useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, setMenuOpen]);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // The mobile panel covers the page and locks scrolling, so there has to be a
  // way out that is not the close button — Escape is the one people reach for.
  React.useEffect(() => {
    if (!mobileOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, setMobileOpen]);

  React.useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center gap-2">
          <Link
            href="/"
            className="mr-1 shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            aria-label={`${siteConfig.name} home`}
          >
            <Logo />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            <div
              ref={menuRef}
              className="relative"
              onMouseEnter={() => {
                clearTimeout(closeTimer.current);
                setMenuOpen(true);
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => setMenuOpen(false), 120);
              }}
            >
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className={cn(
                  "inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium transition-colors",
                  menuOpen ? "bg-bg-muted text-fg" : "text-fg-muted hover:bg-bg-muted hover:text-fg",
                )}
              >
                Tools
                <ChevronDown
                  className={cn("size-3.5 transition-transform duration-200", menuOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>

              {menuOpen ? <MegaMenu onNavigate={() => setMenuOpen(false)} /> : null}
            </div>

            <HeaderLink href="/tools" active={pathname === "/tools"}>
              All tools
            </HeaderLink>
            <HeaderLink href="/pdf" active={pathname.startsWith("/pdf")}>
              PDF
            </HeaderLink>
            <HeaderLink href="/calculators" active={pathname.startsWith("/calculators")}>
              Calculators
            </HeaderLink>
            <HeaderLink href="/image" active={pathname.startsWith("/image")}>
              Image
            </HeaderLink>
          </nav>

          <div className="flex-1" />

          <button
            type="button"
            onClick={search.open}
            className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-left text-sm text-fg-subtle shadow-subtle transition-colors hover:border-border-strong hover:text-fg-muted md:flex xl:w-64"
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 truncate">Search {TOOL_COUNT} tools…</span>
            <Kbd>⌘K</Kbd>
          </button>

          <button
            type="button"
            onClick={search.open}
            className="inline-flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-muted hover:text-fg md:hidden"
            aria-label="Search tools"
          >
            <Search className="size-[1.125rem]" aria-hidden="true" />
          </button>

          <ThemeToggle />

          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="inline-flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-bg-muted hover:text-fg lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="size-[1.125rem]" aria-hidden="true" />
            ) : (
              <Menu className="size-[1.125rem]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? <MobileNavigation onNavigate={() => setMobileOpen(false)} /> : null}
    </header>
  );
}

function HeaderLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors",
        active ? "bg-bg-muted text-fg" : "text-fg-muted hover:bg-bg-muted hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="absolute top-full left-0 z-50 pt-2">
      <div className="w-[min(58rem,calc(100vw-3rem))] overflow-hidden rounded-xl border border-border bg-surface shadow-overlay">
        <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS_BY_CATEGORY.map(({ category, tools }) => (
            <div key={category.id}>
              <Link
                href={`/${category.id}`}
                onClick={onNavigate}
                className="group flex items-center gap-2 rounded-md text-sm font-semibold text-fg hover:text-accent-text"
              >
                <category.icon className="size-4 text-fg-subtle group-hover:text-accent-text" aria-hidden="true" />
                {category.name}
                <span className="tabular text-[0.6875rem] font-normal text-fg-subtle">{tools.length}</span>
              </Link>
              <ul className="mt-2 space-y-0.5">
                {tools.slice(0, 4).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={toolHref(tool)}
                      onClick={onNavigate}
                      className="block min-h-6 truncate rounded-md px-2 py-1 -mx-2 text-[0.8125rem] text-fg-muted transition-colors hover:bg-bg-muted hover:text-fg"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border bg-surface-sunken px-5 py-3">
          <p className="text-[0.8125rem] text-fg-muted">
            {TOOL_COUNT} tools, all free and no sign-up.
          </p>
          <Link
            href="/tools"
            onClick={onNavigate}
            className="text-[0.8125rem] font-medium text-accent-text hover:underline underline-offset-2"
          >
            Browse all tools →
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileNavigation({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div
      id="mobile-navigation"
      className="scrollbar-slim max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-bg lg:hidden"
    >
      <nav aria-label="Mobile" className="container-page space-y-5 py-5">
        <Link
          href="/tools"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm font-semibold text-fg"
        >
          All {TOOL_COUNT} tools
          <span aria-hidden="true">→</span>
        </Link>

        {CATEGORIES.map((category) => (
          <div key={category.id}>
            <Link
              href={`/${category.id}`}
              onClick={onNavigate}
              className="flex items-center gap-2 text-sm font-semibold text-fg"
            >
              <category.icon className="size-4 text-fg-subtle" aria-hidden="true" />
              {category.name}
            </Link>
            <ul className="mt-1.5 grid grid-cols-2 gap-x-3">
              {TOOLS_BY_CATEGORY.find((entry) => entry.category.id === category.id)
                ?.tools.slice(0, 6)
                .map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={toolHref(tool)}
                      onClick={onNavigate}
                      className="block min-h-6 truncate py-1.5 text-[0.8125rem] text-fg-muted"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
