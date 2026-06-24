"use client";

import { useEffect, useState } from "react";
import { FileText, Tags, Clock, CalendarCheck, BarChart3 } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

interface Stats {
  postCount: number;
  tagCount: number;
}

/** Site launch date – used to compute uptime. */
const SITE_LAUNCH_DATE = new Date("2026-02-01");

function daysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  unit?: string;
}

/**
 * Site statistics card – row-based layout with icon / label / value.
 */
export default function SiteStats() {
  const { t } = useLocale();
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastPostDate, setLastPostDate] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((body) => {
        if (body.success && body.data) {
          setStats(body.data);
        }
      })
      .catch(console.error);

    // Most recent post date — backend returns recent posts ordered by date DESC.
    fetch("/api/blog/recent?limit=1")
      .then((res) => res.json())
      .then((body) => {
        if (body.success && body.data?.length > 0) {
          setLastPostDate(body.data[0].date);
        }
      })
      .catch(console.error);
  }, []);

  const lastUpdatedDays = lastPostDate
    ? daysSince(new Date(lastPostDate))
    : null;

  const items: StatItem[] = [
    {
      icon: FileText,
      label: t({ en: "Posts", "zh-CN": "文章" }),
      value: stats?.postCount ?? "–",
    },
    {
      icon: Tags,
      label: t({ en: "Tags", "zh-CN": "标签" }),
      value: stats?.tagCount ?? "–",
    },
    {
      icon: Clock,
      label: t({ en: "Running", "zh-CN": "运行" }),
      value: daysSince(SITE_LAUNCH_DATE),
      unit: t({ en: " days", "zh-CN": " 天" }),
    },
    {
      icon: CalendarCheck,
      label: t({ en: "Last updated", "zh-CN": "最近更新" }),
      value: lastUpdatedDays ?? "–",
      unit: lastUpdatedDays !== null ? t({ en: " days ago", "zh-CN": " 天前" }) : undefined,
    },
  ];

  return (
    <aside className="glass rounded-[var(--radius-lg)] px-5 py-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <BarChart3 className="h-4 w-4 text-[var(--accent)]" />
        {t({ en: "Site Stats", "zh-CN": "站点统计" })}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3">
            {/* Icon */}
            <item.icon className="h-4 w-4 shrink-0 text-[var(--text-tertiary)]" />
            {/* Label */}
            <span className="text-sm text-[var(--text-secondary)]">
              {item.label}
            </span>
            {/* Value – pushed to the right */}
            <span className="ml-auto text-sm font-bold text-[var(--text-primary)]">
              {item.value}
              {item.unit && (
                <span className="text-xs font-normal text-[var(--text-tertiary)]">
                  {item.unit}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
