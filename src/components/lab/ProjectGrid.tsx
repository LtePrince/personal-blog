"use client";

import { ExternalLink } from "lucide-react";
import type { Project } from "@/types/lab";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

interface ProjectGridProps {
  projects: Project[];
}

/**
 * Grid of project showcase cards.
 */
export default function ProjectGrid({ projects }: ProjectGridProps) {
  const { t } = useLocale();

  return (
    <section>
      <h2 className="mb-5 text-base font-semibold text-[var(--text-primary)]">
        🚀 {t({ en: "Projects", "zh-CN": "项目展示" })}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <a
            key={project.id}
            href={project.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group glass flex flex-col gap-3 rounded-[var(--radius-md)] px-5 py-5",
              "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
              "animate-fade-in-up",
            )}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Title row */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                {project.icon ? `${project.icon} ` : ""}
                {project.title}
              </h3>
              {project.href && (
                <ExternalLink className="h-3.5 w-3.5 text-[var(--text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100" />
              )}
            </div>

            {/* Description */}
            <p className="line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {project.description}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-xs font-medium text-[var(--accent)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
