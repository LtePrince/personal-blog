"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { BlogPostDetail } from "@/types/blog";
import Navbar from "@/components/layout/Navbar";
import Markdown from "@/components/common/Markdown";
import Comments from "@/components/common/Comments";
import TableOfContents from "@/components/blog/TableOfContents";

interface ClientDetailProps {
  data: BlogPostDetail;
}

/**
 * Blog detail client shell – renders article body + right-side TOC + comments.
 */
export default function ClientDetail({ data }: ClientDetailProps) {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <div className="h-16" />

      {/* Outer wrapper: article centred, TOC pinned to the right */}
      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Back link + title outside the grid so they span full width */}
        <div className="mx-auto w-full max-w-3xl xl:max-w-none">
          <button
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to posts
          </button>

          <header className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
              {data.title}
            </h1>
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">
              {data.date}
              {data.author ? ` · ${data.author}` : ""}
            </p>
            {data.tags && data.tags.length > 0 && (
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
          </header>
        </div>

        {/* Two-column grid: article body + TOC, both start at the same height */}
        <div className="relative xl:grid xl:grid-cols-[1fr_200px] xl:gap-8">
          {/* ---- Main article column ---- */}
          <article className="mx-auto w-full max-w-3xl xl:max-w-none">
            <div className="glass rounded-[var(--radius-lg)] px-6 py-6 md:px-8">
              <div className="prose prose-neutral max-w-none dark:prose-invert">
                {data.text ? <Markdown>{data.text}</Markdown> : <p>Loading…</p>}
              </div>
            </div>

            {/* Comments */}
            <section className="mt-10">
              <Comments />
            </section>
          </article>

          {/* ---- Right-side TOC (aligns with the glass card top) ---- */}
          <TableOfContents />
        </div>
      </div>
    </>
  );
}
