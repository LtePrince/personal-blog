/** Builders that fold blog posts and column chapters into one feed. */

import type { BlogPost } from "@/types/blog";
import { parseTags } from "@/types/blog";
import type { ColumnDetail } from "@/types/column";
import type { FeedItem } from "@/types/feed";
import { fmtUnixDate } from "@/lib/columns";

/** Ordering key for a post: prefer the DB timestamp, fall back to the
 *  authored date when the API omits it. */
function postSortAt(post: BlogPost): number {
  if (post.createdAt) return post.createdAt;
  const parsed = Date.parse(post.date);
  return Number.isNaN(parsed) ? 0 : Math.floor(parsed / 1000);
}

export function postToFeedItem(post: BlogPost): FeedItem {
  return {
    key: `post-${post.id}`,
    kind: "post",
    href: `/blog/${encodeURIComponent(post.id)}`,
    title: post.title,
    summary: post.summary,
    date: post.date,
    sortAt: postSortAt(post),
    tags: parseTags(post.tags),
  };
}

/**
 * One feed entry per chapter.
 *
 * Chapters carry no timestamp of their own worth using — the backend deletes
 * and recreates the whole chapter set on every publish — so they inherit the
 * column's last-updated time. Sharing a timestamp is fine: Array.sort is
 * stable, so chapters keep their table-of-contents order within a column.
 */
export function columnToFeedItems(col: ColumnDetail): FeedItem[] {
  return col.chapters.map((ch) => ({
    key: `chapter-${col.slug}-${ch.slug}`,
    kind: "chapter" as const,
    href: `/column/${encodeURIComponent(col.slug)}/${encodeURIComponent(ch.slug)}`,
    title: ch.title,
    summary: col.summary,
    date: fmtUnixDate(col.updatedAt),
    sortAt: col.updatedAt,
    tags: col.tags,
    columnTitle: col.title,
  }));
}

/** Merge posts and chapters into one newest-first feed. */
export function buildFeed(
  posts: BlogPost[],
  columns: ColumnDetail[],
  limit: number,
): FeedItem[] {
  return [...posts.map(postToFeedItem), ...columns.flatMap(columnToFeedItems)]
    .sort((a, b) => b.sortAt - a.sortAt)
    .slice(0, limit);
}
