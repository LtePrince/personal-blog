"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Clock, ListOrdered } from "lucide-react";
import type { ColumnDetail } from "@/types/column";
import { fmtUnixDate } from "@/lib/columns";
import Navbar from "@/components/layout/Navbar";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Column landing page — series overview + chapter table of contents.
 */
export default function ColumnLanding({ data }: { data: ColumnDetail }) {
  const { t } = useLocale();
  const first = data.chapters[0];

  return (
    <>
      <Navbar />
      <div className="h-24" />

      <main className="mx-auto max-w-4xl px-5 py-8">
        <Link
          href="/blog"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t({ en: "Back to Blogs", "zh-CN": "返回博客" })}
        </Link>

        {/* Series header */}
        <header className="glass rounded-[var(--radius-lg)] px-7 py-7">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            {data.title}
          </h1>
          {data.summary && (
            <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">
              {data.summary}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              {t({
                en: `${data.chapterCount} chapters`,
                "zh-CN": `${data.chapterCount} 章`,
              })}
            </span>
            {data.updatedAt > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {fmtUnixDate(data.updatedAt)}
              </span>
            )}
            {data.author && <span>· {data.author}</span>}
          </div>

          {data.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {first && (
            <Link
              href={`/column/${encodeURIComponent(data.slug)}/${encodeURIComponent(first.slug)}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[var(--accent-hover)] hover:shadow-md"
            >
              <BookOpen className="h-4 w-4" />
              {t({ en: "Start reading", "zh-CN": "开始阅读" })}
            </Link>
          )}
        </header>

        {/* Chapter table of contents */}
        <section className="mt-6 glass rounded-[var(--radius-lg)] px-6 py-6">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
            <ListOrdered className="h-5 w-5 text-[var(--accent)]" />
            {t({ en: "Chapters", "zh-CN": "目录" })}
          </h2>
          {data.chapters.length > 0 ? (
            <ol className="flex flex-col">
              {data.chapters.map((c, i) => (
                <li key={c.slug}>
                  <Link
                    href={`/column/${encodeURIComponent(data.slug)}/${encodeURIComponent(c.slug)}`}
                    className="group flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 transition-colors hover:bg-[var(--accent-subtle)]"
                  >
                    <span className="w-6 shrink-0 text-sm tabular-nums text-[var(--text-tertiary)]">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                      {c.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-[var(--text-tertiary)]">
              {t({ en: "No chapters yet", "zh-CN": "暂无章节" })}
            </p>
          )}
        </section>
      </main>
    </>
  );
}
