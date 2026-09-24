import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Gauge, Lock, Sparkles } from "lucide-react";

import { AdSlot } from "@/components/ads/ad-slot";
import { HeroSearch } from "@/components/home/hero-search";
import { ToolCard, ToolGrid } from "@/components/tool/tool-card";
import { GlowFrame } from "@/components/ui/glow-frame";
import { StatStrip } from "@/components/ui/stat-strip";
import { CATEGORIES } from "@/config/categories";
import { siteConfig } from "@/config/site";
import {
  POPULAR_TOOLS,
  RECENTLY_ADDED_TOOLS,
  TOOLS,
  TOOLS_BY_CATEGORY,
  TOOL_COUNT,
} from "@/config/tools";
import { buildMetadata } from "@/lib/seo";

/** Every tool that makes a network request, derived so the homepage copy cannot drift from the registry. */
const NETWORK_TOOLS = TOOLS.filter((tool) => tool.processing !== "client");

export const metadata: Metadata = buildMetadata({
  // The root page sits outside the layout's title template, so the brand is written in here.
  title: `${siteConfig.name} — Free Online PDF, Image, Text & Calculator Tools`,
  description: `${TOOL_COUNT} free online tools to merge and compress PDFs, resize images, calculate EMI and GPA, convert units and format JSON. No sign-up; files stay on your device.`,
  path: "/",
});

const PROMISES = [
  {
    icon: Lock,
    title: "Your files stay on your device",
    body: "PDF, image and text tools all run inside your browser. There is no upload, no queue, and no copy of your document on a server afterwards.",
  },
  {
    icon: Gauge,
    title: "Fast, because nothing travels",
    body: "Work starts the moment you drop a file in. A 40-page PDF merges in about a second, with no round trip to wait for.",
  },
  {
    icon: Sparkles,
    title: "Free, with no account",
    body: "No sign-up, no email step, no watermark and no daily limit. Open a tool, use it, close the tab.",
  },
];

export default function HomePage() {
  // "Recently added" reads real ship dates from the registry rather than
  // inventing activity, so it stays honest as tools are added.
  const recent = RECENTLY_ADDED_TOOLS.slice(0, 6);
  const newestDate = recent[0]?.addedOn;
  const allShippedTogether = recent.every((tool) => tool.addedOn === newestDate);

  return (
    <>
      <section className="border-b border-border bg-bg-muted">
        <div className="container-page py-14 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-fg sm:text-5xl">
              Free online tools for PDFs, images, calculations and more
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg-muted">
              Convert files, calculate anything, and tidy up text — right in your browser. Fast,
              private, and free, with nothing to install and no account to create.
            </p>
          </div>

          <GlowFrame className="mt-8 max-w-3xl">
            <HeroSearch />
          </GlowFrame>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-fg-muted">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-3.5 text-fg" aria-hidden="true" />
              Files never leave your device
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
              No sign-up required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
              {TOOL_COUNT} tools and counting
            </span>
          </div>
        </div>
      </section>

      <div className="container-page py-12 sm:py-16">
        <div className="space-y-16">
          <section aria-labelledby="popular-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2
                  id="popular-heading"
                  className="text-xl font-semibold tracking-tight text-fg sm:text-2xl"
                >
                  Popular tools
                </h2>
                <p className="mt-1 text-sm text-fg-muted">The ones people reach for most often.</p>
              </div>
              <Link
                href="/tools"
                className="inline-flex min-h-6 items-center gap-1 py-0.5 text-sm font-medium text-accent-text hover:underline underline-offset-2"
              >
                View all {TOOL_COUNT} tools
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
            <ToolGrid tools={POPULAR_TOOLS} showCategory className="mt-5" />
          </section>

          <AdSlot placement="leaderboard" />

          <section aria-labelledby="at-a-glance-heading">
            <h2 id="at-a-glance-heading" className="sr-only">
              The site at a glance
            </h2>
            {/* Counted from the registry at build time — these are facts about
                what exists, not traffic or popularity figures. */}
            <StatStrip
              items={[
                { label: "Tools", value: String(TOOL_COUNT), hint: "Every one free, with no sign-up" },
                {
                  label: "Categories",
                  value: String(CATEGORIES.length),
                  hint: "PDF, image, text, converters, calculators and more",
                },
                {
                  label: "Files uploaded",
                  value: "0",
                  hint: "Almost every tool runs entirely in your browser",
                },
              ]}
            />
          </section>

          <section aria-labelledby="promises-heading">
            <h2 id="promises-heading" className="sr-only">
              Why use these tools
            </h2>
            <div className="grid gap-5 sm:grid-cols-3">
              {PROMISES.map((promise) => (
                <div
                  key={promise.title}
                  className="rounded-[var(--radius-card)] border border-border bg-surface p-5"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg border border-accent-soft-border bg-accent-soft text-accent-text">
                    <promise.icon className="size-[1.125rem]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-[0.9375rem] font-semibold text-fg">{promise.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{promise.body}</p>
                </div>
              ))}
            </div>
          </section>

          {TOOLS_BY_CATEGORY.map(({ category, tools }) => (
            <section key={category.id} aria-labelledby={`${category.id}-heading`}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-fg-muted">
                    <category.icon className="size-[1.125rem]" aria-hidden="true" />
                  </span>
                  <div>
                    <h2
                      id={`${category.id}-heading`}
                      className="text-xl font-semibold tracking-tight text-fg"
                    >
                      {category.name}
                    </h2>
                    <p className="text-sm text-fg-muted">{category.description}</p>
                  </div>
                </div>
                <Link
                  href={`/${category.id}`}
                  className="inline-flex min-h-6 items-center gap-1 py-0.5 text-sm font-medium text-accent-text hover:underline underline-offset-2"
                >
                  View all {tools.length}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.slice(0, 6).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ))}

          <AdSlot placement="inContent" />

          <section aria-labelledby="recent-heading">
            <h2
              id="recent-heading"
              className="text-xl font-semibold tracking-tight text-fg sm:text-2xl"
            >
              Recently added
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              {allShippedTogether
                ? `All ${TOOL_COUNT} tools launched together on ${new Date(`${newestDate}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}.`
                : "The newest additions to the collection."}
            </p>
            <ToolGrid tools={recent} showCategory className="mt-5" />
          </section>

          <section className="rounded-[var(--radius-card)] border border-border bg-bg-muted p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight text-fg">
              One place for the small digital jobs
            </h2>
            <div className="prose-content mt-3 max-w-3xl">
              <p>
                Most days throw up a task that is too small to justify installing software: a PDF that
                needs two pages removed, a photo that is a megabyte too large to attach, a percentage you
                could work out by hand but would rather not. {siteConfig.name} collects{" "}
                {TOOL_COUNT} of those jobs into one place, with a single consistent interface.
              </p>
              <p>
                Nearly all of them run entirely inside your browser. That is not a marketing line — it is
                a design decision with real consequences: your files are never uploaded, so there is no
                queue to wait in, no size limit imposed by a server, and nothing left behind when you
                close the tab. The {NETWORK_TOOLS.length} tools that do need the network, such as the
                currency converter and the SSL certificate checker, say so on the tool itself, and the{" "}
                <Link href="/privacy">privacy policy</Link> lists exactly what each one sends.
              </p>
              <p>
                Each tool also explains what it did. Calculators show their formula and working;
                converters name the exact factors they used; file tools say what survives the conversion
                and what does not. You should be able to check the result rather than take it on trust.
              </p>
            </div>

            <nav aria-label="Tool categories" className="mt-5">
              <ul className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/${category.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[0.8125rem] font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                    >
                      <category.icon className="size-3.5" aria-hidden="true" />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>
      </div>
    </>
  );
}
