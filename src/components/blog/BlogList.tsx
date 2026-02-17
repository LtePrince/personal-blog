"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { parseTags } from "@/types/blog";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/common/Skeleton";

interface BlogListProps {
  posts: BlogPost[];
}

/**
 * Main blog listing – vertical card list.
 */
export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="glass flex flex-col gap-3 rounded-[var(--radius-md)] px-6 py-6"
          >
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post, i) => (
        <Link
          key={post.id}
          href={`/blog/${encodeURIComponent(post.id)}`}
          className={cn(
            "group glass flex flex-col gap-3.5 rounded-[var(--radius-md)] px-6 py-6",
            "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
            "animate-fade-in-up",
          )}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Title */}
          <h3 className="text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
            {post.title}
          </h3>

          {/* Summary */}
          {post.summary && (
            <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {post.summary}
            </p>
          )}

          {/* Footer */}
          <div className="mt-1 flex items-center justify-between text-sm text-[var(--text-tertiary)]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              Read more <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Tags */}
          {(() => {
            const tagList = parseTags(post.tags);
            return tagList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {tagList.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null;
          })()}
        </Link>
      ))}
    </div>
  );
}
