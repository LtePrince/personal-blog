"use client";

import { Code } from "lucide-react";
import type { TechCategory } from "@/types/about";
import { useLocale } from "@/contexts/LocaleContext";

interface TechStackProps {
  categories: TechCategory[];
}

export default function TechStack({ categories }: TechStackProps) {
  const { t } = useLocale();

  return (
    <section className="glass rounded-[var(--radius-lg)] px-6 py-6">
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
        <Code className="h-5 w-5 text-[var(--accent)]" />
        {t({ en: "Tech Stack", "zh-CN": "技术栈" })}
      </h2>

      <div className="flex flex-col gap-5">
        {categories.map((cat) => (
          <div key={cat.name}>
            <h3 className="mb-2 text-sm font-medium text-[var(--text-secondary)]">
              {cat.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[var(--accent-subtle)] px-3 py-1 text-xs font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
