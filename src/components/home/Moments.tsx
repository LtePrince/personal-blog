"use client";

import { Activity } from "lucide-react";
import type { Moment } from "@/types/moment";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

interface MomentsProps {
  items: Moment[];
}

/**
 * Vertical timeline of one-line personal updates ("近期动态").
 *
 * Layout mirrors <LatestPosts/>: a section header (icon + title) above a
 * glass content card. Each entry's text is bilingual and follows the current
 * UI locale. Entries are newest-first; the most recent one is highlighted.
 */
export default function Moments({ items }: MomentsProps) {
  const { t, locale } = useLocale();

  return (
    <section className="flex flex-col gap-4">
      {/* Section header — matches LatestPosts */}
      <div className="flex items-center gap-2 text-[var(--text-primary)]">
        <Activity className="h-5 w-5 text-[var(--accent)]" />
        <h2 className="text-lg font-semibold">
          {t({ en: "Moments", "zh-CN": "近期动态" })}
        </h2>
      </div>

      {/* Timeline card */}
      <div className="glass rounded-[var(--radius-lg)] px-6 py-6">
        {items.length === 0 ? (
          <p className="text-sm text-[var(--text-tertiary)]">
            {t({ en: "No moments yet", "zh-CN": "暂无动态" })}
          </p>
        ) : (
          <ol className="relative ml-1.5 border-l border-dashed border-[var(--border-glass)]">
            {items.map((m, i) => {
              const active = i === 0;
              // Follow the current locale, falling back to the other language.
              const text =
                m.text[locale] || m.text.en || m.text["zh-CN"] || "";
              return (
                <li
                  key={`${m.date}-${i}`}
                  className="relative flex animate-fade-in-up items-start gap-3 py-2.5 pl-6 sm:gap-4"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Node on the line */}
                  <span
                    className={cn(
                      "absolute -left-[6.5px] top-3.5 h-3 w-3 rounded-full border-2 bg-[var(--bg-primary)] transition-colors",
                      active
                        ? "border-[var(--accent)] bg-[var(--accent)] shadow-[0_0_0_4px_var(--accent-subtle)]"
                        : "border-[var(--text-tertiary)]",
                    )}
                  />
                  {/* Date */}
                  <time
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      active
                        ? "text-[var(--accent)]"
                        : "text-[var(--text-secondary)]",
                    )}
                  >
                    {m.date}
                  </time>
                  {/* One-line text (locale-aware) */}
                  <p
                    className={cn(
                      "flex-1 text-sm leading-relaxed",
                      active
                        ? "font-medium text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)]",
                    )}
                  >
                    {text}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
