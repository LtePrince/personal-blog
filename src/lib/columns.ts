import type { ColumnItem, ColumnDetail, ChapterView } from "@/types/column";

/* ------------------------------------------------------------------ */
/*  Backend (snake_case) response shapes                               */
/* ------------------------------------------------------------------ */

export interface BackendColumnItem {
  id: number;
  slug: string;
  title: string;
  summary: string;
  author?: string;
  tags?: string[];
  chapter_count: number;
  updated_at: number;
}

export interface BackendChapterItem {
  slug: string;
  title: string;
  sort: number;
}

export interface BackendColumnDetail extends BackendColumnItem {
  chapters: BackendChapterItem[];
}

export interface BackendChapterView {
  column: BackendColumnItem;
  chapters: BackendChapterItem[];
  current: { slug: string; title: string; text: string };
  prev_slug?: string;
  next_slug?: string;
}

/* ------------------------------------------------------------------ */
/*  Transforms to the camelCase frontend shapes                        */
/* ------------------------------------------------------------------ */

export function toColumnItem(b: BackendColumnItem): ColumnItem {
  return {
    id: b.id,
    slug: b.slug,
    title: b.title,
    summary: b.summary,
    author: b.author || undefined,
    tags: b.tags ?? [],
    chapterCount: b.chapter_count,
    updatedAt: b.updated_at,
  };
}

export function toColumnDetail(b: BackendColumnDetail): ColumnDetail {
  return {
    ...toColumnItem(b),
    chapters: b.chapters.map((c) => ({ slug: c.slug, title: c.title })),
  };
}

export function toChapterView(b: BackendChapterView): ChapterView {
  return {
    column: toColumnItem(b.column),
    chapters: b.chapters.map((c) => ({ slug: c.slug, title: c.title })),
    current: {
      slug: b.current.slug,
      title: b.current.title,
      text: b.current.text,
    },
    prevSlug: b.prev_slug || undefined,
    nextSlug: b.next_slug || undefined,
  };
}

/** Format a unix-seconds timestamp as YYYY-MM-DD. */
export function fmtUnixDate(seconds: number): string {
  if (!seconds) return "";
  return new Date(seconds * 1000).toISOString().slice(0, 10);
}
