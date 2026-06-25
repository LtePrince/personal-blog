"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import type { ChapterView } from "@/types/column";
import Navbar from "@/components/layout/Navbar";
import Markdown from "@/components/common/Markdown";
import TableOfContents from "@/components/blog/TableOfContents";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Chapter reading page — GitBook-style three-column layout:
 * left chapter nav · center article · right in-page TOC.
 */
export default function ColumnReader({ data }: { data: ChapterView }) {
  const { t } = useLocale();
  const { column, chapters, current, prevSlug, nextSlug } = data;

  const chapterHref = (s: string) =>
    `/column/${encodeURIComponent(column.slug)}/${encodeURIComponent(s)}`;

  return (
    <>
      <Navbar />
      <div className="h-16" />

      <div className="mx-auto max-w-7xl px-5 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-[var(--text-tertiary)]">
          <Link href="/blog" className="transition-colors hover:text-[var(--accent)]">
            {t({ en: "Blogs", "zh-CN": "博客" })}
          </Link>
          <span>/</span>
          <Link
            href={`/column/${encodeURIComponent(column.slug)}`}
            className="transition-colors hover:text-[var(--accent)]"
          >
            {column.title}
          </Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">{current.title}</span>
        </nav>

        {/* Mobile chapter dropdown */}
        <details className="glass mb-4 rounded-[var(--radius-md)] px-4 py-3 lg:hidden">
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
            <List className="h-4 w-4 text-[var(--accent)]" />
            {t({ en: "Chapters", "zh-CN": "目录" })}
          </summary>
          <ol className="mt-3 flex flex-col gap-1">
            {chapters.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={chapterHref(c.slug)}
                  className={cn(
                    "block rounded px-2 py-1.5 text-sm transition-colors",
                    c.slug === current.slug
                      ? "bg-[var(--accent-subtle)] font-medium text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {i + 1}. {c.title}
                </Link>
              </li>
            ))}
          </ol>
        </details>

        <div className="lg:grid lg:grid-cols-[210px_1fr] lg:gap-8 xl:grid-cols-[210px_1fr_200px]">
          {/* Left: chapter nav (desktop) */}
          <aside className="hidden lg:block">
            <div className="glass sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[var(--radius-md)] px-4 py-4">
              <p className="mb-3 line-clamp-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                {column.title}
              </p>
              <ol className="flex flex-col gap-1 border-l border-[var(--border-glass)]">
                {chapters.map((c, i) => {
                  const active = c.slug === current.slug;
                  return (
                    <li key={c.slug}>
                      <Link
                        href={chapterHref(c.slug)}
                        className={cn(
                          "-ml-px block border-l-2 py-1 pl-3 text-[13px] leading-snug transition-all duration-200",
                          active
                            ? "border-[var(--accent)] font-medium text-[var(--accent)]"
                            : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
                        )}
                      >
                        {i + 1}. {c.title}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          {/* Center: article */}
          <article className="min-w-0">
            <h1 className="mb-6 text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
              {current.title}
            </h1>
            <div className="glass rounded-[var(--radius-lg)] px-6 py-6 md:px-8">
              <div className="prose prose-neutral max-w-none dark:prose-invert">
                <Markdown>{current.text}</Markdown>
              </div>
            </div>

            {/* Prev / Next */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {prevSlug ? (
                <Link
                  href={chapterHref(prevSlug)}
                  className="glass inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t({ en: "Previous", "zh-CN": "上一章" })}
                </Link>
              ) : (
                <span />
              )}
              {nextSlug ? (
                <Link
                  href={chapterHref(nextSlug)}
                  className="glass inline-flex items-center gap-1.5 rounded-[var(--radius-md)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
                >
                  {t({ en: "Next", "zh-CN": "下一章" })}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span />
              )}
            </div>
          </article>

          {/* Right: in-page TOC */}
          <TableOfContents />
        </div>
      </div>
    </>
  );
}
