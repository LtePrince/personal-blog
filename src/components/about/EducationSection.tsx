"use client";

import { GraduationCap } from "lucide-react";
import type { Education } from "@/types/about";
import { useLocale } from "@/contexts/LocaleContext";

interface EducationSectionProps {
  items: Education[];
}

export default function EducationSection({ items }: EducationSectionProps) {
  const { t } = useLocale();

  return (
    <section className="glass rounded-[var(--radius-lg)] px-6 py-6">
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
        <GraduationCap className="h-5 w-5 text-[var(--accent)]" />
        {t({ en: "Education", "zh-CN": "教育经历" })}
      </h2>

      <div className="flex flex-col gap-4">
        {items.map((edu, i) => (
          <div
            key={i}
            className="relative border-l-2 border-[var(--accent)] pl-4"
          >
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {edu.school}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {edu.degree} · {edu.major}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">{edu.period}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
