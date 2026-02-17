"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Simple pagination control with previous / page numbers / next.
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  /** Build an array of page numbers to display (with ellipsis). */
  function getPageNumbers(): (number | "ellipsis")[] {
    const pages: (number | "ellipsis")[] = [];
    const delta = 1; // pages around current

    // Always show first page
    pages.push(1);

    const rangeStart = Math.max(2, page - delta);
    const rangeEnd = Math.min(totalPages - 1, page + delta);

    if (rangeStart > 2) pages.push("ellipsis");

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) pages.push("ellipsis");

    // Always show last page (if > 1)
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }

  const pageNums = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg",
          "text-[var(--text-secondary)] transition-colors",
          page <= 1
            ? "cursor-not-allowed opacity-40"
            : "hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]",
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {pageNums.map((item, idx) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex h-9 w-9 items-center justify-center text-sm text-[var(--text-tertiary)]"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              item === page
                ? "bg-[var(--accent)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]",
            )}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg",
          "text-[var(--text-secondary)] transition-colors",
          page >= totalPages
            ? "cursor-not-allowed opacity-40"
            : "hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]",
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
