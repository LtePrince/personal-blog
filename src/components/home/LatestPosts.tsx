"use client";

import { BookOpen } from "lucide-react";
import type { FeedItem } from "@/types/feed";
import FeedCard from "./FeedCard";
import { Skeleton } from "@/components/common/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";

interface LatestPostsProps {
  items: FeedItem[];
}

/**
 * "Latest Posts" section – the 5 newest entries across blog posts and
 * column chapters.
 *
 * When the array is empty (API down / loading) it renders skeletons.
 */
export default function LatestPosts({ items }: LatestPostsProps) {
  const { t } = useLocale();
  const hasData = items.length > 0;

  return (
    <section className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center gap-2 text-[var(--text-primary)]">
        <BookOpen className="h-5 w-5 text-[var(--accent)]" />
        <h2 className="text-lg font-semibold">{t({ en: "Latest Posts", "zh-CN": "最新文章" })}</h2>
      </div>

      {/* Post list or skeleton fallback */}
      <div className="flex flex-col gap-3">
        {hasData
          ? items.map((item, i) => (
              <FeedCard key={item.key} item={item} index={i} />
            ))
          : Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="glass flex flex-col gap-3 rounded-[var(--radius-md)] px-5 py-4"
              >
                <Skeleton className="h-5 w-3/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/5" />
              </div>
            ))}
      </div>
    </section>
  );
}
