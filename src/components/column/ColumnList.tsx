"use client";

import type { ColumnItem } from "@/types/column";
import ColumnCard from "./ColumnCard";
import { Skeleton } from "@/components/common/Skeleton";
import { useLocale } from "@/contexts/LocaleContext";

interface ColumnListProps {
  columns: ColumnItem[];
  loading?: boolean;
}

/** Vertical list of column cards. */
export default function ColumnList({ columns, loading }: ColumnListProps) {
  const { t } = useLocale();

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="glass flex flex-col gap-3 rounded-[var(--radius-md)] px-6 py-6"
          >
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (columns.length === 0) {
    return (
      <div className="glass rounded-[var(--radius-md)] px-6 py-10 text-center text-sm text-[var(--text-tertiary)]">
        {t({ en: "No columns yet", "zh-CN": "暂无专栏" })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {columns.map((col, i) => (
        <ColumnCard key={col.id} col={col} index={i} />
      ))}
    </div>
  );
}
