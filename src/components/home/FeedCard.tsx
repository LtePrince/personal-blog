"use client";

import Link from "next/link";
import { Calendar, ArrowRight, Layers } from "lucide-react";
import type { FeedItem } from "@/types/feed";
import { cn } from "@/lib/utils";

interface FeedCardProps {
  item: FeedItem;
  /** Stagger index for enter animation */
  index?: number;
}

/**
 * A single entry in the latest feed — a blog post or a column chapter.
 *
 * Design: minimal glassmorphism card with title, date, summary and subtle
 * hover elevation. Animations stagger via `animationDelay`.
 */
export default function FeedCard({ item, index = 0 }: FeedCardProps) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group glass flex flex-col gap-3.5 rounded-[var(--radius-md)] px-6 py-6",
        "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        "animate-fade-in-up",
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Which column a chapter came from — a chapter title alone rarely says. */}
      {item.columnTitle && (
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
          <Layers className="h-3 w-3" />
          {item.columnTitle}
        </span>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
        {item.title}
      </h3>

      {/* Summary */}
      {item.summary && (
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {item.summary}
        </p>
      )}

      {/* Meta row */}
      <div className="mt-1 flex items-center justify-between text-sm text-[var(--text-tertiary)]">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {item.date}
        </span>
        <span className="inline-flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          Read more
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
