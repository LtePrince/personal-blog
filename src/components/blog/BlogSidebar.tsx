"use client";

import { Skeleton } from "@/components/common/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Thin sidebar shown next to the blog list.
 * Currently renders placeholder sections; extend as needed.
 */
export default function BlogSidebar() {
  const { t } = useLocale();

  return (
    <aside className="flex flex-col gap-5">
      {/* Recent posts mini-list */}
      <div className="glass rounded-[var(--radius-lg)] px-5 py-5">
        <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
          📌 {t({ en: "Recent Posts", "zh-CN": "最近文章" })}
        </h3>
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-4 w-full" />
            </li>
          ))}
        </ul>
      </div>

      {/* Tags cloud */}
      <div className="glass rounded-[var(--radius-lg)] px-5 py-5">
        <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
          🏷️ {t({ en: "Tags", "zh-CN": "标签" })}
        </h3>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-14 rounded-full" />
          ))}
        </div>
      </div>
    </aside>
  );
}
