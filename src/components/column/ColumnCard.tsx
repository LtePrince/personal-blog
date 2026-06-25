"use client";

import Link from "next/link";
import { Layers, Clock } from "lucide-react";
import type { ColumnItem } from "@/types/column";
import { fmtUnixDate } from "@/lib/columns";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

interface ColumnCardProps {
  col: ColumnItem;
  index?: number;
}

/**
 * A single column (专栏) card — title, chapter count, last-updated date, tags.
 * No cover image, per design.
 */
export default function ColumnCard({ col, index = 0 }: ColumnCardProps) {
  const { t } = useLocale();

  return (
    <Link
      href={`/column/${encodeURIComponent(col.slug)}`}
      className={cn(
        "group glass flex flex-col gap-3.5 rounded-[var(--radius-md)] px-6 py-6",
        "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        "animate-fade-in-up",
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
        {col.title}
      </h3>

      {col.summary && (
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {col.summary}
        </p>
      )}

      <div className="mt-1 flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          {t({
            en: `${col.chapterCount} chapters`,
            "zh-CN": `${col.chapterCount} 章`,
          })}
        </span>
        {col.updatedAt > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {fmtUnixDate(col.updatedAt)}
          </span>
        )}
      </div>

      {col.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {col.tags.map((tag) => (
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
