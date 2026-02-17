"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  /** CSS selector for the container that holds the rendered Markdown */
  contentSelector?: string;
}

/**
 * Sticky right-side table of contents.
 *
 * Reads headings directly from the rendered DOM (inside `contentSelector`)
 * so IDs always match. Uses scroll position to highlight the current section.
 */
export default function TableOfContents({
  contentSelector = ".prose",
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  /* ---- 1. Read headings from the DOM after mount ---- */
  useEffect(() => {
    const container = document.querySelector(contentSelector);
    if (!container) return;

    const els = container.querySelectorAll("h2, h3, h4");
    const items: TocHeading[] = [];
    els.forEach((el) => {
      if (el.id && el.textContent) {
        items.push({
          id: el.id,
          text: el.textContent.trim(),
          level: Number(el.tagName[1]),
        });
      }
    });
    setHeadings(items);

    // Set initial active to first heading
    if (items.length > 0) setActiveId(items[0].id);
  }, [contentSelector]);

  /* ---- 2. Scroll-based active heading tracking ---- */
  const handleScroll = useCallback(() => {
    if (headings.length === 0) return;

    // Find the last heading that has scrolled past the top offset (96px for navbar)
    const scrollY = window.scrollY + 120;
    let current = headings[0]?.id ?? "";

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el && el.offsetTop <= scrollY) {
        current = h.id;
      }
    }

    setActiveId(current);
  }, [headings]);

  useEffect(() => {
    if (headings.length === 0) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings, handleScroll]);

  /* ---- 3. Render ---- */
  if (headings.length < 2) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const indent = (level: number) => `${(level - 2) * 0.75}rem`;

  return (
    <nav className="hidden xl:block" aria-label="Table of contents">
      <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[var(--radius-md)] glass px-4 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
          目录
        </p>
        <ul className="flex flex-col gap-1 border-l border-[var(--border-glass)]">
          {headings.map((h) => (
            <li key={h.id} style={{ paddingLeft: indent(h.level) }}>
              <button
                onClick={() => handleClick(h.id)}
                className={cn(
                  "block w-full border-l-2 py-1 pl-3 text-left text-[13px] leading-snug transition-all duration-200",
                  activeId === h.id
                    ? "border-[var(--accent)] font-medium text-[var(--accent)]"
                    : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
                )}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
