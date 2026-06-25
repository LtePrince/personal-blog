"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pin, Tags } from "lucide-react";
import { Skeleton } from "@/components/common/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";

interface RecentPost {
  id: string;
  title: string;
  date: string;
}

interface MergedTag {
  name: string;
  count: number;
}

interface BlogSidebarProps {
  /** Called when a tag chip is clicked – opens search with that tag. */
  onTagClick?: (tagName: string) => void;
}

/**
 * Thin sidebar shown next to the blog list.
 * Fetches recent posts and the merged tag set (posts + columns).
 */
export default function BlogSidebar({ onTagClick }: BlogSidebarProps) {
  const { t } = useLocale();
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [tags, setTags] = useState<MergedTag[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);

  /* Fetch recent posts */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/blog/recent?limit=3");
        const body = await res.json();
        if (body.success && body.data) {
          setRecentPosts(body.data);
        }
      } catch (err) {
        console.error("Failed to fetch recent posts:", err);
      } finally {
        setLoadingRecent(false);
      }
    })();
  }, []);

  /* Fetch all tags (posts + columns, merged by name) */
  useEffect(() => {
    (async () => {
      try {
        const [tRes, cRes] = await Promise.all([
          fetch("/api/tags"),
          fetch("/api/columns/tags"),
        ]);
        const [tBody, cBody] = await Promise.all([tRes.json(), cRes.json()]);

        const map = new Map<string, number>();
        if (tBody.success) {
          for (const tag of tBody.data ?? []) {
            map.set(tag.name, (map.get(tag.name) ?? 0) + (tag.postCount ?? 0));
          }
        }
        if (cBody.success) {
          for (const c of cBody.data ?? []) {
            map.set(c.name, (map.get(c.name) ?? 0) + (c.columnCount ?? 0));
          }
        }
        setTags(
          [...map.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
        );
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      } finally {
        setLoadingTags(false);
      }
    })();
  }, []);

  return (
    <aside className="flex flex-col gap-5">
      {/* Recent posts mini-list */}
      <div className="glass rounded-[var(--radius-lg)] px-5 py-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Pin className="h-4 w-4 text-[var(--accent)]" />
          {t({ en: "Recent Posts", "zh-CN": "最近文章" })}
        </h3>
        {loadingRecent ? (
          <ul className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i}>
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ul>
        ) : recentPosts.length > 0 ? (
          <ul className="flex flex-col gap-2.5">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${encodeURIComponent(post.id)}`}
                  className="group flex flex-col gap-0.5"
                >
                  <span className="line-clamp-1 text-sm text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                    {post.title}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {post.date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--text-tertiary)]">
            {t({ en: "No posts yet", "zh-CN": "暂无文章" })}
          </p>
        )}
      </div>

      {/* Tags cloud — all tags (posts + columns) */}
      <div className="glass rounded-[var(--radius-lg)] px-5 py-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Tags className="h-4 w-4 text-[var(--accent)]" />
          {t({ en: "Tags", "zh-CN": "标签" })}
        </h3>
        {loadingTags ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-14 rounded-full" />
            ))}
          </div>
        ) : tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.name}
                onClick={() => onTagClick?.(tag.name)}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-[var(--accent-subtle)] px-3 py-1 text-xs font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
              >
                {tag.name}
                <span className="text-[0.625rem] opacity-70">{tag.count}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-tertiary)]">
            {t({ en: "No tags yet", "zh-CN": "暂无标签" })}
          </p>
        )}
      </div>
    </aside>
  );
}
