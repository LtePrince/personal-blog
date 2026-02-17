"use client";

import { BookOpen } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import BlogCard from "./BlogCard";
import { Skeleton } from "@/components/common/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";

interface LatestPostsProps {
  posts: BlogPost[];
}

/**
 * "Latest Blog" section – shows up to 5 most recent posts.
 *
 * When the array is empty (API down / loading) it renders skeletons.
 */
export default function LatestPosts({ posts }: LatestPostsProps) {
  const { t } = useLocale();
  const hasData = posts.length > 0;

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
          ? posts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
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
